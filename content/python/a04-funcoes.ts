import { completar, mc, montar, prever } from '../fundamentos/montar';

export const p04 = montar({
  id: 'python.m01.a04',
  titulo: 'Python: funções',
  objetivo: 'Criar funções com def, parâmetros, valores padrão e return.',
  pre: ['python.m01.a03', 'logica.m02.a02'],
  min: 25,
  diag: mc(
    'Qual palavra define uma função em Python?',
    'def',
    [
      ['function', 'Essa é a palavra do JavaScript.'],
      ['func', 'Não existe em Python.'],
    ],
    'Em Python: def nome(parâmetros):.',
  ),
  simples: {
    titulo: 'Receitas com nome',
    texto:
      '```\ndef dobro(n):\n    return n * 2\n\nprint(dobro(4))   # 8\n\ndef saudar(nome, exclamacao=True):\n    if exclamacao:\n        return f"Olá, {nome}!"\n    return f"Olá, {nome}"\n```\n\n- `def` + nome + parâmetros + **dois-pontos**.\n- O corpo vai **recuado**.\n- `return` devolve o resultado.\n- Parâmetros podem ter **valor padrão**.\n- Também existe a forma curta: `quadrado = lambda n: n * n`.',
    essencial: 'def nome(parâmetros): corpo recuado com return. Parâmetros aceitam valor padrão.',
    guiado:
      'Para criar uma função:\n1. Decida entrada e saída.\n2. Escreva `def nome(parametros):`.\n3. Recue o corpo e use `return`.\n4. Teste com `print(nome(valor))`.',
    tecnico:
      'Sem return, a função devolve None. Parâmetros nomeados permitem chamar `saudar(nome="Ana", exclamacao=False)`. Variáveis criadas dentro da função são locais. Uma função pode devolver várias coisas como tupla: `return a, b`. Docstrings (texto entre aspas triplas) documentam a função.',
  },
  analogia: {
    titulo: 'Máquina de suco',
    texto:
      'A função é uma máquina: entram frutas (argumentos), sai suco (return). Os valores padrão são "se não disser, uso laranja".',
    limites:
      'Se a máquina não tiver return, ela funciona, mas entrega None, ou seja, nada utilizável.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'O código mostra em JavaScript o que seriam as funções Python. Compare, altere e chame com outros valores.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: def dobro(n): return n * 2\nfunction dobro(n) {\n  return n * 2;\n}\n// Python: def saudar(nome, ponto="!")\nfunction saudar(nome, ponto = "!") {\n  return `Olá, ${nome}${ponto}`;\n}\nconsole.log(dobro(4));\nconsole.log(saudar("Ana"));\nconsole.log(saudar("Ana", "."));',
    },
  },
  tecnica: {
    titulo: 'Detalhes',
    texto:
      '**Padrão:** `def f(a, b=10)`.\n**Nomeados:** `f(b=5, a=1)`.\n**Vários retornos:** `return soma, media` (tupla).\n**Sem return:** devolve `None`.\n**Boa prática:** nomes em snake_case, funções curtas e docstring.',
  },
  diagrama: {
    titulo: 'Chamada de função',
    nos: [
      { forma: 'inicio', texto: 'dobro(4) é chamada' },
      { forma: 'passo', texto: '4 vira o parâmetro n' },
      { forma: 'passo', texto: 'O corpo calcula n * 2' },
      { forma: 'fim', texto: 'return devolve 8 a quem chamou' },
    ],
    descricao: 'O argumento entra, o corpo calcula e o return devolve o resultado.',
  },
  exemplo: {
    titulo: 'Função com laço',
    codigo: {
      linguagem: 'python',
      fonte:
        'def contar_maiores(lista, limite):\n    total = 0\n    for n in lista:\n        if n > limite:\n            total += 1\n    return total\n\nprint(contar_maiores([3, 8, 10], 5))',
    },
    comentarios: [
      { linha: 1, texto: 'Dois parâmetros: lista e limite.' },
      { linha: 6, texto: 'Devolve a contagem.' },
      { linha: 8, texto: 'Mostra 2.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'def soma(a, b):\n    return a + b\nprint(soma(2, 3))',
      ['5'],
      'a = 2, b = 3, devolve 5.',
      [{ resposta: '23', feedback: 'São números, então o + soma.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'def f():\n    x = 1\nprint(f())',
      ['None'],
      'Sem return, a função devolve None.',
      [{ resposta: '1', feedback: 'Nada foi devolvido com return.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'def pot(x, e=2):\n    return x ** e\nprint(pot(3))',
      ['9'],
      'O expoente padrão é 2: 3 ** 2 = 9.',
      [{ resposta: '6', feedback: '** é potência, não multiplicação.' }],
      [],
      'python',
    ),
    completar(
      'Complete a função que devolve o triplo.',
      '___ triplo(n):\n    ___ n * 3',
      [
        { aceitas: ['def'], feedback: 'def define a função.' },
        { aceitas: ['return'], feedback: 'return devolve o resultado.' },
      ],
      'def cria a função e return entrega o valor.',
      'python',
    ),
  ],
  desafio: prever(
    'O que o código mostra?',
    'def f(a, b=1):\n    return a * b\nprint(f(4), f(4, 3))',
    ['4 12'],
    'f(4) usa b = 1 e dá 4; f(4, 3) dá 12.',
    [{ resposta: '4 4', feedback: 'O segundo valor substitui o padrão de b.' }],
    ['O padrão vale só quando o argumento é omitido.'],
    'python',
  ),
  rec: [
    mc(
      'O que uma função sem return devolve?',
      'None',
      [
        ['0', 'Não devolve zero.'],
        ['Uma string vazia', 'Devolve None.'],
      ],
      'None representa "nada".',
    ),
    mc(
      'Para que servem valores padrão?',
      'Permitir omitir um argumento na chamada',
      [
        [
          'Impedir erros de sintaxe nas chamadas da função',
          'Valores padrão tratam de argumentos omitidos.',
        ],
        [
          'Tornar a função mais rápida ao pular o cálculo dos argumentos',
          'Não afeta o desempenho.',
        ],
      ],
      'Se omitido, usa-se o padrão.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem as funções e o que é o return.',
    modelo:
      'Funções agrupam um trecho de código com nome para reutilizá-lo. O return devolve o resultado a quem chamou; sem ele, a função devolve None.',
    rubrica: [
      'Disse que agrupam código reutilizável',
      'Explicou o return',
      'Citou None sem return ou exemplo',
    ],
  },
  resumo: [
    'def nome(parâmetros): define funções.',
    'return devolve o resultado.',
    'Valores padrão tornam parâmetros opcionais.',
    'Sem return, devolve None.',
  ],
  cards: [
    ['Como definir uma função?', 'def nome(parametros):'],
    ['O que devolve uma função sem return?', 'None.'],
    ['Como dar valor padrão?', 'def f(a, b=10)'],
    ['O que é lambda?', 'Forma curta de função de uma expressão.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: function e arrow functions equivalem ao def e lambda.',
      'Testes: funções pequenas são fáceis de testar com pytest.',
      'Engenharia de Dados: pipelines são cadeias de funções.',
    ],
    profissional:
      'Funções bem nomeadas e curtas são o que torna um script de automação fácil de manter.',
  },
});
