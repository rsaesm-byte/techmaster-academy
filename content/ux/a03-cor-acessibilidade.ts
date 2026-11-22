import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ux03 = montar({
  id: 'ux.m01.a03',
  titulo: 'Cor, contraste e acessibilidade',
  objetivo: 'Usar cor e contraste de forma legível e inclusiva, seguindo as diretrizes da WCAG.',
  pre: ['ux.m01.a02'],
  min: 30,
  diag: mc(
    'Um botão cinza-claro com texto branco é bonito, mas muita gente não consegue ler. Qual é o problema?',
    'Contraste insuficiente entre texto e fundo',
    [
      [
        'Falta de animações para chamar a atenção para o botão',
        'Animação não resolve a leitura; o problema é o contraste.',
      ],
      [
        'O formato arredondado do botão, que confunde quem usa leitor de tela',
        'O formato não impede a leitura; a cor do texto sim.',
      ],
    ],
    'Contraste é legibilidade.',
  ),
  simples: {
    titulo: 'Design para todos',
    texto:
      'Cerca de **1 em cada 4 pessoas** tem alguma deficiência. Além disso, qualquer um pode ter dificuldades temporárias (sol forte na tela, braço quebrado). Design **acessível** ajuda todo mundo.\n\nA **WCAG** define os níveis **A, AA e AAA**. O **AA** é o padrão mais usado.\n\n**Contraste:** a razão entre a luminosidade do texto e do fundo, de 1:1 (igual) a 21:1 (preto no branco).\n- Texto normal: pelo menos **4,5:1** (AA).\n- Texto grande (a partir de 24 px ou 19 px negrito): pelo menos **3:1**.\n\n**Cor nunca deve ser a única informação.** Se um erro só é mostrado em vermelho, quem tem daltonismo não vê. Acrescente **ícone e texto**.\n\nOutras práticas:\n- Tamanho mínimo de alvos de toque (cerca de 44 px).\n- Foco visível no teclado.\n- Texto alternativo nas imagens.\n- Respeito a "reduzir movimento".',
    essencial:
      'Garanta contraste de 4,5:1 para texto normal (WCAG AA). Nunca use só a cor para informar. Pense em teclado, leitor de tela e alvos grandes.',
    guiado:
      'Para checar a acessibilidade:\n1. Meça o contraste dos textos.\n2. Navegue só com o teclado (Tab).\n3. Confira se a cor não é a única pista.\n4. Dê alternativas textuais às imagens.\n5. Teste com um leitor de tela.',
    tecnico:
      'A **luminância relativa** de uma cor sRGB é calculada linearizando cada canal e aplicando **L = 0,2126·R + 0,7152·G + 0,0722·B**. A razão de contraste é **(L1 + 0,05) ÷ (L2 + 0,05)**, com L1 a maior luminância. Os princípios **POUR** da WCAG: Perceptível, Operável, Compreensível e Robusto. O **ARIA** complementa o HTML semântico, mas a regra é "nenhum ARIA é melhor que ARIA ruim". Há 3 tipos comuns de daltonismo: protanopia, deuteranopia e tritanopia. Ferramentas: Lighthouse, axe e simuladores de daltonismo. No Brasil, a **LBI** (Lei Brasileira de Inclusão) exige acessibilidade digital.',
  },
  analogia: {
    titulo: 'Rampas e escadas',
    texto:
      'A rampa construída para cadeirantes também ajuda quem leva um carrinho de bebê ou uma mala. Acessibilidade digital funciona igual: o que ajuda quem tem uma limitação costuma melhorar a experiência de todos.',
    limites: 'Cumprir a norma não garante uma boa experiência: teste com pessoas reais.',
  },
  demo: {
    titulo: 'Calculando o contraste',
    instrucoes:
      'Execute e veja a razão de contraste de algumas combinações. Troque as cores e observe se passam em 4,5.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function lum(hex) {\n  const c = [1, 3, 5]\n    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)\n    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));\n  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];\n}\nfunction contraste(a, b) {\n  const x = lum(a);\n  const y = lum(b);\n  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);\n}\nfor (const [t, f] of [["#000000", "#ffffff"], ["#767676", "#ffffff"], ["#aaaaaa", "#ffffff"]]) {\n  const r = contraste(t, f);\n  console.log(t, "em", f, "->", r.toFixed(2), r >= 4.5 ? "passa (AA)" : "reprova");\n}',
    },
  },
  tecnica: {
    titulo: 'Cor e significado',
    texto:
      '**Não dependa só do vermelho e verde.**\n**Combine** cor, ícone e texto ("Erro: ...").\n**Evite** texto sobre imagens sem um fundo de apoio.\n**Ofereça** modo escuro e alto contraste.',
  },
  diagrama: {
    titulo: 'Verificando um texto',
    nos: [
      { forma: 'inicio', texto: 'Escolher a cor do texto e do fundo' },
      { forma: 'passo', texto: 'Calcular a razão de contraste' },
      { forma: 'decisao', texto: 'É pelo menos 4,5:1?' },
      { forma: 'fim', texto: 'Sim: aprovado. Não: escurecer o texto ou clarear o fundo' },
    ],
    descricao: 'Um ajuste pequeno de tom costuma resolver.',
  },
  exemplo: {
    titulo: 'Erro acessível em HTML',
    codigo: {
      linguagem: 'html',
      fonte:
        '<label for="email">E-mail</label>\n<input id="email" aria-describedby="erro-email" aria-invalid="true">\n<p id="erro-email">⚠ Erro: informe um e-mail válido, como nome@site.com</p>',
    },
    comentarios: [
      { linha: 1, texto: 'O label liga o texto ao campo.' },
      { linha: 2, texto: 'A descrição e o estado de erro vão para o leitor de tela.' },
      { linha: 3, texto: 'Ícone, texto e instrução: não só a cor.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const L1 = 1;\nconst L2 = 0;\nconsole.log(Math.round((L1 + 0.05) / (L2 + 0.05)));',
      ['21'],
      '1,05 dividido por 0,05 dá 21: o contraste máximo.',
      [{ resposta: '1', feedback: 'Divida 1,05 por 0,05.' }],
    ),
    mc(
      'Qual razão de contraste mínima a WCAG AA pede para texto normal?',
      '4,5:1',
      [
        [
          '2:1, que já é suficiente para a maioria das pessoas lerem',
          '2:1 está abaixo do mínimo exigido para texto normal.',
        ],
        [
          '21:1, a razão máxima, que toda página precisa atingir para ser acessível',
          '21:1 é o máximo possível (preto no branco), não o mínimo.',
        ],
      ],
      'Para texto grande, o mínimo é 3:1.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'console.log(Math.round((0.95 + 0.05) / (0.05 + 0.05)));',
      ['10'],
      '1,0 dividido por 0,1 dá 10.',
      [{ resposta: '1', feedback: 'Divida 1 por 0,1.' }],
    ),
    mc(
      'Por que a cor não deve ser a única forma de transmitir uma informação?',
      'Porque pessoas com daltonismo podem não percebê-la',
      [
        [
          'Porque cores diferentes aumentam o custo de impressão e produção',
          'Cor não tem custo; o problema é a percepção.',
        ],
        [
          'Porque alguns navegadores antigos não conseguem exibir as cores',
          'Navegadores mostram cores; o problema é a percepção humana.',
        ],
      ],
      'Use também ícone e texto.',
    ),
  ],
  desafio: programaJs(
    'Escreva contraste(corA, corB): recebe duas cores hexadecimais (como "#000000") e devolve a razão de contraste WCAG, arredondada para 2 casas (use Math.round(x * 100) / 100). Use a fórmula de luminância: canais linearizados e L = 0,2126·R + 0,7152·G + 0,0722·B.',
    'function contraste(corA, corB) {\n  // seu código aqui\n}',
    'function contraste(corA, corB) {\n  const lum = (hex) => {\n    const c = [1, 3, 5]\n      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)\n      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));\n    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];\n  };\n  const x = lum(corA);\n  const y = lum(corB);\n  const razao = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);\n  return Math.round(razao * 100) / 100;\n}',
    'contraste',
    [
      { argumentos: ['#000000', '#ffffff'], esperado: 21 },
      { argumentos: ['#ffffff', '#ffffff'], esperado: 1 },
      { argumentos: ['#767676', '#ffffff'], esperado: 4.54 },
    ],
    ['Cada canal vai de 0 a 255; divida por 255.', 'L1 é a maior luminância entre as duas cores.'],
    '#767676 é o cinza mais claro que passa em AA no fundo branco.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['WCAG', 'Diretrizes internacionais de acessibilidade web'],
        ['Contraste', 'Razão entre as luminâncias do texto e do fundo'],
        ['Texto alternativo', 'Descrição de uma imagem para leitores de tela'],
        ['Foco visível', 'Indicação de qual elemento o teclado seleciona'],
      ],
      'Acessibilidade digital.',
    ),
    completar(
      'Complete: o nível de conformidade mais usado da WCAG.',
      'O nível mais usado como padrão é o ___.',
      [{ aceitas: ['AA', 'aa'], feedback: 'Nível AA.' }],
      'A é o mínimo, AAA o mais exigente.',
    ),
  ],
  explique: {
    enunciado: 'Explique por que o contraste importa e como não depender só de cor para informar.',
    modelo:
      'O contraste garante que o texto seja legível por pessoas com baixa visão, daltonismo ou em condições ruins, como sol forte; a WCAG AA pede 4,5:1 para texto normal. Para não depender só da cor, deve-se combinar cor com ícone e texto, para que a informação chegue a todos.',
    rubrica: [
      'Explicou o papel do contraste',
      'Citou o mínimo da WCAG',
      'Explicou como combinar cor com ícone ou texto',
    ],
  },
  resumo: [
    'Texto normal: contraste mínimo de 4,5:1.',
    'Cor nunca é a única pista.',
    'Teclado, leitor de tela e alvos grandes.',
    'Acessibilidade ajuda todos.',
  ],
  cards: [
    ['Qual o contraste mínimo AA?', '4,5:1 para texto normal.'],
    ['O que são os princípios POUR?', 'Perceptível, Operável, Compreensível e Robusto.'],
    ['O que é texto alternativo?', 'Descrição da imagem para leitores de tela.'],
    ['Qual lei brasileira trata disso?', 'A Lei Brasileira de Inclusão (LBI).'],
  ],
  conexoes: {
    disciplinas: [
      'Web: HTML semântico e formulários acessíveis.',
      'Cibersegurança: CAPTCHAs e autenticação também precisam ser acessíveis.',
      'Engenharia de Software: acessibilidade como requisito não funcional.',
    ],
    profissional: 'Sites acessíveis alcançam mais pessoas e reduzem riscos legais.',
  },
});
