import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ia03 = montar({
  id: 'ia.m01.a03',
  titulo: 'Avaliando modelos',
  objetivo:
    'Medir se um modelo funciona de verdade: treino e teste, acurácia, precisão, recall e overfitting.',
  pre: ['ia.m01.a02'],
  min: 30,
  diag: mc(
    'Um aluno decora as respostas da prova de treino e tira 10, mas na prova real vai mal. O que isso lembra no ML?',
    'Overfitting: decorar os dados em vez de aprender o padrão',
    [
      ['Um modelo perfeito', 'Um modelo perfeito também iria bem na prova real.'],
      ['Falta de memória do computador', 'Não é problema de hardware.'],
    ],
    'Ir bem no treino não basta.',
  ),
  simples: {
    titulo: 'Provas que revelam a verdade',
    texto:
      'Um modelo precisa ir bem em dados **que nunca viu**. Por isso se divide o conjunto em:\n- **Treino:** para o modelo aprender.\n- **Teste:** para avaliar, sem nunca ter sido usado no treino.\n\n**Acurácia:** percentual de acertos.\n\n```\nacurácia = acertos ÷ total\n```\n\nMas a acurácia engana quando as classes são desbalanceadas: se só 1% dos e-mails são golpe, um modelo que diz "nunca é golpe" tem 99% de acurácia e é inútil.\n\nPor isso há outras métricas:\n- **Precisão:** dos que o modelo marcou como positivos, quantos eram de fato?\n- **Recall:** dos positivos reais, quantos o modelo achou?\n\n**Overfitting:** o modelo decora o treino e falha no teste. **Underfitting:** ele é simples demais e falha nos dois.',
    essencial:
      'Avalie sempre em dados de teste. Acurácia pode enganar; use precisão e recall. Overfitting = ótimo no treino, ruim no teste.',
    guiado:
      'Para avaliar:\n1. Separe treino e teste (ex.: 80% e 20%).\n2. Treine só no treino.\n3. Meça no teste.\n4. Compare com uma linha de base simples.\n5. Olhe os erros para entender o que falha.',
    tecnico:
      'A **matriz de confusão** organiza verdadeiros positivos (VP), falsos positivos (FP), verdadeiros negativos (VN) e falsos negativos (FN). **Precisão = VP ÷ (VP + FP)**; **recall = VP ÷ (VP + FN)**; o **F1** é a média harmônica dos dois. A **validação cruzada** repete treino e teste em várias divisões. **Vazamento de dados** (data leakage) ocorre quando informação do teste entra no treino, inflando os resultados. O ajuste de **hiperparâmetros** usa um terceiro conjunto, o de **validação**. Para classes raras, prefira métricas como AUC e F1.',
  },
  analogia: {
    titulo: 'Simulado e prova real',
    texto:
      'Estudar com as mesmas questões da prova e depois ser avaliado nelas não mede nada. O simulado com questões novas mostra se você realmente aprendeu. O conjunto de teste é esse simulado inédito.',
    limites: 'Se você ajusta o modelo olhando o teste muitas vezes, ele deixa de ser inédito.',
  },
  demo: {
    titulo: 'Acurácia, precisão e recall',
    instrucoes:
      'Execute e veja as três métricas de um detector de golpes. Troque as previsões e observe como mudam.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const reais     = [1, 0, 0, 1, 0, 1, 0, 0];\nconst previstos = [1, 0, 1, 1, 0, 0, 0, 0];\nlet vp = 0, fp = 0, fn = 0, acertos = 0;\nfor (let i = 0; i < reais.length; i++) {\n  if (reais[i] === previstos[i]) acertos++;\n  if (previstos[i] === 1 && reais[i] === 1) vp++;\n  if (previstos[i] === 1 && reais[i] === 0) fp++;\n  if (previstos[i] === 0 && reais[i] === 1) fn++;\n}\nconsole.log("acurácia:", acertos / reais.length);\nconsole.log("precisão:", vp / (vp + fp));\nconsole.log("recall:", vp / (vp + fn));',
    },
  },
  tecnica: {
    titulo: 'Precisão ou recall?',
    texto:
      '**Priorize recall** quando perder um positivo é grave (doenças, fraudes).\n**Priorize precisão** quando um alarme falso é caro (bloquear clientes por engano).\nO equilíbrio depende do problema e do custo de cada erro.',
  },
  diagrama: {
    titulo: 'Treino e teste',
    nos: [
      { forma: 'inicio', texto: 'Dados rotulados' },
      { forma: 'passo', texto: 'Separa treino e teste' },
      { forma: 'passo', texto: 'Treina o modelo só com o treino' },
      { forma: 'fim', texto: 'Mede no teste, que ele nunca viu' },
    ],
    descricao: 'O teste é a prova inédita.',
  },
  exemplo: {
    titulo: 'Detector que sempre diz "não"',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Total: 1000 e-mails, 10 golpes\nModelo: sempre responde "não é golpe"\nAcurácia: 990/1000 = 99%\nRecall: 0/10 = 0%',
    },
    comentarios: [
      { linha: 3, texto: 'A acurácia parece ótima.' },
      { linha: 4, texto: 'Mas o modelo nunca acha um golpe.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const reais = [1, 0, 1, 1];\nconst prev = [1, 0, 0, 1];\nlet acertos = 0;\nfor (let i = 0; i < reais.length; i++) {\n  if (reais[i] === prev[i]) acertos++;\n}\nconsole.log(acertos);',
      ['3'],
      'Acertou as posições 0, 1 e 3.',
      [{ resposta: '4', feedback: 'A posição 2 está errada.' }],
    ),
    mc(
      'O que é overfitting?',
      'O modelo decorar o treino e ir mal em dados novos',
      [
        ['O modelo ser simples demais', 'Isso é underfitting.'],
        ['Treinar com poucos dados de teste', 'Não é essa a definição.'],
      ],
      'Ótimo no treino, ruim no teste.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const reais = [1, 1, 0, 0];\nconst prev = [1, 0, 1, 0];\nconst vp = prev.filter((p, i) => p === 1 && reais[i] === 1).length;\nconst marcados = prev.filter((p) => p === 1).length;\nconsole.log(vp / marcados);',
      ['0.5'],
      '1 verdadeiro positivo em 2 marcados: precisão 0,5.',
      [{ resposta: '1', feedback: 'O modelo também marcou um falso positivo.' }],
    ),
    mc(
      'Por que a acurácia pode enganar?',
      'Em classes desbalanceadas, prever sempre a classe comum já rende muita acurácia',
      [
        ['Porque o cálculo é complexo', 'O cálculo é simples.'],
        ['Porque só funciona com imagens', 'Funciona em qualquer tarefa de classificação.'],
      ],
      'Veja o detector que diz sempre "não".',
    ),
  ],
  desafio: programaJs(
    'Escreva acuracia(previstos, reais): devolva o percentual de acertos como número inteiro, arredondado com Math.round. Se as listas estiverem vazias, devolva 0.',
    'function acuracia(previstos, reais) {\n  // seu código aqui\n}',
    'function acuracia(previstos, reais) {\n  if (reais.length === 0) return 0;\n  let acertos = 0;\n  for (let i = 0; i < reais.length; i++) {\n    if (previstos[i] === reais[i]) acertos++;\n  }\n  return Math.round((100 * acertos) / reais.length);\n}',
    'acuracia',
    [
      {
        argumentos: [
          ['a', 'b', 'a'],
          ['a', 'b', 'b'],
        ],
        esperado: 67,
      },
      { argumentos: [[], []], esperado: 0 },
      { argumentos: [['x'], ['x']], esperado: 100 },
    ],
    ['Conte as posições em que previsto é igual ao real.', 'Trate a lista vazia antes de dividir.'],
    'Lembre: acurácia sozinha pode enganar em classes raras.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Conjunto de teste', 'Dados que o modelo nunca viu'],
        ['Precisão', 'Dos marcados como positivos, quantos eram de fato'],
        ['Recall', 'Dos positivos reais, quantos foram achados'],
        ['Overfitting', 'Decorar o treino e falhar em dados novos'],
      ],
      'Métricas e conceitos de avaliação.',
    ),
    completar(
      'Complete: a métrica de acertos sobre o total.',
      'A ___ é o percentual de acertos do modelo.',
      [{ aceitas: ['acurácia', 'acuracia'], feedback: 'Acertos ÷ total.' }],
      'Pode enganar em classes desbalanceadas.',
    ),
  ],
  explique: {
    enunciado:
      'Explique por que separar dados de treino e teste e por que a acurácia pode ser enganosa.',
    modelo:
      'Separar treino e teste permite medir o desempenho em dados que o modelo nunca viu, revelando o overfitting. A acurácia pode enganar em classes desbalanceadas: um modelo que sempre prevê a classe majoritária acerta quase tudo, mas não detecta a classe rara, então precisão e recall são necessários.',
    rubrica: [
      'Explicou a divisão treino/teste',
      'Explicou o overfitting',
      'Explicou o problema da acurácia com classes desbalanceadas',
    ],
  },
  resumo: [
    'Avalie em dados de teste inéditos.',
    'Acurácia pode enganar.',
    'Precisão e recall medem tipos diferentes de erro.',
    'Overfitting: decorar o treino.',
  ],
  cards: [
    ['O que é overfitting?', 'Decorar o treino e falhar em dados novos.'],
    ['O que é recall?', 'Fração dos positivos reais encontrados.'],
    ['O que é precisão?', 'Fração dos marcados que eram positivos.'],
    ['O que é data leakage?', 'Informação do teste vazando para o treino.'],
  ],
  conexoes: {
    disciplinas: [
      'Estatística: amostragem e viés.',
      'Engenharia de Software: testes também avaliam sistemas de ML.',
      'Cibersegurança: detectores de fraude precisam de bom recall.',
    ],
    profissional:
      'Um modelo que parece ótimo no laboratório mas não foi avaliado direito é um dos erros mais comuns em projetos de IA.',
  },
});
