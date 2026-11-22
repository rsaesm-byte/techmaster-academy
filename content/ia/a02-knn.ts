import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ia02 = montar({
  id: 'ia.m01.a02',
  titulo: 'Classificando por vizinhança (k-NN)',
  objetivo:
    'Entender um algoritmo de ML simples e intuitivo: classificar um ponto pelo vizinho mais próximo.',
  pre: ['ia.m01.a01'],
  min: 30,
  diag: mc(
    'Um fruto novo é parecido com laranjas que você já viu. Que rótulo provavelmente ele terá?',
    'Laranja',
    [
      ['Maçã', 'Não é parecido com maçãs.'],
      ['Banana', 'Não é parecido com bananas.'],
    ],
    'Quem se parece, pertence ao mesmo grupo.',
  ),
  simples: {
    titulo: 'Diga-me com quem andas',
    texto:
      'O **k-NN** (k vizinhos mais próximos) é um dos algoritmos mais simples de ML:\n\n1. Guarde os exemplos de treino (ponto + rótulo).\n2. Para um ponto novo, calcule a **distância** até cada exemplo.\n3. Pegue os **k mais próximos**.\n4. O rótulo é o **mais comum** entre eles.\n\nCom **k = 1**, basta o vizinho mais próximo.\n\nEm uma dimensão, a distância é `|a - b|`. Em duas, usa-se a distância **euclidiana**: raiz de (Δx² + Δy²).\n\n**Cuidados:**\n- k pequeno é sensível a ruído; k grande "borra" as fronteiras.\n- Variáveis em escalas diferentes distorcem a distância: **normalize**.',
    essencial:
      'k-NN classifica pelo voto dos k exemplos mais próximos. Depende da distância e da escala dos dados.',
    guiado:
      'Para aplicar:\n1. Reúna exemplos rotulados.\n2. Normalize as variáveis.\n3. Escolha k (comece com 3 ou 5).\n4. Calcule as distâncias e pegue os k menores.\n5. Vote e confira com dados de teste.',
    tecnico:
      'O k-NN é um **aprendizado preguiçoso** (lazy): não treina nada, só guarda os dados e calcula na hora de prever, o que fica lento com muitos exemplos. Ajuda a usar **estruturas de índice** (árvores KD) ou busca aproximada. A **maldição da dimensionalidade** faz as distâncias perderem sentido com muitas variáveis. Em regressão, o k-NN devolve a **média** dos vizinhos em vez do voto. Escolher k costuma ser feito com **validação cruzada**.',
  },
  analogia: {
    titulo: 'Pedir indicação ao bairro',
    texto:
      'Para saber se um restaurante novo é bom, você pergunta aos 3 vizinhos que moram mais perto e têm gosto parecido com o seu. A opinião da maioria deles vira sua previsão.',
    limites: 'Se os vizinhos forem poucos ou enviesados, a previsão também será.',
  },
  demo: {
    titulo: 'Vizinho mais próximo em uma dimensão',
    instrucoes:
      'Execute e veja a qual grupo pertence cada ponto novo. Mude os valores de treino e os pontos testados.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const treino = [[1, "pequeno"], [2, "pequeno"], [9, "grande"], [10, "grande"]];\nfunction classificar(x) {\n  let melhor = treino[0];\n  for (const ex of treino) {\n    if (Math.abs(ex[0] - x) < Math.abs(melhor[0] - x)) melhor = ex;\n  }\n  return melhor[1];\n}\nfor (const x of [3, 5, 8]) {\n  console.log(x, "->", classificar(x));\n}',
    },
  },
  tecnica: {
    titulo: 'Escolhendo o k',
    texto:
      '**k = 1:** segue cada ruído.\n**k muito grande:** ignora detalhes locais.\n**Dica:** use k ímpar em duas classes para evitar empate e valide com dados de teste.',
  },
  diagrama: {
    titulo: 'Como o k-NN decide',
    nos: [
      { forma: 'inicio', texto: 'Chega um ponto novo' },
      { forma: 'passo', texto: 'Mede a distância até todos os exemplos' },
      { forma: 'passo', texto: 'Seleciona os k mais próximos' },
      { forma: 'fim', texto: 'Vota e devolve o rótulo mais comum' },
    ],
    descricao: 'Sem treino: só memória e distância.',
  },
  exemplo: {
    titulo: 'Distância euclidiana',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function distancia(a, b) {\n  const dx = a[0] - b[0];\n  const dy = a[1] - b[1];\n  return Math.sqrt(dx * dx + dy * dy);\n}\nconsole.log(distancia([0, 0], [3, 4]));',
    },
    comentarios: [{ linha: 4, texto: 'Dá 5: o clássico triângulo 3-4-5.' }],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const treino = [[2, "A"], [9, "B"]];\nconst x = 7;\nlet melhor = treino[0];\nfor (const ex of treino) {\n  if (Math.abs(ex[0] - x) < Math.abs(melhor[0] - x)) melhor = ex;\n}\nconsole.log(melhor[1]);',
      ['B'],
      'A distância até 9 é 2 e até 2 é 5.',
      [{ resposta: 'A', feedback: 'Compare as distâncias, não os valores.' }],
    ),
    mc(
      'O que o k-NN faz ao receber um ponto novo?',
      'Mede a distância até os exemplos e vota entre os k mais próximos',
      [
        ['Treina uma rede neural', 'Isso não faz parte do k-NN.'],
        ['Apaga os exemplos mais distantes', 'Ele os guarda.'],
      ],
      'Distância e voto.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const pontos = [3, 8, 5];\nconsole.log(Math.min(...pontos.map((p) => Math.abs(p - 6))));',
      ['1'],
      'As distâncias até 6 são 3, 2 e 1; o mínimo é 1.',
      [{ resposta: '2', feedback: 'Confira o ponto 5.' }],
    ),
    mc(
      'Por que normalizar as variáveis no k-NN?',
      'Para que nenhuma variável domine a distância pela escala',
      [
        ['Para deixar o código menor', 'Não tem relação com tamanho de código.'],
        ['Para remover os rótulos', 'Os rótulos continuam.'],
      ],
      'Altura em cm e salário em reais, por exemplo.',
    ),
  ],
  desafio: programaJs(
    'Escreva vizinhoMaisProximo(treino, x): "treino" é uma lista de [valor, rotulo]. Devolva o rótulo do exemplo cujo valor está mais perto de x. Em caso de empate, vale o primeiro da lista.',
    'function vizinhoMaisProximo(treino, x) {\n  // seu código aqui\n}',
    'function vizinhoMaisProximo(treino, x) {\n  let melhor = treino[0];\n  for (const ex of treino) {\n    if (Math.abs(ex[0] - x) < Math.abs(melhor[0] - x)) melhor = ex;\n  }\n  return melhor[1];\n}',
    'vizinhoMaisProximo',
    [
      {
        argumentos: [
          [
            [1, 'a'],
            [10, 'b'],
          ],
          3,
        ],
        esperado: 'a',
      },
      {
        argumentos: [
          [
            [1, 'a'],
            [10, 'b'],
          ],
          8,
        ],
        esperado: 'b',
      },
      {
        argumentos: [
          [
            [0, 'x'],
            [4, 'y'],
          ],
          2,
        ],
        esperado: 'x',
      },
    ],
    [
      'Guarde o melhor exemplo visto até agora.',
      'Só troque o melhor se a distância for estritamente menor.',
    ],
    'O "<" estrito mantém o primeiro em caso de empate.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['k-NN', 'Classifica pelo voto dos vizinhos mais próximos'],
        ['Distância euclidiana', 'Raiz da soma dos quadrados das diferenças'],
        ['Normalização', 'Colocar as variáveis na mesma escala'],
        ['Aprendizado preguiçoso', 'Não treina: guarda os dados e calcula na hora'],
      ],
      'Conceitos do k-NN.',
    ),
    completar(
      'Complete: o nome da distância em linha reta.',
      'A distância ___ usa a raiz da soma dos quadrados.',
      [{ aceitas: ['euclidiana'], feedback: 'É a distância em linha reta.' }],
      'Em duas dimensões: Δx² + Δy².',
    ),
  ],
  explique: {
    enunciado:
      'Explique como o k-NN classifica um ponto novo e por que a escala das variáveis importa.',
    modelo:
      'O k-NN calcula a distância entre o ponto novo e todos os exemplos de treino, seleciona os k mais próximos e adota o rótulo mais comum entre eles. Como depende de distâncias, variáveis em escalas muito diferentes dominam o cálculo, por isso é preciso normalizá-las.',
    rubrica: [
      'Descreveu distância e voto dos k vizinhos',
      'Explicou o papel do k',
      'Explicou o problema da escala',
    ],
  },
  resumo: [
    'k-NN: voto dos k mais próximos.',
    'Não treina: guarda os dados.',
    'Escolha k com validação.',
    'Normalize as variáveis.',
  ],
  cards: [
    ['O que é k-NN?', 'Classificação pelos k vizinhos mais próximos.'],
    ['O que muda com k grande?', 'Decisões mais suaves e menos detalhe.'],
    ['Por que normalizar?', 'Evitar que a escala domine a distância.'],
    ['O que é distância euclidiana?', 'Distância em linha reta.'],
  ],
  conexoes: {
    disciplinas: [
      'Matemática: distâncias e geometria.',
      'Algoritmos: busca do menor valor.',
      'Python: scikit-learn traz o k-NN pronto.',
    ],
    profissional:
      'Sistemas de recomendação usam a ideia de vizinhança: pessoas parecidas gostam de coisas parecidas.',
  },
});
