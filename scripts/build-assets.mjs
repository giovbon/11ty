import * as esbuild from "esbuild"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const watch = process.argv.includes("--watch")

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
}

if (watch) {
  const context = await esbuild.context(options)
  await context.watch()
  console.log("[assets] watching src/client/** and src/components/**/*.css")
} else {
  await esbuild.build(options)
}
