import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const es04 = montar({
  id: 'engsoft.m01.a04',
  titulo: 'Requisitos e histórias de usuário',
  objetivo:
    'Transformar necessidades em requisitos claros e priorizar o backlog por valor e esforço.',
  pre: ['engsoft.m01.a03'],
  min: 30,
  diag: mc(
    'O cliente pede "um sistema rápido e bonito". Qual é o problema desse pedido?',
    'É vago: não dá para saber se está pronto ou testar',
    [
      ['É curto demais para ser anotado', 'O tamanho não é o problema, e sim a imprecisão.'],
      ['Pedidos de clientes nunca devem ser anotados', 'Anotar é essencial.'],
    ],
    'Requisito bom é claro e verificável.',
  ),
  simples: {
    titulo: 'Entender antes de construir',
    texto:
      '**Requisito** é o que o sistema deve fazer ou respeitar.\n\n- **Funcional:** o que faz ("o usuário pode redefinir a senha").\n- **Não funcional:** como se comporta (desempenho, segurança, acessibilidade, disponibilidade).\n\nNo ágil, os requisitos viram **histórias de usuário**:\n\n> **Como** *cliente*, **quero** *pagar com Pix*, **para** *concluir a compra mais rápido*.\n\nCada história tem **critérios de aceite** verificáveis ("o pagamento é confirmado em até 10 s").\n\nO backlog é **priorizado** por **valor** para o negócio e **esforço** de desenvolvimento. Uma regra simples: valor ÷ esforço.',
    essencial:
      'Requisitos funcionais e não funcionais. História de usuário: Como, quero, para. Critérios de aceite dizem quando está pronto. Priorize por valor e esforço.',
    guiado:
      'Para escrever uma boa história:\n1. Identifique quem (persona).\n2. Diga o que a pessoa quer.\n3. Explique o porquê (o valor).\n4. Escreva critérios de aceite mensuráveis.\n5. Quebre se for grande demais.',
    tecnico:
      'O acrônimo **INVEST** descreve boas histórias: Independente, Negociável, Valiosa, Estimável, Pequena (small) e Testável. A estimativa costuma usar **pontos** (sequência de Fibonacci) no **planning poker**. O **MVP** (produto mínimo viável) entrega só o essencial para validar a ideia. Técnicas de levantamento: entrevistas, observação, protótipos e questionários. Mudanças de requisito são normais: o importante é gerenciá-las e registrar o impacto.',
  },
  analogia: {
    titulo: 'Pedido no restaurante',
    texto:
      '"Quero algo gostoso" não ajuda o cozinheiro. "Uma massa sem glúten, até 40 minutos, para duas pessoas" ajuda. Requisito claro é um pedido que dá para preparar e conferir.',
    limites: 'Requisitos mudam durante o projeto; a clareza não elimina a conversa com o cliente.',
  },
  demo: {
    titulo: 'Priorizando o backlog',
    instrucoes:
      'Execute e veja a ordem por valor ÷ esforço. Altere os valores e veja a prioridade mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const historias = [\n  { nome: "Login", valor: 8, esforco: 2 },\n  { nome: "Relatórios", valor: 5, esforco: 5 },\n  { nome: "Pix", valor: 9, esforco: 3 },\n];\nconst ordenadas = [...historias].sort(\n  (a, b) => b.valor / b.esforco - a.valor / a.esforco\n);\nfor (const h of ordenadas) {\n  console.log(h.nome, (h.valor / h.esforco).toFixed(1));\n}',
    },
  },
  tecnica: {
    titulo: 'Requisitos não funcionais',
    texto:
      '**Desempenho:** "a página abre em até 2 s".\n**Segurança:** "senhas armazenadas com hash".\n**Acessibilidade:** "navegável só pelo teclado".\n**Disponibilidade:** "99,9% do tempo no ar".\nSão fáceis de esquecer e caros de consertar depois.',
  },
  diagrama: {
    titulo: 'Do desejo ao incremento',
    nos: [
      { forma: 'inicio', texto: 'Necessidade do usuário' },
      { forma: 'passo', texto: 'História de usuário com critérios de aceite' },
      { forma: 'passo', texto: 'Priorização no backlog' },
      { forma: 'fim', texto: 'Entrega de um incremento testado' },
    ],
    descricao: 'Cada história entregue gera valor.',
  },
  exemplo: {
    titulo: 'Uma história completa',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Como cliente, quero pagar com Pix,\npara concluir a compra mais rápido.\n\nCritérios de aceite:\n- O QR Code aparece em até 3 segundos.\n- O pedido muda para "pago" ao confirmar.\n- Se o Pix expirar, mostra uma mensagem clara.',
    },
    comentarios: [
      { linha: 1, texto: 'Quem e o quê.' },
      { linha: 2, texto: 'O valor para o usuário.' },
      { linha: 4, texto: 'Cada critério é verificável.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const itens = [\n  { n: "A", v: 6, e: 3 },\n  { n: "B", v: 4, e: 1 },\n];\nitens.sort((x, y) => y.v / y.e - x.v / x.e);\nconsole.log(itens[0].n);',
      ['B'],
      'B tem 4 de valor por esforço, contra 2 de A.',
      [{ resposta: 'A', feedback: 'A tem maior valor absoluto, mas a razão é menor.' }],
    ),
    mc(
      'Qual destes é um requisito NÃO funcional?',
      '"A página deve abrir em até 2 segundos"',
      [
        ['"O usuário pode cadastrar um produto"', 'Isso é uma funcionalidade.'],
        ['"O usuário pode excluir a conta"', 'Também é funcional.'],
      ],
      'Não funcional trata do "como".',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const razoes = [[8, 2], [9, 3], [5, 5]].map(([v, e]) => v / e);\nconsole.log(Math.max(...razoes));',
      ['4'],
      'A maior razão é 8 ÷ 2 = 4.',
      [{ resposta: '9', feedback: 'Divida o valor pelo esforço.' }],
    ),
    mc(
      'Para que servem os critérios de aceite?',
      'Dizer objetivamente quando a história está pronta',
      [
        [
          'Decidir qual pessoa do time vai escrever o código da história',
          'Isso é definido pelo time; o critério diz quando está pronto.',
        ],
        [
          'Substituir os testes automatizados, pois já descrevem o comportamento',
          'Eles orientam os testes, mas não os substituem.',
        ],
      ],
      'São verificáveis.',
    ),
  ],
  desafio: programaJs(
    'Escreva priorizar(historias): cada item é [nome, valor, esforco]. Devolva a lista de nomes ordenada pela razão valor/esforço, da maior para a menor. Em caso de empate, mantenha a ordem original.',
    'function priorizar(historias) {\n  // seu código aqui\n}',
    'function priorizar(historias) {\n  return [...historias]\n    .sort((a, b) => b[1] / b[2] - a[1] / a[2])\n    .map((h) => h[0]);\n}',
    'priorizar',
    [
      {
        argumentos: [
          [
            ['a', 8, 2],
            ['b', 5, 1],
            ['c', 3, 3],
          ],
        ],
        esperado: ['b', 'a', 'c'],
      },
      { argumentos: [[]], esperado: [] },
      {
        argumentos: [
          [
            ['x', 2, 1],
            ['y', 4, 2],
          ],
        ],
        esperado: ['x', 'y'],
      },
    ],
    ['Use sort com a razão valor/esforço.', 'Copie a lista antes de ordenar.'],
    'O sort do JavaScript é estável, então empates mantêm a ordem.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Requisito funcional', 'O que o sistema faz'],
        ['Requisito não funcional', 'Como o sistema se comporta'],
        ['Critério de aceite', 'Condição verificável para dar a história como pronta'],
        ['MVP', 'Versão mínima para validar a ideia'],
      ],
      'Vocabulário de requisitos.',
    ),
    completar(
      'Complete o modelo de história de usuário.',
      'Como cliente, ___ pagar com Pix, para concluir a compra mais rápido.',
      [{ aceitas: ['quero'], feedback: 'Como, quero, para.' }],
      'Esse é o formato clássico.',
    ),
  ],
  explique: {
    enunciado:
      'Explique a diferença entre requisito funcional e não funcional e dê um exemplo de cada.',
    modelo:
      'Requisito funcional descreve o que o sistema faz, como permitir que o usuário redefina a senha. Requisito não funcional descreve como ele se comporta, como abrir a página em até 2 segundos ou guardar senhas com hash. Ambos precisam ser claros e verificáveis.',
    rubrica: ['Definiu funcional', 'Definiu não funcional', 'Deu um exemplo de cada'],
  },
  resumo: [
    'Funcional = o quê; não funcional = como.',
    'História: Como, quero, para.',
    'Critérios de aceite são verificáveis.',
    'Priorize por valor ÷ esforço.',
  ],
  cards: [
    ['O que é uma história de usuário?', 'Necessidade escrita como Como, quero, para.'],
    ['O que é um MVP?', 'Versão mínima viável do produto.'],
    ['O que é INVEST?', 'Checklist de boas histórias.'],
    ['Dê um requisito não funcional.', 'Abrir a página em até 2 segundos.'],
  ],
  conexoes: {
    disciplinas: [
      'UX/UI Design: histórias nascem de pesquisa com usuários.',
      'Modelagem e Projeto de Bancos de Dados: requisitos de dados viram o modelo.',
      'Cibersegurança: segurança é requisito não funcional.',
    ],
    profissional: 'Boa parte dos projetos que falham tem a origem em requisitos mal entendidos.',
  },
});
