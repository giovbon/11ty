/**
 * Componente `typst` — compila o exercício no navegador e baixa o PDF.
 *
 * O compilador (Typst WASM, ~28 MB) só é baixado no primeiro clique e fica
 * memoizado para os próximos exercícios da mesma página.
 */

let compilador = null

async function carregarCompilador(container) {
  if (compilador) return compilador

  const bundleUrl = container.dataset.bundle
  const wasmUrl = container.dataset.wasm
  if (!bundleUrl || !wasmUrl) throw new Error("caminhos da lib Typst ausentes no HTML")

  const modulo = await import(/* webpackIgnore: true */ bundleUrl)
  const typst = modulo.$typst

  const resposta = await fetch(wasmUrl)
  if (!resposta.ok) {
    throw new Error(`falha ao baixar o WASM do Typst (HTTP ${resposta.status})`)
  }
  const buffer = await resposta.arrayBuffer()
  typst.setCompilerInitOptions({ getModule: () => buffer })

  compilador = typst
  return compilador
}

function baixar(dados, nomeArquivo) {
  const blob = new Blob([dados], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(url)
}

function nomeDoArquivo(label, url) {
  const base = label.replace(/^PDF:\s*/i, "").trim()
  if (base) return `${base}.pdf`
  return (url.split("/").pop() ?? "documento.typ").replace(/\.typ$/i, ".pdf")
}

async function gerarPdf(button) {
  const container = button.closest(".typst")
  const url = button.dataset.typ
  const label = button.dataset.name ?? ""
  const rotulo = button.querySelector(".typst-btn__label")

  button.setAttribute("aria-busy", "true")
  button.classList.remove("typst-btn--erro", "typst-btn--ok")
  if (rotulo) rotulo.textContent = "Gerando PDF..."

  try {
    const typst = await carregarCompilador(container)

    const resposta = await fetch(url)
    if (!resposta.ok) {
      throw new Error(`exercício não encontrado: ${url} (HTTP ${resposta.status})`)
    }
    const codigo = await resposta.text()

    const pdf = await typst.pdf({ mainContent: codigo })
    baixar(pdf, nomeDoArquivo(label, url))

    button.classList.add("typst-btn--ok")
    if (rotulo) rotulo.textContent = "PDF gerado ✓"
  } catch (erro) {
    console.error("[typst] falha ao gerar PDF:", erro)
    button.classList.add("typst-btn--erro")
    if (rotulo) rotulo.textContent = "Erro ao gerar PDF"
  } finally {
    button.removeAttribute("aria-busy")
    window.setTimeout(() => {
      button.classList.remove("typst-btn--erro", "typst-btn--ok")
      if (rotulo) rotulo.textContent = label
    }, 4000)
  }
}

export function initTypst() {
  const buttons = document.querySelectorAll(".typst .typst-btn")
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button.hasAttribute("aria-busy")) return
      gerarPdf(button)
    })
  }
}
