import type { AulaEntrada } from '@/domain/conteudo';

const P = (corpo: string, decl: string) => `var\n${decl}\ninicio\n${corpo}\nfimalgoritmo`;

export const m02a01: AulaEntrada = {
  id: 'logica.m02.a01',
  versao: 1,
  status: 'publicada',
  titulo: 'Vetores: muitos valores, um só nome',
  objetivo:
    'Declarar vetores, acessar e alterar elementos pelo índice, percorrer vetores com para e resolver problemas clássicos como soma, média e maior valor.',
  preRequisitos: ['logica.m01.a05'],
  duracaoMin: 30,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado: 'Você precisa guardar as notas de 40 alunos. Qual é o melhor jeito?',
          alternativas: [
            { id: 'a', texto: 'Um vetor com 40 posições, percorrido por um laço' },
            {
              id: 'b',
              texto: '40 variáveis: nota1, nota2, ..., nota40',
              feedback: 'Funciona, mas não dá para percorrer com um laço: cada nome é diferente.',
            },
            {
              id: 'c',
              texto: 'Uma variável só, que vai sendo sobrescrita',
              feedback: 'Cada nova nota apagaria a anterior: no fim só sobraria a última.',
            },
          ],
          correta: 'a',
          explicacao:
            'Um vetor guarda vários valores do mesmo tipo sob um único nome, acessados por posição — perfeito para laços.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Uma fileira de gavetas numeradas',
      texto:
        'Um **vetor** é uma variável que guarda vários valores do mesmo tipo, um em cada **posição**. Para usar um deles, escrevemos o nome e o número da posição entre colchetes: `notas[3]`.\n\nA grande vantagem: a posição pode ser uma variável. Com `notas[i]` dentro de um `para`, um laço de 3 linhas percorre 40 notas.',
      porModo: {
        essencial:
          'Vetor = vários valores do mesmo tipo, um nome só. `notas[i]` é o valor na posição i. Combine com para i de 1 ate n.',
        guiado:
          'Imagine um armário com uma fileira de gavetas numeradas.\n1. O armário tem um nome: `notas`.\n2. Cada gaveta tem um número: 1, 2, 3...\n3. `notas[2] <- 9` guarda 9 na gaveta 2.\n4. `escreva(notas[2])` mostra o que tem na gaveta 2.\nComo o número pode ser uma variável, um laço abre gaveta por gaveta.',
        tecnico:
          'Um vetor (array unidimensional) é uma estrutura homogênea de tamanho fixo, com elementos em posições contíguas acessadas por índice em tempo constante. Em Portugol, `v: vetor[1..n] de tipo` declara índices de 1 a n; acessar fora do intervalo é erro.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Os armários do vestiário',
      texto:
        'Um vestiário tem uma fileira de armários numerados. "Armário 12" identifica um só, sem confusão. Um vetor é igual: o nome é a fileira, e o índice é o número do armário.',
      limites:
        'Num vestiário cada armário pode guardar coisas diferentes. Num vetor, todos os elementos têm o mesmo tipo. E o vetor tem tamanho fixo: não dá para pedir o "armário 41" num vetor de 40.',
    },
    {
      id: 'demo-vetor',
      tipo: 'demo',
      titulo: 'Veja o vetor sendo preenchido e percorrido',
      instrucoes:
        'Avance passo a passo: observe cada nota entrar na sua gaveta numerada e, depois, a variável `maior` mudar só quando aparece uma nota maior.\n\nTroque as entradas e tente prever o resultado antes de executar.',
      simulacao: {
        tipo: 'visualizador',
        codigo: P(
          '  para i de 1 ate 5 faca\n    leia(notas[i])\n  fimpara\n  maior <- notas[1]\n  para i de 2 ate 5 faca\n    se notas[i] > maior entao\n      maior <- notas[i]\n    fimse\n  fimpara\n  escreva("Maior nota: ", maior)',
          '  notas: vetor[1..5] de real\n  i: inteiro\n  maior: real',
        ),
        entradas: ['7', '9.5', '4', '8', '6'],
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Declarar, acessar, percorrer',
      texto:
        '**Declaração:** `notas: vetor[1..5] de real` cria 5 posições, de 1 a 5, todas do tipo real.\n\n**Acesso:** `notas[3]` é um valor como outro qualquer: dá para usar em contas, comparações e atribuições (`notas[3] <- 8`).\n\n**Índice:** pode ser qualquer expressão inteira: `notas[i]`, `notas[i + 1]`, `notas[n]`. Fora de 1..5, o programa para com erro.\n\n**Percorrer:** `para i de 1 ate 5 faca ... notas[i] ... fimpara` visita cada posição uma vez.\n\n**Padrões clássicos:** somar todos (acumulador), contar quantos atendem a uma condição (contador), achar o maior (começa com o primeiro elemento e compara com os outros).',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Achar o maior valor de um vetor',
      nos: [
        { forma: 'inicio', texto: 'maior <- v[1] (o primeiro é o maior até agora)' },
        { forma: 'passo', texto: 'Para cada posição i de 2 até n:' },
        { forma: 'decisao', texto: 'v[i] > maior? Se sim: maior <- v[i]' },
        { forma: 'passo', texto: 'Próxima posição' },
        { forma: 'fim', texto: 'Ao final, maior guarda o maior valor' },
      ],
      descricao:
        'Começa supondo que o primeiro elemento é o maior. Depois percorre as posições de 2 até n; sempre que encontra um valor maior que o guardado, atualiza a variável maior. Ao terminar, ela guarda o maior valor do vetor.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Média e quantos ficaram acima dela',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'var\n  n: vetor[1..4] de real\n  i, acima: inteiro\n  soma, media: real\ninicio\n  n[1] <- 6\n  n[2] <- 8\n  n[3] <- 5\n  n[4] <- 9\n  soma <- 0\n  para i de 1 ate 4 faca\n    soma <- soma + n[i]\n  fimpara\n  media <- soma / 4\n  acima <- 0\n  para i de 1 ate 4 faca\n    se n[i] > media entao\n      acima <- acima + 1\n    fimse\n  fimpara\n  escreva("Média ", media, ", acima: ", acima)\nfimalgoritmo',
      },
      comentarios: [
        { linha: 2, texto: 'Um vetor de 4 posições reais.' },
        { linha: 11, texto: 'Primeiro laço: acumulador soma todos os elementos (28).' },
        { linha: 14, texto: 'Média = 28 / 4 = 7.' },
        { linha: 16, texto: 'Segundo laço: contador de quantos estão acima da média.' },
        {
          linha: 21,
          texto:
            'Resultado: Média 7, acima: 2 (o 8 e o 9). Sem vetor, não daria para comparar depois de calcular a média!',
        },
      ],
    },
    {
      id: 'ex-guiado',
      tipo: 'exercicio',
      modo: 'guiado',
      titulo: 'Exercício guiado',
      questoes: [
        {
          id: 'ex-guiado.q1',
          tipo: 'prever-saida',
          enunciado: 'O que aparece na tela?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'var\n  v: vetor[1..3] de inteiro\ninicio\n  v[1] <- 4\n  v[2] <- v[1] * 2\n  v[3] <- v[1] + v[2]\n  escreva(v[3])\nfimalgoritmo',
          },
          respostasAceitas: ['12'],
          errosComuns: [
            { resposta: '8', feedback: 'v[2] vale 8, mas v[3] é v[1] + v[2] = 4 + 8.' },
            { resposta: '6', feedback: 'v[2] não é 2: é v[1] * 2 = 8.' },
          ],
          pistas: ['Anote o valor de cada posição depois de cada linha.'],
          explicacao: 'v[1] = 4; v[2] = 4 * 2 = 8; v[3] = 4 + 8 = 12.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete o laço que soma os 10 elementos do vetor v.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'soma <- 0\npara i de 1 ate ___ faca\n  soma <- soma + v[___]\nfimpara',
          },
          lacunas: [
            { aceitas: ['10'], feedback: 'O vetor tem 10 posições: o laço vai até 10.' },
            { aceitas: ['i'], feedback: 'A posição muda a cada volta: use a variável do laço.' },
          ],
          explicacao: 'para i de 1 ate 10, somando v[i]: cada volta pega uma posição diferente.',
        },
      ],
    },
    {
      id: 'ex-indep',
      tipo: 'exercicio',
      modo: 'independente',
      titulo: 'Agora é com você',
      questoes: [
        {
          id: 'ex-indep.q1',
          tipo: 'identificar-erro',
          enunciado: 'Este programa para com erro ao executar. Qual linha causa o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'var\n  v: vetor[1..5] de inteiro\n  i: inteiro\ninicio\n  para i de 1 ate 5 faca\n    v[i] <- i * i\n  fimpara\n  escreva(v[6])\nfimalgoritmo',
          },
          linhaErrada: 8,
          feedbackPorLinha: {
            '5': 'O laço vai de 1 a 5, exatamente as posições do vetor.',
            '6': 'Guardar i * i em v[i] está correto.',
          },
          explicacao: 'O vetor vai de 1 a 5. v[6] não existe: é um acesso fora dos limites.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado:
            'Complete: o programa lê 5 números para o vetor e deve escrever QUANTOS deles são pares.',
          codigoInicial: P(
            '  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n',
            '  v: vetor[1..5] de inteiro\n  i, pares: inteiro',
          ),
          solucao: P(
            '  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n  pares <- 0\n  para i de 1 ate 5 faca\n    se v[i] % 2 = 0 entao\n      pares <- pares + 1\n    fimse\n  fimpara\n  escreva(pares)',
            '  v: vetor[1..5] de inteiro\n  i, pares: inteiro',
          ),
          casos: [
            { entradas: ['1', '2', '3', '4', '5'], saidaEsperada: ['2'] },
            { entradas: ['2', '4', '6', '8', '10'], saidaEsperada: ['5'] },
            { entradas: ['1', '3', '5', '7', '9'], saidaEsperada: ['0'] },
          ],
          pistas: ['Use um contador que começa em 0.', 'Um número é par quando v[i] % 2 = 0.'],
          explicacao: 'Um segundo laço percorre o vetor e um contador soma 1 a cada elemento par.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: inverter',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado: 'Leia 4 números para o vetor e escreva-os na ORDEM INVERSA, um por linha.',
          codigoInicial: P(
            '  para i de 1 ate 4 faca\n    leia(v[i])\n  fimpara\n',
            '  v: vetor[1..4] de inteiro\n  i: inteiro',
          ),
          solucao: P(
            '  para i de 1 ate 4 faca\n    leia(v[i])\n  fimpara\n  para i de 4 ate 1 passo -1 faca\n    escreva(v[i])\n  fimpara',
            '  v: vetor[1..4] de inteiro\n  i: inteiro',
          ),
          casos: [
            { entradas: ['1', '2', '3', '4'], saidaEsperada: ['4', '3', '2', '1'] },
            { entradas: ['9', '0', '7', '5'], saidaEsperada: ['5', '7', '0', '9'] },
          ],
          pistas: ['O para também conta para trás: passo -1.'],
          explicacao: 'Um para de 4 até 1 com passo -1 percorre o vetor de trás para a frente.',
        },
      ],
    },
    {
      id: 'recuperacao',
      tipo: 'recuperacao',
      titulo: 'Sem olhar para cima: responda de memória',
      questoes: [
        {
          id: 'rec.q1',
          tipo: 'multipla-escolha',
          enunciado:
            'Num vetor declarado como `v: vetor[1..8] de inteiro`, qual acesso é inválido?',
          alternativas: [
            { id: 'a', texto: 'v[0]' },
            { id: 'b', texto: 'v[8]', feedback: '8 é a última posição válida.' },
            {
              id: 'c',
              texto: 'v[i] com i valendo 3',
              feedback: 'i vale 3, que está entre 1 e 8: válido.',
            },
          ],
          correta: 'a',
          explicacao: 'As posições vão de 1 a 8. A posição 0 não existe neste vetor.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado:
            'Para achar o maior valor de um vetor, com que valor a variável "maior" deve começar?',
          alternativas: [
            { id: 'a', texto: 'Com o primeiro elemento do vetor' },
            {
              id: 'b',
              texto: 'Com 0',
              feedback: 'Se todos os valores forem negativos, o 0 "venceria" sem estar no vetor.',
            },
            {
              id: 'c',
              texto: 'Com o último índice',
              feedback: 'O índice é a posição, não um dos valores guardados.',
            },
          ],
          correta: 'a',
          explicacao: 'Começar com v[1] garante que "maior" é sempre um valor que existe no vetor.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique por que um vetor é melhor que várias variáveis separadas para guardar 40 notas.',
          respostaModelo:
            'Com um vetor, as 40 notas ficam sob um único nome e são acessadas pela posição. Como a posição pode ser uma variável, um laço "para" percorre todas com poucas linhas. Com 40 variáveis separadas, seria preciso escrever cada nome à mão.',
          rubrica: [
            'Disse que o vetor usa um único nome com posições',
            'Citou que dá para percorrer com um laço',
            'Comparou com o trabalho de 40 variáveis separadas',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Vetor guarda vários valores do mesmo tipo sob um nome; cada um tem uma posição (índice).',
        '`v: vetor[1..n] de tipo` declara; `v[i]` lê ou altera a posição i.',
        'Laço para + índice variável = percorrer o vetor inteiro.',
        'Acessar uma posição fora dos limites é erro.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m02.a01.fc1',
          frente: 'O que é um vetor?',
          verso: 'Uma variável que guarda vários valores do mesmo tipo, acessados pela posição.',
        },
        {
          id: 'logica.m02.a01.fc2',
          frente: 'Como declarar um vetor de 10 inteiros?',
          verso: 'v: vetor[1..10] de inteiro',
        },
        {
          id: 'logica.m02.a01.fc3',
          frente: 'Por que vetores combinam com o laço para?',
          verso: 'Porque o índice pode ser a variável do laço: v[i] visita uma posição por volta.',
        },
        {
          id: 'logica.m02.a01.fc4',
          frente: 'Com que valor começar a busca pelo maior elemento?',
          verso: 'Com o primeiro elemento, v[1].',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Linguagens de Programação: em JavaScript e Python, listas começam na posição 0, não 1.',
        'Banco de Dados: uma coluna de tabela é parecida com um vetor de valores do mesmo tipo.',
        'Inteligência Artificial: imagens, textos e embeddings são vetores (e matrizes) de números.',
      ],
      aplicacaoProfissional:
        'Relatórios de TI percorrem vetores o tempo todo: os tempos de resposta das últimas 24 horas, o uso de disco de cada servidor. Achar o maior, a média e quantos passaram de um limite são exatamente os padrões desta aula.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
