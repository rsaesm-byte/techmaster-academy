import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const r01 = montar({
  id: 'redes.m01.a01',
  titulo: 'O modelo em camadas e o encapsulamento',
  objetivo:
    'Entender as camadas do modelo TCP/IP e OSI e como os dados são embrulhados a cada camada.',
  pre: ['fundamentos.m02.a04'],
  min: 25,
  diag: mc(
    'Por que redes são organizadas em camadas?',
    'Cada camada resolve um problema e esconde os detalhes das outras',
    [
      [
        'Para deixar a internet mais lenta e mais segura',
        'A camada não existe para reduzir a velocidade.',
      ],
      [
        'Porque cada camada usa um tipo de cabo e de equipamento diferente',
        'Camadas são lógicas, não cabos.',
      ],
    ],
    'Dividir para conquistar: cada camada tem uma função e conversa só com as vizinhas.',
  ),
  simples: {
    titulo: 'Uma carta dentro de envelopes',
    texto:
      'Enviar uma mensagem pela rede é como mandar uma carta: você escreve (aplicação), põe num envelope com o destinatário (transporte e rede) e os Correios a colocam num malote para o próximo trecho (enlace). No destino, cada envelope é aberto na ordem inversa.\n\n**Modelo TCP/IP (4 camadas):**\n1. **Aplicação:** HTTP, DNS, e-mail.\n2. **Transporte:** TCP ou UDP, com portas.\n3. **Internet (rede):** IP e endereçamento.\n4. **Acesso à rede (enlace e física):** Ethernet, Wi-Fi, MAC.',
    essencial:
      'Os dados descem as camadas ganhando cabeçalhos (encapsulamento) e sobem perdendo (desencapsulamento).',
    guiado:
      'Ao abrir um site:\n1. A aplicação (navegador) faz um pedido HTTP.\n2. O transporte (TCP) acrescenta as portas.\n3. A rede (IP) acrescenta origem e destino.\n4. O enlace acrescenta o endereço MAC do próximo salto.',
    tecnico:
      'O modelo OSI tem 7 camadas (Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação) e serve de vocabulário; a internet real segue o TCP/IP. Cada camada produz uma unidade de dados diferente: **mensagem** (aplicação), **segmento** (TCP) ou **datagrama** (UDP), **pacote** (IP) e **quadro** (enlace). Os equipamentos atuam em camadas distintas: switch na 2, roteador na 3, e firewalls e balanceadores na 3 até a 7.',
  },
  analogia: {
    titulo: 'Bonecas russas',
    texto:
      'A mensagem é a boneca menor. O transporte a coloca numa boneca, a rede em outra maior, e o enlace na maior de todas. O destinatário abre uma por vez, até chegar à mensagem original.',
    limites: 'Cada boneca tem cabeçalhos úteis para a rede, e não só embrulho.',
  },
  demo: {
    titulo: 'Embrulhando e desembrulhando',
    instrucoes:
      'Execute e observe cada camada acrescentar seu cabeçalho. Depois troque as portas e os endereços e veja o resultado mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'let dados = "GET /index.html";\nconsole.log("Aplicação: " + dados);\ndados = "[TCP 52311>80]" + dados;\nconsole.log("Transporte: " + dados);\ndados = "[IP 192.168.1.10>93.184.216.34]" + dados;\nconsole.log("Rede: " + dados);\ndados = "[ETH AA:01>BB:02]" + dados;\nconsole.log("Enlace: " + dados);\n// No destino, o caminho é o inverso:\nwhile (dados.startsWith("[")) {\n  dados = dados.slice(dados.indexOf("]") + 1);\n}\nconsole.log("Entregue: " + dados);',
    },
  },
  tecnica: {
    titulo: 'Quem cuida de quê',
    texto:
      '**Aplicação:** o significado do pedido (HTTP, DNS, SMTP).\n**Transporte:** entrega entre programas (portas), com ou sem confiabilidade.\n**Rede:** entrega entre máquinas em redes diferentes (IP, roteamento).\n**Enlace:** entrega entre vizinhos diretos (MAC, switches).\n**Física:** sinais no cabo, fibra ou ar.',
  },
  diagrama: {
    titulo: 'Descida e subida das camadas',
    nos: [
      { forma: 'inicio', texto: 'Aplicação gera a mensagem' },
      { forma: 'passo', texto: 'Transporte, Rede e Enlace acrescentam cabeçalhos' },
      { forma: 'passo', texto: 'Os bits viajam pelo meio físico' },
      { forma: 'fim', texto: 'O destino remove os cabeçalhos até a mensagem' },
    ],
    descricao: 'Encapsulamento na ida, desencapsulamento na chegada.',
  },
  exemplo: {
    titulo: 'Quem lê qual cabeçalho',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Quadro ETH  -> lido pelo switch\nPacote IP   -> lido pelo roteador\nSegmento TCP -> lido pelo sistema do destino\nMensagem HTTP -> lida pelo navegador ou servidor',
    },
    comentarios: [
      { linha: 1, texto: 'O switch só olha o endereço MAC.' },
      { linha: 2, texto: 'O roteador só olha o endereço IP e decide o próximo salto.' },
      { linha: 3, texto: 'A porta indica para qual programa entregar.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'let dados = "oi";\ndados = "TCP[" + dados + "]";\ndados = "IP[" + dados + "]";\nconsole.log(dados);',
      ['IP[TCP[oi]]'],
      'Cada camada embrulha o resultado anterior: o IP fica por fora.',
      [
        {
          resposta: 'TCP[IP[oi]]',
          feedback: 'O TCP foi aplicado primeiro, então fica por dentro.',
        },
      ],
    ),
    mc(
      'Em que camada atua um roteador?',
      'Rede (camada 3)',
      [
        ['Enlace (camada 2)', 'Isso é o switch.'],
        ['Aplicação (camada 7)', 'Roteadores olham o IP, não o conteúdo.'],
      ],
      'O roteador decide pelo endereço IP.',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'let q = "dados";\nfor (const c of ["TCP", "IP", "ETH"]) {\n  q = c + "(" + q + ")";\n}\nconsole.log(q);',
      ['ETH(IP(TCP(dados)))'],
      'A cada volta o novo cabeçalho vai por fora; o último (ETH) fica mais externo.',
      [
        {
          resposta: 'TCP(IP(ETH(dados)))',
          feedback: 'O primeiro da lista fica por dentro, não por fora.',
        },
      ],
    ),
    completar(
      'Complete para remover o cabeçalho externo (até o primeiro colchete que fecha).',
      'let q = "[IP]oi";\nq = q.slice(q.___("]") + 1);\nconsole.log(q);',
      [{ aceitas: ['indexOf'], feedback: 'indexOf devolve a posição do "]".' }],
      'Cortar logo após o "]" remove o cabeçalho.',
    ),
  ],
  desafio: ordenar(
    'Ordene as camadas do TCP/IP, da mais próxima do usuário à mais próxima do cabo.',
    ['Aplicação', 'Transporte', 'Internet (rede)', 'Acesso à rede (enlace e física)'],
    'A aplicação fala com o usuário; o enlace fala com o meio físico.',
  ),
  rec: [
    associar(
      'Associe cada camada à unidade de dados.',
      [
        ['Transporte (TCP)', 'Segmento'],
        ['Rede (IP)', 'Pacote'],
        ['Enlace', 'Quadro'],
        ['Aplicação', 'Mensagem'],
      ],
      'Cada camada tem seu nome para o dado embrulhado.',
    ),
    mc(
      'O que é encapsulamento?',
      'Acrescentar um cabeçalho a cada camada ao enviar',
      [
        [
          'Criptografar tudo o que sai do computador',
          'Criptografia é outro assunto; encapsular é acrescentar cabeçalhos.',
        ],
        ['Comprimir o arquivo antes de enviá-lo pela rede', 'Compressão é outro processo.'],
      ],
      'Cada camada embrulha os dados da camada de cima.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é encapsulamento e por que dividir a rede em camadas ajuda.',
    modelo:
      'Encapsulamento é cada camada acrescentar seu cabeçalho aos dados recebidos da camada acima antes de enviar; no destino os cabeçalhos são removidos em ordem inversa. As camadas separam responsabilidades, permitindo trocar uma (por exemplo Wi-Fi por cabo) sem mudar as outras.',
    rubrica: [
      'Explicou o acréscimo de cabeçalhos',
      'Citou o desencapsulamento no destino',
      'Explicou o benefício da separação em camadas',
    ],
  },
  resumo: [
    'TCP/IP: aplicação, transporte, internet e acesso à rede.',
    'Dados descem ganhando cabeçalhos e sobem perdendo.',
    'Switch usa MAC, roteador usa IP, portas escolhem o programa.',
    'Camadas separam responsabilidades.',
  ],
  cards: [
    ['Quantas camadas tem o TCP/IP?', '4.'],
    ['Que camada o roteador usa?', 'Rede (IP).'],
    ['O que é encapsulamento?', 'Acrescentar cabeçalhos a cada camada.'],
    ['Nome da unidade do enlace?', 'Quadro.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: IP, DNS e HTTP já apareceram; agora vemos a organização geral.',
      'HTML, CSS e a Web: HTTP é a camada de aplicação.',
      'Cibersegurança: ataques e defesas atuam em camadas específicas.',
    ],
    profissional:
      'Dizer "o problema está na camada 2 ou na 3?" acelera muito o diagnóstico de rede.',
  },
});
