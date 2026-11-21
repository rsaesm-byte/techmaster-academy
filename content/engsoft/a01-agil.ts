import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const es01 = montar({
  id: 'engsoft.m01.a01',
  titulo: 'Ciclo de vida e métodos ágeis',
  objetivo:
    'Entender as fases de um projeto de software e como Scrum e Kanban entregam valor em ciclos curtos.',
  pre: ['javascript.m01.a05'],
  min: 30,
  diag: mc(
    'Um cliente só vê o sistema depois de 1 ano de trabalho e diz "não era isso". Qual abordagem evita esse problema?',
    'Entregar partes pequenas com frequência e colher feedback',
    [
      [
        'Escrever uma documentação ainda maior no início',
        'Mais papel não garante que o cliente goste do resultado.',
      ],
      ['Esconder o projeto até o final', 'Isso aumenta o risco.'],
    ],
    'Feedback cedo e contínuo é a ideia central do ágil.',
  ),
  simples: {
    titulo: 'Entregar aos poucos',
    texto:
      'Todo software passa por fases: **levantar requisitos, projetar, construir, testar, entregar e manter**.\n\nNo modelo **cascata** cada fase termina antes da próxima; mudanças tardias custam caro. Nos métodos **ágeis**, o ciclo se repete em **iterações curtas** com feedback constante.\n\n**Scrum** (ciclos de tempo fixo):\n- **Sprint:** ciclo de 1 a 4 semanas que entrega algo utilizável.\n- **Backlog:** lista priorizada do que fazer.\n- **Reuniões:** planejamento, diária (15 min), revisão e retrospectiva.\n- **Papéis:** Product Owner (o quê e a prioridade), Scrum Master (facilita) e time de desenvolvimento.\n\n**Kanban** (fluxo contínuo): quadro com colunas (A fazer, Fazendo, Feito) e **limite de itens em andamento**.',
    essencial:
      'Ágil = ciclos curtos + feedback. Scrum usa sprints; Kanban usa fluxo contínuo com limite de trabalho em andamento.',
    guiado:
      'Para começar em Scrum:\n1. Monte o backlog priorizado.\n2. Escolha o que cabe na sprint.\n3. Faça a reunião diária.\n4. Ao final, mostre o resultado (revisão).\n5. Discuta como melhorar (retrospectiva).',
    tecnico:
      'O **Manifesto Ágil** (2001) valoriza indivíduos e interações, software funcionando, colaboração com o cliente e resposta a mudanças. A **velocidade** do time (pontos entregues por sprint) ajuda a prever a capacidade, mas não deve virar cobrança. **Definition of Done** é o acordo do que significa "pronto". O Kanban usa **WIP** (work in progress) para evitar gargalos. Em equipes grandes, há modelos de escala como SAFe e LeSS; em muitas empresas se mistura Scrum com Kanban (Scrumban).',
  },
  analogia: {
    titulo: 'Cozinha de restaurante',
    texto:
      'Em vez de preparar o banquete inteiro e só então servir, a cozinha manda os pratos à mesa conforme ficam prontos. O cliente prova, comenta e o cozinheiro ajusta o próximo prato.',
    limites: 'Em projetos, entregar aos poucos exige que as partes funcionem juntas desde cedo.',
  },
  demo: {
    titulo: 'Prevendo a próxima sprint',
    instrucoes:
      'Execute: a velocidade média das últimas sprints indica quantos pontos o time costuma entregar. Altere os números e veja a previsão mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const entregues = [8, 10, 6, 12];\nconst ultimas = entregues.slice(-3);\nconst soma = ultimas.reduce((a, b) => a + b, 0);\nconst media = Math.round(soma / ultimas.length);\nconsole.log("Últimas sprints:", ultimas.join(", "));\nconsole.log("Velocidade média:", media, "pontos");',
    },
  },
  tecnica: {
    titulo: 'Cascata ou ágil?',
    texto:
      '**Cascata:** requisitos estáveis e bem conhecidos (ex.: sistemas embarcados regulados).\n**Ágil:** requisitos que mudam e cliente disponível para feedback.\n**Híbrido:** planejamento geral + entregas iterativas.\nNão existe método perfeito: escolha pelo contexto.',
  },
  diagrama: {
    titulo: 'Uma sprint',
    nos: [
      { forma: 'inicio', texto: 'Planejamento: escolher itens do backlog' },
      { forma: 'passo', texto: 'Desenvolver com reunião diária' },
      { forma: 'passo', texto: 'Revisão: mostrar o que ficou pronto' },
      { forma: 'fim', texto: 'Retrospectiva: o que melhorar na próxima' },
    ],
    descricao: 'O ciclo recomeça a cada sprint.',
  },
  exemplo: {
    titulo: 'Quadro Kanban em texto',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'A fazer      | Fazendo (limite 2) | Feito\nLogin        | Cadastro           | Tela inicial\nRelatório    | Busca              |\n\nSó entra um novo item em "Fazendo" quando houver vaga.',
    },
    comentarios: [
      { linha: 2, texto: 'O limite de 2 itens força a terminar antes de começar algo novo.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const pontos = [8, 10, 6, 12];\nconst ultimas = pontos.slice(-3);\nconst soma = ultimas.reduce((a, b) => a + b, 0);\nconsole.log(Math.round(soma / ultimas.length));',
      ['9'],
      'As três últimas são 10, 6 e 12: soma 28, média 9,33 e arredondando dá 9.',
      [{ resposta: '7', feedback: 'Use apenas as três últimas sprints.' }],
    ),
    mc(
      'Qual é a função do limite de itens em andamento (WIP) no Kanban?',
      'Evitar gargalos, forçando a terminar antes de começar',
      [
        ['Impedir que o time use o quadro', 'O quadro é a ferramenta central do Kanban.'],
        ['Aumentar o número de reuniões', 'Não tem relação com reuniões.'],
      ],
      'Menos trabalho em paralelo, mais fluxo.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const sprints = [5, 5, 5, 5];\nconst ultimas = sprints.slice(-3);\nconst media = ultimas.reduce((a, b) => a + b, 0) / ultimas.length;\nconsole.log(media);',
      ['5'],
      'Média de três valores iguais a 5.',
      [{ resposta: '15', feedback: 'Lembre de dividir pela quantidade.' }],
    ),
    mc(
      'Quem define a prioridade do backlog no Scrum?',
      'O Product Owner',
      [
        ['O Scrum Master sozinho', 'O Scrum Master facilita, não prioriza.'],
        ['O primeiro desenvolvedor que chegar', 'A prioridade vem do valor para o negócio.'],
      ],
      'O PO representa o cliente.',
    ),
  ],
  desafio: programaJs(
    'Escreva proximaSprint(historico): recebe a lista de pontos entregues nas sprints passadas e devolve a previsão: a média arredondada (Math.round) das últimas 3 sprints. Se a lista estiver vazia, devolva 0.',
    'function proximaSprint(historico) {\n  // seu código aqui\n}',
    'function proximaSprint(historico) {\n  if (historico.length === 0) return 0;\n  const ultimas = historico.slice(-3);\n  const soma = ultimas.reduce((a, b) => a + b, 0);\n  return Math.round(soma / ultimas.length);\n}',
    'proximaSprint',
    [
      { argumentos: [[8, 10, 6, 12]], esperado: 9 },
      { argumentos: [[5]], esperado: 5 },
      { argumentos: [[]], esperado: 0 },
      { argumentos: [[4, 4, 4]], esperado: 4 },
    ],
    ['slice(-3) pega os três últimos.', 'Cuide da lista vazia antes de dividir.'],
    'A velocidade média ajuda a planejar, não a cobrar.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Sprint', 'Ciclo curto que entrega algo utilizável'],
        ['Backlog', 'Lista priorizada do que fazer'],
        ['Retrospectiva', 'Reunião para melhorar o processo'],
        ['WIP', 'Limite de itens em andamento no Kanban'],
      ],
      'Vocabulário de métodos ágeis.',
    ),
    completar(
      'Complete: o ciclo de tempo fixo do Scrum.',
      'O time entrega algo a cada ___.',
      [{ aceitas: ['sprint', 'Sprint'], feedback: 'A sprint dura de 1 a 4 semanas.' }],
      'É o coração do Scrum.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre cascata e ágil e quando usar cada um.',
    modelo:
      'No cascata, as fases são sequenciais e o cliente só vê o resultado no fim; é indicado quando os requisitos são estáveis. No ágil, o trabalho é dividido em iterações curtas com feedback constante, o que permite se adaptar a mudanças; é indicado quando os requisitos mudam.',
    rubrica: [
      'Descreveu o cascata',
      'Descreveu o ágil (iterações e feedback)',
      'Indicou quando usar cada um',
    ],
  },
  resumo: [
    'Ágil = ciclos curtos e feedback.',
    'Scrum: sprint, backlog, PO, Scrum Master.',
    'Kanban: fluxo contínuo e limite de WIP.',
    'Escolha o método pelo contexto.',
  ],
  cards: [
    ['O que é uma sprint?', 'Ciclo curto que entrega algo utilizável.'],
    ['Quem prioriza o backlog?', 'O Product Owner.'],
    ['O que é WIP?', 'Limite de itens em andamento.'],
    ['O que é Definition of Done?', 'O acordo do que significa "pronto".'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: planejamento e abstração de problemas.',
      'Programação Orientada a Objetos: entregas incrementais do modelo.',
      'Infraestrutura: entrega contínua com ciclos curtos.',
    ],
    profissional:
      'Quase todas as empresas de tecnologia usam alguma forma de Scrum ou Kanban no dia a dia.',
  },
});
