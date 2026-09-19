
#set page(
  paper: "a4",
  fill: rgb("#181818"),
  footer: align(center)[Gerado em: #datetime.today().display("[day]/[month]/[year]")],
)

#set text(
  fill: rgb("#f5f5f5"),
  size: 14pt,
)

#show raw: set text(fill: rgb("#aed68d"))
#show link: set text(fill: rgb("#58a6ff"))

= 1. Preparação do Ambiente e Código

Crie os arquivos abaixo na mesma pasta e instale o plugin de cobertura executando:

`pip install pytest-cov`

*Arquivo:* `validador.py`

```python
def validar_acesso(idade, possui_convite, vip=False):
    if idade < 0:
        raise ValueError("Idade inválida")
    if vip:
        return "Acesso VIP Liberado"
    elif idade >= 18 and possui_convite:
        return "Acesso Permitido"
    elif idade >= 18 and not possui_convite:
        return "Comprar Ingressos"
    else:
        return "Acesso Negado: Menor de Idade"

```

*Arquivo:* `test_validador.py`

```python
from validador import validar_acesso


def test_acesso_permitido():
    resultado = validar_acesso(20, True)
    assert resultado == "Acesso Permitido"


def test_menor_de_idade():
    resultado = validar_acesso(15, False)
    assert resultado == "Acesso Negado: Menor de Idade"

```

= 2. Execução de Comandos e Análise de Resultados

Execute os comandos indicados no seu terminal e responda às questões analíticas.

== Passo A: Cobertura de Linha (Line Coverage)

Rode o comando:

```bash
pytest -v --cov=validador

```

#v(4pt)

*Q1. Analise o relatório impresso no terminal.*

* Qual foi a porcentagem de cobertura (`Cover`) exibida?
* O código possui 5 resultados/regras de negócio possíveis, mas escrevemos apenas 2 testes. Por que a porcentagem de linhas executadas aparenta ser alta apesar disso?

#v(3cm)

== Passo B: Cobertura de Desvio (Branch Coverage)

Rode o comando adicionando a análise de desvios:

```bash
pytest -v --cov=validador --cov-branch

```

#v(4pt)

*Q2. Compare o resultado com o Passo A.*

* Quais foram os valores exibidos nas colunas *Branch* e *BrPart*? Explicite o significado desses valores com base no slide da aula.
* Por que a métrica *Cover* caiu em relação ao Passo A? O que a análise de desvios conseguiu detectar que a de linha não viu?

#v(3cm)

== Passo C: Relatório Visual em HTML e Diagnóstico

Gere o relatório visual e abra o arquivo em seu navegador:

```bash
coverage html

```

*Dica: Abra o arquivo `htmlcov/index.html` e clique em `validador.py`.*

#v(4pt)

*Q3. Inspecione o código colorido no HTML e responda:*

* A linha `if idade < 0:` foi marcada como *Verde*, *Vermelha* ou *Amarela*? Explique o que essa marcação indica sobre a execução da linha e de seus desvios.
* Qual cor foi atribuída à linha `raise ValueError("Idade inválida")`?
* Mapeie os argumentos necessários (`idade`, `possui_convite`, `vip`) para criar os testes que faltam para pintar *100%* do arquivo de verde.
* Explique por que atingir *100% de cobertura de desvios* não significa necessariamente testar todas as combinações possíveis dos argumentos `idade`, `possui_convite` e `vip`.

#v(3.5cm)

= 3. Desafio de Implementação Prática

Abra o arquivo `test_validador.py` e adicione todos os métodos de teste que faltam para cobrir as ramificações não testadas (inclusive o teste para validar a exceção do `ValueError` utilizando `pytest.raises`).

Após atualizar o arquivo:

1. Rode no terminal: `pytest -v --cov=validador --cov-branch`
2. Gere o HTML com `coverage html` e confirme *100% de cobertura de linhas e desvios*.

*Escreva abaixo os novos métodos de teste adicionados ou o arquivo `test_validador.py` finalizado:*

#v(6cm)
