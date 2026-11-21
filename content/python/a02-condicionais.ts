import { completar, mc, montar, prever } from '../fundamentos/montar';

export const p02 = montar({
  id: 'python.m01.a02',
  titulo: 'Python: condicionais e indentação',
  objetivo: 'Decidir caminhos com if, elif e else, e entender que a indentação define os blocos.',
  pre: ['python.m01.a01', 'logica.m01.a04'],
  min: 25,
  diag: mc(
    'Como o Python marca o que está dentro de um if?',
    'Pela indentação (recuo) das linhas',
    [
      ['Com chaves { }', 'Chaves são de JavaScript; Python usa recuo.'],
      ['Com begin e end', 'Isso lembra Pascal.'],
    ],
    'Em Python o recuo faz parte da sintaxe.',
  ),
  simples: {
    titulo: 'Decidir sem chaves',
    texto:
      '```\nnota = 7\nif nota >= 7:\n    print("aprovado")\nelif nota >= 5:\n    print("recuperação")\nelse:\n    print("reprovado")\n```\n\n- A linha do `if` termina com **dois-pontos**.\n- As linhas do bloco ficam **recuadas** (4 espaços).\n- `elif` = "senão se"; `else` = "senão".\n- Lógicos: `and`, `or`, `not`.',
    essencial:
      'if/elif/else com dois-pontos; o recuo define o bloco; and, or e not combinam condições.',
    guiado:
      'Para decidir:\n1. Escreva `if condição:`.\n2. Recue o que deve acontecer.\n3. Acrescente `elif` e `else` se precisar.\n4. Mantenha o mesmo recuo em todo o bloco.',
    tecnico:
      'Valores "falsy": 0, "", [], None e False contam como falso. O operador ternário é `a if condição else b`. A comparação em cadeia é permitida: `5 <= n <= 10`. Misturar espaços e tabs causa IndentationError.',
  },
  analogia: {
    titulo: 'Texto com recuo de tópicos',
    texto:
      'Como num resumo com tópicos e subtópicos, o recuo mostra o que pertence a quê. Se o recuo estiver errado, o significado muda, e o Python avisa com um erro.',
    limites: 'Em outras linguagens o recuo é só estética; em Python é regra.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'O código mostra a mesma decisão do exemplo Python, escrita em JavaScript. Compare e altere a nota.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: if nota >= 7: ... elif nota >= 5: ... else: ...\nconst nota = 6;\nif (nota >= 7) {\n  console.log("aprovado");\n} else if (nota >= 5) {\n  console.log("recuperação");\n} else {\n  console.log("reprovado");\n}\n// Python permite: 5 <= nota <= 10\nconsole.log(nota >= 5 && nota <= 10);',
    },
  },
  tecnica: {
    titulo: 'Regras importantes',
    texto:
      '**Dois-pontos** no fim de if, elif, else, for, while e def.\n**Recuo:** 4 espaços por nível.\n**Cadeia:** `0 < x < 10` equivale a `x > 0 and x < 10`.\n**Igualdade:** `==`; **atribuição:** `=`.\n**Ternário:** `msg = "adulto" if idade >= 18 else "menor"`.',
  },
  diagrama: {
    titulo: 'Decisão em cadeia',
    nos: [
      { forma: 'inicio', texto: 'Recebe a nota' },
      { forma: 'decisao', texto: 'if nota >= 7' },
      { forma: 'decisao', texto: 'elif nota >= 5' },
      { forma: 'fim', texto: 'else: reprovado' },
    ],
    descricao:
      'As condições são testadas em ordem; o primeiro bloco verdadeiro executa e os demais são ignorados.',
  },
  exemplo: {
    titulo: 'Ingresso com meia-entrada',
    codigo: {
      linguagem: 'python',
      fonte:
        'idade = 70\nestudante = False\nif idade >= 60 or estudante:\n    preco = 20\nelse:\n    preco = 40\nprint(f"R$ {preco}")',
    },
    comentarios: [
      { linha: 3, texto: 'or: basta uma condição verdadeira.' },
      { linha: 4, texto: 'Bloco recuado do if.' },
      { linha: 7, texto: 'Mostra: R$ 20.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'x = 10\nif x > 5:\n    print("grande")\nelse:\n    print("pequeno")',
      ['grande'],
      '10 > 5 é verdadeiro.',
      [{ resposta: 'pequeno', feedback: 'A condição é verdadeira, então o else não executa.' }],
      [],
      'python',
    ),
    mc(
      'O que falta na primeira linha do if?',
      'Os dois-pontos (:) no final',
      [
        ['Chaves { }', 'Python não usa chaves para blocos.'],
        ['Ponto e vírgula', 'Não é necessário em Python.'],
      ],
      'if condição: com dois-pontos.',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'print(3 > 1 and 2 > 5)',
      ['False'],
      '3 > 1 é True, mas 2 > 5 é False. True and False dá False.',
      [{ resposta: 'True', feedback: 'O and exige as duas condições verdadeiras.' }],
      [],
      'python',
    ),
    completar(
      'Complete a decisão.',
      'nota = 6\nif nota >= 7:\n    print("aprovado")\n___ nota >= 5:\n    print("recuperação")\n___:\n    print("reprovado")',
      [
        { aceitas: ['elif'], feedback: 'elif é o "senão se" do Python.' },
        { aceitas: ['else'], feedback: 'else cobre o caso restante.' },
      ],
      'elif encadeia nova condição; else é o caso final.',
      'python',
    ),
  ],
  desafio: prever(
    'O que o código mostra?',
    'n = 0\nif n:\n    print("verdadeiro")\nelse:\n    print("falso")',
    ['falso'],
    'O número 0 é considerado falso em Python.',
    [{ resposta: 'verdadeiro', feedback: '0 é um valor "falsy".' }],
    ['Pense em quais valores contam como falso.'],
    'python',
  ),
  rec: [
    mc(
      'Qual palavra substitui "else if" em Python?',
      'elif',
      [
        ['elseif', 'Não existe em Python.'],
        ['else if', 'Python usa a forma abreviada elif.'],
      ],
      'elif é o "senão se".',
    ),
    mc(
      'O que acontece se o recuo estiver errado?',
      'O Python gera um IndentationError ou o programa muda de significado',
      [
        ['Nada, o recuo é só visual', 'Em Python ele define o bloco.'],
        ['O programa é corrigido sozinho', 'O Python não corrige.'],
      ],
      'Recuo faz parte da sintaxe.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como o Python separa os blocos de código e cite um erro comum.',
    modelo:
      'O Python usa dois-pontos e recuo (indentação) para definir blocos, sem chaves. Um erro comum é esquecer os dois-pontos ou misturar recuos diferentes, o que causa SyntaxError ou IndentationError.',
    rubrica: ['Citou o recuo ou indentação', 'Citou os dois-pontos', 'Citou um erro comum'],
  },
  resumo: [
    'if, elif e else com dois-pontos.',
    'O recuo define o bloco.',
    'and, or e not combinam condições.',
    '0, "", [] e None contam como falso.',
  ],
  cards: [
    ['Como é o "senão se" em Python?', 'elif.'],
    ['O que define um bloco em Python?', 'O recuo (indentação).'],
    ['Quais são os operadores lógicos?', 'and, or e not.'],
    ['0 é verdadeiro ou falso em Python?', 'Falso.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: mesmo conceito, com chaves e parênteses.',
      'Portas lógicas: and, or e not são AND, OR e NOT.',
      'Engenharia de Dados: filtros de linhas usam condições.',
    ],
    profissional:
      'A legibilidade imposta pelo recuo é um dos motivos de o Python ser tão usado em equipes.',
  },
});
