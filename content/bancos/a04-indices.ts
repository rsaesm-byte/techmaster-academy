import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const b04 = montar({
  id: 'bancos.m01.a04',
  titulo: 'Índices e desempenho das consultas',
  objetivo: 'Entender como um índice acelera buscas, quando criá-lo e quais são os custos.',
  pre: ['bancos.m01.a03'],
  min: 30,
  diag: mc(
    'Por que o índice de um livro ajuda?',
    'Porque leva direto à página, sem ler o livro inteiro',
    [
      ['Porque deixa o livro mais leve e fácil de carregar', 'O ganho é de busca, e não de peso.'],
      ['Porque aponta e corrige os erros de impressão das páginas', 'Ele só localiza o conteúdo.'],
    ],
    'Um índice de banco de dados faz o mesmo: evita varrer a tabela inteira.',
  ),
  simples: {
    titulo: 'Achar sem ler tudo',
    texto:
      'Sem índice, para achar um cliente pelo e-mail o banco faz uma **varredura completa**: lê **todas** as linhas. Com milhões de linhas, é lento.\n\nUm **índice** é uma estrutura ordenada (geralmente uma **árvore B**) que aponta para as linhas. A busca passa a ser como a **busca binária**: a cada passo, descarta metade dos candidatos.\n\n- Varredura: até **N** comparações.\n- Índice: cerca de **log₂ N** comparações (para 1 milhão de linhas, só ~20).\n\n**O custo:** o índice ocupa espaço e **deixa as escritas mais lentas** (INSERT, UPDATE e DELETE precisam atualizá-lo). Por isso não se indexa tudo.',
    essencial:
      'Índice = busca rápida (tipo binária) em troca de espaço e escritas mais lentas. Indexe colunas muito usadas em WHERE, JOIN e ORDER BY.',
    guiado:
      'Para decidir:\n1. Ache as consultas lentas (EXPLAIN mostra o plano).\n2. Veja quais colunas aparecem em WHERE, JOIN e ORDER BY.\n3. Crie um índice nelas: `CREATE INDEX idx_email ON clientes(email);`\n4. Meça de novo.\n5. Remova os índices que ninguém usa.',
    tecnico:
      'Chaves primárias e UNIQUE já criam índices automaticamente. O **EXPLAIN** mostra se a consulta usa o índice (index scan) ou varre tudo (seq scan). Um índice **composto** (a, b) serve a buscas por a, ou por a e b, mas não só por b (regra do prefixo mais à esquerda). Funções na coluna (`WHERE LOWER(email) = ...`) podem impedir o uso do índice. Colunas de **baixa seletividade** (como sexo ou status com 2 valores) indexam pouco bem. Em tabelas pequenas, a varredura completa pode ser mais rápida que o índice.',
  },
  analogia: {
    titulo: 'Lista telefônica',
    texto:
      'Procurar "Silva" na lista telefônica ordenada é rápido: você abre no meio, vê se está antes ou depois e repete. Sem a ordem, teria de ler nome por nome. O índice é a ordem mantida por fora, e a manutenção dessa ordem custa a cada nova inscrição.',
    limites: 'Se o dado muda o tempo todo, manter o índice atualizado pesa mais do que ajuda.',
  },
  demo: {
    titulo: 'Varredura contra busca binária',
    instrucoes:
      'Execute e compare o número de comparações. Aumente o tamanho da lista para 1000000 e veja a diferença se multiplicar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const N = 1000;\nconst lista = Array.from({ length: N }, (_, i) => i + 1);\nfunction varredura(alvo) {\n  let comparacoes = 0;\n  for (const x of lista) {\n    comparacoes++;\n    if (x === alvo) break;\n  }\n  return comparacoes;\n}\nfunction binaria(alvo) {\n  let a = 0, b = lista.length - 1, comparacoes = 0;\n  while (a <= b) {\n    comparacoes++;\n    const meio = Math.floor((a + b) / 2);\n    if (lista[meio] === alvo) break;\n    if (lista[meio] < alvo) a = meio + 1;\n    else b = meio - 1;\n  }\n  return comparacoes;\n}\nconsole.log("Sem índice (varredura):", varredura(N), "comparações");\nconsole.log("Com índice (binária):", binaria(N), "comparações");',
    },
  },
  tecnica: {
    titulo: 'Boas práticas',
    texto:
      "**Indexe:** chaves estrangeiras, colunas de filtro frequente e de ordenação.\n**Evite:** muitos índices em tabelas com muita escrita.\n**Meça:** use EXPLAIN antes e depois.\n**Cuidado:** `LIKE '%texto'` (com curinga no início) não usa índice comum.\n**Select só o que precisa:** `SELECT *` lê colunas à toa.",
  },
  diagrama: {
    titulo: 'Com e sem índice',
    nos: [
      { forma: 'inicio', texto: 'Consulta: WHERE email = ...' },
      { forma: 'decisao', texto: 'Existe um índice em email?' },
      { forma: 'passo', texto: 'Sim: desce na árvore e acha a linha em poucos passos' },
      { forma: 'fim', texto: 'Não: lê todas as linhas da tabela (varredura)' },
    ],
    descricao: 'O índice troca leitura de tudo por poucos saltos.',
  },
  exemplo: {
    titulo: 'Criando e conferindo um índice',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);\nEXPLAIN SELECT * FROM pedidos WHERE cliente_id = 3;',
    },
    comentarios: [
      { linha: 1, texto: 'Acelera filtros e JOINs por cliente_id.' },
      { linha: 2, texto: 'O plano deve mostrar o uso do índice.' },
    ],
  },
  guiado: [
    prever(
      'Quantas comparações faz a varredura para achar o 16 em [1..16]?',
      'const lista = Array.from({ length: 16 }, (_, i) => i + 1);\nlet c = 0;\nfor (const x of lista) {\n  c++;\n  if (x === 16) break;\n}\nconsole.log(c);',
      ['16'],
      'O 16 é o último: a varredura passa por todos.',
      [{ resposta: '5', feedback: '5 seria o caso da busca binária.' }],
    ),
    mc(
      'Qual é o principal custo de um índice?',
      'Espaço extra e escritas mais lentas',
      [
        [
          'Deixa as leituras mais lentas, pois há uma estrutura a mais para consultar',
          'Ele existe para acelerar leituras.',
        ],
        ['Apaga os dados antigos para liberar espaço no disco', 'Não altera os dados.'],
      ],
      'Cada INSERT, UPDATE ou DELETE atualiza também o índice.',
    ),
  ],
  indep: [
    prever(
      'Quantas comparações faz a busca binária para achar o 16 em [1..16]?',
      'const lista = Array.from({ length: 16 }, (_, i) => i + 1);\nlet a = 0, b = 15, c = 0;\nwhile (a <= b) {\n  c++;\n  const m = Math.floor((a + b) / 2);\n  if (lista[m] === 16) break;\n  if (lista[m] < 16) a = m + 1;\n  else b = m - 1;\n}\nconsole.log(c);',
      ['5'],
      'A cada passo, metade dos candidatos é descartada: 16 → 8 → 4 → 2 → 1, com 5 comparações.',
      [{ resposta: '16', feedback: '16 é a varredura sequencial.' }],
    ),
    completar(
      'Complete o comando que cria um índice na coluna email.',
      '___ INDEX idx_email ON clientes(email);',
      [{ aceitas: ['CREATE', 'create'], feedback: 'CREATE INDEX cria o índice.' }],
      'Para remover: DROP INDEX.',
    ),
  ],
  desafio: programaJs(
    'Escreva comparacoesBinaria(lista, alvo): faz a busca binária em uma lista ordenada e devolve quantas comparações (voltas do laço) foram necessárias para encontrar o alvo. Se o alvo não existir, devolva o número de voltas até terminar.',
    'function comparacoesBinaria(lista, alvo) {\n  // seu código aqui\n}',
    'function comparacoesBinaria(lista, alvo) {\n  let a = 0;\n  let b = lista.length - 1;\n  let voltas = 0;\n  while (a <= b) {\n    voltas++;\n    const meio = Math.floor((a + b) / 2);\n    if (lista[meio] === alvo) break;\n    if (lista[meio] < alvo) a = meio + 1;\n    else b = meio - 1;\n  }\n  return voltas;\n}',
    'comparacoesBinaria',
    [
      { argumentos: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 16], esperado: 5 },
      { argumentos: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 8], esperado: 1 },
      { argumentos: [[2, 4, 6, 8, 10, 12, 14], 14], esperado: 3 },
      { argumentos: [[2, 4, 6, 8, 10, 12, 14], 8], esperado: 1 },
    ],
    [
      'Mantenha dois limites, a e b, e olhe sempre o meio.',
      'Conte uma volta a cada comparação com o meio.',
    ],
    'A cada volta, metade da lista é descartada: por isso o custo é logarítmico.',
  ),
  rec: [
    associar(
      'Associe o termo ao seu significado.',
      [
        ['Varredura completa', 'Lê todas as linhas da tabela'],
        ['Índice', 'Estrutura ordenada que acelera a busca'],
        ['EXPLAIN', 'Mostra o plano de execução da consulta'],
        ['Árvore B', 'Estrutura comum usada em índices'],
      ],
      'Vocabulário de desempenho em bancos de dados.',
    ),
    mc(
      'Em qual situação criar um índice é MENOS vantajoso?',
      'Em uma tabela com muitas escritas e quase nenhuma busca',
      [
        ['Em uma coluna que aparece em muitos filtros WHERE', 'É um caso clássico de bom índice.'],
        [
          'Em uma chave estrangeira usada com frequência em JOINs',
          'Também costuma valer a pena indexar.',
        ],
      ],
      'O índice custa nas escritas.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como um índice acelera consultas e qual é o seu custo.',
    modelo:
      'O índice é uma estrutura ordenada (como uma árvore B) que permite achar as linhas com poucas comparações, como uma busca binária, em vez de varrer a tabela inteira. O custo é o espaço extra e a lentidão nas escritas, pois cada INSERT, UPDATE ou DELETE precisa atualizar o índice.',
    rubrica: [
      'Explicou o ganho na leitura',
      'Comparou com a varredura completa',
      'Citou o custo (espaço e escritas)',
    ],
  },
  resumo: [
    'Índice evita varrer toda a tabela.',
    'Busca binária: custo logarítmico.',
    'Custo: espaço e escritas mais lentas.',
    'Meça com EXPLAIN antes e depois.',
  ],
  cards: [
    ['O que é um índice?', 'Estrutura ordenada que acelera buscas.'],
    ['Que estrutura é comum em índices?', 'Árvore B.'],
    ['Como ver o plano da consulta?', 'EXPLAIN.'],
    ['Qual o custo do índice?', 'Espaço e escritas mais lentas.'],
  ],
  conexoes: {
    disciplinas: [
      'Algoritmos: busca binária e complexidade logarítmica.',
      'Fundamentos: cache e armazenamento ajudam o desempenho.',
      'Engenharia de Dados: particionamento e índices em grandes volumes.',
    ],
    profissional:
      'Um único índice bem escolhido já transformou consultas de minutos em milissegundos em muitos sistemas.',
  },
});
