import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const c05 = montar({
  id: 'ciberseguranca.m01.a05',
  titulo: 'Higiene de segurança: atualizações, backup e resposta a incidentes',
  objetivo:
    'Adotar hábitos básicos que evitam a maioria dos incidentes e saber como reagir quando algo dá errado.',
  pre: ['ciberseguranca.m01.a04'],
  min: 30,
  diag: mc(
    'Qual hábito evita o maior número de ataques bem-sucedidos?',
    'Manter sistemas e programas atualizados',
    [
      ['Usar um antivírus e nunca atualizar', 'Falhas conhecidas continuam abertas.'],
      ['Trocar o nome da rede Wi-Fi', 'Isso tem pouco efeito na segurança.'],
    ],
    'A maioria dos ataques explora falhas já corrigidas por atualizações.',
  ),
  simples: {
    titulo: 'O básico bem-feito',
    texto:
      'Antes de qualquer ferramenta sofisticada, faça o **básico**:\n\n1. **Atualize** sistema e aplicativos.\n2. **Senhas únicas e MFA.**\n3. **Backups** com a regra **3-2-1**: 3 cópias, em 2 tipos de mídia, com 1 fora do local.\n4. **Menor privilégio:** conta comum para o dia a dia, e não de administrador.\n5. **Criptografe** discos e dispositivos móveis.\n6. **Treine as pessoas.**\n\nE tenha um **plano de resposta a incidentes**: ao detectar um problema, **contenha, erradique, recupere e aprenda**.',
    essencial:
      'Atualização, MFA, backup 3-2-1, menor privilégio e criptografia evitam a maioria dos incidentes. Tenha um plano para reagir.',
    guiado:
      'Se um computador foi infectado:\n1. Desconecte da rede (contenção).\n2. Avise a equipe de segurança, sem desligar às pressas.\n3. Remova a ameaça e corrija a causa.\n4. Restaure a partir de um backup limpo.\n5. Registre o que aprendeu.',
    tecnico:
      'O **ransomware** cifra os dados e exige resgate; o backup **offline ou imutável** é a melhor defesa, e vale testar a restauração periodicamente. O ciclo de resposta a incidentes (NIST) tem quatro fases: **preparação, detecção e análise, contenção/erradicação/recuperação** e **pós-incidente**. **Logs** centralizados e **monitoramento** permitem detectar cedo. **Gestão de patches** prioriza falhas conforme a criticidade (CVSS) e a exposição. O backup que nunca foi testado é só uma esperança.',
  },
  analogia: {
    titulo: 'Saúde e brigada de incêndio',
    texto:
      'Atualizações e hábitos são a higiene diária, que evita a maioria das doenças. O plano de resposta é a brigada de incêndio: ensaiada antes, para agir com calma quando o alarme tocar.',
    limites:
      'Higiene reduz o risco, mas não o elimina; por isso a resposta ao incidente continua necessária.',
  },
  demo: {
    titulo: 'A regra do backup 3-2-1',
    instrucoes:
      'Execute e veja a avaliação. Depois mude as cópias (mídia e local) para satisfazer, ou quebrar, a regra.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const copias = [\n  { midia: "disco", local: "dentro" },\n  { midia: "nuvem", local: "fora" },\n  { midia: "disco", local: "dentro" },\n];\nconst midias = new Set(copias.map((c) => c.midia));\nconst temFora = copias.some((c) => c.local === "fora");\nconsole.log("Cópias:", copias.length, "(precisa de 3)");\nconsole.log("Tipos de mídia:", midias.size, "(precisa de 2)");\nconsole.log("Uma cópia fora do local:", temFora);\nconsole.log(copias.length >= 3 && midias.size >= 2 && temFora ? "Regra 3-2-1 cumprida" : "Regra NÃO cumprida");',
    },
  },
  tecnica: {
    titulo: 'Checklist pessoal e de equipe',
    texto:
      '**Atualizações automáticas** ligadas.\n**Gerenciador de senhas** e MFA em e-mail, banco e redes sociais.\n**Backup 3-2-1** e restauração testada.\n**Conta sem administrador** no dia a dia.\n**Disco criptografado** e tela bloqueada.\n**Wi-Fi público:** use VPN e evite dados sensíveis.\n**Reportar** o que parece estranho, rápido e sem culpa.',
  },
  diagrama: {
    titulo: 'Resposta a um incidente',
    nos: [
      { forma: 'inicio', texto: 'Detectar e confirmar o incidente' },
      { forma: 'passo', texto: 'Conter: isolar o sistema afetado' },
      { forma: 'passo', texto: 'Erradicar a causa e recuperar pelos backups' },
      { forma: 'fim', texto: 'Aprender: registrar e melhorar as defesas' },
    ],
    descricao: 'Detectar, conter, recuperar e aprender.',
  },
  exemplo: {
    titulo: 'Ransomware numa pequena empresa',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '1. Desconectar o computador da rede\n2. Avisar a TI e preservar evidências\n3. Restaurar os arquivos do backup offline\n4. Corrigir a falha que permitiu a entrada',
    },
    comentarios: [
      { linha: 1, texto: 'Conter evita que o ransomware se espalhe pela rede.' },
      { linha: 3, texto: 'O backup offline não foi atingido pelo ataque.' },
    ],
  },
  guiado: [
    prever(
      'Quantos tipos de mídia diferentes há nesta lista de cópias?',
      'const midias = ["disco", "nuvem", "disco"];\nconsole.log(new Set(midias).size);',
      ['2'],
      'Disco e nuvem: dois tipos distintos, mesmo com três cópias.',
      [{ resposta: '3', feedback: 'O Set remove repetidos: "disco" conta uma vez.' }],
    ),
    mc(
      'Qual é a primeira ação ao suspeitar que um computador está infectado?',
      'Desconectá-lo da rede e avisar a equipe de segurança',
      [
        [
          'Continuar trabalhando para observar o comportamento do computador',
          'Isso deixa o problema se espalhar.',
        ],
        [
          'Apagar tudo imediatamente e reinstalar o sistema',
          'Isso destrói evidências; isole primeiro.',
        ],
      ],
      'Conter vem antes de remover.',
    ),
  ],
  indep: [
    mc(
      'O que significa "3-2-1" no backup?',
      '3 cópias, em 2 tipos de mídia, com 1 fora do local',
      [
        [
          '3 dias, 2 horas e 1 minuto, os prazos de cada tipo de cópia',
          'A regra trata de cópias, mídias e locais.',
        ],
        [
          '3 senhas, 2 fatores de autenticação e 1 usuário administrador',
          'Isso é sobre acesso; o 3-2-1 é sobre backup.',
        ],
      ],
      'Diversidade de mídia e local protege contra vários tipos de falha.',
    ),
    completar(
      'Complete: um backup só vale se a ___ for testada.',
      'const regra = "um backup só vale se a ___ for testada";',
      [
        {
          aceitas: ['restauração', 'restauracao'],
          feedback: 'Testar a restauração mostra se o backup realmente funciona.',
        },
      ],
      'Backup nunca testado é só uma esperança.',
    ),
  ],
  desafio: programaJs(
    'Escreva backup321(copias). Cada cópia é { midia, local } (local é "dentro" ou "fora"). Devolva true somente se houver pelo menos 3 cópias, pelo menos 2 tipos diferentes de mídia e pelo menos 1 cópia com local "fora".',
    'function backup321(copias) {\n  // seu código aqui\n}',
    'function backup321(copias) {\n  const midias = new Set(copias.map((c) => c.midia));\n  const temFora = copias.some((c) => c.local === "fora");\n  return copias.length >= 3 && midias.size >= 2 && temFora;\n}',
    'backup321',
    [
      {
        argumentos: [
          [
            { midia: 'disco', local: 'dentro' },
            { midia: 'nuvem', local: 'fora' },
            { midia: 'disco', local: 'dentro' },
          ],
        ],
        esperado: true,
      },
      {
        argumentos: [
          [
            { midia: 'disco', local: 'dentro' },
            { midia: 'nuvem', local: 'fora' },
          ],
        ],
        esperado: false,
      },
      {
        argumentos: [
          [
            { midia: 'disco', local: 'fora' },
            { midia: 'disco', local: 'dentro' },
            { midia: 'disco', local: 'dentro' },
          ],
        ],
        esperado: false,
      },
      {
        argumentos: [
          [
            { midia: 'disco', local: 'dentro' },
            { midia: 'nuvem', local: 'dentro' },
            { midia: 'fita', local: 'dentro' },
          ],
        ],
        esperado: false,
      },
    ],
    [
      'Um Set dos tipos de mídia dá o número de tipos diferentes.',
      'some verifica se existe uma cópia fora do local.',
    ],
    'As três condições precisam valer ao mesmo tempo.',
  ),
  rec: [
    ordenar(
      'Ordene a resposta a um incidente.',
      [
        'Detectar e confirmar',
        'Conter o sistema afetado',
        'Erradicar a causa e recuperar',
        'Registrar as lições aprendidas',
      ],
      'Conter antes de recuperar e aprender no fim.',
    ),
    associar(
      'Associe o hábito ao risco que ele reduz.',
      [
        ['Atualizações', 'Exploração de falhas conhecidas'],
        ['MFA', 'Uso de senhas roubadas'],
        ['Backup 3-2-1', 'Perda de dados por ransomware ou falha'],
        ['Menor privilégio', 'Estrago de uma conta comprometida'],
      ],
      'Cada hábito fecha uma porta específica.',
    ),
  ],
  explique: {
    enunciado:
      'Explique por que atualizações e backups são tão importantes e como reagir a um incidente.',
    modelo:
      'Atualizações corrigem falhas conhecidas que os atacantes exploram, e backups 3-2-1 permitem recuperar os dados após um ransomware ou falha. Ao detectar um incidente, é preciso conter o sistema, erradicar a causa, recuperar a partir de backups limpos e registrar as lições aprendidas.',
    rubrica: [
      'Explicou a função das atualizações',
      'Explicou o backup 3-2-1',
      'Descreveu as etapas de resposta ao incidente',
    ],
  },
  resumo: [
    'Atualize, use MFA e senhas únicas.',
    'Backup 3-2-1, com restauração testada.',
    'Menor privilégio e criptografia de dispositivos.',
    'Resposta: detectar, conter, recuperar e aprender.',
  ],
  cards: [
    ['O que é o backup 3-2-1?', '3 cópias, 2 mídias, 1 fora do local.'],
    ['Primeira ação num incidente?', 'Conter (isolar) e avisar a equipe.'],
    ['Por que testar a restauração?', 'Para ter certeza de que o backup funciona.'],
    ['Hábito que fecha falhas conhecidas?', 'Atualizar.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: armazenamento, RAID e backup.',
      'Redes: segmentação e firewall ajudam a conter incidentes.',
      'Infraestrutura: automação de patches e backups na nuvem.',
    ],
    profissional:
      'Equipes de TI e de segurança vivem de rotina: atualizar, fazer backup, monitorar e ensaiar a resposta.',
  },
});
