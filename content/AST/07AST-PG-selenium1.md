---
title: Selenium 1
presentation: "slides/AST/07ATS-SL-selenium1.md"
order: 5
typst: 
- path: "typs/AST/AST07.typ"
  name: "Exercício AST07"
submission: 
  - "AST07"
codes: "codes/selenium1.md"
---

## Preparar ambiente


*Linux (Ubuntu/Debian)*

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install selenium webdriver-manager pytest
```

*Windows*

```bash
python -m venv .venv
.venv\Scripts\activate
pip install selenium webdriver-manager pytest
```

*Chrome*

```py
# Importa as ferramentas principais para controle e navegação
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Baixa e configura automaticamente o driver correto do Chrome
servico = Service(ChromeDriverManager().install())
# Inicializa o navegador Google Chrome
driver = webdriver.Chrome(service=servico)  

driver.get("https://www.google.com") # Acessa o site especificado
print(f"Sucesso! Título: {driver.title}") # Exibe o título da página acessada no terminal
driver.quit() # Fecha o navegador e encerra a sessão
```

Execute com  `python3 <nome-arquivo>>.py`. 

Deverá ser aberto o navegador e depois fechado e no final impresso: `Sucesso! Título: Google`.

---

## Testando Locators

O script apresentado ensina a abrir e fechar o navegador, mas uma automação eficaz deve simular ações humanas, como clicar em botões, preencher formulários e navegar entre páginas. Para isso, o Selenium utiliza **Locators** para identificar elementos na página, com a busca por ID sendo a mais rápida e recomendada. Em seguida, será criado um "Playground" com uma página HTML local e um script que emprega a classe `ActionChains` para realizar ações interativas de mouse e teclado.

## Interagindo com Web Elements

Encontrar o elemento é só o primeiro passo. Depois de guardar o elemento em uma variável, usamos métodos para interagir com ele como um usuário real.

| Componente | Função Principal | Analogia |
| :--- | :--- | :--- |
| **By** | Localizar elementos. | Apontar para um objeto na página. |
| **Keys** | Teclas de comando. | Apertar botões no teclado. |
| **ActionChains** | Gestos complexos. | Mover, arrastar e soltar. |

Gestos complexos ou teclas especiais: a classe `Keys` no Selenium simula as "teclas especiais" do teclado, excluindo letras, números e símbolos comuns. As principais categorias incluem: **Ação** (como `Keys.ENTER` e `Keys.TAB`), **Edição** (como `Keys.BACKSPACE`), **Modificadoras** (como `Keys.CONTROL` e `Keys.SHIFT`), e **Navegação** (teclas de seta e funcionais).

| Se você ler... | O robô fará... |
| :--- | :--- |
| **`.click()`** | Clique normal (botão esquerdo). |
| **`.double_click()`** | Clique duplo rápido. |
| **`.context_click()`** | Clique com o botão **Direito** (abre menu). |
| **`.send_keys()`** | Digita um texto ou aperta uma tecla especial. |

**Lembrete:** Para o **Duplo** e o **Direito**, você sempre precisa do `.perform()` no final para a ação realmente acontecer.

## Selenium como Teste

O script apresentado é uma boa automação visual, mas não constitui um teste de software verdadeiro, que depende de validações manuais para confirmar resultados. Para profissionalizar a automação, será introduzido o uso do [Pytest](./02-pytest.md) e [Fixtures](./02b-fixtures.md). Com o Pytest, é possível usar o comando **assert** para validar automaticamente se o sistema se comporta conforme o esperado; caso a afirmação falhe, o teste é interrompido automaticamente.

## 📚 Referência
- [The Selenium Browser Automation Project | Selenium](https://www.selenium.dev/documentation/)
- [Cap. 8: Testes – Engenharia de Software Moderna](https://engsoftmoderna.info/cap8.html)