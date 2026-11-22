import { completar, mc, montar, ordenar, prever, programaJs } from '../fundamentos/montar';

export const r03 = montar({
  id: 'redes.m01.a03',
  titulo: 'Roteamento: como o pacote acha o caminho',
  objetivo: 'Entender tabelas de rotas, gateway padrão e a regra do prefixo mais específico.',
  pre: ['redes.m01.a02'],
  min: 30,
  diag: mc(
    'O que um roteador faz com um pacote que chega?',
    'Olha o IP de destino e escolhe o próximo salto',
    [
      [
        'Lê o conteúdo do pacote e decide para onde enviá-lo',
        'O roteador olha só o endereço de destino.',
      ],
      ['Guarda o pacote em memória até alguém buscá-lo', 'Ele encaminha; não guarda.'],
    ],
    'Roteamento é decidir o próximo salto pelo IP de destino.',
  ),
  simples: {
    titulo: 'Placas de sinalização numa estrada',
    texto:
      'Cada roteador tem uma **tabela de rotas**: uma lista de "para ir a esta rede, entregue a este vizinho".\n\n```\n10.0.0.0/8      -> via A\n10.1.0.0/16     -> via B\n0.0.0.0/0       -> via C  (rota padrão)\n```\n\nO pacote para **10.1.2.3** casa com as duas primeiras. Vale a rota **mais específica** (maior prefixo): vai por **B**. Qualquer coisa sem rota melhor cai na **rota padrão** (0.0.0.0/0), o **gateway** para a internet.',
    essencial:
      'Tabela de rotas + regra do prefixo mais longo. A rota padrão (0.0.0.0/0) pega o resto.',
    guiado:
      'Para decidir a rota:\n1. Veja quais rotas "casam" com o IP de destino.\n2. Entre elas, escolha o maior prefixo.\n3. Se nenhuma casar, use a rota padrão (se houver).',
    tecnico:
      'O algoritmo é **longest prefix match**. Rotas podem ser **estáticas** (configuradas à mão) ou **dinâmicas**, aprendidas por protocolos como OSPF (dentro de uma organização) e BGP (entre provedores na internet). Cada roteador decide **só o próximo salto**; o caminho completo emerge da cooperação de todos. O campo **TTL** do pacote cai 1 a cada salto, e quando chega a zero o pacote é descartado, o que evita laços infinitos; o `traceroute` usa isso para mapear o caminho.',
  },
  analogia: {
    titulo: 'Placas na estrada',
    texto:
      'Em cada cruzamento há uma placa: "Centro à esquerda", "Bairro Jardim à direita", "Demais destinos: siga em frente". A placa mais específica vence. Ninguém precisa conhecer o trajeto inteiro, só o próximo cruzamento.',
    limites:
      'Roteadores trocam informação entre si e se adaptam a falhas, o que as placas não fazem.',
  },
  demo: {
    titulo: 'Escolha de rota em código',
    instrucoes:
      'Execute e depois mude o destino para 8.8.8.8 e para 10.9.9.9 e veja qual rota vence.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const paraNumero = (ip) => ip.split(".").reduce((a, o) => a * 256 + Number(o), 0);\nconst casa = (ip, rede, prefixo) => {\n  const tamanho = 2 ** (32 - prefixo);\n  return Math.floor(paraNumero(ip) / tamanho) === Math.floor(paraNumero(rede) / tamanho);\n};\nconst rotas = [\n  { rede: "10.0.0.0", prefixo: 8, via: "A" },\n  { rede: "10.1.0.0", prefixo: 16, via: "B" },\n  { rede: "0.0.0.0", prefixo: 0, via: "C (padrão)" },\n];\nconst destino = "10.1.2.3";\nconst candidatas = rotas.filter((r) => casa(destino, r.rede, r.prefixo));\ncandidatas.sort((a, b) => b.prefixo - a.prefixo);\nconsole.log("Casam:", candidatas.map((r) => r.via).join(", "));\nconsole.log("Escolhida:", candidatas[0].via);',
    },
  },
  tecnica: {
    titulo: 'No seu computador',
    texto:
      'A tabela de rotas de um PC costuma ter: a **rede local** (entrega direta), e a **rota padrão** via gateway (o roteador de casa).\nComandos: `ip route` (Linux), `route print` (Windows), `traceroute` / `tracert` para ver os saltos.\nPara falar com outra rede, o PC entrega o pacote ao **gateway**, que o encaminha adiante.',
  },
  diagrama: {
    titulo: 'Decisão de um roteador',
    nos: [
      { forma: 'inicio', texto: 'Pacote chega com IP de destino' },
      { forma: 'passo', texto: 'Procura as rotas que casam com o destino' },
      { forma: 'decisao', texto: 'Alguma casa?' },
      { forma: 'fim', texto: 'Sim: usa a de maior prefixo. Não: usa a rota padrão ou descarta' },
    ],
    descricao: 'O prefixo mais longo vence; sem rota, vale a padrão.',
  },
  exemplo: {
    titulo: 'De casa até um site',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'PC (192.168.1.10) -> gateway 192.168.1.1\nRoteador de casa -> provedor\nProvedor -> ... -> servidor',
    },
    comentarios: [
      { linha: 1, texto: 'O destino está fora da rede local, então vai ao gateway.' },
      { linha: 2, texto: 'O roteador de casa usa a rota padrão rumo ao provedor.' },
      { linha: 3, texto: 'Vários roteadores decidem o próximo salto, um de cada vez.' },
    ],
  },
  guiado: [
    mc(
      'Um roteador tem 10.0.0.0/8 via A, 10.1.0.0/16 via B e 0.0.0.0/0 via C. Para onde vai um pacote para 10.1.2.3?',
      'Via B',
      [
        ['Via A', 'A rota via A casa, mas a via B é mais específica (/16).'],
        ['Via C', 'A rota padrão só vale quando nenhuma outra casa.'],
      ],
      'Vence o maior prefixo entre as rotas que casam.',
    ),
    mc(
      'E um pacote para 8.8.8.8, com as mesmas rotas?',
      'Via C (rota padrão)',
      [
        ['Via A', '8.8.8.8 não pertence a 10.0.0.0/8.'],
        ['Via B', '8.8.8.8 não pertence a 10.1.0.0/16.'],
      ],
      'Só a rota padrão casa.',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra? (prefixo mais específico = o maior)',
      'const prefixos = [8, 16, 0];\nconsole.log(Math.max(...prefixos));',
      ['16'],
      'O maior prefixo (16) é a rota mais específica.',
      [{ resposta: '0', feedback: '0 é a rota padrão, a menos específica.' }],
    ),
    completar(
      'Complete: a rota padrão é escrita como ___/0.',
      'const rotaPadrao = "___.0.0.0/0";',
      [{ aceitas: ['0'], feedback: 'A rota padrão é 0.0.0.0/0.' }],
      '0.0.0.0/0 casa com qualquer endereço.',
    ),
  ],
  desafio: programaJs(
    'Escreva escolherRota(rotas, destino). Cada rota é { via, prefixo, casa } e "casa" indica se ela serve ao destino. Devolva a via da rota que casa e tem o maior prefixo, ou null se nenhuma casar.',
    'function escolherRota(rotas, destino) {\n  // seu código aqui\n}',
    'function escolherRota(rotas, destino) {\n  let melhor = null;\n  for (const r of rotas) {\n    if (r.casa && (melhor === null || r.prefixo > melhor.prefixo)) melhor = r;\n  }\n  return melhor === null ? null : melhor.via;\n}',
    'escolherRota',
    [
      {
        argumentos: [
          [
            { via: 'A', prefixo: 8, casa: true },
            { via: 'B', prefixo: 16, casa: true },
            { via: 'C', prefixo: 0, casa: true },
          ],
          '10.1.2.3',
        ],
        esperado: 'B',
      },
      {
        argumentos: [
          [
            { via: 'A', prefixo: 8, casa: false },
            { via: 'C', prefixo: 0, casa: true },
          ],
          '8.8.8.8',
        ],
        esperado: 'C',
      },
      { argumentos: [[{ via: 'A', prefixo: 8, casa: false }], '8.8.8.8'], esperado: null },
    ],
    [
      'Percorra as rotas e ignore as que não casam.',
      'Guarde a melhor até agora, comparando os prefixos.',
    ],
    'É o algoritmo do prefixo mais longo: entre as rotas que casam, vence a mais específica.',
  ),
  rec: [
    mc(
      'Para que serve o gateway padrão de um computador?',
      'Ser a saída para destinos fora da rede local',
      [
        ['Traduzir nomes de sites em endereços IP', 'Isso é função do DNS.'],
        ['Distribuir endereços IP automaticamente aos computadores', 'Isso é função do DHCP.'],
      ],
      'O gateway encaminha tudo o que não é da rede local.',
    ),
    ordenar(
      'Ordene a decisão de um roteador.',
      [
        'Recebe o pacote e lê o IP de destino',
        'Procura as rotas que casam',
        'Escolhe a de maior prefixo',
        'Reduz o TTL e encaminha ao próximo salto',
      ],
      'O TTL cai a cada salto para evitar laços infinitos.',
    ),
  ],
  explique: {
    enunciado: 'Explique a regra do prefixo mais longo e o papel da rota padrão.',
    modelo:
      'Quando várias rotas casam com o destino, o roteador usa a mais específica, isto é, a de maior prefixo. A rota padrão (0.0.0.0/0) casa com qualquer endereço, mas por ter prefixo zero só é usada quando nenhuma outra serve, geralmente para sair rumo à internet.',
    rubrica: [
      'Explicou escolher a rota mais específica',
      'Explicou a rota padrão como último recurso',
      'Deu um exemplo ou citou o gateway',
    ],
  },
  resumo: [
    'Cada roteador tem uma tabela de rotas e decide o próximo salto.',
    'Vence o prefixo mais longo entre as rotas que casam.',
    'A rota padrão 0.0.0.0/0 é o gateway para o resto.',
    'O TTL evita laços infinitos.',
  ],
  cards: [
    ['O que é a rota padrão?', '0.0.0.0/0, o gateway para o resto.'],
    ['Qual rota vence?', 'A de maior prefixo (mais específica).'],
    ['Para que serve o TTL?', 'Descartar pacotes presos em laços.'],
    ['Que comando mostra os saltos?', 'traceroute (tracert no Windows).'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: IP e máscara da aula anterior.',
      'Algoritmos: escolher o melhor candidato é um laço com acumulador.',
      'Cibersegurança: rotas erradas ou sequestradas (BGP) causam grandes incidentes.',
    ],
    profissional:
      'Diagnosticar "não chego nesse servidor" começa olhando a tabela de rotas e o traceroute.',
  },
});
