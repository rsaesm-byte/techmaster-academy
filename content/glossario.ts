import type { TermoEntrada } from '@/domain/glossario';

/** Glossário da trilha de Lógica. Cada termo aponta para as aulas onde aparece. */
export const glossario: TermoEntrada[] = [
  {
    id: 'algoritmo',
    termo: 'Algoritmo',
    simples: 'Uma sequência de passos, em ordem, que resolve um problema.',
    tecnico:
      'Sequência finita de instruções bem definidas que, a partir de zero ou mais entradas, produz uma ou mais saídas.',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'pensamento-computacional',
    termo: 'Pensamento computacional',
    simples:
      'Jeito de resolver problemas dividindo em partes, achando padrões e escrevendo passos claros.',
    tecnico:
      'Conjunto de práticas — decomposição, reconhecimento de padrões, abstração e projeto de algoritmos — para formular problemas de forma que possam ser resolvidos por computadores.',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'decomposicao',
    termo: 'Decomposição',
    simples: 'Quebrar um problema grande em problemas menores.',
    tecnico:
      'Técnica de dividir um problema em subproblemas mais simples, resolvidos de forma independente e depois combinados.',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'abstracao',
    termo: 'Abstração',
    simples: 'Ignorar os detalhes que não importam para o problema.',
    tecnico:
      'Representar apenas as características relevantes de algo, ocultando detalhes desnecessários para o objetivo.',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'entrada-saida',
    termo: 'Entrada e saída',
    simples: 'Entrada é o que o algoritmo recebe; saída é o resultado que ele produz.',
    tecnico:
      'Dados fornecidos ao algoritmo (entrada, ex.: leia) e dados produzidos por ele (saída, ex.: escreva).',
    exemplo: 'leia(nota1)\nescreva("Média: ", media)',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'pseudocodigo',
    termo: 'Pseudocódigo (Portugol)',
    simples:
      'Um jeito de escrever algoritmos em português, parecido com uma linguagem de programação.',
    tecnico:
      'Notação informal de algoritmos, independente de linguagem. O Portugol é um pseudocódigo em português usado no ensino (como no VisuAlg).',
    aulas: ['logica.m01.a01'],
  },
  {
    id: 'variavel',
    termo: 'Variável',
    simples: 'Um nome para um espaço na memória onde guardamos um valor.',
    tecnico:
      'Identificador associado a uma posição de memória que armazena um valor de um tipo, podendo ser alterado durante a execução.',
    exemplo: 'idade <- 17',
    aulas: ['logica.m01.a02'],
  },
  {
    id: 'atribuicao',
    termo: 'Atribuição',
    simples: 'Guardar um valor numa variável. Em Portugol, usa a seta <-.',
    tecnico:
      'Operação que avalia a expressão à direita e armazena o resultado na variável à esquerda, substituindo o valor anterior.',
    exemplo: 'total <- preco * quantidade',
    aulas: ['logica.m01.a02'],
  },
  {
    id: 'tipo-de-dado',
    termo: 'Tipo de dado',
    simples:
      'O tipo de valor que uma variável guarda: número inteiro, número com vírgula, texto ou verdadeiro/falso.',
    tecnico:
      'Classificação que define o conjunto de valores possíveis e as operações válidas. Em Portugol: inteiro, real, caractere e logico.',
    aulas: ['logica.m01.a02'],
  },
  {
    id: 'constante',
    termo: 'Constante',
    simples: 'Um valor que não muda durante o programa, como uma taxa fixa.',
    tecnico:
      'Identificador cujo valor é definido uma vez e não pode (ou não deve) ser reatribuído. Ex.: const em JavaScript, final em Java.',
    aulas: ['logica.m01.a02'],
  },
  {
    id: 'operador',
    termo: 'Operador',
    simples: 'Símbolo que faz uma conta ou uma comparação, como + ou >=.',
    tecnico:
      'Símbolo que aplica uma operação a operandos: aritméticos (+ - * / %), relacionais (= <> < > <= >=) e lógicos (e, ou, nao).',
    aulas: ['logica.m01.a03'],
  },
  {
    id: 'expressao',
    termo: 'Expressão',
    simples: 'Uma combinação de valores, variáveis e operadores que dá um resultado.',
    tecnico:
      'Construção avaliada para produzir um valor, segundo regras de precedência e associatividade.',
    exemplo: '(nota1 + nota2) / 2',
    aulas: ['logica.m01.a03'],
  },
  {
    id: 'precedencia',
    termo: 'Precedência',
    simples: 'A ordem em que as operações são feitas: multiplicação antes de soma, por exemplo.',
    tecnico:
      'Regra que define quais operadores são avaliados primeiro numa expressão sem parênteses.',
    exemplo: '2 + 3 * 4   // 14, não 20',
    aulas: ['logica.m01.a03'],
  },
  {
    id: 'resto',
    termo: 'Resto da divisão (%)',
    simples: 'O que sobra quando um número não divide o outro exatamente. 17 % 5 = 2.',
    tecnico:
      'Operador módulo: resultado de a − b × ⌊a/b⌋ para inteiros positivos. Útil para testar paridade (n % 2 = 0).',
    exemplo: 'ehPar <- n % 2 = 0',
    aulas: ['logica.m01.a03'],
  },
  {
    id: 'valor-logico',
    termo: 'Valor lógico',
    simples: 'VERDADEIRO ou FALSO. É o resultado de uma comparação.',
    tecnico: 'Valor booleano. Resultado de expressões relacionais e operando de e, ou e nao.',
    aulas: ['logica.m01.a02', 'logica.m01.a03'],
  },
  {
    id: 'condicional',
    termo: 'Estrutura condicional',
    simples: 'Instrução que escolhe o que fazer conforme uma condição: se... senão...',
    tecnico:
      'Estrutura de controle que desvia o fluxo de execução conforme o valor de uma expressão lógica (se/entao/senao).',
    exemplo: 'se media >= 7 entao\n  escreva("Aprovado")\nsenao\n  escreva("Reprovado")\nfimse',
    aulas: ['logica.m01.a04'],
  },
  {
    id: 'condicao-composta',
    termo: 'Condição composta',
    simples: 'Duas ou mais condições juntas com "e" ou "ou".',
    tecnico:
      'Expressão lógica que combina comparações com operadores lógicos; "e" exige todas verdadeiras, "ou" ao menos uma.',
    exemplo: 'idade >= 18 e temIngresso',
    aulas: ['logica.m01.a04'],
  },
  {
    id: 'laco',
    termo: 'Laço (estrutura de repetição)',
    simples: 'Instrução que repete um bloco de código várias vezes.',
    tecnico:
      'Estrutura de controle que executa um bloco repetidamente enquanto uma condição se mantém: enquanto, para, repita.',
    aulas: ['logica.m01.a05'],
  },
  {
    id: 'iteracao',
    termo: 'Iteração',
    simples: 'Cada vez que o bloco de um laço executa — uma "volta".',
    tecnico: 'Uma execução completa do corpo de uma estrutura de repetição.',
    aulas: ['logica.m01.a05'],
  },
  {
    id: 'contador',
    termo: 'Contador',
    simples: 'Variável que conta quantas vezes algo aconteceu.',
    tecnico:
      'Variável incrementada (ou decrementada) por um valor fixo a cada iteração, geralmente usada na condição de parada.',
    exemplo: 'c <- c + 1',
    aulas: ['logica.m01.a05'],
  },
  {
    id: 'acumulador',
    termo: 'Acumulador',
    simples: 'Variável que vai juntando valores, como uma soma que cresce a cada volta.',
    tecnico:
      'Variável que agrega valores ao longo das iterações; deve ser inicializada com o elemento neutro da operação (0 para soma, 1 para produto).',
    exemplo: 'soma <- soma + i',
    aulas: ['logica.m01.a05'],
  },
  {
    id: 'laco-infinito',
    termo: 'Laço infinito',
    simples: 'Repetição que nunca termina porque a condição de parada nunca muda.',
    tecnico:
      'Laço cuja condição de continuação permanece sempre verdadeira, geralmente porque o corpo não altera o estado avaliado.',
    aulas: ['logica.m01.a01', 'logica.m01.a05'],
  },
];
