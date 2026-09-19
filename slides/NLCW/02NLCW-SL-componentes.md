<!-- .slide: data-background-image="https://i.ibb.co/sdTzbgWb/watermark-removed-Gemini-Generated-Image-m61yahm61yahm61y.png" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Widgets</h1>
</div>

---

## Componentes e Widgets

No FlutterFlow, a diferença principal é que **Widgets** são os *elementos construtivos básicos* (a matéria-prima), enquanto **Componentes** são *elementos customizados e reutilizáveis criados por você* (blocos de construção).

A analogia com peças de LEGO ilustra bem essa dinâmica:

- **Widgets**: São os blocos de LEGO padrão pré-fabricados (um bloco 2x2 vermelho, uma pecinha transparente).

- **Componentes**: É uma estrutura completa que você constrói juntando vários blocos de LEGO (um carro, uma casa) para usar em diferentes partes sem ter que remontá-la do zero.

---

# Interface
## Build

<img src="https://i.ibb.co/1GWS2VtM/Sem-t-tulo-2026-08-31-1623.png" width="40%" data-preview-image>

--

**Widget Palette**: A *biblioteca de elementos visuais e componentes do projeto*. Serve para adicionar novos elementos ao app. É de onde você arrasta e solta elementos (Botões, Textos, Imagens, Containers) e Componentes para dentro da sua tela.

**Widget Tree**: A *árvore hierárquica de todos os elementos da página* atual. Serve para organizar e selecionar elementos com precisão. Mostra como os widgets estão aninhados (mãe/filho) e permite reordená-los, renomeá-los, ocultá-los ou selecionar widgets difíceis de clicar na tela.

**Storyboard**: O *mapa visual de telas e navegação do seu aplicativo*. Serve para visualizar o fluxo entre as telas. Exibe todas as páginas lado a lado com linhas conectando os botões às telas para onde eles navegam, facilitando a análise da experiência do usuário (UX).

**Test Mode**: A ferramenta de *execução e testes em tempo real*. Serve para rodar e testar o aplicativo diretamente no navegador. Permite interagir com as telas, testar botões, requisições de API, autenticação e alterações de layout com suporte a Hot Reload (atualizações rápidas sem reconstruir tudo).


---

## Widget Palette

No FlutterFlow, os widgets do Widget Palette (a biblioteca de elementos) são organizados em quatro categorias principais:

- Layout Elements
- Base Elements
- Page Elements
- Form Elements

--

### Layout Elements (Elementos de Layout)

São os *widgets de estrutura e organização*. Eles não costumam exibir conteúdo próprio (como texto ou imagem), mas sim definir como os outros elementos serão dispostos, alinhados ou agrupados na tela. **Para que servem**: *Definir a arquitetura visual da página, criar espaçamentos e controlar se os elementos ficam lado a lado, um embaixo do outro ou empilhados*.

Exemplos principais:

- **Column**: Organiza widgets em uma coluna vertical (um embaixo do outro).
- **Row**: Organiza widgets em uma linha horizontal (um ao lado do outro).
- **Container**: Uma caixa personalizável que permite definir bordas, cores de fundo, sombras, tamanho e espaçamento (padding/margin).
- **Stack**: Permite empilhar elementos uns sobre os outros (ex: colocar um texto por cima de uma imagem).
- **Grid / Wrap**: Organiza itens em grades ou quebra linhas automaticamente quando o espaço acaba.

--

### Base Elements (Elementos Base)

São os *blocos fundamentais de conteúdo e informação visual*. São os elementos de UI mais básicos e frequentes em qualquer aplicativo. Para que servem: *Exibir dados estáticos ou dinâmicos, como textos, mídias e botões simples de ação*.

Exemplos principais:

- **Text**: Exibe qualquer tipo de texto na tela (títulos, parágrafos, rótulos).
- **Image**: Exibe imagens (seja via URL da web ou arquivos locais do projeto).
- **Button**: Um botão clicável padronizado para disparar ações.
- **Icon**: Exibe ícones vetoriais da biblioteca (FontAwesome, Material Icons, etc.).
- **Divider**: Uma linha horizontal ou vertical simples usada para separar conteúdos.

--

### Page Elements (Elementos de Página / Listas Estruturadas)

São widgets avançados de navegação e exibição de dados dinâmicos. Diferente dos elementos base, eles lidam com estruturas de dados mais complexas, listas roláveis ou a própria moldura da página. Para que servem: Exibir coleções de dados (como resultados do banco de dados), criar menus de abas ou estruturas de rolagem de tela.

Exemplos principais:

- **ListView**: Cria uma lista rolável (vertical ou horizontal) ideal para exibir dados dinâmicos gerados a partir do banco de dados (ex: feed de posts, lista de produtos).
- **GridView**: Semelhante à ListView, mas organiza os dados dinâmicos em formato de grade/colunas (ex: galeria de fotos).
- **TabBar / TabBarView**: Cria menus com abas no topo da tela para alternar conteúdos sem mudar de página.

--

- **SwipeableStack**: Permite criar cartões estilo "Tinder" que o usuário arrasta para os lados.

--

### Form Elements (Elementos de Formulário)
São *widgets interativos para coleta de dados do usuário*. Tudo o que serve para o usuário digitar, selecionar, ativar ou escolher entra nesta categoria. Para que servem: *Capturar entradas do usuário para enviar ao banco de dados, filtrar listas ou processar cadastros/logins*.

Exemplos principais:

- **TextField**: Campo para digitação de texto, senha, e-mail ou números.
- **DropDown**: Menu suspenso para escolha de uma opção entre várias.
- **Checkbox / Switch**: Botões de ativar/desativar (ligado/desligado) ou seleção múltipla.
- **RadioButton**: Permite ao usuário escolher apenas uma opção dentro de um grupo.
- **DatePicker / TimePicker**: Seletores visuais de data e hora.

---


## Properties Panel

O **Properties Panel** (Painel de Propriedades) do FlutterFlow é a *central de controle situada no lado direito da tela que permite personalizar detalhadamente o widget selecionado no seu projeto*. 

Na parte superior, ele oferece opções para renomear o elemento e navegar entre abas essenciais para *configurar regras de interatividade* (*Actions*), *conexões com banco de dados e APIs* (*Backend Query* e *Generate Dynamic Children*), animações visuais e recursos de acessibilidade e documentação. 

Logo abaixo, através do campo de busca e de *seções estruturadas de estilo e layout*, você ajusta a aparência visual do elemento e gerencia regras cruciais de design, tais como visibilidade condicional ou responsiva (para ocultar/exibir itens em telas específicas ou conforme regras de negócio), espaçamento (*Padding*), alinhamento relativo ao elemento pai, opacidade e temas de cores nativos do sistema.

---

## Widget Tree

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="20%" data-preview-image>

As *duas caixas vermelhas* destacam áreas fundamentais para a navegação e estrutura do seu aplicativo no FlutterFlow.

--

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="10%" data-preview-image>

**Painel Superior: Gerenciador de Páginas e Componentes**
Esta área serve para organizar todos os elementos globais do projeto:

- **pages:** Lista todas as telas/páginas criadas no aplicativo.
- **Flutter / Android / iOS:** essas *pastas servem para organizar e separar os componentes reutilizáveis e as configurações nativas do seu aplicativo*: a pasta Flutter guarda botões, cards e códigos personalizados que funcionam em qualquer tela, enquanto as pastas Android e iOS armazenam os arquivos de configuração específicos de cada sistema (como permissões de câmera, GPS e chaves de integração) para garantir que o app rode sem erros nos celulares.

--

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="10%" data-preview-image>

**Painel Inferior: Widget Tree (Árvore de Widgets)**
Mostra a estrutura visual e hierárquica em tempo real da página selecionada (`HomePage`):

* **Aninhamento Parente-Filho:** Exibe exatamente como os elementos estão organizados internamente.
* **Ações rápidas:** Permite selecionar elementos para editar suas propriedades, arrastar para reordenar ou clicar no ícone `+` ao lado de cada elemento para adicionar novos componentes dentro dele.