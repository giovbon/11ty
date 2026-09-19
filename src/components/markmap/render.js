import fs from "node:fs"
import path from "node:path"
import { ROOT } from "../../_lib/content.js"

/**
 * Componente `markmap` — mapa mental a partir de um markdown.
 *
 * Frontmatter:
 *   markmap: "mindmaps/ctt-roadmap.md"     # local, lido em tempo de build
 *   markmap: "https://exemplo.com/mapa.md" # remoto, buscado no navegador
 *
 * O markdown é embutido no HTML (não é servido como arquivo), então `mindmaps/`
 * pode ficar fora de `content/`. A renderização usa as libs vendorizadas em
 * `src/assets/static/lib/markmap/`, carregadas sob demanda pelo client.
 */

/** Frontmatter YAML no topo do mapa (defensivo: markmap o renderizaria como texto). */
const FRONTMATTER = /^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/

const ehRemoto = (valor) => /^https?:\/\//i.test(valor)

/** Dados do mapa mental (ou null quando o frontmatter não declara `markmap`). */
export function buildMarkmap(frontmatter) {
  const origem = frontmatter?.markmap
  if (typeof origem !== "string" || origem.trim() === "") return null

  const src = origem.trim()
  const remoto = ehRemoto(src)
  let markdown = ""

  if (!remoto) {
    const relativo = src.replace(/^\/+/, "")
    const absoluto = path.join(ROOT, relativo)
    if (fs.existsSync(absoluto)) {
      markdown = fs
        .readFileSync(absoluto, "utf8")
        .replace(FRONTMATTER, "")
        // um `</script>` dentro do markdown encerraria o <script type="text/markdown">
        .replace(/<\/script>/gi, "<\\/script>")
    } else {
      console.error(`[markmap] mapa mental não encontrado: ${relativo} (declarado no frontmatter)`)
    }
  }

  if (!remoto && markdown.trim() === "") {
    console.error(`[markmap] mapa mental vazio: ${src}`)
  }

  return { src, remoto, markdown, vazio: !remoto && markdown.trim() === "" }
}

/** HTML do componente (string vazia quando não há mapa mental). */
export function renderMarkmap(frontmatter) {
  const dados = buildMarkmap(frontmatter)
  if (!dados) return ""

  const conteudo = dados.vazio
    ? `<div class="markmap-erro">Não foi possível carregar o mapa mental: ${dados.src}</div>`
    : dados.remoto
      ? `<div class="markmap-carregando">Carregando mapa mental...</div>`
      : `<script type="text/markdown">${dados.markdown}</script>`

  return `<div class="markmap" data-src="${dados.remoto ? dados.src : ""}">${conteudo}</div>`
}
