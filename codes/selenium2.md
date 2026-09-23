- /
  - README.md
    ```
    Lembrando..
    python -m venv .venv
    .venv\Scripts\activate
    pip install selenium webdriver-manager pytest

    ```
  - .gitignore
    ```
    .venv/
    *cache*/
    ```
  - 01-headless.py
    ```python
    # Inicializa o Chrome em segundo plano com resolução Full HD, acessa o site do Google, exibe o título da página no console, salva uma captura de tela em arquivo e encerra a sessão do navegador
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    
    options = Options()
    
    options.add_argument("--headless=new") # Adiciona a instrução para o navegador rodar em modo invisível (sem interface gráfica). O '=new' diz ao Selenium para usar o motor de renderização mais recente e livre de bugs.]
    options.add_argument("--window-size=1920,1080") # Define uma resolução de monitor de desktop (Largura, Altura)
    
    driver = webdriver.Chrome(options=options) # Inicializa o navegador Chrome. Ao passar 'options=options', ele abre já com o modo invisível ativado.
    
    driver.get("https://www.google.com")
    print(f"Sucesso! Título: {driver.title}")
    driver.save_screenshot("tela-login.png") # Tira uma captura de tela
    driver.quit()
    ```
  - 02-troca-abas.py
    ```python
    # Abre o Google no Chrome em modo invisível, cria mais duas abas navegando para a Wikipédia e o site da Impacta (aguardando o carregamento de cada uma), tira capturas de tela das três páginas e encerra todas as abas
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    
    print("Acessando o Google...")
    driver.get("https://www.google.com")
    driver.save_screenshot("1_print_google.png")
    
    print("Abrindo nova aba para a Wikipédia...")
    driver.execute_script("window.open('https://pt.wikipedia.org');") # O comando JavaScript 'window.open' abre uma URL em uma nova aba
    WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2)) # espera até 10 segundos que o navegador tenha exatamente 2 janelas/abas abertas antes de continuar, se abrir antes ele já muda de aba
    
    driver.switch_to.window(driver.window_handles[1]) # O Selenium lista as abas e nós mandamos ele olhar para a posição 1
    driver.save_screenshot("2_print_wikipedia.png")
    
    print("Abrindo nova aba para o site da Impacta")
    driver.execute_script("window.open('https://www.impacta.edu.br/');")
    WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(3))
    
    driver.switch_to.window(driver.window_handles[2])
    driver.save_screenshot("3_print_python.png")
    
    driver.quit() # Encerra tudo e fecha todas as abas de uma vez
    ```
  - 03-extrair_dados.py
    ```python
    # Abre o Google em modo invisível, digita um termo na barra de pesquisa para extrair e exibir o valor digitado, e em seguida localiza o link do Gmail para extrair e exibir o texto visível e a URL de destino antes de fechar o navegador
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    driver.get("https://www.google.com.br")
    
    print("--- EXTRAINDO DADOS DO GOOGLE ---\n")
    
    barra_pesquisa = driver.find_element(By.NAME, "q") # A barra de pesquisa do Google sempre tem o atributo `name="q"`
    
    barra_pesquisa.send_keys("Como aprender Selenium") # Simular que o usuário digitou algo
    
    texto_digitado = barra_pesquisa.get_attribute("value") # Lendo o atributo 'value' de um input. O que o usuário digita fica guardado dentro desse atributo oculto chamado "value".
    print(f"1. O que está escrito na barra de pesquisa? R: '{texto_digitado}'")
    
    link_gmail = driver.find_element(By.LINK_TEXT, "Gmail") # Procura o link "Gmail" que fica no canto superior direito da página
    
    texto_do_link = link_gmail.text # `.text` pega a palavra que está na tela
    
    destino_do_link = link_gmail.get_attribute("href") # Pega o destino real para onde o link aponta
    
    print(f"2. O texto visível do botão é: '{texto_do_link}'")
    print(f"3. O link oculto por trás dele é: '{destino_do_link}'")
    
    driver.quit()
    ```
  - 04-espera_implicita.py
    ```python
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    
    driver = webdriver.Chrome()
    
    driver.implicitly_wait(10) # Espera 10 segundos toda vez que for procurar um elemento antes de desistir
    
    print("1. Acessando o site...")
    driver.get("https://the-internet.herokuapp.com/dynamic_loading/2")
    
    print("2. Clicando no botão Start...")
    driver.find_element(By.CSS_SELECTOR, "#start button").click()
    
    print("3. Procurando o texto secreto...")
    
    texto_secreto = driver.find_element(By.ID, "finish") # Como o implicit wait está ativado, o Selenium vai segurar o erro  e ficar "sondando" a página sozinho até o elemento aparecer no HTML.
    
    print(f"\nSucesso! O robô teve paciência e capturou o texto:")
    print(f"--> '{texto_secreto.text}'")
    
    driver.quit()
    ```
  - 05-espera_explicita.py
    ```python
    # Abre um site com carregamento dinâmico, clica no botão "Start", usa uma espera implícita (implicitly_wait) para aguardar automaticamente o elemento aparecer na página, extrai e exibe o texto revelado e finaliza o navegador
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    driver = webdriver.Chrome()
    
    print("1. Acessando o site de testes...")
    driver.get("https://the-internet.herokuapp.com/dynamic_loading/2") # Esta página tem um botão que demora 5 segundos para gerar o texto na tela
    
    botao_start = driver.find_element(By.CSS_SELECTOR, "#start button") # Clicamos no botão "Start" para iniciar o carregamento lento
    botao_start.click()
    print("2. Cliquei no botão Start. O site começou a carregar...")
    
    print("3. Aguardando o elemento secreto aparecer (Espera Explícita)...")
    
    elemento_secreto = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "finish"))
    )
    
    print("\nSucesso! O robô teve paciência e capturou o texto:") # O código só chega nesta linha quando o EC retornar "Verdadeiro"
    print(f"--> '{elemento_secreto.text}'")
    
    driver.quit()
    ```
  - 06-caixas_selecao.py
    ```python
    # Acessa uma página web, localiza um menu suspenso (<select>), utiliza a classe Select do Selenium para escolher a "Option 2" diretamente pelo seu texto visível e encerra o navegador
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import Select # Importa a classe Select do módulo de "suporte" do Selenium
    
    driver = webdriver.Chrome()
    
    print("1. Acessando a página de Dropdown...")
    driver.get("https://the-internet.herokuapp.com/dropdown")
    
    elemento_dropdown = driver.find_element(By.ID, "dropdown") # Encontra o elemento `<select>` na página como fazemos normalmente
    
    menu = Select(elemento_dropdown) # Transforma esse elemento em um objeto "Select" do Selenium
    
    print("2. Selecionando a 'Option 2' pelo texto visível...")
    menu.select_by_visible_text("Option 2") # Se quiséssemos selecionar a 'Option 1' pelo atributo de valor no HTML: `menu.select_by_value("1")`. Se quiséssemos selecionar a primeira opção válida pela posição: `menu.select_by_index(1)`
    
    print("Sucesso! O robô escolheu a opção sem precisar 'clicar' para abrir o menu.")
    
    driver.quit()
    ```