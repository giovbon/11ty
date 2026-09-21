---
title: Custom Functions
presentation: "slides/NLCW/06NLCW-SL-custom-code.md"
order: 8
---

## Função `validarCPF`

```dart
  // 0. Tratar caso o valor venha nulo ou vazio
  if (cpf == null || cpf.isEmpty) {
    return false;
  }

  // 1. Remover caracteres não numéricos
  String cpfLimpo = cpf.replaceAll(RegExp(r'[^\d]'), '');

  // 2. Verificar se tem exatamente 11 dígitos
  if (cpfLimpo.length != 11) {
    return false;
  }

  // 3. Verificar se todos os dígitos são iguais (ex: 111.111.111-11)
  if (RegExp(r'^(\d)\1{10}$').hasMatch(cpfLimpo)) {
    return false;
  }

  // 4. Calcular o primeiro dígito verificador
  int sum = 0;
  for (int i = 0; i < 9; i++) {
    sum += int.parse(cpfLimpo[i]) * (10 - i);
  }
  int firstCheckDigit = 11 - (sum % 11);
  if (firstCheckDigit >= 10) {
    firstCheckDigit = 0;
  }

  // 5. Calcular o segundo dígito verificador
  sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += int.parse(cpfLimpo[i]) * (11 - i);
  }
  int secondCheckDigit = 11 - (sum % 11);
  if (secondCheckDigit >= 10) {
    secondCheckDigit = 0;
  }

  // 6. Retorno final de confirmação
  return (int.parse(cpfLimpo[9]) == firstCheckDigit) &&
      (int.parse(cpfLimpo[10]) == secondCheckDigit);
```


## 📚 Referência
- [Custom Functions | FlutterFlow Documentation](https://docs.flutterflow.io/concepts/custom-code/custom-functions/)