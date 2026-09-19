<!-- .slide: data-background-image="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>branching e merging</h1>
    <img src="https://simpleicons.org/icons/git.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

Um **branch** é, essencialmente, uma *linha de desenvolvimento independente (universo paralelo)* onde você pode experimentar com *segurança*.

A principal *justificativa* para o uso de branches é o *isolamento*. Eles permitem que equipes trabalhem em *novas funcionalidades, correções de bugs ou experimentos sem interferir na linha de desenvolvimento principal* (geralmente chamada de `main`). 

Cada branch possui seu próprio histórico de commits. Isso possibilita que *vários desenvolvedores trabalhem simultaneamente em diferentes tarefas*, com a confiança de que suas alterações *não impactarão o trabalho dos outros* até que sejam *explicitamente integradas*.

Saber como criá-los, integrá-los e sincronizá-los é a habilidade que define um desenvolvedor colaborativo eficaz.


---

Como exemplo, ao precisar desenvolver uma tela de login enquanto trabalha na branch `main`, você utilizará o comando `git switch -c feature-login` (ou `git checkout -b feature-login`) para isolar seu trabalho em um "universo paralelo", chamado de `feature-login`. Essa abordagem garante que, se a nova funcionalidade falhar, a branch `main` permanece intacta.

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSXfxMw8XUMl7OJGEPGkosS85AyFtNTEktKiVN2c_PTMPIiGjNTk7PzSEmxSSGb5gER1Qz2VcMg4lpZkKKEamJuIxRywm4yVALBiPZY=" width="60%">
</div>

---

- Se você quiser *apenas criar a ramificação*, mas continuar trabalhando na sua branch atual, use: `git branch nome-nova-branch`

- Se quiser *criar a branch e já fazer o "checkout"* (muda seu ambiente de trabalho) para ela, use: `git switch -c nome-nova-branch`.

Diferentes projetos Git podem *usar os branches de maneiras distintas*, dependendo das necessidades das pessoas que estiverem trabalhando no projeto.

---


## `git checkout` e `git switch`

O comando `checkout` foi criado originalmente (e mantêm essas capacidade) para:

- Atualiza os arquivos no seu diretório de trabalho para refletir a versão de uma branch específica (ou *muda de branch*)
- Descarta alterações feitas em um arquivo específico, devolvendo ele ao estado do último commit.

Fazer duas coisas tão diferentes com o mesmo comando era perigoso e confuso, especialmente para quem estava aprendendo. Assim, a partir da versão 2.23 do Git, *essas duas responsabilidades foram divididas em dois comandos novos*:

--

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNodyr0NgCAQBtDeKb4FWMHEnxHsCMV5EiEmosehDcMbbF_eLnQFLHMHDBYcPB-pKByM6atKYsLmsQqdHCpGm9-oHFzrfxGflYoQSO4Sn5QrJtswiXcfmFkf6w==" width="40%">
</div>

---

O uso do `git switch` surgiu como uma evolução do comando `checkout`, com o objetivo de simplificar a troca de branches no Git. 

Enquanto o `checkout` pode ser utilizado *tanto para mudar de branch quanto para restaurar arquivos específicos*, o `git switch` é dedicado *exclusivamente a mudar de ramificação*. Isso torna o processo mais claro e intuitivo, pois separa as funcionalidades de mudança de branch e restauração de arquivos, facilitando o fluxo de trabalho dos desenvolvedores.

---

<!-- _class: invert -->
Segue-se os comandos git relacionados a branchs:

```bash
# Lista todas as branches no repositório / diz em qual está
git branch

# Cria uma nova branch chamada <nome-da-branch>
git branch <nome-da-branch>

# Ambos trocam para a branch especificada:
git switch <nome_branch>
git checkout <nome-branch>

# O -b cria nova branch e troca para ela.
git checkout -b <nome-da-branch>

git switch -c nova-branch

#renomear
git branch -m novo-nome # renomeia branch em que você está
git branch -m nome-antigo novo-nome # renomeia branch sem estar nela

# deletar
# só funciona se a branch já foi mesclada (merged) com a principal
git branch -d nome-da-branch
# força exclusão, descartando tudo que ainda não foi mesclado
git branch -D nome-da-branch
```

---

### HEAD

Para entender como o Git gerencia o branch ativo, é preciso conhecer o `HEAD`. O `HEAD` é um *ponteiro* que *indica em qual commit você está atualmente*. Na maioria das vezes, o `HEAD` aponta para a ponta do branch em que você está trabalhando. Quando você cria um novo commit, o ponteiro do branch avança, e o `HEAD` avança junto com ele.

<div style="text-align: center;">
    <img src="../../zSLIDES/img/image-HEAD.png" width="80%">
</div>

---


A qualquer momento, você sempre estará examinando uma versão específica de seu projeto. Portanto, estará em um branch específico que aponta para um commit. `HEAD` é apenas um *ponteiro que informa em que branch estamos*. Assim, na prática, branches são ponteiros móveis que apontam para commits.

Para *saber em que branch você está atualmente* basta examinar a saída do comando `git branch`:

```bash
PS C:\Users\Giovani\Desktop\Nova pasta> git branch
* feature/1   # o * indica que está no branch feature/1
  master
```

---

## Integrar alterações

No git há duas maneiras de *integrar alterações de um branch em outro branch*, são os processos de **merging e rebasing**.

## Merge

O **merging** no Git é uma maneira pela qual podemos *passar as alterações de um branch para outro branch*.

Existem dois tipos de merges:
- Merges fast-forward (Merges de avanço rápido)
- Merges three-way (Merges de três vias)


---

### Merge de avanço rápido
Este tipo de merge ocorre quando *não há divergências entre as branches*. O ponteiro da branch principal é *simplesmente movido para a frente*, incorporando as alterações da branch mesclada.

---

Antes:

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVnAyVMMUMsYkYQsaSixLzkDIW01MSS0qJUR4i6jNTk7PzSEjRRZN3GSqgqcxMz8wAhyiqY" width="60%">
</div>


Depois:

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVnAyVMMUMsYkYQsaSixLzkDIW01MSS0qJUR4i6jNTk7PzSEjRRZN3GSqgqcxMz88AiualF6alwjQB83TB_" width="60%">
</div>

---

### Merge de três vias
Este tipo é utilizado quando *há alterações divergentes nas branches (ambas avançaram após a base comum)*. O resultado é um *novo commit de merge que integra as mudanças de ambas*.

Ele utiliza três commits para a resolução: 
1. o da base comum (C1)
2. o da branch de origem (C2)
3. e o da branch de destino (C3)

---

Antes:

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVnAyVMMUOIWFJRYl5yhkJaamJJaVGqI0RdRmpydn5piUJuYmYepk5jJVRVqHqRVRopAQBf6iqY" width="60%">
</div>


Depois:

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNpLzyxxL0osyOBSAILk_NzczBKFzBQrBSVnAyVMMUOIWFJRYl5yhkJaamJJaVGqI0RdRmpydn5piUJuYmYepk5jJVRVqHqRVRop4TAvN7UoPRWuEaraRAkAQ_I4Jg==" width="60%">
</div>


---

Para ambas as operações (Fast-Forward ou Three-Way), o *comando inicial* digitado pelo usuário é exatamente *o mesmo: `git merge`*. O que determina se o Git fará um Fast-Forward ou um Three-Way não é o comando em si, mas sim o *estado do histórico das suas branches no momento da execução*.

Para realizar um merge, você deve *mudar para a branch que deseja integrar as alterações* e, em seguida, *usar o comando* de merge para incluir as alterações de outra branch:

Ex: Você tem duas branches: `main` e `featureA`. Você deseja integrar as alterações de `featureA` na branch `main`.

```bash
git checkout main
git merge featureA
```

---

<!-- _class: invert -->
## Rebase

O **`git rebase`** é uma técnica utilizada por desenvolvedores para *reorganizar o histórico de commits de uma branch no Git*. Ele funciona ao pegar commits exclusivos de uma branch — como uma feature que está sendo desenvolvida — e reaplicá-los em cima de outra branch, geralmente a branch principal (como a **main**). Isso resulta em uma *linha do tempo linear, onde parece que os commits foram feitos logo após as últimas atualizações da branch principal*, o que facilita a compreensão do histórico do projeto.



---

Antes
<div style="text-align: center;">
    <img src="../../zSLIDES/img/rebase-antes.png" width="100%">
</div>



---

Depois

<div style="text-align: center;">
    <img src="../../zSLIDES/img/rebase-depois.png" width="80%">
</div>

---

No exemplo da imagem, o `git rebase` pega os commits da branch que está sendo trabalhada (`featureA`) e os reaplica logo após os commits mais recentes na branch principal (`main`). Isso significa que *os commits da branch de origem (`featureA`) são "movidos" para o topo da linha do tempo da branch de destino (`main`)*.

Para realizar essa operação bastaria esses comandos

```bash
git checkout featureA
git rebase main
```

---

Concluído o rebase, precisamos voltar para a branch principal (`git checkout main`) e fazer o merge da nossa feature (`git merge featureA`). Como o rebase já deixou o histórico em uma linha reta perfeita, o Git *fará apenas um fast-forward*: a `main` simplesmente desliza para a frente para abraçar os novos commits, *finalizando a integração sem criar aquelas bifurcações confusas no log*.

---

### Merge vs Rebase

| Comando | Histórico | Quando Usar |
| :--- | :--- | :--- |
| **`git merge`** | **Preserva** o histórico completo (não-linear), criando um **"merge commit"**. | **Sempre** em *branches* **públicas** (compartilhadas) para manter a integridade do histórico. |
| **`git rebase`** | **Reescreve** o histórico para ser **linear** e limpo, sem "merge commits". | Apenas em *branches* **privadas** (locais) para limpar seus *commits* antes de integrar na principal. |

**Regra de Ouro**: **Nunca** use `git rebase` em *branches* que já foram *pushadas* e são usadas por outras pessoas.

---


# Conflitos de Merge

Conflitos de merge acontecem quando dois desenvolvedores alteram o mesmo trecho de código ao mesmo tempo. Um exemplo de conflito de merge:

Dois desenvolvedores, Alice e Bob, fazem as seguintes mudanças no arquivo `main.py`:

- *Alice*: Altera a linha 10 para `print("Olá, Mundo!")`.
- *Bob*: Altera a linha 10 para `print("Oi, Galera!")`.

---

*Ao tentar mesclar suas alterações (geralmente em merges e pulls), o Git identifica um conflito se diferentes commits modificarem a mesma linha de um arquivo*. Cabe então a *Bob* resolver o conflito, o que **é sempre uma tarefa manual**. Para isso, ele tem que escolher o *trecho de código que vai prevalecer*, o seu código ou o da *Alice*, e editar o arquivo de acordo com tal escolha.

Esse exemplo é um conflito simples, que ficou restrito a única linha de um único arquivo. No entanto, um `pull`  pode dar origem a *conflitos mais complexos*. Por exemplo, um mesmo arquivo pode apresentar vários conflitos, além de ter conflitos em mais de um arquivo.

OBS: Os conflitos de merge podem surgir tanto durante o processo de *merging* quanto no processo de *rebasing*.

---

### Resolvendo Conflitos

Quando ocorrerem conflitos de merge, você verá um conjunto de *marcadores especiais* em cada um dos arquivos envolvidos indicando onde o conflito ocorreu. Exemplo dos **marcadores de conflito** que aparecem quando há um conflito de merge:

```
<<<<<<< HEAD
{Conteúdo do branch de destino}
=======
{Conteúdo do branch de origem}
>>>>>>>refs/remote/origin/main
```

Resolver o conflito de merge envolve *decidir o que manter*, editando o conteúdo e removendo os marcadores de conflito.

---

Ao remover as marcações e decidir o que será oficialmente mantido, o Git *não permite iniciar um novo merge porque você já está em um merge pausado*. 

Você resolveu corretamente os conflitos no arquivo ao remover as marcações, mas apenas salvar não avisa o Git que tudo foi resolvido. *Para concluir o merge*, informe o Git que o conflito foi resolvido com `git add <nome-do-arquivo>` e, em seguida, finalize com `git commit`. Um editor pode abrir com uma mensagem automática; basta fechá-la para concluir. 

Sempre utilize `git status` para verificar o que o Git espera que você faça durante um conflito.