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
/* Ela não tem botão de abrir: entra pela tecla `[` (ou Ctrl+B). Fecha com Esc,
   com o ✕ ou clicando no fundo. */
const sidebar = document.getElementById("sidebar")
const btnFechar = sidebar?.querySelector("[data-sidebar-close]") ?? null
const backdrop = document.querySelector(".nav-backdrop")

const gavetaAberta = () => html.classList.contains("is-sidebar-open")

function setGaveta(aberta) {
  html.classList.toggle("is-sidebar-open", aberta)

  // O foco não pode ficar atrás do fundo (nem dentro de uma gaveta fechada)
  if (aberta) btnFechar?.focus({ preventScroll: true })
  else if (sidebar?.contains(document.activeElement)) document.activeElement.blur()
}

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
const apresentacao = initPresentation()
initMarkmap()
initAsciinema()
initTypst()
initCodes()
initSubmission()

/* 4. Links externos abrem em nova aba ------------------------------------- */
/**
 * O markdown do conteúdo já sai com `target="_blank"` do build (src/_lib/content.js);
 * esta varredura cobre o que nasce no navegador — principalmente os links dos
 * slides, que o reveal monta depois de inicializar.
 */
function abrirExternosEmNovaAba(raiz = document) {
  for (const link of raiz.querySelectorAll("a[href]")) {
    if (link.target === "_blank") continue
    if (!/^(https?:)?\/\//i.test(link.getAttribute("href") ?? "")) continue
    link.target = "_blank"
    link.rel = "noopener noreferrer"
  }
}

abrirExternosEmNovaAba()
apresentacao.then(() => abrirExternosEmNovaAba()).catch(() => {})
