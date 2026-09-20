---
title: Gerenciamento Eficiente com GitHub CLI e Git
order: 9
presentation:
  - "slides/CTT/Git/06-gerenc-eficiente.md"
asciinema: 
  - "asciinema/12-github-cli.cast"
---

## Github CLI

O GitHub CLI (gh) é uma ferramenta que permite gerenciar o GitHub diretamente pelo terminal, sem precisar abrir o navegador.

    - [GitHub CLI | Take GitHub to the command line](https://cli.github.com/)
    - [What is the GitHub CLI? How to Use GitHub from the Command Line](https://www.freecodecamp.org/news/how-to-use-github-from-the-command-line/)

```bash
# Linux (Ubuntu/Debian)
sudo apt install gh
gh --version

# "Windows"
winget install --id GitHub.cli
gh --version
```

Para autenticar use o comando `gh auth login`. No login escolha as opções:

```
What account do you want to log into? GitHub.com
What is your preferred protocol for Git operations? SSH
Upload your SSH public key to your GitHub account? /home/giobon/.ssh/id_rsa.pub
How would you like to authenticate GitHub CLI? Login with a web browser
```

Finalize colocando um código de 6 dígitos que aparece no terminal no navegador.

```bash
gh auth status

  ✓ Logged in to github.com as giovbon (/home/giobon/.config/gh/hosts.yml) 
```

Quando você for criar um Pull Request ou uma Issue pelo terminal, o gh pode abrir um editor de texto para você escrever a descrição. Você pode definir o seu editor favorito (como o VS Code, Nano ou Vim) com o comando:

```bash
# Para usar o VS Code:
gh config set editor "code --wait"

# Para usar o Nano (muito comum em Linux/Mac):
gh config set editor "nano"
```

### Comandos

| Comando                                                | Descrição                                                                                                  |
|-------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `gh repo list`                                       | Lista repositórios da sua conta.                                                                          |
| `gh repo create my-repo-name --public`                        | Cria um novo repositório.                                                                                 |
| `gh repo create <nome-do-repo> --source=. --push --public`                        | Cria um novo repositório e manda o repo local direto para ele.                                                                                 |
| `gh repo clone owner/repo-name`                      | Clona um repositório existente.                                                                           |
| `gh repo view --web`                                 | Abre a página do repositório atual diretamente no seu navegador de internet.                              |
| `gh repo fork facebook/react`                         | Faz o fork do projeto na sua conta, especificando qual.                                                  |
| `gh repo fork`                                       | Faz o fork do projeto na sua conta, identificando o projeto em que você está atualmente no terminal.      |
| `gh repo sync`                                       | Atualiza o seu repositório local (ou seu fork) com as últimas mudanças do repositório original (upstream). |
| `gh pr list`                                         | Lista os Pull Requests abertos no repositório atual.                                                     |
| `gh pr status`                                       | Mostra um resumo rápido de todos os PRs que importam para você (criados por você, que pedem sua revisão, etc). |
| `gh pr create --title "Minha nova feature" --body "Explicação detalhada do que foi feito"` | Criação de Pull Request (após criar a branch com git, adicionar coisas nela, fazer commit e o push da branch para o GitHub). |
| `gh issue list --repo giovbon/docs`                 | Lista issues do repositório específico.                                                                   |
| `gh issue create`                                    | Cria uma nova Issue no repositório atual (abre um menu interativo).                                      |