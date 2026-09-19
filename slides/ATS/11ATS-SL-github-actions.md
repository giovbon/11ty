<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>github actions</h1>
    <img src="https://simpleicons.org/icons/githubactions.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

Até agora, nós mergulhamos no **como** construir a qualidade do nosso software. Aprendemos a criar testes robustos com **Pytest**, automatizamos interações no navegador com **Selenium**, e aplicamos metodologias como **TDD** e **BDD** para garantir que o comportamento e as regras de negócio estejam blindados. Vimos também como usar **Dublês de Teste** e **Fixtures** para isolar cenários e testar **APIs** de forma eficiente.

Mas, até este ponto, tudo o que fizemos depende de uma ação manual: eu ou você abrindo o terminal e rodando um comando na nossa própria máquina.

O problema é que, no mundo real, a qualidade não pode depender da máquina do desenvolvedor. Ela precisa ser um processo totalmente automatizado. **E é aqui que entra o GitHub Actions.**

--

A partir de agora, vamos ver como pegar todos esses testes que criamos e colocá-los para rodar automaticamente. O foco agora sai do *como testar* e entra no *como automatizar*: vamos entender como o GitHub identifica cada `git push` seu e transforma isso em um gatilho para disparar uma infraestrutura inteira que vai validar seu código, rodar seus testes e garantir que nada quebre antes de chegar ao usuário final.

Vamos entender como essa estrutura de Workflows, Jobs e Runners funciona na prática..."

---

## Github Actions

No GitHub, quando você faz um `git push`, o servidor olha para a pasta `.github/workflows/` à procura de workflows (arquivos `.yml` ou `.yaml`) e dispara todos os arquivos que tenham `on: push` configurado. 

```
├── Projeto
│   ├── .github
│       ├── workflows
│   │   │   └── work-hello.yml
```

--

## Elementos básicos de um workflow

Elementos básicos de um workflow, a estrutura mínima para um workflow funcionar:

<div style="text-align: center;">
<img src="../zSLIDES/img/composição-workflow.png" width="80%" data-preview-image>
</div>

--

Um **evento** aciona um **workflow**, que é composto por um ou mais **jobs**.

Cada job roda em um **runner** (máquina virtual, contêiner ou runner self-hosted) e seus **steps** são executados sequencialmente dentro do mesmo job.

Já os jobs, entre si, podem rodar em paralelo, a menos que haja **dependências** definidas com `needs`

--

Exemplo de um workflow:

```yml
name: Hello World # rótulo do workflow

on: #define gatilho
  workflow_dispatch: # roda manualmente, com botão "Run workflow"

jobs:
  say-hello-inline-bash: # id do job
    runs-on: ubuntu-24.04 # define runner
    steps:
      - run: echo "Hello GitHub Action Workflow!" # executa comando de linha de comando (shell).
```

---

## Visão Geral

- **Eventos**: determinam quando um workflow é executado, definido em `on:` no yml do workflow. Ações do GitHub suportam [dezenas de eventos](https://docs.github.com/pt/actions/reference/workflows-and-actions/events-that-trigger-workflows), mas os mais comuns são `push`, `pull_request`, `workflow_dispatch`, e `schedule`. <!-- Você pode filtrar cada evento para que ele seja disparado apenas para as ramificações, tags ou caminhos de arquivo importantes. -->

- **Job (Trabalho)**: uma seção dentro do Workflow, é o conjuntos de passos (*steps*) que executam uma tarefa específica (ex: "Compilar o código", "Rodar testes", "Fazer deploy"). Por padrão, se você tiver vários jobs, eles rodam em paralelo (ao mesmo tempo). Cada Job define em qual tipo de *Runner* ele precisa rodar (ex: `runs-on: ubuntu-latest`).

- **Runner (Executor)**: É o servidor (a máquina real ou virtual) que tem o aplicativo "GitHub Actions runner" instalado. Ele escuta por jobs disponíveis, executa-os um de cada vez e reporta o progresso/logs de volta para o GitHub. Cada *Job* roda em um Runner diferente (ou numa instância limpa do mesmo tipo).

- **Step (Passo)**: São as tarefas que acontecem dentro de um Job que rodam em sequência (uma após a outra). Se um passo falhar, o Job falha.

--

Um **evento** acontece no repositório o que isso dispara um workflow. O **workflow** é apenas a definição das tarefas (jobs) que devem ser executadas. Cada workflow **fica em `.github/workflows/<name>.yml`** (ou `.yaml`) e é expresso como YAML e deve conter pelo menos um job. 

Assim que o workflow começa, ele olha para os **jobs** definidos e decide a ordem deles: *se não houver dependências (`needs`), todos os jobs são liberados para execução ao mesmo tempo*; se houver dependências, um job só começa depois que os anteriores terminarem. Cada job é enviado para um runner. *Um runner só executa um job por vez*, nunca mais de um. Se houver vários jobs paralelos, o GitHub inicia vários runners para executar todos ao mesmo tempo.

Dentro de um job, existem **steps**. Os steps sempre, absolutamente *sempre, rodam em sequência, um depois do outro, na ordem em que aparecem no YAML*. Mesmo se houver vários jobs paralelos, cada job executa seus steps de forma sequencial dentro do seu próprio runner.

--

<div style="text-align: center;">
<img src="https://kroki.io/nomnoml/svg/eNqL1kvPLMkoTdIvzy_KTsvJLy_Wj1XQ1bWyU4h2LUvNK8mP5YIxFHSBguFQZYY1XNFe-UkgKrgktcAQIgtiGkGYenp6sVyxCmBVRoRVgRlgE2MVbKx0dRWibRKTikuKEpNL7AISixJzUnPyIQqM8CoAmYNPPqg0Ly-1yBDmR7CFMFEjJFEjoLOw-9wITRzicni44LUdYQb5fgAA3mCI6Q==" width="60%" data-preview-image>
</div>

---

## Actions

As **Actions** são ferramentas de *automação que configuram um ambiente limpo para codificação* (ex: Python), garantindo a execução consistente de scripts e testes, permitindo que o GitHub verifique automaticamente a integridade do código a cada alteração. 

Imagine que o *Runner* (a máquina que o GitHub te empresta) é um *computador novo, formatado* com Linux. Ele não tem seu código, não tem Python instalado e não tem suas bibliotecas. Para não ter que digitar 20 linhas de comandos Linux toda vez para configurar esse ambiente, a comunidade e o próprio GitHub criaram Actions.

**Actions** são *pacotes de código reutilizáveis criados pela comunidade ou pelo GitHub*. Elas servem para encapsular tarefas frequentes e repetitivas, permitindo que você monte seu pipeline como se fossem blocos de Lego.

--

Exemplo:

``` yaml
name: Teste de API

on: [push]

jobs:
  verificar-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Instalar dependências
        run: |
          python -m pip install --upgrade pip
          pip install fastapi[standard] pytest httpx
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

      - name: Rodar Testes
        run: pytest test_main.py
```

--

```yml
- uses: actions/checkout@v4
```

- O Runner do GitHub liga, mas ele não sabe nada sobre o seu projeto. Ele não tem os seus arquivos, não tem a sua pasta, está totalmente vazio.
- A `actions/checkout` é a Action mais importante e usada do GitHub. Ela *entra no seu repositório e copia todo o seu código para dentro do Runner*.
- Em vez de você ter que digitar comandos como `git init`, `git remote add origin`, `git fetch` e `git pull`,ele faz tudo isso por você de forma segura. O `@v4` indica apenas que estamos usando a *versão* 4 desta Action (a mais atual, com correções de bugs).

--

```yml
- name: Setup Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'
```

- O computador zerado do GitHub tem um Linux básico. Ele pode até ter alguma versão do Python lá, mas talvez não seja a versão que o seu projeto precisa para rodar sem erros.
- A `actions/setup-python` vai até os servidores, *baixa a versão do Python que você deseja, instala no Runner e configura as variáveis de ambiente* (o `PATH`) para que o terminal entenda o comando `python`. O `name: Setup Python` é apenas o *rótulo visual* que vai aparecer na tela do GitHub para ficar bonito e organizado quando o fluxo rodar.

--

A `setup-python` é uma Action que permite *customização*. Usamos a palavra-chave `with` para passar "parâmetros" ou "configurações" para dentro dela.

- `python-version: '3.11'`: Garante que não haverá o famoso erro "Na minha máquina funciona". Se você desenvolveu na versão 3.11 no seu computador, o GitHub vai testar exatamente na versão 3.11 na nuvem.

- `cache: 'pip'`: Baixar dependências da internet (como FastAPI, Pytest, Pandas, etc.) toda vez que alguém fizer um `push` demora muito tempo. E tempo em CI/CD custa dinheiro (minutos de processamento). Ao ativar o `cache: 'pip'`, você manda o GitHub Actions fazer o seguinte: *"Na primeira vez, baixe tudo da internet e guarde em uma pasta secreta. No próximo `push`, antes de baixar de novo, olhe nessa pasta e pegue os arquivos que já estão prontos"*. Isso transforma um processo de instalação que levaria minutos em algo de poucos segundos.

--

O trecho a seguir constrói a aplicação instalando as *dependências* necessárias, como o framework FastAPI:

```yml
- name: Instalar dependências
  run: |
    python -m pip install --upgrade pip
    pip install fastapi[standard] pytest httpx
    if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
```

Quando usamos `run`, estamos dizendo ao GitHub: 'Sente na frente desse computador e digite exatamente esses comandos no terminal, um por um'."
Aqui, primeiro atualizamos o instalador (`pip`), depois instalamos o framework (`FastAPI`) e a ferramenta de testes (`pytest`). Depois, se o arquivo `requirements.txt` existir ele instala as dependências listadas nele, se não existir ele segue adiante.

--

O trecho a seguir vai rodar os *testes* definidos em `test_main.py`

```yml
- name: Rodar Testes
  run: pytest test_main.py
```

O comando `pytest test_main.py` vai executar os nossos *testes automatizados*. 

O GitHub Actions é "burro" no sentido de que *ele não entende o seu código Python*. Ele só entende duas coisas: 
- ✅ Sucesso (Código 0) ou 
- ❌ Erro (Qualquer código diferente de 0). 

Se o Pytest rodar e todos os testes passarem, ele avisa o GitHub que deu tudo certo. Se um único teste falhar, o Pytest emite *um sinal de erro*, o Runner para imediatamente de funcionar, e o GitHub *bloqueia a sua atualização*.

--

Quando o fluxo termina, o GitHub nos dá um retorno visual imediato direto no repositório e no Pull Request.

- ✅ **Verde (Passed):** Todos os passos funcionaram e os testes do Pytest passaram. O código é seguro para ser integrado.
- ❌ **Vermelho (Failed):** Algum passo quebrou ou um teste falhou. O GitHub bloqueia a integração e o desenvolvedor precisa ler os Logs para consertar o código.

<div style="text-align: center;">
<img src="../zSLIDES/img/ci-cd-githubactions.png" width="50%" data-preview-image>
</div>