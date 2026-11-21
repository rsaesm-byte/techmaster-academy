import type { AulaEntrada } from '@/domain/conteudo';

const LEITURA8 = '  para i de 1 ate 8 faca\n    leia(v[i])\n  fimpara\n  leia(alvo)\n';

export const m02a03: AulaEntrada = {
  id: 'logica.m02.a03',
  versao: 1,
  status: 'publicada',
  titulo: 'Busca em vetores: linear e binária',
  objetivo:
    'Encontrar um valor num vetor com busca linear, entender por que a busca binária é muito mais rápida em vetores ordenados e implementar as duas.',
  preRequisitos: ['logica.m02.a02'],
  duracaoMin: 35,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado: 'Num dicionário de papel, como você costuma achar a palavra "lógica"?',
          alternativas: [
            {
              id: 'a',
              texto: 'Abro no meio e vou descartando metades, porque as palavras estão em ordem',
            },
            {
              id: 'b',
              texto: 'Leio página por página desde o "A"',
              feedback:
                'Funcionaria, mas levaria horas: você ignora que as palavras estão ordenadas.',
            },
            {
              id: 'c',
              texto: 'Abro em páginas aleatórias até achar',
              feedback: 'Pode dar sorte, mas não há garantia de quando termina.',
            },
          ],
          correta: 'a',
          explicacao:
            'Essa é exatamente a ideia da busca binária: só funciona porque o dicionário está em ordem.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Duas formas de procurar',
      texto:
        '**Busca linear:** olha posição por posição, do começo ao fim, até achar o valor (ou acabar o vetor). Funciona com qualquer vetor.\n\n**Busca binária:** só funciona com o vetor **ordenado**. Olha o elemento do meio: se for o procurado, achou; se for menor, descarta a metade da esquerda; se for maior, a da direita. Repete na metade que sobrou.\n\nCom 1 000 elementos, a linear pode precisar de 1 000 comparações; a binária, no máximo 10.',
      porModo: {
        essencial:
          'Linear: percorre tudo, vale para qualquer vetor, até n comparações. Binária: vetor ordenado, olha o meio e descarta metade a cada passo, cerca de log₂(n) comparações.',
        guiado:
          'Imagine adivinhar um número de 1 a 100.\n1. Linear: "é 1? é 2? é 3?..." — até 100 palpites.\n2. Binária: "é maior que 50?" — sim — "maior que 75?" — não — ...\nCada pergunta corta as possibilidades pela metade: 7 perguntas bastam.',
        tecnico:
          'A busca linear é O(n) e não exige pré-condição. A busca binária é O(log n), mas exige vetor ordenado e acesso direto por índice. Mantém um intervalo [esq, dir]; a cada iteração compara com v[meio], meio = (esq + dir) \\ 2, e reduz o intervalo pela metade. Termina ao achar ou quando esq > dir.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Achar um nome na lista de chamada',
      texto:
        'Numa lista de presença bagunçada, você lê nome por nome até achar o seu (linear). Numa lista em ordem alfabética, você vai direto ao meio, vê se seu nome vem antes ou depois e descarta metade da folha (binária).',
      limites:
        'Uma pessoa "pula" visualmente para perto da letra certa; o algoritmo binário sempre olha exatamente o meio do intervalo. E se a lista não estiver em ordem, a binária dá respostas erradas — não apenas lentas.',
    },
    {
      id: 'demo-linear',
      tipo: 'demo',
      titulo: 'Busca linear em ação',
      instrucoes:
        'Escolha um alvo e execute. Observe o contador de comparações: ele cresce uma posição por vez. Experimente procurar um valor que **não** está no vetor — quantas comparações foram?',
      simulacao: { tipo: 'ordenacao', algoritmo: 'linear', fixo: true },
    },
    {
      id: 'demo-binaria',
      tipo: 'demo',
      titulo: 'Busca binária em ação',
      instrucoes:
        'Agora a binária. A faixa destacada é o intervalo ainda possível; a cada passo ela cai pela metade. Compare o número de comparações com o da busca linear para o mesmo alvo.',
      simulacao: { tipo: 'ordenacao', algoritmo: 'binaria', fixo: true },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Como escrever cada uma',
      texto:
        '**Linear:** `pos <- 0`, depois um `para i de 1 ate n` que, ao achar `v[i] = alvo` com `pos = 0`, guarda `pos <- i`. No fim, `pos = 0` significa "não encontrado".\n\n**Binária:** `esq <- 1`, `dir <- n`, `pos <- 0`.\n`enquanto (esq <= dir) e (pos = 0) faca`\n- `meio <- (esq + dir) \\ 2` (divisão inteira)\n- se `v[meio] = alvo`: achou, `pos <- meio`\n- senão, se `v[meio] < alvo`: o alvo está à direita, `esq <- meio + 1`\n- senão: está à esquerda, `dir <- meio - 1`\n\n**Por que +1 e -1?** O meio já foi conferido; incluí-lo de novo pode travar o laço.\n\n**Custo:** dobrar o tamanho do vetor dobra o trabalho da linear, mas acrescenta só 1 comparação na binária.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Um passo da busca binária',
      nos: [
        { forma: 'inicio', texto: 'esq <- 1, dir <- n' },
        { forma: 'decisao', texto: 'esq <= dir? Se não: não encontrado' },
        { forma: 'passo', texto: 'meio <- (esq + dir) \\ 2' },
        {
          forma: 'decisao',
          texto: 'v[meio] = alvo? Achou. Menor? esq <- meio + 1. Maior? dir <- meio - 1',
        },
        { forma: 'fim', texto: 'Volta à pergunta com metade do intervalo' },
      ],
      descricao:
        'O intervalo começa no vetor inteiro. Enquanto a esquerda não passar da direita, calcula o meio e compara com o alvo. Se for igual, encontrou. Se o valor do meio for menor que o alvo, descarta a metade esquerda; se for maior, descarta a direita. Então repete com o intervalo pela metade.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Procurando o 23 com busca binária',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'v = [2, 5, 8, 12, 16, 23, 38, 56]   alvo = 23\n\nesq=1 dir=8 -> meio=4, v[4]=12 < 23 -> esq=5\nesq=5 dir=8 -> meio=6, v[6]=23 = 23 -> achou na posição 6',
      },
      comentarios: [
        { linha: 1, texto: 'Vetor ORDENADO com 8 elementos.' },
        {
          linha: 3,
          texto: '12 é menor que 23: tudo à esquerda do 12 também é. Descarta as posições 1 a 4.',
        },
        { linha: 4, texto: 'Encontrado em 2 comparações. A linear precisaria de 6.' },
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
          enunciado:
            'Na busca linear pelo 7 no vetor [3, 8, 7, 1], quantas comparações são feitas até encontrar?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'v = [3, 8, 7, 1]   alvo = 7\npara i de 1 ate 4 faca\n  se v[i] = alvo entao\n    (achou: para aqui)\n  fimse\nfimpara',
          },
          respostasAceitas: ['3'],
          errosComuns: [
            { resposta: '4', feedback: 'A busca para assim que encontra: o 1 nem é olhado.' },
            { resposta: '1', feedback: 'A linear começa pela posição 1, que guarda o 3.' },
          ],
          pistas: ['Compare o 7 com cada elemento, da esquerda para a direita.'],
          explicacao: 'Compara com 3, depois 8, depois 7 — achou na 3ª comparação.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado:
            'Complete o cálculo do meio e o ajuste quando o valor do meio é menor que o alvo.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'meio <- (esq + dir) ___ 2\nse v[meio] < alvo entao\n  esq <- meio ___ 1\nfimse',
          },
          lacunas: [
            {
              aceitas: ['\\'],
              feedback: 'O meio precisa ser uma posição inteira: use a divisão inteira.',
            },
            {
              aceitas: ['+'],
              feedback: 'O alvo está à direita do meio: a esquerda avança para depois dele.',
            },
          ],
          explicacao: 'meio <- (esq + dir) \\ 2 e, se o meio é menor que o alvo, esq <- meio + 1.',
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
          enunciado:
            'Esta busca linear diz "não achou" mesmo quando o alvo está no vetor (exceto se for o último). Qual linha causa o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'achou <- falso\npara i de 1 ate 5 faca\n  se v[i] = alvo entao\n    achou <- verdadeiro\n  senao\n    achou <- falso\n  fimse\nfimpara',
          },
          linhaErrada: 6,
          feedbackPorLinha: {
            '1': 'Começar com falso está certo.',
            '4': 'Ao achar, marcar verdadeiro está certo.',
          },
          pistas: [
            'O que acontece com achou se o alvo está na posição 2 e a posição 3 é diferente?',
          ],
          explicacao:
            'A linha 6 desfaz a descoberta na próxima volta. Depois de achar, nada deve voltar achou para falso.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado:
            'O programa lê 5 números e depois o alvo. Escreva a POSIÇÃO da primeira ocorrência do alvo, ou 0 se ele não estiver no vetor.',
          codigoInicial:
            'var\n  v: vetor[1..5] de inteiro\n  i, alvo, pos: inteiro\ninicio\n  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n  leia(alvo)\n\nfimalgoritmo',
          solucao:
            'var\n  v: vetor[1..5] de inteiro\n  i, alvo, pos: inteiro\ninicio\n  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n  leia(alvo)\n  pos <- 0\n  para i de 1 ate 5 faca\n    se (v[i] = alvo) e (pos = 0) entao\n      pos <- i\n    fimse\n  fimpara\n  escreva(pos)\nfimalgoritmo',
          casos: [
            { entradas: ['4', '9', '2', '9', '1', '9'], saidaEsperada: ['2'] },
            { entradas: ['4', '9', '2', '9', '1', '4'], saidaEsperada: ['1'] },
            { entradas: ['4', '9', '2', '9', '1', '7'], saidaEsperada: ['0'] },
          ],
          pistas: [
            'Comece com pos <- 0, que significa "ainda não achei".',
            'Para guardar só a PRIMEIRA ocorrência, só atualize pos se ele ainda for 0.',
          ],
          explicacao:
            'Busca linear com pos começando em 0; a condição (pos = 0) impede que uma ocorrência posterior sobrescreva a primeira.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: escreva a busca binária',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'O programa lê 8 números JÁ ORDENADOS e depois o alvo. Use busca binária para escrever a posição do alvo, ou 0 se não existir.',
          codigoInicial: `var\n  v: vetor[1..8] de inteiro\n  i, alvo, esq, dir, meio, pos: inteiro\ninicio\n${LEITURA8}\nfimalgoritmo`,
          solucao: `var\n  v: vetor[1..8] de inteiro\n  i, alvo, esq, dir, meio, pos: inteiro\ninicio\n${LEITURA8}  esq <- 1\n  dir <- 8\n  pos <- 0\n  enquanto (esq <= dir) e (pos = 0) faca\n    meio <- (esq + dir) \\ 2\n    se v[meio] = alvo entao\n      pos <- meio\n    senao se v[meio] < alvo entao\n      esq <- meio + 1\n    senao\n      dir <- meio - 1\n    fimse\n  fimenquanto\n  escreva(pos)\nfimalgoritmo`,
          casos: [
            { entradas: ['2', '5', '8', '12', '16', '23', '38', '56', '23'], saidaEsperada: ['6'] },
            { entradas: ['2', '5', '8', '12', '16', '23', '38', '56', '2'], saidaEsperada: ['1'] },
            { entradas: ['2', '5', '8', '12', '16', '23', '38', '56', '56'], saidaEsperada: ['8'] },
            { entradas: ['2', '5', '8', '12', '16', '23', '38', '56', '13'], saidaEsperada: ['0'] },
          ],
          pistas: [
            'Variáveis esq e dir marcam o intervalo; comece com 1 e 8.',
            'Repita enquanto (esq <= dir) e (pos = 0).',
            'meio <- (esq + dir) \\ 2; depois mova esq ou dir para depois/antes do meio.',
          ],
          explicacao:
            'O intervalo [esq, dir] encolhe pela metade a cada volta até achar o alvo ou ficar vazio.',
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
          enunciado: 'Qual é a condição para usar busca binária?',
          alternativas: [
            { id: 'a', texto: 'O vetor precisa estar ordenado' },
            {
              id: 'b',
              texto: 'O vetor precisa ter tamanho par',
              feedback: 'Com tamanho ímpar ela funciona igual; a divisão inteira resolve o meio.',
            },
            {
              id: 'c',
              texto: 'O alvo precisa estar no vetor',
              feedback: 'Ela também responde "não encontrado" quando o intervalo fica vazio.',
            },
          ],
          correta: 'a',
          explicacao:
            'Descartar metade só é seguro porque a ordem garante onde o alvo poderia estar.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado:
            'Num vetor ordenado de 1 024 elementos, quantas comparações a busca binária faz, no máximo, aproximadamente?',
          alternativas: [
            { id: 'a', texto: 'Cerca de 10' },
            {
              id: 'b',
              texto: 'Cerca de 512',
              feedback:
                'Essa seria a média da busca linear. A binária corta pela metade a cada passo.',
            },
            { id: 'c', texto: '1 024', feedback: 'Esse é o pior caso da busca linear.' },
          ],
          correta: 'a',
          explicacao: '1 024 → 512 → 256 → ... → 1: são 10 cortes pela metade (2¹⁰ = 1 024).',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique por que a busca binária é tão mais rápida que a linear e qual é o preço disso.',
          respostaModelo:
            'A cada comparação, a busca binária descarta metade dos elementos que restam, então o trabalho cresce muito devagar (cerca de log₂ de n). A linear descarta só um elemento por comparação. O preço é que o vetor precisa estar ordenado, e ordenar também custa trabalho.',
          rubrica: [
            'Disse que a binária descarta metade a cada passo',
            'Comparou com a linear, que olha um por vez',
            'Citou que o vetor precisa estar ordenado',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Busca linear: olha um por um; funciona em qualquer vetor; até n comparações.',
        'Busca binária: exige vetor ordenado; olha o meio e descarta metade; cerca de log₂(n) comparações.',
        'Na binária, ajuste esq <- meio + 1 ou dir <- meio - 1, e pare quando esq > dir.',
        'Uma variável como pos = 0 representa "não encontrado".',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m02.a03.fc1',
          frente: 'Que pré-condição a busca binária exige?',
          verso: 'Vetor ordenado.',
        },
        {
          id: 'logica.m02.a03.fc2',
          frente: 'Como calcular o meio na busca binária?',
          verso: 'meio <- (esq + dir) \\ 2 (divisão inteira).',
        },
        {
          id: 'logica.m02.a03.fc3',
          frente: 'Quando a busca binária desiste?',
          verso: 'Quando esq passa de dir: o intervalo ficou vazio.',
        },
        {
          id: 'logica.m02.a03.fc4',
          frente: 'Comparações no pior caso: linear vs binária com 1 000 elementos?',
          verso: 'Linear: 1 000. Binária: cerca de 10.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Estruturas de Dados: árvores de busca e índices de bancos levam a ideia binária adiante.',
        'Banco de Dados: um índice evita que a consulta faça uma busca linear na tabela inteira.',
        'Git: o comando git bisect usa busca binária para achar o commit que introduziu um bug.',
      ],
      aplicacaoProfissional:
        'Quando um problema aparece "em algum momento das últimas 64 versões" ou "em algum dos 200 passos de um script", testar no meio e descartar metade (bisect) acha a causa em poucas tentativas. É busca binária aplicada ao suporte.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
