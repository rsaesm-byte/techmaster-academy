import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const c04 = montar({
  id: 'ciberseguranca.m01.a04',
  titulo: 'Injeção de SQL: entenda para se defender',
  objetivo:
    'Entender por que montar consultas com texto digitado é perigoso e como as consultas parametrizadas evitam o problema.',
  pre: ['ciberseguranca.m01.a03', 'sql.m02.a02'],
  min: 30,
  diag: mc(
    'Por que é perigoso montar uma consulta SQL juntando texto digitado pelo usuário?',
    'O texto pode conter SQL e mudar o significado da consulta',
    [
      ['O texto fica muito comprido', 'O problema não é o tamanho.'],
      ['O banco não aceita texto', 'Aceita; o risco é outro.'],
    ],
    'Dados e comandos se misturam: o banco não sabe o que é um e o que é outro.',
  ),
  simples: {
    titulo: 'Quando o dado vira comando',
    texto:
      'Imagine um login que monta a consulta assim:\n\n```\n"SELECT * FROM usuarios WHERE nome = \'" + nome + "\'"\n```\n\nSe alguém digitar um **nome com pedaços de SQL**, o texto deixa de ser dado e passa a ser **parte do comando**. É a **injeção de SQL**, uma das falhas mais antigas e mais danosas da web.\n\nDe forma geral, uma condição "sempre verdadeira" (como `OR 1 = 1`) faz o WHERE aceitar todas as linhas. Veja no banco de treino do app o efeito: a consulta devolve **todos** os registros em vez de um.\n\n**A defesa correta:** **consultas parametrizadas** (prepared statements), em que o comando e os dados viajam **separados**.',
    essencial:
      'Nunca monte SQL juntando texto do usuário. Use consultas parametrizadas, que mantêm dados e comandos separados.',
    guiado:
      'Ao escrever código com banco de dados:\n1. Use sempre parâmetros (`?` ou `:nome`).\n2. Nunca concatene entradas na consulta.\n3. Dê ao app uma conta de banco com o mínimo de privilégios.\n4. Valide as entradas e mostre erros genéricos ao usuário.',
    tecnico:
      'Na consulta parametrizada o banco primeiro **compila** o comando com marcadores e só depois recebe os valores, tratados sempre como dados. O "escape" manual de aspas é frágil e deve ser evitado em favor dos parâmetros. Outras defesas: **menor privilégio** (a conta do app não precisa de DROP), **ORMs** corretamente usados, **WAF** como camada extra, e **logs** e alertas. A injeção é a categoria "Injection" do **OWASP Top 10**. Entradas devem ser tratadas como não confiáveis, o que vale também para XSS e injeção de comandos.',
  },
  analogia: {
    titulo: 'Formulário com campo em branco',
    texto:
      'Pense num formulário impresso: "Eu, ______, autorizo a retirada". Se alguém escreve no espaço "João e libero todo o estoque", o texto passou a mudar o significado do documento. Na consulta parametrizada, o espaço em branco só aceita um nome, e nada além disso.',
    limites:
      'Só quem desenvolve o sistema pode corrigir isso; o usuário final não tem como se proteger sozinho.',
  },
  demo: {
    titulo: 'O efeito de uma condição sempre verdadeira',
    instrucoes:
      'No banco de treino, compare: a consulta normal devolve 1 cliente. Troque a condição por uma sempre verdadeira (OR 1 = 1) e veja todos os registros. Entender o efeito é o que permite se defender.',
    simulacao: { tipo: 'sql', consulta: "SELECT nome FROM clientes WHERE nome = 'zzz' OR 1 = 1;" },
  },
  tecnica: {
    titulo: 'Concatenar × parametrizar',
    texto:
      '**Vulnerável:** `"... WHERE nome = \'" + entrada + "\'"`\n**Seguro (Python):** `cursor.execute("SELECT * FROM usuarios WHERE nome = ?", (entrada,))`\n**Seguro (JavaScript):** `db.query("SELECT * FROM usuarios WHERE nome = $1", [entrada])`\nO driver do banco cuida de separar dados e comando.',
  },
  diagrama: {
    titulo: 'Onde o problema acontece',
    nos: [
      { forma: 'inicio', texto: 'O usuário digita um texto' },
      { forma: 'decisao', texto: 'O código junta o texto à consulta?' },
      { forma: 'passo', texto: 'Sim: o texto pode virar comando (vulnerável)' },
      { forma: 'fim', texto: 'Não, usa parâmetros: o texto é só dado (seguro)' },
    ],
    descricao: 'A separação entre dado e comando é a defesa.',
  },
  exemplo: {
    titulo: 'A mesma busca, dois jeitos',
    codigo: {
      linguagem: 'python',
      fonte:
        '# Vulnerável\nconsulta = "SELECT * FROM usuarios WHERE nome = \'" + nome + "\'"\n\n# Seguro\ncursor.execute("SELECT * FROM usuarios WHERE nome = ?", (nome,))',
    },
    comentarios: [
      { linha: 2, texto: 'O valor de nome é colado no comando: perigoso.' },
      { linha: 5, texto: 'O valor vai separado, sempre tratado como dado.' },
    ],
  },
  guiado: [
    prever(
      'Quantos clientes esta consulta devolve no banco de treino? (condição sempre verdadeira)',
      "SELECT nome FROM clientes WHERE nome = 'zzz' OR 1 = 1;",
      ['5'],
      'A condição "OR 1 = 1" é sempre verdadeira, então todos os 5 clientes passam.',
      [
        {
          resposta: '0',
          feedback: 'Nenhum cliente se chama zzz, mas o OR 1 = 1 libera todas as linhas.',
        },
      ],
    ),
    prever(
      'E esta, que é a versão normal?',
      "SELECT nome FROM clientes WHERE nome = 'Ana';",
      ['1'],
      'Só a Ana tem esse nome.',
      [{ resposta: '5', feedback: 'Sem condição extra, só a Ana passa no filtro.' }],
    ),
  ],
  indep: [
    mc(
      'Qual é a defesa mais confiável contra injeção de SQL?',
      'Consultas parametrizadas',
      [
        ['Esconder mensagens de erro apenas', 'Ajuda, mas não corrige a falha.'],
        ['Proibir o usuário de digitar aspas', 'Filtros de caracteres são frágeis.'],
      ],
      'Dados e comandos devem viajar separados.',
    ),
    completar(
      'Complete: a conta do banco usada pelo app deve ter o menor ___ possível.',
      'const regra = "conta com o menor ___";',
      [{ aceitas: ['privilégio', 'privilegio'], feedback: 'Princípio do menor privilégio.' }],
      'Assim, mesmo que haja falha, o estrago é limitado.',
    ),
  ],
  desafio: programaJs(
    "Escreva escapar(texto): devolve o texto com cada aspa simples (') duplicada (''). Isso ilustra o escape manual, mas lembre: o correto em produção é usar consultas parametrizadas.",
    'function escapar(texto) {\n  // seu código aqui\n}',
    'function escapar(texto) {\n  return texto.split("\'").join("\'\'");\n}',
    'escapar',
    [
      { argumentos: ['Ana'], esperado: 'Ana' },
      { argumentos: ["O'Neil"], esperado: "O''Neil" },
      { argumentos: ["' OR 1=1"], esperado: "'' OR 1=1" },
      { argumentos: [''], esperado: '' },
    ],
    [
      'split("\'") separa nas aspas e join("\'\'") junta duplicando.',
      'Ou use replaceAll("\'", "\'\'").',
    ],
    'Duplicar aspas neutraliza o fechamento do texto, mas é frágil; parâmetros são a solução robusta.',
  ),
  rec: [
    mc(
      'O que a injeção de SQL permite, em última análise?',
      'Que dados digitados alterem o comando executado pelo banco',
      [
        ['Que o site fique mais rápido', 'É uma falha, não uma otimização.'],
        ['Que a senha seja criptografada', 'Não tem relação.'],
      ],
      'Dados viram comandos.',
    ),
    associar(
      'Associe a prática ao efeito.',
      [
        ['Consulta parametrizada', 'Separa dados e comando'],
        ['Menor privilégio', 'Limita o estrago se algo falhar'],
        ['Validar entradas', 'Reduz entradas inesperadas'],
        ['Mensagens de erro genéricas', 'Não revela detalhes do banco'],
      ],
      'Defesas combinadas formam a defesa em profundidade.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é injeção de SQL e como evitá-la.',
    modelo:
      'A injeção de SQL ocorre quando o texto digitado pelo usuário é concatenado à consulta e passa a ser interpretado como comando, alterando o seu significado. Evita-se com consultas parametrizadas, que separam comando e dados, além do menor privilégio na conta do banco e da validação de entradas.',
    rubrica: [
      'Explicou que o dado vira comando',
      'Citou consultas parametrizadas',
      'Citou outra defesa complementar',
    ],
  },
  resumo: [
    'Concatenar entrada em SQL deixa dados virarem comandos.',
    'Consultas parametrizadas são a defesa correta.',
    'Menor privilégio e validação reduzem o estrago.',
    'Trate toda entrada como não confiável.',
  ],
  cards: [
    ['O que é injeção de SQL?', 'Dado digitado que vira parte do comando.'],
    ['Defesa principal?', 'Consultas parametrizadas.'],
    ['Escapar aspas basta?', 'Não, é frágil.'],
    ['Que lista cataloga essas falhas?', 'OWASP Top 10.'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: o WHERE e o OR da aula de módulo 2.',
      'Desenvolvimento Web: formulários e APIs recebem entradas.',
      'Python e JavaScript: drivers de banco oferecem parâmetros.',
    ],
    profissional:
      'Revisões de código e testes de segurança procuram, antes de tudo, consultas montadas por concatenação.',
  },
});
