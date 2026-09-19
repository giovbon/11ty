import fs from "node:fs"
import path from "node:path"
import { ROOT, asList } from "../../_lib/content.js"
import { withPrefix } from "../../_lib/urls.js"

/**
 * Componente `typst` — exercícios escritos em Typst, compilados no navegador
 * (WASM vendorizado) e entregues como PDF.
 *
 * Frontmatter:
 *   typst:
 *     - path: "typs/AST/AST06.typ"      # caminho lógico (sobre content/static)
 *       name: "Exercício AST06"          # rótulo do botão (opcional)
 *   typst: "typs/AST/AST06.typ"          # forma curta: um único exercício
 *
 * O arquivo real mora em `content/static/typs/...` e é publicado em
 * `/static/typs/...` — a mesma convenção do asciinema.
 */

const STATIC_DIR = path.join(ROOT, "content", "static")
const LIB_DIR = path.join(ROOT, "src", "assets", "static", "lib", "typst")
const BUNDLE = "/static/lib/typst/snippet.bundle.mjs"
const WASM = "/static/lib/typst/typst_ts_web_compiler_bg.wasm"

function isRemote(value) {
  return /^https?:\/\//i.test(value)
}

function label(entry, basename) {
  if (entry.name) return entry.name
  return `PDF: ${basename.replace(/\.typ$/i, "")}`
}

function normalize(entry) {
  const raw = typeof entry === "string" ? { path: entry } : entry
  if (!raw || typeof raw !== "object" || typeof raw.path !== "string" || !raw.path.trim()) {
    return null
  }

  const source = raw.path.trim()
  const basename = source.split("/").pop() ?? source
  return {
    path: source,
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "",
    label: label(raw, basename),
    url: isRemote(source)
      ? source
      : withPrefix(`/static/${source.replace(/^\/?(static\/)?/, "")}`),
    exists: isRemote(source) || fs.existsSync(path.join(STATIC_DIR, source.replace(/^\/?static\//, ""))),
  }
}

/** Dados do componente (ou null quando o frontmatter não declara `typst`). */
export function buildTypst(frontmatter) {
  const entries = asList(frontmatter?.typst).map(normalize).filter(Boolean)
  if (entries.length === 0) return null

  // Asset ausente = botão que falha só no clique. Melhor gritar no build.
  for (const entry of entries) {
    if (!entry.exists) {
      console.error(
        `[typst] exercício não encontrado: content/static/${entry.path} (declarado no frontmatter)`,
      )
    }
  }

  for (const file of [BUNDLE, WASM]) {
    const local = path.join(ROOT, "src", "assets", "static", "lib", "typst", path.basename(file))
    if (!fs.existsSync(local)) {
      console.error(`[typst] lib ausente: src/assets/static/lib/typst/${path.basename(file)}`)
    }
  }
  if (!fs.existsSync(LIB_DIR)) {
    console.error("[typst] pasta da lib não encontrada: src/assets/static/lib/typst")
  }

  return {
    entries,
    bundle: withPrefix(BUNDLE),
    wasm: withPrefix(WASM),
    comErro: entries.some((entry) => !entry.exists),
  }
}

/** HTML do componente (string vazia quando não há exercícios). */
export function renderTypst(frontmatter) {
  const data = buildTypst(frontmatter)
  if (!data) return ""

  const buttons = data.entries
    .map(
      (entry) => `      <button
        type="button"
        class="typst-btn"
        data-typ="${entry.url}"
        data-name="${entry.label}"
        title="Gerar PDF: ${entry.label}"
      ><span class="typst-btn__icon" aria-hidden="true">📄</span><span class="typst-btn__label">${entry.label}</span></button>`,
    )
    .join("\n")

  return `<div class="typst" data-bundle="${data.bundle}" data-wasm="${data.wasm}">
${buttons}
    </div>`
}
