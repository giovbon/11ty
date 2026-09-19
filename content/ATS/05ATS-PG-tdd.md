---
title: TDD
presentation: "slides/ATS/05ATS-SL-TDD.md"
order: 6
typst: 
- path: "typs/ATS/ATS05.typ"
  name: "Exercício ATS05"
submission:
  - "ATS05"
---

# TDD

## Exemplo Validador de Senha

Este exemplo é intuitivo, pois lida com regras de negócio comuns, e permite demonstrar o ciclo Red, Green, Refactor de forma incremental, adicionando complexidade passo a passo. Lei e compreenda ele na sequência, de cima pra baixo, do começo ao fim.

Nosso validador terá as seguintes regras:

1. A senha deve ter no mínimo 8 caracteres.
2. A senha deve conter pelo menos uma letra maiúscula.
3. A senha deve conter pelo menos um dígito numérico.

Vamos usar Python e o framework `pytest` para os testes.

### Regra 1: Mínimo de 8 caracteres

🟥 Escrever um teste que falhe

```python
import pytest
from validador_senha import validar_senha

def test_senha_curta_deve_ser_invalida():
    assert not validar_senha("Senha12")
```

✅ Fazer o teste passar

```python
def validar_senha(senha):
    return len(senha) >= 8
```

♻️ Refatoração

Neste ponto, o código é simples e não há porque refatorar.

### Regra 2: Pelo menos uma letra maiúscula

🟥 Escrever um teste que falhe

```python
import pytest
from validador_senha import validar_senha

def test_senha_curta_deve_ser_invalida():
    assert not validar_senha("Senha12")

def test_senha_sem_maiuscula_deve_ser_invalida():
    assert not validar_senha("senha123") # (1)!
```

1. Sem maiúscula, mas com 8 caracteres

✅ Fazer o teste passar

```python
def validar_senha(senha):
    if len(senha) < 8:
        return False
    
    tem_maiuscula = False
    for char in senha:
        if char.isupper():
            tem_maiuscula = True
            break
    if not tem_maiuscula:
        return False
        
    return True # (1)!
```

1. Se chegou aqui, passou nas regras implementadas

♻️ Refatoração

Podemos refatorar a verificação de maiúscula para ser mais concisa, usando `any()` e uma compreensão de lista, ou uma expressão geradora. Também podemos começar a pensar em como combinar as verificações de forma mais elegante.

```python
def validar_senha(senha):
    if len(senha) < 8:
        return False
    
    if not any(char.isupper() for char in senha): # (1)!
        return False
        
    return True
```

1. O `any()` é uma função nativa do Python que verifica se há pelo menos um item verdadeiro em uma sequência, como uma lista. Se encontrar um `True`, retorna `True`; caso contrário, retorna `False`. Por exemplo, na expressão `any(char.isupper() for char in senha)`, ela avalia cada caractere da variável `senha` para verificar se é uma letra maiúscula. Se a senha for "gato", o resultado é `False`, mas para "Gato", é `True`, pois há uma letra maiúscula. A linha `if not any(char.isupper() for char in senha):` verifica se não existe nenhuma letra maiúscula, retornando `False` se a senha for inválida. Essa abordagem é mais elegante e limpa do que usar loops tradicionais.

### Regra 3: Pelo menos um dígito numérico

🟥 Escrever um teste que falhe

```python
import pytest
from validador_senha import validar_senha

def test_senha_curta_deve_ser_invalida():
    assert not validar_senha("Senha12")

def test_senha_sem_maiuscula_deve_ser_invalida():
    assert not validar_senha("senha123")

def test_senha_sem_numero_deve_ser_invalida():
    assert not validar_senha("SenhaComMaiuscula") # (1)!

def test_senha_valida():
    assert validar_senha("Senha123!") # (2)!
```

1. Sem número, mas com maiúscula e 8 caracteres
2. Deve ser válida

✅ Fazer o teste passar

```python
def validar_senha(senha):
    if len(senha) < 8:
        return False
    
    if not any(char.isupper() for char in senha):
        return False
        
    if not any(char.isdigit() for char in senha):
        return False
        
    return True
```

♻️ Refatoração

Podemos refatorar para que cada regra seja uma função separada, tornando o código mais modular e fácil de estender:

```python
def _validar_comprimento_minimo(senha):
    return len(senha) >= 8

def _validar_maiuscula(senha):
    return any(char.isupper() for char in senha)

def _validar_numero(senha):
    return any(char.isdigit() for char in senha)

def validar_senha(senha):
    regras = [  # (1)!
        _validar_comprimento_minimo,
        _validar_maiuscula,
        _validar_numero
    ]
    
    for regra in regras: # (2)!
        if not regra(senha):
            return False
            
    return True
```

1. A lista chamada regras contém referências a funções de validação.
2. Para cada função, a senha é testada: se a regra retorna `True`, o loop continua; se retorna `False`, a validação é interrompida imediatamente, retornando `False`, o que permite uma verificação eficiente. 

### Benefícios

- Cada regra de validação foi adicionada e testada individualmente, guiando o design da função `validar_senha` de forma incremental.
- Garante que cada regra de negócio tenha um teste correspondente, resultando em alta cobertura.
- A capacidade de refatorar o código (como a extração das regras para funções separadas) com a certeza de que os testes existentes garantirão que nenhuma funcionalidade foi quebrada.
- Os testes atuam como uma especificação executável das regras de negócio.
- O desenvolvimento é feito em pequenos ciclos, reduzindo a complexidade e o risco de introduzir bugs.

## 📚 Referência
- [Cap. 8: Testes – Engenharia de Software Moderna](https://engsoftmoderna.info/cap8.html)