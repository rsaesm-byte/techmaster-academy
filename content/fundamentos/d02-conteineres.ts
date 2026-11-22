import { associar, completar, mc, montar, prever } from './montar';

export const f17 = montar({
  id: 'fundamentos.m04.a02',
  titulo: 'Contêineres e Docker',
  objetivo:
    'Entender o que é um contêiner, como difere de uma VM e como imagens e contêineres se relacionam.',
  pre: ['fundamentos.m04.a01'],
  min: 30,
  diag: mc(
    'O que um contêiner compartilha com o computador que o hospeda?',
    'O núcleo (kernel) do sistema operacional',
    [
      ['O hardware inteiro, sem isolamento', 'O isolamento é justamente o objetivo.'],
      ['Nada, é um computador completo à parte', 'Isso descreve uma VM.'],
    ],
    'Contêineres compartilham o kernel e isolam apenas processos, arquivos e rede.',
  ),
  simples: {
    titulo: 'Marmita pronta em vez de cozinha inteira',
    texto:
      'Uma VM leva um sistema operacional completo. Um **contêiner** leva só o programa e o que ele precisa (bibliotecas, configurações), compartilhando o **kernel** do computador. Por isso é **leve** e inicia em segundos.\n\n- **Imagem:** o "molde" imutável com o programa e dependências.\n- **Contêiner:** uma imagem em execução.\n- **Docker:** a ferramenta mais conhecida.\n\nA promessa: "funciona na minha máquina" passa a funcionar em qualquer lugar.',
    essencial:
      'Contêiner empacota o programa e suas dependências, compartilha o kernel e é mais leve que uma VM.',
    guiado:
      'Fluxo básico:\n1. Escreva um `Dockerfile` descrevendo o ambiente.\n2. Construa a imagem: `docker build`.\n3. Rode: `docker run`.\n4. Tenha vários contêineres da mesma imagem.',
    tecnico:
      'Contêineres usam recursos do kernel Linux: namespaces (isolam processos, rede e arquivos) e cgroups (limitam CPU e memória). Imagens são em camadas, reaproveitadas entre si. Um contêiner descartável não guarda dados ao ser removido; dados persistentes ficam em volumes. Kubernetes orquestra muitos contêineres em muitos servidores.',
  },
  analogia: {
    titulo: 'Marmitas padronizadas',
    texto:
      'A imagem é a receita congelada; o contêiner é a marmita aquecida e servida. Todas saem iguais, em qualquer cozinha, e não precisam montar uma cozinha completa (VM) para cada refeição.',
    limites:
      'Como compartilham o kernel, contêineres isolam menos que VMs: uma falha grave de segurança no kernel afeta todos.',
  },
  demo: {
    titulo: 'Explore o terminal',
    instrucoes:
      'Contêineres são controlados por linha de comando. Treine navegação no terminal simulado: crie uma pasta "app" e um arquivo nela, como se montasse o contexto de uma imagem.',
    simulacao: { tipo: 'terminal', cenario: 'livre' },
  },
  tecnica: {
    titulo: 'Dockerfile e comandos',
    texto:
      '**Dockerfile mínimo:**\n```\nFROM node:22\nCOPY . /app\nCMD ["node", "/app/index.js"]\n```\n**Comandos:** `docker build -t meuapp .`, `docker run meuapp`, `docker ps` (lista rodando), `docker stop`.\n**VM x contêiner:** VM isola mais, contêiner é mais leve e rápido.',
  },
  diagrama: {
    titulo: 'Da receita ao contêiner',
    nos: [
      { forma: 'inicio', texto: 'Dockerfile descreve o ambiente' },
      { forma: 'passo', texto: 'docker build gera a imagem' },
      { forma: 'passo', texto: 'docker run cria um contêiner a partir da imagem' },
      { forma: 'fim', texto: 'O programa roda isolado, igual em qualquer máquina' },
    ],
    descricao: 'O Dockerfile gera a imagem, e a imagem gera quantos contêineres forem necessários.',
  },
  exemplo: {
    titulo: 'Um Dockerfile comentado',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'FROM python:3.12\nCOPY . /app\nRUN pip install -r /app/requisitos.txt\nCMD python /app/main.py',
    },
    comentarios: [
      { linha: 1, texto: 'Parte de uma imagem base que já tem Python.' },
      { linha: 2, texto: 'Copia o código para dentro da imagem.' },
      { linha: 3, texto: 'Instala as dependências.' },
      { linha: 4, texto: 'Comando executado ao iniciar o contêiner.' },
    ],
  },
  guiado: [
    mc(
      'Qual é a relação entre imagem e contêiner?',
      'O contêiner é uma imagem em execução',
      [
        ['São a mesma coisa', 'A imagem é o molde; o contêiner é a execução.'],
        ['A imagem é criada a partir do contêiner', 'É o contrário.'],
      ],
      'De uma imagem podem sair muitos contêineres.',
    ),
    prever(
      'Qual comando lista os contêineres em execução?',
      'docker ___',
      ['ps'],
      'docker ps lista os contêineres em execução.',
      [{ resposta: 'ls', feedback: 'Em Docker, o comando clássico é ps.' }],
    ),
  ],
  indep: [
    completar(
      'Complete o Dockerfile para partir de uma imagem Node e iniciar o app.',
      '___ node:22\nCOPY . /app\n___ ["node", "/app/index.js"]',
      [
        { aceitas: ['FROM'], feedback: 'FROM define a imagem base.' },
        { aceitas: ['CMD'], feedback: 'CMD define o comando de início.' },
      ],
      'FROM escolhe a base; CMD diz o que rodar.',
    ),
    mc(
      'Qual a principal vantagem do contêiner sobre a VM?',
      'É mais leve e inicia mais rápido',
      [
        ['Isola melhor que a VM', 'Em geral a VM isola mais.'],
        ['Não precisa de kernel nenhum', 'Ele usa o kernel do host.'],
      ],
      'Sem sistema operacional completo por contêiner, sobra mais recurso.',
    ),
  ],
  desafio: associar(
    'Associe cada termo ao seu significado.',
    [
      ['Imagem', 'Molde imutável com o programa e dependências'],
      ['Contêiner', 'Imagem em execução, isolada'],
      ['Dockerfile', 'Receita que descreve como montar a imagem'],
      ['Volume', 'Local para guardar dados que sobrevivem ao contêiner'],
    ],
    'Esses conceitos aparecem em qualquer projeto com Docker.',
  ),
  rec: [
    mc(
      'O que acontece com os dados dentro de um contêiner removido, sem volume?',
      'Eles são perdidos',
      [
        ['Ficam salvos automaticamente na imagem', 'A imagem não muda.'],
        ['Vão para a nuvem', 'Não há envio automático.'],
      ],
      'Dados importantes devem ir para volumes.',
    ),
    mc(
      'O que são namespaces e cgroups?',
      'Recursos do kernel que isolam e limitam os contêineres',
      [
        [
          'Formatos de arquivo usados para guardar imagens de contêiner',
          'Namespaces e cgroups fazem parte do kernel, não são formatos.',
        ],
        [
          'Comandos usados no Docker para criar e parar os contêineres',
          'São recursos do kernel Linux, e não comandos do Docker.',
        ],
      ],
      'Namespaces isolam; cgroups limitam CPU e memória.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre uma máquina virtual e um contêiner.',
    modelo:
      'Uma VM inclui um sistema operacional completo e é isolada por um hipervisor, sendo mais pesada. Um contêiner empacota só o programa e suas dependências e compartilha o kernel do host, o que o torna mais leve e rápido.',
    rubrica: [
      'Disse que a VM traz sistema operacional completo',
      'Disse que o contêiner compartilha o kernel',
      'Concluiu que o contêiner é mais leve',
    ],
  },
  resumo: [
    'Contêiner empacota programa e dependências.',
    'Compartilha o kernel; é leve e rápido.',
    'Imagem é o molde; contêiner é a execução.',
    'Dados persistentes ficam em volumes.',
  ],
  cards: [
    [
      'O que é um contêiner?',
      'Programa empacotado com dependências, isolado, compartilhando o kernel.',
    ],
    ['O que é uma imagem?', 'Molde imutável usado para criar contêineres.'],
    ['O que é um Dockerfile?', 'Receita para construir uma imagem.'],
    ['Onde guardar dados persistentes?', 'Em volumes.'],
  ],
  conexoes: {
    disciplinas: [
      'Infraestrutura e Servidores: contêineres são a alternativa leve às VMs.',
      'Infraestrutura e Servidores: serviços de nuvem executam contêineres.',
      'DevOps: contêineres padronizam o ambiente entre desenvolvimento e produção.',
    ],
    profissional:
      'Docker é ferramenta do dia a dia em desenvolvimento e infraestrutura. Quase toda vaga de back-end, dados ou DevOps pede esse conhecimento.',
  },
});
