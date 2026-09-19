<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>unittest</h1>
</div>

---

O **unittest é focado primordialmente em Testes de Unidade** (ou Testes Unitários), como o próprio nome sugere. Eles servem para *verificar se as menores partes de um sistema* (as "unidades") estão funcionando exatamente como deveriam, de forma *isolada*.

Uma **unidade** é geralmente:

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


# UnitTest

O **unittest** é o framework de testes *padrão* do Python. Ele *já vem instalado com a linguagem* (built-in), o que é uma grande vantagem para projetos que não querem adicionar dependências externas.

Ele é fortemente inspirado no JUnit (do Java), o que significa que ele é *baseado em Programação Orientada a Objetos*. Para criar um teste, você precisa *obrigatoriamente* criar uma classe que herda de `unittest.TestCase`.

--

Exemplo simples:

```py
import unittest

def soma(a, b):
    return a + b

# diz que a classe herda de unittest 
# identificando ele como um teste
class TesteSoma(unittest.TestCase):
    # só executa métodos que comecem com test_
    def test_funcao_soma(self):
        self.assertEqual(soma(10, 5), 15)

# permite que execute o arquivo como um script Python comum
if __name__ == '__main__':
    unittest.main()
```

Rode com `python3 unittest01.py`

--

Tendo como resultado isso:

```
[giobon@giovani-a320mh UNITTEST]$ python3 unittest01.py 
.

Ran 1 test in 0.000s

OK
```


Exibirá um ponto (`.`) para cada teste com sucesso ou um `F` para cada falha.

---

## Assert Methods

Quando você cria uma classe que herda de `unittest.TestCase`, essa classe *ganha acesso aos Assert Methods* (ou métodos de afirmação) através do `self`. A grande vantagem deles sobre o `assert` comum do Python é que, se o teste falhar, eles explicam *por que* falhou.

Os **Assert Methods** no módulo unittest do Python são utilizados para *verificar se os resultados obtidos em testes de unidade correspondem aos resultados esperados*. 

Quando uma condição falha, um `AssertionError` é levantado, indicando imediatamente a *existência de um problema*, o que facilita a *identificação e correção de bugs* no desenvolvimento.

--

Os mais usados são: 

| Método | Checa que | Descrição |
| :--- | :--- | :--- |
| `assertEqual(a, b)` | `a == b` | Verifica se `a` e `b` são iguais. |
| `assertNotEqual(a, b)` | `a != b` | Verifica se `a` e `b` são diferentes. |
| `assertTrue(x)` | `bool(x) é True` | Verifica se a condição `x` é verdadeira. |
| `assertFalse(x)` | `bool(x) é False` | Verifica se a condição `x` é falsa. |
| `assertIs(a, b)` | `a é b` | Verifica se `a` e `b` são o mesmo objeto. |
| `assertIsNot(a, b)` | `a não é b` | Verifica se `a` e `b` não são o mesmo objeto. |
| `assertIsNone(x)` | `x é None` | Verifica se `x` é `None`. |
| `assertIsNotNone(x)` | `x não é None` | Verifica se `x` não é `None`. |

--


| Método | Checa que | Descrição |
| :--- | :--- | :--- |
| `assertIn(a, b)` | `a in b` | Verifica se `a` está contido em `b` (como listas, strings ou dicionários). |
| `assertNotIn(a, b)` | `a not in b` | Verifica se `a` não está contido em `b`. |
| `assertIsInstance(a, b)` | `isinstance(a, b)` | Verifica se `a` é uma instância da classe `b`. |
| `assertNotIsInstance(a, b)` | `not isinstance(a, b)` | Verifica se `a` não é uma instância da classe `b`. |
| `assertIsSubclass(a, b)` | `issubclass(a, b)` | Verifica se a classe `a` é uma subclasse de `b`. |
| `assertNotIsSubclass(a, b)` | `not issubclass(a, b)` | Verifica se a classe `a` não é uma subclasse de `b`. | 

---

### `assertRaises`

Muitas vezes, queremos *testar se o código falha* corretamente quando recebe dados inválidos. 

O `assertRaises` é um método do módulo unittest que *verifica se uma função específica levanta uma EXCEÇÃO ESPERADA quando é executada*. Ao usar esse método, o desenvolvedor pode garantir que o *código se comporta corretamente em SITUAÇÕES DE ERRO*, validando se a exceção correta é gerada em resposta a condições inesperadas.

**Por que usar isso?** Serve para garantir que as suas *travas de segurança* estão funcionando. Se você criou uma *função* que só aceita números inteiros, você precisa de um teste com `assertRaises(TypeError)` para garantir que, *se alguém tentar passar uma letra*, o sistema vai barrar isso corretamente em vez de tentar processar e causar um estrago maior depois.

--

Imagine uma função simples de divisão. O Python não consegue dividir por zero e lança um `ZeroDivisionError`. Podemos testar se isso realmente acontece:

```py
import unittest

def dividir(a, b):
    return a / b

class TesteDivisao(unittest.TestCase):
    def test_erro_divisao_por_zero(self):
        # "Eu espero que aconteça um ZeroDivisionError 
        # ao executar o que vem abaixo"
        with self.assertRaises(ZeroDivisionError):
            dividir(10, 0)

if __name__ == '__main__':
    unittest.main()
```

--

Quando você usa `with self.assertRaises(ZeroDivisionError):`, você está criando uma **zona de monitoramento** (Context Manager).

1. O `unittest` começa a observar cada linha de código dentro do bloco indentado.
2. O código lá dentro roda.
3. Se um erro aconteceu: o `with` captura o erro e verifica se é do tipo que você esperava (`ZeroDivisionError`). Se for, ele "engole" o erro e deixa o teste seguir como **Sucesso**.
    - Se nenhum erro aconteceu: o `with` entende que algo está errado (já que você esperava um erro) e interrompe o teste como **Falha**.

--

Resultados:

- Se você chamar `dividir(10, 0)`, o erro ocorre, o `unittest` captura ele e diz: **OK (Sucesso)**.

- Se você chamasse `dividir(10, 2)`, a função retornaria `5` (não daria erro). O `unittest` acharia estranho (já que você prometeu um erro que não veio) e marcaria o teste como **Falha**.

--

#### Exceções embutidas (built-in exceptions) comuns

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

### Comando `discover`

O comando `python3 -m unittest discover` permite que você *psrocure automaticamente por testes em um projeto inteiro*, ao invés de especificar arquivos individualmente. Ao ser executado, ele percorre o diretório atual e suas subpastas em *busca de arquivos que começam com `test`* (ex: `test_soma.py`, `test_login.py`). Dentro desses arquivos, o comando *identifica classes que herdam de `unittest.TestCase` e métodos que começam com `test_`*. Em vez de executar testes individualmente, o `discover` *reúne todos, executa-os e fornece um único relatório*.

Usar `-m unittest discover` traz vantagens como organização dos códigos de produção separados dos testes, escalabilidade em projetos grandes, e integração contínua em ferramentas como GitHub Actions.

Na maioria das versões modernas, digitar apenas `python3 -m unittest` assume automaticamente o `discover`.