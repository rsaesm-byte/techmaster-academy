import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const inf04 = montar({
  id: 'infra.m01.a04',
  titulo: 'Nuvem e escalabilidade',
  objetivo:
    'Entender a computação em nuvem, a escala horizontal e o papel do balanceador de carga.',
  pre: ['infra.m01.a03'],
  min: 30,
  diag: mc(
    'Sua loja virtual recebe 10 vezes mais acessos na Black Friday, mas só nesse dia. Como evitar pagar por servidores ociosos o ano todo?',
    'Usar nuvem com escala sob demanda',
    [
      ['Comprar servidores para o pico e deixá-los parados', 'Isso é caro e desperdiça recursos.'],
      ['Pedir que ninguém acesse', 'Isso mata o negócio.'],
    ],
    'Elasticidade é a vantagem da nuvem.',
  ),
  simples: {
    titulo: 'Alugar em vez de comprar',
    texto:
      '**Computação em nuvem** é usar recursos (servidores, armazenamento, bancos) **alugados sob demanda**, pagando pelo uso.\n\nModelos de serviço:\n- **IaaS:** você aluga a infraestrutura (VMs, redes). Ex.: EC2.\n- **PaaS:** você publica o código e a plataforma cuida do resto. Ex.: Heroku, App Engine.\n- **SaaS:** você usa o software pronto. Ex.: Gmail.\n\n**Escalar** para atender mais usuários:\n- **Vertical (scale up):** máquina maior. Tem limite.\n- **Horizontal (scale out):** mais máquinas, com um **balanceador de carga** distribuindo os pedidos.\n\nO balanceador usa estratégias como **round-robin** (um para cada servidor, em rodízio) e verifica a saúde (health check) para não enviar tráfego a quem caiu.',
    essencial:
      'Nuvem = recursos sob demanda. IaaS, PaaS, SaaS. Escalar horizontalmente com balanceador de carga é o caminho para crescer e resistir a falhas.',
    guiado:
      'Para escalar um serviço:\n1. Deixe a aplicação sem estado (stateless).\n2. Coloque várias cópias atrás de um balanceador.\n3. Configure health checks.\n4. Defina regras de auto scaling (ex.: CPU acima de 70%).\n5. Monitore custos.',
    tecnico:
      'Aplicações **stateless** guardam o estado fora (banco, cache), podendo ser clonadas livremente. O **auto scaling** adiciona e remove instâncias conforme a carga. Além do round-robin há **menos conexões** e **hash de IP**. As nuvens se organizam em **regiões** e **zonas de disponibilidade**: espalhar em mais de uma zona protege contra falha de um datacenter. O custo exige atenção (FinOps): recursos esquecidos geram contas altas. **Serverless** (funções) leva o modelo adiante: você paga só pela execução. **Vendor lock-in** é a dependência de um provedor.',
  },
  analogia: {
    titulo: 'Caixas de supermercado',
    texto:
      'Com fila grande, o gerente abre mais caixas (escala horizontal) e um fiscal direciona cada cliente para uma fila livre (balanceador). Quando esvazia, fecha caixas e economiza.',
    limites:
      'Mais caixas não ajudam se todos disputarem a mesma impressora (um gargalo compartilhado).',
  },
  demo: {
    titulo: 'Round-robin em ação',
    instrucoes:
      'Execute: sete pedidos são distribuídos entre 3 servidores em rodízio. Altere os números e veja a divisão.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const servidores = 3;\nconst pedidos = 7;\nconst contagem = new Array(servidores).fill(0);\nfor (let i = 0; i < pedidos; i++) {\n  contagem[i % servidores]++;\n}\nconsole.log(contagem.join(", "));',
    },
  },
  tecnica: {
    titulo: 'IaaS, PaaS ou SaaS?',
    texto:
      '**IaaS:** máximo controle e máxima responsabilidade.\n**PaaS:** foque no código, menos controle.\n**SaaS:** nenhuma infraestrutura para cuidar.\nQuanto mais alto, menos você administra e menos personaliza.',
  },
  diagrama: {
    titulo: 'Balanceamento',
    nos: [
      { forma: 'inicio', texto: 'Usuários enviam pedidos' },
      { forma: 'passo', texto: 'O balanceador recebe e escolhe um servidor' },
      { forma: 'decisao', texto: 'O servidor escolhido está saudável?' },
      { forma: 'fim', texto: 'Sim: encaminha. Não: escolhe outro' },
    ],
    descricao: 'Mais servidores e nenhum ponto único de falha.',
  },
  exemplo: {
    titulo: 'Auto scaling em regras',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'SE a CPU média passar de 70% por 5 minutos:\n    adiciona 2 instâncias\nSE a CPU média ficar abaixo de 30% por 15 minutos:\n    remove 1 instância\nMínimo: 2 instâncias. Máximo: 10.',
    },
    comentarios: [
      { linha: 1, texto: 'Regra de subir.' },
      { linha: 3, texto: 'Regra de descer.' },
      { linha: 5, texto: 'Limites evitam gastos e quedas.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const c = [0, 0];\nfor (let i = 0; i < 5; i++) {\n  c[i % 2]++;\n}\nconsole.log(c.join(","));',
      ['3,2'],
      'Os pedidos 0, 2 e 4 vão ao servidor 0; 1 e 3 ao servidor 1.',
      [{ resposta: '2,3', feedback: 'O servidor 0 recebe o primeiro pedido.' }],
    ),
    mc(
      'O que é escala horizontal?',
      'Adicionar mais máquinas e distribuir a carga',
      [
        ['Trocar por uma máquina maior', 'Isso é escala vertical.'],
        ['Desligar servidores', 'Isso é reduzir.'],
      ],
      'Scale out.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const c = [0, 0, 0];\nfor (let i = 0; i < 4; i++) {\n  c[i % 3]++;\n}\nconsole.log(c.join(","));',
      ['2,1,1'],
      'O pedido 3 volta ao servidor 0.',
      [{ resposta: '1,1,2', feedback: 'O rodízio recomeça no primeiro servidor.' }],
    ),
    mc(
      'Por que aplicações stateless escalam melhor?',
      'Qualquer cópia pode atender qualquer pedido',
      [
        ['Porque usam menos memória', 'O ponto é a intercambialidade.'],
        ['Porque não têm código', 'Elas têm.'],
      ],
      'O estado fica fora das cópias.',
    ),
  ],
  desafio: programaJs(
    'Escreva distribuir(pedidos, servidores): distribua "pedidos" requisições em rodízio (round-robin) entre "servidores" servidores e devolva a lista com a quantidade que cada um recebeu.',
    'function distribuir(pedidos, servidores) {\n  // seu código aqui\n}',
    'function distribuir(pedidos, servidores) {\n  const contagem = new Array(servidores).fill(0);\n  for (let i = 0; i < pedidos; i++) {\n    contagem[i % servidores]++;\n  }\n  return contagem;\n}',
    'distribuir',
    [
      { argumentos: [7, 3], esperado: [3, 2, 2] },
      { argumentos: [0, 2], esperado: [0, 0] },
      { argumentos: [5, 1], esperado: [5] },
    ],
    ['Crie um array de contadores com fill(0).', 'O operador % faz o rodízio.'],
    'O resto da divisão faz o ciclo entre os servidores.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['IaaS', 'Aluga infraestrutura (VMs, redes)'],
        ['PaaS', 'Publica o código; a plataforma cuida do resto'],
        ['SaaS', 'Software pronto para usar'],
        ['Balanceador de carga', 'Distribui os pedidos entre servidores'],
      ],
      'Modelos de nuvem.',
    ),
    completar(
      'Complete: escalar com mais máquinas.',
      'Adicionar mais máquinas é escala ___.',
      [{ aceitas: ['horizontal'], feedback: 'Scale out.' }],
      'A vertical é máquina maior.',
    ),
  ],
  explique: {
    enunciado:
      'Explique a diferença entre escala vertical e horizontal e o papel do balanceador de carga.',
    modelo:
      'A escala vertical aumenta a capacidade de uma máquina, mas tem limite e continua sendo um ponto único de falha. A horizontal adiciona máquinas, e o balanceador de carga distribui os pedidos entre elas, verificando a saúde de cada uma, o que aumenta a capacidade e a resiliência.',
    rubrica: [
      'Diferenciou vertical e horizontal',
      'Explicou o balanceador',
      'Citou o ganho de resiliência',
    ],
  },
  resumo: [
    'Nuvem: recursos sob demanda.',
    'IaaS, PaaS e SaaS.',
    'Horizontal é mais flexível que vertical.',
    'Balanceador distribui e checa a saúde.',
  ],
  cards: [
    ['O que é IaaS?', 'Infraestrutura alugada.'],
    ['O que é auto scaling?', 'Ajuste automático do número de instâncias.'],
    ['O que é round-robin?', 'Distribuição em rodízio.'],
    ['O que é stateless?', 'Sem estado guardado na própria instância.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes: o balanceador age nas camadas 4 e 7.',
      'Banco de Dados: réplicas e cache para escalar leituras.',
      'Cibersegurança: modelo de responsabilidade compartilhada.',
    ],
    profissional: 'Arquitetos de nuvem projetam sistemas que crescem e se recuperam sozinhos.',
  },
});
