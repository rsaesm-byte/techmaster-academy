import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ux01 = montar({
  id: 'ux.m01.a01',
  titulo: 'UX e pesquisa com usuários',
  objetivo:
    'Entender o que é experiência do usuário e como pesquisar necessidades reais antes de desenhar.',
  pre: ['web.m01.a01'],
  min: 30,
  diag: mc(
    'Uma equipe passa meses criando um app de que ninguém gosta. Qual passo provavelmente foi pulado?',
    'Conversar com os usuários antes de construir',
    [
      [
        'Escolher a paleta de cores e o estilo dos botões antes de começar',
        'A aparência não explica um app sem utilidade; falta entender o usuário.',
      ],
      [
        'Dimensionar os servidores e a infraestrutura para suportar muita gente',
        'Infraestrutura não resolve a falta de necessidade real.',
      ],
    ],
    'Pesquisa antes de design.',
  ),
  simples: {
    titulo: 'Desenhar para pessoas reais',
    texto:
      '**UX (User Experience)** é a experiência completa de uma pessoa ao usar um produto: se ela **alcança seu objetivo**, com **facilidade** e **satisfação**.\n\n**UI (User Interface)** é a parte visível: telas, cores, botões. UI faz parte de UX, mas UX também inclui pesquisa, fluxo, texto e suporte.\n\nO processo costuma seguir o **Design Thinking**:\n1. **Empatizar:** entrevistar e observar usuários.\n2. **Definir:** o problema real.\n3. **Idear:** gerar soluções.\n4. **Prototipar:** criar versões rápidas.\n5. **Testar:** validar com pessoas.\n\nFerramentas da pesquisa:\n- **Persona:** retrato fictício baseado em dados de um usuário típico.\n- **Jornada do usuário:** as etapas do contato com o produto, com emoções e dores.\n- **NPS:** pergunta "de 0 a 10, você nos recomendaria?". **Promotores** dão 9 ou 10, **detratores** dão 0 a 6. NPS = % promotores − % detratores.',
    essencial:
      'UX é a experiência inteira; UI é a parte visível. Pesquise antes de desenhar: entrevistas, personas, jornadas. NPS mede a satisfação.',
    guiado:
      'Para começar uma pesquisa:\n1. Defina o que quer descobrir.\n2. Entreviste de 5 a 8 pessoas.\n3. Pergunte sobre comportamentos reais, não opiniões.\n4. Agrupe os achados em temas.\n5. Escreva as dores e as oportunidades.',
    tecnico:
      '**Pesquisa qualitativa** (entrevistas, observação) responde ao "porquê"; a **quantitativa** (pesquisas, métricas) responde ao "quanto". Evite **perguntas indutoras** ("você gostou do nosso ótimo app?"). O **viés de confirmação** leva a ouvir só o que confirma suas ideias. **Personas** devem vir de dados, e não de suposições. O **mapa de empatia** organiza o que o usuário pensa, sente, diz e faz. O **Jobs to be Done** foca na tarefa que a pessoa quer cumprir. Métricas úteis: taxa de conclusão de tarefas, tempo na tarefa e CSAT.',
  },
  analogia: {
    titulo: 'Médico que escuta antes de receitar',
    texto:
      'Um bom médico pergunta e examina antes de indicar o tratamento. Receitar sem ouvir é arriscado. O designer de UX escuta e observa antes de desenhar a solução.',
    limites:
      'Usuários nem sempre sabem dizer o que precisam: observar o que fazem vale mais que só ouvir o que dizem.',
  },
  demo: {
    titulo: 'Calculando o NPS',
    instrucoes:
      'Execute e veja o NPS de uma pesquisa. Troque as notas e observe o resultado mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const notas = [10, 9, 9, 8, 7, 6, 3, 10];\nconst promotores = notas.filter((n) => n >= 9).length;\nconst detratores = notas.filter((n) => n <= 6).length;\nconst nps = Math.round(((promotores - detratores) * 100) / notas.length);\nconsole.log("Promotores:", promotores, "| Detratores:", detratores);\nconsole.log("NPS:", nps);',
    },
  },
  tecnica: {
    titulo: 'Boas perguntas de entrevista',
    texto:
      '**Faça:** "Conte a última vez que você pediu comida pelo celular."\n**Evite:** "Você usaria um app que faz X?" (as pessoas dizem sim por educação).\n**Aprofunde:** "Por quê?" e "Como foi isso?".\n**Escute mais do que fale.**',
  },
  diagrama: {
    titulo: 'Design Thinking',
    nos: [
      { forma: 'inicio', texto: 'Empatizar: pesquisar os usuários' },
      { forma: 'passo', texto: 'Definir o problema' },
      { forma: 'passo', texto: 'Idear e prototipar' },
      { forma: 'fim', texto: 'Testar e voltar ao início se preciso' },
    ],
    descricao: 'O processo é um ciclo, e não uma linha reta.',
  },
  exemplo: {
    titulo: 'Uma persona',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Nome: Marina, 34 anos, enfermeira\nObjetivo: pagar contas rapidamente entre plantões\nDor: apps lentos e cheios de etapas\nContexto: usa o celular em pé, com uma mão só',
    },
    comentarios: [
      { linha: 2, texto: 'O objetivo orienta o design.' },
      { linha: 3, texto: 'A dor mostra a oportunidade.' },
      { linha: 4, texto: 'O contexto muda as decisões de interface.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const notas = [10, 9, 6];\nconsole.log(notas.filter((n) => n >= 9).length);',
      ['2'],
      'Os promotores são as notas 9 e 10.',
      [{ resposta: '1', feedback: 'Conte também o 9.' }],
    ),
    mc(
      'Qual a diferença entre UX e UI?',
      'UX é a experiência completa; UI é a parte visual da interface',
      [
        [
          'São dois nomes para o mesmo trabalho de desenhar as telas do produto',
          'UI é parte da UX, mas a UX também inclui pesquisa, fluxo e texto.',
        ],
        [
          'A UI é a pesquisa com usuários e a UX trata apenas das cores e fontes',
          'É o contrário: a UX é a experiência inteira e a UI, a parte visível.',
        ],
      ],
      'UI está dentro da UX.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const notas = [10, 5, 6, 8];\nconsole.log(notas.filter((n) => n <= 6).length);',
      ['2'],
      'As notas 5 e 6 são de detratores.',
      [{ resposta: '1', feedback: 'O 6 também é detrator.' }],
    ),
    mc(
      'Por que evitar perguntas induzidas em entrevistas?',
      'Porque influenciam a resposta e escondem a verdade',
      [
        [
          'Porque ocupam muito tempo da entrevista e cansam quem responde',
          'O problema não é o tamanho: é que induzem a resposta.',
        ],
        [
          'Porque o usuário se sente testado e prefere não responder a perguntas',
          'O ponto é a qualidade da resposta, não o gosto do entrevistado.',
        ],
      ],
      'Pergunte sobre comportamentos reais.',
    ),
  ],
  desafio: programaJs(
    'Escreva nps(notas): calcule o NPS: porcentagem de promotores (notas 9 e 10) menos a de detratores (notas de 0 a 6), arredondada com Math.round. Para lista vazia, devolva 0.',
    'function nps(notas) {\n  // seu código aqui\n}',
    'function nps(notas) {\n  if (notas.length === 0) return 0;\n  const p = notas.filter((n) => n >= 9).length;\n  const d = notas.filter((n) => n <= 6).length;\n  return Math.round(((p - d) * 100) / notas.length);\n}',
    'nps',
    [
      { argumentos: [[10, 9, 8, 7, 6, 0]], esperado: 0 },
      { argumentos: [[10, 10]], esperado: 100 },
      { argumentos: [[]], esperado: 0 },
      { argumentos: [[0, 5]], esperado: -100 },
    ],
    ['Notas 7 e 8 são neutras e contam só no total.', 'Divida pelo total de respostas.'],
    'O NPS vai de −100 a +100.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Persona', 'Retrato fictício de um usuário típico, baseado em dados'],
        ['Jornada do usuário', 'Etapas do contato com o produto, com dores e emoções'],
        ['NPS', '% de promotores menos % de detratores'],
        ['Design Thinking', 'Ciclo de empatizar, definir, idear, prototipar e testar'],
      ],
      'Vocabulário de UX.',
    ),
    completar(
      'Complete: a primeira etapa do Design Thinking.',
      'A primeira etapa é ___ com o usuário.',
      [{ aceitas: ['empatizar'], feedback: 'Entender quem usa o produto.' }],
      'Entrevistas e observação.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre UX e UI e por que pesquisar antes de desenhar.',
    modelo:
      'UX é a experiência completa da pessoa com o produto: objetivos, facilidade e satisfação. UI é a parte visual e interativa (telas, cores, botões), que faz parte da UX. Pesquisar antes de desenhar evita construir soluções para problemas que não existem e revela as necessidades reais dos usuários.',
    rubrica: [
      'Diferenciou UX de UI',
      'Citou pesquisa com usuários',
      'Explicou o benefício de pesquisar antes',
    ],
  },
  resumo: [
    'UX = experiência completa; UI = interface.',
    'Pesquise antes de desenhar.',
    'Persona e jornada organizam os achados.',
    'NPS = % promotores − % detratores.',
  ],
  cards: [
    ['O que é UX?', 'Experiência completa do usuário com o produto.'],
    ['O que é uma persona?', 'Usuário típico fictício, baseado em dados.'],
    ['Quem são os detratores no NPS?', 'Quem dá notas de 0 a 6.'],
    ['O que é Design Thinking?', 'Processo centrado em pessoas, em ciclos.'],
  ],
  conexoes: {
    disciplinas: [
      'Engenharia de Software: histórias de usuário nascem da pesquisa.',
      'HTML, CSS e a Web: o HTML e o CSS materializam a interface.',
      'Estatística: amostras e vieses em pesquisas.',
    ],
    profissional:
      'Empresas que investem em UX costumam ter menos retrabalho e clientes mais satisfeitos.',
  },
});
