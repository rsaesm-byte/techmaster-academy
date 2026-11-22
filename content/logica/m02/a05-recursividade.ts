import type { AulaEntrada } from '@/domain/conteudo';

export const m02a05: AulaEntrada = {
  id: 'logica.m02.a05',
  versao: 1,
  status: 'publicada',
  titulo: 'Recursividade: funções que chamam a si mesmas',
  objetivo:
    'Reconhecer caso base e passo recursivo, acompanhar a pilha de chamadas de uma função recursiva e escrever funções recursivas simples.',
  preRequisitos: ['logica.m02.a04'],
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
          enunciado: '5! (fatorial de 5) é 5 × 4 × 3 × 2 × 1. Qual frase também está correta?',
          alternativas: [
            { id: 'a', texto: '5! = 5 × 4!' },
            { id: 'b', texto: '5! = 5 + 4!', feedback: 'O fatorial é um produto, não uma soma.' },
            {
              id: 'c',
              texto: '5! = 4! × 4',
              feedback: '4! já inclui o 4; falta multiplicar pelo 5.',
            },
          ],
          correta: 'a',
          explicacao:
            'Um problema definido por uma versão menor dele mesmo: essa é a ideia central da recursão.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Resolver usando uma versão menor do problema',
      texto:
        'Uma função **recursiva** chama a si mesma com um problema **menor**. Ela tem duas partes:\n\n- **Caso base:** o problema é tão pequeno que a resposta é direta (ex.: 1! = 1). É ele que faz a recursão parar.\n- **Passo recursivo:** resolve o problema usando a resposta de uma versão menor (ex.: n! = n × (n - 1)!).\n\nSem caso base, a função se chamaria para sempre — até a pilha de chamadas estourar.',
      porModo: {
        essencial:
          'Recursão = função que chama a si mesma com um problema menor. Precisa de caso base (para) e passo recursivo (encolhe o problema). Cada chamada ocupa um quadro na pilha.',
        guiado:
          'Imagine uma fila e você quer saber sua posição.\n1. Você pergunta à pessoa da frente: "qual é a sua posição?".\n2. Ela faz a mesma pergunta para quem está à frente dela, e assim por diante.\n3. A primeira pessoa sabe: "sou a 1" (caso base).\n4. As respostas voltam somando 1 até chegar em você.',
        tecnico:
          'Uma definição recursiva tem ao menos um caso base não recursivo e casos recursivos que convergem para ele. Cada chamada empilha um quadro com seus parâmetros; os retornos desempilham na ordem inversa (LIFO). A profundidade máxima da pilha é limitada; recursão sem convergência causa estouro de pilha (stack overflow).',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Bonecas russas',
      texto:
        'Para contar quantas bonecas há numa matrioska, você abre a de fora e conta "1 + as bonecas de dentro". Faz o mesmo com a de dentro, e assim por diante, até chegar à boneca maciça, que não abre: ela é o caso base.',
      limites:
        'Nas bonecas você esquece as de fora enquanto abre as de dentro; no computador, cada chamada fica esperando na pilha a resposta da chamada de dentro, ocupando memória.',
    },
    {
      id: 'demo-fatorial',
      tipo: 'demo',
      titulo: 'A pilha cresce e depois desempilha',
      instrucoes:
        'Avance passo a passo e observe a **Pilha de chamadas**: fat(4) chama fat(3), que chama fat(2), que chama fat(1). Ao chegar no caso base, as respostas voltam multiplicando.\n\nDepois, mude para `fat(6)`. E se você apagar o `se n <= 1`? Execute e veja o que acontece.',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'funcao fat(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne 1\n  fimse\n  retorne n * fat(n - 1)\nfimfuncao\n\ninicio\n  escreva(fat(4))\nfimalgoritmo',
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Como pensar recursivamente',
      texto:
        '**1. Defina o caso base:** qual é a menor entrada com resposta óbvia? (n <= 1 para fatorial; n = 0 para somas).\n\n**2. Suponha que a chamada menor funciona:** se `fat(n - 1)` devolve o fatorial certo, como obter `fat(n)`? Resposta: `n * fat(n - 1)`. Não tente "seguir" todas as chamadas de cabeça: confie na menor.\n\n**3. Garanta que encolhe:** cada chamada recursiva precisa ficar mais perto do caso base (n - 1, metade do vetor...).\n\n**Ida e volta:** na ida, as chamadas empilham sem calcular nada; na volta, cada retorne completa a conta pendente.\n\n**Recursão × laço:** tudo o que se faz com recursão dá para fazer com laços. A recursão brilha em problemas que se dividem naturalmente em partes menores do mesmo tipo: árvores, pastas dentro de pastas, dividir para conquistar.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Anatomia de uma chamada recursiva',
      nos: [
        { forma: 'inicio', texto: 'Chamada fat(n)' },
        { forma: 'decisao', texto: 'n <= 1? Caso base: retorne 1' },
        { forma: 'passo', texto: 'Senão: chama fat(n - 1) e espera a resposta' },
        { forma: 'passo', texto: 'Multiplica: n × (resposta de fat(n - 1))' },
        { forma: 'fim', texto: 'Retorna o resultado para quem chamou' },
      ],
      descricao:
        'A chamada fat de n primeiro testa o caso base: se n for menor ou igual a 1, devolve 1. Senão, chama fat de n menos 1 e espera. Quando a resposta chega, multiplica por n e devolve o resultado para quem chamou.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Ida e volta de fat(4)',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'fat(4) = 4 * fat(3)\n         fat(3) = 3 * fat(2)\n                  fat(2) = 2 * fat(1)\n                           fat(1) = 1\n                  fat(2) = 2 * 1 = 2\n         fat(3) = 3 * 2 = 6\nfat(4) = 4 * 6 = 24',
      },
      comentarios: [
        { linha: 1, texto: 'Ida: cada chamada deixa uma conta pendente e chama uma versão menor.' },
        {
          linha: 4,
          texto: 'Caso base: a resposta é direta, sem nova chamada. A pilha tem 4 quadros.',
        },
        { linha: 5, texto: 'Volta: cada quadro completa sua conta e sai da pilha.' },
        { linha: 7, texto: 'O último a resolver é o primeiro que foi chamado: 24.' },
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
              'funcao s(n: inteiro): inteiro\ninicio\n  se n = 0 entao\n    retorne 0\n  fimse\n  retorne n + s(n - 1)\nfimfuncao\n\ninicio\n  escreva(s(4))\nfimalgoritmo',
          },
          respostasAceitas: ['10'],
          errosComuns: [
            { resposta: '24', feedback: 'Aqui é soma (+), não multiplicação.' },
            { resposta: '4', feedback: 's(4) não para no 4: soma com s(3), que soma com s(2)...' },
          ],
          pistas: ['s(4) = 4 + s(3). Quanto vale s(3)?'],
          explicacao: 's(4) = 4 + 3 + 2 + 1 + 0 = 10.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete o caso base do fatorial.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'funcao fat(n: inteiro): inteiro\ninicio\n  se n <= ___ entao\n    retorne ___\n  fimse\n  retorne n * fat(n - 1)\nfimfuncao',
          },
          lacunas: [
            { aceitas: ['1'], feedback: 'Qual é o menor n cujo fatorial você sabe de cara?' },
            { aceitas: ['1'], feedback: 'Quanto vale 1! (e 0!)?' },
          ],
          explicacao: 'se n <= 1 entao retorne 1: 0! e 1! valem 1, e a recursão para ali.',
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
          enunciado: 'Esta função estoura a pilha de chamadas. Qual linha causa o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'funcao fat(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne 1\n  fimse\n  retorne n * fat(n)\nfimfuncao',
          },
          linhaErrada: 6,
          feedbackPorLinha: {
            '3': 'O caso base está certo.',
            '4': 'Devolver 1 no caso base está certo.',
          },
          pistas: ['A chamada recursiva está ficando mais perto do caso base?'],
          explicacao:
            'fat(n) chama fat(n) de novo: o problema nunca encolhe. Deveria ser fat(n - 1).',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado:
            'Escreva a função recursiva pot(b, e) que devolve b elevado a e (e >= 0). Lembre: b⁰ = 1 e bᵉ = b × bᵉ⁻¹.',
          codigoInicial:
            'funcao pot(b, e: inteiro): inteiro\ninicio\n\nfimfuncao\n\nvar\n  x, y: inteiro\ninicio\n  leia(x)\n  leia(y)\n  escreva(pot(x, y))\nfimalgoritmo',
          solucao:
            'funcao pot(b, e: inteiro): inteiro\ninicio\n  se e = 0 entao\n    retorne 1\n  fimse\n  retorne b * pot(b, e - 1)\nfimfuncao\n\nvar\n  x, y: inteiro\ninicio\n  leia(x)\n  leia(y)\n  escreva(pot(x, y))\nfimalgoritmo',
          casos: [
            { entradas: ['2', '10'], saidaEsperada: ['1024'] },
            { entradas: ['5', '0'], saidaEsperada: ['1'] },
            { entradas: ['3', '3'], saidaEsperada: ['27'] },
          ],
          pistas: ['Caso base: e = 0.', 'Passo recursivo: b * pot(b, e - 1).'],
          explicacao:
            'Caso base e = 0 devolve 1; senão, b vezes a potência com expoente uma unidade menor.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: Fibonacci',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Na sequência de Fibonacci, fib(0) = 0, fib(1) = 1 e cada termo é a soma dos dois anteriores: fib(n) = fib(n - 1) + fib(n - 2). Escreva a função recursiva fib e um programa que lê n e escreve fib(n).',
          codigoInicial: 'var\n  n: inteiro\ninicio\n  leia(n)\n  escreva(fib(n))\nfimalgoritmo',
          solucao:
            'funcao fib(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne n\n  fimse\n  retorne fib(n - 1) + fib(n - 2)\nfimfuncao\n\nvar\n  n: inteiro\ninicio\n  leia(n)\n  escreva(fib(n))\nfimalgoritmo',
          casos: [
            { entradas: ['0'], saidaEsperada: ['0'] },
            { entradas: ['1'], saidaEsperada: ['1'] },
            { entradas: ['6'], saidaEsperada: ['8'] },
            { entradas: ['7'], saidaEsperada: ['13'] },
          ],
          pistas: [
            'São dois casos base: n = 0 e n = 1. Repare que nos dois a resposta é o próprio n.',
            'O passo recursivo faz DUAS chamadas.',
          ],
          explicacao:
            'Caso base n <= 1 devolve n; senão, soma fib(n - 1) e fib(n - 2). Repare no Visualizador quantas chamadas repetidas isso gera!',
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
          enunciado: 'Para que serve o caso base numa função recursiva?',
          alternativas: [
            { id: 'a', texto: 'Para a recursão parar, devolvendo uma resposta sem nova chamada' },
            {
              id: 'b',
              texto: 'Para a função ficar mais rápida ao chamar a si mesma',
              feedback: 'Ele não é sobre velocidade: sem ele a função nunca termina.',
            },
            {
              id: 'c',
              texto: 'Para chamar a função de novo com um valor maior que o anterior',
              feedback: 'As chamadas devem ficar MENORES, rumo ao caso base.',
            },
          ],
          correta: 'a',
          explicacao: 'O caso base resolve o menor problema diretamente e interrompe as chamadas.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado:
            'Durante fat(4), qual é o maior número de quadros de fat na pilha ao mesmo tempo?',
          alternativas: [
            { id: 'a', texto: '4' },
            {
              id: 'b',
              texto: '1',
              feedback: 'Cada chamada fica esperando a de dentro: elas se acumulam.',
            },
            { id: 'c', texto: '24', feedback: '24 é o resultado, não o número de chamadas.' },
          ],
          correta: 'a',
          explicacao: 'fat(4), fat(3), fat(2) e fat(1) ficam empilhadas no momento do caso base.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique o que é recursão e quais são as duas partes que toda função recursiva precisa ter.',
          respostaModelo:
            'Recursão é quando uma função resolve um problema chamando a si mesma com uma versão menor dele. Ela precisa de um caso base, que responde diretamente e faz as chamadas pararem, e de um passo recursivo, que usa o resultado da versão menor para montar a resposta, sempre se aproximando do caso base.',
          rubrica: [
            'Disse que a função chama a si mesma com um problema menor',
            'Explicou o caso base e que ele faz a recursão parar',
            'Explicou o passo recursivo',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Função recursiva chama a si mesma com um problema menor.',
        'Caso base: resposta direta que faz a recursão parar.',
        'Passo recursivo: usa a resposta menor e precisa se aproximar do caso base.',
        'Cada chamada ocupa um quadro na pilha; sem caso base, a pilha estoura.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m02.a05.fc1',
          frente: 'O que é o caso base?',
          verso:
            'A situação em que a função responde direto, sem chamar a si mesma — é o que faz a recursão parar.',
        },
        {
          id: 'logica.m02.a05.fc2',
          frente: 'Definição recursiva do fatorial?',
          verso: 'fat(n) = 1 se n <= 1; senão, n * fat(n - 1).',
        },
        {
          id: 'logica.m02.a05.fc3',
          frente: 'O que é estouro de pilha?',
          verso:
            'Chamadas demais acumuladas na pilha, normalmente por recursão sem caso base ou que não encolhe.',
        },
        {
          id: 'logica.m02.a05.fc4',
          frente: 'Em que ordem as chamadas recursivas terminam?',
          verso: 'Na ordem inversa da chamada: a última chamada é a primeira a retornar.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Estruturas de Dados: árvores e grafos são percorridos naturalmente com recursão.',
        'Sistemas Operacionais: pastas dentro de pastas são uma estrutura recursiva.',
        'Algoritmos: merge sort e quicksort dividem o vetor e ordenam as partes recursivamente.',
      ],
      aplicacaoProfissional:
        'Calcular o tamanho de uma pasta, listar todos os grupos aninhados de um usuário no Active Directory ou varrer um JSON de profundidade desconhecida são problemas recursivos: "faça isto aqui e o mesmo em cada filho".',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
