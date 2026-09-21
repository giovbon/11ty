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

const OPCOES = {
  // `autoFit` e `duration` ficam DESLIGADOS de propósito.
  //
  // A lib instala um `ResizeObserver` em cada rótulo que chama `renderData()`
  // (re-render completo) e, com `autoFit`, roda `fit()` no fim de todo render —
  // reenquadrando o mapa debaixo do usuário. Com `duration` > 0 cada render ainda
  // anima o tamanho dos rótulos observados, o que realimenta esse observer.
  // Aqui o enquadramento é nosso: uma vez no primeiro render (e em resize/fullscreen).
  autoFit: false,
  duration: 0,
  // `pan` (ligado por padrão) é só o listener de `wheel` que o markmap registra para
  // *arrastar* o mapa com a roda — somado ao `wheel` do d3-zoom (que amplia), cada
  // entrelinha da roda andava E ampliava. A roda é nossa: `ligarZoomComRoda`.
  pan: false,
  paddingX: 20,
}

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
    // `rescale`/`fit`/`scaleBy` da lib terminam em transição do d3 (rAF): aqui o zoom é
    // aplicado direto, igual à roda e ao arrasto, e dentro da faixa permitida (`escalar`).
    botao("➕", "Aumentar zoom", () => escalar(markmap, markmap.svg.node(), FATOR_DO_BOTAO)),
    botao("➖", "Diminuir zoom", () => escalar(markmap, markmap.svg.node(), 1 / FATOR_DO_BOTAO)),
    botao("🎯", "Centralizar", () => enquadrar(markmap, markmap.svg.node())),
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

const LIMITE_DE_ARRASTO = 4 // px: menos que isso é clique (dobrar/desdobrar nó)
const INTERVALO_DE_QUADRO = 16 // ms: no máximo um `transform` por quadro

// Mesmos padrões que a lib usa no `fit()` dela (replicados para poder enquadrar sem transição).
const ESCALA_MAXIMA_INICIAL = 2
const PROPORCAO_DE_ENQUADRAMENTO = 0.95

// Faixa de zoom: o enquadramento (mapa todo visível) é o mínimo e `FAIXA_DE_ZOOM`
// vezes ele, o máximo. `FAIXA_DE_ZOOM_PADRAO` vale antes do primeiro enquadramento.
const FAIXA_DE_ZOOM = 6
const FAIXA_DE_ZOOM_PADRAO = [0.2, 8]
const FATOR_DO_BOTAO = 1.25 // ➕/➖

// Passo da roda: o mesmo `wheelDelta` padrão do d3-zoom (`2 ** (-deltaY * 0.002)`).
const FATOR_DA_RODA = 0.002
const ESCALA_MAXIMA_DA_RODA = 2 // por evento: trava "picos" (eventos coalescidos)
const ESCALA_MINIMA_DA_RODA = 0.5
const PX_DE_LINHA = 16 // `deltaMode` 1 (linhas)
const PX_DE_PAGINA = 100 // `deltaMode` 2 (páginas)

/**
 * Escala em que o mapa inteiro cabe na caixa (mesma conta do `fit()` da lib).
 *
 * `null` enquanto a lib não terminou o primeiro layout (`state.rect` ainda vazio) ou
 * quando a caixa tem tamanho zero (mapa em aba oculta, por exemplo).
 */
function escalaDeEnquadramento(markmap, svg) {
  const { width, height } = svg.getBoundingClientRect()
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = markmap.state?.rect ?? {}
  const naturalLargura = x2 - x1
  const naturalAltura = y2 - y1
  if (width <= 0 || height <= 0 || naturalLargura <= 0 || naturalAltura <= 0) return null

  return Math.min(
    (width / naturalLargura) * PROPORCAO_DE_ENQUADRAMENTO,
    (height / naturalAltura) * PROPORCAO_DE_ENQUADRAMENTO,
    ESCALA_MAXIMA_INICIAL,
  )
}

/**
 * Enquadra o mapa aplicando o `transform` direto, **sem transição**.
 *
 * O `fit()` da lib termina em `this.svg.transition().duration(...).call(this.zoom.transform, t)`,
 * e transição do d3 depende de `requestAnimationFrame` — que fica congelado com a aba em
 * segundo plano. Resultado: quem abre o link numa aba de fundo (ou volta para ela antes da
 * animação acabar) via o mapa desenquadrado, parecendo travado. Aqui é síncrono e
 * determinístico; `interrupt()` mata qualquer `fit`/zoom animado que tenha ficado pendente.
 */
function enquadrar(markmap, svg) {
  const escala = escalaDeEnquadramento(markmap, svg)
  const identidade = window.d3?.zoomIdentity
  if (!escala || !identidade) return false

  const { width, height } = svg.getBoundingClientRect()
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = markmap.state.rect
  const transform = identidade
    .translate((width - (x2 - x1) * escala) / 2 - x1 * escala, (height - (y2 - y1) * escala) / 2 - y1 * escala)
    .scale(escala)

  markmap.svg.interrupt().call(markmap.zoom.transform, transform)
  // o d3 ainda cuida de `dblclick`/toque: que ele não saia da mesma faixa
  markmap.zoom.scaleExtent(faixaDeZoom(markmap, svg, escala))
  return true
}

/**
 * Faixa de zoom permitida: `[enquadramento, enquadramento * FAIXA_DE_ZOOM]`.
 *
 * Sem faixa, a roda era livre: cada entrelinha multiplica a escala por
 * `2 ** (-deltaY * 0.002)` e uma rolagem de mouse comum (dezenas de eventos) levava o
 * mapa de ~0,9× para **mais de 1000×** — o mapa virava uma mancha gigante; rolando para
 * o outro lado, ele sumia num ponto. Não se volta de nenhum dos dois rolando.
 *
 * É calculada na hora (não guardada) para acompanhar o tamanho da caixa; `kAtual` nunca
 * é "puxado" para dentro da faixa, para um reenquadramento pendente não dar salto.
 */
function faixaDeZoom(markmap, svg, kAtual = 1) {
  const escala = escalaDeEnquadramento(markmap, svg)
  if (!escala) return [...FAIXA_DE_ZOOM_PADRAO]
  return [Math.min(escala, kAtual), Math.max(escala * FAIXA_DE_ZOOM, kAtual)]
}

/**
 * Amplia em torno de um ponto da tela, dentro da faixa permitida e **sem transição**
 * (transição do d3 depende de `requestAnimationFrame`: em aba de fundo não aplica).
 *
 * `ancora` é em coordenadas de cliente (como o `clientX/Y` do evento); sem ela, o zoom
 * sai do centro da caixa. O ponto do conteúdo sob a âncora fica parado — a mesma conta
 * do d3-zoom (`translate(p).scale(k).translate(-p_no_conteudo)`).
 */
function escalar(markmap, svg, fator, ancora) {
  const identidade = window.d3?.zoomIdentity
  const atual = markmap.svg.property("__zoom")
  if (!identidade || !atual) return false

  const [minimo, maximo] = faixaDeZoom(markmap, svg, atual.k)
  const escala = Math.min(Math.max(atual.k * fator, minimo), maximo)
  if (escala === atual.k) return false

  const caixa = svg.getBoundingClientRect()
  const x = ancora ? ancora[0] - caixa.left : caixa.width / 2
  const y = ancora ? ancora[1] - caixa.top : caixa.height / 2
  const conteudo = atual.invert([x, y])

  const transform = identidade.translate(x - conteudo[0] * escala, y - conteudo[1] * escala).scale(escala)
  markmap.svg.interrupt().call(markmap.zoom.transform, transform)
  return true
}

/**
 * Tira do d3-zoom os gestos que nós mesmos fazemos: o arrasto de mouse e a roda.
 *
 * O d3 continua dono do `zoom.transform` (é ele que escreve o `transform` do `<g>` e
 * emite os eventos `zoom` que o markmap escuta) e dos gestos que não tratamos
 * (`dblclick`, toque).
 */
function desligarGestosDoD3(markmap) {
  const NOSSOS = new Set(["mousedown", "wheel"])
  const filtro = markmap.zoom.filter()
  const valido = typeof filtro === "function" ? filtro : () => true
  markmap.zoom.filter((evento, ...resto) => (NOSSOS.has(evento.type) ? false : valido(evento, ...resto)))
}

/**
 * Pan/zoom próprios — o arrasto de mouse é nosso, não do d3-zoom.
 *
 * Dois motivos:
 *  1. o markmap dá `stopPropagation` no `mousedown` de cada rótulo e do círculo, e
 *     o d3-zoom escuta no `<svg>` — por padrão, arrastar em cima de um rótulo não
 *     move nada, e num mapa mental quase tudo é rótulo;
 *  2. o d3-zoom escreve o `transform` a cada `mousemove` — uma repintura completa do
 *     SVG por evento. Aqui o `transform` é aplicado no máximo **uma vez por frame**.
 *
 * Ouvimos em captura (antes do `stopPropagation`) e só assumimos o gesto depois de
 * alguns pixels, para o clique de dobrar/desdobrar continuar intacto — e a seleção
 * de texto do rótulo também, para quem só clica.
 */
function ligarArrasto(svg, markmap, container, aoPegar) {
  const selecao = markmap.svg

  let gesto = null
  let agendado = 0
  let ultimoAplicado = 0
  let acumulado = { x: 0, y: 0 }

  function aplicar() {
    agendado = 0
    if (acumulado.x === 0 && acumulado.y === 0) return
    const atual = selecao.property("__zoom")
    // `translate` do d3 é em unidades anteriores à escala → dividir por k
    selecao.call(markmap.zoom.transform, atual.translate(acumulado.x / atual.k, acumulado.y / atual.k))
    acumulado = { x: 0, y: 0 }
    ultimoAplicado = performance.now()
  }

  /**
   * Aplica o acumulado no máximo uma vez por quadro.
   *
   * De propósito NÃO usa `requestAnimationFrame`: em aba em segundo plano o rAF fica
   * congelado e o mapa pararia de andar. O primeiro movimento aplica na hora e os
   * seguintes, no mesmo quadro, entram no mesmo `setTimeout`.
   */
  function agendar() {
    const decorrido = performance.now() - ultimoAplicado
    if (decorrido >= INTERVALO_DE_QUADRO) {
      aplicar()
      return
    }
    if (!agendado) agendado = window.setTimeout(aplicar, INTERVALO_DE_QUADRO - decorrido)
  }

  function encerrar() {
    if (!gesto) return
    gesto = null
    if (agendado) window.clearTimeout(agendado)
    aplicar() // empurrão final: nunca sobra delta não aplicado
    container.classList.remove("markmap-arrastando")
    window.removeEventListener("mousemove", aoMover, true)
    window.removeEventListener("mouseup", encerrar, true)
  }

  function aoMover(evento) {
    if (!gesto) return

    const dx = evento.clientX - gesto.ultimoX
    const dy = evento.clientY - gesto.ultimoY
    gesto.ultimoX = evento.clientX
    gesto.ultimoY = evento.clientY
    gesto.percorrido += Math.abs(dx) + Math.abs(dy)

    if (!gesto.arrastando) {
      if (gesto.percorrido < LIMITE_DE_ARRASTO) return
      gesto.arrastando = true
      container.classList.add("markmap-arrastando")
      document.getSelection()?.removeAllRanges() // virou arrasto: sem seleção pendurada
      selecao.interrupt() // e sem transição pendente brigando com o nosso transform
    }

    evento.preventDefault()
    acumulado.x += dx
    acumulado.y += dy
    agendar()
  }

  svg.addEventListener(
    "mousedown",
    (evento) => {
      if (evento.button !== 0 || gesto) return
      aoPegar?.() // o usuário assumiu: um enquadramento pendente não pode puxar o mapa
      gesto = { ultimoX: evento.clientX, ultimoY: evento.clientY, percorrido: 0, arrastando: false }
      window.addEventListener("mousemove", aoMover, true)
      window.addEventListener("mouseup", encerrar, true)
    },
    true, // captura: roda antes do stopPropagation do markmap
  )
}

/**
 * Zoom pela roda do mouse — nosso, não do d3-zoom.
 *
 * O que a roda fazia antes (medido: 50 eventos = uma rolagem de mouse levavam o mapa de
 * 0,9× para 1062×):
 *  - o d3-zoom aplica a roda numa **transição** (`duration` 250 ms) e com o `scaleExtent`
 *    padrão (`[0, ∞]`), escrevendo o `transform` — repintura do SVG inteiro — a cada
 *    quadro da animação;
 *  - o markmap também escuta `wheel` no mesmo `<svg>` (`options.pan`, ligado por padrão)
 *    para *arrastar* o mapa, então cada entrelinha andava e ampliava ao mesmo tempo.
 *
 * Aqui: um caminho só, sem transição, dentro da faixa de zoom (`escalar`) e no máximo
 * **uma escrita por quadro** — a mesma técnica do arrasto.
 *
 * A roda continua não rolando a página quando o ponteiro está sobre o mapa (é o
 * comportamento que o site já tinha); rolagem horizontal (`deltaY` zero) passa direto.
 */
function ligarZoomComRoda(svg, markmap, aoUsarARoda) {
  let fator = 1
  let ancora = null
  let agendado = 0
  let ultimoAplicado = 0

  function aplicar() {
    agendado = 0
    if (fator === 1) return
    const acumulado = fator
    fator = 1
    escalar(markmap, svg, acumulado, ancora)
    ultimoAplicado = performance.now()
  }

  function agendar() {
    const decorrido = performance.now() - ultimoAplicado
    if (decorrido >= INTERVALO_DE_QUADRO) {
      aplicar()
      return
    }
    if (!agendado) agendado = window.setTimeout(aplicar, INTERVALO_DE_QUADRO - decorrido)
  }

  svg.addEventListener(
    "wheel",
    (evento) => {
      if (!evento.deltaY) return // roda "horizontal"/trackpad de lado: deixa a página rolar

      evento.preventDefault()
      aoUsarARoda?.()

      const px =
        evento.deltaMode === 1
          ? evento.deltaY * PX_DE_LINHA
          : evento.deltaMode === 2
            ? evento.deltaY * PX_DE_PAGINA
            : evento.deltaY
      // ctrl+roda é o gesto de pinça do trackpad: passos pequenos, então valem ×10 (como no d3-zoom)
      const passo = Math.min(
        ESCALA_MAXIMA_DA_RODA,
        Math.max(ESCALA_MINIMA_DA_RODA, 2 ** (-px * FATOR_DA_RODA * (evento.ctrlKey ? 10 : 1))),
      )

      fator *= passo
      ancora = [evento.clientX, evento.clientY]
      agendar()
    },
    { passive: false },
  )
}

/**
 * Enquadra assim que o primeiro layout sai e para no primeiro sucesso.
 *
 * A janela de espera é generosa de propósito: o render da lib é assíncrono (passa por rAF)
 * e em máquina lenta demora; uma tentativa curta deixaria o mapa desenquadrado. E para de
 * tentar no primeiro toque do usuário — enquadrar por cima de um arrasto já em andamento é
 * justamente o "o mapa pula sozinho". Espera com `setTimeout`, não rAF (aba em segundo plano).
 */
async function enquadrarQuandoPronto(markmap, svg, pendente) {
  for (let i = 0; i < 600 && pendente.enquadramento; i++) {
    if (enquadrar(markmap, svg)) {
      pendente.enquadramento = false
      return
    }
    await new Promise((resolve) => window.setTimeout(resolve, INTERVALO_DE_QUADRO))
  }
  pendente.enquadramento = false
}

/** Reenquadra em resize/tela cheia e quando a aba volta a ficar visível. */
function enquadrarAoMudarDeTamanho(markmap, svg) {
  let espera = 0
  const agendar = () => {
    window.clearTimeout(espera)
    espera = window.setTimeout(() => enquadrar(markmap, svg), 150)
  }
  window.addEventListener("resize", agendar)
  document.addEventListener("fullscreenchange", agendar)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") agendar()
  })
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
  markmap.zoom.scaleExtent([...FAIXA_DE_ZOOM_PADRAO]) // faixa provisória, até o 1º enquadramento

  const pendente = { enquadramento: true }
  const assumir = () => {
    pendente.enquadramento = false
  }

  desligarGestosDoD3(markmap)
  ligarArrasto(svg, markmap, container, assumir)
  ligarZoomComRoda(svg, markmap, () => {
    // Roda antes do primeiro enquadramento: enquadra na hora, para o giro sair do mapa
    // enquadrado e não da posição crua do primeiro layout. Se o enquadramento ainda não
    // é possível, o pendente continua valendo — melhor o mapa se enquadrar sozinho do
    // que ficar desenquadrado.
    if (pendente.enquadramento && enquadrar(markmap, svg)) assumir()
  })
  adicionarControles(container, markmap)
  enquadrarAoMudarDeTamanho(markmap, svg)
  enquadrarQuandoPronto(markmap, svg, pendente).catch((erro) => console.error("[markmap] falha ao enquadrar:", erro))
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
