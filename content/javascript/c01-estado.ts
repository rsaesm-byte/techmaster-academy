import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j11 = montar({
  id: 'javascript.m03.a01',
  titulo: 'Projeto: modelando o estado do app',
  objetivo:
    'Representar os dados de um app de tarefas como estado e criar funções puras que o atualizam.',
  pre: ['javascript.m02.a02'],
  min: 35,
  diag: mc(
    'O que é o "estado" de um aplicativo?',
    'Os dados que descrevem como o app está agora',
    [
      ['O visual dos botões e das cores da tela', 'Estado é o dado, e não a aparência.'],
      [
        'O código-fonte do aplicativo, escrito pelo programador',
        'Estado são os dados do app em execução.',
      ],
    ],
    'Lista de tarefas, usuário logado, filtro escolhido: tudo isso é estado.',
  ),
  simples: {
    titulo: 'Primeiro os dados, depois a tela',
    texto:
      'Apps bem feitos separam **dados** de **tela**. O **estado** é uma estrutura simples, e a tela só mostra o estado. Para uma lista de tarefas:\n\n```\nconst tarefas = [\n  { id: 1, texto: "Estudar", feita: false },\n  { id: 2, texto: "Treinar", feita: true },\n];\n```\n\nCada ação vira uma **função pura** que recebe o estado e devolve um **novo** estado, sem alterar o antigo:\n\n```\nfunction adicionar(lista, texto) {\n  return [...lista, { id: lista.length + 1, texto, feita: false }];\n}\n```',
    essencial:
      'Estado = dados do app. Funções puras recebem o estado e devolvem um novo, sem alterar o antigo.',
    guiado:
      'Para planejar um app:\n1. Liste os dados (tarefas).\n2. Liste as ações (adicionar, concluir, remover).\n3. Escreva cada ação como função pura.\n4. Só depois conecte à tela.',
    tecnico:
      'Função pura: mesma entrada, mesma saída, sem efeitos colaterais (não altera variáveis externas nem a tela). São fáceis de testar e de reutilizar. Esse é o princípio por trás de React e Redux: a interface é uma função do estado.',
  },
  analogia: {
    titulo: 'Planilha e gráfico',
    texto:
      'O estado é a planilha; a tela é o gráfico. Para mudar o gráfico você não o desenha de novo: altera a planilha, e o gráfico se atualiza.',
    limites:
      'No app real, alguém precisa de fato redesenhar a tela a cada mudança de estado; isso fazemos na próxima aula.',
  },
  demo: {
    titulo: 'Transforme o estado',
    instrucoes:
      'Execute e observe que a lista original não muda. Adicione outra ação, como remover.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const inicial = [{ id: 1, texto: "Estudar", feita: false }];\nfunction adicionar(lista, texto) {\n  return [...lista, { id: lista.length + 1, texto, feita: false }];\n}\nconst depois = adicionar(inicial, "Treinar");\nconsole.log(inicial.length);\nconsole.log(depois.length);\nconsole.log(depois.map((t) => t.texto));',
    },
  },
  tecnica: {
    titulo: 'Padrões de atualização',
    texto:
      '**Adicionar:** `[...lista, novo]`.\n**Remover:** `lista.filter(t => t.id !== id)`.\n**Alterar um item:** `lista.map(t => t.id === id ? { ...t, feita: true } : t)`.\n**Derivar:** `lista.filter(t => !t.feita).length` (pendentes).',
  },
  diagrama: {
    titulo: 'Ciclo do app',
    nos: [
      { forma: 'inicio', texto: 'Estado atual' },
      { forma: 'passo', texto: 'O usuário faz uma ação' },
      { forma: 'passo', texto: 'Uma função pura devolve o novo estado' },
      { forma: 'fim', texto: 'A tela é atualizada a partir do novo estado' },
    ],
    descricao:
      'Ação do usuário, função pura que gera novo estado e atualização da tela a partir dele.',
  },
  exemplo: {
    titulo: 'Concluir uma tarefa',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function concluir(lista, id) {\n  return lista.map((t) => (t.id === id ? { ...t, feita: true } : t));\n}\nconst r = concluir([{ id: 1, feita: false }], 1);\nconsole.log(r[0].feita);',
    },
    comentarios: [
      { linha: 2, texto: 'map percorre; só a tarefa do id é copiada com feita: true.' },
      { linha: 5, texto: 'Mostra true.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(a.length);',
      ['2'],
      'O spread cria um novo array; a continua com 2 itens.',
      [{ resposta: '3', feedback: 'O original não foi alterado.' }],
      [],
      'javascript',
    ),
    mc(
      'Qual destas é uma função pura?',
      'function dobro(n) { return n * 2; }',
      [
        ['function f() { contador++; }', 'Altera uma variável externa.'],
        ['function g() { console.log("oi"); }', 'Produz efeito colateral (escrever na tela).'],
      ],
      'Função pura só calcula a saída a partir das entradas.',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'const l = [{ id: 1 }, { id: 2 }];\nconsole.log(l.filter((t) => t.id !== 1).length);',
      ['1'],
      'filter remove o id 1.',
      [{ resposta: '2', feedback: 'O filter descarta o item com id 1.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva adicionar(lista, texto): devolve uma nova lista com a tarefa { id: lista.length + 1, texto, feita: false } no fim. Não altere a lista recebida.',
      'function adicionar(lista, texto) {\n  // seu código aqui\n}',
      'function adicionar(lista, texto) {\n  return [...lista, { id: lista.length + 1, texto, feita: false }];\n}',
      'adicionar',
      [
        { argumentos: [[], 'Estudar'], esperado: [{ id: 1, texto: 'Estudar', feita: false }] },
        {
          argumentos: [[{ id: 1, texto: 'A', feita: true }], 'B'],
          esperado: [
            { id: 1, texto: 'A', feita: true },
            { id: 2, texto: 'B', feita: false },
          ],
        },
      ],
      ['Use o spread: [...lista, novaTarefa].'],
      'O spread copia a lista e acrescenta o novo item.',
    ),
  ],
  desafio: programaJs(
    'Escreva concluir(lista, id): devolve uma nova lista em que a tarefa com esse id tem feita: true. As demais ficam iguais.',
    'function concluir(lista, id) {\n  // seu código aqui\n}',
    'function concluir(lista, id) {\n  return lista.map((t) => (t.id === id ? { ...t, feita: true } : t));\n}',
    'concluir',
    [
      {
        argumentos: [
          [
            { id: 1, feita: false },
            { id: 2, feita: false },
          ],
          2,
        ],
        esperado: [
          { id: 1, feita: false },
          { id: 2, feita: true },
        ],
      },
      { argumentos: [[{ id: 1, feita: false }], 9], esperado: [{ id: 1, feita: false }] },
    ],
    [
      'map percorre todas as tarefas.',
      'Para a tarefa certa, devolva { ...t, feita: true }; para as outras, t.',
    ],
    'map cria a lista nova; o spread copia a tarefa alterando só feita.',
  ),
  rec: [
    mc(
      'Qual é a vantagem de funções puras?',
      'São fáceis de testar e de prever',
      [
        ['São sempre mais rápidas', 'A vantagem é previsibilidade, não velocidade.'],
        ['Dispensam o uso de variáveis', 'Usam variáveis normalmente.'],
      ],
      'Mesma entrada, mesma saída.',
    ),
    mc(
      'Como remover um item sem alterar a lista original?',
      'Usar filter para criar uma lista nova sem ele',
      [
        ['Usar splice, que altera a própria lista original', 'O splice muda o array original.'],
        [
          'Usar delete no elemento, que deixa um buraco na lista',
          'O delete deixa um espaço vazio e não cria lista nova.',
        ],
      ],
      'filter devolve uma lista nova.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é estado e por que separar dados da tela ajuda.',
    modelo:
      'Estado são os dados que descrevem o app agora, como a lista de tarefas. Separar dados da tela deixa a lógica simples de testar e permite que a tela apenas mostre o estado, atualizando quando ele muda.',
    rubrica: [
      'Definiu estado como dados do app',
      'Disse que a tela mostra o estado',
      'Citou testar ou simplicidade',
    ],
  },
  resumo: [
    'Estado = dados do app.',
    'Funções puras devolvem novo estado.',
    'Use spread, map e filter para atualizar sem alterar.',
    'A tela é consequência do estado.',
  ],
  cards: [
    ['O que é estado?', 'Dados que descrevem como o app está agora.'],
    ['O que é função pura?', 'Mesma entrada, mesma saída, sem efeitos colaterais.'],
    ['Como alterar um item sem mutar?', 'map com spread no item escolhido.'],
    ['Como remover sem mutar?', 'filter.'],
  ],
  conexoes: {
    disciplinas: [
      'React: a interface é função do estado.',
      'Engenharia de Software: funções puras são triviais de testar.',
      'Modelagem e Projeto de Bancos de Dados: o estado persistente é guardado em tabelas.',
    ],
    profissional:
      'Separar estado de interface é a base de apps escaláveis e é o que se pede em entrevistas de front-end.',
  },
});
