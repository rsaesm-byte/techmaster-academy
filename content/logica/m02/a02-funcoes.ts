import type { AulaEntrada } from '@/domain/conteudo';

export const m02a02: AulaEntrada = {
  id: 'logica.m02.a02',
  versao: 1,
  status: 'publicada',
  titulo: 'Funções e procedimentos',
  objetivo:
    'Dividir um programa em sub-rotinas com nome, passar valores por parâmetros, devolver resultados com retorne e entender a pilha de chamadas.',
  preRequisitos: ['logica.m02.a01'],
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
          enunciado:
            'Você calcula a área de um retângulo em 6 lugares diferentes do programa. Qual é a melhor saída?',
          alternativas: [
            { id: 'a', texto: 'Criar uma função area(base, altura) e chamá-la nos 6 lugares' },
            {
              id: 'b',
              texto: 'Copiar e colar a conta nos 6 lugares',
              feedback:
                'Funciona, mas se a conta mudar você precisa lembrar de corrigir as 6 cópias.',
            },
            {
              id: 'c',
              texto: 'Calcular só uma vez e torcer para os valores serem iguais',
              feedback:
                'Cada retângulo tem base e altura diferentes: o cálculo precisa ser refeito.',
            },
          ],
          correta: 'a',
          explicacao:
            'Uma função dá nome a um pedaço de código. Escreve-se uma vez e chama-se quantas vezes precisar.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Dar nome a um pedaço de código',
      texto:
        'Uma **função** é um mini-programa com nome. Ela recebe valores (**parâmetros**), faz um trabalho e **devolve** um resultado com `retorne`.\n\nUm **procedimento** é parecido, mas não devolve nada: ele só executa uma ação, como escrever algo na tela.\n\nQuem usa a função só precisa saber o que entrar e o que sai — não como ela funciona por dentro.',
      porModo: {
        essencial:
          'funcao nome(parâmetros): tipo ... retorne valor ... fimfuncao. Chame com nome(valores). Procedimento = sem retorno, chamado numa linha sozinho.',
        guiado:
          'Pense numa máquina de suco.\n1. Você coloca as frutas (os parâmetros).\n2. A máquina faz o trabalho lá dentro (o corpo da função).\n3. Sai o suco (o valor devolvido pelo retorne).\nVocê não precisa abrir a máquina para usá-la: só saber o que colocar e o que sai.',
        tecnico:
          'Sub-rotinas encapsulam um bloco com interface definida (parâmetros tipados e tipo de retorno). Os parâmetros são passados por valor: a função recebe cópias. Cada chamada cria um quadro (frame) na pilha de chamadas com seus parâmetros e variáveis locais, destruído ao retornar.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'A receita do livro',
      texto:
        'Um livro de receitas tem "Massa básica (página 12)". Outras receitas dizem: "faça a massa básica da página 12 com 300 g de farinha". Você vai até lá, segue os passos com aquela quantidade e volta com a massa pronta. A receita da página 12 é uma função; a quantidade é o parâmetro; a massa é o retorno.',
      limites:
        'Ao cozinhar você pode adaptar a receita no improviso; a função faz sempre exatamente os mesmos passos. E as variáveis de dentro da função (locais) somem quando ela termina — como se a bancada fosse limpa a cada vez.',
    },
    {
      id: 'demo-funcao',
      tipo: 'demo',
      titulo: 'Veja a pilha de chamadas',
      instrucoes:
        'Avance passo a passo e observe o painel **Pilha de chamadas**: quando `area` é chamada, aparece um quadro novo com `base` e `altura`. No `retorne`, o quadro some e o valor volta para quem chamou.\n\nDepois, acrescente uma terceira linha: `escreva("Cozinha: ", area(2, 5))`.',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'funcao area(base, altura: real): real\ninicio\n  retorne base * altura\nfimfuncao\n\nprocedimento linha()\ninicio\n  escreva("----------")\nfimprocedimento\n\ninicio\n  linha()\n  escreva("Sala: ", area(4, 3.5))\n  escreva("Quarto: ", area(3, 3))\n  linha()\nfimalgoritmo',
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Anatomia de uma função',
      texto:
        '**Declaração:** `funcao dobro(x: inteiro): inteiro` — nome, parâmetros com tipo e o tipo do valor devolvido. Vários parâmetros: `(a, b: inteiro; nome: caractere)`.\n\n**Corpo:** entre `inicio` e `fimfuncao`. Pode declarar variáveis **locais** antes do inicio.\n\n**retorne:** devolve o valor e encerra a função na hora. Toda função precisa chegar a um `retorne`.\n\n**Chamada:** `dobro(5)` vale 10 e pode ser usada em contas, em `escreva` ou como argumento de outra chamada: `dobro(dobro(5))`.\n\n**Procedimento:** `procedimento nome(...)` ... `fimprocedimento`, sem tipo de retorno; chamado numa linha sozinho.\n\n**Escopo:** parâmetros e locais só existem durante a chamada. Por isso duas funções podem ter variáveis com o mesmo nome sem conflito.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'O caminho de uma chamada',
      nos: [
        { forma: 'inicio', texto: 'O programa encontra area(4, 3.5)' },
        { forma: 'passo', texto: 'Cria um quadro na pilha: base = 4, altura = 3.5' },
        { forma: 'passo', texto: 'Executa o corpo da função' },
        { forma: 'decisao', texto: 'Chegou ao retorne? Devolve 14 e apaga o quadro' },
        { forma: 'fim', texto: 'O programa continua de onde parou, usando o 14' },
      ],
      descricao:
        'Quando o programa chama area com 4 e 3.5, cria um quadro na pilha com base e altura. Executa o corpo da função até o retorne, que devolve 14 e apaga o quadro. Então o programa continua do ponto onde fez a chamada, usando o valor devolvido.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Uma função usando outra',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'funcao quadrado(n: real): real\ninicio\n  retorne n * n\nfimfuncao\n\nfuncao hipotenusa(a, b: real): real\ninicio\n  retorne raizq(quadrado(a) + quadrado(b))\nfimfuncao\n\ninicio\n  escreva(hipotenusa(3, 4))\nfimalgoritmo',
      },
      comentarios: [
        { linha: 1, texto: 'Uma função pequena, com uma tarefa só: elevar ao quadrado.' },
        { linha: 8, texto: 'hipotenusa reaproveita quadrado duas vezes e a função nativa raizq.' },
        { linha: 12, texto: 'A pilha chega a ter 2 quadros: hipotenusa e, em cima, quadrado.' },
        { linha: 12, texto: 'Resultado: raizq(9 + 16) = 5.' },
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
              'funcao dobro(x: inteiro): inteiro\ninicio\n  retorne x * 2\nfimfuncao\n\ninicio\n  escreva(dobro(dobro(3)))\nfimalgoritmo',
          },
          respostasAceitas: ['12'],
          errosComuns: [
            { resposta: '6', feedback: 'dobro(3) é 6, mas esse 6 entra em outro dobro.' },
          ],
          pistas: ['Resolva de dentro para fora: primeiro dobro(3).'],
          explicacao: 'dobro(3) = 6; dobro(6) = 12. A chamada de dentro acontece primeiro.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete a função que devolve o quadrado de um número inteiro.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'funcao quadrado(n: inteiro): ___\ninicio\n  ___ n * n\nfimfuncao',
          },
          lacunas: [
            {
              aceitas: ['inteiro'],
              feedback: 'Inteiro vezes inteiro dá inteiro: esse é o tipo devolvido.',
            },
            { aceitas: ['retorne'], feedback: 'Que palavra devolve o valor para quem chamou?' },
          ],
          explicacao:
            'O tipo depois dos dois-pontos é o tipo do retorno, e retorne devolve o valor.',
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
            'Esta função deveria devolver o maior de dois números, mas erra às vezes. Qual linha está errada?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'funcao maior(a, b: inteiro): inteiro\ninicio\n  se a > b entao\n    retorne a\n  fimse\n  retorne a\nfimfuncao',
          },
          linhaErrada: 6,
          feedbackPorLinha: {
            '3': 'Comparar a > b está certo.',
            '4': 'Se a for maior, devolver a está certo.',
          },
          pistas: ['Teste com a = 2 e b = 9.'],
          explicacao: 'Se a não é maior, o maior é b: a linha 6 deveria ser retorne b.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado: 'Escreva o corpo da função triplo, que devolve o triplo do número recebido.',
          codigoInicial:
            'funcao triplo(n: inteiro): inteiro\ninicio\n\nfimfuncao\n\nvar\n  x: inteiro\ninicio\n  leia(x)\n  escreva(triplo(x))\nfimalgoritmo',
          solucao:
            'funcao triplo(n: inteiro): inteiro\ninicio\n  retorne n * 3\nfimfuncao\n\nvar\n  x: inteiro\ninicio\n  leia(x)\n  escreva(triplo(x))\nfimalgoritmo',
          casos: [
            { entradas: ['4'], saidaEsperada: ['12'] },
            { entradas: ['0'], saidaEsperada: ['0'] },
            { entradas: ['-5'], saidaEsperada: ['-15'] },
          ],
          pistas: ['Uma linha basta: retorne ...'],
          explicacao:
            'retorne n * 3. O programa principal já chama a função e escreve o resultado.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: o maior de três',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Crie a função maior3(a, b, c: inteiro): inteiro, que devolve o maior dos três. O programa lê três números e escreve maior3 deles.',
          codigoInicial:
            'var\n  x, y, z: inteiro\ninicio\n  leia(x)\n  leia(y)\n  leia(z)\n  escreva(maior3(x, y, z))\nfimalgoritmo',
          solucao:
            'funcao maior3(a, b, c: inteiro): inteiro\nvar\n  m: inteiro\ninicio\n  m <- a\n  se b > m entao\n    m <- b\n  fimse\n  se c > m entao\n    m <- c\n  fimse\n  retorne m\nfimfuncao\n\nvar\n  x, y, z: inteiro\ninicio\n  leia(x)\n  leia(y)\n  leia(z)\n  escreva(maior3(x, y, z))\nfimalgoritmo',
          casos: [
            { entradas: ['1', '2', '3'], saidaEsperada: ['3'] },
            { entradas: ['9', '2', '3'], saidaEsperada: ['9'] },
            { entradas: ['4', '8', '1'], saidaEsperada: ['8'] },
            { entradas: ['-1', '-7', '-3'], saidaEsperada: ['-1'] },
          ],
          pistas: [
            'Declare a função ANTES do inicio do programa principal.',
            'Use uma variável local que começa com a e é trocada quando aparece alguém maior — como o "maior" da aula de vetores.',
          ],
          explicacao:
            'Uma variável local m começa com a e é atualizada por b e c se forem maiores. No fim, retorne m.',
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
          enunciado: 'Associe cada termo à sua descrição.',
          pares: [
            {
              id: 'parametro',
              esquerda: 'Parâmetro',
              direita: 'Valor que a sub-rotina recebe ao ser chamada',
            },
            { id: 'retorne', esquerda: 'retorne', direita: 'Devolve um valor e encerra a função' },
            {
              id: 'procedimento',
              esquerda: 'Procedimento',
              direita: 'Sub-rotina que executa uma ação sem devolver valor',
            },
            {
              id: 'local',
              esquerda: 'Variável local',
              direita: 'Existe só durante a chamada da sub-rotina',
            },
          ],
          explicacao:
            'Parâmetros entram, retorne devolve, procedimentos só agem, locais somem ao final.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado:
            'O que acontece com o quadro de uma função na pilha quando ela executa retorne?',
          alternativas: [
            { id: 'a', texto: 'É removido, e o programa continua de onde fez a chamada' },
            {
              id: 'b',
              texto: 'Fica guardado para a próxima chamada',
              feedback: 'Cada chamada cria um quadro novo; nada é guardado entre elas.',
            },
            {
              id: 'c',
              texto: 'O programa inteiro termina',
              feedback: 'retorne encerra só a função, não o programa.',
            },
          ],
          correta: 'a',
          explicacao:
            'O retorne devolve o valor, o quadro sai da pilha e a execução volta para quem chamou.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique a diferença entre uma função e um procedimento, com um exemplo de cada.',
          respostaModelo:
            'Uma função devolve um valor com retorne e pode ser usada numa conta ou num escreva, como area(4, 3) que devolve 12. Um procedimento só executa uma ação e não devolve nada, então é chamado numa linha sozinho, como um procedimento que desenha uma linha na tela.',
          rubrica: [
            'Disse que a função devolve um valor (retorne)',
            'Disse que o procedimento não devolve valor',
            'Deu um exemplo de cada',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Funções dão nome a um trecho de código: escreva uma vez, use muitas.',
        'Parâmetros levam valores para dentro; retorne traz o resultado para fora.',
        'Procedimentos executam uma ação sem devolver valor.',
        'Cada chamada ganha um quadro na pilha, com parâmetros e locais que somem ao retornar.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m02.a02.fc1',
          frente: 'O que faz o retorne?',
          verso: 'Devolve um valor para quem chamou e encerra a função.',
        },
        {
          id: 'logica.m02.a02.fc2',
          frente: 'Diferença entre função e procedimento?',
          verso: 'A função devolve um valor; o procedimento só executa uma ação.',
        },
        {
          id: 'logica.m02.a02.fc3',
          frente: 'O que é a pilha de chamadas?',
          verso:
            'A lista de sub-rotinas em execução; cada chamada empilha um quadro com seus parâmetros e locais.',
        },
        {
          id: 'logica.m02.a02.fc4',
          frente: 'Por que variáveis locais não conflitam entre funções?',
          verso: 'Porque cada uma só existe dentro do quadro da sua própria chamada (escopo).',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Linguagens de Programação: em JavaScript, function soma(a, b) { return a + b } é a mesma ideia.',
        'Engenharia de Software: funções pequenas com uma tarefa só são a base de código legível e testável.',
        'APIs: um endpoint é uma função que você chama pela rede, com parâmetros e uma resposta.',
      ],
      aplicacaoProfissional:
        'Scripts de suporte e automação crescem rápido. Separar "verificar_conexao()", "coletar_logs()" e "enviar_relatorio()" em funções deixa cada parte testável e reaproveitável em outros scripts.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
