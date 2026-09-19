<!-- .slide: data-background-image="https://i.ibb.co/sdTzbgWb/watermark-removed-Gemini-Generated-Image-m61yahm61yahm61y.png" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Menu Lateral</h1>
</div>

---

No FlutterFlow, uma **página (page)** representa uma *única tela no seu aplicativo*. As páginas são compostas de vários elementos de interface do usuário ou widgets. Os widgets são adicionados a uma página quando são adicionados à Árvore de Widgets da página.

O **AppBar** no é um componente visual que posiciona uma *barra na parte superior da tela de um aplicativo, funcionando como o cabeçalho fixo da navegação*. Ele é usado para exibir o título da tela atual, botões de ação rápidos (como salvar, buscar ou configurar), botões de voltar para facilitar a navegabilidade e menus, garantindo consistência visual e melhorando a experiência do usuário.

<img src="https://i.ibb.co/7xgcL4bn/appbar.png" width="20%" data-preview-image>

Em `Configurações > Nav Bar & App Bar` é possível definir mais configurações.

--

**Drawer (gaveta)** é um *menu deslizante que pode surgir de qualquer lado da tela*, normalmente usado para navegação no aplicativo ou colocação de opções adicionais. Ele permite que os usuários alternem entre diferentes seções de um aplicativo sem sobrecarregar a interface principal. Você também pode adicionar uma gaveta final à sua página, ou à esquerda (**EndDrawer**).

<img src="https://i.ibb.co/27c8GFkN/drawer.png" width="20%" data-preview-image>

--

**Actions (ações)** são *tarefas ou operações executadas em resposta a um evento detectado por um gatilho*. Os **gatilhos** de ação representam um *evento específico*, enquanto as ações são funções executadas em resposta ao evento desencadeado. Os gatilhos comuns são:

- *Ao tocar*: acionado ao tocar em um widget ou em botões específicos.
- *Seleção*: acionado ao selecionar uma opção em uma lista suspensa.
- *No carregamento da página*: acionado ao carregar uma página

--

<img src="https://i.ibb.co/FkHLKVxs/actions.png" width="40%" data-preview-image>

--

Essa é a interface do FlutterFlow para configurar ações em um *Drawer*.

No FlutterFlow, cada ação precisa de um evento disparador para acontecer. O **On Tap** indica que a ação será executada imediatamente após o usuário dar um toque rápido no elemento.

As três opções da lista **Drawer Action Type** servem para controlar a abertura e o fechamento desse menu:

- **Open Drawer**: Abre o menu lateral principal, é usado no botão "hambúrguer".
- **Open End Drawer**: Abre o menu lateral secundário (alocado no lado direito/final da tela). Útil para menus secundários, filtros de busca ou painéis de configurações rápidas.
- **Close Drawers**: Fecha qualquer menu lateral que esteja aberto no momento.