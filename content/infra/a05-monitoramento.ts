import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const inf05 = montar({
  id: 'infra.m01.a05',
  titulo: 'Monitoramento e recuperação',
  objetivo:
    'Monitorar a saúde dos sistemas, configurar alertas e planejar a recuperação de desastres.',
  pre: ['infra.m01.a04'],
  min: 30,
  diag: mc(
    'O banco de dados enche o disco no meio da madrugada e o site cai. Como o time poderia ter sido avisado antes?',
    'Com monitoramento e um alerta de uso de disco',
    [
      ['Esperando os clientes reclamarem', 'Descobrir pelo cliente é o pior cenário.'],
      ['Reiniciando o servidor todas as noites', 'Não resolve a causa.'],
    ],
    'Monitore e alerte antes do problema.',
  ),
  simples: {
    titulo: 'Os sinais vitais do sistema',
    texto:
      '**Monitorar** é coletar **métricas** continuamente e avisar quando algo foge do normal.\n\nOs **quatro sinais de ouro** (Google SRE):\n- **Latência:** quanto demora a resposta.\n- **Tráfego:** quantos pedidos chegam.\n- **Erros:** quantos falham.\n- **Saturação:** o quanto os recursos estão cheios (CPU, memória, disco).\n\nUm **alerta** dispara quando uma métrica passa de um **limite**: "disco acima de 90%". Alerta bom é **acionável**: alguém sabe o que fazer.\n\n**Recuperação de desastres** define:\n- **RPO:** quanto de dado posso perder (tempo desde o último backup).\n- **RTO:** em quanto tempo preciso voltar.\n\nBackup que nunca foi **restaurado em teste** não é backup confiável.',
    essencial:
      'Monitore latência, tráfego, erros e saturação; alerte por limites acionáveis; defina RPO e RTO e teste a restauração dos backups.',
    guiado:
      'Para montar o básico:\n1. Escolha as métricas dos quatro sinais.\n2. Mostre-as em um painel.\n3. Defina limites e alertas acionáveis.\n4. Escreva o que fazer em cada alerta (runbook).\n5. Teste o plano de recuperação.',
    tecnico:
      'Ferramentas: **Prometheus** (métricas), **Grafana** (painéis), **Alertmanager**, além de plataformas como Datadog. **Observabilidade** soma três pilares: métricas, logs e traces (rastreamento de uma requisição entre serviços). **Fadiga de alertas** ocorre quando há avisos demais e o time passa a ignorá-los. Um **post-mortem sem culpados** documenta os incidentes e as lições. O **orçamento de erros** (error budget) vem do SLO: se foi gasto, prioriza-se estabilidade em vez de novas funções. Planos de recuperação incluem sites alternativos (quente, morno ou frio).',
  },
  analogia: {
    titulo: 'Painel do carro',
    texto:
      'O painel mostra velocidade, combustível e temperatura. Uma luz acende antes do motor fundir. Sem painel, você só descobre o problema quando o carro para na estrada.',
    limites: 'Painel demais confunde: mostre o que importa para decisões.',
  },
  demo: {
    titulo: 'Um alerta por limite',
    instrucoes:
      'Execute e veja quais métricas passaram do limite de 90%. Mude os valores e o limite.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const metricas = [["cpu", 91], ["memoria", 62], ["disco", 95]];\nconst limite = 90;\nfor (const [nome, valor] of metricas) {\n  if (valor > limite) {\n    console.log("ALERTA:", nome, valor + "% (limite " + limite + "%)");\n  } else {\n    console.log("ok:", nome, valor + "%");\n  }\n}',
    },
  },
  tecnica: {
    titulo: 'RPO e RTO na prática',
    texto:
      '**RPO de 1 hora:** o backup é de até 1 hora atrás; pode-se perder 1 hora de dados.\n**RTO de 4 horas:** o serviço precisa voltar em até 4 horas.\nMenores RPO e RTO exigem replicação e automação, e custam mais.',
  },
  diagrama: {
    titulo: 'Do incidente à lição',
    nos: [
      { forma: 'inicio', texto: 'A métrica passa do limite' },
      { forma: 'passo', texto: 'O alerta chama a pessoa de plantão' },
      { forma: 'passo', texto: 'Diagnóstico e correção (runbook)' },
      { forma: 'fim', texto: 'Post-mortem: o que melhorar para não repetir' },
    ],
    descricao: 'Cada incidente fortalece o sistema.',
  },
  exemplo: {
    titulo: 'Regra de alerta',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'ALERTA se uso de disco > 90% por 10 minutos\nMensagem: "Disco do servidor DB acima de 90%"\nAção: limpar logs antigos ou ampliar o volume (runbook #12)',
    },
    comentarios: [
      { linha: 1, texto: 'A janela de 10 minutos evita falsos alarmes.' },
      { linha: 3, texto: 'O alerta sempre indica o que fazer.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const m = [["cpu", 91], ["mem", 50], ["disco", 95]];\nconsole.log(m.filter(([, v]) => v > 90).length);',
      ['2'],
      'CPU (91) e disco (95) passam de 90.',
      [{ resposta: '3', feedback: 'A memória (50) está abaixo do limite.' }],
    ),
    mc(
      'O que mede o RPO?',
      'Quanto de dado se aceita perder, em tempo',
      [
        ['Em quanto tempo o serviço volta', 'Isso é o RTO.'],
        ['O número de servidores', 'Não é uma contagem de máquinas.'],
      ],
      'Recovery Point Objective.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const m = [["a", 40], ["b", 95], ["c", 99]];\nconst alertas = m.filter(([, v]) => v > 90).map(([n]) => n);\nconsole.log(alertas.join(","));',
      ['b,c'],
      'Só b (95) e c (99) passam de 90.',
      [{ resposta: 'a,b,c', feedback: 'Filtre pelo limite.' }],
    ),
    mc(
      'Por que testar a restauração do backup?',
      'Porque um backup que nunca foi restaurado pode estar inválido',
      [
        ['Porque backups ficam mais rápidos', 'Não é uma questão de velocidade.'],
        ['Porque apaga os dados antigos', 'Restaurar em teste não deve apagar a produção.'],
      ],
      'Só o teste prova que funciona.',
    ),
  ],
  desafio: programaJs(
    'Escreva alertas(metricas, limite): cada métrica é [nome, valor]. Devolva a lista dos nomes cujo valor é maior que o limite, na ordem original.',
    'function alertas(metricas, limite) {\n  // seu código aqui\n}',
    'function alertas(metricas, limite) {\n  return metricas.filter(([, valor]) => valor > limite).map(([nome]) => nome);\n}',
    'alertas',
    [
      {
        argumentos: [
          [
            ['cpu', 91],
            ['mem', 50],
            ['disco', 95],
          ],
          90,
        ],
        esperado: ['cpu', 'disco'],
      },
      { argumentos: [[], 90], esperado: [] },
      { argumentos: [[['a', 90]], 90], esperado: [] },
    ],
    ['Compare com > (maior que), não >=.', 'filter seguido de map resolve.'],
    'Todo sistema de monitoramento é, no fundo, comparação com limites.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Latência', 'Tempo de resposta'],
        ['Saturação', 'O quanto os recursos estão cheios'],
        ['RPO', 'Quanto de dado se aceita perder'],
        ['RTO', 'Tempo máximo para voltar ao ar'],
      ],
      'Termos de monitoramento e recuperação.',
    ),
    completar(
      'Complete: o documento com os passos para tratar um alerta.',
      'O ___ lista o que fazer quando o alerta dispara.',
      [{ aceitas: ['runbook'], feedback: 'Runbook é o manual de resposta.' }],
      'Torna o alerta acionável.',
    ),
  ],
  explique: {
    enunciado: 'Explique os quatro sinais de ouro do monitoramento e a diferença entre RPO e RTO.',
    modelo:
      'Os sinais de ouro são latência, tráfego, erros e saturação. O RPO é a quantidade de dado que se aceita perder, medida em tempo desde o último backup; o RTO é o tempo máximo para o serviço voltar ao ar depois de uma falha.',
    rubrica: ['Citou os quatro sinais', 'Definiu RPO', 'Definiu RTO'],
  },
  resumo: [
    'Quatro sinais: latência, tráfego, erros, saturação.',
    'Alertas devem ser acionáveis.',
    'RPO = dado perdido; RTO = tempo para voltar.',
    'Teste a restauração dos backups.',
  ],
  cards: [
    ['Quais são os quatro sinais de ouro?', 'Latência, tráfego, erros e saturação.'],
    ['O que é um runbook?', 'Manual de resposta a um alerta.'],
    ['O que é observabilidade?', 'Métricas, logs e traces.'],
    ['O que é fadiga de alertas?', 'Avisos demais, que acabam ignorados.'],
  ],
  conexoes: {
    disciplinas: [
      'Cibersegurança: monitorar também detecta ataques.',
      'Banco de Dados: backup e restauração dos dados.',
      'Engenharia de Software: post-mortems e melhoria contínua.',
    ],
    profissional:
      'O trabalho de SRE e DevOps gira em torno de métricas, alertas e boa resposta a incidentes.',
  },
});
