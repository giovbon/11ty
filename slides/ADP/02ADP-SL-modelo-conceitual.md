<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Conceitual</h1>
</div>

---

**Modelo de dados**: é a forma de organizar os dados e mostrar como eles se relacionam.

**Modelo de dados conceitual**: é a etapa inicial do projeto do banco de dados; descreve as informações necessárias do mundo real de forma geral, sem depender de um SGBD específico.

**Modelagem conceitual**: funciona como uma planta do banco de dados que ajuda a planejar a estrutura antes de começar a implementação.

**Mini-mundo** (ou universo de discurso): é a parte da realidade que será representada no banco de dados, como uma empresa, escola ou hospital.

---

Definindo o que veremos nessa aula:

**Modelo conceitual**: descreve a estrutura geral do banco de dados, mostrando entidades, relacionamentos e restrições, sem entrar em detalhes técnicos de armazenamento. É independente de SGBD.

**MER (Modelo Entidade-Relacionamento)**: é o modelo conceitual mais usado. Ele representa o mini-mundo por meio de entidades, atributos e relacionamentos.

**DER (Diagrama Entidade-Relacionamento)**: é a representação visual do MER. Ele mostra o esquema conceitual de forma gráfica, usando símbolos padronizados.


<div style="text-align: center;">
    <img src="https://www.bosontreinamentos.com.br/wp-content/uploads/2020/10/mer-projeto-modelagem-dados-boson.jpg" width="30%" data-preview-image>
</div>

---

## Entidades, atributos e relacionamentos

**Entidades** são os *objetos ou conceitos centrais do mundo real representados em um banco de dados*, exemplo: pessoas, lugares ou eventos. A identificação correta das entidades é crucial para o sucesso do projeto, pois elas são os fundamentos da estrutura.

É importante distinguir entre:

- **Tipo de Entidade**: Conjunto de entidades com os mesmos atributos, como `FUNCIONARIO`, que representa o conceito geral de um funcionário.

- **Instância de Entidade**: Um objeto específico dentro do tipo, como Joãozinho da Silva, que é uma instância do tipo `FUNCIONARIO`.

--

As entidades também podem ser classificadas pela sua dependência de identificação:

- **Entidade Forte**: Possui um *atributo-chave único*, como `FUNCIONARIO` com seu `CPF` ou `DEPARTAMENTO` com o `id_departamento`.

- **Entidade Fraca**: Depende de outra entidade para sua identificação, como o DEPENDENTE de um FUNCIONARIO. Uma entidade fraca *não possui chave primária própria*, mas possui uma *Chave Parcial* (ou Discriminador), que diferencia as instâncias daquela entidade fraca para a mesma entidade forte.

--

Após identificar as entidades, o próximo passo é descrever seus dados descritivos, chamados atributos. **Atributos** são as *características que descrevem uma entidade, proporcionando informações específicas sobre cada instância*. Por exemplo, para a entidade `FUNCIONARIO`, atributos como `Nome`, `CPF` e `Salario` são essenciais.

Os atributos podem ser classificados da seguinte forma:
- **Atributo Simples**: Atômico e indivisível, como `Sexo` ou `Salario`.
- **Atributo Composto**: Dividido em componentes menores, como `Endereco` (Rua, Cidade, Estado), que facilita consultas específicas.

--

- **Atributo Monovalorado**: Possui apenas um valor para uma entidade, como `DataNasc`.
- **Atributo Multivalorado**: Pode ter vários valores, como Telefones de um `DEPARTAMENTO`.
- **Atributo Derivado**: Seu valor é calculado a partir de outros, como Idade (baseada em `DataNasc` ), exigindo processamento.
- **Atributo Identificador (ou Atributo Chave)** é crucial, pois identifica unicamente cada instância. No caso da entidade `FUNCIONARIO`, o `CPF` é um atributo-chave, assegurando que não haja duplicidade e mantendo a integridade do banco de dados.

--

Um modelo composto apenas por entidades e atributos é limitado. Para capturar a dinâmica do negócio, precisamos dos relacionamentos, que conectam as entidades e criam um sistema de informação coeso. Os **relacionamentos** representam as i*nterações entre diferentes entidades*, Exemplo: o relacionamento `TRABALHA-PARA` conecta `FUNCIONARIO` com `DEPARTAMENTO`.

Os relacionamentos são definidos por restrições estruturais:
- **Grau do Relacionamento**: Número de entidades participantes; relacionamentos binários (grau dois) são os mais comuns.
- **Cardinalidade**: Define quantas instâncias de uma entidade podem participar do relacionamento. Exemplos incluem:
    - **Um-para-um (1:1)**: Um departamento é gerenciado por um funcionário.
    - **Um-para-muitos (1:N)**: Um departamento pode ter muitos funcionários.
    - **Muitos-para-muitos (N:M)**: Um funcionário pode trabalhar em vários projetos.

--

<div style="text-align: center;">
    <img src="https://i.ibb.co/fV05Q3VR/bd833407-1d1e-4bf2-bdf1-c70315ac2ab0.jpg" width="60%" data-preview-image>
</div>

*Em relacionamentos N:M*, podem haver **Atributos de Relacionamentos**, que fornecem informações adicionais. Por exemplo, no relacionamento `TRABALHA_EM`, pode haver um atributo `Horas`, registrando as horas que um funcionário dedica a um projeto específico.

--

**Participação (Total vs. Parcial)**: indica se a existência de uma entidade depende do relacionamento:
- **Total**: *Todas as instâncias da entidade devem estar associadas ao relacionamento*. Exemplo: Em um relacionamento `TRABALHA-PARA`, cada `FUNCIONARIO` deve estar vinculado a um `DEPARTAMENTO`, não podendo haver funcionários sem departamentos.
- **Parcial**: *A associação é opcional*; a entidade pode existir sem estar ligada ao relacionamento. Exemplo: Em um relacionamento `FEZ_PEDIDO`, um `CLIENTE` pode existir sem ter feito um pedido, permitindo que haja clientes sem pedidos.

---

## Diagrama Entidade-Relacionamento (DER)

A principal vantagem do Modelo Entidade-Relacionamento é sua *representação visual* através do Diagrama Entidade-Relacionamento (DER). Esse diagrama serve como uma linguagem visual clara, *facilitando a comunicação do projeto do banco de dados entre diversos stakeholders, como analistas, desenvolvedores e usuários finais*. Um DER bem elaborado elimina ambiguidades e atua como documento de referência ao longo do desenvolvimento do sistema.

Os componentes do DER são representados por símbolos simples e intuitivos:

- **Entidade Forte**: retângulo com o nome da entidade.
- **Entidade Fraca**: retângulo com linha dupla.
- **Relacionamento**: losango com o nome do relacionamento.
- **Relacionamento Identificador**: Losango com linha dupla, conectando uma entidade fraca à sua entidade forte proprietária.

--

- **Atributo**: Elipse com o nome do atributo.
- **Atributo-Chave**: Elipse com o nome do atributo sublinhado.
- **Atributo Multivalorado**: Elipse com linha dupla (duas bordas concêntricas).
- **Atributo Composto**: Elipse conectada a outras elipses que representam seus componentes.
- **Ligação**: Linha que conecta entidades e atributos aos seus componentes.
- **Participação Total**: Linha dupla ligando a entidade participante ao relacionamento.
- **Atributo Derivado**: Elipse com linha tracejada (ex: Idade).

Esses símbolos garantem uma visualização clara e eficiente das relações e estruturas dentro do banco de dados.

--

<div style="text-align: center;">
    <img src="https://i.ibb.co/TBvfF7ZX/watermarked-img-1364668677188935762.jpg" width="80%" data-preview-image>
</div>

---

Esta aula foca na **Notação de Chen** (elipses e losangos), que é o padrão clássico e acadêmico. No mercado de trabalho, é muito comum ver a **notação Pé de Galinha** (Crow's Foot) utilizada nas ferramentas de modelagem moderna.

[Notação pé de galinha – símbolos de relacionamento e como ler diagramas](https://www.freecodecamp.org/portuguese/news/notacao-pe-de-galinha-erd-simbolos-de-relacionamento-e-como-ler-diagramas/)