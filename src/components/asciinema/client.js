import { resolveUrl } from "../../client/shared/urls.js"

/**
 * Componente `asciinema` — inicializa os players das gravações (.cast).
 *
 * A gravação vem fechada (sanfona) porque é material de consulta, não leitura linear; o
 * player só é montado — e a lib de 155 KB só é baixada — quando alguém abre a primeira.
 * Página que lista gravações passa a custar isso só para quem realmente assiste.
 *
 * As opções ficam aqui (e não em data-attributes) porque são as mesmas para todos os
 * players do site; o HTML carrega apenas `data-src`.
 */

const OPCOES = {
  theme: "asciinema",
  speed: 1,
  idleTimeLimit: 2,
  poster: "npt:0:0",
  fit: "width",
  terminalFontSize: "14px",
}

const LIB = "/static/lib/asciinema/asciinema-player.min.js"

let carregando = null

/** Baixa a lib do player uma única vez, na primeira gravação aberta. */
function carregarPlayer() {
  if (window.AsciinemaPlayer) return Promise.resolve()

  if (!carregando) {
    carregando = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = resolveUrl(LIB)
      script.onload = () =>
        window.AsciinemaPlayer ? resolve() : reject(new Error("a lib não expôs AsciinemaPlayer"))
      script.onerror = () => reject(new Error(`falha ao carregar ${LIB}`))
      document.head.appendChild(script)
    }).catch((erro) => {
      carregando = null // deixa tentar de novo na próxima abertura
      throw erro
    })
  }

  return carregando
}

async function montar(elemento) {
  if (elemento.dataset.montado) return

  const src = elemento.getAttribute("data-src")
  if (!src) return

  // Marcado ANTES do await: dois cliques seguidos não montam dois players no mesmo lugar.
  elemento.dataset.montado = "1"

  try {
    await carregarPlayer()
    elemento.innerHTML = ""
    elemento.player = window.AsciinemaPlayer.create(src, elemento, OPCOES)
  } catch (erro) {
    console.error("[asciinema] falha ao iniciar o player:", erro)
    elemento.innerHTML = `<div class="asciinema-erro">Não foi possível carregar a gravação (${src}).</div>`
    delete elemento.dataset.montado // abrir de novo tenta outra vez
  }
}

export function initAsciinema() {
  for (const elemento of document.querySelectorAll(".asciinema[data-src]")) {
    const item = elemento.closest(".asciinema-item")

    if (item) {
      // Sanfona: monta ao abrir e pausa ao fechar (gravação tocando escondida é CPU à toa).
      if (item.open) {
        montar(elemento)
      } else {
        item.addEventListener("toggle", () => {
          if (item.open) montar(elemento)
          else elemento.player?.pause?.()
        })
      }
      continue
    }

    montar(elemento) // sem sanfona em volta: monta direto
  }
}
