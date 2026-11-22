import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const b01 = montar({
  id: 'bancos.m01.a01',
  titulo: 'Modelagem: entidades, atributos e relacionamentos',
  objetivo:
    'Transformar um problema do mundo real em um modelo de entidades e relacionamentos (1:1, 1:N, N:N).',
  pre: ['sql.m01.a05'],
  min: 30,
  diag: mc(
    'Em uma loja, "cliente" e "pedido" são exemplos de...',
    'Entidades',
    [
      ['Atributos', 'Atributos são as características de uma entidade, como o nome.'],
      ['Consultas', 'Consultas são perguntas feitas ao banco.'],
    ],
    'Entidades são as "coisas" sobre as quais guardamos dados.',
  ),
  simples: {
    titulo: 'Desenhar antes de construir',
    texto:
      'Antes de criar tabelas, **modelamos** o problema:\n\n- **Entidade:** uma "coisa" do mundo (Cliente, Pedido, Produto). Vira uma **tabela**.\n- **Atributo:** uma característica (nome, valor, data). Vira uma **coluna**.\n- **Relacionamento:** como as entidades se ligam. Existem três tipos:\n  - **1:1** (um para um): pessoa e passaporte.\n  - **1:N** (um para muitos): um cliente faz **vários** pedidos.\n  - **N:N** (muitos para muitos): pedidos e produtos (um pedido tem vários produtos, e um produto está em vários pedidos).\n\nO **diagrama entidade-relacionamento (DER)** desenha isso em caixas e linhas.',
    essencial:
      'Entidade = tabela, atributo = coluna, relacionamento = ligação por chaves. 1:N usa uma chave estrangeira; N:N usa uma tabela de ligação.',
    guiado:
      'Para modelar um sistema:\n1. Liste as entidades (substantivos do problema).\n2. Liste os atributos de cada uma.\n3. Defina a chave primária de cada entidade.\n4. Defina os relacionamentos e suas cardinalidades.\n5. Resolva os N:N com uma tabela associativa.',
    tecnico:
      'Um relacionamento **1:N** é implementado colocando a **chave estrangeira** no lado "N" (pedidos.cliente_id aponta para clientes.id). O **N:N** exige uma **tabela associativa** (por exemplo itens_pedido com pedido_id e produto_id), que transforma o N:N em dois 1:N. A **cardinalidade** tem mínimo e máximo (um pedido tem 1 ou mais itens; um cliente tem 0 ou mais pedidos). O modelo passa por três níveis: **conceitual** (entidades e relações), **lógico** (tabelas e chaves) e **físico** (tipos e índices de um SGBD específico).',
  },
  analogia: {
    titulo: 'Planta antes da obra',
    texto:
      'Modelar é desenhar a planta antes de construir. Corrigir um erro na planta custa um apagador; corrigir depois que as paredes estão de pé custa uma reforma. No banco, mudar o modelo com dados em produção é igualmente caro.',
    limites:
      'Modelos evoluem com o negócio; o importante é começar com uma boa base e mudar com cuidado.',
  },
  demo: {
    titulo: 'Um cliente, vários pedidos (1:N)',
    instrucoes:
      'A chave estrangeira cliente_id em pedidos liga cada pedido ao seu cliente. Rode a consulta e depois troque INNER por LEFT JOIN e veja o cliente sem pedidos aparecer.',
    simulacao: {
      tipo: 'sql',
      consulta:
        'SELECT nome, produto, valor FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id;',
    },
  },
  tecnica: {
    titulo: 'Do modelo às tabelas',
    texto:
      '**Cliente** (id PK, nome, cidade, idade)\n**Pedido** (id PK, cliente_id FK, produto, valor)\nRelacionamento: Cliente 1:N Pedido.\n\nSe quiséssemos vários produtos por pedido, criaríamos **Produto** (id, nome, preço) e **ItemPedido** (pedido_id, produto_id, quantidade): a tabela associativa resolve o N:N.',
  },
  diagrama: {
    titulo: 'Passos da modelagem',
    nos: [
      { forma: 'inicio', texto: 'Entender o problema e o negócio' },
      { forma: 'passo', texto: 'Identificar entidades e atributos' },
      { forma: 'passo', texto: 'Definir chaves e relacionamentos' },
      { forma: 'fim', texto: 'Resolver N:N, revisar e só então criar as tabelas' },
    ],
    descricao: 'Primeiro o raciocínio, depois o SQL.',
  },
  exemplo: {
    titulo: 'Biblioteca',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Livro (id, titulo, ano)\nAutor (id, nome)\nUm autor escreve vários livros: Autor 1:N Livro\nUm livro pode ter vários autores: N:N -> tabela LivroAutor',
    },
    comentarios: [
      { linha: 3, texto: 'A chave estrangeira autor_id fica em Livro.' },
      { linha: 4, texto: 'Com vários autores por livro, nasce a tabela associativa.' },
    ],
  },
  guiado: [
    mc(
      'Um cliente faz vários pedidos, e cada pedido é de um só cliente. Qual é o relacionamento?',
      '1:N (um para muitos)',
      [
        [
          '1:1 (um para um), pois cada cliente tem apenas um pedido',
          'Um cliente faz vários pedidos: o lado do pedido é N.',
        ],
        [
          'N:N (muitos para muitos), pois todos podem se relacionar com todos',
          'Cada pedido pertence a um só cliente: não é N:N.',
        ],
      ],
      'A chave estrangeira fica no lado "muitos".',
    ),
    prever(
      'Quantas linhas devolve o JOIN de clientes com pedidos (sem LEFT)? (só o número)',
      'SELECT nome, produto FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id;',
      ['7'],
      'Cada um dos 7 pedidos casa com seu cliente.',
      [{ resposta: '5', feedback: '5 é o número de clientes; o JOIN gera uma linha por pedido.' }],
    ),
  ],
  indep: [
    mc(
      'Como resolver um relacionamento N:N entre pedidos e produtos?',
      'Com uma tabela associativa (por exemplo, itens_pedido)',
      [
        [
          'Repetindo os produtos em colunas (produto1, produto2...) dentro do pedido',
          'Colunas repetidas limitam a quantidade e violam a normalização.',
        ],
        [
          'Guardando todos os produtos em um único texto separado por vírgulas',
          'Isso impede consultas e viola a 1FN.',
        ],
      ],
      'A tabela associativa tem duas chaves estrangeiras.',
    ),
    completar(
      'Complete: em um relacionamento 1:N, a chave ___ fica no lado "muitos".',
      'const regra = "a chave ___ fica no lado muitos";',
      [
        {
          aceitas: ['estrangeira'],
          feedback: 'A chave estrangeira aponta para a chave primária do lado "um".',
        },
      ],
      'Em pedidos, cliente_id é a chave estrangeira.',
    ),
  ],
  desafio: associar(
    'Associe cada situação à cardinalidade.',
    [
      ['Pessoa e seu passaporte', '1:1'],
      ['Cliente e seus pedidos', '1:N'],
      ['Alunos e disciplinas', 'N:N'],
      ['Departamento e seus funcionários', '1:N'],
    ],
    'Perguntar "quantos de cada lado?" revela a cardinalidade.',
  ),
  rec: [
    ordenar(
      'Ordene as etapas da modelagem de dados.',
      [
        'Entender o problema',
        'Listar entidades e atributos',
        'Definir chaves e relacionamentos',
        'Resolver os N:N e criar as tabelas',
      ],
      'Do conceitual ao físico.',
    ),
    mc(
      'Em um DER, o que normalmente vira uma tabela?',
      'Uma entidade',
      [
        ['Um atributo', 'O atributo vira uma coluna.'],
        ['Uma consulta', 'Consultas não fazem parte do modelo.'],
      ],
      'Entidade vira tabela; atributo vira coluna.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como modelar um sistema de pedidos com clientes, pedidos e produtos.',
    modelo:
      'Cliente, Pedido e Produto são entidades, cada uma com sua chave primária. Cliente 1:N Pedido, com cliente_id como chave estrangeira em pedidos. Pedido e Produto são N:N, então cria-se a tabela associativa itens_pedido, com pedido_id, produto_id e a quantidade.',
    rubrica: [
      'Identificou as entidades e chaves',
      'Explicou o 1:N com chave estrangeira',
      'Resolveu o N:N com tabela associativa',
    ],
  },
  resumo: [
    'Entidade = tabela; atributo = coluna.',
    'Cardinalidades: 1:1, 1:N e N:N.',
    '1:N usa chave estrangeira no lado "muitos".',
    'N:N usa tabela associativa.',
  ],
  cards: [
    ['O que é uma entidade?', 'Uma "coisa" do negócio; vira tabela.'],
    ['Onde fica a FK de um 1:N?', 'No lado "muitos".'],
    ['Como resolver um N:N?', 'Com uma tabela associativa.'],
    ['O que é um DER?', 'Diagrama entidade-relacionamento.'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: o JOIN reconstrói os relacionamentos.',
      'Engenharia de Software: o modelo nasce dos requisitos.',
      'Programação Orientada a Objetos: classes e entidades são parentes.',
    ],
    profissional:
      'Um bom modelo de dados é a decisão técnica mais duradoura de um sistema; erros de modelagem custam anos.',
  },
});
