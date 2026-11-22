import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const r02 = montar({
  id: 'redes.m01.a02',
  titulo: 'Sub-redes na prática',
  objetivo:
    'Dividir uma rede em sub-redes, calcular a quantidade de equipamentos e escolher o prefixo certo.',
  pre: ['redes.m01.a01', 'fundamentos.m02.a03'],
  min: 35,
  diag: mc(
    'Quantos endereços utilizáveis tem uma rede /24?',
    '254',
    [
      ['256', 'Dois endereços são reservados: rede e broadcast.'],
      ['255', 'Falta descontar o endereço de rede também.'],
    ],
    '256 endereços menos o de rede e o de broadcast.',
  ),
  simples: {
    titulo: 'Fatiando uma rede',
    texto:
      'Uma rede grande misturando todos os setores é lenta e insegura. Dividimos em **sub-redes**, tomando bits emprestados da parte de equipamentos.\n\n- /24 → 256 endereços (254 utilizáveis)\n- /25 → 128 (126)\n- /26 → 64 (62)\n- /27 → 32 (30)\n- /28 → 16 (14)\n- /30 → 4 (2)\n\nCada bit a mais no prefixo **divide pela metade** o tamanho da rede.',
    essencial:
      'Hosts utilizáveis = 2^(32 − prefixo) − 2. Cada bit emprestado dobra o número de sub-redes e divide os hosts por 2.',
    guiado:
      'Para escolher o prefixo:\n1. Conte quantos equipamentos precisa (com folga).\n2. Ache a menor potência de 2 que cabe, somando 2.\n3. Prefixo = 32 − número de bits de equipamento.\nEx.: 50 equipamentos → 52 → 64 = 2^6 → /26.',
    tecnico:
      'Com **VLSM** (máscaras de tamanho variável) cada sub-rede recebe o tamanho de que precisa: começa-se pela maior demanda e vai-se alocando em sequência. Um /24 dividido em quatro /26 gera redes em .0, .64, .128 e .192. Os blocos devem ser alinhados: o endereço de rede de um /26 é sempre múltiplo de 64 no último octeto. Ligações ponto a ponto entre roteadores costumam usar /30 (ou /31).',
  },
  analogia: {
    titulo: 'Dividindo um terreno em lotes',
    texto:
      'O terreno (a rede) é cortado ao meio, depois cada metade ao meio de novo. Cada corte dobra a quantidade de lotes e reduz o tamanho de cada um. A calçada de cada lote (rede e broadcast) não pode ser ocupada.',
    limites:
      'Os lotes precisam ficar alinhados: não dá para começar um lote de 64 no meio de outro.',
  },
  demo: {
    titulo: 'A calculadora de sub-redes',
    instrucoes:
      'O IP 192.168.10.70 com /26 pertence à rede .64. Mude o prefixo para /27 e /28 e observe a rede, o broadcast e os hosts mudarem.',
    simulacao: { tipo: 'rede', ip: '192.168.10.70', cidr: 26 },
  },
  tecnica: {
    titulo: 'Passo a passo de um projeto',
    texto:
      'Rede 192.168.10.0/24 para: Vendas (50), TI (20) e Visitantes (10).\n1. Vendas: 50 → /26 (62) → 192.168.10.0/26.\n2. TI: 20 → /27 (30) → 192.168.10.64/27.\n3. Visitantes: 10 → /28 (14) → 192.168.10.96/28.\nSobra o bloco a partir de .112 para crescer.',
  },
  diagrama: {
    titulo: 'Escolhendo o prefixo',
    nos: [
      { forma: 'inicio', texto: 'Quantos equipamentos preciso?' },
      { forma: 'passo', texto: 'Some 2 (rede e broadcast)' },
      { forma: 'passo', texto: 'Ache a menor potência de 2 maior ou igual' },
      { forma: 'fim', texto: 'Prefixo = 32 menos o expoente' },
    ],
    descricao: 'O prefixo é 32 menos o número de bits de equipamento.',
  },
  exemplo: {
    titulo: 'Quatro redes iguais',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '192.168.10.0/26   (hosts .1 a .62)\n192.168.10.64/26  (hosts .65 a .126)\n192.168.10.128/26 (hosts .129 a .190)\n192.168.10.192/26 (hosts .193 a .254)',
    },
    comentarios: [
      { linha: 1, texto: 'A primeira rede começa em .0 e o broadcast é .63.' },
      { linha: 2, texto: 'Cada rede começa 64 endereços depois da anterior.' },
    ],
  },
  guiado: [
    prever(
      'Quantos hosts utilizáveis tem uma rede /27?',
      'console.log(2 ** (32 - 27) - 2);',
      ['30'],
      '32 − 27 = 5 bits de equipamento: 2^5 = 32, menos 2 reservados.',
      [{ resposta: '32', feedback: 'Falta descontar o endereço de rede e o de broadcast.' }],
    ),
    prever(
      'Quantas sub-redes /26 cabem em um /24?',
      'console.log(256 / 64);',
      ['4'],
      'Um /26 tem 64 endereços e o /24 tem 256.',
      [{ resposta: '2', feedback: '2 seria o caso de sub-redes /25 (128 endereços cada).' }],
    ),
  ],
  indep: [
    mc(
      'Qual prefixo comporta 50 equipamentos com o menor desperdício de endereços?',
      '/26',
      [
        ['/27', 'Um /27 tem só 30 endereços utilizáveis.'],
        ['/25', 'Comporta, mas desperdiça: o /26 já basta (62).'],
      ],
      '2^6 = 64 endereços e 62 utilizáveis.',
    ),
    completar(
      'Complete para calcular o total de endereços de um prefixo.',
      'const prefixo = 28;\nconsole.log(2 ** (___ - prefixo));',
      [{ aceitas: ['32'], feedback: 'O IPv4 tem 32 bits no total.' }],
      'Total = 2^(32 − prefixo).',
    ),
  ],
  desafio: programaJs(
    'Escreva hostsUteis(prefixo): devolve quantos equipamentos cabem numa rede com esse prefixo (/n, com n entre 8 e 30).',
    'function hostsUteis(prefixo) {\n  // seu código aqui\n}',
    'function hostsUteis(prefixo) {\n  return 2 ** (32 - prefixo) - 2;\n}',
    'hostsUteis',
    [
      { argumentos: [24], esperado: 254 },
      { argumentos: [26], esperado: 62 },
      { argumentos: [30], esperado: 2 },
      { argumentos: [16], esperado: 65534 },
    ],
    [
      'O total de endereços é 2 elevado a (32 − prefixo).',
      'Desconte o endereço de rede e o de broadcast.',
    ],
    'A fórmula 2^(32 − n) − 2 resolve qualquer prefixo comum.',
  ),
  rec: [
    associar(
      'Associe o prefixo ao número de equipamentos utilizáveis.',
      [
        ['/24', '254'],
        ['/26', '62'],
        ['/28', '14'],
        ['/30', '2'],
      ],
      'Cada bit a mais no prefixo divide os hosts por 2 (menos os 2 reservados).',
    ),
    mc(
      'Por que dividir uma rede em sub-redes?',
      'Para organizar, isolar o tráfego e aplicar regras de segurança por setor',
      [
        [
          'Para ter mais endereços IP públicos na internet',
          'Sub-redes dividem endereços; não criam IPs públicos.',
        ],
        [
          'Para o Wi-Fi ficar mais rápido em toda a empresa',
          'A velocidade não é o objetivo principal.',
        ],
      ],
      'Menos tráfego de broadcast e regras de acesso por grupo.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como escolher o prefixo para uma sub-rede de 50 equipamentos.',
    modelo:
      'Somo 2 aos 50 equipamentos por causa dos endereços de rede e broadcast, obtendo 52. A menor potência de 2 que comporta é 64 (2^6), então são 6 bits de equipamento e o prefixo é 32 − 6 = /26, que oferece 62 hosts utilizáveis.',
    rubrica: ['Considerou rede e broadcast', 'Achou a potência de 2 adequada', 'Concluiu /26'],
  },
  resumo: [
    'Hosts utilizáveis = 2^(32 − prefixo) − 2.',
    'Cada bit emprestado dobra as sub-redes.',
    'VLSM dá a cada sub-rede o tamanho de que precisa.',
    'Blocos são alinhados ao seu tamanho.',
  ],
  cards: [
    ['Hosts de um /26?', '62.'],
    ['Hosts de um /24?', '254.'],
    ['Fórmula de hosts?', '2^(32 − prefixo) − 2.'],
    ['O que é VLSM?', 'Máscaras de tamanhos diferentes na mesma rede.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: binário e IP da aula de redes.',
      'Infraestrutura e Servidores: nuvens usam sub-redes em VPCs.',
      'Cibersegurança: segmentar limita o estrago de um ataque.',
    ],
    profissional:
      'Planejar o endereçamento de uma empresa ou de uma VPC na nuvem é tarefa de rotina em redes e DevOps.',
  },
});
