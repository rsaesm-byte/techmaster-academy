import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const c02 = montar({
  id: 'ciberseguranca.m01.a02',
  titulo: 'Senhas, hash, sal e autenticação multifator',
  objetivo:
    'Entender como senhas são guardadas (hash e sal) e por que o segundo fator protege contas.',
  pre: ['ciberseguranca.m01.a01', 'fundamentos.m02.a05'],
  min: 30,
  diag: mc(
    'Um sistema bem projetado guarda a senha do usuário como...',
    'Um hash com sal, e nunca o texto da senha',
    [
      ['Texto puro, para poder enviar por e-mail', 'Senhas em texto puro vazam inteiras.'],
      [
        'Criptografada com uma chave que a equipe guarda',
        'Se a chave vazar, todas as senhas vazam.',
      ],
    ],
    'Hash é um caminho de mão única: não dá para recuperar a senha original.',
  ),
  simples: {
    titulo: 'Guardar sem saber',
    texto:
      'Um site seguro **não sabe a sua senha**. Ele guarda só o **hash**: uma "impressão digital" calculada por uma função de mão única.\n\n- **Login:** calcula o hash do que você digitou e compara com o guardado.\n- **Vazamento:** o invasor leva só hashes, e não as senhas.\n- **Sal (salt):** um texto aleatório diferente para cada usuário, misturado à senha antes do hash. Dois usuários com a mesma senha têm hashes diferentes, o que inutiliza tabelas prontas de hashes.\n\nE o **segundo fator (MFA)** garante que, mesmo com a senha roubada, o invasor ainda precise de algo que você **tem** (celular, chave física).',
    essencial:
      'Hash (mão única) + sal (único por usuário) protegem as senhas guardadas. MFA protege a conta mesmo se a senha vazar.',
    guiado:
      'Para você, usuário:\n1. Senha longa e única em cada site (use um gerenciador).\n2. Ative o MFA, de preferência por app ou chave física.\n3. Desconfie de pedidos de código por mensagem.',
    tecnico:
      'Para senhas usa-se hashes **lentos de propósito**, como **bcrypt, scrypt ou Argon2**, e não o SHA-256 puro, que é rápido demais e facilita testar bilhões de tentativas por segundo. O ataque de **dicionário** testa senhas comuns; **força bruta** testa tudo; **credential stuffing** reaproveita senhas vazadas de outros sites, por isso senhas únicas importam. O MFA se baseia em **algo que você sabe** (senha), **tem** (celular, chave) e **é** (biometria). Códigos por SMS são vulneráveis a troca de chip (SIM swap); apps TOTP e chaves FIDO2 são melhores.',
  },
  analogia: {
    titulo: 'Impressão digital e cadeado duplo',
    texto:
      'O hash é a impressão digital da senha: serve para conferir, mas não dá para reconstruir a pessoa a partir dela. O sal é um carimbo diferente por usuário. O MFA é uma segunda fechadura: quem tem a chave da primeira ainda não entra.',
    limites:
      'Se a senha for fraca, o hash pode ser descoberto por tentativas; por isso o tamanho da senha importa.',
  },
  demo: {
    titulo: 'Hash e sal em miniatura',
    instrucoes:
      'Este hash é um brinquedo didático (não use em produção). Veja: mesma senha, mesmo hash; com sal diferente, hashes diferentes.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const hash = (texto) => {\n  let h = 5381;\n  for (const c of texto) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;\n  return h;\n};\nconsole.log("abc:", hash("abc"));\nconsole.log("abc de novo:", hash("abc"));\nconsole.log("sal1+abc:", hash("s1" + "abc"));\nconsole.log("sal2+abc:", hash("s2" + "abc"));\nconsole.log("Mesma senha, sais diferentes => hashes diferentes");',
    },
  },
  tecnica: {
    titulo: 'Senha forte na prática',
    texto:
      '**Tamanho vence complexidade:** "cavalo-bateria-grampo-lua" é melhor que "P@ssw0rd!".\n**Única por site:** um vazamento não abre as outras contas.\n**Gerenciador de senhas:** gera e guarda por você.\n**MFA:** app autenticador ou chave física, e não SMS, quando possível.\n**Nunca compartilhe códigos** de verificação, nem com "o suporte".',
  },
  diagrama: {
    titulo: 'Login com hash',
    nos: [
      { forma: 'inicio', texto: 'Você digita usuário e senha' },
      { forma: 'passo', texto: 'O servidor junta o sal e calcula o hash' },
      { forma: 'decisao', texto: 'O hash é igual ao guardado?' },
      { forma: 'fim', texto: 'Sim: pede o segundo fator e entra. Não: acesso negado' },
    ],
    descricao: 'O servidor compara hashes e nunca guarda a senha em si.',
  },
  exemplo: {
    titulo: 'O que o banco de dados guarda',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'usuario: ana\nsal: 9f3a...\nhash: 5d41402abc4b...\n(a senha em si NÃO é guardada)',
    },
    comentarios: [
      { linha: 2, texto: 'O sal é público dentro do banco: o que importa é ser único.' },
      { linha: 3, texto: 'Do hash não se volta à senha, só se confere.' },
    ],
  },
  guiado: [
    prever(
      'Quantas senhas de 8 caracteres (letras maiúsculas, minúsculas e dígitos) existem?',
      'console.log(62 ** 8);',
      ['218340105584896'],
      '62 símbolos possíveis em cada uma das 8 posições.',
      [
        {
          resposta: '496',
          feedback: 'O resultado é gigantesco: cada posição multiplica as possibilidades.',
        },
      ],
    ),
    mc(
      'Por que usar um sal diferente para cada usuário?',
      'Para que a mesma senha gere hashes diferentes e tabelas prontas não funcionem',
      [
        ['Para o hash poder ser revertido', 'O hash continua sendo de mão única.'],
        ['Para a senha ficar mais curta', 'O sal não muda o tamanho da senha do usuário.'],
      ],
      'O sal quebra o ataque com tabelas prontas.',
    ),
  ],
  indep: [
    mc(
      'Qual destas senhas é a mais forte?',
      'cavalo-bateria-grampo-lua',
      [
        ['P@ssw0rd!', 'É comum e previsível, apesar dos símbolos.'],
        ['Ana1990', 'Usa dados pessoais e é curta.'],
      ],
      'Frases longas e aleatórias têm muito mais combinações.',
    ),
    completar(
      'Complete: o MFA exige algo que você sabe e algo que você ___.',
      'const fatores = "sabe + ___";',
      [{ aceitas: ['tem'], feedback: 'Algo que você tem, como o celular ou uma chave física.' }],
      'Os fatores: sabe, tem e é.',
    ),
  ],
  desafio: programaJs(
    'Escreva criterios(senha): devolve quantos destes critérios a senha cumpre: ter 12 ou mais caracteres, ter letra minúscula, ter letra maiúscula, ter dígito e ter símbolo (qualquer caractere que não seja letra nem dígito).',
    'function criterios(senha) {\n  // seu código aqui\n}',
    'function criterios(senha) {\n  let total = 0;\n  if (senha.length >= 12) total++;\n  if (/[a-z]/.test(senha)) total++;\n  if (/[A-Z]/.test(senha)) total++;\n  if (/[0-9]/.test(senha)) total++;\n  if (/[^a-zA-Z0-9]/.test(senha)) total++;\n  return total;\n}',
    'criterios',
    [
      { argumentos: ['abc'], esperado: 1 },
      { argumentos: ['Abc12345!xyz'], esperado: 5 },
      { argumentos: ['ABCDEFGHIJKL'], esperado: 2 },
      { argumentos: ['1234'], esperado: 1 },
      { argumentos: [''], esperado: 0 },
    ],
    [
      'Use expressões regulares com test: /[a-z]/.test(senha).',
      'Some 1 ao total a cada critério cumprido.',
    ],
    'Cada critério é um teste independente; o resultado é a soma dos que passaram.',
  ),
  rec: [
    associar(
      'Associe o conceito à função.',
      [
        ['Hash', 'Impressão digital de mão única da senha'],
        ['Sal', 'Texto aleatório único por usuário'],
        ['MFA', 'Segundo fator além da senha'],
        ['Gerenciador de senhas', 'Gera e guarda senhas únicas e fortes'],
      ],
      'Quatro peças da proteção de contas.',
    ),
    mc(
      'O que é credential stuffing?',
      'Testar senhas vazadas de um site em outros sites',
      [
        ['Quebrar um hash por força bruta', 'Isso é um ataque diferente.'],
        ['Enviar e-mails falsos', 'Isso é phishing.'],
      ],
      'Por isso cada site deve ter uma senha única.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique por que sites guardam hash em vez da senha e para que serve o sal.',
    modelo:
      'O hash é uma função de mão única: o site só precisa conferir se o hash do que foi digitado é igual ao guardado, sem conhecer a senha, então um vazamento não revela as senhas. O sal é um valor aleatório por usuário, misturado antes do hash, que faz senhas iguais terem hashes diferentes e impede o uso de tabelas prontas.',
    rubrica: [
      'Explicou que o hash é de mão única',
      'Explicou a comparação no login',
      'Explicou o papel do sal',
    ],
  },
  resumo: [
    'Sites seguros guardam hash com sal, e não a senha.',
    'Use hashes lentos (bcrypt, Argon2) para senhas.',
    'Senha longa e única, com gerenciador.',
    'MFA protege a conta mesmo com a senha vazada.',
  ],
  cards: [
    ['O que é um hash?', 'Impressão digital de mão única.'],
    ['Para que serve o sal?', 'Tornar o hash único por usuário.'],
    ['O que é MFA?', 'Mais de um fator: sabe, tem, é.'],
    ['Melhor segundo fator?', 'App autenticador ou chave física.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos: criptografia e a aula de senhas.',
      'Python e JavaScript: bibliotecas como bcrypt e hashlib.',
      'Banco de Dados: nunca guarde senhas em texto puro.',
    ],
    profissional:
      'Guardar senhas corretamente é obrigação de quem desenvolve sistemas; usar MFA é o hábito de maior retorno de quem os usa.',
  },
});
