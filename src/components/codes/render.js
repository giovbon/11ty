import fs from "node:fs"
import path from "node:path"
import { ROOT, asList } from "../../_lib/content.js"

/**
 * Componente `codes` — explorador de código (árvore de arquivos + visualizador).
 *
 * Frontmatter:
 *   codes: "codes/selenium1.md"
 *
 * O arquivo é um "`.zcode`": um markdown com uma lista indentada que descreve a
 * árvore, e blocos de código cercados logo abaixo de cada arquivo:
 *
 *   - /
 *     - README.md
 *       ```md
 *       execute: `python3 interagindo_play.py`
 *       ```
 *     - interagindo_play.py
 *       ```python
 *       import selenium
 *       ```
 *
 * Pasta = item terminado em `/`. A indentação do bloco de código define quanto
 * de recuo é removido de cada linha do conteúdo.
 */

const CODES_DIR = path.join(ROOT, "codes")

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const escapeAttr = (value) => escapeHtml(value).replace(/"/g, "&quot;")

/** Converte o texto `.zcode` na árvore usada pelo componente. */
export function parseZCode(texto) {
  const raiz = []
  const pilha = []
  let arquivoAtual = null
  let emBloco = false
  let recuoBloco = 0

  for (const linha of texto.split("\n")) {
    if (linha.trim() === "" && !emBloco) continue

    const recuo = linha.search(/\S/)
    if (recuo === -1 && !emBloco) continue

    const conteudo = linha.trim()

    if (!emBloco && conteudo.startsWith("- ")) {
      const nome = conteudo.slice(2).trim()
      const isDir = nome.endsWith("/")
      const node = {
        name: isDir ? nome.slice(0, -1) : nome,
        isDir,
        recuo,
        children: isDir ? [] : undefined,
        content: isDir ? undefined : "",
      }

      while (pilha.length > 0 && pilha[pilha.length - 1].recuo >= recuo) pilha.pop()
      if (pilha.length === 0) raiz.push(node)
      else pilha[pilha.length - 1].children.push(node)

      if (isDir) pilha.push(node)
      // Bloco de código pertence ao último arquivo lido (e não a uma pasta).
      arquivoAtual = isDir ? null : node
    } else if (arquivoAtual && conteudo.startsWith("```")) {
      if (!emBloco) {
        emBloco = true
        recuoBloco = recuo
        arquivoAtual.lang = conteudo.slice(3).trim() || "text"
      } else {
        emBloco = false
      }
    } else if (emBloco && arquivoAtual) {
      const pedaco = linha.startsWith(" ".repeat(recuoBloco)) ? linha.slice(recuoBloco) : linha.trimStart()
      arquivoAtual.content += pedaco + "\n"
    }
  }

  return raiz
}

function renderNodes(nodes) {
  const itens = nodes
    .map((node) => {
      if (node.isDir) {
        // A raiz do .zcode é `- /`, cujo nome fica vazio: mostra "/" na árvore.
        const rotulo = node.name === "" ? "/" : node.name
        return `<li>
          <div class="tree-item folder"><span class="folder-icon">▶</span><span class="item-icon">📁</span><span class="item-name">${escapeHtml(rotulo)}</span></div>
          <div class="folder-content">${renderNodes(node.children ?? [])}</div>
        </li>`
      }
      return `<li>
          <div class="tree-item file" data-lang="${escapeAttr(node.lang ?? "text")}" data-code="${escapeAttr((node.content ?? "").trim())}"><span class="item-icon">📄</span><span class="item-name">${escapeHtml(node.name)}</span></div>
        </li>`
    })
    .join("\n")

  return `<ul class="tree-list">${itens}</ul>`
}

/** Uma entrada por arquivo declarado em `codes`. */
export function buildExplorers(frontmatter) {
  const arquivos = asList(frontmatter?.codes)
  if (arquivos.length === 0) return null

  return arquivos.map((origem) => {
    const relativo = String(origem).replace(/^\/+/, "")
    const absoluto = path.join(ROOT, relativo)
    const existe = fs.existsSync(absoluto)
    if (!existe) {
      console.error(`[codes] arquivo não encontrado: ${relativo} (declarado no frontmatter)`)
    }

    const texto = existe ? fs.readFileSync(absoluto, "utf8") : ""
    const arvore = parseZCode(texto)

    return {
      origem: relativo,
      nome: path.basename(relativo),
      arvore,
      vazio: arvore.length === 0,
    }
  })
}

/** HTML do componente (string vazia quando não há `codes`). */
export function renderCodes(frontmatter) {
  const exploradores = buildExplorers(frontmatter)
  if (!exploradores) return ""

  return exploradores
    .map(
      (explorer) => `<div class="code-explorer" data-tree="${escapeAttr(
        JSON.stringify(explorer.arvore),
      )}" data-name="${escapeAttr(explorer.nome)}">
      <div class="explorer-actions">
        <button type="button" class="action-btn zoom-in-btn" title="Aumentar fonte">A+</button>
        <button type="button" class="action-btn zoom-out-btn" title="Diminuir fonte">a-</button>
        <button type="button" class="action-btn copy-btn" title="Copiar código">📋</button>
        <button type="button" class="action-btn fs-btn" title="Tela cheia">⛶</button>
        <button type="button" class="action-btn zip-btn" title="Baixar ZIP">💾</button>
      </div>
      <div class="tree-panel">
        <div class="tree-title">${escapeHtml(explorer.nome)}</div>
        ${renderNodes(explorer.arvore)}
      </div>
      <div class="viewer-panel">
        <div class="viewer-header"><span class="current-filename">Selecione um arquivo</span></div>
        <div class="code-content"><pre><code></code></pre></div>
      </div>
    </div>`,
    )
    .join("\n")
}
