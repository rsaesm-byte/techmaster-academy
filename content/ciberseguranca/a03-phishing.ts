import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const c03 = montar({
  id: 'ciberseguranca.m01.a03',
  titulo: 'Engenharia social e phishing',
  objetivo:
    'Reconhecer golpes que exploram pessoas, e não máquinas, e saber verificar links e remetentes.',
  pre: ['ciberseguranca.m01.a02'],
  min: 25,
  diag: mc(
    'Qual é o alvo principal do phishing?',
    'A pessoa, induzida a clicar, responder ou entregar dados',
    [
      [
        'O sistema operacional, atacado por falhas no kernel',
        'O phishing visa a pessoa, não o sistema.',
      ],
      [
        'O cabo de rede, interceptado por quem está perto',
        'Não é um ataque físico: o alvo é a pessoa.',
      ],
    ],
    'Phishing explora a confiança e a pressa das pessoas.',
  ),
  simples: {
    titulo: 'O elo mais fraco é humano',
    texto:
      '**Engenharia social** é enganar pessoas para obter acesso ou dados. O **phishing** faz isso por mensagem (e-mail, SMS, WhatsApp), imitando um banco, a TI ou um chefe.\n\n**Sinais de alerta:**\n- **Urgência ou ameaça:** "sua conta será bloqueada hoje".\n- **Link estranho:** o endereço real não é o da empresa.\n- **Remetente suspeito** ou erros de português.\n- **Anexo inesperado**.\n- **Pedido de senha, código ou pagamento**.\n\n**O que fazer:** pare, não clique, confirme por outro canal (ligue para o número oficial) e **reporte**.',
    essencial:
      'Golpes usam urgência e confiança. Confira o endereço real do link, desconfie de pedidos de senha ou código e confirme por outro canal.',
    guiado:
      'Ao receber uma mensagem suspeita:\n1. Não clique nem abra o anexo.\n2. Passe o mouse sobre o link e veja o endereço real.\n3. Confira o remetente verdadeiro.\n4. Confirme por um canal oficial.\n5. Reporte à equipe de segurança.',
    tecnico:
      'Variações: **spear phishing** (direcionado a uma pessoa), **whaling** (executivos), **vishing** (voz), **smishing** (SMS), **BEC** (e-mail empresarial comprometido, com pedido de pagamento falso) e **quishing** (QR codes). O truque dos domínios: em "banco.com.br.golpe.com" o domínio real é **golpe.com**, pois a hierarquia do DNS é lida da **direita para a esquerda** antes da primeira barra. Também há domínios parecidos ("banc0.com.br"). Defesas técnicas: SPF, DKIM e DMARC no e-mail, filtros, MFA resistente a phishing (FIDO2) e treinamento com simulações.',
  },
  analogia: {
    titulo: 'O falso funcionário',
    texto:
      'Um golpista com crachá falso e pressa convence o porteiro a deixá-lo entrar. Não arrombou nada: usou a confiança. O phishing é o mesmo truque, por mensagem.',
    limites:
      'Qualquer pessoa pode ser enganada, e por isso o processo e a confirmação importam mais que a "esperteza".',
  },
  demo: {
    titulo: 'De quem é esse link?',
    instrucoes:
      'Execute e observe como o domínio real é extraído do endereço. Teste outros links, inclusive parecidos com o esperado.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const esperado = "banco.com.br";\nconst links = [\n  "https://banco.com.br/login",\n  "https://app.banco.com.br/extrato",\n  "https://banco.com.br.golpe.com/login",\n  "https://meubanco.com.br/login",\n];\nfor (const url of links) {\n  const host = url.split("/")[2];\n  const ok = host === esperado || host.endsWith("." + esperado);\n  console.log((ok ? "OK      " : "SUSPEITO") + " " + host);\n}',
    },
  },
  tecnica: {
    titulo: 'Checklist rápido',
    texto:
      '1. **Quem** mandou de verdade? (endereço, não só o nome)\n2. **O que** pede? (senha, código, dinheiro, anexo?)\n3. **Por que** a pressa?\n4. **Para onde** vai o link? (o domínio real)\n5. **Posso confirmar** por outro canal?\nNa dúvida, digite o endereço oficial no navegador em vez de clicar.',
  },
  diagrama: {
    titulo: 'Diante de uma mensagem suspeita',
    nos: [
      { forma: 'inicio', texto: 'Chega uma mensagem pedindo uma ação urgente' },
      { forma: 'decisao', texto: 'Há urgência, link estranho ou pedido de senha ou código?' },
      { forma: 'passo', texto: 'Sim: não clique; confirme por outro canal' },
      { forma: 'fim', texto: 'Reporte à equipe de segurança e apague a mensagem' },
    ],
    descricao: 'Parar e verificar bloqueia a maioria dos golpes.',
  },
  exemplo: {
    titulo: 'Dois links parecidos',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'https://banco.com.br/login               -> domínio banco.com.br\nhttps://banco.com.br.golpe.com/login     -> domínio golpe.com',
    },
    comentarios: [
      { linha: 1, texto: 'O domínio real vem logo antes da primeira barra, lido pelo fim.' },
      { linha: 2, texto: 'O banco aparece só como subdomínio de golpe.com.' },
    ],
  },
  guiado: [
    prever(
      'Qual é o host deste endereço?',
      'console.log("https://banco.com.br.golpe.com/login".split("/")[2]);',
      ['banco.com.br.golpe.com'],
      'O host é o trecho entre // e a primeira barra: o domínio real é golpe.com.',
      [
        {
          resposta: 'banco.com.br',
          feedback: 'O host inclui tudo até a barra; o domínio real é o final.',
        },
      ],
    ),
    mc(
      'Você recebe um SMS: "Sua conta será bloqueada, clique agora". O que fazer?',
      'Não clicar e conferir pelo aplicativo ou pelo telefone oficial',
      [
        ['Clicar rápido no link para evitar o bloqueio da conta', 'A urgência é a isca do golpe.'],
        [
          'Responder com o CPF para confirmar a identidade e evitar o bloqueio',
          'Nunca entregue dados a quem entrou em contato.',
        ],
      ],
      'Confirme por um canal que você mesmo abriu.',
    ),
  ],
  indep: [
    mc(
      'Em https://suporte.empresa.com.golpe.net/ , qual é o domínio real?',
      'golpe.net',
      [
        ['empresa.com', 'Isso é só um subdomínio de golpe.net.'],
        ['suporte.empresa.com', 'O domínio real vem do final.'],
      ],
      'Leia o domínio da direita para a esquerda, antes da primeira barra.',
    ),
    completar(
      'Complete: nunca informe o código de ___ recebido por mensagem a ninguém.',
      'const regra = "não informe o código de ___ a ninguém";',
      [
        {
          aceitas: ['verificação', 'verificacao'],
          feedback: 'Quem pede o código de verificação quer invadir a sua conta.',
        },
      ],
      'Códigos de verificação são pessoais.',
    ),
  ],
  desafio: programaJs(
    'Escreva dominioConfiavel(url, esperado). O host é o texto entre "//" e a próxima "/". Devolva true se o host for igual ao domínio esperado ou terminar com "." + esperado (um subdomínio dele); senão, false.',
    'function dominioConfiavel(url, esperado) {\n  // seu código aqui\n}',
    'function dominioConfiavel(url, esperado) {\n  const host = url.split("/")[2];\n  return host === esperado || host.endsWith("." + esperado);\n}',
    'dominioConfiavel',
    [
      { argumentos: ['https://banco.com.br/login', 'banco.com.br'], esperado: true },
      { argumentos: ['https://app.banco.com.br/extrato', 'banco.com.br'], esperado: true },
      { argumentos: ['https://banco.com.br.golpe.com/login', 'banco.com.br'], esperado: false },
      { argumentos: ['https://meubanco.com.br/', 'banco.com.br'], esperado: false },
    ],
    ['url.split("/")[2] devolve o host.', 'Compare com === e com endsWith("." + esperado).'],
    'O ponto antes do domínio esperado impede que "meubanco.com.br" passe por "banco.com.br".',
  ),
  rec: [
    associar(
      'Associe o golpe ao canal.',
      [
        ['Phishing', 'E-mails ou mensagens falsas em geral'],
        ['Smishing', 'Mensagens SMS falsas'],
        ['Vishing', 'Ligações telefônicas falsas'],
        ['Spear phishing', 'Mensagem personalizada para uma vítima'],
      ],
      'Mesma ideia, canais diferentes.',
    ),
    ordenar(
      'Ordene o que fazer ao receber uma mensagem suspeita.',
      [
        'Não clicar nem abrir anexos',
        'Verificar o remetente e o endereço real do link',
        'Confirmar por um canal oficial',
        'Reportar à equipe de segurança',
      ],
      'Primeiro parar, depois verificar, confirmar e avisar.',
    ),
  ],
  explique: {
    enunciado: 'Explique por que o phishing funciona e três sinais que ajudam a reconhecê-lo.',
    modelo:
      'O phishing funciona porque explora confiança, medo e pressa em vez de falhas técnicas. Sinais: urgência ou ameaça, links cujo endereço real não é o da empresa e pedidos de senha, código ou pagamento. Deve-se parar, conferir o endereço e confirmar por outro canal.',
    rubrica: [
      'Explicou que ataca a pessoa',
      'Citou ao menos três sinais de alerta',
      'Citou a confirmação por outro canal',
    ],
  },
  resumo: [
    'Phishing e engenharia social exploram pessoas.',
    'Sinais: urgência, link estranho, pedido de senha ou código.',
    'Leia o domínio real, da direita para a esquerda.',
    'Confirme por outro canal e reporte.',
  ],
  cards: [
    ['O que é phishing?', 'Mensagem falsa para enganar a vítima.'],
    ['Como achar o domínio real?', 'Ler o host da direita para a esquerda.'],
    ['Posso informar o código SMS ao suporte?', 'Nunca.'],
    ['O que fazer na dúvida?', 'Não clicar, confirmar e reportar.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes de Computadores: DNS e domínios explicam os links falsos.',
      'Fundamentos da Computação: HTTPS não garante que o site seja honesto.',
      'Psicologia: urgência e autoridade são gatilhos de decisão.',
    ],
    profissional:
      'Equipes de segurança treinam pessoas com simulações de phishing, e quem trabalha em TI é alvo frequente.',
  },
});
