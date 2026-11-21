import { completar, mc, montar, prever } from '../fundamentos/montar';

export const p03 = montar({
  id: 'python.m01.a03',
  titulo: 'Python: listas e laços',
  objetivo: 'Guardar valores em listas e repeti-los com for, range e while.',
  pre: ['python.m01.a02', 'logica.m01.a05'],
  min: 30,
  diag: mc(
    'Qual é o resultado de len([4, 5, 6])?',
    '3',
    [
      ['2', 'len conta todos os elementos.'],
      ['6', 'Esse é o último valor, não a quantidade.'],
    ],
    'len devolve a quantidade de elementos.',
  ),
  simples: {
    titulo: 'Fileira de caixas e uma volta por todas',
    texto:
      'Uma **lista** guarda valores em ordem: `notas = [8, 6, 9]`. Índices começam em 0: `notas[0]` é 8 e `notas[-1]` é o último.\n\n```\nfor nota in notas:\n    print(nota)\n\nfor i in range(3):\n    print(i)   # 0, 1, 2\n\nwhile x < 10:\n    x += 1\n```\n\n- `for item in lista` percorre os elementos.\n- `range(n)` gera 0 até n-1.\n- `append` adiciona ao fim: `notas.append(10)`.',
    essencial: 'Listas [ ], índice a partir de 0, for item in lista, range(n), append e len.',
    guiado:
      'Para somar:\n1. `total = 0`.\n2. `for n in lista:`.\n3. Recuado: `total += n`.\n4. `print(total)`.',
    tecnico:
      'Listas são mutáveis e aceitam tipos misturados. O fatiamento `lista[1:3]` devolve uma nova lista. `sum`, `min` e `max` já existem. `range(inicio, fim, passo)` não inclui o fim. O `break` interrompe um laço e `continue` pula para a próxima volta.',
  },
  analogia: {
    titulo: 'Corredor de armários',
    texto:
      'A lista é um corredor de armários numerados a partir do zero. O for é você caminhando pelo corredor, abrindo um por vez. O acumulador é o caderninho onde anota o total.',
    limites: 'Índice -1 funciona em Python (último armário), algo que não existe em JavaScript.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'O código é o equivalente em JavaScript dos laços Python. Compare e altere a lista.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: notas = [8, 6, 9]; total = 0; for n in notas: total += n\nconst notas = [8, 6, 9];\nlet total = 0;\nfor (const n of notas) {\n  total += n;\n}\nconsole.log(total);\n// Python: for i in range(3): print(i)\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n// Python: notas[-1]\nconsole.log(notas[notas.length - 1]);',
    },
  },
  tecnica: {
    titulo: 'Padrões',
    texto:
      '**Somar:** `total += n`.\n**Contar:** `if n > 5: cont += 1`.\n**Maior:** `maior = max(lista)` ou laço.\n**Índice e valor:** `for i, n in enumerate(lista)`.\n**Fatia:** `lista[:2]` (os dois primeiros), `lista[-2:]` (os dois últimos).',
  },
  diagrama: {
    titulo: 'Percorrer e acumular',
    nos: [
      { forma: 'inicio', texto: 'total = 0' },
      { forma: 'decisao', texto: 'Ainda há elementos na lista?' },
      { forma: 'passo', texto: 'Sim: some o elemento ao total e avance' },
      { forma: 'fim', texto: 'Não: mostre o total' },
    ],
    descricao: 'O total começa em zero e recebe cada elemento; ao final é exibido.',
  },
  exemplo: {
    titulo: 'Contar aprovados',
    codigo: {
      linguagem: 'python',
      fonte:
        'notas = [8, 4, 7, 9, 5]\naprovados = 0\nfor nota in notas:\n    if nota >= 7:\n        aprovados += 1\nprint(aprovados)',
    },
    comentarios: [
      { linha: 3, texto: 'for percorre cada nota.' },
      { linha: 5, texto: 'Soma 1 a cada aprovado.' },
      { linha: 6, texto: 'Mostra 3.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'a = [10, 20, 30]\nprint(a[-1])',
      ['30'],
      'O índice -1 é o último elemento.',
      [{ resposta: '10', feedback: '-1 conta a partir do fim.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'for i in range(3):\n    print(i, end=" ")',
      ['0 1 2', '0 1 2 '],
      'range(3) gera 0, 1 e 2.',
      [{ resposta: '1 2 3', feedback: 'range começa em 0 e termina antes de 3.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'x = [1, 2]\nx.append(3)\nprint(len(x))',
      ['3'],
      'append adiciona 3; a lista fica com 3 elementos.',
      [{ resposta: '2', feedback: 'O append aumenta a lista.' }],
      [],
      'python',
    ),
    completar(
      'Complete para somar os elementos.',
      'total = 0\n___ n in [1, 2, 3]:\n    total ___ n\nprint(total)',
      [
        { aceitas: ['for'], feedback: 'for percorre os elementos.' },
        { aceitas: ['+='], feedback: '+= acumula o valor.' },
      ],
      'for percorre a lista e += acumula.',
      'python',
    ),
  ],
  desafio: prever(
    'O que o código mostra?',
    'print(sum(range(1, 5)))',
    ['10'],
    'range(1, 5) gera 1, 2, 3, 4; a soma é 10.',
    [{ resposta: '15', feedback: 'range não inclui o 5.' }],
    ['range(1, 5) termina antes do 5.'],
    'python',
  ),
  rec: [
    mc(
      'Qual é o índice do primeiro elemento de uma lista?',
      '0',
      [
        ['1', 'A contagem começa em zero.'],
        ['-1', 'O -1 é o último elemento.'],
      ],
      'O primeiro é lista[0].',
    ),
    mc(
      'O que range(2, 5) gera?',
      '2, 3 e 4',
      [
        ['2, 3, 4 e 5', 'O limite final não entra.'],
        ['0, 1, 2, 3 e 4', 'Esse seria range(5).'],
      ],
      'range(inicio, fim) vai até fim - 1.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem o for e o range em Python.',
    modelo:
      'O for repete um bloco para cada elemento de uma sequência. O range gera uma sequência de números, útil para repetir um número exato de vezes ou percorrer índices.',
    rubrica: [
      'Explicou o for como repetição por elemento',
      'Explicou o range como gerador de números',
      'Deu um exemplo ou uso',
    ],
  },
  resumo: [
    'Lista: [ ], índice a partir de 0, -1 é o último.',
    'for item in lista percorre elementos.',
    'range(n) gera 0 até n-1.',
    'append adiciona; len conta.',
  ],
  cards: [
    ['Como percorrer uma lista?', 'for item in lista:'],
    ['O que gera range(3)?', '0, 1 e 2.'],
    ['Como adicionar ao fim?', 'lista.append(valor)'],
    ['O que é lista[-1]?', 'O último elemento.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: arrays e for...of fazem o mesmo.',
      'Engenharia de Dados: percorrer e somar registros é rotina.',
      'Lógica de Programação: vetores e repetição são os mesmos conceitos.',
    ],
    profissional: 'Listas e laços estão em todo script de automação e análise de dados.',
  },
});
