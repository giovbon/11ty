<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>BDD</h1>
</div>

---

## O que é BDD?

O **Behavior Driven Development (BDD)**, ou Desenvolvimento Guiado por Comportamento, é uma *prática* de engenharia de software ágil focada em *melhorar a comunicação entre as equipes técnicas* (desenvolvedores, QA) *e as partes interessadas do negócio* (gerentes de produto, clientes). 

Em vez de focar na implementação técnica de uma funcionalidade, o BDD foca no **comportamento esperado** do sistema sob a perspectiva do usuário final, utilizando uma linguagem simples e natural que todos consigam entender.

--

**O Criador:** O BDD foi idealizado em *2003* pelo desenvolvedor britânico **Dan North**.

**A Relação com TDD:** O BDD não substitui o TDD (Desenvolvimento Guiado por Testes); ele é uma **evolução** dele:
- **TDD** foca em escrever testes unitários antes do código para garantir que o código funcione corretamente (*foco técnico*)
- **BDD** foca em descrever o comportamento do sistema para garantir que a equipe esteja construindo a funcionalidade certa (*foco no negócio*).

--

<!-- No início dos anos 2000, Dan North estava ensinando TDD para equipes de desenvolvedores e percebeu um padrão claro de confusão. A técnica do TDD era poderosa, mas os programadores sempre travavam nas mesmas perguntas:

* Por onde eu começo a testar?
* O que exatamente eu devo testar e o que não devo?
* Como eu devo nomear os meus testes?
* Como eu sei que o teste falhou porque o código está errado ou porque a regra de negócio mudou? -->

## O problema

O BDD foi criado para resolver a *falha de comunicação e o desalinhamento de expectativas entre quem pede o software e quem constrói o software*.

O BDD resolve principalmente um **problema de comunicação**: a *área de negócios* escrevie requisitos longos e complexos em documentos do Word, e os *desenvolvedores* traduzem isso para testes técnicos (códigos) que ninguém de negócios consegue ler para validar se está correto.

Para ajudar a **resolver esse problema**, o BDD propõe que *antes de qualquer linha de código ser escrita*, uma funcionalidade deve ser discutida por três perspectivas fundamentais:

- **O Negócio (Product Owner):** Define qual é o problema a ser resolvido.
- **O Desenvolvimento (Dev):** Analisa como o problema pode ser resolvido tecnicamente.
- **A Qualidade (QA):** Pensa nos casos extremos e no que pode dar errado.

---

### Sintaxe Gherkin (Dado, Quando, Então)

Para que os *testes sejam legíveis por todos*, o BDD popularizou o uso de uma *linguagem estruturada chamada Gherkin*. Ela mapeia o comportamento em etapas lógicas de causa e efeito:

**Feature**: fornece uma descrição de alto nível nas funcionalidades do software.

**Given**: especifica uma pré-condição.

**When**: define alguma ação.

**And**: é utilizado para incluir passos adicionais junto com as etapas **Given**, **When** e **Then**.

--

Vamos criar um cenário onde um usuário vai comprar um produto. Note como cada palavra-chave cumpre exatamente o papel descrito na imagem.

**Cenário: Navegação para a tela de pagamento**

* **Feature:** Checkout de produtos na loja virtual
* **Given:** o usuário está autenticado no sistema
* **And:** o usuário tem um "Teclado Mecânico" no carrinho
* **When:** o usuário clica no botão "Finalizar Compra"
* **Then:** a tela de pagamento deve ser exibida
* **And:** o valor total do pedido deve ser "R$ 250,00"

---

## `pytest-bdd`

O `pytest-bdd` é uma das melhores ferramentas para aplicar BDD em Python. Ele é uma biblioteca Python de código aberto (que você instala usando o `pip`) que atua como um **plugin** (uma extensão) para o `pytest`. Em vez de construir um motor de testes inteiro do zero, os criadores do `pytest-bdd` *adicionaram ao `pytest` a capacidade de ler textos em BDD*.

- **O Gherkin não é um software** ele é apenas um padrão de gramática, uma sintaxe. É ele quem dita a regra de usar as palavras estruturadas (`Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então`) e você escreve isso em texto.
- **O `pytest-bdd` é o tradutor (a implementação)** entrando como o software que faz a "leitura" desse arquivo de texto (`.feature`) e vincula cada frase a uma função real em Python.

Existem *outras bibliotecas* que também sabem ler Gherkin no Python, como o **Behave** ou o **Radish**. O `pytest-bdd` é apenas uma das implementações disponíveis, mas é considerada uma das melhores justamente por usar o ecossistema do `pytest`.