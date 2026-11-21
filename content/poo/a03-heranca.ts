import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const o03 = montar({
  id: 'poo.m01.a03',
  titulo: 'Herança',
  objetivo: 'Reaproveitar e especializar comportamento com extends, super e sobrescrita.',
  pre: ['poo.m01.a02'],
  min: 30,
  diag: mc(
    'Cachorro e Gato têm nome e sabem comer, mas cada um faz um som diferente. Como evitar repetir o que é comum?',
    'Criar uma classe Animal com o que é comum e estendê-la',
    [
      ['Copiar e colar o código nas duas classes', 'Copiar cria duplicação e erros.'],
      ['Usar só variáveis globais', 'Isso não resolve a repetição.'],
    ],
    'É o caso clássico de herança.',
  ),
  simples: {
    titulo: 'Filho herda do pai',
    texto:
      '**Herança** permite que uma classe **estenda** outra, recebendo seus atributos e métodos e podendo **especializá-los**.\n\n```\nclass Animal {\n  constructor(nome) { this.nome = nome; }\n  som() { return "..."; }\n}\nclass Cachorro extends Animal {\n  som() { return "au"; }\n}\n```\n\n- `extends` declara a herança (relação **"é um"**: um Cachorro é um Animal).\n- **Sobrescrever** é redefinir um método na filha.\n- `super` chama o construtor ou o método da classe pai.',
    essencial:
      'extends reaproveita; a filha pode sobrescrever métodos e usar super para chamar o pai. Use quando a relação for "é um".',
    guiado:
      'Para usar herança:\n1. Procure o que é comum e ponha na classe pai.\n2. Teste a frase "A é um B".\n3. Crie as filhas com extends.\n4. No construtor da filha, chame super(...) primeiro.\n5. Sobrescreva só o que muda.',
    tecnico:
      'Em JavaScript, o construtor da filha **deve** chamar `super()` antes de usar `this`. A herança é por protótipos: se o método não existe na filha, a busca sobe a **cadeia de protótipos**. Heranças profundas criam **acoplamento forte** (uma mudança na classe pai afeta todas as filhas): o **problema da classe base frágil**. Algumas linguagens (C++) permitem herança múltipla; JavaScript e Java permitem só uma classe pai.',
  },
  analogia: {
    titulo: 'Árvore genealógica',
    texto:
      'Os filhos herdam características dos pais, como a cor dos olhos, mas podem ter as suas próprias, como o gosto por música. Mudar algo no pai (como o sobrenome) afeta a família toda.',
    limites:
      'Na vida real a herança é biológica; no código, ela precisa ser escolhida com critério.',
  },
  demo: {
    titulo: 'Sobrescrevendo o som',
    instrucoes:
      'Execute e veja cada animal responder do seu jeito. Crie uma classe Vaca com som "muu" e adicione à lista.',
    simulacao: {
      tipo: 'js',
      codigo:
        'class Animal {\n  constructor(nome) {\n    this.nome = nome;\n  }\n  som() {\n    return "...";\n  }\n  apresentar() {\n    return this.nome + " diz " + this.som();\n  }\n}\nclass Cachorro extends Animal {\n  som() {\n    return "au";\n  }\n}\nclass Gato extends Animal {\n  som() {\n    return "miau";\n  }\n}\nconsole.log(new Cachorro("Rex").apresentar());\nconsole.log(new Gato("Mia").apresentar());\nconsole.log(new Animal("Bicho").apresentar());',
    },
  },
  tecnica: {
    titulo: 'Quando evitar herança',
    texto:
      '**Evite** quando a relação não é "é um" (Carro não é um Motor).\n**Evite** cadeias profundas (mais de 2 ou 3 níveis).\n**Prefira composição** quando só quer reaproveitar uma funcionalidade (aula 5).\n**Cuidado:** uma mudança no pai afeta todas as filhas.',
  },
  diagrama: {
    titulo: 'Cadeia de busca do método',
    nos: [
      { forma: 'inicio', texto: 'Chama objeto.metodo()' },
      { forma: 'decisao', texto: 'A classe do objeto tem esse método?' },
      { forma: 'passo', texto: 'Não: sobe para a classe pai e repete' },
      { forma: 'fim', texto: 'Sim: executa o método encontrado' },
    ],
    descricao: 'É assim que a sobrescrita "vence" o método do pai.',
  },
  exemplo: {
    titulo: 'Usando super',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'class A {\n  falar() {\n    return "a";\n  }\n}\nclass B extends A {\n  falar() {\n    return super.falar() + "b";\n  }\n}\nconsole.log(new B().falar());',
    },
    comentarios: [
      { linha: 8, texto: 'super.falar() chama a versão do pai e a filha acrescenta algo.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'class A {\n  falar() {\n    return "a";\n  }\n}\nclass B extends A {\n  falar() {\n    return super.falar() + "b";\n  }\n}\nconsole.log(new B().falar());',
      ['ab'],
      'super.falar() devolve "a" e a filha acrescenta "b".',
      [{ resposta: 'b', feedback: 'Ela também chama a versão do pai.' }],
    ),
    mc(
      'Qual teste ajuda a decidir se herança faz sentido?',
      'A frase "A é um B" é verdadeira',
      [
        ['A frase "A tem um B" é verdadeira', 'Essa frase indica composição.'],
        ['As duas classes têm nomes parecidos', 'Nome parecido não justifica herança.'],
      ],
      '"É um" = herança; "tem um" = composição.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'class A {\n  falar() {\n    return "a";\n  }\n}\nclass B extends A {\n  falar() {\n    return super.falar() + "b";\n  }\n}\nclass C extends B {}\nconsole.log(new C().falar());',
      ['ab'],
      'C não sobrescreve falar, então usa o de B, que usa o de A.',
      [{ resposta: 'a', feedback: 'Veja que B sobrescreve e acrescenta.' }],
    ),
    mc(
      'Por que chamar super() no construtor da filha?',
      'Porque o pai precisa inicializar sua parte antes de usar this',
      [
        ['Para apagar o construtor do pai', 'Ele executa o pai, não o apaga.'],
        ['Para o código ficar mais rápido', 'Não tem relação com velocidade.'],
      ],
      'Em JavaScript é obrigatório antes de usar this.',
    ),
  ],
  desafio: programaJs(
    'Escreva sons(tipos): receba uma lista de "cao", "gato" ou qualquer outro texto e devolva a lista dos sons: "au" para cao, "miau" para gato e "..." para os demais. Use uma classe Animal com som() e filhas que sobrescrevem.',
    'function sons(tipos) {\n  // seu código aqui\n}',
    'function sons(tipos) {\n  class Animal {\n    som() {\n      return "...";\n    }\n  }\n  class Cao extends Animal {\n    som() {\n      return "au";\n    }\n  }\n  class Gato extends Animal {\n    som() {\n      return "miau";\n    }\n  }\n  const mapa = { cao: Cao, gato: Gato };\n  return tipos.map((t) => new (mapa[t] || Animal)().som());\n}',
    'sons',
    [
      { argumentos: [['cao', 'gato']], esperado: ['au', 'miau'] },
      { argumentos: [['peixe']], esperado: ['...'] },
      { argumentos: [[]], esperado: [] },
    ],
    ['Um objeto mapa liga o texto à classe.', 'Para um tipo desconhecido, use a classe Animal.'],
    'As filhas só redefinem o que muda; o resto vem do pai.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['extends', 'Declara que uma classe herda de outra'],
        ['super', 'Chama o construtor ou o método do pai'],
        ['Sobrescrita', 'Redefinir um método herdado'],
        ['Relação "é um"', 'Critério para usar herança'],
      ],
      'Vocabulário da herança.',
    ),
    completar(
      'Complete a palavra que declara a herança.',
      'class Cachorro ___ Animal {}',
      [{ aceitas: ['extends'], feedback: 'extends liga a filha ao pai.' }],
      'Em Java também é extends.',
    ),
  ],
  explique: {
    enunciado: 'Explique herança e diga quando ela deve (e quando não deve) ser usada.',
    modelo:
      'Herança permite que uma classe filha reaproveite e especialize atributos e métodos de uma classe pai com extends, sobrescrevendo o que muda e usando super quando precisa do pai. Deve ser usada quando a relação é "é um"; deve ser evitada quando é "tem um", ou quando cria cadeias profundas e acoplamento forte.',
    rubrica: [
      'Definiu herança com extends/super',
      'Citou o critério "é um"',
      'Mencionou o risco de acoplamento ou a alternativa da composição',
    ],
  },
  resumo: [
    'extends reaproveita código.',
    'A filha sobrescreve o que muda.',
    'super chama o pai.',
    '"É um" = herança; "tem um" = composição.',
  ],
  cards: [
    ['O que é herança?', 'Uma classe receber atributos e métodos de outra.'],
    ['O que é sobrescrever?', 'Redefinir na filha um método do pai.'],
    ['O que faz o super?', 'Chama o construtor ou método do pai.'],
    ['Qual teste indica herança?', 'A frase "A é um B".'],
  ],
  conexoes: {
    disciplinas: [
      'Algoritmos: hierarquias de tipos e árvores.',
      'JavaScript: cadeia de protótipos.',
      'Engenharia de Software: cuidado com acoplamento.',
    ],
    profissional:
      'Frameworks usam herança para você estender comportamentos prontos, como componentes e controladores.',
  },
});
