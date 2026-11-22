import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j05 = montar({
  id: 'javascript.m01.a05',
  titulo: 'Objetos e map, filter, reduce',
  objetivo: 'Representar coisas com objetos e transformar listas com map, filter e reduce.',
  pre: ['javascript.m01.a04'],
  min: 35,
  diag: mc(
    'Como acessar a propriedade nome do objeto pessoa?',
    'pessoa.nome',
    [
      ['pessoa[nome]', 'Sem aspas, nome seria entendido como uma variável.'],
      ['pessoa(nome)', 'Parênteses são para chamar funções.'],
    ],
    'Use a notação de ponto (`pessoa.nome`) ou colchetes com texto (`pessoa["nome"]`).',
  ),
  simples: {
    titulo: 'Fichas e linhas de montagem',
    texto:
      'Um **objeto** guarda dados relacionados com nomes: \n\n```\nconst produto = { nome: "Caneta", preco: 3 };\nconsole.log(produto.preco);\n```\n\nPara trabalhar com listas inteiras, os arrays têm métodos poderosos:\n\n- **map:** transforma cada elemento: `[1,2,3].map(n => n * 2)` → `[2,4,6]`\n- **filter:** mantém só os que passam num teste: `[1,2,3].filter(n => n > 1)` → `[2,3]`\n- **reduce:** junta tudo em um valor: `[1,2,3].reduce((a, n) => a + n, 0)` → `6`',
    essencial:
      'Objeto = propriedades nomeadas. map transforma, filter seleciona, reduce resume em um valor.',
    guiado:
      'Para escolher o método:\n1. Quer uma lista do mesmo tamanho, mudada? `map`.\n2. Quer uma lista menor, só com alguns? `filter`.\n3. Quer um único valor (soma, total)? `reduce`.',
    tecnico:
      'map, filter e reduce não alteram o array original: devolvem um novo valor. Recebem uma função (callback) que é chamada para cada elemento. No reduce, o segundo argumento é o valor inicial do acumulador. Objetos são referências: duas variáveis podem apontar para o mesmo objeto. Dados da web (JSON) têm exatamente a forma de objetos e arrays.',
  },
  analogia: {
    titulo: 'Linha de montagem',
    texto:
      'Imagine uma esteira com produtos. O **map** é uma máquina que pinta cada produto; o **filter** é o inspetor que tira os defeituosos; o **reduce** é quem empacota tudo e entrega uma caixa só. Cada objeto é a ficha técnica de um produto.',
    limites:
      'Em uma esteira real os produtos são alterados. Aqui, map e filter criam uma nova lista e o original permanece intacto.',
  },
  demo: {
    titulo: 'Transforme listas',
    instrucoes:
      'Execute. Depois altere os preços, filtre só os baratos (preco < 5) e some os preços com reduce.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const produtos = [\n  { nome: "Caneta", preco: 3 },\n  { nome: "Caderno", preco: 12 },\n  { nome: "Lápis", preco: 2 },\n];\nconst nomes = produtos.map(p => p.nome);\nconsole.log(nomes);\nconst baratos = produtos.filter(p => p.preco < 5);\nconsole.log(baratos.length);\nconst total = produtos.reduce((soma, p) => soma + p.preco, 0);\nconsole.log(total);',
    },
  },
  tecnica: {
    titulo: 'Os três métodos',
    texto:
      '**map(f):** nova lista com `f` aplicada a cada elemento (mesmo tamanho).\n**filter(f):** nova lista só com os elementos para os quais `f` devolve true.\n**reduce(f, inicial):** percorre acumulando; `f(acumulador, elemento)` devolve o novo acumulador.\n\n**Encadear:** `lista.filter(...).map(...)` lê-se da esquerda para a direita.\n\n**Objetos:** `obj.chave`, `obj.chave = valor` (altera), `Object.keys(obj)` (lista as chaves).',
  },
  diagrama: {
    titulo: 'Esteira de dados',
    nos: [
      { forma: 'inicio', texto: 'Lista de produtos (objetos)' },
      { forma: 'passo', texto: 'filter: mantém só os que interessam' },
      { forma: 'passo', texto: 'map: extrai ou transforma o que se precisa' },
      { forma: 'fim', texto: 'reduce: resume tudo em um valor (total, média...)' },
    ],
    descricao:
      'A lista passa por filter, depois map e por fim reduce, cada etapa recebendo a saída da anterior.',
  },
  exemplo: {
    titulo: 'Total do que passou no filtro',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const idades = [12, 25, 17, 30, 41];\nconst adultos = idades.filter(i => i >= 18);\nconst soma = adultos.reduce((a, i) => a + i, 0);\nconsole.log(adultos);\nconsole.log(soma);',
    },
    comentarios: [
      { linha: 2, texto: 'filter fica com 25, 30 e 41.' },
      { linha: 3, texto: 'reduce soma os adultos começando de 0.' },
      { linha: 5, texto: 'Mostra 96.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'console.log([1, 2, 3].map(n => n * 10));',
      ['[10,20,30]', '[10, 20, 30]'],
      'map multiplica cada elemento por 10 e devolve a nova lista.',
      [{ resposta: '60', feedback: 'map devolve uma lista; somar tudo seria papel do reduce.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'console.log([5, 12, 8, 20].filter(n => n > 10));',
      ['[12,20]', '[12, 20]'],
      'filter mantém só os elementos maiores que 10.',
      [{ resposta: '[5,8]', feedback: 'Esses são os que NÃO passam no teste.' }],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'const p = { nome: "Ana", idade: 20 };\np.idade = 21;\nconsole.log(p.idade);',
      ['21'],
      'A propriedade foi alterada para 21.',
      [{ resposta: '20', feedback: 'A atribuição p.idade = 21 troca o valor.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva somenteMaiores(lista, limite): devolve um novo array só com os números maiores que o limite.',
      'function somenteMaiores(lista, limite) {\n  // seu código aqui\n}',
      'function somenteMaiores(lista, limite) {\n  return lista.filter(n => n > limite);\n}',
      'somenteMaiores',
      [
        { argumentos: [[1, 5, 10], 4], esperado: [5, 10] },
        { argumentos: [[1, 2], 5], esperado: [] },
        { argumentos: [[7, 7, 3], 3], esperado: [7, 7] },
      ],
      [
        'filter recebe uma função que devolve true para os que ficam.',
        'A função é n => n > limite.',
      ],
      'filter cria uma nova lista com os elementos que passam no teste.',
    ),
  ],
  desafio: programaJs(
    'Escreva totalDoCarrinho(itens): cada item é { preco, quantidade }. Devolva a soma de preco × quantidade de todos os itens (carrinho vazio vale 0).',
    'function totalDoCarrinho(itens) {\n  // seu código aqui\n}',
    'function totalDoCarrinho(itens) {\n  return itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);\n}',
    'totalDoCarrinho',
    [
      {
        argumentos: [
          [
            { preco: 10, quantidade: 2 },
            { preco: 5, quantidade: 3 },
          ],
        ],
        esperado: 35,
      },
      { argumentos: [[{ preco: 4, quantidade: 1 }]], esperado: 4 },
      { argumentos: [[]], esperado: 0 },
    ],
    [
      'reduce com valor inicial 0.',
      'A cada item, some item.preco * item.quantidade ao acumulador.',
    ],
    'reduce percorre os itens acumulando o subtotal de cada um; o valor inicial 0 cobre o carrinho vazio.',
  ),
  rec: [
    mc(
      'Qual método devolve um único valor a partir de uma lista?',
      'reduce',
      [
        ['map', 'map devolve outra lista, do mesmo tamanho.'],
        ['filter', 'filter devolve uma lista, possivelmente menor.'],
      ],
      'reduce resume a lista inteira em um valor (soma, total, maior...).',
    ),
    mc(
      'O que o código mostra?',
      '[2,4]',
      [
        ['[1,2,3,4]', 'filter descarta os elementos que não passam no teste.'],
        ['2', 'filter devolve uma lista, não o primeiro elemento.'],
      ],
      'Só 2 e 4 têm resto 0 na divisão por 2.',
      0,
      { linguagem: 'javascript', fonte: 'console.log([1, 2, 3, 4].filter(n => n % 2 === 0));' },
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre map, filter e reduce.',
    modelo:
      'map transforma cada elemento e devolve uma lista do mesmo tamanho. filter mantém só os elementos que passam em um teste, devolvendo uma lista possivelmente menor. reduce percorre a lista acumulando e devolve um único valor, como uma soma.',
    rubrica: [
      'Disse que map transforma cada elemento',
      'Disse que filter seleciona elementos',
      'Disse que reduce resume em um único valor',
    ],
  },
  resumo: [
    'Objetos guardam dados com nomes: `produto.preco`.',
    '`map` transforma, `filter` seleciona, `reduce` resume.',
    'Esses métodos não alteram o array original.',
    'Dados de APIs web (JSON) são objetos e arrays.',
  ],
  cards: [
    ['Como acessar uma propriedade de um objeto?', 'obj.propriedade'],
    ['O que faz o map?', 'Transforma cada elemento e devolve uma nova lista.'],
    ['O que faz o filter?', 'Devolve só os elementos que passam no teste.'],
    ['O que faz o reduce?', 'Junta todos os elementos em um único valor.'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: filter e map lembram WHERE e SELECT do SQL; reduce lembra SUM e COUNT.',
      'Ciência de Dados: transformar listas de registros é a rotina da análise.',
      'HTML, CSS e a Web: respostas de APIs chegam como arrays de objetos.',
    ],
    profissional:
      'Em equipes de dados e web, encadear filter, map e reduce é uma forma clara e compacta de processar informações sem laços longos.',
  },
});
