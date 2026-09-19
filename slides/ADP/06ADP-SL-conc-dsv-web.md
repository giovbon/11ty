<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>Desenvolvimento Web</h1>
</div>

---

**Front-end** é a parte visível de uma aplicação, focada na interface do usuário (o que você vê e interage).
-  Vai utilizar linguagens como *HTML, CSS e JavaScript para criar a parte visual e interativa*, no Hard Code usa frameworks e bibliotecas como React, Angular, Tailwind, Vue.js, etc. 
- Foca na experiência do usuário, na aparência e a funcionalidade da interface. 
- Constrói elementos como botões, imagens, menus e o layout de um site ou aplicativo.

O Xano não constrói o frontend, mas se conecta a um existente (FlutterFlow).

---

Já o **back-end** é o "cérebro" por trás da aplicação (onde as *regras de negócio* são aplicadas), responsável por processar informações, gerenciar bancos de dados, e garantir que o sistema funcione corretamente.
-  No Hard Code usa linguagens como Java, Python, Ruby, PHP (e muitas outras), entre outras, para a lógica do servidor e manipulação de dados. 
- Foca na *lógica do sistema, o processamento de dados e a integração com o banco de dados*. 
- Relacionado a operações comuns como: validar dados de entrada (como um login), gerenciar informações em bancos de dados e retornar resultados para o front-end.

Essa parte quem faz é o Xano.

---

## Arquitetura cliente-servidor

A arquitetura cliente-servidor divide a lógica de uma aplicação nos componentes: cliente e servidor. 
- **Cliente**: É o programa ou dispositivo que *inicia a requisição* por um serviço ou recurso. Ele interage com o usuário e envia pedidos aos servidores. 
- **Servidor**: É o programa ou hardware que *atende às requisições dos clientes*, fornecendo os serviços solicitados e processando dados. 

Essa arquitetura é base para aplicações web modernas, promovendo separação de responsabilidades, escalabilidade e reutilização de serviços, permitindo que *múltiplos clientes se conectem a um mesmo servidor de forma simultânea e independente*.

*Exemplo comum* incluí acessar um site no navegador (cliente) para obter dados de um site em um servidor web (servidor). 

---

A **comunicação request-response** é um modelo fundamental para a *comunicação entre computadores*, em que um cliente envia uma solicitação a um servidor, e o servidor envia uma resposta de volta ao cliente. Esse padrão é usado em protocolos de rede como HTTP.

<div style="text-align: center;">
	<img src="https://darvishdarab.github.io/cs421_f20/assets/images/client-server-1-d85a93ea16590c10bed340dd78294d0d.png" width="30%" data-preview-image>
	<img src="../zSLIDES/img/request_response.png" width="50%" data-preview-image>
</div>

---

Esse padrão de comunicação é uma *comunicação síncrona* e baseada em ciclos independentes, ou seja, o servidor só responde quando solicitado, e cada troca de mensagem é completa em si. Esse padrão é a *base da interação entre front-end e back-end em aplicações web modernas*.

<div style="text-align: center;">
	<img src="../zSLIDES/img/request_response_front_back.png" width="50%" data-preview-image>
</div>

---

### Requisição

É o pedido enviado pelo cliente. Ele contém quatro componentes principais:

* **Método (ou Verbo):** Define o tipo de operação que se deseja realizar. No Xano, os mais comuns são: `GET, POST, PUT/PATCH e DELETE`

* **URL (Endpoint):** É o endereço digital para onde a requisição é enviada (ex: `https://sua-api.com/usuarios`).
* **Headers (Cabeçalhos):** Contêm metadados de configuração, como a origem da requisição e o tipo de conteúdo enviado.
* **Body (Corpo):** É onde os dados complexos são enviados, geralmente estruturados em formato JSON. No Xano, esses dados são tratados como Inputs.

---

### Resposta

É o que o servidor devolve após processar a requisição.

* **Status Code (Código de Status):** Indica o resultado da operação, diz se o pedido foi bem-sucedido (ex: `200` OK) ou se houve erro (ex: `404` Não Encontrado).
* **Headers:** Assim como na requisição, trazem informações técnicas sobre a resposta enviada pelo servidor.
* **Body (JSON, HTML, etc.):** É o conteúdo principal da resposta. No desenvolvimento com Xano, o padrão é o JSON, que entrega os dados solicitados (como o nome de um usuário ou uma lista de produtos) de forma organizada.

---

## Protocolo HTTP

Tudo que é solicitado em uma requisição e retornado de uma response pode ser considerado um **recurso**. HTTP é um protocolo que permite a obtenção de recursos, como documentos HTML. É a base de qualquer troca de dados na Web e um protocolo cliente-servidor. 

Um documento completo é construído por diferentes sub-documentos (recursos), como por exemplo texto, descrição do layout, imagens, vídeos, scripts e muito mais (conceito de **Hipermídia**)

<div style="text-align: center;">
	<img src="https://mdn.github.io/shared-assets/images/diagrams/http/overview/fetching-a-page.svg" width="50%" data-preview-image>
</div>

---

## URLs
A localização de recursos no protocolo HTTP é realizada através das URLs (Universal Resource Locator). 

`http://www.loja.com.br:80/musica/cd.php?id=37&sessao=AB7#detalhes`

- **`http`**: diz respeito ao protocolo
- **`www`**: representa o domínio
- **`loja`**: é o nome da web page ou aplicação
- **`com`**: representa a categoria company (empresa), `gov`, por exemplo, diz respeito a governos. 
- **`br`**: pais da aplicação

---

`http://www.loja.com.br:80/musica/cd.php?id=37&sessao=AB7#detalhes`

- **`80`**: é a porta padrão em http, não precisa ser definida na url, pois o padrão é 80 em HTTP e 443 em HTTPS
- **`musica`**: caminho, pasta ou categoria
- **`cd.php`**: arquivo ou recurso: pode ser estático (como um doc) ou dinâmico (executar um script)
- **`?id=37&sessao=AB7`**: parâmetros, tais como nome (`id`) ; valor (`37`); nome (`sessão`); valor (`AB7`);
- **`#detalhes`**: demais fragmentos da aplicação, como recursos, sessões, etc.

---

## Métodos

Métodos HTTP são instruções utilizadas em requisições para *especificar a ação a ser realizada em um recurso, como obter, enviar, atualizar ou excluir dados*.

Principais métodos HTTP e suas funções:

| **Método HTTP** | **Descrição**                         |
|------------------|--------------------------------------|
| **GET**          | Recupera dados de um recurso.        |
| **POST**         | Envia dados para criar um novo recurso.  |
| **PUT**          | Atualiza um recurso existente ou cria se não existir.       |
| **DELETE**       | Remove um recurso.                   |

---

### CRUD

**CRUD** é um acrônimo que representa as *quatro operações básicas realizadas em bancos de dados e em aplicações*. Essas operações são essenciais para manipular dados em um sistema/banco de dados, permitindo a gestão completa de informações.

| **Operação** | **Descrição**                                         |
|--------------|------------------------------------------------------|
| **Create**   | Cria um novo registro ou recurso no banco de dados.  |
| **Read**     | Recupera e lê dados armazenados.                     |
| **Update**   | Atualiza um registro ou recurso existente.           |
| **Delete**   | Remove um registro ou recurso do banco de dados.     |

Usando os principais métodos HTTP podemos criar um CRUD em APIs.

---

**Header**: *Informações adicionais sobre a requisição/resposta* (metadados), como tipo de conteúdo, autenticação e controle de cache. As informações aqui sempre no formato `chave : valor`.

`request`
```yaml
GET /clientes HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer abc123
Content-Type: application/json
Accept: application/json
```

`response`
```yaml
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85
Cache-Control: no-cache
```

---

**Body**: Contém os dados enviados na *requisição* , como informações de formulário ou um objeto JSON, geralmente usado em métodos como POST e PUT. 

Já o body em *respostas* HTTP contém os dados retornados pelo servidor, que podem incluir informações sobre o resultado de requisições GET, como detalhes de um recurso em formato JSON, HTML ou mensagens de erro.

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999998888"
}
```

---

## Status Codes

Cada requisição sempre tem nas resposta um código, este ajuda a determinar como aquela solicitação foi atendida. Os **Status Codes** (códigos de status) em respostas HTTP são *códigos numéricos que indicam o resultado de uma requisição*. 

| **Código** | **Categoria**          | **Descrição**                                           |
|------------|-----------------------|-------------------------------------------------------|
| **1xx**    | Informacional         | Indica que o servidor recebeu a requisição e está aguardando mais informações. |
| **2xx**    | Sucesso               | A requisição foi bem-sucedida e o servidor retornou os dados solicitados. |
| **3xx**    | Redirecionamento      | O recurso foi movido permanentemente para uma nova URL. |
| **4xx**    | Erros do Cliente      | O recurso solicitado não foi encontrado no servidor. |
| **5xx**    | Erros do Servidor     | Ocorreu um erro interno no servidor ao processar a requisição. |

---

## APIs

APIs (Application Programming Interfaces), são *interfaces de comunicação que permitem que o back-end envie e receba dados do front-end.* Elas definem padrões de comunicação por meio de requisições HTTP, geralmente utilizando o formato JSON.

As APIs funcionam como *pontes* seguras e estruturadas, permitindo que aplicações diferentes troquem informações de forma organizada, sem que o front-end precise conhecer os detalhes internos do back-end.

**Exemplo**: a API [ViaCEP](https://viacep.com.br/) permite a obtenção em JSON dos dados de um CEP (como rua, bairro, cidade, etc), podendo ser usado em qualquer aplicação front-end.

---

### RESTful

O padrão **REST** (Representational State Transfer) é um *estilo arquitetural para projetar serviços web que utiliza métodos HTTP para realizar operações em recursos*. Esse padrão promove simplicidade, escalabilidade e interoperabilidade entre o front-end e o back-end. Os princípios fundamentais do REST incluem:

- Tudo é tratado como um recurso acessível via URL.
- Utilização de métodos HTTP (GET, POST, PUT, DELETE) para operações CRUD.
- Cada requisição do cliente deve conter todas as informações necessárias, porque o servidor é sem estado, ou seja, não guarda logs de requisições passadas.
- Os recursos podem ser representados em diferentes formatos: JSON, XML.

---

### Swagger

O Swagger é um conjunto de ferramentas de código aberto  que auxilia no desenvolvimento, *documentação e consumo de APIs RESTful*. Ele permite que desenvolvedores *descrevam e compreendam a estrutura e funcionalidade de uma API* sem a necessidade de acessar o código-fonte.

Em resumo, o Swagger facilita:

- **Documentação**: Cria e mantém a documentação da API de forma interativa e acessível, tornando-a mais fácil de entender por desenvolvedores e outros membros da equipe. 
 
- **Testes**: Permite testar a API diretamente através da interface gerada, facilitando a identificação de problemas e a validação do funcionamento. 

---

No Swagger podemos ver uma lista de endpoints (pontos de acesso) da API:

<div style="text-align: center;">
	<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.sstatic.net%2F173dI.png&f=1&nofb=1&ipt=6b71e65e2128a198dc766cc9b68880b4612afd3ad5cfbd36d30ffa6cdd5507b2" width="50%" data-preview-image>
</div>ssss