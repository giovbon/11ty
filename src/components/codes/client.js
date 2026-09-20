import { resolveUrl } from "../../client/shared/urls.js"

/**
 * Componente `codes` — explorador de código.
 *
 * Comportamento: pastas expandem/recolhem, arquivo clicado é destacado e exibido
 * no visualizador (highlight.js do próprio site), A+/a- mudam a fonte, 📋 copia,
 * ⛶ alterna tela cheia e 💾 baixa a árvore inteira como ZIP (JSZip vendorizado,
 * carregado só no primeiro clique).
 */

const JSZIP_URL = "/static/lib/jszip/jszip.min.js"

let jszipPromise = null

function carregarJSZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip)
  if (!jszipPromise) {
    jszipPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = resolveUrl(JSZIP_URL)
      script.onload = () => resolve(window.JSZip)
      script.onerror = () => reject(new Error("falha ao carregar o JSZip"))
      document.head.appendChild(script)
    }).catch((erro) => {
      jszipPromise = null
      throw erro
    })
  }
  return jszipPromise
}

function destacar(codeElement, codigo, lang) {
  const linguagem = lang || "text"
  codeElement.className = `hljs language-${linguagem}`
  if (window.hljs) {
    try {
      codeElement.innerHTML = window.hljs.highlight(codigo, { language: linguagem }).value
      return
    } catch {
      /* linguagem desconhecida: cai no texto puro */
    }
  }
  codeElement.textContent = codigo
}

function coletarArquivos(nodes, base, zip) {
  for (const node of nodes) {
    const caminho = base ? `${base}/${node.name}` : node.name
    if (node.isDir) {
      // A raiz do .zcode tem nome vazio: não cria entrada só para ela.
      if (caminho) zip.folder(caminho)
      coletarArquivos(node.children ?? [], caminho, zip)
    } else {
      zip.file(caminho, node.content ?? "")
    }
  }
}

async function baixarZip(explorer, button) {
  const arvore = JSON.parse(explorer.dataset.tree || "[]")
  const nome = explorer.dataset.name || "projeto"

  button.disabled = true
  button.textContent = "⌛"
  try {
    const JSZip = await carregarJSZip()
    const zip = new JSZip()
    coletarArquivos(arvore, "", zip)
    const blob = await zip.generateAsync({ type: "blob" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${nome.replace(/\.md$/, "")}.zip`
    // O link precisa estar no documento (alguns navegadores ignoram o `download`
    // em elemento solto) e a URL só pode ser revogada depois que a transferência
    // começa — revogar logo após o click cancela o arquivo.
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 10000)
    button.textContent = "✅"
  } catch (erro) {
    console.error("[codes] falha ao gerar ZIP:", erro)
    button.textContent = "❌"
  } finally {
    window.setTimeout(() => {
      button.textContent = "💾"
      button.disabled = false
    }, 2000)
  }
}

function abrirPasta(folder) {
  folder.classList.toggle("open")
  const conteudo = folder.nextElementSibling
  if (conteudo?.classList.contains("folder-content")) conteudo.classList.toggle("open")
  const icone = folder.querySelector(".folder-icon")
  if (icone) icone.textContent = folder.classList.contains("open") ? "▼" : "▶"
}

function selecionarArquivo(explorer, item) {
  const codeElement = explorer.querySelector(".code-content code")
  const nomeElement = explorer.querySelector(".current-filename")

  for (const outro of explorer.querySelectorAll(".tree-item.file")) outro.classList.remove("active")
  item.classList.add("active")

  const nome = item.querySelector(".item-name")?.textContent ?? ""
  const codigo = item.dataset.code ?? ""
  if (codeElement) destacar(codeElement, codigo, item.dataset.lang ?? "text")
  if (nomeElement) nomeElement.textContent = nome

  explorer.dataset.codigoAtual = codigo
}

function initExplorer(explorer) {
  let fonte = 14

  const zoomIn = explorer.querySelector(".zoom-in-btn")
  const zoomOut = explorer.querySelector(".zoom-out-btn")
  const copyBtn = explorer.querySelector(".copy-btn")
  const fsBtn = explorer.querySelector(".fs-btn")
  const zipBtn = explorer.querySelector(".zip-btn")

  zoomIn?.addEventListener("click", () => {
    fonte = Math.min(30, fonte + 2)
    explorer.style.setProperty("--code-font-size", `${fonte}px`)
  })

  zoomOut?.addEventListener("click", () => {
    fonte = Math.max(8, fonte - 2)
    explorer.style.setProperty("--code-font-size", `${fonte}px`)
  })

  copyBtn?.addEventListener("click", async () => {
    const codigo = explorer.dataset.codigoAtual || ""
    if (!codigo) return
    try {
      await navigator.clipboard.writeText(codigo)
      copyBtn.textContent = "✅"
    } catch {
      copyBtn.textContent = "❌"
    }
    window.setTimeout(() => {
      copyBtn.textContent = "📋"
    }, 2000)
  })

  fsBtn?.addEventListener("click", () => {
    const cheio = explorer.classList.toggle("fullscreen")
    document.body.style.overflow = cheio ? "hidden" : ""
  })

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && explorer.classList.contains("fullscreen")) {
      explorer.classList.remove("fullscreen")
      document.body.style.overflow = ""
    }
  })

  zipBtn?.addEventListener("click", () => {
    if (!zipBtn.disabled) baixarZip(explorer, zipBtn)
  })

  for (const folder of explorer.querySelectorAll(".tree-item.folder")) {
    folder.addEventListener("click", () => abrirPasta(folder))
  }

  for (const item of explorer.querySelectorAll(".tree-item.file")) {
    item.addEventListener("click", () => selecionarArquivo(explorer, item))
  }

  // Abre os arquivos e seleciona o primeiro, já com o caminho de pastas aberto.
  const primeiro = explorer.querySelector(".tree-item.file")
  if (primeiro) {
    primeiro.click()
    let pai = primeiro.parentElement
    while (pai && !pai.classList.contains("code-explorer")) {
      if (pai.classList.contains("folder-content")) {
        const folder = pai.previousElementSibling
        if (folder?.classList.contains("folder")) abrirPasta(folder)
      }
      pai = pai.parentElement
    }
  }
}

export function initCodes() {
  const exploradores = document.querySelectorAll(".code-explorer")
  for (const explorer of exploradores) initExplorer(explorer)
}
