import { associar, completar, mc, montar, prever } from '../fundamentos/montar';

export const p05 = montar({
  id: 'python.m01.a05',
  titulo: 'Python: dicionários e compreensões',
  objetivo: 'Guardar dados com chave e valor em dicionários e transformar listas com compreensões.',
  pre: ['python.m01.a04'],
  min: 30,
  diag: mc(
    'Como se acessa o valor da chave "nome" em um dicionário d?',
    'd["nome"]',
    [
      ['d.nome, como no acesso a atributos de um objeto', 'Dicionários usam colchetes e a chave.'],
      [
        'd(nome), chamando o dicionário como uma função',
        'Dicionários não são chamados como funções.',
      ],
    ],
    'Dicionários usam colchetes com a chave.',
  ),
  simples: {
    titulo: 'Fichas com etiquetas',
    texto:
      'Um **dicionário** guarda pares **chave: valor**:\n\n```\naluno = {"nome": "Ana", "idade": 20}\nprint(aluno["nome"])\naluno["idade"] = 21\nfor chave, valor in aluno.items():\n    print(chave, valor)\n```\n\nUma **compreensão de lista** cria listas novas de forma compacta:\n\n```\nquadrados = [n * n for n in [1, 2, 3]]   # [1, 4, 9]\npares = [n for n in range(10) if n % 2 == 0]\n```',
    essencial:
      'Dicionário: {chave: valor}, acesso d[chave]. Compreensão: [expressão for item in lista if condição].',
    guiado:
      'Para transformar uma lista:\n1. Escreva a expressão que quer: `n * 2`.\n2. Acrescente `for n in lista`.\n3. Se quiser filtrar, finalize com `if condição`.\n4. Coloque tudo entre colchetes.',
    tecnico:
      'Dicionários têm busca rápida por chave (tabela hash) e chaves únicas. `d.get("x", padrão)` evita erro se a chave não existir (`d["x"]` lança KeyError). Compreensões equivalem a map + filter e também existem para dicionários e conjuntos. Dicionários são a base do JSON: `json.loads` e `json.dumps` convertem de e para texto.',
  },
  analogia: {
    titulo: 'Agenda de contatos',
    texto:
      'O dicionário é uma agenda: você procura pelo nome (chave) e obtém o telefone (valor). A compreensão é a linha de montagem: "para cada contato, traga só o primeiro nome".',
    limites: 'Chaves duplicadas se sobrescrevem: o último valor vence.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'Em JavaScript, os dicionários são objetos e as compreensões viram map e filter. Compare com o código Python nos comentários.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: aluno = {"nome": "Ana", "idade": 20}\nconst aluno = { nome: "Ana", idade: 20 };\nconsole.log(aluno["nome"]);\n// Python: [n * n for n in [1, 2, 3]]\nconsole.log([1, 2, 3].map((n) => n * n));\n// Python: [n for n in range(10) if n % 2 == 0]\nconsole.log([...Array(10).keys()].filter((n) => n % 2 === 0));',
    },
  },
  tecnica: {
    titulo: 'Métodos úteis',
    texto:
      '`d.keys()`, `d.values()`, `d.items()`.\n`d.get("x", 0)`: valor padrão.\n`"x" in d`: a chave existe?\n`del d["x"]`: remove.\n**Compreensão de dicionário:** `{n: n * n for n in range(3)}` → `{0: 0, 1: 1, 2: 4}`.',
  },
  diagrama: {
    titulo: 'Compreensão passo a passo',
    nos: [
      { forma: 'inicio', texto: 'Lista de origem' },
      { forma: 'decisao', texto: 'O elemento passa na condição (if)?' },
      { forma: 'passo', texto: 'Sim: aplica a expressão e guarda na nova lista' },
      { forma: 'fim', texto: 'A nova lista é o resultado' },
    ],
    descricao: 'Cada elemento é testado e transformado, formando uma lista nova.',
  },
  exemplo: {
    titulo: 'Contagem de palavras',
    codigo: {
      linguagem: 'python',
      fonte:
        'frase = "a b a c a"\ncontagem = {}\nfor p in frase.split():\n    contagem[p] = contagem.get(p, 0) + 1\nprint(contagem)',
    },
    comentarios: [
      { linha: 3, texto: 'split() separa a frase em palavras.' },
      { linha: 4, texto: 'get devolve 0 se a palavra ainda não existe.' },
      { linha: 5, texto: "Mostra {'a': 3, 'b': 1, 'c': 1}." },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'd = {"a": 1, "b": 2}\nprint(d["b"])',
      ['2'],
      'O valor da chave "b" é 2.',
      [{ resposta: 'b', feedback: 'd["b"] devolve o valor, não a chave.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'print([n * 2 for n in [1, 2, 3]])',
      ['[2, 4, 6]', '[2,4,6]'],
      'Cada elemento é multiplicado por 2.',
      [{ resposta: '12', feedback: 'A compreensão devolve uma lista, não uma soma.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'print([n for n in range(6) if n % 2 == 0])',
      ['[0, 2, 4]', '[0,2,4]'],
      'Só os pares de 0 a 5 passam no if.',
      [{ resposta: '[1, 3, 5]', feedback: 'Esses são os ímpares.' }],
      [],
      'python',
    ),
    completar(
      'Complete para somar 1 à contagem com valor padrão 0.',
      'c = {}\nc["x"] = c.___("x", 0) + 1',
      [{ aceitas: ['get'], feedback: 'get devolve o valor ou o padrão informado.' }],
      'get evita o erro de chave inexistente.',
      'python',
    ),
  ],
  desafio: associar(
    'Associe cada trecho Python ao que ele faz.',
    [
      ['d["a"]', 'Lê o valor da chave "a"'],
      ['d.get("a", 0)', 'Lê a chave "a" ou devolve 0 se não existir'],
      ['[n * 2 for n in lista]', 'Cria uma lista com o dobro de cada elemento'],
      ['"a" in d', 'Verifica se a chave existe'],
    ],
    'Essas quatro formas cobrem boa parte do uso de dicionários e compreensões.',
  ),
  rec: [
    mc(
      'O que acontece ao acessar d["x"] se a chave não existe?',
      'Ocorre um KeyError',
      [
        [
          'Devolve None e o programa continua normalmente',
          'O d[...] gera KeyError; só o get devolve None.',
        ],
        ['Devolve 0 como valor padrão da chave que não existe', 'O Python não inventa valores.'],
      ],
      'Use d.get("x") para evitar o erro.',
    ),
    mc(
      'A que se parece uma compreensão de lista em JavaScript?',
      'map e filter',
      [
        [
          'for...in, que percorre as propriedades de um objeto',
          'A compreensão cria listas, como map e filter.',
        ],
        ['try/catch, que trata erros durante a execução', 'Isso é tratamento de erros.'],
      ],
      'Transformar e filtrar elementos com sintaxe compacta.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre uma lista e um dicionário.',
    modelo:
      'Uma lista guarda valores em ordem e é acessada por posição (índice). Um dicionário guarda pares chave-valor e é acessado pela chave, o que é mais adequado para dados rotulados.',
    rubrica: [
      'Disse que a lista usa posição',
      'Disse que o dicionário usa chave',
      'Citou quando usar cada um',
    ],
  },
  resumo: [
    'Dicionário: pares chave-valor, acesso por chave.',
    'get evita KeyError.',
    'Compreensão: [expr for x in lista if cond].',
    'Dicionários são a base do JSON.',
  ],
  cards: [
    ['Como criar um dicionário?', '{"chave": valor}'],
    ['Como evitar KeyError?', 'd.get("chave", padrão)'],
    ['Como é uma compreensão de lista?', '[expr for x in lista if cond]'],
    ['Qual o equivalente em JS ao dicionário?', 'Objeto.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: objetos, map e filter.',
      'Banco de Dados: uma linha de tabela se parece com um dicionário.',
      'Engenharia de Dados: transformar registros é a rotina da área.',
    ],
    profissional:
      'Em Python, dicionários e compreensões aparecem em quase todo código de dados e de integração com APIs.',
  },
});
