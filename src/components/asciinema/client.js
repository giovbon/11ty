/**
 * Componente `asciinema` — inicializa os players das gravações (.cast).
 *
 * As opções ficam aqui (e não em data-attributes) porque são as mesmas para
 * todos os players do site; o HTML carrega apenas `data-src`.
 */

const OPCOES = {
  theme: "asciinema",
  speed: 1,
  idleTimeLimit: 2,
  poster: "npt:0:0",
  fit: "width",
  terminalFontSize: "14px",
}

export function initAsciinema() {
  const elementos = document.querySelectorAll(".asciinema[data-src]")
  if (elementos.length === 0) return

  if (!window.AsciinemaPlayer) {
    console.error("[asciinema] player não carregou (ver /static/lib/asciinema)")
    return
  }

  for (const elemento of elementos) {
    const src = elemento.getAttribute("data-src")
    if (!src) continue

    try {
      elemento.innerHTML = ""
      window.AsciinemaPlayer.create(src, elemento, OPCOES)
    } catch (erro) {
      console.error("[asciinema] falha ao iniciar o player:", erro)
      elemento.innerHTML = `<div class="asciinema-erro">Não foi possível carregar a gravação (${src}).</div>`
    }
  }
}
