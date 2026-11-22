import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const es02 = montar({
  id: 'engsoft.m01.a02',
  titulo: 'Versionamento com Git',
  objetivo: 'Entender commits, branches e merge para trabalhar em equipe sem perder o histórico.',
  pre: ['engsoft.m01.a01'],
  min: 30,
  diag: mc(
    'Duas pessoas editam o mesmo arquivo ao mesmo tempo e uma sobrescreve o trabalho da outra. O que resolve isso?',
    'Um sistema de controle de versão, como o Git',
    [
      ['Mandar o arquivo por e-mail com data no nome', 'Isso cria versões soltas e confusão.'],
      ['Proibir que duas pessoas trabalhem juntas', 'Impede o trabalho em equipe.'],
    ],
    'O Git guarda o histórico e junta mudanças.',
  ),
  simples: {
    titulo: 'A máquina do tempo do código',
    texto:
      'O **Git** registra a **história** do projeto como uma sequência de **commits** (fotografias do código com uma mensagem).\n\n- **Repositório:** a pasta do projeto com todo o histórico.\n- **Commit:** um ponto salvo, com autor, data e mensagem.\n- **Branch (ramo):** uma linha de desenvolvimento paralela, como `main` e `feature/login`.\n- **Merge:** junta o trabalho de um ramo em outro.\n- **Remoto:** cópia do repositório num servidor (GitHub, GitLab).\n\n```\ngit switch -c feature/login\ngit add .\ngit commit -m "Adiciona tela de login"\ngit push\n```\n\nDepois abre-se um **pull request** para a equipe revisar antes do merge.',
    essencial:
      'Git guarda commits; branches permitem trabalho paralelo; merge junta tudo; pull request organiza a revisão.',
    guiado:
      'Fluxo diário:\n1. `git pull` para atualizar.\n2. Crie um branch para a tarefa.\n3. Faça commits pequenos com mensagens claras.\n4. `git push` e abra o pull request.\n5. Após a aprovação, faça o merge e apague o branch.',
    tecnico:
      'Cada commit tem um **hash** (SHA) que o identifica e aponta para o commit pai, formando um grafo. Um branch é só um ponteiro móvel para um commit. O **fast-forward** acontece quando o merge só avança o ponteiro; caso contrário cria-se um **commit de merge**. **Conflitos** surgem quando dois ramos mudam as mesmas linhas e exigem resolução manual. `git rebase` reescreve o histórico para ficar linear (não use em ramos compartilhados). `.gitignore` evita versionar segredos e arquivos gerados; nunca faça commit de senhas ou tokens.',
  },
  analogia: {
    titulo: 'Documento com histórico de versões',
    texto:
      'É como um documento online que guarda todas as versões e deixa você voltar a qualquer ponto. Branches são cópias de trabalho paralelas, e o merge é aceitar as alterações da cópia no documento principal.',
    limites: 'O Git é mais poderoso e mais exigente: conflitos precisam de decisão humana.',
  },
  demo: {
    titulo: 'Juntando dois ramos',
    instrucoes:
      'Execute: o ramo main recebeu o commit c4 e o ramo feature o c3. O merge reúne tudo sem repetir commits comuns. Mude os commits e veja.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const main = ["c1", "c2", "c4"];\nconst feature = ["c1", "c2", "c3"];\nconst merge = [...main];\nfor (const c of feature) {\n  if (!merge.includes(c)) merge.push(c);\n}\nconsole.log("main:", main.join(" "));\nconsole.log("feature:", feature.join(" "));\nconsole.log("após o merge:", merge.join(" "));',
    },
  },
  tecnica: {
    titulo: 'Boas mensagens de commit',
    texto:
      '**Faça:** frases curtas no imperativo: "Corrige o cálculo do frete".\n**Explique o porquê**, não só o quê.\n**Um commit, um assunto.**\n**Evite:** "ajustes", "mudanças", "teste".',
  },
  diagrama: {
    titulo: 'Fluxo com pull request',
    nos: [
      { forma: 'inicio', texto: 'Cria um branch a partir da main' },
      { forma: 'passo', texto: 'Faz commits e dá push' },
      { forma: 'passo', texto: 'Abre o pull request e a equipe revisa' },
      { forma: 'fim', texto: 'Aprovado: merge na main' },
    ],
    descricao: 'A main fica sempre estável.',
  },
  exemplo: {
    titulo: 'Comandos do dia a dia',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'git status\ngit add arquivo.js\ngit commit -m "Corrige validação do e-mail"\ngit log --oneline\ngit switch main\ngit merge feature/login',
    },
    comentarios: [
      { linha: 1, texto: 'Mostra o que mudou.' },
      { linha: 3, texto: 'Salva um ponto no histórico.' },
      { linha: 6, texto: 'Traz o trabalho do outro ramo.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const main = ["c1", "c2", "c4"];\nconst feature = ["c1", "c2", "c3"];\nconst merge = [...new Set([...main, ...feature])];\nconsole.log(merge.length);',
      ['4'],
      'Os commits c1 e c2 são comuns, então o merge tem c1, c2, c4 e c3.',
      [{ resposta: '6', feedback: 'Os commits comuns não se repetem.' }],
    ),
    mc(
      'O que é um branch?',
      'Uma linha de desenvolvimento paralela, um ponteiro para um commit',
      [
        [
          'Uma cópia completa do computador, com todos os arquivos do projeto',
          'É apenas um ponteiro, bem leve.',
        ],
        [
          'Um backup automático do projeto, guardado em um servidor na nuvem',
          'Backup é outra coisa; branches são baratos de criar.',
        ],
      ],
      'Branches são baratos de criar.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const a = ["x", "y"];\nconst b = ["x", "z"];\nconst junto = [...new Set([...a, ...b])];\nconsole.log(junto.join(""));',
      ['xyz'],
      'O "x" comum aparece uma vez.',
      [{ resposta: 'xyxz', feedback: 'O Set remove o repetido.' }],
    ),
    mc(
      'Quando ocorre um conflito de merge?',
      'Quando dois ramos alteram as mesmas linhas de formas diferentes',
      [
        [
          'Sempre que se faz um merge, pois o Git precisa decidir tudo',
          'Muitos merges acontecem sem conflito.',
        ],
        [
          'Quando o computador reinicia durante a execução do comando',
          'Não tem relação: o conflito é de edição das mesmas linhas.',
        ],
      ],
      'O Git precisa que você escolha a versão.',
    ),
  ],
  desafio: programaJs(
    'Escreva mesclar(principal, feature): devolve a lista de commits da principal seguida dos commits da feature que ainda não estão na principal, sem repetir e mantendo a ordem.',
    'function mesclar(principal, feature) {\n  // seu código aqui\n}',
    'function mesclar(principal, feature) {\n  const resultado = [...principal];\n  for (const c of feature) {\n    if (!resultado.includes(c)) resultado.push(c);\n  }\n  return resultado;\n}',
    'mesclar',
    [
      {
        argumentos: [
          ['c1', 'c2', 'c4'],
          ['c1', 'c2', 'c3'],
        ],
        esperado: ['c1', 'c2', 'c4', 'c3'],
      },
      { argumentos: [[], []], esperado: [] },
      { argumentos: [['a'], ['a']], esperado: ['a'] },
    ],
    ['Comece copiando a lista principal.', 'Só acrescente o que ainda não está nela.'],
    'O merge une as histórias sem duplicar o que já existe.',
  ),
  rec: [
    associar(
      'Associe o comando ao que ele faz.',
      [
        ['git commit', 'Salva um ponto no histórico'],
        ['git switch -c', 'Cria e entra em um novo branch'],
        ['git merge', 'Junta o trabalho de outro ramo'],
        ['git push', 'Envia os commits ao repositório remoto'],
      ],
      'Comandos essenciais do Git.',
    ),
    completar(
      'Complete o comando que prepara os arquivos para o commit.',
      'git ___ .',
      [{ aceitas: ['add'], feedback: 'git add coloca as mudanças na área de preparação.' }],
      'Depois vem o commit.',
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem branches e pull requests no trabalho em equipe.',
    modelo:
      'Branches permitem que cada pessoa trabalhe numa tarefa isolada sem afetar a linha principal. O pull request é o pedido para juntar o branch na main, abrindo espaço para revisão e discussão antes do merge, o que mantém a main estável e o histórico claro.',
    rubrica: [
      'Explicou o isolamento dos branches',
      'Explicou o pull request e a revisão',
      'Citou a estabilidade da main',
    ],
  },
  resumo: [
    'Commit = ponto no histórico.',
    'Branch = linha paralela.',
    'Merge junta ramos; conflitos pedem decisão humana.',
    'Nunca versione senhas ou tokens.',
  ],
  cards: [
    ['O que é um commit?', 'Uma fotografia do código com mensagem.'],
    ['O que é um branch?', 'Linha de desenvolvimento paralela.'],
    ['O que é um pull request?', 'Pedido de merge com revisão.'],
    ['Para que serve o .gitignore?', 'Evitar versionar arquivos e segredos.'],
  ],
  conexoes: {
    disciplinas: [
      'Cibersegurança: segredos nunca vão para o repositório.',
      'HTML, CSS e a Web: publicação via GitHub Pages.',
      'Infraestrutura e Servidores: tudo versionado (infraestrutura como código).',
    ],
    profissional: 'Git é pré-requisito em praticamente qualquer vaga de desenvolvimento.',
  },
});
