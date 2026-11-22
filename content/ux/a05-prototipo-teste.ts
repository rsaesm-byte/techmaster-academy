import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const ux05 = montar({
  id: 'ux.m01.a05',
  titulo: 'Prototipação e teste de usabilidade',
  objetivo:
    'Validar ideias com protótipos e testes rápidos com usuários, e medir a usabilidade com o SUS.',
  pre: ['ux.m01.a04'],
  min: 30,
  diag: mc(
    'É melhor descobrir que o fluxo de compra confunde as pessoas antes ou depois de programar tudo?',
    'Antes, com um protótipo barato',
    [
      ['Depois, quando estiver pronto', 'Corrigir depois custa muito mais.'],
      ['Tanto faz', 'O custo da mudança cresce com o tempo.'],
    ],
    'Falhe cedo e barato.',
  ),
  simples: {
    titulo: 'Errar rápido e barato',
    texto:
      'Um **protótipo** é uma versão simplificada do produto para **testar ideias** antes de construí-las.\n\nNíveis de fidelidade:\n- **Baixa:** rascunhos em papel e wireframes.\n- **Média:** telas navegáveis, em cinza.\n- **Alta:** quase igual ao produto final (Figma, por exemplo).\n\nComece pela **baixa fidelidade**: é rápida, barata e as pessoas criticam sem receio.\n\n**Teste de usabilidade** com 5 pessoas já revela cerca de **85% dos problemas**:\n1. Defina **tarefas** reais ("compre um tênis tamanho 40").\n2. Peça que a pessoa **pense em voz alta**.\n3. **Observe sem ajudar.**\n4. Anote onde ela trava ou erra.\n5. Corrija e teste de novo.\n\nPara medir, usa-se o questionário **SUS** (System Usability Scale), com 10 afirmações de 1 a 5. A nota vai de 0 a 100; acima de **68** é considerada acima da média.',
    essencial:
      'Prototipe barato e cedo. Teste com cerca de 5 pessoas, em tarefas reais, observando sem ajudar. O SUS (0 a 100) mede a usabilidade; acima de 68 é bom.',
    guiado:
      'Para fazer um teste:\n1. Escolha de 3 a 5 tarefas.\n2. Recrute de 5 pessoas do perfil real.\n3. Peça que pensem em voz alta.\n4. Registre onde travam.\n5. Priorize e corrija os problemas mais graves.',
    tecnico:
      'O **SUS** alterna afirmações positivas (itens ímpares) e negativas (itens pares). Pontuação: nos **itens ímpares** contribui (resposta − 1); nos **pares**, (5 − resposta). Soma-se tudo e **multiplica-se por 2,5**. O **teste A/B** compara duas versões com tráfego real e usa estatística. O **Mágico de Oz** simula uma função "automática" com uma pessoa nos bastidores. Evite o **viés do facilitador**: não conduza a pessoa. A **severidade** dos problemas (cosmético, menor, maior, catastrófico) ajuda a priorizar. Teste remoto e presencial têm vantagens diferentes.',
  },
  analogia: {
    titulo: 'Ensaio geral do teatro',
    texto:
      'Antes da estreia, os atores fazem ensaios com plateia pequena. Os tropeços aparecem quando ainda dá tempo de ajustar. Na estreia, o público vê um espetáculo fluido.',
    limites: 'Um ensaio não prevê tudo: depois do lançamento, continue medindo.',
  },
  demo: {
    titulo: 'Calculando a nota SUS',
    instrucoes:
      'Execute e veja a nota de um participante. Mude as respostas (1 a 5) e veja a nota subir ou descer.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const respostas = [5, 1, 4, 2, 5, 1, 4, 2, 5, 2];\nlet soma = 0;\nrespostas.forEach((r, i) => {\n  soma += i % 2 === 0 ? r - 1 : 5 - r;\n});\nconst sus = soma * 2.5;\nconsole.log("Soma:", soma);\nconsole.log("Nota SUS:", sus, sus >= 68 ? "(acima da média)" : "(abaixo da média)");',
    },
  },
  tecnica: {
    titulo: 'Protótipo e teste: erros comuns',
    texto:
      '**Ajudar demais** durante o teste (você perde o sinal).\n**Perguntar "você gostou?"**: peça uma tarefa e observe.\n**Testar com colegas** em vez do público real.\n**Não registrar** o que aconteceu.',
  },
  diagrama: {
    titulo: 'Ciclo de validação',
    nos: [
      { forma: 'inicio', texto: 'Ideia' },
      { forma: 'passo', texto: 'Protótipo de baixa fidelidade' },
      { forma: 'passo', texto: 'Teste com usuários reais' },
      { forma: 'fim', texto: 'Ajustar e repetir até resolver os problemas' },
    ],
    descricao: 'Cada volta custa pouco e ensina muito.',
  },
  exemplo: {
    titulo: 'Roteiro de teste',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Tarefa 1: encontre o preço do plano mensal.\nTarefa 2: altere a senha da sua conta.\nTarefa 3: cancele uma compra.\n\nPeça: "pense em voz alta".\nRegistre: onde parou, onde errou, o que comentou.',
    },
    comentarios: [
      { linha: 1, texto: 'Tarefas reais, não perguntas de opinião.' },
      { linha: 5, texto: 'O silêncio do facilitador revela os problemas.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const r = [5, 1, 5, 1];\nlet s = 0;\nr.forEach((v, i) => {\n  s += i % 2 === 0 ? v - 1 : 5 - v;\n});\nconsole.log(s);',
      ['16'],
      'Cada item contribui 4: 4 + 4 + 4 + 4.',
      [{ resposta: '8', feedback: 'Todos os quatro itens contribuem com 4.' }],
    ),
    mc(
      'Por que começar com um protótipo de baixa fidelidade?',
      'É rápido e barato, e convida a críticas sinceras',
      [
        [
          'Fica mais bonito e profissional, o que ajuda a vender a ideia',
          'A estética não é o objetivo: é testar a ideia rápido e barato.',
        ],
        [
          'Dispensa os testes, porque o desenho simples já mostra os problemas',
          'Os testes continuam necessários.',
        ],
      ],
      'Erre cedo e barato.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const r = [3, 3];\nlet s = 0;\nr.forEach((v, i) => {\n  s += i % 2 === 0 ? v - 1 : 5 - v;\n});\nconsole.log(s);',
      ['4'],
      'Item ímpar: 3 − 1 = 2; item par: 5 − 3 = 2.',
      [{ resposta: '6', feedback: 'Some 2 + 2.' }],
    ),
    mc(
      'O que você deve fazer enquanto a pessoa tenta uma tarefa no teste?',
      'Observar sem ajudar e anotar onde ela trava',
      [
        [
          'Explicar cada passo para a pessoa não se perder durante o teste',
          'Isso esconde os problemas que você quer descobrir.',
        ],
        [
          'Pedir que leia o manual antes para entender o produto',
          'O produto deve ser claro sem manual.',
        ],
      ],
      'O silêncio é informação.',
    ),
  ],
  desafio: programaJs(
    'Escreva pontuacaoSUS(respostas): recebe 10 respostas de 1 a 5. Nos itens de posição par do array (0, 2, 4...) soma-se (resposta − 1); nos de posição ímpar (1, 3, 5...) soma-se (5 − resposta). Devolva a soma multiplicada por 2,5.',
    'function pontuacaoSUS(respostas) {\n  // seu código aqui\n}',
    'function pontuacaoSUS(respostas) {\n  let soma = 0;\n  respostas.forEach((r, i) => {\n    soma += i % 2 === 0 ? r - 1 : 5 - r;\n  });\n  return soma * 2.5;\n}',
    'pontuacaoSUS',
    [
      { argumentos: [[5, 1, 5, 1, 5, 1, 5, 1, 5, 1]], esperado: 100 },
      { argumentos: [[3, 3, 3, 3, 3, 3, 3, 3, 3, 3]], esperado: 50 },
      { argumentos: [[1, 5, 1, 5, 1, 5, 1, 5, 1, 5]], esperado: 0 },
    ],
    ['O índice 0 do array é o item 1 (ímpar, positivo).', 'Multiplique a soma por 2,5 no final.'],
    'Itens alternam positivos e negativos para evitar respostas automáticas.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Wireframe', 'Esboço da estrutura da tela, sem estilo'],
        ['Teste de usabilidade', 'Observar pessoas realizando tarefas reais'],
        ['SUS', 'Questionário de 10 itens que gera nota de 0 a 100'],
        ['Teste A/B', 'Comparar duas versões com tráfego real'],
      ],
      'Prototipação e validação.',
    ),
    completar(
      'Complete: técnica em que a pessoa fala o que pensa durante o teste.',
      'No teste, peça que a pessoa ___ em voz alta.',
      [{ aceitas: ['pense', 'pensar'], feedback: 'Think aloud.' }],
      'Revela dúvidas e expectativas.',
    ),
  ],
  explique: {
    enunciado:
      'Explique por que prototipar e testar cedo com poucos usuários vale a pena e como o SUS ajuda.',
    modelo:
      'Protótipos de baixa fidelidade são baratos e rápidos de mudar, e testes com cerca de 5 pessoas revelam a maior parte dos problemas antes do custo de programar. O SUS é um questionário de 10 itens que gera uma nota de 0 a 100 e permite comparar versões; acima de 68 é considerada acima da média.',
    rubrica: [
      'Citou o baixo custo de testar cedo',
      'Citou o teste com poucos usuários',
      'Explicou o SUS',
    ],
  },
  resumo: [
    'Prototipe barato e cedo.',
    '5 usuários revelam a maior parte dos problemas.',
    'Observe sem ajudar.',
    'SUS: 0 a 100, 68 é a média.',
  ],
  cards: [
    ['O que é um wireframe?', 'Esboço estrutural da tela.'],
    ['Quantos usuários bastam em um teste?', 'Cerca de 5 por rodada.'],
    ['Qual a nota média do SUS?', '68.'],
    ['O que é um teste A/B?', 'Comparar duas versões com tráfego real.'],
  ],
  conexoes: {
    disciplinas: [
      'Engenharia de Software: validação contínua e feedback.',
      'HTML, CSS e a Web: protótipos HTML e CSS.',
      'Estatística: amostras e significância no teste A/B.',
    ],
    profissional:
      'Equipes de produto testam com usuários todas as semanas para reduzir riscos antes de investir.',
  },
});
