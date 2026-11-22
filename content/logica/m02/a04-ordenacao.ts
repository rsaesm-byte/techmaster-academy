import type { AulaEntrada } from '@/domain/conteudo';

const LER5 = '  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n';
const ESCREVER5 = '  para i de 1 ate 5 faca\n    escreva(v[i])\n  fimpara\n';
const DECL = 'var\n  v: vetor[1..5] de inteiro\n  i, j, aux: inteiro\ninicio\n';
const bolha = (op: '>' | '<') =>
  `  para i de 1 ate 4 faca\n    para j de 1 ate 5 - i faca\n      se v[j] ${op} v[j + 1] entao\n        aux <- v[j]\n        v[j] <- v[j + 1]\n        v[j + 1] <- aux\n      fimse\n    fimpara\n  fimpara\n`;

export const m02a04: AulaEntrada = {
  id: 'logica.m02.a04',
  versao: 1,
  status: 'publicada',
  titulo: 'Ordenação: colocando o vetor em ordem',
  objetivo:
    'Entender como funcionam os algoritmos bolha, seleção e inserção, trocar valores com uma variável auxiliar e implementar a ordenação por bolha.',
  preRequisitos: ['logica.m02.a03'],
  duracaoMin: 40,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado: 'Para trocar os valores de a e b, qual sequência funciona?',
          alternativas: [
            { id: 'a', texto: 'aux <- a; a <- b; b <- aux' },
            {
              id: 'b',
              texto: 'a <- b; b <- a, para trocar os valores',
              feedback: 'Depois de a <- b, o valor antigo de a se perdeu: os dois ficam iguais.',
            },
            {
              id: 'c',
              texto: 'b <- a; a <- b, na ordem inversa',
              feedback: 'Mesmo problema: a primeira atribuição apaga um dos valores.',
            },
          ],
          correta: 'a',
          explicacao: 'A variável auxiliar guarda um dos valores para ele não se perder na troca.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Comparar e trocar',
      texto:
        'Ordenar é reorganizar os elementos do vetor do menor para o maior (ou o contrário). Quase todos os algoritmos simples fazem duas coisas repetidamente: **comparar** dois elementos e, se estiverem fora de ordem, **trocar** os dois de lugar.\n\nNa **ordenação por bolha**, o laço compara cada vizinho com o próximo e troca se o da esquerda for maior. A cada passada completa, o maior valor restante "borbulha" até o fim.',
      porModo: {
        essencial:
          'Bolha: compara vizinhos e troca se estiverem fora de ordem; cada passada leva o maior ao final. Seleção: acha o menor e põe na frente. Inserção: insere cada elemento no lugar certo da parte já ordenada.',
        guiado:
          'Pense em organizar alunos por altura numa fila.\n1. Compare os dois primeiros; se o da frente for mais alto, troque.\n2. Passe para o 2º e o 3º, e assim até o fim.\n3. Na primeira passada, o mais alto chega ao fim da fila.\n4. Repita as passadas: a cada uma, mais um aluno fica no lugar certo.',
        tecnico:
          'Bolha, seleção e inserção são ordenações por comparação O(n²) no pior caso. A bolha faz n-1 passadas, cada uma reduzindo em 1 a parte não ordenada; a inserção é O(n) em vetores quase ordenados. Algoritmos como merge sort e quicksort chegam a O(n log n).',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Arrumar cartas na mão',
      texto:
        'Quando você recebe cartas de baralho, pega uma por vez e encaixa na posição certa entre as que já estão na mão. Isso é a **ordenação por inserção**: a parte da esquerda está sempre arrumada, e cada carta nova é inserida no lugar dela.',
      limites:
        'Você enxerga todas as cartas e encaixa de uma vez; o algoritmo só compara dois valores por vez e precisa deslocar os elementos um a um para abrir espaço.',
    },
    {
      id: 'demo-ordenacao',
      tipo: 'demo',
      titulo: 'Laboratório de ordenação',
      instrucoes:
        'Escolha o algoritmo e avance passo a passo: barras comparadas e trocadas ficam destacadas, e a linha do pseudocódigo em execução acende.\n\nDepois, gere um vetor **quase ordenado** e compare o número de comparações da bolha e da inserção. Qual ganha?',
      simulacao: { tipo: 'ordenacao' },
    },
    {
      id: 'demo-codigo',
      tipo: 'demo',
      titulo: 'A bolha em Portugol, gaveta por gaveta',
      instrucoes:
        'Acompanhe as gavetas do vetor: repare na variável `aux` guardando um valor durante cada troca e em como, ao fim da primeira passada, o maior já está na última posição.',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'var\n  v: vetor[1..4] de inteiro\n  i, j, aux: inteiro\ninicio\n  v[1] <- 7\n  v[2] <- 3\n  v[3] <- 9\n  v[4] <- 1\n  para i de 1 ate 3 faca\n    para j de 1 ate 4 - i faca\n      se v[j] > v[j + 1] entao\n        aux <- v[j]\n        v[j] <- v[j + 1]\n        v[j + 1] <- aux\n      fimse\n    fimpara\n  fimpara\n  escreva(v[1], " ", v[2], " ", v[3], " ", v[4])\nfimalgoritmo',
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Os três algoritmos clássicos',
      texto:
        '**Bolha:** laço externo `para i de 1 ate n - 1` (as passadas); laço interno `para j de 1 ate n - i`, comparando `v[j]` com `v[j + 1]`. O `n - i` evita olhar o final, que já está ordenado — e evita acessar `v[n + 1]`, que não existe.\n\n**Seleção:** para cada posição i, encontra o menor elemento de i até n e troca com v[i]. Faz poucas trocas (no máximo n - 1).\n\n**Inserção:** para cada elemento a partir do 2º, desloca os maiores à esquerda uma posição para a direita e coloca o elemento no buraco aberto. Muito rápida em vetores quase ordenados.\n\n**Troca:** sempre com auxiliar: `aux <- v[j]`, `v[j] <- v[j + 1]`, `v[j + 1] <- aux`.\n\n**Crescente ou decrescente?** Basta inverter a comparação: `>` ordena crescente; `<`, decrescente.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Uma passada da bolha',
      nos: [
        { forma: 'inicio', texto: 'j <- 1' },
        { forma: 'decisao', texto: 'v[j] > v[j + 1]? Se sim: troca os dois' },
        { forma: 'passo', texto: 'j <- j + 1 (próximo par de vizinhos)' },
        {
          forma: 'decisao',
          texto: 'Chegou ao fim da parte não ordenada? Se não, volta à comparação',
        },
        { forma: 'fim', texto: 'O maior valor restante está no final' },
      ],
      descricao:
        'Uma passada começa no primeiro par de vizinhos. Se o da esquerda for maior, os dois trocam de lugar. Avança para o próximo par e repete até o fim da parte ainda não ordenada. Ao terminar, o maior valor dessa parte chegou ao final.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Passadas da bolha em [7, 3, 9, 1]',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'início:     [7, 3, 9, 1]\npassada 1:  [3, 7, 1, 9]\npassada 2:  [3, 1, 7, 9]\npassada 3:  [1, 3, 7, 9]',
      },
      comentarios: [
        { linha: 2, texto: '7>3 troca; 7<9 fica; 9>1 troca. O 9 chegou ao fim.' },
        { linha: 3, texto: '3<7 fica; 7>1 troca. O 7 está no lugar. O 9 nem é olhado.' },
        { linha: 4, texto: '3>1 troca. Ordenado em 3 passadas (n - 1 = 3).' },
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
            'Como fica o vetor [4, 3, 2, 1] depois da PRIMEIRA passada da bolha? Escreva os números separados por espaço.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'v = [4, 3, 2, 1]\npara j de 1 ate 3 faca\n  se v[j] > v[j + 1] entao\n    troca v[j] com v[j + 1]\n  fimse\nfimpara',
          },
          respostasAceitas: ['3 2 1 4', '3, 2, 1, 4', '[3, 2, 1, 4]'],
          errosComuns: [
            {
              resposta: '1 2 3 4',
              feedback: 'Isso é o resultado final. Uma passada só leva o maior ao fim.',
            },
            {
              resposta: '3 4 2 1',
              feedback: 'Essa é só a primeira troca. A passada continua até o fim do vetor.',
            },
          ],
          pistas: ['Compare 4 e 3, depois a nova posição 2 com a 3, depois 3 com 4.'],
          explicacao: '4>3 troca: [3,4,2,1]; 4>2 troca: [3,2,4,1]; 4>1 troca: [3,2,1,4].',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete a troca de v[j] com v[j + 1].',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'aux <- v[j]\nv[j] <- v[___]\nv[j + 1] <- ___',
          },
          lacunas: [
            { aceitas: ['j + 1', 'j+1'], feedback: 'v[j] recebe o valor do vizinho da direita.' },
            { aceitas: ['aux'], feedback: 'O valor original de v[j] foi guardado onde?' },
          ],
          explicacao:
            'aux guarda v[j]; v[j] recebe v[j + 1]; v[j + 1] recebe o que estava guardado em aux.',
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
            'O vetor v tem 5 posições. Este trecho para com erro de "posição fora do vetor". Qual linha causa o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'para i de 1 ate 4 faca\n  para j de 1 ate 5 faca\n    se v[j] > v[j + 1] entao\n      aux <- v[j]\n      v[j] <- v[j + 1]\n      v[j + 1] <- aux\n    fimse\n  fimpara\nfimpara',
          },
          linhaErrada: 2,
          feedbackPorLinha: {
            '1': 'Com 5 elementos, 4 passadas bastam.',
            '3': 'A comparação está certa; o problema é o valor que j chega a ter.',
          },
          pistas: ['Quando j vale 5, que posição é v[j + 1]?'],
          explicacao:
            'Com j = 5, v[j + 1] é v[6], que não existe. O laço interno deveria ir até 5 - i.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado:
            'O programa lê 5 números e depois os escreve. Entre a leitura e a escrita, ordene o vetor em ordem CRESCENTE.',
          codigoInicial: `${DECL}${LER5}\n${ESCREVER5}fimalgoritmo`,
          solucao: `${DECL}${LER5}${bolha('>')}${ESCREVER5}fimalgoritmo`,
          casos: [
            { entradas: ['5', '1', '4', '2', '3'], saidaEsperada: ['1', '2', '3', '4', '5'] },
            { entradas: ['9', '9', '0', '-2', '7'], saidaEsperada: ['-2', '0', '7', '9', '9'] },
            { entradas: ['1', '2', '3', '4', '5'], saidaEsperada: ['1', '2', '3', '4', '5'] },
          ],
          pistas: [
            'Dois laços: o externo conta as passadas (1 a 4), o interno compara vizinhos (1 até 5 - i).',
            'Troque com aux quando v[j] > v[j + 1].',
          ],
          explicacao:
            'Ordenação por bolha: 4 passadas, comparando e trocando vizinhos fora de ordem.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: ranking do maior para o menor',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Leia 5 pontuações e escreva-as em ordem DECRESCENTE (da maior para a menor), uma por linha.',
          codigoInicial: `${DECL}${LER5}\nfimalgoritmo`,
          solucao: `${DECL}${LER5}${bolha('<')}${ESCREVER5}fimalgoritmo`,
          casos: [
            {
              entradas: ['10', '50', '30', '20', '40'],
              saidaEsperada: ['50', '40', '30', '20', '10'],
            },
            { entradas: ['3', '3', '8', '1', '8'], saidaEsperada: ['8', '8', '3', '3', '1'] },
          ],
          pistas: ['O algoritmo é o mesmo da ordem crescente: só uma coisa muda.'],
          explicacao:
            'Invertendo a comparação para v[j] < v[j + 1], os menores "borbulham" para o fim.',
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
          tipo: 'associacao',
          enunciado: 'Associe cada algoritmo à sua ideia principal.',
          pares: [
            {
              id: 'bolha',
              esquerda: 'Bolha',
              direita: 'Troca vizinhos fora de ordem; o maior vai para o fim a cada passada',
            },
            {
              id: 'selecao',
              esquerda: 'Seleção',
              direita: 'Procura o menor restante e o coloca na próxima posição',
            },
            {
              id: 'insercao',
              esquerda: 'Inserção',
              direita: 'Encaixa cada elemento no lugar certo da parte já ordenada',
            },
          ],
          explicacao:
            'Bolha troca vizinhos; seleção escolhe o menor; inserção encaixa como cartas na mão.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Por que a troca precisa de uma variável auxiliar?',
          alternativas: [
            { id: 'a', texto: 'Porque a primeira atribuição apagaria um dos valores' },
            {
              id: 'b',
              texto: 'Porque vetores não aceitam atribuição direta entre posições',
              feedback: 'Aceitam: v[j] <- 5 é válido. O problema é a ordem das atribuições.',
            },
            {
              id: 'c',
              texto: 'Para deixar o programa um pouco mais rápido na troca',
              feedback: 'A auxiliar não é sobre velocidade, e sim sobre não perder um valor.',
            },
          ],
          correta: 'a',
          explicacao:
            'Sem aux, v[j] <- v[j + 1] sobrescreve o valor de v[j] antes de ele ser copiado.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique como funciona a ordenação por bolha e por que cada passada pode ser mais curta que a anterior.',
          respostaModelo:
            'A bolha compara cada elemento com o vizinho da direita e troca os dois se estiverem fora de ordem. Ao fim de cada passada, o maior valor da parte não ordenada chega ao final. Por isso a passada seguinte não precisa olhar as últimas posições, que já estão no lugar certo.',
          rubrica: [
            'Explicou que compara vizinhos e troca se estiverem fora de ordem',
            'Disse que o maior vai para o fim a cada passada',
            'Explicou que o final já ordenado não precisa ser revisto',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Ordenar = comparar e trocar elementos até ficarem em ordem.',
        'Troca sempre com auxiliar: aux <- a; a <- b; b <- aux.',
        'Bolha: n - 1 passadas, laço interno até n - i, o maior vai para o fim a cada passada.',
        'Inverter a comparação muda de crescente para decrescente.',
        'Vetor ordenado permite busca binária.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m02.a04.fc1',
          frente: 'O que acontece ao fim de cada passada da bolha?',
          verso: 'O maior valor da parte não ordenada chega ao final.',
        },
        {
          id: 'logica.m02.a04.fc2',
          frente: 'Como trocar v[j] e v[j + 1]?',
          verso: 'aux <- v[j]; v[j] <- v[j + 1]; v[j + 1] <- aux',
        },
        {
          id: 'logica.m02.a04.fc3',
          frente: 'Qual algoritmo simples é rápido em vetores quase ordenados?',
          verso: 'Ordenação por inserção.',
        },
        {
          id: 'logica.m02.a04.fc4',
          frente: 'Como ordenar em ordem decrescente com a bolha?',
          verso: 'Inverter a comparação: trocar quando v[j] < v[j + 1].',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Estruturas de Dados: merge sort e quicksort ordenam em O(n log n) com a estratégia "dividir para conquistar".',
        'Banco de Dados: ORDER BY é uma ordenação feita pelo banco.',
        'Análise de Algoritmos: comparar algoritmos pelo número de operações é a base da notação O.',
      ],
      aplicacaoProfissional:
        'Ordenar chamados por prioridade, máquinas por uso de disco ou logs por data é rotina. Você usará a ordenação pronta da linguagem, mas entender o custo ajuda a perceber por que ordenar milhões de linhas pode ser o gargalo de um relatório.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
