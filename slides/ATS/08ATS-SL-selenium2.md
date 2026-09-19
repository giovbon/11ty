<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>selenium</h1>
    <img src="https://simpleicons.org/icons/selenium.svg" class="glass-icon imagem-invertida" />
</div>

---

## Rodando por Headless Mode

Até agora, vimos o navegador abrindo e os cliques acontecendo na tela. Mas e quando rodamos o script em um servidor sem monitor (como no GitHub Actions)?

O modo **Headless** *executa o navegador em segundo plano*. Ele consome menos memória, é mais rápido e não atrapalha o uso do computador.

```py 
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
driver = webdriver.Chrome(options=options)
```

--

O **recurso de print screen** (`driver.save_screenshot("tela-login.png")`) no Selenium funciona como os seus "olhos" quando a automação roda de forma invisível (modo headless), sendo uma ferramenta essencial para registros exatos do que aconteceu na tela sem precisar estar lá assistindo.
- *evidências de falhas* (mostrando exatamente o que travou o robô na madrugada)
- gerar *comprovantes visuais de auditoria* para tarefas concluídas (como pagamentos ou envios de formulários)
- capturar gráficos para relatórios de *monitoramento*
- identificar *bugs visuais* no layout do site

---

## Gerenciamento de abas

O Selenium só controla a aba em que foi iniciado, se uma ação abre outra aba, o navegador a renderiza, mas o Selenium continua focado na primeira e não encontra elementos na nova. 
Ele guarda todas as abas numa lista chamada `driver.window_handles` sendo que:
- `driver.window_handles[0]` é a primeira aba
- `driver.window_handles[1]` a segunda 
- ... 

Para interagir com outra aba é preciso mudar o foco explicitamente com `driver.switch_to.window(driver.window_handles[1])`

--

O Python *executa as instruções muito rápido*. Ao pedir ao navegador que abra uma nova aba, o código já segue adiante, mas *o Chrome leva uma fração de segundo para criar a aba*. 

Se você acessar `driver.window_handles[1]` antes do navegador adicionar a nova aba, a lista ainda terá só `window_handles[0]` e ocorrerá um `IndexError: list index out of range`. 

A solução é usar `WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))` A linha significa: *espere até que o navegador tenha exatamente 2 janelas/abas abertas, por até 10 segundos*; se chegar a 2 dentro do tempo, continua, caso contrário lança `TimeoutException`.


---


## Extraindo Dados

Automações também servem para *capturar informações*. O Selenium permite ler textos visíveis e atributos invisíveis do HTML.

  - **`.text`**: Retorna o *texto* que o usuário enxerga na tela.
  - **`get_attribute("nome")`**: Pega *valores dentro da tag HTML* (como o link de um `href` ou o texto que foi digitado em um `value`).


```python
mensagem = driver.find_element(By.ID, "msg-sucesso")
print("O texto da tela é:", mensagem.text)

link = driver.find_element(By.TAG_NAME, "a")
print("O destino do link é:", link.get_attribute("href"))
```

---


## Sincronização (Waits)

**Regra de Ouro:** A internet tem atrasos; o Selenium não.

A lição central da automação web é *entender e configurar esperas*. O *código é muito mais rápido* que a internet, então sem esperar o *carregamento ou atualizações dinâmicas* (React/Vue/etc.) o Selenium tende a falhar procurando elementos que ainda não existem, causando erros intermitentes (Flaky Tests).

Ex: Se o seu código tentar clicar em um botão antes da página terminar de carregá-lo, o script vai falhar com a mensagem `NoSuchElementException`.

Esperas transformam testes frágeis em *scripts resilientes que funcionam em diferentes condições de rede e máquinas*.

Por que NÃO usar `time.sleep(5)`? Porque ele pausa o código de forma "burra". Se a tela carregar em 1 segundo, você perdeu 4 segundos. Se demorar 6, o teste quebra. Precisamos de esperas inteligentes.

--

### Espera Implícita (`implicitly_wait`)

Configurada **uma única vez** logo após abrir o navegador. Diz ao Selenium: *"Se não achar qualquer elemento, tente de novo por até X segundos antes de desistir"*. Durante esses 10 segundos, o Selenium começa um processo chamado *polling (sondagem)*. Ele checa o código fonte da página repetidamente, geralmente a cada meio segundo (500 milissegundos). No exato milissegundo em que ele encontra o botão (no nosso exemplo, em 1.5s), ele interrompe a espera na hora e o seu código continua rodando. Ele não fica esperando os 8.5 segundos restantes à toa.

```python
driver = webdriver.Chrome()
# Espera até 10 segundos por QUALQUER elemento que demore a aparecer
driver.implicitly_wait(10) 

driver.get("https://site-lento.com")
botao = driver.find_element(By.ID, "botao-tardio") # Vai esperar se precisar
```

--

### Espera Explícita (`WebDriverWait`)

A abordagem mais profissional. Você *define uma condição específica para um elemento específico*.

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Espera até 15 segundos especificamente para este botão ser clicável
botao = WebDriverWait(driver, 15).until(
    EC.element_to_be_clickable((By.ID, "botao-enviar"))
)
botao.click()
```

--

Formalmente, as **Expected Conditions (EC)** são um conjunto de regras de validação nativas do Selenium que atuam como os *critérios de parada para as Esperas Explícitas* (`WebDriverWait`). Em vez de o programador precisar criar manualmente loops complexos e tratamentos de erro para aguardar o carregamento dinâmico de uma página, o módulo EC abstrai essa complexidade avaliando o estado do navegador a cada 500 milissegundos; *assim que a condição exigida se torna verdadeira* (como um botão ficar clicável ou um pop-up desaparecer), *ele interrompe a espera na mesma hora e libera a execução do código*, garantindo que o robô interaja com a tela no momento exato em que ela estiver pronta.

---

## Trabalhando com caixas de seleção

Lidar com caixas de seleção (`<select>`) usando apenas cliques normais dá muita dor de cabeça. O Selenium tem a classe `Select` para resolver isso.

```python
from selenium.webdriver.support.ui import Select

# 1. Encontra o elemento <select>
dropdown_element = driver.find_element(By.ID, "paises")

# 2. Transforma em um objeto Select do Selenium
menu_paises = Select(dropdown_element)

# 3. Escolhe a opção! (A forma mais segura é pelo texto visível)
menu_paises.select_by_visible_text("Brasil")
```