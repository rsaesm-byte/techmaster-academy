import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const o01 = montar({
  id: 'poo.m01.a01',
  titulo: 'Classes e objetos',
  objetivo: 'Entender classe como molde e objeto como instância, com atributos e métodos.',
  pre: ['javascript.m01.a05'],
  min: 30,
  diag: mc(
    'Em um sistema de loja, "Cliente" descreve o que todo cliente tem. "Maria" é um cliente específico. Quem é a classe?',
    'Cliente',
    [
      [
        'Maria, porque é o nome de um cliente que já existe no sistema',
        'Maria é uma instância concreta, ou seja, um objeto.',
      ],
      [
        'Loja, porque reúne todos os clientes e pedidos do sistema',
        'A loja é outro conceito; Cliente é a classe que descreve o que todo cliente tem.',
      ],
    ],
    'A classe é o molde; os objetos nascem dele.',
  ),
  simples: {
    titulo: 'Molde e peças',
    texto:
      'Na **programação orientada a objetos (POO)** o programa é organizado em **objetos**: pequenas unidades que juntam **dados** (atributos) e **ações** (métodos).\n\nA **classe** é o molde. O **objeto** é uma peça feita com ele (uma **instância**):\n\n```\nclass Conta {\n  constructor(titular) {\n    this.titular = titular;\n    this.saldo = 0;\n  }\n  depositar(valor) {\n    this.saldo += valor;\n  }\n}\nconst c = new Conta("Ana");\n```\n\n- `constructor` roda ao criar (`new`).\n- `this` é o objeto atual.\n- Cada instância tem os **seus próprios** atributos.',
    essencial:
      'Classe = molde. Objeto = instância criada com new. Atributos guardam dados; métodos são as ações.',
    guiado:
      'Para modelar algo:\n1. Dê nome à coisa (substantivo = classe).\n2. Liste o que ela sabe (atributos).\n3. Liste o que ela faz (métodos).\n4. Crie instâncias com `new`.\n5. Teste duas instâncias para ver que são independentes.',
    tecnico:
      'Em JavaScript, `class` é açúcar sintático sobre protótipos: os métodos ficam no protótipo e são compartilhados, enquanto os atributos ficam em cada instância. `typeof Classe` é "function". Métodos `static` pertencem à classe, não à instância. `instanceof` confere se um objeto veio de uma classe. Esquecer o `new` ou perder o `this` ao passar um método como callback são erros comuns.',
  },
  analogia: {
    titulo: 'Forma de bolo',
    texto:
      'A forma de bolo é a classe: define o formato. Cada bolo assado é um objeto. Todos têm o mesmo formato, mas sabores e recheios diferentes, e comer um bolo não muda os outros.',
    limites:
      'Uma classe também pode ter comportamento (métodos), algo que a forma de bolo não tem.',
  },
  demo: {
    titulo: 'Duas contas independentes',
    instrucoes:
      'Execute e veja que depositar em uma conta não altera a outra. Crie uma terceira instância e experimente.',
    simulacao: {
      tipo: 'js',
      codigo:
        'class Conta {\n  constructor(titular) {\n    this.titular = titular;\n    this.saldo = 0;\n  }\n  depositar(valor) {\n    this.saldo += valor;\n  }\n}\nconst a = new Conta("Ana");\nconst b = new Conta("Beto");\na.depositar(100);\nconsole.log(a.titular, a.saldo);\nconsole.log(b.titular, b.saldo);',
    },
  },
  tecnica: {
    titulo: 'Vocabulário essencial',
    texto:
      '**Classe:** o molde.\n**Objeto / instância:** a peça criada.\n**Atributo:** dado do objeto.\n**Método:** função do objeto.\n**Construtor:** prepara o objeto ao nascer.\n**this:** o próprio objeto.',
  },
  diagrama: {
    titulo: 'Da classe ao objeto',
    nos: [
      { forma: 'inicio', texto: 'Escreve a classe (o molde)' },
      { forma: 'passo', texto: 'Chama new Classe(...)' },
      { forma: 'passo', texto: 'O construtor monta o objeto' },
      { forma: 'fim', texto: 'Você usa os métodos da instância' },
    ],
    descricao: 'Uma classe, várias instâncias.',
  },
  exemplo: {
    titulo: 'Retângulo',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'class Retangulo {\n  constructor(largura, altura) {\n    this.largura = largura;\n    this.altura = altura;\n  }\n  area() {\n    return this.largura * this.altura;\n  }\n}\nconsole.log(new Retangulo(3, 4).area());',
    },
    comentarios: [
      { linha: 2, texto: 'O construtor recebe os valores iniciais.' },
      { linha: 6, texto: 'O método usa this para ler os atributos.' },
      { linha: 10, texto: 'Cria a instância e chama o método.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'class Contador {\n  constructor() {\n    this.n = 0;\n  }\n  inc() {\n    this.n++;\n    return this;\n  }\n}\nconst c = new Contador();\nc.inc();\nc.inc();\nconsole.log(c.n);',
      ['2'],
      'Duas chamadas de inc somam 2.',
      [{ resposta: '0', feedback: 'O construtor zera, mas inc foi chamado duas vezes.' }],
    ),
    mc(
      'O que a palavra new faz?',
      'Cria uma nova instância e chama o construtor',
      [
        [
          'Declara uma nova classe, criando o molde para os objetos',
          'A classe é declarada com class; o new cria uma instância.',
        ],
        [
          'Apaga um objeto da memória e libera o espaço que ele usava',
          'Objetos não são apagados com new; ele os cria.',
        ],
      ],
      'Sem new, o construtor de classe dá erro.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'class Contador {\n  constructor() {\n    this.n = 0;\n  }\n  inc() {\n    this.n++;\n  }\n}\nconst a = new Contador();\nconst b = new Contador();\na.inc();\na.inc();\nb.inc();\nconsole.log(a.n + b.n);',
      ['3'],
      'a vale 2 e b vale 1: as instâncias são independentes.',
      [{ resposta: '2', feedback: 'Some também o b.' }],
    ),
    mc(
      'Qual é a diferença entre classe e objeto?',
      'Classe é o molde; objeto é uma instância dele',
      [
        [
          'A classe é o objeto já criado e pronto para uso no programa',
          'É o contrário: o objeto é a instância criada a partir da classe.',
        ],
        [
          'Não há diferença, pois os dois termos descrevem a mesma coisa',
          'Há: um define a estrutura e o outro existe em execução.',
        ],
      ],
      'Pense na forma e no bolo.',
    ),
  ],
  desafio: programaJs(
    'Escreva somaAreas(lista): cada item é [largura, altura]. Crie uma classe Retangulo com o método area() e devolva a soma das áreas de todos os retângulos.',
    'function somaAreas(lista) {\n  // seu código aqui\n}',
    'function somaAreas(lista) {\n  class Retangulo {\n    constructor(l, a) {\n      this.l = l;\n      this.a = a;\n    }\n    area() {\n      return this.l * this.a;\n    }\n  }\n  let total = 0;\n  for (const [l, a] of lista) {\n    total += new Retangulo(l, a).area();\n  }\n  return total;\n}',
    'somaAreas',
    [
      {
        argumentos: [
          [
            [2, 3],
            [4, 5],
          ],
        ],
        esperado: 26,
      },
      { argumentos: [[]], esperado: 0 },
      { argumentos: [[[1, 1]]], esperado: 1 },
    ],
    ['Declare a classe dentro da função.', 'Percorra a lista criando um objeto por item.'],
    'Cada item vira um objeto que sabe calcular a própria área.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Classe', 'O molde que descreve os objetos'],
        ['Objeto', 'Instância criada a partir da classe'],
        ['Método', 'Ação que o objeto sabe fazer'],
        ['Construtor', 'Prepara o objeto quando ele é criado'],
      ],
      'Vocabulário básico da POO.',
    ),
    completar(
      'Complete: palavra que cria uma instância.',
      'const c = ___ Conta("Ana");',
      [{ aceitas: ['new'], feedback: 'new cria a instância e chama o construtor.' }],
      'Sem new, dá erro.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre classe e objeto e dê um exemplo.',
    modelo:
      'A classe é o molde que define atributos e métodos; o objeto é uma instância criada com new, com seus próprios dados. Por exemplo, Conta é a classe e a conta da Ana e a do Beto são dois objetos independentes.',
    rubrica: [
      'Diferenciou classe de objeto',
      'Citou atributos e métodos',
      'Deu um exemplo concreto',
    ],
  },
  resumo: [
    'Classe é o molde; objeto é a instância.',
    'new chama o construtor.',
    'this é o objeto atual.',
    'Cada instância tem os seus dados.',
  ],
  cards: [
    ['O que é uma classe?', 'Molde que define atributos e métodos.'],
    ['O que é uma instância?', 'Objeto criado a partir de uma classe.'],
    ['Para que serve o construtor?', 'Preparar o objeto ao criá-lo.'],
    ['O que é this?', 'O objeto que está executando o método.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: objetos e funções já são a base das classes.',
      'Banco de Dados: cada entidade costuma virar uma classe.',
      'Engenharia de Software: modelar o domínio em classes.',
    ],
    profissional:
      'Quase todo sistema corporativo (Java, C#, Python, TypeScript) é organizado em classes e objetos.',
  },
});
