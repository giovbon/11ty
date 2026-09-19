---
title: Introdução
presentation: "slides/AST/01AST-SL-intro-testes-software.md"
order: 1
typst: 
- path: "typs/ATS/ATS01.typ"
  name: "Exercício AST01"
submission: 
  - "AST01"
---

## Etapas
Existem etapas bem definidas para a execução da atividade de teste:

### 1. Planejamento

Definimos o que vamos testar:

* **Objetivo:** Verificar se o campo aceita apenas senhas entre **8 e 12 caracteres**.
* **Escopo:** Vamos focar na validação do tamanho da senha, não na forma como ela é salva (no banco de dados).
* **Critério:** Utilizaremos **Análise do Valor Limite**, onde erros costumam aparecer.

### 2. Projeto de Casos de Teste

Criamos os cenários de teste com base em **Classes de Equivalência** e **Limites**:

### Classes de Equivalência
Esse conceito é usado para *reduzir o número de casos de teste* que precisam ser realizados. A ideia é *agrupar entradas que devem ter o mesmo resultado*. Por exemplo, se a regra diz que a senha deve ter entre 8 e 12 caracteres:

- **Classe Válida**: Senhas com 8, 9, 10, 11 e 12 caracteres.
- **Classe Inválida**: Senhas com menos de 8 ou mais de 12 caracteres.

Assim, em vez de testar cada uma das senhas possíveis, você testa apenas uma de cada classe.

### Limites

Esse conceito envolve *testar os valores nas bordas das classes*, onde os erros são mais frequentes. No exemplo da senha, você testaria:

- A menor quantidade aceitável: 8 caracteres.
- A maior quantidade aceitável: 12 caracteres.
- Um abaixo do mínimo: 7 caracteres.
- Um acima do máximo: 13 caracteres.

Esses testes de limites ajudam a garantir que o software se comporte corretamente em torno dos critérios estabelecidos.

| Caso de Teste | Dado de Entrada (Senha) | Técnica | Resultado Esperado |
| --- | --- | --- | --- |
| CT01 | `1234567` (7) | Limite (mínimo - 1) | **Erro:** "Senha muito curta" |
| CT02 | `12345678` (8) | Limite (mínimo) | **Sucesso:** Senha aceita |
| CT03 | `123456789012` (12) | Limite (máximo) | **Sucesso:** Senha aceita |
| CT04 | `1234567890123` (13) | Limite (máximo + 1) | **Erro:** "Senha muito longa" |
| CT05 | `ABC123` (6) | Classe de Equivalência (Inválida) | **Erro:** "Senha muito curta" |

### 3. Execução

O testador ou um script automatizado insere cada senha criada:

* **Ação:** Digitar `1234567890123`.
* **Observação:** O sistema exibiu uma mensagem de erro?

### 4. Análise

Aqui, comparamos os resultados com o que esperávamos:

* **Cenário A:** Para 13 caracteres, o sistema deu erro. **Resultado:** Teste bem-sucedido.
* **Cenário B:** Se aceitou, é um **DEFEITO** a ser corrigido.

## Pirâmide de Testes

A pirâmide de testes é uma metáfora visual clássica, criada originalmente por Mike Cohn, que serve como um guia para estruturar a estratégia de testes de um software de forma eficiente. Em sua essência, ela divide os testes em três camadas principais, ilustrando a quantidade ideal de cada tipo de teste que um projeto deve ter. Na base larga da pirâmide, ficam os **testes de unidade**, que são rápidos de executar, baratos para criar e testam pequenos pedaços isolados de código. Subindo para o meio, temos os **testes de integração**, em menor quantidade, que verificam se esses pedaços isolados funcionam bem quando conectados, como a comunicação do sistema com um banco de dados. No topo estreito da pirâmide estão os **testes de ponta a ponta (E2E) ou de interface (UI)**, que simulam o comportamento real do usuário; eles devem existir na menor quantidade possível, pois são lentos, caros de manter e quebram com facilidade.

Compreender e aplicar esse conceito é de extrema importância porque ele ajuda as equipes a equilibrarem custo, velocidade e confiança. Sem a pirâmide, é muito comum que os times caiam no chamado "antipadrão do cone de sorvete", onde investe-se quase todo o tempo fazendo testes manuais ou de interface de usuário pesados e esquecem-se das fundações. Isso resulta em um ciclo de desenvolvimento arrastado: qualquer alteração no código demora horas para ser validada, e quando um teste de tela falha, é muito difícil descobrir qual linha exata de código causou o problema. A pirâmide garante que os desenvolvedores tenham um ciclo de feedback rápido durante a programação diária por meio dos testes de unidade, deixando os testes mais pesados apenas para os fluxos mais críticos do sistema.

Apesar de a ideia original ser muito sólida, hoje em dia você encontrará diversas versões e adaptações da pirâmide simplesmente porque a forma como se contrói software mudou de maneira drástica desde que ela foi concebida. A pirâmide original pensava muito em aplicações monolíticas tradicionais. Hoje, nós temos arquiteturas baseadas em microsserviços, aplicações focadas fortemente no frontend (como React ou Angular) e sistemas baseados em nuvem. 

Por conta dessa evolução, novos modelos surgiram para refletir melhor essas realidades. Por exemplo, surgiu o "Troféu de Testes" (Testing Trophy), popularizado por Guillermo Rauch, que defende que no frontend moderno os testes de integração devem ser o foco principal, formando o "bojo" do troféu, pois eles dão mais confiança do que testar componentes visuais isolados. Outro modelo é o "Favo de Mel" (Testing Honeycomb), muito usado no ecossistema de microsserviços, que também foca fortemente em testes de integração para garantir que as dezenas de pequenos serviços conversem bem entre si. No fim das contas, as várias versões não significam que a pirâmide original estava errada, mas sim que o princípio central — investir onde o custo-benefício e a confiança são maiores para o seu contexto específico — precisou se adaptar às novas tecnologias.

| Nível | Tipo de Teste | Características | Quantidade |
| :--- | :--- | :--- | :--- |
| Base | Testes Unitários | Rápidos, isolados, confiáveis | Muitos |
| Meio | Testes de Integração | Verificam comunicação entre componentes | Moderada |
| Topo | Testes E2E/UI | Simulam comportamento do usuário | Poucos |


## Erros em sistemas críticos

- Em 2012, a **Knight Capital**, uma das maiores *corretoras de ações* dos EUA, instalou um novo software de negociação. O problema surgiu quando um *código antigo e "morto"*, que estava desativado há anos nos servidores, foi acidentalmente reativado devido a uma configuração errada durante o deploy. *O sistema começou a comprar e vender milhões de ações de forma frenética, perdendo dinheiro em cada transação.* Em apenas 45 minutos, a empresa enfrentou um prejuízo de *440 milhões de dólares*. Eles *quase faliram* e precisaram da ajuda de um grupo de investidores para se manter.

- O **Therac-25** era uma *máquina de radioterapia* computadorizada. O problema começou com um bug conhecido como "condição de corrida" (race condition). Se o *operador digitasse os comandos muito rapidamente*, o software ativava o feixe de elétrons de alta energia sem que o escudo protetor fosse colocado no lugar. O resultado foi alarmante: a máquina liberava *doses de radiação até 100 vezes mais altas* do que o planejado, mas mostrava uma mensagem de erro genérica ("Malfunction 54") que não informava sobre o perigo real. Pelo menos seis pacientes receberam overdoses massivas de radiação, o que levou a *mortes e ferimentos gravíssimos*.

- A **sonda** foi enviada para *estudar o clima de Marte*, mas nunca conseguiu completar a missão. O problema começou com uma *falha na conversão de unidades*: uma equipe da Lockheed Martin usou o sistema Imperial (libras-força), enquanto a equipe da NASA utilizou o sistema Métrico (Newtons). Isso gerou um caos, já que o software de navegação recebeu dados errados, *fazendo com que a sonda se aproximasse demais da atmosfera de Marte*. O resultado foi a *destruição da sonda* devido ao calor e pressão atmosférica, com um custo total da missão em torno de *125 milhões de dólares*.

## 📚 Referência
- [Cap. 8: Testes – Engenharia de Software Moderna](https://engsoftmoderna.info/cap8.html)
- [Maratona de Testes Automatizados — Step 0: Fundamentos, Importância e a Pirâmide de Testes - DEV Community](https://dev.to/diegobrandao/maratona-de-testes-automatizados-step-0-fundamentos-importancia-e-a-piramide-de-testes-3i6n)