import { mc, montar, prever } from './montar';

export const f01 = montar({
  id: 'fundamentos.m01.a01',
  titulo: 'Bits e binário: a língua do computador',
  objetivo:
    'Explicar o que é um bit e um byte, converter números entre binário e decimal usando os pesos das posições e entender o que é estouro (overflow).',
  pre: [],
  min: 25,
  diag: mc(
    'Um computador só "enxerga" dois estados elétricos (ligado e desligado). Como ele guarda o número 5?',
    'Combinando vários bits: 0101',
    [
      [
        'Tem um fio especial só para o 5',
        'Não existe um fio por número: a ideia é combinar poucos estados.',
      ],
      [
        'Guarda a palavra "cinco" como o ser humano escreve',
        'Tudo vira bits primeiro; o texto também é uma combinação deles.',
      ],
    ],
    'Cada bit é um 0 ou 1. Combinando vários, representamos qualquer número, letra, cor ou som.',
  ),
  simples: {
    titulo: 'Zero e um: só isso',
    texto:
      'Um **bit** é a menor informação possível: 0 ou 1. Um grupo de 8 bits é um **byte**.\n\nNo dia a dia usamos o sistema **decimal**, com 10 símbolos (0 a 9). O computador usa o **binário**, com 2 símbolos. A ideia é a mesma: cada posição vale um **peso**. No decimal, os pesos são 1, 10, 100... No binário, são 1, 2, 4, 8, 16... (dobrando a cada posição).',
    essencial:
      'Bit = 0 ou 1. Byte = 8 bits. Pesos do binário: 1, 2, 4, 8, 16... Some os pesos das posições com 1.',
    guiado:
      'Para converter 1011 em decimal:\n1. Escreva os pesos de trás para a frente: 8, 4, 2, 1.\n2. Marque onde há bit 1: 8, 2 e 1.\n3. Some: 8 + 2 + 1 = 11.\nPara o caminho inverso, vá tirando o maior peso que cabe.',
    tecnico:
      'Sistema posicional de base 2: o valor é a soma de bit_i × 2^i. Com n bits sem sinal, representam-se 2^n valores (0 a 2^n − 1). Números negativos usam complemento de dois, em que o bit mais à esquerda tem peso negativo.',
  },
  analogia: {
    titulo: 'Interruptores de luz',
    texto:
      'Imagine uma fileira de interruptores: cada um está ligado (1) ou desligado (0). Com 8 interruptores você monta 256 combinações diferentes. Cada interruptor vale o dobro do vizinho da direita: o primeiro vale 1, o segundo 2, o terceiro 4, e assim por diante.',
    limites:
      'Interruptores de verdade são físicos e fazem barulho; os bits são tensões elétricas minúsculas, trocadas bilhões de vezes por segundo. Além disso, o "significado" de uma sequência de bits depende de quem lê: pode ser número, letra ou cor.',
  },
  demo: {
    titulo: 'Ligue e desligue os bits',
    instrucoes:
      'Clique nos bits para ligá-los e desligá-los e veja o valor decimal mudar. Depois tente: (1) formar o número 37; (2) ligar todos os bits e ver o maior valor de 1 byte; (3) trocar para 4 bits e comparar.',
    simulacao: { tipo: 'binario', modo: 'bits', bits: 8 },
  },
  tecnica: {
    titulo: 'Pesos, faixa de valores e estouro',
    texto:
      '**Pesos:** em n bits, a posição i (contando da direita, a partir de 0) vale 2^i.\n\n**Faixa:** n bits sem sinal vão de 0 até 2^n − 1. Com 8 bits: 0 a 255. Com 16: 0 a 65 535.\n\n**Quantos bits preciso?** Procure a menor potência de 2 maior que o maior valor. Para guardar até 100, 2^7 = 128 serve (7 bits).\n\n**Estouro (overflow):** se o resultado não cabe, o bit mais à esquerda "sai" e sobra o resto: 255 + 1 em 8 bits dá 0.\n\n**Com sinal:** em complemento de dois, o bit mais à esquerda indica o sinal. Em 8 bits, a faixa vai de −128 a 127.',
  },
  diagrama: {
    titulo: 'Converter decimal em binário',
    nos: [
      { forma: 'inicio', texto: 'Número N e a lista de pesos (128, 64, 32, 16, 8, 4, 2, 1)' },
      { forma: 'decisao', texto: 'O peso atual cabe em N?' },
      { forma: 'passo', texto: 'Sim: escreva 1 e subtraia o peso de N. Não: escreva 0' },
      { forma: 'passo', texto: 'Vá para o próximo peso, menor' },
      { forma: 'fim', texto: 'Ao passar por todos os pesos, os bits escritos formam o binário' },
    ],
    descricao:
      'Começa com o número e a lista de pesos, do maior para o menor. Para cada peso, pergunta se ele cabe no que sobrou. Se cabe, escreve 1 e subtrai; senão, escreve 0. Ao acabar os pesos, a sequência de 0 e 1 é o número em binário.',
  },
  exemplo: {
    titulo: 'Convertendo 37 para binário',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'N = 37\n32 cabe? sim -> 1, sobra 5\n16 cabe? não -> 0\n8 cabe?  não -> 0\n4 cabe?  sim -> 1, sobra 1\n2 cabe?  não -> 0\n1 cabe?  sim -> 1, sobra 0\nResultado: 100101',
    },
    comentarios: [
      { linha: 2, texto: 'O 64 e o 128 não cabem em 37, então os bits deles são 0 (omitidos).' },
      { linha: 5, texto: 'Sobrou 5: o 4 cabe, e o 2 não.' },
      { linha: 8, texto: '100101 = 32 + 4 + 1 = 37. Para conferir, some os pesos.' },
    ],
  },
  guiado: [
    mc(
      'Qual é o valor decimal de 1011 (4 bits)?',
      '11',
      [
        ['13', 'Confira os pesos 8, 4, 2, 1: o bit do 4 está desligado.'],
        ['1011', 'Esse é o valor escrito em binário, não em decimal.'],
      ],
      'Pesos 8, 4, 2, 1 com bits 1, 0, 1, 1: 8 + 2 + 1 = 11.',
    ),
    prever(
      'Converta para decimal, somando os pesos das posições com 1.',
      'pesos: 8 4 2 1\nbits:  0 1 0 1',
      ['5'],
      'Só os pesos 4 e 1 estão ligados: 4 + 1 = 5.',
      [{ resposta: '0101', feedback: 'Pedimos o valor em decimal: some os pesos.' }],
      ['Some só os pesos que têm bit 1.'],
    ),
  ],
  indep: [
    mc(
      'Qual é o maior número que cabe em 1 byte, sem sinal?',
      '255',
      [
        ['256', '256 é a quantidade de valores; como começa em 0, o maior é 255.'],
        ['128', '128 é só o peso do bit mais à esquerda.'],
      ],
      '8 bits têm 2^8 = 256 combinações, de 0 a 255.',
      1,
    ),
    prever(
      'Quanto vale 1100 em decimal?',
      'pesos: 8 4 2 1\nbits:  1 1 0 0',
      ['12'],
      '8 + 4 = 12.',
      [{ resposta: '1100', feedback: 'Esse é o binário; a pergunta é o valor decimal.' }],
    ),
  ],
  desafio: mc(
    'Você precisa guardar a idade de uma pessoa (0 a 120). Qual é o MENOR número de bits que resolve?',
    '7 bits',
    [
      ['6 bits', '6 bits vão só até 63 (2^6 − 1), pouco para 120.'],
      ['8 bits', '8 bits resolvem, mas existe uma opção menor: 7 bits já chegam a 127.'],
    ],
    '2^7 = 128 combinações (0 a 127), suficiente para 120. Com 6 bits só chegaríamos a 63.',
    2,
  ),
  rec: [
    mc(
      'Quantos valores diferentes cabem em 8 bits?',
      '256',
      [
        ['255', '255 é o maior valor, mas o 0 também conta: são 256 valores.'],
        ['64', '8 × 8 = 64 não é a conta: cada bit dobra as combinações, 2^8.'],
      ],
      'Cada bit dobra as combinações: 2^8 = 256.',
    ),
    mc(
      'Em 8 bits sem sinal, o que acontece com 255 + 1?',
      'Estoura e o resultado volta a ser 0',
      [
        ['Vira 256 normalmente', 'Não existe o 9º bit para guardar o 256.'],
        [
          'O resultado vira -1, porque o número passa para negativo',
          'Sem sinal não há negativos: o valor volta a 0.',
        ],
      ],
      'O resultado precisaria de 9 bits. O que passa do limite se perde e sobra 00000000.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique com suas palavras como converter 1010 em decimal.',
    modelo:
      'Escrevo os pesos das posições, da direita para a esquerda: 1, 2, 4, 8. Marco onde há bit 1 (o 8 e o 2) e somo esses pesos: 8 + 2 = 10.',
    rubrica: [
      'Citou os pesos das posições (potências de 2)',
      'Disse que soma só os pesos onde o bit é 1',
      'Chegou ao resultado 10',
    ],
  },
  resumo: [
    'Bit é 0 ou 1; byte são 8 bits.',
    'Cada posição do binário vale o dobro da anterior: 1, 2, 4, 8, 16...',
    'n bits representam 2^n valores: de 0 a 2^n − 1 (sem sinal).',
    'Quando o resultado não cabe nos bits, ocorre estouro (overflow).',
  ],
  cards: [
    ['O que é um bit?', 'A menor informação: 0 ou 1.'],
    ['Quantos bits tem um byte?', '8 bits.'],
    ['Quais são os pesos de um byte?', '128, 64, 32, 16, 8, 4, 2 e 1.'],
    [
      'O que é estouro (overflow)?',
      'Quando o resultado não cabe nos bits disponíveis e o excesso se perde.',
    ],
  ],
  conexoes: {
    disciplinas: [
      'Redes: máscaras de sub-rede (como 255.255.255.0) são bytes escritos em decimal.',
      'Linguagens de Programação: tipos como int8 e uint16 definem quantos bits cada número usa.',
      'Segurança: erros de estouro de inteiro já causaram falhas graves em sistemas reais.',
    ],
    profissional:
      'Quem trabalha com TI lê binário o tempo todo sem perceber: permissões de arquivo no Linux, máscaras de rede e flags de configuração são bits. Saber a faixa de cada tipo evita bugs sutis e vulnerabilidades.',
  },
});
