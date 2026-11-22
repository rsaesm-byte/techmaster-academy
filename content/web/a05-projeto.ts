import { associar, completar, mc, montar, ordenar } from '../fundamentos/montar';

export const w05 = montar({
  id: 'web.m01.a05',
  titulo: 'Projeto: seu portfólio e como publicar',
  objetivo:
    'Juntar HTML, CSS e responsividade em uma página de portfólio e publicá-la na web com GitHub Pages.',
  pre: ['web.m01.a04', 'fundamentos.m04.a04'],
  min: 40,
  diag: mc(
    'Para uma página estática (só HTML, CSS e JS) ficar no ar, o que é necessário?',
    'Um servidor que entregue os arquivos, como o GitHub Pages',
    [
      [
        'Um banco de dados para armazenar o conteúdo das páginas',
        'Páginas estáticas não precisam de banco de dados.',
      ],
      [
        'Um compilador de C para gerar os arquivos da página',
        'HTML, CSS e JS não precisam de compilador de C.',
      ],
    ],
    'Basta hospedar os arquivos em algum servidor web.',
  ),
  simples: {
    titulo: 'Do arquivo ao link público',
    texto:
      'Um **portfólio** mostra quem você é e o que faz. Um bom começo tem:\n\n1. **Cabeçalho** com seu nome e uma frase de apresentação.\n2. **Sobre mim**, com um parágrafo curto.\n3. **Projetos**, em cartões (título, descrição, link).\n4. **Contato**, com um e-mail ou perfil profissional.\n5. **Rodapé.**\n\nPara **publicar**: coloque os arquivos (`index.html`, `estilo.css`) em um repositório no GitHub, ative o **GitHub Pages** nas configurações do repositório e, em minutos, o site estará em `https://seu-usuario.github.io/seu-repo/`.',
    essencial:
      'Portfólio = apresentação, projetos e contato, com HTML semântico, CSS e layout responsivo. Publique gratuitamente com Git e GitHub Pages.',
    guiado:
      'Do zero ao ar:\n1. Crie `index.html` e `estilo.css`.\n2. Teste localmente e em tela pequena.\n3. `git init`, `git add .`, `git commit`.\n4. Envie ao GitHub (`git push`).\n5. Ative o Pages em Settings.\n6. Compartilhe o link e atualize com novos commits.',
    tecnico:
      'O GitHub Pages serve arquivos **estáticos** por HTTPS, de graça, direto do repositório; cada `push` gera uma nova publicação. Para um domínio próprio, aponta-se um registro **CNAME** (ou A) do DNS para o GitHub. Checklist de qualidade antes de publicar: título e `lang` na página, meta viewport, `alt` nas imagens, links que funcionam, contraste, e teste no celular. Ferramentas como o **Lighthouse** (no navegador) medem desempenho, acessibilidade e SEO. Imagens devem ser otimizadas (tamanho e formato) para carregar rápido.',
  },
  analogia: {
    titulo: 'Cartão de visitas e vitrine',
    texto:
      'O portfólio é o seu cartão de visitas na internet. Publicar é colocar o cartão em uma vitrine na rua principal: qualquer pessoa com o endereço pode ver, e você troca o cartão quando quiser com um novo commit.',
    limites:
      'Páginas estáticas não têm lógica no servidor; formulários que enviam dados precisam de um serviço externo ou de um back-end.',
  },
  demo: {
    titulo: 'Seu portfólio em miniatura',
    instrucoes:
      'Troque o nome e o texto pelos seus, acrescente um cartão de projeto e mude a cor de destaque. Redimensione a janela e veja os cartões se reorganizarem.',
    simulacao: {
      tipo: 'editor',
      html: '<header>\n  <h1>Ana Souza</h1>\n  <p>Estudante de Sistemas de Informação</p>\n</header>\n<main>\n  <section>\n    <h2>Sobre mim</h2>\n    <p>Gosto de dados, automação e de criar coisas úteis.</p>\n  </section>\n  <section>\n    <h2>Projetos</h2>\n    <div class="cards">\n      <article class="card"><h3>Controle de finanças</h3><p>App web para organizar gastos.</p></article>\n      <article class="card"><h3>Quadro de tarefas</h3><p>Kanban simples em JavaScript.</p></article>\n    </div>\n  </section>\n  <section>\n    <h2>Contato</h2>\n    <p><a href="mailto:ana@exemplo.com">ana@exemplo.com</a></p>\n  </section>\n</main>\n<footer><p>© 2026 Ana Souza</p></footer>',
      css: ':root { --destaque: #1d4ed8; }\nbody { font-family: system-ui, sans-serif; margin: 0; line-height: 1.5; color: #0f172a; }\nheader { background: var(--destaque); color: white; padding: 24px 16px; }\nheader h1 { margin: 0; }\nmain, footer { padding: 16px; max-width: 720px; margin: 0 auto; }\nh2 { color: var(--destaque); }\n.cards { display: flex; flex-wrap: wrap; gap: 12px; }\n.card { flex: 1 1 200px; border: 2px solid #cbd5e1; border-radius: 12px; padding: 12px; }\n.card h3 { margin-top: 0; }\na { color: var(--destaque); }',
      js: '',
    },
  },
  tecnica: {
    titulo: 'Passo a passo do GitHub Pages',
    texto:
      '`git init` e `git add .` e `git commit -m "Primeira versão"`\n`git remote add origin https://github.com/usuario/portfolio.git`\n`git push -u origin main`\nNo GitHub: **Settings, Pages**, e escolha a branch `main` e a pasta raiz.\nAguarde alguns minutos e abra o link. Para atualizar: edite, faça commit e `git push`.',
  },
  diagrama: {
    titulo: 'Do computador ao mundo',
    nos: [
      { forma: 'inicio', texto: 'Você edita index.html e estilo.css' },
      { forma: 'passo', texto: 'Commit e push para o GitHub' },
      { forma: 'passo', texto: 'O GitHub Pages publica os arquivos por HTTPS' },
      { forma: 'fim', texto: 'Qualquer pessoa abre o link no navegador' },
    ],
    descricao: 'Cada push atualiza o site publicado.',
  },
  exemplo: {
    titulo: 'Variáveis CSS para trocar o tema',
    codigo: {
      linguagem: 'css',
      fonte:
        ':root {\n  --destaque: #1d4ed8;\n}\nheader { background: var(--destaque); }\na { color: var(--destaque); }',
    },
    comentarios: [
      { linha: 2, texto: 'Uma variável CSS guarda a cor de destaque em um só lugar.' },
      { linha: 4, texto: 'var() usa o valor; trocar a variável muda o site inteiro.' },
    ],
  },
  guiado: [
    mc(
      'Qual comando envia seus commits ao GitHub?',
      'git push',
      [
        ['git pull', 'pull traz as mudanças do GitHub para o seu computador.'],
        ['git init', 'init só cria o repositório local.'],
      ],
      'push publica; pull atualiza.',
    ),
    mc(
      'Qual arquivo o servidor entrega por padrão ao abrir a pasta do site?',
      'index.html',
      [
        ['home.txt', 'O padrão é o index.html.'],
        ['principal.css', 'CSS é o estilo, não a página.'],
      ],
      'index.html é a página inicial padrão.',
    ),
  ],
  indep: [
    completar(
      'Complete para usar a variável de cor definida em :root.',
      'h2 { color: ___(--destaque); }',
      [{ aceitas: ['var'], feedback: 'var() lê o valor de uma variável CSS.' }],
      'Variáveis CSS começam com dois traços.',
      'css',
    ),
    completar(
      'Complete a meta tag que torna a página responsiva em celulares.',
      '<meta name="___" content="width=device-width, initial-scale=1">',
      [{ aceitas: ['viewport'], feedback: 'viewport controla a área visível no celular.' }],
      'Sem ela, o celular mostra a página "encolhida".',
      'html',
    ),
  ],
  desafio: ordenar(
    'Ordene os passos para publicar o portfólio no GitHub Pages.',
    [
      'Criar index.html e estilo.css',
      'Fazer commit dos arquivos',
      'Enviar ao GitHub com git push',
      'Ativar o GitHub Pages nas configurações',
      'Abrir o link e compartilhar',
    ],
    'Da criação à publicação; depois, cada push atualiza o site.',
  ),
  rec: [
    associar(
      'Associe a ferramenta ao uso.',
      [
        ['Git', 'Versiona os arquivos do projeto'],
        ['GitHub Pages', 'Hospeda páginas estáticas gratuitamente'],
        ['Lighthouse', 'Mede desempenho, acessibilidade e SEO'],
        ['Meta viewport', 'Adapta a página a telas de celular'],
      ],
      'O básico de um fluxo de publicação web.',
    ),
    mc(
      'Qual destes itens NÃO costuma fazer parte de um portfólio básico?',
      'Um servidor de banco de dados',
      [
        [
          'Uma seção de projetos com links e descrições',
          'Projetos fazem parte de um bom portfólio.',
        ],
        [
          'Uma forma de contato, como e-mail ou links de redes',
          'Contato faz parte de um portfólio.',
        ],
      ],
      'Uma página estática dispensa banco de dados.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Descreva como você montaria e publicaria um portfólio simples.',
    modelo:
      'Criaria um index.html semântico com cabeçalho, sobre, projetos e contato, estilizaria com CSS responsivo (Flexbox e media queries), testaria em tela pequena e com o teclado, faria commit e push para um repositório no GitHub e ativaria o GitHub Pages para obter o link público.',
    rubrica: [
      'Descreveu a estrutura da página',
      'Citou responsividade ou acessibilidade',
      'Descreveu a publicação com Git e GitHub Pages',
    ],
  },
  resumo: [
    'Portfólio: apresentação, projetos e contato.',
    'HTML semântico, CSS responsivo e acessível.',
    'GitHub Pages publica páginas estáticas de graça.',
    'Cada push atualiza o site.',
  ],
  cards: [
    ['Onde publicar uma página estática de graça?', 'GitHub Pages.'],
    ['Arquivo padrão da página inicial?', 'index.html.'],
    ['Variável CSS?', '--nome e var(--nome).'],
    ['Ferramenta que mede qualidade da página?', 'Lighthouse.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: Git, DNS e HTTPS.',
      'JavaScript: dê interatividade ao portfólio.',
      'UX/UI Design: hierarquia visual e legibilidade.',
    ],
    profissional:
      'Um portfólio publicado, com projetos reais, é o cartão de visitas de quem busca estágio ou o primeiro emprego em tecnologia.',
  },
});
