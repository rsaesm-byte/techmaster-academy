import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const c01 = montar({
  id: 'ciberseguranca.m01.a01',
  titulo: 'A tríade CIA e o modelo de ameaças',
  objetivo:
    'Entender confidencialidade, integridade e disponibilidade e raciocinar sobre ativos, ameaças e riscos.',
  pre: ['redes.m01.a05'],
  min: 25,
  diag: mc(
    'Um ataque que tira um site do ar atinge qual pilar da segurança?',
    'Disponibilidade',
    [
      ['Confidencialidade', 'Esse pilar trata de quem pode ver os dados.'],
      ['Integridade', 'Esse pilar trata de os dados não serem alterados.'],
    ],
    'Disponibilidade: os sistemas precisam estar acessíveis quando necessários.',
  ),
  simples: {
    titulo: 'Os três pilares',
    texto:
      'A segurança da informação se apoia em três pilares, a **tríade CIA**:\n\n- **Confidencialidade:** só quem deve, vê. (Ex.: criptografia, controle de acesso.)\n- **Integridade:** os dados não são alterados sem autorização. (Ex.: assinaturas, hashes.)\n- **Disponibilidade:** o sistema funciona quando preciso. (Ex.: backups, redundância.)\n\nPara proteger algo, pergunte: **o que** tenho de valioso (ativo), **de quem ou do quê** preciso proteger (ameaça), **por onde** podem entrar (vulnerabilidade) e **quanto custaria** se acontecesse (impacto).',
    essencial:
      'CIA: confidencialidade, integridade, disponibilidade. Risco = ameaça × vulnerabilidade × impacto.',
    guiado:
      'Para analisar um sistema:\n1. Liste os ativos (dados de clientes, servidor, senhas).\n2. Para cada um, imagine ameaças (vazamento, adulteração, queda).\n3. Veja que pilar da CIA cada ameaça atinge.\n4. Escolha defesas proporcionais ao risco.',
    tecnico:
      '**Ameaça** é o que pode causar dano (um atacante, um erro, um incêndio); **vulnerabilidade** é a fraqueza explorada (software desatualizado, senha fraca); **risco** é a chance de uma ameaça explorar uma vulnerabilidade, multiplicada pelo impacto. Os riscos podem ser **mitigados**, **transferidos** (seguro), **aceitos** ou **evitados**. A **defesa em profundidade** usa várias camadas (rede, host, aplicação, pessoas), de modo que a falha de uma não derrube tudo. Outros conceitos: **autenticidade** e **não repúdio**.',
  },
  analogia: {
    titulo: 'Proteger uma casa',
    texto:
      'Confidencialidade é a cortina fechada (ninguém vê dentro), integridade é o lacre na porta (você percebe se alguém mexeu), e disponibilidade é ter a chave e a luz funcionando quando você volta. Ladrões são ameaças; uma janela destrancada é a vulnerabilidade.',
    limites:
      'Na casa você vê o problema; em sistemas muitas falhas são invisíveis até serem exploradas.',
  },
  demo: {
    titulo: 'Classificando incidentes',
    instrucoes:
      'Execute e veja cada incidente associado ao pilar atingido. Acrescente outros incidentes na lista.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const incidentes = [\n  { texto: "Banco de clientes vazou na internet", pilar: "Confidencialidade" },\n  { texto: "Alguém alterou o valor de uma fatura", pilar: "Integridade" },\n  { texto: "Site fora do ar por ataque de negação de serviço", pilar: "Disponibilidade" },\n  { texto: "Ransomware cifrou o servidor de arquivos", pilar: "Disponibilidade e Confidencialidade" },\n];\nfor (const i of incidentes) {\n  console.log(i.pilar + " <- " + i.texto);\n}',
    },
  },
  tecnica: {
    titulo: 'Defesas por pilar',
    texto:
      '**Confidencialidade:** criptografia, controle de acesso, classificação da informação.\n**Integridade:** hashes, assinaturas digitais, controle de versão, logs.\n**Disponibilidade:** backups, redundância, monitoramento, plano de recuperação.\n**Transversais:** autenticação forte, atualizações, treinamento das pessoas.',
  },
  diagrama: {
    titulo: 'Raciocínio de risco',
    nos: [
      { forma: 'inicio', texto: 'Identificar o ativo valioso' },
      { forma: 'passo', texto: 'Listar ameaças e vulnerabilidades' },
      { forma: 'passo', texto: 'Estimar a chance e o impacto' },
      { forma: 'fim', texto: 'Escolher a defesa: mitigar, transferir, aceitar ou evitar' },
    ],
    descricao: 'Proteja mais o que vale mais e o que tem maior risco.',
  },
  exemplo: {
    titulo: 'Loja virtual',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Ativo: cadastro de clientes\nAmeaça: invasor quer vender os dados\nVulnerabilidade: senha de admin fraca\nPilar: confidencialidade\nDefesa: senha forte + segundo fator + criptografia',
    },
    comentarios: [
      { linha: 3, texto: 'A fraqueza é o que o atacante explora.' },
      { linha: 5, texto: 'Várias defesas juntas formam a defesa em profundidade.' },
    ],
  },
  guiado: [
    mc(
      'Alguém altera o valor de um boleto sem autorização. Qual pilar foi violado?',
      'Integridade',
      [
        ['Confidencialidade', 'Os dados não foram expostos, e sim alterados.'],
        ['Disponibilidade', 'O sistema continuou funcionando.'],
      ],
      'Integridade é a garantia de que os dados não foram adulterados.',
    ),
    prever(
      'Quantas combinações tem um PIN de 6 dígitos?',
      'console.log(10 ** 6);',
      ['1000000'],
      '10 possibilidades por dígito, 6 dígitos: 10^6.',
      [{ resposta: '60', feedback: 'O número de combinações cresce de forma exponencial.' }],
    ),
  ],
  indep: [
    mc(
      'Qual defesa protege principalmente a disponibilidade?',
      'Backups e redundância',
      [
        ['Criptografia', 'Criptografia protege a confidencialidade.'],
        ['Assinatura digital', 'Assinaturas protegem a integridade.'],
      ],
      'Backups e redundância mantêm o serviço e permitem recuperá-lo.',
    ),
    completar(
      'Complete: risco = ameaça × ___ × impacto.',
      'const risco = "ameaça × ___ × impacto";',
      [{ aceitas: ['vulnerabilidade'], feedback: 'A fraqueza que a ameaça pode explorar.' }],
      'Sem vulnerabilidade, a ameaça não encontra caminho.',
    ),
  ],
  desafio: associar(
    'Associe cada situação ao pilar da tríade CIA.',
    [
      ['Vazamento de uma lista de clientes', 'Confidencialidade'],
      ['Arquivo adulterado durante o envio', 'Integridade'],
      ['Servidor derrubado por excesso de acessos', 'Disponibilidade'],
      ['Backup que permite recuperar tudo após uma falha', 'Disponibilidade'],
    ],
    'Identificar o pilar atingido orienta a escolha da defesa.',
  ),
  rec: [
    ordenar(
      'Ordene o raciocínio de análise de risco.',
      [
        'Identificar os ativos',
        'Listar ameaças e vulnerabilidades',
        'Estimar probabilidade e impacto',
        'Escolher e aplicar as defesas',
      ],
      'Do que proteger até como proteger.',
    ),
    mc(
      'O que é defesa em profundidade?',
      'Usar várias camadas de proteção, para que a falha de uma não derrube tudo',
      [
        ['Usar um único firewall muito forte', 'Uma única barreira é um ponto único de falha.'],
        ['Esconder o sistema na internet', 'Esconder não é uma estratégia completa.'],
      ],
      'Rede, host, aplicação e pessoas se complementam.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a tríade CIA e dê um exemplo de ataque a cada pilar.',
    modelo:
      'Confidencialidade é impedir acesso indevido (ex.: vazamento de dados); integridade é impedir alterações não autorizadas (ex.: adulterar um valor de pagamento); disponibilidade é manter o serviço acessível (ex.: ataque que derruba o site). Uma boa defesa combina medidas para os três.',
    rubrica: [
      'Definiu os três pilares',
      'Deu um exemplo de ataque para cada um',
      'Relacionou com defesas',
    ],
  },
  resumo: [
    'CIA: confidencialidade, integridade, disponibilidade.',
    'Risco depende de ameaça, vulnerabilidade e impacto.',
    'Riscos se mitigam, transferem, aceitam ou evitam.',
    'Defesa em profundidade usa várias camadas.',
  ],
  cards: [
    ['O que é a tríade CIA?', 'Confidencialidade, integridade e disponibilidade.'],
    ['O que é uma vulnerabilidade?', 'Uma fraqueza que pode ser explorada.'],
    ['O que é defesa em profundidade?', 'Várias camadas de proteção.'],
    ['Backup protege qual pilar?', 'Disponibilidade.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: criptografia e senhas.',
      'Redes: firewall, VPN e segmentação são defesas por camadas.',
      'Engenharia de Software: segurança desde o projeto.',
    ],
    profissional:
      'Toda decisão de segurança parte de entender o que se protege e do que, e não de comprar ferramentas.',
  },
});
