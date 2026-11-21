import type { AulaEntrada } from '@/domain/conteudo';

export const aula02: AulaEntrada = {
  id: 'logica.m01.a02',
  versao: 1,
  status: 'publicada',
  titulo: 'Variáveis, constantes e tipos',
  objetivo:
    'Explicar o que é uma variável, usar a atribuição (<-), escolher o tipo certo para cada dado e prever o valor das variáveis depois de uma sequência de atribuições.',
  preRequisitos: ['logica.m01.a01'],
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
          enunciado: 'Depois das linhas `x <- 3` e `x <- 7`, quanto vale x?',
          alternativas: [
            { id: 'a', texto: '7' },
            {
              id: 'b',
              texto: '3',
              feedback: 'A segunda atribuição substitui a primeira: o 3 é descartado.',
            },
            {
              id: 'c',
              texto: '10',
              feedback: 'A atribuição não soma com o valor anterior: ela troca o conteúdo.',
            },
          ],
          correta: 'a',
          explicacao: 'Uma variável guarda um valor por vez. A última atribuição vence: x vale 7.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Variável é um lugar com nome para guardar um valor',
      texto:
        'Programas precisam lembrar coisas: a nota digitada, o preço do produto, o nome do cliente. Para isso usamos **variáveis**: espaços na memória com um nome.\n\nGuardar um valor numa variável se chama **atribuição** e, em Portugol, usa a seta `<-`. Lemos `idade <- 17` como "idade recebe 17".',
      porModo: {
        essencial:
          'Variável = nome + valor guardado na memória. `idade <- 17` guarda 17 em idade. Uma nova atribuição substitui o valor antigo.',
        guiado:
          'Pense em gavetas com etiqueta.\n1. A etiqueta é o nome da variável: `idade`.\n2. O que está dentro é o valor: `17`.\n3. `idade <- 18` tira o 17 e coloca 18 no lugar.\nPara usar o valor, o programa "abre a gaveta" pelo nome: `escreva(idade)` mostra 18.',
        tecnico:
          'Uma variável é um identificador associado a uma posição de memória que armazena um valor de um tipo. A atribuição `v <- expr` avalia `expr` e grava o resultado em `v`, descartando o valor anterior. Ler uma variável não altera seu conteúdo.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Gavetas com etiqueta',
      texto:
        'Cada variável é uma gaveta com uma etiqueta (o nome). Você pode olhar o que tem dentro quantas vezes quiser, e pode trocar o conteúdo — mas cada gaveta guarda uma coisa por vez.',
      limites:
        'Copiar um valor para outra variável (`b <- a`) não esvazia a gaveta de origem: "a" continua com o valor. E gavetas que guardam vários valores juntos (vetores) são assunto de um módulo futuro.',
    },
    {
      id: 'demo-troca',
      tipo: 'demo',
      titulo: 'Trocar o conteúdo de duas gavetas',
      instrucoes:
        'Este algoritmo troca os valores de `a` e `b`. Avance passo a passo e observe a gaveta `aux`.\n\nDepois, clique em **Editar código**, apague a linha `aux <- a`, troque a linha seguinte por `a <- b` e a última por `b <- a`. O que acontece com o 10?',
      simulacao: {
        tipo: 'visualizador',
        codigo: 'a <- 10\nb <- 20\naux <- a\na <- b\nb <- aux\nescreva("a = ", a, ", b = ", b)',
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Tipos de dados e declaração',
      texto:
        'Todo valor tem um **tipo**. Em Portugol usamos quatro:\n\n**inteiro:** números sem parte decimal (17, -3, 0).\n\n**real:** números com parte decimal (1.75, 9.5). No código, o separador decimal é o ponto.\n\n**caractere:** texto, sempre entre aspas ("Ana", "Mouse").\n\n**logico:** VERDADEIRO ou FALSO.\n\nNum programa completo, as variáveis são **declaradas** antes do `inicio`, na seção `var`: `idade: inteiro`. Assim o computador sabe que tipo de valor cada uma aceita — tentar guardar texto numa variável inteira é um erro.\n\n**Constantes** são valores que não devem mudar durante o programa, como uma taxa fixa. Muitas linguagens têm constantes de verdade (`const` em JavaScript, `final` em Java). No Portugol do VisuAlg não há palavra para isso: usamos uma variável com nome em maiúsculas, como `TAXA`, e combinamos de nunca reatribuí-la.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'O que acontece numa atribuição',
      nos: [
        { forma: 'inicio', texto: 'total <- preco * 2' },
        { forma: 'passo', texto: 'Calcula a expressão do lado direito (preco * 2)' },
        { forma: 'passo', texto: 'Guarda o resultado na variável do lado esquerdo (total)' },
        { forma: 'fim', texto: 'O valor antigo de total é descartado' },
      ],
      descricao:
        'Numa atribuição como total <- preco * 2, primeiro o computador calcula o lado direito, preco vezes 2. Depois guarda o resultado na variável do lado esquerdo, total. O valor que total tinha antes é descartado.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Preço com desconto',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'var\n  preco, desconto, final: real\n  nome: caractere\ninicio\n  nome <- "Mouse"\n  preco <- 80\n  desconto <- preco * 0.1\n  final <- preco - desconto\n  escreva(nome, " sai por ", final)\nfimalgoritmo',
      },
      comentarios: [
        { linha: 2, texto: 'Três variáveis do tipo real: valores em dinheiro podem ter centavos.' },
        { linha: 3, texto: 'O nome do produto é texto: tipo caractere.' },
        { linha: 7, texto: 'O desconto é calculado a partir de outra variável: 10% de 80 = 8.' },
        { linha: 8, texto: 'final recebe 80 - 8 = 72. preco continua valendo 80.' },
        { linha: 9, texto: 'escreva junta texto e valores: Mouse sai por 72.' },
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
            'Alguém tentou trocar os valores sem variável auxiliar. O que aparece na tela?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'a <- 1\nb <- 2\na <- b\nb <- a\nescreva(a, " ", b)',
          },
          respostasAceitas: ['2 2'],
          errosComuns: [
            {
              resposta: '2 1',
              feedback:
                'Na linha 3, "a" passou a valer 2 e o 1 se perdeu. Então a linha 4 copia 2 para "b". Por isso a troca precisa de uma gaveta auxiliar.',
            },
            {
              resposta: '1 2',
              feedback: 'As linhas 3 e 4 mudam os valores. Siga uma linha por vez.',
            },
          ],
          pistas: [
            'Anote os valores de a e b depois de CADA linha.',
            'Depois da linha 3, quanto vale a?',
          ],
          explicacao:
            'Linha 3: a recebe 2 (o 1 é perdido). Linha 4: b recebe a, que já é 2. Resultado: 2 2.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete a troca correta usando a variável auxiliar.',
          codigo: { linguagem: 'pseudocodigo', fonte: 'aux <- ___\na <- b\nb <- ___' },
          lacunas: [
            { aceitas: ['a'], feedback: 'Antes de sobrescrever "a", guarde o valor dele em aux.' },
            {
              aceitas: ['aux'],
              feedback: '"a" já foi sobrescrito; o valor antigo dele está em aux.',
            },
          ],
          pistas: ['Qual valor vai se perder na linha 2? Guarde-o antes.'],
          explicacao: 'aux guarda o valor de a; a recebe b; b recebe o valor guardado em aux.',
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
          tipo: 'associacao',
          enunciado: 'Associe cada dado ao tipo mais adequado.',
          pares: [
            { id: 'idade', esquerda: 'Idade em anos (17)', direita: 'inteiro' },
            { id: 'altura', esquerda: 'Altura em metros (1.75)', direita: 'real' },
            { id: 'nome', esquerda: 'Nome do cliente ("Ana")', direita: 'caractere' },
            { id: 'aprovado', esquerda: 'Se o aluno foi aprovado', direita: 'logico' },
          ],
          explicacao:
            'Idade é contada sem frações (inteiro); altura tem casas decimais (real); nome é texto (caractere); aprovado ou não é sim/não (logico).',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'identificar-erro',
          enunciado: 'Este algoritmo dá erro ao executar. Em qual linha está o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'var\n  idade: inteiro\ninicio\n  idade <- "dezoito"\n  escreva(idade)\nfimalgoritmo',
          },
          linhaErrada: 4,
          feedbackPorLinha: {
            '2': 'A declaração está certa: idade como inteiro faz sentido.',
            '5': 'escreva(idade) está correto. O problema acontece antes.',
          },
          explicacao:
            'idade foi declarada como inteiro, mas a linha 4 tenta guardar um texto. O certo seria idade <- 18.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: o caixa da loja',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Complete o programa: ele lê o preço de um produto e a quantidade comprada, e deve escrever só o valor total.',
          codigoInicial: 'leia(preco)\nleia(quantidade)\n',
          solucao: 'leia(preco)\nleia(quantidade)\ntotal <- preco * quantidade\nescreva(total)',
          casos: [
            { entradas: ['10', '3'], saidaEsperada: ['30'] },
            { entradas: ['2.5', '4'], saidaEsperada: ['10'] },
            { entradas: ['7', '1'], saidaEsperada: ['7'] },
          ],
          pistas: [
            'Crie uma variável total e guarde nela a multiplicação.',
            'Depois, escreva(total).',
          ],
          explicacao:
            'total <- preco * quantidade calcula o valor; escreva(total) mostra o resultado.',
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
          enunciado: 'O que a linha `x <- x + 1` faz?',
          alternativas: [
            { id: 'a', texto: 'Aumenta em 1 o valor guardado em x' },
            {
              id: 'b',
              texto: 'Nada: é uma equação impossível',
              feedback:
                'Em matemática seria. Em programação, <- é "recebe": calcula x + 1 e guarda em x.',
            },
            {
              id: 'c',
              texto: 'Cria uma segunda variável x',
              feedback: 'O nome x continua sendo a mesma gaveta; só o conteúdo muda.',
            },
          ],
          correta: 'a',
          explicacao:
            'O lado direito é calculado com o valor atual de x; o resultado substitui o valor antigo.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Qual tipo é o mais adequado para guardar se um pedido já foi pago?',
          alternativas: [
            { id: 'a', texto: 'logico' },
            {
              id: 'b',
              texto: 'caractere, com "sim" ou "não"',
              feedback:
                'Funcionaria, mas logico (VERDADEIRO/FALSO) pode ser usado direto numa condição e evita erros como "Sim" x "sim".',
            },
            { id: 'c', texto: 'real', feedback: 'real é para números com casas decimais.' },
          ],
          correta: 'a',
          explicacao: 'Pago ou não pago tem só dois valores possíveis: é exatamente o tipo logico.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado:
            'Explique a diferença entre a variável e o valor guardado nela, e o que acontece numa nova atribuição.',
          respostaModelo:
            'A variável é o nome (a etiqueta da gaveta); o valor é o conteúdo guardado. Quando fazemos uma nova atribuição, como idade <- 18, o valor antigo é descartado e substituído pelo novo. O nome continua o mesmo.',
          rubrica: [
            'Diferenciou o nome (variável) do conteúdo (valor)',
            'Disse que a nova atribuição substitui o valor antigo',
            'Usou um exemplo',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Variável é um nome para um espaço da memória que guarda um valor.',
        'A atribuição `<-` calcula o lado direito e guarda no lado esquerdo, descartando o valor antigo.',
        'Tipos: inteiro, real, caractere (texto entre aspas) e logico (VERDADEIRO/FALSO).',
        'Para trocar dois valores, use uma variável auxiliar.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m01.a02.fc1',
          frente: 'O que é uma variável?',
          verso: 'Um nome associado a um espaço da memória que guarda um valor.',
        },
        {
          id: 'logica.m01.a02.fc2',
          frente: 'Como se lê `idade <- 17`?',
          verso: '"idade recebe 17": o valor 17 é guardado na variável idade.',
        },
        {
          id: 'logica.m01.a02.fc3',
          frente: 'Quais são os quatro tipos básicos do Portugol?',
          verso: 'inteiro, real, caractere e logico.',
        },
        {
          id: 'logica.m01.a02.fc4',
          frente: 'Por que a troca de valores precisa de uma variável auxiliar?',
          verso:
            'Porque a primeira atribuição sobrescreve um dos valores; a auxiliar guarda ele antes.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Banco de Dados: cada coluna de uma tabela também tem um tipo (INTEGER, DECIMAL, VARCHAR, BOOLEAN).',
        'Linguagens de Programação: em JavaScript, `let` cria variáveis e `const` cria constantes.',
        'Cibersegurança: validar o tipo dos dados recebidos evita muitos ataques e falhas.',
      ],
      aplicacaoProfissional:
        'Num sistema de chamados, cada campo é uma variável com tipo: número do chamado (inteiro), descrição (texto), aberto ou fechado (lógico). Escolher o tipo errado gera bugs — como um telefone salvo como número que perde o zero da frente.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
