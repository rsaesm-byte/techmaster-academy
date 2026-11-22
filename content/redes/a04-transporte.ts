import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const r04 = montar({
  id: 'redes.m01.a04',
  titulo: 'Transporte: TCP, UDP e portas',
  objetivo: 'Diferenciar TCP e UDP, entender portas e o handshake de três vias.',
  pre: ['redes.m01.a03'],
  min: 30,
  diag: mc(
    'O IP leva o pacote até a máquina. O que leva os dados ao programa certo dentro dela?',
    'A porta',
    [
      ['O MAC', 'O MAC identifica a placa de rede no enlace.'],
      ['O DNS', 'O DNS traduz nomes em IPs.'],
    ],
    'IP identifica a máquina; a porta identifica o programa.',
  ),
  simples: {
    titulo: 'Prédio, apartamento e carta registrada',
    texto:
      'O **IP** é o endereço do prédio; a **porta** é o número do apartamento. Portas conhecidas: **80** (HTTP), **443** (HTTPS), **22** (SSH), **53** (DNS), **25** (e-mail).\n\nDois jeitos de entregar:\n- **TCP:** confiável, como carta registrada. Confirma o recebimento, reenvia o que se perde e mantém a ordem. Mais lento, mas seguro (web, e-mail, arquivos).\n- **UDP:** rápido, como cartão-postal. Sem confirmação nem reenvio. Ótimo para o que não pode esperar (vídeo ao vivo, jogos, DNS).',
    essencial:
      'Porta escolhe o programa. TCP é confiável e ordenado; UDP é rápido e sem garantias.',
    guiado:
      'Para escolher:\n1. Perder dados é inaceitável (arquivo, página, e-mail)? Use TCP.\n2. Atraso é pior do que perder um pedaço (chamada, jogo)? Use UDP.',
    tecnico:
      'O TCP abre a conexão com o **handshake de três vias**: SYN (cliente), SYN-ACK (servidor) e ACK (cliente). Depois numera os bytes, exige confirmações (ACK), reenvia pelo tempo de espera e controla o fluxo e a congestão. As portas têm 16 bits (0 a 65535): as de 0 a 1023 são **conhecidas**, as altas (acima de 49152) são **efêmeras**, escolhidas pelo cliente. Uma conexão é identificada pela quádrupla IP e porta de origem + IP e porta de destino. O QUIC (base do HTTP/3) roda sobre UDP, reimplementando a confiabilidade.',
  },
  analogia: {
    titulo: 'Carta registrada contra cartão-postal',
    texto:
      'No TCP, o carteiro exige assinatura e, se a carta se perde, você manda outra. No UDP, você joga o cartão na caixa e segue a vida: rápido, mas sem garantia de chegada.',
    limites:
      'Em muitas aplicações (como chamadas), perder um pedaço é melhor do que esperar o reenvio.',
  },
  demo: {
    titulo: 'Handshake e perda de pacotes',
    instrucoes:
      'Execute: o handshake abre a conexão e o TCP reenvia o pacote perdido. Mude quais pacotes se perdem na lista "perdidos".',
    simulacao: {
      tipo: 'js',
      codigo:
        'console.log("Cliente -> Servidor: SYN");\nconsole.log("Servidor -> Cliente: SYN-ACK");\nconsole.log("Cliente -> Servidor: ACK (conexão aberta)");\nconst perdidos = [2];\nfor (let n = 1; n <= 4; n++) {\n  let tentativas = 1;\n  while (perdidos.includes(n) && tentativas === 1) {\n    console.log("Pacote " + n + " perdido, sem ACK...");\n    tentativas++;\n  }\n  console.log("Pacote " + n + " entregue" + (tentativas > 1 ? " após reenvio" : ""));\n}\nconsole.log("UDP: o pacote 2 teria se perdido e ninguém reenviaria.");',
    },
  },
  tecnica: {
    titulo: 'Portas e comandos úteis',
    texto:
      '**Portas comuns:** 20/21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 3306 MySQL, 5432 PostgreSQL.\n**Comandos:** `ss -tulpn` (Linux) e `netstat -ano` (Windows) mostram portas abertas; `nc -zv host 443` testa se uma porta responde.\n**Regra de segurança:** deixe abertas só as portas de que precisa.',
  },
  diagrama: {
    titulo: 'Handshake de três vias',
    nos: [
      { forma: 'inicio', texto: 'Cliente envia SYN' },
      { forma: 'passo', texto: 'Servidor responde SYN-ACK' },
      { forma: 'passo', texto: 'Cliente envia ACK' },
      { forma: 'fim', texto: 'Conexão aberta: os dados podem fluir' },
    ],
    descricao: 'Três mensagens combinam os números de sequência antes dos dados.',
  },
  exemplo: {
    titulo: 'Abrindo um site seguro',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Navegador: porta 52311 (efêmera)\nServidor:  porta 443 (HTTPS)\nProtocolo: TCP + TLS\nHandshake TCP, depois TLS, depois o pedido HTTP',
    },
    comentarios: [
      { linha: 1, texto: 'O cliente escolhe uma porta alta qualquer.' },
      { linha: 2, texto: 'O servidor escuta numa porta conhecida.' },
      { linha: 4, texto: 'Cada camada faz sua parte antes de a seguinte começar.' },
    ],
  },
  guiado: [
    prever(
      'Quantas portas existem, de 0 a 65535? (calcule 2 elevado a 16)',
      'console.log(2 ** 16);',
      ['65536'],
      'Portas têm 16 bits: 2^16 = 65.536 valores (0 a 65535).',
      [{ resposta: '65535', feedback: '65535 é o número da última porta; o total é 65536.' }],
    ),
    mc(
      'Para uma chamada de vídeo ao vivo, qual costuma ser melhor?',
      'UDP, porque o atraso é pior do que perder um pedaço',
      [
        [
          'TCP, porque ele garante que nada se perca durante a chamada',
          'O reenvio atrasa a chamada; perder um pedaço é melhor que esperar.',
        ],
        [
          'Tanto faz, pois os dois funcionam igual em tempo real',
          'Eles têm comportamentos diferentes.',
        ],
      ],
      'Tempo real prefere velocidade à garantia.',
    ),
  ],
  indep: [
    mc(
      'Em qual porta o HTTPS costuma escutar?',
      '443',
      [
        ['80', 'Essa é a porta do HTTP sem criptografia.'],
        ['22', 'Essa é a porta do SSH.'],
      ],
      'HTTPS usa a 443.',
    ),
    completar(
      'Complete a lista das mensagens do handshake.',
      'const passos = ["SYN", "SYN-___", "ACK"];\nconsole.log(passos.join(" > "));',
      [{ aceitas: ['ACK'], feedback: 'O servidor responde com SYN-ACK.' }],
      'SYN, SYN-ACK e ACK.',
    ),
  ],
  desafio: ordenar(
    'Ordene o handshake de três vias do TCP.',
    [
      'Cliente envia SYN',
      'Servidor responde SYN-ACK',
      'Cliente envia ACK',
      'Dados começam a fluir',
    ],
    'Só depois das três mensagens a conexão está aberta.',
  ),
  rec: [
    associar(
      'Associe a porta ao serviço.',
      [
        ['22', 'SSH'],
        ['53', 'DNS'],
        ['80', 'HTTP'],
        ['443', 'HTTPS'],
      ],
      'Portas conhecidas valem a pena memorizar.',
    ),
    mc(
      'Qual característica é do TCP e não do UDP?',
      'Confirmação e reenvio dos dados perdidos',
      [
        ['Ser mais rápido, por não esperar confirmações', 'Isso descreve o UDP.'],
        ['Não usar portas, pois os dados vão direto ao programa', 'Os dois usam portas.'],
      ],
      'TCP é orientado a conexão e confiável.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre TCP e UDP e dê um exemplo de uso para cada um.',
    modelo:
      'O TCP abre uma conexão, confirma o recebimento, reenvia o que se perde e mantém a ordem, sendo ideal para páginas web, e-mail e arquivos. O UDP só envia, sem garantias, o que o torna mais rápido e adequado a chamadas de vídeo, jogos e consultas DNS.',
    rubrica: [
      'Descreveu a confiabilidade do TCP',
      'Descreveu a simplicidade e velocidade do UDP',
      'Deu um exemplo de cada',
    ],
  },
  resumo: [
    'Porta identifica o programa; IP identifica a máquina.',
    'TCP: confiável, ordenado, com handshake.',
    'UDP: rápido, sem garantias.',
    'Portas conhecidas: 22, 53, 80, 443.',
  ],
  cards: [
    ['Porta do HTTPS?', '443.'],
    ['TCP ou UDP para jogos?', 'Em geral UDP.'],
    ['Mensagens do handshake?', 'SYN, SYN-ACK, ACK.'],
    ['Quantos bits tem uma porta?', '16.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: DNS e HTTP usam estas portas e protocolos.',
      'HTML, CSS e a Web: WebSockets e HTTP/3 dependem do transporte.',
      'Cibersegurança: varredura de portas e firewalls.',
    ],
    profissional:
      'Quando um serviço "não conecta", testar se a porta está aberta é um dos primeiros passos.',
  },
});
