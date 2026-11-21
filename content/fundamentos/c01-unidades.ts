import { mc, montar, prever } from './montar';

export const f11 = montar({
  id: 'fundamentos.m03.a01',
  titulo: 'Unidades de dados: bytes, megas e gigas',
  objetivo:
    'Usar as unidades KB, MB, GB e TB, entender a diferença entre bits e bytes (Mbps e MB/s) e explicar por que um disco mostra menos espaço do que o anunciado.',
  pre: ['fundamentos.m01.a01'],
  min: 25,
  diag: mc(
    'Sua internet é de 100 Mbps. Qual é, no máximo, a velocidade de download em megabytes por segundo (MB/s)?',
    'Cerca de 12,5 MB/s',
    [
      ['100 MB/s', 'Mbps é megaBITS por segundo, não megabytes. Cada byte tem 8 bits.'],
      ['800 MB/s', 'A conta é ao contrário: dividimos por 8 para passar de bits para bytes.'],
    ],
    '100 megabits por segundo ÷ 8 bits por byte = 12,5 megabytes por segundo.',
    1,
  ),
  simples: {
    titulo: 'Do byte ao terabyte',
    texto:
      'O **byte** (8 bits) guarda uma letra ou um número pequeno. Os múltiplos crescem de mil em mil: **KB** (quilobyte), **MB** (megabyte), **GB** (gigabyte) e **TB** (terabyte).\n\n- 1 KB ≈ mil bytes (um texto curto)\n- 1 MB ≈ um milhão de bytes (uma foto)\n- 1 GB ≈ um bilhão (um filme em HD)\n- 1 TB ≈ mil GB (centenas de filmes)\n\nAtenção a duas pegadinhas: **bit** (b minúsculo) é diferente de **byte** (B maiúsculo), e fabricantes contam de mil em mil, enquanto alguns sistemas contam de 1024 em 1024.',
    essencial:
      '1 byte = 8 bits. KB, MB, GB, TB: cada um ≈ 1000 vezes o anterior. Mbps (bits) ÷ 8 = MB/s. Disco de 500 GB aparece menor por causa da base 1000 × 1024.',
    guiado:
      'Para estimar o tempo de um download:\n1. Veja o tamanho do arquivo (por exemplo, 1 GB = 1000 MB).\n2. Converta a velocidade: 100 Mbps ÷ 8 = 12,5 MB/s.\n3. Divida: 1000 ÷ 12,5 = 80 segundos.',
    tecnico:
      'O SI define KB = 10³ B, MB = 10⁶ B etc. A norma IEC define KiB = 2¹⁰ B, MiB = 2²⁰ B, GiB = 2³⁰ B. Fabricantes de discos usam SI; o Windows exibe GiB mas escreve "GB"; Linux e macOS atuais costumam usar SI. Por isso 500 GB (SI) correspondem a cerca de 465,7 GiB. Taxas de rede são em bits por segundo (kbps, Mbps, Gbps).',
  },
  analogia: {
    titulo: 'Litros e baldes',
    texto:
      'Pense em dados como água. O byte é um copo; o KB, uma garrafa; o MB, um balde; o GB, uma piscina pequena. A velocidade da internet é a vazão da torneira (bits por segundo), e o tamanho do arquivo é o volume a encher. Para saber quanto demora, divida o volume pela vazão, lembrando de usar a mesma unidade nos dois.',
    limites:
      'Água é contínua; dados são discretos (bits). E, ao contrário dos litros, o "quilo" tem dois significados: 1000 (fabricantes) e 1024 (alguns sistemas operacionais).',
  },
  demo: {
    titulo: 'Quanto cabe no disco?',
    instrucoes:
      'Mantenha 500 GB e compare o valor anunciado com o que o sistema mostra. Depois troque para 64 GB e veja quantas fotos, músicas e filmes cabem. Tente 1 TB: quantas fotos de 4 MB?',
    simulacao: { tipo: 'unidades' },
  },
  tecnica: {
    titulo: 'Conversões e armadilhas',
    texto:
      '**Tabela (base 1000):** 1 KB = 1.000 B; 1 MB = 1.000 KB; 1 GB = 1.000 MB; 1 TB = 1.000 GB.\n\n**Tabela (base 1024):** 1 KiB = 1.024 B; 1 MiB = 1.024 KiB; 1 GiB = 1.024 MiB.\n\n**Bits e bytes:** b minúsculo é bit; B maiúsculo é byte. 1 B = 8 b. Redes usam bits (Mbps); arquivos usam bytes (MB).\n\n**Diferença cresce com o tamanho:** em KB, a diferença é 2,4%; em GB, 7,4%; em TB, 10%.\n\n**Exemplo:** disco de 1 TB (SI) = 10¹² B ≈ 931 GiB.',
  },
  diagrama: {
    titulo: 'Calcular o tempo de download',
    nos: [
      { forma: 'inicio', texto: 'Tamanho do arquivo e velocidade da internet' },
      { forma: 'passo', texto: 'Converta a velocidade de Mbps para MB/s dividindo por 8' },
      { forma: 'passo', texto: 'Converta o arquivo para MB (1 GB = 1000 MB)' },
      { forma: 'fim', texto: 'Tempo em segundos = tamanho em MB ÷ velocidade em MB/s' },
    ],
    descricao:
      'Dado o tamanho do arquivo e a velocidade da internet, converte-se a velocidade de megabits para megabytes por segundo dividindo por 8, converte-se o arquivo para MB e divide-se um pelo outro para obter o tempo em segundos.',
  },
  exemplo: {
    titulo: 'Baixar um jogo de 50 GB',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'arquivo = 50 GB = 50.000 MB\nvelocidade = 200 Mbps = 200 / 8 = 25 MB/s\ntempo = 50.000 / 25 = 2.000 segundos\n2.000 s ≈ 33 minutos',
    },
    comentarios: [
      { linha: 1, texto: 'Passamos tudo para MB para poder comparar com a velocidade.' },
      { linha: 2, texto: 'Dividir por 8 passa de bits para bytes.' },
      { linha: 4, texto: 'Na prática demora um pouco mais, pois a velocidade real oscila.' },
    ],
  },
  guiado: [
    prever(
      'Quantos bytes tem 1 KB, usando a base dos fabricantes (1000)?',
      '1 KB = ? bytes',
      ['1000', '1.000', '1 000'],
      'Na base 1000, 1 KB = 1.000 bytes. Na base 1024, seriam 1.024 (um KiB).',
      [{ resposta: '1024', feedback: '1024 é a base binária (KiB); fabricantes usam 1000.' }],
    ),
    mc(
      'A letra "b" minúscula em Mbps significa:',
      'Bit',
      [
        ['Byte', 'Byte é B maiúsculo (MB/s).'],
        ['Bloco', 'Não é uma unidade de medida de dados.'],
      ],
      'Mbps = megabits por segundo. Dividindo por 8 obtemos MB/s.',
    ),
  ],
  indep: [
    prever(
      'Quantos segundos leva para baixar 1 GB (8000 megabits) a 100 Mbps?',
      'tempo = 8000 Mb / 100 Mbps',
      ['80'],
      '8000 ÷ 100 = 80 segundos (equivale a 1000 MB ÷ 12,5 MB/s).',
      [{ resposta: '10', feedback: 'Cuidado com a unidade: 1 GB = 8000 megabits, não 1000.' }],
    ),
    mc(
      'Por que um disco de 500 GB aparece com cerca de 466 GB no Windows?',
      'O fabricante conta de 1000 em 1000 e o sistema conta de 1024 em 1024',
      [
        [
          'O restante é reservado para vírus',
          'Não há reserva para isso: a diferença é só de unidade.',
        ],
        ['O disco vem com defeito', 'Não é defeito: os mesmos bytes são contados com outra base.'],
      ],
      '500 × 10⁹ bytes ÷ 2³⁰ ≈ 465,7 GiB, mostrado como "466 GB".',
      1,
    ),
  ],
  desafio: prever(
    'Um cartão de 64 GB (base 1000) guarda fotos de 4 MB (base 1000). Quantas fotos cabem?',
    '64 GB = 64.000 MB\nfotos = 64.000 / 4',
    ['16000', '16.000', '16 000'],
    '64.000 MB ÷ 4 MB = 16.000 fotos.',
    [{ resposta: '16', feedback: 'Converta GB em MB antes de dividir: 64 GB = 64.000 MB.' }],
  ),
  rec: [
    mc(
      'Quantos bits tem 1 byte?',
      '8',
      [
        ['4', '4 bits formam um dígito hexadecimal, não um byte.'],
        ['16', '16 bits são 2 bytes.'],
      ],
      '1 byte = 8 bits: por isso Mbps ÷ 8 = MB/s.',
    ),
    mc(
      'O que cresce com o tamanho do disco: a diferença entre base 1000 e base 1024?',
      'Sim: cerca de 2,4% em KB, 7,4% em GB e 10% em TB',
      [
        ['Não, é sempre igual', 'A diferença se acumula a cada nível de unidade (1,024^n).'],
        ['Diminui, até desaparecer em TB', 'Pelo contrário: aumenta em cada nível.'],
      ],
      'Cada nível multiplica o desvio: 1,024, 1,024², 1,024³ e assim por diante.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que "100 Mbps" não significa baixar 100 MB por segundo.',
    modelo:
      'Mbps é megabits por segundo, e um byte tem 8 bits. Para obter megabytes por segundo, divide-se por 8: 100 Mbps equivalem a no máximo 12,5 MB/s.',
    rubrica: [
      'Distinguiu bit de byte',
      'Citou que um byte tem 8 bits',
      'Chegou a 12,5 MB/s (ou à divisão por 8)',
    ],
  },
  resumo: [
    '1 byte = 8 bits; KB, MB, GB e TB crescem de mil em mil (base 1000).',
    'b minúsculo é bit (Mbps); B maiúsculo é byte (MB/s). Divida por 8.',
    'Discos "perdem" espaço aparente por causa de base 1000 × base 1024.',
    'Tempo = tamanho ÷ velocidade, na mesma unidade.',
  ],
  cards: [
    ['Quantos bits tem 1 byte?', '8 bits.'],
    ['Como passar de Mbps para MB/s?', 'Dividir por 8.'],
    ['O que é KiB?', '1.024 bytes (base binária); KB, na base dos fabricantes, é 1.000.'],
    ['Quantos MB tem 1 GB (base 1000)?', '1.000 MB.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes: contratos de internet usam bits por segundo.',
      'Banco de Dados: dimensionar armazenamento exige estimar bytes por registro.',
      'Nuvem: preços de armazenamento e tráfego são cobrados por GB.',
    ],
    profissional:
      'Em chamados de "disco cheio" ou "download lento", converter unidades corretamente evita diagnósticos errados e ajuda a dimensionar espaço e banda.',
  },
});
