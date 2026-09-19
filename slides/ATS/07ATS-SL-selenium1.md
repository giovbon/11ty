<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>selenium</h1>
    <img src="https://simpleicons.org/icons/selenium.svg" class="glass-icon imagem-invertida" />
</div>

---

O **Selenium** é um ecossistema de ferramentas voltado para a *automação de navegadores*. Basicamente, ele permite que você escreva um *script* (em Python, Java, JavaScript, etc.) *que "dirige" o navegador como se fosse um ser humano clicando, digitando e navegando pelas páginas*.

---

**Para que ele é usado?**

- **Automação de tarefas repetitivas**: Preencher formulários, extrair dados de sites (web scraping) ou baixar relatórios periodicamente.
- **Testes de Software**: Verificar se o site continua funcionando após uma alteração no código.
    - **Testes de Interface** (UI): Verificar se os elementos aparecem onde deveriam.
    - **Testes de Ponta a Ponta** (E2E - End-to-End): Simular o fluxo completo do usuário. Ex: O usuário entra no site, põe o produto no carrinho, faz o checkout e verifica se o pedido foi gerado.
    - **Testes de Regressão**: Rodar todos os fluxos críticos toda vez que o sistema é atualizado para garantir que nada antigo quebrou.
    - **Testes de Aceitação**: Validar se os requisitos de negócio estão sendo atendidos na prática.

--

**Comparação com PyAutoGUI**: 

- **PyAutoGUI** controla o sistema operacional inteiro de forma "cega", baseado no que está visível na tela
    - Clica em **coordenadas da tela** (ex: clique no pixel X: 500, Y: 300) ou procura por uma imagem específica que você salvou
    -  **Onde funciona:** Em qualquer lugar do seu computador.
    - É muito frágil. Se a janela do programa mudar de lugar, se a resolução do monitor for diferente, ou se aparecer um pop-up na frente, o PyAutoGUI vai clicar no lugar errado e o seu robô vai falhar. Além disso, você não pode usar o computador enquanto o script estiver rodando.

--

- **Selenium** controla exclusivamente navegadores web lendo o código por trás do site
    - Interage diretamente com o código fonte do site (o HTML). Em vez de dizer "clique no meio da tela", você diz ao Selenium: "encontre o botão que tem o ID 'botao-login' no código do site e clique nele"
    - Onde funciona:** Apenas dentro de navegadores web.
    - É extremamente robusto e confiável. Como ele procura pelo elemento no código da página, não importa se você redimensionou a janela do navegador, se a resolução da tela mudou ou se o botão está lá no final da página (ele rola a página sozinho se precisar). Ele pode até rodar em "modo invisível" (*headless*), sem abrir a janela na tela

---

Lembrando da pirâmide de testes:

<div style="text-align: center;">
    <img src="../zSLIDES/img/piram-tests.png" width="60%">
</div>


--

| Tipo de Teste                      | O que são                                                                                   | Quantidade                 | Vantagens                                                 | Desvantagens                                                   |
|------------------------------------|-------------------------------------------------------------------------------------------|----------------------------|-----------------------------------------------------------|--------------------------------------------------------------|
| **Testes de Unidade**              | Testam pequenas partes isoladas (funções ou métodos).                                    | Deve ser a maior parte.    | Extremamente rápidos e baixo custo de manutenção.         | Não aplicável.                                               |
| **Testes de Integração**           | Verificam se diferentes partes do sistema funcionam bem juntas (ex: aplicação e banco). | Em quantidade moderada.    | Garantem que a "cola" entre os módulos não falhe.         | Não aplicável.                                               |
| **Testes de Ponta a Ponta (E2E)**  | Simulam o comportamento do usuário final (ex: abrir o navegador, fazer login).           | O mínimo possível.        | Validam o sistema como um todo.                           | Muito lentos, frágeis (quebram por mudanças visuais) e caros. |

---

## Driver

O *Selenium não sabe "falar" diretamente com o motor do Chrome ou do Firefox*. Cada navegador tem uma *arquitetura interna própria e complexa*.

O ChromeDriver (para Chrome), GeckoDriver (para Firefox) ou msedgedriver (para Edge) funcionam como um *tradutor*.

- Seu Código envia um comando genérico: "Clique no botão de login".
- O Selenium envia isso para o Driver.
- O Driver traduz esse comando para a linguagem específica que o Chrome entende e executa a ação.

Sem o driver compatível com a versão exata do seu navegador, o Selenium é apenas um código enviando comandos para o vazio.

--

<div style="text-align: center;">
	<img src="https://kroki.io/nomnoml/svg/eNp9jrFKxEAQhvt9ioGt1XgcFuEuoKeWNldYHCmG7JhbTHbC3CYePoOglaCNhYhY29jnTXwBfQQ3UbgDT-evZn7-_xttrFDmLbsYDF84pRde-Jxi0Mf9KF1YR6fW-HkMA6XPbFEEc3DQSWlPSx_Wo6iT0hUaY10ew-5eaKow65dhpJTexgw5hi4_1sOoEzR2UWMxFq6d6d5QajalGibtq7E5w2gnSWErgdmoyyZQojMILIZKyMm1L2IzTNX_dl8wmQuXdCi2IYH3-7uPt-s0wDad14Fe0NSXUKGEXijZs6xwm8w-fIIN5WhY4LsfPh9un36If3rrWFpSVnuEoPa5feQV85fTx6bWE-wXDYe2q5v0C7Fapxk=" width="35%" data-preview-image>
</div>

---

O **Selenium** atua como um cliente que implementa a especificação **W3C WebDriver**, um protocolo padrão para automação de navegadores. Esse protocolo permite que ferramentas enviem comandos ao navegador e recebam informações sobre o estado da página, oferecendo uma *interface consistente que viabiliza testes em diferentes navegadores sem necessidade de adaptações no código*.

A **abstração** no WebDriver significa que as *interações são realizadas via comandos em JSON e HTTP*, permitindo que os *testes se concentrem na automação em vez de detalhes de implementação*. O **desacoplamento** possibilita que um mesmo script rode em Chrome, Firefox ou Safari, basta trocar o binário do driver. Essa comunicação por API *facilita a identificação e depuração de erros*, já que as respostas de erro são claras e eliminam a necessidade de investigar cada navegador individualmente.

<div style="text-align: center;">
	<img src="https://www.qafox.com/wp-content/uploads/2021/06/WebDriver-Archtiecture-W3C.jpg" width="35%" data-preview-image>
</div>

---

## Locators

Em automação de testes com Selenium, os **localizadores (locators)** funcionam como *identificadores para elementos da interface*. Para realizar ações como clicar em botões, preencher campos ou ler textos, o Selenium depende desses localizadores para *encontrar os elementos no código HTML da página*. Eles são os parâmetros fornecidos ao Selenium para identificar com precisão os objetos com os quais deve interagir.

O prefixo **`By.`** no Selenium indica *métodos de localização de elementos* e faz parte da classe `By`, que inclui constantes para busca, como `ID`, `NAME` e `CLASS_NAME`. Em comandos como `find_element(By.ID, "usuario")`, ele especifica que a busca será pelo atributo `id` com o valor `"usuario"`, tornando o código mais legível ao indicar claramente a estratégia de localização utilizada.

--

**ID**
- Busca pelo atributo *id único do elemento*. Exemplo: `id="botaoEnviar"`.
- Quando usar: Sempre que possível. É o mais rápido e seguro.
- Exemplo: `find_element(By.ID, "usuario")`

**Name**
- Busca pelo *atributo name*. Exemplo: `name="usuario"`.
- Quando usar: Comum em *formulários e campos de entrada*.
- Exemplo: `find_element(By.NAME, "nome_usuario")`

--

**Class Name**
- Busca pelo *nome da classe CSS*. Exemplo: `class="botao principal"`.
- Quando usar: Útil quando o elemento tem uma classe específica, mas cuidado com nomes repetidos.
- Exemplo: `find_element(By.CLASS_NAME, "botao")`

**Tag Name**
- Busca pelo *nome da tag HTML* (ex: `<h1>`, `<a>`)
- Quando usar: Ótimo para listar vários elementos do mesmo tipo.
- Exemplo: `find_element(By.TAG_NAME, "p")`

--

**Link Text**
- Busca pelo *texto exato de um link* (`<a>`). Exemplo: `Clique aqui`.
- Quando usar: Quando você quer *clicar em um link* sabendo o nome exato dele.
- Exemplo: `find_element(By.LINK_TEXT, "Clique aqui")`

**Partial Link Text**
- Busca por *parte do texto de um link*. Exemplo: `Clique`.
- Quando usar: Útil para links longos ou que mudam dinamicamente.
- Exemplo: `find_element(By.PARTIAL_LINK_TEXT, "Clique")`

--

**CSS Selector**
- Usa *seletores de estilo CSS*. Exemplo: `.classeBotao`.
- Quando usar: Muito rápido e elegante. O favorito de muitos desenvolvedores.
- Exemplo: `find_element(By.CSS_SELECTOR, ".classeBotao")`

**XPath**
- *Navega pela estrutura do XML/HTML*. Exemplo: `//div[@id='container']`.
- Quando usar: O "canivete suíço". Resolve casos complexos onde outros falham.
- Exemplo: `find_element(By.XPATH, "//div[@id='container']")`

---

### Ordem de Preferência

A *ordem de preferência na escolha de locators* visa maximizar a velocidade de execução no motor do navegador e minimizar a fragilidade (flakiness) do teste diante de mudanças estruturais no DOM (Document Object Model).

- **Performance** refere-se a *quão rápido o motor do navegador consegue vasculhar a página para encontrar o elemento* que o seu script solicitou.
- **Resiliência** refere-se à *capacidade do seu teste não quebrar* (não virar um "flaky test") quando a equipe de desenvolvimento fizer atualizações normais e diárias no sistema, como mudar o visual, trocar a posição de um menu ou corrigir textos.
    - Um **flaky test** é um teste automatizado que *apresenta resultados inconsistentes*, passando em algumas execuções e falhando em outras, mesmo *na mesma versão do código e ambiente*. 

--

| Ordem | Locator                     | Performance | Resiliência  |
| :---  | :---                        | :---        | :---         |
| **1º**| `By.ID`                     | Altíssima   | Alta         |
| **2º**| `By.NAME`                   | Alta        | Alta         |
| **3º**| `By.CSS_SELECTOR`           | Alta        | Média/Alta   |
| **4º**| `By.CLASS_NAME`             | Média       | Baixa/Média  |
| **5º**| `By.LINK_TEXT`              | Média       | Baixa        |
| **6º**| `By.PARTIAL_LINK_TEXT`      | Média       | Baixa        |
| **7º**| `By.TAG_NAME`               | Alta        | Baixa        |
| **8º**| `By.XPATH`                  | Baixa       | Baixa/Alta*  |

--

Priorize sempre `ID` e `NAME`. Quando não houver atributos de identificação únicos nativos, utilize `CSS_SELECTOR`. O `XPATH` deve ser tratado como o último recurso técnico.