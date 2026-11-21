import { associar, completar, mc, montar, ordenar } from '../fundamentos/montar';

export const w01 = montar({
  id: 'web.m01.a01',
  titulo: 'HTML: a estrutura e o significado da página',
  objetivo:
    'Escrever páginas com HTML semântico: títulos, parágrafos, listas, links, imagens e seções.',
  pre: ['fundamentos.m02.a04'],
  min: 25,
  diag: mc(
    'Para que serve o HTML?',
    'Descrever a estrutura e o significado do conteúdo da página',
    [
      ['Deixar a página bonita', 'A aparência é função do CSS.'],
      ['Fazer a página reagir a cliques', 'Isso é função do JavaScript.'],
    ],
    'HTML é o esqueleto; CSS a aparência; JavaScript o comportamento.',
  ),
  simples: {
    titulo: 'O esqueleto da página',
    texto:
      'Uma página web é feita de três linguagens: **HTML** (estrutura), **CSS** (aparência) e **JavaScript** (comportamento).\n\nO HTML usa **tags**, que marcam o que cada pedaço do conteúdo **é**:\n\n```\n<h1>Título principal</h1>\n<p>Um parágrafo com um <a href="https://exemplo.com">link</a>.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n<img src="foto.jpg" alt="Descrição da foto">\n```\n\nPreferimos tags **semânticas** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), que dizem o **papel** do bloco, e não só o tamanho. Isso ajuda leitores de tela, buscadores e quem mantém o código.',
    essencial:
      'HTML marca o significado do conteúdo com tags. Use tags semânticas e sempre preencha o alt das imagens.',
    guiado:
      'Para montar uma página:\n1. `<h1>` com o assunto (só um por página).\n2. `<main>` com o conteúdo, dividido em `<section>`.\n3. `<nav>` com os links de navegação.\n4. `<img>` sempre com `alt`.\n5. `<footer>` com os créditos.',
    tecnico:
      'Um documento começa com `<!doctype html>` e tem `<html lang="pt-BR">`, `<head>` (título, codificação, metadados) e `<body>` (o que aparece). O navegador converte o HTML em uma árvore, o **DOM**, que o JavaScript manipula. Elementos são **de bloco** (ocupam a linha: `div`, `p`, `h1`) ou **em linha** (`span`, `a`, `strong`). A hierarquia dos títulos (`h1` a `h6`) forma o "sumário" da página, usado por leitores de tela, por isso não pule níveis só por tamanho. Os atributos (`href`, `src`, `alt`, `id`, `class`) configuram cada tag.',
  },
  analogia: {
    titulo: 'A planta de uma casa',
    texto:
      'O HTML é a planta: diz onde ficam a sala, a cozinha e os quartos (cabeçalho, conteúdo, rodapé), e não a cor das paredes. A pintura é o CSS; a instalação elétrica que faz a luz acender é o JavaScript.',
    limites:
      'Na web, o mesmo HTML pode ser pintado de formas totalmente diferentes só trocando o CSS.',
  },
  demo: {
    titulo: 'Mexa na estrutura',
    instrucoes:
      'Altere o título, acrescente um item na lista e troque o texto do link. Depois transforme um <div> em <header> ou <footer> e observe que a aparência não muda: o significado, sim.',
    simulacao: {
      tipo: 'editor',
      html: '<header>\n  <h1>Minha página</h1>\n  <nav><a href="#sobre">Sobre</a> · <a href="#contato">Contato</a></nav>\n</header>\n<main>\n  <section id="sobre">\n    <h2>Sobre mim</h2>\n    <p>Estudo <strong>tecnologia</strong> e gosto de criar coisas na web.</p>\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n    </ul>\n  </section>\n</main>\n<footer><p>© 2026</p></footer>',
      css: 'body { font-family: system-ui, sans-serif; padding: 16px; line-height: 1.5; }\nheader, footer { background: #e2e8f0; padding: 8px 16px; border-radius: 8px; }',
      js: '',
    },
  },
  tecnica: {
    titulo: 'Tags que você mais vai usar',
    texto:
      '**Texto:** `h1`–`h6`, `p`, `strong` (importante), `em` (ênfase), `br`.\n**Listas:** `ul`/`ol` com `li`.\n**Links:** `<a href="...">`.\n**Mídia:** `<img src alt>`, `<video>`, `<audio>`.\n**Estrutura:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.\n**Genéricas:** `div` (bloco) e `span` (em linha), só quando não houver tag semântica.',
  },
  diagrama: {
    titulo: 'Do arquivo à tela',
    nos: [
      { forma: 'inicio', texto: 'O navegador recebe o arquivo HTML' },
      { forma: 'passo', texto: 'Lê as tags e monta a árvore (DOM)' },
      { forma: 'passo', texto: 'Aplica o CSS: cores, tamanhos e posições' },
      { forma: 'fim', texto: 'Desenha a página e executa o JavaScript' },
    ],
    descricao: 'HTML vira DOM, o CSS estiliza e o JavaScript dá vida.',
  },
  exemplo: {
    titulo: 'Esqueleto mínimo de uma página',
    codigo: {
      linguagem: 'html',
      fonte:
        '<!doctype html>\n<html lang="pt-BR">\n  <head>\n    <meta charset="UTF-8">\n    <title>Minha página</title>\n  </head>\n  <body>\n    <h1>Olá, mundo!</h1>\n  </body>\n</html>',
    },
    comentarios: [
      { linha: 2, texto: 'lang informa o idioma a leitores de tela e tradutores.' },
      { linha: 4, texto: 'UTF-8 garante que acentos apareçam corretamente.' },
      { linha: 5, texto: 'O título aparece na aba do navegador.' },
      { linha: 8, texto: 'Tudo o que fica no body aparece na página.' },
    ],
  },
  guiado: [
    mc(
      'Qual tag representa o conteúdo principal da página?',
      '<main>',
      [
        ['<top>', 'Essa tag não existe.'],
        ['<content>', 'Essa tag não existe; a semântica correta é main.'],
      ],
      '<main> marca o conteúdo principal, uma vez por página.',
    ),
    mc(
      'Para que serve o atributo alt de uma imagem?',
      'Descrever a imagem para quem não a vê (leitor de tela) ou se ela não carregar',
      [
        ['Aumentar a imagem', 'O tamanho é definido por CSS.'],
        ['Trocar a cor da imagem', 'Cor também é assunto de CSS.'],
      ],
      'O texto alternativo é essencial para acessibilidade.',
    ),
  ],
  indep: [
    completar(
      'Complete para criar um link para https://exemplo.com.',
      '<a ___="https://exemplo.com">Visitar</a>',
      [{ aceitas: ['href'], feedback: 'href é o atributo com o destino do link.' }],
      'href vem de "hypertext reference".',
      'html',
    ),
    completar(
      'Complete a tag da lista com marcadores.',
      '<___>\n  <li>Pão</li>\n  <li>Leite</li>\n</___>',
      [
        { aceitas: ['ul'], feedback: 'ul é a lista sem ordem.' },
        { aceitas: ['ul'], feedback: 'A tag de fechamento é a mesma.' },
      ],
      'ul é "unordered list"; ol é a lista numerada.',
      'html',
    ),
  ],
  desafio: associar(
    'Associe cada tag ao seu papel.',
    [
      ['<nav>', 'Bloco de links de navegação'],
      ['<footer>', 'Rodapé com créditos e contatos'],
      ['<article>', 'Conteúdo independente, como um post'],
      ['<h1>', 'Título principal da página'],
    ],
    'Tags semânticas descrevem o papel do conteúdo.',
  ),
  rec: [
    ordenar(
      'Ordene a estrutura de um documento HTML, de fora para dentro.',
      ['<!doctype html>', '<html lang="pt-BR">', '<head> com o título', '<body> com o conteúdo'],
      'O documento começa pela declaração, depois html e, dentro dele, head e body.',
    ),
    mc(
      'Por que preferir <nav> a um <div> para o menu?',
      'Porque ele informa o significado do bloco a leitores de tela e buscadores',
      [
        ['Porque o <div> não funciona', 'O div funciona, mas não diz nada sobre o conteúdo.'],
        ['Porque o <nav> é mais bonito', 'A aparência não muda.'],
      ],
      'Semântica ajuda acessibilidade, busca e manutenção.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que é HTML semântico e por que ele importa.',
    modelo:
      'HTML semântico usa tags que descrevem o papel do conteúdo (header, nav, main, section, footer), e não apenas a aparência. Isso ajuda leitores de tela, mecanismos de busca e quem mantém o código a entender a estrutura da página.',
    rubrica: [
      'Definiu HTML semântico',
      'Citou exemplos de tags',
      'Citou um benefício (acessibilidade, busca ou manutenção)',
    ],
  },
  resumo: [
    'HTML = estrutura; CSS = aparência; JS = comportamento.',
    'Tags semânticas descrevem o papel do conteúdo.',
    'Imagens precisam do atributo alt.',
    'O navegador transforma o HTML em uma árvore (DOM).',
  ],
  cards: [
    ['O que o HTML descreve?', 'A estrutura e o significado do conteúdo.'],
    ['Tag do conteúdo principal?', '<main>.'],
    ['Atributo do destino de um link?', 'href.'],
    ['Por que usar alt?', 'Acessibilidade e imagens que falham.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: o DOM é a árvore criada a partir do HTML.',
      'Redes: o HTML chega por HTTP, como visto em DNS e HTTP.',
      'UX/UI: estrutura clara melhora a experiência.',
    ],
    profissional:
      'Todo desenvolvedor web começa por um HTML bem estruturado; é a base de acessibilidade e de bom ranqueamento em buscas.',
  },
});
