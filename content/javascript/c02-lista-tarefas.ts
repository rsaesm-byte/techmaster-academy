import { completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const j12 = montar({
  id: 'javascript.m03.a02',
  titulo: 'Projeto: lista de tarefas na tela',
  objetivo: 'Conectar o estado ao DOM: desenhar a lista, adicionar e concluir tarefas com eventos.',
  pre: ['javascript.m03.a01', 'javascript.m02.a03'],
  min: 40,
  diag: mc(
    'Qual é o papel da função renderizar em um app simples?',
    'Desenhar na tela o que está no estado',
    [
      ['Alterar o estado conforme as ações do usuário', 'Quem altera o estado são os eventos.'],
      ['Salvar os dados do estado em um servidor', 'Isso é feito por outro código, como fetch.'],
    ],
    'renderizar lê o estado e atualiza o DOM.',
  ),
  simples: {
    titulo: 'Estado → tela, sempre no mesmo caminho',
    texto:
      'O padrão é sempre o mesmo:\n\n```\nlet tarefas = [];\n\nfunction renderizar() {\n  lista.innerHTML = "";\n  for (const t of tarefas) {\n    const li = document.createElement("li");\n    li.textContent = t.texto;\n    lista.append(li);\n  }\n}\n\nbotao.addEventListener("click", () => {\n  tarefas = adicionar(tarefas, campo.value);\n  renderizar();\n});\n```\n\nO evento chama a função pura, guarda o novo estado e **renderiza de novo**.',
    essencial: 'Evento → função pura gera novo estado → renderizar() redesenha a lista.',
    guiado:
      'Para montar:\n1. HTML: campo, botão e `<ul>`.\n2. Variável `tarefas` e função `renderizar`.\n3. Evento do botão chama `adicionar` e `renderizar`.\n4. Para concluir, outro evento chama `concluir`.',
    tecnico:
      'Para texto do usuário use textContent, nunca innerHTML (evita XSS). `lista.innerHTML = ""` só limpa; ao criar itens por createElement, o conteúdo entra como texto seguro. Frameworks como React automatizam essa etapa de redesenho calculando só o que mudou.',
  },
  analogia: {
    titulo: 'Quadro-branco',
    texto:
      'A cada mudança você apaga o quadro e reescreve a lista inteira a partir da planilha (estado). Parece trabalhoso, mas é simples e nunca deixa a tela fora de sincronia com os dados.',
    limites: 'Redesenhar tudo é caro em telas enormes; por isso existem técnicas mais refinadas.',
  },
  demo: {
    titulo: 'Monte o app no editor web',
    instrucoes:
      'No editor web, cole um HTML com `<input id="c">`, `<button id="b">Adicionar</button>`, `<ul id="l"></ul>` e um script que, ao clicar, adiciona o texto do campo a um array e redesenha a lista. Depois acrescente o botão de concluir.',
    simulacao: { tipo: 'web' },
  },
  tecnica: {
    titulo: 'Detalhes da montagem',
    texto:
      '**Criar item:** `createElement("li")`.\n**Texto seguro:** `li.textContent = t.texto`.\n**Estilo para concluída:** `li.classList.toggle("feita", t.feita)`.\n**Evento em item:** `li.addEventListener("click", () => ...)` dentro do laço.\n**Limpar campo:** `campo.value = ""`.',
  },
  diagrama: {
    titulo: 'Ciclo de uma ação',
    nos: [
      { forma: 'inicio', texto: 'Clique em Adicionar' },
      { forma: 'passo', texto: 'adicionar(tarefas, texto) devolve novo estado' },
      { forma: 'passo', texto: 'tarefas = novo estado' },
      { forma: 'fim', texto: 'renderizar() redesenha a lista' },
    ],
    descricao: 'O clique gera novo estado, que é guardado e usado para redesenhar a lista.',
  },
  exemplo: {
    titulo: 'Renderizar com classe CSS',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function renderizar() {\n  lista.textContent = "";\n  for (const t of tarefas) {\n    const li = document.createElement("li");\n    li.textContent = t.texto;\n    li.classList.toggle("feita", t.feita);\n    lista.append(li);\n  }\n}',
    },
    comentarios: [
      { linha: 2, texto: 'Esvazia a lista antes de redesenhar.' },
      { linha: 6, texto: 'Adiciona a classe "feita" só nas concluídas.' },
    ],
  },
  guiado: [
    ordenar(
      'Ordene o que acontece ao clicar em Adicionar.',
      [
        'O evento de clique dispara',
        'A função pura devolve o novo estado',
        'O estado é guardado na variável',
        'renderizar() redesenha a lista',
      ],
      'Ação, novo estado, guardar e desenhar.',
    ),
    mc(
      'Por que usar textContent ao exibir o que o usuário digitou?',
      'Porque trata tudo como texto puro, evitando injeção de código',
      [
        [
          'Porque é a única forma que o navegador oferece para mudar texto',
          'Há outras formas; o textContent é a segura.',
        ],
        [
          'Porque o resultado visual na página fica mais bonito',
          'O motivo é a segurança contra injeção de código.',
        ],
      ],
      'innerHTML interpretaria HTML malicioso.',
    ),
  ],
  indep: [
    completar(
      'Complete a criação de um item de lista.',
      'const li = document.___("li");\nli.___ = "Estudar";\nlista.append(li);',
      [
        { aceitas: ['createElement'], feedback: 'createElement cria o elemento.' },
        { aceitas: ['textContent'], feedback: 'textContent define o texto com segurança.' },
      ],
      'createElement cria; textContent coloca o texto.',
      'javascript',
    ),
    prever(
      'Quantos itens a lista terá na tela?',
      'const tarefas = ["a", "b", "c"];\nfor (const t of tarefas) {\n  const li = document.createElement("li");\n  lista.append(li);\n}',
      ['3'],
      'Um item é criado por tarefa: 3.',
      [{ resposta: '1', feedback: 'O laço cria um li para cada elemento.' }],
      [],
      'javascript',
    ),
  ],
  desafio: completar(
    'Complete o evento que adiciona a tarefa digitada e redesenha.',
    'botao.addEventListener("click", () => {\n  tarefas = ___(tarefas, campo.value);\n  ___();\n});',
    [
      { aceitas: ['adicionar'], feedback: 'Use a função pura adicionar.' },
      { aceitas: ['renderizar'], feedback: 'renderizar redesenha a lista.' },
    ],
    'O evento atualiza o estado e redesenha a tela.',
    'javascript',
  ),
  rec: [
    mc(
      'O que torna a tela sempre coerente com os dados?',
      'Redesenhar a partir do estado a cada mudança',
      [
        ['Alterar a tela e os dados separadamente', 'Isso facilita divergências.'],
        ['Evitar eventos', 'Eventos são necessários para reagir.'],
      ],
      'A tela é função do estado.',
    ),
    mc(
      'Onde fica o estado neste app?',
      'Na variável tarefas, fora do DOM',
      [
        [
          'Dentro dos elementos <li>, onde cada tarefa aparece',
          'Os elementos só mostram o estado; ele fica na variável.',
        ],
        ['No CSS, junto das regras de cor e de layout', 'O CSS cuida da aparência, não dos dados.'],
      ],
      'O DOM só reflete o estado.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Descreva o ciclo evento → estado → tela em um app de tarefas.',
    modelo:
      'Quando o usuário clica, o evento chama uma função pura que devolve o novo estado. O app guarda esse estado e chama renderizar, que limpa a lista e a recria a partir dos dados, mantendo tela e estado em sincronia.',
    rubrica: ['Citou o evento', 'Citou o novo estado por função pura', 'Citou o redesenho da tela'],
  },
  resumo: [
    'Evento → novo estado → renderizar().',
    'createElement e textContent montam a lista com segurança.',
    'O estado fica numa variável, não no DOM.',
    'A tela é redesenhada a partir dos dados.',
  ],
  cards: [
    ['Qual o ciclo do app?', 'Evento, novo estado, renderizar.'],
    ['Como criar um item na tela?', 'createElement + textContent + append'],
    ['Onde fica o estado?', 'Em uma variável de dados, não no DOM.'],
    ['Por que textContent?', 'Segurança contra XSS.'],
  ],
  conexoes: {
    disciplinas: [
      'React: faz esse redesenho automaticamente.',
      'Segurança: evitar innerHTML com dados do usuário previne XSS.',
      'Design de interfaces: estados como "concluída" mudam o visual.',
    ],
    profissional:
      'Esse padrão é a essência de qualquer interface moderna, de um formulário a um app inteiro.',
  },
});
