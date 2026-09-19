import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Copia libs que vêm do npm para dentro de `src/assets/static/lib/`, para o site
 * não depender de CDN em runtime (e para o build ser reprodutível).
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const LIBRARIES = [
  {
    nome: "jszip",
    origem: "node_modules/jszip/dist/jszip.min.js",
    destino: "src/assets/static/lib/jszip/jszip.min.js",
  },
  {
    nome: "d3",
    origem: "node_modules/d3/dist/d3.min.js",
    destino: "src/assets/static/lib/markmap/d3.min.js",
  },
  {
    nome: "markmap-lib",
    origem: "node_modules/markmap-lib/dist/browser/index.iife.js",
    destino: "src/assets/static/lib/markmap/markmap-lib.iife.js",
  },
  {
    nome: "markmap-view",
    origem: "node_modules/markmap-view/dist/browser/index.js",
    destino: "src/assets/static/lib/markmap/markmap-view.js",
  },
]

for (const lib of LIBRARIES) {
  const origem = path.join(root, lib.origem)
  const destino = path.join(root, lib.destino)

  if (!fs.existsSync(origem)) {
    console.warn(`[vendor] ${lib.nome}: não encontrado em ${lib.origem} (rode npm install)`)
    continue
  }

  fs.mkdirSync(path.dirname(destino), { recursive: true })
  fs.copyFileSync(origem, destino)
  console.log(`[vendor] ${lib.nome} -> ${lib.destino}`)
}
