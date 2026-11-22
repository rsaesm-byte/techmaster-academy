import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const inf03 = montar({
  id: 'infra.m01.a03',
  titulo: 'Virtualização e contêineres',
  objetivo: 'Entender a diferença entre VM e contêiner e como o Docker empacota aplicações.',
  pre: ['infra.m01.a02'],
  min: 30,
  diag: mc(
    '"Na minha máquina funciona, no servidor não." Qual ideia resolve isso empacotando a aplicação com tudo o que ela precisa?',
    'Contêineres',
    [
      ['Mais comentários no código', 'Não resolve a diferença de ambiente.'],
      ['Trocar de linguagem', 'Não é a causa.'],
    ],
    'Mesmo pacote em qualquer lugar.',
  ),
  simples: {
    titulo: 'A marmita da aplicação',
    texto:
      '**Máquina virtual (VM):** simula um computador inteiro, com seu próprio sistema operacional. Isola bem, mas é pesada.\n\n**Contêiner:** isola **apenas o processo** e **compartilha o kernel** do sistema hospedeiro. É leve e inicia em segundos.\n\n**Docker** é a ferramenta mais usada:\n- **Imagem:** o pacote imutável (código + dependências).\n- **Contêiner:** a imagem em execução.\n- **Dockerfile:** receita para montar a imagem.\n- **Registro (registry):** onde as imagens ficam guardadas.\n\n```\nFROM node:22-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["npm", "start"]\n```\n\nO mesmo contêiner roda igual no seu notebook, no servidor e na nuvem.',
    essencial:
      'Contêiner = processo isolado e leve, empacotado em uma imagem. Mesmo pacote em qualquer ambiente. VM é mais pesada e simula um computador inteiro.',
    guiado:
      'Para conteinerizar uma app:\n1. Escreva o Dockerfile.\n2. `docker build -t app .` gera a imagem.\n3. `docker run -p 8080:3000 app` executa.\n4. Envie a imagem ao registro.\n5. Defina limites de memória e CPU.',
    tecnico:
      'Contêineres usam recursos do kernel Linux: **namespaces** (isolam o que o processo enxerga) e **cgroups** (limitam CPU e memória). Por isso, são menos isolados que VMs: uma falha de segurança no kernel afeta todos. Imagens têm **camadas** reaproveitadas pelo cache. Dados que precisam persistir ficam em **volumes**, pois o contêiner é efêmero. Para gerenciar muitos contêineres usa-se um **orquestrador**, como Kubernetes. Rode contêineres como usuário sem privilégios.',
  },
  analogia: {
    titulo: 'Marmita e prato de restaurante',
    texto:
      'A VM é como montar uma cozinha inteira para cada refeição. O contêiner é a marmita: já vem pronta com tudo, e você esquenta em qualquer cozinha, compartilhando fogão e geladeira.',
    limites: 'Como compartilha o kernel, o contêiner isola menos que a VM.',
  },
  demo: {
    titulo: 'Quantos contêineres cabem no servidor',
    instrucoes:
      'Execute: o servidor tem 1024 MB e cada contêiner reserva sua memória. Altere os valores para ver o que cabe.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const memoriaHost = 1024;\nconst pedidos = [512, 256, 512, 128];\nlet livre = memoriaHost;\nlet iniciados = 0;\nfor (const mem of pedidos) {\n  if (mem <= livre) {\n    livre -= mem;\n    iniciados++;\n    console.log("Iniciou contêiner de", mem, "MB. Livre:", livre);\n  } else {\n    console.log("Sem memória para", mem, "MB");\n  }\n}\nconsole.log("Total iniciados:", iniciados);',
    },
  },
  tecnica: {
    titulo: 'VM ou contêiner?',
    texto:
      '**VM:** isolamento forte, sistemas operacionais diferentes, aplicações legadas.\n**Contêiner:** microsserviços, implantações rápidas, ambientes iguais.\nÉ comum combinar: contêineres rodando dentro de VMs na nuvem.',
  },
  diagrama: {
    titulo: 'Do código ao contêiner',
    nos: [
      { forma: 'inicio', texto: 'Dockerfile descreve o ambiente' },
      { forma: 'passo', texto: 'docker build cria a imagem' },
      { forma: 'passo', texto: 'A imagem vai ao registro' },
      { forma: 'fim', texto: 'docker run executa o contêiner em qualquer servidor' },
    ],
    descricao: 'Construa uma vez, rode em qualquer lugar.',
  },
  exemplo: {
    titulo: 'Comandos do Docker',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'docker build -t loja .\ndocker run -d -p 8080:3000 --name loja loja\ndocker ps\ndocker logs loja',
    },
    comentarios: [
      { linha: 1, texto: 'Gera a imagem a partir do Dockerfile.' },
      { linha: 2, texto: 'Executa em segundo plano, expondo a porta 8080.' },
      { linha: 3, texto: 'Lista os contêineres.' },
      { linha: 4, texto: 'Mostra os logs.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'let livre = 1024;\nlet n = 0;\nfor (const m of [512, 256, 512]) {\n  if (m <= livre) {\n    livre -= m;\n    n++;\n  }\n}\nconsole.log(n);',
      ['2'],
      'Cabem 512 e 256; o segundo 512 não cabe nos 256 restantes.',
      [{ resposta: '3', feedback: 'O último não cabe no que sobrou.' }],
    ),
    mc(
      'O que um contêiner compartilha com o hospedeiro?',
      'O kernel do sistema operacional',
      [
        ['Um sistema operacional completo próprio', 'Isso é uma VM.'],
        ['Nada, é uma máquina separada', 'Isso também descreve melhor uma VM.'],
      ],
      'Por isso é leve.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'let livre = 300;\nlet n = 0;\nfor (const m of [200, 50, 50, 50]) {\n  if (m <= livre) {\n    livre -= m;\n    n++;\n  }\n}\nconsole.log(n);',
      ['3'],
      '200, 50 e 50 usam 300; o último 50 não cabe.',
      [{ resposta: '4', feedback: 'Quando livre chega a 0, nada mais cabe.' }],
    ),
    mc(
      'Por que dados importantes devem ficar em volumes?',
      'Porque o contêiner é efêmero e seus dados somem ao ser removido',
      [
        [
          'Porque contêineres não usam disco e guardam tudo só na memória',
          'Eles usam disco, mas de forma temporária.',
        ],
        [
          'Porque volumes são mais lentos e por isso protegem melhor os dados',
          'O motivo é a persistência, e não a velocidade.',
        ],
      ],
      'Contêiner descartável, dado persistente.',
    ),
  ],
  desafio: programaJs(
    'Escreva quantosCabem(memoriaHost, pedidos): percorra os pedidos de memória na ordem; inicie um contêiner se a memória livre comportar e desconte-a; senão pule. Devolva quantos foram iniciados.',
    'function quantosCabem(memoriaHost, pedidos) {\n  // seu código aqui\n}',
    'function quantosCabem(memoriaHost, pedidos) {\n  let livre = memoriaHost;\n  let iniciados = 0;\n  for (const m of pedidos) {\n    if (m <= livre) {\n      livre -= m;\n      iniciados++;\n    }\n  }\n  return iniciados;\n}',
    'quantosCabem',
    [
      { argumentos: [1024, [512, 256, 512]], esperado: 2 },
      { argumentos: [100, []], esperado: 0 },
      { argumentos: [100, [200, 50, 50]], esperado: 2 },
    ],
    [
      'Controle a memória livre numa variável.',
      'Pedidos que não cabem são pulados, não param o laço.',
    ],
    'É o princípio de um agendador de contêineres.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Imagem', 'Pacote imutável com código e dependências'],
        ['Contêiner', 'Imagem em execução, isolada'],
        ['Dockerfile', 'Receita para montar a imagem'],
        ['Volume', 'Armazenamento que sobrevive ao contêiner'],
      ],
      'Vocabulário do Docker.',
    ),
    completar(
      'Complete o comando que executa uma imagem.',
      'docker ___ -p 8080:3000 loja',
      [{ aceitas: ['run'], feedback: 'docker run cria e inicia o contêiner.' }],
      '-p liga as portas.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre VM e contêiner.',
    modelo:
      'A VM simula um computador inteiro com seu próprio sistema operacional, o que isola bem mas pesa mais. O contêiner isola apenas o processo e compartilha o kernel do hospedeiro, sendo leve e rápido de iniciar, mas com isolamento menor. O contêiner empacota a aplicação com as dependências para rodar igual em qualquer lugar.',
    rubrica: [
      'Descreveu a VM',
      'Descreveu o contêiner e o kernel compartilhado',
      'Comparou peso e isolamento',
    ],
  },
  resumo: [
    'Contêiner isola o processo e usa o kernel do host.',
    'Imagem é o pacote; contêiner é a execução.',
    'Dockerfile é a receita.',
    'Dados persistentes ficam em volumes.',
  ],
  cards: [
    ['O que é uma imagem Docker?', 'Pacote imutável da aplicação.'],
    ['O que é um contêiner?', 'Imagem em execução, isolada.'],
    ['O que é Kubernetes?', 'Orquestrador de contêineres.'],
    ['O que limita CPU e memória no Linux?', 'Os cgroups.'],
  ],
  conexoes: {
    disciplinas: [
      'Engenharia de Software: CI/CD constrói e publica imagens.',
      'Cibersegurança: imagens mínimas reduzem a superfície de ataque.',
      'Nuvem: contêineres são a unidade padrão de implantação.',
    ],
    profissional: 'Docker e Kubernetes aparecem em quase toda vaga de DevOps e backend moderno.',
  },
});
