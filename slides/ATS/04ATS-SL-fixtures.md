<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>fixtures</h1>
    <img src="https://simpleicons.org/icons/pytest.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

## O que é Fixture

**Fixture** é uma função que prepara e *fornece dados ou contexto* para os testes.

- *Fornecer dados*: Criação e injeção de informações ou objetos (ex: usuários falsos, listas de produtos).
- *Fornecer contexto*: Configuração do ambiente de execução (ex: abrir conexões com bancos de dados, criar pastas temporárias), assegurando um cenário ideal e isolado.

O pytest *detecta automaticamente essas funções marcadas* com `@pytest.fixture`. Seus resultados são *injetados nos testes que as solicitam*, eliminando a necessidade de chamadas manuais, por simplesmente *adicionar o nome da fixture dentro dos parênteses da função de teste*.

---

## Retornando Dados
### `return`

Use `return` quando você só quer *fornecer um dado inicial para o teste e não precisa desfazer/limpar nada depois*:

```py
@pytest.fixture
def usuario_padrao():
    return {"nome": "João", "idade": 30}

def test_nome_do_usuario(usuario_padrao):
    assert usuario_padrao["nome"] == "João"
```

---

## `yield`

Use quando você cria um recurso que precisa ser destruído, limpo ou fechado após o teste terminar. (ex: arquivos físicos, conexões de rede, bancos de dados). O código após o `yield` sempre executa, mesmo que o teste falhe.

Exemplo:

```py
@pytest.fixture
def conexao_banco():
    # 1. SETUP: Abre a conexão antes do teste
    conexao = conectar_banco()

    # 2. INJEÇÃO: Pausa a fixture e entrega a conexão ao teste
    yield conexao 

    # 3. TEARDOWN: O teste acabou, o pytest retoma aqui e fecha a conexão
    conexao.close()
```

--

A transição entre os momentos no pytest é *gerida automaticamente com a palavra-chave `yield`*. Quando o teste começa, o pytest executa a fixture até encontrar o `yield`, momento em que "congela" a execução (da função da fixture) e entrega a variável ao teste. Após a execução do teste, independentemente do resultado, o pytest retoma a fixture a partir do `yield` para realizar a limpeza necessária. Todo esse processo acontece sem a necessidade de código adicional para gerenciar as transições, pois o pytest cuida disso automaticamente.

---

## Fixture chamando Fixture

Uma fixture pode solicitar outra fixture nos seus parênteses. Isso permite reaproveitar lógicas e criar cenários complexos em camadas.

```python
@pytest.fixture
def usuario():
    return {"nome": "Ana", "admin": True}

@pytest.fixture
def token_autenticacao(usuario): # Recebe o resultado da fixture 'usuario'
    return f"bearer_token_para_{usuario['nome']}"

def test_acesso(token_autenticacao):
    assert "Ana" in token_autenticacao
```

---

## Parâmetros Globais de Fixtures

Alguns **parâmetros** são cruciais para definir o *comportamento e a abrangência* de uma fixture no Pytest.

### `scope`

O `scope` *determina como e quando a fixture é criada e destruída*. Com ele, você pode *evitar a criação repetida de recursos pesados*. São definidas junto à marcação de fixture: `@pytest.fixture(scope="class")`

---

| **Nível de Escopo** | **Descrição**                                                                                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `function` (Padrão)        | Roda a fixture *uma vez para cada teste*. Se 10 testes chamarem a fixture, ela roda 10 vezes. Ideal para dados simples em memória.                                   |
| `class`           | Roda apenas *uma vez por classe* de testes. Todos os testes dentro daquela classe compartilham o mesmo resultado da fixture.                                          |
| `module`          | Roda apenas *uma vez por arquivo de teste (`.py`)*. Útil para carregar um arquivo pesado (como um CSV gigante) apenas uma vez e reutilizá-lo nos testes daquele arquivo. |
| `package`          | Roda uma vez por pacote/pasta `(__init__.py)`. Funciona bem em casos de configurações compartilhadas em um domínio do sistema.|
| `session`         | O mais abrangente. *Roda apenas uma vez para toda a execução do pytest*, independentemente de quantos arquivos ou testes diferentes você use. Funciona bem para serviços globais. |

--

```python
import pytest

# Recurso pesado: Conexão com o banco de dados.
# Definimos scope="session" para conectar apenas UMA vez durante toda a bateria de testes.
@pytest.fixture(scope="session")
def conexao_banco():
    ...

# Recurso leve: Estado individual do carrinho de compras.
# Usamos scope="function" (padrão) para garantir um carrinho limpo antes de CADA teste.
@pytest.fixture(scope="function")
def carrinho_vazio():
    return []

# --- TESTES ---

def test_adicionar_item(carrinho_vazio, conexao_banco):
    ...
```

---

### `autouse`

O parâmetro autouse=True faz a fixture rodar automaticamente em todos os testes do seu escopo, sem precisar ser declarada nos parênteses do teste.

```python
@pytest.fixture(autouse=True)
def silenciar_logs():
    # Roda automaticamente para todos os testes do arquivo/módulo
    desativar_logs_do_sistema()
```

Use `autouse` com moderação, pois o uso excessivo pode ocultar dependências invisíveis e deixar a execução da suíte mais lenta.

---

### `params`

O parâmetro `params` permite que uma *fixture execute múltiplas vezes com dados diferentes*. Ao passar uma lista com itens para `params`, qualquer teste que utilizar essa fixture será executado automaticamente para cada item. Isso é ideal para testá-la sob várias condições sem duplicar código. 

Para usá-lo, define-se a lista em `@pytest.fixture(params=[...])` e, dentro da fixture, usa-se `request.param` para acessar o valor atual.

```python
@pytest.fixture(params=["mysql", "postgres", "sqlite"])
def banco_dados(request):
    return conectar_banco(request.param)

def test_consulta(banco_dados):
    # Este teste rodará 3 vezes automaticamente, uma para cada banco
    assert banco_dados.status_ativo()
```

---

## `conftest.py`

O **`conftest.py`** é um *arquivo do Pytest que centraliza recursos compartilhados para testes*. Ao definir fixtures ou configurações nele, o Pytest as torna automaticamente *disponíveis para todos os arquivos de teste na mesma pasta e subpastas, sem necessidade de importações manuais*. É ideal para armazenar fixtures globais, como conexões de banco de dados ou autenticações de API, mantendo o código dos testes limpo e livre de repetições.

--

*Colocar todas as fixtures* no `conftest.py` é considerado *má prática*, tornando o arquivo complexo e difícil de manter. A organização ideal é:
- Crie fixtures específicas *dentro do arquivo de teste* (`test_*.py`) para uso exclusivo desse arquivo.
- Utilize `conftest.py` *na raiz (global) para fixtures genéricas* que precisam ser compartilhadas entre vários testes.
- Use `conftest.py` em *subpastas para restrições regionais*, evitando a poluição entre diferentes domínios de teste.

--

```
meu_projeto/
├── conftest.py               <-- Fixtures globais
├── testes/
│   ├── api/
│   │   ├── conftest.py       <-- Fixtures específicas para testes de API
│   │   └── test_api.py
│   └── backend/
│       ├── conftest.py       <-- Fixtures específicas para testes de backend
│       └── test_backend.py
```