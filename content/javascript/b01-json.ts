import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j06 = montar({
  id: 'javascript.m02.a01',
  titulo: 'JSON: o formato dos dados da web',
  objetivo: 'Converter objetos em texto JSON e de volta com JSON.stringify e JSON.parse.',
  pre: ['javascript.m01.a05'],
  min: 30,
  diag: mc(
    'O que é JSON?',
    'Um formato de texto para representar dados (objetos, listas, números, textos)',
    [
      [
        'Uma linguagem de programação baseada em JavaScript, usada em servidores',
        'JSON é só um formato de texto, sem lógica.',
      ],
      ['Um banco de dados leve que roda dentro do navegador', 'JSON é um formato, não um banco.'],
    ],
    'JSON (JavaScript Object Notation) é texto com regras simples. Quase toda API da web o usa.',
  ),
  simples: {
    titulo: 'Dados viajando como texto',
    texto:
      'Para enviar dados pela rede, eles viram **texto**. O formato mais usado é o **JSON**, parecido com objetos JavaScript, mas com regras mais rígidas: chaves entre aspas duplas e sem funções.\n\n```\nconst obj = { nome: "Ana", idade: 20 };\nconst texto = JSON.stringify(obj); // \'{"nome":"Ana","idade":20}\'\nconst volta = JSON.parse(texto);   // objeto de novo\n```\n\n- **stringify:** objeto → texto.\n- **parse:** texto → objeto.',
    essencial: 'JSON é texto. stringify transforma objeto em texto; parse faz o caminho inverso.',
    guiado:
      'Para ler dados de uma resposta:\n1. Receba o texto JSON.\n2. Use `JSON.parse(texto)`.\n3. Acesse as propriedades com ponto.\n4. Para enviar, use `JSON.stringify(objeto)`.',
    tecnico:
      'JSON aceita objetos, arrays, strings, números, booleanos e null. Não aceita undefined, funções nem comentários. Chaves e strings usam aspas duplas. JSON.parse lança erro (SyntaxError) se o texto for inválido, por isso se usa try/catch em dados externos.',
  },
  analogia: {
    titulo: 'Mudança empacotada',
    texto:
      'Para mandar móveis pelo correio você os desmonta e coloca em caixas (stringify); quem recebe remonta (parse). O JSON é a caixa padrão que todo mundo sabe abrir, não importa a linguagem de cada lado.',
    limites: 'Algumas coisas não cabem na caixa: funções, por exemplo, somem no empacotamento.',
  },
  demo: {
    titulo: 'Ida e volta',
    instrucoes:
      'Execute. Depois adicione campos ao objeto e quebre o JSON (troque aspas duplas por simples) para ver o erro.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const aluno = { nome: "Ana", notas: [8, 9], ativo: true };\nconst texto = JSON.stringify(aluno);\nconsole.log(texto);\nconsole.log(typeof texto);\nconst volta = JSON.parse(texto);\nconsole.log(volta.notas[1]);\nconsole.log(JSON.parse("[1,2,3]").length);',
    },
  },
  tecnica: {
    titulo: 'Regras do JSON',
    texto:
      '**Válido:** `{"nome":"Ana","idade":20}`.\n**Inválido:** `{nome: \'Ana\'}` (sem aspas duplas).\n**Aninhar:** objetos e arrays podem conter outros.\n**Ler:** `dados.itens[0].preco`.\n**Copiar objeto:** `JSON.parse(JSON.stringify(obj))` faz uma cópia profunda simples.',
  },
  diagrama: {
    titulo: 'Caminho dos dados',
    nos: [
      { forma: 'inicio', texto: 'Objeto no programa' },
      { forma: 'passo', texto: 'JSON.stringify gera o texto' },
      { forma: 'passo', texto: 'O texto viaja pela rede ou é salvo' },
      { forma: 'fim', texto: 'JSON.parse recria o objeto do outro lado' },
    ],
    descricao: 'O objeto vira texto, viaja ou é salvo, e é reconstruído com parse.',
  },
  exemplo: {
    titulo: 'Ler uma resposta',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const resposta = \'{"produto":"Caneta","preco":3.5}\';\nconst dados = JSON.parse(resposta);\nconsole.log(dados.produto);\nconsole.log(dados.preco * 2);',
    },
    comentarios: [
      { linha: 2, texto: 'parse transforma o texto em objeto.' },
      { linha: 3, texto: 'Mostra: Caneta.' },
      { linha: 4, texto: 'Mostra 7.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'console.log(typeof JSON.stringify({ a: 1 }));',
      ['string'],
      'stringify sempre devolve texto.',
      [{ resposta: 'object', feedback: 'O resultado é o TEXTO do JSON.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece no console?',
      'console.log(JSON.parse("[4,5,6]")[1]);',
      ['5'],
      'parse gera o array [4,5,6]; o índice 1 é 5.',
      [{ resposta: '4', feedback: 'O índice 1 é o segundo elemento.' }],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'console.log(JSON.stringify({ nome: "Ana" }));',
      ['{"nome":"Ana"}'],
      'O JSON usa aspas duplas nas chaves, sem espaços.',
      [{ resposta: '{nome:"Ana"}', feedback: 'No JSON as chaves também vão entre aspas duplas.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva lerNome(texto): recebe um texto JSON com um objeto que tem a propriedade nome e devolve esse nome.',
      'function lerNome(texto) {\n  // seu código aqui\n}',
      'function lerNome(texto) {\n  return JSON.parse(texto).nome;\n}',
      'lerNome',
      [
        { argumentos: ['{"nome":"Ana","idade":20}'], esperado: 'Ana' },
        { argumentos: ['{"idade":9,"nome":"Rick"}'], esperado: 'Rick' },
      ],
      ['Use JSON.parse para virar objeto.', 'Depois acesse .nome.'],
      'parse transforma o texto em objeto; então a propriedade é lida normalmente.',
    ),
  ],
  desafio: programaJs(
    'Escreva somarPrecos(texto): o texto JSON é um array de objetos { "preco": número }. Devolva a soma dos preços.',
    'function somarPrecos(texto) {\n  // seu código aqui\n}',
    'function somarPrecos(texto) {\n  const itens = JSON.parse(texto);\n  return itens.reduce((s, i) => s + i.preco, 0);\n}',
    'somarPrecos',
    [
      { argumentos: ['[{"preco":2},{"preco":3}]'], esperado: 5 },
      { argumentos: ['[]'], esperado: 0 },
      { argumentos: ['[{"preco":10.5}]'], esperado: 10.5 },
    ],
    ['Primeiro faça o parse.', 'Depois some com reduce começando em 0.'],
    'parse devolve o array; reduce soma os preços.',
  ),
  rec: [
    mc(
      'Qual destes é um JSON válido?',
      '{"a": 1}',
      [
        ['{a: 1}', 'No JSON as chaves precisam de aspas duplas.'],
        ["{'a': 1}", 'Aspas simples não são aceitas no JSON.'],
      ],
      'Chaves e textos usam aspas duplas.',
    ),
    mc(
      'Para transformar um objeto em texto JSON, usa-se:',
      'JSON.stringify',
      [
        ['JSON.parse', 'parse faz o caminho inverso.'],
        ['JSON.text', 'Esse método não existe.'],
      ],
      'stringify: objeto → texto.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre JSON.stringify e JSON.parse.',
    modelo:
      'stringify transforma um objeto em texto JSON, usado para enviar ou salvar dados. parse faz o contrário: lê um texto JSON e recria o objeto.',
    rubrica: [
      'Disse que stringify gera texto',
      'Disse que parse gera objeto a partir de texto',
      'Citou envio ou armazenamento de dados',
    ],
  },
  resumo: [
    'JSON é um formato de texto para dados.',
    'stringify: objeto → texto; parse: texto → objeto.',
    'Chaves e textos usam aspas duplas.',
    'JSON não guarda funções.',
  ],
  cards: [
    ['O que é JSON?', 'Formato de texto para representar dados.'],
    ['O que faz JSON.parse?', 'Converte texto JSON em objeto.'],
    ['O que faz JSON.stringify?', 'Converte objeto em texto JSON.'],
    ['Que aspas o JSON exige?', 'Aspas duplas.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação (DNS e HTTP): respostas de APIs chegam como JSON.',
      'Modelagem e Projeto de Bancos de Dados: bancos como o MongoDB guardam documentos parecidos com JSON.',
      'Python: o módulo json faz o mesmo que parse e stringify.',
    ],
    profissional:
      'Integrar sistemas é, em boa parte, ler e escrever JSON. Entender o formato evita muitos erros de integração.',
  },
});
