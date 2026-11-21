import { associar, mc, montar, prever } from './montar';

export const f02 = montar({
  id: 'fundamentos.m01.a02',
  titulo: 'Texto e hexadecimal: letras também são números',
  objetivo:
    'Explicar como letras viram números (tabela de caracteres e UTF-8) e usar o hexadecimal como forma curta de escrever bytes.',
  pre: ['fundamentos.m01.a01'],
  min: 25,
  diag: mc(
    'O computador só entende números. Como ele guarda a letra "A"?',
    'Cada letra tem um número combinado numa tabela (A = 65)',
    [
      [
        'Guarda uma foto da letra',
        'Isso só vale para imagens; no texto, a letra é um código numérico.',
      ],
      [
        'Guarda a posição dela no teclado',
        'O teclado só envia um código; o que é guardado é o número da tabela de caracteres.',
      ],
    ],
    'Existe uma tabela combinada em que cada caractere tem um número. Esse número é guardado em binário.',
  ),
  simples: {
    titulo: 'Cada letra é um número combinado',
    texto:
      'Para guardar texto, todo mundo concordou numa **tabela de caracteres**: "A" é 65, "B" é 66, "a" é 97, e assim por diante. O padrão atual, o **Unicode**, tem letras de todas as línguas, símbolos e emojis. A forma mais comum de gravar esses números é o **UTF-8**.\n\nEscrever bytes em binário é comprido (01000001). Por isso usamos o **hexadecimal**: base 16, com os dígitos 0–9 e A–F. Cada dígito hexadecimal vale 4 bits, então **um byte são exatamente 2 dígitos hex**: 01000001 = 41.',
    essencial:
      'Letra = número numa tabela (A = 65). Hex = base 16 (0–9, A–F); 1 dígito hex = 4 bits; 1 byte = 2 dígitos hex.',
    guiado:
      'Para ver o código de uma letra:\n1. Procure a letra na tabela: "A" é 65.\n2. Converta 65 para binário: 01000001.\n3. Separe em dois grupos de 4 bits: 0100 e 0001.\n4. Cada grupo vira um dígito hex: 4 e 1. Então "A" = 0x41.',
    tecnico:
      'Unicode associa a cada caractere um code point (ex.: U+0041). UTF-8 codifica code points em 1 a 4 bytes, compatível com ASCII nos primeiros 128 valores. Hexadecimal é base 16: cada dígito é um nibble (4 bits), de modo que um byte é exatamente dois dígitos, o que torna a leitura de dados binários prática.',
  },
  analogia: {
    titulo: 'Um código secreto combinado por todos',
    texto:
      'Pense num caderno de códigos que todos os computadores do mundo carregam: "65 significa A". Quando você envia uma mensagem, ela viaja como números; o destino consulta o mesmo caderno para voltar às letras. Se os dois usarem cadernos diferentes, aparecem aqueles símbolos estranhos (como "Ã©" no lugar de "é").',
    limites:
      'O caderno real (Unicode) é enorme: mais de 150 mil caracteres. E uma "letra" pode ocupar mais de um byte: acentos e emojis usam 2 a 4 bytes em UTF-8.',
  },
  demo: {
    titulo: 'Veja o texto virar bytes',
    instrucoes:
      'Digite "A", depois "a" e compare os códigos (maiúscula e minúscula são números diferentes). Depois digite "é" e um emoji e observe quantos bytes cada um usa.',
    simulacao: { tipo: 'binario', modo: 'texto', bits: 8 },
  },
  tecnica: {
    titulo: 'Hexadecimal e UTF-8 na prática',
    texto:
      '**Dígitos hex:** 0–9 e A=10, B=11, C=12, D=13, E=14, F=15.\n\n**Binário ↔ hex:** agrupe os bits de 4 em 4. 1111 = F; 0100 = 4. Então 01001111 = 0x4F.\n\n**Um byte:** vai de 0x00 a 0xFF (0 a 255).\n\n**Onde aparece:** cores na web (#FF8800 = vermelho 255, verde 136, azul 0), endereços MAC, hashes e dumps de memória.\n\n**UTF-8:** letras sem acento usam 1 byte; "é" usa 2 (0xC3 0xA9); a maioria dos emojis usa 4. Por isso o tamanho em bytes de um texto pode ser maior que o número de caracteres.',
  },
  diagrama: {
    titulo: 'Da letra ao byte',
    nos: [
      { forma: 'inicio', texto: 'Caractere digitado: "A"' },
      { forma: 'passo', texto: 'Tabela Unicode: A corresponde ao número 65' },
      { forma: 'passo', texto: 'UTF-8 grava 65 como o byte 01000001' },
      { forma: 'fim', texto: 'Em hexadecimal, o byte é escrito como 41' },
    ],
    descricao:
      'O caractere "A" é procurado na tabela Unicode e vira o número 65. O UTF-8 grava esse número como o byte 01000001, que escrevemos em hexadecimal como 41.',
  },
  exemplo: {
    titulo: 'Cor #FF8800: três bytes em hexadecimal',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '#FF8800\nFF = 15*16 + 15 = 255  (vermelho)\n88 = 8*16 + 8 = 136    (verde)\n00 = 0                 (azul)\nCor = (255, 136, 0) -> laranja',
    },
    comentarios: [
      { linha: 2, texto: 'FF é o maior byte: vermelho no máximo.' },
      { linha: 3, texto: '88 em hex: 8 vezes 16 mais 8 = 136.' },
      { linha: 5, texto: 'Muito vermelho, um pouco de verde e nenhum azul resulta em laranja.' },
    ],
  },
  guiado: [
    mc(
      'Quantos dígitos hexadecimais são necessários para escrever 1 byte?',
      '2',
      [
        ['8', 'Oito é o número de bits; cada dígito hex já cobre 4 bits.'],
        ['4', 'Quatro é a quantidade de bits de UM dígito hex.'],
      ],
      'Cada dígito hex vale 4 bits, e um byte tem 8 bits: 2 dígitos.',
    ),
    prever(
      'Converta o grupo de 4 bits para um dígito hexadecimal (A = 10, B = 11, ... F = 15).',
      'bits: 1010',
      ['A', '0xA'],
      '1010 = 8 + 2 = 10, que em hexadecimal é a letra A.',
      [{ resposta: '10', feedback: 'Em hexadecimal, 10 é escrito com uma só letra: A.' }],
    ),
  ],
  indep: [
    prever(
      'Quanto vale o byte hexadecimal FF em decimal?',
      'FF = 15 * 16 + 15',
      ['255'],
      '15 × 16 + 15 = 255, o maior valor de um byte.',
      [{ resposta: '256', feedback: '256 não cabe em um byte: o maior é 255.' }],
    ),
    mc(
      'Por que o texto "é" ocupa mais bytes que "e" em UTF-8?',
      'Caracteres fora do ASCII básico usam 2 ou mais bytes',
      [
        [
          'Porque o acento é uma imagem junto da letra',
          'O acento não é imagem: é parte do código do caractere.',
        ],
        [
          'Porque o computador não suporta acentos',
          'Suporta; só que precisa de mais bytes para representá-los.',
        ],
      ],
      'UTF-8 usa 1 byte para os 128 primeiros caracteres (ASCII) e 2 a 4 bytes para os demais, como "é".',
      1,
    ),
  ],
  desafio: associar(
    'Associe cada valor hexadecimal ao seu valor decimal.',
    [
      ['0x0A', '10'],
      ['0x10', '16'],
      ['0x41', '65'],
      ['0xFF', '255'],
    ],
    '0x0A = 10; 0x10 = 1 × 16 = 16; 0x41 = 4 × 16 + 1 = 65 (a letra "A"); 0xFF = 255.',
  ),
  rec: [
    mc(
      'Qual é a vantagem do hexadecimal sobre o binário para escrever bytes?',
      'É mais curto: 2 dígitos por byte em vez de 8',
      [
        [
          'O computador entende hex melhor que binário',
          'O computador só trabalha em binário; o hex é uma notação para humanos.',
        ],
        [
          'Hex guarda mais informação que binário',
          'A informação é a mesma; só muda a forma de escrever.',
        ],
      ],
      'Cada dígito hex representa exatamente 4 bits, então a notação fica 4 vezes mais curta e fácil de converter.',
    ),
    mc(
      'Um texto tem 10 caracteres, e alguns têm acento. Quantos bytes ele ocupa em UTF-8?',
      '10 ou mais, dependendo dos caracteres',
      [
        ['Sempre exatamente 10', 'Só se todos os caracteres usarem 1 byte; acentos usam 2.'],
        ['Sempre 80', 'Isso seria 8 bytes por caractere, o que não acontece em UTF-8.'],
      ],
      'Letras simples usam 1 byte e acentuadas, 2 ou mais. Logo o total é no mínimo 10 bytes.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que "A" e "a" são guardadas de forma diferente no computador.',
    modelo:
      'Cada caractere tem seu próprio número na tabela. "A" é 65 e "a" é 97. Como os números são diferentes, os bytes guardados também são diferentes, mesmo parecendo a mesma letra para nós.',
    rubrica: [
      'Disse que cada caractere tem um número na tabela',
      'Citou que maiúscula e minúscula têm números diferentes',
      'Concluiu que os bytes guardados são diferentes',
    ],
  },
  resumo: [
    'Letras são guardadas como números de uma tabela combinada (Unicode); UTF-8 grava esses números em bytes.',
    'Hexadecimal é base 16 (0–9, A–F); cada dígito equivale a 4 bits.',
    'Um byte são 2 dígitos hex, de 00 a FF (0 a 255).',
    'Acentos e emojis usam mais de 1 byte em UTF-8.',
  ],
  cards: [
    ['Qual o número de "A" na tabela?', '65 (0x41). O "a" minúsculo é 97 (0x61).'],
    [
      'O que é Unicode?',
      'A tabela que dá um número a cada caractere de todas as línguas e símbolos.',
    ],
    ['Quantos bits vale um dígito hexadecimal?', '4 bits.'],
    ['O que significa #FF8800 numa cor?', 'Vermelho 255, verde 136, azul 0 (laranja).'],
  ],
  conexoes: {
    disciplinas: [
      'Desenvolvimento Web: cores CSS em hexadecimal e codificação UTF-8 de páginas.',
      'Segurança: hashes e chaves aparecem sempre em hexadecimal.',
      'Redes: endereços MAC (como 3C:52:82:...) são bytes em hexadecimal.',
    ],
    profissional:
      'Quem faz suporte já viu texto quebrado como "AtenÃ§Ã£o": é UTF-8 lido como se fosse outra codificação. Saber que texto é número com regra de tradução ajuda a diagnosticar e corrigir isso.',
  },
});
