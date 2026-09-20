import { resolveUrl } from "../../client/shared/urls.js"

/**
 * Componente `markmap` — carrega as libs sob demanda (só em páginas com mapa),
 * transforma o markdown embutido e desenha o SVG com controles de zoom.
 *
 * As libs são vendorizadas em `/static/lib/markmap/` (d3 → markmap-lib →
 * markmap-view, nesta ordem: a view espera o `d3` global e ambas publicam em
 * `window.markmap`).
 */

const ARQUIVOS = {
  d3: "/static/lib/markmap/d3.min.js",
  lib: "/static/lib/markmap/markmap-lib.iife.js",
  view: "/static/lib/markmap/markmap-view.js",
}

const OPCOES = { autoFit: true, duration: 500, paddingX: 20 }

function carregarScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = url
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`falha ao carregar ${url}`))
    document.head.appendChild(script)
  })
}

let carregandoLibs = null

function carregarLibs() {
  if (!carregandoLibs) {
    carregandoLibs = (async () => {
      await carregarScript(resolveUrl(ARQUIVOS.d3))
      await carregarScript(resolveUrl(ARQUIVOS.lib))
      await carregarScript(resolveUrl(ARQUIVOS.view))
    })().catch((erro) => {
      carregandoLibs = null
      throw erro
    })
  }
  return carregandoLibs
}

function adicionarControles(container, markmap) {
  const controles = document.createElement("div")
  controles.className = "markmap-controles"

  const botao = (rotulo, titulo, aoClicar) => {
    const elemento = document.createElement("button")
    elemento.type = "button"
    elemento.textContent = rotulo
    elemento.title = titulo
    elemento.addEventListener("click", (evento) => {
      evento.stopPropagation()
      aoClicar()
    })
    return elemento
  }

  controles.append(
    botao("➕", "Aumentar zoom", () => markmap.rescale(1.25)),
    botao("➖", "Diminuir zoom", () => markmap.rescale(0.8)),
    botao("🎯", "Centralizar", () => markmap.fit()),
    botao("⛶", "Tela cheia", () => {
      if (!document.fullscreenElement) container.requestFullscreen?.()
      else document.exitFullscreen?.()
    }),
  )

  container.appendChild(controles)
}

function mostrarErro(container, mensagem) {
  container.innerHTML = `<div class="markmap-erro">${mensagem}</div>`
}

/**
 * Deixa o mapa ser arrastado também a partir de um rótulo.
 *
 * O markmap-view chama `stopPropagation()` no `mousedown` de cada `foreignObject`
 * (o rótulo do nó) e do círculo — com isso o d3-zoom, que escuta no `<svg>`, nunca
 * recebe o evento, e arrastar em cima de um rótulo não move nada. Como um mapa
 * mental é quase todo rótulo, o resultado prático é "não dá para arrastar".
 *
 * A saída é ouvir em captura (antes do `stopPropagation` do markmap) e reinjetar
 * o mesmo `mousedown` direto no `<svg>`, para o gesto do d3-zoom começar normal.
 *
 * Efeito colateral aceito: o texto de um nó deixa de ser selecionável com o mouse
 * (o `preventDefault` mata a seleção) — arrastar o mapa vale mais aqui.
 */
function permitirArrastoSobreOsNos(svg) {
  svg.addEventListener(
    "mousedown",
    (evento) => {
      if (evento._doMarkmap) return // é a nossa própria reinjeção
      if (evento.button !== 0 || evento.defaultPrevented) return
      if (!evento.target?.closest?.(".markmap-node")) return // o fundo já funciona sozinho

      evento.preventDefault()
      const copia = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: evento.clientX,
        clientY: evento.clientY,
        button: 0,
        buttons: 1,
      })
      copia._doMarkmap = true
      svg.dispatchEvent(copia)
    },
    true, // captura: roda antes do stopPropagation do markmap
  )
}

async function renderizarMapa(container) {
  let markdown = container.querySelector('script[type="text/markdown"]')?.textContent ?? ""
  const src = container.dataset.src

  if (markdown.trim() === "" && src) {
    const resposta = await fetch(src)
    if (!resposta.ok) throw new Error(`mapa mental indisponível (HTTP ${resposta.status})`)
    markdown = await resposta.text()
  }
  if (markdown.trim() === "") throw new Error("mapa mental vazio")

  await carregarLibs()

  const Markmap = window.markmap?.Markmap
  const Transformer = window.markmap?.Transformer
  if (!Markmap || !Transformer) throw new Error("libs do markmap não carregaram")

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  container.innerHTML = ""
  container.appendChild(svg)

  const { root } = new Transformer().transform(markdown)
  const markmap = Markmap.create(svg, OPCOES, root)

  permitirArrastoSobreOsNos(svg)
  adicionarControles(container, markmap)
  window.setTimeout(() => markmap.fit(), 300)
}

export function initMarkmap() {
  // Sem `:has()`: o seletor precisa funcionar em qualquer navegador que o site atenda
  const containers = [...document.querySelectorAll(".markmap")].filter(
    (container) =>
      container.dataset.src !== "" || container.querySelector('script[type="text/markdown"]'),
  )

  for (const container of containers) {
    if (container.querySelector(".markmap-erro")) continue // falhou no build: nada a fazer
    renderizarMapa(container).catch((erro) => {
      console.error("[markmap] falha ao renderizar:", erro)
      mostrarErro(container, `Erro ao carregar mapa mental: ${erro.message}`)
    })
  }
}
