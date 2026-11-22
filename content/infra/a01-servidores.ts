import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const inf01 = montar({
  id: 'infra.m01.a01',
  titulo: 'Servidores e disponibilidade',
  objetivo:
    'Entender o que é um servidor, os ambientes onde ele roda e como se mede a disponibilidade.',
  pre: ['redes.m01.a01'],
  min: 30,
  diag: mc(
    'Um site fica fora do ar 1 hora por mês. Isso é muito ou pouco?',
    'Depende do compromisso de disponibilidade assumido',
    [
      [
        'Sempre é aceitável, pois nenhum site precisa ficar no ar o tempo todo',
        'Sistemas críticos não toleram isso.',
      ],
      [
        'Nunca importa, desde que o site volte a funcionar depois',
        'Importa para a experiência e para o negócio.',
      ],
    ],
    'Disponibilidade se mede em porcentagem.',
  ),
  simples: {
    titulo: 'Quem atende os pedidos',
    texto:
      'Um **servidor** é um computador (ou programa) que **atende pedidos** de clientes pela rede: páginas web, e-mail, arquivos, bancos de dados.\n\nOnde ele roda:\n- **Físico (bare metal):** uma máquina dedicada.\n- **Virtual (VM):** vários servidores lógicos em uma máquina física.\n- **Contêiner:** processo isolado e leve (aula 3).\n- **Nuvem:** infraestrutura alugada sob demanda (aula 4).\n\n**Disponibilidade** é a fração do tempo em que o serviço está no ar:\n\n- 99%: cerca de 3,7 dias fora do ar por ano.\n- 99,9%: cerca de 8,8 horas.\n- 99,99%: cerca de 53 minutos.\n\nCada "9" a mais custa muito mais caro. O acordo com o cliente é o **SLA**.',
    essencial:
      'Servidor atende pedidos. Pode ser físico, VM, contêiner ou nuvem. Disponibilidade se mede em "noves" e vira um SLA.',
    guiado:
      'Para dimensionar:\n1. Defina a disponibilidade necessária.\n2. Calcule o tempo de parada permitido.\n3. Elimine pontos únicos de falha (redundância).\n4. Monitore.\n5. Teste a recuperação.',
    tecnico:
      '**Ponto único de falha (SPOF)** é um componente cuja queda derruba tudo (um só servidor, um só disco). **Redundância** (réplicas, discos em RAID, links duplos) o elimina. Disponibilidade em série multiplica: dois componentes de 99,9% juntos dão ~99,8%. Em paralelo (redundantes) a disponibilidade sobe. O **SLO** é a meta interna e o **SLA** é o compromisso contratual, normalmente com multa. A parada **planejada** (manutenção) e a **não planejada** (falha) costumam ser tratadas à parte.',
  },
  analogia: {
    titulo: 'Padaria aberta 24 horas',
    texto:
      'Uma padaria que fecha 1 hora por mês ainda é confiável, mas uma que fecha em horários aleatórios perde clientes. Ter dois forneiros (redundância) garante que a padaria continue aberta se um adoecer.',
    limites: 'Disponibilidade perfeita não existe; o objetivo é um nível aceitável pelo custo.',
  },
  demo: {
    titulo: 'Calculando a parada permitida',
    instrucoes:
      'Execute e veja quantos minutos por mês cada nível de disponibilidade permite ficar fora do ar. Teste 99.999.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const minutosNoMes = 30 * 24 * 60;\nfor (const disp of [99, 99.9, 99.99]) {\n  const parada = (minutosNoMes * (100 - disp)) / 100;\n  console.log(disp + "% -> " + parada.toFixed(1) + " min fora do ar por mês");\n}',
    },
  },
  tecnica: {
    titulo: 'Ambientes',
    texto:
      '**Desenvolvimento:** onde se programa.\n**Homologação (staging):** cópia da produção para testar.\n**Produção:** onde os usuários reais acessam.\nMantenha os ambientes parecidos para evitar o "na minha máquina funciona".',
  },
  diagrama: {
    titulo: 'Cliente e servidor',
    nos: [
      { forma: 'inicio', texto: 'Cliente envia um pedido pela rede' },
      { forma: 'passo', texto: 'O servidor recebe e processa' },
      { forma: 'passo', texto: 'Consulta outros serviços (banco, cache)' },
      { forma: 'fim', texto: 'Devolve a resposta ao cliente' },
    ],
    descricao: 'Se um desses elos cair, o serviço cai: por isso a redundância.',
  },
  exemplo: {
    titulo: 'Conferindo o servidor',
    codigo: { linguagem: 'pseudocodigo', fonte: 'uptime\ndf -h\nfree -m\nsystemctl status nginx' },
    comentarios: [
      { linha: 1, texto: 'Há quanto tempo está ligado e a carga média.' },
      { linha: 2, texto: 'Uso de disco.' },
      { linha: 3, texto: 'Uso de memória.' },
      { linha: 4, texto: 'Estado de um serviço.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const minutos = 30 * 24 * 60;\nconst disp = 99;\nconsole.log((minutos * (100 - disp)) / 100);',
      ['432'],
      '1% de 43.200 minutos são 432 minutos.',
      [{ resposta: '43', feedback: 'Confira o 1% (100 − 99).' }],
    ),
    mc(
      'O que é um ponto único de falha?',
      'Um componente cuja queda derruba todo o serviço',
      [
        [
          'Um servidor muito rápido, que atende pedidos acima da média',
          'Velocidade não é o ponto: é um componente cuja queda derruba tudo.',
        ],
        [
          'Um backup que guarda cópias do serviço em outro lugar',
          'O backup ajuda a evitar o problema, não é o problema.',
        ],
      ],
      'Elimine-o com redundância.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const dia = 24 * 60;\nconst parada = (dia * (100 - 99.9)) / 100;\nconsole.log(Math.round(parada));',
      ['1'],
      '0,1% de 1.440 minutos é cerca de 1,44, que arredonda para 1.',
      [{ resposta: '2', feedback: 'Arredonde 1,44.' }],
    ),
    mc(
      'Qual é a diferença entre SLO e SLA?',
      'SLO é a meta interna; SLA é o compromisso contratual com o cliente',
      [
        [
          'São sinônimos exatos, usados de forma intercambiável nos contratos',
          'Têm usos diferentes: meta interna e compromisso contratual.',
        ],
        [
          'O SLA é a meta interna do time e o SLO é o contrato com o cliente',
          'É o contrário: o SLO é interno e o SLA é contratual.',
        ],
      ],
      'O SLA costuma ter multa.',
    ),
  ],
  desafio: programaJs(
    'Escreva minutosDeIndisponibilidade(disponibilidade, dias): devolve, arredondado com Math.round, quantos minutos o serviço pode ficar fora do ar em "dias" dias, dada a disponibilidade em porcentagem.',
    'function minutosDeIndisponibilidade(disponibilidade, dias) {\n  // seu código aqui\n}',
    'function minutosDeIndisponibilidade(disponibilidade, dias) {\n  const total = dias * 24 * 60;\n  return Math.round((total * (100 - disponibilidade)) / 100);\n}',
    'minutosDeIndisponibilidade',
    [
      { argumentos: [99, 30], esperado: 432 },
      { argumentos: [99.9, 30], esperado: 43 },
      { argumentos: [100, 30], esperado: 0 },
      { argumentos: [99.99, 365], esperado: 53 },
    ],
    ['Um dia tem 24 × 60 minutos.', 'A parada é (100 − disponibilidade)% do total.'],
    'Cada nove a mais reduz a parada permitida em 10 vezes.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['SLA', 'Compromisso contratual de disponibilidade'],
        ['SPOF', 'Ponto único de falha'],
        ['Redundância', 'Componentes extras para evitar paradas'],
        ['Produção', 'Ambiente usado pelos usuários reais'],
      ],
      'Vocabulário de infraestrutura.',
    ),
    completar(
      'Complete: o ambiente de testes que imita a produção.',
      'O ambiente de ___ é uma cópia da produção usada para testar.',
      [{ aceitas: ['homologação', 'staging', 'homologacao'], feedback: 'Staging ou homologação.' }],
      'Reduz surpresas na publicação.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é disponibilidade e como a redundância ajuda a aumentá-la.',
    modelo:
      'Disponibilidade é a fração do tempo em que o serviço está no ar, medida em porcentagem (os "noves"). A redundância elimina pontos únicos de falha: com componentes extras, a queda de um deles não derruba o serviço, o que eleva a disponibilidade.',
    rubrica: [
      'Definiu disponibilidade',
      'Citou ponto único de falha',
      'Explicou o papel da redundância',
    ],
  },
  resumo: [
    'Servidor atende pedidos de clientes.',
    'Físico, VM, contêiner ou nuvem.',
    'Disponibilidade se mede em noves.',
    'Redundância elimina pontos únicos de falha.',
  ],
  cards: [
    ['O que é um servidor?', 'Computador ou programa que atende pedidos pela rede.'],
    ['O que é SLA?', 'Compromisso contratual de disponibilidade.'],
    ['O que é SPOF?', 'Ponto único de falha.'],
    ['Quanto é 99,9% por ano?', 'Cerca de 8,8 horas fora do ar.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes de Computadores: o servidor depende de IP, DNS e portas.',
      'Fundamentos da Computação: RAID e cache aumentam a resiliência.',
      'Engenharia de Software: ambientes e CI/CD.',
    ],
    profissional:
      'Engenheiros de infraestrutura e SRE vivem de equilibrar disponibilidade e custo.',
  },
});
