import { associar, mc, montar, prever } from './montar';

export const f13 = montar({
  id: 'fundamentos.m03.a03',
  titulo: 'Armazenamento: SSD, HD, RAID e backup',
  objetivo:
    'Comparar HD e SSD, entender como RAID 0, 1 e 5 combinam discos (espaço e proteção) e explicar por que RAID não substitui o backup.',
  pre: ['fundamentos.m03.a01', 'fundamentos.m03.a02'],
  min: 30,
  diag: mc(
    'Um servidor tem dois discos espelhados (RAID 1) e um deles quebra. O que acontece com os dados?',
    'Continuam disponíveis no outro disco',
    [
      [
        'Ficam perdidos, pois o espelho só copia os dados e não os protege',
        'No RAID 1 o outro disco tem uma cópia completa.',
      ],
      [
        'Ficam só pela metade, porque cada disco guardava metade dos dados',
        'Isso descreve o RAID 0; no RAID 1 cada disco tem tudo.',
      ],
    ],
    'No RAID 1, cada dado é gravado nos dois discos. Se um falha, o outro mantém tudo.',
  ),
  simples: {
    titulo: 'Onde ficam os dados guardados',
    texto:
      'O **HD** (disco rígido) grava em pratos magnéticos que giram: barato por GB, mas lento e sensível a quedas. O **SSD** usa chips de memória flash, sem partes móveis: bem mais rápido, silencioso e resistente.\n\nUm disco pode falhar. O **RAID** junta vários discos para ganhar velocidade, proteção ou os dois:\n\n- **RAID 0**: divide os dados entre os discos. Mais rápido e usa todo o espaço, mas **se um disco falhar, tudo se perde**.\n- **RAID 1**: espelha. Gasta metade do espaço (ou mais), mas tolera falhas.\n- **RAID 5**: divide os dados e guarda **paridade**; com 3 ou mais discos, tolera a falha de **um** disco.\n\n**Atenção:** RAID protege contra falha de disco, não contra apagar sem querer, vírus ou incêndio. Para isso é preciso **backup**.',
    essencial:
      'SSD = rápido, sem partes móveis; HD = barato e lento. RAID 0 (velocidade, sem proteção), RAID 1 (espelho), RAID 5 (paridade, tolera 1 falha). RAID não é backup.',
    guiado:
      'Para escolher o RAID:\n1. Precisa de velocidade e aceita risco? RAID 0.\n2. Quer simplicidade e proteção com 2 discos? RAID 1.\n3. Quer equilíbrio entre espaço e proteção com 3 ou mais discos? RAID 5.\n4. Em qualquer caso, faça backup.',
    tecnico:
      'RAID 0 faz striping (capacidade n·d, tolerância 0). RAID 1 faz mirroring (capacidade d, tolerância n−1). RAID 5 faz striping com paridade distribuída calculada por XOR (capacidade (n−1)·d, tolerância 1): se um disco some, os dados são reconstruídos com o XOR dos demais. A estratégia de backup 3-2-1 recomenda 3 cópias, em 2 tipos de mídia, com 1 fora do local.',
  },
  analogia: {
    titulo: 'Cópias de uma receita',
    texto:
      'RAID 0 é rasgar a receita em pedaços e guardar cada um num caderno: ler é rápido (vários cadernos ao mesmo tempo), mas perder um caderno estraga a receita inteira. RAID 1 é ter duas cópias completas. RAID 5 é guardar os pedaços e mais um "resumo" que permite recriar qualquer pedaço perdido.',
    limites:
      'Se você escrever uma receita errada nas cópias, todas ficam erradas: o RAID copia também seus erros. Por isso ele não substitui o backup, que guarda versões do passado.',
  },
  demo: {
    titulo: 'Quebre um disco',
    instrucoes:
      'Escolha RAID 1 com 2 discos e simule a falha de um (clique nele). Depois mude para RAID 0 e repita. Em seguida use RAID 5 com 4 discos: quanto espaço útil sobra? Quantas falhas ele aguenta? Tente quebrar dois discos.',
    simulacao: { tipo: 'raid' },
  },
  tecnica: {
    titulo: 'Capacidade e tolerância',
    texto:
      '**Com n discos de tamanho d:**\n- RAID 0: espaço n·d, tolera 0 falhas.\n- RAID 1: espaço d, tolera n−1 falhas.\n- RAID 5: espaço (n−1)·d, tolera 1 falha (mínimo de 3 discos).\n\n**Exemplo (4 discos de 4 TB):** RAID 0 = 16 TB; RAID 1 = 4 TB; RAID 5 = 12 TB.\n\n**Paridade:** o dado extra é a soma XOR dos blocos; se um disco falha, recalcula-se o bloco perdido.\n\n**Backup 3-2-1:** 3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 cópia fora do local (ou na nuvem). Teste a restauração de vez em quando: backup que nunca foi restaurado é só uma esperança.',
  },
  diagrama: {
    titulo: 'Escolhendo proteção para os dados',
    nos: [
      { forma: 'inicio', texto: 'Os dados são importantes?' },
      { forma: 'decisao', texto: 'Precisa continuar funcionando se um disco falhar?' },
      { forma: 'passo', texto: 'Sim: use RAID 1 ou RAID 5' },
      { forma: 'passo', texto: 'Em qualquer caso: faça backup (regra 3-2-1)' },
      { forma: 'fim', texto: 'Teste a restauração de tempos em tempos' },
    ],
    descricao:
      'Para dados importantes, decide-se primeiro se o sistema precisa continuar funcionando quando um disco falha; se sim, usa-se RAID 1 ou 5. Em qualquer caso, faz-se backup seguindo a regra 3-2-1 e testa-se a restauração periodicamente.',
  },
  exemplo: {
    titulo: 'Quatro discos de 4 TB',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'RAID 0: 4 x 4 = 16 TB úteis, tolera 0 falhas\nRAID 1: 4 TB úteis, tolera 3 falhas\nRAID 5: (4 - 1) x 4 = 12 TB úteis, tolera 1 falha',
    },
    comentarios: [
      { linha: 1, texto: 'Máximo espaço e velocidade, nenhuma proteção.' },
      { linha: 2, texto: 'Todos os discos têm a mesma cópia: gasta-se muito espaço.' },
      {
        linha: 3,
        texto: 'Um disco inteiro vira paridade: bom equilíbrio entre espaço e proteção.',
      },
    ],
  },
  guiado: [
    mc(
      'O que acontece no RAID 0 se um dos discos falhar?',
      'Todos os dados são perdidos',
      [
        [
          'Nada, os outros discos têm cópia',
          'No RAID 0 não há cópia: os dados são divididos entre os discos.',
        ],
        [
          'Só a metade falhada se perde e o resto fica acessível',
          'Os arquivos ficam espalhados por todos os discos, então nenhum é recuperável.',
        ],
      ],
      'RAID 0 busca velocidade, sem redundância.',
    ),
    prever(
      'Quantos TB úteis tem um RAID 5 com 4 discos de 4 TB?',
      'RAID 5: espaço útil = (n - 1) x tamanho',
      ['12'],
      '(4 − 1) × 4 = 12 TB; um disco equivalente é usado para paridade.',
      [{ resposta: '16', feedback: '16 TB seria o RAID 0. No RAID 5, um disco vira paridade.' }],
    ),
  ],
  indep: [
    mc(
      'Por que RAID não substitui o backup?',
      'Porque ele não protege contra apagar sem querer, vírus ou desastres: copia o erro para todos os discos',
      [
        [
          'Porque o RAID deixa a gravação lenta demais para ser confiável',
          'O motivo não é velocidade: RAID não protege contra erros humanos.',
        ],
        [
          'Porque o RAID só funciona com SSD e não protege os HDs',
          'RAID funciona com HD e SSD; o limite é a proteção contra erro.',
        ],
      ],
      'RAID protege de falha física de disco. Já um arquivo apagado é apagado em todos os discos.',
    ),
    prever(
      'Quantos discos de falha tolera um RAID 1 com 3 discos?',
      'RAID 1: todos os discos têm a mesma cópia\ndiscos = 3',
      ['2'],
      'Enquanto sobrar um disco, os dados estão lá: tolera n − 1 = 2 falhas.',
      [{ resposta: '1', feedback: 'Com 3 cópias, ainda restam dados mesmo depois de 2 falhas.' }],
    ),
  ],
  desafio: associar(
    'Associe cada RAID à sua característica principal.',
    [
      ['RAID 0', 'Mais velocidade e espaço, sem proteção'],
      ['RAID 1', 'Espelhamento: cópia completa em cada disco'],
      ['RAID 5', 'Paridade: tolera a falha de um disco'],
      ['Backup 3-2-1', '3 cópias, 2 mídias, 1 fora do local'],
    ],
    'Cada solução resolve um problema diferente; o backup cobre o que o RAID não cobre.',
  ),
  rec: [
    mc(
      'Qual é uma vantagem do SSD sobre o HD?',
      'É muito mais rápido e não tem partes móveis',
      [
        ['É sempre mais barato por GB', 'Em geral o HD ainda é mais barato por GB.'],
        [
          'Guarda dados sem precisar de energia nenhuma, ao contrário do HD',
          'Os dois guardam sem energia; a diferença é a velocidade e a mecânica.',
        ],
      ],
      'Sem pratos giratórios, o SSD acessa dados quase instantaneamente e resiste melhor a impactos.',
      1,
    ),
    mc(
      'O que diz a regra de backup 3-2-1?',
      '3 cópias, em 2 tipos de mídia, com 1 cópia fora do local',
      [
        [
          '3 discos, 2 senhas de proteção e 1 computador dedicado ao backup',
          'Não há relação com discos ou senhas: são cópias e mídias.',
        ],
        [
          '3 backups diários, 2 semanais e 1 mensal, para cobrir cada período',
          'A regra trata de cópias e locais, não de frequência.',
        ],
      ],
      'Assim, uma única falha (disco, roubo, incêndio) não elimina todas as cópias.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre RAID e backup, com um exemplo.',
    modelo:
      'RAID mantém o sistema funcionando se um disco quebrar, porque guarda os dados em vários discos ao mesmo tempo. Já o backup é uma cópia separada, de um momento do passado. Se eu apagar um arquivo sem querer, o RAID apaga em todos os discos, mas o backup permite recuperá-lo.',
    rubrica: [
      'Disse que o RAID protege contra falha de disco',
      'Disse que o backup é uma cópia separada, de outro momento',
      'Deu um exemplo coerente (arquivo apagado, vírus, incêndio)',
    ],
  },
  resumo: [
    'SSD é rápido e sem partes móveis; HD é barato e mais lento.',
    'RAID 0 = velocidade sem proteção; RAID 1 = espelho; RAID 5 = paridade (tolera 1 falha).',
    'RAID protege contra falha de disco, não contra erro humano, vírus ou desastre.',
    'Backup 3-2-1: 3 cópias, 2 mídias, 1 fora do local; teste a restauração.',
  ],
  cards: [
    ['O que é RAID 1?', 'Espelhamento: cada dado é gravado em todos os discos.'],
    ['Quanto espaço útil tem o RAID 5?', '(n − 1) × tamanho do disco.'],
    ['RAID substitui backup?', 'Não: protege só contra falha de disco.'],
    ['O que é a regra 3-2-1?', '3 cópias, 2 tipos de mídia, 1 cópia fora do local.'],
  ],
  conexoes: {
    disciplinas: [
      'Cibersegurança: backups offline protegem contra ransomware.',
      'Infraestrutura e Servidores: serviços de armazenamento replicam dados em vários servidores e regiões.',
      'Modelagem e Projeto de Bancos de Dados: replicação é a ideia de RAID 1 aplicada a bancos inteiros.',
      'Infraestrutura e Servidores (Monitoramento e recuperação): RPO e RTO medem quanto dado e quanto tempo você aceita perder numa falha.',
    ],
    profissional:
      'Em TI, o primeiro chamado depois de uma perda de dados é sempre "tem backup?". Conhecer RAID e a regra 3-2-1 evita a falsa sensação de segurança.',
  },
});
