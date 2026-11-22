import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j03 = montar({
  id: 'javascript.m01.a03',
  titulo: 'Laços e arrays',
  objetivo:
    'Guardar vários valores em um array, percorrê-los com for e for...of e acumular resultados.',
  pre: ['javascript.m01.a02', 'logica.m01.a05'],
  min: 30,
  diag: mc(
    'Em um array, qual é o índice do primeiro elemento?',
    '0',
    [
      ['1', 'A contagem de índices em JavaScript começa em zero.'],
      ['-1', 'Índices negativos não funcionam em arrays comuns.'],
    ],
    'Arrays começam no índice 0. O último elemento fica em `lista.length - 1`.',
  ),
  simples: {
    titulo: 'Uma fila de caixas numeradas',
    texto:
      'Um **array** guarda vários valores em ordem: `const notas = [8, 6, 9];`. Cada posição tem um **índice**, começando em 0: `notas[0]` é 8.\n\nPara repetir uma ação em cada elemento use um **laço**:\n\n```\nfor (let i = 0; i < notas.length; i++) {\n  console.log(notas[i]);\n}\n```\n\nOu, mais simples, o **for...of**:\n\n```\nfor (const nota of notas) {\n  console.log(nota);\n}\n```\n\nCom um **acumulador** (uma variável que cresce a cada volta) você soma, conta ou encontra o maior valor.',
    essencial:
      'Array = lista ordenada, índice começa em 0, length é o tamanho. for e for...of percorrem. Acumulador guarda o resultado parcial.',
    guiado:
      'Para somar uma lista:\n1. Crie `let total = 0;`.\n2. Percorra com `for (const n of lista)`.\n3. Dentro do laço, faça `total += n;`.\n4. Depois do laço, devolva `total`.',
    tecnico:
      '`for` clássico tem inicialização, condição e passo. `for...of` itera sobre os valores de qualquer iterável (arrays, strings). `push` adiciona ao fim, `length` informa o tamanho. Um array declarado com const pode ter elementos alterados: const protege a referência. Um laço com condição que nunca fica falsa trava a página; o sandbox deste curso interrompe após 2 segundos.',
  },
  analogia: {
    titulo: 'Prateleira com compartimentos',
    texto:
      'O array é uma prateleira com compartimentos numerados a partir do zero. O laço é você andando pela prateleira, parando em cada compartimento. O acumulador é um caderninho onde você vai anotando o total conforme passa.',
    limites:
      'Numa prateleira real o primeiro compartimento seria o "1". Em JavaScript é o 0, e pedir uma posição que não existe devolve `undefined`, sem erro.',
  },
  demo: {
    titulo: 'Percorra e acumule',
    instrucoes:
      'Execute. Depois adicione um número à lista, troque `+=` por `*=` (começando de 1) e mude o laço para mostrar só os maiores que 5.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const lista = [4, 8, 15, 16];\nlet total = 0;\nfor (const n of lista) {\n  total += n;\n}\nconsole.log(total);\nconsole.log(lista.length);\nconsole.log(lista[0]);\nlista.push(23);\nconsole.log(lista);',
    },
  },
  tecnica: {
    titulo: 'Padrões com laços',
    texto:
      '**Somar:** `total += n`.\n**Contar:** `if (condição) contador++`.\n**Maior valor:** comece com o primeiro elemento e atualize quando achar um maior.\n**Índice:** use o `for` clássico quando precisar da posição (`i`).\n\n**Armadilha:** o último índice é `length - 1`. Usar `i <= lista.length` lê uma posição que não existe (`undefined`).',
  },
  diagrama: {
    titulo: 'Somar os elementos',
    nos: [
      { forma: 'inicio', texto: 'total = 0' },
      { forma: 'decisao', texto: 'Ainda há elementos na lista?' },
      { forma: 'passo', texto: 'Sim: some o elemento atual ao total e avance' },
      { forma: 'fim', texto: 'Não: devolva o total' },
    ],
    descricao:
      'O total começa em zero. Enquanto houver elementos, soma-se o atual e avança. Ao acabar, devolve-se o total.',
  },
  exemplo: {
    titulo: 'Contar aprovados',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const notas = [8, 4, 7, 9, 5];\nlet aprovados = 0;\nfor (const nota of notas) {\n  if (nota >= 7) {\n    aprovados++;\n  }\n}\nconsole.log(aprovados);',
    },
    comentarios: [
      { linha: 2, texto: 'O contador começa em zero.' },
      { linha: 3, texto: 'for...of entrega cada nota, uma por volta.' },
      { linha: 5, texto: 'Só aumenta o contador quando a nota é 7 ou mais.' },
      { linha: 8, texto: 'Mostra 3 (8, 7 e 9).' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'const a = [10, 20, 30];\nconsole.log(a[1]);',
      ['20'],
      'O índice 1 é o segundo elemento.',
      [{ resposta: '10', feedback: 'O primeiro elemento é o índice 0; o índice 1 é o segundo.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'let s = 0;\nfor (const n of [1, 2, 3]) {\n  s += n;\n}\nconsole.log(s);',
      ['6'],
      '0 + 1 + 2 + 3 = 6.',
      [
        {
          resposta: '3',
          feedback: 'Cada volta soma o elemento ao acumulador; no final são todos somados.',
        },
      ],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'const a = [5, 6];\na.push(7);\nconsole.log(a.length);',
      ['3'],
      'push adiciona o 7 ao fim; o array passa a ter 3 elementos.',
      [{ resposta: '2', feedback: 'O push aumenta o tamanho do array.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva somar(lista): devolve a soma de todos os números do array. Para lista vazia, devolve 0.',
      'function somar(lista) {\n  // seu código aqui\n}',
      'function somar(lista) {\n  let total = 0;\n  for (const n of lista) {\n    total += n;\n  }\n  return total;\n}',
      'somar',
      [
        { argumentos: [[1, 2, 3]], esperado: 6 },
        { argumentos: [[10, -4]], esperado: 6 },
        { argumentos: [[]], esperado: 0 },
      ],
      [
        'Crie um acumulador começando em 0.',
        'Some cada elemento dentro do laço e devolva depois dele.',
      ],
      'O acumulador começa em zero (também o resultado correto para lista vazia) e recebe cada elemento.',
    ),
  ],
  desafio: programaJs(
    'Escreva maiorValor(lista): devolve o maior número do array (a lista nunca é vazia).',
    'function maiorValor(lista) {\n  // seu código aqui\n}',
    'function maiorValor(lista) {\n  let maior = lista[0];\n  for (const n of lista) {\n    if (n > maior) {\n      maior = n;\n    }\n  }\n  return maior;\n}',
    'maiorValor',
    [
      { argumentos: [[3, 9, 2]], esperado: 9 },
      { argumentos: [[-5, -2, -8]], esperado: -2 },
      { argumentos: [[7]], esperado: 7 },
    ],
    [
      'Comece com maior = lista[0] (não com 0: e se todos forem negativos?).',
      'Atualize maior quando encontrar um número maior.',
    ],
    'Começar pelo primeiro elemento funciona mesmo com números negativos.',
  ),
  rec: [
    mc(
      'Para um array com 4 elementos, qual é o índice do último?',
      '3',
      [
        ['4', 'Com 4 elementos os índices vão de 0 a 3.'],
        ['5', 'Esse índice não existe em um array de 4 elementos.'],
      ],
      'O último índice é sempre length - 1.',
    ),
    mc(
      'O que faz esse código?',
      'Conta quantos elementos são maiores que 10',
      [
        [
          'Soma todos os elementos da lista em uma variável',
          'Ele só conta quantos passam do limite.',
        ],
        [
          'Devolve o maior elemento encontrado na lista',
          'O código conta elementos, não busca o maior.',
        ],
      ],
      'O acumulador n aumenta uma unidade para cada elemento que passa no teste do if.',
      0,
      {
        linguagem: 'javascript',
        fonte: 'let n = 0;\nfor (const x of lista) {\n  if (x > 10) n++;\n}',
      },
    ),
  ],
  explique: {
    enunciado: 'Explique o que é um acumulador e dê um exemplo de uso.',
    modelo:
      'Um acumulador é uma variável criada antes do laço que vai sendo atualizada a cada volta. Por exemplo, um total que começa em 0 e recebe cada número da lista para calcular a soma.',
    rubrica: [
      'Disse que é uma variável criada antes do laço',
      'Disse que é atualizada a cada volta',
      'Deu um exemplo (soma, contagem ou maior valor)',
    ],
  },
  resumo: [
    'Array: lista ordenada; índices começam em 0; `length` é o tamanho.',
    '`for` e `for...of` percorrem os elementos.',
    'Acumuladores calculam soma, contagem e maior valor.',
    '`push` adiciona ao fim do array.',
  ],
  cards: [
    ['Qual é o índice do primeiro elemento de um array?', '0.'],
    ['Como pegar o último elemento?', 'lista[lista.length - 1]'],
    ['O que é um acumulador?', 'Variável criada antes do laço e atualizada a cada volta.'],
    ['Como adicionar um item no fim do array?', 'lista.push(valor)'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: vetores e laços do Portugol viram arrays e for.',
      'SQL: um SELECT devolve uma lista de linhas que você percorre assim.',
      'Ciência de Dados: somar, contar e achar máximos são as bases de qualquer análise.',
    ],
    profissional:
      'Quase todo dado chega em forma de lista (usuários, pedidos, logs). Percorrer e acumular é o dia a dia de quem programa.',
  },
});
