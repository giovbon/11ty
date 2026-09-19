<!-- .slide: data-background-image="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>áreas do git</h1>
    <img src="https://simpleicons.org/icons/git.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

Existem três áreas importantes às quais devemos dar atenção no trabalho com o Git:

1. **Diretório de trabalho** (working directory): contém os arquivos e diretórios do diretório de projeto que representam uma versão de um projeto. É *onde adicionamos, editamos e excluímos arquivos e diretórios*.
2. **Área de preparação** (staging area): é uma área intermediária, chamada de **index** ou **stage**, que *armazena as alterações que se destinam a fazer parte do próximo commit*. Tais arquivos são ditos rastreáveis (*tracked*).
3. **Repositório local** (local repository): é o repositório propriamente dito, que *armazena o histórico de commits*.

---


As três áreas do git local integradas a um repositório remoto:

![](https://blog.dbins.com.br/thumbs/git_workflow.jpg)

---


### `git status`

O comando `status` é um dos comandos git mais usados. Dentre outras informações, ele *mostra o estado do diretório de trabalho e da área de preparação*. Por exemplo, pode-se usar esse comando para obter informações sobre:

- Arquivos do diretório de trabalho que foram alterados pelo desenvolvedor, mas que ele ainda não adicionou na área de preparação.

- Arquivos do diretório de trabalho que não são rastreados pelo git, ou seja, eles ainda não foram objetos de um add.

- Arquivos que encontram-se na área de preparação, aguardando um commit.

---

Exemplo: 
```git
$ git status
On branch master
Changes to be committed:
        new file:   mais-dois.txt

Changes not staged for commit:
        modified:   teste.txt

Untracked files:
        mais-um.txt
```

O comando `git status` indica que você está na branch `master`, com um novo arquivo chamado `mais-dois.txt` *pronto para ser incluído no próximo commit*. Além disso, há um arquivo chamado `teste.txt` que *foi modificado, mas suas alterações não foram adicionadas na área de preparação*. Por fim, o arquivo `mais-um.txt` *ainda não está sendo rastreado* e precisa ser adicionado para ser incluído no commit.

---

### `git add`

Dentre essas três áreas, o desenvolvedor *acessa apenas o diretório de trabalho*. As duas outras áreas são internas ao git e manipuladas exclusivamente por ele. Como qualquer diretório, o diretório de trabalho pode conter diversos arquivos. Porém, *apenas aqueles adicionados à área de preparação, por meio de um `add`, serão gerenciados pelo git*.

Antes de fazer um commit devemos executar um `add`, para salvar o conteúdo do arquivo no index. Feito isso, podemos usar um `commit` para salvar no repositório local a versão adicionada ao index. Esse fluxo é ilustrado na próxima figura.

<div style="text-align: center;">
    <img src="https://i.ibb.co/jkVdsRRh/image.png" width="40%">
</div>

---

```bash
# supondo que um novo arquivo (arq1.txt) foi adicionado no repo
git add arq1
git commit -a -m "Alterando valor de x"

# também é possível remover o arquivo da stage
git rm arq1.txt
```

A opção `-a` no comando git `git commit -a -m ...` faz com que *todos os arquivos modificados que já estão sob rastreamento sejam automaticamente incluídos no commit. Sem essa opção, a cada novo commit, você precisaria usar `git add` para adicionar manualmente todos os arquivos que pretende versionar. Com o `-a`, o Git *inclui automaticamente todas as mudanças recentes em arquivos que já estavam no estado tracked*.

É possível ainda usar `git add .` em que *é adicionado todos os arquivos no diretório atual e em subdiretórios ao staging area*. Isso inclui: *arquivos novos que ainda não foram rastreados*, arquivos que foram modificados e arquivos deletados.

---

# `git reset`

O `git reset` *move o ponteiro do seu branch atual para um commit anterior, como se você estivesse apagando o histórico recente*.

Uso principal: *Corrigir erros* que você acabou de cometer *localmente* e que ainda não enviou para o servidor.

Modos comuns:

- `--soft`: *mantém as alterações* nos arquivos (prontas para um novo commit).
- `--hard`: *apaga tudo*, os arquivos voltam exatamente ao estado do commit escolhido.

---

O **reset** é uma ferramenta utilizada em contextos privados no Git para descartar alterações indesejadas e limpar o histórico de commits. No cenário descrito, você está no commit C, mas *percebe que o código está ruim e decide voltar ao commit B*, eliminando C completamente para que ele não apareça no histórico. A regra essencial é que o reset deve ser utilizado *apenas em commits que ainda não foram enviados (push) para o servidor*, pois fazê-lo em alterações que outros colegas já baixaram pode causar problemas no repositório deles.

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVHJQwhJ0whZwUN16KifE0lAO2JE-A=" width="60%">
</div>

---

Após o comando `git reset --hard B`

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVHJQwhJwUND1dHF00lAKQSDnk=" width="60%">
</div>

---

Se você utilizasse o comando `git reset --soft B`, a linha do tempo dos commits pareceria idêntica àquela resultante de um `reset --hard`:
<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVHJQwhJwUND1dHF00lAKQSDnk=" width="60%">
</div>

A principal diferença reside no estado dos arquivos: enquanto o `reset --hard` apaga todas as alterações do commit C, o `reset --soft` *mantém essas mudanças na Staging Area*. Assim, ao executar um `git status`, você veria os arquivos do "erro" marcados em verde, indicando que estão prontos para um novo commit.

---

# `git revert`

Diferente do reset, o revert *não apaga o histórico*. Ele *cria um novo commit que faz exatamente o oposto do commit que você quer desfazer*.

- Uso principal: quando você já enviou o código para um repositório compartilhado (GitHub/GitLab). Como ele *não apaga o passado*, ele não causa conflitos para seus colegas.

- Resultado: o histórico mostra o erro e, logo em seguida, a correção.

---

O **revert** é uma técnica utilizada em *ambientes públicos e colaborativos* no Git para corrigir erros sem alterar o histórico de commits. No cenário apresentado, um *bug foi introduzido no commit B*, e como *outros desenvolvedores já dependem das alterações desse commit ao criarem o commit C*, não é possível simplesmente apagar B com um reset. A intenção ao usar o `revert` é documentar a correção *criando um novo commit que desfaz as mudanças feitas no commit B*, preservando a integridade do histórico e garantindo a segurança do trabalho colaborativo. Essa abordagem é considerada a maneira mais profissional de lidar com erros em branches compartilhadas.

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVHJQwhJwUNp9J0TUwJZ0yhoNSy1KIShZRUBSclhZLEdKCQX35ZvoIzWI0SAM4mIew=" width="60%">
</div>

Acima, o `revert` cria um novo commit que inverte as mudanças feitas por B, mantendo C intacto.

---

### Comandos `reset` e `revert`

Use para commits que ainda *não saíram da sua máquina*:

```bash
# Volta 1 commit mantendo as alterações prontas para novo commit (Stage)
git reset --soft HEAD~1

# Volta 1 commit mantendo as alterações nos arquivos, mas fora do Stage
git reset --mixed HEAD~1

# APAGA TUDO e volta o projeto exatamente para o estado do commit '7a4b2c1'
git reset --hard 7a4b2c1

# Remove um arquivo específico do Stage (unstage), mantendo o código intacto
git reset HEAD arquivo.txt
```

---

Use para commits que *já estão no servidor*. Ele não apaga o passado, ele cria um "contra-commit":

```bash
# Cria um novo commit que anula tudo o que foi feito no commit 'abc123'
git revert abc123

# Reverte o último commit feito (HEAD) criando uma nova entrada no histórico
git revert HEAD

# Reverte o commit, mas não commita automaticamente (permite revisar antes)
git revert -n 7a4b2c1
```

---

## `git restore`

Entanto o `git reset` reverte o histórico (nos commits e nos ponteiros da branch), o `git restore` *reverte apenas os arquivos (no código que você está escrevendo agora).* 

O `restore` não tem poder para apagar commits ou mover a branch no tempo. Ele só *olha para o estado dos arquivos*. 

---

Exemplos: 

*Fiz uma zona no código do arquivo index.html e quero que ele volte a ser como era no último commit* (ou algum outro commit anterior)

```bash
# Volta o arquivo para o estado do último commit (HEAD)
git restore index.html

# Busca a versão do arquivo como ele era no commit 'abc1234'
git restore --source=abc1234 index.html

# Busca a versão de 3 commits atrás
git restore --source=HEAD~3 index.html

# Pega a versão do index.html que está na branch 'develop'
git restore --source=develop index.html
```

---

*Adicionei o arquivo index.html com `git add` sem querer* 

```bash
# Primeiro tira do Stage (o contrário do add)
git restore --staged index.html

# Depois limpa a sujeira do código
git restore index.html
```
