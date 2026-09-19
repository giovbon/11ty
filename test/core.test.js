import { test } from "node:test"
import assert from "node:assert/strict"

import {
  asList,
  buildFolders,
  buildNavigation,
  getEntries,
  markdown,
} from "../src/_lib/content.js"
import { isExternalUrl } from "../src/_lib/urls.js"
import { getBaseUrl, isExternal, resolveUrl } from "../src/client/shared/urls.js"

const pagina = (dir, slug, title, order) => ({
  kind: "page",
  isIndex: slug === "index",
  dir,
  slug,
  title,
  order,
  url: slug === "index" ? "/" : `/${slug}/`,
})

const CONTEUDO = [
  pagina("", "index", "Index", Number.MAX_SAFE_INTEGER),
  pagina("AST", "AST/02-b", "b", 2),
  pagina("AST", "AST/01-a", "a", 1),
  pagina("CTT/Git", "CTT/Git/01-x", "x", 5),
]

test("asList normaliza string, lista e itens vazios", () => {
  assert.deepEqual(asList("AST06"), ["AST06"])
  assert.deepEqual(asList(["a", " b ", ""]), ["a", "b"])
  assert.deepEqual(asList(null), [])
  assert.deepEqual(asList(undefined), [])
})

test("buildFolders monta a hierarquia e ordena por order", () => {
  const pastas = buildFolders(CONTEUDO)
  assert.deepEqual(
    pastas.map((pasta) => pasta.dir).sort(),
    ["AST", "CTT", "CTT/Git"],
  )

  const ast = pastas.find((pasta) => pasta.dir === "AST")
  assert.deepEqual(
    ast.children.map((filho) => filho.title),
    ["a", "b"],
  )

  const ctt = pastas.find((pasta) => pasta.dir === "CTT")
  assert.equal(ctt.children.length, 1)
  assert.equal(ctt.children[0].kind, "folder")
  assert.equal(ctt.order, 5, "pasta herda a menor ordem dos filhos")
})

test("buildNavigation expõe só o nível raiz", () => {
  const navegacao = buildNavigation(CONTEUDO)
  assert.ok(navegacao.some((no) => no.dir === "AST"))
  assert.ok(navegacao.some((no) => no.dir === "CTT"))
  assert.ok(!navegacao.some((no) => no.dir === "CTT/Git"))
  assert.ok(!navegacao.some((no) => no.isIndex), "a home não entra na navegação")
})

test("getEntries lê o conteúdo real, ignora oculto/ e monta as URLs", () => {
  const entradas = getEntries()

  assert.equal(entradas.length, 39, "39 páginas publicáveis (o resto é oculto/)")
  assert.ok(entradas.every((entrada) => !entrada.file.includes("oculto")))
  assert.ok(entradas.every((entrada) => entrada.file.endsWith(".md")))

  const home = entradas.find((entrada) => entrada.isIndex)
  assert.equal(home.url, "/")

  const branchMerge = entradas.find((entrada) => entrada.slug === "CTT/Git/04CTT-PG-branch-merge")
  assert.equal(branchMerge.url, "/CTT/Git/04CTT-PG-branch-merge/")
  assert.equal(branchMerge.title, "Branching e Merging")
  assert.equal(branchMerge.frontmatter.order, 6)
  assert.ok(branchMerge.breadcrumbs.length >= 3)
  assert.equal(branchMerge.breadcrumbs.at(-1).current, true)
  assert.ok(branchMerge.date instanceof Date)
})

test("appsScript: entradas com frontmatter de componentes preservam o contrato", () => {
  const entradas = getEntries()
  const typst = entradas.find((entrada) => entrada.slug === "AST/06AST-PG-dubles-teste")
  const asciinema = entradas.find((entrada) => entrada.slug === "CTT/Git/01CTT-PG-controle-versao")
  const markmap = entradas.find((entrada) => entrada.slug === "AST/00AST-PG-ast-roadmap")

  assert.equal(typst.frontmatter.typst[0].name, "Exercício AST06")
  assert.equal(asciinema.frontmatter.asciinema, "asciinema/01-init_clone_commit.cast")
  assert.equal(markmap.frontmatter.markmap, "mindmaps/ast-roadmap.md")
})

test("urls: base padrão e prefixo aplicado só em caminho absoluto", () => {
  assert.equal(getBaseUrl(), "/")
  assert.equal(resolveUrl("/static/x.png"), "/static/x.png")
  assert.equal(resolveUrl("https://exemplo.com/x.png"), "https://exemplo.com/x.png")
  assert.equal(resolveUrl("#ancora"), "#ancora")
  assert.equal(resolveUrl("relativo/x.png"), "relativo/x.png")
  assert.equal(isExternal("//cdn.exemplo.com/x.js"), true)
  assert.equal(isExternal("/static/x.js"), false)
})

test("urls: com BASE_URL de subpasta o prefixo é aplicado uma única vez", () => {
  assert.equal(resolveUrl("/static/x.png", "/impacta/"), "/impacta/static/x.png")
  assert.equal(resolveUrl("/static/x.png", "/impacta"), "/impacta/static/x.png")
  assert.equal(resolveUrl("/impacta/static/x.png", "/impacta/"), "/impacta/static/x.png")
  assert.equal(resolveUrl("/index.css", ""), "/index.css")
  assert.equal(resolveUrl("https://cdn/x.js", "/impacta/"), "https://cdn/x.js")
})

test("urls (build): isExternalUrl separa link de fora de caminho do site", () => {
  assert.equal(isExternalUrl("https://exemplo.com/a"), true)
  assert.equal(isExternalUrl("http://exemplo.com/a"), true)
  assert.equal(isExternalUrl("//cdn.exemplo.com/a.js"), true)
  assert.equal(isExternalUrl("/ADP/"), false)
  assert.equal(isExternalUrl("#topo"), false)
  assert.equal(isExternalUrl("../x"), false)
  assert.equal(isExternalUrl(undefined), false)
})

test("markdown: link externo abre em nova aba, interno fica na mesma", () => {
  const externo = markdown.render("[site](https://exemplo.com/a)")
  assert.match(externo, /target="_blank"/)
  assert.match(externo, /rel="noopener noreferrer"/)

  assert.match(markdown.render("[cdn](//cdn.exemplo.com/a)"), /target="_blank"/)

  const interno = markdown.render("[aula](/ADP/)")
  assert.doesNotMatch(interno, /target=/)
})

test("conteúdo real: links externos saem com target e internos sem", () => {
  const pagina = getEntries().find((entrada) => entrada.slug === "ADP/02ADP-PG-modelo-conceitual")

  assert.match(pagina.html, /href="https:\/\/[^"]+" target="_blank"/)
  assert.doesNotMatch(pagina.html, /<a[^>]*href="\/[^"]*"[^>]*target=/)
})

test("markdown: bloco com linguagem sai realçado e com selo, sem linguagem não", () => {
  const destacado = markdown.render("```js\nconst a = 1\n```")
  assert.match(destacado, /class="hljs language-js"/)
  assert.match(destacado, /data-lang="js"/)
  assert.match(destacado, /hljs-keyword/)

  const semLinguagem = markdown.render("```\napenas texto\n```")
  assert.doesNotMatch(semLinguagem, /hljs|data-lang/)
})
