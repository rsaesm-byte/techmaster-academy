import { associar, mc, montar, prever } from './montar';

export const f10 = montar({
  id: 'fundamentos.m02.a05',
  titulo: 'Senhas e segurança: por que o tamanho importa',
  objetivo:
    'Explicar entropia de senha em bits, comparar senhas curtas e longas e adotar práticas seguras: gerenciador de senhas e verificação em duas etapas.',
  pre: ['fundamentos.m01.a01'],
  min: 25,
  diag: mc(
    'Qual destas senhas é mais difícil de adivinhar por um programa?',
    'Uma frase longa e aleatória, como "cafe-ponte-nuvem-tigre-87"',
    [
      [
        '"Senha@123", porque tem símbolo e número',
        'É um padrão muito comum, que está em listas de senhas vazadas.',
      ],
      [
        '"Ricardo1990", porque é fácil de lembrar',
        'Nome e ano de nascimento são os primeiros palpites de um atacante.',
      ],
    ],
    'Comprimento e imprevisibilidade importam mais que trocar letras por símbolos de um jeito previsível.',
  ),
  simples: {
    titulo: 'Quantos palpites para acertar?',
    texto:
      'Um atacante pode testar milhões de senhas por segundo. A segurança de uma senha é **quantos palpites** ele precisaria. Medimos em **bits de entropia**: cada bit **dobra** o trabalho.\n\nA conta é simples: entropia = **comprimento × log₂(quantidade de símbolos possíveis)**. Letras minúsculas dão 26 símbolos (4,7 bits cada); com maiúsculas, números e símbolos são 94 (6,6 bits cada). Mas só vale se a senha for **aleatória**: palavras e padrões comuns são testados primeiro.',
    essencial:
      'Entropia (bits) = comprimento × log₂(símbolos). Cada bit dobra o trabalho do atacante. Comprimento pesa mais; e a senha precisa ser imprevisível.',
    guiado:
      'Para estimar uma senha aleatória:\n1. Conte quantos tipos de caractere ela usa (26, 52, 62 ou 94).\n2. Calcule log₂ desse número: ~4,7; 5,7; 6,0 ou 6,6.\n3. Multiplique pelo comprimento.\n4. Compare: abaixo de 40 bits é fraca; acima de 80, muito forte.',
    tecnico:
      'Para senhas geradas por sorteio uniforme, a entropia é L·log₂(N) bits e o tempo médio de busca é 2^(H−1) tentativas. Senhas escolhidas por humanos têm entropia efetiva bem menor, pois seguem padrões. Servidores devem guardar apenas um hash lento e salgado (bcrypt, scrypt, Argon2), nunca a senha em si. A verificação em duas etapas (2FA) protege mesmo se a senha vazar.',
  },
  analogia: {
    titulo: 'Um cadeado de combinação',
    texto:
      'Um cadeado de 3 dígitos tem 1.000 combinações: um ladrão paciente abre em minutos. Um de 6 dígitos tem 1.000.000. Cada dígito a mais multiplica o trabalho por 10. Com senhas é igual: cada caractere a mais multiplica o trabalho pelo tamanho do alfabeto.',
    limites:
      'No cadeado, ninguém suspeita que você usou 1-2-3. Com senhas, atacantes testam primeiro as combinações mais prováveis (datas, nomes, "123456"), então senhas previsíveis valem muito menos do que a conta indica.',
  },
  demo: {
    titulo: 'Teste a força',
    instrucoes:
      'Comece com 8 letras minúsculas: veja a entropia e o tempo de quebra. Depois ligue maiúsculas, números e símbolos. Em seguida, volte para só minúsculas e aumente o comprimento para 16. O que ajudou mais, variar os tipos ou aumentar o tamanho?',
    simulacao: { tipo: 'senha' },
  },
  tecnica: {
    titulo: 'Contas, ataques e defesas',
    texto:
      '**Números:** 8 minúsculas ≈ 38 bits; 8 caracteres com tudo ≈ 52 bits; 12 caracteres com tudo ≈ 79 bits; 16 com tudo ≈ 105 bits.\n\n**Tipos de ataque:** força bruta (testa todas as combinações), dicionário (testa palavras e senhas vazadas) e reaproveitamento (usa uma senha vazada em outros sites).\n\n**Defesas:**\n- Senha longa e única para cada serviço (frases de 4 palavras aleatórias funcionam bem).\n- **Gerenciador de senhas**: gera e guarda tudo; você só decora uma senha mestra.\n- **Verificação em duas etapas (2FA)**: mesmo com a senha vazada, falta o segundo fator.\n- Nunca compartilhe senhas nem as anote em locais visíveis.',
  },
  diagrama: {
    titulo: 'Escolhendo uma senha segura',
    nos: [
      { forma: 'inicio', texto: 'Preciso de uma senha para um serviço' },
      { forma: 'decisao', texto: 'É única e aleatória, com 12 caracteres ou mais?' },
      { forma: 'passo', texto: 'Se não, deixe um gerenciador de senhas gerar uma' },
      { forma: 'passo', texto: 'Ative a verificação em duas etapas' },
      { forma: 'fim', texto: 'Conta protegida contra palpites e vazamentos' },
    ],
    descricao:
      'Pergunte se a senha é única, aleatória e longa. Se não for, use um gerenciador de senhas para gerá-la. Em seguida, ative a verificação em duas etapas. Assim a conta fica protegida contra palpites e contra vazamentos de senha.',
  },
  exemplo: {
    titulo: 'Comparando duas senhas',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'A: "Senha@123"  (previsível: está em listas de vazamentos)\nB: 4 palavras sorteadas, 20 letras minúsculas\n\nentropia de B = 20 × log2(26) = 20 × 4,7 = 94 bits\nentropia efetiva de A: baixíssima, quebrada em segundos',
    },
    comentarios: [
      { linha: 1, texto: 'Misturar tipos de caractere não ajuda se o padrão for comum.' },
      {
        linha: 4,
        texto: 'B só tem letras minúsculas, mas o comprimento e o sorteio dão muita entropia.',
      },
      {
        linha: 5,
        texto: 'O que conta é o quanto a senha é imprevisível, não o quanto parece complicada.',
      },
    ],
  },
  guiado: [
    mc(
      'Cada bit a mais de entropia faz o trabalho de quebrar a senha...',
      'Dobrar',
      [
        ['Aumentar em 1 tentativa', 'O crescimento é exponencial: dobra a cada bit.'],
        ['Ficar igual', 'Cada bit a mais dobra o espaço de busca.'],
      ],
      'Bits são potências de 2: 10 bits a mais multiplicam o trabalho por 1.024.',
    ),
    prever(
      'Um PIN de 4 dígitos (0–9) tem quantas combinações possíveis?',
      'Símbolos possíveis por posição: 10\nPosições: 4\nCombinações = 10 × 10 × 10 × 10',
      ['10000', '10.000', '10 000'],
      '10^4 = 10.000 combinações.',
      [
        {
          resposta: '40',
          feedback: 'As posições se multiplicam, não se somam: 10 × 10 × 10 × 10.',
        },
      ],
    ),
  ],
  indep: [
    mc(
      'O que aumenta mais a segurança de uma senha aleatória?',
      'Aumentar o comprimento',
      [
        [
          'Trocar uma letra por um símbolo',
          'Ajuda pouco: cada caractere a mais multiplica o trabalho muito mais.',
        ],
        [
          'Escrevê-la em letras maiúsculas',
          'Isso só vale se o atacante não souber que você usa maiúsculas, o que não é o caso.',
        ],
      ],
      'Cada caractere extra multiplica o espaço de busca pelo tamanho do alfabeto (26 a 94).',
    ),
    mc(
      'Para que serve a verificação em duas etapas (2FA)?',
      'Proteger a conta mesmo que a senha seja descoberta',
      [
        ['Deixar a senha mais curta', 'Não tem relação com o tamanho da senha.'],
        ['Substituir o gerenciador de senhas', 'São defesas complementares.'],
      ],
      'O segundo fator (app, chave ou código) é outra barreira: só a senha não basta para entrar.',
      2,
    ),
  ],
  desafio: associar(
    'Associe cada prática à ameaça que ela reduz.',
    [
      ['Senha única por serviço', 'Reaproveitamento de senha vazada'],
      ['Senha longa e aleatória', 'Força bruta'],
      ['Verificação em duas etapas', 'Invasão com a senha já descoberta'],
      ['Gerenciador de senhas', 'Senhas fracas e repetidas por esquecimento'],
    ],
    'Cada defesa cobre um risco: unicidade contra vazamentos em cadeia, tamanho contra tentativas, 2FA contra senha roubada e gerenciador contra a tentação de repetir.',
  ),
  rec: [
    mc(
      'Qual é a fórmula da entropia de uma senha aleatória?',
      'Comprimento × log₂(quantidade de símbolos possíveis)',
      [
        [
          'Comprimento + número de símbolos',
          'A soma não representa o espaço de busca, que cresce por multiplicação.',
        ],
        [
          'Só o número de símbolos especiais',
          'Todos os tipos de caractere contam, e o comprimento pesa muito.',
        ],
      ],
      'Cada posição multiplica as possibilidades por N; em bits, isso vira L × log₂(N).',
    ),
    mc(
      'Por que "Senha@123" é uma senha ruim apesar de ter letras, número e símbolo?',
      'Porque é um padrão previsível, testado logo no início por atacantes',
      [
        [
          'Porque tem poucas letras',
          'O problema não é a quantidade de letras e sim a previsibilidade.',
        ],
        [
          'Porque símbolos não são permitidos em senhas',
          'São permitidos; só não adiantam se o padrão for comum.',
        ],
      ],
      'Ataques de dicionário testam variações comuns de palavras primeiro. Aleatoriedade vale mais que aparência complexa.',
      2,
    ),
  ],
  explique: {
    enunciado: 'Explique por que uma senha longa é mais segura que uma curta com muitos símbolos.',
    modelo:
      'Cada caractere extra multiplica o número de combinações possíveis, enquanto trocar tipos de caractere só aumenta um pouco o alfabeto. A entropia é o comprimento vezes log₂ do alfabeto, então o comprimento tem efeito maior e dobra o trabalho do atacante a cada bit.',
    rubrica: [
      'Citou que cada caractere a mais multiplica as combinações',
      'Comparou o efeito do comprimento com o do alfabeto',
      'Mencionou entropia ou bits',
    ],
  },
  resumo: [
    'Entropia em bits mede o esforço do atacante: cada bit dobra o trabalho.',
    'Entropia = comprimento × log₂(símbolos); comprimento pesa mais.',
    'Senhas previsíveis valem menos que a conta indica.',
    'Use gerenciador de senhas, uma senha por serviço e ative o 2FA.',
  ],
  cards: [
    [
      'O que é entropia de uma senha?',
      'Uma medida, em bits, de quantos palpites seriam necessários para acertá-la.',
    ],
    ['O que cada bit de entropia faz?', 'Dobra o trabalho de quem tenta adivinhar a senha.'],
    ['Para que serve o 2FA?', 'Proteger a conta mesmo se a senha for descoberta.'],
    [
      'O que é um gerenciador de senhas?',
      'Um app que gera e guarda senhas únicas e fortes para cada serviço.',
    ],
  ],
  conexoes: {
    disciplinas: [
      'Segurança: servidores guardam hashes lentos (bcrypt, Argon2) em vez das senhas.',
      'Matemática: entropia usa logaritmos e potências de 2, como o binário.',
      'Desenvolvimento: formulários de cadastro e login precisam aplicar essas boas práticas.',
    ],
    profissional:
      'Num suporte de TI, a maioria dos incidentes de conta começa com senha fraca, repetida ou entregue em golpe de phishing. Orientar o uso de gerenciador e 2FA é uma das ações de maior impacto.',
  },
});
