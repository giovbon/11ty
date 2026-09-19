
# CTT

# CTT
## Git e Github
### Controle de Versão
- Sistema de controle de versões
  - Vantagens do distribuído sobre centralizado
- CLI do linux, comandos git
  - Configurações iniciais
- Repositórios
  - `git init` `git clone`
- Commit `git commit`
### Áreas do Git
- Local (Working directory, Staging area e Repository)
  - `git status` `git add`
- Desfazer coisas
  - `git reset` `--soft` `--hard` <!--+ mixed-->
  - `git revert`
  - `git restore`
### Github e Repositórios Remotos
- Repositórios remotos público e privados
  - Formas de se trabalhar
- Criar chave SSH e adicionar no github para autenticação
- `git remote` `git push` `git pull`
### Branching e Merging
- Branch
  - `git branch` `git checkout/switch`
  - HEAD
- Integrar alterações entre branchs
  - Merge fast-forward / three-way `git merge`
  - Rebase `git rebase`
- Conflitos e como resolver
### Workflows Colaborativos
- Gitflow
  - main, develop, feature, release e hotfix
- Github Flow
- TBD
- Pull Request (PR)
- Code Review
### Ferramentas de Colaboração no Github
- Fork
- Issues
- Projects
### Gerenciamento Eficiente com Github CLI e Git
- Github CLI
- `git fetch`
- Inspeção e auditoria
  - `git diff` `git blame` `git show`
- `.gitignore`


## Github Actions
### I
- Evento ➜ Workflow ➜ Jobs ➜ Runner ➜ Steps
- Act
    - Comandos
- Secrets e Variables (vars)
### II
- Actions
### III
- Dependências (`needs`)
- Controlar quando os workflows são executados
- Variáveis de ambiente (env) e escopo
- Transferência de dados (env)
### IV
- Variáveis e Segredos do GitHub
- Contextos
- Artefatos

<!--
## ⚠️ NÃO ABORDADOS ⚠️
- Branch Protection Rules
- Conventional Commits
-  Versionamento Semântico
- "Conventional Commits" e "Git Hooks" (Husky)
- Slides removidos
    - Git avançado
    - Boas Práticas Avançadas de Colaboração
## INCLUIR
- Voltar em commit e ver como as coisas eram... criar branch a partir daquele ponto
-->