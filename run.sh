#!/usr/bin/env bash
#
# run.sh — sobe o site-11ty em modo desenvolvimento (salva, o navegador atualiza).
#
# O script roda três coisas em paralelo:
#   1. `eleventy --serve`  gera o HTML, serve em HTTP e injeta o live reload
#   2. `esbuild --watch`   recompila /static/app.js e /static/app.css
#   3. watch targets       content/, slides/, mindmaps/, codes/ (ver eleventy.config.js)
#
# Uso:
#   ./run.sh                      # porta 8080, base "/"
#   PORT=8081 ./run.sh            # outra porta
#   BASE_URL=/impacta/ ./run.sh   # simula o GitHub Pages em subpasta
set -euo pipefail

# Roda sempre na pasta do script, não importa de onde você chamou.
cd "$(dirname "$0")"

PORT="${PORT:-8080}"
BASE_URL="${BASE_URL:-/}"
export PORT BASE_URL

if ! command -v npm >/dev/null 2>&1; then
  echo "✖ npm não encontrado — instale o Node.js 20+ e tente novamente." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "📦 node_modules ausente — instalando dependências..."
  if [ -f package-lock.json ]; then npm ci; else npm install; fi
fi

# Uma execução anterior pode ter deixado o servidor preso na porta.
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
fi
if command -v lsof >/dev/null 2>&1; then
  lsof -ti:"${PORT}" 2>/dev/null | xargs -r kill -9 2>/dev/null || true
fi

echo "🚀 site-11ty em desenvolvimento"
echo "   abra .... http://localhost:${PORT}${BASE_URL}"
echo "   base .... ${BASE_URL}   (Ctrl+C encerra tudo)"
echo

exec npm run dev
