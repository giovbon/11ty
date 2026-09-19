<!-- .slide: data-background-image="https://i.ibb.co/sdTzbgWb/watermark-removed-Gemini-Generated-Image-m61yahm61yahm61y.png" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Configurações Iniciais no FlutterFlow</h1>
</div>

---

## Painel

Ao fazer login no FlutterFlow, a primeira página que você verá é o Painel. Ele serve como um *hub central para gerenciar seus projetos*, incluindo criar, pesquisar, excluir e duplicar projetos. 

<img src="https://docs.flutterflow.io/assets/images/dashboard-6259117ba315654d5e29a9450fc01022.avif" data-preview-image>

--

- **Projetos**: A seção Projetos *exibe todos os projetos* que você criou no FlutterFlow. Use o menu para renomear, duplicar, excluir, sair do projeto, adicionar tags e abrir o projeto em uma nova aba do navegador.
- **Notifications**: A central de notificações simplifica a forma como você gerencia comentários e convites em todos os projetos. Ele centraliza todas as comunicações do seu projeto. 
- **Search your projects...**: Esta opção permite que você pesquise seus projetos.
- **Filtrar projetos**: filtre projetos por configuração de privacidade: privado, compartilhado por você ou compartilhado com você.
- **+ Tag**: Você pode *criar e adicionar uma tag aos projetos*, fornecendo uma maneira rápida e organizada de classificar e identificar projetos com base em suas características, propósito ou status.

--

- **+ New Project**: para criar um novo projeto, use o botão + Criar novo.
- **My Team**: Na seção Minhas equipes, você pode *compartilhar* código personalizado, ativos, sistemas de design e APIs entre os membros da equipe e entre projetos.
- **Marketplace**: Acesse *componentes e modelos pré-criados* criados por outros usuários para adicionar novas funcionalidades ao aplicativo.
- **Resources**: Aqui encontram-se *tutoriais em vídeo* para aprender conceitos do Flutterflow visualmente.
- **Community**: Redireciona para o Fórum de Comunidade, um lugar para *compartilhar ideias, fazer perguntas e solucionar problemas* com outros criadores do FlutterFlow. 
- **Conta**: Para ver as informações de conta, enviar uma foto de perfil, redefinir sua senha, ver suas referências ou excluir a conta.

---

## Criando projeto

Para criar um novo projeto, vá para o Painel e clique em **+ New Project** no canto superior direito. Isso abre uma janela.

<img src="https://i.ibb.co/5WCbn3M5/2026-08-22-16-12.png" width="80%" data-preview-image>

--

Essa tela é a nova interface de **criação de projetos por Inteligência Artificial** (FlutterFlow AI / Instant Generation). Em vez de você começar um aplicativo do zero montando tela por tela, essa ferramenta *tenta gerar a estrutura inicial, os componentes e o layout do aplicativo automaticamente com base em uma descrição de texto*.

* **Instant Generation (Geração Instantânea):** Você digita no campo de texto o que deseja criar e clica na seta *para que a IA gere as telas básicas*. Os botões de texto abaixo do campo são apenas sugestões de ideias prontas para testar.
* **Explore Styles (Explorar Estilos):** Permite escolher o estilo visual/tema antes de gerar o aplicativo por IA.
* **Create Project from Template (Criar Projeto a partir de Modelo):** Fica no canto superior esquerdo. Se você preferir *ver os templates tradicionais do FlutterFlow em vez de usar a IA*, clique ali. *Se quiser começar o projeto do zero, também click aqui*.

--

<img src="https://i.ibb.co/r97KL35/2026-08-22-16-12.png" width="80%" data-preview-image>

Escreva o nome do projeto e **Start Building**.

---

## Configurações Gerais > App Details

<img src="https://i.ibb.co/nMN8hDNM/2026-08-22-16-12.png" width="60%" data-preview-image>

---

### App Details

- **Project Name**: O nome do seu projeto FlutterFlow. Este é o nome mostrado dentro do FlutterFlow.
- **Project Description**: Notas internas opcionais sobre o projeto. Use isso para descrever o aplicativo, sua finalidade ou qualquer contexto que ajude os colaboradores a entender o projeto.

---

### App Names

- **Package Name** (Nome do Pacote / ID do App) é o **identificador único** do aplicativo no mundo. Os sistemas operacionais (Android/iOS) usam essa *string para saber exatamente qual app está instalado no aparelho*. Usa-se a convenção de domínio invertido (ex: `com.suaempresa.nomeapp`). Sua escolha precisa ser *única* no mundo inteiro. Se outra pessoa já tiver um app com esse mesmo ID na Google Play Store ou App Store, você não conseguirá publicar o seu. Mudar o *Package Name* depois que o app já está nas lojas faz o sistema entender que se trata de um aplicativo totalmente novo, o que impede a atualização da versão antiga para os usuários existentes.


- **Display Name** (Nome de Exibição) é o *nome que aparece na tela inicial do celular do usuário*, logo abaixo do ícone do seu aplicativo. Mantenha esse nome curto (geralmente até 12 caracteres) para evitar que ele fique cortado com reticências (`...`) na tela do celular do usuário. Se você deixar esse campo em branco, o FlutterFlow usará por padrão o *Project Name*.

---

## Initial Page

<img src="https://docs.flutterflow.io/assets/images/initial-page-d9f36f9a9e089c4010558d95d327adfb.avif" width="40%" data-preview-image>

- **Entry Page**: a página de entrada é a primeira página que os usuários veem ao abrir o aplicativo. Quando a autenticação está desativada, *todos os usuários são direcionados para esta página por padrão*. Se a autenticação estiver habilitada, *esta página se tornará a página de login, inscrição ou integração para usuários que não estiverem autenticados*.

- **Logged In Page** (disponível somente se a autenticação estiver habilitada): esta página é exibida quando o aplicativo é iniciado para usuários autenticados. *Se um usuário fizer login com sucesso, ele será redirecionado automaticamente para a página especificada aqui*. Se o usuário já estiver autenticado, esta página ignora a página de entrada.

---

## Download Settings

- **Run "dart fix"**: O dart fix é um comando de limpeza e correção automática do próprio Flutter/Dart. Quando você baixa o código, o FlutterFlow executa um script que *corrige automaticamente avisos de código desatualizado (deprecated code) e ajusta a sintaxe para os padrões mais modernos do Dart*. Deixe ativado se você planeja abrir o código no VS Code ou Android Studio, pois garante um código mais limpo e sem avisos simples.

--

- **Download Unused Project Assets**: Refere-se aos arquivos de mídia (imagens, ícones, vídeos, fontes) que você subiu para o painel de mídias (App Assets), mas que *não estão sendo usados em nenhuma tela*. Deixe desativado para economizar espaço e manter o tamanho da pasta do projeto menor. Só ative se você precisar recuperar algum arquivo de imagem antigo que subiu no FlutterFlow mas deletou do computador.
    - *Ativado*: Baixa todos os arquivos do projeto, incluindo as imagens esquecidas que não estão em nenhuma tela.
    - *Desativado* (Padrão): Baixa apenas os arquivos de mídia que estão sendo realmente utilizados no aplicativo.

---

## Routing & Deep Linking

Essa seção define como as pessoas navegam entre as telas do seu aplicativo e como o app interage com links externos (URLs clicadas no navegador, WhatsApp ou e-mail).

- **Override Default Transition** (Sobrescrever Transição Padrão): Permite *definir uma animação global de transição entre telas para todo o aplicativo* (ex: deslizar para o lado, esmaecer, abrir de baixo para cima).
    - *Desativado*: O app usa a animação nativa padrão do sistema (iOS usa o deslize lateral do iPhone, Android usa o estilo nativo do Android).
    - *Ativado*: Você escolhe uma única animação para ser o padrão de navegação de todas as telas do projeto.

- **Use Firebase Dynamic Links**: O Firebase Dynamic Links era um serviço antigo do Google para links inteligentes. *Não utilize essa opção*. O próprio Google *descontinuou o serviço* Firebase Dynamic Links em 2025. O FlutterFlow mantém o botão por legado.

--

<img src="https://i.ibb.co/Ps85G5Sp/2026-08-22-16-12.png" width="40%" data-preview-image>

- **URL Scheme** (Esquema de URL): É o *endereço exclusivo do seu aplicativo para o recurso de Deep Linking (abrir o app direto por um link clicável)*.
    - O primeiro campo (`learning`) é o Protocolo Personalizado. Se alguém clicar no link `learning://` no celular, o sistema operacional *abre o seu aplicativo* imediatamente.
    - O segundo campo (`learning.com`) é a URL Web associada ao app.
    - Imagine enviar um e-mail de redefinição de senha ou confirmação de compra com o link `learning://sucesso`. Quando o usuário clica no link pelo celular, em vez de abrir o navegador de internet, o celular reconhece a rota e abre o seu aplicativo direto na tela de sucesso.

--

- Advanced Routing Settings:
    - A opção **Pages Are Subroutes of Root Page** (Páginas são sub-rotas da página raiz) altera a forma como as URLs do seu aplicativo são construídas na barra de endereço do navegador quando rodado na Web. *Deixe Desativado, o recomendado para 95% dos casos*. É útil se você estiver criando uma aplicação Web em que faz sentido navegar por níveis (PWA ou Web App com Estrutura Hierárquica).

---

- **Display Settings**: controla *como os textos do seu aplicativo se comportam no celular do usuário em relação ao tamanho da fonte e à seleção de texto*. Os celulares (Android e iOS) possuem uma opção de acessibilidade nas configurações do sistema que permite ao usuário aumentar ou diminuir o tamanho da letra de todo o aparelho.
    - Exemplo de uso: Se você definir o **Max Text Scaling Factor** como 1.2, a fonte do seu app só vai crescer até no máximo 20% acima do padrão.

- **Persist Text Scaling Factor** (Persistir Escala de Texto): Salva a escala de texto para que ela permaneça a mesma durante toda a navegação e sessões do aplicativo, evitando reajustes visuais piscando na tela ao trocar de página. *Mantenha ativado se você configurou os valores nos campos de Min/Max Text Scaling Factor acima*.

--

- **Enable Text Selection** (Habilitar Seleção de Texto): *Permite que o usuário pressione e segure o dedo sobre os textos do app para selecionar, copiar ou destacar as palavras*. Deixe Desativado se: For um app focado em botões, cartões, listas e menus, onde tentar selecionar o texto sem querer ao clicar pode irritar o usuário.

- **Show Component Preview in Palette** (Mostrar Pré-visualização do Componente na Paleta): Apenas desative se o editor do FlutterFlow estiver lento ou travando no navegador, pois carregar as prévias de imagem de dezenas de componentes exige mais memória RAM do computador.

---

### App Assets

<img src="https://i.ibb.co/MySjGWzV/2026-08-22-16-12.png" width="20%" data-preview-image>

A seção App Assets configura as imagens essenciais do aplicativo para o sistema operacional do dispositivo.

--

- **Splash** (Initial Splash Image): É a *tela de carregamento inicial que aparece por alguns segundos assim que o usuário clica para abrir o aplicativo*. Esconde o tempo de inicialização do app exibindo uma logo ou imagem centralizada enquanto o código carrega. Formato ideal: PNG com fundo transparente ou na cor tema do seu app (recomendado 1024x1024 px).

- **Launcher Icon** (App Launcher Icon): É o *ícone do aplicativo quando instalado, na tela inicial do celular* (iOS e versões antigas do Android). Representa a marca do seu aplicativo no menu do dispositivo. Formato ideal: Imagem quadrada perfeita, sem cantos arredondados (o próprio sistema aplica os cantos arredondados), em formato PNG de alta resolução (mínimo 512x512 px).

--

- **Android Adaptive Icon** (Foreground Icon): É o *ícone adaptativo para Androids modernos* (Android 8.0 em diante). Permite que o sistema operacional mude o formato do ícone no Android (quadrado, círculo, gota, etc.) sem cortar o logo do seu app. Formato ideal: O logo da sua marca centralizado com bastante margem transparente em volta, para não ser cortado quando o Android aplicar a máscara de formato.

- **Error Image** (Error placeholder image): É a *imagem reserva de erro para o carregamento de mídias da rede*. Se o aplicativo tentar carregar uma imagem da internet que foi apagada, quebrada ou se a conexão do usuário cair, essa imagem será exibida no lugar para a tela não ficar vazia ou quebrada. Formato ideal: Um ícone neutro de "imagem indisponível" ou uma logo simples da sua empresa.