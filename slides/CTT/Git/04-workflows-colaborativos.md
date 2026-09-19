<!-- .slide: data-background-image="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>workflows colaborativos e code review</h1>
    <img src="https://simpleicons.org/icons/git.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

Vamos ver *três modelos* que padronizam como os branches devem ser criados por times de desenvolvimento de software. Trata-se de um assunto importante e prático, pois ele *disciplina o fluxo de trabalho que deve ser adotado pelas equipes para desenvolver aplicações com eficiência e segurança.*

A forma como o código flui até a produção reflete diretamente a cultura e a agilidade do projeto. Por isso, passaremos desde abordagens estruturadas para lançamentos de versões fechadas, como o GitFlow, até modelos modernos focados em integração contínua, como o GitHub Flow e o Trunk-Based Development (TBD).


---

## GitFlow

Git-flow é um modelo de gerenciamento de branches muito comum em times que usam Git. Basicamente, o modelo usa: 

**Dois branches principais e permanentes**:

- `main` (ou `master` ou `trunk`) é o branch usado para armazenar as versões de um sistema que estão em **produção**.

- `develop` é usado para armazenar código com *funcionalidades que já foram implementadas*, mas que ainda não passaram por um teste final.

**Três branches temporários**:

- Branches de funcionalidade (`feature`)
- Branches de `release`
- Branches de `hotfix`

---

### `feature`

Branches de funcionalidade (`feature`): nascem de `develop` e devem ser criados por desenvolvedores antes de começar a *implementação de uma nova funcionalidade*. Quando essa funcionalidade fica pronta, eles são integrados (via um `merge`) de volta em `develop` e são então removidos. Por isso, são branches que muitas vezes *existem apenas no repositório local* de um desenvolvedor.

---

<div style="text-align: center;">
    <img src="../../zSLIDES/img/image-gitflow.png" width="80%">
</div>

---

### `release`

Branches de `release` também nascem de `develop`, sendo usados para preparar uma nova release, a qual deve ser aprovada (ou homologada) pelo cliente final. Quando o cliente dá o sinal verde, os branches de release são integrados no `main`, já que agora temos uma nova versão do sistema pronta para entrar em produção.

<div style="text-align: center;">
    <img src="https://engsoftmoderna.info/artigos/figs/git-flow-release-branch.png" width="120%">
</div>

---

No modelo Gitflow, a branch `release` representa um estado de maturidade do código, criada quando *todas as branches de funcionalidades planejadas foram integradas à `develop` e a estabilidade inicial foi alcançada*. Isso acontece após testes automatizados, e é o momento em que a equipe decide que nenhuma nova funcionalidade será adicionada até a próxima versão.

Durante o período da `release`, o *foco é o polimento do código*, permitindo apenas correções de bugs críticos. O que é estritamente proibido nessa fase inclui a adição de novas funcionalidades e grandes refatorações, pois o risco de comprometer a estabilidade do software é elevado. Após a aprovação da `release`, ela é mergeada na `main` para um lançamento oficial, mas é crucial que também seja mergeada de volta na `develop` para garantir que as correções feitas não sejam perdidas.

---

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNqNkE1OwzAQhfecYpQDlL8dO4QEG3qIYTwkI_wTje0IcR0WXXXVI_hiuG0qEqWoeGVr3rz3-bWSXhT77grqoeCcJBDzAM3TePdCgrY5zN8UPXVgeGAb-sXKc_YkwaMVg4YjoJHD22BsYKFeo0R4n68cY6ZZypYx8vVwu7pb3SwpVVB_uU7yic_8T6rSSl3IbQTSsk1CYUydCh9Trkhf1doEyo59wrIp32Hq2zF9hJxmbTjWli8xrzmSrdajbI89BJsQPJ7MzuU4FP__kFf0ZYN78gBHySX2ZeH3fxbea9l9isNzzf8AUHu7Uw==" width="100%">
</div>

---

### `hotfix`
Branches de `hotfix` são usados para *corrigir um erro crítico que foi detectado em produção*, ou seja, em um código que está no `main`. Por isso, eles nascem do main, recebem commits que corrigem o bug crítico e, por último, são de novo integrados no `main` e também em `develop`.

<div style="text-align: center;">
    <img src="https://engsoftmoderna.info/artigos/figs/git-flow-hotfix-branch.png" width="100%">
</div>

---

## GitHub Flow

GitHubFlow é um modelo de branches muito comum quando se usa GitHub. Trata-se de um **modelo mais simples** do que Git-Flow, pois **existem apenas o branch principal e branches de funcionalidade**. Por outro lado, existe suporte a revisão de código antes de integração, por meio do mecanismo de Pull Requests (PR) do GitHub.

<div style="text-align: center;">
    <img src="https://user-images.githubusercontent.com/6351798/48032310-63842400-e114-11e8-8db0-06dc0504dcb5.png" width="80%">
</div>

---

Quando se usa GitHub Flow, os *principais passos* são os seguintes:

- Uma desenvolvedora cria um branch no seu repositório local.
- Implementa uma funcionalidade ou corrige um bug.
- Faz um push do branch para o GitHub.
- Entra no GitHub e abre um Pull Request (PR), isto é, um pedido para alguém revisar seu branch.
- Um revisor, isto é, um outro desenvolvedor revisa e, eventualmente, faz o merge do PR no main.

---

## TBD

TBD (Desenvolvimento Baseado no Trunk) é ainda mais simples do que GitHubFlow, pois *usa apenas a branch branch principal* (`main`, `master` ou `trunk`). Ou seja, *todos os desenvolvedores realizam seus commits diretamente no branch principal*.

Na verdade, mesmo em TBD, desenvolvedores podem criar branches de funcionalidade, mas tais *branches devem ter uma duração limitada*, por exemplo, de no máximo dois dias.

Ao se usar TBD, fica mais fácil adotar práticas como integração contínua (CI) e deployment contínuo (CD).

---

<div style="text-align: center;">
    <img src="https://statusneo.com/wp-content/uploads/2022/08/tbd_workflow.drawio-1-1.png" width="100%">
</div>

---

No GitHub Flow e no Trunk-Based Development (TBD), a principal diferença reside no **ritmo de trabalho** e na **cultura de integração**, e não apenas na estrutura das branches. Enquanto no GitHub Flow *a branch de funcionalidade (`feature`) permanece ativa até que a funcionalidade esteja completamente pronta e revisada*, permitindo integrações menos frequentes, o *TBD promove a integração contínua, na qual os desenvolvedores realizam merges várias vezes ao dia, fragmentando seu trabalho em pequenos pedaços que são constantemente integrados, mesmo que ainda estejam incompletos*.

Outra distinção significativa é a forma *como cada abordagem lida com o código incompleto*. No GitHub Flow, segue-se um modelo de isolamento onde as funcionalidades incompletas ficam retidas em branches isoladas. Em contraste, o TBD utiliza **Feature Flags** para esconder código incompleto diretamente na `main`, permitindo que o código seja integrado e testado em produção sem que o usuário final tenha acesso a funcionalidades não finalizadas. A revisão de código também difere, com o GitHub Flow dependendo de revisões assíncronas via Pull Requests, enquanto o TBD prioriza um fluxo de trabalho contínuo, com revisões muitas vezes ocorrendo em tempo real ou de forma automatizada.

---

## Comparativo de Estratégias de Branching

| Critério                        | GitFlow                             | GitHub Flow                       | Trunk-Based Development (TBD)      |
|---------------------------------|-------------------------------------|-----------------------------------|-------------------------------------|
| **Complexidade Estrutural**     | Alta                                | Baixa a Média                     | Muito Baixa                         |
| **Branches de Longa Duração**    | `main`, `develop`                  | Apenas `main`                     | Apenas `main`                       |
| **Branches Efêmeras**            | `feature`, `release`, `hotfix`     | `feature` (atreladas a PRs)      | `feature` curtas (horas/dias)      |


---

| Critério                        | GitFlow                             | GitHub Flow                       | Trunk-Based Development (TBD)      |
|---------------------------------|-------------------------------------|-----------------------------------|-------------------------------------|
| **Frequência de Integração**     | Baixa a Média                       | Alta                              | Altíssima (várias vezes ao dia)    |
| **Nível de Maturidade da Equipe**| Tradicional / Estruturada           | Intermediária / Colaborativa      | Alta                                |
| **Cenário Ideal de Uso**         | **Software com versões marcadas**, como aplicativos móveis ou sistemas legados, onde é necessário entregar pacotes significativos de mudanças em ciclos estabelecidos. | **Aplicações Web e SaaS**, focadas em lançamentos ágeis e colaborativos, permitindo feedback rápido através de pull requests. | **Projetos focados em Continuous Deployment**, onde a agilidade é crítica e a equipe é altamente disciplinada, permitindo alterações contínuas no código com integração quase instantânea. |

---

## Pull Request (PR)

Um **Pull Request (PR)** é uma *solicitação feita por um desenvolvedor para integrar suas alterações de código em uma branch principal de um repositório remoto*. 

Ao criar um PR, o desenvolvedor propõe suas modificações, permitindo que outros membros da equipe *revisem, comentem e sugiram melhorias* antes que as alterações sejam integradas. Este processo facilita a *colaboração* entre os desenvolvedores, assegurando a *qualidade do código* por meio de revisões e testes, além de proporcionar um *histórico* claro das alterações no projeto.

---

O padrão de trabalho com **Pull Requests (PRs)** envolve os seguintes passos:

1. **Criação da Branch**: O desenvolvedor cria uma nova branch para trabalhar em uma funcionalidade ou correção.
   
2. **Desenvolvimento**: O código é desenvolvido nessa branch específica.

3. **Envio para o GitHub**: O desenvolvedor usa o comando `git push origin nome-branch` para enviar as alterações para o repositório remoto no GitHub.

4. **Revisão de Código**: O gestor analisa o código enviado, podendo adicionar comentários, sugerir melhorias ou indicar elementos que estão faltando.

5. **Finalização do PR**: Após a revisão e a implementação das sugestões, o PR é finalizado, fazendo o merge com a branch **main**.

6. **Exclusão da Branch**: Por fim, a branch criada é excluída para manter o repositório limpo.

---

### Por que esse processo é vital?

* **Rastreabilidade:** Cada linha de código na `main` tem um histórico de *por que* ela foi criada (ligada à Issue).
* **Segurança (Protected Branches):** Em projetos sérios, a branch `main` nunca é tocada diretamente. Ela é protegida para que apenas código revisado via PR possa entrar.
* **Qualidade (CI/CD):** É aqui que você encaixa o seu **GitHub Actions**. O PR serve como o "gatilho" para os testes automáticos. Se o código não passar nos testes do `pytest` ou `unittest`, o botão de *Merge* fica bloqueado. Isso tira a responsabilidade humana de checar se o código quebra a aplicação.

---

## Code Review

<!-- https://engsoftmoderna.info/artigos/revisao-codigo.html -->

A ideia de *revisão de código* é simples: todo *código desenvolvido* por um desenvolvedor (**author**) tem que ser, em seguida, *analisado* por pelo menos um outro desenvolvedor (**reviewer**). O revisor pode adicionar *comentários* no código sob revisão, procurando *esclarecer dúvidas, sugerindo melhorias, indicando bugs*, etc.

O *autor pode modificar sua implementação* para atender a alguma sugestão do revisor que ele achou procedente. Ou então, ele pode replicar e justificar que ela não faz sentido. Espera-se que após esse diálogo o código seja *aprovado pelo revisor* e possa ser integrado no repositório do projeto.

---

<div style="text-align: center;">
	<img src="https://kroki.io/nomnoml/svg/eNqNUsFOwzAMvfcrLPU8CQS7VGiogiscxnHqwUrczpDGVZJ234M48AF8Qn-MtGWom1BHckns5_eeE6eaHanAYjPQcrBJ6htUbKsM1ldJ2qDW4-V6naQlG5NBWt4OOwKDkzeKgZtxJckub8NeXAaP5Ml2YjoCAdV_aa6kgNUGdlvqmA4UMblFwx5ngEiwlB7r79ReWNEGHqYo5I2TDrXcD-ULWVjBc_8h5yY0q9g6gpKabOjfHYsvLhG9cD2Z8QHDDIQ_ICBgG6hy8XzW1Z96p51NjwioiAMCgm8r8iF6P21xATazePyRJ9FcshqAXDeGBnXsPyO8-Dfn7_sdSbfUmIGT4LX1YeQvZlOwoHl5FhZFLpZ_A5ZVA94=" width="100%" data-preview-image>
</div>


---

Esse impasse, quando o autor (codificador) e o revisor não aceitam as sugestões um do outro é uma situação super comum no dia a dia das equipes de desenvolvimento. Esse cenário é chamado de **"deadlock"** ou impasse de revisão, a solução deixa de ser apenas técnica e passa a envolver a comunicação e a cultura da equipe.

As práticas recomendadas para resolver esses impasses incluem:

1. **Sair do Assíncrono (Mudança de Meio)**: Se houver muitas idas e vindas nos comentários, uma chamada de vídeo rápida pode esclarecer mal-entendidos de forma mais eficaz do que mensagens escritas.

2. **Chamar um "Desempate" (Tie-breaker)**: Em divergências técnicas, adicionar um terceiro desenvolvedor, como um líder técnico ou Code Owner, pode ajudar a tomar uma decisão.

---

3. **Recorrer à Documentação e Padrões**: Consultar guias de estilo e documentações relevantes ajuda a eliminar subjetividades e segue as normas previamente estabelecidas.

4. **Princípio do "Disagree and Commit"**: Quando persistem divergências, a pessoa mais responsável pela entrega toma a decisão final, permitindo que o projeto avance.

5. **Acordo de Trade-off (Dívida Técnica)**: Se for melhor optar pela sugestão do revisor, mas isso atrasaria a entrega, pode-se aprovar o código atual e criar uma nova **Issue** para melhorias futuras, assumindo a dívida técnica de forma consciente.

---

### Motivação
As principais motivações do code review são encontrar bugs no código submetido; melhorar o código; propor soluções alternativas; transferir conhecimento (o autor pode aprender com os comentários do revisor e vice-versa)

Questões que devem ser apontadas e consideradas em revisões de código:

- Bugs em geral
- Código mais complexo do que o necessário
- Código que usa um algoritmo e/ou estrutura de dados menos eficiente
- Código que não trata exceções e erros
- Ausência de testes
- Ausência de documentação, principalmente aquela mais relevante
- Falhas de segurança ou privacidade
- Problemas de desempenho
- Problemas de usabilidade com o usuário

---

No GitHub, o code review é realizado principalmente por meio de pull requests (PRs), que funcionam como uma etapa de garantia de qualidade antes de o código ser integrado à branch principal. Cada PR permite que outros desenvolvedores revisem o código proposto, avaliem legibilidade, segurança, desempenho e aderência a padrões, além de executar verificações automatizadas (como testes e análise estática) via CI/CD. Somente após aprovação e sucesso nos checks o merge é permitido, garantindo que cada mudança passe por revisão técnica e validação automatizada, fortalecendo assim a qualidade e a confiabilidade do software.

---

Diversos problemas tratados em uma revisão de código podem ser detectados de forma automática por meio de ferramentas de análise estática. Por exemplo, questões como convenções de nomes de identificadores (camel case, snake case, etc), leiaute de código e estilo de indentação (tab ou espaços, por exemplo) podem ser padronizadas por meio de linters. Com isso, evita-se que um revisor humano tenha que perder tempo com tais questões.

- [Code Review Pyramid](https://roadmap.sh/code-review?fl=0)
- [Code Review Best Practices](https://roadmap.sh/best-practices/code-review)