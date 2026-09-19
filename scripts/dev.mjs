import { spawn, spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const isWindows = process.platform === "win32"

// O Eleventy --serve NÃO apaga em _site a saída de um arquivo removido: apagar
// content/AULA.md com o servidor no ar deixaria /AULA/ vivo (e sem link nenhum).
// Limpar aqui garante que o que você vê no dev é o conteúdo atual.
fs.rmSync(path.join(root, "_site"), { recursive: true, force: true })

// Libs de npm que precisam existir em src/assets/static/lib antes do build.
spawnSync(process.execPath, [path.join(root, "scripts/vendor-libs.mjs")], {
  stdio: "inherit",
  cwd: root,
})

// Gera o bundle e o carimbo de uma vez antes de subir o Eleventy: assim o
// primeiro HTML já sai com `?v=` correto (o esbuild em watch só escreve depois).
spawnSync(process.execPath, [path.join(root, "scripts/build-assets.mjs")], {
  stdio: "inherit",
  cwd: root,
})

const children = [
  spawn("npx", ["eleventy", "--serve"], { stdio: "inherit", cwd: root, shell: isWindows }),
  spawn(process.execPath, [path.join(root, "scripts/build-assets.mjs"), "--watch"], {
    stdio: "inherit",
    cwd: root,
  }),
]

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
