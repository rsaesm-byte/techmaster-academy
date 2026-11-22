import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ux02 = montar({
  id: 'ux.m01.a02',
  titulo: 'Usabilidade e arquitetura da informação',
  objetivo:
    'Aplicar as heurísticas de Nielsen e organizar conteúdo e navegação para que as pessoas achem o que procuram.',
  pre: ['ux.m01.a01'],
  min: 30,
  diag: mc(
    'Você clica em "Salvar" e nada acontece, sem aviso. O que a interface deixou de fazer?',
    'Dar feedback sobre o que está acontecendo',
    [
      [
        'Usar uma cor de destaque mais bonita no botão de salvar',
        'O problema é de comunicação do estado, não de beleza.',
      ],
      [
        'Ocupar mais espaço na tela com um botão maior e mais visível',
        'O tamanho do botão não informa que a ação foi concluída.',
      ],
    ],
    'Visibilidade do estado do sistema.',
  ),
  simples: {
    titulo: 'Fácil de usar e de achar',
    texto:
      '**Usabilidade** é a facilidade de usar o produto. As **10 heurísticas de Nielsen** são regras práticas. Algumas das mais importantes:\n\n- **Visibilidade do estado:** mostre o que está acontecendo (carregando, salvo).\n- **Correspondência com o mundo real:** use a linguagem do usuário.\n- **Controle e liberdade:** permita desfazer e voltar.\n- **Consistência:** o mesmo gesto, o mesmo resultado.\n- **Prevenção de erros:** evite que o erro aconteça (confirmações, restrições).\n- **Reconhecer em vez de lembrar:** deixe as opções visíveis.\n- **Mensagens de erro claras:** diga o que houve e como resolver.\n\n**Arquitetura da informação (AI)** organiza o conteúdo: **rótulos** claros, **hierarquia** lógica, **navegação** previsível. Uma boa organização reduz a **profundidade**: quantos cliques até chegar ao destino.',
    essencial:
      'Siga as heurísticas de Nielsen: feedback, linguagem familiar, desfazer, consistência, prevenção de erros. Organize a informação com rótulos claros e pouca profundidade.',
    guiado:
      'Para revisar uma tela:\n1. Há feedback para cada ação?\n2. Dá para desfazer?\n3. Os rótulos são claros?\n4. As mensagens de erro ajudam?\n5. Quantos cliques até as tarefas principais?',
    tecnico:
      'A **avaliação heurística** é feita por especialistas, sem usuários, para achar problemas cedo. A **classificação de cartões** (card sorting) mostra como os usuários agrupam conteúdos; o **teste de árvore** (tree testing) valida a estrutura da navegação. As **leis de UX** ajudam: **Lei de Fitts** (alvos maiores e próximos são mais fáceis), **Lei de Hick** (mais opções, mais tempo para decidir) e **Lei de Miller** (cerca de 7 itens na memória de curto prazo). A "regra dos 3 cliques" é um mito útil: mais importante que a contagem é o usuário sentir que está no caminho certo (cheiro da informação).',
  },
  analogia: {
    titulo: 'Supermercado bem sinalizado',
    texto:
      'Placas claras, corredores por categoria e produtos parecidos juntos fazem você achar o que quer rapidamente. Em um supermercado bagunçado, você desiste ou compra a coisa errada.',
    limites:
      'Um site tem muito mais caminhos que um supermercado, então a navegação precisa ser ainda mais cuidadosa.',
  },
  demo: {
    titulo: 'Medindo a profundidade do menu',
    instrucoes:
      'Execute e veja quantos níveis o menu tem. Mude a estrutura e perceba como a profundidade cresce.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const menu = {\n  Início: {},\n  Produtos: { Notebooks: {}, Celulares: { Android: {}, iPhone: {} } },\n  Suporte: {},\n};\nfunction profundidade(no) {\n  let max = 0;\n  for (const k in no) {\n    max = Math.max(max, 1 + profundidade(no[k]));\n  }\n  return max;\n}\nconsole.log("Profundidade:", profundidade(menu));',
    },
  },
  tecnica: {
    titulo: 'Mensagem de erro boa e ruim',
    texto:
      '**Ruim:** "Erro 500."\n**Boa:** "Não foi possível salvar. Verifique sua conexão e tente novamente."\nUma boa mensagem diz **o que houve**, **por quê** e **o que fazer**, sem culpar o usuário.',
  },
  diagrama: {
    titulo: 'Do rótulo ao destino',
    nos: [
      { forma: 'inicio', texto: 'O usuário tem um objetivo' },
      { forma: 'passo', texto: 'Lê os rótulos do menu' },
      { forma: 'decisao', texto: 'O rótulo parece levar ao objetivo?' },
      { forma: 'fim', texto: 'Sim: avança. Não: volta e tenta outro, ou desiste' },
    ],
    descricao: 'Rótulos claros reduzem as voltas.',
  },
  exemplo: {
    titulo: 'Checklist rápido',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Feedback: ao clicar em Salvar, aparece "Salvo!"\nDesfazer: existe o botão Desfazer por 5 segundos\nErro: "Senha precisa de 8 caracteres" aparece perto do campo\nRótulo: "Meus pedidos" em vez de "Histórico de transações"',
    },
    comentarios: [
      { linha: 1, texto: 'Estado do sistema visível.' },
      { linha: 2, texto: 'Controle e liberdade.' },
      { linha: 3, texto: 'Erro claro e no lugar certo.' },
      { linha: 4, texto: 'Linguagem do usuário.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'function prof(no) {\n  let max = 0;\n  for (const k in no) {\n    max = Math.max(max, 1 + prof(no[k]));\n  }\n  return max;\n}\nconsole.log(prof({ a: { b: { c: {} } }, d: {} }));',
      ['3'],
      'O caminho a, b, c tem 3 níveis.',
      [{ resposta: '2', feedback: 'Conte os três níveis de a até c.' }],
    ),
    mc(
      'Qual heurística pede que a interface mostre que algo está carregando?',
      'Visibilidade do estado do sistema',
      [
        [
          'Consistência e padrões, que mantêm o mesmo comportamento em todas as telas',
          'Essa trata de repetir o comportamento; o feedback é outra heurística.',
        ],
        [
          'Estética minimalista, que remove tudo o que não é essencial na tela',
          'Essa trata de reduzir o supérfluo, não de mostrar o estado.',
        ],
      ],
      'Feedback constante.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'function prof(no) {\n  let max = 0;\n  for (const k in no) {\n    max = Math.max(max, 1 + prof(no[k]));\n  }\n  return max;\n}\nconsole.log(prof({ x: {}, y: {} }));',
      ['1'],
      'Os dois itens estão no primeiro nível.',
      [{ resposta: '2', feedback: 'Não há itens dentro de x ou y.' }],
    ),
    mc(
      'O que a Lei de Hick afirma?',
      'Quanto mais opções, mais tempo para decidir',
      [
        ['Alvos maiores são mais fáceis de clicar', 'Essa é a Lei de Fitts.'],
        ['Usuários lembram apenas 3 itens', 'Não é essa a lei.'],
      ],
      'Menos opções, decisões mais rápidas.',
    ),
  ],
  desafio: programaJs(
    'Escreva cliquesAte(menu, alvo): o menu é um objeto aninhado (cada chave é um item e o valor são os subitens). Devolva em quantos cliques chega ao alvo (item do primeiro nível = 1 clique) ou -1 se não existir.',
    'function cliquesAte(menu, alvo) {\n  // seu código aqui\n}',
    'function cliquesAte(menu, alvo) {\n  for (const nome in menu) {\n    if (nome === alvo) return 1;\n    const dentro = cliquesAte(menu[nome], alvo);\n    if (dentro !== -1) return dentro + 1;\n  }\n  return -1;\n}',
    'cliquesAte',
    [
      {
        argumentos: [{ Início: {}, Produtos: { Notebooks: {}, Celulares: {} } }, 'Notebooks'],
        esperado: 2,
      },
      { argumentos: [{ Início: {}, Produtos: { Notebooks: {} } }, 'Início'], esperado: 1 },
      { argumentos: [{ Início: {} }, 'X'], esperado: -1 },
    ],
    ['A recursão explora os subitens.', 'Some 1 ao resultado vindo do nível de baixo.'],
    'Estruturas aninhadas pedem recursão.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Heurística de Nielsen', 'Regra prática para avaliar usabilidade'],
        ['Card sorting', 'Usuários agrupam conteúdos em categorias'],
        ['Lei de Hick', 'Mais opções, mais tempo de decisão'],
        ['Lei de Fitts', 'Alvos maiores e próximos são mais fáceis de acertar'],
      ],
      'Conceitos de usabilidade.',
    ),
    completar(
      'Complete: a heurística que permite voltar atrás.',
      'Dar ao usuário controle e ___, como desfazer.',
      [{ aceitas: ['liberdade'], feedback: 'Controle e liberdade do usuário.' }],
      'Desfazer é essencial.',
    ),
  ],
  explique: {
    enunciado:
      'Cite três heurísticas de Nielsen e explique como uma boa mensagem de erro as aplica.',
    modelo:
      'Três heurísticas: visibilidade do estado do sistema, prevenção de erros e mensagens de erro claras. Uma boa mensagem diz o que houve, por que e o que fazer, em linguagem do usuário, e fica perto do problema. Assim o usuário entende o estado e consegue se recuperar.',
    rubrica: [
      'Citou três heurísticas',
      'Descreveu uma boa mensagem de erro',
      'Relacionou a mensagem às heurísticas',
    ],
  },
  resumo: [
    'Siga as heurísticas de Nielsen.',
    'Rótulos claros e hierarquia lógica.',
    'Menos opções, decisão mais rápida (Hick).',
    'Mensagem de erro: o quê, por quê e o que fazer.',
  ],
  cards: [
    ['Quantas são as heurísticas de Nielsen?', 'Dez.'],
    ['O que é card sorting?', 'Técnica em que usuários agrupam conteúdos.'],
    ['O que diz a Lei de Fitts?', 'Alvos maiores e próximos são mais fáceis.'],
    ['O que é arquitetura da informação?', 'Organização de conteúdo e navegação.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica de Programação: estruturas em árvore e recursão.',
      'HTML, CSS e a Web: navegação com HTML semântico.',
      'Engenharia de Software: critérios de aceite de usabilidade.',
    ],
    profissional:
      'Pequenos ajustes de rótulos e de navegação costumam aumentar muito as conversões.',
  },
});
