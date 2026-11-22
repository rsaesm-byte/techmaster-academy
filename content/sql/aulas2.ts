import {
  associar,
  completar,
  consultaSql,
  mc,
  montar,
  ordenar,
  prever,
} from '../fundamentos/montar';
import { conexoesBase } from './aulas';

export const s06 = montar({
  id: 'sql.m02.a01',
  titulo: 'Refinando consultas: DISTINCT, IN, NULL e apelidos',
  objetivo:
    'Remover repetições com DISTINCT, filtrar por lista com IN, tratar valores vazios com IS NULL e renomear colunas com AS.',
  pre: ['sql.m01.a05'],
  min: 25,
  diag: mc(
    'Como eliminar linhas repetidas de um resultado?',
    'Com DISTINCT',
    [
      ['Com LIMIT 1', 'LIMIT só corta a quantidade.'],
      ['Com ORDER BY', 'Ordenar não remove repetições.'],
    ],
    'SELECT DISTINCT devolve cada combinação uma única vez.',
  ),
  simples: {
    titulo: 'Ajustes finos',
    texto:
      "- **DISTINCT:** `SELECT DISTINCT cidade FROM clientes` mostra cada cidade uma vez.\n- **IN:** `WHERE cidade IN ('Campinas', 'São Paulo')` equivale a vários OR.\n- **NULL:** valor vazio/desconhecido. Compara-se com `IS NULL` ou `IS NOT NULL`, nunca com `= NULL`.\n- **AS:** dá apelido à coluna: `SELECT COUNT(*) AS total FROM pedidos`.",
    essencial:
      'DISTINCT tira repetidos. IN filtra por lista. IS NULL testa vazio. AS renomeia a coluna do resultado.',
    guiado:
      'Para listar categorias:\n1. `SELECT DISTINCT coluna`.\n2. `FROM tabela`.\n3. Combine com ORDER BY para ficar organizado.',
    tecnico:
      'NULL significa "desconhecido": qualquer comparação com NULL (`= NULL`, `> 3`) não é verdadeira nem falsa, e a linha é descartada; por isso existe IS NULL. Funções como COUNT(coluna), SUM e AVG ignoram NULL, mas COUNT(*) conta todas as linhas. O apelido AS só vale para exibir (em alguns bancos pode ser usado no ORDER BY).',
  },
  analogia: {
    titulo: 'Lista de convidados',
    texto:
      'DISTINCT é riscar nomes repetidos da lista. IN é conferir "o nome está nesta lista curta?". NULL é uma linha em branco na ficha: "não sei". AS é trocar a etiqueta da coluna para algo mais legível.',
    limites: 'Uma linha em branco não é igual a zero nem a texto vazio: é ausência de informação.',
  },
  demo: {
    titulo: 'Experimente',
    instrucoes: 'Execute e depois troque a coluna do DISTINCT, edite a lista do IN e dê apelidos.',
    simulacao: {
      tipo: 'sql',
      consulta: "SELECT DISTINCT cidade FROM clientes WHERE cidade IN ('Campinas', 'Sorocaba');",
    },
  },
  tecnica: {
    titulo: 'Detalhes',
    texto:
      '**DISTINCT** vale para a combinação de todas as colunas do SELECT.\n**NOT IN** e **IS NOT NULL** fazem o oposto.\n**COUNT(coluna)** ignora NULL; **COUNT(*)** não.\n**Apelido:** `SUM(valor) AS total`.',
  },
  diagrama: {
    titulo: 'Passos do DISTINCT',
    nos: [
      { forma: 'inicio', texto: 'Linhas filtradas pelo WHERE' },
      { forma: 'passo', texto: 'SELECT escolhe as colunas' },
      { forma: 'passo', texto: 'DISTINCT descarta linhas iguais' },
      { forma: 'fim', texto: 'ORDER BY e LIMIT finalizam' },
    ],
    descricao: 'Depois de escolher as colunas, o DISTINCT elimina as linhas repetidas.',
  },
  exemplo: {
    titulo: 'Quantos produtos diferentes',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT DISTINCT produto\nFROM pedidos\nORDER BY produto;',
    },
    comentarios: [
      { linha: 1, texto: 'Cada produto aparece uma vez.' },
      { linha: 3, texto: 'Resultado: Caderno, Caneta e Mochila.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas devolve SELECT DISTINCT cidade FROM clientes? (só o número)',
      'SELECT DISTINCT cidade FROM clientes;',
      ['3'],
      'Há três cidades diferentes: Sorocaba, Campinas e São Paulo.',
      [{ resposta: '5', feedback: '5 seria sem o DISTINCT: uma linha por cliente.' }],
    ),
    prever(
      "Quantas linhas devolve WHERE cidade IN ('Campinas', 'São Paulo')? (só o número)",
      "SELECT * FROM clientes WHERE cidade IN ('Campinas', 'São Paulo');",
      ['3'],
      'Bruno e Elisa (Campinas) e Diego (São Paulo).',
      [{ resposta: '2', feedback: 'Some também o cliente de São Paulo.' }],
    ),
  ],
  indep: [
    prever(
      'Qual é o resultado de SELECT COUNT(*) AS total FROM pedidos? (só o número)',
      'SELECT COUNT(*) AS total FROM pedidos;',
      ['7'],
      'COUNT(*) conta as 7 linhas; AS só renomeia a coluna para "total".',
      [
        {
          resposta: '1',
          feedback: 'O resultado é UMA linha, mas o valor dentro dela é a contagem.',
        },
      ],
    ),
    consultaSql(
      'Escreva uma consulta que mostre o nome dos clientes de Campinas ou de São Paulo, usando IN.',
      'SELECT nome FROM clientes;',
      "SELECT nome FROM clientes WHERE cidade IN ('Campinas', 'São Paulo');",
      ['Use WHERE cidade IN (...) com os dois textos entre aspas simples.'],
      'IN substitui vários OR sobre a mesma coluna.',
    ),
  ],
  desafio: consultaSql(
    'Escreva uma consulta que mostre cada cidade uma única vez.',
    'SELECT cidade FROM clientes;',
    'SELECT DISTINCT cidade FROM clientes;',
    ['DISTINCT vem logo depois de SELECT.'],
    'DISTINCT remove as linhas repetidas do resultado.',
  ),
  rec: [
    mc(
      'Como testar se uma coluna está vazia (NULL)?',
      'Com IS NULL',
      [
        ['Com = NULL', 'Comparar com = NULL nunca é verdadeiro.'],
        ['Com = 0', 'Zero é um valor; NULL é ausência de valor.'],
      ],
      'IS NULL e IS NOT NULL são os testes corretos.',
    ),
    mc(
      'Qual a diferença entre COUNT(*) e COUNT(coluna)?',
      'COUNT(coluna) ignora os valores NULL',
      [
        [
          'Nenhuma, pois os dois contam todas as linhas',
          'Há diferença: um conta linhas, o outro conta valores.',
        ],
        [
          'O COUNT(*) ignora os NULL e o COUNT(coluna) conta todas as linhas',
          'É o contrário: COUNT(*) conta linhas, COUNT(coluna) ignora NULL.',
        ],
      ],
      'COUNT(*) conta linhas; COUNT(coluna) conta valores preenchidos.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique por que NULL é tratado de forma especial no SQL.',
    modelo:
      'NULL representa ausência ou desconhecimento de valor, então não é igual a nada, nem a outro NULL. Por isso comparações comuns não funcionam e se usa IS NULL ou IS NOT NULL.',
    rubrica: [
      'Definiu NULL como ausência de valor',
      'Disse que comparações com = não funcionam',
      'Citou IS NULL',
    ],
  },
  resumo: [
    'DISTINCT remove repetições.',
    'IN filtra por uma lista de valores.',
    'IS NULL testa valores vazios.',
    'AS renomeia colunas do resultado.',
  ],
  cards: [
    ['O que faz DISTINCT?', 'Remove linhas repetidas.'],
    ['O que faz IN?', 'Filtra por uma lista de valores.'],
    ['Como testar vazio?', 'IS NULL.'],
    ['Para que serve AS?', 'Dar apelido a uma coluna.'],
  ],
  conexoes: conexoesBase(
    ['JavaScript: DISTINCT lembra new Set(lista).', 'Python: drop_duplicates do pandas.'],
    'Tratar NULL corretamente evita relatórios com números errados.',
  ),
});

export const s07 = montar({
  id: 'sql.m02.a02',
  titulo: 'HAVING: filtrando grupos',
  objetivo: 'Filtrar grupos depois da agregação com HAVING e entender a diferença para o WHERE.',
  pre: ['sql.m02.a01'],
  min: 25,
  diag: mc(
    'O WHERE consegue filtrar usando COUNT(*)?',
    'Não, porque o WHERE age antes de agrupar',
    [
      [
        'Sim, sempre, pois todo cliente aparece em um JOIN',
        'O JOIN simples só mostra quem tem correspondência.',
      ],
      ['Sim, mas somente junto com o ORDER BY', 'O WHERE não enxerga agregações.'],
    ],
    'Para filtrar por resultado de agregação existe o HAVING.',
  ),
  simples: {
    titulo: 'Filtrar linhas × filtrar grupos',
    texto:
      '- **WHERE** filtra **linhas**, antes de agrupar.\n- **HAVING** filtra **grupos**, depois de agrupar, e pode usar COUNT, SUM, AVG...\n\n```\nSELECT produto, COUNT(*)\nFROM pedidos\nGROUP BY produto\nHAVING COUNT(*) > 2;\n```\n\nIsso traz só os produtos com mais de 2 pedidos.',
    essencial: 'WHERE filtra linhas antes; HAVING filtra grupos depois, com COUNT, SUM, AVG.',
    guiado:
      'Para "grupos que passam de X":\n1. Agrupe com GROUP BY.\n2. Escreva `HAVING função(...) > X`.\n3. Use WHERE só para filtrar linhas antes.',
    tecnico:
      'Ordem lógica de execução: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Por isso o WHERE não enxerga agregações e o HAVING não pode ser usado sem uma agregação (na prática, com GROUP BY). Filtrar com WHERE sempre que possível é mais eficiente, pois reduz as linhas antes de agrupar.',
  },
  analogia: {
    titulo: 'Triagem em duas etapas',
    texto:
      'Primeiro você descarta caixas danificadas (WHERE, filtra itens). Depois agrupa por tipo e só mantém os tipos com mais de 10 caixas (HAVING, filtra grupos).',
    limites: 'Não dá para decidir pelo tamanho do grupo antes de formar o grupo.',
  },
  demo: {
    titulo: 'Grupos que passam no teste',
    instrucoes: 'Execute e depois mude o número do HAVING e troque COUNT por SUM(valor).',
    simulacao: {
      tipo: 'sql',
      consulta:
        'SELECT produto, COUNT(*) AS pedidos, SUM(valor) AS total FROM pedidos GROUP BY produto HAVING COUNT(*) > 2;',
    },
  },
  tecnica: {
    titulo: 'WHERE e HAVING juntos',
    texto:
      '```\nSELECT produto, SUM(valor)\nFROM pedidos\nWHERE valor > 5\nGROUP BY produto\nHAVING SUM(valor) > 40;\n```\nO WHERE tira os pedidos baratos; o HAVING mantém só os produtos com total alto.',
  },
  diagrama: {
    titulo: 'Ordem de execução',
    nos: [
      { forma: 'inicio', texto: 'FROM e JOIN: reúnem as linhas' },
      { forma: 'passo', texto: 'WHERE: filtra linhas' },
      { forma: 'passo', texto: 'GROUP BY: forma os grupos' },
      { forma: 'fim', texto: 'HAVING: filtra grupos; depois SELECT, ORDER BY e LIMIT' },
    ],
    descricao: 'O WHERE acontece antes de agrupar e o HAVING depois.',
  },
  exemplo: {
    titulo: 'Cidades com mais de um cliente',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT cidade, COUNT(*)\nFROM clientes\nGROUP BY cidade\nHAVING COUNT(*) > 1;',
    },
    comentarios: [
      { linha: 4, texto: 'Mantém só os grupos com 2 ou mais clientes: Sorocaba e Campinas.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas devolve o GROUP BY produto com HAVING COUNT(*) > 2? (só o número)',
      'SELECT produto, COUNT(*) FROM pedidos GROUP BY produto HAVING COUNT(*) > 2;',
      ['1'],
      'Só a Caneta tem 3 pedidos.',
      [{ resposta: '3', feedback: '3 é o número de produtos; o HAVING deixa só um.' }],
    ),
    prever(
      'E com HAVING SUM(valor) >= 50? (só o número de linhas)',
      'SELECT produto, SUM(valor) FROM pedidos GROUP BY produto HAVING SUM(valor) >= 50;',
      ['2'],
      'Mochila (240) e Caderno (50) passam; Caneta soma 15.',
      [{ resposta: '1', feedback: 'O Caderno soma exatamente 50, e >= inclui o 50.' }],
    ),
  ],
  indep: [
    completar(
      'Complete para listar as cidades com mais de um cliente.',
      'SELECT cidade, COUNT(*)\nFROM clientes\nGROUP BY cidade\n___ COUNT(*) > 1;',
      [{ aceitas: ['HAVING', 'having'], feedback: 'HAVING filtra os grupos.' }],
      'Filtrar por COUNT exige HAVING, não WHERE.',
    ),
    mc(
      'Qual cláusula filtra por SUM(valor) > 100 depois do GROUP BY?',
      'HAVING',
      [
        ['WHERE', 'O WHERE não enxerga agregações.'],
        ['LIMIT', 'LIMIT só corta a quantidade de linhas.'],
      ],
      'HAVING age sobre os grupos.',
    ),
  ],
  desafio: consultaSql(
    'Escreva uma consulta que mostre cada produto e o total vendido (SUM de valor), só dos produtos com total acima de 100.',
    'SELECT produto, SUM(valor) FROM pedidos GROUP BY produto;',
    'SELECT produto, SUM(valor) FROM pedidos GROUP BY produto HAVING SUM(valor) > 100;',
    ['Mantenha o GROUP BY.', 'Acrescente HAVING SUM(valor) > 100 no final.'],
    'O HAVING filtra os grupos pelo total calculado.',
  ),
  rec: [
    mc(
      'Qual a diferença entre WHERE e HAVING?',
      'WHERE filtra linhas antes de agrupar; HAVING filtra grupos depois',
      [
        [
          'São idênticos, mudando apenas a posição na consulta',
          'Eles agem em momentos diferentes.',
        ],
        [
          'O HAVING filtra as linhas antes de agrupar e o WHERE depois',
          'É o contrário: WHERE filtra antes; HAVING, depois.',
        ],
      ],
      'Ordem: WHERE, GROUP BY, HAVING.',
    ),
    ordenar(
      'Ordene a execução lógica de uma consulta com agregação.',
      ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'],
      'Essa ordem explica por que o WHERE não vê COUNT e o HAVING vê.',
    ),
  ],
  explique: {
    enunciado: 'Explique quando usar WHERE e quando usar HAVING.',
    modelo:
      'WHERE filtra linhas individuais antes do agrupamento, por exemplo valor maior que 5. HAVING filtra grupos depois do GROUP BY, usando resultados de agregações como COUNT ou SUM.',
    rubrica: [
      'Explicou o WHERE como filtro de linhas',
      'Explicou o HAVING como filtro de grupos',
      'Citou a ordem ou um exemplo',
    ],
  },
  resumo: [
    'WHERE filtra linhas; HAVING filtra grupos.',
    'HAVING usa COUNT, SUM, AVG.',
    'A ordem lógica: FROM, WHERE, GROUP BY, HAVING, SELECT.',
    'Filtre com WHERE sempre que possível.',
  ],
  cards: [
    ['O que filtra o WHERE?', 'Linhas, antes de agrupar.'],
    ['O que filtra o HAVING?', 'Grupos, depois do GROUP BY.'],
    ['WHERE pode usar COUNT?', 'Não.'],
    ['Qual vem primeiro, WHERE ou HAVING?', 'WHERE.'],
  ],
  conexoes: conexoesBase(
    [
      'Python (pandas): filtrar depois de groupby faz o papel do HAVING.',
      'Engenharia de Dados: relatórios "só os que passam de X" usam HAVING.',
    ],
    'Perguntas como "quais clientes compraram mais de 10 vezes" são HAVING.',
  ),
});

export const s08 = montar({
  id: 'sql.m02.a03',
  titulo: 'LEFT JOIN: incluindo quem não tem par',
  objetivo:
    'Usar LEFT JOIN para manter todas as linhas da tabela da esquerda e achar registros sem correspondência.',
  pre: ['sql.m02.a02'],
  min: 30,
  diag: mc(
    'No JOIN simples, o que acontece com um cliente sem pedidos?',
    'Ele não aparece no resultado',
    [
      ['Aparece com valores vazios', 'Isso é o LEFT JOIN.'],
      [
        'Causa um erro, pois falta um pedido para ligar ao cliente',
        'Nenhum erro acontece: a consulta roda, só que esse cliente fica de fora.',
      ],
    ],
    'JOIN simples (INNER) só traz pares que casam.',
  ),
  simples: {
    titulo: 'Manter todos da esquerda',
    texto:
      'Com **LEFT JOIN** todas as linhas da tabela da **esquerda** (a do FROM) aparecem. Quando não há par na tabela da direita, as colunas dela vêm como **NULL**:\n\n```\nSELECT nome, produto\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;\n```\n\nDiego, que nunca comprou, aparece com `produto = NULL`. Isso permite uma pergunta valiosa: **quem NÃO tem pedidos?**\n\n```\n... LEFT JOIN pedidos ON ... WHERE produto IS NULL;\n```',
    essencial:
      'LEFT JOIN mantém todas as linhas da esquerda; sem par, a direita vem NULL. Com IS NULL acha quem não tem par.',
    guiado:
      'Para achar quem não tem correspondência:\n1. Tabela principal no FROM.\n2. `LEFT JOIN outra ON ...`.\n3. `WHERE coluna_da_outra IS NULL`.',
    tecnico:
      'Tipos de junção: INNER (só pares), LEFT (todas da esquerda), RIGHT (todas da direita) e FULL (todas dos dois lados). Conte com COUNT(coluna_da_direita), e não COUNT(*), para obter 0 em quem não tem par, pois a linha "vazia" ainda conta como linha. O filtro na tabela da direita deve ir no ON (ou tratar NULL) para não transformar o LEFT JOIN em INNER sem querer.',
  },
  analogia: {
    titulo: 'Lista de chamada',
    texto:
      'A lista de alunos (esquerda) é conferida com a de presentes (direita). O LEFT JOIN mostra todos os alunos; quem faltou aparece com a presença em branco. Filtrar "presença em branco" dá a lista de faltosos.',
    limites:
      'Alguém presente que não está na lista de alunos não aparece (esse é o papel do RIGHT JOIN).',
  },
  demo: {
    titulo: 'Quem aparece?',
    instrucoes:
      'Execute e procure o cliente sem pedidos. Depois troque LEFT JOIN por JOIN e veja a diferença.',
    simulacao: {
      tipo: 'sql',
      consulta:
        'SELECT nome, produto FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;',
    },
  },
  tecnica: {
    titulo: 'Padrões de uso',
    texto:
      '**Quem não tem pedidos:** `LEFT JOIN ... WHERE pedidos.id IS NULL`.\n**Contar por cliente, incluindo zero:**\n```\nSELECT nome, COUNT(produto)\nFROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id\nGROUP BY nome;\n```',
  },
  diagrama: {
    titulo: 'LEFT JOIN',
    nos: [
      { forma: 'inicio', texto: 'Para cada linha da tabela da esquerda' },
      { forma: 'decisao', texto: 'Há linha correspondente na direita?' },
      { forma: 'passo', texto: 'Sim: junta (uma linha por par)' },
      { forma: 'fim', texto: 'Não: mantém a linha com NULL nas colunas da direita' },
    ],
    descricao: 'Nenhuma linha da esquerda é perdida; sem par, a direita vem vazia.',
  },
  exemplo: {
    titulo: 'Pedidos por cliente, incluindo zero',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'SELECT nome, COUNT(produto)\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.cliente_id\nGROUP BY nome;',
    },
    comentarios: [
      { linha: 1, texto: 'COUNT(produto) ignora NULL, então Diego fica com 0.' },
      { linha: 3, texto: 'LEFT JOIN mantém todos os clientes.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas tem o LEFT JOIN de clientes com pedidos (sem WHERE)? (só o número)',
      'SELECT nome, produto FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;',
      ['8'],
      '7 pares casados mais Diego, que não tem pedidos.',
      [{ resposta: '7', feedback: '7 é o JOIN simples; o LEFT JOIN acrescenta Diego.' }],
    ),
    prever(
      'Quantas linhas o LEFT JOIN devolve com WHERE produto IS NULL? (só o número)',
      'SELECT nome FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE produto IS NULL;',
      ['1'],
      'Só Diego não tem pedidos.',
      [{ resposta: '0', feedback: 'Diego aparece com produto NULL no LEFT JOIN.' }],
    ),
  ],
  indep: [
    completar(
      'Complete para incluir todos os clientes, mesmo sem pedidos.',
      'SELECT nome, produto\nFROM clientes\n___ JOIN pedidos ON clientes.id = pedidos.cliente_id;',
      [{ aceitas: ['LEFT', 'left'], feedback: 'LEFT JOIN mantém todas as linhas da esquerda.' }],
      'LEFT JOIN preserva a tabela do FROM.',
    ),
    mc(
      'Qual é a melhor forma de achar clientes sem pedidos?',
      'LEFT JOIN e filtrar onde a coluna da outra tabela é NULL',
      [
        [
          'JOIN simples com WHERE produto = 0, para achar quem não comprou',
          'O JOIN simples nem traz quem não tem pedidos.',
        ],
        [
          'SELECT * FROM pedidos e conferir à mão quem não aparece',
          'Isso é trabalhoso e propenso a erro.',
        ],
      ],
      'Sem par, a direita vem NULL.',
    ),
  ],
  desafio: consultaSql(
    'Escreva uma consulta que mostre o nome dos clientes que nunca fizeram pedido.',
    'SELECT nome FROM clientes;',
    'SELECT nome FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE produto IS NULL;',
    [
      'Use LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id.',
      'Filtre com WHERE produto IS NULL.',
    ],
    'O LEFT JOIN traz todos; os sem pedido ficam com produto NULL.',
  ),
  rec: [
    associar(
      'Associe o tipo de junção ao comportamento.',
      [
        ['INNER JOIN', 'Só pares que casam'],
        ['LEFT JOIN', 'Todas da esquerda, NULL se não houver par'],
        ['RIGHT JOIN', 'Todas da direita, NULL se não houver par'],
        ['FULL JOIN', 'Todas dos dois lados'],
      ],
      'Os quatro tipos de junção.',
    ),
    mc(
      'Por que usar COUNT(produto) em vez de COUNT(*) com LEFT JOIN?',
      'Para o cliente sem pedido resultar em 0 e não em 1',
      [
        [
          'COUNT(*) dá erro quando usado junto com LEFT JOIN',
          'Não dá erro; conta a linha nula como 1.',
        ],
        [
          'COUNT(produto) é mais rápido porque lê só uma coluna',
          'O motivo é a contagem correta, não a velocidade.',
        ],
      ],
      'A linha com NULL ainda é uma linha para o COUNT(*).',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre JOIN e LEFT JOIN usando clientes e pedidos.',
    modelo:
      'O JOIN simples só mostra clientes que têm pedidos. O LEFT JOIN mostra todos os clientes, e quem não tem pedido aparece com as colunas de pedidos vazias (NULL), o que permite descobrir clientes sem compras.',
    rubrica: [
      'Explicou o JOIN simples',
      'Explicou o LEFT JOIN com NULL',
      'Citou achar quem não tem pedidos',
    ],
  },
  resumo: [
    'LEFT JOIN mantém todas as linhas da esquerda.',
    'Sem par, a direita vem NULL.',
    'LEFT JOIN + IS NULL acha quem não tem correspondência.',
    'Use COUNT(coluna) para contar zero corretamente.',
  ],
  cards: [
    ['O que faz LEFT JOIN?', 'Mantém todas as linhas da tabela da esquerda.'],
    ['O que vem nas colunas sem par?', 'NULL.'],
    ['Como achar quem não tem pedido?', 'LEFT JOIN e WHERE coluna IS NULL.'],
    ['COUNT(*) ou COUNT(coluna) para contar zero?', 'COUNT(coluna).'],
  ],
  conexoes: conexoesBase(
    [
      'Python (pandas): merge(how="left").',
      'Engenharia de Dados: achar registros órfãos é tarefa comum de qualidade de dados.',
    ],
    'Descobrir "quem NÃO fez algo" é uma das perguntas de negócio mais valiosas.',
  ),
});

export const s09 = montar({
  id: 'sql.m02.a04',
  titulo: 'INSERT e UPDATE: criando e corrigindo dados',
  objetivo:
    'Inserir novas linhas com INSERT e alterar linhas existentes com UPDATE, sempre com WHERE.',
  pre: ['sql.m02.a03'],
  min: 30,
  diag: mc(
    'Qual comando acrescenta uma nova linha a uma tabela?',
    'INSERT INTO',
    [
      ['SELECT', 'SELECT só lê dados.'],
      [
        'UPDATE, que altera linhas que já existem na tabela',
        'UPDATE altera linhas que já existem.',
      ],
    ],
    'INSERT INTO cria registros novos.',
  ),
  simples: {
    titulo: 'Escrever no banco',
    texto:
      "Até aqui você só lia dados. Agora vai **alterar**:\n\n- **INSERT INTO** acrescenta uma linha:\n```\nINSERT INTO clientes (id, nome, cidade, idade)\nVALUES (6, 'Fábio', 'Itu', 33);\n```\n- **UPDATE** muda linhas existentes:\n```\nUPDATE clientes SET cidade = 'Itu' WHERE id = 1;\n```\n\nNo UPDATE, o **WHERE** diz *quais* linhas mudam. Sem ele, mudam todas.",
    essencial: 'INSERT cria linhas. UPDATE altera linhas existentes; o WHERE escolhe quais.',
    guiado:
      'Para inserir:\n1. `INSERT INTO tabela (colunas)`.\n2. `VALUES (valores na mesma ordem)`.\n3. Dê um id novo, que não exista.\n\nPara atualizar:\n1. `UPDATE tabela SET coluna = valor`.\n2. `WHERE` para escolher as linhas.',
    tecnico:
      'A chave primária (aqui, id) identifica cada linha e não pode repetir nem ficar vazia: o banco recusa o INSERT que a violar. Em sistemas reais, comandos que alteram dados rodam dentro de uma transação (BEGIN ... COMMIT/ROLLBACK), que permite desfazer. O banco informa quantas linhas foram afetadas, e conferir esse número é um bom hábito.',
  },
  analogia: {
    titulo: 'Ficha de cadastro',
    texto:
      'INSERT é preencher uma ficha nova e colocá-la no arquivo. UPDATE é achar fichas específicas e corrigir um campo. O WHERE é a etiqueta "só as fichas de Sorocaba".',
    limites:
      'Diferente do papel, não há borracha automática: sem transação ou backup, não dá para desfazer.',
  },
  demo: {
    titulo: 'Altere o banco de brinquedo',
    instrucoes:
      'Execute o INSERT. Depois rode SELECT * FROM clientes; para ver a nova linha. Use "Restaurar banco" para recomeçar.',
    simulacao: {
      tipo: 'sql',
      consulta: "INSERT INTO clientes (id, nome, cidade, idade) VALUES (6, 'Fábio', 'Itu', 33);",
    },
  },
  tecnica: {
    titulo: 'Cuidados',
    texto:
      "**Id repetido** é recusado (chave primária).\n**Ordem dos valores** deve acompanhar a lista de colunas.\n**Textos** vão entre aspas simples.\n**UPDATE sem WHERE** muda a tabela inteira.\nPode alterar várias colunas: `SET cidade = 'Itu', idade = 29`.",
  },
  diagrama: {
    titulo: 'INSERT ou UPDATE?',
    nos: [
      { forma: 'inicio', texto: 'Quero alterar dados' },
      { forma: 'decisao', texto: 'A linha já existe?' },
      { forma: 'passo', texto: 'Sim: UPDATE ... SET ... WHERE' },
      { forma: 'fim', texto: 'Não: INSERT INTO ... VALUES' },
    ],
    descricao: 'Se a linha já existe, atualiza; senão, insere.',
  },
  exemplo: {
    titulo: 'Corrigindo a idade de uma cliente',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: "UPDATE clientes\nSET idade = 29\nWHERE nome = 'Ana';",
    },
    comentarios: [
      { linha: 2, texto: 'O novo valor da coluna.' },
      { linha: 3, texto: 'Só a Ana é alterada.' },
    ],
  },
  guiado: [
    mc(
      'O que acontece se o UPDATE não tiver WHERE?',
      'Todas as linhas da tabela são alteradas',
      [
        ['Nada acontece, pois o comando exige o WHERE para rodar', 'O comando roda e altera tudo.'],
        [
          'Só a primeira linha da tabela é alterada, por segurança',
          'Sem WHERE, todas as linhas são afetadas.',
        ],
      ],
      'Por isso o WHERE é tão importante.',
    ),
    mc(
      "INSERT INTO clientes (id, nome, cidade, idade) VALUES (1, 'X', 'Y', 9); dá certo?",
      'Não, o id 1 já existe',
      [
        ['Sim, substitui a Ana', 'INSERT nunca substitui.'],
        ['Sim, cria uma segunda linha com id 1', 'A chave primária não permite.'],
      ],
      'A chave primária não pode repetir.',
    ),
  ],
  indep: [
    completar(
      'Complete para mudar a cidade do cliente 4 para Itu.',
      "UPDATE clientes\n___ cidade = 'Itu'\nWHERE id = 4;",
      [{ aceitas: ['SET', 'set'], feedback: 'SET indica a coluna e o novo valor.' }],
      'UPDATE tabela SET coluna = valor WHERE ...',
    ),
    mc(
      'Qual comando acrescenta a linha de um novo cliente?',
      'INSERT INTO clientes ... VALUES ...',
      [
        [
          'UPDATE clientes SET ..., que cria um cliente novo na tabela',
          'O UPDATE altera linhas existentes.',
        ],
        ['SELECT clientes, que adiciona o cliente ao resultado', 'SELECT só consulta.'],
      ],
      'INSERT INTO cria linhas novas.',
    ),
  ],
  desafio: consultaSql(
    "Insira o cliente de id 6, nome 'Fábio', cidade 'Itu' e idade 33.",
    'INSERT INTO clientes (id, nome, cidade, idade) VALUES ();',
    "INSERT INTO clientes (id, nome, cidade, idade) VALUES (6, 'Fábio', 'Itu', 33);",
    ['Os valores vêm na mesma ordem das colunas.', 'Textos entre aspas simples.'],
    'A correção compara o estado final das tabelas com o esperado.',
  ),
  rec: [
    mc(
      'Qual cláusula escolhe quais linhas o UPDATE altera?',
      'WHERE',
      [
        ['SET', 'SET define os novos valores.'],
        ['VALUES', 'VALUES é do INSERT.'],
      ],
      'WHERE escolhe; SET muda.',
    ),
    mc(
      'Para que serve a chave primária?',
      'Identificar cada linha de forma única',
      [
        ['Ordenar a tabela pela coluna mais usada nas consultas', 'Ordenar é papel do ORDER BY.'],
        [
          'Apagar as linhas repetidas que existirem na tabela',
          'A chave primária impede repetição, não a apaga.',
        ],
      ],
      'Id único evita ambiguidade.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre INSERT e UPDATE e por que o WHERE importa no UPDATE.',
    modelo:
      'INSERT cria uma linha nova; UPDATE modifica linhas existentes. O WHERE restringe quais linhas são alteradas; sem ele, todas as linhas da tabela mudam, o que costuma ser um erro grave.',
    rubrica: [
      'Diferenciou INSERT de UPDATE',
      'Explicou o papel do WHERE',
      'Citou o risco de omiti-lo',
    ],
  },
  resumo: [
    'INSERT INTO ... VALUES cria linhas.',
    'UPDATE ... SET ... WHERE altera linhas existentes.',
    'Sem WHERE o UPDATE altera tudo.',
    'A chave primária não pode repetir.',
  ],
  cards: [
    ['Que comando cria linhas?', 'INSERT INTO ... VALUES.'],
    ['Que comando altera linhas?', 'UPDATE ... SET ... WHERE.'],
    ['UPDATE sem WHERE?', 'Altera todas as linhas.'],
    ['O que é chave primária?', 'Identificador único da linha.'],
  ],
  conexoes: conexoesBase(
    [
      'JavaScript: INSERT lembra push; UPDATE lembra mudar uma propriedade de um objeto.',
      'Python/FastAPI: POST cria e PUT/PATCH atualiza, e por baixo executam INSERT e UPDATE.',
    ],
    'Todo cadastro e edição em um app vira INSERT e UPDATE no banco.',
  ),
});

export const s10 = montar({
  id: 'sql.m02.a05',
  titulo: 'DELETE e cuidados com o WHERE',
  objetivo:
    'Apagar linhas com DELETE, conferir antes com SELECT e adotar hábitos seguros ao alterar dados.',
  pre: ['sql.m02.a04'],
  min: 25,
  diag: mc(
    'O que um DELETE FROM pedidos; sem WHERE faz?',
    'Apaga todas as linhas da tabela',
    [
      [
        'Apaga apenas a última linha inserida na tabela',
        'Sem WHERE, todas as linhas são apagadas.',
      ],
      ['Dá erro, porque o DELETE exige uma condição', 'O SQL executa e apaga tudo.'],
    ],
    'É um dos erros mais caros do SQL.',
  ),
  simples: {
    titulo: 'Apagar com segurança',
    texto:
      '**DELETE FROM** remove linhas:\n```\nDELETE FROM pedidos WHERE id = 7;\n```\nSem WHERE, apaga **tudo**. Hábitos de quem trabalha com dados:\n\n1. **Teste com SELECT**: rode `SELECT * FROM pedidos WHERE id = 7;` e veja se são mesmo as linhas que quer apagar.\n2. **Só depois** troque SELECT * por DELETE.\n3. Tenha **backup** e use **transação** quando possível.',
    essencial: 'DELETE remove linhas. Teste o WHERE com SELECT antes e tenha backup.',
    guiado:
      'Antes de apagar:\n1. Escreva o SELECT com o WHERE.\n2. Confira as linhas.\n3. Troque por DELETE, mantendo o WHERE.\n4. Confira de novo o resultado.',
    tecnico:
      'DELETE remove linhas; DROP TABLE remove a tabela inteira; TRUNCATE esvazia a tabela rapidamente. Em sistemas reais, apagar de verdade muitas vezes dá lugar à exclusão lógica: uma coluna como "ativo" ou "apagado_em" marca a linha em vez de removê-la, preservando histórico. Chaves estrangeiras (ex.: pedidos.cliente_id) podem impedir apagar um cliente que ainda tem pedidos.',
  },
  analogia: {
    titulo: 'Triturador de papel',
    texto:
      'DELETE é passar a ficha pelo triturador. Antes, você separa as fichas na mesa (SELECT) e confere. Sem o WHERE, você joga o arquivo inteiro lá dentro.',
    limites:
      'No mundo real há exclusão lógica: guardar a ficha numa pasta "inativos" em vez de destruí-la.',
  },
  demo: {
    titulo: 'Apague e confira',
    instrucoes:
      'Execute o DELETE, depois rode SELECT * FROM pedidos; e veja o que mudou. Tente um DELETE sem WHERE e restaure o banco.',
    simulacao: { tipo: 'sql', consulta: 'DELETE FROM pedidos WHERE valor < 10;' },
  },
  tecnica: {
    titulo: 'Rotina segura',
    texto:
      '**1.** SELECT com o mesmo WHERE.\n**2.** Confira a quantidade de linhas.\n**3.** DELETE com o WHERE.\n**4.** Veja a mensagem "N linha(s) apagada(s)" e compare.\n**Backup** antes de alterações grandes; **transação** com ROLLBACK quando existir.',
  },
  diagrama: {
    titulo: 'Rotina antes de apagar',
    nos: [
      { forma: 'inicio', texto: 'Preciso apagar linhas' },
      { forma: 'passo', texto: 'SELECT com o WHERE para conferir' },
      { forma: 'decisao', texto: 'São exatamente as linhas certas?' },
      { forma: 'fim', texto: 'Sim: DELETE com o mesmo WHERE. Não: ajuste o WHERE' },
    ],
    descricao: 'Sempre confira com SELECT antes de apagar.',
  },
  exemplo: {
    titulo: 'Removendo pedidos baratos',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT * FROM pedidos WHERE valor < 10;\nDELETE FROM pedidos WHERE valor < 10;',
    },
    comentarios: [
      { linha: 1, texto: 'Confere: são os 3 pedidos de Caneta.' },
      { linha: 2, texto: 'Mesmo WHERE: apaga exatamente o que foi conferido.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas o SELECT de conferência devolve para valor < 10? (só o número)',
      'SELECT * FROM pedidos WHERE valor < 10;',
      ['3'],
      'São os três pedidos de Caneta, de 5 cada.',
      [{ resposta: '7', feedback: '7 é a tabela inteira; o WHERE filtra.' }],
    ),
    mc(
      'Qual a melhor primeira ação antes de rodar um DELETE?',
      'Rodar um SELECT com o mesmo WHERE',
      [
        [
          'Rodar o DELETE primeiro e conferir o resultado depois',
          'Depois de apagar, não há volta sem backup.',
        ],
        [
          'Apagar a tabela e recriá-la para ter certeza do estado',
          'Isso destrói a estrutura e os dados.',
        ],
      ],
      'Conferir antes evita desastres.',
    ),
  ],
  indep: [
    completar(
      'Complete para apagar apenas o pedido de id 7.',
      'DELETE ___ pedidos\nWHERE id = 7;',
      [{ aceitas: ['FROM', 'from'], feedback: 'DELETE FROM tabela.' }],
      'A forma é DELETE FROM tabela WHERE condição.',
    ),
    mc(
      'Qual comando apaga a tabela inteira, estrutura incluída?',
      'DROP TABLE, que remove a tabela inteira junto com os dados',
      [
        [
          'DELETE, que apaga as linhas mas mantém a estrutura da tabela',
          'DELETE apaga só as linhas.',
        ],
        [
          'UPDATE, que troca todos os valores da tabela por vazios',
          'UPDATE altera valores, e não remove tabelas.',
        ],
      ],
      'DROP TABLE é ainda mais destrutivo que DELETE.',
    ),
  ],
  desafio: consultaSql(
    'Apague os pedidos do cliente de id 3.',
    'DELETE FROM pedidos;',
    'DELETE FROM pedidos WHERE cliente_id = 3;',
    ['Falta o WHERE: filtre por cliente_id.', 'O cliente 3 tem 3 pedidos.'],
    'Sem o WHERE, todos os pedidos seriam apagados; a correção compara o estado final.',
  ),
  rec: [
    mc(
      'O que é exclusão lógica?',
      'Marcar a linha como inativa em vez de apagá-la',
      [
        [
          'Apagar a linha duas vezes para garantir que sumiu',
          'Exclusão lógica não apaga: marca a linha.',
        ],
        [
          'Apagar a linha apenas na cópia de segurança',
          'Exclusão lógica mantém a linha e a marca como inativa.',
        ],
      ],
      'Preserva histórico e permite reverter.',
    ),
    ordenar(
      'Ordene a rotina segura para apagar linhas.',
      [
        'Escrever o SELECT com o WHERE',
        'Conferir as linhas devolvidas',
        'Trocar por DELETE mantendo o WHERE',
        'Verificar quantas linhas foram apagadas',
      ],
      'Conferir antes e depois evita surpresas.',
    ),
  ],
  explique: {
    enunciado: 'Explique por que o WHERE é crítico em DELETE e UPDATE e como se proteger de erros.',
    modelo:
      'Sem WHERE, DELETE e UPDATE atuam em todas as linhas. Para se proteger: testar o WHERE com um SELECT antes, conferir quantas linhas foram afetadas, usar transações e manter backup.',
    rubrica: [
      'Explicou o efeito sem WHERE',
      'Citou testar com SELECT',
      'Citou backup ou transação',
    ],
  },
  resumo: [
    'DELETE FROM remove linhas; sem WHERE remove tudo.',
    'Confira com SELECT antes de apagar.',
    'Use backup e transações.',
    'Exclusão lógica preserva histórico.',
  ],
  cards: [
    ['Que comando remove linhas?', 'DELETE FROM ... WHERE.'],
    ['Antes de apagar, o que fazer?', 'Rodar um SELECT com o mesmo WHERE.'],
    ['O que é exclusão lógica?', 'Marcar como inativo em vez de apagar.'],
    ['DROP TABLE faz o quê?', 'Remove a tabela inteira.'],
  ],
  conexoes: conexoesBase(
    [
      'Fundamentos da Computação: backup e RAID não substituem cuidado com comandos destrutivos.',
      'APIs: DELETE em HTTP costuma virar DELETE ou exclusão lógica no banco.',
    ],
    'Muitos incidentes reais vieram de um DELETE ou UPDATE rodado sem WHERE.',
  ),
});
