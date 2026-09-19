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

/* 1. Navegação no mobile -------------------------------------------------- */
const toggle = document.querySelector("[data-sidebar-toggle]")
if (toggle instanceof HTMLElement) {
  toggle.setAttribute("aria-expanded", "false")
  toggle.addEventListener("click", () => {
    const isOpen = html.classList.toggle("is-sidebar-open")
    toggle.setAttribute("aria-expanded", String(isOpen))
  })
}

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

/* 3. Destaca no sumário a seção visível ----------------------------------- */
const tocLinks = [...document.querySelectorAll("[data-toc-link]")]
if (tocLinks.length > 0) {
  const byId = new Map(tocLinks.map((link) => [link.getAttribute("data-toc-link"), link]))
  const headings = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null)

  if (headings.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          for (const link of tocLinks) link.classList.remove("is-active")
          byId.get(entry.target.id)?.classList.add("is-active")
        }
      },
      { rootMargin: "-15% 0px -75% 0px" },
    )
    headings.forEach((heading) => observer.observe(heading))
  }
}

/* 4. Componentes ---------------------------------------------------------- */
initPresentation()
initMarkmap()
initAsciinema()
initTypst()
initCodes()
initSubmission()
