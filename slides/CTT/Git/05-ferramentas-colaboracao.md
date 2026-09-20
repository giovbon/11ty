<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">CTT · Collaboration Tools for Teams</p>

# Ferramentas de Colaboração no Github

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">06</p>

---

Esses recursos juntos tornam o GitHub uma plataforma poderosa para colaboração em projetos de software:
- Forks
- Issues
- Projects
- Pull Request

---

| **Recurso** | **O que é** | **Para que é usado** |
|---|---|---|
| **Fork** | Cópia de um repositório que permite modificar e experimentar sem afetar o original. | Contribuir com projetos, testar ideias ou criar versões personalizadas. |
| **Issues** | Sistema para rastreamento de bugs, solicitações de recursos e tarefas relacionadas. | Gerenciar tarefas, discutir problemas e colaborar com desenvolvedores. |
| **Projects** | Recurso para organizar e gerenciar tarefas visualmente, usando quadros Kanban ou listas. | Planejar, organizar e acompanhar o progresso de projetos. |
| **Pull Requests** | Pedido para mesclar alterações feitas em um fork ou branch para o repositório original. | Solicitar a incorporação de alterações, facilitando a revisão de código. |  

---

## Fork
<!-- https://engsoftmoderna.info/capAp.html#forks -->

**Fork** é o mecanismo que o GitHub oferece para *clonar repositórios remotos*, isto é, repositórios armazenados pelo próprio GitHub. Um fork é *realizado via interface do GitHub*. Na página de qualquer repositório, existe um botão para realizar essa operação. Se fizermos um fork do repositório `torvalds/linux` será criado uma cópia desse repositório na nossa conta do GitHub, chamado, por exemplo, `giovbon/linux`.

Em repositórios privados, apenas usuários com acesso ao repositório podem criar forks.

---

**Principais Usos de um Fork**

1. **Contribuição em Projetos Open Source** (Principal uso): Se você quer *corrigir um bug ou adicionar uma funcionalidade em um projeto público* (como o Linux, React, ou uma ferramenta de terceiros), você não tem permissão para alterar o código deles diretamente. O fork permite que você faça as alterações na sua cópia e, depois, peça para os donos do projeto original avaliarem e aceitarem seu código (através de um Pull Request).
2. **Ponto de Partida para um Novo Projeto**: Você pode encontrar um projeto que faz 90% do que você precisa, fazer um fork e seguir um caminho completamente diferente, *criando um software novo e independente a partir daquela base*.
3. **Experimentação Segura**: Se você quer testar uma *refatoração gigantesca ou uma ideia improvável em um projeto*, você pode fazer um fork. Se tudo der errado, o projeto original (e o repositório principal da sua equipe) permanece intacto.

---

Como usar um fork para contribuir com um projeto

1. **Fazer o Fork**: Vá até a página do repositório original no GitHub. No canto superior direito, clique no botão "Fork".
<div style="text-align: center;">
<img src="https://i.ibb.co/jvYzDFPz/image.png" width="100%" data-preview-image>
</div>
Selecione a sua conta. Agora você tem uma cópia exata do projeto no seu perfil (ex: `github.com/seu-usuario/nome-do-projeto`).

2. **Clonar o seu Fork** para a sua máquina: você precisa baixar a sua cópia, não a original. No seu terminal, digite: `git clone https://github.com/seu-usuario/nome-do-projeto.git`

3. **Configurar o "Upstream"** (Boa Prática). Para garantir que o seu fork não fique desatualizado em relação ao projeto original, você adiciona um atalho para o repositório principal, normalmente chamado de `upstream`:`git remote add upstream https://github.com/dono-original/nome-do-projeto.git`

---

4. **Criar uma Branch para a sua alteração**. Nunca trabalhe diretamente na branch `main` ou `master` do seu fork. Crie uma branch específica para o que você vai fazer: `git checkout -b minha-nova-feature`

5. **Fazer as alterações e Commitar**: trabalhe no código, salve os arquivos e registre suas mudanças.

6. **Fazer o Push para o seu Fork**: envie as alterações da sua máquina para a sua cópia no GitHub.

7. **Abrir o Pull Request (PR)**: depos é só esperar os mantenedores do projeto original revisarem seu código.

---

## Issues

Um issue no GitHub é um *recurso usado para rastrear bugs, solicitações de recursos, tarefas a serem realizadas ou qualquer tipo de discussão sobre um projeto*. Os issues permitem que os membros da equipe *identifiquem e organizem trabalho pendente*, facilitando a comunicação sobre problemas e melhorias. Cada issue pode ser comentado, rotulado e atribuído a um ou mais colaboradores, tornando-se uma ferramenta valiosa para gerenciar projetos e manter um registro do que precisa ser feito ou o que já foi discutido. Além disso, os issues *permitem que a comunidade colabore e dê feedback de forma estruturada*.

<div style="text-align: center;">
    <img src="https://i.ibb.co/4RjVp6XC/image.png" width="100%" data-preview-image>
</div>

---

**Principais Usos de uma Issue**

1. **Rastreamento de Bugs** (Bug Tracking): É o uso mais comum. *Quando alguém encontra um erro no código* ou no sistema, abre-se uma issue relatando o problema, como reproduzi-lo e qual era o comportamento esperado.
2. **Solicitação de Novas Funcionalidades** (Feature Requests): Antes de sair programando algo novo (especialmente em equipes ou projetos open source), cria-se uma *issue propondo a ideia*. Isso permite que a equipe discuta se a *funcionalidade faz sentido* antes de investir tempo no código.
3. **Gerenciamento de Tarefas** (To-Do List): Equipes usam issues para *quebrar um projeto grande em partes menores*. Cada issue representa uma tarefa que precisa ser feita (ex: "Criar endpoint de login", "Atualizar documentação").
4. **Dúvidas e Discussões Arquiteturais**: Em muitos repositórios, as issues também servem como um *espaço documentado para discutir como resolver um problema técnico complexo antes da implementação*.

---

Aqui está o fluxo padrão de como criar e gerenciar uma issue de forma profissional:

1. **Abrir a Issue**: Vá até a página do repositório no GitHub, clique na aba *"Issues"* (logo abaixo do nome do repositório). Clique no botão verde *"New issue"*. Projetos organizados geralmente oferecem modelos (Templates) de issue nesta etapa (ex: "Reportar Bug" ou "Sugerir Feature").

2. **Preencher com Clareza** (Título e Descrição)

* *Título*: Deve ser direto e resumir o problema (ex: *Botão de login não funciona no Firefox* em vez de *Erro no site*).
* *Descrição*: Use Markdown para formatar a explicação. Se for um bug, inclua:
    * Passos para reproduzir o erro.
    * O que você esperava que acontecesse.
    * O que realmente aconteceu (logs de erro, prints de tela).

---

3. **Adicionar Metadados** (Contexto para a equipe, *apenas por mantenedores, colaboradores e administradores*)
No menu lateral direito da issue, você pode classificar o ticket:
    * **Assignees**: Escolha quem será o responsável por resolver aquela tarefa.
    * **Labels** (Etiquetas): Categorize a issue (ex: `bug`, `enhancement`, `documentation`, `help wanted`).
    * **Projects / Milestones**: Vincule a issue a um quadro Kanban (GitHub Projects) ou a um prazo de entrega/versão específica do software.
* Ao finalizar, clique em *"Submit new issue"*. Ela ganhará um *número de identificação* (ex: `#42`).

4. **Desenvolvimento e Discussão**: a equipe ou a comunidade pode comentar na issue para tirar dúvidas ou sugerir abordagens. Quando o desenvolvedor for trabalhar nela, é uma boa prática *criar uma branch com o número da issue* (ex: no terminal, rodar `git checkout -b fix-issue-42`).

---

5. **Fechamento Automático via Pull Request**: quando o código que resolve a issue estiver pronto, o desenvolvedor abre um Pull Request. Na descrição do PR, ele escreve uma palavra-chave seguida do número da issue, como: `Closes #42`, `Fixes #42` ou `Resolves #42`. Assim que esse Pull Request for aprovado e fundido (merged) na branch principal, *o próprio GitHub fecha a issue automaticamente*.

6. **Fechamento Manual**: se a equipe decidir que o bug não será corrigido, que a funcionalidade não faz sentido, ou se for uma issue duplicada, um mantenedor pode simplesmente clicar no botão *"Close issue"* no final da página, com um comentário explicando o motivo.

---

Qualquer pessoa com uma conta no GitHub pode criar uma issue em repositórios públicos, por padrão. No entanto, existem exceções:

- **Quando Você NÃO Pode Abrir uma Issue**
    - *Aba de Issues Desabilitada*: O dono pode desligar essa função.
    - *Repositório Arquivado*: Projetos arquivados são somente leitura.
    - *Limites de Interação*: Os mantenedores podem restringir a criação de issues por motivos como spam.
    - *Bloqueio*: Se sua conta for bloqueada pelo dono do repositório, você não poderá interagir.

---

## Projects

Os Projects no GitHub são ferramentas de *gerenciamento de projetos* que permitem organizar e acompanhar o progresso das tarefas dentro de um repositório. Eles utilizam uma abordagem visual, frequentemente em formato de **quadro Kanban**, onde as tarefas podem ser representadas como *cartões em colunas que refletem diferentes estados (por exemplo, "A Fazer", "Em Progresso" e "Feito")*. 

<div style="text-align: center;">
	<img src="https://i.ibb.co/8LNWQkzJ/image.png" width="100%" data-preview-image>
</div>

---

**Principais Usos do GitHub Projects**

1. **Gestão Visual do Trabalho** (Kanban e Tabelas): É o uso clássico. Ele permite criar quadros visuais onde você *arrasta cartões de "A Fazer" (To Do) para "Em Progresso" (In Progress) e "Concluído" (Done)*.

2. **Planejamento de Roadmaps e Sprints**: Equipes usam o Projects para *agrupar Issues que farão parte de um lançamento específico (Release) ou para organizar o trabalho em ciclos (Sprints)*, definindo prioridades, estimativas de tempo e datas de entrega.

3. **Visão Macro** (Multi-repositórios): Diferente da aba "Issues" que fica presa a um único repositório, um Project pode puxar Issues de *vários repositórios* diferentes da sua conta ou organização, dando uma visão geral do que a equipe inteira está fazendo.

4. **Automação de Tarefas**: Você pode configurar regras para que, quando um desenvolvedor abrir um Pull Request para resolver uma Issue, o cartão dessa Issue mova automaticamente para a coluna "Em Revisão".

---

Aqui está o fluxo padrão de como configurar e usar um GitHub Project:

1. **Criar o Projeto**: vá até o seu perfil de usuário ou na página da sua Organização. Clique na *aba "Projects"* (geralmente fica ao lado de Repositories). Clique em *"New project"*. Você pode começar com um projeto em branco ou escolher um template (como um quadro Kanban clássico - *Board*).

2. **Adicionar Itens** (As Tarefas): dentro do projeto, você precisa povoá-lo com itens. Você pode fazer isso de duas formas:
    * *Puxar Issues existentes*: Digite `#` na barra de adição e busque pelos repositórios e Issues que você já criou.
    * *Criar Drafts (Rascunhos)*: Se você quer apenas anotar uma ideia rápida que ainda não virou uma Issue oficial com descrição completa, basta digitar o título e dar Enter. Ela vira um "Draft item" no quadro. Depois, você pode converter esse rascunho em uma Issue real.

---

3. **Criar Campos Personalizados** (Custom Fields): além dos campos padrão (Status e Assignees), você pode criar os seus próprios clicando em "Settings" e depois em "Custom fields". Exemplos:
    * *Prioridade:* (Alta, Média, Baixa)
    * *Tamanho da Tarefa / Story Points:* (1, 2, 3, 5, 8...)
    * *Data de Início e Data de Término*

4. **Criar Diferentes Visualizações (Views)**: você não precisa olhar para os dados de um jeito só. Você pode criar abas (Views) no topo do seu projeto:
* View 1 (*Board*): O clássico quadro Kanban para os desenvolvedores arrastarem os cartões.
* View 2 (*Table*): Uma visão estilo planilha do Excel, ótima para organizar e filtrar centenas de tarefas rapidamente.
* View 3 (*Roadmap*): Um gráfico de Gantt baseado nas datas de início e término das tarefas, excelente para gerentes visualizarem prazos.

---

5. **Configurar Automações** (Workflows): para não ter que arrastar cartões manualmente o tempo todo, você clica no botão "Workflows" no canto superior direito. Lá você ativa regras simples, como:
    * *Quando um Pull Request é fundido (Merged) -> Mova a Issue associada para a coluna "Done".*
    * *Quando uma Issue é fechada -> Mova para "Done".*

Sobre permissões: Assim como nas Issues, qualquer visitante pode visualizar um Project público, mas *apenas membros com permissão no repositório/organização* podem adicionar itens, mover cartões ou alterar as configurações do projeto.