---
title: Modelo Conceitual
presentation: "slides/ADP/02ADP-SL-modelo-conceitual.md"
submission: 
  - "ADP1"
order: 4
---

### EXERCÍCIO

Crie o DER conceitual no desse caso abaixo no [draw.io](https://app.diagrams.net/):

Um hospital deseja modelar seu banco de dados:

1. **Médicos**: Possuem CRM (chave), nome completo e especialidade.
2. **Pacientes**: Possuem CPF (chave), nome, data de nascimento, idade (que deve ser calculada automaticamente), endereço (dividido em rua, número e cidade) e telefones de contato (podendo ter mais de um).
3. **Consultas**: Médicos realizam consultas para pacientes (relacionamento N:M). Cada consulta possui data e horário específicos.
4. **Dependentes**: O hospital permite cadastrar os dependentes dos pacientes. Um dependente possui apenas nome e grau de parentesco. Um dependente não pode existir no sistema sem estar vinculado a um paciente, e o paciente pode ter vários dependentes.

## 📚 Referência
- [Sistemas de Banco de Dados : Elmasri, Ramez, Navathe, Shamkant B.: Amazon.com.br: Livros](https://www.amazon.com.br/Sistemas-Banco-Dados-Ramez-Elmasri/dp/8543025001)
- [Notação pé de galinha – símbolos de relacionamento e como ler diagramas](https://www.freecodecamp.org/portuguese/news/notacao-pe-de-galinha-erd-simbolos-de-relacionamento-e-como-ler-diagramas/)