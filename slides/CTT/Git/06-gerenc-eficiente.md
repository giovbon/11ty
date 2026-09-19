<!-- .slide: data-background-image="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>Gerenciamento Eficiente com GitHub CLI e Git</h1>
    <img src="https://simpleicons.org/icons/git.svg" alt="Pytest" class="glass-icon imagem-invertida" />
    <img src="https://simpleicons.org/icons/github.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

## Github CLI

O GitHub CLI (`gh`) é uma ferramenta que permite *gerenciar o GitHub diretamente pelo terminal*, sem precisar abrir o navegador. Vai permitir listar repos da sua conta, criar, clonar, criar forks, issues e PRs.

![](https://i0.wp.com/user-images.githubusercontent.com/10404068/74261502-34ae1380-4cb0-11ea-8baf-cf8248f1b222.png?ssl=1)

---

## Sincronização Segura no Git

| Comando | O que faz? | Impacto no seu código atual |
| :--- | :--- | :--- |
| **Git Fetch** | Baixa metadados e objetos do servidor. | **Zero.** Nada muda nos seus arquivos. |
| **Git Pull** | Faz o Fetch + Merge. | **Alto.** Altera seus arquivos e pode gerar conflitos. |

Diferentemente do comando `git pull`, que *baixa as alterações e tenta integrá-las imediatamente ao código*, podendo resultar em *conflitos* inesperados, o comando `git fetch` *atualiza apenas as ramificações de rastreamento remoto* (como `origin/main`). 

--

Git Fetch é útil, por exemplo:

- Ao iniciar o dia e *revisar as alterações que a equipe realizou durante a noite*, sem precisar lidar com possíveis conflitos na cópia local do código. A ação envolve a execução do comando `git fetch`, seguida pelo uso de `git log HEAD..origin/main` para visualizar a lista de novos commits.

- Quando um *colega solicita a revisão de uma funcionalidade (code review) que foi implementada em uma nova ramificação*.
    - Contexto: A ramificação `feature-nova` existe no servidor, mas não foi baixada para seu sistema local.
    - Ação: É necessário executar o comando `git fetch` para que seu repositório local reconheça a nova ramificação. Em seguida, você pode utilizar `git checkout feature-nova` para testar a implementação.

--

- Ocasionalmente, ramificações são deletadas no servidor após a conclusão de um Merge Request, mas permanecem visíveis na lista local como se ainda existissem. O comando `git fetch --prune` deve ser utilizado para *remover as referências locais de ramificações que já foram excluídas do repositório remoto*.

- Se adotar a estratégia de *Rebase* para manter um histórico linear, o uso do comando `fetch` é um passo inicial essencial.
    - Contexto: Após concluir sua tarefa, você deseja posicionar suas alterações "no topo" das atualizações mais recentes da ramificação `main`.
    - Ação: Execute `git fetch origin`. Em seguida, utilize `git rebase origin/main`.

---

## Inspeção de diferenças e Auditoria

Os três comandos abaixo são as ferramentas de investigação do desenvolvedor, servem para entender o quê, quem e por que algo mudou no código.

| Ferramenta | Pergunta que ela responde | Momento de uso |
| :--- | :--- | :--- |
| **`git diff`** | "O que eu mudei nas últimas horas?" | Durante o desenvolvimento. |
| **`git blame`** | "Quem escreveu essa linha e quando?" | Investigando bugs ou lógica antiga. |
| **`git show`** | "O que exatamente aconteceu nesse commit?" | Revisando um trabalho específico. |

--

### `diff`

O `diff` é o comando que você mais vai usar enquanto estiver escrevendo código. Ele *mostra a diferença exata entre duas versões de arquivos*.

- Contexto 1 (Antes do Commit): Você terminou de escrever uma função e quer revisar se não deixou nenhum `console.log` perdido ou uma variável com nome errado. Ação: `git diff` (mostra o que você alterou mas ainda não "stagiou").

- Contexto 2 (Comparando com a Main): Você quer ver o que a sua branch tem de diferente em relação à main do projeto. Ação: `git diff main..minha-branch`.

- Contexto 3 (Conflitos): Quando o merge trava, o `diff` te ajuda a ver o "choque" entre as versões.

--

### `blame`

O `blame` é usado para entender o contexto histórico de uma linha específica. Ele *mostra, linha por linha, quem foi o último autor e em qual commit aquela alteração foi feita.*

- Contexto 1 (Bug Misterioso): Você encontrou uma linha de código bizarra que está causando um erro. Você precisa saber quem a escreveu para perguntar: "Cara, por que você fez essa validação assim?". Ação: `git blame arquivo.js`.

- Contexto 2 (Legado): Você quer saber se aquele trecho de código é de 5 anos atrás (e provavelmente pode ser refatorado) ou se foi algo colocado semana passada por um motivo específico.

--

### `show`

Enquanto o `log` te dá a lista de mensagens, o `show` *entra dentro de um commit específico para ver as entranhas dele*.

- Contexto 1 (Pós-Blame): Você usou o blame e descobriu que o erro veio do commit abc1234. Agora você quer ver tudo o que foi enviado naquele commit (outros arquivos que mudaram juntos). Ação: `git show abc1234`.

- Contexto 2 (O que eu acabei de fazer?): Você deu um commit e quer ter certeza de que enviou os arquivos certos. Ação: `git show` (sem parâmetros, ele mostra o último commit feito).

---

## Arquivo `.gitignore`

É um *arquivo de texto oculto que você cria na raiz do projeto* (chamado literalmente `.gitignore`). Você escreve nele os nomes de *arquivos ou pastas que o Git deve ignorar completamente* (como senhas, arquivos de configuração locais, pastas de dependências gigantes como `node_modules` ou `.venv`, ou arquivos compilados). O Git *nunca vai enviá-los para o repositório remot*o, ficarão apenas no seu repo local.

--

| Padrão         | O que o Git entende?                                   | Cenário Comum                                              | Exemplo em Python                         |
|----------------|-------------------------------------------------------|-----------------------------------------------------------|------------------------------------------|
| **`*.ext`**    | Refere-se a qualquer arquivo com a extensão especificada. | `*.env` é usado para evitar o vazamento de chaves de API. | Um arquivo de configuração que armazena variáveis sensíveis. <br> Exemplo: `DATABASE_URL=postgres://user:password@localhost/db` em um arquivo `.env`. |
| **`pasta/`**   | Ignora todos os arquivos e subdiretórios dentro do diretório especificado. | `dist/` pode ser utilizado para ignorar arquivos gerados em uma compilação. | Arquivos de saída de construção, como `.pyc`, que não precisam ser versionados. <br> Exemplo: Arquivos gerados pelo comando `python setup.py build` em um diretório `dist/`. |

--

| Padrão         | O que o Git entende?                                   | Cenário Comum                                              | Exemplo em Python                         |
|----------------|-------------------------------------------------------|-----------------------------------------------------------|------------------------------------------|
| **`/arquivo`** | Ignora apenas esse arquivo que está localizado na raiz do repositório. | `/config-local.json` pode ser usado para evitar que configurações locais sejam versionadas. | Arquivo de configuração que contenha credenciais locais específicas. <br> Exemplo: Um arquivo com configurações que não devem ser compartilhadas em um ambiente de produção. |
| **`!arquivo`** | Especifica uma exceção, permitindo que o Git rastreie um arquivo mesmo que corresponda a um padrão de exclusão. | `!keep.gitkeep` é frequentemente usado para garantir que a pasta permaneça em um repositório ao manter um diretório vazio. | Utilizado em projetos para manter estrutura de diretórios. <br> Exemplo: `!data/` para garantir que um diretório `data/` vazio ainda seja adicionado ao repositório. | 


--

| Padrão           | O que o Git entende?                                  | Cenário Comum                                     | Exemplo em Python           |
|------------------|------------------------------------------------------|--------------------------------------------------|------------------------------|
| **`?`**          | Um único caractere curinga.                          | `file?.txt` ignora `file1.txt`, `file2.txt`, etc. | Um padrão para arquivos de log temporários. |
| **`[abc]`**      | Qualquer caractere dentro dos colchetes.            | `file[1-3].txt` ignora `file1.txt`, `file2.txt`, `file3.txt`. | Para tratar arquivos com números sequenciais. |
| **`**`**         | Combinações de subdiretórios.                        | `src/**/*.py` ignora todos os arquivos `.py` nos subdiretórios `src/`. | Para ignorar scripts Python em um caminho de diretório. |

--

[gitignore.io - Crie Arquivos .gitignore Úteis Para Seu Projeto.](https://www.toptal.com/developers/gitignore)