# MODELO — site de materiais de aula (Eleventy)

Documento vivo da construção. Substitui o texto de proposta como **fonte da verdade da arquitetura**;
o contrato funcional detalhado (frontmatter, componentes, armadilhas, critérios de aceitação) está em
[`docs/PROPOSTA.md`](docs/PROPOSTA.md).

---

## 1. Escopo e fronteira (regra dura)

- **Este projeto é autocontido.** Tudo que ele usa está dentro de `site-11ty/`:
  `content/`, `slides/`, `mindmaps/`, `codes/`, `src/assets/static/lib/`.
- **Nada de referência para fora da pasta** (nada de `../content`, `../quartz`, etc.).
  Se um recurso precisar de um arquivo, ele é copiado para dentro.
- O projeto Quartz (`quartz/`, `quartz.config.ts`, `content/` na raiz…) é **outro projeto** e
  não é tocado nem lido por aqui.

```
site-11ty/
├─ content/          # markdown das aulas + static/ (assets publicados)
├─ slides/           # decks reveal (.md), lidos em build
├─ mindmaps/         # mapas mentais (.md), lidos em build
├─ codes/            # árvores de código (.zcode), lidas em build
├─ docs/             # PROPOSTA.md (contrato) e este MODELO
├─ scripts/          # dev / build do JS
├─ src/              # código do site (layouts, componentes, estilos, cliente)
└─ _site/            # saída do build
```

## 2. Decisões fechadas

| Assunto | Decisão | Por quê |
|---|---|---|
| Gerador | **Eleventy 3** (estável), ESM | Data cascade combina com o esquema "frontmatter aciona componente" |
| Templates | **Nunjucks** + markdown-it | Simples, sem build extra |
| Navegação | **Recarga normal** (sem SPA) | Elimina a classe de bug de reinicialização de componente |
| Tema | **Só dark** | Coerência com aula projetada; metade do trabalho de tokens |
| Slides | **reveal.js vendorizado**, deck embutido na página | Mesma experiência do site atual |
| Typst | **Compilado no navegador** (WASM vendorizado) | Sem dependência de binário no build/CI |
| Entrega de exercícios | **Google Apps Script existente** | Zero backend novo; contrato já testado |
| Busca | Pagefind (Fase 2) | Menos código que reimplementar índice |
| Assets publicados | `content/static/**` → `/static/**` | Regra que evita o bug de asset 404 |

**Escopo da v1** (4 componentes): `presentation` (reveal), `typst`, `codes` (explorer), `submission`.
Fase 1.1: `asciinema`, `markmap`. Fase 2: busca, tags, RSS, sitemap, backlinks, popovers.

## 3. Princípios de organização

1. **1 chave de frontmatter = 1 componente = 1 pasta** em `src/components/<nome>/`
   (markup `.njk`, estilo `.css`, cliente `.js`), e um `partials` que o injeta no layout.
2. **Layout monta slots**, nunca features: `base.njk` = sidebar + conteúdo + sumário + rodapé.
3. **Conteúdo é dado, não template**: os `.md` de `content/` são lidos por `src/_lib/content.js`,
   interpretados (frontmatter) e renderizados por nós — assim o markdown fica intocado.
4. **URL = caminho**: `content/CTT/Git/04-x.md` → `/CTT/Git/04-x/`; `content/index.md` → `/`.
   Pastas geram página de listagem com filhos ordenados por `order`.
5. **Nada em `oculto/`** é publicado (mesma regra do projeto antigo).
6. **Datas**: `mtime` do arquivo (nunca `birthtime` — em WSL/DrvFs vem 0).

## 4. Pipeline

```bash
./run.sh          # servidor de desenvolvimento (detalhes em 4.1)
npm install
npm run dev       # Eleventy --serve (8080) + esbuild --watch
npm run build     # clean + vendor + esbuild (minify) + Eleventy -> _site/
npm test          # testes dos módulos puros (runner nativo do Node, sem deps)
npm run clean     # apaga _site/
BASE_URL=/impacta/ npm run build   # deploy em subpasta (GitHub Pages)
```

Caminhos com `BASE_URL`: toda URL interna passa pelo filtro `| link` nos templates
(`src/_lib/urls.js`), então o mesmo build serve raiz ou subpasta.

### 4.1 `run.sh`

`./run.sh` sobe tudo em paralelo: Eleventy (`--serve`, que injeta o live reload na página), esbuild
em modo watch e os watch targets de `content/`, `slides/`, `mindmaps/` e `codes/`. Salvar qualquer
um desses arquivos reconstrói o site e **o navegador recarrega sozinho**.

```bash
./run.sh                            # porta 8080, base /
PORT=8081 ./run.sh                  # outra porta
BASE_URL=/11ty/ ./run.sh            # simular o Pages em subpasta
```

Armadilhas que já estão resolvidas (todas custaram diagnóstico):

| Sintoma | Causa | Solução |
|---|---|---|
| Salva o arquivo e o site não muda | `/mnt/c` **não entrega eventos de inotify** — nem para o que o Windows grava, nem para o que o WSL grava | `setChokidarConfig({ usePolling: true })` automático quando o `cwd` casa com `/mnt/<letra>/`; `WATCH_POLLING=1`/`0` força ligado/desligado |
| Salva um `.md` e o site não muda | `content/`, `slides/`, `mindmaps/`, `codes/` são lidos como dado, fora de `src/` | `addWatchTarget` em cada um deles |
| Salva CSS/JS e **nada** acontece | o Eleventy usa o `.gitignore` como lista de **exclusão do watcher** — e o bundle está lá (`src/assets/static/app.*`) | `setUseGitIgnore(false)`. Para conferir: `DEBUG='Eleventy*' npx eleventy --watch` imprime `Ignoring watcher changes to:`. |
| O rebuild acontece mas o navegador continua com o CSS antigo | em `--serve` o passthrough copy copia uma vez e não recopia no rebuild incremental | o plugin `publicar-assets` (`scripts/build-assets.mjs`) copia o bundle para `_site/static/` |
| Aba aberta há tempos mostra CSS velho | o servidor de dev não manda `Cache-Control`/`ETag` | `?v=` com o mtime do bundle (`dev/assetStamp.md` → global data `assetStamp` no `base.njk`) |
| Página de uma aula removida continua no ar | `--serve` não apaga de `_site` a saída de um template que deixou de existir | `_site` é apagado ao iniciar o dev (`scripts/dev.mjs`) e antes de `npm run build`, que começa com `clean` |

### 4.2 Publicação (GitHub Pages)

O `site-11ty` é um **repositório separado** (`giovbon/11ty`), com Pages próprio: o Pages do
repositório `impacta` continua servindo o Quartz, sem os dois se sobrescreverem. O workflow
[`.github/workflows/deploy.yaml`](.github/workflows/deploy.yaml) roda `npm ci`, `npm test`,
`npm run build` (com `BASE_URL=/11ty/`) e publica `_site/` com `actions/deploy-pages`.
**Sem secrets**: a autenticação é OIDC do próprio Actions.

Para ligar: criar o repositório vazio, adicionar o remoto e, em *Settings → Pages*, escolher
**Source: GitHub Actions** — isso **antes** de o workflow rodar: se o Pages ainda não estiver
habilitado, o `configure-pages` falha com `Not Found`. Só então fazer push da `main`. A URL final é
`https://giovbon.github.io/11ty/` — se o nome do repositório mudar, ajuste o `BASE_URL` no bloco
`env:` do workflow.

### 4.3 Navegação e leitura

- A árvore de navegação vive numa **gaveta** sobreposta, **fechada por padrão**. Abre pela tecla
  `[` ou por `Ctrl+B` (não existe botão de abrir na interface — decisão do projeto); fecha com
  `Esc`, com o ✕ ou clicando no fundo escurecido. O foco entra no painel ao abrir e sai ao fechar;
  fechada, a gaveta sai da ordem de tabulação (`visibility: hidden`).
- Cada pasta é um `<details>`: **colapsada por padrão**, e só a **cadeia da página atual** vem
  aberta (com a página destacada). O nome da pasta continua sendo link para a página dela.
- **Links externos abrem em nova aba** (`target="_blank" rel="noopener noreferrer"`), em duas
  camadas: o markdown do conteúdo sai pronto do build (`content.js`) e uma varredura no cliente
  (`app.js`) cobre o que nasce no DOM — os links dos slides, montados pelo reveal.
- **Sem trilha (breadcrumbs)** acima do título e **sem painel "Nesta página"**: o conteúdo usa a
  largura toda, com a coluna de leitura em `--content-w` (`tokens.css`, hoje `100ch`) e os
  componentes (deck, explorer) na largura cheia do shell. Os dados `breadcrumbs` e `toc` continuam
  sendo calculados em `src/_lib/content.js`, prontos para reuso.
- **Sem data nem tempo de leitura** abaixo do título: `partials/meta.njk` foi removido junto com o
  painel lateral, porque não havia outra informação nele.

### 4.4 Código e slides

- **Realce de sintaxe em um só lugar**: o tema `src/assets/styles/syntax.css` (classes `.hljs-*`) é
  usado pelos três consumidores — conteúdo da aula (realçado **no build**, via highlight.js do
  node_modules, sem JS no cliente), deck (plugin do reveal + highlight.js vendorizado) e explorador
  de código (highlight.js no navegador, porque os arquivos são escolhidos pelo usuário).
- O bloco do conteúdo sai como `<code class="hljs language-x" data-lang="x">`; o `data-lang`
  alimenta o selo de linguagem no canto do `<pre>`.
- **O reveal aceita quase tudo em markdown** (`docs/SLIDES.md` é o guia do autor): realce de linha
  por passo com ```` ```js [1-2|4] ````, `data-auto-animate` + `data-id`, fragmentos com
  `<!-- .element: class="fragment" -->`, notas com `Note:`. O que não funciona é markdown dentro de
  tag HTML (o `**negrito**` sai literal).
- A capa do deck é a classe `slide-cover` (`kicker` + heading + `rule` + `sub` + `meta` + `num`
  opcional), com brilho radial em CSS — sem imagem externa.

## 5. Como adicionar um componente (receita)

1. `src/components/<nome>/render.js` — lê o frontmatter e devolve **os dados + o HTML**
   do componente (função `render<Nome>(frontmatter)`), exportada e registrada como
   filtro Nunjucks no `eleventy.config.js`.
2. `src/components/<nome>/styles.css` — importado em `src/assets/styles/app.css`.
3. `src/components/<nome>/client.js` — comportamento no navegador (roda uma vez, no load),
   chamado a partir de `src/client/app.js`.
4. Usar no layout: `{{ item.frontmatter | <nome> | safe }}`.
   Um componente **sem dado no frontmatter devolve string vazia** e não renderiza nada.

Regras: o componente não conhece o layout (não assume sidebar nem sumário); o CSS fica
sempre escopado (`.deck .reveal ...`); nenhuma outra parte do site pode importar de
`src/components/<outro-componente>/`.

## 6. Testes

`npm test` usa o runner nativo do Node (`node --test`) — **sem dependências de teste**. Os testes
cobrem só o que é determinístico e não depende de navegador:

| Arquivo | Cobre |
|---|---|
| `test/core.test.js` | `asList`, `buildFolders`/`buildNavigation` (com fixtures), `getEntries` sobre o conteúdo real (39 páginas, URLs, breadcrumbs, frontmatter dos componentes), `resolveUrl`/`getBaseUrl` (incluindo subpasta) |
| `test/zip.test.js` | validação do anexo: extensão, vazio, 20 MB (limite exato) e assinatura PK (PDF renomeado) |
| `test/codes.test.js` | `parseZCode`: árvore, recorte da indentação, linguagem do bloco, pasta seguida de bloco, e o `codes/selenium1.md` real |
| `test/render.test.js` | HTML dos seis componentes: deck sem frontmatter e com 2 decks, caminhos do asciinema/typst, markmap local/remoto/ausente, contrato do formulário (campos, escolha múltipla e a URL do Apps Script) |

Regra: teste não sobe servidor nem rede. O que depende de navegador (reveal, player, markmap,
formulário ao vivo) continua sendo verificado manualmente na seção 9.

## 7. Estado atual

| Item | Status |
|---|---|
| Fase 0 — esqueleto, layout dark, sidebar por `order`, páginas de pasta, TOC, 404 | ✅ |
| Fase 1 — Presentation (reveal) | ✅ deck de 25 slides, navegação, controles, tela cheia, relayout |
| Fase 1 — Typst (compilar/baixar PDF) | ✅ botão por exercício, compila no navegador, PDF validado |
| Fase 1 — CodeExplorer (`.zcode`) | ✅ árvore, seleção com highlight, A+/a-, copiar, tela cheia (Esc), ZIP |
| Fase 1 — SubmissionForm (Apps Script) | ✅ validações, prazos reais da planilha, POST testado contra o deploy |
| Fase 1.1 — Asciinema (`.cast`) | ✅ player vendorizado, 4 gravações na aula do CTT, playback validado |
| Fase 1.1 — Markmap (mapa mental) | ✅ libs vendorizadas sob demanda, 66 nós no roadmap do CTT, zoom/centralizar/tela cheia |
| Infra — `run.sh` + watch no WSL | ✅ live reload validado no navegador (edição de `.md` e de CSS) |
| Infra — navegação em gaveta, pastas colapsáveis, sem sumário/meta | ✅ atalhos `[` e `Ctrl+B`, `Esc`, foco gerenciado, sem botão |
| Infra — workflow de deploy | ✅ escrito, ainda não exercitado (falta criar o repositório) |
| Fase 2 — busca, tags, RSS, sitemap, backlinks, popovers | ⏳ |

Pendência conhecida: o caminho de **vários decks na mesma página** (teclado por hover/foco)
está implementado, mas nenhuma aula usa 2+ decks hoje — falta um caso real para validar.

Sobre o Typst: a lib (28 MB de WASM) é baixada **só no primeiro clique** e memoizada na página;
por isso os caminhos de `data-bundle`/`data-wasm` já saem prontos no HTML (com `BASE_URL` aplicado)
e o client não precisa remontar URL. O aviso "deprecated parameters for the initialization
function" vem do próprio bundle do Typst e é o mesmo comportamento do projeto anterior.

Sobre a entrega (`submission`): o protocolo foi portado **linha a linha** de
`quartz/components/scripts/submission.inline.ts` (XHR com `timeout`, campos repetidos na query
string por causa do 302 do Apps Script, duplicidade de 24h tratada como sucesso, aviso extra em
404). Verificado contra o deploy real: `listarAtividades` e `buscarAtividade` retornam os dados da
planilha, e o POST é aceito/recusado com o JSON esperado. **Não verificado**: o caminho de sucesso
com RA real (entrega gravada + comprovante), que exige um aluno cadastrado.

Arquivos de apoio para testar o anexo em `site-11ty/.tmp-tests/` (`real.zip`, `falso.zip`) — recrie
`grande.zip` (>20 MB) quando precisar testar o limite de tamanho.

Sobre o asciinema: a lib (`asciinema-player`) foi vendorizada em
`src/assets/static/lib/asciinema/` e só entra no `<head>` das páginas com `asciinema:` no
frontmatter. As gravações vivem em `content/static/asciinema/*.cast` (publicadas em
`/static/asciinema/`) e a **existência do arquivo é conferida no build** — sem isso o player fica
girando para sempre, sem mensagem de erro. As opções do player ficam no `client.js` (são iguais
para todos) e o HTML carrega só `data-src`.

Ordem de leitura na página da aula (do topo para baixo): **deck** (teoria) → **mapa mental**
→ **asciinema** (terminal) → **typst** (exercício) → conteúdo em markdown → **código** (explorer)
→ **entrega**.

Sobre o markmap: o markdown de `mindmaps/` é embutido no HTML em tempo de build (igual aos slides)
e as libs (d3 + markmap-lib + markmap-view, vendorizadas de `node_modules`) só são baixadas em
páginas que têm mapa mental — nada disso entra no `app.js`. O `client.js` injeta os três scripts
na ordem certa (d3 primeiro; a view depende do `d3` global).

Antes de cada componente: conferir a seção correspondente de `docs/PROPOSTA.md` (contrato e armadilhas).
