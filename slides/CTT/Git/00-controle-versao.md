<!-- .slide: data-background-image="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>controle de versão</h1>
    <img src="https://simpleicons.org/icons/git.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

O controle de versão é a *espinha dorsal do desenvolvimento de software moderno e colaborativo*. Sem ele, gerenciar a evolução de um projeto, coordenar o trabalho de múltiplos desenvolvedores e garantir a integridade do código seria uma *tarefa quase impossível*. Nesta primeira seção, vamos estabelecer as bases, cobrindo os *conceitos e comandos essenciais do Git*. Dominar esses fundamentos é o *pré-requisito indispensável* para qualquer trabalho em equipe eficaz e para as práticas avançadas de automação que veremos mais adiante.

---

# Sistema de Controle de Versões

Um Sistema de Controle de Versão (VCS, na sigla em inglês) é um *sistema que registra as alterações em um arquivo ou conjunto de arquivos ao longo do tempo*, permitindo que você possa *recuperar versões específicas* posteriormente. Sua finalidade principal, no contexto da Engenharia de Software, é *gerenciar a evolução do código-fonte* e de outros artefatos de um projeto, permitindo que múltiplos desenvolvedores colaborem de forma produtiva e segura.

Um **Sistema de Controle de Versões** (**VCS**, na sigla em inglês) oferece os dois serviços: 

1. oferece um **repositório para armazenar a versão mais recente do código fonte** de um sistema

2. permite que se **recupere versões mais antigas** de qualquer arquivo, caso seja necessário

---

A *necessidade do controle de versão* torna-se evidente ao analisarmos a *complexidade de projetos* de software reais, onde *gerenciar a grande escala de colaboração* sem um VCS robusto seria impraticável. Por exemplo:
- O *kernel do sistema operacional Linux*, em 2017, já possuía cerca de 25 milhões de linhas de código com contribuições de quase 1.700 engenheiros.
- Os *sistemas do Google*, em 2015, somavam 2 bilhões de linhas de código, com uma média de 40 mil commits por dia, realizados por 25 mil engenheiros.

O Git é um sistema de controle de versões que pode ser usada para **rastrear as alterações que são feitas nos arquivos de um projeto e permitir que várias pessoas forneçam suas colaborações**. Foi foi *criado por Linus Torvalds* a fim de que ele pudesse *controlar com versões o trabalho feito no kernel Linux*.

---

## VCS centralizado vs distribuído

**VCS (Sistema de Controle de Versão) centralizados** são sistemas baseados em uma arquitetura cliente/servidor. Nessa arquitetura, existe um **único servidor**, que *armazena o repositório* e o sistema de controle de versões. 

Os clientes acessam esse servidor (ponto central) para obter a versão mais recente de um arquivo. Feito isso, eles podem modificar o arquivo. Por fim, eles atualizam o arquivo no servidor, realizando uma operação chamada *commit*, o que torna o arquivo visível para outros desenvolvedores. 

Por muitos anos, este *foi o padrão* para o controle de versão.

Exemplos: SCCS, CVS e Subversion.

---

<div style="text-align: center;">
    <img src="https://i.ibb.co/TB9Gwq4K/image.png" width="40%" data-preview-image>
</div>

---

Em **Sistemas de Controle de Versões Distribuídos (DVCS)**, em vez de uma arquitetura cliente/servidor, é usado uma *arquitetura peer-to-peer*. Na prática, isso significa que *cada desenvolvedor* possui em sua máquina um *servidor completo de controle de versões*, que pode se comunicar com os servidores de outras máquinas.

Em um DVCS, os clientes não apenas utilizam o estado mais recente dos arquivos, mas duplicam localmente o repositório completo. Cada clone é, na verdade, um *backup completo de todos os dados*.

Por mais que os clientes (ou peers) sejam funcionalmente equivalentes, na prática, *costuma existir uma* **máquina principal**, que armazena a versão de referência do código fonte. 

Exemplos: **Git**, BitKeeper, Mercurial.

---

<div style="text-align: center;">
    <img src="https://i.ibb.co/YFhy0TPX/image.png" width="50%">
</div>

---

Vantagens dos sistemas de versão *distribuídos sobre os centralizados*:

- **Resistência a Falhas**: Se um dos repositórios (até mesmo o central) for comprometido é possível *restaurar* o projeto através de um dos repositórios existentes.

- **Trabalho Offline**: Pode-se trabalhar e gerenciar versões de forma offline, *sem estar conectado a uma rede*, pois os commits são realizados primeiro no repositório instalado localmente na máquina do desenvolvedor.

- **Operações Rápidas**: Commits são executados em menos tempo, isto é, eles são *operações mais rápidas e leves*. O motivo é que eles são realizados no repositório local de cada máquina. A maioria das operações (como pesquisar o histórico ou visualizar diferenças) exige apenas arquivos e *recursos locais*. Isso faz com que as operações sejam quase instantâneas.

---

- **Flexibilidade de Workflow**: A natureza distribuída permite que os desenvolvedores *colaborem de várias maneiras diferentes*, suportando múltiplos repositórios remotos e *fluxos de trabalho* que não são possíveis em sistemas centralizados.

- *Pode-se realizar commits com mais frequência*, incluindo commits com implementações parciais, pois eles não vão chegar imediatamente até o repositório central, acessível por toda equipe.

A *natureza distribuída do Git* é fundamental para o desenvolvimento colaborativo moderno, permitindo que os desenvolvedores trabalhem enquanto estão desconectados do repositório central e depois sincronizem as alterações.

---


## Uso de Git com CLI

A **GUI** (interface gráfica de usuário) é o conjunto de representações gráficas de objetos (ícones, botões etc.) que nos permite interagir com o computador.

A *linha de comando* – também conhecida como **CLI** (interface de linha de comando), terminal ou shell – é um local em que podemos digitar *comandos baseados em texto* para interagir com o computador. 

**A maneira padrão de trabalhar com o Git é por meio da linha de comando.**

![](https://codingnomads.com/images/36b2d371-e711-4e83-2e26-1309ef8c9b00/public)

---

### Comandos básicos CLI Linux

| Comando                | Descrição                                      |
|-----------------------|------------------------------------------------|
| `cd <diretório>`      | Mudar para o diretório especificado. Use `cd ..` para voltar ao diretório superior.           |
| `ls`                  | Listar arquivos e pastas no diretório atual.  |
| `pwd`                 | Exibir o caminho completo do diretório atual.  |
| `mkdir <nome>`        | Criar um novo diretório com o nome especificado.|
| `rm <arquivo>`        | Remover um arquivo (use `-r` para diretórios).|
| `touch arquivo.sh`    | Cria arquivo chamado `arquivo.sh`. |
| `nano arquivo.sh`     | Permite editar o conteúdo do arquivo. |

---

### Comandos git

Em comandos git, haverá situações em que você usará *comandos com opções e/ou argumentos*. 

- **Opções** são configurações que *alteram o comportamento de um comando*. Uma opção vem depois de um único traço `-` ou de um traço duplo `--`.
- **Argumentos** são valores que *fornecem informações para o comando*. Eles serão representados por colchetes angulares (<>), indicando que esses itens devem ser substituídos por valores inseridos pelo usuário.

<div style="text-align: center;">
    <img src="https://i.ibb.co/B5p9STR5/image.png" width="40%">
</div>

---

### Configurações iniciais

As variáveis `user.name` e `user.email` são usadas para *definir o nome e o endereço de email que serão salvos para os commits feitos*. Isso significa que você poderá ver quem trabalhou e o que essa pessoa fez em um projeto Git. 

É necessário configurar essas variáveis para podermos trabalhar com o Git:

```bash
git version
git config --global user.name "Giovani"
git config --global user.email "giovani.bontempo@faculdadeimpacta.com.br"
git config --global --list

# local, rodar dentro da pasta do repo
git config user.name "Nome Específico"
git config user.email "email-profissional@empresa.com"
```

---

## Repositórios

Repositório (também chamado de repo) é o termo que usamos para nos referir a uma *versão do projeto controlada pelo Git*. 

Existem dois tipos de repositórios:
- Um repositório **local** é aquele armazenado em um computador.
- Um repositório **remoto** é aquele que reside em um serviço de hospedagem.

Um **serviço de hospedagem** é uma empresa que fornece *hospedagem para os arquivos de projetos que usam Git*. Além dessa funcionalidade básica, esses serviços de hospedagem fornecem várias funcionalidades úteis no desenvolvimento. Os principais serviços de hospedagem são o [GitHub](https://github.com), o [GitLab](https://about.gitlab.com) e o [Bitbucket](https://bitbucket.org/product).

---

### `git init`
Um repositório local é representado por um *diretório oculto* chamado `.git` que é criado dentro de um diretório de um projeto. Ele contém todos os dados sobre as alterações que foram feitas nos arquivos de um projeto.

Para transformar um diretório de projeto em um repositório local, é preciso **inicializar**, ou criar, o repositório.

```bash
git init
git init -b main # define o nome da branch principal: main

ls -la
total 12
drwxrwxr-x 3 giobon giobon 4096 fev  1 20:46 .
drwxr-xr-x 5 giobon giobon 4096 fev  1 20:46 ..
drwxrwxr-x 7 giobon giobon 4096 fev  1 20:46 .git

# o que é criado dentro de .git
cd .git && ls
branches  config  description  HEAD  hooks  info  objects  refs
```

---

| Item        | Descrição                                                                                                                                                                             |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **HEAD**    | *Aponta para a branch ou commit atual*. Sem ele, o Git não saberia em qual ponto da história do repositório você está trabalhando.                                                       |
| **objects** | *Armazena todos os dados essenciais do repositório*, incluindo conteúdo de arquivos, estruturas de diretórios e informações sobre commits. Sem objetos, não há como *rastrear alterações*. |
| **refs**    | Mantém *referências para branches e tags*. É crucial para navegar pelo histórico de commits e facilitar operações como merges e checkout.                                        |

OBS: *Não devemos nunca mexer em nenhum arquivo ou diretório do diretório `.git`. Isso pode ter consequências indesejadas para seu repositório. Você não deve excluir esse diretório **a não ser que queira excluir o repositório**.*

---

### `git clone`

Para além do `git init`, em situações que se deseja criar um repositório do zero, há o `git clone`, usado quando se quer *copiar um projeto de um serviço de hospedagem* (portanto um repositório remoto) para sua máquina local, para poder trabalhar nele e posteriormente fazer contribuições no projeto.

Esse comando clona para o diretório corrente um repositório armazenado remotamente no GitHub. Portanto, devemos usar clone quando vamos **trabalhar em um projeto que já está em andamento e que já possui commits em um repositório central**. 

No exemplo, esse repositório é disponibilizado pelo GitHub:

```bash
git clone https://github.com/NOME-USER/NOME-REPO
```

---

# Commit

Um commit no Git é basicamente uma **versão do projeto no repositório**. Podemos considerá-lo um *snapshot* (fotografia) de um projeto que contém referências a todos os arquivos que fazem parte desse commit.

Uma vez tiradas essas *"fotografias"*, elas são armazenadas no sistema de controle de versões, de *forma compactada e otimizada*, para não ocupar muito espaço em disco. Posteriormente, **pode-se recuperar qualquer uma das fotografias, para, por exemplo, restaurar uma implementação antiga de um determinado arquivo.**

O comando para criar um commit é:
```bash
git commit -m "mensagem do commit"
```

Um commit costuma ser *precedido* pela *inicialização* do repositório (isso se você não clonou) e pela *inclusão dos arquivos* contidos naquele diretório no controle de versão, através do comando `git add *`.

---

Recomenda-se que desenvolvedores *realizem commits periodicamente*, sempre que tiverem efetuado uma mudança importante no código.

- Não é recomendável é a realização de *commits grandes*, com modificações importantes em diversos arquivos.

- Não recomenda-se que um commit inclua modificações relativas a mais de uma tarefa de manutenção, assim, não é recomendável corrigir dois bugs em um mesmo commit. Em vez disso, *cada bug deve ser corrigido em um commit separado*. Assim, *facilita-se uma futura análise* do código, caso, por exemplo, um cliente volte a reclamar que seu bug não foi corrigido.

---

Cada commit tem um **hash de commit** (também chamado de **ID de commit**). Trata-se de um hash único de *40 caracteres* composto de letras e números que age como um **nome para o commit**, fornecendo uma maneira de o referenciarmos. 

Exemplo de hash: `d629b0ba81f712f6b72eb042f72341c96585ef1f`, onde precisamos de apenas dos *sete primeiros caracteres* de um hash de commit para referenciar esse commit. Logo poderíamos usar apenas `d629b0b` para referenciar esse commit.

O comando `git log` lista informações sobre os últimos commits, como hash do commit, data, autor, hora e mensagem do commit.

--

```bash
Giovani@sala111 MINGW64 ~/Desktop/Nova pasta (master)
$ git log
commit d629b0ba81f712f6b72eb042f72341c96585ef1f (HEAD -> master)
Author: Giovani Bontempo <Giovani@salas.aulas>
Date:   Tue Nov 4 11:12:26 2025 -0300

    initial
```