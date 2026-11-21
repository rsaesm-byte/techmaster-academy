import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const r08 = montar({
  id: 'redes.m02.a03',
  titulo: 'HTTPS e TLS: o cadeado do navegador',
  objetivo: 'Entender como o TLS autentica o servidor, combina chaves e protege a comunicação.',
  pre: ['redes.m02.a02', 'fundamentos.m03.a05'],
  min: 30,
  diag: mc(
    'O que o cadeado do HTTPS garante?',
    'Que a conexão é criptografada e que o servidor é quem diz ser',
    [
      ['Que o site é confiável e seguro', 'O cadeado não diz se o conteúdo é honesto.'],
      ['Que o site não tem vírus', 'Isso não faz parte do HTTPS.'],
    ],
    'TLS dá confidencialidade, integridade e autenticação do servidor.',
  ),
  simples: {
    titulo: 'Cofre, identidade e chave combinada',
    texto:
      'O **TLS** protege o HTTP (formando o **HTTPS**) com três garantias:\n\n1. **Autenticação:** um **certificado** prova que o servidor é mesmo o do domínio, assinado por uma **autoridade certificadora (CA)** em que o navegador confia.\n2. **Confidencialidade:** os dados viajam **criptografados**.\n3. **Integridade:** qualquer alteração no caminho é detectada.\n\nO truque: a **criptografia de chave pública** (lenta) é usada só para combinar uma **chave de sessão simétrica** (rápida) e o resto da conversa usa essa chave.',
    essencial:
      'Certificado prova a identidade; chave pública combina uma chave de sessão; a chave de sessão (simétrica) criptografa os dados.',
    guiado:
      'Ao abrir um site HTTPS:\n1. O navegador cumprimenta (ClientHello).\n2. O servidor envia o certificado.\n3. O navegador verifica a assinatura da CA e o nome do domínio.\n4. Os dois combinam a chave de sessão.\n5. Tudo passa a ir criptografado.',
    tecnico:
      "O TLS 1.3 reduz o handshake e usa troca de chaves **efêmera** (ECDHE), garantindo **sigilo futuro**: roubar a chave do servidor depois não decifra conversas antigas. Os certificados formam uma **cadeia de confiança**: certificado do site → CA intermediária → CA raiz instalada no sistema. O navegador também confere a validade (datas) e se o certificado não foi revogado. Certificados gratuitos (Let's Encrypt) automatizaram o HTTPS. O HTTPS protege o **caminho**: o servidor ainda vê tudo o que você envia a ele.",
  },
  analogia: {
    titulo: 'Documento de identidade e código secreto',
    texto:
      'O certificado é o RG do servidor, emitido por um cartório de confiança (a CA). Depois de conferir o RG, vocês dois combinam um código secreto só de vocês (a chave de sessão) e passam a conversar em código.',
    limites: 'Um RG verdadeiro prova quem é a pessoa, e não que ela seja honesta.',
  },
  demo: {
    titulo: 'A ideia da chave simétrica',
    instrucoes:
      'Execute: o mesmo XOR com a mesma chave cifra e decifra. Mude a chave e veja que a decifragem com a chave errada falha.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const cifrar = (texto, chave) =>\n  [...texto].map((c) => c.charCodeAt(0) ^ chave);\nconst decifrar = (codigos, chave) =>\n  codigos.map((n) => String.fromCharCode(n ^ chave)).join("");\nconst codigos = cifrar("senha123", 42);\nconsole.log("No fio:", codigos.join(" "));\nconsole.log("Chave certa:", decifrar(codigos, 42));\nconsole.log("Chave errada:", decifrar(codigos, 7));',
    },
  },
  tecnica: {
    titulo: 'Sinais de problema',
    texto:
      '**"Sua conexão não é particular":** certificado expirado, de outro domínio ou de CA desconhecida.\n**Nunca ignore o aviso** em páginas de login ou pagamento.\n**HTTPS não é selo de confiança:** sites falsos também usam HTTPS.\n**Cabeçalho HSTS:** manda o navegador usar sempre HTTPS naquele site.',
  },
  diagrama: {
    titulo: 'Handshake do TLS (simplificado)',
    nos: [
      { forma: 'inicio', texto: 'Cliente: ClientHello (versões e algoritmos)' },
      { forma: 'passo', texto: 'Servidor: certificado e parâmetros de chave' },
      { forma: 'decisao', texto: 'O certificado é válido e do domínio certo?' },
      {
        forma: 'fim',
        texto:
          'Sim: chave de sessão combinada e dados criptografados. Não: aviso e conexão recusada',
      },
    ],
    descricao: 'A verificação do certificado decide se a conexão segue.',
  },
  exemplo: {
    titulo: 'Quem confia em quem',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'CA raiz (instalada no sistema)\n  assina -> CA intermediária\n    assina -> certificado de exemplo.com',
    },
    comentarios: [
      { linha: 1, texto: 'O navegador já confia nas CAs raiz.' },
      { linha: 3, texto: 'A confiança desce pela cadeia de assinaturas até o site.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra? (XOR: a mesma chave cifra e decifra)',
      'console.log(5 ^ 3);',
      ['6'],
      '101 XOR 011 = 110, que é 6.',
      [{ resposta: '8', feedback: '^ é o XOR bit a bit, e não a potência.' }],
    ),
    prever(
      'E aplicando a mesma chave de novo?',
      'console.log((5 ^ 3) ^ 3);',
      ['5'],
      'XOR duas vezes com a mesma chave devolve o valor original.',
      [{ resposta: '6', feedback: 'A segunda aplicação desfaz a primeira.' }],
    ),
  ],
  indep: [
    mc(
      'Para que a criptografia de chave pública é usada no TLS?',
      'Para combinar com segurança a chave simétrica da sessão',
      [
        [
          'Para criptografar todos os dados',
          'A chave pública é lenta; os dados usam a chave simétrica.',
        ],
        ['Para comprimir a página', 'Compressão é outra coisa.'],
      ],
      'Chave pública para combinar; chave simétrica para o volume de dados.',
    ),
    completar(
      'Complete: quem assina o certificado é a autoridade ___.',
      'const quemAssina = "autoridade ___";',
      [{ aceitas: ['certificadora'], feedback: 'A autoridade certificadora (CA).' }],
      'A CA garante a identidade do site.',
    ),
  ],
  desafio: ordenar(
    'Ordene o handshake simplificado do TLS.',
    [
      'O cliente envia o ClientHello',
      'O servidor envia o certificado',
      'O cliente valida o certificado',
      'As partes combinam a chave de sessão',
      'Os dados passam a ser criptografados',
    ],
    'Primeiro a identidade, depois a chave e só então os dados.',
  ),
  rec: [
    associar(
      'Associe o conceito à função.',
      [
        ['Certificado', 'Prova a identidade do servidor'],
        ['CA', 'Entidade que assina certificados'],
        ['Chave de sessão', 'Chave simétrica que cifra os dados'],
        ['HSTS', 'Obriga o navegador a usar HTTPS'],
      ],
      'Os quatro pilares do HTTPS.',
    ),
    mc(
      'Um site com cadeado pode ser fraudulento?',
      'Sim: o cadeado prova a criptografia e o domínio, não a honestidade do dono',
      [
        ['Não, o cadeado garante que é confiável', 'Golpistas também obtêm certificados.'],
        ['Só se o certificado estiver vencido', 'Vencimento é outro problema.'],
      ],
      'Confira o endereço do site, e não só o cadeado.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que o TLS garante e por que usa dois tipos de criptografia.',
    modelo:
      'O TLS garante autenticação do servidor (certificado assinado por uma CA), confidencialidade e integridade. Usa criptografia de chave pública, mais lenta, apenas para combinar uma chave de sessão simétrica, e então a simétrica, bem mais rápida, protege os dados.',
    rubrica: [
      'Citou autenticação, sigilo e integridade',
      'Explicou o papel da chave pública',
      'Explicou o papel da chave simétrica',
    ],
  },
  resumo: [
    'TLS protege o HTTP: autenticação, sigilo e integridade.',
    'O certificado, assinado por uma CA, prova a identidade.',
    'Chave pública combina a chave de sessão simétrica.',
    'Cadeado não significa site honesto.',
  ],
  cards: [
    ['O que o certificado prova?', 'A identidade do servidor.'],
    ['Quem assina certificados?', 'A autoridade certificadora (CA).'],
    ['Que chave cifra os dados?', 'A de sessão, simétrica.'],
    ['O que é sigilo futuro?', 'Chaves efêmeras: roubo posterior não decifra o passado.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: criptografia simétrica e assimétrica.',
      'Desenvolvimento Web: toda API e site deve usar HTTPS.',
      'Cibersegurança: ataques de intermediário e certificados falsos.',
    ],
    profissional:
      'Renovar certificados e configurar HTTPS corretamente é tarefa de quem publica sites e APIs.',
  },
});
