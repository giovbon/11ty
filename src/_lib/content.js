import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import MarkdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"

/**
 * Leitura do conteúdo — SOMENTE LEITURA.
 *
 * Tudo vive DENTRO deste projeto (`site-11ty/`): o projeto novo não lê nada de
 * fora dele (nem o site Quartz, nem pastas na raiz do repositório).
 *
 *   content/<DISCIPLINA>/.../arquivo.md   ->    /<DISCIPLINA>/.../arquivo/
 *   content/index.md                      ->    /
 *   content/static/**                     ->    /static/**  (copiado no build)
 *
 * Fontes lidas em tempo de build (injetadas no HTML, não servidas):
 *   slides/**    (decks reveal)
 *   mindmaps/**  (mapas mentais)
 *   codes/**     (árvores de código do explorer)
 */

/** Raiz deste projeto (`site-11ty/`). */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
export const CONTENT_DIR = path.join(ROOT, "content")
export const SLIDES_DIR = path.join(ROOT, "slides")
export const MINDMAPS_DIR = path.join(ROOT, "mindmaps")
export const CODES_DIR = path.join(ROOT, "codes")

/** Espelha o `.gitignore` da raiz: nada aqui é publicado. */
const IGNORED_DIRS = new Set(["oculto", "node_modules", ".git"])
const IGNORED_FILES = new Set(["demonstracao.md"])

const md = new MarkdownIt({ html: true, linkify: false })
  .use(markdownItAnchor, { slugify: slugifyHeading, permalink: false, level: [2, 3, 4] })

function slugifyHeading(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

function walkMarkdown(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue
      walkMarkdown(full, base, out)
    } else if (entry.name.toLowerCase().endsWith(".md")) {
      if (IGNORED_FILES.has(entry.name)) continue
      out.push(path.relative(base, full).split(path.sep).join("/"))
    }
  }
  return out
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function tocFromHtml(html) {
  const items = []
  const re = /<h([234])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g
  let match
  while ((match = re.exec(html)) !== null) {
    items.push({ level: Number(match[1]), id: match[2], text: stripTags(match[3]) })
  }
  return items
}

function readingMinutes(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Normaliza a forma das chaves de frontmatter que aceitam string OU lista.
 * (Ver contrato em ../PROPOSTA-ELEVENTY.md, seção 5.)
 */
export function asList(value) {
  if (value == null) return []
  const list = Array.isArray(value) ? value : [value]
  return list
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter((item) => (typeof item === "string" ? item.length > 0 : item != null))
}

function prettifySegment(segment) {
  return segment.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
}

function toPage(relativePath) {
  const absolutePath = path.join(CONTENT_DIR, relativePath)
  const raw = fs.readFileSync(absolutePath, "utf8")
  const stat = fs.statSync(absolutePath)
  const { data, content } = matter(raw)
  const stem = relativePath.replace(/\.md$/i, "")
  const segments = stem.split("/")
  const isIndex = segments[segments.length - 1] === "index"
  const urlParts = isIndex ? segments.slice(0, -1) : segments
  const url = urlParts.length > 0 ? `/${urlParts.join("/")}/` : "/"
  const html = md.render(content)
  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : stem
  const breadcrumbs = urlParts.map((segment, index) => {
    const isLast = index === urlParts.length - 1
    return {
      title: isLast ? title : prettifySegment(segment),
      url: isLast ? url : `/${urlParts.slice(0, index + 1).join("/")}/`,
      current: isLast,
    }
  })

  return {
    kind: "page",
    file: relativePath,
    slug: stem,
    url,
    dir: segments.slice(0, -1).join("/"),
    isIndex,
    title,
    breadcrumbs,
    order: typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER,
    // mtime do arquivo: nunca usar birthtime (em WSL/DrvFs vem 0 e vira "data inválida")
    date: stat.mtime,
    tags: asList(data.tags),
    frontmatter: data,
    markdown: content,
    html,
    toc: tocFromHtml(html),
    readingMinutes: readingMinutes(content),
  }
}

/** Rótulo usado para desempate (páginas têm `title`, pastas têm `name`). */
const labelOf = (node) => node.title ?? node.name ?? ""

const byOrder = (a, b) => a.order - b.order || labelOf(a).localeCompare(labelOf(b), "pt-BR")

/** Todas as páginas publicáveis, ordenadas. */
export function getEntries() {
  return walkMarkdown(CONTENT_DIR)
    .sort()
    .map(toPage)
    .sort(byOrder)
}

/**
 * Pastas com seus filhos diretos (páginas e subpastas).
 * A ordem de uma pasta é a menor ordem entre seus filhos.
 */
export function buildFolders(entries) {
  const folders = new Map()

  const ensureFolder = (dir) => {
    if (folders.has(dir)) return folders.get(dir)
    const segments = dir.split("/")
    const folder = {
      kind: "folder",
      dir,
      name: segments[segments.length - 1],
      url: `/${dir}/`,
      children: [],
      order: Number.MAX_SAFE_INTEGER,
    }
    folders.set(dir, folder)
    if (segments.length > 1) {
      ensureFolder(segments.slice(0, -1).join("/")).children.push(folder)
    }
    return folder
  }

  for (const page of entries) {
    if (!page.dir) continue
    ensureFolder(page.dir).children.push(page)
  }

  const orderOf = (node) => {
    if (node.kind === "page") return node.order
    node.order =
      node.children.length > 0 ? Math.min(...node.children.map(orderOf)) : node.order
    return node.order
  }

  const all = [...folders.values()]
  for (const folder of all) folder.children.sort(byOrder)
  for (const folder of all) orderOf(folder)
  all.sort(byOrder)

  // Uma pasta cujo URL já é atendido por um index.md não deve gerar página própria
  const pageUrls = new Set(entries.map((entry) => entry.url))
  return all.filter((folder) => !pageUrls.has(folder.url))
}

/** Árvore usada na barra lateral (nível raiz). */
export function buildNavigation(entries) {
  const folders = buildFolders(entries)
  const roots = folders.filter((folder) => !folder.dir.includes("/"))
  const loosePages = entries.filter((entry) => !entry.isIndex && !entry.dir)
  return [...roots, ...loosePages].sort(byOrder)
}

export { md as markdown }
