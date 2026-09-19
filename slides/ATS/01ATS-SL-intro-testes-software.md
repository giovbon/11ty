<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>Introdução aos Testes de Software</h1>
</div>


---

## O que é testes de software?

Testar é uma maneira organizada de *passar informações* para um software e *decidir* se o que ele devolve está certo de acordo com o que foi prometido nas especificações.

Objetivo: **Revelar Defeitos**. O objetivo do teste não é provar que um programa está perfeito, mas *mostrar que existem erros*. Um teste é considerado bom se ele descobrir um erro que ainda não foi encontrado.

**Como Funciona**: O processo envolve *três etapas*: 
1. montar um cenário de teste
2. executar a ação que você quer testar
3. verificar se o resultado que você obteve está de acordo com o que esperava

Se o *resultado obtido não bate com o esperado*, isso significa que um *defeito* foi encontrado. Isso pode mostrar que há *algo errado* que faz o programa funcionar de maneira diferente do que deveria.

---

## Por que é necessário testar?

É necessário testar o software porque sua construção é uma *tarefa complexa e sujeita a erros humanos* em todas as fases do desenvolvimento. Como o *software está presente em quase tudo* hoje em dia, garantir que ele funcione como prometido é essencial pra manter a *qualidade e a confiança* no produto.

--

Aqui estão os **principais motivos** para fazer testes:

- O foco principal é descobrir problemas pra *corrigir tudo antes de entregar o produto* pro usuário.
- Detectar problemas no começo do desenvolvimento é *muito mais barato* do que consertar depois.
- **Confiança e Sanidade do Desenvolvedor**: Sem uma bateria de testes, o código pode se tornar um "emaranhado ininteligível", gerando *medo de realizar alterações* (como refatorações) *por não saber o que pode ser quebrado acidentalmente* (regressões).
- Fazer testes ajuda a evitar que o *cliente perca a confiança na equipe* ao esbarrar em bugs que poderiam ter sido pegos antes.

---

## Fatores que causam falhas

* **Erro Humano:** é a *principal causa* das falhas, pois como o *software depende muito da habilidade das pessoas*, qualquer erro na fase de desenvolvimento pode causar defeitos no produto final.

* **Complexidade do Sistema:** problemas podem surgir pois a construção de software é uma *tarefa inerentemente complexa*, e essa complexidade, muitas vezes resulta em um resultado diferente do que era esperado.

* **Falhas de Integração:** muitas falhas ocorrem especificamente quando as *diversas partes do software são colocadas para trabalhar juntas*. Mesmo que unidades individuais funcionem bem, sua interação pode ser inadequada e levar a comportamentos não especificados.

--

* **Manutenção e Regressões:** *sempre que mudamos algo no sistema* para corrigir bugs ou adicionar funcionalidades, existe o risco de surgir novos problemas. Isso é conhecido como **regressão**, onde requisitos que antes funcionavam deixam de funcionar.

* **Degradação do Código:** o *acúmulo de código confuso e desorganizado* gera "débito técnico", tornando o *desenvolvimento mais complicado e propenso a erros*, pois o desenvolvedor perde de vista as dependências do sistema e fica receoso em fazer mudanças.

---

## Cadeia de eventos
### Engano, bug, erro e falha

Um **engano** cometido por uma pessoa resulta em um **defeito (bug)** no software. Quando esse defeito é *ativado* (o programa é executado), ele pode gerar um **erro**, que é um estado interno inconsistente do sistema. Esse erro, por sua vez, pode levar a uma **falha**, que se manifesta como um comportamento ou resultado incorreto do software.

--

<div style="text-align: center;">
    <img src="https://i.ibb.co/99kh38xP/engano-bug-erro-falha.png" width="60%" data-preview-image>
</div>

---

## Relação dos Testes com Qualidade

A **qualidade de software** é uma *característica complexa e difícil de medir*, que abrange *várias dimensões*, como funcionalidade, confiabilidade, eficiência, portabilidade, usabilidade e manutenibilidade. Essa qualidade é *garantida por processos de Validação, Verificação e Teste*, que asseguram que tanto o produto final quanto seu processo de desenvolvimento atendam às especificações. 

A *percepção de qualidade pelos usuários* está muito ligada à *confiança no código* e à *ausência de bugs* que atrapalhem o trabalho, sendo uma das características mais desejadas em um sistema.

A **confiabilidade** refere-se à capacidade do software de *operar corretamente (sem falhas) sob certas condições*: em um período específico e em um ambiente determinado.

--

Diferentemente do hardware, a *confiabilidade do software* não diminui com o tempo ou desgaste físico; ela *é aprimorada ao longo do tempo através da detecção e eliminação de defeitos durante os testes e operação*. 

Um *alto nível de confiabilidade* é crucial em *sistemas críticos*, como os de controle de usinas nucleares, equipamentos médicos ou aeroespaciais, onde falhas podem causar consequências graves.

---

# O que deve ser testado?
## Já que os testes são tão importantes para garantir a qualidade do software, isso significa que devemos testar absolutamente tudo?

--

## Resposta: Não, você não deve, e nem consegue, testar tudo.

Na prática isso seria um **teste exaustivo**: abordagem teórica onde se tenta *testar todas as combinações possíveis de dados de entrada* e todas as pré-condições de um sistema.

O teste exaustivo *é impossível*. Tentar cobrir todas as combinações possíveis de um software levaria séculos, mesmo para programas simples. O segredo não é a quantidade, mas a *estratégia de seleção*.

---

## Modelo em V 

A imagem apresenta o Modelo em V, uma representação clássica que demonstra a *relação direta entre cada fase do desenvolvimento de software e seu respectivo nível de teste*:

<div style="text-align: center;">
    <img src="https://i.ibb.co/B2DHsHM5/modelo-v.png" width="60%" data-preview-image>
</div>

--

<div style="text-align: center;">
    <img src="https://i.ibb.co/B2DHsHM5/modelo-v.png" width="40%" data-preview-image>
</div>

### Fases do Desenvolvimento
Representa a decomposição do projeto, indo do macro (negócio) para o micro (código):

- **Requisitos**: Definição do que o software deve fazer para o negócio.
- **Especificação Funcional**: Detalhamento das funcionalidades e comportamento do sistema.
- **Especificação Técnica**: Definição da arquitetura, banco de dados e como os componentes se comunicarão.
- **Construção**: O momento da codificação propriamente dita pelos desenvolvedores.

--

<div style="text-align: center;">
    <img src="https://i.ibb.co/B2DHsHM5/modelo-v.png" width="40%" data-preview-image>
</div>

### Níveis do Teste
Representa a integração e verificação do software, subindo do micro para o macro:

- **Testes Unitários**: Validam a *menor unidade de código* (funções / métodos) gerada na fase de *Construção*.
- **Teste de Integração**: Verifica se os componentes técnicos conversam entre si conforme a *Especificação Técnica*.
- **Teste de Sistema**: Valida o software como um todo, garantindo que ele execute as funções descritas na *Especificação Funcional*.
- **Teste de Aceitação**: Realizado geralmente pelo usuário final para confirmar se os *Requisitos* originais foram atendidos.

---

## Pirâmide de Testes

A Pirâmide de Testes é um conceito que serve para *guiar a estratégia de automação de testes* em um projeto de software que ajuda os desenvolvedores a decidirem *quantos e quais tipos de testes devem ser criados*.

<div style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-wcsm.alura.com.br%2F2025%2F04%2Fimagem1-99.png&f=1&nofb=1&ipt=4a50b145c15936bdbecf38f764362ad0eecffd8e528451a19ce5cc949fd6e469" width="70%" data-preview-image>
</div>

--

Uma pirâmide padrão geralmente é dividida em três níveis:

| Tipo de Teste                      | O que são                                                                                   | Quantidade                 | Vantagens                                                 | Desvantagens                                                   |
|------------------------------------|-------------------------------------------------------------------------------------------|----------------------------|-----------------------------------------------------------|--------------------------------------------------------------|
| **Testes de Unidade**              | Testam pequenas partes isoladas (funções ou métodos).                                    | Deve ser a maior parte.    | Extremamente rápidos e baixo custo de manutenção.         | Não aplicável.                                               |
| **Testes de Integração**           | Verificam se diferentes partes do sistema funcionam bem juntas (ex: aplicação e banco). | Em quantidade moderada.    | Garantem que a "cola" entre os módulos não falhe.         | Não aplicável.                                               |
| **Testes de Ponta a Ponta (E2E)**  | Simulam o comportamento do usuário final (ex: abrir o navegador, fazer login).           | O mínimo possível.        | Validam o sistema como um todo.                           | Muito lentos, frágeis (quebram por mudanças visuais) e caros. |

---

## Tipos de Teste

### Teste Funcional

Avalia se as *funcionalidades do sistema estão operando de acordo com os requisitos e regras de negócio especificados*. Ele garante que o *software entregue o resultado esperado* quando o usuário realiza uma ação.

* **Foco:** Comportamento, entradas, saídas e regras de negócio.
* **Exemplo prático:** Verificar se, ao digitar o e-mail e a senha corretos e clicar em "Entrar", o usuário consegue fazer login no aplicativo.
* **Tipos comuns:** Testes unitários, testes de integração, testes de sistema, testes de regressão, testes de aceitação (UAT).

--

### Teste Não Funcional

Avalia o desempenho, a usabilidade, a segurança e a infraestrutura do sistema. Ele mede a *qualidade, estabilidade e a experiência geral do usuário durante o uso do software*.

* **Foco:** Desempenho, escalabilidade, segurança, facilidade de uso e compatibilidade.
* **Exemplo prático:** Verificar se a página de login carrega em menos de 2 segundos quando 10.000 usuários tentam acessar ao mesmo tempo (teste de carga/estresse).
* **Tipos comuns:** Testes de carga e estresse (performance), testes de segurança (penetração), testes de usabilidade, testes de compatibilidade (diferentes navegadores/dispositivos) e testes de acessibilidade.