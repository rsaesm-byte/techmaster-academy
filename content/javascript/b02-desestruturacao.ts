import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j07 = montar({
  id: 'javascript.m02.a02',
  titulo: 'Desestruturação, spread e imutabilidade',
  objetivo:
    'Extrair valores de objetos e arrays, copiar e combinar dados com spread sem alterar o original.',
  pre: ['javascript.m01.a05'],
  min: 30,
  diag: mc(
    'O que os três pontos (...) fazem em [...lista]?',
    'Espalham os elementos da lista dentro de um novo array',
    [
      [
        'Apagam a lista original e criam uma vazia no lugar',
        'O spread copia os elementos; não apaga nada.',
      ],
      ['Ordenam os elementos da lista em ordem crescente', 'Ordenar é papel do sort.'],
    ],
    'O spread (`...`) "espalha" os elementos, o que permite copiar e combinar listas.',
  ),
  simples: {
    titulo: 'Abrir a caixa e pegar só o que interessa',
    texto:
      '**Desestruturação** extrai valores em uma linha:\n\n```\nconst { nome, idade } = pessoa;\nconst [primeiro, segundo] = lista;\n```\n\n**Spread** copia e combina:\n\n```\nconst copia = [...lista, 99];\nconst nova = { ...pessoa, idade: 21 };\n```\n\nIsso cria **novos** valores sem alterar os originais, o que se chama trabalhar de forma **imutável**.',
    essencial: 'Desestruturação extrai; spread copia e combina; ambos evitam mexer no original.',
    guiado:
      'Para atualizar um objeto sem alterá-lo:\n1. Faça `{ ...objeto }` para copiar.\n2. Depois do spread, escreva a propriedade nova: `{ ...objeto, idade: 21 }`.\n3. Guarde o resultado numa nova variável.',
    tecnico:
      'O spread faz cópia rasa: objetos aninhados continuam compartilhados. Em `{ ...a, x: 1 }` a ordem importa: o que vem depois sobrescreve. O operador rest (`...resto`) em parâmetros coleta argumentos em um array: `function soma(...nums)`. Imutabilidade facilita depurar e é padrão em bibliotecas como React.',
  },
  analogia: {
    titulo: 'Fotocópia com anotação',
    texto:
      'Spread é tirar uma fotocópia de um documento e anotar nela. O original fica intacto, e você trabalha na cópia. A desestruturação é pegar da pasta só as folhas de que precisa.',
    limites:
      'A fotocópia é "rasa": se o documento tem um envelope dentro, a cópia aponta para o mesmo envelope.',
  },
  demo: {
    titulo: 'Copie sem estragar',
    instrucoes:
      'Execute e compare original e cópia. Depois mude a ordem dentro das chaves e veja qual valor vence.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const pessoa = { nome: "Ana", idade: 20 };\nconst { nome } = pessoa;\nconsole.log(nome);\nconst mais = { ...pessoa, idade: 21 };\nconsole.log(pessoa.idade);\nconsole.log(mais.idade);\nconst a = [1, 2];\nconst b = [...a, 3];\nconsole.log(a);\nconsole.log(b);\nconst [x, y] = b;\nconsole.log(x + y);',
    },
  },
  tecnica: {
    titulo: 'Padrões comuns',
    texto:
      '**Valores padrão:** `const { cor = "azul" } = obj;`.\n**Renomear:** `const { nome: titulo } = obj;`.\n**Parâmetros:** `function f({ nome, idade }) { ... }`.\n**Juntar listas:** `[...a, ...b]`.\n**Juntar objetos:** `{ ...a, ...b }` (o último vence).\n**Remover item sem alterar:** `lista.filter(x => x !== alvo)`.',
  },
  diagrama: {
    titulo: 'Atualização imutável',
    nos: [
      { forma: 'inicio', texto: 'Objeto original' },
      { forma: 'passo', texto: 'Spread copia as propriedades para um objeto novo' },
      { forma: 'passo', texto: 'A propriedade alterada é escrita depois do spread' },
      { forma: 'fim', texto: 'Resultado: objeto novo; o original continua igual' },
    ],
    descricao: 'Copia-se com spread, sobrescreve-se o que mudou e guarda-se o novo objeto.',
  },
  exemplo: {
    titulo: 'Adicionar item sem alterar a lista',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const carrinho = ["pão", "leite"];\nconst novo = [...carrinho, "café"];\nconsole.log(carrinho.length);\nconsole.log(novo.length);',
    },
    comentarios: [
      { linha: 2, texto: 'O array novo contém os itens antigos mais "café".' },
      { linha: 3, texto: 'O original continua com 2 itens.' },
      { linha: 4, texto: 'Mostra 3.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'const [a, b] = [10, 20];\nconsole.log(b);',
      ['20'],
      'a recebe o primeiro, b o segundo.',
      [{ resposta: '10', feedback: 'b é o segundo elemento.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'const o = { x: 1 };\nconst p = { ...o, x: 5 };\nconsole.log(o.x);',
      ['1'],
      'O original não é alterado; só a cópia p tem x = 5.',
      [{ resposta: '5', feedback: 'A alteração foi feita na cópia, não em o.' }],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'console.log([...[1, 2], ...[3]]);',
      ['[1,2,3]', '[1, 2, 3]'],
      'O spread junta os elementos dos dois arrays.',
      [
        {
          resposta: '[[1,2],[3]]',
          feedback: 'Com spread os elementos entram soltos, sem aninhar.',
        },
      ],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva juntar(a, b): devolve um novo array com os elementos de a seguidos dos de b, sem alterar a nem b.',
      'function juntar(a, b) {\n  // seu código aqui\n}',
      'function juntar(a, b) {\n  return [...a, ...b];\n}',
      'juntar',
      [
        { argumentos: [[1, 2], [3]], esperado: [1, 2, 3] },
        { argumentos: [[], [9]], esperado: [9] },
        { argumentos: [[5], []], esperado: [5] },
      ],
      ['Dentro de [ ], use ...a e ...b.'],
      'O spread coloca os elementos de cada lista em um novo array.',
    ),
  ],
  desafio: programaJs(
    'Escreva trocarIdade(pessoa, idade): devolve um NOVO objeto igual a pessoa, mas com a idade trocada. Não altere o objeto recebido.',
    'function trocarIdade(pessoa, idade) {\n  // seu código aqui\n}',
    'function trocarIdade(pessoa, idade) {\n  return { ...pessoa, idade };\n}',
    'trocarIdade',
    [
      { argumentos: [{ nome: 'Ana', idade: 20 }, 21], esperado: { nome: 'Ana', idade: 21 } },
      {
        argumentos: [{ nome: 'Rick', idade: 30, cidade: 'Sorocaba' }, 31],
        esperado: { nome: 'Rick', idade: 31, cidade: 'Sorocaba' },
      },
    ],
    ['Copie com ...pessoa.', 'Escreva idade depois do spread para sobrescrever.'],
    'O spread copia as propriedades e a idade escrita depois substitui a antiga.',
  ),
  rec: [
    mc(
      'O que faz const { nome } = pessoa?',
      'Cria a variável nome com o valor de pessoa.nome',
      [
        [
          'Cria um objeto novo chamado nome a partir de pessoa',
          'A desestruturação cria uma variável com o valor da propriedade.',
        ],
        [
          'Apaga a propriedade nome do objeto pessoa',
          'Nada é apagado: o valor é copiado para uma variável.',
        ],
      ],
      'Desestruturação extrai propriedades para variáveis.',
    ),
    mc(
      'Qual das opções copia um array sem alterar o original?',
      '[...lista]',
      [
        ['lista.push()', 'push altera o array original.'],
        ['lista = lista', 'Isso só aponta para o mesmo array.'],
      ],
      'O spread cria um array novo com os mesmos elementos.',
      0,
    ),
  ],
  explique: {
    enunciado: 'Explique por que é útil atualizar dados sem alterar o original.',
    modelo:
      'Quando se cria uma cópia em vez de alterar o original, outras partes do programa que usam o original não são afetadas por surpresa. Isso facilita encontrar erros e prever o comportamento.',
    rubrica: [
      'Citou criar uma cópia',
      'Citou evitar efeitos inesperados',
      'Citou facilitar depuração ou previsibilidade',
    ],
  },
  resumo: [
    'Desestruturação extrai valores de objetos e arrays.',
    'Spread (`...`) copia e combina.',
    'Copiar e sobrescrever evita alterar o original.',
    'O spread faz cópia rasa.',
  ],
  cards: [
    ['O que é desestruturação?', 'Extrair valores de objetos ou arrays em variáveis.'],
    ['O que faz o spread?', 'Espalha elementos ou propriedades para copiar e combinar.'],
    ['Como atualizar um objeto sem alterar o original?', '{ ...obj, campo: novo }'],
    ['O spread copia de forma profunda?', 'Não, é cópia rasa.'],
  ],
  conexoes: {
    disciplinas: [
      'HTML, CSS e a Web: React exige atualizar estados de forma imutável.',
      'Python: tem recurso parecido (*lista e **dicionário).',
      'Engenharia de Dados: transformar dados criando novas versões evita corromper a origem.',
    ],
    profissional:
      'Código imutável é padrão em frameworks modernos e diminui erros difíceis de achar.',
  },
});
