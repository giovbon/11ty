---
title: Cobertura de Testes
presentation: "slides/AST/03AST-SL-pytest-cobertura.md"
order: 2
typst: 
- path: "typs/AST/AST03.typ"
  name: "Exercício AST03"
submission: 
  - "AST03"
  - "AST03 ADS3-SI3 ADS4-SI4"
---

```py
python -m venv .venv
# linux
source .venv/bin/activate 
# windows
.venv\Scripts\activate

# instalações das bibliotecas
pip install pytest
pip install pytest-cov

# comando que gera relatório de cobertura
pytest -v --cov=funcoes --cov-branch

# abrir html de cobertura no codespaces
python -m http.server 8000 --directory htmlcov
```

## 📚 Referência

- [pytest-cov documentation](https://pytest-cov.readthedocs.io/en/latest/)
- [pytest documentation](https://docs.pytest.org/en/stable/)