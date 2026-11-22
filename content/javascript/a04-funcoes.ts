import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j04 = montar({
  id: 'javascript.m01.a04',
  titulo: 'Funções e arrow functions',
  objetivo:
    'Criar funções com parâmetros e return, usar arrow functions e entender o escopo das variáveis.',
  pre: ['javascript.m01.a03', 'logica.m02.a02'],
  min: 30,
  diag: mc(
    'O que a palavra return faz dentro de uma função?',
    'Devolve um valor e encerra a função',
    [
      [
        'Mostra o valor na tela, como o console.log faz',
        'Quem mostra é o console.log; return devolve.',
      ],
      ['Repete a função até a condição ser verdadeira', 'Repetir é papel dos laços.'],
    ],
    '`return` entrega um resultado a quem chamou a função e interrompe sua execução.',
  ),
  simples: {
    titulo: 'Receitas reutilizáveis',
    texto:
      'Uma **função** é um bloco de código com nome que você escreve uma vez e usa várias:\n\n```\nfunction dobro(n) {\n  return n * 2;\n}\nconsole.log(dobro(4)); // 8\n```\n\n- **Parâmetros:** os valores de entrada (`n`).\n- **Argumentos:** os valores passados na chamada (`4`).\n- **return:** o valor de saída.\n\nA forma curta é a **arrow function**:\n\n```\nconst dobro = (n) => n * 2;\n```',
    essencial:
      'function nome(parâmetros) { return resultado; }. Chame com nome(argumentos). Arrow: (n) => n * 2.',
    guiado:
      'Para criar uma função:\n1. Decida o que ela recebe (parâmetros).\n2. Decida o que devolve.\n3. Escreva `function nome(...) { ... return ...; }`.\n4. Teste chamando com valores conhecidos.',
    tecnico:
      'Funções são valores: podem ser guardadas em variáveis e passadas como argumento. Variáveis declaradas dentro da função existem só nela (escopo local). Sem `return`, a função devolve `undefined`. Arrow functions com uma única expressão devolvem o valor sem precisar de `return` nem chaves.',
  },
  analogia: {
    titulo: 'Máquina de suco',
    texto:
      'Uma função é uma máquina de suco: você coloca as frutas (argumentos), ela faz o processo e entrega o suco (return). Dá para usar a mesma máquina com frutas diferentes, sem reconstruí-la.',
    limites:
      'A máquina de suco só serve suco; uma função pode devolver qualquer tipo e até outra função. E o que acontece dentro dela (variáveis locais) não é visível fora.',
  },
  demo: {
    titulo: 'Crie e chame funções',
    instrucoes:
      'Execute e leia a saída. Depois chame `quadrado` com outros valores e tente usar a variável `resultado` fora da função para ver o erro.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function dobro(n) {\n  return n * 2;\n}\nconst quadrado = (n) => n * n;\nconsole.log(dobro(4));\nconsole.log(quadrado(5));\nfunction semRetorno() {\n  const resultado = 1;\n}\nconsole.log(semRetorno());',
    },
  },
  tecnica: {
    titulo: 'Escopo, retorno e arrow',
    texto:
      '**Escopo:** variável declarada com let/const dentro de `{}` só existe ali.\n**Return cedo:** `if (n < 0) return 0;` encerra imediatamente.\n**Sem return:** a função devolve `undefined`.\n**Arrow com uma expressão:** `(a, b) => a + b`.\n**Arrow com bloco:** `(n) => { const d = n * 2; return d; }`.\n\n**Boa prática:** funções pequenas, com um único objetivo e um nome que diz o que ela faz.',
  },
  diagrama: {
    titulo: 'Caminho de uma chamada',
    nos: [
      { forma: 'inicio', texto: 'Chamada: dobro(4)' },
      { forma: 'passo', texto: 'O argumento 4 vira o parâmetro n' },
      { forma: 'passo', texto: 'O corpo executa: n * 2' },
      { forma: 'fim', texto: 'return devolve 8 a quem chamou' },
    ],
    descricao:
      'A chamada passa o argumento, o corpo calcula e o return devolve o resultado ao ponto onde a função foi chamada.',
  },
  exemplo: {
    titulo: 'Função com laço e condição',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function contarMaiores(lista, limite) {\n  let total = 0;\n  for (const n of lista) {\n    if (n > limite) total++;\n  }\n  return total;\n}\nconsole.log(contarMaiores([3, 8, 10], 5));',
    },
    comentarios: [
      { linha: 1, texto: 'Dois parâmetros: a lista e o limite.' },
      { linha: 5, texto: 'Conta cada elemento acima do limite.' },
      { linha: 8, texto: 'Mostra 2 (8 e 10).' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'function soma(a, b) {\n  return a + b;\n}\nconsole.log(soma(2, 3));',
      ['5'],
      'a recebe 2, b recebe 3 e o return devolve 5.',
      [{ resposta: '23', feedback: 'Os dois são números, então o + soma.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'function f() {\n  const x = 1;\n}\nconsole.log(f());',
      ['undefined'],
      'Sem return, a função devolve undefined.',
      [
        {
          resposta: '1',
          feedback: 'Nada foi devolvido com return, e x existe só dentro da função.',
        },
      ],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'const triplo = (n) => n * 3;\nconsole.log(triplo(4));',
      ['12'],
      'A arrow function devolve n * 3: 4 * 3 = 12.',
      [{ resposta: '7', feedback: 'É multiplicação, não soma.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva contarPares(lista): devolve quantos números pares existem no array.',
      'function contarPares(lista) {\n  // seu código aqui\n}',
      'function contarPares(lista) {\n  let total = 0;\n  for (const n of lista) {\n    if (n % 2 === 0) total++;\n  }\n  return total;\n}',
      'contarPares',
      [
        { argumentos: [[1, 2, 3, 4]], esperado: 2 },
        { argumentos: [[1, 3, 5]], esperado: 0 },
        { argumentos: [[]], esperado: 0 },
      ],
      ['Um número é par quando n % 2 === 0.', 'Use um contador e um if dentro do laço.'],
      'O resto da divisão por 2 identifica os pares; o contador acumula quantos foram encontrados.',
    ),
  ],
  desafio: programaJs(
    'Escreva fatorial(n): devolve n! (n × (n-1) × ... × 1). Por definição, fatorial(0) é 1.',
    'function fatorial(n) {\n  // seu código aqui\n}',
    'function fatorial(n) {\n  let resultado = 1;\n  for (let i = 2; i <= n; i++) {\n    resultado *= i;\n  }\n  return resultado;\n}',
    'fatorial',
    [
      { argumentos: [0], esperado: 1 },
      { argumentos: [1], esperado: 1 },
      { argumentos: [5], esperado: 120 },
      { argumentos: [6], esperado: 720 },
    ],
    [
      'Comece o acumulador em 1 (elemento neutro da multiplicação).',
      'Multiplique por cada número de 2 até n.',
    ],
    'O acumulador começa em 1 e é multiplicado por cada inteiro de 2 até n; para n = 0 ou 1 o laço não roda e o resultado é 1.',
  ),
  rec: [
    mc(
      'Qual é a diferença entre parâmetro e argumento?',
      'Parâmetro é o nome na definição; argumento é o valor passado na chamada',
      [
        [
          'São sinônimos exatos, usados da mesma forma na linguagem',
          'Têm papéis diferentes: definição e chamada.',
        ],
        [
          'Argumento é o valor que a função devolve ao terminar',
          'Isso é o retorno; argumento é o valor passado.',
        ],
      ],
      'Em `function f(n)`, n é parâmetro. Em `f(4)`, 4 é argumento.',
    ),
    mc(
      'O que a arrow function dobro devolve para dobro(5)?',
      '10',
      [
        ['5', 'A função multiplica por 2.'],
        ['undefined', 'A arrow com uma expressão devolve o valor sem precisar de return.'],
      ],
      '(n) => n * 2 devolve 5 * 2 = 10.',
      1,
      { linguagem: 'javascript', fonte: 'const dobro = (n) => n * 2;' },
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem as funções e por que elas ajudam a organizar um programa.',
    modelo:
      'Funções agrupam um trecho de código com um nome, que pode ser reutilizado com valores diferentes. Isso evita repetição, deixa o programa mais legível e facilita testar cada parte separadamente.',
    rubrica: [
      'Disse que agrupam código reutilizável',
      'Citou evitar repetição ou organizar o programa',
      'Citou legibilidade ou facilidade de testar',
    ],
  },
  resumo: [
    'Função: bloco com nome, parâmetros e `return`.',
    'Sem `return`, a função devolve `undefined`.',
    'Arrow function: `(a, b) => a + b`.',
    'Variáveis declaradas dentro da função são locais.',
  ],
  cards: [
    ['O que é um parâmetro?', 'O nome da entrada na definição da função.'],
    ['O que uma função sem return devolve?', 'undefined.'],
    ['Como é uma arrow function?', '(n) => n * 2'],
    ['O que é escopo local?', 'Variáveis que só existem dentro da função ou bloco.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: funções com parâmetros e retorno são o mesmo conceito.',
      'Desenvolvimento Web: eventos de clique executam funções que você escreve.',
      'Testes de software: funções pequenas e puras são fáceis de testar.',
    ],
    profissional:
      'Código profissional é feito de funções pequenas com nomes claros. É o que permite que várias pessoas trabalhem no mesmo projeto sem se perder.',
  },
});
