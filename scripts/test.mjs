import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

/**
 * Portão de testes usado pelo `npm test` (e, portanto, pelo CI antes do build).
 *
 * Por que não chamar o runner direto com o padrão de arquivos: quando esse padrão não casa nada,
 * o `node --test` termina com CÓDIGO 0 e "0 tests" — verificado no Node 24 local e no Node 22 do
 * CI. Ou seja, renomear `test/` ou mexer no padrão deixaria o pipeline verde e o deploy publicaria
 * sem nenhum teste ter rodado. Aqui suíte vazia é erro, com a mensagem dizendo o motivo.
 *
 * (Cuidado ao documentar o padrão num comentário de bloco: a forma canônica dele contém a
 * sequência que FECHA o comentário — foi exatamente assim que este arquivo não compilava.)
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const testDir = path.join(root, "test")

/** Todos os arquivos de teste sob `test/`, em ordem estável (subpastas incluídas). */
function arquivosDeTeste(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((item) => {
      const full = path.join(dir, item.name)
      if (item.isDirectory()) return arquivosDeTeste(full)
      return item.name.endsWith(".test.js") ? [full] : []
    })
    .sort()
}

if (!fs.existsSync(testDir)) {
  console.error(`✖ pasta de testes ausente: ${testDir}`)
  console.error("  sem testes o deploy não pode passar.")
  process.exit(1)
}

const arquivos = arquivosDeTeste(testDir)

if (arquivos.length === 0) {
  console.error("✖ nenhum arquivo *.test.js encontrado em test/ — o deploy não pode passar sem testes.")
  process.exit(1)
}

console.log(`▶ ${arquivos.length} arquivo(s) de teste\n`)

const { status, error } = spawnSync(process.execPath, ["--test", ...arquivos], { stdio: "inherit" })

if (error) {
  console.error(`✖ não foi possível rodar os testes: ${error.message}`)
  process.exit(1)
}

process.exit(status ?? 1)
