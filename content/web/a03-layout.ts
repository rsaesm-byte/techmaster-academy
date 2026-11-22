import { associar, completar, mc, montar, ordenar } from '../fundamentos/montar';

export const w03 = montar({
  id: 'web.m01.a03',
  titulo: 'Layout com Flexbox e design responsivo',
  objetivo:
    'Organizar elementos em linhas e colunas com Flexbox e adaptar a página a telas de tamanhos diferentes.',
  pre: ['web.m01.a02'],
  min: 30,
  diag: mc(
    'Qual é o objetivo do design responsivo?',
    'Fazer a página se adaptar bem a telas de qualquer tamanho',
    [
      [
        'Fazer a página carregar mais rápido em conexões lentas',
        'A velocidade é outro assunto; o responsivo trata do tamanho da tela.',
      ],
      [
        'Esconder parte do conteúdo em celulares para simplificar a tela',
        'O conteúdo deve continuar acessível em todos os tamanhos.',
      ],
    ],
    'Uma só página serve bem em celular, tablet e computador.',
  ),
  simples: {
    titulo: 'Caixas que se organizam sozinhas',
    texto:
      'Com **Flexbox**, o elemento pai vira um "organizador" que alinha os filhos:\n\n```\n.menu {\n  display: flex;\n  gap: 16px;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n- `display: flex`: ativa o Flexbox (filhos em linha).\n- `flex-direction: column`: filhos em coluna.\n- `justify-content`: alinha no **eixo principal**.\n- `align-items`: alinha no **eixo cruzado**.\n- `gap`: espaço entre os filhos.\n- `flex-wrap: wrap`: quebra para a linha seguinte se faltar espaço.\n\nPara o **responsivo**, use a tag `<meta name="viewport" ...>` e **media queries**: `@media (max-width: 600px) { ... }` muda o estilo em telas pequenas.',
    essencial:
      'Flexbox organiza filhos em linha ou coluna. Media queries adaptam o estilo ao tamanho da tela. Comece pelo celular (mobile first).',
    guiado:
      'Para um menu responsivo:\n1. Pai com `display: flex` e `gap`.\n2. `flex-wrap: wrap` para quebrar linhas.\n3. `@media (max-width: 600px)` para trocar para coluna.\n4. Teste redimensionando a janela.',
    tecnico:
      'O Flexbox é unidimensional (uma linha ou uma coluna por vez); para grades de duas dimensões existe o **CSS Grid** (`display: grid; grid-template-columns: repeat(3, 1fr)`). Em cada filho, `flex: 1` divide o espaço restante em partes iguais, e `flex-shrink` permite encolher. A tag `<meta name="viewport" content="width=device-width, initial-scale=1">` faz o celular usar a largura real da tela. A abordagem **mobile first** escreve o estilo base para telas pequenas e usa `min-width` para melhorar em telas maiores. Imagens responsivas usam `max-width: 100%; height: auto`.',
  },
  analogia: {
    titulo: 'Gente numa fila e numa roda',
    texto:
      'O Flexbox é um monitor de eventos: pede às pessoas que fiquem em fila (linha), em coluna ou em roda, com espaço igual entre elas. Se o corredor fica estreito (tela pequena), ele pede que passem para outra fileira (wrap).',
    limites: 'Para organizar em linhas e colunas ao mesmo tempo, o Grid é mais indicado.',
  },
  demo: {
    titulo: 'Experimente o Flexbox',
    instrucoes:
      'Troque justify-content por center, space-around e flex-end. Depois mude flex-direction para column. Por fim, reduza a largura da janela e veja o flex-wrap agir.',
    simulacao: {
      tipo: 'editor',
      html: '<nav class="menu">\n  <a href="#">Início</a>\n  <a href="#">Cursos</a>\n  <a href="#">Blog</a>\n  <a href="#">Contato</a>\n</nav>\n<div class="cards">\n  <div class="card">1</div>\n  <div class="card">2</div>\n  <div class="card">3</div>\n</div>',
      css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.menu {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  background: #e2e8f0;\n  padding: 12px;\n  border-radius: 8px;\n}\n.cards { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }\n.card {\n  flex: 1 1 100px;\n  background: #1d4ed8;\n  color: white;\n  padding: 24px;\n  text-align: center;\n  border-radius: 8px;\n}\n@media (max-width: 400px) {\n  .menu { flex-direction: column; }\n}',
      js: '',
    },
  },
  tecnica: {
    titulo: 'Receitas rápidas',
    texto:
      '**Centralizar tudo:** `display: flex; justify-content: center; align-items: center;`\n**Colunas iguais:** filhos com `flex: 1`.\n**Rodapé no fim:** `body { display: flex; flex-direction: column; min-height: 100vh; }` e `main { flex: 1 }`.\n**Grade:** `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;`',
  },
  diagrama: {
    titulo: 'Eixos do Flexbox',
    nos: [
      { forma: 'inicio', texto: 'O pai recebe display: flex' },
      { forma: 'passo', texto: 'flex-direction define o eixo principal (linha ou coluna)' },
      { forma: 'passo', texto: 'justify-content alinha no eixo principal' },
      { forma: 'fim', texto: 'align-items alinha no eixo cruzado' },
    ],
    descricao: 'Dois eixos, duas propriedades de alinhamento.',
  },
  exemplo: {
    titulo: 'Menu que vira coluna no celular',
    codigo: {
      linguagem: 'css',
      fonte:
        '.menu { display: flex; gap: 16px; }\n@media (max-width: 600px) {\n  .menu { flex-direction: column; }\n}',
    },
    comentarios: [
      { linha: 1, texto: 'Em telas grandes, os itens ficam lado a lado.' },
      { linha: 2, texto: 'A media query vale só quando a tela tem até 600px.' },
      { linha: 3, texto: 'Em telas pequenas, os itens se empilham.' },
    ],
  },
  guiado: [
    mc(
      'Qual propriedade ativa o Flexbox em um elemento?',
      'display: flex',
      [
        ['position: flex', 'position tem outros valores, como relative e absolute.'],
        ['flex: true', 'Não existe essa forma.'],
      ],
      'O pai recebe display: flex.',
    ),
    mc(
      'Qual propriedade deixa os filhos em coluna?',
      'flex-direction: column',
      [
        ['justify-content: column', 'justify-content alinha, e não define a direção.'],
        ['align-items: column', 'align-items alinha no eixo cruzado.'],
      ],
      'flex-direction define o eixo principal.',
    ),
  ],
  indep: [
    completar(
      'Complete para centralizar no eixo principal.',
      '.caixa {\n  display: flex;\n  justify-content: ___;\n}',
      [{ aceitas: ['center'], feedback: 'center centraliza no eixo principal.' }],
      'Para o eixo cruzado, use align-items: center.',
      'css',
    ),
    completar(
      'Complete a media query para telas de até 600px.',
      '@media (max-___: 600px) {\n  .menu { flex-direction: column; }\n}',
      [{ aceitas: ['width'], feedback: 'max-width limita a largura da tela.' }],
      'min-width é usado na abordagem mobile first.',
      'css',
    ),
  ],
  desafio: associar(
    'Associe a propriedade ao efeito.',
    [
      ['display: flex', 'Ativa o Flexbox no pai'],
      ['gap', 'Espaço entre os filhos'],
      ['flex-wrap: wrap', 'Quebra para a próxima linha quando falta espaço'],
      ['@media (max-width: 600px)', 'Aplica estilos só em telas pequenas'],
    ],
    'As quatro peças de um layout responsivo simples.',
  ),
  rec: [
    ordenar(
      'Ordene os passos para um layout responsivo.',
      [
        'Incluir a meta tag viewport',
        'Escrever o estilo base para telas pequenas',
        'Usar Flexbox para organizar',
        'Adicionar media queries para telas maiores',
      ],
      'Mobile first: do pequeno para o grande.',
    ),
    mc(
      'Quando preferir CSS Grid ao Flexbox?',
      'Quando precisar organizar em linhas e colunas ao mesmo tempo',
      [
        [
          'Quando houver só um item para posicionar na página',
          'Com um item só, nenhum dos dois é necessário.',
        ],
        [
          'Nunca, pois o Flexbox resolve qualquer tipo de layout',
          'O Grid é a melhor escolha para linhas e colunas ao mesmo tempo.',
        ],
      ],
      'Flexbox é unidimensional; Grid é bidimensional.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como o Flexbox e as media queries tornam uma página responsiva.',
    modelo:
      'O Flexbox organiza os filhos em linha ou coluna, com espaçamento e quebra automáticos conforme o espaço disponível. As media queries aplicam estilos diferentes de acordo com o tamanho da tela, por exemplo trocando uma linha de itens por uma coluna em celulares.',
    rubrica: ['Explicou o papel do Flexbox', 'Explicou as media queries', 'Deu um exemplo prático'],
  },
  resumo: [
    'display: flex organiza os filhos; justify-content e align-items alinham.',
    'gap e flex-wrap cuidam do espaçamento e da quebra.',
    'Media queries adaptam o estilo à tela.',
    'Mobile first: comece pelo celular.',
  ],
  cards: [
    ['Como ativar o Flexbox?', 'display: flex no pai.'],
    ['Eixo principal?', 'justify-content.'],
    ['Eixo cruzado?', 'align-items.'],
    ['O que é mobile first?', 'Começar o estilo pela tela pequena.'],
  ],
  conexoes: {
    disciplinas: [
      'UX/UI: usabilidade em todos os dispositivos.',
      'JavaScript: eventos de redimensionamento e menus que abrem e fecham.',
      'Algoritmos: o motor de layout distribui o espaço por regras.',
    ],
    profissional:
      'A maior parte do tráfego web vem de celulares; layout responsivo é requisito, e não diferencial.',
  },
});
