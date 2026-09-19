<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Físico</h1>
</div>


---

O modelo físico de dados é a fase final do projeto de um banco de dados, onde a estrutura lógica, como um diagrama Entidade-Relacionamento (ER), é convertida em uma implementação concreta.

---

## Restrição de Domínio

Controla o **tipo de dado aceito** em cada campo. No Xano, ao criar uma coluna em sua tabela, a primeira coisa que você define é o tipo daquela propriedade. A interface simplifica as opções (`Text`, `Integer`, `Boolean`, etc.). A tipagem dos dados define como e o que pode ser armazenado.

Impõe limites aos valores inseridos
- Datas: mínimo (01/01/1900) e máximo permitido.
- Inteiro (4 bytes): de –2.147.483.648 a 2.147.483.647.
- Texto: limite de caracteres (ex.: 30).
- Números decimais: limite de casas (ex.: 2 após a vírgula).

---

## Tipos de Dados no Xano

### Tipos Clássicos

- `Text`: valores textuais (ex.: nomes, descrições).
- `Integer`: números inteiros (sem casas decimais).
- `Timestamp`: data completa com milissegundos (contados desde 01/01/1970).
- `Date`: data com precisão de dias (sem hora/minuto/segundo).
- `Boolean`: valores lógicos: Verdadeiro/Falso, True/False ou 1/0.
- `Decimal`: números com ponto flutuante (cálculos mais precisos).

--

### Tipos Avançados
- `UUID`: identificador único em hexadecimal (nunca se repete). Ex.: `c75f7c66-e858-47d6-bb82-7ea5547c800c`
- `Object`: conjunto de atributos armazenados juntos (ex.: endereço: rua, número, CEP). Usa formato semiestruturado JSON.
- `Table Reference`: referência entre tabelas (similar a chave estrangeira). Exemplo: em uma tabela Tarefas, o campo usuário_id pode ser um Table Reference que aponta para a tabela Usuários, permitindo saber a quem cada tarefa pertence. Isso facilita consultas (como listar todas as tarefas de um usuário), garante consistência dos dados (só aceita IDs existentes) e funciona como um “atalho” para relacionar informações sem duplicar dados.
- `Enum`: valores limitados a uma lista pré-definida (ex.: verde | azul | preto |... ).

--

- `Email`: texto com validação de e-mail (ex.: xxx@yyy.zzz ).
- `Password`: texto armazenado com mascaramento. Ex: ***
- `JSON`: texto formatado como JSON.
- `Storage`: guarda arquivos (imagem, áudio, vídeo, etc.).
- `Geography`: usado para mapas e dados geográficos. Ex: {"lat": -23.5505, "lng": -46.6333} que guarda a latitude e longitude.

---

## Fator de Nulidade

Define *se um campo aceita ou não valores nulos* (a obrigatoriedade do preenchimento):
- `NULL`: campo pode ficar vazio.
- `NOT NULL`: campo deve sempre ser preenchido.

Em um banco de dados, `NULL` não significa zero nem uma string vazia ( `""` ) nem é igual a `false`. Ele **representa a ausência de valor**.

Se um campo booleano não aceita nulos, ele só pode ter 2 valores: `true` ou `false`. Mas se ele aceita nulos, passa a ter 3 estados possíveis: `true`, `false` ou `NULL` (sem resposta).

---

## Auto Preenchimento

Auto preenchimento (ou auto incremental ou campo identidade (Identity)) refere-se a *campos cujo preenchimento é controlado automaticamente pelo sistema,* como o campo ID, que serve como chave primária nas tabelas.

- O **ID** é um campo que geralmente contém valores inteiros sequenciais. Esses valores começam a partir de um número inicial (chamado de seed ) e aumentam por um valor fixo (chamado de increment ). O padrão mais comum é iniciar em 1 e incrementar em 1 a cada novo registro, resultando em uma sequência como: 1, 2, 3, 4...
- Algumas versões de auto preenchimento utilizam o padrão UUID. O **UUID** (Identificador Único Universal) é um *identificador de 128 bits que gera um valor único e aleatório*, permitindo a criação de chaves primárias em bancos de dados sem a necessidade de um contador sequencial, garantindo a unicidade mesmo em sistemas distribuídos.

--

### No Xano

O campo ID é o padrão para a chave primária nas tabelas. É um campo incremental e numérico, começando em 1 e aumentando de 1 em 1. Também é possível criar campos com o padrão UUID e definir um preenchimento automático para eles.

---

## Restrições

As restrições (constraints) são regras que controlam como os dados devem ser inseridos e garantem a integridade das informações nas tabelas. Elas impõem regras específicas às colunas. Tipos de restrições:

- **Chave Única (Unique - UQ)**: Garante que todos os valores em uma coluna sejam distintos.
- **Valor Padrão (Default - DF)**: Define um valor padrão para uma coluna, caso nenhum valor seja fornecido.
- **Regra de Validação (Check - CK)**: Impõe condições que os dados devem atender ao serem inseridos. Ex: CHECK (Idade > 18)

---

## Chave Primária
A Chave Primária (Primary Key) serve para *identificar de forma única cada linha em uma tabela*. Quando você fornece um valor de chave primária em uma consulta, esse valor deve corresponder a uma e apenas uma linha na tabela. Isso significa que a chave primária garante que cada registro é único.

Regras da Chave Primária:
- **Valores Únicos**: o valor na coluna da chave primária não pode ser repetido, apenas valores únicos são permitidos.
- **Sem Valores NULOS**, portanto `NOT NULL`
- *Um por Tabela*: apenas uma chave primária é permitida por tabela.
--

### No Xano

No Xano, a chave primária é *fixada como a coluna ID*. Não é possível renomear essa coluna ou promover outras colunas a chave primária. Além disso, o Xano não aceita chaves primárias compostas; apenas o ID é definido como chave primária.

Nos casos em que se queira implementar algo pareciso a uma chave primária composta, é recomendado criar um índice único (regra de unicidade) para garantir que um conjunto de dados não se repita. No entanto, esse índice único não é considerado uma chave primária.

---

## Chave Estrangeira (Foreign Key)

A Chave Estrangeira é usada para *criar relacionamentos entre tabelas, garantindo a integridade referencial*.

Regras da Chave Estrangeira:

- **Referência a Chave Primária**: Cada coluna de chave estrangeira deve apontar para uma chave primária de outra tabela (ou da mesma tabela, em um auto-relacionamento). Os tipos de dados devem ser compatíveis.
    - **Valores Nulos**: A chave estrangeira pode permitir valores nulos. A referência da chave estrangeira só é aplicada quando a coluna contém um valor, caso contrário não há necessidade de validação, pois não há valor a ser verificado.
- **Valores Permitidos**: Os valores na coluna de chave estrangeira devem ser os mesmos já utilizados pela chave primária correspondente.
- **Múltiplas Chaves Estrangeiras**: Uma tabela pode ter várias chaves estrangeiras, desde que cada uma siga as regras mencionadas acima.

--

### Integridade Referencial

A integridade referencial garante que os relacionamentos entre dados sejam coesos, ou seja, que sempre haja uma relação com dados reais e existentes. Antes de adicionar dados em uma tabela que possui uma chave estrangeira (que referencia outra tabela), é essencial garantir que o valor referenciado já exista na tabela associada.

### No Xano

No Xano, chaves estrangeiras utilizam-se do campo do tipo `Table Reference`:

Ele primeiro nos solicita a tabela à qual associar aqueles valores. E depois o nome da coluna que será criada, sempre seguindo o padrão `<tabela referenciada>_id`: