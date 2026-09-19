import { test } from "node:test"
import assert from "node:assert/strict"

import { buildAsciinema, renderAsciinema } from "../src/components/asciinema/render.js"
import { buildTypst, renderTypst } from "../src/components/typst/render.js"
import { buildMarkmap, renderMarkmap } from "../src/components/markmap/render.js"
import { renderPresentation } from "../src/components/presentation/render.js"
import { SCRIPT_URL, renderSubmission } from "../src/components/submission/render.js"

/** As funções de build reclamam no console; nos testes de erro isso é ruído. */
function semRuido(fn) {
  const original = console.error
  console.error = () => {}
  try {
    return fn()
  } finally {
    console.error = original
  }
}

/* ───────────────────────── presentation ───────────────────────── */

test("presentation: embute o deck e remove o frontmatter do arquivo de slides", () => {
  const html = renderPresentation({ presentation: "test/fixtures/deck-com-frontmatter.md" })

  assert.match(html, /data-decks="1"/)
  assert.match(html, /<section data-markdown data-separator="\^---" data-separator-vertical="\^--">/)
  assert.match(html, /<script type="text\/template">/)
  assert.match(html, /# Primeiro slide/)
  assert.match(html, /## Segundo slide/)
  assert.ok(!html.includes("icon: simple/git"), "o frontmatter não pode ir para dentro do deck")
  assert.ok(!/<script type="text\/template">\s*---/.test(html), "o deck não pode começar com ---")
})

test("presentation: lista gera um deck por arquivo", () => {
  const html = renderPresentation({
    presentation: [
      "test/fixtures/deck-com-frontmatter.md",
      "slides/CTT/Git/03-branching-merging.md",
    ],
  })

  assert.match(html, /data-decks="2"/)
  assert.equal((html.match(/class="reveal"/g) ?? []).length, 2)
})

test("presentation: sem frontmatter não renderiza nada", () => {
  assert.equal(renderPresentation({}), "")
  assert.equal(renderPresentation(undefined), "")
  assert.equal(renderPresentation({ presentation: "arquivo.txt" }), "")
})

test("presentation: deck inexistente não quebra o build", () => {
  const html = semRuido(() => renderPresentation({ presentation: "slides/nao-existe.md" }))
  assert.match(html, /data-decks="1"/)
})

/* ───────────────────────── asciinema ───────────────────────── */

test("asciinema: resolve o caminho lógico para /static", () => {
  const dados = buildAsciinema({ asciinema: "asciinema/01-init_clone_commit.cast" })
  assert.equal(dados.gravacoes.length, 1)
  assert.equal(dados.gravacoes[0].url, "/static/asciinema/01-init_clone_commit.cast")
  assert.equal(dados.gravacoes[0].titulo, "01-init_clone_commit")
  assert.equal(dados.gravacoes[0].existe, true)
})

test("asciinema: aceita nome curto, lista e rótulo próprio", () => {
  const dados = buildAsciinema({
    asciinema: ["08-branches.cast", { path: "asciinema/09-merge-fast.cast", name: "Merge" }],
  })

  assert.deepEqual(
    dados.gravacoes.map((gravacao) => gravacao.url),
    ["/static/asciinema/08-branches.cast", "/static/asciinema/09-merge-fast.cast"],
  )
  assert.equal(dados.gravacoes[0].titulo, "08-branches")
  assert.equal(dados.gravacoes[1].titulo, "Merge")
})

test("asciinema: aceita URL remota e marca o que não existe", () => {
  const remoto = buildAsciinema({ asciinema: "https://exemplo.com/demo.cast" })
  assert.equal(remoto.gravacoes[0].url, "https://exemplo.com/demo.cast")
  assert.equal(remoto.gravacoes[0].existe, true)

  const ausente = semRuido(() => buildAsciinema({ asciinema: "asciinema/nao-existe.cast" }))
  assert.equal(ausente.gravacoes[0].existe, false)
})

test("asciinema: HTML traz título, data-src e aviso de carregamento", () => {
  const html = renderAsciinema({ asciinema: "asciinema/08-branches.cast" })
  assert.match(html, /class="asciinema-title">08-branches</)
  assert.match(html, /data-src="\/static\/asciinema\/08-branches\.cast"/)
  assert.match(html, /asciinema-loading/)
  assert.equal(renderAsciinema({}), "")
})

/* ───────────────────────── typst ───────────────────────── */

test("typst: resolve o exercício, o rótulo e a lib", () => {
  const dados = buildTypst({ typst: [{ path: "typs/AST/AST06.typ", name: "Exercício AST06" }] })

  assert.equal(dados.entries[0].url, "/static/typs/AST/AST06.typ")
  assert.equal(dados.entries[0].label, "Exercício AST06")
  assert.equal(dados.entries[0].exists, true)
  assert.equal(dados.bundle, "/static/lib/typst/snippet.bundle.mjs")
  assert.equal(dados.wasm, "/static/lib/typst/typst_ts_web_compiler_bg.wasm")
  assert.equal(dados.comErro, false)
})

test("typst: sem nome usa 'PDF: <arquivo>'", () => {
  const dados = buildTypst({ typst: "typs/ATS/ATS01.typ" })
  assert.equal(dados.entries[0].label, "PDF: ATS01")
})

test("typst: exercício ausente é sinalizado no build", () => {
  const dados = semRuido(() => buildTypst({ typst: "typs/AST/nao-existe.typ" }))
  assert.equal(dados.comErro, true)
  assert.equal(renderTypst({}), "")
})

/* ───────────────────────── markmap ───────────────────────── */

test("markmap: embute o markdown do mapa mental", () => {
  const dados = buildMarkmap({ markmap: "mindmaps/ctt-roadmap.md" })
  assert.equal(dados.remoto, false)
  assert.match(dados.markdown, /# CTT/)

  const html = renderMarkmap({ markmap: "mindmaps/ctt-roadmap.md" })
  assert.match(html, /<script type="text\/markdown">/)
  assert.match(html, /class="markmap"/)
  assert.equal(renderMarkmap({}), "")
})

test("markmap: fonte remota sai como data-src, sem markdown embutido", () => {
  const html = renderMarkmap({ markmap: "https://exemplo.com/mapa.md" })
  assert.match(html, /data-src="https:\/\/exemplo\.com\/mapa\.md"/)
  assert.match(html, /markmap-carregando/)
  assert.ok(!html.includes("text/markdown"))
})

test("markmap: arquivo ausente aparece como erro na página", () => {
  const html = semRuido(() => renderMarkmap({ markmap: "mindmaps/nao-existe.md" }))
  assert.match(html, /markmap-erro/)
})

/* ───────────────────────── submission ───────────────────────── */

test("submission: uma atividade vai direto ao formulário", () => {
  const html = renderSubmission({ submission: "AST06" })

  assert.match(html, /class="selection-screen hidden"/, "escolha fica escondida")
  assert.match(html, /class="form-screen"/)
  assert.match(html, /data-activity="AST06"/)
  assert.match(html, /<span class="highlight-activity">AST06<\/span>/)
  assert.match(html, /class="back-to-selection hidden"/)
})

test("submission: duas atividades pedem a escolha", () => {
  const html = renderSubmission({ submission: ["AST06", "AST06 ADS3-SI3 ADS4-SI4"] })

  assert.match(html, /class="selection-screen"/)
  assert.match(html, /class="form-screen hidden"/)
  assert.match(html, /data-activity="AST06 ADS3-SI3 ADS4-SI4"/)
  assert.equal((html.match(/class="select-activity-btn"/g) ?? []).length, 2)
})

test("submission: a URL do Apps Script é a de produção e vai no HTML", () => {
  const html = renderSubmission({ submission: "ADP1" })
  assert.match(html, new RegExp(`data-script-url="${SCRIPT_URL.replace(/[/.]/g, (c) => `\\${c}`)}"`))
  assert.match(SCRIPT_URL, /^https:\/\/script\.google\.com\/macros\/s\/AKfycbw.+\/exec$/)
})

test("submission: campos obrigatórios do contrato existem", () => {
  const html = renderSubmission({ submission: "ADP1" })

  for (const id of ["ra", "nome_aluno", "github", "mensagem", "zipfile"]) {
    assert.ok(html.includes(`id="${id}"`), `campo ${id} ausente`)
  }
  assert.match(html, /accept="\.zip,application\/zip,application\/x-zip-compressed"/)
  assert.match(html, /class="file-pick-btn"/)
  assert.match(html, /class="clear-file-btn"/)
  assert.match(html, /class="status-message"/)
  assert.match(html, /class="receipt-container"/)
  assert.equal(renderSubmission({}), "")
})
