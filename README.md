# site-11ty — site de materiais de aula

Abre a navegação com `[` (ou Ctrl+B); fecha com `Esc`. Não há botão de abrir na interface.

Projeto **separado** do site Quartz que existe na raiz do repositório. Este projeto é autocontido:
conteúdo, slides, mapas mentais, códigos e libs vivem todos aqui dentro.

## Requisitos

- Node 22+ (no WSL: `wsl bash -ic "..."` se o node não estiver no PATH do Windows)

## Comandos

```bash
./run.sh         # sobe o servidor de desenvolvimento (é o que você usa no dia a dia)
npm install
npm run dev      # o mesmo, sem o run.sh (servidor em http://localhost:8080)
npm run build    # limpa _site/ e gera de novo
npm test         # testes dos módulos puros
npm run clean    # apaga _site/
```

`./run.sh` roda Eleventy (`--serve`, com live reload), o esbuild em watch e o watch de
`content/`, `slides/`, `mindmaps/` e `codes/`: **salvar qualquer arquivo reconstrói o site e o
navegador recarrega sozinho**. Opções:

```bash
PORT=8081 ./run.sh                  # outra porta
BASE_URL=/11ty/ ./run.sh            # simular o Pages em subpasta
```

> Em `/mnt/c` (WSL) o filesystem não emite eventos de arquivo. O `eleventy.config.js` liga o
> *polling* sozinho nesse caso — sem ele, o servidor fica no ar sem perceber nenhuma mudança.
> `WATCH_POLLING=1`/`0` força ligado/desligado.

## Publicação

O site é publicado pelo GitHub Actions a partir de um **repositório separado**
(`giovbon/11ty`), então o Pages do repositório `impacta` (Quartz) não é afetado:
[`.github/workflows/deploy.yaml`](.github/workflows/deploy.yaml) roda `npm ci`, `npm test`,
`npm run build` com `BASE_URL=/11ty/` e publica `_site/`. Sem secrets (OIDC).

Antes do primeiro deploy, o Pages do repositório precisa estar habilitado com
*Source: GitHub Actions* (Settings → Pages): se o job rodar com o Pages ainda desligado,
o `configure-pages` falha com `Not Found`.

Para um build local igual ao de produção:

```bash
BASE_URL=/11ty/ npm run build
```

## Estrutura

```
content/    aulas em markdown (o frontmatter aciona os componentes) + static/ (assets publicados)
slides/     decks reveal.js (.md), lidos em tempo de build
mindmaps/   mapas mentais (.md), lidos em tempo de build
codes/      árvores de código do explorer (.zcode)
docs/       PROPOSTA.md (contrato), MODELO.md (arquitetura) e SLIDES.md (guia dos decks)
scripts/    dev.mjs (serve + watch), build-assets.mjs (esbuild) e vendor-libs.mjs
run.sh      sobe o ambiente de desenvolvimento
src/        _lib (leitura do conteúdo), _data, _includes, pages, components, assets, client
_site/      saída do build (não versionada)
```

## Regras do projeto

1. Nada lê pastas fora de `site-11ty/`.
2. Um componente = uma pasta (`src/components/<nome>/`).
3. Asset que precisa chegar ao navegador mora em `content/static/**` → publicado em `/static/**`.
4. Pastas `oculto/` não são publicadas.
5. Sem SPA: cada navegação é um carregamento novo.

Detalhes e roadmap: [`MODELO.md`](MODELO.md).
