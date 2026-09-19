<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Lógico Relacional</h1>
</div>

---

Enquanto o **modelo conceitual** se concentra em capturar e representar os requisitos de negócio de *forma abstrata e independente de tecnologia*, o **modelo relacional** atua como uma ponte, traduzindo essa abstração em uma estrutura lógica, organizada e padronizada. Essa estrutura, composta por tabelas e regras de integridade, está pronta para ser compreendida e implementada pela vasta maioria dos Sistemas Gerenciadores de Banco de Dados (SGBDs) modernos.

Para construir essa ponte de maneira sólida, é essencial *dominar os conceitos fundamentais* que sustentam a arquitetura e a lógica do modelo relacional.

---

## Blocos de construção do Modelo Relacional

Segue conceitos padrões para a organização de dados na maioria dos bancos de dados, que permite que projetistas e desenvolvedores se comuniquem sobre a estrutura dos dados:

- **Relação (Tabela)**: Uma tabela é chamada de relação, representando um *conjunto de fatos sobre uma entidade*, como por exemplo uma tabela de `ESTUDANTES`
- **Tupla (Linha)**: Cada linha em uma relação é uma tupla, representando uma *instância de uma entidade*, por exemplo, os dados do estudante `Joãozinho` na relação `ESTUDANTE`
- **Atributo (Coluna)**: Uma coluna é um atributo, que indica como interpretar os valores em cada tupla, como `Nome`, `Número` e `Classe` na relação `ESTUDANTE`

--

- **Domínio**: O domínio de um atributo define o *conjunto de todos os valores possíveis naquele coluna*. Por exemplo, o domínio do atributo `Classe` poderia ser um número inteiro, enquanto o de `Nome` seria uma cadeia de caracteres.

--

Com essa estrutura, é fundamental *garantir que cada tupla seja identificada de forma única*, o que é alcançado através do uso estratégico de chaves, As **chaves** são essenciais para *garantir a unicidade e integridade dos dados em bancos de dados relacionais*, prevenindo duplicidades e assegurando que os relacionamentos entre tabelas sejam válidos,

- **Superchave**: Uma superchave é um *conjunto de um ou mais atributos que, tomados coletivamente, identificam unicamente uma tupla dentro de uma relação*. Por exemplo, em uma relação `ESTUDANTE`, qualquer conjunto de atributos que inclua um identificador único, como {`CPF`, `Nome`}, é uma superchave.
- **Chave Candidata**: É uma superchave mínima. Ela *identifica um registro de forma única usando o menor número possível de atributos* — se qualquer atributo for removido, a unicidade é perdida. Exemplo: {`CPF`}.
- **Chave Primária** (Primary Key ou PK): é a chave candidata que o projetista do banco de dados escolhe para ser o *principal meio de identificação das tuplas* em uma relação.

--

A escolha é estratégica e, uma vez definida, impõe uma regra fundamental conhecida como **restrição de integridade de entidade**.

Esta restrição determina que o valor da chave primária em qualquer tupla não pode ser `NULL` (nulo). Isso é essencial, pois a chave primária é o mecanismo utilizado para identificar unicamente cada registro, e um valor nulo não serviria a esse propósito.

- **Chave Estrangeira (Foreing Key ou FK)** é um *atributo em uma tabela que referencia a chave primária de outra tabela*, permitindo representar *relacionamentos*, inclusive recursivos.

--

A chave estrangeira impõe uma *restrição de integridade referencial*, que assegura consistência entre tabelas, evitando registros órfãos. Essa regra estipula que o valor da chave estrangeira deve:

- Corresponder a um valor de chave primária existente ou
- Ser NULL, se o relacionamento for opcional e o atributo aceitar valores nulos.

**Integridade referencial** é a regra que garante que os dados ligados entre si continuem consistentes. Ela exige que, quando um atributo de uma entidade aponta para outra entidade, esse valor exista de verdade na tabela/entidade referenciada. Isso evita erros, como um funcionário estar ligado a um departamento que não existe.

---

## Representação

Modelo Conceitual para Modelo Lógico

<img src="https://i.ibb.co/TDzXWyZ5/Diagrama-sem-nome.jpg" width="80%" data-preview-image>