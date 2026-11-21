import { completar, mc, montar, prever } from '../fundamentos/montar';

export const j08 = montar({
  id: 'javascript.m02.a03',
  titulo: 'DOM e eventos: dando vida à página',
  objetivo:
    'Selecionar elementos com querySelector, alterar textos e reagir a cliques com addEventListener.',
  pre: ['javascript.m02.a01'],
  min: 35,
  diag: mc(
    'O que é o DOM?',
    'A representação da página como uma árvore de elementos que o JavaScript pode ler e alterar',
    [
      ['Um tipo de banco de dados', 'O DOM é a árvore de elementos da página.'],
      ['Um navegador', 'O navegador cria o DOM; ele não é o DOM.'],
    ],
    'O navegador transforma o HTML em uma árvore de objetos, o DOM. O JavaScript mexe nela.',
  ),
  simples: {
    titulo: 'A página como um mapa mexível',
    texto:
      'Quando o navegador lê o HTML, monta uma **árvore** de elementos chamada **DOM**. O JavaScript consegue **encontrar** um elemento, **mudar** seu conteúdo e **reagir** a ações do usuário (eventos).\n\n```\nconst botao = document.querySelector("#botao");\nconst texto = document.querySelector("#texto");\nbotao.addEventListener("click", () => {\n  texto.textContent = "Clicou!";\n});\n```\n\n- **querySelector:** acha um elemento por seletor CSS.\n- **textContent:** o texto do elemento.\n- **addEventListener:** "quando X acontecer, execute esta função".',
    essencial:
      'DOM = árvore da página. querySelector acha; textContent altera o texto; addEventListener reage a eventos.',
    guiado:
      'Para um botão que muda um texto:\n1. Dê `id` aos elementos no HTML.\n2. Ache-os com `document.querySelector("#id")`.\n3. Registre `addEventListener("click", função)`.\n4. Dentro da função, altere `textContent`.',
    tecnico:
      'O script só encontra elementos que já existem; por isso fica no fim do body ou usa `defer`. Eventos "borbulham": um clique em um filho também chega aos pais (event bubbling). Prefira textContent a innerHTML para texto do usuário, pois innerHTML interpreta HTML e abre brecha para ataques XSS.',
  },
  analogia: {
    titulo: 'Controle remoto da casa',
    texto:
      'O DOM é a planta da casa com cada cômodo e objeto catalogado. querySelector é apontar para um objeto da planta; textContent é trocar a etiqueta dele; addEventListener é instalar uma campainha que, quando tocada, executa uma ação.',
    limites: 'Na planta nada se mexe sozinho; no DOM, qualquer mudança aparece na hora na tela.',
  },
  demo: {
    titulo: 'Escreva no editor web',
    instrucoes:
      'No editor web, cole o código abaixo no HTML e clique em executar: `<button id="b">Clique</button> <p id="t">Esperando...</p> <script> document.querySelector("#b").addEventListener("click", () => { document.querySelector("#t").textContent = "Clicou!"; }); </script>`. Depois troque o texto e o evento.',
    simulacao: { tipo: 'web' },
  },
  tecnica: {
    titulo: 'Seleção e eventos',
    texto:
      '**Seletores:** `#id`, `.classe`, `tag`.\n**Vários:** `querySelectorAll(".item")` devolve uma lista.\n**Eventos comuns:** `click`, `input`, `submit`, `keydown`.\n**Ler campo:** `campo.value`.\n**Classe:** `elemento.classList.toggle("ativo")`.\n**Criar:** `document.createElement("li")` + `lista.append(li)`.',
  },
  diagrama: {
    titulo: 'Fluxo de um clique',
    nos: [
      { forma: 'inicio', texto: 'Usuário clica no botão' },
      { forma: 'passo', texto: 'O navegador dispara o evento click' },
      { forma: 'passo', texto: 'A função registrada com addEventListener executa' },
      { forma: 'fim', texto: 'A função altera o DOM e a tela atualiza' },
    ],
    descricao:
      'O clique gera um evento, a função registrada roda e altera o DOM, atualizando a tela.',
  },
  exemplo: {
    titulo: 'Contador de cliques',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'let cliques = 0;\nconst botao = document.querySelector("#botao");\nconst saida = document.querySelector("#saida");\nbotao.addEventListener("click", () => {\n  cliques++;\n  saida.textContent = cliques;\n});',
    },
    comentarios: [
      { linha: 1, texto: 'let, pois o valor muda a cada clique.' },
      { linha: 4, texto: 'Registra a função que roda a cada clique.' },
      { linha: 6, texto: 'Atualiza o texto na página.' },
    ],
  },
  guiado: [
    mc(
      'Qual seletor encontra o elemento com id="menu"?',
      'document.querySelector("#menu")',
      [
        ['document.querySelector(".menu")', 'O ponto é para classes; o # é para id.'],
        ['document.querySelector("menu")', 'Sem # busca a tag <menu>.'],
      ],
      'No CSS e no querySelector, # = id e . = classe.',
    ),
    prever(
      'Qual propriedade guarda o texto digitado em um campo <input>?',
      'const campo = document.querySelector("#nome");\nconsole.log(campo.___);',
      ['value'],
      'campo.value guarda o que foi digitado.',
      [
        {
          resposta: 'textContent',
          feedback: 'textContent é para o texto de elementos; para campos, use value.',
        },
      ],
      [],
      'javascript',
    ),
  ],
  indep: [
    completar(
      'Complete para trocar o texto do parágrafo ao clicar no botão.',
      'botao.___("click", () => {\n  paragrafo.___ = "Oi!";\n});',
      [
        { aceitas: ['addEventListener'], feedback: 'É addEventListener que registra o evento.' },
        { aceitas: ['textContent'], feedback: 'textContent altera o texto do elemento.' },
      ],
      'addEventListener liga o evento à função; textContent troca o texto.',
      'javascript',
    ),
    mc(
      'Por que evitar innerHTML com texto digitado pelo usuário?',
      'Porque ele interpreta HTML e pode executar código malicioso (XSS)',
      [
        ['Porque é mais lento que tudo', 'O problema principal é de segurança.'],
        ['Porque não funciona em celulares', 'Funciona, mas é inseguro com dados do usuário.'],
      ],
      'textContent trata tudo como texto puro e é seguro.',
      1,
    ),
  ],
  desafio: completar(
    'Complete o código que mostra em #saida o dobro do número digitado em #numero, quando o usuário digita.',
    'const campo = document.querySelector("#numero");\nconst saida = document.querySelector("#saida");\ncampo.addEventListener("___", () => {\n  saida.textContent = Number(campo.___) * 2;\n});',
    [
      { aceitas: ['input'], feedback: 'O evento input dispara a cada digitação.' },
      {
        aceitas: ['value'],
        feedback: 'value tem o texto do campo; Number() converte para número.',
      },
    ],
    'O evento input dispara ao digitar; value lê o texto, que Number converte para multiplicar.',
    'javascript',
  ),
  rec: [
    mc(
      'Para que serve addEventListener?',
      'Para executar uma função quando um evento acontece',
      [
        ['Para criar elementos na página', 'Isso é papel do createElement.'],
        ['Para ler arquivos', 'Não tem relação com arquivos.'],
      ],
      'Registra uma função que o navegador chama quando o evento ocorre.',
    ),
    mc(
      'O que querySelectorAll devolve?',
      'Uma lista com todos os elementos que combinam com o seletor',
      [
        ['Só o primeiro elemento', 'Isso é o querySelector.'],
        ['Um texto com o HTML', 'Devolve elementos, não texto.'],
      ],
      'querySelector devolve um; querySelectorAll devolve todos.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é o DOM e como o JavaScript reage a um clique do usuário.',
    modelo:
      'O DOM é a árvore de elementos que o navegador cria a partir do HTML. O JavaScript acha um elemento com querySelector e registra com addEventListener uma função que roda no clique; ela pode alterar o DOM e a tela muda.',
    rubrica: [
      'Descreveu o DOM como árvore de elementos',
      'Citou querySelector ou seleção de elementos',
      'Citou addEventListener para reagir ao clique',
    ],
  },
  resumo: [
    'DOM é a árvore de elementos da página.',
    'querySelector acha elementos por seletor CSS.',
    'addEventListener reage a eventos.',
    'Prefira textContent a innerHTML com dados do usuário.',
  ],
  cards: [
    ['O que é o DOM?', 'A árvore de elementos da página.'],
    ['Como achar um elemento por id?', 'document.querySelector("#id")'],
    ['Como reagir a um clique?', 'elemento.addEventListener("click", função)'],
    ['Por que evitar innerHTML com texto do usuário?', 'Risco de XSS.'],
  ],
  conexoes: {
    disciplinas: [
      'HTML e CSS: os seletores do querySelector são os mesmos do CSS.',
      'Segurança: XSS é um dos ataques web mais comuns.',
      'Frameworks (React, Vue): automatizam as atualizações do DOM.',
    ],
    profissional:
      'Toda página interativa usa DOM e eventos, mesmo quando um framework esconde isso.',
  },
});
