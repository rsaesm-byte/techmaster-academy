import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const r07 = montar({
  id: 'redes.m02.a02',
  titulo: 'Wi-Fi: como funciona e como proteger',
  objetivo:
    'Entender frequências e canais do Wi-Fi e escolher uma configuração segura (WPA2/WPA3).',
  pre: ['redes.m02.a01'],
  min: 25,
  diag: mc(
    'Qual protocolo de segurança do Wi-Fi é o mais recente e forte?',
    'WPA3',
    [
      ['WEP', 'O WEP é antigo e quebrado em minutos.'],
      ['WPA', 'O WPA original foi superado pelo WPA2 e pelo WPA3.'],
    ],
    'Use WPA3 ou, no mínimo, WPA2 com senha forte.',
  ),
  simples: {
    titulo: 'Rádio compartilhado',
    texto:
      'O Wi-Fi é **rádio**: todos os dispositivos de um canal dividem o mesmo ar, como pessoas falando numa sala.\n\n- **2,4 GHz:** alcança mais longe e atravessa paredes, mas é mais lento e lotado. Canais sem sobreposição: **1, 6 e 11**.\n- **5 GHz:** mais rápido e menos disputado, mas com alcance menor.\n- **6 GHz (Wi-Fi 6E/7):** ainda mais livre.\n\nSegurança: **WPA3** (ou WPA2-AES) com senha longa. Evite WEP e redes abertas para dados sensíveis.',
    essencial:
      '2,4 GHz alcança longe e é lento; 5 GHz é rápido e de curto alcance. Use WPA3/WPA2 com senha forte e rede de visitantes separada.',
    guiado:
      'Para uma rede doméstica ou de escritório segura:\n1. WPA3 (ou WPA2-AES).\n2. Senha longa, com 12 ou mais caracteres.\n3. Desative o WPS.\n4. Crie uma rede separada para visitantes.\n5. Mantenha o firmware do roteador atualizado.',
    tecnico:
      'O acesso ao meio é por **CSMA/CA**: cada dispositivo "escuta" antes de falar, e quanto mais gente no canal, mais esperas. Roteadores escolhem o canal automaticamente, mas em prédios vale analisar os vizinhos. O WPA3 substitui a troca de chaves por **SAE**, resistente a ataques de dicionário offline. O WPS por PIN é vulnerável. Em empresas usa-se **WPA-Enterprise (802.1X)**, com usuário e senha individuais validados por um servidor RADIUS em vez de uma senha única compartilhada.',
  },
  analogia: {
    titulo: 'Conversa numa sala',
    texto:
      'Se todos falam ao mesmo tempo, ninguém se entende. O 2,4 GHz é a sala pequena e cheia, onde a voz alcança longe, mas todo mundo atrapalha. O 5 GHz é uma sala com menos gente, onde o som é limpo, mas só quem está perto ouve bem.',
    limites:
      'Na prática os aparelhos esperam a sua vez; por isso muitos dispositivos no mesmo canal deixam tudo lento.',
  },
  demo: {
    titulo: 'Avaliando redes Wi-Fi',
    instrucoes: 'Execute e depois mude a segurança das redes e veja a classificação mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const nivel = { ABERTA: 0, WEP: 1, WPA: 2, WPA2: 3, WPA3: 4 };\nconst redes = [\n  { nome: "Cafe", seg: "ABERTA" },\n  { nome: "Casa", seg: "WPA2" },\n  { nome: "Escritorio", seg: "WPA3" },\n  { nome: "Vizinho", seg: "WEP" },\n];\nfor (const r of redes) {\n  const n = nivel[r.seg];\n  const aviso = n >= 3 ? "segura" : n >= 1 ? "fraca" : "SEM proteção";\n  console.log(r.nome + " (" + r.seg + "): " + aviso);\n}',
    },
  },
  tecnica: {
    titulo: 'Boas práticas',
    texto:
      '**Senha:** frases longas valem mais que símbolos curtos.\n**SSID:** o nome não precisa revelar a empresa ou o modelo.\n**Rede de visitantes:** isolada da rede interna.\n**Wi-Fi público:** não é seguro para dados sensíveis sem VPN, e sites HTTPS ajudam.\n**Sinal:** poucos obstáculos, roteador no alto e central.',
  },
  diagrama: {
    titulo: 'Escolhendo a banda',
    nos: [
      { forma: 'inicio', texto: 'Preciso de Wi-Fi para este dispositivo' },
      { forma: 'decisao', texto: 'Está perto do roteador?' },
      { forma: 'passo', texto: 'Sim: 5 GHz, mais rápido e menos disputado' },
      { forma: 'fim', texto: 'Não: 2,4 GHz, alcança mais longe' },
    ],
    descricao: 'Distância manda: perto use 5 GHz, longe use 2,4 GHz.',
  },
  exemplo: {
    titulo: 'Quanto vale uma senha curta',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: '8 letras minúsculas: 26^8 combinações\n12 caracteres mistos: 62^12 combinações',
    },
    comentarios: [
      { linha: 1, texto: 'Cerca de 200 bilhões: um computador potente testa isso em horas.' },
      { linha: 2, texto: 'Aumentar o tamanho cresce de forma exponencial.' },
    ],
  },
  guiado: [
    prever(
      'Quantas senhas de 8 letras minúsculas existem?',
      'console.log(26 ** 8);',
      ['208827064576'],
      '26 possibilidades por posição, 8 posições: 26^8.',
      [
        {
          resposta: '208',
          feedback: 'O resultado é de bilhões; cada posição multiplica as possibilidades.',
        },
      ],
    ),
    prever(
      'Qual o protocolo mais forte desta lista?',
      'const s = ["WEP", "WPA", "WPA2", "WPA3"];\nconsole.log(s[s.length - 1]);',
      ['WPA3'],
      'O último item da lista, que está ordenada do mais fraco ao mais forte.',
      [{ resposta: 'WEP', feedback: 'WEP é o primeiro e mais fraco.' }],
    ),
  ],
  indep: [
    mc(
      'Qual conjunto de canais de 2,4 GHz não se sobrepõe?',
      '1, 6 e 11',
      [
        ['1, 2 e 3', 'Canais vizinhos se sobrepõem.'],
        ['5, 6 e 7', 'Eles interferem uns nos outros.'],
      ],
      'Os canais 1, 6 e 11 ficam espaçados o bastante.',
    ),
    completar(
      'Complete: a rede para convidados deve ficar ___ da rede interna.',
      'const regra = "rede de visitantes ___ da rede interna";',
      [{ aceitas: ['separada', 'isolada'], feedback: 'Separada ou isolada.' }],
      'Visitantes não devem alcançar os equipamentos internos.',
    ),
  ],
  desafio: ordenar(
    'Ordene as redes, da MENOS para a MAIS segura.',
    ['Aberta (sem senha)', 'WEP', 'WPA2', 'WPA3'],
    'Aberta, WEP, WPA2 e WPA3, em ordem crescente de segurança.',
  ),
  rec: [
    associar(
      'Associe a banda à característica.',
      [
        ['2,4 GHz', 'Maior alcance e mais congestionada'],
        ['5 GHz', 'Mais rápida e de menor alcance'],
        ['WPA3', 'Troca de chaves resistente a ataques de dicionário'],
        ['WPA-Enterprise', 'Autenticação individual (802.1X e RADIUS)'],
      ],
      'Cada escolha troca alcance por velocidade ou conveniência por segurança.',
    ),
    mc(
      'Por que desativar o WPS?',
      'O PIN do WPS é vulnerável a tentativas de adivinhação',
      [
        ['Ele deixa o Wi-Fi lento por manter uma conexão sempre aberta', 'O motivo é segurança.'],
        [
          'Ele não funciona com WPA3 e causa erros de conexão',
          'O problema do WPS é o PIN vulnerável.',
        ],
      ],
      'Conectar por PIN é um atalho que enfraquece a segurança.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre 2,4 GHz e 5 GHz e como proteger uma rede Wi-Fi.',
    modelo:
      'O 2,4 GHz alcança mais longe e atravessa paredes, mas é mais lento e disputado; o 5 GHz é mais rápido e menos lotado, porém de menor alcance. Para proteger a rede uso WPA3 (ou WPA2-AES) com senha longa, desativo o WPS, separo uma rede de visitantes e mantenho o firmware atualizado.',
    rubrica: [
      'Comparou alcance e velocidade',
      'Citou WPA2 ou WPA3 e senha forte',
      'Citou rede de visitantes ou outra boa prática',
    ],
  },
  resumo: [
    '2,4 GHz: longe e lento; 5 GHz: perto e rápido.',
    'Canais sem sobreposição em 2,4 GHz: 1, 6 e 11.',
    'Use WPA3 ou WPA2-AES com senha longa.',
    'Rede de visitantes separada; WPS desativado.',
  ],
  cards: [
    ['Canais livres de sobreposição?', '1, 6 e 11 (2,4 GHz).'],
    ['Protocolo mais forte?', 'WPA3.'],
    ['Banda mais rápida e curta?', '5 GHz.'],
    ['O que é 802.1X?', 'Autenticação individual em redes corporativas.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: criptografia e senhas.',
      'Cibersegurança: ataques a Wi-Fi e redes falsas.',
      'Redes de Computadores: camadas física e de enlace.',
    ],
    profissional:
      'Projetar cobertura e segurança do Wi-Fi é tarefa comum em suporte e infraestrutura de escritórios.',
  },
});
