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
  {
    id: 'vetor',
    termo: 'Vetor',
    simples: 'Uma variável que guarda vários valores do mesmo tipo, um em cada posição numerada.',
    tecnico:
      'Estrutura homogênea de tamanho fixo cujos elementos são acessados por índice em tempo constante (array unidimensional).',
    aulas: ['logica.m02.a01'],
  },
  {
    id: 'indice',
    termo: 'Índice',
    simples: 'O número da posição de um elemento dentro do vetor.',
    tecnico:
      'Expressão inteira usada para acessar um elemento de um vetor; deve estar dentro dos limites declarados.',
    aulas: ['logica.m02.a01'],
  },
  {
    id: 'funcao',
    termo: 'Função',
    simples: 'Um pedaço de código com nome que recebe valores e devolve um resultado.',
    tecnico:
      'Sub-rotina com parâmetros tipados e tipo de retorno, que devolve um valor com retorne.',
    aulas: ['logica.m02.a02'],
  },
  {
    id: 'procedimento',
    termo: 'Procedimento',
    simples: 'Um pedaço de código com nome que executa uma ação, sem devolver resultado.',
    tecnico: 'Sub-rotina sem valor de retorno, chamada como comando isolado.',
    aulas: ['logica.m02.a02'],
  },
  {
    id: 'parametro',
    termo: 'Parâmetro',
    simples: 'Valor que você entrega para uma função quando a chama.',
    tecnico:
      'Variável declarada na assinatura da sub-rotina que recebe, por valor, o argumento passado na chamada.',
    aulas: ['logica.m02.a02'],
  },
  {
    id: 'retorno',
    termo: 'Retorno',
    simples: 'O resultado que a função devolve para quem a chamou.',
    tecnico:
      'Valor produzido por retorne, que encerra a função e substitui a chamada na expressão de origem.',
    aulas: ['logica.m02.a02'],
  },
  {
    id: 'escopo',
    termo: 'Escopo',
    simples: 'O trecho do programa onde uma variável existe e pode ser usada.',
    tecnico:
      'Região de visibilidade de um identificador; variáveis locais e parâmetros existem apenas durante a ativação da sub-rotina.',
    aulas: ['logica.m02.a02'],
  },
  {
    id: 'pilha-de-chamadas',
    termo: 'Pilha de chamadas',
    simples: 'A lista das funções que estão em execução, uma em cima da outra.',
    tecnico:
      'Estrutura LIFO de quadros de ativação; cada chamada empilha um quadro com parâmetros e locais, removido ao retornar.',
    aulas: ['logica.m02.a02', 'logica.m02.a05'],
  },
  {
    id: 'busca-linear',
    termo: 'Busca linear',
    simples: 'Procurar um valor olhando posição por posição, do começo ao fim.',
    tecnico: 'Busca sequencial O(n), sem pré-condição sobre a ordem dos elementos.',
    aulas: ['logica.m02.a03'],
  },
  {
    id: 'busca-binaria',
    termo: 'Busca binária',
    simples: 'Procurar num vetor ordenado olhando o meio e descartando metade a cada passo.',
    tecnico:
      'Busca O(log n) em vetor ordenado que reduz o intervalo [esq, dir] pela metade a cada comparação com o elemento central.',
    aulas: ['logica.m02.a03'],
  },
  {
    id: 'ordenacao',
    termo: 'Ordenação',
    simples: 'Reorganizar os elementos em ordem, do menor para o maior ou o contrário.',
    tecnico:
      'Permutação dos elementos segundo uma relação de ordem; algoritmos simples (bolha, seleção, inserção) são O(n²).',
    aulas: ['logica.m02.a04'],
  },
  {
    id: 'recursao',
    termo: 'Recursão',
    simples: 'Quando uma função resolve um problema chamando a si mesma com uma versão menor dele.',
    tecnico:
      'Técnica em que uma sub-rotina se invoca direta ou indiretamente, com casos recursivos que convergem para um caso base.',
    aulas: ['logica.m02.a05'],
  },
  {
    id: 'caso-base',
    termo: 'Caso base',
    simples:
      'A situação mais simples, em que a função recursiva responde direto e para de se chamar.',
    tecnico: 'Ramo não recursivo de uma definição recursiva, que garante a terminação.',
    aulas: ['logica.m02.a05'],
  },
  {
    id: 'bit',
    termo: 'Bit',
    simples: 'A menor informação do computador: um 0 ou um 1.',
    tecnico: 'Unidade mínima de informação, com dois estados possíveis.',
    aulas: ['fundamentos.m01.a01'],
  },
  {
    id: 'byte',
    termo: 'Byte',
    simples: 'Um grupo de 8 bits. Guarda, por exemplo, um número de 0 a 255.',
    tecnico: 'Conjunto de 8 bits; unidade básica de endereçamento da memória.',
    aulas: ['fundamentos.m01.a01'],
  },
  {
    id: 'binario',
    termo: 'Binário',
    simples: 'Jeito de escrever números usando só 0 e 1.',
    tecnico:
      'Sistema de numeração posicional de base 2, em que cada posição vale uma potência de 2.',
    aulas: ['fundamentos.m01.a01'],
  },
  {
    id: 'estouro',
    termo: 'Estouro (overflow)',
    simples: 'Quando uma conta dá um resultado que não cabe nos bits disponíveis.',
    tecnico:
      'Condição em que o resultado de uma operação excede a faixa representável; o excedente é descartado.',
    aulas: ['fundamentos.m01.a01', 'fundamentos.m01.a04'],
  },
  {
    id: 'hexadecimal',
    termo: 'Hexadecimal',
    simples: 'Jeito de escrever números com 16 símbolos (0–9 e A–F). Cada dígito vale 4 bits.',
    tecnico:
      'Sistema de base 16; cada dígito representa um nibble, então um byte são dois dígitos.',
    aulas: ['fundamentos.m01.a02'],
  },
  {
    id: 'unicode',
    termo: 'Unicode e UTF-8',
    simples:
      'A tabela que dá um número a cada letra e símbolo, e a forma de gravar esses números em bytes.',
    tecnico: 'Padrão que associa code points aos caracteres; UTF-8 os codifica em 1 a 4 bytes.',
    aulas: ['fundamentos.m01.a02'],
  },
  {
    id: 'porta-logica',
    termo: 'Porta lógica',
    simples:
      'Circuito que recebe bits e devolve um bit, seguindo uma regra fixa (AND, OR, NOT...).',
    tecnico: 'Circuito que implementa uma função booleana; blocos básicos dos processadores.',
    aulas: ['fundamentos.m01.a03'],
  },
  {
    id: 'tabela-verdade',
    termo: 'Tabela-verdade',
    simples: 'Lista de todas as entradas possíveis de uma porta ou condição e a saída de cada uma.',
    tecnico: 'Representação tabular de uma função booleana com todas as combinações de entradas.',
    aulas: ['fundamentos.m01.a03'],
  },
  {
    id: 'cpu',
    termo: 'CPU (processador)',
    simples: 'O "cérebro" do computador: executa as instruções dos programas.',
    tecnico:
      'Unidade central de processamento: busca, decodifica e executa instruções, com unidade de controle, ALU e registradores.',
    aulas: ['fundamentos.m01.a04'],
  },
  {
    id: 'registrador',
    termo: 'Registrador',
    simples: 'Uma posição minúscula e rapidíssima dentro da CPU para guardar valores em uso.',
    tecnico: 'Elemento de armazenamento interno da CPU, de acesso muito mais rápido que a memória.',
    aulas: ['fundamentos.m01.a04'],
  },
  {
    id: 'memoria-ram',
    termo: 'Memória RAM',
    simples: 'A memória de trabalho do computador, onde ficam os programas e dados em uso.',
    tecnico:
      'Memória volátil de acesso aleatório, endereçada por byte, usada para instruções e dados em execução.',
    aulas: ['fundamentos.m01.a04'],
  },
  {
    id: 'contador-programa',
    termo: 'Contador de programa (PC)',
    simples: 'O registrador que guarda o endereço da próxima instrução.',
    tecnico: 'Registrador que armazena o endereço da próxima instrução; é alterado por desvios.',
    aulas: ['fundamentos.m01.a04'],
  },
  {
    id: 'ciclo-instrucao',
    termo: 'Ciclo de instrução',
    simples: 'A rotina da CPU: buscar, decodificar e executar, de novo e de novo.',
    tecnico: 'Ciclo fetch–decode–execute repetido pela unidade de controle.',
    aulas: ['fundamentos.m01.a04'],
  },
  {
    id: 'terminal',
    termo: 'Terminal',
    simples: 'Tela em que você controla o computador digitando comandos.',
    tecnico: 'Interface de linha de comando que executa um shell para interpretar comandos.',
    aulas: ['fundamentos.m01.a05'],
  },
  {
    id: 'caminho',
    termo: 'Caminho (path)',
    simples: 'O endereço de um arquivo na árvore de pastas, como /home/aluno/notas.txt.',
    tecnico:
      'Sequência de diretórios, separados por barras, que localiza um arquivo; pode ser absoluto ou relativo.',
    aulas: ['fundamentos.m01.a05'],
  },
];
