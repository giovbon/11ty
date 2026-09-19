/**
 * Comportamento de cliente.
 *
 * Sem SPA: cada navegação é um carregamento novo, então cada módulo roda uma vez
 * no load — sem ciclo de vida, sem reinicialização. Cada componente entra aqui.
 */
import { initPresentation } from "../components/presentation/client.js"
import { initTypst } from "../components/typst/client.js"
import { initCodes } from "../components/codes/client.js"
import { initSubmission } from "../components/submission/client.js"
import { initAsciinema } from "../components/asciinema/client.js"
import { initMarkmap } from "../components/markmap/client.js"

const html = document.documentElement

/* 1. Gaveta de navegação (oculta por padrão) ------------------------------ */
const toggle = document.querySelector("[data-sidebar-toggle]")
const sidebar = document.getElementById("sidebar")
const btnFechar = sidebar?.querySelector("[data-sidebar-close]") ?? null
const backdrop = document.querySelector(".nav-backdrop")

const gavetaAberta = () => html.classList.contains("is-sidebar-open")

function setGaveta(aberta) {
  html.classList.toggle("is-sidebar-open", aberta)
  if (toggle instanceof HTMLElement) toggle.setAttribute("aria-expanded", String(aberta))

  // O foco não pode ficar atrás do fundo (nem dentro de uma gaveta fechada)
  if (aberta) btnFechar?.focus({ preventScroll: true })
  else if (document.activeElement !== toggle) toggle?.focus?.({ preventScroll: true })
}

toggle?.addEventListener("click", () => setGaveta(!gavetaAberta()))
btnFechar?.addEventListener("click", () => setGaveta(false))
backdrop?.addEventListener("click", () => setGaveta(false))

/* Atalhos: `[` alterna a gaveta (e Ctrl+B faz o mesmo — no Firefox o Ctrl+B é
   dos favoritos, por isso `[` é o atalho oficial). Esc fecha a gaveta. */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && gavetaAberta()) {
    setGaveta(false)
    return
  }

  const alvo = event.target
  const digitando =
    alvo instanceof HTMLElement &&
    (alvo.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName))
  if (digitando || event.altKey || event.metaKey || event.shiftKey) return

  if ((event.ctrlKey && event.key.toLowerCase() === "b") || (!event.ctrlKey && event.key === "[")) {
    event.preventDefault()
    setGaveta(!gavetaAberta())
  }
})

/* 2. Botão "copiar" nos blocos de código ---------------------------------- */
for (const pre of document.querySelectorAll("pre")) {
  const code = pre.querySelector("code")
  if (!code) continue

  const button = document.createElement("button")
  button.type = "button"
  button.className = "icon-btn code-copy"
  button.textContent = "copiar"
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? "")
      button.textContent = "copiado"
    } catch {
      button.textContent = "erro"
    }
    window.setTimeout(() => {
      button.textContent = "copiar"
    }, 1500)
  })

  pre.appendChild(button)
}

/* 3. Componentes ---------------------------------------------------------- */
initPresentation()
initMarkmap()
initAsciinema()
initTypst()
initCodes()
initSubmission()
