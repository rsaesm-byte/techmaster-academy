import { associar, mc, montar, prever } from './montar';

export const f07 = montar({
  id: 'fundamentos.m02.a02',
  titulo: 'Permissões de arquivo: quem pode o quê',
  objetivo:
    'Ler e montar permissões estilo Linux (rwx), converter entre a forma simbólica e o octal e escolher permissões seguras.',
  pre: ['fundamentos.m01.a01', 'fundamentos.m01.a05'],
  min: 25,
  diag: mc(
    'Num computador com vários usuários, por que nem todo mundo pode abrir ou alterar qualquer arquivo?',
    'Para proteger dados e o sistema: cada arquivo define quem pode ler, alterar ou executar',
    [
      [
        'Porque o computador não aguenta muita gente ao mesmo tempo',
        'O limite não é desempenho, e sim segurança e privacidade.',
      ],
      [
        'Porque arquivos só podem ser abertos uma vez',
        'Podem ser abertos muitas vezes; o que se controla é QUEM pode.',
      ],
    ],
    'Permissões separam o que cada pessoa pode fazer. É a base da privacidade e da segurança em qualquer sistema.',
  ),
  simples: {
    titulo: 'Três pessoas, três poderes',
    texto:
      'Cada arquivo tem permissões para três grupos: o **dono**, o **grupo** do dono e **outros** (todo o resto). Para cada grupo, há três poderes:\n\n- **r** (read): ler o conteúdo\n- **w** (write): alterar ou apagar\n- **x** (execute): executar como programa (ou entrar numa pasta)\n\nEscrevemos como `rwxr-xr--`: os três primeiros símbolos são do dono, os três seguintes do grupo e os três últimos dos outros. Um traço `-` significa "sem essa permissão".',
    essencial:
      'Três grupos (dono, grupo, outros) × três poderes (r, w, x). rwxr-xr-- = dono tudo, grupo lê e executa, outros só leem.',
    guiado:
      'Para ler `rw-r--r--`:\n1. Separe em três de três: `rw-`, `r--`, `r--`.\n2. Dono (`rw-`): lê e altera, não executa.\n3. Grupo (`r--`): só lê.\n4. Outros (`r--`): só leem.',
    tecnico:
      'Cada grupo é um número de 3 bits: r = 4, w = 2, x = 1. A soma forma um dígito octal; `rwxr-xr--` é 754. O comando `chmod 754 arquivo` aplica as permissões e `chown` troca o dono. Em pastas, x significa poder entrar e acessar o conteúdo.',
  },
  analogia: {
    titulo: 'As chaves de um prédio',
    texto:
      'Pense num escritório: o dono tem todas as chaves, os colegas de equipe têm algumas e visitantes quase nenhuma. Cada arquivo é uma sala, e as permissões dizem quem pode entrar para olhar (r), mexer (w) ou usar a máquina da sala (x).',
    limites:
      'Num prédio a chave é física; no sistema, a verificação é feita sempre que alguém tenta acessar. E o administrador (root) pode ignorar as permissões, por isso essa conta deve ser muito protegida.',
  },
  demo: {
    titulo: 'Monte as permissões',
    instrucoes:
      'Clique nos botões r, w e x de cada grupo e observe a soma de cada grupo virar um dígito. Tente montar: (1) 644, o padrão de arquivos de texto; (2) 755, usado em programas; (3) 600, só o dono lê e altera.',
    simulacao: { tipo: 'permissoes', octal: '644' },
  },
  tecnica: {
    titulo: 'Octal e boas práticas',
    texto:
      '**Valores:** r = 4, w = 2, x = 1. Somando: 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--, 0 = ---.\n\n**Casos comuns:**\n- `644` (rw-r--r--): arquivo comum.\n- `755` (rwxr-xr-x): programa ou pasta pública.\n- `600` (rw-------): arquivo privado, como chaves SSH.\n- `777`: todos podem tudo, **evite**: é um risco de segurança.\n\n**Princípio do menor privilégio:** dê somente a permissão necessária, para limitar o estrago em caso de erro ou invasão.\n\n**Veja as permissões:** `ls -l` mostra algo como `-rw-r--r-- 1 aluno aluno 120 notas.txt`.',
  },
  diagrama: {
    titulo: 'Do rwxr-xr-- ao 754',
    nos: [
      { forma: 'inicio', texto: 'Permissões: rwx r-x r--' },
      { forma: 'passo', texto: 'Dono: rwx = 4 + 2 + 1 = 7' },
      { forma: 'passo', texto: 'Grupo: r-x = 4 + 0 + 1 = 5' },
      { forma: 'passo', texto: 'Outros: r-- = 4 + 0 + 0 = 4' },
      { forma: 'fim', texto: 'Juntando os dígitos: 754' },
    ],
    descricao:
      'Cada grupo de três símbolos vira um número somando r como 4, w como 2 e x como 1. O dono rwx dá 7, o grupo r-x dá 5 e os outros r-- dão 4, formando 754.',
  },
  exemplo: {
    titulo: 'Protegendo um arquivo de senhas',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '$ ls -l senhas.txt\n-rw-r--r-- 1 aluno aluno 80 senhas.txt\n$ chmod 600 senhas.txt\n$ ls -l senhas.txt\n-rw------- 1 aluno aluno 80 senhas.txt',
    },
    comentarios: [
      { linha: 2, texto: 'rw-r--r--: qualquer usuário do sistema consegue LER este arquivo.' },
      { linha: 3, texto: 'chmod 600 deixa leitura e escrita só para o dono (6 = rw-, 0 = ---).' },
      { linha: 5, texto: 'Agora só o dono acessa: grupo e outros ficaram sem nenhuma permissão.' },
    ],
  },
  guiado: [
    prever(
      'Quanto é o dígito octal do grupo "r-x"?',
      'r = 4\nw = 2\nx = 1\nr-x = ?',
      ['5'],
      'r (4) + x (1) = 5; o w está desligado.',
      [{ resposta: '7', feedback: '7 seria rwx. Aqui o w está desligado (traço).' }],
    ),
    mc(
      'O que significa o arquivo ter permissão rw-r--r--?',
      'O dono lê e altera; grupo e outros só leem',
      [
        ['Todos podem alterar o arquivo', 'Só o dono tem o w (escrita).'],
        ['O arquivo é um programa executável', 'Não há x em nenhum grupo, então não é executável.'],
      ],
      'rw- para o dono, r-- para o grupo e r-- para os outros.',
    ),
  ],
  indep: [
    prever(
      'Qual é o octal de rwxr-xr-x?',
      'rwx = 7\nr-x = 5\nr-x = 5',
      ['755'],
      'Dono 7, grupo 5 e outros 5: 755.',
      [{ resposta: '777', feedback: '777 daria escrita a todos. Aqui grupo e outros não têm w.' }],
    ),
    mc(
      'Por que evitar chmod 777?',
      'Porque qualquer usuário poderia ler, alterar e executar o arquivo',
      [
        [
          'Porque o comando não existe',
          'O comando existe, e é por isso que é perigoso usá-lo sem necessidade.',
        ],
        ['Porque deixa o computador lento', 'O desempenho não muda; o risco é de segurança.'],
      ],
      'Permissões demais violam o princípio do menor privilégio e facilitam danos acidentais ou ataques.',
      1,
    ),
  ],
  desafio: associar(
    'Associe cada permissão em octal ao que ela significa.',
    [
      ['600', 'Só o dono lê e altera'],
      ['644', 'Dono lê e altera; os demais só leem'],
      ['755', 'Dono faz tudo; os demais leem e executam'],
      ['000', 'Ninguém tem permissão'],
    ],
    '6 = rw-, 4 = r--, 5 = r-x, 7 = rwx, 0 = ---: cada dígito descreve um grupo.',
  ),
  rec: [
    mc(
      'Quais são os pesos de r, w e x nas permissões octais?',
      'r = 4, w = 2, x = 1',
      [
        ['r = 1, w = 2, x = 3', 'Os pesos são potências de 2 (4, 2, 1), como nos bits.'],
        ['r = 1, w = 4, x = 2', 'A ordem é r = 4, w = 2, x = 1.'],
      ],
      'Cada permissão é um bit: 4 (100), 2 (010) e 1 (001). Daí a soma formar o dígito octal.',
    ),
    mc(
      'O princípio do menor privilégio recomenda:',
      'Dar a cada pessoa apenas as permissões de que realmente precisa',
      [
        ['Dar a todos todas as permissões, para evitar chamados', 'Isso aumenta muito o risco.'],
        [
          'Negar permissões ao dono do arquivo',
          'O dono costuma precisar de acesso; o foco é limitar o resto.',
        ],
      ],
      'Quanto menos poder cada conta tem, menor o dano de um erro ou de uma invasão.',
      2,
    ),
  ],
  explique: {
    enunciado:
      'Explique por que as permissões do Linux combinam com o que você aprendeu sobre binário.',
    modelo:
      'Cada permissão é um bit ligado ou desligado, com peso 4, 2 e 1. Somando os pesos dos bits ligados de cada grupo, obtém-se um dígito de 0 a 7. Por isso rwx vale 7 e r-- vale 4.',
    rubrica: [
      'Disse que cada permissão é um bit ligado ou desligado',
      'Citou os pesos 4, 2 e 1',
      'Explicou que a soma gera o dígito octal',
    ],
  },
  resumo: [
    'Três grupos (dono, grupo, outros) × três poderes (r, w, x).',
    'r = 4, w = 2, x = 1: a soma de cada grupo forma um dígito octal (754).',
    '644 para arquivos, 755 para programas e 600 para o que é privado.',
    'Evite 777 e siga o princípio do menor privilégio.',
  ],
  cards: [
    ['O que significa rwx?', 'Ler (r), escrever (w) e executar (x).'],
    ['Quais são os três grupos de permissão?', 'Dono, grupo e outros.'],
    ['Quanto vale r-x em octal?', '5 (4 + 1).'],
    ['Qual comando muda as permissões?', 'chmod'],
  ],
  conexoes: {
    disciplinas: [
      'Segurança: permissões mal configuradas estão entre as falhas mais comuns em servidores.',
      'Sistemas Operacionais: Windows usa listas de controle de acesso (ACLs), com a mesma ideia.',
      'Banco de Dados: usuários também recebem permissões de leitura e escrita em tabelas.',
    ],
    profissional:
      'Quando um site mostra "403 Forbidden" ou um script falha com "permission denied", a causa quase sempre é uma permissão. Saber ler rwx acelera o diagnóstico.',
  },
});
