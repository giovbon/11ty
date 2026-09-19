---
title: Widgets
presentation: "slides/NLCW/02NLCW-SL-componentes.md"
order: 4
---


## Exercício Prático: Construindo um Card de Produto

Montar a interface de um cartão de produto utilizando a hierarquia correta de widgets e personalizando suas propriedades visuais.

**Parte 1: Estrutura na Widget Tree (Monte nesta ordem)**

1. Adicione um **Container** na tela.
2. Dentro do Container, adicione uma **Column** (vertical).
3. Dentro da Column, adicione na ordem:
    - Uma **Image**
    - Um **Text** (para o título do produto)
    - Uma **Row** (horizontal)
    - Um **Button** ("Comprar")

4. Dentro da **Row**, adicione 2 elementos **Text**:
    - Texto 1: "R$ 199,00"
    - Texto 2: "Em até 10x"

**Parte 2: Ajuste no Properties Panel (Estilização)**

1. **No Container principal:**
    - Defina `Width` = `280` e `Height` = `380`
    - Adicione `Padding` = `12` em todos os lados.
    - Mude a cor de fundo (`Fill Color`) para branco ou cinza bem claro.
    - Adicione borda arredondada (`Border Radius`) = `16`.

2. **Na Image:**
    - Cole uma URL de imagem da internet (ex: imagem de um tênis ou fone de ouvido).
    - Defina `Height` = `160` e `Box Fit` = `Cover`.
    - Adicione `Border Radius` = `12`.

3. **Nos Textos:**
    - Mude o título para **Bold** (Negrito) e tamanho `18`.
    - Na **Row**, mude o alinhamento principal (`Main Axis Alignment`) para **Space Between** para afastar o preço do parcelamento.

4. **No Button:**
    - Mude o texto para `"Comprar Agora"`.
    - Mude a cor do botão para a cor primária do projeto.


## 📚 Referência
- [Introduction to Widgets | FlutterFlow Documentation](https://docs.flutterflow.io/resources/ui/widgets/#layout-elements)
- [Propriedades do widget | Documentação do FlutterFlow](https://docs.flutterflow.io/resources/ui/widgets/properties/)
- [Introdução aos Componentes | Documentação do FlutterFlow](https://docs.flutterflow.io/resources/ui/components/)
- [Creating a Component | FlutterFlow Documentation](https://docs.flutterflow.io/resources/ui/components/creating-components/)