import { associar, mc, montar, ordenar, prever } from './montar';

export const f18 = montar({
  id: 'fundamentos.m04.a03',
  titulo: 'Computação em nuvem',
  objetivo:
    'Entender o que é a nuvem, os modelos IaaS, PaaS e SaaS e como se paga pelo que se usa.',
  pre: ['fundamentos.m04.a01', 'fundamentos.m02.a03'],
  min: 25,
  diag: mc(
    'O que é "a nuvem"?',
    'Computadores de outra empresa, acessados pela internet',
    [
      ['Um tipo de armazenamento sem computadores físicos', 'Há datacenters reais por trás.'],
      ['Um programa instalado no seu PC', 'A nuvem roda nos servidores do provedor.'],
    ],
    'A nuvem é o aluguel de recursos de computação, pela internet, em vez de comprar o hardware.',
  ),
  simples: {
    titulo: 'Alugar em vez de comprar',
    texto:
      'Em vez de comprar servidores, você **aluga** recursos de um provedor (AWS, Azure, Google Cloud) e **paga pelo uso**, como conta de luz. Há três modelos:\n\n- **IaaS:** você aluga a máquina (VM, rede, disco) e cuida do resto.\n- **PaaS:** o provedor cuida do ambiente; você só envia o código.\n- **SaaS:** o programa já vem pronto (e-mail, planilhas online).',
    essencial:
      'Nuvem = alugar recursos pela internet e pagar pelo uso. IaaS = máquina; PaaS = plataforma; SaaS = programa pronto.',
    guiado:
      'Para escolher o modelo:\n1. Quer só usar um programa? SaaS.\n2. Quer publicar seu código sem cuidar de servidor? PaaS.\n3. Quer controle total da máquina? IaaS.',
    tecnico:
      'Vantagens: escala rápida (elasticidade), pagamento por uso, alcance global, menos manutenção. Riscos: dependência do provedor, custos que crescem sem controle e responsabilidade compartilhada de segurança: o provedor protege a infraestrutura, e você protege suas contas, dados e configurações. Regiões e zonas de disponibilidade permitem manter o serviço no ar mesmo se um datacenter falhar.',
  },
  analogia: {
    titulo: 'Casa, aluguel ou hotel',
    texto:
      'IaaS é alugar um terreno com as paredes: você mobília e cuida de tudo. PaaS é um apartamento mobiliado: só leva as malas. SaaS é um hotel: chega e usa.',
    limites:
      'No hotel você não mexe em nada; na nuvem, mesmo em SaaS você ainda precisa proteger sua senha e seus dados.',
  },
  demo: {
    titulo: 'Redes na nuvem',
    instrucoes:
      'Nuvens dividem redes em sub-redes, como você viu no laboratório. Mude a máscara e veja quantos endereços cada sub-rede comporta.',
    simulacao: { tipo: 'rede', ip: '10.0.0.0', cidr: 24 },
  },
  tecnica: {
    titulo: 'Conceitos de nuvem',
    texto:
      '**Elasticidade:** aumentar ou diminuir recursos conforme a demanda.\n**Região/zona:** local geográfico e datacenters isolados.\n**Pague pelo uso:** cobrança por hora, GB ou requisição.\n**Serverless:** você envia funções; o provedor executa e escala.\n**Segurança compartilhada:** o provedor cuida da infraestrutura; você cuida de acessos e dados.',
  },
  diagrama: {
    titulo: 'Quem cuida de quê',
    nos: [
      { forma: 'inicio', texto: 'SaaS: o provedor cuida de quase tudo; você usa o programa' },
      { forma: 'passo', texto: 'PaaS: o provedor cuida do ambiente; você cuida do código' },
      { forma: 'passo', texto: 'IaaS: o provedor cuida do hardware; você cuida do resto' },
      { forma: 'fim', texto: 'Quanto mais controle, mais responsabilidade' },
    ],
    descricao: 'Do SaaS ao IaaS, aumenta o controle e também a responsabilidade do cliente.',
  },
  exemplo: {
    titulo: 'Escalando para uma promoção',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'dia normal: 2 servidores\npromoção: 20 servidores por 3 horas\ndepois: volta para 2 servidores\ncusto: paga só as horas extras usadas',
    },
    comentarios: [
      { linha: 2, texto: 'A nuvem aumenta os recursos na hora.' },
      { linha: 3, texto: 'Depois a capacidade encolhe.' },
      { linha: 4, texto: 'Sem comprar máquinas para um pico passageiro.' },
    ],
  },
  guiado: [
    mc(
      'Gmail é um exemplo de qual modelo?',
      'SaaS',
      [
        ['IaaS', 'Em IaaS você aluga a máquina.'],
        ['PaaS', 'Em PaaS você publica o seu próprio código.'],
      ],
      'O programa chega pronto para uso.',
    ),
    prever(
      'Um site usa 2 servidores; na promoção usa 20. Quantas vezes a capacidade aumentou? (só o número)',
      '20 / 2 = ?',
      ['10'],
      '20 dividido por 2 é 10 vezes.',
      [{ resposta: '18', feedback: 'É a razão (divisão), não a diferença.' }],
    ),
  ],
  indep: [
    associar(
      'Associe o modelo à descrição.',
      [
        ['IaaS', 'Você aluga máquinas, discos e redes'],
        ['PaaS', 'Você só envia o código para o provedor executar'],
        ['SaaS', 'Você usa o programa pronto pelo navegador'],
      ],
      'Os três modelos diferem em quem cuida de cada camada.',
    ),
    mc(
      'O que é elasticidade?',
      'Aumentar ou reduzir recursos conforme a demanda',
      [
        ['Pagar sempre o mesmo valor', 'Na nuvem paga-se pelo uso.'],
        ['Ter servidores em muitos países', 'Isso é alcance global, não elasticidade.'],
      ],
      'Elasticidade evita pagar por capacidade parada.',
    ),
  ],
  desafio: ordenar(
    'Ordene do que dá MAIS controle ao cliente para o que dá MENOS.',
    ['IaaS', 'PaaS', 'Serverless (funções)', 'SaaS'],
    'Quanto mais o provedor administra, menos controle (e menos trabalho) tem o cliente.',
  ),
  rec: [
    mc(
      'No modelo de responsabilidade compartilhada, de quem é a responsabilidade de proteger as senhas e permissões da sua conta?',
      'Do cliente',
      [
        ['Do provedor', 'O provedor protege a infraestrutura, não suas escolhas.'],
        ['De ninguém', 'Alguém precisa; é o cliente.'],
      ],
      'Muitos vazamentos vêm de contas e permissões mal configuradas.',
    ),
    mc(
      'Qual é um risco da nuvem?',
      'Dependência do provedor e custos que crescem sem controle',
      [
        ['Impossibilidade de escalar', 'Escalar é a grande vantagem.'],
        ['Falta de opções de regiões', 'Há muitas regiões.'],
      ],
      'Acompanhar custos e planejar a saída é parte da boa prática.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é computação em nuvem e cite uma vantagem e um risco.',
    modelo:
      'Nuvem é o aluguel de recursos de computação de um provedor, acessados pela internet, com pagamento por uso. Uma vantagem é escalar rápido conforme a demanda; um risco é a dependência do provedor ou custos crescentes.',
    rubrica: [
      'Definiu como aluguel de recursos pela internet',
      'Citou uma vantagem',
      'Citou um risco',
    ],
  },
  resumo: [
    'Nuvem = alugar recursos pela internet e pagar pelo uso.',
    'IaaS, PaaS e SaaS diferem em quem cuida do quê.',
    'Elasticidade ajusta recursos à demanda.',
    'A segurança é compartilhada entre provedor e cliente.',
  ],
  cards: [
    ['O que é IaaS?', 'Aluguel de infraestrutura: máquinas, redes e discos.'],
    ['O que é PaaS?', 'Plataforma pronta para publicar código.'],
    ['O que é SaaS?', 'Programa pronto para usar.'],
    ['O que é elasticidade?', 'Ajustar recursos conforme a demanda.'],
  ],
  conexoes: {
    disciplinas: [
      'Virtualização: a nuvem roda sobre VMs e contêineres.',
      'Redes: nuvens organizam sub-redes e endereços IP.',
      'Engenharia de Dados: dados e pipelines vivem na nuvem.',
    ],
    profissional:
      'A maioria das empresas usa nuvem. Entender os modelos e a responsabilidade compartilhada é base para cargos de TI, dados e segurança.',
  },
});
