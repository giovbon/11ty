<!-- .slide: data-background-image="https://i.ibb.co/sdTzbgWb/watermark-removed-Gemini-Generated-Image-m61yahm61yahm61y.png" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Tela de Login</h1>
</div>

---


<img src="https://i.ibb.co/nqMFCTcM/pg-login.png" width="70%" data-preview-image>

--

## Widgets usados

### Stack

O Stack é um widget de layout no FlutterFlow *usado para sobrepor elementos (camadas) uns sobre os outros no eixo Z (profundidade)*.

Enquanto a 
- `Column` empilha coisas verticalmente e a 
- `Row` organiza na horizontal, 
- o `Stack` funciona como uma "pilha de cartas": o primeiro elemento colocado fica ao fundo, e os elementos seguintes são desenhados por cima.

Principais Casos de Uso:
**Texto ou Botão sobre uma Imagem**: imagem de fundo cobrindo o card, com um título em texto ou um botão de "Curtir" no canto superior.

--

<img src="https://i.ibb.co/YBfy7Kpr/pg-login.png" width="80%" data-preview-image>

--

### TabBar

O **TabBar** é o widget do FlutterFlow que *cria navegação por abas na mesma tela* (**Login / Cadastro**).

Ele é dividido em três partes principais:

- **TabBar:** O *elemento completo*, menu do topo com os títulos e a linha indicadora da aba ativa.
- **Tab:** Cada *botão/título individual* ("Login", "Cadastro").
- **TabBar Page:** A *área de conteúdo* que muda e exibe os elementos correspondentes conforme o usuário clica na aba.

Cria automaticamente uma **Column** dentro de cada **TabBar Page** pra *organizar conteúdos verticalmente*.