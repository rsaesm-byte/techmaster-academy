import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ia04 = montar({
  id: 'ia.m01.a04',
  titulo: 'Redes neurais: o neurônio artificial',
  objetivo: 'Entender o neurônio artificial, os pesos e como uma rede aprende ajustando-os.',
  pre: ['ia.m01.a03'],
  min: 30,
  diag: mc(
    'Para decidir se vai ao parque, você pesa fatores: sol (muito importante), amigos (importante) e distância (pouco). Isso lembra o quê?',
    'Um neurônio artificial somando entradas com pesos',
    [
      [
        'Um banco de dados que guarda as informações de cada fator',
        'Banco de dados guarda, mas não pesa entradas para decidir.',
      ],
      [
        'Um compilador que traduz os fatores em instruções de máquina',
        'Compilador traduz código, não decide.',
      ],
    ],
    'Entradas com pesos diferentes.',
  ),
  simples: {
    titulo: 'Somar, pesar e decidir',
    texto:
      'Um **neurônio artificial** faz uma conta simples:\n\n```\nsoma = (entrada1 × peso1) + (entrada2 × peso2) + ... + viés\nsaída = ativação(soma)\n```\n\n- **Pesos:** a importância de cada entrada.\n- **Viés (bias):** um empurrão que ajusta o ponto de disparo.\n- **Função de ativação:** transforma a soma em uma saída (por exemplo, 1 se soma > 0, senão 0).\n\nUma **rede neural** liga muitos neurônios em **camadas**: entrada, camadas ocultas e saída.\n\n**Como aprende?** Compara a saída com a resposta certa (o **erro**) e ajusta os pesos para reduzir o erro, repetidas vezes. Esse método é a **descida do gradiente**, com o cálculo feito por **retropropagação**.',
    essencial:
      'Neurônio = soma ponderada + ativação. Redes são camadas de neurônios. O treino ajusta os pesos para reduzir o erro.',
    guiado:
      'Para entender uma rede:\n1. Pense em um neurônio: entradas, pesos, soma.\n2. Aplique a ativação.\n3. Empilhe neurônios em camadas.\n4. Calcule o erro da saída.\n5. Ajuste os pesos e repita muitas vezes.',
    tecnico:
      'Sem funções de ativação **não lineares** (ReLU, sigmoide, tanh), várias camadas equivaleriam a uma só. O **gradiente** indica em que direção cada peso deve mudar para reduzir o erro; a **taxa de aprendizado** controla o tamanho do passo. **Épocas** são passadas completas pelos dados; **lotes (batches)** são pedaços processados juntos. O **aprendizado profundo** usa muitas camadas e exige muitos dados e GPUs. Arquiteturas especializadas: **CNNs** (imagens), **RNNs** e **Transformers** (sequências e texto). Redes são difíceis de interpretar (caixas-pretas).',
  },
  analogia: {
    titulo: 'Mesa de mixagem',
    texto:
      'Uma mesa de som tem vários canais com botões de volume (pesos). Você ajusta cada volume até a mistura final soar bem. O treino de uma rede é ajustar milhões de botões automaticamente, ouvindo o erro.',
    limites: 'A rede não "entende": só ajusta números para reduzir o erro.',
  },
  demo: {
    titulo: 'Um neurônio que aprende o E lógico',
    instrucoes:
      'Execute: o neurônio com pesos 1 e 1 e viés -1,5 acende só quando as duas entradas são 1 (AND). Mude o viés para -0,5 e veja virar OU.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function neuronio(entradas, pesos, vies) {\n  let soma = vies;\n  for (let i = 0; i < entradas.length; i++) {\n    soma += entradas[i] * pesos[i];\n  }\n  return soma > 0 ? 1 : 0;\n}\nfor (const [a, b] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {\n  console.log(a, b, "->", neuronio([a, b], [1, 1], -1.5));\n}',
    },
  },
  tecnica: {
    titulo: 'Camadas',
    texto:
      '**Entrada:** recebe os dados brutos.\n**Ocultas:** extraem padrões cada vez mais abstratos (bordas, formas, objetos).\n**Saída:** entrega a resposta (ex.: a classe).\nMais camadas = mais capacidade e mais risco de overfitting.',
  },
  diagrama: {
    titulo: 'Treinando a rede',
    nos: [
      { forma: 'inicio', texto: 'Entra um exemplo e a rede calcula a saída' },
      { forma: 'passo', texto: 'Compara com a resposta certa: erro' },
      { forma: 'passo', texto: 'Retropropagação calcula o ajuste de cada peso' },
      { forma: 'fim', texto: 'Atualiza os pesos e repete' },
    ],
    descricao: 'Milhares de repetições reduzem o erro.',
  },
  exemplo: {
    titulo: 'Um cálculo à mão',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'entradas = [1, 2]\npesos    = [0.5, 0.25]\nvies     = -0.5\nsoma = 1*0.5 + 2*0.25 + (-0.5) = 0.5\nsaída = 1  (porque soma > 0)',
    },
    comentarios: [
      { linha: 4, texto: '0,5 + 0,5 - 0,5 = 0,5.' },
      { linha: 5, texto: 'A ativação degrau devolve 1 se a soma for positiva.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const entradas = [1, 2];\nconst pesos = [0.5, 0.25];\nconst soma = entradas[0] * pesos[0] + entradas[1] * pesos[1] - 0.5;\nconsole.log(soma > 0 ? 1 : 0);',
      ['1'],
      'A soma é 0,5, que é maior que 0.',
      [{ resposta: '0', feedback: 'Calcule 0,5 + 0,5 - 0,5.' }],
    ),
    mc(
      'O que os pesos representam em um neurônio?',
      'A importância de cada entrada',
      [
        [
          'O número de camadas que a rede possui antes da saída',
          'As camadas são outra parte da rede.',
        ],
        [
          'O tamanho do arquivo de dados usado no treinamento do modelo',
          'Pesos não medem tamanho: indicam a importância das entradas.',
        ],
      ],
      'Pesos maiores influenciam mais.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const soma = 1 * 1 + 0 * 1 - 1.5;\nconsole.log(soma > 0 ? 1 : 0);',
      ['0'],
      'A soma é -0,5, que não passa de 0.',
      [{ resposta: '1', feedback: 'Some -1,5.' }],
    ),
    mc(
      'Como uma rede neural aprende?',
      'Ajustando os pesos para reduzir o erro, repetidamente',
      [
        [
          'Memorizando as perguntas e respostas do treino, uma a uma',
          'Isso seria overfitting, e não aprendizado.',
        ],
        [
          'Reescrevendo o próprio código a cada erro para se corrigir',
          'Ela ajusta números (pesos), não o código.',
        ],
      ],
      'Descida do gradiente.',
    ),
  ],
  desafio: programaJs(
    'Escreva neuronio(entradas, pesos, vies): some as entradas multiplicadas pelos pesos e o viés; devolva 1 se a soma for maior que 0, senão 0.',
    'function neuronio(entradas, pesos, vies) {\n  // seu código aqui\n}',
    'function neuronio(entradas, pesos, vies) {\n  let soma = vies;\n  for (let i = 0; i < entradas.length; i++) {\n    soma += entradas[i] * pesos[i];\n  }\n  return soma > 0 ? 1 : 0;\n}',
    'neuronio',
    [
      { argumentos: [[1, 1], [1, 1], -1.5], esperado: 1 },
      { argumentos: [[1, 0], [1, 1], -1.5], esperado: 0 },
      { argumentos: [[0, 0], [1, 1], 0], esperado: 0 },
    ],
    ['Comece a soma com o viés.', 'A saída é 1 só se a soma for estritamente maior que 0.'],
    'Uma rede é só milhares desses neurônios ligados.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Peso', 'Importância de uma entrada'],
        ['Viés', 'Empurrão que ajusta o ponto de disparo'],
        ['Função de ativação', 'Transforma a soma na saída'],
        ['Retropropagação', 'Calcula o ajuste de cada peso a partir do erro'],
      ],
      'Partes de uma rede neural.',
    ),
    completar(
      'Complete: a técnica que reduz o erro ajustando os pesos passo a passo.',
      'A descida do ___ ajusta os pesos na direção que reduz o erro.',
      [{ aceitas: ['gradiente'], feedback: 'Gradiente indica a direção da maior subida do erro.' }],
      'Anda-se no sentido contrário.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é um neurônio artificial e como uma rede neural aprende.',
    modelo:
      'O neurônio artificial soma as entradas multiplicadas por pesos, acrescenta um viés e aplica uma função de ativação para gerar a saída. A rede aprende comparando a saída com a resposta certa (o erro) e ajustando os pesos com a descida do gradiente e a retropropagação, repetindo isso muitas vezes.',
    rubrica: [
      'Descreveu pesos, soma e ativação',
      'Citou o cálculo do erro',
      'Citou o ajuste dos pesos (gradiente)',
    ],
  },
  resumo: [
    'Neurônio: soma ponderada + ativação.',
    'Camadas formam a rede.',
    'Treino: reduzir o erro ajustando pesos.',
    'Redes profundas exigem dados e poder de cálculo.',
  ],
  cards: [
    ['O que é um peso?', 'A importância de uma entrada.'],
    ['O que é uma função de ativação?', 'Define a saída do neurônio.'],
    ['O que é uma época?', 'Uma passada completa pelos dados.'],
    ['O que é retropropagação?', 'Algoritmo que calcula os ajustes dos pesos.'],
  ],
  conexoes: {
    disciplinas: [
      'Matemática: derivadas e álgebra linear.',
      'Fundamentos: portas lógicas e o perceptron.',
      'Python: PyTorch e TensorFlow.',
    ],
    profissional:
      'Reconhecimento de voz, tradução e visão computacional usam redes neurais profundas.',
  },
});
