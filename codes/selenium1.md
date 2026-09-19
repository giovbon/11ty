- /
  - README.md
    ```md
    execute: `python3 .\interagindo_play.py`
    depois: `pytest`
    ```
  - interagindo_play.py
    ```python
    import time
    from pathlib import Path
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.common.action_chains import ActionChains
    
    print("Iniciando a Aula Prática de Selenium... preparando ambiente\n")
    
    caminho_arquivo = f"file://{Path(__file__).parent.absolute()}/playground.html"
    driver = webdriver.Chrome() # Inicia uma nova instância do Google Chrome controlada pelo Selenium
    driver.get(caminho_arquivo) # Carrega o conteúdo do arquivo HTML
    driver.maximize_window() # Abre a janela do Chrome em tela cheia
    
    acoes_avancadas = ActionChains(driver) # Instanciação de ActionChains
    time.sleep(2)
    
    try:
        print("Executando clique simples...")
        caixa_clique = driver.find_element(By.ID, 'caixa-clique') # Vasculha o código HTML da página procurando por um elemento que tenha o atributo id="caixa-clique"
        caixa_clique.click() # Simula um clique físico do mouse em cima do elemento
        time.sleep(2)
    
        print("Executando duplo clique...")
        caixa_duplo = driver.find_element(By.ID, 'caixa-duplo')
        acoes_avancadas.double_click(caixa_duplo).perform() # Prepara o comando de "clicar duas vezes rapidamente", `perform()` é o gatilho da ação
        time.sleep(2)
    
        print("Executando clique com o botão direito...")
        caixa_direito = driver.find_element(By.ID, 'caixa-direito')
        acoes_avancadas.context_click(caixa_direito).perform()
        time.sleep(2)
    
        print("Limpando texto e digitando com o teclado...")
        area_teclado = driver.find_element(By.ID, 'area-teclado')
        area_teclado.click() # Clica na caixa de texto para focar nela
        
        acoes_avancadas\
            .key_down(Keys.CONTROL).send_keys("a").key_up(Keys.CONTROL)\
            .send_keys(Keys.BACKSPACE)\
            .perform() # Primeira linha "aperta" a tecla Control (Ctrl) e a mantém pressionada, toca na tecla "A" e finalmente solta a tecla. A segunda linha apaga o conteúdo.
        
        time.sleep(1)
        
        area_teclado.send_keys("Automação concluída com sucesso!")
        time.sleep(3)
    
        print("\n✅ Todas as ações foram executadas com sucesso.")
    
    finally:
        print("Encerrando o navegador...")
        driver.quit() # Fecha tudo e mata o processo do driver (diferente do `driver.close()` que fecha apenas a janela/aba que está em foco no momento)
    ```
  - playground.html
    ```html
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Playground Selenium</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .caixa { 
                padding: 15px; margin-bottom: 10px; border: 2px solid #333; 
                width: 300px; text-align: center; cursor: pointer; transition: 0.3s;
            }
            #area-teclado { width: 300px; height: 80px; font-size: 16px; padding: 10px; }
        </style>
    </head>
    <body>
        <h2>Laboratório de Automação</h2>
    
        <div id="caixa-clique" class="caixa" onclick="this.style.backgroundColor='lightgreen'; this.innerText='Clicado!'">
            1. Clique Simples em mim
        </div>
    
        <div id="caixa-duplo" class="caixa" ondblclick="this.style.backgroundColor='salmon'; this.innerText='Duplo Clique Realizado!'">
            2. Dê um Duplo Clique em mim
        </div>
    
        <div id="caixa-direito" class="caixa" oncontextmenu="this.style.backgroundColor='lightblue'; this.innerText='Clique Direito Realizado!'; return false;">
            3. Clique com o Botão Direito em mim
        </div>
    
        <textarea id="area-teclado">Texto inicial.</textarea>
    
    </body>
    </html>
    ```
  - selenium_como_test.py
    ```python
    import pytest
    from pathlib import Path
    from selenium import webdriver
    
    @pytest.fixture
    def navegador():
        # Cuida do ciclo de vida do navegador — abre o Chrome, entrega para o teste rodar (yield) e fecha a janela no final (driver.quit).
        driver = webdriver.Chrome()
        yield driver
        driver.quit()
    
    def test_verificar_titulo_do_playground(navegador):
        # # Executa a validação — descobre o caminho do playground.html, abre o arquivo no Chrome e checa se o título da aba é exatamente "Playground Selenium" (assert).
        pasta_atual = Path(__file__).parent.absolute()
        caminho_html = f"file://{pasta_atual}/playground.html" # O código utiliza um caminho para um arquivo HTML local na mesma pasta que o script de teste, em vez de acessar um site na Internet. O prefixo `file://` indica ao navegador para abrir um arquivo local.
        
        navegador.get(caminho_html)
        
        assert navegador.title == "Playground Selenium"
    ```