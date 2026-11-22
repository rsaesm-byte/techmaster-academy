import { associar, completar, mc, montar, prever } from './montar';

export const f20 = montar({
  id: 'fundamentos.m04.a05',
  titulo: 'Bancos de dados e SQL',
  objetivo: 'Entender tabelas, chaves e as consultas básicas SELECT, WHERE, ORDER BY e COUNT.',
  pre: ['fundamentos.m03.a03'],
  min: 30,
  diag: mc(
    'Por que usar um banco de dados em vez de um arquivo de texto?',
    'Para guardar, buscar e proteger muitos dados com rapidez e organização',
    [
      [
        'Porque arquivos de texto não conseguem guardar os dados dos usuários',
        'Arquivos guardam texto; o banco organiza e protege melhor.',
      ],
      [
        'Porque o banco guarda tudo com segurança e dispensa qualquer backup',
        'Banco também precisa de backup.',
      ],
    ],
    'Bancos organizam dados em estruturas, permitem consultas rápidas e controle de acesso.',
  ),
  simples: {
    titulo: 'Planilha com superpoderes',
    texto:
      'Um banco de dados **relacional** guarda dados em **tabelas**, como planilhas: **colunas** são os campos e **linhas** são os registros. Uma **chave primária** identifica cada linha de forma única.\n\nA linguagem para conversar com ele é o **SQL**:\n\n```\nSELECT nome, preco\nFROM produtos\nWHERE preco < 10\nORDER BY preco;\n```\n\nLê-se: "mostre nome e preço dos produtos baratos, do menor para o maior".',
    essencial:
      'Tabelas têm colunas e linhas. SQL: SELECT escolhe colunas; FROM a tabela; WHERE filtra; ORDER BY ordena.',
    guiado:
      'Para montar uma consulta:\n1. O que quero ver? → `SELECT`.\n2. De qual tabela? → `FROM`.\n3. Com qual condição? → `WHERE`.\n4. Em qual ordem? → `ORDER BY`.',
    tecnico:
      'Bancos relacionais (PostgreSQL, MySQL, SQLite) seguem o modelo de tabelas ligadas por chaves estrangeiras e garantem transações ACID (atomicidade, consistência, isolamento e durabilidade). Índices aceleram buscas, como o índice de um livro. Bancos NoSQL (MongoDB, Redis) usam outros modelos, como documentos e chave-valor.',
  },
  analogia: {
    titulo: 'Fichário de biblioteca',
    texto:
      'A tabela é uma gaveta de fichas. Cada ficha (linha) tem os mesmos campos (colunas). O SQL é o pedido ao bibliotecário: "traga as fichas dos livros de 2020, em ordem alfabética". O índice é o catálogo que evita abrir todas as gavetas.',
    limites:
      'O bibliotecário humano pode se confundir; o banco segue regras estritas (transações) para nunca deixar os dados pela metade.',
  },
  demo: {
    titulo: 'SQL e JavaScript lado a lado',
    instrucoes:
      'Execute. O filter faz o papel do WHERE e o sort, do ORDER BY. Mude o limite e a ordenação para ver o efeito.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const produtos = [\n  { nome: "Caneta", preco: 3 },\n  { nome: "Caderno", preco: 12 },\n  { nome: "Lápis", preco: 2 },\n  { nome: "Mochila", preco: 80 },\n];\n// SELECT nome FROM produtos WHERE preco < 10 ORDER BY preco\nconst resultado = produtos\n  .filter((p) => p.preco < 10)\n  .sort((a, b) => a.preco - b.preco)\n  .map((p) => p.nome);\nconsole.log(resultado);\n// SELECT COUNT(*) FROM produtos\nconsole.log(produtos.length);',
    },
  },
  tecnica: {
    titulo: 'Consultas e conceitos',
    texto:
      "**SELECT \\*:** todas as colunas.\n**WHERE preco > 5 AND nome = 'Caneta':** condições com AND/OR.\n**ORDER BY preco DESC:** do maior para o menor.\n**COUNT(\\*), SUM(preco), AVG(preco):** funções agregadas.\n**INSERT / UPDATE / DELETE:** incluir, alterar e apagar.\n**Chave primária:** identifica a linha. **Chave estrangeira:** liga duas tabelas.\n**Cuidado:** UPDATE e DELETE sem WHERE afetam todas as linhas.",
  },
  diagrama: {
    titulo: 'Ordem de uma consulta',
    nos: [
      { forma: 'inicio', texto: 'FROM: escolhe a tabela' },
      { forma: 'passo', texto: 'WHERE: mantém só as linhas que passam na condição' },
      { forma: 'passo', texto: 'SELECT: escolhe as colunas a mostrar' },
      { forma: 'fim', texto: 'ORDER BY: ordena o resultado' },
    ],
    descricao:
      'Logicamente, o banco localiza a tabela, filtra as linhas, escolhe as colunas e ordena.',
  },
  exemplo: {
    titulo: 'Contando e filtrando',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT COUNT(*)\nFROM pedidos\nWHERE total > 100;',
    },
    comentarios: [
      { linha: 1, texto: 'COUNT(*) conta as linhas do resultado.' },
      { linha: 2, texto: 'Vem da tabela de pedidos.' },
      { linha: 3, texto: 'Só entram pedidos acima de 100.' },
    ],
  },
  guiado: [
    mc(
      'Qual cláusula filtra as linhas?',
      'WHERE',
      [
        ['ORDER BY', 'ORDER BY ordena; não filtra.'],
        ['FROM', 'FROM escolhe a tabela.'],
      ],
      'WHERE mantém só as linhas que cumprem a condição.',
    ),
    prever(
      'Uma tabela tem 5 linhas e a consulta é SELECT COUNT(*) FROM tabela. Qual é o resultado? (só o número)',
      'SELECT COUNT(*) FROM tabela;',
      ['5'],
      'COUNT(*) conta todas as linhas.',
      [
        {
          resposta: '1',
          feedback: 'COUNT devolve o total de linhas, não a quantidade de resultados.',
        },
      ],
    ),
  ],
  indep: [
    completar(
      'Complete a consulta que lista o nome dos clientes com mais de 18 anos.',
      'SELECT nome\n___ clientes\n___ idade > 18;',
      [
        { aceitas: ['FROM'], feedback: 'FROM indica a tabela.' },
        { aceitas: ['WHERE'], feedback: 'WHERE filtra as linhas.' },
      ],
      'FROM escolhe a tabela; WHERE aplica o filtro.',
    ),
    mc(
      'O que identifica cada linha de forma única em uma tabela?',
      'A chave primária',
      [
        ['A chave estrangeira', 'Ela liga uma tabela a outra.'],
        ['O índice', 'O índice acelera buscas; quem identifica é a chave primária.'],
      ],
      'Por exemplo, o id do cliente.',
    ),
  ],
  desafio: associar(
    'Associe cada comando à sua função.',
    [
      ['SELECT', 'Escolhe as colunas a mostrar'],
      ['WHERE', 'Filtra as linhas'],
      ['ORDER BY', 'Ordena o resultado'],
      ['COUNT(*)', 'Conta quantas linhas existem'],
    ],
    'Com essas quatro peças já se respondem muitas perguntas sobre os dados.',
  ),
  rec: [
    mc(
      'O que acontece com DELETE FROM clientes; (sem WHERE)?',
      'Todas as linhas da tabela são apagadas',
      [
        [
          'Nada acontece, pois o comando só roda quando tem WHERE',
          'O comando roda e apaga tudo; falta de WHERE é o erro.',
        ],
        [
          'Só a primeira linha da tabela é apagada, como uma proteção',
          'Sem WHERE, todas as linhas são afetadas.',
        ],
      ],
      'Sempre confira o WHERE antes de UPDATE e DELETE.',
    ),
    mc(
      'Para que serve um índice?',
      'Para acelerar buscas',
      [
        ['Para criptografar os dados', 'Ele não protege; ele acelera.'],
        ['Para apagar linhas duplicadas', 'Índices não apagam dados.'],
      ],
      'É como o índice de um livro.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é uma tabela e o que a chave primária faz.',
    modelo:
      'Uma tabela organiza dados em colunas (campos) e linhas (registros). A chave primária é uma coluna cujo valor identifica cada linha de forma única, permitindo localizar e relacionar registros.',
    rubrica: [
      'Descreveu colunas e linhas',
      'Disse que a chave primária identifica a linha',
      'Disse que o valor é único',
    ],
  },
  resumo: [
    'Bancos relacionais guardam dados em tabelas.',
    'SELECT, FROM, WHERE e ORDER BY formam consultas básicas.',
    'Chave primária identifica cada linha.',
    'Cuidado com UPDATE e DELETE sem WHERE.',
  ],
  cards: [
    ['O que é uma chave primária?', 'Coluna que identifica cada linha de forma única.'],
    ['O que faz o WHERE?', 'Filtra as linhas.'],
    ['O que faz o COUNT(*)?', 'Conta as linhas.'],
    ['O que é um índice?', 'Estrutura que acelera buscas.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: filter, sort e map equivalem a WHERE, ORDER BY e SELECT.',
      'Engenharia de Dados: SQL é a ferramenta número um da área.',
      'Segurança: SQL injection é um dos ataques mais antigos e comuns.',
    ],
    profissional:
      'SQL é uma das habilidades mais pedidas em vagas de dados, back-end e análise. Quem domina SELECT e WHERE já resolve boa parte do trabalho.',
  },
});
