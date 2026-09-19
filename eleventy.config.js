import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { withPrefix } from "./src/_lib/urls.js"
import { renderPresentation } from "./src/components/presentation/render.js"
import { renderTypst } from "./src/components/typst/render.js"
import { renderCodes } from "./src/components/codes/render.js"
import { renderSubmission } from "./src/components/submission/render.js"
import { renderAsciinema } from "./src/components/asciinema/render.js"
import { renderMarkmap } from "./src/components/markmap/render.js"

/**
 * Configuração do Eleventy.
 *
 * Regras do projeto (ver MODELO.md):
 *  - `content/`, `slides/`, `mindmaps/`, `codes/` são SOMENTE LEITURA e ficam fora daqui.
 *  - Nada de SPA: cada navegação é um carregamento novo.
 *  - 1 chave de frontmatter = 1 componente (src/components/<nome>/).
 */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src")
  eleventyConfig.setOutputDirectory("_site")
  eleventyConfig.setIncludesDirectory("_includes")
  eleventyConfig.setDataDirectory("_data")
  eleventyConfig.setTemplateFormats(["njk"])

  // O Eleventy usa o `.gitignore` como lista de exclusão do WATCHER. Como os
  // artefatos de build estão lá (`src/assets/static/app.css`, `app.js`, `dev/`),
  // salvar qualquer CSS/JS não disparava rebuild nenhum — o `--serve` ficava no
  // ar servindo a versão antiga. Aqui a exclusão passa a ser só o que o Eleventy
  // já ignora por padrão (node_modules, _site, .cache).
  eleventyConfig.setUseGitIgnore(false)

  // CSS e JS do próprio site (o CSS é bundlado por scripts/build-assets.mjs)
  eleventyConfig.addPassthroughCopy({ "src/assets/static": "static" })

  // Assets publicados do conteúdo: content/static/**  ->  /static/**
  // (gravações .cast, exercícios .typ, imagens usadas nas páginas)
  eleventyConfig.addPassthroughCopy({ "content/static": "static" })

  // O conteúdo é lido como DADO (src/_lib/content.js), não como template — ou seja,
  // vive fora de src/ e o Eleventy não o observaria sozinho. Sem isto, salvar um
  // .md em content/ (ou um slide/mapa/exercício) não atualizaria o site no dev.
  // `dev/` entra na lista porque é onde o esbuild grava o carimbo dos assets: o
  // watcher do Eleventy não reage a `src/_data` nem a caminhos de passthrough,
  // então um watch target dedicado é o que dispara o rebuild quando o CSS muda.
  for (const dir of ["content", "slides", "mindmaps", "codes", "dev"]) {
    eleventyConfig.addWatchTarget(`./${dir}/`)
  }

  /**
   * Carimbo dos assets (`?v=` no base.njk), gravado pelo esbuild a cada bundle.
   * Em dev, uma aba antiga pode continuar com o `app.css` velho porque o servidor
   * de desenvolvimento não manda cabeçalho de cache; com `?v=` a URL muda e o
   * navegador é obrigado a baixar de novo (vale para o dev e para o Pages).
   */
  const raiz = path.dirname(fileURLToPath(import.meta.url))
  eleventyConfig.addGlobalData("assetStamp", () => {
    try {
      const version = fs.readFileSync(path.join(raiz, "dev/assetStamp.md"), "utf8").trim()
      return { version: version || "0" }
    } catch {
      return { version: "0" }
    }
  })

  // Projetos em /mnt/c (WSL) NÃO recebem eventos do inotify — nem para o que é
  // salvo pelo Windows, nem para o que é salvo dentro do WSL. Sem polling, o
  // `--serve` fica no ar sem nunca perceber mudança nenhuma.
  //   WATCH_POLLING=1  força ligado    WATCH_POLLING=0  força desligado
  const emDiscoDoWSL = process.platform === "linux" && /^\/mnt\/[a-z]\//.test(process.cwd())
  const polling = process.env.WATCH_POLLING === "1" || (process.env.WATCH_POLLING !== "0" && emDiscoDoWSL)

  if (polling) {
    eleventyConfig.setChokidarConfig({
      usePolling: true,
      interval: 200,
      binaryInterval: 500,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
    })
  }

  // Prefixo de URL (ex.: BASE_URL=/impacta/ para GitHub Pages em subpasta)
  eleventyConfig.addFilter("link", (url) => withPrefix(url))

  // Datas em pt-BR, sem depender de plugin externo
  const dateBR = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  eleventyConfig.addFilter("data", (value) => dateBR.format(new Date(value)))
  eleventyConfig.addFilter("dataISO", (value) => new Date(value).toISOString().slice(0, 10))

  // Um filtro por componente: frontmatter entra, HTML do componente sai.
  // Ver src/components/<nome>/ (render.js + styles.css + client.js).
  eleventyConfig.addFilter("presentation", (frontmatter) => renderPresentation(frontmatter))
  eleventyConfig.addFilter("typst", (frontmatter) => renderTypst(frontmatter))
  eleventyConfig.addFilter("codes", (frontmatter) => renderCodes(frontmatter))
  eleventyConfig.addFilter("submission", (frontmatter) => renderSubmission(frontmatter))
  eleventyConfig.addFilter("asciinema", (frontmatter) => renderAsciinema(frontmatter))
  eleventyConfig.addFilter("markmap", (frontmatter) => renderMarkmap(frontmatter))

  // No `--serve`, o padrão do Eleventy copia os passthrough uma única vez e não os
  // recopia em rebuild incremental; quem publica a saída do esbuild no dev é
  // scripts/dev.mjs (ver MODELO.md §4.1).

  eleventyConfig.setServerOptions({
    port: Number.parseInt(process.env.PORT ?? "", 10) || 8080,
    showAllHosts: false,
  })

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  }
}
