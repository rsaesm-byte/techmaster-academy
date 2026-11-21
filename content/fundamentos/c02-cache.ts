import { mc, montar, ordenar, prever } from './montar';

export const f12 = montar({
  id: 'fundamentos.m03.a02',
  titulo: 'Hierarquia de memória e cache',
  objetivo:
    'Explicar por que existem vários níveis de memória, o que é uma cache, o que são acerto e falha e como a política LRU decide o que manter.',
  pre: ['fundamentos.m01.a04', 'fundamentos.m03.a01'],
  min: 30,
  diag: mc(
    'Por que o computador não usa só uma memória enorme e rapidíssima para tudo?',
    'Porque memória rápida é cara e pequena; por isso há níveis, dos mais rápidos e pequenos aos mais lentos e grandes',
    [
      [
        'Porque ninguém conseguiu fabricar memória rápida',
        'Ela existe (a cache e os registradores), mas custa caro e ocupa muito espaço.',
      ],
      ['Porque memória rápida não guarda dados', 'Guarda, mas em pequena quantidade.'],
    ],
    'Há um compromisso entre velocidade, tamanho e preço. A hierarquia de memória combina vários níveis para ter o melhor dos dois mundos.',
  ),
  simples: {
    titulo: 'A mesa, a estante e o arquivo morto',
    texto:
      'A CPU é rapidíssima, mas buscar dados longe a deixa esperando. Por isso a memória é organizada em **níveis**:\n\n1. **Registradores**: dentro da CPU, minúsculos e instantâneos.\n2. **Cache**: pequena e muito rápida, perto da CPU.\n3. **RAM**: maior, mais lenta.\n4. **SSD ou HD**: enorme, bem mais lento, mas guarda mesmo com o computador desligado.\n\nA **cache** guarda cópias do que foi usado há pouco, apostando que será usado de novo. Se o dado está lá, é um **acerto** (hit); se não, é uma **falha** (miss) e é preciso buscar no nível de baixo.',
    essencial:
      'Níveis: registradores > cache > RAM > SSD/HD. Quanto mais perto da CPU, mais rápido e menor. Cache: acerto = achou; falha = foi buscar embaixo.',
    guiado:
      'Para seguir um acesso:\n1. A CPU pede o dado X.\n2. Se X está na cache, é acerto: resposta imediata.\n3. Se não, é falha: busca na RAM (mais lento).\n4. O dado é copiado para a cache; se estiver cheia, algum outro sai.',
    tecnico:
      'A eficácia da cache vem da localidade: temporal (o que foi usado tende a ser usado de novo) e espacial (vizinhos também). Ordens de grandeza de latência: registradores < 1 ns; cache de 1 a 10 ns; RAM cerca de 100 ns; SSD cerca de 100 µs; HD cerca de 10 ms. Políticas de substituição como LRU removem a linha menos usada recentemente.',
  },
  analogia: {
    titulo: 'Mesa, estante e arquivo no porão',
    texto:
      'Você estuda numa mesa pequena (cache) com os livros do momento. Os que não cabem ficam na estante do quarto (RAM). O resto fica no arquivo morto do porão (SSD ou HD). Quanto mais perto, mais rápido de pegar, e menor o espaço. Se precisa de um livro que não está na mesa, perde tempo indo buscar e, para abrir espaço, devolve outro à estante.',
    limites:
      'Na vida real, você decide conscientemente o que deixar na mesa. A cache faz isso sozinha, por regras simples como "tirar o que está sem uso há mais tempo". E o porão (disco) guarda mesmo quando a luz (a energia) acaba.',
  },
  demo: {
    titulo: 'Acertos e falhas na cache',
    instrucoes:
      'Com a sequência 1 2 3 1 4 1 2 e cache de 3 linhas, observe quais acessos são acertos (H) e quais são falhas (M). Troque LRU por FIFO: o que muda? Depois aumente a cache para 4 e veja a taxa de acerto subir.',
    simulacao: { tipo: 'cache' },
  },
  tecnica: {
    titulo: 'LRU, FIFO e a taxa de acerto',
    texto:
      '**Taxa de acerto** = acertos ÷ acessos. Mesmo 90% de acertos muda tudo, pois a falha custa dezenas ou centenas de vezes mais.\n\n**LRU (Least Recently Used):** quando falta espaço, remove o que foi usado há mais tempo. Um acerto "renova" o item.\n\n**FIFO:** remove o que entrou primeiro, mesmo que seja usado o tempo todo.\n\n**Localidade:** programas repetem laços e usam dados vizinhos; por isso caches pequenas dão grande ganho.\n\n**Aparece em todo lugar:** o navegador guarda páginas e imagens (cache), o DNS guarda respostas, bancos de dados guardam consultas, e CDNs guardam cópias de sites perto do usuário.',
  },
  diagrama: {
    titulo: 'Um acesso à memória',
    nos: [
      { forma: 'inicio', texto: 'A CPU pede um dado' },
      { forma: 'decisao', texto: 'O dado está na cache?' },
      { forma: 'passo', texto: 'Sim (acerto): responde na hora' },
      { forma: 'passo', texto: 'Não (falha): busca na RAM e copia para a cache' },
      { forma: 'fim', texto: 'Se a cache estava cheia, remove um item (LRU)' },
    ],
    descricao:
      'A CPU pede um dado. Se está na cache, é um acerto e a resposta é imediata. Se não está, é uma falha: o dado é buscado na RAM e copiado para a cache. Se a cache estava cheia, um item é removido, por exemplo o menos usado recentemente.',
  },
  exemplo: {
    titulo: 'Cache de 2 linhas com LRU',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'acessos: 1 2 1 3 1\n1 -> falha  cache [1]\n2 -> falha  cache [1, 2]\n1 -> acerto cache [2, 1]\n3 -> falha  cache [1, 3] (saiu o 2)\n1 -> acerto cache [3, 1]',
    },
    comentarios: [
      { linha: 4, texto: 'O acerto renova o 1: agora o menos recente é o 2.' },
      { linha: 5, texto: 'A cache está cheia: sai o 2, que está sem uso há mais tempo.' },
      {
        linha: 6,
        texto: 'O 1 continuou na cache porque foi usado várias vezes: 2 acertos em 5 acessos.',
      },
    ],
  },
  guiado: [
    mc(
      'O que é um "acerto" (cache hit)?',
      'O dado procurado já estava na cache',
      [
        ['O programa terminou sem erros', 'Acerto é só sobre a cache achar o dado.'],
        ['A CPU adivinhou o resultado de uma conta', 'Não é palpite: o dado estava guardado.'],
      ],
      'No acerto, não é preciso ir à RAM, e a resposta é muito mais rápida.',
    ),
    mc(
      'Qual destas memórias é a mais rápida?',
      'Registradores',
      [
        ['RAM', 'A RAM é mais lenta que a cache e os registradores.'],
        ['SSD', 'O SSD é muito mais lento que a RAM.'],
      ],
      'Quanto mais perto da CPU, mais rápida (e menor) é a memória.',
    ),
  ],
  indep: [
    prever(
      'Cache de 2 linhas, política LRU. Acessos: 1 2 1 3 1. Quantos acertos?',
      'acessos: 1 2 1 3 1\ncapacidade: 2\npolítica: LRU',
      ['2'],
      'Acertam o 3º acesso (1) e o 5º (1): o 1 é renovado e nunca sai.',
      [
        {
          resposta: '1',
          feedback: 'Com LRU, o 1 é renovado a cada uso e nunca é removido: há 2 acertos.',
        },
      ],
      ['Anote o conteúdo da cache depois de cada acesso.'],
    ),
    prever(
      'Mesma sequência (1 2 1 3 1) e cache de 2 linhas, mas política FIFO. Quantos acertos?',
      'acessos: 1 2 1 3 1\ncapacidade: 2\npolítica: FIFO (acerto NÃO renova o item)',
      ['1'],
      'FIFO remove o 1 ao chegar o 3 (ele entrou primeiro), mesmo que fosse muito usado. O último acesso ao 1 vira falha: só o 3º acesso acerta.',
      [
        {
          resposta: '2',
          feedback:
            'Isso seria o LRU. No FIFO, o acerto não renova o 1 e ele sai quando o 3 chega.',
        },
      ],
    ),
  ],
  desafio: ordenar(
    'Coloque na ordem o que ocorre numa falha de cache com a cache cheia.',
    [
      'A CPU pede um dado que não está na cache',
      'O sistema busca o dado na RAM (mais lento)',
      'Um item da cache é removido (por exemplo, o menos usado)',
      'O dado novo é guardado na cache e entregue à CPU',
    ],
    'Primeiro se percebe a falha, busca-se o dado embaixo, abre-se espaço e só então se guarda o novo.',
  ),
  rec: [
    mc(
      'Qual é a ideia por trás da cache?',
      'O que foi usado há pouco provavelmente será usado de novo (localidade)',
      [
        ['Guardar tudo, para nunca faltar espaço', 'A cache é pequena: guarda só uma parte.'],
        ['Substituir a RAM', 'A cache complementa a RAM, não a substitui.'],
      ],
      'Programas repetem laços e dados; por isso, guardar o recente por perto dá grande ganho.',
    ),
    mc(
      'O que a política LRU remove quando a cache está cheia?',
      'O item que está há mais tempo sem ser usado',
      [
        ['O item que chegou por último', 'Esse é o mais recente: ele é o menos provável de sair.'],
        ['Sempre o item maior', 'O tamanho não entra na regra do LRU.'],
      ],
      'LRU = Least Recently Used: menos recentemente usado.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que uma cache pequena já melhora muito a velocidade de um programa.',
    modelo:
      'Os programas tendem a reutilizar os mesmos dados e instruções em pouco tempo (localidade). Uma cache pequena guarda esses dados perto da CPU, então a maior parte dos acessos é acerto e evita a ida lenta à RAM.',
    rubrica: [
      'Citou a reutilização dos mesmos dados (localidade)',
      'Disse que a cache guarda dados perto da CPU',
      'Relacionou acertos com menos idas à RAM',
    ],
  },
  resumo: [
    'A memória é organizada em níveis: mais perto da CPU, mais rápida e menor.',
    'A cache guarda cópias do que foi usado há pouco: acerto é rápido, falha busca embaixo.',
    'LRU remove o menos recentemente usado; FIFO remove o mais antigo.',
    'Taxa de acerto = acertos ÷ acessos.',
  ],
  cards: [
    ['O que é cache?', 'Memória pequena e rápida que guarda cópias do que foi usado recentemente.'],
    [
      'O que é uma falha de cache (miss)?',
      'Quando o dado não está na cache e precisa ser buscado num nível mais lento.',
    ],
    ['O que o LRU remove?', 'O item usado há mais tempo.'],
    [
      'Por que a cache funciona?',
      'Por causa da localidade: dados usados tendem a ser reutilizados.',
    ],
  ],
  conexoes: {
    disciplinas: [
      'Redes: DNS, navegadores e CDNs usam cache para evitar buscas repetidas.',
      'Banco de Dados: consultas e páginas frequentes ficam em cache.',
      'Arquitetura de Computadores: processadores têm caches L1, L2 e L3.',
    ],
    profissional:
      'Quando uma mudança no site "não aparece", costuma ser cache do navegador, do DNS ou do servidor. Saber que a cache existe e como renová-la resolve muitos chamados.',
  },
});
