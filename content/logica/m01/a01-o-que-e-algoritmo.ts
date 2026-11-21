import type { AulaEntrada } from '@/domain/conteudo';

export const aula01: AulaEntrada = {
  id: 'logica.m01.a01',
  versao: 2,
  status: 'publicada',
  titulo: 'O que é um algoritmo',
  objetivo:
    'Definir algoritmo, reconhecer suas características (finitude, clareza, entrada e saída) e decompor uma tarefa do dia a dia em passos.',
  preRequisitos: [],
  duracaoMin: 25,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado: 'Qual destas opções é um algoritmo?',
          alternativas: [
            {
              id: 'a',
              texto: 'Uma receita com os passos numerados e as quantidades exatas',
            },
            {
              id: 'b',
              texto: 'A lista de ingredientes de um bolo',
              feedback:
                'A lista diz o que usar, mas não o que fazer nem em que ordem. Falta a sequência de passos.',
            },
            {
              id: 'c',
              texto: 'A foto do bolo pronto',
              feedback: 'A foto mostra o resultado, não o caminho para chegar até ele.',
            },
          ],
          correta: 'a',
          explicacao:
            'Um algoritmo é uma sequência de passos que leva a um resultado. A receita com passos numerados é exatamente isso.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Algoritmo é uma sequência de passos',
      texto:
        'Um algoritmo é uma lista de instruções, em uma ordem definida, que resolve um problema.\n\nVocê já segue algoritmos todo dia: o caminho para o trabalho, o procedimento para reiniciar o roteador, a receita de um bolo. Programar é escrever algoritmos de um jeito que o computador consiga seguir.',
      porModo: {
        essencial:
          'Algoritmo = passos em ordem que resolvem um problema. Programar é escrever esses passos para o computador.',
        guiado:
          'Pense numa tarefa que você faz sempre, como preparar um café.\n\n1. Você não faz tudo ao mesmo tempo: há uma ordem.\n2. Cada passo é claro: "coloque água", "ligue a cafeteira".\n3. Em algum momento, termina: o café fica pronto.\n\nEssa lista ordenada, clara e com fim é um algoritmo. Programar é escrever algoritmos assim para o computador.',
        tecnico:
          'Um algoritmo é uma sequência finita de instruções bem definidas que, a partir de zero ou mais entradas, produz uma ou mais saídas. Um programa é a expressão de um algoritmo em uma linguagem que o computador executa.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'A receita de bolo',
      texto:
        'Uma receita tem ingredientes (as entradas), um modo de preparo em passos (o processamento) e o bolo pronto (a saída). Se você pular um passo ou trocar a ordem, o resultado muda.',
      limites:
        'Receitas aceitam instruções vagas como "sal a gosto" ou "asse até dourar", porque uma pessoa interpreta. O computador não interpreta: cada passo precisa ser exato.',
    },
    {
      id: 'demo-robo',
      tipo: 'demo',
      titulo: 'Programe o robô',
      instrucoes:
        'O robô só entende três comandos exatos. Monte a sequência e aperte **Executar**.\n\nExperimente também o comando "Ir mais ou menos para lá" e veja o que acontece. Depois, tente resolver cada fase com o menor número de comandos.',
      simulacao: { tipo: 'robo' },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'As características de um algoritmo',
      texto:
        'Na Ciência da Computação, um algoritmo precisa ter cinco características:\n\n**Finitude:** termina depois de um número limitado de passos.\n\n**Definição:** cada passo tem um único significado, sem ambiguidade.\n\n**Entrada:** recebe zero ou mais dados para trabalhar.\n\n**Saída:** produz pelo menos um resultado.\n\n**Efetividade:** cada passo é simples o bastante para ser executado de fato.\n\nPara chegar a um algoritmo, usamos o **pensamento computacional**: decompor o problema em partes menores, reconhecer padrões, abstrair o que não importa e só então escrever os passos.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Fazer café na cafeteira, como fluxograma',
      nos: [
        { forma: 'inicio', texto: 'Início' },
        { forma: 'passo', texto: 'Colocar água no reservatório' },
        { forma: 'passo', texto: 'Colocar o filtro e o pó de café' },
        { forma: 'passo', texto: 'Ligar a cafeteira' },
        {
          forma: 'decisao',
          texto: 'A água terminou de passar? Se não, aguardar e verificar de novo',
        },
        { forma: 'passo', texto: 'Desligar a cafeteira' },
        { forma: 'fim', texto: 'Fim: café pronto' },
      ],
      descricao:
        'O fluxograma começa no Início, segue três passos (colocar água, colocar filtro e pó, ligar a cafeteira) e chega a uma decisão: a água terminou de passar? Enquanto não terminou, aguarda e pergunta de novo. Quando terminou, desliga a cafeteira e chega ao Fim, com o café pronto.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Média de duas notas, em pseudocódigo',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'algoritmo "MediaDeDuasNotas"\nvar\n  nota1, nota2, media: real\ninicio\n  escreva("Digite a primeira nota: ")\n  leia(nota1)\n  escreva("Digite a segunda nota: ")\n  leia(nota2)\n  media <- (nota1 + nota2) / 2\n  escreva("Média: ", media)\nfimalgoritmo',
      },
      comentarios: [
        { linha: 1, texto: 'Todo algoritmo tem um nome que diz o que ele faz.' },
        {
          linha: 3,
          texto: 'Declaramos onde os dados vão ficar guardados (variáveis — tema da aula 2).',
        },
        { linha: 6, texto: 'Entrada: o algoritmo recebe a primeira nota de quem está usando.' },
        {
          linha: 9,
          texto:
            'Processamento: os parênteses garantem que a soma acontece antes da divisão. Sem eles, só a nota2 seria dividida.',
        },
        { linha: 10, texto: 'Saída: o resultado é mostrado na tela.' },
      ],
    },
    {
      id: 'demo-media',
      tipo: 'demo',
      titulo: 'Veja o algoritmo da média rodar',
      instrucoes:
        'Aperte **Avançar** e acompanhe: a linha destacada é a que está executando, as "gavetas" mostram o valor de cada variável e a tela mostra o que o programa escreveu.\n\nDepois, troque as notas no campo de entradas e rode de novo.',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'algoritmo "MediaDeDuasNotas"\nvar\n  nota1, nota2, media: real\ninicio\n  escreva("Digite a primeira nota: ")\n  leia(nota1)\n  escreva("Digite a segunda nota: ")\n  leia(nota2)\n  media <- (nota1 + nota2) / 2\n  escreva("Média: ", media)\nfimalgoritmo',
        entradas: ['7', '8.5'],
      },
    },
    {
      id: 'ex-guiado',
      tipo: 'exercicio',
      modo: 'guiado',
      titulo: 'Exercício guiado',
      questoes: [
        {
          id: 'ex-guiado.q1',
          tipo: 'ordenacao',
          enunciado: 'Coloque em ordem os passos para enviar um e-mail pelo celular.',
          itens: [
            { id: 'abrir', texto: 'Abrir o aplicativo de e-mail' },
            { id: 'escrever', texto: 'Tocar em "Escrever"' },
            { id: 'preencher', texto: 'Preencher destinatário, assunto e mensagem' },
            { id: 'enviar', texto: 'Tocar em "Enviar"' },
          ],
          pistas: [
            'Pergunte a cada passo: o que precisa ter acontecido antes dele?',
            'Não dá para preencher a mensagem antes de abrir a tela de escrita.',
          ],
          explicacao:
            'Cada passo depende do anterior: sem abrir o aplicativo não existe o botão "Escrever", e sem preencher não faz sentido enviar. A ordem faz parte do algoritmo.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Por que a instrução "adicione sal a gosto" não funciona para um computador?',
          alternativas: [
            { id: 'a', texto: 'Porque é ambígua: não diz a quantidade exata' },
            {
              id: 'b',
              texto: 'Porque computadores não cozinham',
              feedback:
                'Verdade, mas o problema é outro. Mesmo num programa, uma instrução vaga não pode ser executada.',
            },
            {
              id: 'c',
              texto: 'Porque falta o passo de desligar o fogo',
              feedback:
                'Esse passo pode até faltar na receita, mas o problema desta instrução é não dizer quanto sal usar.',
            },
          ],
          correta: 'a',
          pistas: [
            'Pense na característica "definição": cada passo precisa ter um único significado.',
          ],
          explicacao:
            '"A gosto" depende de quem executa. Um algoritmo exige definição: o mesmo passo deve dar o mesmo resultado para qualquer executor.',
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
          tipo: 'prever-saida',
          enunciado: 'O que este algoritmo escreve na tela?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'a <- 5\nb <- 3\na <- a + b\nescreva(a)',
          },
          respostasAceitas: ['8'],
          errosComuns: [
            {
              resposta: '5',
              feedback:
                'Na linha 3, "a" recebe um novo valor: 5 + 3. O valor antigo é substituído.',
            },
            {
              resposta: '53',
              feedback: 'Aqui o "+" soma números; ele não junta os dígitos como se fossem texto.',
            },
            {
              resposta: 'a',
              feedback: 'escreva(a) mostra o VALOR guardado em "a", não a letra.',
            },
          ],
          pistas: ['Execute linha por linha e anote o valor de "a" e de "b" a cada passo.'],
          explicacao:
            'Linha 1: a = 5. Linha 2: b = 3. Linha 3: a recebe 5 + 3, ou seja, 8. A linha 4 escreve 8.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'associacao',
          enunciado: 'Associe cada característica de um algoritmo ao seu significado.',
          pares: [
            {
              id: 'finitude',
              esquerda: 'Finitude',
              direita: 'Termina depois de um número limitado de passos',
            },
            {
              id: 'definicao',
              esquerda: 'Definição',
              direita: 'Cada passo tem um único significado',
            },
            { id: 'entrada', esquerda: 'Entrada', direita: 'Os dados que o algoritmo recebe' },
            { id: 'saida', esquerda: 'Saída', direita: 'O resultado que o algoritmo produz' },
          ],
          pistas: ['Comece pelas que você tem certeza; as restantes se encaixam por eliminação.'],
          explicacao:
            'Finitude garante que termina; definição, que não há dúvida em nenhum passo; entrada e saída são o que entra e o que sai do algoritmo.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: encontre o problema',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'multipla-escolha',
          enunciado:
            'Este algoritmo deveria escrever 1, 2 e 3. Leia "enquanto ... faca" como "repita enquanto a condição for verdadeira". O que acontece de fato?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'contador <- 1\nenquanto contador <= 3 faca\n  escreva(contador)\nfimenquanto',
          },
          alternativas: [
            { id: 'a', texto: 'Escreve 1 sem parar: o algoritmo nunca termina' },
            {
              id: 'b',
              texto: 'Escreve 1, 2 e 3',
              feedback:
                'Nenhuma linha muda o valor de contador. Faltou "contador <- contador + 1" dentro da repetição.',
            },
            {
              id: 'c',
              texto: 'Não escreve nada',
              feedback: 'contador começa em 1, e 1 <= 3 é verdadeiro, então a repetição começa.',
            },
          ],
          correta: 'a',
          pistas: [
            'Anote o valor de contador antes e depois de cada repetição.',
            'Alguma linha dentro da repetição altera o contador?',
          ],
          explicacao:
            'Como contador continua 1, a condição 1 <= 3 é sempre verdadeira. O algoritmo viola a finitude: nunca termina. A correção é aumentar o contador a cada volta.',
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
          enunciado: 'Qual característica garante que um algoritmo termina?',
          alternativas: [
            { id: 'a', texto: 'Finitude' },
            {
              id: 'b',
              texto: 'Efetividade',
              feedback:
                'Efetividade é cada passo poder ser executado. Um passo executável pode se repetir para sempre.',
            },
            {
              id: 'c',
              texto: 'Saída',
              feedback: 'Ter saída é produzir um resultado. Terminar é outra característica.',
            },
          ],
          correta: 'a',
          explicacao: 'Finitude: o algoritmo termina depois de um número limitado de passos.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado: 'No algoritmo da média de duas notas, qual linha é o processamento?',
          alternativas: [
            { id: 'a', texto: 'media <- (nota1 + nota2) / 2' },
            {
              id: 'b',
              texto: 'leia(nota1)',
              feedback: 'leia recebe um dado de fora: é entrada.',
            },
            {
              id: 'c',
              texto: 'escreva("Média: ", media)',
              feedback: 'escreva mostra o resultado: é saída.',
            },
          ],
          correta: 'a',
          explicacao:
            'O processamento transforma as entradas no resultado: aqui, a conta da média.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Algoritmo é uma sequência finita de passos claros que resolve um problema.',
        'Todo algoritmo tem entrada, processamento e saída.',
        'Cada passo precisa ser exato: o computador não interpreta instruções vagas.',
        'Pensamento computacional: decompor, reconhecer padrões, abstrair e só então escrever os passos.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m01.a01.fc1',
          frente: 'O que é um algoritmo?',
          verso: 'Uma sequência finita de instruções bem definidas que resolve um problema.',
        },
        {
          id: 'logica.m01.a01.fc2',
          frente: 'Quais são as três partes de um algoritmo?',
          verso: 'Entrada, processamento e saída.',
        },
        {
          id: 'logica.m01.a01.fc3',
          frente: 'Por que "sal a gosto" não serve como passo de algoritmo?',
          verso: 'É ambíguo. Cada passo precisa ter um único significado (definição).',
        },
        {
          id: 'logica.m01.a01.fc4',
          frente: 'O que é decompor um problema?',
          verso: 'Dividi-lo em partes menores, mais fáceis de resolver uma de cada vez.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Linguagens de Programação: todo programa é um algoritmo escrito numa linguagem.',
        'Engenharia de Software: requisitos ambíguos geram programas errados, como instruções vagas.',
        'Infraestrutura e Suporte: procedimentos de atendimento são algoritmos.',
      ],
      aplicacaoProfissional:
        'No suporte de TI, o procedimento para "computador sem rede" é um algoritmo: passos em ordem, sem ambiguidade e com um fim definido. Quem escreve bons procedimentos já está escrevendo bons algoritmos.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
