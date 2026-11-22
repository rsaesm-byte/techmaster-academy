import { associar, mc, montar, prever } from './montar';

export const f15 = montar({
  id: 'fundamentos.m03.a05',
  titulo: 'Criptografia: esconder mensagens',
  objetivo:
    'Explicar o que é cifrar e decifrar, aplicar a cifra de César, entender por que ela é fácil de quebrar e por que a criptografia moderna depende de chaves grandes.',
  pre: ['fundamentos.m01.a02', 'fundamentos.m02.a05'],
  min: 30,
  diag: mc(
    'Você envia uma mensagem por uma rede aberta e não quer que ninguém no caminho a entenda. O que fazer?',
    'Criptografar: embaralhar a mensagem com uma chave, de modo que só quem tem a chave a desembaralhe',
    [
      [
        'Escrever tudo em maiúsculas e sem espaços, para ficar ilegível',
        'Só muda a aparência; qualquer pessoa ainda lê a mensagem.',
      ],
      [
        'Enviar a mensagem aos poucos, em partes, para dificultar a leitura',
        'Enviar devagar não protege o conteúdo; é preciso cifrar.',
      ],
    ],
    'Criptografia transforma o texto original em algo ilegível. Só quem conhece a chave consegue reverter.',
  ),
  simples: {
    titulo: 'Mensagem trancada com chave',
    texto:
      '**Criptografar** (ou cifrar) é transformar uma mensagem em algo ilegível usando uma **chave**. **Decifrar** é o caminho de volta. Quem intercepta o texto cifrado não entende nada sem a chave.\n\nA cifra mais antiga é a de **César**: desloca cada letra no alfabeto. Com chave 3, A vira D, B vira E, e "OLA" vira "ROD". Ela é fácil de quebrar: existem só 25 chaves, e qualquer um testa todas em segundos. É a chamada **força bruta**.\n\nA criptografia moderna usa chaves de 128 bits ou mais: 2¹²⁸ possibilidades, um número impossível de testar.',
    essencial:
      'Cifrar = embaralhar com chave; decifrar = desfazer. César: desloca letras (chave 3: A→D). Só 25 chaves: quebra por força bruta. Hoje: chaves de 128 bits ou mais.',
    guiado:
      'Para cifrar "OLA" com chave 3:\n1. Pegue cada letra.\n2. Ande 3 posições no alfabeto: O→R, L→O, A→D.\n3. Resultado: ROD.\n4. Para decifrar, ande 3 posições para trás.',
    tecnico:
      'Cifras simétricas (AES) usam a mesma chave para cifrar e decifrar; cifras assimétricas (RSA, curvas elípticas) usam um par de chaves, pública e privada, e servem para trocar chaves e assinar mensagens. O HTTPS combina as duas: um par de chaves para combinar uma chave simétrica, e esta para o tráfego. O princípio de Kerckhoffs diz que a segurança deve depender só da chave, e não do segredo do algoritmo.',
  },
  analogia: {
    titulo: 'O cadeado e a chave',
    texto:
      'A cifra é um cadeado: qualquer pessoa vê o cadeado e sabe como ele funciona, mas só quem tem a chave abre. A cifra de César é um cadeado de brinquedo, com só 25 combinações possíveis: um curioso tenta todas em minutos. A criptografia moderna é um cadeado com mais combinações do que grãos de areia na Terra.',
    limites:
      'Um cadeado físico pode ser arrombado de outras formas; criptografia forte também pode falhar se a chave for roubada, fraca ou mal guardada. Por isso a segurança depende também de senhas fortes, como visto na aula anterior.',
  },
  demo: {
    titulo: 'Cifre e quebre',
    instrucoes:
      'Digite uma mensagem e mova a chave: veja o texto cifrado. Depois clique em "Quebrar a cifra" e veja as 25 tentativas: quanto tempo você levaria para achar a frase certa? Isso mostra por que César não protege nada.',
    simulacao: { tipo: 'cesar' },
  },
  tecnica: {
    titulo: 'Da cifra de César ao HTTPS',
    texto:
      '**César:** cada letra é deslocada d posições (módulo 26). Para decifrar, desloca-se −d.\n\n**Fraquezas:** só 25 chaves (força bruta) e a frequência das letras se mantém, o que permite quebrar por análise de frequência.\n\n**Criptografia moderna:**\n- **Simétrica (AES):** mesma chave nas duas pontas; rápida.\n- **Assimétrica (RSA):** chave pública para cifrar, privada para decifrar; resolve o problema de combinar a chave.\n- **Hash (SHA-256):** resumo de tamanho fixo, sem volta; usado para checar integridade. Para guardar senhas usa-se um hash lento com sal (bcrypt, Argon2), e não o SHA-256 puro.\n\n**Regra de ouro:** nunca invente sua própria criptografia; use bibliotecas e padrões revisados por especialistas.\n\n**Tamanho da chave:** cada bit dobra o trabalho. Uma chave de 128 bits tem 2¹²⁸ possibilidades.',
  },
  diagrama: {
    titulo: 'Enviando uma mensagem cifrada',
    nos: [
      { forma: 'inicio', texto: 'Mensagem original: OLA' },
      { forma: 'passo', texto: 'Cifrar com a chave (César, chave 3): ROD' },
      { forma: 'passo', texto: 'O texto cifrado viaja pela rede: quem intercepta vê só ROD' },
      { forma: 'fim', texto: 'O destinatário decifra com a mesma chave e lê OLA' },
    ],
    descricao:
      'A mensagem OLA é cifrada com a chave 3 e vira ROD. O texto cifrado viaja pela rede e quem o intercepta só vê ROD. O destinatário, que conhece a chave, decifra e lê OLA.',
  },
  exemplo: {
    titulo: 'César com chave 3',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'alfabeto: A B C D E F G H I J K L M N O P ...\nchave = 3\nO -> R\nL -> O\nA -> D\n"OLA" vira "ROD"\nPara decifrar: R -> O, O -> L, D -> A',
    },
    comentarios: [
      { linha: 3, texto: 'O → P → Q → R: três posições adiante.' },
      { linha: 6, texto: 'Mensagem cifrada: sem a chave, "ROD" não diz nada.' },
      { linha: 7, texto: 'Decifrar é andar a mesma quantidade no sentido contrário.' },
    ],
  },
  guiado: [
    prever(
      'Cifre "ABC" com a cifra de César, chave 1.',
      'A -> B\nB -> C\nC -> ?',
      ['BCD'],
      'Cada letra anda uma posição: A vira B, B vira C e C vira D.',
      [{ resposta: 'ABC', feedback: 'Com chave 1, cada letra muda de lugar.' }],
    ),
    mc(
      'O que é a "chave" na criptografia?',
      'A informação secreta que permite cifrar e decifrar',
      [
        [
          'O nome do programa de criptografia que as duas pessoas usam',
          'A chave é um segredo, não o nome do programa.',
        ],
        [
          'A velocidade da conexão segura entre o emissor e o destinatário',
          'A chave não mede velocidade: é o segredo da cifra.',
        ],
      ],
      'Sem a chave, o texto cifrado é inútil para quem o intercepta.',
    ),
  ],
  indep: [
    mc(
      'Por que a cifra de César é fácil de quebrar?',
      'Existem só 25 chaves possíveis, e é rápido testar todas',
      [
        [
          'Porque usa só letras maiúsculas, o que torna a leitura óbvia',
          'O ponto fraco são as poucas chaves, não o tipo de letra.',
        ],
        [
          'Porque o algoritmo é secreto e qualquer um acaba descobrindo',
          'O algoritmo é público; a fraqueza é o número pequeno de chaves.',
        ],
      ],
      'A força bruta testa todas as 25 chaves em segundos.',
      1,
    ),
    prever(
      'Decifre "ROD", que foi cifrado com a cifra de César e chave 3.',
      'R -> O\nO -> L\nD -> ?',
      ['OLA'],
      'Andando 3 posições para trás: R vira O, O vira L e D vira A.',
      [
        {
          resposta: 'URG',
          feedback: 'Isso seria andar 3 para a frente. Para decifrar, ande para trás.',
        },
      ],
    ),
  ],
  desafio: mc(
    'Uma chave de 128 bits tem 2¹²⁸ possibilidades. Por que isso é muito mais seguro que as 25 chaves do César?',
    'Cada bit dobra o número de chaves: o número fica tão grande que é impossível testar todas',
    [
      [
        'Porque o número 128 é bem maior que o 25 e dificulta a conta',
        'Não é o 128 em si, mas o fato de cada bit dobrar as chaves.',
      ],
      [
        'Porque a chave de 128 bits é secreta e a cifra de César dispensa chave',
        'O César também tem chave (o deslocamento); ela só é fácil de testar.',
      ],
    ],
    '2¹²⁸ ≈ 3,4 × 10³⁸ chaves. Mesmo testando bilhões por segundo, levaria mais tempo que a idade do universo.',
    2,
  ),
  rec: [
    associar(
      'Associe cada conceito à sua descrição.',
      [
        ['Cifrar', 'Transformar a mensagem em algo ilegível com uma chave'],
        ['Decifrar', 'Voltar ao texto original usando a chave'],
        ['Força bruta', 'Testar todas as chaves possíveis'],
        ['Hash', 'Resumo de tamanho fixo, sem volta'],
      ],
      'Cifrar e decifrar são inversos com a chave; a força bruta ataca testando chaves; o hash não tem volta.',
    ),
    mc(
      'Qual é a regra de ouro ao usar criptografia no seu sistema?',
      'Usar bibliotecas e padrões revisados por especialistas, e não inventar a própria cifra',
      [
        [
          'Manter o algoritmo em segredo, para que ninguém consiga analisá-lo',
          'Segurança que depende de segredo do algoritmo é frágil; use padrões abertos.',
        ],
        [
          'Usar sempre uma chave fixa e conhecida, como a 3, para não esquecê-la',
          'Chaves fixas e curtas são fáceis de quebrar.',
        ],
      ],
      'Algoritmos conhecidos e testados por anos são muito mais confiáveis do que invenções próprias.',
    ),
  ],
  explique: {
    enunciado:
      'Explique por que 25 chaves não bastam e por que as chaves modernas têm 128 bits ou mais.',
    modelo:
      'Com só 25 chaves, o atacante testa todas em segundos (força bruta). Chaves de 128 bits têm 2 elevado a 128 possibilidades, porque cada bit dobra o número de chaves; é impossível testar todas, então o atacante não consegue achar a chave.',
    rubrica: [
      'Citou a força bruta (testar todas as chaves)',
      'Disse que cada bit dobra o número de chaves',
      'Concluiu que 128 bits tornam inviável testar todas',
    ],
  },
  resumo: [
    'Criptografia transforma mensagens em algo ilegível com uma chave; decifrar desfaz.',
    'César desloca letras; só tem 25 chaves e cai na força bruta.',
    'Cada bit a mais dobra o número de chaves: 128 bits são inviáveis de quebrar por força bruta.',
    'Use padrões consagrados (AES, RSA, HTTPS); nunca invente a sua própria cifra.',
  ],
  cards: [
    [
      'O que é a cifra de César?',
      'Uma cifra que desloca cada letra um número fixo de posições no alfabeto.',
    ],
    ['O que é força bruta?', 'Testar todas as chaves possíveis até achar a certa.'],
    [
      'Qual a diferença entre cifra simétrica e assimétrica?',
      'Simétrica usa a mesma chave nas duas pontas; assimétrica usa um par (pública e privada).',
    ],
    [
      'Para que serve um hash?',
      'Gerar um resumo de tamanho fixo, sem volta, para checar integridade (senhas pedem um hash lento com sal).',
    ],
  ],
  conexoes: {
    disciplinas: [
      'Matemática: potências de 2 e aritmética modular sustentam as cifras.',
      'Redes: o HTTPS usa criptografia para proteger o tráfego da web.',
      'Segurança da Informação: gestão de chaves e certificados é o dia a dia da área.',
    ],
    profissional:
      'Ao ver o cadeado no navegador, há criptografia protegendo a conexão. Entender o princípio ajuda a avaliar riscos, como certificados vencidos, chaves vazadas e senhas guardadas sem hash.',
  },
});
