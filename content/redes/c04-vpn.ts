import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const r09 = montar({
  id: 'redes.m02.a04',
  titulo: 'VPN e túneis',
  objetivo:
    'Entender como uma VPN cria um túnel seguro e quando usá-la, incluindo o split tunneling.',
  pre: ['redes.m02.a03'],
  min: 25,
  diag: mc(
    'Para que serve uma VPN corporativa?',
    'Para acessar a rede da empresa de fora, por um túnel criptografado',
    [
      [
        'Para deixar a internet mais rápida e estável no trabalho remoto',
        'A VPN pode até deixar mais lenta; o objetivo é acesso seguro.',
      ],
      [
        'Para bloquear anúncios e rastreadores nas páginas',
        'Isso não é função da VPN corporativa.',
      ],
    ],
    'VPN estende a rede privada pela internet com segurança.',
  ),
  simples: {
    titulo: 'Um túnel dentro da estrada pública',
    texto:
      'A internet é uma estrada pública. A **VPN** (rede privada virtual) cava um **túnel** criptografado entre você e a rede da empresa: quem está na estrada vê que há um túnel, mas não o que passa dentro.\n\nO pacote original vai **embrulhado** dentro de outro pacote (encapsulamento de novo!), com os endereços do túnel por fora.\n\n- **Acesso remoto:** o funcionário em casa entra na rede da empresa.\n- **Site a site:** duas filiais se ligam como se fossem uma rede só.\n- **VPN comercial:** esconde seu tráfego do Wi-Fi público e do provedor, mas o provedor da VPN passa a ver tudo.',
    essencial:
      'VPN = túnel criptografado que encapsula pacotes e estende uma rede privada pela internet.',
    guiado:
      'Para o trabalho remoto:\n1. O cliente VPN autentica o usuário (senha e segundo fator).\n2. Cria o túnel criptografado até o gateway da empresa.\n3. Recebe um IP interno.\n4. O tráfego para a rede da empresa vai pelo túnel.',
    tecnico:
      'Protocolos comuns: **IPsec**, **OpenVPN** e **WireGuard** (moderno e enxuto). No túnel, o pacote interno é criptografado e embrulhado em um pacote externo. No **túnel completo** todo o tráfego passa pela VPN; no **split tunneling** só o destinado à empresa vai pelo túnel e o resto sai direto, economizando banda, porém exigindo cuidado com a segurança. A VPN não torna você anônimo: o provedor dela vê o seu tráfego, e sites ainda identificam você por contas e cookies.',
  },
  analogia: {
    titulo: 'Carro-forte numa rodovia',
    texto:
      'O carro-forte (túnel) leva o malote (seu tráfego) pela rodovia pública, e ninguém vê o conteúdo. No destino o malote é entregue à rede da empresa como se você estivesse lá dentro.',
    limites: 'O carro-forte protege o trajeto, mas quem recebe o malote vê tudo o que há nele.',
  },
  demo: {
    titulo: 'Encapsulamento da VPN',
    instrucoes:
      'Execute e veja o pacote embrulhado pela VPN. Depois teste o split tunneling com outros destinos.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const redesDaEmpresa = ["10.", "192.168.50."];\nconst usaVpn = (ip) => redesDaEmpresa.some((p) => ip.startsWith(p));\nfor (const destino of ["10.2.3.4", "8.8.8.8", "192.168.50.9"]) {\n  let pacote = "dados->" + destino;\n  if (usaVpn(destino)) pacote = "IP-gateway(VPN-cifrado(" + pacote + "))";\n  console.log(destino + ": " + pacote);\n}',
    },
  },
  tecnica: {
    titulo: 'Riscos e cuidados',
    texto:
      '**Autenticação forte:** segundo fator na VPN corporativa.\n**Split tunneling:** o PC fica conectado à empresa e à internet ao mesmo tempo, aumentando o risco se for infectado.\n**VPN gratuita duvidosa:** pode vender ou registrar seus dados.\n**Alternativas modernas:** acesso zero trust (verifica cada acesso) e aplicações via HTTPS.',
  },
  diagrama: {
    titulo: 'Caminho de um pacote na VPN',
    nos: [
      { forma: 'inicio', texto: 'O PC gera um pacote para a rede da empresa' },
      { forma: 'passo', texto: 'O cliente VPN criptografa e encapsula' },
      { forma: 'passo', texto: 'O pacote cruza a internet pelo túnel' },
      { forma: 'fim', texto: 'O gateway da empresa desencapsula e entrega' },
    ],
    descricao: 'Pela internet só se vê o túnel, e não o conteúdo.',
  },
  exemplo: {
    titulo: 'Escritório e filial',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'Matriz: 10.1.0.0/16\nFilial: 10.2.0.0/16\nTúnel site a site entre os dois roteadores',
    },
    comentarios: [
      { linha: 1, texto: 'Cada sede tem seu bloco de endereços, sem sobreposição.' },
      { linha: 3, texto: 'Para os usuários, as duas redes parecem uma só.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'let p = "dados";\np = "VPN(" + p + ")";\np = "IP(" + p + ")";\nconsole.log(p);',
      ['IP(VPN(dados))'],
      'A VPN embrulha primeiro; o cabeçalho IP externo vai por fora.',
      [
        {
          resposta: 'VPN(IP(dados))',
          feedback: 'O IP externo é o último a ser aplicado, então fica por fora.',
        },
      ],
    ),
    mc(
      'O que é split tunneling?',
      'Só o tráfego da empresa vai pelo túnel; o resto sai direto',
      [
        ['Dividir a VPN em duas senhas de acesso, uma por usuário', 'Não tem relação com senhas.'],
        [
          'Usar duas VPNs ao mesmo tempo para reforçar a segurança',
          'É sobre o que vai pelo túnel.',
        ],
      ],
      'Economiza banda, mas exige cuidado com a segurança.',
    ),
  ],
  indep: [
    mc(
      'Uma VPN comercial torna você anônimo na internet?',
      'Não: o provedor da VPN passa a ver o seu tráfego',
      [
        [
          'Sim, totalmente, pois o tráfego sai com o IP da VPN',
          'O provedor da VPN pode ver seu tráfego.',
        ],
        [
          'Sim, desde que o Wi-Fi use WPA3 e a VPN esteja ligada',
          'WPA3 protege o Wi-Fi, não garante anonimato.',
        ],
      ],
      'VPN muda quem vê o tráfego; não garante anonimato.',
    ),
    completar(
      'Complete o nome do protocolo moderno e enxuto de VPN.',
      'const protocolo = "Wire___";',
      [{ aceitas: ['Guard'], feedback: 'WireGuard.' }],
      'Outros: IPsec e OpenVPN.',
    ),
  ],
  desafio: programaJs(
    'Escreva usaVpn(ip, prefixos). Devolva true se o ip começar com algum dos prefixos da lista (por exemplo "10."), e false se nenhum.',
    'function usaVpn(ip, prefixos) {\n  // seu código aqui\n}',
    'function usaVpn(ip, prefixos) {\n  return prefixos.some((p) => ip.startsWith(p));\n}',
    'usaVpn',
    [
      { argumentos: ['10.2.3.4', ['10.', '192.168.']], esperado: true },
      { argumentos: ['8.8.8.8', ['10.']], esperado: false },
      { argumentos: ['192.168.5.5', ['10.', '192.168.']], esperado: true },
      { argumentos: ['110.1.1.1', ['10.']], esperado: false },
    ],
    ['Percorra os prefixos com some.', 'startsWith testa o início do texto.'],
    'É a lógica do split tunneling: só destinos da empresa entram no túnel.',
  ),
  rec: [
    associar(
      'Associe o tipo de VPN ao uso.',
      [
        ['Acesso remoto', 'Funcionário em casa entra na rede da empresa'],
        ['Site a site', 'Liga duas filiais como uma única rede'],
        ['VPN comercial', 'Protege o tráfego em Wi-Fi público'],
        ['Split tunneling', 'Só parte do tráfego passa pelo túnel'],
      ],
      'Os usos mais comuns.',
    ),
    ordenar(
      'Ordene o caminho de um pacote numa VPN.',
      [
        'O PC gera o pacote',
        'O cliente VPN criptografa e encapsula',
        'O pacote cruza a internet',
        'O gateway desencapsula e entrega',
      ],
      'Embrulha na saída e desembrulha na chegada.',
    ),
  ],
  explique: {
    enunciado: 'Explique como uma VPN funciona e quais cuidados ela exige.',
    modelo:
      'A VPN cria um túnel criptografado: o pacote original é criptografado e embrulhado em outro pacote, que cruza a internet e é aberto no gateway da empresa. É preciso autenticar com segundo fator, cuidar do split tunneling e confiar no provedor da VPN, que vê o tráfego.',
    rubrica: [
      'Explicou o túnel e o encapsulamento',
      'Explicou a criptografia',
      'Citou um cuidado ou risco',
    ],
  },
  resumo: [
    'VPN: túnel criptografado que encapsula pacotes.',
    'Usos: acesso remoto e site a site.',
    'Split tunneling: só o tráfego da empresa usa o túnel.',
    'VPN não é anonimato total.',
  ],
  cards: [
    ['O que é uma VPN?', 'Túnel criptografado pela internet.'],
    ['Protocolo moderno de VPN?', 'WireGuard.'],
    ['O que é split tunneling?', 'Só parte do tráfego usa o túnel.'],
    ['VPN comercial dá anonimato?', 'Não totalmente.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes de Computadores: encapsulamento da aula 1 do módulo 1.',
      'Cibersegurança: autenticação multifator e zero trust.',
      'Infraestrutura e Servidores: VPNs ligam a nuvem à rede local.',
    ],
    profissional: 'Quem presta suporte a trabalho remoto resolve problemas de VPN o tempo todo.',
  },
});
