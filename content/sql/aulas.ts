import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

const conexoesBase = (extra: string[], prof: string) => ({
  disciplinas: [
    'Fundamentos (Bancos de dados): as tabelas e chaves vistas lá são o que o SQL consulta.',
    ...extra,
  ],
  profissional: prof,
});

export const s01 = montar({
  id: 'sql.m01.a01',
  titulo: 'Tabelas e SELECT',
  objetivo: 'Ler uma tabela com SELECT, escolher colunas e entender linhas, colunas e chaves.',
  pre: ['fundamentos.m04.a05'],
  min: 25,
  diag: mc(
    'O que é uma linha (registro) de uma tabela?',
    'Um item completo, como um cliente com todos os seus dados',
    [
      ['Um campo, como "nome"', 'Isso é uma coluna.'],
      ['Uma consulta salva', 'Linha é dado, não consulta.'],
    ],
    'Colunas são os campos; linhas são os registros.',
  ),
  simples: {
    titulo: 'Pedindo dados à planilha',
    texto:
      'O **SQL** conversa com bancos relacionais. A consulta mais básica é o **SELECT**:\n\n```\nSELECT nome, cidade FROM clientes;\nSELECT * FROM clientes;\n```\n\n- `SELECT` diz **quais colunas** você quer (`*` = todas).\n- `FROM` diz **de qual tabela**.\n- A consulta **não altera** nada; só lê.\n\nNeste curso você treina em um banco de brinquedo com as tabelas **clientes** (id, nome, cidade, idade) e **pedidos** (id, cliente_id, produto, valor).',
    essencial: 'SELECT colunas FROM tabela. * traz todas as colunas. SELECT só lê.',
    guiado:
      'Para consultar:\n1. Olhe os nomes das colunas da tabela.\n2. Escreva `SELECT` + colunas separadas por vírgula.\n3. Acrescente `FROM` + tabela.\n4. Execute e confira o resultado.',
    tecnico:
      'SQL é declarativo: você descreve o resultado, não o passo a passo. As palavras-chave não diferenciam maiúsculas de minúsculas, mas a convenção é escrevê-las em maiúsculas. A ordem das linhas sem ORDER BY não é garantida. Em produção evita-se `SELECT *` porque traz dados desnecessários e quebra se colunas mudarem.',
  },
  analogia: {
    titulo: 'Pedido ao balcão',
    texto:
      'Você diz ao atendente "quero as colunas nome e cidade, da gaveta clientes". Ele traz uma cópia; os originais ficam intactos.',
    limites:
      'O atendente só entende frases no formato do SQL; um erro de digitação gera uma mensagem de erro.',
  },
  demo: {
    titulo: 'Seu primeiro SELECT',
    instrucoes: 'Execute e depois troque as colunas, use * e consulte a tabela pedidos.',
    simulacao: { tipo: 'sql', consulta: 'SELECT nome, cidade FROM clientes;' },
  },
  tecnica: {
    titulo: 'Regras de escrita',
    texto:
      "**Vírgulas** separam colunas (sem vírgula no fim).\n**Ponto e vírgula** encerra o comando.\n**Textos** vão entre aspas simples: `'Ana'`.\n**Erros comuns:** esquecer a vírgula, errar o nome da coluna ou da tabela.",
  },
  diagrama: {
    titulo: 'Anatomia do SELECT',
    nos: [
      { forma: 'inicio', texto: 'SELECT: quais colunas' },
      { forma: 'passo', texto: 'FROM: de qual tabela' },
      { forma: 'fim', texto: 'Resultado: uma tabela nova só com o pedido' },
    ],
    descricao: 'SELECT escolhe as colunas, FROM escolhe a tabela, e o resultado é outra tabela.',
  },
  exemplo: {
    titulo: 'Só os nomes',
    codigo: { linguagem: 'pseudocodigo', fonte: 'SELECT nome\nFROM clientes;' },
    comentarios: [
      { linha: 1, texto: 'Pede apenas a coluna nome.' },
      { linha: 2, texto: 'Da tabela clientes; resultado: 5 linhas.' },
    ],
  },
  guiado: [
    prever(
      'Quantas colunas tem o resultado de SELECT nome, cidade FROM clientes? (só o número)',
      'SELECT nome, cidade FROM clientes;',
      ['2'],
      'Duas colunas foram pedidas: nome e cidade.',
      [{ resposta: '4', feedback: '4 colunas seria o SELECT *.' }],
    ),
    prever(
      'Quantas linhas tem SELECT * FROM clientes? (só o número)',
      'SELECT * FROM clientes;',
      ['5'],
      'A tabela clientes tem 5 registros.',
      [{ resposta: '4', feedback: 'Conte as linhas da tabela clientes: são 5.' }],
    ),
  ],
  indep: [
    completar(
      'Complete a consulta que traz o nome e a idade de todos os clientes.',
      '___ nome, idade\n___ clientes;',
      [
        { aceitas: ['SELECT'], feedback: 'SELECT escolhe as colunas.' },
        { aceitas: ['FROM'], feedback: 'FROM indica a tabela.' },
      ],
      'SELECT + colunas, FROM + tabela.',
    ),
    mc(
      'O que o SELECT faz com os dados da tabela?',
      'Apenas lê, sem alterá-los',
      [
        ['Apaga as linhas que não escolheu', 'SELECT nunca apaga.'],
        ['Ordena a tabela original', 'A tabela original não muda.'],
      ],
      'SELECT é só leitura.',
    ),
  ],
  desafio: prever(
    'Quantas colunas tem o resultado de SELECT * FROM pedidos? (só o número)',
    'SELECT * FROM pedidos;',
    ['4'],
    'A tabela pedidos tem id, cliente_id, produto e valor.',
    [{ resposta: '7', feedback: '7 é o número de linhas, não de colunas.' }],
  ),
  rec: [
    mc(
      'Qual é a função do FROM?',
      'Indicar de qual tabela vêm os dados',
      [
        ['Escolher as colunas', 'Isso é o SELECT.'],
        ['Filtrar as linhas', 'Isso é o WHERE.'],
      ],
      'FROM nomeia a tabela.',
    ),
    mc(
      'O que significa o * no SELECT *?',
      'Todas as colunas da tabela',
      [
        ['Todas as tabelas', 'O * se refere às colunas.'],
        ['Nenhuma coluna', 'Ele traz todas.'],
      ],
      'Útil para explorar, mas evitado em produção.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que são colunas e linhas e o que faz um SELECT.',
    modelo:
      'Colunas são os campos da tabela e linhas são os registros. O SELECT lê a tabela indicada em FROM e devolve só as colunas pedidas, sem alterar os dados.',
    rubrica: ['Definiu colunas e linhas', 'Explicou SELECT e FROM', 'Disse que só lê'],
  },
  resumo: [
    'SELECT colunas FROM tabela.',
    '* traz todas as colunas.',
    'SELECT só lê.',
    'Textos vão entre aspas simples.',
  ],
  cards: [
    ['O que é uma coluna?', 'Um campo da tabela.'],
    ['O que é uma linha?', 'Um registro completo.'],
    ['O que faz SELECT *?', 'Traz todas as colunas.'],
    ['SELECT altera dados?', 'Não, só lê.'],
  ],
  conexoes: conexoesBase(
    [
      'JavaScript: SELECT equivale a map para escolher campos.',
      'Python: o pandas lê tabelas de forma parecida.',
    ],
    'SELECT é a primeira habilidade pedida em vagas de dados e back-end.',
  ),
});

export const s02 = montar({
  id: 'sql.m01.a02',
  titulo: 'Filtrando com WHERE',
  objetivo: 'Filtrar linhas com WHERE, combinando condições com AND, OR e LIKE.',
  pre: ['sql.m01.a01'],
  min: 25,
  diag: mc(
    'Qual cláusula escolhe QUAIS LINHAS aparecem no resultado?',
    'WHERE',
    [
      ['SELECT', 'SELECT escolhe colunas.'],
      ['FROM', 'FROM escolhe a tabela.'],
    ],
    'WHERE mantém só as linhas que passam na condição.',
  ),
  simples: {
    titulo: 'A peneira',
    texto:
      "```\nSELECT nome FROM clientes\nWHERE cidade = 'Sorocaba' AND idade > 25;\n```\n\n- `=`, `!=`, `<`, `<=`, `>`, `>=` comparam.\n- `AND`: as duas condições; `OR`: pelo menos uma.\n- `LIKE 'C%'`: começa com C (o `%` vale por qualquer sequência).\n- Textos entre **aspas simples**; números sem aspas.",
    essencial:
      'WHERE filtra linhas. AND exige as duas condições; OR aceita uma. LIKE com % busca padrões.',
    guiado:
      'Para filtrar:\n1. Escreva o SELECT e o FROM.\n2. Acrescente `WHERE coluna operador valor`.\n3. Combine com AND/OR se precisar.\n4. Execute e confira.',
    tecnico:
      'Em SQL padrão, igualdade é `=` (um só sinal). O AND tem precedência sobre o OR; parênteses esclarecem a ordem. Comparar com NULL exige `IS NULL`, nunca `= NULL`. LIKE é caro em tabelas enormes quando começa com `%`, pois não aproveita índice.',
  },
  analogia: {
    titulo: 'Peneira de areia',
    texto:
      'A tabela é a areia e o WHERE é a peneira: só passam os grãos que cumprem o critério. AND é uma peneira com dois furos exigidos; OR aceita grãos que passem por qualquer um.',
    limites: 'A peneira não altera a areia original, só separa uma cópia.',
  },
  demo: {
    titulo: 'Filtre os clientes',
    instrucoes: 'Execute e depois mude a cidade, a idade e use OR e LIKE.',
    simulacao: {
      tipo: 'sql',
      consulta:
        "SELECT nome, cidade, idade FROM clientes WHERE cidade = 'Sorocaba' AND idade > 25;",
    },
  },
  tecnica: {
    titulo: 'Combinações',
    texto:
      "**Faixa:** `idade >= 25 AND idade <= 35`.\n**Várias opções:** `cidade = 'A' OR cidade = 'B'`.\n**Padrões:** `nome LIKE '%a'` (termina com a).\n**Diferente:** `cidade != 'Sorocaba'`.\n**Cuidado:** AND tem prioridade sobre OR.",
  },
  diagrama: {
    titulo: 'Como o WHERE filtra',
    nos: [
      { forma: 'inicio', texto: 'Todas as linhas da tabela' },
      { forma: 'decisao', texto: 'A linha cumpre a condição?' },
      { forma: 'passo', texto: 'Sim: entra no resultado' },
      { forma: 'fim', texto: 'Não: é descartada' },
    ],
    descricao: 'Cada linha é testada; só as que cumprem a condição entram no resultado.',
  },
  exemplo: {
    titulo: 'Clientes de Campinas',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: "SELECT nome\nFROM clientes\nWHERE cidade = 'Campinas';",
    },
    comentarios: [{ linha: 3, texto: "Só linhas com cidade igual a 'Campinas': Bruno e Elisa." }],
  },
  guiado: [
    prever(
      "Quantas linhas devolve SELECT * FROM clientes WHERE cidade = 'Campinas'? (só o número)",
      "SELECT * FROM clientes WHERE cidade = 'Campinas';",
      ['2'],
      'Bruno e Elisa moram em Campinas.',
      [{ resposta: '5', feedback: 'O WHERE reduz as linhas; não são todas.' }],
    ),
    prever(
      'Quantas linhas devolve WHERE idade > 30? (só o número)',
      'SELECT * FROM clientes WHERE idade > 30;',
      ['2'],
      'Bruno (35) e Diego (41). Elisa tem 30, que não é maior que 30.',
      [{ resposta: '3', feedback: '> é estritamente maior: 30 não entra.' }],
    ),
  ],
  indep: [
    prever(
      "Quantas linhas devolve WHERE cidade = 'Sorocaba' OR idade > 40? (só o número)",
      "SELECT * FROM clientes WHERE cidade = 'Sorocaba' OR idade > 40;",
      ['3'],
      'Ana e Carla (Sorocaba) e Diego (41).',
      [{ resposta: '2', feedback: 'Com OR basta cumprir uma das condições.' }],
    ),
    completar(
      'Complete para buscar clientes cujo nome começa com C.',
      "SELECT * FROM clientes WHERE nome ___ 'C%';",
      [
        {
          aceitas: ['LIKE', 'like'],
          feedback: 'LIKE compara com padrões; % vale por qualquer sequência.',
        },
      ],
      'LIKE com % faz buscas por padrão.',
    ),
  ],
  desafio: prever(
    "Quantas linhas devolve WHERE cidade = 'Sorocaba' AND idade > 25? (só o número)",
    "SELECT * FROM clientes WHERE cidade = 'Sorocaba' AND idade > 25;",
    ['1'],
    'Só Ana (28) cumpre as duas: Carla tem 22.',
    [{ resposta: '2', feedback: 'Com AND as duas condições são exigidas; Carla tem 22.' }],
  ),
  rec: [
    mc(
      'Qual operador exige que as DUAS condições sejam verdadeiras?',
      'AND',
      [
        ['OR', 'OR aceita uma só.'],
        ['LIKE', 'LIKE compara padrões de texto.'],
      ],
      'AND restringe; OR amplia.',
    ),
    mc(
      'Como comparar com texto no SQL?',
      "Entre aspas simples, como 'Ana'",
      [
        ['Sem aspas', 'Sem aspas seria entendido como uma coluna.'],
        ['Entre aspas duplas obrigatoriamente', 'No SQL padrão são aspas simples.'],
      ],
      'Números não levam aspas.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre AND e OR no WHERE e dê um exemplo.',
    modelo:
      "AND exige que as duas condições sejam verdadeiras, deixando o resultado menor. OR aceita linhas que cumpram pelo menos uma. Por exemplo, cidade = 'Sorocaba' AND idade > 25 traz só quem cumpre as duas.",
    rubrica: ['Explicou o AND', 'Explicou o OR', 'Deu um exemplo'],
  },
  resumo: [
    'WHERE filtra linhas.',
    'AND exige as duas; OR aceita uma.',
    'LIKE com % busca padrões.',
    'Textos entre aspas simples.',
  ],
  cards: [
    ['O que faz WHERE?', 'Filtra as linhas.'],
    ['AND ou OR amplia o resultado?', 'OR.'],
    ['O que faz LIKE C%?', 'Busca valores que começam com C.'],
    ['Qual aspas para texto?', 'Aspas simples.'],
  ],
  conexoes: conexoesBase(
    [
      'JavaScript: WHERE equivale a filter.',
      'Segurança: montar WHERE com texto do usuário sem cuidado causa SQL injection.',
    ],
    'Saber filtrar bem é o que separa consultas úteis de despejos enormes de dados.',
  ),
});

export const s03 = montar({
  id: 'sql.m01.a03',
  titulo: 'Ordenando e limitando',
  objetivo: 'Ordenar resultados com ORDER BY e limitar a quantidade de linhas com LIMIT.',
  pre: ['sql.m01.a02'],
  min: 20,
  diag: mc(
    'Sem ORDER BY, a ordem das linhas do resultado é garantida?',
    'Não',
    [
      ['Sim, sempre pela ordem de inserção', 'O banco pode devolver em qualquer ordem.'],
      ['Sim, sempre alfabética', 'Não há ordem implícita garantida.'],
    ],
    'Se a ordem importa, use ORDER BY.',
  ),
  simples: {
    titulo: 'Fila organizada e pódio',
    texto:
      '```\nSELECT nome, idade FROM clientes\nORDER BY idade DESC\nLIMIT 3;\n```\n\n- `ORDER BY coluna` ordena do menor ao maior (**ASC**, o padrão).\n- `DESC` inverte: do maior ao menor.\n- `LIMIT n` devolve só as **n primeiras** linhas.\n\nJuntos, respondem perguntas como "quem são os 3 mais velhos?".',
    essencial: 'ORDER BY ordena (ASC padrão, DESC inverte). LIMIT corta no número de linhas.',
    guiado:
      'Para um ranking:\n1. SELECT e FROM normais.\n2. `ORDER BY coluna DESC` (maior primeiro).\n3. `LIMIT n` para pegar o topo.',
    tecnico:
      'O LIMIT só faz sentido com ORDER BY, senão "as primeiras" são arbitrárias. Dá para ordenar por mais de uma coluna (`ORDER BY cidade, idade DESC`). Em tabelas grandes um índice na coluna de ordenação evita ordenar tudo a cada consulta. Em alguns bancos o LIMIT é escrito de outro jeito (TOP no SQL Server, FETCH FIRST no padrão).',
  },
  analogia: {
    titulo: 'Pódio de competição',
    texto:
      'ORDER BY DESC é ordenar os atletas do melhor ao pior; LIMIT 3 é chamar só os três do pódio.',
    limites: 'Sem ordenar antes, o LIMIT 3 chamaria três atletas quaisquer.',
  },
  demo: {
    titulo: 'Monte um ranking',
    instrucoes: 'Execute e troque DESC por ASC; mude o LIMIT; ordene por nome.',
    simulacao: {
      tipo: 'sql',
      consulta: 'SELECT nome, idade FROM clientes ORDER BY idade DESC LIMIT 3;',
    },
  },
  tecnica: {
    titulo: 'Detalhes',
    texto:
      '**ASC** (padrão) e **DESC**.\n**Ordem do comando:** SELECT, FROM, WHERE, ORDER BY, LIMIT.\n**Ordenar texto:** ordem alfabética.\n**Mais velho:** `ORDER BY idade DESC LIMIT 1`.',
  },
  diagrama: {
    titulo: 'Ranking',
    nos: [
      { forma: 'inicio', texto: 'Linhas filtradas pelo WHERE' },
      { forma: 'passo', texto: 'ORDER BY organiza as linhas' },
      { forma: 'fim', texto: 'LIMIT mantém só as primeiras n' },
    ],
    descricao: 'Primeiro ordena, depois corta nas primeiras linhas.',
  },
  exemplo: {
    titulo: 'Pedido mais caro',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT produto, valor\nFROM pedidos\nORDER BY valor DESC\nLIMIT 1;',
    },
    comentarios: [
      { linha: 3, texto: 'Do maior valor para o menor.' },
      { linha: 4, texto: 'Só o primeiro: um Mochila de 120.' },
    ],
  },
  guiado: [
    prever(
      'Qual nome aparece primeiro em SELECT nome FROM clientes ORDER BY idade DESC LIMIT 1?',
      'SELECT nome FROM clientes ORDER BY idade DESC LIMIT 1;',
      ['Diego'],
      'Diego tem 41, a maior idade.',
      [{ resposta: 'Carla', feedback: 'Carla é a mais nova; com DESC vem o mais velho.' }],
    ),
    prever(
      'E com ORDER BY idade ASC LIMIT 1?',
      'SELECT nome FROM clientes ORDER BY idade ASC LIMIT 1;',
      ['Carla'],
      'Carla tem 22, a menor idade.',
      [{ resposta: 'Diego', feedback: 'ASC vai do menor ao maior.' }],
    ),
  ],
  indep: [
    completar(
      'Complete para listar os 2 clientes mais jovens (menor idade primeiro).',
      'SELECT nome FROM clientes\n___ BY idade\n___ 2;',
      [
        { aceitas: ['ORDER'], feedback: 'ORDER BY ordena.' },
        { aceitas: ['LIMIT'], feedback: 'LIMIT corta o número de linhas.' },
      ],
      'ORDER BY idade (ASC por padrão) e LIMIT 2.',
    ),
    prever(
      'Quantas linhas devolve SELECT * FROM clientes LIMIT 3? (só o número)',
      'SELECT * FROM clientes LIMIT 3;',
      ['3'],
      'O LIMIT corta em 3 linhas.',
      [{ resposta: '5', feedback: 'LIMIT 3 devolve no máximo 3.' }],
    ),
  ],
  desafio: prever(
    'Qual é o valor do pedido mais caro? (só o número)',
    'SELECT valor FROM pedidos ORDER BY valor DESC LIMIT 1;',
    ['120'],
    'O maior valor na tabela pedidos é 120.',
    [{ resposta: '305', feedback: '305 é a soma de todos os pedidos, não o maior.' }],
  ),
  rec: [
    mc(
      'O que DESC faz no ORDER BY?',
      'Ordena do maior para o menor',
      [
        ['Remove duplicados', 'Isso seria DISTINCT.'],
        ['Descreve a tabela', 'Não é esse o sentido.'],
      ],
      'ASC é o padrão.',
    ),
    mc(
      'Por que usar LIMIT junto com ORDER BY?',
      'Para garantir quais são as primeiras linhas',
      [
        ['Para acelerar o ORDER BY', 'O motivo é a previsibilidade.'],
        ['Porque o SQL obriga', 'Não obriga, mas sem ordem o resultado é arbitrário.'],
      ],
      'Sem ordem, as "primeiras" linhas são imprevisíveis.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como obter os 3 clientes mais velhos.',
    modelo:
      'Usa-se ORDER BY idade DESC para colocar os mais velhos primeiro e LIMIT 3 para manter só as três primeiras linhas.',
    rubrica: [
      'Citou ORDER BY idade DESC',
      'Citou LIMIT 3',
      'Explicou por que a ordem vem antes do corte',
    ],
  },
  resumo: [
    'ORDER BY ordena; ASC é padrão.',
    'DESC inverte.',
    'LIMIT n corta nas primeiras n linhas.',
    'Use os dois para rankings.',
  ],
  cards: [
    ['O que faz ORDER BY?', 'Ordena o resultado.'],
    ['O que faz DESC?', 'Do maior para o menor.'],
    ['O que faz LIMIT?', 'Limita o número de linhas.'],
    ['Como pegar o maior valor?', 'ORDER BY coluna DESC LIMIT 1'],
  ],
  conexoes: conexoesBase(
    [
      'JavaScript: sort e slice fazem o mesmo.',
      'Engenharia de Dados: rankings e top-N são perguntas constantes.',
    ],
    'Rankings do tipo "top 10" aparecem em todo relatório de negócio.',
  ),
});

export const s04 = montar({
  id: 'sql.m01.a04',
  titulo: 'Agregações e GROUP BY',
  objetivo: 'Resumir dados com COUNT, SUM, AVG, MIN e MAX e agrupar com GROUP BY.',
  pre: ['sql.m01.a03'],
  min: 30,
  diag: mc(
    'O que COUNT(*) devolve?',
    'A quantidade de linhas',
    [
      ['A soma de todos os valores', 'Isso é SUM.'],
      ['O maior valor', 'Isso é MAX.'],
    ],
    'COUNT(*) conta linhas.',
  ),
  simples: {
    titulo: 'Do detalhe ao resumo',
    texto:
      '**Funções de agregação** resumem várias linhas em um valor:\n\n- `COUNT(*)` conta linhas\n- `SUM(coluna)` soma\n- `AVG(coluna)` média\n- `MIN` e `MAX`\n\n```\nSELECT SUM(valor) FROM pedidos;\n```\n\nCom **GROUP BY** o resumo é feito **por grupo**:\n\n```\nSELECT produto, COUNT(*) FROM pedidos GROUP BY produto;\n```\n\nIsso devolve uma linha por produto, com quantos pedidos ele teve.',
    essencial: 'COUNT, SUM, AVG, MIN e MAX resumem linhas. GROUP BY faz o resumo por grupo.',
    guiado:
      'Para resumir por categoria:\n1. Escolha a coluna do grupo (produto).\n2. `SELECT produto, COUNT(*)`.\n3. `FROM pedidos`.\n4. `GROUP BY produto`.',
    tecnico:
      'Regra de ouro: toda coluna do SELECT que não é agregada precisa estar no GROUP BY. O WHERE filtra linhas antes de agrupar; o HAVING filtra grupos depois (por exemplo, `HAVING COUNT(*) > 2`). COUNT(coluna) ignora valores NULL; COUNT(*) conta todas as linhas.',
  },
  analogia: {
    titulo: 'Fechamento de caixa',
    texto:
      'No fim do dia você não lê cada nota: soma tudo (SUM), conta os clientes (COUNT) e calcula o ticket médio (AVG). GROUP BY é fazer isso separado por forma de pagamento.',
    limites: 'Ao resumir, os detalhes de cada venda se perdem no resultado.',
  },
  demo: {
    titulo: 'Resuma os pedidos',
    instrucoes: 'Execute, depois troque COUNT por SUM(valor) e agrupe por outra coluna.',
    simulacao: {
      tipo: 'sql',
      consulta: 'SELECT produto, COUNT(*), SUM(valor) FROM pedidos GROUP BY produto;',
    },
  },
  tecnica: {
    titulo: 'Combinações',
    texto:
      "**Total geral:** `SELECT SUM(valor) FROM pedidos`.\n**Média filtrada:** `SELECT AVG(valor) FROM pedidos WHERE produto = 'Caneta'`.\n**Por grupo:** `GROUP BY cidade`.\n**Erro comum:** misturar coluna e agregação sem GROUP BY.",
  },
  diagrama: {
    titulo: 'Como o GROUP BY trabalha',
    nos: [
      { forma: 'inicio', texto: 'Linhas da tabela (já filtradas pelo WHERE)' },
      { forma: 'passo', texto: 'GROUP BY separa em grupos pelo valor da coluna' },
      { forma: 'passo', texto: 'A função de agregação resume cada grupo' },
      { forma: 'fim', texto: 'Uma linha de resultado por grupo' },
    ],
    descricao: 'As linhas são separadas em grupos e cada grupo vira uma linha de resumo.',
  },
  exemplo: {
    titulo: 'Clientes por cidade',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'SELECT cidade, COUNT(*)\nFROM clientes\nGROUP BY cidade;',
    },
    comentarios: [{ linha: 3, texto: 'Resultado: Sorocaba 2, Campinas 2, São Paulo 1.' }],
  },
  guiado: [
    prever(
      'Qual é o resultado de SELECT SUM(valor) FROM pedidos? (só o número)',
      'SELECT SUM(valor) FROM pedidos;',
      ['305'],
      '25 + 5 + 120 + 25 + 120 + 5 + 5 = 305.',
      [{ resposta: '7', feedback: '7 é a quantidade de pedidos (COUNT), não a soma.' }],
    ),
    prever(
      "Qual é o resultado de AVG(valor) para produto = 'Caneta'? (só o número)",
      "SELECT AVG(valor) FROM pedidos WHERE produto = 'Caneta';",
      ['5'],
      'Todas as canetas custam 5.',
      [{ resposta: '15', feedback: '15 seria a soma das 3 canetas; AVG divide por 3.' }],
    ),
  ],
  indep: [
    prever(
      'Quantas linhas devolve SELECT produto, COUNT(*) FROM pedidos GROUP BY produto? (só o número)',
      'SELECT produto, COUNT(*) FROM pedidos GROUP BY produto;',
      ['3'],
      'Há três produtos diferentes: Caderno, Caneta e Mochila.',
      [{ resposta: '7', feedback: 'GROUP BY devolve uma linha por grupo, não por pedido.' }],
    ),
    completar(
      'Complete para contar os clientes por cidade.',
      'SELECT cidade, ___(*)\nFROM clientes\n___ BY cidade;',
      [
        { aceitas: ['COUNT', 'count'], feedback: 'COUNT(*) conta linhas.' },
        { aceitas: ['GROUP'], feedback: 'GROUP BY agrupa.' },
      ],
      'COUNT(*) conta; GROUP BY separa por cidade.',
    ),
  ],
  desafio: prever(
    'Qual é o MAIOR valor entre os pedidos? (só o número)',
    'SELECT MAX(valor) FROM pedidos;',
    ['120'],
    'O maior valor é 120 (a mochila).',
    [{ resposta: '5', feedback: '5 é o MIN.' }],
  ),
  rec: [
    associar(
      'Associe a função ao resultado.',
      [
        ['COUNT(*)', 'Quantidade de linhas'],
        ['SUM(valor)', 'Soma dos valores'],
        ['AVG(valor)', 'Média dos valores'],
        ['MAX(valor)', 'Maior valor'],
      ],
      'As cinco funções de agregação mais usadas.',
    ),
    mc(
      'O que o GROUP BY faz?',
      'Agrupa linhas com o mesmo valor para resumi-las por grupo',
      [
        ['Ordena o resultado', 'Isso é o ORDER BY.'],
        ['Filtra linhas', 'Isso é o WHERE.'],
      ],
      'Cada grupo vira uma linha no resultado.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre SUM(valor) e SUM(valor) com GROUP BY produto.',
    modelo:
      'Sem GROUP BY, SUM(valor) soma todas as linhas e devolve um único número. Com GROUP BY produto, a soma é feita separadamente para cada produto, devolvendo uma linha por produto.',
    rubrica: [
      'Explicou o total geral sem GROUP BY',
      'Explicou a soma por grupo',
      'Citou uma linha por produto',
    ],
  },
  resumo: [
    'COUNT, SUM, AVG, MIN e MAX resumem linhas.',
    'GROUP BY resume por grupo.',
    'Colunas não agregadas vão no GROUP BY.',
    'WHERE filtra antes; HAVING filtra grupos.',
  ],
  cards: [
    ['O que faz COUNT(*)?', 'Conta linhas.'],
    ['O que faz AVG?', 'Calcula a média.'],
    ['O que faz GROUP BY?', 'Resume por grupo.'],
    ['WHERE ou HAVING filtra grupos?', 'HAVING.'],
  ],
  conexoes: conexoesBase(
    [
      'JavaScript: reduce e agrupamentos fazem o mesmo.',
      'Python (pandas): groupby é o equivalente.',
      'Engenharia de Dados: agregações são a base de dashboards.',
    ],
    'Relatórios, dashboards e análises de negócio são feitos de GROUP BY.',
  ),
});

export const s05 = montar({
  id: 'sql.m01.a05',
  titulo: 'JOIN: ligando tabelas',
  objetivo:
    'Combinar duas tabelas com JOIN usando a chave estrangeira e responder perguntas que envolvem as duas.',
  pre: ['sql.m01.a04'],
  min: 35,
  diag: mc(
    'Por que dividir os dados em várias tabelas?',
    'Para não repetir informações e manter tudo organizado',
    [
      ['Porque uma tabela só não cabe no disco', 'O motivo é organização e consistência.'],
      ['Porque o SQL não aceita tabelas grandes', 'Aceita; o motivo é evitar repetição.'],
    ],
    'Os dados do cliente ficam em um lugar só; os pedidos apontam para ele por uma chave.',
  ),
  simples: {
    titulo: 'Fichas ligadas por número',
    texto:
      'Os pedidos não repetem o nome do cliente: guardam só o **cliente_id**, uma **chave estrangeira** que aponta para `clientes.id`. Para ver nome e pedido juntos, usamos **JOIN**:\n\n```\nSELECT nome, produto, valor\nFROM clientes\nJOIN pedidos ON clientes.id = pedidos.cliente_id;\n```\n\nO `ON` diz **como** as linhas combinam. Só entram os pares que casam (clientes sem pedidos ficam de fora neste tipo de JOIN).',
    essencial:
      'JOIN junta tabelas; ON diz qual coluna casa (chave primária com chave estrangeira).',
    guiado:
      'Para juntar:\n1. Escolha a tabela principal no FROM.\n2. `JOIN outra ON tabela1.id = tabela2.chave`.\n3. Escreva `tabela.coluna` quando o nome se repetir.\n4. Use WHERE, GROUP BY e ORDER BY como de costume.',
    tecnico:
      'O JOIN apresentado é o INNER JOIN: só pares que casam. O LEFT JOIN mantém todas as linhas da tabela da esquerda, preenchendo com NULL quando não há par (útil para achar clientes sem pedidos). Colunas com o mesmo nome em duas tabelas exigem o prefixo `tabela.coluna`. Chaves estrangeiras também garantem integridade: não se pode criar um pedido para um cliente inexistente.',
  },
  analogia: {
    titulo: 'Crachá e lista de presença',
    texto:
      'A lista guarda só o número do crachá. Para saber o nome, você olha o número no cadastro de funcionários. JOIN faz esse "olhar o número no cadastro" para todas as linhas de uma vez.',
    limites:
      'Se um crachá não existir no cadastro, esse registro não aparece no resultado do JOIN simples.',
  },
  demo: {
    titulo: 'Ligue clientes e pedidos',
    instrucoes:
      'Execute, depois acrescente WHERE para um cliente, troque as colunas e agrupe para somar por cliente.',
    simulacao: {
      tipo: 'sql',
      consulta:
        'SELECT nome, produto, valor FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id;',
    },
  },
  tecnica: {
    titulo: 'JOIN com agregação',
    texto:
      '**Gasto por cliente:**\n```\nSELECT nome, SUM(valor)\nFROM clientes\nJOIN pedidos ON clientes.id = pedidos.cliente_id\nGROUP BY nome;\n```\n**Ambiguidade:** `id` existe nas duas tabelas; escreva `clientes.id`.\n**Chave primária** identifica a linha; **chave estrangeira** aponta para ela.',
  },
  diagrama: {
    titulo: 'Como o JOIN casa linhas',
    nos: [
      { forma: 'inicio', texto: 'Para cada linha de clientes' },
      { forma: 'decisao', texto: 'Existe pedido com cliente_id igual ao id?' },
      { forma: 'passo', texto: 'Sim: junta as duas linhas no resultado' },
      { forma: 'fim', texto: 'Não: a linha não aparece (JOIN simples)' },
    ],
    descricao: 'O banco procura, para cada cliente, os pedidos cujo cliente_id casa com o id.',
  },
  exemplo: {
    titulo: 'Quanto cada cliente gastou',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'SELECT nome, SUM(valor)\nFROM clientes\nJOIN pedidos ON clientes.id = pedidos.cliente_id\nGROUP BY nome;',
    },
    comentarios: [
      { linha: 3, texto: 'Liga cada pedido ao seu cliente.' },
      { linha: 4, texto: 'Soma por cliente: Carla gastou 150, por exemplo.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas devolve o JOIN de clientes com pedidos (sem WHERE)? (só o número)',
      'SELECT nome, produto FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id;',
      ['7'],
      'Cada um dos 7 pedidos casa com um cliente.',
      [
        {
          resposta: '5',
          feedback: '5 é o número de clientes; o resultado tem uma linha por pedido.',
        },
      ],
    ),
    mc(
      'Diego (id 4) não fez pedidos. Ele aparece no JOIN simples?',
      'Não, porque não há pedido que case com o id dele',
      [
        ['Sim, com valores vazios', 'Isso aconteceria com LEFT JOIN.'],
        ['Sim, sempre', 'O JOIN simples só traz pares que casam.'],
      ],
      'Para incluí-lo, usa-se LEFT JOIN.',
    ),
  ],
  indep: [
    prever(
      "Quantas linhas tem o JOIN filtrado por nome = 'Carla'? (só o número)",
      "SELECT nome, valor FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE nome = 'Carla';",
      ['3'],
      'Carla fez 3 pedidos (Caderno, Mochila e Caneta).',
      [{ resposta: '1', feedback: 'Carla tem 3 pedidos na tabela.' }],
    ),
    completar(
      'Complete a ligação entre as tabelas.',
      'SELECT nome, valor\nFROM clientes\n___ pedidos ___ clientes.id = pedidos.cliente_id;',
      [
        { aceitas: ['JOIN'], feedback: 'JOIN junta as tabelas.' },
        { aceitas: ['ON'], feedback: 'ON indica a condição de ligação.' },
      ],
      'JOIN tabela ON condição.',
    ),
  ],
  desafio: prever(
    'Quanto Carla gastou no total? (só o número)',
    "SELECT SUM(valor) FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE nome = 'Carla';",
    ['150'],
    '25 + 120 + 5 = 150.',
    [{ resposta: '305', feedback: '305 é o total de todos os clientes.' }],
  ),
  rec: [
    mc(
      'O que é uma chave estrangeira?',
      'Uma coluna que aponta para a chave primária de outra tabela',
      [
        ['A primeira coluna de qualquer tabela', 'Não é questão de posição.'],
        ['Uma senha do banco', 'Não tem relação com senhas.'],
      ],
      'cliente_id em pedidos aponta para clientes.id.',
    ),
    ordenar(
      'Ordene o raciocínio para saber o total gasto por cliente.',
      [
        'Escolher a tabela principal no FROM',
        'Ligar a outra tabela com JOIN ... ON',
        'Somar o valor com SUM',
        'Agrupar por cliente com GROUP BY',
      ],
      'Primeiro juntam-se os dados; depois resume-se por cliente.',
    ),
  ],
  explique: {
    enunciado: 'Explique para que serve o JOIN e o papel das chaves primária e estrangeira.',
    modelo:
      'O JOIN combina linhas de duas tabelas que se relacionam. A chave primária identifica cada linha de uma tabela e a chave estrangeira, em outra tabela, aponta para ela. O ON usa essa ligação para casar as linhas.',
    rubrica: [
      'Explicou que o JOIN combina tabelas',
      'Citou chave primária',
      'Citou chave estrangeira e o ON',
    ],
  },
  resumo: [
    'JOIN combina tabelas com ON.',
    'Chave estrangeira aponta para a chave primária.',
    'Use tabela.coluna quando o nome se repetir.',
    'JOIN simples só traz pares que casam.',
  ],
  cards: [
    ['O que faz JOIN?', 'Combina linhas de duas tabelas.'],
    ['O que é chave estrangeira?', 'Coluna que aponta para a chave primária de outra tabela.'],
    ['O que o ON define?', 'Como as linhas das tabelas casam.'],
    ['Que JOIN traz clientes sem pedidos?', 'LEFT JOIN.'],
  ],
  conexoes: conexoesBase(
    [
      'Python (pandas): merge faz o papel do JOIN.',
      'Engenharia de Dados: modelar tabelas ligadas é o coração da área.',
      'Segurança: chaves estrangeiras garantem integridade dos dados.',
    ],
    'JOIN é a habilidade que separa quem só lê uma tabela de quem responde perguntas reais de negócio.',
  ),
});
