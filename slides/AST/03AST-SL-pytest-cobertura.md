<!-- .slide: data-background-image="https://i.ibb.co/mrbpyRNH/AAGemini-Generated-Image-lsw6plsw6plsw6pl.png" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>cobertura de testes</h1>
    <img src="https://simpleicons.org/icons/pytest.svg" alt="Pytest" class="glass-icon imagem-invertida" />
</div>

---

## Cobertura de Testes

**Cobertura de Testes** (ou Code Coverage) é uma métrica usada no desenvolvimento de software para medir a *porcentagem do seu código-fonte que é executada* quando seus testes automatizados rodam.

Em termos simples, ela responde à pergunta: "*Quanto do meu código foi realmente verificado pelos testes que escrevi?*"

---

### Cobertura de linha

Podemos utilizar o `pytest-cov` para fornecer dados sobre cobertura de linha. Primeiro intale-o com `pip install pytest-cov`. Feito isso, podemos usar `pytest -v --cov=funcao`. `--cov=funcao` indica qual arquivo se quer analizar, tendo como resultado:

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

---

### Cobertura de desvio

A cobertura de linha por si só pode **mascarar falhas de lógica**. Se testarmos apenas a linha, o relatório pode induzir a um falso sentimento de segurança se não analisarmos os desvios.

A **Cobertura de Desvio** verifica se **todos os caminhos condicionais** (`True` e `False`) de uma estrutura como `if/else`, `try/except` ou `match/case` foram percorridos. Essa é a métrica mais crítica para lógica complexa pois *verifica se todos os caminhos possíveis foram testados* (cada `true` e `false` de um `if`). 

--

Para obter dados desse tipo de cobertura use `pytest -v --cov=funcao --cov-branch`, que exibirá:

```bash
Name        Stmts   Miss Branch BrPart  Cover
funcao.py       2      0      0      0   100%
TOTAL           2      0      0      0   100%
```

- **`Branch`**: quantidade de bifurcações de decisão presentes no código (ex: 2 decisões para 1 `if/else`).
- **`BrPart`**: quantidade de desvios executados apenas parcialmente (ex: testou o `if`, mas não o `else`).
- **`Cover`**: calculado considerando linhas e desvios não atingidos

--

Se formos analizar esse código:

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
- **`BrPart`:** (Desvio Parcial) Houve **1** desvio parcial, ou seja, um lado de uma estrutura condicional foi testado, mas o outro não.
- **`Cover`:** A cobertura total é de **67%**, sinalizando que os testes são razoáveis, mas falharam em testar uma linha e um dos caminhos de uma condicional.

---

O comando **`coverage html`** gera um *relatório visual e interativo* a partir dos dados de cobertura de testes, tornando mais fácil *identificar quais partes do código não foram testadas*. Ele cria automaticamente uma pasta chamada **`htmlcov`** no diretório do projeto, onde o arquivo principal **`index.html`** é responsável por fornecer a interface visual da cobertura de testes (gera para *todo o projeto*).

O comando `coverage html` é apenas um formatador. Ele não "testa" nada; ele apenas pega um arquivo de dados (geralmente um arquivo oculto chamado `.coverage`) e o transforma em um site html.

Ao abrir `htmlcov/index.html` no navegador, o código-fonte exibe um código de cores:

* 🟢 **Verde:** Linhas executadas e validadas nos testes.
* 🔴 **Vermelho:** Linhas nunca executadas (código sem teste).
* 🟡 **Amarelo:** Desvios parciais (*partial branches* — ex: testou apenas o `if`, mas nunca o `else`).