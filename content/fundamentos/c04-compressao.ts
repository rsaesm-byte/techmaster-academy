import { associar, mc, montar, prever } from './montar';

export const f14 = montar({
  id: 'fundamentos.m03.a04',
  titulo: 'Compressão: guardar mais em menos espaço',
  objetivo:
    'Explicar como a compressão aproveita repetições, aplicar a codificação por repetições (RLE) e diferenciar compressão sem perdas de compressão com perdas.',
  pre: ['fundamentos.m01.a02', 'fundamentos.m03.a01'],
  min: 25,
  diag: mc(
    'Um arquivo ZIP de texto fica bem menor que o original, e ao descompactar volta idêntico. Como isso é possível?',
    'O ZIP troca padrões repetidos por representações mais curtas, sem descartar informação',
    [
      ['Ele apaga as letras menos importantes', 'No ZIP nada é apagado: o arquivo volta idêntico.'],
      ['Ele guarda o arquivo só pela metade', 'Seria impossível voltar ao original.'],
    ],
    'Compressão sem perdas encontra redundância (repetições) e a representa de forma mais curta. Ao descompactar, o processo é desfeito.',
  ),
  simples: {
    titulo: 'Não escreva duas vezes o que se repete',
    texto:
      'Se você recebe "AAAAAAAAAA" (10 letras A), pode guardar só "10A". Esse é o princípio da **compressão**: encontrar **repetições** e descrevê-las de forma mais curta. O método acima chama-se **RLE** (codificação por repetições): `AAAABBB` vira `4A3B`.\n\nHá dois tipos:\n- **Sem perdas** (ZIP, PNG, FLAC): ao descompactar, volta exatamente igual.\n- **Com perdas** (JPEG, MP3, vídeos): descarta detalhes que quase não percebemos, e economiza bem mais, mas **não** volta idêntico.',
    essencial:
      'Compressão troca repetições por descrições curtas. RLE: AAAABBB → 4A3B. Sem perdas volta idêntico (ZIP); com perdas descarta detalhes (JPEG, MP3).',
    guiado:
      'Para comprimir com RLE:\n1. Leia o texto da esquerda para a direita.\n2. Conte quantas vezes cada letra se repete em sequência.\n3. Escreva a contagem seguida da letra.\n4. Para descomprimir, repita cada letra a quantidade indicada.',
    tecnico:
      'Compressão explora redundância estatística. RLE é eficiente só com longas repetições; sem elas, pode até aumentar o arquivo (ABC vira 1A1B1C). Algoritmos reais, como Deflate (ZIP) e LZ77, usam referências a trechos já vistos e códigos de Huffman, que dão códigos curtos aos símbolos frequentes. Dados já comprimidos ou aleatórios quase não comprimem, e há um limite teórico dado pela entropia.',
  },
  analogia: {
    titulo: 'Contar em vez de listar',
    texto:
      'Em vez de ditar "um, um, um, um, um, um", você diz "seis vezes um". Em vez de escrever "Ana, Ana, Ana", escreve "Ana, três vezes". Compressão é isso: descrever o repetido com menos palavras. Para voltar ao original, basta "desdobrar" a descrição.',
    limites:
      'Se não houver repetição ("A, B, C, D"), contar não ajuda: a descrição fica maior que o texto. Por isso nem todo arquivo comprime bem, e um arquivo já comprimido quase nunca encolhe de novo.',
  },
  demo: {
    titulo: 'Comprima um texto',
    instrucoes:
      'Veja o texto padrão virar uma versão bem mais curta. Depois digite "ABCDEF" (sem repetições) e observe o que acontece. Teste também "AAAAAAAAAAAAAAAA". Em quais casos a compressão compensa?',
    simulacao: { tipo: 'compressao' },
  },
  tecnica: {
    titulo: 'Com perdas, sem perdas e limites',
    texto:
      '**Sem perdas:** o original é recuperado bit a bit. Usado em texto, código, planilhas e PNG.\n\n**Com perdas:** descarta o que a percepção humana nota pouco (frequências agudas no MP3, detalhes de cor no JPEG). Reduz muito mais, porém é irreversível: recomprimir várias vezes degrada.\n\n**Taxa de compressão:** tamanho comprimido ÷ original. Imagens de fotos em JPEG chegam a 10 vezes menores.\n\n**Limite:** dados aleatórios ou já comprimidos não encolhem. Todo algoritmo que comprime alguns arquivos precisa aumentar outros.\n\n**Por que importa:** menos bytes significam sites mais rápidos, menos espaço e menos custo de transferência.',
  },
  diagrama: {
    titulo: 'Compressão RLE',
    nos: [
      { forma: 'inicio', texto: 'Texto original: AAAABBBCC' },
      { forma: 'passo', texto: 'Agrupe as letras iguais seguidas: AAAA, BBB, CC' },
      { forma: 'passo', texto: 'Troque cada grupo por contagem e letra: 4A, 3B, 2C' },
      { forma: 'fim', texto: 'Resultado comprimido: 4A3B2C (6 caracteres em vez de 9)' },
    ],
    descricao:
      'O texto AAAABBBCC é dividido em grupos de letras iguais seguidas. Cada grupo vira a contagem seguida da letra: 4A, 3B e 2C. O resultado, 4A3B2C, tem 6 caracteres em vez de 9.',
  },
  exemplo: {
    titulo: 'RLE passo a passo',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'original:    WWWWBBWWWW   (10 caracteres)\ngrupos:      WWWW | BB | WWWW\ncomprimido:  4W2B4W        (6 caracteres)\ndescomprimir: 4W -> WWWW, 2B -> BB, 4W -> WWWW',
    },
    comentarios: [
      { linha: 2, texto: 'Cada sequência de letras iguais é um grupo.' },
      { linha: 3, texto: 'Economia de 40%: 10 caracteres viraram 6.' },
      { linha: 4, texto: 'Sem perdas: o processo inverso recupera o original exato.' },
    ],
  },
  guiado: [
    prever(
      'Qual é a compressão RLE de "AAABB"?',
      'texto: AAABB',
      ['3A2B'],
      'Três A seguidos e dois B seguidos: 3A2B.',
      [{ resposta: 'A3B2', feedback: 'A contagem vem antes da letra: 3A2B.' }],
    ),
    mc(
      'O que significa compressão "sem perdas"?',
      'Ao descompactar, o arquivo volta exatamente igual ao original',
      [
        ['O arquivo nunca ocupa espaço', 'Ocupa espaço, só que menos.'],
        [
          'Parte do arquivo é descartada para economizar espaço',
          'Isso descreve a compressão com perdas.',
        ],
      ],
      'ZIP, PNG e FLAC são sem perdas.',
    ),
  ],
  indep: [
    prever(
      'Qual é a compressão RLE de "WWWWBBW"?',
      'texto: WWWWBBW',
      ['4W2B1W'],
      'Quatro W, dois B e um W: 4W2B1W. Repare que o último grupo, de uma letra só, também recebe contagem.',
      [
        {
          resposta: '4W2BW',
          feedback: 'No nosso RLE, até o grupo de uma letra recebe a contagem (1W).',
        },
      ],
    ),
    mc(
      'Por que um arquivo JPEG de uma foto pode ser muito menor que o mesmo em PNG?',
      'O JPEG usa compressão com perdas, descartando detalhes pouco perceptíveis',
      [
        ['O JPEG usa um algoritmo que nunca altera os dados', 'O JPEG altera: descarta detalhes.'],
        ['O PNG não é comprimido', 'O PNG também é comprimido, mas sem perdas.'],
      ],
      'Descartar detalhes permite economizar muito mais, ao custo de não voltar ao original.',
    ),
  ],
  desafio: prever(
    'O texto "ABCD" é comprimido com o nosso RLE. Quantos caracteres tem o resultado?',
    'ABCD -> 1A1B1C1D',
    ['8'],
    'Cada letra aparece uma vez, então cada uma vira "1" + letra: 1A1B1C1D tem 8 caracteres, o dobro do original. Sem repetição, o RLE piora.',
    [
      {
        resposta: '4',
        feedback: 'Cada grupo de uma letra também ganha a contagem 1, o que dobra o tamanho.',
      },
    ],
  ),
  rec: [
    associar(
      'Associe cada formato ao tipo de compressão.',
      [
        ['ZIP', 'Sem perdas'],
        ['PNG', 'Sem perdas'],
        ['JPEG', 'Com perdas'],
        ['MP3', 'Com perdas'],
      ],
      'Formatos de texto, código e imagens gráficas costumam ser sem perdas; fotos, músicas e vídeos costumam ser com perdas.',
    ),
    mc(
      'Em que caso a compressão RLE NÃO compensa?',
      'Quando o texto quase não tem letras repetidas em sequência',
      [
        [
          'Quando o texto é muito longo',
          'O tamanho não é o problema; o que importa são as repetições.',
        ],
        [
          'Quando o texto tem só letras maiúsculas',
          'O caso das letras não importa: o que conta é a repetição.',
        ],
      ],
      'Sem repetições, a contagem acrescentada só aumenta o tamanho.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que um arquivo ZIP volta idêntico mas um JPEG não.',
    modelo:
      'O ZIP usa compressão sem perdas: troca repetições por descrições mais curtas, e o processo pode ser desfeito exatamente. O JPEG usa compressão com perdas: descarta detalhes que quase não percebemos, e essa informação não pode ser recuperada depois.',
    rubrica: [
      'Disse que o ZIP é sem perdas e pode ser desfeito',
      'Disse que o JPEG descarta informação',
      'Explicou que o que foi descartado não volta',
    ],
  },
  resumo: [
    'Compressão troca repetições por descrições mais curtas.',
    'RLE: AAAABBB → 4A3B; sem repetição, piora (ABC → 1A1B1C).',
    'Sem perdas volta idêntico (ZIP, PNG); com perdas descarta detalhes (JPEG, MP3).',
    'Dados já comprimidos ou aleatórios quase não comprimem.',
  ],
  cards: [
    ['O que faz a compressão RLE?', 'Troca sequências repetidas por contagem + símbolo.'],
    ['O que é compressão sem perdas?', 'A que permite recuperar o original exato (ZIP, PNG).'],
    ['O que é compressão com perdas?', 'A que descarta detalhes para economizar mais (JPEG, MP3).'],
    ['Quando a compressão não compensa?', 'Quando não há repetições ou o dado já está comprimido.'],
  ],
  conexoes: {
    disciplinas: [
      'Desenvolvimento Web: imagens e scripts comprimidos deixam o site mais rápido.',
      'Redes: HTTP pode comprimir respostas (gzip, brotli) antes de enviar.',
      'Inteligência Artificial: modelos também são comprimidos (quantização) para rodar em celulares.',
    ],
    profissional:
      'Ao enviar anexos grandes ou otimizar um site, escolher o formato certo (PNG, JPEG, ZIP) faz diferença de tamanho e de qualidade.',
  },
});
