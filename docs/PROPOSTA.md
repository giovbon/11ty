# Proposta: reconstruir o site de materiais de aula (Impacta) em Eleventy

> **Documento de especificação para execução por uma IA ou dev sem contexto prévio.**
> Leia o documento inteiro antes de escrever qualquer código. Itens marcados como **REGRA** são obrigatórios.
> Versão 1.0 — escrita a partir do site Quartz v4.5.2 em produção (`quartz.config.ts`, `quartz.layout.ts`, `content/`).

> **Atualização (2026-09-19) — projeto autocontido.** O projeto vive isolado em `site-11ty/` e
> **não lê nada fora dele**: `content/`, `slides/`, `mindmaps/`, `codes/` e as libs vendorizadas
> (`src/assets/static/lib/`) estão todos dentro da pasta. Onde este documento citar caminhos na raiz
> do repositório (inclusive `quartz/static/lib/`), leia-se o equivalente dentro de `site-11ty/`.
> Decisões fechadas e estado atual: [`../MODELO.md`](../MODELO.md).

---

## 0. Regras invioláveis (leia primeiro)

1. **REGRA**: o novo site vive em `site-11ty/`. **Não** altere, mova ou apague nada de `quartz/`, `quartz.config.ts`, `quartz.layout.ts` ou `node_modules/`.
2. **REGRA**: **nunca** altere `quartz/google-sheets-apps-script.gs`. É o backend do formulário de entrega em produção (Google Apps Script). O contrato HTTP dele é **fixo**; descubra-o lendo `quartz/components/scripts/submission.inline.ts` e `quartz/util/submissionFile.ts`.
3. **REGRA**: `content/`, `slides/`, `mindmaps/`, `codes/` são a **fonte da verdade** e são apenas **leitura**. Não renomeie, não reformate e não corrija frontmatter existente.
4. **REGRA**: o output do novo site é `site-11ty/_site/`. **Nunca** escreva em `public/` (pasta do Quartz).
5. **REGRA**: `oculto/` e `demonstracao.md` estão no `.gitignore` e **não são publicados** (hoje 39 dos 57 arquivos `.md` viram página). O novo site deve respeitar a mesma exclusão. Ver apêndice A.
6. **REGRA**: cada fase (seção 11) termina com o checklist da seção 9 verde. Commits pequenos, um por item relevante.
7. **REGRA**: não invente novos recursos de conteúdo. Toda chave de frontmatter tem que existir no apêndice A.

---

## 1. Objetivo

Reproduzir **paridade funcional** com o site atual: um site estático de materiais de aula onde o **frontmatter do markdown aciona componentes** — deck de slides (reveal.js) embutido na mesma página da matéria, player de terminal (asciinema), mapa mental (markmap), exercício em Typst compilado no navegador, explorador de código e formulário de entrega de atividade — com navegação por disciplina, busca, índice de pastas e deploy no GitHub Pages.

O que dá valor ao site **não é o gerador**, são os seis componentes e o contrato de conteúdo. Portanto: paridade de contrato primeiro, estética depois.

---

## 2. Escopo

### 2.1 Em escopo (v1 — paridade)

- Renderizar todos os `.md` publicáveis de `content/` (exceto os ignorados).
- Navegação: barra lateral com título do site, busca e árvore de pastas/notas ordenada por `order`; breadcrumbs; índice de cada pasta.
- Conteúdo: título, data/tempo de leitura, sumário (TOC) colapsável, tags, syntax highlight, KaTeX, callouts estilo Obsidian, links entre páginas resolvidos por caminho curto.
- Os seis componentes: **Presentation, Asciinema, Mindmap, Typst, CodeExplorer, SubmissionForm** (seção 6).
- Busca no cliente.
- `404.html`, `sitemap.xml`, `index.xml` (RSS), páginas de tag.
- Tema claro/escuro com persistência + `prefers-color-scheme`.
- Paleta, fontes e layout equivalentes (seção 8).

### 2.2 Fase 2 (paridade de "extras" do Quartz)

Backlinks ao pé da página, popovers de pré-visualização no hover, imagens OG por página.

### 2.3 Fora de escopo (não implementar sem pedido explícito)

- SPA (troca de página sem reload). **Decisão consciente**: o SPA atual é a origem da pior classe de bug do site (reinicialização de componentes a cada navegação — ver armadilha 3). Se quiser o efeito visual, use a **View Transitions API** (cross-document), em CSS, sem router em JS.
- Grafo de conhecimento, comentários, analytics, exportação de PDF dos decks.

---

## 3. Stack decidida

| Peça | Escolha | Motivo |
|---|---|---|
| Gerador | **Eleventy 3.x** (estável), ESM, `eleventy.config.js` | Data cascade nativo para o esquema de frontmatter |
| Templates | **Nunjucks** para layouts/partials | Simples, sem build extra |
| Markdown | **markdown-it** + plugins (`attrs`, `footnote`, `deflist`, `task-lists`, `mark`, KaTeX) + plugin oficial de syntax highlight (Prism, sem JS no cliente) | Equivalente ao pipeline atual |
| CSS | SCSS compilado (`sass`) ou CSS com custom properties | Reproduzir a paleta da seção 8 |
| JS de cliente | Fontes em `src/client/**`, bundle com **esbuild** (script npm com `--watch`) | Não existe bundling no Eleventy; o esbuild é o mesmo usado hoje |
| Busca | **Pagefind** (passo pós-build) | Menos código que reimplementar FlexSearch e indexa o HTML final |
| Datas | `modified` do frontmatter, senão data do último commit do git (filtro próprio) | **Nunca** usar `birthtime` do filesystem (armadilha 6) |
| Libs de terceiros | **copiar e vendorizar** de `quartz/static/lib/`: `reveal/**`, `asciinema/**`, `typst/**` | Já funcionam offline e sem CDN |

---

## 4. Estrutura de pastas alvo

```
site-11ty/
├── eleventy.config.js
├── package.json
├── src/
│   ├── _data/site.js            # título, baseUrl, cores, nav, links do rodapé
│   ├── _includes/               # layouts nunjucks: base, pagina, lista, deck, asciinema...
│   ├── _includes/components/    # partials dos 6 componentes
│   ├── assets/
│   │   ├── styles/              # scss/css
│   │   ├── static/lib/          # libs vendorizadas (reveal, asciinema, typst)
│   │   └── search.js            # bootstrap do Pagefind
│   ├── client/                  # JS/TS de cliente (uma entrada por componente + app.js)
│   ├── content/                 # cópia local do markdown (fonte da verdade DESTE projeto)
│   │   └── static/              # assets publicados (casts, typs, imagens)
│   ├── tags.njk, sitemap.njk, rss.njk, 404.njk, search-index.njk
│   └── index.njk
└── _site/                       # saída (gitignore)
```

O conteúdo fica em `site-11ty/content/` (autocontido). O Eleventy lê os `.md` como **dados** (não como templates): uma coleção global percorre os arquivos, interpreta o frontmatter e renderiza o corpo com markdown-it, mantendo os `.md` intocados e dando controle total sobre a URL de cada página.

---

## 5. Contrato de conteúdo (frontmatter)

### 5.1 Chaves suportadas

| Chave | Tipo | Efeito | Exemplo real |
|---|---|---|---|
| `title` | string | Título da página e rótulo na navegação | `title: Branching e Merging` |
| `order` | número | Ordena irmãos na árvore e nas listagens de pasta | `order: 6` |
| `presentation` | string \| string[] | Deck(s) reveal embutidos na página; caminho relativo à raiz do repositório, arquivo em `slides/**`. Um deck por item | `presentation: "slides/ADP/00ADP-SL-apresentacao.md"` |
| `asciinema` | string \| string[] | Player(s) de terminal; caminho **lógico** `asciinema/<arquivo>.cast` | `asciinema: ["asciinema/08-branches.cast", ...]` |
| `markmap` | string | Mapa mental; caminho **lógico** `mindmaps/<arquivo>.md` | `markmap: "mindmaps/ast-roadmap.md"` |
| `typst` | lista de `{ path, name }` | Exercícios: um botão por item (compila e baixa o `.typ`) | `typst:` ⏎ `- path: "typs/AST/AST06.typ"` ⏎ `  name: "Exercício AST06"` |
| `codes` | string | Explorador de código; caminho para um arquivo em `codes/**` (formato `.zcode`, seção 6.5) | `codes: "codes/selenium1.md"` |
| `submission` | string[] | Rótulos de atividade. 1 item = formulário direto; 2+ = tela de escolha | `submission: ["AST06", "AST06 ADS3-SI3 ADS4-SI4"]` |
| `icon` | string | Ícone da página (hoje só usado em páginas não publicadas) | `icon: simple/git` |

**Regras de parsing (todas obrigatórias):**

- Aceitar **string ou lista** em `presentation`, `asciinema` e `submission`; ignorar itens vazios/whitespace.
- Aceitar a forma **mapa** em `typst` (`path` + `name` opcional; `name` default = nome do arquivo).
- Se `typst` for string, tratar como lista de um item.
- Componente sem dado no frontmatter **não renderiza nada** (nem `<div>` vazio).
- `asciinema` aceita também nome só do arquivo (ex.: `08-branches.cast`) — resolva para `asciinema/<arquivo>`.

### 5.2 Caminho lógico → caminho físico → URL

Esta tabela é a origem da maioria dos bugs. Decore-a.

| No frontmatter | Arquivo real | URL no site | Como é usado |
|---|---|---|---|
| `slides/x.md` | `slides/x.md` (raiz) | — (não servido) | Lido em build-time e **injetado no HTML** |
| `mindmaps/x.md` | `mindmaps/x.md` (raiz) | — (não servido) | Lido em build-time e **injetado no HTML** |
| `codes/x.md` | `codes/x.md` (raiz) | — (não servido) | Lido em build-time e **injetado no HTML** |
| `asciinema/x.cast` | `content/static/asciinema/x.cast` | `/static/asciinema/x.cast` | **Copiado** e buscado pelo player em runtime |
| `typs/AST/AST06.typ` | `content/static/typs/AST/AST06.typ` | `/static/typs/AST/AST06.typ` | **Copiado** e buscado em runtime |

**REGRA**: qualquer arquivo que precise chegar ao navegador **mora em `content/static/**`**. A cópia deve **preservar caminho e caixa** (`content/static/typs/AST/AST06.typ` → `/static/typs/AST/AST06.typ`, com maiúsculas).
**REGRA**: não use symlinks para isso — no Windows (`core.symlinks=false`) symlink originado do git vira arquivo de texto, e o asset desaparece silenciosamente.

### 5.3 Filtro de publicação

Publicar `.md` de `content/**` **exceto** o que estiver no `.gitignore` (`oculto/`, `demonstracao.md`). Implemente como filtro de coleção, não como lista hardcoded, e valide a contagem (hoje: **39 páginas**).

---

## 6. Especificação dos componentes

### 6.1 Presentation (deck reveal.js inline)

**Entrada**: `presentation` (1..N arquivos).
**Build**: para cada arquivo, ler o `.md`, **remover frontmatter YAML** se existir, escapar `</script>` e injetar:

```html
<div class="reveal-decks">
  <div class="reveal-container" data-presentation-src="slides/...md">
    <div id="reveal-1-<base>" class="reveal" style="height:600px; border:1px solid var(--lightgray);
         border-radius:8px; overflow:hidden; position:relative">
      <div class="slides">
        <section data-markdown data-separator="^---" data-separator-vertical="^--">
          <script type="text/template"> ...markdown sem frontmatter... </script>
        </section>
      </div>
    </div>
  </div>
</div>
```

**Regex de remoção de frontmatter** (obrigatória, cobre BOM e CRLF):
`/^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/`
Sem isso os `---` do frontmatter viram separadores e produzem **slides vazios no início**.

**Init (cliente)**: `new Reveal(container, { embedded:true, keyboard:true, controls:true, progress:true, center:true, transition:"slide", plugins:[RevealMarkdown, RevealHighlight?], markdown:{ separator:"^---", verticalSeparator:"^--" } })` e `await initialize()`.

**Requisitos obrigatórios:**

1. **Múltiplos decks na mesma página**: cada `.reveal` recebe `tabIndex=0` e `keyboardCondition` que só responde quando o deck está sob `:hover` ou contém `document.activeElement` — caso contrário uma seta avança **todos** os decks. Inicializar em sequência (`await`), porque o plugin `RevealMarkdown` é singleton (estado no módulo).
2. **Re-layout quando o conteúdo muda de tamanho** (este é o bug que mais dói hoje): o reveal mede cada slide **uma vez** (initialize/slidechanged). Se o conteúdo crescer depois — imagem externa que resolve tarde, imagem quebrada (404), fonte web — a centralização e o scale ficam congelados no tamanho antigo e o slide aparece deslocado/estourando o container **até o usuário sair da página e voltar**. Implemente `relayout()` (debounce em `requestAnimationFrame`) disparado por:
   - `ResizeObserver` no container **e** em cada `section` do deck;
   - eventos `load`/`error` das imagens do deck (re-anexar a cada troca de slide);
   - `document.fonts.ready`;
   - `window` `load`.
   Limpe tudo no `dispose`/desmontagem.
3. Botão **⛶ tela cheia** no canto inferior esquerdo (`requestFullscreen`/`exitFullscreen`).
4. Correção de caminhos absolutos de imagem: `src` começando com `/` deve receber o prefixo do `baseUrl` (o site é publicado em subpasta no GitHub Pages).
5. O `div.reveal` mantém altura fixa de 600px e borda arredondada; o SCSS do deck (`reveal.css`, `black.css`, `monokai.css`) é vendorizado.

**Armadilhas**: `---` na **última linha** do arquivo de slides gera um slide vazio no fim. Frontmatter dentro de arquivo de slides é comum (ex.: `icon:`) e deve ser removido.

### 6.2 Asciinema

**Entrada**: `asciinema` (1..N).
**Build**: montar a div e validar que o `.cast` existe em `content/static/asciinema/`; se não existir, **emitir erro de build** (não só um aviso) — sem isso o player fica com o spinner de carregamento para sempre, sem mensagem de erro.

```html
<div class="asciinema-container">
  <div class="asciinema-wrapper">
    <h4 class="asciinema-title">01-init_clone_commit</h4>   <!-- ">" vem de CSS ::before -->
    <div class="asciinema" data-src="/static/asciinema/01-init_clone_commit.cast"
         data-theme="asciinema" data-speed="1" data-idle-time-limit="2"
         data-poster="npt:0:0" data-fit="width">
      <div class="asciinema-loading">Carregando gravação do terminal...</div>
    </div>
  </div>
</div>
```

**Cliente**: usar `window.AsciinemaPlayer.create(src, el, { theme:"asciinema", speed:1, idleTimeLimit:2, poster:"npt:0:0", fit:"width", terminalFontSize:"14px" })`; biblioteca vendorizada (`asciinema-player.min.js` + `.css` carregados no `<head>`).
**Título**: nome do arquivo sem extensão, primeira letra maiúscula, de `asciinema/<x>.cast` → `X`.

### 6.3 Mindmap (markmap)

**Entrada**: `markmap` (`mindmaps/x.md`).
**Build**: ler o arquivo, remover frontmatter e embutir:

```html
<div class="markmap-container"><script type="text/markdown"># ...conteúdo...</script></div>
```

**Cliente**: carregar markmap (`d3`, `markmap-view`, `markmap-lib`), transformar o markdown embutido e renderizar em `<svg>`; **não** fazer `fetch` para fontes locais (só para fontes `http(s)`), e marcar o elemento como inicializado para não renderizar duas vezes.
Recomendação: vendorizar as três libs em `static/lib/markmap/` em vez de usar CDN (hoje é CDN).

### 6.4 Typst (exercício compilado no navegador)

**Entrada**: `typst`.
**Build**: um botão por item (`data-path` = `/static/<path>`, `data-name`), dentro de `.typst-container` com `data-bundle` e `data-wasm` do `static/lib/typst/`.
**Cliente**: usar o compilador Typst WASM vendorizado (`snippet.bundle.mjs` + `typst_ts_web_compiler_bg.wasm`) para compilar o `.typ` escolhido, exibir preview e oferecer download do arquivo. Copie `quartz/static/lib/typst/**` inteiro.

### 6.5 CodeExplorer (`.zcode`)

**Entrada**: `codes` (`codes/<x>.md`).
**Formato do arquivo** (`.zcode`, é markdown válido):
- lista markdown indentada = árvore de arquivos/pastas; item terminando em `/` é pasta;
- bloco cercado ```lang imediatamente abaixo/acima de um item de arquivo = conteúdo daquele arquivo; a indentação do bloco define o recorte (`codeIndent`).

**Saída HTML**: `.code-explorer` com `data-tree` = JSON da árvore (`[{name, isDir, lang, content, children}]`), botões `A+`, `a-`, 📋 copiar, ⛶ fullscreen, 💾 baixar ZIP; painel esquerdo (`.tree-panel`, lista com pastas expansíveis) e direito (`.viewer-panel` com `<pre><code>`) que mostra o arquivo clicado.
Se o arquivo não existir, renderizar `<div class="code-explorer-error">Arquivo não encontrado: <path></div>` (e avisar no build).

### 6.6 SubmissionForm (entrega de atividade)

**Entrada**: `submission` (1..N rótulos).
**REGRA**: portar a lógica 1:1 de `quartz/components/scripts/submission.inline.ts` + `quartz/util/submissionFile.ts`. Não reescreva o protocolo nem "melhore" o formato dos campos — o backend é o mesmo.

**Invariantes obrigatórias:**

1. `selection-screen` **sempre** existe no DOM: com 2+ atividades mostra a escolha; com 1 atividade fica `hidden`, servindo de fonte do rótulo e de fallback.
2. Clique em `.select-activity-btn` é **delegado** no card (não listener por botão).
3. Rótulo da atividade: buscar a lista real na planilha (`action=listarAtividades` no Apps Script), filtrar pelos códigos do frontmatter (o **primeiro token** é a whitelist) e usar o texto **exato** da planilha; se falhar, usar o literal do frontmatter como fallback.
4. Campos: RA obrigatório; entrega é **link do GitHub OU arquivo `.zip`** (nunca os dois, nunca nenhum).
5. Validação do anexo em **3 camadas**: `accept` no input, extensão `.zip`, e **assinatura real** (magic bytes `PK`) — isso bloqueia `.pdf`/`.py` renomeado para `.zip`.
6. Limite de **20 MB** por arquivo.
7. Arrastar/soltar **não** existe: só botão que chama `fileInput.click()`.
8. Mensagens de erro amigáveis para: HTTP 404 do backend, resposta "já enviou nas últimas 24h" e falha de rede.
9. Só POST para a URL de deploy do Apps Script já existente no código atual.

### 6.7 Navegação, listas e páginas

- **Sidebar esquerda**: título do site (`giovbon`), campo de busca e árvore de pastas/notas. Ordem: `order` numérico crescente; empate → `title`. Pastas com filhos aparecem expandíveis; pasta vazia não aparece.
- **Breadcrumbs** (oculto na home), **título da página**, **meta** (data + tempo de leitura), **tags**, **TOC** colapsável, **backlinks** (fase 2).
- **Página de pasta** (`/CTT/`, `/CTT/Git/`): lista os filhos diretos ordenados por `order`, com link e descrição/título.
- **Página de tag** (`/tags/<tag>/`).
- **Home** = `content/index.md`.
- **404**, `sitemap.xml`, `index.xml` (RSS).
- **URLs**: manter as atuais, sem extensão e com barra final — `content/CTT/Git/04CTT-PG-branch-merge.md` → `/CTT/Git/04CTT-PG-branch-merge/`; `content/index.md` → `/`.

---

## 7. Pipeline de build

```
npm run dev     # eleventy --serve (watch) + esbuild --watch em paralelo
npm run build   # esbuild (minify) → eleventy → pagefind --site _site
npm run clean   # remove _site, .cache
```

- `baseUrl` configurável (`/` em dev, `/impacta/` no GitHub Pages) via `_data/site.js` + flag de ambiente. Todos os links absolutos devem respeitá-la.
- `addPassthroughCopy`: `content/**` (não-`.md`) → `_site/static/**` removendo o prefixo `content/`; `src/assets/static/**` → `_site/static/**`.
- Deploy: GitHub Actions publicando `site-11ty/_site` (ou pasta `docs/`), sem tocar no deploy atual até haver paridade.

---

## 8. Design system (paridade visual)

**Fontes** (Google Fonts): títulos `Schibsted Grotesk`, corpo `Source Sans Pro`, código `IBM Plex Mono`.

| Token | Tema claro | Tema escuro |
|---|---|---|
| `--light` | `#faf8f8` | `#161618` |
| `--lightgray` | `#e5e5e5` | `#393639` |
| `--gray` | `#b8b8b8` | `#646464` |
| `--darkgray` | `#4e4e4e` | `#d4d4d4` |
| `--dark` | `#2b2b2b` | `#ebebec` |
| `--secondary` | `#284b63` | `#7b97aa` |
| `--tertiary` | `#84a59d` | `#84a59d` |
| `--highlight` | `rgba(143,159,169,.15)` | `rgba(143,159,169,.15)` |
| `--textHighlight` | `#fff23688` | `#b3aa0288` |

Layout de 3 colunas (esquerda: navegação; centro: conteúdo; direita: vazia), responsivo, com sidebar colapsável no mobile. Rodapé com links próprios do autor (o site atual ainda aponta para o Quartz — **corrigir** no novo). Tema: seguir `prefers-color-scheme` e persistir a escolha em `localStorage`.

---

## 9. Critérios de aceitação (checklist verificável)

Execute cada item e cole a evidência (saída de comando ou trecho de HTML) no PR.

- [ ] `npm run build` termina sem erro e **sem aviso de data inválida**.
- [ ] Nenhum arquivo de `content/**/*.md`, `slides/**`, `mindmaps/**`, `codes/**` foi modificado (`git status` limpo nessas pastas).
- [ ] `curl -sI http://localhost:8080/static/asciinema/08-branches.cast` → **200**.
- [ ] `curl -sI .../static/typs/AST/AST06.typ` → **200** e a caixa (`AST`) preservada.
- [ ] `/CTT/Git/04CTT-PG-branch-merge/` contém: 1 `.reveal`, **4** blocos `.asciinema`, e o deck tem **25** `<section>`.
- [ ] Nessa página, nenhum slide fica deslocado/fora do container; ao injetar `img.style.height=400px` em um slide via console, o deck **recentraliza sozinho** (prova do re-layout da armadilha 3).
- [ ] `/AST/06AST-PG-dubles-teste/` mostra o botão `Exercício AST06` (Typst) e o formulário com **2** atividades (tela de escolha).
- [ ] `/AST/00AST-PG-ast-roadmap/` contém `.markmap-container` com `<script type="text/markdown">` não vazio e um `<svg>` gerado.
- [ ] `/AST/07AST-PG-selenium1/` mostra o CodeExplorer com a árvore de `codes/selenium1.md` e abre arquivos no painel direito.
- [ ] Formulário: com RA + link GitHub envia; com RA + ZIP (real) envia; com `.pdf` renomeado para `.zip` **bloqueia**; com nada **bloqueia**; com os dois **bloqueia**.
- [ ] Busca encontra "pytest" e leva a `/AST/02AST-PG-pytest/`.
- [ ] `/tags/`, `/index.xml`, `/sitemap.xml`, `/404.html` respondem **200**.
- [ ] Nenhuma página é gerada a partir de `content/**/oculto/**` nem de `demonstracao.md`.
- [ ] Contagem de páginas geradas = **39**.
- [ ] Layout idêntico em largura 375px, 768px e 1440px; tema escuro persiste após recarregar.

---

## 10. Armadilhas conhecidas (todas já custaram tempo em produção)

1. **Asset ausente travar o player para sempre**: `.cast` fora do ar = spinner eterno, sem erro visível. Publique assets em `content/static/**` e **valide a existência em build-time**.
2. **Symlinks não funcionam** neste repositório: `quartz/static/{slides,mindmaps,asciinema,typs}` eram symlinks e foram removidos (commit `bd42c08`); com `core.symlinks=false` no Windows eles viram arquivos de texto. Nunca dependa de symlink.
3. **Reveal mede o slide uma vez** → conteúdo que cresce depois (imagem que resolve tarde ou 404) deixa o slide deslocado até sair/voltar. Ver 6.1, item 2.
4. **Frontmatter do arquivo de slides** vira slide vazio → remover antes de injetar. `---` na última linha também cria slide vazio.
5. **Múltiplos decks**: `RevealMarkdown` é singleton e o teclado precisa de `keyboardCondition` por deck (hover/foco).
6. **`birthtimeMs` = 0 em WSL/DrvFs** → calcular data pelo filesystem gera "found invalid date 0" em todos os arquivos. Use frontmatter/git.
7. **Apps Script responde 302** para `script.googleusercontent.com`; um XHR pode virar GET e reexecutar `doGet` → sintomas são 404 e "já enviou nas últimas 24h" mesmo com a entrega salva. As mensagens do formulário devem tratar isso.
8. **Watcher não recompila código de cliente**: hoje, mudar um `.ts` de componente não entra no bundle sem reiniciar o servidor. No Eleventy, garanta `esbuild --watch` junto do `--serve`, senão você herda a mesma dor.

---

## 11. Fases

| Fase | Escopo | DoD |
|---|---|---|
| **0. Esqueleto** (~0,5 dia) | `eleventy.config.js`, layout base, passthrough de assets, 1 página de conteúdo | `npm run dev` serve `content/index.md` e `/static/lib/reveal/reveal.js` responde 200 |
| **1. MVP navegável** (~1 fim de semana) | coleções + filtro de publicação, sidebar/árvore por `order`, markdown completo (highlight, KaTeX, callouts), TOC, breadcrumbs, **Presentation**, **Asciinema**, **Mindmap**, **Typst**, **CodeExplorer**, **SubmissionForm**, URLs de paridade | Itens do checklist da seção 9 até "Formulário" verdes |
| **2. Paridade de extras** (1–2 semanas de noites) | busca (Pagefind), tags, pasta/listas, RSS, sitemap, 404, data/tempo de leitura, tema escuro persistente, backlinks, popovers, OG images, View Transitions (opcional) | Checklist completo verde |
| **3. Opcional** | SPA (só se pedido), grafo, export de deck para PDF/impressão | — |

**Regra de corte**: se faltar tempo, corte as OG images e os popovers — nunca o re-layout do reveal nem a validação do formulário.

---

## 12. Prompt de partida (copiar/colar para a IA executora)

> Você é um dev front-end/full-stack sênior. No repositório aberto existe `PROPOSTA-ELEVENTY.md`, que é a especificação completa para reconstruir o site de materiais de aula em Eleventy, dentro de `site-11ty/`.
> Leia o documento inteiro antes de escrever código, respeite todas as linhas marcadas como **REGRA** e o que está fora de escopo.
> Comece pela **Fase 0** e depois a **Fase 1**, um item por vez. Antes de cada passo, diga em 1 linha o que vai fazer; depois de cada passo, rode a verificação correspondente da seção 9 e mostre a evidência.
> Nunca modifique `content/`, `slides/`, `mindmaps/`, `codes/`, `quartz/` nem `quartz/google-sheets-apps-script.gs`. Em caso de ambiguidade, escolha a opção que preserve **paridade de comportamento** com o site Quartz atual e registre a decisão no PR.

---

## Apêndice A — Inventário real do conteúdo (base para validação)

Contagens atuais (verificar depois de implementar o filtro):

| Pasta | `.md` | Publicado |
|---|---|---|
| `content/` (raiz: `index.md`) | 1 | sim |
| `content/ADP/` | 6 | sim |
| `content/ADP/oculto/` | 1 | **não** (gitignore) |
| `content/AST/` | 8 | sim |
| `content/ATS/` | 8 | sim |
| `content/ATS/oculto/` | 11 | **não** |
| `content/CTT/Git/` | 9 | sim |
| `content/CTT/oculto/` + `Github Actions/` | 1 + 5 | **não** |
| `content/NLCW/` | 7 | sim |
| **Total** | **57** | **39 páginas** |

Exemplos canônicos para testes (usar exatamente estes casos):

- **Deck com vários asciinema**: `content/CTT/Git/04CTT-PG-branch-merge.md` → deck `slides/CTT/Git/03-branching-merging.md` (25 slides) + 4 casts.
- **Typst + 2 atividades**: `content/AST/06AST-PG-dubles-teste.md`.
- **Markmap**: `content/AST/00AST-PG-ast-roadmap.md` (`mindmaps/ast-roadmap.md`).
- **CodeExplorer**: `content/AST/07AST-PG-selenium1.md` (`codes/selenium1.md`).
- **1 atividade só (form direto)**: `content/ADP/02ADP-PG-modelo-conceitual.md`.
- **Deck em pasta irmã**: `content/ADP/` (`slides/ADP/...`) e `content/CTT/Git/` (`slides/CTT/Git/...`) — os `presentation` apontam para `slides/<...>` na raiz, nunca relativo à página.

Assets que precisam existir publicados: `content/static/asciinema/*.cast` (13), `content/static/typs/{AST,ATS}/**.typ`, `codes/**`, `slides/**`, `mindmaps/**`.
