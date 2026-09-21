---
title: APIs Customizadas
order: 10
---

[Especificação do Projeto](https://docs.google.com/document/d/17qAH2g9vHGn0i63Eah2UCYnIq4qpgj7KW71rpiQKyUE/edit?tab=t.0#heading=h.2zwybn214i2g)

A **Function Stack** (Pilha de Funções) é o coração da lógica de negócios no Xano. Ela é a sequência visual de instruções executada sempre que um endpoint de API é acionado. Pense nela como uma receita passo a passo: a requisição chega, a Function Stack executa as etapas do topo até o fim em ordem estrita, e retorna uma resposta ao cliente.

![](https://i.ibb.co/0brKbqV/3-C4-BE291-4277-41-A7-8-CA6-F7-BAC72-F6908.png)

A arquitetura básica de um endpoint de API no Xano funciona como um fluxo em 3 etapas sequenciais:

```
[ Inputs ]  --->  [ Function Stack ]  --->  [ Response ]
```

1. **Inputs (Entradas)** é tudo o que o cliente (seu aplicativo ou site) envia para o Xano ao fazer a requisição.

- Captura e valida os dados de entrada.
- Exemplo: Se o usuário está fazendo login, os *Inputs* recebem o `email` e a `senha`. Se está criando um produto, recebem `nome`, `preco` e `categoria`.

2. **Function Stack (Pilha de Execução)** é onde a lógica de negócios acontece, passo a passo, do topo para o fundo.

- Pega os dados vindos dos *Inputs*, processa esses dados e interage com o sistema.

Ações comuns:
- Consulta se o e-mail existe no banco de dados (*Database Request*).
- Compara a senha informada com a senha salva (*Security*).
- Gera um token de acesso de usuário (*JWT Token*).
- Executa condicionais (*If/Else*) ou loops, se necessário.

3. **Response (Resposta)** é o resultado final enviado pelo Xano de volta para o cliente.

- Define exatamente quais dados, mensagens ou status HTTP serão devolvidos para quem fez a chamada.
- Exemplo: Retorna um objeto JSON contendo os dados do usuário logado e o token gerado (`{ "user": "Maria", "token": "abc123xyz" }`), ou uma mensagem de erro caso o login tenha falhado.

---

- [`/buscaCEP`](https://drive.google.com/file/d/1ggxz9hAAIbNd77pfws1hwV1k2AKLCfdg/view?usp=sharing) Recebe um CEP (texto) e busca na tabela CEP. Se encontrar, devolve o registro; se não, devolve null. Serve para evitar o "Query All" (buscar tudo) que seria lento.

- [`/buscaCliente`](https://drive.google.com/file/d/1azg3iYRAFbsFuzTKdr4Xkn0Wp23SjPtg/view?usp=drive_link) (ou `/consultaCliente`). Recebe `authToken`, chama internamente `/auth/me` para pegar o `user_id`, e então busca na tabela Cliente. É a base para quase todas as outras APIs.

- [`/upsertCEP`](https://drive.google.com/file/d/1OdKfFIRCVkojJWSwt-eJfOnubnPelE2J/view?usp=drive_link) Recebe {cep, cidade, estado}. Se o CEP existe, faz PATCH (atualiza); se não, faz POST (insere). Sempre retorna o registro do CEP (com o id).

- [`/cadastraCliente`](https://drive.google.com/file/d/1a9_3I1K0J2Qr4_qeHXCz8JSq49-0O63i/view?usp=drive_link) Fluxo de 4 etapas: Recebe dados do cliente e cadastra um novo usuário para login e já cria o perfil de cliente vinculado a ele na mesma operação.

- [`/consultaEnderecoCliente`](https://drive.google.com/file/d/1kP78tF8vab0ZI9Yb9Gp8nMECIy6vJ8MM/view?usp=drive_link) Recebe `authToken`, descobre quem é o cliente (via `/buscaCliente`) e lista os endereços. Usa um Addon para trazer os dados do CEP junto com o endereço.

- [`/salvaEndereco`](https://drive.google.com/file/d/1yBgHUhyA1ygn9LwoFZZMB5MUwk6RDlYW/view?usp=drive_link) Recebe dados do endereço + CEP. Primeiro chama `/upsertCEP` para garantir que o CEP existe e obter o `cep_id`, depois faz POST na tabela `ENDERECO`.

- [`/atualizaEndereco`](https://drive.google.com/file/d/1NCyq6bS5kq4vFssT_kk-1B5E50a-P1Iz/view?usp=drive_link) Similar ao anterior, mas faz PATCH na tabela ENDERECO usando o `endereco_id`. Também usa o `/upsertCEP` internamente.

- [`/marcarEnderecoPadrao`](https://drive.google.com/file/d/19SBDYP9XKtNyrO7qRzP957NZNP7UCkiX/view?usp=drive_link) Torna um endereço `padrão = true` e, via lógica de Array Map, define todos os outros endereços do mesmo cliente como `padrão = false`.