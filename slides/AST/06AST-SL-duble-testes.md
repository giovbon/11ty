<!-- .slide: data-background-image="https://i.ibb.co/mrbpyRNH/AAGemini-Generated-Image-lsw6plsw6plsw6pl.png" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>dublê de testes</h1>
</div>

---

## O que são Dublês de Testes?

**Dublês de teste** (*Test Doubles*) são objetos ou componentes utilizados no desenvolvimento de software para *substituir dependências reais de um sistema durante a execução de testes automatizados*. Assim como os dublês no cinema substituem os atores em cenas perigosas ou complexas, os dublês de teste simulam partes do código que podem ser difíceis de manipular, lentas (como bancos de dados ou APIs externas) ou que ainda não foram implementadas. O objetivo principal é *isolar a unidade sob teste, garantindo previsibilidade, velocidade na execução e facilitando a identificação da causa exata de possíveis falhas*.

--

O termo abrange diferentes categorias de substitutos, cada uma com uma finalidade específica no fluxo de verificação. Os **Dummies** são *objetos passados apenas para preencher listas de parâmetros*, sem que suas funções sejam realmente chamadas. Já os **Stubs** *fornecem respostas prontas e pré-configuradas* para as chamadas feitas durante o teste, enquanto os **Spies** funcionam como stubs que *também registram informações sobre como foram chamados* (como quantidade de invocações ou parâmetros recebidos). Por sua vez, os **Mocks** vão um passo além, contendo expectativas pré-programadas e *verificando se as interações esperadas realmente ocorreram*. Por fim, os **Fakes** possuem *implementações funcionais de fato, porém simplificadas ou inadequadas para produção*, como um banco de dados em memória.

---

## Tipos de Dublês de Teste

| **Tipo de Dublê**              | **Quando usar**                                                                                               | **Exemplo**                                                                                                                                                              |
|--------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Dummy**           | Quando uma dependência é necessária para a assinatura do método, mas não é usada na lógica testada.          | Ao testar a classe `GeradorDeRelatorio`, que exige um `DatabaseConnection` e um `TemaVisual`, você pode passar `None` ou um dicionário vazio para `TemaVisual`.       |
| **Stub** | Quando você precisa controlar o retorno de uma dependência para testar diferentes caminhos de código.          | Configure um Stub que sempre retorne um JSON específico para uma API externa, permitindo testar o comportamento da aplicação sem depender da API real.                 |
| **Spy**               | Quando você precisa verificar se um método foi chamado, quantas vezes foi chamado, e com quais argumentos, sem alterar seu comportamento. | Substituindo a função de envio de e-mail por um Spy, você pode verificar se o e-mail foi enviado corretamente após criar um usuário.                                   |

---

| **Tipo de Dublê**              | **Quando usar**                                                                                               | **Exemplo**                                                                                                                                                              |
|--------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Fake** | Quando uma implementação simplificada da dependência é suficiente para o teste (ex: banco de dados em memória). | Substituir um banco de dados PostgreSQL por um SQLite em memória ou criar um `FakeStorageClient` que simula uploads de arquivos em um dicionário na RAM.               |
| **Mock** | Quando você precisa testar interações complexas e a ordem das chamadas entre objetos, garantindo que um contrato seja seguido. | Em um fluxo de pagamento, um Mock pode assegurar que a ordem das chamadas (como prevenção à fraude antes da cobrança) seja mantida, falhando o teste se houver violação. |

---

## Stub e Spy

A característica principal de um Stub é que ele *não tem lógica interna*; ele apenas devolve o que você mandou ele devolver.

Vamos supor que você tenha uma função que busca informações sobre o clima a partir de uma API externa. Você pode criar um teste que simula a resposta dessa API. O stub substitui uma dependência real por uma resposta estática:

--

```py
def test_obter_clima(mocker):
    # 1. Usamos a fixture 'mocker' para interceptar a função
    mock_get = mocker.patch('requests.get')
    
    # 2. Configuramos o Stub (o retorno enlatado)
    mock_get.return_value.json.return_value = {
        "temperatura": 25,
        "descricao": "Céu limpo"
    }
    
    clima = obter_clima("São Paulo")
    
    assert clima["temperatura"] == 25
    assert clima["descricao"] == "Céu limpo"
    
    # BÔNUS: Agindo como "Spy" para garantir que a URL chamada estava certa
    mock_get.assert_called_once_with("https://api.exemplo.com/clima/São Paulo")
```

---

O `mocker.patch` no Python é uma ferramenta que cria um objeto que funciona como um **Stub** e um **Spy** durante os testes. O *Stub fornece respostas fixas, enquanto o Spy registra todas as interações*, como quantas vezes a função foi chamada e quais parâmetros foram utilizados. Isso permite um controle rigoroso sobre o funcionamento da função `obter_clima`, que opera com um JSON falso.

Ao usar a linha `mock_get.assert_called_once_with("https://api.exemplo.com/clima/São Paulo")`, é possível interrogar o Spy para verificar *se a URL foi construída corretamente*, focando no comportamento da função, e não na resposta que ela retorna. Essa abordagem garante que quaisquer erros na construção da URL, como a remoção de uma barra, sejam identificados.

O papel do Spy é crucial, pois, ao detectar alterações que afetam a chamada da função, ele assegura que o comportamento do código se mantenha correto. *Caso ocorra uma modificação inadequada na URL, o teste falhará*, sinalizando que a implementação precisa ser revisada.

---

## Fake

O Fake é uma implementação que realmente processa dados em um ambiente controlado, diferente de Mock e Stub, que apenas simulam respostas. Ele oferece uma forma eficiente de testar interações sem depender de um banco de dados real.

---

No contexto de uma API, usando o FastAPI, a fixture `session` cria um *banco de dados SQLite em memória* usando a URI `"sqlite:///:memory:"`. Isso permite que o SQLAlchemy execute operações SQL reais, como `INSERT` e `SELECT`, criando tabelas e salvando dados temporariamente.

--

```py
@pytest.fixture
def session():
    engine = create_engine(
        "sqlite:///:memory:", # cria um banco de dados SQLite temporário armazenado inteiramente na RAM, que é destruído assim que a conexão é fechada
        connect_args={"check_same_thread": False}, # Desativa a trava padrão do SQLite que restringe a conexão a uma única thread
        poolclass=StaticPool, # Garante que todas as threads reutilizem a mesma conexão ativa. No SQLite em memória, se a conexão fechar ou mudar, o banco e todos os seus dados somem. O StaticPool mantém o banco vivo durante todo o ciclo do teste.
    )

    mapeador.metadata.create_all(engine) 

    with Session(engine) as session: 
        yield session

    mapeador.metadata.drop_all(engine)
```

---

A fixture `client` utiliza o `dependency_overrides` do FastAPI para *substituir a função de conexão ao banco real* pela versão que utiliza a `session` fake. Isso permite que a aplicação use o banco de dados em memória em vez do real, sem alterar o código principal. O `TestClient`, que simula um servidor web, permite fazer requisições HTTP para testar o fluxo completo da API de forma eficiente.

--

```py
@pytest.fixture
def client(session):
    def get_session_override(): 
        return session

    app.dependency_overrides[get_session] = get_session_override 

    with TestClient(app) as client: 
        yield client

    app.dependency_overrides.clear()
```

---

## Mock

O Mock é ideal para garantir que as *funções sejam chamadas na ordem exata, verificar os parâmetros usados na função, entre outros*. Ele age como um diretor de filme, exigindo que o roteiro seja seguido rigorosamente.

---

Aqui uma função básica que processa pagamentos. Note que a verificação de fraude deve ocorrer antes da cobrança:

--

```py
# regras_negocio.py

class GatewayDePagamento:
    def verificar_fraude(self, numero_cartao):
        # Lógica complexa de IA para fraude...
        pass
        
    def cobrar(self, numero_cartao, valor):
        # Comunicação com a operadora do cartão (Visa, Mastercard)...
        pass

def finalizar_compra(gateway: GatewayDePagamento, cartao: str, valor: float):
    # A ordem exata que o negócio exige:
    gateway.verificar_fraude(cartao)
    gateway.cobrar(cartao, valor)
    
    return "Compra finalizada com sucesso"
```

---

Aqui está o código de teste usando Pytest:

--

```py
# test_regras_negocio.py

from unittest.mock import call
from regras_negocio import finalizar_compra

def test_deve_verificar_fraude_antes_de_cobrar(mocker):
    # Criar o Mock que simula o Gateway
    mock_gateway = mocker.Mock()
    
    # Executar a função com o Mock
    finalizar_compra(mock_gateway, "1234-5678", 150.00)
    
    # Definindo o roteiro esperado
    roteiro_esperado = [
        call.verificar_fraude("1234-5678"),
        call.cobrar("1234-5678", 150.00)
    ]
    
    # Verificação estrita da ordem das chamadas
    mock_gateway.assert_has_calls(roteiro_esperado, any_order=False)
```

---

O `roteiro_esperado` *especifica a sequência exata das chamadas*, iniciando pela verificação de fraude e depois pela cobrança. A utilização de `any_order=False` é essencial, pois garante que essa ordem seja mantida durante o teste.

Caso um desenvolvedor altere a ordem para `cobrar()` antes de `verificar_fraude()`, *o Mock fará o teste falhar imediatamente, ajudando a proteger a lógica de negócios*. Se a ordem for invertida, o pytest apresentará uma *mensagem de erro clara*, indicando que a sequência das chamadas esperadas não foi respeitada.