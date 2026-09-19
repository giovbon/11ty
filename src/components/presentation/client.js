import { resolveUrl } from "../../client/shared/urls.js"

/**
 * Comportamento do componente `presentation`.
 *
 * Sem SPA: a página carrega uma vez, então cada deck é inicializado uma única vez
 * (sem ciclo de vida nem reinicialização).
 */

const MIN_SLIDES_LIB_READY = () =>
  Boolean(window.Reveal && window.RevealMarkdown)

/** Slides podem referenciar imagem com caminho absoluto (`/zSLIDES/...`). */
function fixImagePaths(container) {
  for (const img of container.querySelectorAll("img")) {
    const raw = img.getAttribute("src")
    if (!raw || !raw.startsWith("/")) continue
    const fixed = resolveUrl(raw)
    if (fixed !== raw) img.setAttribute("src", fixed)
  }
}

/**
 * O reveal mede cada slide UMA vez (no initialize e nas trocas de slide). Se o
 * conteúdo crescer depois — imagem que resolve tarde, imagem quebrada (404),
 * fonte web — a centralização e o scale ficam congelados no tamanho antigo e o
 * slide aparece deslocado/estourando a moldura. Recalcula quando algo mudar.
 */
function keepLayoutFresh(container, deck) {
  let frame = 0
  const relayout = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      try {
        deck.layout()
      } catch {
        /* deck destruído */
      }
    })
  }

  const observeImages = () => {
    for (const img of container.querySelectorAll("img")) {
      if (img.complete) continue
      img.addEventListener("load", relayout, { once: true })
      img.addEventListener("error", relayout, { once: true })
    }
  }

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(relayout)
    observer.observe(container)
    for (const section of container.querySelectorAll(".slides section")) {
      observer.observe(section)
    }
  }

  observeImages()
  document.fonts?.ready.then(relayout)
  window.addEventListener("load", relayout, { once: true })

  deck.on("slidechanged", () => {
    fixImagePaths(container)
    observeImages()
  })
}

function addFullscreenButton(container) {
  if (container.querySelector(".deck__fullscreen")) return

  const button = document.createElement("button")
  button.type = "button"
  button.className = "deck__fullscreen"
  button.textContent = "⛶"
  button.title = "Tela cheia"
  button.setAttribute("aria-label", "Tela cheia")
  button.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  })

  container.appendChild(button)
}

async function initDeck(container, multiplos) {
  const options = {
    plugins: [window.RevealMarkdown, window.RevealHighlight].filter(Boolean),
    embedded: true,
    keyboard: true,
    controls: true,
    progress: true,
    center: true,
    transition: "slide",
    hash: false,
    markdown: { separator: "^---", verticalSeparator: "^--" },
  }

  // Com mais de um deck na página, o teclado só controla o deck sob o cursor
  // (ou em foco) — caso contrário uma seta avançaria todos os decks juntos.
  if (multiplos) {
    container.tabIndex = 0
    options.keyboardCondition = () =>
      container.matches(":hover") || container.contains(document.activeElement)
  }

  const deck = new window.Reveal(container, options)

  // O plugin RevealMarkdown é singleton (estado no módulo): inicializar em sequência.
  await deck.initialize()

  fixImagePaths(container)
  addFullscreenButton(container)
  keepLayoutFresh(container, deck)
  window.setTimeout(() => deck.layout(), 100)
}

export async function initPresentation() {
  const decks = [...document.querySelectorAll(".decks .deck .reveal")]
  if (decks.length === 0) return
  if (!MIN_SLIDES_LIB_READY()) {
    console.error("[presentation] reveal.js não carregou (ver /static/lib/reveal)")
    return
  }

  const multiplos = decks.length > 1
  for (const container of decks) {
    try {
      await initDeck(container, multiplos)
    } catch (error) {
      console.error("[presentation] falha ao iniciar deck:", error)
    }
  }
}
