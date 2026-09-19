

<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">ADS · Application Data Persistance</p>

# Apresentação

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub">Como ler e construir um DER a partir do mini-mundo.</p>
<p class="slide-cover__meta"><span>Aula 03</span><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">03</p>

---

## Application Data Persistance
> ⚠️ Ver plano de ensino no classroom.

---


## Habilidades

Com base na ementa e no plano de ensino fornecidos, as habilidades a serem adquiridas são:

* **Interpretação e Mapeamento de Modelos:** Interpretar o modelo conceitual (DER) e o esquema lógico normalizado fornecidos, identificando entidades, atributos, domínios, chaves primárias e estrangeiras a serem implementados.
* **Implementação de Estruturas Físicas no Xano:** Criar tabelas e definir colunas com tipos de dados apropriados na plataforma Xano, seguindo fielmente o esquema relacional estabelecido.

--

* **Configuração de Integridade e Relacionamentos:** Estabelecer chaves estrangeiras e configurar restrições de integridade (como *domain*, *unique*, *not null* e *check*) diretamente no ambiente Xano.
* **Otimização de Desempenho:** Construir índices para otimização do tempo de resposta das consultas, considerando as necessidades reais dos requisitos do sistema.

--

* **Desenvolvimento de APIs RESTful:** Criar endpoints CRUD para as entidades principais e implementar consultas avançadas com suporte a filtros, ordenação, paginação e agregações via interface visual do Xano.
* **Segurança e Validação em APIs:** Configurar autenticação e autorização básica nos endpoints, além de aplicar tratamento de erros e validação para dados de entrada.
* **População de Dados de Teste:** Executar a carga inicial da base com conjuntos de dados coerentes com as regras de negócio do projeto.

---

A avaliação da disciplina é composta por uma Média das Avaliações Parciais (MAP), que consiste na média aritmética das notas obtidas em duas Avaliações Parciais (AP1 e AP2) + nota da avaliação final de banca de professores, referente ao projeto desenvolvido.

```
Nota Final = 50% MAP + 50% Avaliação

SE (Nota Final >= 6,0 e Frequência >= 75%)
    ENTAO   
        APROVADO
    SENAO
        REPROVADO
```

---

## Recursos de slide (exemplos)

Os slides a seguir são **exemplos** de recursos do reveal.js escritos em markdown puro —
nada de HTML à mão: tudo o que está aqui funciona em qualquer deck
(o guia completo está em `docs/SLIDES.md`).

---

## Realce por passo

Um bloco de código pode destacar linhas em etapas — avance com as setas:

```python [1-2|4|6-8|10]
def calcular_media(notas):
    total = sum(notas)

    quantidade = len(notas)

    if quantidade == 0:
        return 0

    media = total / quantidade
    return round(media, 2)

print(calcular_media([7, 8, 9]))
```

Repare que os números vão entre colchetes, depois da linguagem:
`[1-2|4|6-8|10]` — cada parte separada por `|` é um passo.

---

## Auto-animate — começo

O mesmo elemento "anda" de um slide para o outro quando os dois têm
`data-auto-animate` e os elementos têm o mesmo `data-id`:

⚠️ Dentro de `<pre>` não pode haver linha em branco: em markdown, linha em branco
encerra o bloco de HTML. Para código com linha em branco no meio, use bloco cercado.

<!-- .slide: data-auto-animate -->

<h3 data-id="titulo">O código cresce</h3>
<pre data-id="codigo"><code class="language-python" data-trim>def soma(a, b):
    return a + b</code></pre>

---

<!-- .slide: data-auto-animate -->

<h3 data-id="titulo">O código cresce</h3>
<pre data-id="codigo"><code class="language-python" data-trim>def soma(a, b):
    return a + b
total = soma(2, 3)
print(total)</code></pre>

---

## Fragmentos

Itens (ou qualquer elemento) podem aparecer um a um:

- primeiro item, já visível
- segundo item <!-- .element: class="fragment fade-up" -->
- terceiro item <!-- .element: class="fragment" -->
- e o último, que fica esmaecido <!-- .element: class="fragment fade-in-then-semi-out" -->