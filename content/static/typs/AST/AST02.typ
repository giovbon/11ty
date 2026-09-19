#set page(
  paper: "a4",
  fill: rgb("#181818"),
  footer: align(center)[Gerado em: #datetime.today().display("[day]/[month]/[year]")],
)
#show raw.where(block: false): set text(fill: rgb("#aed68d"))
#set text(
  fill: rgb("#f5f5f5"), 
  size: 14pt
)
#show link: set text(fill: rgb("#58a6ff"))


= Guia de Exercícios: Criando Testes Unitários com `pytest`

Em todos os exercícios, ao escrever suas funções de teste, você deve obrigatoriamente usar comentários para identificar as três etapas do padrão AAA em cada função:

- Arrange (Organizar): Preparar o dado de entrada e o valor esperado.
- Act (Agir): Executar a função a ser testada.
- Assert (Afirmar): Verificar se o resultado é igual ao esperado usando o comando `assert`.

Lembre-se: Crie seus arquivos de teste seguindo o padrão `test_*.py` e execute no terminal com `pytest -v`.

=== Exercício 1: O Verificador de Idade

Objetivo: Praticar a estrutura básica e asserções booleanas (`assert ... is True` / `False`).

- Tarefa: Crie uma função `pode_dirigir(idade)` que retorna `True` se a idade for maior ou igual a 18, e `False` caso contrário.
- Desafio: Escreva duas funções de teste:
1. Uma função `test_pode_dirigir_maior_de_idade()` para testar um caso positivo (ex: 20 anos).
2. Uma função `test_nao_pode_dirigir_menor_de_idade()` para testar um caso negativo (ex: 16 anos).


=== Exercício 2: Calculadora de Descontos e Troco Decimal

Objetivo: Praticar lógica de negócio e comparação de decimais com `pytest.approx`.

- Tarefa: Crie uma função `calcular_desconto(valor, percentual)` que retorna o valor final do produto com desconto aplicado.
- *Regra de negócio:* Se o percentual informado for maior que 50%, a função deve limitar o desconto a 50%.


Desafio: Crie funções de teste para:
1. Um desconto comum com números inteiros (ex: 10% de `R$ 100`).
2. O limite de segurança (ex: tentar aplicar 70% de desconto e verificar se o valor final reflete apenas 50%).
3. Um produto com valor decimal e porcentagem que gere dízimas no resultado (ex: `R$ 10.50` com 15% de desconto). *Dica: Lembre-se de importar o pytest e usar `pytest.approx()`!*


=== Exercício 3: Sistema de Cadastro de Senhas

Objetivo: Testar validações e exceções com `pytest.raises`.

- Tarefa: Crie uma função `cadastrar_senha(senha)`.
- A senha deve ter pelo menos 8 caracteres.
- Se a senha for menor que isso, a função deve levantar um `ValueError` com a mensagem `"Senha muito curta"`.


Desafio: Crie testes para:
1. Teste de Sucesso: Verifique se uma senha válida (ex: 10 caracteres) é cadastrada sem levantar erros.
2. Teste de Exceção: Use `with pytest.raises(ValueError):` para garantir que tentar cadastrar a senha `"123"` levanta o erro esperado.
3. Desafio Extra: Capture as informações da exceção gerada (`with pytest.raises(...) as exc_info:`) e verifique se a mensagem do erro contida em `str(exc_info.value)` é exatamente `"Senha muito curta"`.


=== Exercício 4: Gerenciador de Carrinho de Compras

Objetivo: Testar coleções (listas), busca com `in` / `not in` e erros.

- Tarefa: Crie uma classe simples `CarrinhoDeCompras` que possui uma lista `itens` vazia ao ser inicializada e três métodos:
- `adicionar_item(item)`: adiciona o nome de um produto na lista.
- `remover_item(item)`: remove o produto se ele estiver presente (se não estiver, levanta um `ValueError` com a mensagem `"Item não encontrado"`).
- `listar_itens()`: retorna a lista atual de itens.

Desafio: Crie funções de teste no arquivo `test_carrinho.py` para verificar:
1. Adicionar um item e verificar se ele está presente na lista (`assert item in carrinho.listar_itens()`).
2. Remover um item e verificar se ele não está mais na lista (`assert item not in carrinho.listar_itens()`).
3. Tentar remover um item que não está no carrinho e verificar se um `ValueError` é disparado usando `pytest.raises`.