import { associar, mc, montar, prever } from './montar';

export const f08 = montar({
  id: 'fundamentos.m02.a03',
  titulo: 'Redes: endereços IP e sub-redes',
  objetivo:
    'Explicar o que é um endereço IPv4 e uma máscara de sub-rede, calcular o endereço da rede, o broadcast e a quantidade de equipamentos de um prefixo CIDR.',
  pre: ['fundamentos.m01.a01', 'fundamentos.m01.a03'],
  min: 35,
  diag: mc(
    'Para um computador enviar dados a outro, o que ele precisa saber sobre o destino?',
    'O endereço dele na rede (o IP)',
    [
      [
        'O nome do dono do computador',
        'Nomes servem para pessoas; a rede trabalha com endereços numéricos.',
      ],
      [
        'A cor do cabo de rede',
        'O cabo não importa para o endereçamento: o que identifica o destino é o IP.',
      ],
    ],
    'Cada equipamento numa rede tem um endereço IP, como o endereço de uma casa numa rua.',
  ),
  simples: {
    titulo: 'O endereço de cada equipamento',
    texto:
      'Um **endereço IPv4** tem 32 bits, escritos em 4 números de 0 a 255 separados por pontos (192.168.1.130). Cada número é um **byte** (8 bits).\n\nO endereço tem duas partes: a **rede** (a "rua") e o **equipamento** (o "número da casa"). A **máscara de sub-rede** diz onde termina uma e começa a outra. Em vez de escrever 255.255.255.0, usamos a notação **CIDR**: `/24` significa "os primeiros 24 bits são a rede".\n\nEquipamentos da mesma rede conversam direto; para sair dela, o tráfego passa pelo **roteador** (o gateway).',
    essencial:
      'IPv4 = 32 bits em 4 bytes. Máscara /24 = 24 bits de rede. Mesma rede = conversa direta; outra rede = passa pelo roteador.',
    guiado:
      'Para achar a rede de 192.168.1.130/24:\n1. /24 significa que os 3 primeiros números são a rede.\n2. Mantenha 192.168.1 e zere o resto.\n3. Rede: 192.168.1.0.\n4. O último endereço (broadcast) é 192.168.1.255.\n5. Equipamentos utilizáveis: de .1 a .254 (254).',
    tecnico:
      'O endereço de rede é o resultado de IP AND máscara (bit a bit). O broadcast é a rede com todos os bits de equipamento em 1. Com prefixo /n há 2^(32−n) endereços e 2^(32−n) − 2 utilizáveis (excluindo rede e broadcast). Faixas privadas (RFC 1918): 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16.',
  },
  analogia: {
    titulo: 'Ruas e números de casa',
    texto:
      'O endereço IP é como "Rua das Flores, 130". A rede é a rua (todas as casas dela começam igual) e o equipamento é o número da casa. A máscara diz quanto do endereço é nome de rua. Para falar com alguém de outra rua, a correspondência passa pelos correios: o roteador.',
    limites:
      'Em casa, números de rua são decididos pela prefeitura; em redes, o roteador ou o administrador os distribui (muitas vezes automaticamente, via DHCP). E o prefixo não precisa cair em bytes inteiros: /26 divide um byte no meio.',
  },
  demo: {
    titulo: 'Calcule redes e sub-redes',
    instrucoes:
      'Mantenha 192.168.1.130 e mova o prefixo de /24 para /26: observe o endereço da rede e a quantidade de equipamentos mudarem. Depois digite 10.0.0.70 com /26 e confira. Olhe também os bits: a parte colorida é a da rede.',
    simulacao: { tipo: 'rede', ip: '192.168.1.130', cidr: 24 },
  },
  tecnica: {
    titulo: 'Contas de sub-rede',
    texto:
      '**Tamanho:** prefixo /n deixa 32 − n bits para equipamentos: 2^(32−n) endereços.\n- /24: 256 endereços, 254 utilizáveis\n- /25: 128, 126 utilizáveis\n- /26: 64, 62 utilizáveis\n- /30: 4, 2 utilizáveis (ligações ponto a ponto)\n\n**Rede:** zere os bits de equipamento do IP (é a porta AND com a máscara).\n\n**Broadcast:** ligue todos os bits de equipamento.\n\n**Mesma rede?** Compare os endereços de rede: se forem iguais, conversam direto. Senão, precisam do gateway.\n\n**IPs privados** (10.x, 172.16–31.x, 192.168.x) valem só dentro da rede local; o roteador os traduz (NAT) para um IP público ao sair para a internet.',
  },
  diagrama: {
    titulo: 'Achar a rede de um IP',
    nos: [
      { forma: 'inicio', texto: 'IP e prefixo, por exemplo 192.168.1.130/24' },
      { forma: 'passo', texto: 'Separe os bits de rede (24) dos bits de equipamento (8)' },
      { forma: 'passo', texto: 'Zere os bits de equipamento: endereço da rede 192.168.1.0' },
      { forma: 'passo', texto: 'Ligue todos os bits de equipamento: broadcast 192.168.1.255' },
      { forma: 'fim', texto: 'Utilizáveis: de 192.168.1.1 a 192.168.1.254' },
    ],
    descricao:
      'Dado um IP com prefixo, separa-se a parte da rede e a parte do equipamento. Zerando os bits do equipamento obtém-se o endereço da rede; ligando todos eles obtém-se o broadcast. Os endereços entre os dois, sem contar as pontas, são os utilizáveis.',
  },
  exemplo: {
    titulo: '10.0.0.70/26',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '/26 = 26 bits de rede, 6 bits de equipamento\n2^6 = 64 endereços por sub-rede\nSub-redes: 0-63, 64-127, 128-191, 192-255\n70 cai em 64-127\nRede: 10.0.0.64\nBroadcast: 10.0.0.127\nUtilizáveis: 10.0.0.65 a 10.0.0.126 (62)',
    },
    comentarios: [
      { linha: 2, texto: 'Com 6 bits de equipamento, cada sub-rede tem 64 endereços.' },
      { linha: 3, texto: 'O último byte é dividido em blocos de 64.' },
      { linha: 4, texto: 'O 70 está no segundo bloco, que começa em 64.' },
      { linha: 7, texto: 'Tira-se o endereço de rede (64) e o de broadcast (127): sobram 62.' },
    ],
  },
  guiado: [
    mc(
      'Quantos bits tem um endereço IPv4?',
      '32',
      [
        ['4', 'São 4 números (bytes), mas cada um tem 8 bits.'],
        ['128', '128 bits é o tamanho do IPv6, o endereço mais novo.'],
      ],
      '4 bytes × 8 bits = 32 bits.',
    ),
    prever(
      'Qual é o endereço da rede de 192.168.1.130/24?',
      'IP: 192.168.1.130\nPrefixo: /24 (3 primeiros bytes são a rede)',
      ['192.168.1.0'],
      'Mantém-se 192.168.1 e zera-se o último byte (parte do equipamento).',
      [
        {
          resposta: '192.168.1.130',
          feedback: 'Esse é o IP do equipamento. A rede zera os bits do equipamento.',
        },
      ],
    ),
  ],
  indep: [
    prever(
      'Quantos equipamentos cabem numa rede /24? (descontando rede e broadcast)',
      '/24 deixa 8 bits para equipamentos\n2^8 = 256 endereços',
      ['254'],
      '256 endereços menos 2 (o de rede e o de broadcast) = 254.',
      [{ resposta: '256', feedback: 'Dois endereços são reservados: o da rede e o de broadcast.' }],
    ),
    mc(
      '192.168.1.10/24 e 192.168.2.10/24 estão na mesma rede?',
      'Não: as redes são 192.168.1.0 e 192.168.2.0, diferentes',
      [
        [
          'Sim, porque os dois terminam em .10, o que identifica o mesmo equipamento',
          'Com /24 o que decide é o terceiro número, que é diferente.',
        ],
        [
          'Sim, porque ambos são IPs privados e privados sempre ficam na mesma rede',
          'Ser privado não define a rede: os prefixos são diferentes.',
        ],
      ],
      'Para trocar dados, precisariam passar pelo roteador.',
      2,
    ),
  ],
  desafio: associar(
    'Associe cada prefixo ao número de equipamentos utilizáveis.',
    [
      ['/24', '254'],
      ['/25', '126'],
      ['/26', '62'],
      ['/30', '2'],
    ],
    'Equipamentos = 2^(32−n) − 2. Para /24: 256 − 2 = 254; /25: 128 − 2 = 126; /26: 64 − 2 = 62; /30: 4 − 2 = 2.',
  ),
  rec: [
    mc(
      'Para que serve a máscara de sub-rede?',
      'Para separar a parte do endereço que identifica a rede da que identifica o equipamento',
      [
        [
          'Para esconder o endereço IP do equipamento de quem está fora da rede',
          'A máscara não esconde nada: só divide rede e equipamento.',
        ],
        [
          'Para aumentar a velocidade da conexão entre os equipamentos da rede',
          'A máscara não muda a velocidade; ela organiza o endereço.',
        ],
      ],
      'Os bits 1 da máscara marcam a rede; os 0, o equipamento.',
    ),
    mc(
      'Qual destes IPs é privado (usado só em redes internas)?',
      '192.168.0.15',
      [
        ['8.8.8.8', 'É um IP público (DNS do Google).'],
        ['200.100.50.1', 'Está fora das faixas privadas: é público.'],
      ],
      'As faixas privadas são 10.x.x.x, 172.16 a 31.x.x e 192.168.x.x.',
    ),
  ],
  explique: {
    enunciado: 'Explique como saber se dois IPs estão na mesma rede.',
    modelo:
      'Aplico o prefixo (máscara) aos dois IPs e calculo o endereço da rede de cada um. Se os endereços de rede forem iguais, estão na mesma rede e conversam direto; senão, precisam passar pelo roteador.',
    rubrica: [
      'Citou o uso da máscara ou prefixo',
      'Disse que compara o endereço de rede dos dois',
      'Explicou o que muda quando são redes diferentes (roteador)',
    ],
  },
  resumo: [
    'IPv4 tem 32 bits, escritos em 4 bytes (0 a 255).',
    'A máscara (/24, /26...) separa rede de equipamento.',
    'Rede = zerar os bits de equipamento; broadcast = ligar todos eles.',
    'Utilizáveis = 2^(32−n) − 2. Para sair da rede, usa-se o roteador.',
  ],
  cards: [
    ['O que significa /24?', 'Os primeiros 24 bits do endereço identificam a rede.'],
    ['Quantos equipamentos cabem em /24?', '254 utilizáveis (256 menos rede e broadcast).'],
    ['O que é o gateway?', 'O roteador por onde sai o tráfego para outras redes.'],
    ['Quais são as faixas de IP privado?', '10.x.x.x, 172.16 a 31.x.x e 192.168.x.x.'],
  ],
  conexoes: {
    disciplinas: [
      'Binário: a máscara e o cálculo da rede usam as mesmas portas AND e os bits da aula 1.',
      'Segurança: firewalls e segmentação de redes são regras sobre sub-redes.',
      'Nuvem: toda rede virtual (VPC) é definida por blocos CIDR.',
    ],
    profissional:
      'Em chamados de "sem acesso à rede", conferir IP, máscara e gateway é o início do diagnóstico: um IP em outra sub-rede explica por que o equipamento não alcança os demais.',
  },
});
