import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const b03 = montar({
  id: 'bancos.m01.a03',
  titulo: 'Chaves e integridade dos dados',
  objetivo:
    'Usar chaves primárias, estrangeiras e restrições para garantir que os dados do banco sejam sempre consistentes.',
  pre: ['bancos.m01.a02'],
  min: 30,
  diag: mc(
    'O que garante que duas linhas de uma tabela nunca tenham o mesmo id?',
    'A chave primária',
    [
      ['A chave estrangeira', 'Ela aponta para a chave primária de outra tabela.'],
      ['O ORDER BY', 'ORDER BY só ordena o resultado.'],
    ],
    'A chave primária identifica cada linha de modo único.',
  ),
  simples: {
    titulo: 'O banco como guardião',
    texto:
      'Um bom banco **recusa dados inválidos**, e não depende da boa vontade do programa. Isso se chama **integridade**:\n\n- **Chave primária (PK):** identifica a linha. Única e nunca vazia.\n- **Chave estrangeira (FK):** só aceita valores que existam na tabela referenciada. Impede, por exemplo, um pedido de um cliente que não existe.\n- **NOT NULL:** a coluna não pode ficar vazia.\n- **UNIQUE:** não pode repetir (e-mail, CPF).\n- **CHECK:** regra livre (idade ≥ 0, valor > 0).\n\nAs regras ficam **no banco**, valendo para todo programa que o acessar.',
    essencial:
      'PK identifica, FK liga e valida, NOT NULL/UNIQUE/CHECK impedem dados ruins. As regras ficam no banco.',
    guiado:
      'Ao criar uma tabela:\n1. Defina a chave primária.\n2. Marque o que é obrigatório (NOT NULL).\n3. Marque o que não repete (UNIQUE).\n4. Declare as chaves estrangeiras.\n5. Acrescente CHECKs para regras simples.',
    tecnico:
      'A chave primária pode ser **natural** (um dado do mundo, como CPF) ou **substituta** (um número gerado, como um id sequencial ou UUID); a substituta é mais estável, pois dados do mundo mudam. A FK também define o que fazer ao apagar ou alterar o pai: **RESTRICT** (recusa), **CASCADE** (propaga) ou **SET NULL**. Chaves **compostas** usam mais de uma coluna (como em tabelas associativas). A integridade no banco é a **última linha de defesa**: a validação na aplicação melhora a experiência, mas só o banco garante a regra para todos.',
  },
  analogia: {
    titulo: 'Portaria que confere o documento',
    texto:
      'A chave primária é o número do documento de cada morador (único). A chave estrangeira é a portaria conferindo que o visitante do apartamento 12 realmente visita alguém que mora lá. Se o apartamento não existe, não entra.',
    limites:
      'A portaria só confere regras que alguém programou; por isso as restrições precisam ser definidas.',
  },
  demo: {
    titulo: 'A chave primária não aceita repetição',
    instrucoes:
      'Este INSERT usa o id 6, que ainda não existe, e funciona. Agora troque o 6 por 1 (que já existe) e execute de novo: o banco recusa, porque a chave primária não pode repetir.',
    simulacao: {
      tipo: 'sql',
      consulta: "INSERT INTO clientes (id, nome, cidade, idade) VALUES (6, 'Fábio', 'Itu', 33);",
    },
  },
  tecnica: {
    titulo: 'Em SQL de verdade',
    texto:
      '```\nCREATE TABLE pedidos (\n  id INTEGER PRIMARY KEY,\n  cliente_id INTEGER NOT NULL REFERENCES clientes(id),\n  valor NUMERIC CHECK (valor > 0)\n);\n```\n`REFERENCES` declara a chave estrangeira; `CHECK` a regra do valor. Tentar inserir um pedido com `cliente_id` inexistente é recusado.',
  },
  diagrama: {
    titulo: 'Inserindo um pedido com FK',
    nos: [
      { forma: 'inicio', texto: 'INSERT de um pedido com cliente_id = 99' },
      { forma: 'decisao', texto: 'Existe um cliente com id 99?' },
      { forma: 'passo', texto: 'Sim: o pedido é gravado' },
      { forma: 'fim', texto: 'Não: o banco recusa, mantendo a consistência' },
    ],
    descricao: 'A FK impede registros "órfãos".',
  },
  exemplo: {
    titulo: 'Comportamento ao apagar o pai',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'DELETE do cliente 3 com 3 pedidos:\n  RESTRICT: recusa, pois existem pedidos\n  CASCADE: apaga o cliente e seus pedidos\n  SET NULL: apaga o cliente e zera cliente_id dos pedidos',
    },
    comentarios: [
      { linha: 2, texto: 'O mais seguro: obriga a decidir o que fazer com os pedidos.' },
      { linha: 3, texto: 'Prático, mas perigoso: pode apagar muita coisa.' },
    ],
  },
  guiado: [
    prever(
      'Quantas linhas tem a tabela de pedidos do cliente 3? (só o número)',
      'SELECT * FROM pedidos WHERE cliente_id = 3;',
      ['3'],
      'O cliente 3 (Carla) tem 3 pedidos; um DELETE dele com RESTRICT seria recusado.',
      [{ resposta: '7', feedback: '7 é o total de pedidos; o WHERE filtra pelo cliente.' }],
    ),
    mc(
      'O que uma chave estrangeira impede?',
      'Referenciar um registro que não existe',
      [
        ['Ter o mesmo id duas vezes', 'Isso é papel da chave primária.'],
        ['Deixar uma coluna vazia', 'Isso é papel do NOT NULL.'],
      ],
      'A FK garante que o "pai" exista.',
    ),
  ],
  indep: [
    mc(
      'Qual restrição impede dois clientes com o mesmo e-mail?',
      'UNIQUE',
      [
        ['NOT NULL', 'Impede vazio, mas não repetição.'],
        ['CHECK', 'CHECK define uma regra de valor.'],
      ],
      'UNIQUE garante valores sem repetição.',
    ),
    completar(
      'Complete a regra de que o valor do pedido deve ser positivo.',
      'valor NUMERIC ___ (valor > 0)',
      [
        {
          aceitas: ['CHECK', 'check'],
          feedback: 'CHECK define uma condição que cada linha deve cumprir.',
        },
      ],
      'O banco recusa linhas que violem o CHECK.',
    ),
  ],
  desafio: associar(
    'Associe a restrição ao que ela garante.',
    [
      ['PRIMARY KEY', 'Identificação única e não vazia da linha'],
      ['FOREIGN KEY', 'Só valores que existam na tabela referenciada'],
      ['NOT NULL', 'A coluna sempre tem valor'],
      ['UNIQUE', 'Valores não se repetem'],
    ],
    'Cada restrição fecha uma porta para dados inconsistentes.',
  ),
  rec: [
    ordenar(
      'Ordene da menor para a maior "força" de proteção ao apagar um cliente que tem pedidos.',
      [
        'SET NULL: apaga o cliente e deixa os pedidos sem dono',
        'CASCADE: apaga o cliente e os pedidos',
        'RESTRICT: recusa a exclusão',
      ],
      'RESTRICT é a mais protetora; as outras escolhem um destino para os pedidos.',
    ),
    mc(
      'Por que as regras de integridade devem ficar no banco, e não só no programa?',
      'Porque várias aplicações acessam o banco e só ele garante a regra para todas',
      [
        [
          'Porque o programa não consegue validar',
          'Consegue, mas pode ser contornado ou esquecido.',
        ],
        ['Porque é mais bonito', 'O motivo é a garantia universal.'],
      ],
      'O banco é a última linha de defesa.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o papel das chaves primária e estrangeira na integridade dos dados.',
    modelo:
      'A chave primária identifica cada linha de forma única e não vazia. A chave estrangeira liga uma tabela à outra e garante que só sejam gravados valores que existam na tabela referenciada, evitando registros órfãos. As duas fazem o banco recusar dados inconsistentes.',
    rubrica: [
      'Explicou a chave primária',
      'Explicou a chave estrangeira',
      'Relacionou com a integridade ou os registros órfãos',
    ],
  },
  resumo: [
    'PK identifica cada linha.',
    'FK garante que o registro referenciado exista.',
    'NOT NULL, UNIQUE e CHECK impedem dados ruins.',
    'As regras ficam no banco.',
  ],
  cards: [
    ['O que a PK garante?', 'Identificação única e não vazia.'],
    ['O que a FK evita?', 'Registros órfãos.'],
    ['O que faz o UNIQUE?', 'Impede valores repetidos.'],
    ['O que é ON DELETE CASCADE?', 'Apagar o pai apaga os filhos.'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: INSERT, UPDATE e DELETE esbarram nessas regras.',
      'Cibersegurança: integridade é um dos pilares da tríade CIA.',
      'Engenharia de Software: regras de negócio no banco e na aplicação.',
    ],
    profissional:
      'Bancos sem restrições acumulam dados sujos; com elas, os erros aparecem cedo, perto da causa.',
  },
});
