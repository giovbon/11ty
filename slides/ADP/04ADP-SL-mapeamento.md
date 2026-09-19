<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Lógico Relacional</h1>
</div>

---

## Mapeamento do Modelo Conceitual para o Relacional

Com estes conceitos, podemos abordar a transformação de um modelo conceitual em um esquema relacional funcional.

Algumas regras garantem que o modelo lógico seja consistente, normalizado e reflita a semântica do modelo conceitual.

## Relacionamento 1:1 (Um-para-Um)

> Regra: A Chave Primária (PK) de uma tabela vira Chave Estrangeira (FK) na outra.

Dica de Ouro: Coloque a FK na tabela onde a participação é obrigatória (total) para evitar campos vazios ( NULL ).

Exemplo: Gerente e Departamento
- Tabela DEPARTAMENTO: Cod_Depto (PK), Nome, CPF_Gerente (FK)
- Tabela GERENTE: CPF (PK), Nome

Aqui, CPF_Gerente em Departamento garante que todo departamento tenha um responsável direto sem espalhar dados.

---

## Relacionamento 1:N (Um-para-Muitos)

> Regra: A Chave Primária do lado "1" vai para a tabela do lado "N" como Chave Estrangeira.

Exemplo: Departamento e Funcionário
- Um Departamento tem muitos Funcionários.
- Tabela DEPARTAMENTO: ID_Depto (PK), Nome.
- Tabela FUNCIONARIO: ID_Func (PK), Nome, ID_Depto (FK).

Por que no lado N? Porque cada funcionário só pode apontar para um único departamento.

---

## Relacionamento N:M (Muitos-para-Muitos)

> Regra: Não pode ser mapeado diretamente. Criamos uma Tabela Associativa (Tabela de Junção).

Exemplo: Estudantes e Disciplinas
- Tabela ESTUDANTE: Matricula (PK), Nome.
- Tabela DISCIPLINA: Cod_Disc (PK), Nome.
- Tabela MATRICULA: Matricula (FK), Cod_Disc (FK).

A PK desta tabela é a combinação das duas FKs.

--

## Atributos Multivalorados

> Regra: Atributos que aceitam vários valores (ex: Telefones) geram uma nova tabela.

Exemplo: Telefones de um Funcionário
- Tabela FUNCIONARIO: ID_Func (PK), Nome.
- Tabela TELEFONES_FUNC: ID_Func (FK), Telefone.
- A PK é a composição de (ID_Func + Telefone).

Importante: Isso mantém a Primeira Forma Normal (1FN), garantindo que cada campo tenha apenas um valor atômico.

---

## Relacionamentos N-ários

> Regra: Para relacionamentos envolvendo 3 ou mais entidades, cria-se uma nova relação (tabela).

Exemplo: Fornecedor fornece Peça para um Projeto 
- Tabela FORNECIMENTO:
    - ID_Fornecedor (FK)
    - ID_Peca (FK)
    - ID_Projeto (FK)
    - PK: A junção das três chaves.