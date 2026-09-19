import { getEntries } from "../_lib/content.js"

/**
 * Coleção de todas as páginas publicáveis.
 * (O nome do arquivo vira a chave de dados — `pages`, para não colidir com o
 * `content` reservado do Eleventy.)
 */
export default function () {
  return getEntries()
}
