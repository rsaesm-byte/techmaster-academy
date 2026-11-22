import { associar, completar, mc, montar, ordenar, prever } from './montar';

export const f19 = montar({
  id: 'fundamentos.m04.a04',
  titulo: 'Versionamento com Git',
  objetivo: 'Entender commits, branches e o fluxo básico do Git e do GitHub.',
  pre: ['fundamentos.m01.a05'],
  min: 30,
  diag: mc(
    'Para que serve o Git?',
    'Registrar o histórico de mudanças de um projeto e permitir voltar no tempo',
    [
      [
        'Hospedar o site e publicar automaticamente cada alteração feita',
        'Isso é função de serviços de hospedagem; o Git guarda o histórico.',
      ],
      [
        'Compilar os programas e gerar os arquivos executáveis do projeto',
        'Compilar é papel do compilador; o Git versiona.',
      ],
    ],
    'Git guarda versões do projeto, quem mudou o quê e quando.',
  ),
  simples: {
    titulo: 'Um álbum de fotos do projeto',
    texto:
      'O **Git** tira "fotos" do seu projeto, chamadas **commits**. Cada commit guarda o estado dos arquivos e uma mensagem. Você pode voltar a qualquer foto, comparar versões e trabalhar em equipe.\n\n- **Repositório:** a pasta do projeto com todo o histórico.\n- **Commit:** um ponto salvo do histórico.\n- **Branch:** uma linha paralela de trabalho.\n- **GitHub:** site que hospeda repositórios Git.\n\nFluxo básico: `git add` (separa mudanças) → `git commit` (salva) → `git push` (envia).',
    essencial:
      'Git guarda o histórico em commits. Branches permitem trabalhos paralelos. add → commit → push.',
    guiado:
      'Para salvar uma mudança:\n1. `git status` mostra o que mudou.\n2. `git add arquivo` seleciona.\n3. `git commit -m "mensagem clara"` registra.\n4. `git push` envia ao GitHub.',
    tecnico:
      'Cada commit é identificado por um hash (SHA) calculado a partir do conteúdo, autor, data e commit anterior; por isso alterar o passado muda todos os hashes seguintes. Branches são ponteiros leves para commits. `merge` junta branches; conflitos aparecem quando duas pessoas mudam as mesmas linhas. O Git é distribuído: cada cópia tem o histórico completo.',
  },
  analogia: {
    titulo: 'Pontos de salvamento de um jogo',
    texto:
      'Cada commit é um ponto de salvamento. Se algo der errado, você volta ao último. Uma branch é uma "linha do tempo alternativa" para testar uma ideia sem arriscar o jogo principal.',
    limites:
      'No jogo você joga sozinho; no Git várias pessoas salvam ao mesmo tempo, então precisam juntar (merge) os trabalhos.',
  },
  demo: {
    titulo: 'Um histórico em código',
    instrucoes:
      'Execute e veja como um histórico é uma lista encadeada de commits. Adicione um commit e mostre o histórico de trás para frente.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const historico = [];\nfunction commit(mensagem) {\n  const pai = historico.length > 0 ? historico[historico.length - 1].id : null;\n  historico.push({ id: historico.length + 1, mensagem, pai });\n}\ncommit("primeira versão");\ncommit("adiciona login");\ncommit("corrige erro");\nfor (const c of historico) {\n  console.log(`#${c.id} ${c.mensagem} (pai: ${c.pai})`);\n}',
    },
  },
  tecnica: {
    titulo: 'Comandos essenciais',
    texto:
      '`git init` cria um repositório.\n`git status` mostra o estado.\n`git add .` separa tudo.\n`git commit -m "msg"` salva.\n`git log` mostra o histórico.\n`git branch nome` / `git switch nome` criam e trocam de branch.\n`git merge nome` junta.\n`git push` / `git pull` enviam e trazem.\n**Boa mensagem:** curta e no imperativo ("corrige cálculo de desconto").',
  },
  diagrama: {
    titulo: 'Fluxo do Git',
    nos: [
      { forma: 'inicio', texto: 'Edita os arquivos' },
      { forma: 'passo', texto: 'git add: escolhe o que entra no commit' },
      { forma: 'passo', texto: 'git commit: salva o ponto no histórico local' },
      { forma: 'fim', texto: 'git push: envia ao GitHub' },
    ],
    descricao:
      'As mudanças são escolhidas, salvas localmente em um commit e depois enviadas ao servidor.',
  },
  exemplo: {
    titulo: 'Trabalhando em uma branch',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'git switch -c nova-funcionalidade\n# edita arquivos\ngit add .\ngit commit -m "adiciona busca"\ngit switch main\ngit merge nova-funcionalidade',
    },
    comentarios: [
      { linha: 1, texto: 'Cria e entra na branch de trabalho.' },
      { linha: 4, texto: 'Registra a mudança só nessa branch.' },
      { linha: 6, texto: 'Traz o trabalho pronto para a principal.' },
    ],
  },
  guiado: [
    mc(
      'O que é um commit?',
      'Um ponto salvo do histórico, com uma mensagem',
      [
        [
          'Uma cópia do projeto em outra pasta',
          'É um registro dentro do histórico do repositório.',
        ],
        ['Um erro no código', 'Não tem relação com erros.'],
      ],
      'Cada commit é uma versão do projeto que dá para recuperar.',
    ),
    prever(
      'Qual comando envia os commits locais ao GitHub?',
      'git ___',
      ['push'],
      'git push envia seus commits ao repositório remoto.',
      [{ resposta: 'pull', feedback: 'pull traz mudanças; push é quem envia.' }],
    ),
  ],
  indep: [
    completar(
      'Complete o fluxo para salvar a mudança do arquivo app.js.',
      'git ___ app.js\ngit ___ -m "corrige erro"',
      [
        { aceitas: ['add'], feedback: 'add separa a mudança para o commit.' },
        { aceitas: ['commit'], feedback: 'commit registra o ponto no histórico.' },
      ],
      'Primeiro add, depois commit.',
    ),
    ordenar(
      'Ordene o fluxo básico.',
      ['Editar os arquivos', 'git add', 'git commit -m "mensagem"', 'git push'],
      'Editar, separar, salvar e enviar.',
    ),
  ],
  desafio: associar(
    'Associe cada termo à descrição.',
    [
      ['Repositório', 'Pasta do projeto com todo o histórico'],
      ['Branch', 'Linha paralela de trabalho'],
      ['Merge', 'Junção de duas linhas de trabalho'],
      ['Conflito', 'Duas mudanças nas mesmas linhas que o Git não sabe juntar sozinho'],
    ],
    'Esses são os conceitos que mais aparecem no dia a dia.',
  ),
  rec: [
    mc(
      'Qual é a diferença entre Git e GitHub?',
      'Git é a ferramenta de versionamento; GitHub é um site que hospeda repositórios Git',
      [
        [
          'Os dois são o mesmo produto, com nomes diferentes em cada empresa',
          'Git é a ferramenta; GitHub é um serviço que a usa.',
        ],
        [
          'O GitHub é um editor de código com o Git embutido para programar',
          'GitHub hospeda repositórios; editores são outro tipo de programa.',
        ],
      ],
      'Existem outros serviços, como GitLab e Bitbucket.',
    ),
    mc(
      'Para que serve uma branch?',
      'Trabalhar em uma mudança sem afetar a linha principal',
      [
        [
          'Apagar o histórico antigo do projeto para recomeçar do zero',
          'A branch não apaga nada: cria uma linha paralela.',
        ],
        [
          'Criar um novo repositório separado, com histórico próprio',
          'A branch fica no mesmo repositório.',
        ],
      ],
      'Quando pronta, a branch é juntada com merge.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem commits e branches.',
    modelo:
      'Commits registram pontos do histórico do projeto, permitindo voltar e entender o que mudou. Branches são linhas paralelas de trabalho que permitem desenvolver algo novo sem afetar a versão principal até o merge.',
    rubrica: [
      'Explicou commits como registros do histórico',
      'Explicou branches como linhas paralelas',
      'Citou o merge ou a proteção da versão principal',
    ],
  },
  resumo: [
    'Git guarda o histórico em commits.',
    'Branches permitem trabalho paralelo.',
    'add → commit → push.',
    'Git é a ferramenta; GitHub é o serviço.',
  ],
  cards: [
    ['O que é um commit?', 'Ponto salvo do histórico.'],
    ['O que é uma branch?', 'Linha paralela de trabalho.'],
    ['O que faz git push?', 'Envia commits ao repositório remoto.'],
    ['Qual a diferença entre Git e GitHub?', 'Ferramenta × serviço de hospedagem.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação (Arquivos e terminal): o Git é usado pela linha de comando.',
      'Engenharia de Software (Versionamento com Git): aprofunde branches, merge, conflitos e pull request, a base da revisão de código.',
      'DevOps: pipelines rodam a cada push.',
    ],
    profissional:
      'Toda equipe de software usa Git. Um portfólio no GitHub é, muitas vezes, o primeiro cartão de visita de quem busca vaga.',
  },
});
