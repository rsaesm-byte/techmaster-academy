import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ia05 = montar({
  id: 'ia.m01.a05',
  titulo: 'IA generativa e uso responsável',
  objetivo:
    'Entender como os modelos de linguagem geram texto e como usar IA com senso crítico e ética.',
  pre: ['ia.m01.a04'],
  min: 30,
  diag: mc(
    'Um assistente de IA responde com muita confiança, mas cita um estudo que não existe. Como se chama isso?',
    'Alucinação',
    [
      ['Compilação', 'Compilar é traduzir código.'],
      ['Normalização', 'É um conceito de bancos de dados.'],
    ],
    'O modelo gera algo plausível, não necessariamente verdadeiro.',
  ),
  simples: {
    titulo: 'Prever a próxima palavra',
    texto:
      'Um **modelo de linguagem (LLM)** é treinado para uma tarefa simples: **prever o próximo pedaço de texto** (um **token**) dado o que veio antes. Repetindo isso, ele escreve parágrafos inteiros.\n\n```\n"O gato subiu no" -> telhado (provável), muro, sofá...\n```\n\nO que torna isso poderoso é a escala (bilhões de parâmetros) e a arquitetura **Transformer**.\n\n**Pontos de atenção:**\n- **Alucinação:** o modelo gera algo plausível, mas falso. **Sempre verifique.**\n- **Viés:** reproduz preconceitos dos dados.\n- **Privacidade:** não cole dados sensíveis em serviços que você não controla.\n- **Direitos autorais e plágio:** cuide da autoria e das fontes.\n- **Prompt:** quanto mais claro o contexto e o formato pedido, melhor a resposta.\n\n**Regra de ouro:** use a IA como **assistente**, e a responsabilidade pelo resultado continua sendo **sua**.',
    essencial:
      'LLMs preveem o próximo token. Podem alucinar, ter viés e vazar dados. Use como assistente, verifique tudo e proteja informações sensíveis.',
    guiado:
      'Para usar bem:\n1. Dê contexto e objetivo claros no prompt.\n2. Peça o formato esperado.\n3. Verifique fatos em fontes confiáveis.\n4. Não envie dados sensíveis.\n5. Revise e assuma a autoria do resultado.',
    tecnico:
      'O texto é dividido em **tokens** (pedaços de palavras). O modelo calcula uma **distribuição de probabilidade** sobre o próximo token; a **temperatura** controla a variedade (baixa = previsível, alta = criativa). O **contexto** é limitado por uma janela de tokens. A **RAG** (geração aumentada por recuperação) consulta documentos externos antes de responder, reduzindo alucinações. O **ajuste fino** e o **RLHF** (feedback humano) alinham o modelo ao comportamento desejado. **Injeção de prompt** é um ataque em que o texto de entrada manipula as instruções do modelo. A **AI Act** europeia e leis como a LGPD regulam usos de risco.',
  },
  analogia: {
    titulo: 'Autocompletar muito avançado',
    texto:
      'O teclado do celular sugere a próxima palavra. Imagine esse recurso treinado com enormes bibliotecas e com capacidade de manter o contexto por páginas. É um autocompletar sofisticado: fluente, mas sem garantia de verdade.',
    limites:
      'A analogia subestima a capacidade dos modelos, mas explica bem por que eles alucinam.',
  },
  demo: {
    titulo: 'Um minimodelo de linguagem',
    instrucoes:
      'Execute: o programa conta quais palavras seguem cada palavra do texto e escolhe a mais comum (um modelo de bigramas). Altere o texto e veja a previsão mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const texto = "o gato viu o rato e o gato fugiu";\nconst palavras = texto.split(" ");\nconst seguintes = {};\nfor (let i = 0; i < palavras.length - 1; i++) {\n  const atual = palavras[i];\n  const prox = palavras[i + 1];\n  seguintes[atual] = seguintes[atual] || {};\n  seguintes[atual][prox] = (seguintes[atual][prox] || 0) + 1;\n}\nconsole.log(JSON.stringify(seguintes["o"]));',
    },
  },
  tecnica: {
    titulo: 'Bom prompt',
    texto:
      '**Papel e objetivo:** "Você é um revisor de texto. Corrija a gramática."\n**Contexto:** explique o público e a situação.\n**Formato:** "Responda em 3 tópicos."\n**Exemplos:** mostre o resultado esperado.\n**Iteração:** refine a partir da resposta.',
  },
  diagrama: {
    titulo: 'Como o texto é gerado',
    nos: [
      { forma: 'inicio', texto: 'Texto de entrada vira tokens' },
      { forma: 'passo', texto: 'O modelo calcula probabilidades do próximo token' },
      { forma: 'passo', texto: 'Escolhe um token (influenciado pela temperatura)' },
      { forma: 'fim', texto: 'Repete até terminar a resposta' },
    ],
    descricao: 'Um token de cada vez.',
  },
  exemplo: {
    titulo: 'Prompt fraco e prompt forte',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Fraco:  "Fale de segurança."\nForte:  "Explique 3 riscos de senhas fracas para iniciantes,\n         em até 5 linhas, com um exemplo cada."',
    },
    comentarios: [
      { linha: 1, texto: 'Vago: a resposta será genérica.' },
      { linha: 2, texto: 'Claro: tema, público, formato e tamanho.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const t = "a b a c a b".split(" ");\nlet n = 0;\nfor (let i = 0; i < t.length - 1; i++) {\n  if (t[i] === "a" && t[i + 1] === "b") n++;\n}\nconsole.log(n);',
      ['2'],
      'O par "a b" aparece duas vezes.',
      [{ resposta: '3', feedback: 'O "a" aparece 3 vezes, mas só 2 são seguidos de "b".' }],
    ),
    mc(
      'O que é alucinação em um modelo de linguagem?',
      'Gerar algo plausível, mas falso, com confiança',
      [
        ['Um erro de compilação', 'É um problema de código, não de geração.'],
        ['Falta de internet', 'Não depende de conexão.'],
      ],
      'Plausível não é verdadeiro.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const seguintes = { gato: 3, rato: 1 };\nconst melhor = Object.entries(seguintes).sort((a, b) => b[1] - a[1])[0][0];\nconsole.log(melhor);',
      ['gato'],
      '"gato" aparece 3 vezes contra 1.',
      [{ resposta: 'rato', feedback: 'Ordene da maior contagem para a menor.' }],
    ),
    mc(
      'Qual cuidado é essencial ao usar IA no trabalho?',
      'Verificar as respostas e não enviar dados sensíveis',
      [
        ['Aceitar tudo, pois a IA nunca erra', 'A IA erra, inclusive com muita confiança.'],
        ['Usar a IA só à noite', 'O horário não importa.'],
      ],
      'Você responde pelo resultado.',
    ),
  ],
  desafio: programaJs(
    'Escreva proximaPalavra(texto, palavra): separe o texto por espaços e conte quais palavras aparecem imediatamente depois de "palavra". Devolva a mais frequente (em empate, a que apareceu primeiro). Se nenhuma palavra vier depois, devolva "" (texto vazio).',
    'function proximaPalavra(texto, palavra) {\n  // seu código aqui\n}',
    'function proximaPalavra(texto, palavra) {\n  const p = texto.split(" ");\n  const cont = new Map();\n  for (let i = 0; i < p.length - 1; i++) {\n    if (p[i] === palavra) {\n      cont.set(p[i + 1], (cont.get(p[i + 1]) || 0) + 1);\n    }\n  }\n  let melhor = "";\n  let max = 0;\n  for (const [w, n] of cont) {\n    if (n > max) {\n      max = n;\n      melhor = w;\n    }\n  }\n  return melhor;\n}',
    'proximaPalavra',
    [
      { argumentos: ['o gato viu o rato e o gato fugiu', 'o'], esperado: 'gato' },
      { argumentos: ['a b', 'b'], esperado: '' },
      { argumentos: ['x y x z', 'x'], esperado: 'y' },
    ],
    [
      'Percorra as posições de 0 até length-2.',
      'Um Map mantém a ordem de inserção, ajudando no empate.',
    ],
    'É a ideia dos modelos de linguagem em miniatura.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Token', 'Pedaço de texto processado pelo modelo'],
        ['Alucinação', 'Resposta plausível, mas falsa'],
        ['RAG', 'Consulta documentos externos antes de responder'],
        ['Injeção de prompt', 'Entrada que manipula as instruções do modelo'],
      ],
      'Vocabulário de IA generativa.',
    ),
    completar(
      'Complete: o pedaço de texto que o modelo prevê a cada passo.',
      'O LLM prevê o próximo ___ a cada passo.',
      [{ aceitas: ['token'], feedback: 'Palavras ou partes de palavras.' }],
      'O texto é gerado token a token.',
    ),
  ],
  explique: {
    enunciado: 'Explique como um LLM gera texto e liste dois cuidados ao usá-lo.',
    modelo:
      'Um LLM prevê o próximo token a partir do contexto, com base em probabilidades aprendidas, e repete o processo para formar o texto. Cuidados: verificar as respostas, pois ele pode alucinar, e não enviar dados sensíveis ou pessoais a serviços sem controle; também é preciso atenção a viés e autoria.',
    rubrica: [
      'Explicou a previsão do próximo token',
      'Citou a alucinação ou verificação',
      'Citou outro cuidado (privacidade, viés ou autoria)',
    ],
  },
  resumo: [
    'LLM prevê o próximo token.',
    'Plausível não é o mesmo que verdadeiro.',
    'Verifique e proteja dados sensíveis.',
    'Bons prompts: contexto, formato e exemplos.',
  ],
  cards: [
    ['O que é um LLM?', 'Modelo de linguagem que prevê o próximo token.'],
    ['O que é alucinação?', 'Resposta plausível e falsa.'],
    ['O que controla a temperatura?', 'A variedade das respostas.'],
    ['O que é RAG?', 'Geração aumentada por recuperação de documentos.'],
  ],
  conexoes: {
    disciplinas: [
      'Cibersegurança: injeção de prompt e vazamento de dados.',
      'Engenharia de Software: assistentes de código, com revisão humana.',
      'Ética: transparência, viés e responsabilidade.',
    ],
    profissional:
      'Saber usar IA com critério já é uma competência valorizada em quase toda profissão de tecnologia.',
  },
});
