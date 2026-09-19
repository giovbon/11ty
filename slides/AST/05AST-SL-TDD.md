<!-- .slide: data-background-image="https://i.ibb.co/mrbpyRNH/AAGemini-Generated-Image-lsw6plsw6plsw6pl.png" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>tdd</h1>
</div>

---

**Desenvolvimento Dirigido por Testes (TDD)** é uma prática de programação que *prioriza a escrita de testes antes da implementação do código*.

Basicamente o TDD se baseia em pequenos ciclos de repetições, onde para cada funcionalidade do sistema um teste é criado antes. Este novo teste criado *inicialmente falha*, já que ainda não temos a implementação da funcionalidade em questão e, em seguida, *implementamos a funcionalidade para fazer o teste passar*.


- Como testes são escritos primeiro, fica mais difícil esquecer de escrevê-los posteriormente.
Em equipes que adotam o TDD, a *cobertura de testes costuma ser muito alta*, geralmente permanecendo acima de 90%.
- O desenvolvedor, ao escrever o teste primeiro, se coloca na posição do usuário, simplificando a interface e fazendo *escolhas de design mais sólidas*.

---

## Ciclo TDD (Red, Green, Refactor)

O processo de TDD envolve *três estados* principais:

1. 🟥 **Escrever um teste que falhe (Red)**: A meta inicial é escrever um teste que falhe, o que fornece uma *especificação clara do que precisa ser implementado*.

2. ✅ **Crie código que faça o teste passar (Green):** Após a criação do teste, o próximo objetivo é *implementar a funcionalidade desejada*. Essa implementação pode ser realizada em pequenos passos, começando com *soluções simples* que eventualmente fazem os testes passarem.

3. ♻️ **Melhorar o código (Refactor):** O código deve ser revisado para identificar *oportunidades de melhoria*. O foco está não apenas na funcionalidade, mas também na *qualidade do design*, como eliminar duplicações e simplificar a estrutura. 

Após a refatoração, o ciclo pode reiniciar para adicionar mais funcionalidades.

---


![](https://engsoftmoderna.info/figs/cap8/ciclos-tdd.svg)


- 🟥 Escrevemos um teste que inicialmente não passa
- ✅ Adicionamos uma nova funcionalidade do sistema e fazemos o teste passar
- ♻️ Refatoramos o código da nova funcionalidade
- Escrevemos o próximo teste

---

### Anti-Padrões do TDD

Coisas a serem evitadas:

*   **Escrever testes muito grandes:** testes devem ser *pequenos* e focados em uma *única funcionalidade*.
*   **Testar detalhes de implementação:** os testes devem focar no *"o quê"* e não no "como", ou seja, o teste só *deve se importar com o resultad*o.
*   **Esquecer a fase de refatoração:** pular a refatoração leva ao acúmulo de débito técnico. Renomeie variáveis, remova duplicações e deixe a lógica elegante. Senão o código vira um Frankenstein, *acumulando débito técnico*.
*   **Manter testes que não agregam valor:** testes frágeis, redundantes ou óbvios devem ser removidos.

---

## Uso

O TDD é uma norma em empresas que adotam o **Extreme Programming (XP)**, sendo considerado algo essencial para *manter o código limpo e permitir refatorações seguras*. Grandes organizações de tecnologia, como o Google e Facebook, utilizam o TDD.

Benefícios:

- Garantia de Testabilidade e Alta Cobertura
- Melhoria do Design e Arquitetura
- Segurança para Refatoração
- Prevenção de Regressões
- Documentação Viva
- Redução de Bugs e Custos
- Aumento da Produtividade e Sanidade

---

## Barreiras

- **Alguns desenvolvedores odeiam**. A maior barreira é que muitos *programam de forma empírica* (na base da tentativa e erro), descobrindo e moldando os requisitos da aplicação ao longo do desenvolvimento. No TDD, você *precisa saber exatamente o que vai construir antes de começar*.

- *Sob a pressão de prazos e demandas de clientes*, desenvolvedores podem sentir a *tentação de abandonar o TDD*, o que pode levar ao acúmulo de "débito técnico" e medo de alterar o código no futuro.

---


Alguns autores sugerem que o *TDD não deve ser usado 100% do tempo* ou para todos os tipos de código.

## Onde usar ✅

- **Para a criação de novas funcionalidades:** o uso de TDD *assegura que o novo código funcione corretamente desde o início*, evitando a programação de elementos desnecessários.

- **Para a correção de problemas (Bugs):** em caso de erro no sistema, é fundamental criar um teste que reproduza essa falha antes de proceder com a correção. Isso atua como uma "vacina", *garantindo que o erro específico não ocorra novamente*.

- **Para lógicas complexas:** o TDD incentiva a *resolução de problemas extensos em etapas menores*, conhecidas como "baby steps". Essa abordagem minimiza a probabilidade de bloqueios durante o desenvolvimento.

---

- **Para a refatoração de código:** quando se busca organizar um código desestruturado, pode existir a apreensão de comprometer o sistema. Com o TDD, há uma *"rede de proteção"* que alerta imediatamente caso algo seja danificado.

- **Em sistemas críticos:** em *contextos onde uma falha pode resultar em altos custos*, como em instituições financeiras ou hospitalares, o TDD contribui para garantir que o sistema se mantenha praticamente 100% confiável.

---

## Onde não usar ❌

- **Durante a fase de rascunho ou exploração:** caso você esteja apenas *testando uma ideia, aprendendo a utilizar uma nova ferramenta* ou desenvolvendo um *protótipo*, não é necessário dedicar tempo à criação de testes. Essa prática é referida como "Spiking", que consiste em *desenvolver um código rápido para fins de aprendizado*.

- **Para verificar aspectos visuais:** não é vantajoso criar testes que busquem validar se um botão está na cor azul, se a fonte possui o tamanho adequado ou se uma imagem foi carregada corretamente. O TDD é mais *apropriado para testar a lógica subjacente*, e não os elementos estéticos.

- **Para questões extremamente simples:** quando o *código é excessivamente intuitivo*, redigir um teste pode demandar mais esforço do que simplesmente implementar a solução.

---

- **Provas de Conceito (PoC)**: *códigos e scripts pequenos criados apenas para validar rapidamente uma ideia*, com alta chance de serem descartados

- **Ambientes Altamente Voláteis**: quando as *regras de negócio ainda estão muito incertas* e o código vai sofrer *alterações e refações constantes*.