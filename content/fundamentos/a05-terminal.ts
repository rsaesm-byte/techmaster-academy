import { associar, completar, mc, montar, prever } from './montar';

export const f05 = montar({
  id: 'fundamentos.m01.a05',
  titulo: 'Arquivos e terminal: conversando com o sistema',
  objetivo:
    'Entender como arquivos e pastas se organizam em árvore e usar comandos básicos de terminal (pwd, ls, cd, mkdir, cat, echo, cp, mv, rm) para navegar e criar arquivos.',
  pre: ['fundamentos.m01.a02'],
  min: 35,
  diag: mc(
    'O que é o terminal?',
    'Uma tela em que você dá ordens ao computador digitando comandos',
    [
      [
        'Um programa que só serve para programadores avançados',
        'Qualquer pessoa pode usá-lo; profissionais de TI usam todos os dias.',
      ],
      [
        'Outro nome para o navegador de internet',
        'São coisas diferentes: o terminal executa comandos do sistema.',
      ],
    ],
    'O terminal (ou linha de comando) é uma interface por texto: você digita o que quer e o sistema responde.',
  ),
  simples: {
    titulo: 'Pastas dentro de pastas',
    texto:
      'Os arquivos do computador ficam organizados como uma **árvore**: uma **raiz** (`/` no Linux) com pastas dentro de pastas. O endereço completo de um arquivo é o seu **caminho**, como `/home/aluno/documentos/notas.txt`.\n\nNo **terminal**, você interage digitando **comandos**. Você sempre está "dentro" de uma pasta (o diretório atual). Os mais usados: `pwd` (onde estou), `ls` (o que há aqui), `cd` (entrar em outra pasta), `mkdir` (criar pasta), `cat` (ler arquivo).\n\nAtalhos de caminho: `..` é a pasta de cima, `.` é a pasta atual e `~` é a sua pasta pessoal.',
    essencial:
      'Arquivos formam uma árvore a partir da raiz (/). Caminho = endereço. pwd, ls, cd, mkdir, cat. ".." sobe, "~" vai para casa.',
    guiado:
      'Para achar e ler um arquivo:\n1. `pwd` mostra onde você está.\n2. `ls` lista o que há na pasta.\n3. `cd nome` entra na pasta desejada.\n4. `cat arquivo.txt` mostra o conteúdo.\n5. `cd ..` volta uma pasta.',
    tecnico:
      'O terminal executa um shell (como bash), que interpreta comandos, argumentos e opções. Caminhos podem ser absolutos (iniciam em /) ou relativos ao diretório atual. O operador > redireciona a saída de um comando para um arquivo (sobrescrevendo) e >> acrescenta ao final. Comandos como rm apagam definitivamente, sem lixeira.',
  },
  analogia: {
    titulo: 'Um prédio com andares e salas',
    texto:
      'Pense num prédio: a entrada é a raiz; cada andar é uma pasta; cada sala dentro dele pode ser outra pasta ou um arquivo. O caminho é o endereço completo ("prédio, 3º andar, sala 302"). `cd` é pegar o elevador, `ls` é olhar a placa dos andares e `pwd` é perguntar "em que andar estou?".',
    limites:
      'Num prédio, você anda de verdade. No computador, `cd` só muda o "ponto de vista" do terminal. E, ao contrário de uma sala esquecida, um arquivo apagado com `rm` não vai para a lixeira.',
  },
  demo: {
    titulo: 'Explore o terminal simulado',
    instrucoes:
      'Digite `help` para ver os comandos. Cumpra as duas missões: entrar em projetos/site e voltar para casa. Depois explore à vontade: use `ls`, `cat ola.txt`, `mkdir` e `echo "oi" > teste.txt`. Aqui você não consegue quebrar nada.',
    simulacao: { tipo: 'terminal', cenario: 'navegar' },
  },
  tecnica: {
    titulo: 'Comandos que todo profissional de TI usa',
    texto:
      '**Navegar:** `pwd`, `ls`, `cd pasta`, `cd ..`, `cd ~`.\n\n**Criar:** `mkdir pasta` cria pasta; `touch arquivo` cria arquivo vazio.\n\n**Ler e escrever:** `cat arquivo` mostra o conteúdo; `echo "texto" > arquivo` escreve (apaga o que havia); `echo "mais" >> arquivo` acrescenta.\n\n**Copiar, mover, apagar:** `cp origem destino`, `mv origem destino` (também renomeia) e `rm arquivo`. Para pastas: `rm -r pasta`.\n\n**Cuidado:** não há lixeira. Antes de apagar, confirme com `pwd` e `ls` onde você está.',
  },
  diagrama: {
    titulo: 'Uma árvore de pastas',
    nos: [
      { forma: 'inicio', texto: '/ (raiz)' },
      { forma: 'passo', texto: '/home/aluno (sua pasta pessoal, também escrita ~)' },
      { forma: 'passo', texto: '/home/aluno/documentos (pasta com arquivos como notas.txt)' },
      { forma: 'fim', texto: 'Caminho do arquivo: /home/aluno/documentos/notas.txt' },
    ],
    descricao:
      'A raiz, escrita como barra, contém a pasta home. Dentro dela fica a pasta pessoal do usuário aluno, e dentro dela a pasta documentos, que guarda o arquivo notas.txt. O caminho completo junta todos os nomes separados por barras.',
  },
  exemplo: {
    titulo: 'Criando uma pasta com um arquivo',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '$ pwd\n/home/aluno\n$ mkdir estudos\n$ cd estudos\n$ echo "redes às 19h" > agenda.txt\n$ cat agenda.txt\nredes às 19h',
    },
    comentarios: [
      { linha: 1, texto: 'Começa na pasta pessoal.' },
      { linha: 3, texto: 'Cria a pasta estudos dentro da pasta atual.' },
      { linha: 4, texto: 'Entra nela. Agora o diretório atual é /home/aluno/estudos.' },
      { linha: 5, texto: 'O símbolo > grava o texto em um arquivo novo.' },
      { linha: 6, texto: 'cat confirma o conteúdo gravado.' },
    ],
  },
  guiado: [
    prever(
      'Você está em /home/aluno. Qual é a saída do último comando?',
      '$ pwd\n/home/aluno\n$ cd documentos\n$ pwd',
      ['/home/aluno/documentos'],
      'cd documentos entra na pasta documentos, que está dentro da atual. O pwd mostra o caminho completo.',
      [
        {
          resposta: '/home/aluno',
          feedback: 'Esse era o caminho antes do cd. O cd mudou o diretório atual.',
        },
      ],
    ),
    mc(
      'O que faz o comando `cd ..`?',
      'Volta para a pasta de cima',
      [
        [
          'Entra numa pasta chamada ".."',
          'Os dois pontos são um atalho especial: significam a pasta pai.',
        ],
        ['Lista todas as pastas', 'Quem lista é o ls; cd só muda de pasta.'],
      ],
      'Dois pontos representam a pasta pai. cd .. sobe um nível na árvore.',
    ),
  ],
  indep: [
    completar(
      'Complete os comandos para criar a pasta "fotos" e entrar nela.',
      '$ ___ fotos\n$ ___ fotos\n$ pwd',
      [
        { aceitas: ['mkdir'], feedback: 'Quem cria pastas é o mkdir ("make directory").' },
        { aceitas: ['cd'], feedback: 'Para entrar em uma pasta, use cd ("change directory").' },
      ],
      'mkdir cria a pasta e cd entra nela. O pwd então mostraria .../fotos.',
    ),
    prever(
      'O que o último comando mostra?',
      '$ echo "ola" > a.txt\n$ cat a.txt',
      ['ola'],
      'echo grava o texto no arquivo a.txt e o cat mostra o que está dentro dele.',
      [{ resposta: 'a.txt', feedback: 'O cat mostra o CONTEÚDO do arquivo, não o nome dele.' }],
    ),
  ],
  desafio: associar(
    'Associe cada comando ao que ele faz.',
    [
      ['pwd', 'Mostra em qual pasta você está'],
      ['ls', 'Lista o conteúdo da pasta'],
      ['cat', 'Mostra o conteúdo de um arquivo'],
      ['rm', 'Apaga um arquivo, sem lixeira'],
    ],
    'pwd = onde estou; ls = o que há aqui; cat = ler arquivo; rm = apagar (definitivamente).',
  ),
  rec: [
    mc(
      'Qual é a diferença entre `>` e `>>` ao usar echo com um arquivo?',
      '> sobrescreve o arquivo; >> acrescenta ao final',
      [
        ['São idênticos', 'Têm efeitos diferentes: um apaga o que havia, o outro acrescenta.'],
        ['> acrescenta e >> sobrescreve', 'É o contrário: o ">" simples sobrescreve.'],
      ],
      'Com > o conteúdo antigo é substituído. Com >> o novo texto é adicionado depois do que já existia.',
      2,
    ),
    mc(
      'Por que é importante conferir com pwd e ls antes de usar rm?',
      'Porque rm apaga de forma definitiva, sem lixeira',
      [
        [
          'Porque rm só funciona na pasta certa',
          'O rm funciona em qualquer pasta, e é isso que o torna perigoso.',
        ],
        [
          'Porque o terminal avisa quando você está errado',
          'O terminal costuma obedecer sem perguntar.',
        ],
      ],
      'Sem lixeira, um arquivo apagado no lugar errado pode ser difícil de recuperar. Confirmar onde você está evita acidentes.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é um caminho de arquivo e dê um exemplo.',
    modelo:
      'O caminho é o endereço de um arquivo na árvore de pastas, listando as pastas separadas por barras a partir da raiz. Por exemplo, /home/aluno/documentos/notas.txt é o arquivo notas.txt, dentro da pasta documentos, dentro de aluno, dentro de home.',
    rubrica: [
      'Disse que o caminho é o endereço do arquivo',
      'Mencionou pastas separadas por barras',
      'Deu um exemplo coerente',
    ],
  },
  resumo: [
    'Arquivos ficam numa árvore de pastas que começa na raiz (/); o caminho é o endereço.',
    'pwd mostra onde você está; ls lista; cd muda de pasta; mkdir cria pasta; cat lê arquivo.',
    '".." é a pasta de cima e "~" é a sua pasta pessoal.',
    'rm apaga sem lixeira: confira pwd e ls antes.',
  ],
  cards: [
    ['O que faz o comando pwd?', 'Mostra o caminho da pasta atual.'],
    [
      'O que significam ".." e "~" num caminho?',
      '".." é a pasta de cima; "~" é a sua pasta pessoal.',
    ],
    ['Como criar uma pasta pelo terminal?', 'mkdir nome-da-pasta'],
    ['Por que ter cuidado com rm?', 'Ele apaga em definitivo, sem lixeira.'],
  ],
  conexoes: {
    disciplinas: [
      'Sistemas Operacionais: Linux, macOS e o PowerShell do Windows têm comandos equivalentes.',
      'Desenvolvimento: Git, npm e Python são usados pelo terminal.',
      'Segurança: administradores e analistas inspecionam sistemas e logs por linha de comando.',
    ],
    profissional:
      'No suporte e na infraestrutura, o terminal é a ferramenta mais rápida para investigar um problema, repetir tarefas em várias máquinas e automatizar rotinas. Quem domina o básico já se destaca.',
  },
});
