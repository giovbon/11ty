import { test } from "node:test"
import assert from "node:assert/strict"

import {
  MAX_FILE_SIZE_BYTES,
  MIN_FILE_SIZE_BYTES,
  assinaturaEhZip,
  validarArquivoZip,
  zipTemConteudo,
} from "../src/client/shared/zip.js"

/* ── construtores de arquivo ── */

const arquivo = (nome, bytes) => new File([bytes], nome)

/* ZIP sintético com layout de verdade (método "stored", CRC zerado): os tamanhos
   são reais e o índice é legível, mas os dados não são comprimidos — a validação
   nunca abre o conteúdo, só o cabeçalho e o diretório central. */
const u16 = (valor) => [valor & 0xff, (valor >> 8) & 0xff]
const u32 = (valor) => [valor & 0xff, (valor >> 8) & 0xff, (valor >> 16) & 0xff, (valor >>> 24) & 0xff]
const texto = (string) => [...new TextEncoder().encode(string)]

function zipBytes(entradas = []) {
  const bytes = []
  const centrais = []

  for (const [nome, conteudo] of entradas) {
    const nomeBytes = texto(nome)
    const dados = texto(conteudo)
    const offset = bytes.length

    bytes.push(
      ...u32(0x04034b50), // assinatura local
      ...u16(20), // versão necessária
      ...u16(0), // flags
      ...u16(0), // método (stored)
      ...u16(0), // hora
      ...u16(0), // data
      ...u32(0), // crc32
      ...u32(dados.length), // tamanho comprimido
      ...u32(dados.length), // tamanho descomprimido
      ...u16(nomeBytes.length),
      ...u16(0), // extra
      ...nomeBytes,
      ...dados
    )

    centrais.push([
      ...u32(0x02014b50), // assinatura do diretório central
      ...u16(20), // versão que criou
      ...u16(20), // versão necessária
      ...u16(0), // flags
      ...u16(0), // método
      ...u16(0), // hora
      ...u16(0), // data
      ...u32(0), // crc32
      ...u32(dados.length), // tamanho comprimido
      ...u32(dados.length), // tamanho descomprimido
      ...u16(nomeBytes.length),
      ...u16(0), // extra
      ...u16(0), // comentário
      ...u16(0), // disco
      ...u16(0), // atributos internos
      ...u32(0), // atributos externos
      ...u32(offset), // offset do cabeçalho local
      ...nomeBytes,
    ])
  }

  const inicioCd = bytes.length
  for (const central of centrais) bytes.push(...central)

  bytes.push(
    ...u32(0x06054b50), // assinatura do EOCD
    ...u16(0), // disco
    ...u16(0), // disco do diretório central
    ...u16(entradas.length), // entradas neste disco
    ...u16(entradas.length), // total de entradas
    ...u32(bytes.length - inicioCd), // tamanho do diretório central
    ...u32(inicioCd), // offset do diretório central
    ...u16(0) // comentário
  )

  return new Uint8Array(bytes)
}

/** Buffer do tamanho pedido, começando com os bytes dados (para "outros formatos"). */
function comPrefixo(prefixo, total) {
  const bytes = new Uint8Array(total)
  bytes.set(prefixo)
  return bytes
}

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]) // %PDF-

/* ── assinatura ── */

test("reconhece as três assinaturas de ZIP", () => {
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x03, 0x04]), true)
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x05, 0x06]), true)
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x07, 0x08]), true)
  assert.equal(assinaturaEhZip([0x25, 0x50, 0x44, 0x46]), false)
  assert.equal(assinaturaEhZip([]), false)
})

test("aceita ZIP de verdade", async () => {
  const zip = zipBytes([["main.py", 'print("oi")\n']])
  assert.ok(zip.length > MIN_FILE_SIZE_BYTES) // o caso é válido, não minúsculo por acaso
  assert.equal(await validarArquivoZip(arquivo("real.zip", zip)), null)
})

test("recusa extensão diferente de .zip", async () => {
  const erro = await validarArquivoZip(arquivo("trabalho.pdf", comPrefixo(PDF, 1024)))
  assert.match(erro, /Apenas arquivos \.zip/)
})

test("recusa PDF renomeado para .zip (assinatura manda)", async () => {
  const erro = await validarArquivoZip(arquivo("falso.zip", comPrefixo(PDF, 1024)))
  assert.match(erro, /não é um ZIP válido/)
})

/* ── tamanho ── */

test("recusa arquivo vazio", async () => {
  const erro = await validarArquivoZip(arquivo("vazio.zip", new Uint8Array([])))
  assert.match(erro, /vazio/)
})

test("recusa upload truncado mesmo com a assinatura PK intacta", async () => {
  // ZIP real de 110 bytes cortado no meio: tem PK\x03\x04, não tem EOCD.
  const truncado = zipBytes([["a.txt", ""]]).slice(0, MIN_FILE_SIZE_BYTES - 1)
  assert.equal(assinaturaEhZip([...truncado.slice(0, 4)]), true)
  const erro = await validarArquivoZip(arquivo("cortado.zip", truncado))
  assert.match(erro, /praticamente vazio/)
})

test("no piso exato o tamanho não é o motivo da recusa", async () => {
  // 100 bytes de zeros: passa pelo tamanho e só cai na assinatura.
  const erro = await validarArquivoZip(arquivo("limite.zip", new Uint8Array(MIN_FILE_SIZE_BYTES)))
  assert.match(erro, /não é um ZIP válido/)
})

test("recusa arquivo acima de 20MB antes de olhar o conteúdo", async () => {
  const grande = {
    name: "grande.zip",
    size: MAX_FILE_SIZE_BYTES + 1,
    slice: () => ({ arrayBuffer: async () => new ArrayBuffer(4) }),
  }
  const erro = await validarArquivoZip(grande)
  assert.match(erro, /muito grande/)
})

test("o limite é exatamente 20MB", async () => {
  const zip = zipBytes([["main.py", 'print("oi")\n']])
  const naMedida = {
    name: "no-limite.zip",
    size: MAX_FILE_SIZE_BYTES,
    slice: (inicio) => ({ arrayBuffer: async () => zip.slice(inicio, inicio + 46).buffer }),
  }
  assert.equal(await validarArquivoZip(naMedida), null)
})

/* ── conteúdo (índice do ZIP) ── */

test("ZIP sem nenhuma entrada é 'sem conteúdo'", async () => {
  const vazio = zipBytes([])
  assert.equal(vazio.length, 22) // só o EOCD — é por isso que o piso de tamanho existe
  assert.equal(await zipTemConteudo(arquivo("sem-entradas.zip", vazio)), false)
})

test("recusa ZIP que só tem pastas e arquivos de 0 byte", async () => {
  const soCasca = zipBytes([
    ["trabalho/", ""],
    ["trabalho/atividade.py", ""],
  ])
  assert.ok(soCasca.length >= MIN_FILE_SIZE_BYTES) // o piso de tamanho NÃO pega este caso
  const erro = await validarArquivoZip(arquivo("casca.zip", soCasca))
  assert.match(erro, /não tem nenhum arquivo com conteúdo/)
})

test("aceita ZIP com uma pasta e um arquivo com conteúdo", async () => {
  const zip = zipBytes([
    ["trabalho/", ""],
    ["trabalho/main.py", "x = 1\n"],
  ])
  assert.equal(await zipTemConteudo(arquivo("ok.zip", zip)), true)
  assert.equal(await validarArquivoZip(arquivo("ok.zip", zip)), null)
})

test("sem EOCD legível não afirma nada (fail-open)", async () => {
  // 1 KB com assinatura local e nada mais: o índice não é legível, então não recusa.
  const esquisito = comPrefixo([0x50, 0x4b, 0x03, 0x04], 1024)
  assert.equal(await zipTemConteudo(arquivo("esquisito.zip", esquisito)), null)
  assert.equal(await validarArquivoZip(arquivo("esquisito.zip", esquisito)), null)
})
