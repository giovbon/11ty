import * as esbuild from "esbuild"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const watch = process.argv.includes("--watch")

/** Arquivos que o esbuild escreve em src/assets/static (o Eleventy publica em /static). */
const SAIDAS = ["app.js", "app.js.map", "app.css", "app.css.map"]

/**
 * Depois de gerar o bundle:
 *
 *  1. copia para `_site/static/` — em `--serve` o passthrough copy do Eleventy
 *     copia uma vez e não recopia no rebuild incremental, então o navegador
 *     continuaria com o CSS antigo;
 *  2. grava `dev/assetStamp.md` com o mtime do bundle. Isto resolve dois
 *     problemas de uma vez: (a) `dev/` é um WATCH TARGET do Eleventy e o
 *     watcher só reage a extensões que ele conhece (.md; ignora .txt/.json,
 *     `src/_data` e caminhos de passthrough), o que dá o live reload quando o
 *     CSS/JS muda; (b) o mtime vira `?v=` na URL do CSS e do JS, o que impede
 *     o navegador (e o Pages, que também não manda cabeçalho de cache) de
 *     servir asset velho. O arquivo vive fora de `src/`, então não é renderizado.
 */
const publicarAssets = {
  name: "publicar-assets",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) return

      const site = path.join(root, "_site")
      const temSite = fs.existsSync(site)
      if (temSite) fs.mkdirSync(path.join(site, "static"), { recursive: true })

      let carimbo = 0
      for (const nome of SAIDAS) {
        const arquivo = path.join(root, "src/assets/static", nome)
        if (!fs.existsSync(arquivo)) continue

        carimbo = Math.max(carimbo, fs.statSync(arquivo).mtimeMs)
        if (temSite) fs.copyFileSync(arquivo, path.join(site, "static", nome))
      }

      fs.mkdirSync(path.join(root, "dev"), { recursive: true })
      fs.writeFileSync(path.join(root, "dev/assetStamp.md"), `${Math.round(carimbo)}\n`)
    })
  },
}

/**
 * Bundle de JS e CSS do site.
 *
 * Entradas:
 *   src/client/app.js          -> /static/app.js
 *   src/assets/styles/app.css  -> /static/app.css  (importa o CSS de cada componente)
 *
 * Saída em `src/assets/static/`, que o Eleventy copia para `/static/`.
 */
const options = {
  entryPoints: [
    { in: path.join(root, "src/client/app.js"), out: "app" },
    { in: path.join(root, "src/assets/styles/app.css"), out: "app" },
  ],
  outdir: path.join(root, "src/assets/static"),
  bundle: true,
  format: "esm",
  target: ["es2020"],
  minify: !watch,
  sourcemap: watch,
  logLevel: "info",
  plugins: [publicarAssets],
}

if (watch) {
  const context = await esbuild.context(options)
  await context.watch()
  console.log("[assets] watching src/client/** e src/components/**/*.css")
} else {
  await esbuild.build(options)
}
