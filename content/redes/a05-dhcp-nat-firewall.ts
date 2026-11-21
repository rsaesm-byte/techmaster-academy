import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const r05 = montar({
  id: 'redes.m01.a05',
  titulo: 'DHCP, NAT e firewall',
  objetivo:
    'Entender como equipamentos recebem IP, como a rede local sai para a internet e como o firewall decide.',
  pre: ['redes.m01.a04'],
  min: 30,
  diag: mc(
    'Quem entrega o endereço IP automaticamente a um celular que entra no Wi-Fi?',
    'O servidor DHCP',
    [
      ['O servidor DNS', 'O DNS traduz nomes em IPs.'],
      ['O switch', 'O switch encaminha quadros; não distribui endereços.'],
    ],
    'DHCP configura IP, máscara, gateway e DNS.',
  ),
  simples: {
    titulo: 'Três ajudantes da rede local',
    texto:
      '**DHCP:** entrega endereço, máscara, gateway e DNS a quem se conecta. O ciclo se chama **DORA**: Discover, Offer, Request, Acknowledge.\n\n**NAT:** a rede local usa IPs **privados** (192.168.x.x), que não circulam na internet. O roteador troca o IP privado pelo **IP público** na saída e guarda uma tabela para devolver as respostas ao dispositivo certo.\n\n**Firewall:** porteiro com uma lista de regras: "permitir 443", "negar 23". Lê as regras **de cima para baixo** e a **primeira que casa vence**.',
    essencial:
      'DHCP distribui configuração, NAT compartilha um IP público, firewall permite ou bloqueia por regras.',
    guiado:
      'Ao conectar o celular em casa:\n1. DHCP dá IP 192.168.1.23 e o gateway.\n2. Você abre um site; o roteador aplica NAT (IP privado vira público).\n3. O firewall do roteador deixa passar a resposta, pois você iniciou a conversa.',
    tecnico:
      'O DHCP empresta o endereço por um tempo (**lease**) e pode reservar IPs fixos por MAC. Há também o **NAT por porta (PAT)**: vários dispositivos compartilham um único IP público, distinguidos pela porta de origem na tabela de tradução. Firewalls **com estado** (stateful) lembram as conexões iniciadas de dentro e liberam as respostas; a política mais segura é **negar por padrão** e permitir apenas o necessário. O IPv6 tem endereços suficientes para dispensar o NAT.',
  },
  analogia: {
    titulo: 'Condomínio com portaria',
    texto:
      'O DHCP é a administração, que entrega o número do apartamento a cada morador novo. O NAT é a portaria que recebe todas as cartas com o endereço do condomínio e entrega ao apartamento certo, e o firewall é o porteiro que confere a lista de quem pode entrar.',
    limites:
      'Um porteiro sem regras claras deixa passar tudo; por isso "negar por padrão" é mais seguro.',
  },
  demo: {
    titulo: 'Um firewall de regras em ordem',
    instrucoes:
      'Execute e depois troque a porta testada por 22, 443 e 8080 e observe a primeira regra que casa. Tente inverter a ordem das regras.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const regras = [\n  { acao: "permitir", porta: 443 },\n  { acao: "permitir", porta: 80 },\n  { acao: "negar", porta: 23 },\n];\nfunction avaliar(porta) {\n  const regra = regras.find((r) => r.porta === porta);\n  return regra ? regra.acao : "negar";\n}\nfor (const p of [443, 23, 22, 8080]) {\n  console.log("porta " + p + ": " + avaliar(p));\n}\nconsole.log("Sem regra que case, vale a política padrão: negar.");',
    },
  },
  tecnica: {
    titulo: 'NAT em ação',
    texto:
      'Tabela de tradução (exemplo):\n192.168.1.10:50001 ↔ 200.10.10.5:40001\n192.168.1.11:50001 ↔ 200.10.10.5:40002\nO roteador troca origem e porta na saída e usa a tabela para devolver a resposta.\n**Port forwarding:** regra fixa que leva uma porta pública a um servidor interno. Use com cuidado: expõe o serviço à internet.',
  },
  diagrama: {
    titulo: 'O ciclo DORA do DHCP',
    nos: [
      { forma: 'inicio', texto: 'Discover: o cliente pergunta "tem DHCP aí?"' },
      { forma: 'passo', texto: 'Offer: o servidor oferece um IP' },
      { forma: 'passo', texto: 'Request: o cliente pede aquele IP' },
      { forma: 'fim', texto: 'Acknowledge: o servidor confirma o empréstimo' },
    ],
    descricao: 'Quatro mensagens configuram o cliente automaticamente.',
  },
  exemplo: {
    titulo: 'Regras de um servidor web',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        '1. permitir TCP 443 de qualquer origem\n2. permitir TCP 22 só do IP da empresa\n3. negar tudo o mais',
    },
    comentarios: [
      { linha: 1, texto: 'Site público acessível por todos.' },
      { linha: 2, texto: 'Administração restrita, bem mais segura.' },
      { linha: 3, texto: 'Política padrão: negar o que não foi permitido.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'const regras = [["permitir", 443], ["negar", 23]];\nconst porta = 23;\nconst regra = regras.find(([, p]) => p === porta);\nconsole.log(regra ? regra[0] : "negar");',
      ['negar'],
      'A regra da porta 23 diz "negar".',
      [{ resposta: 'permitir', feedback: 'A regra encontrada para a porta 23 é "negar".' }],
    ),
    prever(
      'E com a porta 443?',
      'const regras = [["permitir", 443], ["negar", 23]];\nconst porta = 443;\nconst regra = regras.find(([, p]) => p === porta);\nconsole.log(regra ? regra[0] : "negar");',
      ['permitir'],
      'A regra da 443 permite.',
      [{ resposta: 'negar', feedback: 'Existe regra para 443 e ela permite.' }],
    ),
  ],
  indep: [
    prever(
      'E com uma porta sem regra, a 8080?',
      'const regras = [["permitir", 443], ["negar", 23]];\nconst porta = 8080;\nconst regra = regras.find(([, p]) => p === porta);\nconsole.log(regra ? regra[0] : "negar");',
      ['negar'],
      'Sem regra, vale a política padrão: negar.',
      [{ resposta: 'permitir', feedback: 'Sem regra que case, a política padrão nega.' }],
    ),
    completar(
      'Complete o nome da etapa: Discover, Offer, ___, Acknowledge.',
      'const dora = ["Discover", "Offer", "___", "Acknowledge"];',
      [{ aceitas: ['Request'], feedback: 'O cliente pede o IP oferecido: Request.' }],
      'DORA: Discover, Offer, Request, Acknowledge.',
    ),
  ],
  desafio: programaJs(
    'Escreva avaliar(regras, porta). Cada regra é { acao, porta }. Devolva a ação da PRIMEIRA regra cuja porta seja igual; se nenhuma casar, devolva "negar".',
    'function avaliar(regras, porta) {\n  // seu código aqui\n}',
    'function avaliar(regras, porta) {\n  for (const r of regras) {\n    if (r.porta === porta) return r.acao;\n  }\n  return "negar";\n}',
    'avaliar',
    [
      {
        argumentos: [
          [
            { acao: 'permitir', porta: 443 },
            { acao: 'negar', porta: 23 },
          ],
          443,
        ],
        esperado: 'permitir',
      },
      {
        argumentos: [
          [
            { acao: 'permitir', porta: 443 },
            { acao: 'negar', porta: 23 },
          ],
          23,
        ],
        esperado: 'negar',
      },
      { argumentos: [[{ acao: 'permitir', porta: 443 }], 22], esperado: 'negar' },
      {
        argumentos: [
          [
            { acao: 'negar', porta: 80 },
            { acao: 'permitir', porta: 80 },
          ],
          80,
        ],
        esperado: 'negar',
      },
    ],
    [
      'Percorra as regras em ordem e devolva já na primeira que casar.',
      'Depois do laço, devolva "negar".',
    ],
    'Primeira regra que casa vence, e a política padrão é negar.',
  ),
  rec: [
    ordenar(
      'Ordene o ciclo DORA do DHCP.',
      ['Discover', 'Offer', 'Request', 'Acknowledge'],
      'O cliente procura, o servidor oferece, o cliente pede e o servidor confirma.',
    ),
    associar(
      'Associe cada tecnologia à função.',
      [
        ['DHCP', 'Entrega IP e configuração automaticamente'],
        ['NAT', 'Troca IP privado por público na saída'],
        ['Firewall', 'Permite ou bloqueia tráfego por regras'],
        ['DNS', 'Traduz nomes em endereços IP'],
      ],
      'Quatro serviços que quase toda rede usa.',
    ),
  ],
  explique: {
    enunciado:
      'Explique como DHCP, NAT e firewall trabalham juntos quando você abre um site no celular.',
    modelo:
      'O DHCP deu ao celular um IP privado, a máscara, o gateway e o DNS. Ao abrir o site, o roteador aplica NAT, trocando o IP privado pelo público e anotando a conexão para devolver a resposta. O firewall confere as regras e libera a resposta, pois a conversa partiu de dentro.',
    rubrica: [
      'Explicou o DHCP',
      'Explicou o NAT e a tabela de tradução',
      'Explicou o papel do firewall',
    ],
  },
  resumo: [
    'DHCP: IP e configuração automáticos (DORA).',
    'NAT: IP privado vira público na saída.',
    'Firewall: regras em ordem, primeira que casa vence.',
    'Melhor política: negar por padrão.',
  ],
  cards: [
    ['O que é DORA?', 'Discover, Offer, Request, Acknowledge.'],
    ['O que o NAT faz?', 'Troca o IP privado pelo público.'],
    ['Qual a política mais segura?', 'Negar por padrão.'],
    ['Que regra do firewall vale?', 'A primeira que casa.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: IPs privados e públicos da aula de redes.',
      'Cibersegurança: firewall e segmentação são defesa básica.',
      'Infraestrutura: grupos de segurança na nuvem são firewalls.',
    ],
    profissional:
      'Configurar DHCP, regras de firewall e redirecionamento de portas é rotina de quem administra redes.',
  },
});
