import { associar, mc, montar, ordenar } from './montar';

export const f03 = montar({
  id: 'fundamentos.m01.a03',
  titulo: 'Portas lógicas: como o hardware decide',
  objetivo:
    'Reconhecer as portas AND, OR, NOT, XOR, NAND e NOR, ler tabelas-verdade e explicar como portas somam dois bits.',
  pre: ['fundamentos.m01.a01'],
  min: 30,
  diag: mc(
    'O computador só tem bits (0 e 1). Como ele "decide" algo, como somar dois números?',
    'Com circuitos chamados portas lógicas, que recebem bits e devolvem um bit',
    [
      [
        'Um programinha pequeno dentro de cada chip decide',
        'Até esse programa roda sobre circuitos: portas lógicas.',
      ],
      [
        'Ele adivinha pelo contexto',
        'Computadores não adivinham: seguem regras exatas, feitas de circuitos.',
      ],
    ],
    'Portas lógicas são circuitos minúsculos que aplicam regras simples a bits. Bilhões delas formam um processador.',
  ),
  simples: {
    titulo: 'Pequenos juízes de 0 e 1',
    texto:
      'Uma **porta lógica** recebe um ou dois bits e devolve um bit, seguindo uma regra fixa.\n\n- **AND (E):** só dá 1 se **as duas** entradas forem 1.\n- **OR (OU):** dá 1 se **pelo menos uma** entrada for 1.\n- **NOT (NÃO):** inverte: 0 vira 1 e 1 vira 0.\n- **XOR (OU exclusivo):** dá 1 se as entradas forem **diferentes**.\n- **NAND e NOR:** são o AND e o OR com a saída invertida.\n\nUma **tabela-verdade** lista todas as combinações de entrada e a saída de cada uma.',
    essencial:
      'AND: as duas em 1. OR: pelo menos uma em 1. NOT: inverte. XOR: diferentes. NAND/NOR: AND/OR invertidos.',
    guiado:
      'Para descobrir a saída de uma porta:\n1. Veja qual é a porta e sua regra.\n2. Veja as entradas (A e B).\n3. Procure a linha da tabela-verdade com essas entradas.\n4. A saída está na última coluna.\nExemplo: XOR com A = 1 e B = 1 dá 0, porque as entradas são iguais.',
    tecnico:
      'Portas implementam funções booleanas f: {0,1}^n → {0,1}. NAND e NOR são universais: qualquer circuito pode ser construído apenas com portas NAND (ou só NOR). Na prática, as portas são feitas de transistores, que funcionam como chaves controladas por tensão.',
  },
  analogia: {
    titulo: 'Interruptores em série e em paralelo',
    texto:
      'Duas lâmpadas ligadas **em série** (um interruptor depois do outro) só acendem se os dois estiverem ligados: é o AND. Em **paralelo** (dois caminhos), basta um interruptor ligado: é o OR. E o interruptor de escada, que liga e desliga a mesma lâmpada de dois pontos, comporta-se como um XOR.',
    limites:
      'Interruptores de casa são mecânicos e lentos. As portas reais são transistores, que mudam de estado bilhões de vezes por segundo, e o "0" e o "1" são níveis de tensão.',
  },
  demo: {
    titulo: 'Teste cada porta',
    instrucoes:
      'Escolha uma porta, ligue e desligue as entradas A e B e acompanhe a lâmpada de saída e a linha em destaque da tabela. Antes de clicar, tente prever a saída. Depois explore o NOT: ele tem só uma entrada.',
    simulacao: { tipo: 'portas', modo: 'porta', porta: 'and', fixo: false },
  },
  tecnica: {
    titulo: 'Tabelas-verdade e o somador',
    texto:
      '**Tabelas-verdade (A, B → saída):**\n- AND: 0,0→0; 0,1→0; 1,0→0; 1,1→1\n- OR: 0,0→0; 0,1→1; 1,0→1; 1,1→1\n- XOR: 0,0→0; 0,1→1; 1,0→1; 1,1→0\n\n**Somando dois bits (meio-somador):** a soma é A XOR B e o "vai-um" é A AND B. Assim 1 + 1 = 10 em binário: soma 0, vai-um 1.\n\n**Somador completo:** soma três bits (A, B e o vem-um da coluna ao lado). Encadeando 8 somadores completos, somam-se números de 8 bits. É assim que a ALU de um processador soma.',
  },
  diagrama: {
    titulo: 'Somando dois bits com portas',
    nos: [
      { forma: 'inicio', texto: 'Entradas: bit A e bit B' },
      { forma: 'passo', texto: 'Porta XOR com A e B: resultado é o bit da soma' },
      { forma: 'passo', texto: 'Porta AND com A e B: resultado é o vai-um' },
      { forma: 'fim', texto: 'Saídas: soma e vai-um formam o resultado em binário' },
    ],
    descricao:
      'Os bits A e B entram em duas portas ao mesmo tempo. A porta XOR produz o bit da soma e a porta AND produz o vai-um. Juntos, vai-um e soma formam o resultado: 1 + 1 dá 10.',
  },
  exemplo: {
    titulo: 'Quem decide: o alarme de carro',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'porta aberta = 1, alarme armado = 1\nsirene = porta aberta AND alarme armado\n\nporta=1, armado=1 -> sirene=1\nporta=1, armado=0 -> sirene=0\nporta=0, armado=1 -> sirene=0',
    },
    comentarios: [
      { linha: 2, texto: 'AND: a sirene só toca se as DUAS condições forem verdadeiras.' },
      { linha: 5, texto: 'Alarme desarmado: mesmo com a porta aberta, a sirene fica quieta.' },
    ],
  },
  guiado: [
    mc(
      'Qual é a saída de uma porta AND com entradas A = 1 e B = 0?',
      '0',
      [
        ['1', 'AND só dá 1 quando AS DUAS entradas são 1.'],
        ['10', 'A saída de uma porta é um único bit: 0 ou 1.'],
      ],
      'AND exige que as duas entradas sejam 1. Aqui B é 0, então a saída é 0.',
    ),
    mc(
      'Qual é a saída de uma porta XOR com A = 1 e B = 1?',
      '0',
      [
        ['1', 'XOR dá 1 só quando as entradas são DIFERENTES; aqui são iguais.'],
        ['2', 'Bits só valem 0 ou 1.'],
      ],
      'As entradas são iguais, então o XOR dá 0.',
    ),
  ],
  indep: [
    associar(
      'Associe cada porta à sua regra.',
      [
        ['AND', 'Saída 1 só se as duas entradas forem 1'],
        ['OR', 'Saída 1 se pelo menos uma entrada for 1'],
        ['XOR', 'Saída 1 se as entradas forem diferentes'],
        ['NOT', 'Inverte a entrada'],
      ],
      'Cada porta tem uma regra própria. NOT é a única com uma só entrada.',
    ),
    mc(
      'Num meio-somador, o que a porta AND calcula?',
      'O "vai-um"',
      [
        ['O bit da soma', 'O bit da soma vem da porta XOR.'],
        ['O resultado invertido', 'Invertida seria a saída do NAND, não do AND.'],
      ],
      'AND dá 1 só quando A = 1 e B = 1, ou seja, quando a soma gera "vai-um" (1 + 1 = 10).',
      1,
    ),
  ],
  desafio: ordenar(
    'Coloque na ordem os passos para somar 1 + 1 com um meio-somador.',
    [
      'Os bits A = 1 e B = 1 entram nas portas',
      'O XOR compara as entradas: iguais, então o bit da soma é 0',
      'O AND confere se as duas são 1: sim, então o vai-um é 1',
      'O resultado é vai-um 1 e soma 0, ou seja, 10 em binário (2)',
    ],
    'As duas portas trabalham sobre as mesmas entradas. Depois se juntam vai-um e soma para formar 10 (dois em binário).',
  ),
  rec: [
    mc(
      'Qual porta dá 1 apenas quando as duas entradas são iguais a 1?',
      'AND',
      [
        ['OR', 'OR dá 1 se pelo menos uma entrada for 1.'],
        ['XOR', 'XOR dá 1 quando as entradas são diferentes.'],
      ],
      'AND é o "E" lógico: exige as duas condições ao mesmo tempo.',
      2,
    ),
    mc(
      'Como se chama o circuito que soma três bits (A, B e vem-um)?',
      'Somador completo',
      [
        ['Meio-somador', 'O meio-somador soma só dois bits, sem o vem-um.'],
        ['Tabela-verdade', 'A tabela-verdade é só a lista de entradas e saídas, não um circuito.'],
      ],
      'O somador completo usa dois meios-somadores e uma porta OR. Encadeando vários, soma-se números maiores.',
    ),
  ],
  explique: {
    enunciado: 'Explique como o computador soma dois números usando portas lógicas.',
    modelo:
      'Cada coluna de bits é somada por portas: um XOR dá o bit do resultado e um AND dá o "vai-um" para a coluna da esquerda. Encadeando vários somadores, o computador soma números inteiros de vários bits.',
    rubrica: [
      'Citou o XOR para o bit da soma',
      'Citou o AND para o vai-um',
      'Mencionou o encadeamento de vários somadores',
    ],
  },
  resumo: [
    'Portas lógicas recebem bits e devolvem um bit por uma regra fixa.',
    'AND: as duas em 1. OR: pelo menos uma em 1. NOT: inverte. XOR: diferentes.',
    'Tabela-verdade lista todas as entradas e a saída de cada uma.',
    'XOR + AND formam um meio-somador; encadeando somadores, soma-se qualquer número.',
  ],
  cards: [
    ['O que faz a porta AND?', 'Saída 1 só se as duas entradas forem 1.'],
    ['O que faz a porta XOR?', 'Saída 1 se as entradas forem diferentes.'],
    [
      'O que é uma tabela-verdade?',
      'A lista de todas as combinações de entrada com a saída de cada uma.',
    ],
    ['Como se soma dois bits com portas?', 'XOR dá o bit da soma e AND dá o vai-um.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: os operadores e, ou e nao dos algoritmos são exatamente AND, OR e NOT.',
      'Banco de Dados: filtros WHERE combinam condições com AND, OR e NOT.',
      'Arquitetura de Computadores: a unidade lógica e aritmética (ALU) é feita de portas.',
    ],
    profissional:
      'Ao montar um filtro de busca, uma regra de firewall ou uma condição num sistema, você está usando AND, OR e NOT. Entender a lógica por baixo evita regras erradas, como confundir "A e B" com "A ou B".',
  },
});
