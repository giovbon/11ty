<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">CTT · Collaboration Tools for Teams</p>

# Github e Repositórios Remotos

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">03</p>

---

O **GitHub** é uma *plataforma web que permite o armazenamento e gerenciamento de projetos utilizando o sistema de controle de versão Git*. Essa ferramenta possibilita que múltiplos usuários façam alterações em projetos e códigos de forma simultânea e independente, promovendo uma colaboração eficiente.

Siga os passos abaixo para criação de conta e configuração do seu perfil:

- [Criar uma conta no GitHub - GitHub Docs](https://docs.github.com/pt/get-started/start-your-journey/creating-an-account-on-github)
- [Configurando seu perfil - GitHub Docs](https://docs.github.com/pt/get-started/start-your-journey/setting-up-your-profile)

---

## Repositórios Remotos
Existem três razões principais para os repositórios remotos serem úteis e importantes no trabalho em um projeto Git. Eles permitem:
- Fazer facilmente o *backup do projeto* em um lugar que não seja o seu computador.
- *Acessar* um projeto Git a partir de vários computadores.
- *Colaborar* com outras pessoas em projetos Git.

Para a criação do primeiro repositório no Github:
- [Início rápido para repositórios - GitHub Docs](https://docs.github.com/pt/repositories/creating-and-managing-repositories/quickstart-for-repositories)

---

Ao criar um repositório, você pode optar por tornar o repositório público ou privado:

- Os repositórios *públicos* são acessíveis a todos na Internet.

- Os repositórios *privados* só podem ser acessados por você, pelas pessoas com as quais você compartilha explicitamente o acesso e, em repositórios da organização, por determinados integrantes da organização.

<div style="text-align: center;">
    <img src="https://i.ibb.co/LhkkQGqJ/image.png" width="80%">
</div>

---

Para *transferir dados entre um repositório local e um repositório remoto do GitHub*, você deve se conectar e se autenticar usando o SSH.

A principal função da chave SSH é *autenticar sua máquina ao interagir com o GitHub*, permitindo que você faça operações como clonar, puxar (pull) e enviar (push) alterações aos repositórios que você possui ou para os quais tem permissão, como repositórios de terceiros em que você é colaborador.

- [Gerando uma nova chave SSH e adicionando-a ao agente SSH - GitHub Docs](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Adicionar uma nova chave SSH à sua conta do GitHub - GitHub Docs](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

---

```bash
# cria chave ssh
ssh-keygen -t rsa -b 4096 -C "seu_email@example.com"
cd
cd .ssh/
cat id_ed25519.pub
# copie a chave
```

Para definir sua chave no Github siga o caminho:
Settings > SSH and GPG keys > New SSH Key (defina o título e cole a chave copiada)

<div style="text-align: center;">
    <img src="https://i.ibb.co/TB9PYn7t/image.png" width="80%">
</div>

---

Formas de se trabalhar com o repositórios remotos:

- a partir de um repositório local
<div style="text-align: center;">
    <img src="https://i.ibb.co/N2QppXtD/image.png" width="60%">
</div>

- a partir de um repositório remoto
<div style="text-align: center;">
    <img src="https://i.ibb.co/VpwMcJmp/image.png" width="60%">
</div>

---

Os repositórios locais e os repositórios remotos agem separadamente. Quando se trabalha com eles, é importante saber que *não ocorrerá nenhuma atualização automática enviada de um para o outro*. Para isso temos os comandos `git pull` e `git push`, que veremos abaixo.

Mas para executar esses comandos, é *necessário antes configurar o repositório remoto* com o `git remote add`. Isso é feito para que o Git saiba onde enviar (`push`) e de onde buscar (`pull`) as atualizações.

Use o comando a seguir para adicionar o repositório remoto:
```bash
git remote add <nome_remoto> <URL>

git remote -v  #para confirmar que foi adicionado
```

---

O comando `git remote -v` *lista de conexões* com repositórios remotos armazenadas em um repositório local

Quando uma conexão com um repositório remoto estiver armazenada em um repositório local, você poderá se conectar com o repositório remoto referenciando o `<nome_remoto>` em vez da URL na linha de comando.

```bash
git remote add origin https://github.com/silverbulletmd/silverbullet.git

git push origin master
```

---

### `pull` & `push`

O comando *`push` copia os commits mais recentes do repositório local para o repositório remoto*. Portanto, ele é uma operação mais lenta, pois envolve comunicação pela rede. Um `push` deve ser usado quando o desenvolvedor deseja *tornar uma modificação visível para os demais desenvolvedores*.

```
git push origin master
```

O parâmetro `origin` é um valor default, usado pelo git, para indicar o repositório remoto, por exemplo, o repositório GitHub. Já o parâmetro `master` indica o branch principal.

---

Para *atualizar o repositório local a partir do repo remoto*, os outros desenvolvedores do time devem executar um comando `git pull`. Esse comando realiza duas operações principais:

- *Copia os commits mais recentes do repositório central para o repositório local* do desenvolvedor. Essa operação inicial é chamada de `fetch`.
- Em seguida, o comando `pull` *atualiza os arquivos do diretório de trabalho* (local). Essa operação é chamada de `merge`.

Abaixo o esquema completo da integração e comandos de repos locais e remotos:

<div style="text-align: center;">
    <img src="https://i.ibb.co/2Y0xkyr1/image.png" width="80%">
</div>

---

Quando você fizer o `push` de um branch local para um repositório remoto, criará um branch remoto. Um branch remoto é um branch em um repositório remoto.

Veremos o conceito de branchs mais à frente...