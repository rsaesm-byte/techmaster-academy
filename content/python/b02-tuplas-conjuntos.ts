import { associar, completar, mc, montar, prever } from '../fundamentos/montar';

export const p07 = montar({
  id: 'python.m02.a02',
  titulo: 'Python: tuplas e conjuntos',
  objetivo:
    'Usar tuplas para dados fixos, desempacotar valores e usar conjuntos para eliminar repetições.',
  pre: ['python.m02.a01'],
  min: 25,
  diag: mc(
    'Qual estrutura não aceita elementos repetidos?',
    'Conjunto (set)',
    [
      ['Lista, que guarda os elementos em ordem e aceita repetidos', 'Listas aceitam repetidos.'],
      ['Tupla, que é imutável e guarda os elementos em ordem', 'Tuplas aceitam repetidos.'],
    ],
    'Conjuntos guardam cada valor uma única vez.',
  ),
  simples: {
    titulo: 'Mais duas estruturas',
    texto:
      '- **Tupla:** como uma lista que **não pode mudar**: `ponto = (3, 4)`.\n- **Desempacotamento:** `x, y = ponto` coloca 3 em x e 4 em y.\n- **Conjunto (set):** coleção **sem repetidos** e sem ordem fixa: `{1, 2, 2, 3}` vira `{1, 2, 3}`.\n\n```\nnomes = ["Ana", "Bia", "Ana"]\nunicos = set(nomes)\nprint(len(unicos))   # 2\n```',
    essencial:
      'Tupla: sequência imutável, desempacota em variáveis. Conjunto: valores únicos, ótimo para remover repetições.',
    guiado:
      'Para eliminar repetidos:\n1. Converta a lista com `set(lista)`.\n2. Se precisar de lista de novo, use `list(...)`.\n3. Lembre que a ordem pode mudar.',
    tecnico:
      'Tuplas são imutáveis e podem ser chaves de dicionário; listas não. Conjuntos usam tabela hash: o teste `x in conjunto` é muito mais rápido que em listas grandes. Operações de conjunto: união `a | b`, interseção `a & b` e diferença `a - b`. Um conjunto vazio se cria com `set()`, pois `{}` é um dicionário vazio.',
  },
  analogia: {
    titulo: 'Ingresso e lista de presença',
    texto:
      'A tupla é um ingresso impresso: com número e setor definidos, ninguém altera. O conjunto é a lista de presença: cada pessoa aparece uma vez, mesmo que passe pela catraca duas vezes.',
    limites: 'Conjuntos não guardam posição, então não há s[0].',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes: 'Em JavaScript, `Set` e a desestruturação de arrays fazem o mesmo trabalho.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: x, y = (3, 4)\nconst [x, y] = [3, 4];\nconsole.log(x + y);\n// Python: set(["Ana", "Bia", "Ana"])\nconst unicos = new Set(["Ana", "Bia", "Ana"]);\nconsole.log(unicos.size);\n// Python: a & b\nconst a = new Set([1, 2, 3]);\nconst b = new Set([2, 3, 4]);\nconsole.log([...a].filter((n) => b.has(n)));',
    },
  },
  tecnica: {
    titulo: 'Operações com conjuntos',
    texto:
      '`a | b`: união.\n`a & b`: interseção (em comum).\n`a - b`: só em a.\n`s.add(x)` e `s.remove(x)`.\n`x in s`: pertence?\nTupla de um item: `(5,)`, com a vírgula.',
  },
  diagrama: {
    titulo: 'Qual estrutura usar?',
    nos: [
      { forma: 'inicio', texto: 'Preciso guardar vários valores' },
      { forma: 'decisao', texto: 'Podem se repetir e importa a ordem?' },
      { forma: 'passo', texto: 'Sim: lista (ou tupla, se não vai mudar)' },
      { forma: 'fim', texto: 'Não: conjunto, para valores únicos' },
    ],
    descricao: 'Lista para sequências, tupla para fixos, conjunto para únicos.',
  },
  exemplo: {
    titulo: 'Quem participou dos dois dias',
    codigo: {
      linguagem: 'python',
      fonte:
        'dia1 = {"Ana", "Bia", "Caio"}\ndia2 = {"Bia", "Caio", "Duda"}\nambos = dia1 & dia2\nprint(len(ambos))',
    },
    comentarios: [
      { linha: 3, texto: 'A interseção traz quem está nos dois conjuntos: Bia e Caio.' },
      { linha: 4, texto: 'Mostra 2.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'print(len({1, 2, 2, 3}))',
      ['3'],
      'O 2 repetido conta uma vez só.',
      [{ resposta: '4', feedback: 'Conjuntos descartam repetidos.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'x, y = 3, 4\nprint(x + y)',
      ['7'],
      'Desempacotamento: x vale 3 e y vale 4.',
      [{ resposta: '34', feedback: 'São números, então o + soma.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'print(len(set("banana")))',
      ['3'],
      'Letras únicas: b, a e n.',
      [{ resposta: '6', feedback: '6 é o tamanho do texto; o conjunto remove repetidas.' }],
      [],
      'python',
    ),
    completar(
      'Complete para remover repetidos da lista.',
      'nomes = ["Ana", "Bia", "Ana"]\nunicos = ___(nomes)',
      [{ aceitas: ['set'], feedback: 'set() cria um conjunto sem repetidos.' }],
      'Converter para set elimina duplicatas.',
      'python',
    ),
  ],
  desafio: associar(
    'Associe a estrutura à característica.',
    [
      ['Lista', 'Ordenada e pode mudar'],
      ['Tupla', 'Ordenada e imutável'],
      ['Conjunto', 'Valores únicos, sem posição'],
      ['Dicionário', 'Pares chave-valor'],
    ],
    'Escolher a estrutura certa simplifica o código.',
  ),
  rec: [
    mc(
      'Como criar um conjunto vazio?',
      'set()',
      [
        ['{}, as mesmas chaves usadas para criar dicionários', '{} cria um dicionário vazio.'],
        ['[], os mesmos colchetes usados para criar listas', '[] cria uma lista vazia.'],
      ],
      'Só set() cria o conjunto vazio.',
    ),
    mc(
      'O que a & b devolve, sendo a e b conjuntos?',
      'Os elementos presentes nos dois',
      [
        ['Todos os elementos dos dois', 'Isso é a união (a | b).'],
        ['Só os de a', 'Isso é a diferença (a - b).'],
      ],
      'O & é a interseção.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique quando você usaria um conjunto em vez de uma lista.',
    modelo:
      'Usaria um conjunto quando só importam valores únicos ou quando preciso testar pertencimento com rapidez, por exemplo remover repetidos ou comparar dois grupos. Lista é melhor quando a ordem e os repetidos importam.',
    rubrica: [
      'Citou valores únicos',
      'Citou teste de pertencimento rápido ou operações de conjunto',
      'Contrastou com a lista',
    ],
  },
  resumo: [
    'Tupla: sequência imutável; desempacota em variáveis.',
    'Conjunto: valores únicos, sem posição.',
    'set(lista) remove repetidos.',
    'Operadores: | união, & interseção, - diferença.',
  ],
  cards: [
    ['O que é uma tupla?', 'Sequência imutável: (1, 2).'],
    ['Como remover repetidos?', 'set(lista)'],
    ['Interseção de a e b?', 'a & b'],
    ['Conjunto vazio?', 'set()'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: Set e desestruturação de arrays.',
      'SQL: DISTINCT, UNION e INTERSECT têm a mesma ideia.',
      'Matemática: teoria dos conjuntos.',
    ],
    profissional:
      'Deduplicar registros e comparar listas de clientes ou arquivos são tarefas diárias em dados e automação.',
  },
});
