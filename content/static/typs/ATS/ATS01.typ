#set page(paper: "a4", margin: (x: 2cm, y: 2.5cm))
#set text(size: 10.5pt)

= Atividade Prática: Carrinho de Compras de um E-commerce
== Contexto
Você faz parte da equipe de qualidade de uma loja online e foi encarregado de testar a funcionalidade de cálculo de frete e aplicação de cupons de desconto no carrinho de compras. O objetivo é garantir que as regras de negócio sejam aplicadas corretamente antes de o cliente finalizar o pedido.
== Regras de Negócio
O sistema deve seguir as seguintes regras para o cálculo do valor final da compra:
1. Valor do Pedido: O valor total dos produtos no carrinho.
2. Frete Grátis: Pedidos com valor igual ou superior a R\$ 200,00 recebem frete grátis.
3. Custo do Frete: Para pedidos com valor inferior a R\$ 200,00, o frete tem um custo fixo de R\$ 25,00.
4. Cupom de Desconto PROMO10: Este cupom oferece 10% de desconto sobre o valor total dos produtos.
    - Condição: Só pode ser aplicado se o valor total dos produtos for igual ou superior a R\$ 100,00.
    - Regra de Precedência: O desconto do cupom deve ser aplicado antes do sistema verificar se o cliente tem direito ao frete grátis.
5. Cupom de Desconto PRIMEIRACOMPRA: Este cupom oferece R\$ 30,00 de desconto fixo sobre o valor total dos produtos. Ele pode ser aplicado em pedidos de qualquer valor.
6. Restrição de Cupons: O cliente não pode aplicar mais de um cupom na mesma compra.
== Sua Tarefa
Com base nas regras de negócio acima, você deve projetar um conjunto de casos de teste para validar o comportamento do sistema. Para isso, você deve:
- Identificar as Classes de Equivalência para o valor do pedido (considerando os limites de frete e do cupom PROMO10).
- Identificar os Valores Limite onde o comportamento do sistema muda (por exemplo, o valor exato para ganhar frete grátis).
- Criar uma tabela de casos de teste que cubra cenários válidos e inválidos, incluindo:
    - Cenários que testem os limites de frete grátis.
    - Cenários que testem os limites para a aplicação do cupom PROMO10.
    - Cenários que combinem o uso de cupons com as regras de frete.
    - Cenários que tentem aplicar cupons de forma inválida (ex: PROMO10 em um pedido de R\$ 50,00).
    - Um cenário que tente aplicar os dois cupons ao mesmo tempo.

== Modelo de Entrega
Crie uma tabela com os seguintes campos para documentar seus casos de teste:

#table(
  columns: (auto, 1fr, auto, auto, 1.3fr),
  align: (col, row) => (
    if row == 0 { center + horizon }
    else if col == 0 or col == 2 or col == 3 { center + horizon }
    else { left + horizon }
  ),
  stroke: 0.5pt + black,
  
  // Cabeçalho
  [*ID*], [*Descrição do\ Cenário*], [*Valor (R\$)*], [*Cupom*], [*Resultado\ Esperado*],

  // Linhas da tabela
  [CT01], [Testar frete grátis no limite mínimo], [200,00], [Nenhum], [*R\$ 200,00* (Frete grátis)],
  [CT02], [Testar cobrança de frete abaixo do limite], [199,99], [Nenhum], [*R\$ 224,99* (R\$ 199,99 + R\$ 25,00 frete)],
  [...], [...], [...], [...], [...]
)