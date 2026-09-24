<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">No/Low-Code Workflow Logic</p>

# Componentes e Temas

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">07</p>

---

## Widget (Widget Padrão)

É o bloco básico e nativo de construção do FlutterFlow (ex.: Text, Container, Column, Button, Image). 

Você arrasta o widget Image para carregar a foto do restaurante e um widget Text para escrever o título. É a matéria-prima individual de cada tela.

--

## Component

É um grupo de widgets pré-configurados (no-code) que você salva para reutilizar em várias partes do app.

Em vez de redesenhar essa estrutura na tela principal, na tela de busca e na tela de favoritos, você a transforma em um Componente. Quando alterar o layout desse card (por exemplo, mudando a posição do ícone de estrela), ele é atualizado em todas essas telas de uma só vez.

<img src="https://docs.flutterflow.io/assets/images/custom-components-demo-list-fd33ff85bc0fec2925c8a7ffba8c15d4.png" width="50%" data-preview-image>

--

## Custom Widgets

É um widget criado através de código Dart/Flutter nativo. Serve para quando o FlutterFlow não possui nativamente o elemento visual ou a animação que você precisa na interface no-code.

Ex: O FlutterFlow tem um mapa básico, mas para mostrar a rota desenhada em tempo real com o ícone do motociclista se movendo, você importa uma biblioteca do Flutter/Dart via código nativo no Custom Widget.

--

Criação:

<img src="https://i.ibb.co/fdn1z67p/BAF70413-8742-466-E-8-E1-A-BFE8-D85-E95-C8.png" width="40%" data-preview-image>

Edição:

<img src="https://i.ibb.co/DDbgLpxx/D223-D228-B07-E-4-B94-AFA2-B3-A6178440-D4.png" width="60%" data-preview-image>

---

## Template Widget

São blocos de UI prontos ou pré-desenhados fornecidos pelo FlutterFlow ou salvos por você para iniciar um layout.

Diferencial em relação ao Component: Quando você insere um Template, ele desvincula do original.

---


## Theme Widgets  

São estilos visuais padronizados salvos para um widget padrão. Serve para manter o Design System do seu projeto consistente sem precisar reformatar cor, borda, sombra e fonte toda vez.

Exemplo: Você cria um estilo de "Botão Primário" no seu Theme Editor (com cor azul, bordas arredondadas e sombra específica). Em qualquer tela, você pode aplicar esse "Theme Widget" ao botão. Se no futuro decidir mudar a cor de azul para verde no Theme Widget, todos os botões vinculados ao tema mudarão automaticamente.

--

Criando tema pra botão:

<img src="https://i.ibb.co/ZzBWzKGS/A14-FA8-DA-8-E5-A-4-D03-AC3-A-61-C08-DD375-A0.png" width="50%" data-preview-image>

--

Aplicando o tema a outros botões:

<img src="https://i.ibb.co/chBsFhs4/A63-D8-CC3-D6-B4-4330-86-E8-7-FECED4-ABE3-D.png" width="50%" data-preview-image>

--

Edição do tema:

<img src="https://i.ibb.co/KjJjXpQ7/00-BF7-F42-5566-4-EF0-8-D84-212471-C4-B389.png" width="80%" data-preview-image>
