<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Perspectiva Histórica</h1>
</div>

---

## Hierarquia do Processamento de Dados

A evolução do armazenamento de dados sempre respondeu a uma necessidade básica: transformar registros brutos em inteligência de negócio. Essa progressão segue uma hierarquia de valor agregado:

- **Dado**: Unidade básica, fato bruto sem contexto (ex.: "30").
- **Informação**: Dado processado e contextualizado que responde a uma dúvida (ex.: "30 graus Celsius").
- **Conhecimento**: Interpretação das informações e identificação de padrões (ex.: "A temperatura média subiu 5°C neste mês").

--

- **Sabedoria**: Aplicação do conhecimento na tomada de decisão estratégica (OLAP, BI).
    - **BI (Business Intelligence)**: O conjunto de processos e ferramentas que transforma dados em relatórios, painéis (*dashboards*) e indicadores visuais para acompanhar o desempenho do negócio.
    - **OLAP (Online Analytical Processing)**: A tecnologia de banco de dados multidimensional por trás do BI que permite analisar dados por múltiplos ângulos (ex.: vendas por região, tempo e produto) de forma rápida e flexível.

---

## Era Pré-Computacional e os Arquivos Tradicionais

Antes dos computadores, a gestão dependia de **processos manuais**: fichas de papel, pastas e arquivos físicos. A dependência geográfica para acesso aos dados gerava um esforço operacional custoso e lento.

Com o surgimento dos **primeiros arquivos digitais**, a estrutura física das pastas apenas foi copiada para o computador. Cada programa mantinha seus próprios arquivos sem qualquer integração.

--

### O Problema do Acoplamento

No início da era computacional, o código do programa e a estrutura de dados eram **indissociáveis** (os dados da aplicação ficavam misturados com a sua implementação). 

Essa arquitetura criava uma barreira técnica: se um programa não conhecesse o formato exato em que o arquivo foi gravado no disco, era incapaz de interpretá-lo, o que impedia o compartilhamento de informações entre sistemas.

--

As principais desvantagens dessa abordagem eram:

- **Redundância de Dados**: Diferentes setores mantinham arquivos separados com informações idênticas. Universidades, por exemplo, duplicavam registros de alunos em sistemas acadêmicos e financeiros, gerando desperdício de espaço.
- **Dependência entre Dados e Aplicações**: Qualquer alteração na estrutura do arquivo exigia alterar e recompilar todo o código do programa, tornando os sistemas frágeis.
- **Inconsistência de Dados**: Como os dados ficavam duplicados, a atualização do endereço de um cliente no setor de Vendas frequentemente não refletia no setor de Cobrança.

---

### A Solução: Independência de Dados

Para resolver esse cenário, criou-se o conceito de **Independência de Dados**, permitindo que os arquivos existam de forma autônoma e sejam compartilhados por múltiplos programas. Ela ocorre em dois níveis:

1. **Independência Física de Dados**: Capacidade de alterar o *onde* e o *como* os dados estão salvos no disco sem afetar a aplicação.
    - *Exemplo:* Trocar os discos do servidor (HDs para SSDs) ou reorganizar o armazenamento sem precisar reescrever o sistema.
2. **Independência Lógica de Dados**: Capacidade de alterar a *estrutura* do banco (adicionar ou modificar colunas) sem quebrar os programas antigos.
    - *Exemplo:* Adicionar o campo "CPF" na tabela de clientes sem afetar o módulo de envio de e-mails que só lê "Nome" e "E-mail".

---

## A Revolução Relacional

O modelo relacional revolucionou a computação ao consolidar a independência de dados: a separação definitiva entre a estrutura lógica das informações e seu armazenamento físico. Com isso, as aplicações passaram a consultar dados pelo seu significado, ignorando detalhes técnicos de baixo nível.

Fundamentado na teoria dos conjuntos, o modelo utiliza quatro conceitos fundamentais:

- **Relação (Tabela)**: Estrutura bidimensional organizada em linhas e colunas.
- **Tupla (Linha)**: Um registro individual ou fato.
- **Atributo (Coluna)**: Uma propriedade ou característica do registro.
- **Domínio**: O intervalo de valores permitidos para um determinado atributo.

---

## SQL: A Linguagem Padrão

A **SQL** (*Structured Query Language*) tornou-se a linguagem padrão dos bancos de dados relacionais. Ela opera dividindo comandos entre a criação de estruturas (**DDL**) e a manipulação de dados (**DML**).

Estrategicamente, sua padronização libertou as empresas da dependência de fornecedores (*vendor lock-in*), garantindo que o código e a lógica da aplicação permaneçam válidos mesmo se a infraestrutura ou o SGBD forem trocados.

SQL é uma linguagem declarativa:

- Linguagens Tradicionais (**Procedurais**): Você diz ao computador COMO fazer algo, passo a passo.

- Linguagem SQL (**Declarativa**): Você apenas diz ao banco O QUE você quer, e o SGBD calcula sozinho o caminho mais rápido para buscar essa informação.

--


<div style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fv2%2Fresize%3Afit%3A1358%2F1*FH6YwbDG4-GDpCgizSWpeg.gif&f=1&nofb=1&ipt=ce94dce3eee3d7240b8c2a440b922573dc8477db2f84d2126dfb699b253b9c1e" width="60%" data-preview-image>
</div>

---

## Projeto de Banco de Dados

Diferente de planilhas simples, o modelo relacional opera com **dados estruturados**, exigindo que o esquema (as regras e tabelas) seja projetado antes da inserção dos registros.

- **Objetivo:** Minimizar a redundância e evitar **anomalias de atualização** (inconsistências na inserção, alteração ou exclusão de registros).
- **Solução:** O processo de **Normalização**, uma técnica formal que decompõe tabelas complexas em estruturas menores, organizadas e inter-relacionadas.

---

### O Papel do SGBD

O **SGBD** (Sistema Gerenciador de Banco de Dados) é o software que coloca tudo isso em prática. Ele atua como o intermediário entre a aplicação e o disco:

- **No Projeto:** Garante a abstração e a independência de dados, traduzindo o modelo lógico para os arquivos físicos no disco e zelando pela integridade.
- **Na Execução:** Funciona como o "motor" que interpreta e executa os comandos SQL enviados pelas aplicações.

*Exemplos de SGBDs:* PostgreSQL, MySQL, Oracle, SQL Server e SQLite.

---

### Transações e as Propriedades ACID

Para garantir que o SGBD mantenha os dados sempre confiáveis, especialmente em operações críticas como transferências bancárias ou e-commerce, o modelo relacional utiliza o conceito de **Transação**. 

Uma transação é um conjunto de operações executadas como uma única unidade de trabalho. Para que uma transação seja considerada segura, o SGBD precisa garantir quatro propriedades fundamentais, conhecidas pela sigla **ACID**:

- **Atomicidade (Tudo ou Nada):** A transação acontece por inteiro ou não acontece. Se ocorrer uma falha (como a internet cair no meio de um PIX), o banco desfaz todas as etapas e o dinheiro retorna, impedindo que os dados fiquem "pela metade".
- **Consistência (Respeito às Regras):** O banco garante que nenhuma regra ou restrição seja violada. Se uma conta não tem saldo ou um campo é obrigatório, a transação é cancelada antes de corromper o sistema.

--

- **Isolamento (Sem Interferências):** Múltiplas transações simultâneas não interferem umas nas outras. Se duas pessoas tentarem comprar o último ingresso no mesmo milissegundo, o SGBD processa uma por vez em fila.
- **Durabilidade (Inviolabilidade):** Uma vez que a transação é confirmada (*commit*), os dados são salvos de forma permanente e não se perdem, mesmo em caso de falha de hardware ou queda abrupta de energia.

<div style="text-align: center;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLzoaPbL8WgbLgNxgO4n5rI48i9TFIXYCa5MK7TVjq3c6-o1EXsRQ_twx&s=10" width="60%" data-preview-image>
</div>

---

## A Evolução NoSQL (Pós-Relacional)

O modelo relacional e os SGBDs continuam sendo a espinha dorsal de sistemas operacionais críticos (como ERPs e bancos), onde a consistência rigorosa e as transações atômicas são indispensáveis.

Porém, com a explosão da internet, as características que tornavam o modelo relacional seguro tornaram-se gargalos para o ecossistema moderno. O modelo relacional encontrou limitações diante dos **Três Vs do Big Data**:

- **Volume:** Dificuldade para lidar com petabytes de dados de forma distribuída.
- **Variedade:** Rigidez para processar dados não estruturados ou semiestruturados (como JSON e documentos).
- **Velocidade:** Lentidão em leituras/escritas massivas em tempo real devido à rigidez do esquema e das junções (*joins*).

--

### O Movimento NoSQL

Para atender a esses requisitos de alta escalabilidade e flexibilidade, surgiram os bancos de dados **NoSQL** (*Not Only SQL*). Eles flexibilizam a consistência estrita em favor do desempenho e da distribuição.

Sua classificação divide-se em quatro categorias principais:

- **Documentos:** armazenam dados em formatos flexíveis como JSON, ex: MongoDB, CouchDB.
- **Chave-Valor:** focados em altíssima velocidade de leitura/escrita, ex: Redis, DynamoDB.
- **Colunar:** otimizados para grandes volumes de dados analíticos, ex: Cassandra, HBase.
- **Grafos:** projetados para mapear relacionamentos complexos, como redes sociais, ex: Neo4j, ArangoDB.

--

<div style="text-align: center;">
    <img src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRvOHxyT3Rg4kmKiRDZEKqjGuui5lXf22Pp0DydXUlJyKu3HKDXKLoQGt4bs1zRzaWrcKB_UDvEomTdA7I" width="60%" data-preview-image>
</div>

---

### A Abstração Low-Code/No-Code

Atualmente, plataformas como o **Xano** representam o nível mais recente de abstração em banco de dados. Elas escondem a complexidade do gerenciamento do banco de dados subjacente, permitindo a criação de esquemas e regras visualmente (de forma semelhante a uma planilha), sem abrir mão dos conceitos fundamentais de estrutura de dados.

<div style="text-align: center;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEa-LrwhTlBxv3A78KZR7lp5NwjHKPUPWGbfDT-Kt7eqdLlvP8gQozDms&s=10" width="50%" data-preview-image>
</div>

--

**Principais Vantagens do Xano:**

- **Backend Completo sem Código (*Backend-as-a-Service*):** Fornece um banco de dados relacional flexível (baseado em PostgreSQL) integrado com um construtor visual de APIs e rotinas de lógica de negócio.
- **Desenvolvimento Ultra-Acelerado:** Reduz drasticamente o tempo de criação de aplicações, eliminando a necessidade de escrever código repetititvo, gerenciar servidores ou configurar conexões manuais.
- **Escalabilidade Automatizada:** Gerencia automaticamente a infraestrutura, o dimensionamento de recursos e a segurança, permitindo que a aplicação cresça sem exigência de um especialista em DevOps dedicado.

--

- **Lógica e Consultas Visuais:** Permite modelar relacionamentos complexos entre tabelas, aplicar regras de validação e construir endpoints de consulta utilizando interfaces drag-and-drop.
- **Independência de *Frontend*:** Como gera APIs REST/GraphQL padrão automaticamente, pode ser conectado a qualquer interface (Bubble, Webflow, FlutterFlow, React, iOS, Android, etc.).

---

## Propriedades Fundamentais de Qualquer Banco de Dados

Apesar da evolução técnica (do papel ao NoSQL e Low-Code), todo banco de dados compartilha quatro pilares:

1. **Representação do "Mini-Mundo":** Reflete um recorte da realidade (ex.: um e-commerce), cujas mudanças do mundo real devem ser espelhadas no banco.
2. **Coleção Lógica:** É um conjunto de dados coerentes e inter-relacionados, com propósito definido.
3. **Abstração de Dados:** Oferece visões conceituais que escondem a complexidade do armazenamento físico.
4. **Gerenciamento por SGBD:** É mantido por um sistema que garante acesso, segurança e integridade das informações.

---

## Resumo

- **Modelo Relacional:** A fundação teórica (tabelas, linhas, colunas e relacionamentos).
- **SQL:** A linguagem declarativa padrão para interagir com a estrutura.
- **SGBD:** O motor de software que processa os comandos SQL, garante a independência física/lógica e assegura a consistência das transações (atomicidade).
- **NoSQL / Low-Code:** Evoluções focadas, respectivamente, em escalabilidade/flexibilidade de dados e agilidade no desenvolvimento.