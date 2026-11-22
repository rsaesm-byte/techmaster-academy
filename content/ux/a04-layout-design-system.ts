import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ux04 = montar({
  id: 'ux.m01.a04',
  titulo: 'Tipografia, layout e design systems',
  objetivo:
    'Organizar hierarquia visual, espaçamento e tipografia com escalas e componentes reutilizáveis.',
  pre: ['ux.m01.a03'],
  min: 30,
  diag: mc(
    'Em uma tela, tudo tem o mesmo tamanho e peso. O que o usuário sente?',
    'Dificuldade de saber o que é mais importante',
    [
      ['Mais clareza', 'Sem hierarquia, a clareza diminui.'],
      ['Nada, pois o tamanho não importa', 'Hierarquia guia o olhar.'],
    ],
    'Tamanho, peso e espaço criam hierarquia.',
  ),
  simples: {
    titulo: 'Ordem visual',
    texto:
      '**Hierarquia visual** diz ao olhar **por onde começar**. Ela vem de tamanho, peso, cor, contraste e espaço.\n\n**Tipografia:**\n- Poucas famílias (1 ou 2).\n- Uma **escala tipográfica** com tamanhos que crescem por uma razão (por exemplo, 1,25): 16, 20, 25, 31...\n- Corpo de texto entre **16 e 18 px**, com **entrelinha** de cerca de 1,5.\n- Linhas com 50 a 75 caracteres.\n\n**Espaçamento:** use uma **grade de 8 px** (8, 16, 24, 32...). Consistência cria ritmo e organização. **Proximidade** agrupa: itens relacionados ficam perto; os separados ficam longe.\n\n**Design system:** o conjunto de **tokens** (cores, tamanhos, espaços), **componentes** (botão, campo, cartão) e **regras de uso**. Garante **consistência** e acelera o trabalho. Exemplos: Material Design, Carbon, Polaris.',
    essencial:
      'Hierarquia guia o olhar. Use escalas (tipográfica e de espaço) e um design system com tokens e componentes para manter a consistência.',
    guiado:
      'Para organizar uma tela:\n1. Defina o que é mais importante e destaque.\n2. Use a escala de tamanhos e a grade de 8 px.\n3. Agrupe por proximidade.\n4. Reaproveite componentes.\n5. Peça a alguém para olhar por 5 segundos e dizer o que viu.',
    tecnico:
      'Em CSS, os tokens viram **variáveis** (`--cor-primaria`, `--espaco-2`). A **escala modular** multiplica o tamanho-base por uma razão: `base × razão^n`. **Layouts** usam **Grid** (duas dimensões) e **Flexbox** (uma dimensão) com **breakpoints** responsivos. O **Atomic Design** organiza componentes em átomos, moléculas, organismos, templates e páginas. Os princípios **Gestalt** (proximidade, similaridade, continuidade, fechamento) explicam como agrupamos elementos. Um design system precisa de **governança** e documentação para não virar uma biblioteca abandonada.',
  },
  analogia: {
    titulo: 'Peças de Lego',
    texto:
      'Com um conjunto de peças padronizadas, qualquer pessoa monta novas construções que combinam entre si. O design system é essa caixa de peças: cores, espaços e componentes que se encaixam.',
    limites:
      'Regras rígidas demais engessam; o sistema precisa deixar espaço para exceções justificadas.',
  },
  demo: {
    titulo: 'Uma escala tipográfica',
    instrucoes:
      'Execute: a escala cresce 25% a cada passo. Troque a razão para 1.5 e veja os tamanhos mudarem.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const base = 16;\nconst razao = 1.25;\nconst tamanhos = [];\nfor (let i = 0; i < 5; i++) {\n  tamanhos.push(Math.round(base * Math.pow(razao, i) * 10) / 10);\n}\nconsole.log("Escala:", tamanhos.join(", "), "px");\nconsole.log("Espaços (grade de 8):", [1, 2, 3, 4].map((n) => n * 8).join(", "), "px");',
    },
  },
  tecnica: {
    titulo: 'Tokens em CSS',
    texto:
      ':root {\n  --cor-primaria: #1a56db;\n  --espaco-2: 16px;\n  --fonte-base: 1rem;\n}\n.botao {\n  background: var(--cor-primaria);\n  padding: var(--espaco-2);\n}\nMudar o token muda todo o sistema.',
  },
  diagrama: {
    titulo: 'Do token ao produto',
    nos: [
      { forma: 'inicio', texto: 'Tokens: cores, tamanhos e espaços' },
      { forma: 'passo', texto: 'Componentes usam os tokens' },
      { forma: 'passo', texto: 'Telas montam componentes' },
      { forma: 'fim', texto: 'Uma mudança no token se propaga a todo o produto' },
    ],
    descricao: 'Consistência em escala.',
  },
  exemplo: {
    titulo: 'Escala de espaçamento',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '--espaco-1: 8px\n--espaco-2: 16px\n--espaco-3: 24px\n--espaco-4: 32px\nCartão: padding 16px; entre cartões: 24px',
    },
    comentarios: [
      { linha: 1, texto: 'Todos múltiplos de 8.' },
      { linha: 5, texto: 'Mais espaço entre grupos do que dentro deles.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const base = 16;\nconsole.log(base * 1.25 * 1.25);',
      ['25'],
      '16 × 1,25 = 20 e 20 × 1,25 = 25.',
      [{ resposta: '20', feedback: 'Multiplique duas vezes.' }],
    ),
    mc(
      'O que é um design system?',
      'Conjunto de tokens, componentes e regras de uso',
      [
        ['Uma ferramenta de desenho', 'Ele não é uma ferramenta de desenho.'],
        ['Um banco de imagens', 'Ele vai além de imagens.'],
      ],
      'Consistência e reuso.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const unidade = 8;\nconsole.log([1, 2, 3].map((n) => n * unidade).join(","));',
      ['8,16,24'],
      'Cada número vezes 8.',
      [{ resposta: '1,2,3', feedback: 'Multiplique cada um por 8.' }],
    ),
    mc(
      'O que é o princípio da proximidade?',
      'Itens relacionados devem ficar perto e os não relacionados, mais separados',
      [
        ['Todos os itens ficam colados', 'Isso apagaria os grupos.'],
        ['Os itens ficam em ordem alfabética', 'Proximidade trata de distância.'],
      ],
      'Agrupar pelo espaço.',
    ),
  ],
  desafio: programaJs(
    'Escreva escalaTipografica(base, razao, n): devolva uma lista com n tamanhos, onde o i-ésimo (a partir de 0) é base × razao^i, arredondado para 1 casa decimal (Math.round(x * 10) / 10).',
    'function escalaTipografica(base, razao, n) {\n  // seu código aqui\n}',
    'function escalaTipografica(base, razao, n) {\n  const tamanhos = [];\n  for (let i = 0; i < n; i++) {\n    tamanhos.push(Math.round(base * Math.pow(razao, i) * 10) / 10);\n  }\n  return tamanhos;\n}',
    'escalaTipografica',
    [
      { argumentos: [16, 1.25, 3], esperado: [16, 20, 25] },
      { argumentos: [16, 1.5, 2], esperado: [16, 24] },
      { argumentos: [10, 2, 0], esperado: [] },
    ],
    ['Use Math.pow(razao, i).', 'O primeiro tamanho (i = 0) é a própria base.'],
    'Escalas dão ritmo e coerência à tipografia.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Token de design', 'Valor nomeado (cor, espaço, tamanho) reutilizável'],
        ['Componente', 'Peça de interface reutilizável, como um botão'],
        ['Hierarquia visual', 'Ordem em que o olhar percorre a tela'],
        ['Entrelinha', 'Espaço vertical entre as linhas de texto'],
      ],
      'Vocabulário de design visual.',
    ),
    completar(
      'Complete: a unidade da grade de espaçamento mais comum.',
      'A grade de espaçamento costuma usar múltiplos de ___ px.',
      [{ aceitas: ['8'], feedback: '8, 16, 24, 32...' }],
      'Cria ritmo e consistência.',
    ),
  ],
  explique: {
    enunciado: 'Explique como a hierarquia visual e um design system ajudam o usuário e a equipe.',
    modelo:
      'A hierarquia visual (tamanho, peso, cor e espaço) guia o olhar do usuário para o que importa. Um design system reúne tokens, componentes e regras que garantem consistência entre telas e aceleram o trabalho da equipe, pois as peças são reaproveitadas.',
    rubrica: [
      'Explicou a hierarquia visual',
      'Definiu design system',
      'Citou consistência e reuso',
    ],
  },
  resumo: [
    'Hierarquia guia o olhar.',
    'Escalas: tipográfica e grade de 8 px.',
    'Proximidade agrupa.',
    'Design system: tokens + componentes + regras.',
  ],
  cards: [
    ['O que é hierarquia visual?', 'A ordem em que o olhar percorre a tela.'],
    ['O que é um token?', 'Valor nomeado e reutilizável.'],
    ['Qual o corpo de texto ideal?', 'Entre 16 e 18 px.'],
    ['O que são os princípios Gestalt?', 'Regras de como agrupamos elementos visualmente.'],
  ],
  conexoes: {
    disciplinas: [
      'Web: variáveis CSS, Flexbox e Grid.',
      'Programação Orientada a Objetos: componentes reutilizáveis.',
      'Engenharia de Software: bibliotecas de componentes.',
    ],
    profissional:
      'Grandes produtos mantêm design systems para entregar rápido sem perder consistência.',
  },
});
