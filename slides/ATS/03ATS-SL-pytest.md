<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

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

---

## Cobertura de Testes

**Cobertura de Testes** (ou Code Coverage) é uma métrica usada no desenvolvimento de software para medir a *porcentagem do seu código-fonte que é executada* quando seus testes automatizados rodam.

Em termos simples, ela responde à pergunta: "*Quanto do meu código foi realmente verificado pelos testes que escrevi?*"

Imagine que você tem uma função simples com uma condição `if/else`. Se você escrever um teste que apenas verifica o caso do `if`, o código dentro do `else` nunca será executado durante o teste. Nesse cenário, sua *cobertura seria parcial (por exemplo, 50%)*, pois metade da lógica não foi validada.

--

Podemos utilizar o `pytest-cov` para fornecer dados sobre cobertura. Primeiro intale-o com `pip install pytest-cov`. Feito isso, podemos usar `pytest -v --cov=funcao`. `--cov=funcao` indica qual arquivo se quer analizar, tendo como resultado:

```bash
Name        Stmts   Miss  Cover
funcao.py       2      0   100%
TOTAL           2      0   100%
```

Isso testa a **cobertura de linha** (Line Coverage) que é a métrica mais simples, significando quantas linhas foram executadas.
- **`Stmts`** (statements): o pytest detectou que existem apenas 2 linhas de código "executável" dentro do arquivo `funcao.py`.
- **`Miss`**: durante a execução dos testes, zero linhas deixaram de rodar.
- **`Cover`**: matemática simples: (2 linhas totais - 0 perdidas) / 2 totais = 100% de cobertura de testes.

--

Comandos:

```bash
pytest -v --cov=funcao # se funcao for arquivo .py o analiza, de for pasta, analiza a cobertura todos os testes desses arquivos
pytest -v --cov=. # análise de todos os testes
```

--

Além da cobertura de linha há a **cobertura de desvio** (Branch Coverage), é a mais crítica para lógica complexa pois *verifica se todos os caminhos possíveis foram testados* (cada `true` e `false` de um `if`). Para obter dados desse tipo de cobertura use `pytest -v --cov=funcao --cov-branch`, que exibirá:

```bash
Name        Stmts   Miss Branch BrPart  Cover
funcao.py       2      0      0      0   100%
TOTAL           2      0      0      0   100%
```

- **`Branch`**: quantos desvios (bifurcações como `if/else`) existem.
- **`BrPart`**: quantos desvios foram executados apenas parcialmente (ex: entrou no `if`, mas nunca no `else`).

Nesse código em específico não faz muito sentido gerar esse relatória pois não utiliza de comandos de condicional.

---

Se formos pensar em alterar o código para algo assim:

```py
def eh_par(numero):
    if(numero % 2 == 0):
        return True
    else:
        return False
```

```py
from funcao import eh_par
import pytest

# Teste 1: Verifica um caso verdadeiro
def test_deve_retornar_true_para_numero_par():
    resultado = eh_par(4)
    assert resultado is True
```

--

Ao rodar `pytest -v --cov=funcao --cov-branch` teríamos:

```bash
Name        Stmts   Miss Branch BrPart  Cover
funcao.py       4      1      2      1    67%
TOTAL           4      1      2      1    67%
```

O relatório de cobertura do teste para o arquivo `funcao.py` mostra:

- **`Stmts`:** O arquivo contém **4** linhas de código executáveis.
- **`Miss`:** **1** linha nunca foi executada durante os testes, indicando que existe um trecho de código não testado.
- **`Branch`:** O código possui **2** caminhos de decisão (por exemplo, estruturas condicionais).
- **`BrPart` :** (Desvio Parcial) Houve **1** desvio parcial, ou seja, um lado de uma estrutura condicional foi testado, mas o outro não.
- **`Cover`:** A cobertura total é de **67%**, sinalizando que os testes são razoáveis, mas falharam em testar uma linha e um dos caminhos de uma condicional.

--

O comando **`coverage html`** gera um *relatório visual e interativo* a partir dos dados de cobertura de testes, tornando mais fácil *identificar quais partes do código não foram testadas*. Ele cria automaticamente uma pasta chamada **`htmlcov`** no diretório do projeto, onde o arquivo principal **`index.html`** é responsável por fornecer a interface visual da cobertura de testes (gera para *todo o projeto*).

O comando `coverage html` é apenas um formatador. Ele não "testa" nada; ele apenas pega um arquivo de dados (geralmente um arquivo oculto chamado `.coverage`) e o transforma em um site html.

Ao abrir o arquivo `index.html` no navegador, você encontrará seu código-fonte *colorido* de acordo com seu status de execução durante os testes: 
- linhas em **verde** indicam que foram cobertas
- linhas em **vermelho** que nunca foram executadas
- linhas em **amarelo** (se usando `--cov-branch`) que foram atingidas, mas *não em todos os caminhos possíveis*, facilitando a identificação de áreas que precisam de mais testes.