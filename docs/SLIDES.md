# SLIDES — o que dá para escrever no markdown do deck

Os decks ficam em `slides/**` e são lidos no build; o markdown vai inteiro para o
reveal.js, que interpreta tudo em tempo real. Ou seja: **quase tudo que o reveal
aceita em HTML também funciona em markdown** — só muda a forma de escrever.

Nada aqui vale para o markdown da aula (`content/**`): lá quem manda é o
markdown-it, que só entende markdown + HTML puro.

---

## 1. Capa (visual recomendado)

```md
<!-- .slide: class="slide-cover" -->

<p class="slide-cover__kicker">ADS · Application Data Persistance</p>

# Modelo **Conceitual**

<p class="slide-cover__rule"></p>

<p class="slide-cover__sub">Como ler e construir um DER a partir do mini-mundo.</p>

<p class="slide-cover__meta"><span>Aula 03</span><span>Prof. Giovani B.</span></p>

<p class="slide-cover__num">03</p>
```

| Peça | Classe | Para que serve |
|---|---|---|
| Selo superior | `slide-cover__kicker` | disciplina/tema, mono, espaçado, em accent |
| Título | heading markdown (`#`) | 2.5em, apertado; use `**palavra**` para marcar em accent |
| Régua | `slide-cover__rule` | filete de accent que degradê para o nada |
| Subtítulo | `slide-cover__sub` | até 44ch, em `--muted` |
| Meta | `slide-cover__meta` | linha de contexto (aula, professor…), mono, separada por `·` |
| Número fantasma | `slide-cover__num` | número vazado (só contorno) à direita |

Todas as peças são opcionais: use só o que fizer sentido. O fundo ganha um brilho
radial sutil automaticamente (`.slide-cover::before`) — **nenhuma imagem externa
é necessária**, o que mantém o site 100% offline.

> ⚠️ Markdown **dentro** de tag HTML não é interpretado. `<h1>Modelo **Conceitual**</h1>`
> mostra os asteriscos; escreva `# Modelo **Conceitual**` (heading de verdade) ou
> `<h1>Modelo <strong>Conceitual</strong></h1>`.

---

## 2. Blocos de código

O realce vem do highlight.js, com o tema de `src/assets/styles/syntax.css` — as
**mesmas cores** do conteúdo da aula e do explorador de código.

### Realce de linha por passo (a "animação" que você quer)

Basta pôr os números entre colchetes depois da linguagem, separando os passos por `|`:

````md
```js [1-2|4|6-7]
function soma(a, b) {
  return a + b
}

const total = soma(2, 3)
console.log(total)
console.log("fim")
```
````

Cada passo vira um **fragmento** do reveal: o slide avança com as setas/space e o
realce vai andando pelas linhas (o resto do código escurece). Aceita `1-3`,
`5`, `1,3`, `2-4,7`.

### Só numeração, sem passos

````md
```js [1-7]
let a = 1
```
````

O `[1-7]` faz o reveal numerar todas as linhas e destacá-las de uma vez.

### Bloco comum

````md
```python
def soma(a, b):
    return a + b
```
````

---

## 3. Auto-animate (transição entre slides)

Coloque `data-auto-animate` nos slides envolvidos e dê `data-id` aos elementos que
devem "andar" de um slide para o outro (título, bloco de código, tabela…):

```md
<!-- .slide: data-auto-animate -->

<h3 data-id="titulo">Contador</h3>
<pre data-id="codigo"><code class="language-js" data-trim>let n = 0</code></pre>

---

<!-- .slide: data-auto-animate -->

<h3 data-id="titulo">Contador</h3>
<pre data-id="codigo"><code class="language-js" data-trim>let n = 0
n = n + 1
console.log(n)</code></pre>
```

O reveal interpola posição/tamanho dos elementos de mesmo `data-id`. É o efeito de
"código que cresce" — funciona em markdown porque só depende de atributos na seção
e no `<pre>`, ambos aceitos como HTML no meio do markdown.

---

## 4. Fragmentos (aparecer por partes)

- listas: `<!-- .element: class="fragment" -->` **na linha seguinte** ao item
- qualquer elemento: o mesmo comentário depois dele

```md
- aparece de uma vez
- aparece depois <!-- .element: class="fragment fade-up" -->
- e depois este <!-- .element: class="fragment" -->
```

Variações úteis: `fade-up`, `fade-in-then-semi-out`, `highlight-current-blue`,
`strike`, `grow`.

---

## 5. Outros atributos de slide

```md
<!-- .slide: data-background-image="https://…/foto.jpeg" data-background-opacity="0.35" -->
<!-- .slide: data-transition="zoom" -->
<!-- .slide: class="slide-cover" data-auto-animate -->
```

---

## 6. Anotações do apresentador

```md
Note:
Só você vê isto (tecla S abre a janela de notas).
```

---

## 7. Classes já disponíveis nos slides

| Classe | Efeito |
|---|---|
| `slide-cover` | bloco de capa (seção 1) |
| `glass-box` | caixa de vidro com blur e leve flutuação (capa antiga) |
| `glass-icon` | ícone 90px dentro do `glass-box` |
| `imagem-invertida` | inverte as cores de um logo claro |

---

## 8. Como conferir

```bash
./run.sh              # salva o arquivo: o navegador recarrega sozinho
```

Os links do deck abrem em nova aba automaticamente (o cliente ajusta depois que o
reveal monta os slides).
