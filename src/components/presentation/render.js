import fs from "node:fs"
import path from "node:path"
import { ROOT, asList } from "../../_lib/content.js"

/**
 * Componente `presentation` — deck(s) reveal.js embutidos na página da aula.
 *
 * Frontmatter:
 *   presentation: "slides/ADP/00ADP-SL-apresentacao.md"        # um deck
 *   presentation:                                              # vários decks
 *     - "slides/CTT/Git/01-areas-git.md"
 *     - "slides/CTT/Git/02-repos-remotos.md"
 *
 * O arquivo do deck é lido em tempo de build e injetado no HTML (não é servido),
 * por isso `slides/` pode ficar fora de `content/`.
 */

/** Frontmatter YAML no topo do arquivo de slides: precisa sair antes de injetar. */
const FRONTMATTER = /^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/

const SLIDE_EXT = /\.(md|markdown)$/i

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function readDeck(src) {
  const relative = src.replace(/^\//, "")
  const absolute = path.join(ROOT, relative)
  if (!fs.existsSync(absolute)) {
    console.error(`[presentation] deck não encontrado: ${relative}`)
    return null
  }
  // Sem o frontmatter: os `---` dele virariam separadores e criariam slides vazios.
  return fs.readFileSync(absolute, "utf8").replace(FRONTMATTER, "")
}

/** Dados dos decks declarados no frontmatter (ou null se não houver). */
export function buildDecks(frontmatter) {
  const sources = asList(frontmatter?.presentation).filter(
    (value) => typeof value === "string" && SLIDE_EXT.test(value),
  )
  if (sources.length === 0) return null

  const decks = sources.map((src, index) => {
    const markdown = readDeck(src) ?? ""
    return {
      src,
      id: `deck-${index + 1}-${slugify(path.basename(src).replace(SLIDE_EXT, ""))}`,
      // Um `</script>` dentro do slide encerraria o <script type="text/template">
      markdown: markdown.replace(/<\/script>/gi, "<\\/script>"),
      vazio: markdown.trim().length === 0,
    }
  })

  return { decks, multiplos: decks.length > 1 }
}

function deckHtml(deck) {
  return `<div class="deck" data-deck-src="${deck.src}">
        <div class="reveal" id="${deck.id}">
          <div class="slides">
            <section data-markdown data-separator="^---" data-separator-vertical="^--">
              <script type="text/template">${deck.markdown}</script>
            </section>
          </div>
        </div>
      </div>`
}

/** HTML completo do componente (string vazia quando não há deck). */
export function renderPresentation(frontmatter) {
  const data = buildDecks(frontmatter)
  if (!data) return ""
  return `<div class="decks" data-decks="${data.decks.length}">${data.decks
    .map(deckHtml)
    .join("")}</div>`
}
