import fs from "node:fs"
import path from "node:path"
import { ROOT, asList } from "../../_lib/content.js"
import { withPrefix } from "../../_lib/urls.js"

/**
 * Componente `asciinema` — gravações de terminal (.cast) tocadas no navegador.
 *
 * Frontmatter:
 *   asciinema: "asciinema/01-init_clone_commit.cast"     # uma gravação
 *   asciinema:                                           # várias
 *     - "asciinema/08-branches.cast"
 *     - "asciinema/09-merge-fast.cast"
 *   asciinema: "08-branches.cast"                        # nome curto também vale
 *
 * O arquivo real mora em `content/static/asciinema/` e é publicado em
 * `/static/asciinema/` — mesma convenção do typst. Existe porque a falta do
 * arquivo deixa o player girando para sempre, sem mensagem de erro: por isso a
 * existência é conferida no build.
 */

const STATIC_DIR = path.join(ROOT, "content", "static")
const LIB_DIR = path.join(ROOT, "src", "assets", "static", "lib", "asciinema")
const PASTA = "asciinema"

const ehRemoto = (valor) => /^https?:\/\//i.test(valor)

function capitalizar(valor) {
  return valor.charAt(0).toUpperCase() + valor.slice(1)
}

function normalizar(entrada) {
  const bruto = typeof entrada === "string" ? { path: entrada } : entrada
  if (!bruto || typeof bruto !== "object" || typeof bruto.path !== "string" || !bruto.path.trim()) {
    return null
  }

  const origem = bruto.path.trim()
  const remoto = ehRemoto(origem)
  const semPrefixo = origem.replace(/^\/?(static\/)?/, "")
  const logico = semPrefixo.startsWith(`${PASTA}/`) ? semPrefixo : `${PASTA}/${semPrefixo}`
  const nome = path.basename(logico).replace(/\.cast$/i, "")

  return {
    origem,
    arquivo: logico,
    titulo: typeof bruto.name === "string" && bruto.name.trim() ? bruto.name.trim() : capitalizar(nome),
    url: remoto ? origem : withPrefix(`/static/${logico}`),
    existe: remoto || fs.existsSync(path.join(STATIC_DIR, logico)),
  }
}

/** Dados do componente (ou null quando o frontmatter não declara `asciinema`). */
export function buildAsciinema(frontmatter) {
  const gravacoes = asList(frontmatter?.asciinema).map(normalizar).filter(Boolean)
  if (gravacoes.length === 0) return null

  for (const gravacao of gravacoes) {
    if (!gravacao.existe) {
      console.error(
        `[asciinema] gravação não encontrada: content/static/${gravacao.arquivo} (declarada no frontmatter)`,
      )
    }
  }

  for (const arquivo of ["asciinema-player.min.js", "asciinema-player.css"]) {
    if (!fs.existsSync(path.join(LIB_DIR, arquivo))) {
      console.error(`[asciinema] lib ausente: src/assets/static/lib/asciinema/${arquivo}`)
    }
  }

  return { gravacoes }
}

/** HTML do componente (string vazia quando não há gravações). */
export function renderAsciinema(frontmatter) {
  const dados = buildAsciinema(frontmatter)
  if (!dados) return ""

  const players = dados.gravacoes
    .map(
      (gravacao) => `    <div class="asciinema-wrapper">
      <h4 class="asciinema-title">${gravacao.titulo}</h4>
      <div class="asciinema" data-src="${gravacao.url}">
        <div class="asciinema-loading">Carregando gravação do terminal...</div>
      </div>
    </div>`,
    )
    .join("\n")

  return `<div class="asciinema-container">
${players}
  </div>`
}
