import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const o05 = montar({
  id: 'poo.m01.a05',
  titulo: 'Composição e bom projeto',
  objetivo:
    'Montar objetos a partir de outros ("tem um"), e preferir composição à herança quando fizer sentido.',
  pre: ['poo.m01.a04'],
  min: 30,
  diag: mc(
    'Um Carro precisa de um Motor. Carro deve herdar de Motor?',
    'Não: o carro TEM um motor, não É um motor',
    [
      ['Sim: assim reaproveita o código', 'Reaproveitar não justifica uma relação errada.'],
      ['Sim, porque os dois são máquinas', 'Nome ou tema parecido não é critério.'],
    ],
    'Teste: "tem um" ou "é um"?',
  ),
  simples: {
    titulo: 'Peças que se encaixam',
    texto:
      '**Composição** é um objeto **conter** outros e delegar trabalho a eles (relação **"tem um"**).\n\n```\nclass Motor {\n  ligar() { return "vrum"; }\n}\nclass Carro {\n  constructor(motor) { this.motor = motor; }\n  ligar() { return this.motor.ligar() + "!"; }\n}\nconst c = new Carro(new Motor());\n```\n\nO Carro **delega** ao Motor. Trocar o motor (elétrico, a combustão) não exige mudar o Carro.\n\n**Regra de ouro:** *prefira composição à herança*. Ela é mais flexível e gera menos acoplamento.\n\nPrincípios de bom projeto (**SOLID**), em resumo: cada classe com **uma responsabilidade**, aberta para extensão e fechada para alteração, dependendo de **contratos**, não de classes concretas.',
    essencial:
      'Composição: o objeto "tem um" outro e delega. Prefira-a à herança. Uma classe, uma responsabilidade.',
    guiado:
      'Para projetar:\n1. Separe responsabilidades (uma por classe).\n2. Para reaproveitar, componha em vez de herdar.\n3. Receba as peças pelo construtor (injeção de dependência).\n4. Dependa do contrato (ex.: motor.ligar()).\n5. Teste cada peça isolada.',
    tecnico:
      'A **injeção de dependência** passa as peças de fora (no construtor) em vez de a classe criá-las: facilita trocar e testar com um **dublê** (mock). **SOLID**: S (responsabilidade única), O (aberto/fechado), L (substituição de Liskov), I (segregação de interfaces), D (inversão de dependência). Composição pode ser **agregação** (a peça vive sem o todo) ou **composição forte** (a peça morre com o todo). Mixins e traits são outras formas de reuso sem herança profunda.',
  },
  analogia: {
    titulo: 'Peças de montar',
    texto:
      'Um brinquedo de montar é feito de peças que se encaixam. Para mudar o brinquedo, troque uma peça. Se tudo fosse uma peça única (herança profunda), qualquer mudança exigiria refazer o brinquedo.',
    limites: 'Muitas peças também geram complexidade: o equilíbrio vem da prática.',
  },
  demo: {
    titulo: 'Trocando o motor',
    instrucoes:
      'Execute: o mesmo Carro funciona com dois motores diferentes. Crie um MotorEletrico que devolve "zzz" e use-o.',
    simulacao: {
      tipo: 'js',
      codigo:
        'class MotorCombustao {\n  ligar() {\n    return "vrum";\n  }\n}\nclass MotorEletrico {\n  ligar() {\n    return "zzz";\n  }\n}\nclass Carro {\n  constructor(motor) {\n    this.motor = motor;\n  }\n  ligar() {\n    return this.motor.ligar() + "!";\n  }\n}\nconsole.log(new Carro(new MotorCombustao()).ligar());\nconsole.log(new Carro(new MotorEletrico()).ligar());',
    },
  },
  tecnica: {
    titulo: 'Herança ou composição?',
    texto:
      '**Herança:** quando é de fato "é um" e a hierarquia é rasa.\n**Composição:** quando é "tem um", ou quando você só quer reaproveitar uma funcionalidade.\n**Sinal de alerta:** a filha sobrescreve quase tudo, ou herda métodos que não faz sentido ter.',
  },
  diagrama: {
    titulo: 'Decisão de projeto',
    nos: [
      { forma: 'inicio', texto: 'Preciso reaproveitar comportamento' },
      { forma: 'decisao', texto: 'É uma relação "é um" de verdade?' },
      { forma: 'passo', texto: 'Sim e raso: herança pode servir' },
      { forma: 'fim', texto: 'Não ou em dúvida: use composição e delegue' },
    ],
    descricao: 'Na dúvida, componha.',
  },
  exemplo: {
    titulo: 'Pilha que esconde um array',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'class Pilha {\n  #itens = [];\n  empilhar(x) {\n    this.#itens.push(x);\n  }\n  desempilhar() {\n    return this.#itens.pop();\n  }\n  get tamanho() {\n    return this.#itens.length;\n  }\n}',
    },
    comentarios: [
      { linha: 2, texto: 'A pilha TEM um array, não herda de Array.' },
      { linha: 3, texto: 'Expõe só as operações que uma pilha permite.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'class Motor {\n  ligar() {\n    return "vrum";\n  }\n}\nclass Carro {\n  constructor(m) {\n    this.motor = m;\n  }\n  ligar() {\n    return this.motor.ligar() + "!";\n  }\n}\nconsole.log(new Carro(new Motor()).ligar());',
      ['vrum!'],
      'O Carro delega ao motor e acrescenta "!".',
      [{ resposta: 'vrum', feedback: 'Falta acrescentar o "!" do Carro.' }],
    ),
    mc(
      'O que significa "prefira composição à herança"?',
      'Montar objetos com outros objetos costuma ser mais flexível',
      [
        ['Nunca usar classes filhas', 'A herança continua útil em casos "é um" rasos.'],
        ['Usar só funções', 'A regra é sobre como estruturar as classes.'],
      ],
      'Composição reduz acoplamento.',
    ),
  ],
  indep: [
    prever(
      'Qual é uma vantagem de receber o Motor pelo construtor?',
      'Dá para trocar ou simular o motor sem mudar o Carro',
      ['O Carro fica proibido de usar o motor'],
      'É o contrário.',
      [{ resposta: 'O código fica sem classes', feedback: 'As classes continuam existindo.' }],
    ),
    mc(
      'O que a letra S de SOLID defende?',
      'Cada classe deve ter uma única responsabilidade',
      [
        ['Toda classe deve ter só um método', 'Uma responsabilidade pode ter vários métodos.'],
        ['Toda classe deve ser privada', 'Privacidade é outro conceito.'],
      ],
      'Uma razão para mudar por classe.',
    ),
  ],
  desafio: programaJs(
    'Escreva executar(comandos): comandos é uma lista de textos como "push 3" ou "pop". Use uma classe Pilha (que guarda um array dentro dela, por composição). "push n" empilha o número n; "pop" desempilha (se vazia, ignore). Devolva os itens que sobraram na pilha, do fundo ao topo.',
    'function executar(comandos) {\n  // seu código aqui\n}',
    'function executar(comandos) {\n  class Pilha {\n    #itens = [];\n    empilhar(x) {\n      this.#itens.push(x);\n    }\n    desempilhar() {\n      return this.#itens.pop();\n    }\n    get itens() {\n      return [...this.#itens];\n    }\n  }\n  const p = new Pilha();\n  for (const c of comandos) {\n    const [op, valor] = c.split(" ");\n    if (op === "push") p.empilhar(Number(valor));\n    else if (op === "pop") p.desempilhar();\n  }\n  return p.itens;\n}',
    'executar',
    [
      { argumentos: [['push 1', 'push 2', 'pop', 'push 5']], esperado: [1, 5] },
      { argumentos: [[]], esperado: [] },
      { argumentos: [['pop']], esperado: [] },
      { argumentos: [['push 7']], esperado: [7] },
    ],
    ['Separe o comando com split(" ").', 'Pop numa pilha vazia não deve dar erro.'],
    'A pilha esconde o array e expõe só as operações de pilha.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Composição', 'Objeto que contém outros e delega'],
        ['Injeção de dependência', 'Receber as peças de fora, pelo construtor'],
        ['Responsabilidade única', 'Uma razão para mudar por classe'],
        ['Acoplamento', 'Quanto uma classe depende de outra'],
      ],
      'Conceitos de bom projeto.',
    ),
    completar(
      'Complete: o Carro delega ao motor recebido.',
      'ligar() {\n  return this.___.ligar();\n}',
      [{ aceitas: ['motor'], feedback: 'this.motor é a peça composta.' }],
      'O Carro tem um motor.',
    ),
  ],
  explique: {
    enunciado: 'Explique composição, compare com herança e diga quando preferir cada uma.',
    modelo:
      'Na composição, um objeto contém outros e delega trabalho a eles (relação "tem um"), o que reduz o acoplamento e permite trocar as peças. A herança serve para relações "é um" rasas. Em geral, prefere-se a composição por ser mais flexível; herança só quando a relação é realmente "é um".',
    rubrica: [
      'Definiu composição ("tem um")',
      'Comparou com herança',
      'Indicou quando usar cada uma',
    ],
  },
  resumo: [
    'Composição: "tem um" e delega.',
    'Prefira composição à herança.',
    'Uma classe, uma responsabilidade.',
    'Receba as peças pelo construtor.',
  ],
  cards: [
    ['O que é composição?', 'Um objeto conter outros e delegar a eles.'],
    ['O que é injeção de dependência?', 'Passar as peças de fora, em vez de criá-las dentro.'],
    ['O que é SOLID?', 'Cinco princípios de bom projeto orientado a objetos.'],
    ['Qual a regra de ouro?', 'Prefira composição à herança.'],
  ],
  conexoes: {
    disciplinas: [
      'Engenharia de Software: arquitetura em camadas e testes.',
      'Inteligência Artificial: pipelines montados com peças intercambiáveis.',
      'Infraestrutura: componentes substituíveis (microsserviços).',
    ],
    profissional:
      'Frameworks modernos (React, Spring, Angular) são montados por composição e injeção de dependência.',
  },
});
