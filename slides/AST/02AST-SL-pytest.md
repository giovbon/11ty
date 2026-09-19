<!-- .slide: data-background-image="https://i.ibb.co/mrbpyRNH/AAGemini-Generated-Image-lsw6plsw6plsw6pl.png" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>pytest</h1>
    <img src="https://simpleicons.org/icons/pytest.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---


O **Pytest** é um *framework de testes* para Python muito popular por ser expressivo, escalável e simples. Ele **é focado primordialmente em Testes de Unidade** (ou Testes Unitários) que servem para *verificar se as menores partes de um sistema* (as "unidades") estão funcionando exatamente como deveriam, de forma *isolada*.

Uma unidade é geralmente:

- Uma única *função*.
- Um *método* de uma classe.
- Um pequeno componente lógico.

Pense neles como o *controle de qualidade* de uma fábrica de carros: antes de testar se o carro corre na pista, você testa se cada parafuso, cada pistão e cada lâmpada estão funcionando perfeitamente de forma individual.

---

## 3 Características de um bom Teste de Unidade

- **Isolamento**: O teste *não deve depender de nada externo* (banco de dados, internet, arquivos no disco). Se a função que você está testando precisa de um banco de dados, você usa um "dublê" (chamado de Mock).
- **Velocidade**: Eles devem ser *executados muito rapidamente*. Um projeto grande pode ter *milhares de testes de unidade* e eles precisam rodar rápido para que o desenvolvedor os execute o tempo todo.
- **Repetibilidade**: O resultado *deve ser o mesmo* toda vez que você rodar o teste, independentemente do ambiente.

---

## A Estrutura de um Teste (O Padrão AAA)

Quase todo teste de unidade segue uma estrutura lógica dividida em três etapas, conhecida como AAA:

- **Arrange (Organizar)**: Preparar os dados de entrada e a expectativa.
- **Act (Agir)**: Você executa a função ou método que deseja testar.
- **Assert (Afirmar)**: Você verifica se o resultado da execução é o que você esperava.

---

## Por que fazer testes de unidade?

- **Facilita o Refactoring**: Você pode *mudar todo o código interno de uma função para torná-la mais rápida*; se o teste de unidade *continuar passando*, você tem certeza de que não quebrou a lógica.
- **Documentação Viva**: O teste serve como um exemplo de *como aquela função deve ser usada*.
- **Redução de Custos**: É muito *mais barato e fácil corrigir um erro descoberto durante o desenvolvimento* (na sua máquina) do que um erro encontrado pelo cliente em produção.

---

### Pytest vs. Unittest

| Critério | Unittest | Pytest |
| :--- | :--- | :--- |
| **Instalação** | Parte da biblioteca padrão do Python (já instalado). | Biblioteca externa que requer instalação via `pip install pytest`. |
| **Estrutura** | *Baseado em classes*, exige herança de `unittest.TestCase` e métodos específicos para asserções. | *Baseado em funções*, permite escrita simples começando com `test_` e uso do comando nativo `assert`. |
| **Asserções** | Necessita de diversos métodos de asserção (`self.assertEqual`, `self.assertTrue`, etc.). | Utiliza apenas o `assert`, com introspecção automática para erros, mostrando valores que causaram a falha. |

---

**Nomes de Arquivo:** O Pytest procura automaticamente por arquivos que começam com `test_` ou terminam com `_test.py`. (Ex: `test_calculadora.py`).

**Nomes de Funções:** Dentro desses arquivos, ele só executa funções que começam com `test_`. (Ex: `def test_soma_positivos():`).

**Asserções Simples:** Esqueça `self.assertEqual` do unittest. Use apenas a palavra reservada nativa do Python: `assert`.

**Execução:** Para rodar, basta digitar `pytest` no terminal (na pasta do projeto).

---

Um exemplo simples:

```py
def soma(a, b):
    return a + b


# No pytest, basta criar uma função que comece com test_
def test_funcao_soma():
    # O pytest utiliza a palavra-chave nativa `assert` do Python
    assert soma(10, 5) == 15
```

--

Você precisa instalar o `pytest` no ambiente virtual (venv) do seu projeto para que o comando fique disponível no terminal, com `pip install pytest`.

Você não precisa de `import pytest` porque o teste usa apenas recursos nativos da linguagem Python (como a palavra-chave `assert`).

No terminal: use o comando `pytest` (que você instalou via pip) que faz o trabalho de varrer a pasta, encontrar as funções que começam com `test_` e executá-las.

---

`assert` é utilizados para *verificar se os resultados obtidos em testes de unidade correspondem aos resultados esperados*

Possibilidades de uso do `assert` no pytest:

```py
assert resultado is True
assert resultado is False
assert resultado is None    # Verifica se é vazio/nulo
assert resultado is not None

assert soma == 10
assert nome == "Carlos"
# Compara o conteúdo do dicionário
assert usuario == {"id": 1, "nome": "Ana"}

lista_de_frutas = ["maçã", "banana", "uva"]
mensagem_erro = "Erro: Usuário não encontrado no banco."

assert "banana" in lista_de_frutas
assert "sucesso" not in mensagem_erro
# Verifica se a chave existe no dicionário
assert "id" in usuario_dict

lista_vazia = []
lista_cheia = [1, 2, 3]

assert lista_cheia   # Passa
assert not lista_vazia # Passa

idade = 18
assert idade >= 18
```

---

Existem *dois casos* onde o `assert` puro do Python não resolve bem, e o pytest oferece ferramentas auxiliares:

## Testar erros

Testar se seu código falha quando deveria falhar.

Muitas vezes, queremos *testar se o código falha* corretamente quando recebe dados inválidos. 

O `pytest.raises` é um método do módulo pytest que *verifica se uma função específica levanta uma EXCEÇÃO ESPERADA quando é executada*. Ao usar esse método, o desenvolvedor pode garantir que o *código se comporta corretamente em SITUAÇÕES DE ERRO*, validando se a exceção correta é gerada em resposta a condições inesperadas.

--

Imagine uma função simples de divisão. O Python não consegue dividir por zero e lança um erro do tipo `ZeroDivisionError`. Podemos testar se isso realmente acontece:

```py
def test_deve_falhar_ao_dividir_por_zero():
    with pytest.raises(ZeroDivisionError):
        resultado = 10 / 0
    # O teste PASSA se o erro acontecer. Se NÃO der erro, o teste falha.
```

--

Se um erro aconteceu: o `with` captura o erro e verifica se é do tipo que você esperava (`ZeroDivisionError`). Se for, ele "engole" o erro e deixa o teste seguir como **Sucesso**.

Se nenhum erro aconteceu: o `with` entende que algo está errado (já que você esperava um erro) e interrompe o teste como **Falha**.

---

### Exceções embutidas (built-in exceptions) comuns

| Exceção | Quando usar no `assertRaises` | Exemplo Prático |
| --- | --- | --- |
| `ValueError` | Quando o tipo do dado está certo, mas o valor recebido é inválido para a lógica da função. | Passar uma idade negativa `-5` em uma função de cadastro. |
| `TypeError` | Quando o tipo do dado é incompatível com a operação. | Enviar uma string `"5"` para uma função de cálculo que só aceita números `int`/`float`. |
| `IndexError` | Quando o código tenta acessar uma posição inexistente de uma sequência (lista, tupla). | Buscar o elemento na posição `[10]` em uma lista de apenas 3 itens. |
| `KeyError` | Quando se tenta acessar uma chave que não existe em um dicionário. | Buscar a chave `dicionario["email"]` quando o usuário só possui `"nome"`. |
| `ZeroDivisionError` | Ao tentar dividir qualquer número por zero. | Executar cálculos matemáticos ou médias onde o divisor pode ser `0`. |

--

| Exceção | Quando usar no `assertRaises` | Exemplo Prático |
| --- | --- | --- |
| `AttributeError` | Ao tentar chamar um método ou atributo que o objeto não possui. | Tentar usar `.upper()` em uma variável que é um número inteiro. |
| `FileNotFoundError` | Ao tentar manipular um arquivo cujo caminho não existe no sistema. | Executar um leitor de dados apontando para um arquivo `.csv` deletado. |
| `PermissionError` | Ao tentar realizar operações de arquivo sem o nível de acesso necessário. | Tentar salvar um log em uma pasta restrita do sistema operacional. |
| `KeyBoardInterrupt` / `TimeoutError` | Para testar resiliência a interrupções de tempo limite ou execuções externas. | Requições de API que demoram mais que o tempo limite configurado. |
| `Exception` | Captura genérica de qualquer erro padrão (use apenas se não souber o erro exato). | Validações amplas onde qualquer falha deve interromper o fluxo do teste. |

---

## Aproximação

Computadores são ruins com números decimais (float). `0.1 + 0.2` muitas vezes resulta em `0.30000000000000004` e o teste falha se usar `==`.

```py
def test_calculo_decimal():
    # assert 0.1 + 0.2 == 0.3  <-- ISSO FALHARIA
    assert 0.1 + 0.2 == pytest.approx(0.3) # ISSO PASSA
```

O `pytest.approx()` funciona aplicando uma margem de tolerância flexível à comparação: em vez de exigir igualdade exata bit a bit, ele calcula a diferença entre os números e aceita o resultado se a variação for insignificante, ignorando os pequenos ruídos de arredondamento da memória.

---

## Execução

O comando `pytest` *executa todos os arquivos de teste* que seguem a convenção de nomenclatura (como `test_*.py` ou `*_test.py`) no diretório atual e em subdiretórios. Se você *especificar um nome de arquivo*, como `pytest nome_do_arquivo.py`, o pytest executará apenas os testes contidos nesse arquivo. 

A opção `-v` (ou `--verbose`) aumenta a verbosidade da saída, fornecendo *detalhes sobre cada teste, incluindo seu nome e resultado*, o que facilita a identificação de falhas. Sem essa opção, a saída é mais resumida, mostrando apenas um ponto (`.`) para testes que passaram, um `F` para os que falharam, e um `s` para os que foram pulados.

```bash
test_funcoes.py ..

======== 2 passed in 0.02s 
``` 

---

## Estrutura de pastas e arquivos

*Separar o código da aplicação do código de teste* é uma prática essencial no desenvolvimento profissional em Python.

A estrutura padrão de um projeto Python geralmente inclui uma *pasta dedicada para os testes*, permitindo que ferramentas como `pytest` localizem automaticamente os arquivos de teste cujo nome começa com `test_`.

```bash
meu_projeto/
├── app/                  # Onde vive seu código real
│   ├── __init__.py
│   ├── main.py           # Onde o programa começa
│   └── utilitarios.py    # Funções auxiliares
│├── tests/                # Pasta dedicada aos testes
│   ├── __init__.py
│   ├── test_main.py      # Testa o main.py
│   └── test_utilitarios.py # Testa o utilitarios.py
├── requirements.txt      # Dependências
└── README.md
```

--


Embora funcione colocar tudo em um único arquivo, essa abordagem é considerada ruim em projetos reais, pois compromete a organização e a clareza do código. Mantendo *arquivos distintos*, como `main.py` para a lógica da aplicação e `test_main.py` para os testes, *cada um se concentra em sua função específica, facilitando a legibilidade e manutenção*. Além disso, ao implementar essa separação, é mais simples *evitar o envio de arquivos de teste para o ambiente de produção*.

Exemplo:

```python
# Arquivo: funcao.py

def eh_par(numero):
    """Retorna True se o número for par, False caso contrário."""
    return numero % 2 == 0
```

--

```python
# Arquivo: test_funcoes.py
from funcoes import eh_par
import pytest

# Teste 1: Verifica um caso verdadeiro
def test_deve_retornar_true_para_numero_par():
    resultado = eh_par(4)
    assert resultado is True

# Teste 2: Verifica um caso falso
def test_deve_retornar_false_para_numero_impar():
    resultado = eh_par(5)
    assert resultado is False
```

Depois, abra seu terminal na pasta onde salvou os arquivos e digite `pytest test_funcoes.py -v`.