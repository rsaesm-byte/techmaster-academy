import { mc, montar, ordenar, prever } from './montar';

export const f04 = montar({
  id: 'fundamentos.m01.a04',
  titulo: 'CPU e memória: como um programa roda',
  objetivo:
    'Explicar o papel da CPU, dos registradores e da memória e acompanhar o ciclo buscar, decodificar e executar em um programa pequeno em assembly.',
  pre: ['fundamentos.m01.a01', 'fundamentos.m01.a03'],
  min: 35,
  diag: mc(
    'Quando você abre um programa, onde ficam suas instruções e dados enquanto ele roda?',
    'Na memória (RAM); a CPU busca de lá o que precisa, pouco a pouco',
    [
      [
        'Dentro da CPU, nos registradores, que guardam o programa inteiro',
        'Os registradores são poucos e minúsculos; o programa fica na RAM.',
      ],
      [
        'Só no disco (HD ou SSD), e a CPU lê dele direto a cada instrução',
        'O disco é lento demais; o programa é carregado na RAM.',
      ],
    ],
    'O programa é carregado do disco para a RAM. A CPU lê instruções e dados da RAM e trabalha em registradores, que são minúsculos e muito rápidos.',
    1,
  ),
  simples: {
    titulo: 'A cozinheira e a despensa',
    texto:
      'A **CPU** (processador) é quem executa as instruções. Ela só sabe fazer coisas simples: copiar um valor, somar, subtrair, comparar e pular para outra instrução. A velocidade vem de fazer bilhões dessas operações por segundo.\n\nA CPU trabalha com poucas "tigelas" internas, os **registradores**. Os dados maiores ficam na **memória (RAM)**, que é como uma despensa de células numeradas (cada número é um **endereço**).\n\nO **PC** (contador de programa) guarda qual é a próxima instrução. A CPU repete sempre o **ciclo**: **buscar** a instrução, **decodificar** (entender o que pede) e **executar**.',
    essencial:
      'CPU executa instruções simples. Registradores = poucos e rapidíssimos. RAM = muitos endereços, mais lenta. Ciclo: buscar, decodificar, executar. PC aponta a próxima instrução.',
    guiado:
      'Para acompanhar um programa:\n1. Veja o PC: ele diz qual instrução é a próxima.\n2. Leia a instrução (por exemplo, ADD A, B).\n3. Faça o que ela manda, usando registradores e memória.\n4. O PC avança para a próxima (ou pula, se a instrução for um desvio).\n5. Repita até HALT.',
    tecnico:
      'O ciclo de instrução (fetch–decode–execute) é repetido pela unidade de controle: lê a instrução no endereço do PC, decodifica o opcode e aciona a ALU, os registradores e a memória. Desvios condicionais (como JNZ) alteram o PC e, com a soma e a comparação, tornam a CPU capaz de executar laços e decisões.',
  },
  analogia: {
    titulo: 'Uma cozinheira que só lê uma linha da receita por vez',
    texto:
      'Imagine uma cozinheira com três tigelas na bancada (registradores) e uma despensa com prateleiras numeradas (memória). Ela só pode fazer o que a linha atual da receita manda: "pegue o item da prateleira 0 e ponha na tigela A", "some A e B". O dedo dela marcando a linha é o PC. Para repetir, a receita diz "volte para a linha 3".',
    limites:
      'Uma CPU real tem dezenas de registradores, centenas de instruções, vários núcleos trabalhando juntos e caches intermediárias entre ela e a RAM. A cozinheira com uma linha por vez é o modelo mais simples.',
  },
  demo: {
    titulo: 'Execute um programa passo a passo',
    instrucoes:
      'Clique em "Próximo passo" e observe, a cada instrução: o destaque do PC, o registrador que mudou e a frase explicando o que a CPU fez. Antes de cada clique, tente prever qual será o novo valor. A memória começa com 7 e 5 nos endereços 0 e 1; o programa soma os dois e guarda o resultado no endereço 2.',
    simulacao: { tipo: 'cpu', memoria: [7, 5], editavel: false },
  },
  tecnica: {
    titulo: 'As instruções do nosso assembly didático',
    texto:
      '**Registradores:** A, B e C, de 8 bits (0 a 255).\n\n**Instruções:**\n- `LDI A, 9`: coloca o número 9 em A.\n- `LOAD A, [3]`: copia a memória[3] para A.\n- `STORE A, [3]`: guarda A na memória[3].\n- `ADD A, B`: A = A + B. `SUB A, B`: A = A − B.\n- `JMP rotulo`: pula para a instrução do rótulo.\n- `JNZ A, rotulo`: pula se A **não** for zero.\n- `HALT`: para.\n\n**Laço:** um rótulo (`soma:`) marca um ponto do programa e `JNZ` volta até ele enquanto o contador não chegar a zero.\n\n**Limite de 8 bits:** 255 + 1 dá 0 e 0 − 1 dá 255, como vimos em binário.',
  },
  diagrama: {
    titulo: 'O ciclo de instrução',
    nos: [
      { forma: 'inicio', texto: 'PC aponta a próxima instrução' },
      { forma: 'passo', texto: 'Buscar: a CPU lê a instrução na posição do PC' },
      { forma: 'passo', texto: 'Decodificar: entende o que ela pede (somar, copiar, pular...)' },
      { forma: 'passo', texto: 'Executar: usa os registradores e a memória e atualiza o PC' },
      { forma: 'decisao', texto: 'Era HALT? Se não, volta a buscar a próxima instrução' },
      { forma: 'fim', texto: 'A CPU para' },
    ],
    descricao:
      'O PC aponta a próxima instrução. A CPU busca essa instrução, decodifica o que ela pede e a executa, atualizando o PC. Se a instrução não era HALT, o ciclo recomeça; se era, a CPU para.',
  },
  exemplo: {
    titulo: 'Somando 5 + 4 + 3 + 2 + 1 com um laço',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'LDI A, 0\nLDI B, 5\nLDI C, 1\nsoma: ADD A, B\nSUB B, C\nJNZ B, soma\nHALT',
    },
    comentarios: [
      { linha: 1, texto: 'A guarda o total (começa em 0).' },
      { linha: 2, texto: 'B é o contador: começa em 5 e desce até 0.' },
      { linha: 3, texto: 'C vale 1, usado para diminuir o contador.' },
      { linha: 4, texto: 'Rótulo "soma": ponto para onde o laço volta. Soma B no total.' },
      { linha: 6, texto: 'Enquanto B não for 0, volta para "soma". Ao fim, A vale 15.' },
    ],
  },
  guiado: [
    prever(
      'Depois da execução, quanto vale A?',
      'LDI A, 6\nLDI B, 4\nADD A, B\nHALT',
      ['10'],
      'A recebe 6, B recebe 4 e ADD faz A = 6 + 4 = 10.',
      [{ resposta: '4', feedback: '4 é o valor de B. ADD guarda a soma em A.' }],
      ['Anote A e B depois de cada instrução.'],
    ),
    mc(
      'O que o PC (contador de programa) guarda?',
      'O endereço da próxima instrução a executar',
      [
        [
          'O valor do último resultado calculado pela CPU, para reutilizar',
          'O PC guarda o endereço da próxima instrução, não resultados.',
        ],
        [
          'A quantidade de instruções que o programa já executou',
          'O PC aponta a próxima instrução; não conta nada.',
        ],
      ],
      'O PC aponta a próxima instrução. Instruções de desvio (JMP, JNZ) mudam o PC.',
    ),
  ],
  indep: [
    prever(
      'Quanto vale A no fim?',
      'LDI A, 0\nLDI B, 3\nLDI C, 1\nsoma: ADD A, B\nSUB B, C\nJNZ B, soma\nHALT',
      ['6'],
      'O laço soma 3, depois 2, depois 1: 3 + 2 + 1 = 6. Quando B chega a 0, o JNZ não pula mais.',
      [{ resposta: '3', feedback: 'O laço roda mais de uma vez: B vai de 3 até 0.' }],
      ['Anote A e B a cada volta do laço.'],
    ),
    mc(
      'Qual destes é o mais rápido de acessar para a CPU?',
      'Um registrador',
      [
        ['A memória RAM', 'A RAM é rápida, mas bem mais lenta que um registrador.'],
        ['O disco (SSD)', 'O disco é o mais lento dos três.'],
      ],
      'Registradores ficam dentro da CPU: acesso quase instantâneo. A RAM vem depois e o disco por último.',
      1,
    ),
  ],
  desafio: ordenar(
    'Coloque na ordem o ciclo de uma instrução.',
    [
      'O PC aponta a próxima instrução',
      'A CPU busca a instrução na memória',
      'A CPU decodifica: entende o que ela pede',
      'A CPU executa e atualiza registradores, memória e PC',
    ],
    'O PC indica onde está a instrução; a CPU a busca, a decodifica e a executa, e então o ciclo recomeça.',
  ),
  rec: [
    mc(
      'Quem realmente executa as instruções de um programa?',
      'A CPU',
      [
        ['A memória RAM', 'A RAM só guarda instruções e dados; quem executa é a CPU.'],
        ['O disco', 'O disco guarda o programa, mas não o executa.'],
      ],
      'A CPU busca, decodifica e executa as instruções, usando a RAM como apoio.',
    ),
    mc(
      'Num registrador de 8 bits com valor 255, o que acontece ao executar ADD com 1?',
      'Estoura: o resultado volta a ser 0',
      [
        [
          'Passa a valer 256, porque o computador cria um 9º bit sozinho',
          'Em 8 bits não existe o 9º bit: o 256 não cabe.',
        ],
        [
          'A CPU para com erro e apaga a memória',
          'Nada é apagado: o resultado só fica "dando a volta".',
        ],
      ],
      'Com 8 bits, o maior valor é 255. Somar 1 gera estouro e o valor volta a 0.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique com suas palavras o que a CPU faz a cada ciclo de instrução.',
    modelo:
      'A CPU olha o PC para saber qual é a próxima instrução, busca essa instrução na memória, decodifica para entender o que ela pede (por exemplo, somar dois registradores) e executa. Depois o PC avança e ela repete até chegar ao HALT.',
    rubrica: [
      'Citou o PC apontando a próxima instrução',
      'Citou as três etapas: buscar, decodificar e executar',
      'Disse que o ciclo se repete',
    ],
  },
  resumo: [
    'A CPU executa instruções simples, uma após a outra, bilhões de vezes por segundo.',
    'Registradores são poucos e rapidíssimos; a RAM tem muitos endereços e é mais lenta.',
    'O PC aponta a próxima instrução; JMP e JNZ mudam o PC e criam laços.',
    'O ciclo é sempre: buscar, decodificar, executar.',
  ],
  cards: [
    ['O que é a CPU?', 'O processador: busca, decodifica e executa instruções.'],
    [
      'O que é um registrador?',
      'Uma posição minúscula e rapidíssima dentro da CPU, onde ela guarda valores em uso.',
    ],
    ['O que é o PC?', 'O contador de programa: guarda o endereço da próxima instrução.'],
    ['Quais as etapas do ciclo de instrução?', 'Buscar, decodificar e executar.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: um laço "para" vira, no processador, um desvio condicional como o JNZ.',
      'Fundamentos da Computação (Sistema operacional e processos): o sistema reveza a CPU entre os programas tão depressa que parecem rodar juntos.',
      'Fundamentos da Computação (Hierarquia de memória e cache): mais memória RAM permite manter mais programas abertos sem usar o disco.',
    ],
    profissional:
      'Entender CPU, RAM e disco ajuda a diagnosticar chamados de lentidão: máquina travando com pouca RAM (usando o disco no lugar), processo consumindo 100% da CPU ou disco cheio. Cada sintoma aponta uma peça diferente.',
  },
});
