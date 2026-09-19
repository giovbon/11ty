import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { parseZCode } from "../src/components/codes/render.js"

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

test("monta a árvore com pastas e arquivos", () => {
  const arvore = parseZCode(
    ["- /", "  - README.md", "  - pasta/", "    - dentro.py"].join("\n"),
  )

  assert.equal(arvore.length, 1)
  const raiz = arvore[0]
  assert.equal(raiz.isDir, true)
  assert.equal(raiz.name, "")
  assert.deepEqual(
    raiz.children.map((no) => no.name),
    ["README.md", "pasta"],
  )
  assert.equal(raiz.children[1].isDir, true)
  assert.equal(raiz.children[1].children[0].name, "dentro.py")
})

test("recorta a indentação do bloco de código e guarda a linguagem", () => {
  const arvore = parseZCode(
    ["- /", "  - app.py", "    ```python", "    print('oi')", "      indentado", "    ```"].join(
      "\n",
    ),
  )

  const arquivo = arvore[0].children[0]
  assert.equal(arquivo.lang, "python")
  assert.equal(arquivo.content, "print('oi')\n  indentado\n")
})

test("bloco sem linguagem vira 'text'", () => {
  const arvore = parseZCode(["- /", "  - notas.md", "    ```", "    linha", "    ```"].join("\n"))
  assert.equal(arvore[0].children[0].lang, "text")
})

test("código depois de uma pasta não é anexado ao arquivo anterior", () => {
  const arvore = parseZCode(
    [
      "- /",
      "  - antes.md",
      "    ```md",
      "    texto",
      "    ```",
      "  - pasta/",
      "    ```sh",
      "    echo oi",
      "    ```",
    ].join("\n"),
  )

  const [arquivo, pasta] = arvore[0].children
  assert.equal(arquivo.content, "texto\n")
  assert.equal(pasta.content, undefined)
})

test("markdown vazio devolve árvore vazia", () => {
  assert.deepEqual(parseZCode(""), [])
  assert.deepEqual(parseZCode("\n\n"), [])
})

test("lê o arquivo real codes/selenium1.md", () => {
  const texto = fs.readFileSync(path.join(RAIZ, "codes", "selenium1.md"), "utf8")
  const arvore = parseZCode(texto)

  assert.equal(arvore.length, 1)
  const arquivos = arvore[0].children
  assert.deepEqual(
    arquivos.map((no) => no.name),
    ["README.md", "interagindo_play.py", "playground.html", "selenium_como_test.py"],
  )

  const readme = arquivos[0]
  assert.equal(readme.lang, "md")
  assert.match(readme.content, /interagindo_play\.py/)

  const script = arquivos[1]
  assert.equal(script.lang, "python")
  assert.match(script.content, /^from selenium import webdriver/m)
  // o recorte tira a indentação do bloco: a primeira linha começa na coluna 0
  assert.equal(script.content.split("\n")[0], script.content.split("\n")[0].trimStart())
  assert.ok(!script.content.startsWith("    "))
})
