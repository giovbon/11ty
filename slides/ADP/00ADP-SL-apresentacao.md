

<!-- .slide: class="slide-cover" -->

<p class="slide-cover__kicker">ADS · Application Data Persistance</p>

# Modelo Teste

<p class="slide-cover__rule"></p>

<p class="slide-cover__sub">Como ler e construir um DER a partir do mini-mundo.</p>

<p class="slide-cover__meta"><span>Aula 03</span><span>Prof. Giovani B.</span></p>

<p class="slide-cover__num">03</p>

---

## Application Data Persistance
> ⚠️ Ver plano de ensino no classroom.

---


## Habilidades

Com base na ementa e no plano de ensino fornecidos, as habilidades a serem adquiridas são:

* **Interpretação e Mapeamento de Modelos:** Interpretar o modelo conceitual (DER) e o esquema lógico normalizado fornecidos, identificando entidades, atributos, domínios, chaves primárias e estrangeiras a serem implementados.
* **Implementação de Estruturas Físicas no Xano:** Criar tabelas e definir colunas com tipos de dados apropriados na plataforma Xano, seguindo fielmente o esquema relacional estabelecido.

--

* **Configuração de Integridade e Relacionamentos:** Estabelecer chaves estrangeiras e configurar restrições de integridade (como *domain*, *unique*, *not null* e *check*) diretamente no ambiente Xano.
* **Otimização de Desempenho:** Construir índices para otimização do tempo de resposta das consultas, considerando as necessidades reais dos requisitos do sistema.

--

* **Desenvolvimento de APIs RESTful:** Criar endpoints CRUD para as entidades principais e implementar consultas avançadas com suporte a filtros, ordenação, paginação e agregações via interface visual do Xano.
* **Segurança e Validação em APIs:** Configurar autenticação e autorização básica nos endpoints, além de aplicar tratamento de erros e validação para dados de entrada.
* **População de Dados de Teste:** Executar a carga inicial da base com conjuntos de dados coerentes com as regras de negócio do projeto.

---

A avaliação da disciplina é composta por uma Média das Avaliações Parciais (MAP), que consiste na média aritmética das notas obtidas em duas Avaliações Parciais (AP1 e AP2) + nota da avaliação final de banca de professores, referente ao projeto desenvolvido.

```
Nota Final = 50% MAP + 50% Avaliação

SE (Nota Final >= 6,0 e Frequência >= 75%)
    ENTAO   
        APROVADO
    SENAO
        REPROVADO
```