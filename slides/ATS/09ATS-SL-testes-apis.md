<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>testes de apis</h1>
</div>

---

## Importância

A arquitetura moderna transformou as APIs na espinha dorsal das aplicações, onde *front-ends desacoplados* (web, mobile, clientes diversos) d*ependem de APIs para receber dados e lógica*. Testar APIs garante que o “motor” do sistema entregue dados corretos independentemente da interface, *evitando que falhas no back-end quebrem múltiplos clientes*.

--

Os testes de API ocupam o *nível médio da pirâmide de testes*, equilibrando velocidade e abrangência pois são mais rápidos e estáveis que testes de UI e mais integrados que testes unitários, *validando fluxos de negócio, integração com bancos e regras complexas* em milissegundos. Além disso, eles asseguram o cumprimento do contrato (tipos, chaves, códigos HTTP), prevenindo regressões que quebrariam consumidores da API.

<div style="text-align: center;">
	<img src="https://i0.wp.com/automationstepbystep.com/mobufoc/2020/04/TestPyramid1.png?fit=1014%2C752&ssl=1" width="35%" data-preview-image>
</div>

--

Os testes de API fortalecem a segurança do sistema protegendo-o contra vetores de ataque comuns. Na prática, eles devem validar:

- **Autenticação**: robustez dos fluxos e gestão de tokens (expiração e refresh).
- **Autorização**: controle de acesso baseado em perfis (RBAC) em endpoints sensíveis.
- **Integridade de Dados**: validação rigorosa de entrada e saída para prevenir ataques de injeção e desserialização insegura.
- **Disponibilidade**: aplicação de rate limiting (throttling) para evitar abusos.
- **Resiliência**: comportamento estável do servidor ao receber cargas inesperadas ou dados malformados.

---

## Stack para Testes de APIS

O **Pytest** é o padrão-ouro em automação Python (fixtures, markers, conftest são habilidades-chave) e é amplamente adotado em empresas de todos os portes; 

A **biblioteca `requests`** é muito usada em código legado e *testes síncronos* (para testes diretos e sequenciais).

A **biblioteca `httpx`** é a tendência atual para *arquiteturas assíncronas* e FastAPI (suporta requisições assíncronas (async/await) e HTTP/2)
- *Por que usar HTTPX?* Quando você está testando APIs modernas (especialmente aquelas construídas com frameworks assíncronos) e precisa simular *concorrência*, ou apenas quer testes que rodem mais rápido de forma *paralela*.

---

## APIs síncronas vs assíncronas

A diferença principal entre os modelos está em como o servidor gerencia o tempo de espera (como consultas a bancos de dados ou requisições externas):

**Síncrono (ex: Flask, Django)**: *Cada requisição "trava" um processo exclusivo até ser finalizada*. É um modelo mais fácil de programar e debugar, mas exige *alto consumo de memória e perde desempenho rapidamente ao lidar com muitos acessos simultâneos*.

**Assíncrono (ex: FastAPI, Node.js)**: *As tarefas não bloqueiam o servidor*. Enquanto uma requisição aguarda dados externos, o sistema "passa a vez" e o mesmo trabalhador atende outros usuários. Isso *economiza muita memória e permite suportar milhares de conexões simultâneas com alta performance*.

---

## Tavern

Ao invés de escrever código Python, você *descreve seus testes de API de forma declarativa em arquivos YAML*. Ele roda nativamente dentro do processo do `pytest`, aproveitando toda a sua infraestrutura já existente (fixtures, CI/CD e relatórios) sem sair do fluxo de desenvolvimento.

```yaml
# test_api_simples.tavern.yaml
test_name: Teste basico de GET na API publica

stages:
  - name: Busca o post 1 e valida a resposta
    request:
      url: "https://jsonplaceholder.typicode.com/posts/1"
      method: GET

    response:
      status_code: 200
      strict: False  # Usamos o False para ele não reclamar de chaves que não queremos testar agora
      json:
        id: 1
        userId: 1
```

--

**Principais Vantagens e Recursos:**

- **Documentação Viva:** A separação entre a lógica e a estrutura cria testes extremamente legíveis, servindo como documentação atualizada do contrato da API.

- **Encadeamento de Requisições:** Permite capturar dados de uma resposta (ex: salvar um Token ou ID de um POST) e utilizá-los como variáveis nas requisições seguintes de forma elegante.

- **Parametrização Nativa:** Executa o mesmo cenário de teste múltiplas vezes com dados de entrada diferentes diretamente pelo YAML, evitando duplicação de código.

- **Integração com Python (Ext Functions):** Capacidade de invocar funções Python customizadas de dentro do YAML para realizar validações complexas de regras de negócio (ex: checar formato de e-mails ou datas).