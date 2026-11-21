import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const b02 = montar({
  id: 'bancos.m01.a02',
  titulo: 'Normalização: eliminando a repetição',
  objetivo:
    'Reconhecer redundância e aplicar a 1FN, 2FN e 3FN para evitar anomalias de atualização.',
  pre: ['bancos.m01.a01'],
  min: 30,
  diag: mc(
    'Qual é o principal problema de repetir o endereço de um cliente em cada pedido dele?',
    'Se o endereço mudar, é preciso corrigir em muitos lugares e dá para esquecer algum',
    [
      [
        'O banco fica sem espaço imediatamente',
        'O problema é a inconsistência, e não só o espaço.',
      ],
      ['Ele deixa de funcionar', 'Funciona, mas com dados que podem divergir.'],
    ],
    'Redundância gera anomalias e inconsistências.',
  ),
  simples: {
    titulo: 'Cada fato em um só lugar',
    texto:
      '**Normalizar** é organizar as tabelas para que **cada fato apareça uma única vez**. Isso evita três anomalias:\n\n- **Inserção:** não dá para cadastrar um cliente sem ter um pedido.\n- **Atualização:** mudar a cidade de um cliente exige alterar dezenas de linhas.\n- **Exclusão:** apagar o último pedido apaga também os dados do cliente.\n\nAs três primeiras **formas normais**:\n\n- **1FN:** cada célula guarda **um só valor** (nada de listas "Ana, Bia" numa coluna).\n- **2FN:** cada coluna depende da **chave inteira** (importa quando a chave é composta).\n- **3FN:** cada coluna depende **só da chave**, e não de outra coluna comum (por exemplo, cidade depende do CEP, e não do id do cliente).',
    essencial:
      'Normalizar = cada fato em um só lugar. 1FN: valores atômicos. 2FN: depende da chave inteira. 3FN: depende só da chave.',
    guiado:
      'Para normalizar uma tabela:\n1. Há listas dentro de uma célula? Separe em linhas (1FN).\n2. Há colunas que dependem de só parte da chave? Mova-as para outra tabela (2FN).\n3. Há colunas que dependem de outra coluna comum? Crie uma tabela própria (3FN).\n4. Ligue as tabelas por chaves estrangeiras.',
    tecnico:
      'A normalização se baseia em **dependências funcionais** (A determina B). A 3FN costuma ser o alvo em sistemas transacionais (OLTP). Em **análise de dados** (OLAP, data warehouses) faz-se o oposto de propósito: **desnormaliza-se** para evitar muitos JOINs em consultas pesadas, como nos modelos **estrela**. Também há bancos NoSQL, em que dados aninhados são comuns. A regra prática: normalize para **gravar** com segurança e desnormalize só com evidência de gargalo na **leitura**.',
  },
  analogia: {
    titulo: 'Agenda de contatos',
    texto:
      'Numa agenda, o telefone de uma pessoa está num só cartão. Se ele fosse copiado em cada bilhete de compromisso, trocar de número exigiria achar todos os bilhetes. Normalizar é manter o telefone num só cartão e deixar os bilhetes apontarem para ele.',
    limites:
      'Excesso de tabelas pode tornar consultas lentas ou complicadas; é preciso equilíbrio.',
  },
  demo: {
    titulo: 'A repetição que a normalização evita',
    instrucoes:
      'Aqui os pedidos repetem o nome do cliente? Não: usam cliente_id. Rode a consulta e veja: o nome vive só na tabela clientes. Faça um UPDATE do nome da Ana e consulte de novo o JOIN.',
    simulacao: {
      tipo: 'sql',
      consulta: "UPDATE clientes SET nome = 'Ana Souza' WHERE id = 1;",
    },
  },
  tecnica: {
    titulo: 'Exemplo de normalização',
    texto:
      '**Antes (não normalizada):**\nPedido(id, cliente_nome, cliente_cidade, produtos = "Caneta, Caderno")\n\n**1FN:** um produto por linha (itens do pedido).\n**2FN/3FN:** cliente em tabela própria; pedido guarda só cliente_id; itens ligam pedido e produto.\n\n**Depois:** Cliente, Pedido, Produto, ItemPedido.',
  },
  diagrama: {
    titulo: 'Caminho da normalização',
    nos: [
      { forma: 'inicio', texto: 'Tabela com repetições e listas' },
      { forma: 'passo', texto: '1FN: um valor por célula' },
      { forma: 'passo', texto: '2FN: depende da chave inteira' },
      { forma: 'fim', texto: '3FN: depende só da chave; ligue por chaves estrangeiras' },
    ],
    descricao: 'Cada passo remove um tipo de redundância.',
  },
  exemplo: {
    titulo: 'Lista numa coluna',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'ERRADO (fere a 1FN):  pedido 7 | produtos: "Caneta, Caderno"\nCERTO:\n  item 1 | pedido 7 | Caneta\n  item 2 | pedido 7 | Caderno',
    },
    comentarios: [
      { linha: 1, texto: 'Não dá para filtrar ou contar produtos com segurança.' },
      { linha: 3, texto: 'Um valor por célula permite consultar com WHERE e GROUP BY.' },
    ],
  },
  guiado: [
    mc(
      'Uma coluna "telefones" guardando "1111, 2222" fere qual forma normal?',
      '1FN',
      [
        ['2FN', 'A 2FN trata de dependência parcial da chave.'],
        ['3FN', 'A 3FN trata de dependências entre colunas comuns.'],
      ],
      'A 1FN exige valores atômicos.',
    ),
    prever(
      'Quantos clientes diferentes aparecem na tabela de pedidos? (só o número)',
      'SELECT DISTINCT cliente_id FROM pedidos;',
      ['4'],
      'Os pedidos são dos clientes 1, 2, 3 e 5: quatro clientes diferentes.',
      [{ resposta: '7', feedback: '7 é o total de pedidos; DISTINCT remove as repetições.' }],
    ),
  ],
  indep: [
    mc(
      'Em qual cenário a desnormalização costuma ser aceitável?',
      'Em relatórios analíticos pesados, para reduzir JOINs',
      [
        ['Em um cadastro que muda o tempo todo', 'Aí a normalização protege a consistência.'],
        ['Sempre, para acelerar tudo', 'Desnormalizar sem necessidade gera inconsistências.'],
      ],
      'Normalize para gravar; desnormalize com evidência para ler.',
    ),
    completar(
      'Complete: a 3FN exige que cada coluna dependa só da ___.',
      'const regra = "cada coluna depende só da ___";',
      [{ aceitas: ['chave'], feedback: 'Depende da chave, de toda a chave e nada além da chave.' }],
      'A famosa frase resume a 3FN.',
    ),
  ],
  desafio: associar(
    'Associe cada anomalia ao problema.',
    [
      ['Anomalia de inserção', 'Não dá para cadastrar o cliente antes do primeiro pedido'],
      ['Anomalia de atualização', 'Mudar um dado exige alterar muitas linhas'],
      ['Anomalia de exclusão', 'Apagar um pedido apaga também dados do cliente'],
      ['Normalização', 'Reduz a redundância que causa as três anomalias'],
    ],
    'As anomalias nascem da redundância; a normalização as previne.',
  ),
  rec: [
    ordenar(
      'Ordene as formas normais, da primeira à terceira.',
      [
        '1FN: valores atômicos',
        '2FN: dependência da chave inteira',
        '3FN: dependência só da chave',
      ],
      'Cada forma pressupõe a anterior.',
    ),
    mc(
      'O que é uma dependência funcional?',
      'Quando o valor de uma coluna determina o valor de outra',
      [
        ['Quando duas tabelas têm o mesmo nome', 'Não tem relação.'],
        ['Quando uma consulta usa JOIN', 'É um conceito do modelo, não de consultas.'],
      ],
      'Por exemplo, o CEP determina a cidade.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é normalização e que problemas ela evita.',
    modelo:
      'Normalização é organizar as tabelas para que cada fato apareça uma só vez, seguindo as formas normais (1FN, 2FN e 3FN). Ela evita as anomalias de inserção, atualização e exclusão, causadas pela redundância, e mantém os dados consistentes.',
    rubrica: ['Definiu normalização', 'Citou as anomalias', 'Citou as formas normais'],
  },
  resumo: [
    'Normalizar: cada fato em um só lugar.',
    '1FN: atômico; 2FN: chave inteira; 3FN: só a chave.',
    'Evita anomalias de inserção, atualização e exclusão.',
    'Desnormalize só com evidência de gargalo.',
  ],
  cards: [
    ['O que a 1FN exige?', 'Um valor por célula.'],
    ['O que a 3FN exige?', 'Depender só da chave.'],
    ['Que anomalias a normalização evita?', 'Inserção, atualização e exclusão.'],
    ['Quando desnormalizar?', 'Em análises pesadas, com evidência.'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: JOIN reúne o que a normalização separou.',
      'Engenharia de Dados: data warehouses desnormalizam de propósito.',
      'Arquitetura: cache e réplicas também duplicam dados com critério.',
    ],
    profissional:
      'Normalização é o que separa um banco confiável de uma planilha gigante com dados divergentes.',
  },
});
