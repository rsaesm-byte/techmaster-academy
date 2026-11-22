import { mc, montar, ordenar, prever } from './montar';

export const f06 = montar({
  id: 'fundamentos.m02.a01',
  titulo: 'Sistema operacional e processos',
  objetivo:
    'Explicar o que faz um sistema operacional, o que é um processo e como o escalonador reveza a CPU entre vários programas.',
  pre: ['fundamentos.m01.a04'],
  min: 30,
  diag: mc(
    'Você ouve música, navega e roda o antivírus ao mesmo tempo, mas o computador tem poucos núcleos de CPU. Como isso é possível?',
    'O sistema operacional reveza a CPU entre os programas, em fatias de tempo muito curtas',
    [
      [
        'Cada programa recebe um núcleo só dele, por isso nada disputa a CPU',
        'Com poucos núcleos não dá para dar um a cada programa.',
      ],
      [
        'Só o programa da tela ativa roda; os outros ficam pausados até você voltar',
        'Programas em segundo plano continuam sendo atendidos em fatias.',
      ],
    ],
    'O sistema operacional distribui a CPU em fatias de milissegundos, dando a impressão de que tudo roda ao mesmo tempo.',
    2,
  ),
  simples: {
    titulo: 'O gerente do computador',
    texto:
      'O **sistema operacional** (Windows, Linux, macOS, Android) é o programa que gerencia tudo: reparte a **CPU** e a **memória** entre os programas, controla os **arquivos** e conversa com os **dispositivos** (teclado, tela, rede). Os programas pedem o que precisam e o sistema decide.\n\nUm **processo** é um programa em execução. Abrir o navegador cria um processo; abrir três janelas pode criar vários. O sistema guarda uma lista deles.\n\nQuem decide qual processo usa a CPU agora é o **escalonador**. No **Round Robin**, cada processo recebe uma pequena fatia de tempo e volta para o fim da fila.',
    essencial:
      'SO = gerente de CPU, memória, arquivos e dispositivos. Processo = programa em execução. Escalonador = decide quem usa a CPU; Round Robin reveza em fatias.',
    guiado:
      'Para entender o revezamento:\n1. Há uma fila de processos esperando a CPU.\n2. O primeiro usa a CPU por uma fatia de tempo.\n3. Se não terminou, volta para o fim da fila.\n4. O próximo da fila usa a CPU.\n5. Repete até todos terminarem.',
    tecnico:
      'O kernel implementa processos (espaço de endereçamento próprio, estado e contexto), escalonamento e gerência de memória e E/S. A troca de contexto salva os registradores de um processo e carrega os do próximo. Escalonadores como Round Robin favorecem a responsividade; FIFO é simples, mas um processo longo atrasa todos os seguintes (efeito comboio).',
  },
  analogia: {
    titulo: 'Um atendente e uma fila de clientes',
    texto:
      'Imagine um único atendente (a CPU) e vários clientes (os processos). No FIFO, ele atende cada cliente até o fim, e quem tem um pedido pequeno espera atrás de quem tem um enorme. No Round Robin, atende um pouco de cada cliente por vez, voltando à fila: ninguém fica horas sem resposta.',
    limites:
      'Alternar de cliente custa tempo (a troca de contexto), então fatias muito curtas desperdiçam trabalho. E computadores com vários núcleos têm vários atendentes ao mesmo tempo.',
  },
  demo: {
    titulo: 'FIFO contra Round Robin',
    instrucoes:
      'Compare os dois algoritmos na linha do tempo. No FIFO, quando a Música termina? E no Round Robin? Depois mude a fatia de tempo e observe o que acontece com a ordem e a espera média.',
    simulacao: { tipo: 'escalonador', algoritmo: 'fifo', quantum: 2 },
  },
  tecnica: {
    titulo: 'Estados, troca de contexto e métricas',
    texto:
      '**Estados de um processo:** pronto (esperando a CPU), executando e bloqueado (esperando disco, rede ou teclado).\n\n**Troca de contexto:** o sistema salva os registradores e o PC do processo atual e carrega os do próximo. Custa tempo, por isso a fatia (quantum) não pode ser pequena demais.\n\n**Métricas:** tempo de espera (quanto o processo ficou na fila) e tempo de resposta (quanto demora a começar). O Round Robin melhora a resposta; a espera média pode até subir um pouco.\n\n**No dia a dia:** o Gerenciador de Tarefas (Windows) e o `top` (Linux) mostram os processos e quanto da CPU e da memória cada um consome.',
  },
  diagrama: {
    titulo: 'Round Robin',
    nos: [
      { forma: 'inicio', texto: 'Fila de processos prontos' },
      { forma: 'passo', texto: 'O primeiro da fila usa a CPU por uma fatia de tempo' },
      { forma: 'decisao', texto: 'Terminou? Se não, volta para o fim da fila' },
      { forma: 'passo', texto: 'O próximo da fila recebe a CPU' },
      { forma: 'fim', texto: 'Acaba quando a fila esvazia' },
    ],
    descricao:
      'Os processos prontos ficam numa fila. O primeiro usa a CPU por uma fatia de tempo. Se não terminou, volta para o fim da fila; se terminou, sai. Depois o próximo da fila recebe a CPU, e assim até a fila esvaziar.',
  },
  exemplo: {
    titulo: 'Três programas, fatia de 2 unidades',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Navegador: 5   Música: 2   Antivírus: 3\n0-2  Navegador (faltam 3)\n2-4  Música (terminou em 4)\n4-6  Antivírus (faltam 1)\n6-8  Navegador (faltam 1)\n8-9  Antivírus (terminou em 9)\n9-10 Navegador (terminou em 10)',
    },
    comentarios: [
      { linha: 2, texto: 'Cada um recebe até 2 unidades e volta ao fim da fila.' },
      { linha: 3, texto: 'A Música só precisava de 2: termina já na primeira vez.' },
      { linha: 7, texto: 'Todos terminaram em 10 unidades, o mesmo tempo total do FIFO.' },
    ],
  },
  guiado: [
    mc(
      'O que é um processo?',
      'Um programa em execução',
      [
        [
          'O arquivo do programa guardado no disco',
          'O arquivo é só o programa parado; o processo existe quando ele roda.',
        ],
        ['Um tipo de CPU', 'A CPU é o hardware; o processo é o programa usando a CPU.'],
      ],
      'O mesmo programa pode gerar vários processos, cada um com sua memória e seu estado.',
    ),
    prever(
      'Com FIFO e processos A (3 unidades) e B (2 unidades), nessa ordem, em que instante B termina?',
      'FIFO: executa A até o fim, depois B.\nA: 3 unidades\nB: 2 unidades',
      ['5'],
      'A ocupa a CPU de 0 a 3 e B de 3 a 5. B termina em 5.',
      [{ resposta: '2', feedback: 'B precisa esperar A terminar antes de começar.' }],
    ),
  ],
  indep: [
    mc(
      'Qual é a vantagem do Round Robin sobre o FIFO?',
      'Programas curtos não ficam presos atrás de programas longos',
      [
        [
          'Ele termina todos os programas mais rápido no total',
          'O tempo total é o mesmo; o que muda é a ordem e a responsividade.',
        ],
        [
          'Ele não precisa de CPU',
          'Todo algoritmo precisa de CPU: o que muda é como ela é repartida.',
        ],
      ],
      'O revezamento garante que todos avancem, então a interface continua respondendo mesmo com um programa pesado rodando.',
      1,
    ),
    prever(
      'Com Round Robin (fatia 2), A precisa de 3 unidades e B de 2, nessa ordem. Qual é a sequência de uso da CPU? Responda com letras juntas (ex.: ABA).',
      'Fatia: 2\nA: 3 unidades\nB: 2 unidades',
      ['ABA'],
      'A usa 0–2 (falta 1), B usa 2–4 e termina, A volta e usa 4–5.',
      [{ resposta: 'AAB', feedback: 'No revezamento, A só fica 2 unidades e dá a vez a B.' }],
    ),
  ],
  desafio: ordenar(
    'Coloque na ordem o que acontece quando a fatia de tempo de um processo acaba.',
    [
      'O sistema interrompe o processo',
      'Os registradores dele são salvos (troca de contexto)',
      'O próximo processo da fila é carregado',
      'O processo interrompido volta para o fim da fila',
    ],
    'O sistema interrompe, guarda o estado do processo, entrega a CPU ao seguinte e recoloca o interrompido na fila.',
  ),
  rec: [
    mc(
      'O que o escalonador decide?',
      'Qual processo usa a CPU agora',
      [
        ['Qual arquivo apagar', 'Arquivos são tarefa do sistema de arquivos.'],
        ['Qual senha é a mais forte', 'Isso não tem relação com o escalonador.'],
      ],
      'O escalonador reparte o tempo de CPU entre os processos prontos.',
    ),
    mc(
      'Por que fatias de tempo muito pequenas podem piorar o desempenho?',
      'Porque a troca de contexto também gasta tempo',
      [
        [
          'Porque a CPU esquenta menos',
          'O problema não é temperatura, e sim o tempo gasto nas trocas.',
        ],
        [
          'Porque os programas não conseguem rodar',
          'Rodam, mas gastam muito tempo sendo trocados.',
        ],
      ],
      'Cada troca salva e carrega registradores. Se a fatia é minúscula, sobra pouco tempo para trabalho útil.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que o computador parece rodar vários programas ao mesmo tempo.',
    modelo:
      'O sistema operacional reveza a CPU entre os processos em fatias de tempo muito curtas. Como a troca é rapidíssima, cada programa avança um pouco de cada vez e, para nós, parece que todos rodam juntos.',
    rubrica: [
      'Citou o revezamento da CPU (escalonador)',
      'Mencionou as fatias de tempo curtas',
      'Explicou que é uma impressão de simultaneidade',
    ],
  },
  resumo: [
    'O sistema operacional gerencia CPU, memória, arquivos e dispositivos.',
    'Processo é um programa em execução; o escalonador escolhe quem usa a CPU.',
    'Round Robin reveza em fatias de tempo; FIFO atende um até o fim.',
    'Trocar de processo custa tempo (troca de contexto).',
  ],
  cards: [
    [
      'O que faz um sistema operacional?',
      'Gerencia CPU, memória, arquivos e dispositivos para os programas.',
    ],
    ['O que é um processo?', 'Um programa em execução.'],
    ['O que é o escalonador?', 'A parte do sistema que decide qual processo usa a CPU.'],
    [
      'Como funciona o Round Robin?',
      'Cada processo usa a CPU por uma fatia de tempo e volta ao fim da fila.',
    ],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: a troca de contexto salva e restaura os registradores da CPU.',
      'Lógica de Programação: threads e programação assíncrona também dependem do escalonamento.',
      'Infraestrutura e Servidores: servidores e contêineres dividem CPU e memória entre muitos processos.',
    ],
    profissional:
      'Num chamado de lentidão, abrir o Gerenciador de Tarefas e ver qual processo consome CPU ou memória é o primeiro passo do diagnóstico.',
  },
});
