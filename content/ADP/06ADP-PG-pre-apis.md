---
title: APIs
presentation: "slides/ADP/07ADP-SL-02-apis-auth.md"
order: 9
---

## Pré requisitos

[Especificação do Projeto](https://docs.google.com/document/d/17qAH2g9vHGn0i63Eah2UCYnIq4qpgj7KW71rpiQKyUE/edit?tab=t.0#heading=h.2zwybn214i2g)

- **APIs de CRUD básicas**, criadas automaticamente junto com as tabelas: `GET`, `POST`, `DELETE id`, `GET id` e `PATCH id`

- **APIs de autenticação**, criadas junto da criação do workspace no Xano. A partir da tabela `user` padrão, três APIs estão disponíveis para uso:
    - `/auth/login` devolve um `authToken` para alguém já cadastrado
    - `/auth/signup` cadastra usuário e devolve um `authToken`
    - `/auth/me/{authToken}` dado um authToken, devolve o usuário associado à ele

Um **authToken** é utilizado para provar que as futuras requisições pertencem à mesma pessoa que fez login naquela sessão.

Tabelas a serem usadas para autenticação de usuários devem possuir campo de `Email` (tipo `text`) e um campo de `Password` (tipo `password`).

## SNIPPETs importados

- `/consultaCEP` dado um número de cep, devolve cep, localidade, estado, etc.
- `/SendGrid_Email` {from, to, subject, content} devolve o status do envio

O Xano não funciona criando apenas CRUDs, ele pode atuar como um "intermediário" para chamar outros serviços externos. A forma mais fácil de fazer isso é importando "Snippets", que são APIs prontas.

### Snippet de Consulta de CEP (ViaCEP)

[▶️ Vídeo tutorial](https://drive.google.com/file/d/1tv5upTEIM29ptKb5lLa4cxdAB8eZwDBH/view?usp=sharing)

O objetivo é criar uma API no Xano que, *ao receber um CEP, busca o endereço completo*. O Xano apenas chama um serviço externo gratuito chamado ViaCEP, uma API que retorna dados de um endereço com base no CEP. Seu uso está previsto nos casos de uso. Esta funcionalidade é importante na interface desenvolvida no FlutterFlow para autocompletar os dados (como logradouro, bairro, localidade, etc) uma vez que o usuário digitou o CEP (também há a possibilidade de implementação dessa funcionalidade diretamente no FlutterFlow).

---

- Acesse esse link: [consultacep - Xano](https://www.xano.com/snippet/zqafdIzs/)
- Click no botão "**Add to your Xano Account**". Esteja logado ou logue-se na sua conta do Xano logo em seguida
- Escolha sua instância (gratuíta) > "**Add to Instance**"
- Escolha seu workspace > "**Add to Workspace**"
- Finalmente click em "**Go to Workspace**"
- Vá no menu de **API**
- Localize um novo grupo de APIs denominado **ViaCEP**
- Localizar o método importado, no caso: `/consultacep/{cep}`
- Click em "**Run**" para testar

Assim você importa o Snippet "consultacep" e, ao testá-lo ("Run"), pode inserir um CEP e receber os dados do endereço como resposta.

### Snippet de Envio de E-mail

[▶️ Vídeo tutorial](https://drive.google.com/file/d/1lku5IkHlLzDCqh2canIyTCtsMjtZjPhI/view?usp=sharing)

O objetivo é criar uma API no Xano que envia e-mails. O Xano utiliza outro serviço externo, o SendGrid, que é quem de fato envia o e-mail. O envio de e-mail no cadastro é uma etapa importante por duas razões:
- O e-mail será usado como o login do usuário.
- Validar o e-mail antes de continuar o cadastro é necessário para evitar fraudes.

---

- **Criar Conta no SendGrid**: Primeiro, você precisa criar uma conta gratuita no [SendGrid](https://sendgrid.com/en-us) > "**Start for free**".
    - Você vai receber um código por **e-mail**, devendo confirmar (*Verify*) no site
    - Você deve validar seu **telefone**, preenchendo o código enviado
    - Salve seu código de segurança e click em "**Continue**"
- No canto superior direito do site, clique em "**Skip to dashboard**"
- Click em "**Create sender identity**" e preencha o formulário solicitado > "**Create**"
- Para validar seu ‘sender’, clique para *Verificar* no email enviado para você.

- Para obter a chave da API, na barra lateral vá em ‘**Settings**’ > **API KEYS**
    - Preencha o nome da API em ‘**API Key Name**’ e mantenha selecionado ‘**Full Access**’ > Click em ‘**Create & View**’
    - Copie seu código de segurança (não perder esse código)
    - Você verá uma tela mostrando o `nome` e `id` de sua API, criada pela SendGrid (esta API criada tem validade, não esqueça de consultar a sua)
- Importe o Snippet [Envia e-mail](https://www.xano.com/snippet/b_7PkUGh/) para o Xano.
    - Click no botão "**Add to your Xano Account**". Esteja logado ou logue-se na sua conta do Xano logo em seguida
    - Escolha sua instância (gratuíta) > "**Add to Instance**"
    - Escolha seu workspace > "**Add to Workspace**"
    - Finalmente click em "**Go to Workspace**"

- A importação do snippet cria uma nova tabela no Xano chamada `tokens`. Você deve adicionar um registro nessa tabela:
    - `plataforma`: `"SendGrid"`
    - `token`: `"Authorization: Bearer <Sua API KEY do SendGrid>`" (substituindo pela chave que você copiou).

- Agora você pode "Rodar" a API `POST /SendGrid_Email`, fornecendo os dados `from`, `to`, `subject` e `content`. Um sucesso retorna `status: 202`.

É possivel retornar para o [dashboard do SendGrid](https://app.sendgrid.com/) e monitorar nossos envios de email:

Erros mais comuns ao usar o SendGrid:

- `Status 401` (Não autorizado): Geralmente significa que sua API Key está errada, ou que você digitou errado na tabela tokens (ex: um espaço a mais).
- `Status 403` (Proibido/Sender não autorizado): Ocorre quando o e-mail que você colocou no campo `from` não é o mesmo e-mail que você cadastrou e verificou como "Sender" na plataforma do SendGrid.