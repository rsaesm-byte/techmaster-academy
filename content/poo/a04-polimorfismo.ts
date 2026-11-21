import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const o04 = montar({
  id: 'poo.m01.a04',
  titulo: 'Polimorfismo e interfaces',
  objetivo:
    'Tratar objetos diferentes pela mesma interface, deixando cada um responder do seu jeito.',
  pre: ['poo.m01.a03'],
  min: 30,
  diag: mc(
    'Um botão "Imprimir" funciona com PDF, foto e planilha, e cada um imprime de um jeito. Como o botão faz isso sem if para cada tipo?',
    'Chama o mesmo método em todos, e cada tipo responde à sua maneira',
    [
      ['Escreve um if gigante com todos os tipos', 'Isso quebra a cada tipo novo.'],
      ['Converte tudo para texto', 'Perderia a formatação.'],
    ],
    'Isso é polimorfismo.',
  ),
  simples: {
    titulo: 'Mesmo pedido, respostas diferentes',
    texto:
      '**Polimorfismo** ("muitas formas") é chamar o **mesmo método** em objetos diferentes e cada um reagir do seu jeito.\n\n```\nconst formas = [new Quadrado(3), new Circulo(2)];\nfor (const f of formas) {\n  console.log(f.area());\n}\n```\n\nQuem chama não precisa saber qual é a classe: só confia que o objeto tem `area()`. Essa promessa é a **interface** (o contrato).\n\n**Vantagem:** para criar uma forma nova, basta uma classe nova. O código que usa as formas **não muda**.',
    essencial:
      'Mesmo método, comportamentos diferentes. Quem usa depende do contrato (interface), não da classe concreta. Evita cadeias de if/else por tipo.',
    guiado:
      'Para aplicar:\n1. Defina o contrato (ex.: area()).\n2. Crie uma classe para cada variação.\n3. Faça o código cliente chamar só o contrato.\n4. Para um tipo novo, crie uma classe nova.\n5. Apague os if/else por tipo.',
    tecnico:
      'Em JavaScript o polimorfismo é por **duck typing** ("se anda e grasna como um pato, é um pato"): basta ter o método, sem declarar interface. Linguagens como Java e C# têm `interface` e classes abstratas formais; TypeScript tem `interface` só para checagem na compilação. Há também polimorfismo por **sobrecarga** (mesmo nome, parâmetros diferentes) em linguagens que a suportam. O padrão **Strategy** troca o comportamento em tempo de execução usando objetos intercambiáveis.',
  },
  analogia: {
    titulo: 'Controle remoto universal',
    texto:
      'O botão "ligar" existe em todos os aparelhos. Você aperta o mesmo botão e a TV, o som e o ar-condicionado ligam, cada um à sua maneira. Quem aperta não precisa saber como cada aparelho funciona por dentro.',
    limites: 'O contrato precisa ser respeitado: um objeto que não tem o método quebra o programa.',
  },
  demo: {
    titulo: 'Um laço, três formas',
    instrucoes:
      'Execute e veja o mesmo código calcular áreas de formas diferentes. Adicione um Triangulo (base × altura / 2) sem mexer no laço.',
    simulacao: {
      tipo: 'js',
      codigo:
        'class Quadrado {\n  constructor(lado) {\n    this.lado = lado;\n  }\n  area() {\n    return this.lado * this.lado;\n  }\n}\nclass Retangulo {\n  constructor(l, a) {\n    this.l = l;\n    this.a = a;\n  }\n  area() {\n    return this.l * this.a;\n  }\n}\nconst formas = [new Quadrado(3), new Retangulo(2, 3)];\nlet total = 0;\nfor (const f of formas) {\n  console.log(f.constructor.name, f.area());\n  total += f.area();\n}\nconsole.log("Total:", total);',
    },
  },
  tecnica: {
    titulo: 'Strategy: trocar o comportamento',
    texto:
      'Em vez de `if (tipo === "natal") ...`, crie objetos com o mesmo método (`aplicar(preco)`) e escolha qual usar.\n**Ganho:** adicionar uma regra nova não exige alterar o código existente, o princípio **aberto/fechado** do SOLID.',
  },
  diagrama: {
    titulo: 'Chamada polimórfica',
    nos: [
      { forma: 'inicio', texto: 'Código chama forma.area()' },
      { forma: 'passo', texto: 'A linguagem encontra o método do objeto real' },
      { forma: 'passo', texto: 'Cada classe executa a sua versão' },
      { forma: 'fim', texto: 'Quem chamou recebe o resultado, sem saber o tipo' },
    ],
    descricao: 'O if/else desaparece.',
  },
  exemplo: {
    titulo: 'Descontos intercambiáveis',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'class SemDesconto {\n  aplicar(p) {\n    return p;\n  }\n}\nclass DezPorCento {\n  aplicar(p) {\n    return p * 0.9;\n  }\n}\nconst regra = new DezPorCento();\nconsole.log(regra.aplicar(100));',
    },
    comentarios: [
      { linha: 5, texto: 'Cada regra tem o mesmo método aplicar.' },
      { linha: 11, texto: 'Trocar a regra não muda o resto do código.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'class Quadrado {\n  constructor(l) {\n    this.l = l;\n  }\n  area() {\n    return this.l * this.l;\n  }\n}\nclass Retangulo {\n  constructor(l, a) {\n    this.l = l;\n    this.a = a;\n  }\n  area() {\n    return this.l * this.a;\n  }\n}\nconst fs = [new Quadrado(3), new Retangulo(2, 3)];\nlet t = 0;\nfor (const f of fs) t += f.area();\nconsole.log(t);',
      ['15'],
      'Quadrado vale 9 e Retângulo vale 6.',
      [{ resposta: '9', feedback: 'Falta somar o retângulo.' }],
    ),
    mc(
      'O que é o "contrato" (interface) no polimorfismo?',
      'O conjunto de métodos que os objetos prometem ter',
      [
        ['A lista de variáveis globais', 'Isso é estado compartilhado.'],
        ['O arquivo onde a classe fica', 'A organização de arquivos é outra coisa.'],
      ],
      'Quem usa depende do contrato.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const bichos = [\n  { falar: () => "au" },\n  { falar: () => "miau" },\n];\nconsole.log(bichos.map((b) => b.falar()).join("-"));',
      ['au-miau'],
      'Cada objeto responde ao mesmo método do seu jeito: duck typing.',
      [{ resposta: 'au', feedback: 'O map percorre todos os objetos.' }],
    ),
    mc(
      'Qual é o principal benefício do polimorfismo?',
      'Adicionar tipos novos sem alterar o código que os usa',
      [
        ['Fazer o programa rodar mais rápido', 'O benefício é de manutenção, não de velocidade.'],
        ['Evitar o uso de métodos', 'Ele depende de métodos.'],
      ],
      'Pense em extensibilidade.',
    ),
  ],
  desafio: programaJs(
    'Escreva precoFinal(preco, regra): use classes com o método aplicar(preco). "percentual" dá 10% de desconto; "fixo" tira 5 (sem ficar abaixo de 0); qualquer outra regra não altera o preço. Devolva o preço final.',
    'function precoFinal(preco, regra) {\n  // seu código aqui\n}',
    'function precoFinal(preco, regra) {\n  class Nenhum {\n    aplicar(p) {\n      return p;\n    }\n  }\n  class Percentual {\n    aplicar(p) {\n      return p * 0.9;\n    }\n  }\n  class Fixo {\n    aplicar(p) {\n      return Math.max(0, p - 5);\n    }\n  }\n  const regras = { percentual: Percentual, fixo: Fixo };\n  const Classe = regras[regra] || Nenhum;\n  return new Classe().aplicar(preco);\n}',
    'precoFinal',
    [
      { argumentos: [100, 'percentual'], esperado: 90 },
      { argumentos: [100, 'fixo'], esperado: 95 },
      { argumentos: [100, 'nenhum'], esperado: 100 },
      { argumentos: [3, 'fixo'], esperado: 0 },
    ],
    ['Uma classe por regra, todas com aplicar().', 'Escolha a classe por um objeto de busca.'],
    'Nenhum if por tipo: cada classe conhece a sua regra.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Polimorfismo', 'Mesmo método, respostas diferentes'],
        ['Interface', 'Contrato de métodos que o objeto promete'],
        ['Duck typing', 'Basta ter o método para ser aceito'],
        ['Strategy', 'Trocar o comportamento por outro objeto'],
      ],
      'Vocabulário do polimorfismo.',
    ),
    completar(
      'Complete: o laço chama o mesmo método em todas as formas.',
      'for (const f of formas) {\n  console.log(f.___());\n}',
      [{ aceitas: ['area'], feedback: 'Cada forma responde com a sua área.' }],
      'O método comum é o contrato.',
    ),
  ],
  explique: {
    enunciado: 'Explique o polimorfismo e como ele elimina cadeias de if/else por tipo.',
    modelo:
      'No polimorfismo, objetos diferentes respondem ao mesmo método, cada um do seu jeito, e quem os usa depende só do contrato (interface). Assim, em vez de um if/else para cada tipo, basta criar uma classe nova para um tipo novo, sem alterar o código existente.',
    rubrica: [
      'Definiu polimorfismo',
      'Citou o contrato ou interface',
      'Explicou como evita if/else e facilita a extensão',
    ],
  },
  resumo: [
    'Mesmo método, comportamentos diferentes.',
    'Dependa do contrato, não da classe.',
    'Tipo novo = classe nova.',
    'Strategy troca o comportamento em tempo de execução.',
  ],
  cards: [
    ['O que é polimorfismo?', 'Mesmo método com respostas diferentes por objeto.'],
    ['O que é duck typing?', 'Aceitar qualquer objeto que tenha o método esperado.'],
    ['O que é uma interface?', 'O contrato de métodos que o objeto promete.'],
    ['O que é o princípio aberto/fechado?', 'Aberto para extensão, fechado para alteração.'],
  ],
  conexoes: {
    disciplinas: [
      'Engenharia de Software: SOLID e padrões de projeto.',
      'JavaScript: duck typing e funções de primeira classe.',
      'Inteligência Artificial: modelos diferentes com a mesma interface (fit/predict).',
    ],
    profissional:
      'Plugins, drivers e meios de pagamento são polimorfismo: o sistema só conhece o contrato.',
  },
});
