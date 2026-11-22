import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j01 = montar({
  id: 'javascript.m01.a01',
  titulo: 'Variáveis e tipos em JavaScript',
  objetivo:
    'Declarar variáveis com let e const, reconhecer os tipos string, number e boolean, juntar textos com template strings e mostrar valores com console.log.',
  pre: ['logica.m01.a02'],
  min: 30,
  diag: mc(
    'Qual palavra declara uma variável cujo valor NÃO pode ser trocado depois?',
    'const',
    [
      ['let', 'Com let o valor pode ser trocado quantas vezes quiser.'],
      ['var', 'var é a forma antiga e também permite trocar o valor.'],
    ],
    '`const` cria uma constante: depois de receber o valor, ele não pode ser reatribuído. É a melhor escolha quando o valor não muda.',
  ),
  simples: {
    titulo: 'Caixas com nome, agora em JavaScript',
    texto:
      'Você já conhece variáveis do Portugol. Em JavaScript a ideia é a mesma: uma caixa com nome que guarda um valor. A diferença é a escrita:\n\n```\nlet idade = 20;\nconst nome = "Ana";\n```\n\n- **`let`** cria uma variável cujo valor pode mudar.\n- **`const`** cria uma variável que não muda (use sempre que possível).\n\nOs três tipos mais comuns: **number** (números: 3, 2.5), **string** (textos entre aspas: "oi") e **boolean** (`true` ou `false`). Para mostrar um valor na tela do console, use **`console.log(valor)`**.\n\nPara montar frases com valores, use **crases** e `${}`: `` `Olá, ${nome}!` ``.',
    essencial:
      'let = muda; const = fixa. Tipos: number, string, boolean. console.log mostra valores. Crases com ${} montam textos.',
    guiado:
      'Para guardar e mostrar um valor:\n1. Escolha o nome da variável (`idade`).\n2. Use `let` se vai mudar ou `const` se não vai.\n3. Atribua com `=`: `let idade = 20;`.\n4. Mostre com `console.log(idade);`.\n5. Termine as instruções com ponto e vírgula.',
    tecnico:
      'JavaScript é de tipagem dinâmica: o tipo pertence ao valor, não à variável (`typeof` revela o tipo). `let` e `const` têm escopo de bloco; `var` tem escopo de função e comportamento de içamento (hoisting) que causa erros sutis, por isso é evitado. `const` impede a reatribuição, mas objetos e arrays declarados com const continuam mutáveis por dentro. O operador `+` concatena se um dos lados for string: `"5" + 5` resulta em "55".',
  },
  analogia: {
    titulo: 'Etiquetas e caixas',
    texto:
      'Pense numa caixa com etiqueta: a etiqueta é o nome da variável e o conteúdo é o valor. Com `let`, a caixa pode ser esvaziada e recebida de novo; com `const`, a caixa é lacrada depois de preenchida. O tipo é o formato do conteúdo: número, texto ou verdadeiro/falso.',
    limites:
      'Em JavaScript uma mesma variável `let` pode guardar um número agora e um texto depois, o que não é boa prática. E um `const` lacrado protege a etiqueta, não o que está dentro, se o conteúdo for um array ou objeto.',
  },
  demo: {
    titulo: 'Experimente variáveis e tipos',
    instrucoes:
      'Clique em Executar. Depois troque os valores, mude `const` por `let` e tente reatribuir uma constante para ver o erro. Experimente `typeof` com outros valores.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const nome = "Ana";\nlet idade = 20;\nidade = idade + 1;\nconsole.log(`${nome} tem ${idade} anos`);\nconsole.log(typeof nome);\nconsole.log(typeof idade);\nconsole.log("5" + 5);',
    },
  },
  tecnica: {
    titulo: 'Tipos, typeof e concatenação',
    texto:
      '**Tipos primitivos:** `number`, `string`, `boolean`, `undefined` (sem valor) e `null` (vazio de propósito).\n\n**typeof:** `typeof 3` é "number"; `typeof "oi"` é "string"; `typeof true` é "boolean".\n\n**Concatenar:** `"Olá, " + nome` junta textos. Com números, `"5" + 5` vira "55" porque o + prefere texto.\n\n**Template string:** `` `${a} + ${b} = ${a + b}` `` aceita expressões dentro de `${}`.\n\n**Nomes:** comece com letra e use camelCase (`nomeCompleto`). JavaScript diferencia maiúsculas: `Idade` e `idade` são variáveis diferentes.',
  },
  diagrama: {
    titulo: 'Escolhendo let ou const',
    nos: [
      { forma: 'inicio', texto: 'Preciso guardar um valor' },
      { forma: 'decisao', texto: 'O valor vai mudar depois?' },
      { forma: 'passo', texto: 'Sim: declare com let' },
      { forma: 'passo', texto: 'Não: declare com const' },
      { forma: 'fim', texto: 'Mostre ou use a variável pelo nome' },
    ],
    descricao:
      'Ao guardar um valor, pergunta-se se ele vai mudar. Se sim, usa-se let; se não, usa-se const. Depois a variável é usada pelo nome.',
  },
  exemplo: {
    titulo: 'Conta com template string',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const preco = 40;\nconst quantidade = 3;\nconst total = preco * quantidade;\nconsole.log(`Total: R$ ${total}`);',
    },
    comentarios: [
      { linha: 1, texto: 'const: o preço não muda neste programa.' },
      { linha: 3, texto: 'O valor da conta é guardado em outra variável.' },
      {
        linha: 4,
        texto: 'A crase permite colocar variáveis dentro do texto com ${}. Mostra: Total: R$ 120.',
      },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'let x = 5;\nx = x + 2;\nconsole.log(x);',
      ['7'],
      'x começa com 5, depois recebe 5 + 2 = 7.',
      [{ resposta: '5', feedback: 'A segunda linha muda o valor de x.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'console.log(typeof "5");',
      ['string'],
      'Tudo que está entre aspas é texto (string), mesmo que pareça número.',
      [{ resposta: 'number', feedback: 'Entre aspas, o valor é texto.' }],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'const nome = "Ana";\nconsole.log(`Olá, ${nome}!`);',
      ['Olá, Ana!'],
      'O ${nome} é substituído pelo valor da variável.',
      [
        {
          resposta: 'Olá, nome!',
          feedback: 'Dentro de ${}, o nome da variável é trocado pelo valor.',
        },
      ],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva a função saudacao(nome) que devolve o texto "Olá, " + nome + "!". Exemplo: saudacao("Ana") devolve "Olá, Ana!".',
      'function saudacao(nome) {\n  // seu código aqui\n}',
      'function saudacao(nome) {\n  return `Olá, ${nome}!`;\n}',
      'saudacao',
      [
        { argumentos: ['Ana'], esperado: 'Olá, Ana!' },
        { argumentos: ['Rick'], esperado: 'Olá, Rick!' },
      ],
      ['Use return para devolver o texto.', 'Com crases: `Olá, ${nome}!`.'],
      'return devolve o texto montado; a template string coloca o valor de nome dentro dele.',
    ),
  ],
  desafio: programaJs(
    'Escreva precoComDesconto(preco, percentual): devolve o preço depois de aplicar o desconto em %. Exemplo: precoComDesconto(100, 10) devolve 90.',
    'function precoComDesconto(preco, percentual) {\n  // seu código aqui\n}',
    'function precoComDesconto(preco, percentual) {\n  const desconto = (preco * percentual) / 100;\n  return preco - desconto;\n}',
    'precoComDesconto',
    [
      { argumentos: [100, 10], esperado: 90 },
      { argumentos: [50, 20], esperado: 40 },
      { argumentos: [200, 0], esperado: 200 },
    ],
    [
      'Calcule primeiro quanto vale o desconto: preco * percentual / 100.',
      'Subtraia o desconto do preço.',
    ],
    'O desconto é a parte percentual do preço; o preço final é o preço menos o desconto.',
  ),
  rec: [
    mc(
      'O que o código mostra?',
      '"55" (os valores são juntados como texto)',
      [
        ['10, porque 5 + 5 = 10', 'Como um dos lados é texto, o + concatena em vez de somar.'],
        [
          'Um erro, porque mistura texto e número',
          'JavaScript converte o número para texto e junta, sem erro.',
        ],
      ],
      'O + com uma string concatena: "5" + 5 vira "55".',
      0,
      { linguagem: 'javascript', fonte: 'console.log("5" + 5);' },
    ),
    mc(
      'Qual é a diferença entre let e const?',
      'let permite trocar o valor da variável; const não',
      [
        ['const guarda só números e let guarda textos', 'Os dois guardam qualquer tipo de valor.'],
        [
          'let só funciona dentro de funções',
          'let funciona em qualquer bloco; a diferença é a reatribuição.',
        ],
      ],
      'Reatribuir um const causa erro. Prefira const e use let só quando o valor precisar mudar.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique quando usar const e quando usar let.',
    modelo:
      'Uso const quando o valor não vai mudar depois de definido, o que torna o código mais seguro. Uso let quando preciso trocar o valor, como num contador que aumenta a cada volta de um laço.',
    rubrica: [
      'Disse que const é para valores que não mudam',
      'Disse que let é para valores que mudam',
      'Deu um exemplo (como um contador)',
    ],
  },
  resumo: [
    '`let` declara variável que muda; `const`, a que não muda (prefira const).',
    'Tipos básicos: number, string e boolean; `typeof` mostra o tipo.',
    '`console.log` mostra valores; crases com `${}` montam textos.',
    '`"5" + 5` vira "55": o + com texto concatena.',
  ],
  cards: [
    ['Qual a diferença entre let e const?', 'let permite reatribuir; const não.'],
    ['Quais são os tipos básicos?', 'number, string e boolean.'],
    ['Como montar um texto com variáveis?', 'Template string: `Olá, ${nome}!`'],
    ['Para que serve o console.log?', 'Mostrar valores na saída do console.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: variáveis e tipos são os mesmos conceitos do Portugol.',
      'HTML, CSS e a Web: JavaScript guarda em variáveis o que o usuário digita nos formulários.',
      'Python: usa a mesma ideia de variável, mas sem let nem const.',
    ],
    profissional:
      'Ler mensagens de erro como "Assignment to constant variable" é rotina de quem programa. Saber que significa tentar mudar um const economiza muito tempo de depuração.',
  },
});
