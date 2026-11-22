import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const r06 = montar({
  id: 'redes.m02.a01',
  titulo: 'Diagnóstico: ping, traceroute e nslookup',
  objetivo:
    'Diagnosticar problemas de rede de forma sistemática, de dentro para fora, com as ferramentas certas.',
  pre: ['redes.m01.a05'],
  min: 30,
  diag: mc(
    'A internet "caiu". Por onde começar o diagnóstico?',
    'Do mais perto para o mais longe: o próprio computador, o gateway e só depois a internet',
    [
      [
        'Reiniciando o equipamento do provedor de internet',
        'Você não controla o provedor; comece pelo mais perto.',
      ],
      [
        'Trocando o cabo e o roteador de uma vez, para resolver rápido',
        'Trocar tudo junto esconde a causa.',
      ],
    ],
    'Testar em camadas, do mais próximo ao mais distante, isola a falha.',
  ),
  simples: {
    titulo: 'O médico da rede',
    texto:
      'Bons técnicos não chutam: seguem uma **escada**, testando cada degrau.\n\n1. `ping 127.0.0.1`: a pilha de rede do próprio computador funciona?\n2. `ping` no **gateway**: a rede local está ok?\n3. `ping 8.8.8.8`: chego à internet (por IP)?\n4. `ping google.com`: o **DNS** resolve nomes?\n\nOnde o teste falhar primeiro, está o problema. Outras ferramentas: `traceroute` (mostra os saltos), `nslookup` (consulta o DNS) e `ipconfig` / `ip addr` (mostra o seu IP e o gateway).',
    essencial:
      'Teste do mais perto para o mais longe; onde falhar primeiro está a causa. Ping testa o caminho, traceroute mostra os saltos e nslookup testa o DNS.',
    guiado:
      'Se o site não abre:\n1. Ping no gateway: ok?\n2. Ping em 8.8.8.8: ok?\n3. Ping no nome: falhou? Então é DNS.\n4. Se 8.8.8.8 falhar, o problema está além do roteador (provedor, rota).',
    tecnico:
      'O `ping` usa ICMP (eco) e mede **latência** e **perda**; firewalls podem bloquear o ICMP, então falta de resposta não prova que o host está fora. O `traceroute` envia pacotes com TTL crescente (1, 2, 3...) e cada roteador que descarta o pacote responde "TTL excedido", revelando o caminho. `nslookup` e `dig` consultam o DNS diretamente. Para ver as portas, use `ss`, `netstat` ou `nc -zv`. Um `curl -I` testa a camada de aplicação (HTTP).',
  },
  analogia: {
    titulo: 'Diagnóstico de encanamento',
    texto:
      'Sem água na torneira? Veja primeiro se a torneira abre (o PC), depois o registro da casa (gateway), depois o hidrômetro (provedor) e só então a rua. Cada teste exclui um trecho do problema.',
    limites:
      'Na rede, o mesmo sintoma (site não abre) pode vir de causas bem diferentes, como DNS ou rota.',
  },
  demo: {
    titulo: 'O diagnóstico em código',
    instrucoes:
      'Execute e depois mude os resultados dos testes (true ou false) para ver o diagnóstico mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const testes = { propria: true, gateway: true, ip: true, nome: false };\nfunction diagnosticar(t) {\n  if (!t.propria) return "Problema no próprio computador (placa, driver)";\n  if (!t.gateway) return "Problema na rede local (cabo, Wi-Fi, switch)";\n  if (!t.ip) return "Problema na saída para a internet (roteador, provedor)";\n  if (!t.nome) return "Problema de DNS";\n  return "Tudo certo";\n}\nconsole.log(diagnosticar(testes));',
    },
  },
  tecnica: {
    titulo: 'Lendo o resultado de um ping',
    texto:
      '`time=12 ms`: **latência** (ida e volta). Abaixo de 50 ms é ótimo; acima de 150 ms atrapalha jogos e chamadas.\n`perda de 25%`: um em cada quatro pacotes se perdeu (Wi-Fi fraco, congestão).\n`Request timed out`: sem resposta (pode ser bloqueio de ICMP).\n`TTL`: restante de saltos; ajuda a deduzir o sistema do destino.',
  },
  diagrama: {
    titulo: 'A escada do diagnóstico',
    nos: [
      { forma: 'inicio', texto: 'Ping em 127.0.0.1 (o próprio PC)' },
      { forma: 'passo', texto: 'Ping no gateway (rede local)' },
      { forma: 'passo', texto: 'Ping em 8.8.8.8 (internet por IP)' },
      { forma: 'fim', texto: 'Ping no nome do site (DNS); onde falhar, está o problema' },
    ],
    descricao: 'Cada degrau exclui um trecho do caminho.',
  },
  exemplo: {
    titulo: 'O site não abre, mas o ping no IP funciona',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'ping 8.8.8.8      -> responde\nping google.com   -> "host não encontrado"\nnslookup google.com -> falha',
    },
    comentarios: [
      { linha: 1, texto: 'A internet funciona: o caminho até 8.8.8.8 está bom.' },
      { linha: 2, texto: 'O nome não resolve: suspeito é o DNS.' },
      { linha: 3, texto: 'Confirmação: trocar o servidor DNS costuma resolver.' },
    ],
  },
  guiado: [
    prever(
      'Quantos saltos restam a um pacote que parte com TTL 3 e passa por 2 roteadores?',
      'let ttl = 3;\nttl--;\nttl--;\nconsole.log(ttl);',
      ['1'],
      'Cada roteador reduz o TTL em 1: 3 − 2 = 1.',
      [{ resposta: '3', feedback: 'O TTL diminui a cada roteador atravessado.' }],
    ),
    prever(
      'Qual a perda de pacotes se foram enviados 4 e chegaram 3?',
      'const enviados = 4;\nconst recebidos = 3;\nconsole.log(((enviados - recebidos) / enviados) * 100 + "%");',
      ['25%'],
      '1 pacote perdido em 4 é 25%.',
      [{ resposta: '75%', feedback: '75% é a taxa de entrega; a perda é o que não chegou.' }],
    ),
  ],
  indep: [
    mc(
      'O ping no IP funciona, mas pelo nome não. Qual é a causa mais provável?',
      'O DNS',
      [
        ['O cabo de rede', 'Se o ping por IP funciona, o cabo está bom.'],
        ['A placa de rede', 'A placa funciona, pois o ping por IP responde.'],
      ],
      'Nome falha e IP funciona: o DNS é o suspeito.',
    ),
    completar(
      'Complete o comando que mostra os saltos até um destino (Linux).',
      'const comando = "___ google.com";',
      [{ aceitas: ['traceroute'], feedback: 'traceroute lista os roteadores do caminho.' }],
      'No Windows, o comando é tracert.',
    ),
  ],
  desafio: programaJs(
    'Escreva diagnosticar(t). t tem os booleanos gateway, ip e nome (true = o teste passou). Devolva "rede local" se o gateway falhar, senão "internet" se o ip falhar, senão "dns" se o nome falhar, senão "ok".',
    'function diagnosticar(t) {\n  // seu código aqui\n}',
    'function diagnosticar(t) {\n  if (!t.gateway) return "rede local";\n  if (!t.ip) return "internet";\n  if (!t.nome) return "dns";\n  return "ok";\n}',
    'diagnosticar',
    [
      { argumentos: [{ gateway: false, ip: false, nome: false }], esperado: 'rede local' },
      { argumentos: [{ gateway: true, ip: false, nome: false }], esperado: 'internet' },
      { argumentos: [{ gateway: true, ip: true, nome: false }], esperado: 'dns' },
      { argumentos: [{ gateway: true, ip: true, nome: true }], esperado: 'ok' },
    ],
    [
      'Teste na ordem do mais perto ao mais longe.',
      'Devolva assim que encontrar a primeira falha.',
    ],
    'A ordem importa: a primeira falha indica a camada com problema.',
  ),
  rec: [
    associar(
      'Associe a ferramenta à sua função.',
      [
        ['ping', 'Testa se um destino responde e mede a latência'],
        ['traceroute', 'Mostra os roteadores do caminho'],
        ['nslookup', 'Consulta o DNS'],
        ['ipconfig / ip addr', 'Mostra o IP e o gateway do computador'],
      ],
      'Quatro ferramentas que resolvem a maioria dos casos.',
    ),
    ordenar(
      'Ordene os testes do diagnóstico.',
      ['Ping em 127.0.0.1', 'Ping no gateway', 'Ping em 8.8.8.8', 'Ping no nome do site'],
      'Do mais perto para o mais longe.',
    ),
  ],
  explique: {
    enunciado: 'Explique como você diagnosticaria "o site não abre" usando ping.',
    modelo:
      'Testo do mais perto para o mais longe: ping no gateway (rede local), em 8.8.8.8 (internet por IP) e no nome do site (DNS). Onde falhar primeiro está a causa; se 8.8.8.8 responde e o nome não, o problema é o DNS.',
    rubrica: [
      'Seguiu a ordem do mais perto ao mais longe',
      'Distinguiu teste por IP e por nome',
      'Concluiu onde está a falha',
    ],
  },
  resumo: [
    'Diagnostique do mais perto ao mais longe.',
    'Ping mede latência e perda; traceroute mostra os saltos.',
    'IP responde e o nome não: é DNS.',
    'Firewalls podem bloquear o ICMP.',
  ],
  cards: [
    ['Ferramenta para ver o caminho?', 'traceroute (tracert).'],
    ['Ping por IP ok e por nome falha?', 'DNS.'],
    ['O que o ping mede?', 'Latência e perda de pacotes.'],
    ['Por que "timed out" nem sempre é queda?', 'O ICMP pode estar bloqueado.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes de Computadores (módulo 1): camadas, rotas e DNS orientam cada teste.',
      'Fundamentos da Computação: Terminal e linha de comando.',
      'Cibersegurança: as mesmas ferramentas fazem o reconhecimento de redes.',
    ],
    profissional:
      'Atendimento de suporte e infraestrutura vive de diagnóstico sistemático e de saber registrar o que cada teste mostrou.',
  },
});
