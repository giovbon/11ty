/**
 * Validação do anexo do formulário de entrega.
 *
 * Portado de `quartz/util/submissionFile.ts` (projeto antigo), sem mudança de
 * regra: a checagem de assinatura (PK) existe para impedir o truque de renomear
 * um `.pdf`/`.py` para `.zip` — o atributo `accept` e a extensão, sozinhos, não
 * garantem o formato do conteúdo.
 */

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
export const EXTENSAO_PERMITIDA = /\.zip$/i // apenas .zip (.rar/.7z recusados)

/** Assinaturas (magic bytes) de um ZIP de verdade. */
const ZIP_ASSINATURAS = [
  [0x50, 0x4b, 0x03, 0x04], // normal
  [0x50, 0x4b, 0x05, 0x06], // vazio
  [0x50, 0x4b, 0x07, 0x08], // segmentado
]

export function assinaturaEhZip(bytes) {
  return ZIP_ASSINATURAS.some((assinatura) => assinatura.every((byte, i) => bytes[i] === byte))
}

export async function lerAssinatura(file) {
  const buffer = await file.slice(0, 4).arrayBuffer()
  return Array.from(new Uint8Array(buffer))
}

/** Mensagem de erro pronta para exibição, ou `null` quando o arquivo é aceito. */
export async function validarArquivoZip(file) {
  if (!EXTENSAO_PERMITIDA.test(file.name)) {
    return "Apenas arquivos .zip são aceitos (PDF, .py, .rar e .7z são recusados)."
  }

  if (file.size === 0) {
    return "O arquivo está vazio. Gere o .zip novamente."
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Arquivo muito grande (máx. 20MB)."
  }

  const assinatura = await lerAssinatura(file)
  if (!assinaturaEhZip(assinatura)) {
    return "O arquivo não é um ZIP válido. Renomear para .zip (ex.: um PDF) não o converte em ZIP."
  }

  return null
}
