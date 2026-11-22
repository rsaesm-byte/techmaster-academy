import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ia01 = montar({
  id: 'ia.m01.a01',
  titulo: 'O que é IA e aprendizado de máquina',
  objetivo:
    'Diferenciar programar regras de aprender com dados e conhecer os tipos de aprendizado.',
  pre: ['javascript.m01.a05'],
  min: 30,
  diag: mc(
    'Para detectar spam, você pode escrever regras à mão ou mostrar milhares de e-mails já classificados e deixar o computador descobrir os padrões. Qual é a segunda abordagem?',
    'Aprendizado de máquina',
    [
      ['Programação tradicional com if', 'Essa é a abordagem de regras escritas à mão.'],
      ['Criptografia', 'Não tem relação.'],
    ],
    'O computador aprende a partir de exemplos.',
  ),
  simples: {
    titulo: 'Aprender com exemplos',
    texto:
      '**Inteligência Artificial (IA)** é o campo que busca fazer máquinas realizarem tarefas que exigem "inteligência": reconhecer imagens, entender texto, tomar decisões.\n\n**Programação tradicional:** você escreve as **regras** e o computador aplica nos dados.\n\n**Aprendizado de máquina (ML):** você dá **dados e respostas** e o computador **descobre as regras**.\n\nTipos de aprendizado:\n- **Supervisionado:** aprende com exemplos rotulados (e-mail → "spam" ou "não spam").\n- **Não supervisionado:** acha padrões sem rótulos (agrupar clientes parecidos).\n- **Por reforço:** aprende por tentativa, erro e recompensa (um robô ou um jogo).\n\nA IA hoje é, na maior parte, **estatística em escala**: modelos que generalizam padrões dos dados.',
    essencial:
      'IA é o campo; ML é aprender regras a partir de dados. Supervisionado usa rótulos, não supervisionado acha grupos, por reforço usa recompensas.',
    guiado:
      'Etapas de um projeto de ML:\n1. Defina o problema e a métrica de sucesso.\n2. Reúna e limpe os dados.\n3. Separe dados de treino e de teste.\n4. Treine o modelo.\n5. Avalie e melhore.',
    tecnico:
      'O ML é uma parte da IA; o **aprendizado profundo** (deep learning) é uma parte do ML que usa redes neurais com muitas camadas. Um **modelo** é uma função com **parâmetros** ajustados no treino. Chamamos de **features** as variáveis de entrada e de **rótulo** (label) a resposta esperada. Boa parte do trabalho (60 a 80%) está em **coletar e limpar dados**. Modelos aprendem os **vieses** dos dados: se os exemplos são enviesados, as respostas também serão. IA **simbólica** (regras e lógica) ainda existe e se mistura com ML.',
  },
  analogia: {
    titulo: 'Aprender a reconhecer frutas',
    texto:
      'Para ensinar uma criança o que é uma maçã, você não lista regras geométricas: mostra várias maçãs e diz "isto é uma maçã". Com os exemplos, ela forma a própria ideia. O ML funciona assim, só que com milhões de exemplos.',
    limites: 'A criança entende o conceito; o modelo só captura padrões estatísticos dos exemplos.',
  },
  demo: {
    titulo: 'Uma regra escrita à mão',
    instrucoes:
      'Execute: um filtro de spam por palavras. Perceba como regras manuais são frágeis. Experimente trocar o texto por uma frase de spam sem as palavras da lista.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const palavrasSpam = ["grátis", "prêmio", "urgente"];\nfunction pontuar(texto) {\n  const palavras = texto.toLowerCase().split(" ");\n  return palavrasSpam.filter((p) => palavras.includes(p)).length;\n}\nfor (const t of ["Ganhe prêmio grátis agora", "Reunião amanhã às 10h", "Oferta urgente sem custo"]) {\n  console.log(pontuar(t) >= 2 ? "SPAM" : "ok  ", "-", t);\n}',
    },
  },
  tecnica: {
    titulo: 'Quando usar ML?',
    texto:
      '**Use ML** quando as regras são difíceis de escrever (reconhecer rostos) ou mudam (fraudes).\n**Evite ML** quando uma regra simples resolve, quando faltam dados ou quando o erro tem custo muito alto sem supervisão.\nUm bom começo é sempre uma **linha de base** simples para comparar.',
  },
  diagrama: {
    titulo: 'Programação tradicional e ML',
    nos: [
      { forma: 'inicio', texto: 'Tradicional: regras + dados' },
      { forma: 'passo', texto: 'O programa produz respostas' },
      { forma: 'passo', texto: 'ML: dados + respostas conhecidas' },
      { forma: 'fim', texto: 'O treino produz as regras (o modelo)' },
    ],
    descricao: 'No ML, o fluxo se inverte.',
  },
  exemplo: {
    titulo: 'Exemplos rotulados',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Entrada (features)         -> Rótulo\n"Ganhe prêmio agora"       -> spam\n"Reunião às 10h"           -> não spam\n"Promoção grátis urgente"  -> spam',
    },
    comentarios: [
      { linha: 1, texto: 'O modelo aprende a ligar a entrada ao rótulo.' },
      { linha: 2, texto: 'Quanto mais e melhores exemplos, melhor.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const lista = ["grátis", "prêmio"];\nconst palavras = "ganhe prêmio grátis".split(" ");\nconsole.log(lista.filter((p) => palavras.includes(p)).length);',
      ['2'],
      'As duas palavras da lista aparecem no texto.',
      [{ resposta: '1', feedback: 'Confira as duas palavras.' }],
    ),
    mc(
      'Em qual tipo de aprendizado o modelo usa exemplos já rotulados?',
      'Supervisionado',
      [
        ['Não supervisionado', 'Esse trabalha sem rótulos.'],
        ['Por reforço', 'Esse usa recompensas.'],
      ],
      'Rótulo = resposta conhecida.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const lista = ["urgente"];\nconst palavras = "urgente urgente".split(" ");\nconsole.log(lista.filter((p) => palavras.includes(p)).length);',
      ['1'],
      'Conta-se quantas palavras DIFERENTES da lista aparecem: só "urgente".',
      [{ resposta: '2', feedback: 'O filter percorre a lista, não o texto.' }],
    ),
    mc(
      'Por que modelos podem reproduzir preconceitos?',
      'Porque aprendem os padrões dos dados, inclusive os viesados',
      [
        [
          'Porque desenvolvem opiniões próprias durante o treino e as repetem',
          'Modelos não têm opiniões: refletem os padrões dos dados.',
        ],
        [
          'Porque gastam muita energia e acabam simplificando as respostas',
          'O consumo de energia é outro assunto; o viés vem dos dados.',
        ],
      ],
      'Dados viesados, modelo viesado.',
    ),
  ],
  desafio: programaJs(
    'Escreva ehSpam(texto, palavras): conte quantas palavras DIFERENTES da lista "palavras" aparecem no texto (ignore maiúsculas e minúsculas, separando o texto por espaços). Devolva true se forem 2 ou mais.',
    'function ehSpam(texto, palavras) {\n  // seu código aqui\n}',
    'function ehSpam(texto, palavras) {\n  const dito = texto.toLowerCase().split(" ");\n  const achadas = palavras.filter((p) => dito.includes(p.toLowerCase()));\n  return achadas.length >= 2;\n}',
    'ehSpam',
    [
      { argumentos: ['Ganhe prêmio grátis agora', ['grátis', 'prêmio']], esperado: true },
      { argumentos: ['Reunião amanhã', ['grátis']], esperado: false },
      { argumentos: ['GRÁTIS grátis', ['grátis', 'prêmio']], esperado: false },
    ],
    ['Passe o texto para minúsculas e use split(" ").', 'Filtre a lista de palavras, não o texto.'],
    'Regras manuais funcionam, mas quebram fácil: por isso o ML.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Aprendizado supervisionado', 'Aprende com exemplos rotulados'],
        ['Aprendizado não supervisionado', 'Encontra padrões sem rótulos'],
        ['Feature', 'Variável de entrada do modelo'],
        ['Rótulo', 'A resposta esperada de um exemplo'],
      ],
      'Vocabulário de ML.',
    ),
    completar(
      'Complete: ramo da IA em que máquinas aprendem com dados.',
      'Aprendizado de ___ aprende padrões a partir de exemplos.',
      [{ aceitas: ['máquina', 'maquina'], feedback: 'Machine Learning.' }],
      'Parte da IA.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre programar regras e usar aprendizado de máquina.',
    modelo:
      'Na programação tradicional, a pessoa escreve as regras e o computador as aplica aos dados. No aprendizado de máquina, fornecem-se dados e respostas conhecidas e o computador descobre as regras (o modelo). O ML é útil quando as regras são difíceis de escrever ou mudam.',
    rubrica: [
      'Descreveu a programação tradicional',
      'Descreveu o ML (dados + respostas)',
      'Indicou quando o ML compensa',
    ],
  },
  resumo: [
    'ML aprende regras a partir de dados.',
    'Supervisionado, não supervisionado e por reforço.',
    'Dados bons importam mais que o algoritmo.',
    'Modelos herdam os vieses dos dados.',
  ],
  cards: [
    ['O que é ML?', 'Aprender regras a partir de dados.'],
    ['O que é uma feature?', 'Variável de entrada.'],
    ['O que é um rótulo?', 'A resposta esperada.'],
    ['O que é deep learning?', 'ML com redes neurais profundas.'],
  ],
  conexoes: {
    disciplinas: [
      'Lógica: regras e condições são o ponto de partida.',
      'Banco de Dados: dados limpos alimentam os modelos.',
      'Python: a linguagem mais usada em IA.',
    ],
    profissional:
      'Cada vez mais produtos têm um modelo de ML por trás: busca, recomendação, detecção de fraude.',
  },
});
