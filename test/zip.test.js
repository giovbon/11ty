import { test } from "node:test"
import assert from "node:assert/strict"

import {
  MAX_FILE_SIZE_BYTES,
  assinaturaEhZip,
  validarArquivoZip,
} from "../src/client/shared/zip.js"

const ZIP_MINIMO = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00])
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]) // %PDF-

const arquivo = (nome, bytes) => new File([bytes], nome)

test("reconhece as três assinaturas de ZIP", () => {
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x03, 0x04]), true)
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x05, 0x06]), true)
  assert.equal(assinaturaEhZip([0x50, 0x4b, 0x07, 0x08]), true)
  assert.equal(assinaturaEhZip([0x25, 0x50, 0x44, 0x46]), false)
  assert.equal(assinaturaEhZip([]), false)
})

test("aceita ZIP de verdade", async () => {
  assert.equal(await validarArquivoZip(arquivo("real.zip", ZIP_MINIMO)), null)
})

test("recusa extensão diferente de .zip", async () => {
  const erro = await validarArquivoZip(arquivo("trabalho.pdf", PDF))
  assert.match(erro, /Apenas arquivos \.zip/)
})

test("recusa PDF renomeado para .zip (assinatura manda)", async () => {
  const erro = await validarArquivoZip(arquivo("falso.zip", PDF))
  assert.match(erro, /não é um ZIP válido/)
})

test("recusa arquivo vazio", async () => {
  const erro = await validarArquivoZip(arquivo("vazio.zip", new Uint8Array([])))
  assert.match(erro, /vazio/)
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
  const naMedida = {
    name: "no-limite.zip",
    size: MAX_FILE_SIZE_BYTES,
    slice: () => ({ arrayBuffer: async () => ZIP_MINIMO.buffer }),
  }
  assert.equal(await validarArquivoZip(naMedida), null)
})
