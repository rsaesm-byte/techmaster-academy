import { associar, completar, mc, montar, ordenar } from '../fundamentos/montar';

export const w02 = montar({
  id: 'web.m01.a02',
  titulo: 'CSS: cores, texto, a caixa e a cascata',
  objetivo:
    'Estilizar com seletores, propriedades e o modelo de caixa, e entender a cascata e a especificidade.',
  pre: ['web.m01.a01'],
  min: 30,
  diag: mc(
    'Qual linguagem controla as cores e o tamanho do texto de uma página?',
    'CSS',
    [
      ['HTML', 'O HTML descreve a estrutura.'],
      ['SQL', 'SQL é para bancos de dados.'],
    ],
    'CSS cuida da apresentação visual.',
  ),
  simples: {
    titulo: 'Regras de estilo',
    texto:
      'Uma regra CSS tem **seletor** (quem recebe o estilo) e **declarações** (o que mudar):\n\n```\nh1 {\n  color: #1d4ed8;\n  font-size: 2rem;\n}\n.destaque { background: #fef3c7; }\n#topo { margin-bottom: 24px; }\n```\n\n- `h1`: seletor de **tag**.\n- `.destaque`: seletor de **classe** (reutilizável).\n- `#topo`: seletor de **id** (único na página).\n\nTodo elemento é uma **caixa**: conteúdo, **padding** (espaço interno), **border** (borda) e **margin** (espaço externo).',
    essencial:
      'Seletor + declarações. Classes são o seletor mais usado. Toda caixa tem conteúdo, padding, borda e margem.',
    guiado:
      'Para estilizar um elemento:\n1. Dê a ele uma `class` no HTML.\n2. Escreva `.classe { ... }` no CSS.\n3. Defina cor, tamanho e espaçamentos.\n4. Teste no navegador e ajuste.',
    tecnico:
      'A **cascata** resolve conflitos: vence a regra mais **específica** (id > classe > tag); em empate, a que vem **depois**. Algumas propriedades são **herdadas** pelos filhos (cor e fonte), outras não (borda e margem). Com `box-sizing: border-box`, a largura inclui padding e borda, o que simplifica cálculos. Prefira unidades **relativas** (`rem`, `%`, `vw`) para texto e layouts adaptáveis, e `px` para detalhes finos. O contraste de cores deve atender a WCAG (mínimo 4,5:1 para texto comum).',
  },
  analogia: {
    titulo: 'Moldura de quadro',
    texto:
      'Cada elemento é um quadro: a pintura é o conteúdo, o espaço entre a pintura e a moldura é o padding, a moldura é a borda e o espaço entre este quadro e os vizinhos na parede é a margem.',
    limites: 'Diferente da parede, os elementos web podem se redimensionar conforme a tela.',
  },
  demo: {
    titulo: 'Pinte o cartão',
    instrucoes:
      'Mude a cor do título, aumente o padding do cartão e troque o arredondamento da borda. Depois teste: dê ao parágrafo a classe "aviso" e veja a regra mais específica vencer.',
    simulacao: {
      tipo: 'editor',
      html: '<div class="cartao">\n  <h1>Olá, CSS!</h1>\n  <p>Este é um cartão estilizado.</p>\n  <p class="aviso">Este parágrafo tem a classe aviso.</p>\n</div>',
      css: 'body { font-family: system-ui, sans-serif; background: #f1f5f9; padding: 24px; }\n.cartao {\n  background: white;\n  padding: 16px;\n  border: 2px solid #1d4ed8;\n  border-radius: 12px;\n  max-width: 320px;\n}\nh1 { color: #1d4ed8; font-size: 1.6rem; }\np { color: #334155; }\n.aviso { background: #fef3c7; padding: 8px; }',
      js: '',
    },
  },
  tecnica: {
    titulo: 'Propriedades essenciais',
    texto:
      '**Texto:** `color`, `font-size`, `font-family`, `font-weight`, `line-height`, `text-align`.\n**Caixa:** `padding`, `margin`, `border`, `border-radius`, `width`, `max-width`.\n**Fundo:** `background`, `box-shadow`.\n**Cores:** nomes (`red`), hexadecimal (`#1d4ed8`), `rgb()` e `hsl()`.\n**Estados:** `a:hover`, `button:focus-visible` (nunca remova o foco visível).',
  },
  diagrama: {
    titulo: 'Quem vence um conflito de regras',
    nos: [
      { forma: 'inicio', texto: 'Duas regras mudam a mesma propriedade' },
      { forma: 'decisao', texto: 'Uma delas é mais específica?' },
      { forma: 'passo', texto: 'Sim: a mais específica vence (id > classe > tag)' },
      { forma: 'fim', texto: 'Se empatar, vence a que aparece por último' },
    ],
    descricao: 'Especificidade primeiro; em empate, a ordem.',
  },
  exemplo: {
    titulo: 'Botão com estilos e estado',
    codigo: {
      linguagem: 'css',
      fonte:
        '.botao {\n  background: #1d4ed8;\n  color: white;\n  padding: 12px 20px;\n  border-radius: 8px;\n}\n.botao:hover { background: #1e40af; }',
    },
    comentarios: [
      { linha: 1, texto: 'Seletor de classe: vale para qualquer elemento com class="botao".' },
      { linha: 3, texto: 'Padding: 12px em cima e embaixo, 20px nas laterais.' },
      { linha: 6, texto: ':hover aplica o estilo quando o mouse passa por cima.' },
    ],
  },
  guiado: [
    mc(
      'Qual seletor aplica estilo a todos os elementos com class="aviso"?',
      '.aviso',
      [
        ['#aviso', 'O # seleciona por id, e não por classe.'],
        ['aviso', 'Sem ponto, seria uma tag <aviso>.'],
      ],
      'O ponto indica classe.',
    ),
    mc(
      'Na caixa de um elemento, qual é o espaço ENTRE o conteúdo e a borda?',
      'Padding',
      [
        ['Margin', 'A margem fica fora da borda.'],
        ['Outline', 'O contorno é outra coisa.'],
      ],
      'Padding é interno; margin é externo.',
    ),
  ],
  indep: [
    completar(
      'Complete para deixar o texto do parágrafo vermelho.',
      'p {\n  ___: red;\n}',
      [{ aceitas: ['color'], feedback: 'color define a cor do texto.' }],
      'background-color seria a cor de fundo.',
      'css',
    ),
    completar(
      'Complete para arredondar os cantos do cartão.',
      '.cartao {\n  border-___: 12px;\n}',
      [{ aceitas: ['radius'], feedback: 'border-radius arredonda os cantos.' }],
      'Quanto maior o valor, mais redondo.',
      'css',
    ),
  ],
  desafio: ordenar(
    'Ordene as regras do MAIS específico para o MENOS específico.',
    ['Seletor de id (#topo)', 'Seletor de classe (.destaque)', 'Seletor de tag (p)'],
    'Id vence classe, que vence tag.',
  ),
  rec: [
    associar(
      'Associe a propriedade ao efeito.',
      [
        ['padding', 'Espaço interno entre o conteúdo e a borda'],
        ['margin', 'Espaço externo entre elementos'],
        ['border-radius', 'Cantos arredondados'],
        ['line-height', 'Altura entre as linhas do texto'],
      ],
      'Propriedades da caixa e do texto.',
    ),
    mc(
      'Por que preferir rem a px para tamanhos de texto?',
      'Porque rem respeita o tamanho de fonte configurado pelo usuário',
      [
        [
          'Porque a unidade px não funciona direito em telas de celular',
          'O px funciona; ele só ignora a preferência de fonte do usuário.',
        ],
        [
          'Porque o rem gera textos sempre maiores e mais fáceis de ler',
          'O rem não é maior: acompanha a configuração do usuário.',
        ],
      ],
      'Unidades relativas ajudam na acessibilidade.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o modelo de caixa e como a cascata resolve conflitos de estilo.',
    modelo:
      'Todo elemento é uma caixa com conteúdo, padding (espaço interno), borda e margem (espaço externo). Quando duas regras definem a mesma propriedade, vence a mais específica (id, depois classe, depois tag); se empatar, vale a que vem por último.',
    rubrica: [
      'Descreveu as partes da caixa',
      'Explicou a especificidade',
      'Explicou o desempate pela ordem',
    ],
  },
  resumo: [
    'Regra CSS = seletor + declarações.',
    'Classes (.x) são o seletor mais usado.',
    'Caixa: conteúdo, padding, borda, margem.',
    'Cascata: especificidade e depois a ordem.',
  ],
  cards: [
    ['Seletor de classe?', '.nome'],
    ['Seletor de id?', '#nome'],
    ['Espaço interno?', 'padding.'],
    ['Quem vence um conflito?', 'A regra mais específica.'],
  ],
  conexoes: {
    disciplinas: [
      'UX/UI: cor, contraste e espaçamento são decisões de design.',
      'JavaScript: trocar classes é como a página reage a eventos.',
      'Matemática: proporções e unidades relativas.',
    ],
    profissional:
      'CSS bem organizado, com classes reutilizáveis, é a diferença entre uma página mantível e um emaranhado de exceções.',
  },
});
