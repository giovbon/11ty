/**
 * Validação do anexo do formulário de entrega.
 *
 * Portado de `quartz/util/submissionFile.ts` (projeto antigo), sem mudança de
 * regra: a checagem de assinatura (PK) existe para impedir o truque de renomear
 * um `.pdf`/`.py` para `.zip` — o atributo `accept` e a extensão, sozinhos, não
 * garantem o formato do conteúdo.
 *
 * Camadas, da mais barata para a mais cara:
 * 1. tamanho (piso anti-upload-truncado + teto de 20 MB);
 * 2. assinatura `PK` nos 4 primeiros bytes;
 * 3. índice do ZIP (EOCD): sem nenhuma entrada, ou só entradas de 0 byte.
 */

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
export const EXTENSAO_PERMITIDA = /\.zip$/i // apenas .zip (.rar/.7z recusados)

/**
 * Piso de tamanho: abaixo disso o arquivo é recusado sem olhar o conteúdo.
 *
 * Os 100 bytes são derivados da estrutura do formato (medidos com o `zipfile`
 * do Python, não chutados): um ZIP **sem nenhuma entrada** tem exatamente 22
 * bytes (só o EOCD) e o menor ZIP possível com 1 entrada gasta
 * `98 + 2×tamanho do nome` — 110 bytes para `a.txt`, 114 para `main.py`.
 * Ou seja: não existe ZIP com 1 arquivo abaixo de ~100 bytes, e o que aparece
 * nessa faixa é upload truncado (que tem a assinatura `PK` e passaria pela
 * checagem 2, mas não tem EOCD). Do outro lado, o menor ZIP com conteúdo real
 * medido (1 arquivo de 13 bytes) tem 126 bytes.
 */
export const MIN_FILE_SIZE_BYTES = 100

/** Assinaturas (magic bytes) de um ZIP de verdade. */
const ZIP_ASSINATURAS = [
  [0x50, 0x4b, 0x03, 0x04], // normal
  [0x50, 0x4b, 0x05, 0x06], // vazio
  [0x50, 0x4b, 0x07, 0x08], // segmentado
]

/** Assinatura do EOCD ("fim do diretório central", os últimos bytes do arquivo). */
const ASSINATURA_EOCD = [0x50, 0x4b, 0x05, 0x06]
/** Tamanho do EOCD sem comentário do arquivo. */
const TAMANHO_EOCD = 22
/** O ZIP pode ter comentário (até 64 KB) depois do EOCD — procurar numa janela. */
const JANELA_EOCD = 1024

export function assinaturaEhZip(bytes) {
  return ZIP_ASSINATURAS.some((assinatura) => assinatura.every((byte, i) => bytes[i] === byte))
}

export async function lerAssinatura(file) {
  const buffer = await file.slice(0, 4).arrayBuffer()
  return Array.from(new Uint8Array(buffer))
}

const u16 = (bytes, i) => bytes[i] | (bytes[i + 1] << 8)
const u32 = (bytes, i) =>
  (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0

/**
 * Diz se o ZIP tem **algum** arquivo com conteúdo.
 *
 * Lê o EOCD (que lista as entradas) em vez de confiar no byte size: o tamanho de
 * um ZIP com 1 arquivo vazio varia com o nome do arquivo (110 bytes para
 * `a.txt`, 134 para `atividade_final.py`), então nenhum corte por tamanho separa
 * "sem conteúdo" de "com conteúdo". Continua sendo leitura local, sem lib.
 *
 * `null` = não deu para afirmar (formato inesperado) → quem chama **não** recusa.
 */
export async function zipTemConteudo(file) {
  if (file.size < TAMANHO_EOCD) return null

  const janela = new Uint8Array(
    await file.slice(Math.max(0, file.size - JANELA_EOCD)).arrayBuffer()
  )
  const base = file.size - janela.length

  let eocd = -1
  for (let i = janela.length - TAMANHO_EOCD; i >= 0; i--) {
    if (ASSINATURA_EOCD.every((byte, k) => janela[i + k] === byte)) {
      eocd = i
      break
    }
  }
  if (eocd < 0) return null

  const entradas = u16(janela, eocd + 10)
  if (entradas === 0) return false // só o EOCD: o ZIP não tem nenhum arquivo

  let offset = u32(janela, eocd + 16)
  const limite = base + eocd // o diretório central termina onde o EOCD começa

  for (let lidas = 0; lidas < entradas; lidas++) {
    if (offset + 46 > limite) return null // fora do diretório central → não afirma nada

    const cabecalho = new Uint8Array(await file.slice(offset, offset + 46).arrayBuffer())
    if (cabecalho[0] !== 0x50 || cabecalho[1] !== 0x4b) return null
    if (cabecalho[2] !== 0x01 || cabecalho[3] !== 0x02) return null // não é cabeçalho central

    if (u32(cabecalho, 24) > 0) return true // 1ª entrada com conteúdo já basta

    // 46 + nome + campo extra + comentário da própria entrada
    offset += 46 + u16(cabecalho, 28) + u16(cabecalho, 30) + u16(cabecalho, 32)
  }

  return false // tem entradas, mas todas de 0 byte (pastas e/ou arquivos vazios)
}

/** Mensagem de erro pronta para exibição, ou `null` quando o arquivo é aceito. */
export async function validarArquivoZip(file) {
  if (!EXTENSAO_PERMITIDA.test(file.name)) {
    return "Apenas arquivos .zip são aceitos (PDF, .py, .rar e .7z são recusados)."
  }

  if (file.size < MIN_FILE_SIZE_BYTES) {
    return `O arquivo está praticamente vazio (menos de ${MIN_FILE_SIZE_BYTES} bytes): o upload falhou ou o .zip saiu sem conteúdo. Gere o .zip novamente.`
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Arquivo muito grande (máx. 20MB)."
  }

  const assinatura = await lerAssinatura(file)
  if (!assinaturaEhZip(assinatura)) {
    return "O arquivo não é um ZIP válido. Renomear para .zip (ex.: um PDF) não o converte em ZIP."
  }

  if ((await zipTemConteudo(file)) === false) {
    return "Este .zip não tem nenhum arquivo com conteúdo (só pastas e/ou arquivos de 0 byte). Comprima a pasta do trabalho, não uma pasta vazia."
  }

  return null
}
