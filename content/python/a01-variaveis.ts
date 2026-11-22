import { completar, mc, montar, prever } from '../fundamentos/montar';

export const p01 = montar({
  id: 'python.m01.a01',
  titulo: 'Python: variáveis, tipos e print',
  objetivo:
    'Criar variáveis em Python, conhecer int, float, str e bool, e montar textos com f-strings.',
  pre: ['logica.m01.a02'],
  min: 25,
  diag: mc(
    'Em Python, como se cria a variável idade com o valor 20?',
    'idade = 20',
    [
      ['let idade = 20', 'Isso é JavaScript; em Python não se declara com let.'],
      ['int idade = 20;', 'Python não pede tipo nem ponto e vírgula.'],
    ],
    'Em Python basta escrever nome = valor. O tipo é descoberto sozinho.',
  ),
  simples: {
    titulo: 'A mesma caixa, escrita mais limpa',
    texto:
      'Python é conhecido por ser **legível**. Para criar uma variável, só atribua:\n\n```\nnome = "Ana"\nidade = 20\naltura = 1.65\nmaior = idade >= 18\nprint(f"{nome} tem {idade} anos")\n```\n\n- Tipos: `int` (inteiros), `float` (decimais), `str` (textos), `bool` (`True`/`False`).\n- `print()` mostra valores.\n- **f-string:** `f"... {variavel} ..."` monta textos.\n- Não há `;` nem `let`; os booleanos começam com maiúscula.',
    essencial:
      'nome = valor cria variável. Tipos: int, float, str, bool. print mostra. f"...{x}..." monta textos.',
    guiado:
      'Para guardar e mostrar:\n1. Escreva `idade = 20`.\n2. Use `print(idade)`.\n3. Para frases, `print(f"Tenho {idade} anos")`.\n4. `type(idade)` revela o tipo.',
    tecnico:
      'Python é de tipagem dinâmica e forte: a variável pode mudar de tipo, mas operações entre tipos incompatíveis dão erro (`"5" + 5` falha com TypeError, ao contrário do JavaScript). A divisão `/` sempre devolve float; `//` é divisão inteira e `%` o resto. Convenção de nomes: snake_case (`nome_completo`).',
  },
  analogia: {
    titulo: 'Etiqueta em caixa transparente',
    texto:
      'Você cola uma etiqueta (nome) em uma caixa transparente que mostra o que há dentro (o tipo é visível no valor). Trocar o conteúdo é só colocar outra coisa na caixa com a mesma etiqueta.',
    limites:
      'Python é rígido na mistura de tipos: não deixa somar texto com número sem converter antes, com `str()` ou `int()`.',
  },
  demo: {
    titulo: 'A mesma ideia, em JavaScript',
    instrucoes:
      'Este navegador executa JavaScript, não Python. O código abaixo mostra o equivalente em JS do exemplo Python acima; compare as duas formas de escrever. Execute e mude os valores.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: nome = "Ana"; idade = 20; print(f"{nome} tem {idade} anos")\nconst nome = "Ana";\nconst idade = 20;\nconsole.log(`${nome} tem ${idade} anos`);\n// Python: print(7 // 2, 7 % 2, 7 / 2)\nconsole.log(Math.floor(7 / 2), 7 % 2, 7 / 2);',
    },
  },
  tecnica: {
    titulo: 'Operadores e conversões',
    texto:
      '`+ - * /` como na matemática; `//` divisão inteira; `%` resto; `**` potência.\n**Conversões:** `int("5")`, `float("2.5")`, `str(10)`.\n**Entrada:** `nome = input("Seu nome: ")` (sempre devolve texto).\n**Comparações:** `==`, `!=`, `<`, `>`; lógicos: `and`, `or`, `not`.',
  },
  diagrama: {
    titulo: 'Texto para número e de volta',
    nos: [
      { forma: 'inicio', texto: 'input() devolve sempre um texto' },
      { forma: 'passo', texto: 'int() ou float() converte o texto em número' },
      { forma: 'passo', texto: 'O cálculo é feito com números' },
      { forma: 'fim', texto: 'print mostra o resultado (f-string monta a frase)' },
    ],
    descricao: 'A entrada chega como texto, é convertida em número, calculada e exibida.',
  },
  exemplo: {
    titulo: 'Média de duas notas',
    codigo: {
      linguagem: 'python',
      fonte: 'n1 = 8\nn2 = 6\nmedia = (n1 + n2) / 2\nprint(f"Média: {media}")',
    },
    comentarios: [
      { linha: 3, texto: 'A divisão / devolve float: 7.0.' },
      { linha: 4, texto: 'Mostra: Média: 7.0.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'x = 7\nprint(x // 2)',
      ['3'],
      '// é a divisão inteira: 7 // 2 = 3.',
      [{ resposta: '3.5', feedback: '// descarta a parte decimal; o / é que daria 3.5.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'print(type(3.0))',
      ["<class 'float'>"],
      'Um número com ponto decimal é float.',
      [{ resposta: "<class 'int'>", feedback: '3.0 tem parte decimal, então é float.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'nome = "Rick"\nprint(f"Olá, {nome}!")',
      ['Olá, Rick!'],
      'A f-string troca {nome} pelo valor.',
      [
        {
          resposta: 'Olá, nome!',
          feedback: 'Dentro das chaves, o nome da variável é trocado pelo valor.',
        },
      ],
      [],
      'python',
    ),
    completar(
      'Complete para mostrar o resto da divisão de 17 por 5.',
      'print(17 ___ 5)',
      [{ aceitas: ['%'], feedback: 'O operador % devolve o resto.' }],
      '17 dividido por 5 dá 3 e sobra 2, então 17 % 5 = 2.',
      'python',
    ),
  ],
  desafio: prever(
    'O que o código mostra?',
    'a = "5"\nb = int(a) + 3\nprint(b)',
    ['8'],
    'int("5") converte o texto em 5; 5 + 3 = 8.',
    [{ resposta: '53', feedback: 'Como a foi convertido com int(), a soma é numérica.' }],
    ['Observe a conversão com int().'],
    'python',
  ),
  rec: [
    mc(
      'Qual operador faz divisão inteira em Python?',
      '//, que divide e arredonda para baixo, devolvendo um inteiro',
      [
        [
          '/, que divide e devolve sempre um número decimal',
          'O / devolve decimal; a divisão inteira é //.',
        ],
        ['%, que devolve o resto da divisão', 'O % é o resto, não a divisão inteira.'],
      ],
      '7 // 2 vale 3.',
    ),
    mc(
      'O que acontece com "5" + 5 em Python?',
      'Gera um erro (TypeError), pois o Python não mistura texto e número',
      [
        [
          'Resulta em "55", como no JavaScript, juntando os dois valores',
          'O Python não converte sozinho: gera TypeError.',
        ],
        [
          'Resulta em 10, pois o Python converte o texto em número',
          'O Python não converte sozinho.',
        ],
      ],
      'Python não mistura texto e número sem conversão explícita.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é uma f-string e por que ela é útil.',
    modelo:
      'Uma f-string é um texto com f na frente em que se colocam variáveis dentro de chaves. Ela facilita montar frases com valores sem precisar juntar pedaços com +.',
    rubrica: [
      'Descreveu o f antes das aspas e as chaves',
      'Disse que insere valores de variáveis',
      'Citou facilitar a montagem de textos',
    ],
  },
  resumo: [
    'Variável: nome = valor.',
    'Tipos: int, float, str, bool.',
    'f"...{x}..." monta textos.',
    'Python não mistura texto e número sem conversão.',
  ],
  cards: [
    ['Como criar uma variável em Python?', 'nome = valor'],
    ['O que faz //?', 'Divisão inteira.'],
    ['Como montar um texto com variável?', 'f"Olá, {nome}"'],
    ['input devolve que tipo?', 'Sempre str (texto).'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: mesmas ideias com sintaxe diferente.',
      'Engenharia de Dados: Python é a linguagem principal da área.',
      'Lógica de Programação: variáveis e tipos são os mesmos conceitos.',
    ],
    profissional:
      'Python é a linguagem mais usada em dados, automação e IA. Saber seus tipos e conversões evita os erros mais comuns de iniciantes.',
  },
});
