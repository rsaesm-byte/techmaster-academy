import { associar, mc, montar, ordenar, prever } from './montar';

export const f16 = montar({
  id: 'fundamentos.m04.a01',
  titulo: 'Virtualização: vários computadores em um',
  objetivo:
    'Entender o que é uma máquina virtual, o papel do hipervisor e por que virtualizar economiza recursos.',
  pre: ['fundamentos.m02.a01'],
  min: 25,
  diag: mc(
    'Qual é o papel de uma máquina virtual (VM)?',
    'Simular um computador completo dentro de outro computador',
    [
      ['Acelerar o processador físico', 'Ela divide recursos; não os acelera.'],
      [
        'Substituir o sistema operacional do computador real',
        'Ela roda sobre o computador real, sem substituí-lo.',
      ],
    ],
    'Uma VM se comporta como um computador independente, mas usa recursos de uma máquina física.',
  ),
  simples: {
    titulo: 'Um prédio em vez de várias casas',
    texto:
      'Um servidor físico potente costuma ficar ocioso se rodar uma só tarefa. Com **virtualização**, um software chamado **hipervisor** divide o servidor em várias **máquinas virtuais (VMs)**. Cada VM tem seu próprio sistema operacional, memória e disco virtual, isolada das outras.\n\nO hipervisor reparte CPU, memória e disco, de forma parecida com o escalonador que você viu no laboratório de sistemas.',
    essencial:
      'Hipervisor divide um servidor físico em VMs isoladas, cada uma com seu próprio sistema operacional.',
    guiado:
      'Para entender:\n1. Imagine um servidor com 32 GB de memória.\n2. O hipervisor cria 4 VMs de 8 GB.\n3. Cada VM acha que é um computador inteiro.\n4. Se uma VM trava, as outras continuam.',
    tecnico:
      'Hipervisores tipo 1 (bare-metal, como Hyper-V e VMware ESXi) rodam direto no hardware; tipo 2 (como VirtualBox) rodam sobre um sistema operacional. Processadores modernos têm extensões de virtualização (Intel VT-x, AMD-V). O hipervisor controla o acesso a CPU, memória e dispositivos, garantindo isolamento. Uma VM pode ser salva como arquivo (snapshot) e movida para outro servidor.',
  },
  analogia: {
    titulo: 'Prédio de apartamentos',
    texto:
      'O servidor é o prédio; o hipervisor é o síndico que divide o espaço; cada VM é um apartamento com sua porta, cozinha e moradores, isolado dos vizinhos, mas usando a mesma estrutura de água e luz.',
    limites:
      'Num prédio real o espaço de cada apartamento é fixo; numa VM, os recursos podem ser ajustados e até movidos de prédio.',
  },
  demo: {
    titulo: 'Dividindo a CPU',
    instrucoes:
      'Imagine cada processo como uma VM disputando a mesma CPU. Mude o quantum e veja como o tempo é repartido.',
    simulacao: { tipo: 'escalonador', algoritmo: 'rr', quantum: 2 },
  },
  tecnica: {
    titulo: 'Tipos e benefícios',
    texto:
      '**Tipo 1:** direto no hardware (servidores).\n**Tipo 2:** sobre um sistema operacional (uso pessoal).\n**Benefícios:** melhor uso do hardware, isolamento, cópia e restauração rápida (snapshots), ambientes de teste.\n**Custo:** cada VM carrega um sistema operacional inteiro, consumindo memória e disco.',
  },
  diagrama: {
    titulo: 'Camadas da virtualização',
    nos: [
      { forma: 'inicio', texto: 'Hardware físico (CPU, memória, disco)' },
      { forma: 'passo', texto: 'Hipervisor reparte os recursos' },
      { forma: 'passo', texto: 'Várias VMs, cada uma com seu sistema operacional' },
      { forma: 'fim', texto: 'Aplicações rodando dentro de cada VM' },
    ],
    descricao:
      'O hardware sustenta o hipervisor, que cria VMs isoladas, e dentro delas rodam as aplicações.',
  },
  exemplo: {
    titulo: 'Consolidando servidores',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'servidores antes: 10 máquinas com 10% de uso cada\nservidores depois: 2 máquinas hospedando 10 VMs\nuso médio depois: ~50%',
    },
    comentarios: [
      { linha: 1, texto: 'Muitas máquinas quase ociosas.' },
      { linha: 2, texto: 'A virtualização junta as cargas.' },
      { linha: 3, texto: 'Menos hardware, menos energia, menos custo.' },
    ],
  },
  guiado: [
    mc(
      'O que o hipervisor faz?',
      'Cria e gerencia as VMs repartindo os recursos do hardware',
      [
        [
          'Escreve e instala os programas que vão rodar dentro de cada VM',
          'Ele reparte os recursos; não cria programas.',
        ],
        [
          'Conecta as VMs à internet e a controla como um roteador virtual',
          'A conexão é feita por redes virtuais; o papel central dele é repartir recursos.',
        ],
      ],
      'É a camada que isola e reparte CPU, memória e disco.',
    ),
    prever(
      'Um servidor tem 32 GB de memória e roda 4 VMs iguais. Quantos GB cada VM recebe? (só o número)',
      '32 / 4 = ?',
      ['8'],
      '32 dividido por 4 é 8 GB.',
      [{ resposta: '4', feedback: 'Divida os 32 GB pelas 4 VMs.' }],
    ),
  ],
  indep: [
    mc(
      'Qual hipervisor roda diretamente sobre o hardware?',
      'Tipo 1 (bare-metal)',
      [
        [
          'Tipo 2, que se instala sobre o sistema operacional e tem acesso direto ao hardware',
          'O tipo 2 roda sobre um sistema operacional.',
        ],
        [
          'Nenhum dos dois, pois o hipervisor sempre depende de um sistema operacional',
          'O tipo 1 roda direto no hardware.',
        ],
      ],
      'Servidores de datacenter usam o tipo 1 para maior desempenho.',
    ),
    ordenar(
      'Ordene as camadas, de baixo para cima.',
      ['Hardware físico', 'Hipervisor', 'Máquina virtual com sistema operacional', 'Aplicação'],
      'O hardware sustenta o hipervisor, que sustenta as VMs, onde rodam as aplicações.',
    ),
  ],
  desafio: associar(
    'Associe cada termo ao seu significado.',
    [
      ['Hipervisor', 'Software que cria e gerencia as VMs'],
      ['VM', 'Computador simulado, isolado, com seu próprio sistema'],
      ['Snapshot', 'Foto do estado da VM para restaurar depois'],
      ['Isolamento', 'Falha em uma VM não afeta as outras'],
    ],
    'Esses são os quatro conceitos centrais da virtualização.',
  ),
  rec: [
    mc(
      'Qual é uma desvantagem das VMs?',
      'Cada uma carrega um sistema operacional completo, usando mais memória e disco',
      [
        [
          'Elas não podem ser copiadas nem movidas entre servidores',
          'VMs podem ser copiadas com snapshots e clones.',
        ],
        [
          'Elas só conseguem executar um programa por vez, como num aparelho simples',
          'Uma VM roda um sistema completo com vários programas.',
        ],
      ],
      'Por isso surgiram os contêineres, mais leves.',
    ),
    mc(
      'Por que virtualizar economiza dinheiro?',
      'Aproveita melhor o hardware, usando menos servidores físicos',
      [
        [
          'Porque as VMs não precisam de licença nem de hardware para existir',
          'VMs usam hardware; a economia vem de dividir o servidor.',
        ],
        [
          'Porque as VMs funcionam sem gastar energia elétrica',
          'VMs gastam energia; a economia vem do uso de menos servidores.',
        ],
      ],
      'Mais cargas por máquina significam menos máquinas.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é virtualização e por que as empresas a usam.',
    modelo:
      'Virtualização usa um hipervisor para dividir um servidor físico em várias máquinas virtuais isoladas, cada uma com seu sistema operacional. As empresas usam porque aproveitam melhor o hardware, economizam e isolam falhas.',
    rubrica: [
      'Citou o hipervisor ou a divisão do servidor',
      'Citou VMs isoladas',
      'Citou economia ou melhor uso do hardware',
    ],
  },
  resumo: [
    'Hipervisor divide um servidor em VMs.',
    'Cada VM tem seu próprio sistema operacional e é isolada.',
    'Tipo 1 roda no hardware; tipo 2, sobre um sistema operacional.',
    'VMs são pesadas; contêineres são a alternativa leve.',
  ],
  cards: [
    ['O que é um hipervisor?', 'Software que cria e gerencia máquinas virtuais.'],
    ['O que é uma VM?', 'Computador simulado e isolado dentro de outro.'],
    ['O que é snapshot?', 'Cópia do estado de uma VM para restaurar.'],
    ['Qual o ponto fraco das VMs?', 'Cada uma carrega um sistema operacional inteiro.'],
  ],
  conexoes: {
    disciplinas: [
      'Infraestrutura e Servidores: a nuvem é construída sobre virtualização.',
      'Fundamentos da Computação: o hipervisor divide recursos como um escalonador.',
      'Cibersegurança: isolamento é base para testar malware com segurança.',
    ],
    profissional:
      'Quem trabalha com TI usa VMs para laboratório, testes e servidores. Saber criar e gerenciar VMs é habilidade básica.',
  },
});
