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
  {
    id: 'sistema-operacional',
    termo: 'Sistema operacional',
    simples:
      'O programa que gerencia CPU, memória, arquivos e dispositivos para os outros programas.',
    tecnico:
      'Software de sistema que abstrai o hardware e gerencia processos, memória, arquivos e E/S.',
    aulas: ['fundamentos.m02.a01'],
  },
  {
    id: 'processo',
    termo: 'Processo',
    simples: 'Um programa em execução.',
    tecnico:
      'Instância de um programa em execução, com espaço de memória, estado e contexto próprios.',
    aulas: ['fundamentos.m02.a01'],
  },
  {
    id: 'escalonador',
    termo: 'Escalonador',
    simples: 'A parte do sistema que decide qual processo usa a CPU em cada momento.',
    tecnico:
      'Componente do kernel que seleciona o próximo processo pronto, segundo uma política (FIFO, Round Robin...).',
    aulas: ['fundamentos.m02.a01'],
  },
  {
    id: 'permissao',
    termo: 'Permissão de arquivo',
    simples: 'Regra que diz quem pode ler, alterar ou executar um arquivo.',
    tecnico: 'Controle de acesso por dono, grupo e outros, com bits r, w e x (octal: 4, 2 e 1).',
    aulas: ['fundamentos.m02.a02'],
  },
  {
    id: 'ip',
    termo: 'Endereço IP',
    simples: 'O endereço de um equipamento numa rede, como 192.168.1.10.',
    tecnico: 'Identificador de 32 bits (IPv4) ou 128 bits (IPv6) de uma interface de rede.',
    aulas: ['fundamentos.m02.a03'],
  },
  {
    id: 'mascara-sub-rede',
    termo: 'Máscara de sub-rede (CIDR)',
    simples: 'Indica quanto do endereço IP identifica a rede, como /24.',
    tecnico:
      'Máscara de bits cujos 1 marcam a parte de rede; a notação /n indica quantos bits são de rede.',
    aulas: ['fundamentos.m02.a03'],
  },
  {
    id: 'dns',
    termo: 'DNS',
    simples: 'A "lista telefônica" da internet: traduz nomes de sites em endereços IP.',
    tecnico:
      'Sistema distribuído de nomes que mapeia domínios a registros (A, AAAA, CNAME...), com cache por TTL.',
    aulas: ['fundamentos.m02.a04'],
  },
  {
    id: 'http',
    termo: 'HTTP e HTTPS',
    simples: 'O "idioma" dos pedidos e respostas na web; HTTPS é a versão criptografada.',
    tecnico: 'Protocolo de pedido e resposta da web; HTTPS o transporta sobre TLS.',
    aulas: ['fundamentos.m02.a04'],
  },
  {
    id: 'entropia',
    termo: 'Entropia de senha',
    simples: 'Medida, em bits, de quantos palpites seriam necessários para acertar uma senha.',
    tecnico: 'Para senhas aleatórias, H = L·log2(N) bits; cada bit dobra o espaço de busca.',
    aulas: ['fundamentos.m02.a05'],
  },
  {
    id: '2fa',
    termo: 'Verificação em duas etapas (2FA)',
    simples: 'Uma segunda barreira, além da senha, para entrar numa conta.',
    tecnico: 'Autenticação que exige dois fatores distintos (algo que se sabe, se tem ou se é).',
    aulas: ['fundamentos.m02.a05'],
  },
  {
    id: 'unidades-dados',
    termo: 'KB, MB, GB e TB',
    simples: 'Unidades de tamanho de dados: cada uma vale cerca de mil vezes a anterior.',
    tecnico: 'Múltiplos do byte: base 1000 (SI) ou base 1024 (KiB, MiB, GiB).',
    aulas: ['fundamentos.m03.a01'],
  },
  {
    id: 'cache',
    termo: 'Cache',
    simples: 'Memória pequena e rápida que guarda cópias do que foi usado há pouco.',
    tecnico:
      'Memória intermediária que explora a localidade para reduzir a latência de acesso aos níveis mais lentos.',
    aulas: ['fundamentos.m03.a02'],
  },
  {
    id: 'lru',
    termo: 'LRU',
    simples: 'Regra que remove da cache o item usado há mais tempo.',
    tecnico: 'Política de substituição Least Recently Used.',
    aulas: ['fundamentos.m03.a02'],
  },
  {
    id: 'raid',
    termo: 'RAID',
    simples: 'Junção de vários discos para ganhar velocidade, proteção ou os dois.',
    tecnico:
      'Conjunto redundante de discos independentes: striping (0), espelhamento (1), paridade (5).',
    aulas: ['fundamentos.m03.a03'],
  },
  {
    id: 'backup',
    termo: 'Backup (regra 3-2-1)',
    simples: 'Cópia separada dos dados: 3 cópias, em 2 tipos de mídia, com 1 fora do local.',
    tecnico:
      'Cópia de dados em outro momento e local, que permite restaurar após perda, erro ou ataque.',
    aulas: ['fundamentos.m03.a03'],
  },
  {
    id: 'compressao',
    termo: 'Compressão',
    simples: 'Guardar a mesma informação em menos espaço, aproveitando repetições.',
    tecnico:
      'Redução de redundância para diminuir o tamanho dos dados, sem perdas (ZIP) ou com perdas (JPEG).',
    aulas: ['fundamentos.m03.a04'],
  },
  {
    id: 'criptografia',
    termo: 'Criptografia',
    simples: 'Embaralhar uma mensagem com uma chave, para que só quem a tem consiga ler.',
    tecnico:
      'Conjunto de técnicas que protegem a confidencialidade e a integridade dos dados por meio de chaves.',
    aulas: ['fundamentos.m03.a05'],
  },
  {
    id: 'forca-bruta',
    termo: 'Força bruta',
    simples: 'Testar todas as chaves ou senhas possíveis até acertar.',
    tecnico: 'Ataque exaustivo sobre o espaço de chaves; inviável quando a entropia é alta.',
    aulas: ['fundamentos.m03.a05'],
  },
  {
    id: 'comparacao-estrita',
    termo: 'Comparação estrita (===)',
    simples: 'Comparar valor e tipo ao mesmo tempo, sem conversões escondidas.',
    tecnico:
      'Operador que devolve true só se os valores e os tipos forem iguais; evita a coerção do ==.',
    aulas: ['javascript.m01.a02'],
  },
  {
    id: 'template-string',
    termo: 'Template string',
    simples: 'Texto entre crases que aceita variáveis dentro de ${}.',
    tecnico: 'Literal de string delimitado por crases que permite interpolar expressões com ${}.',
    aulas: ['javascript.m01.a01'],
  },
  {
    id: 'array',
    termo: 'Array',
    simples: 'Lista ordenada de valores, com posições numeradas a partir do zero.',
    tecnico:
      'Estrutura indexada que guarda elementos em sequência; tem length e métodos como push, map e filter.',
    aulas: ['javascript.m01.a03'],
  },
  {
    id: 'arrow-function',
    termo: 'Arrow function',
    simples: 'Jeito curto de escrever uma função: (n) => n * 2.',
    tecnico:
      'Sintaxe compacta de função que devolve a expressão sem precisar de return quando não usa chaves.',
    aulas: ['javascript.m01.a04'],
  },
  {
    id: 'objeto',
    termo: 'Objeto',
    simples: 'Conjunto de dados relacionados, guardados com nomes.',
    tecnico:
      'Estrutura de pares chave-valor acessada por ponto ou colchetes; é a base do formato JSON.',
    aulas: ['javascript.m01.a05'],
  },
  {
    id: 'map-filter-reduce',
    termo: 'map, filter e reduce',
    simples: 'Três métodos para transformar, selecionar e resumir listas.',
    tecnico:
      'Métodos de array que recebem um callback e devolvem um novo valor sem alterar o original.',
    aulas: ['javascript.m01.a05'],
  },
  {
    id: 'let-const',
    termo: 'let e const',
    simples: 'let cria variável que muda; const cria uma que não é reatribuída.',
    tecnico:
      'Declarações de escopo de bloco; const impede reatribuição, mas não torna o conteúdo imutável.',
    aulas: ['javascript.m01.a01'],
  },
  {
    id: 'hipervisor',
    termo: 'Hipervisor',
    simples: 'Software que divide um computador físico em várias máquinas virtuais.',
    tecnico:
      'Camada que cria e gerencia VMs, repartindo CPU, memória e dispositivos com isolamento.',
    aulas: ['fundamentos.m04.a01'],
  },
  {
    id: 'conteiner',
    termo: 'Contêiner',
    simples: 'Programa empacotado com tudo que precisa, rodando isolado e leve.',
    tecnico: 'Processo isolado por namespaces e cgroups que compartilha o kernel do host.',
    aulas: ['fundamentos.m04.a02'],
  },
  {
    id: 'nuvem',
    termo: 'Computação em nuvem',
    simples: 'Alugar computadores e serviços de outra empresa pela internet.',
    tecnico:
      'Entrega de recursos sob demanda (IaaS, PaaS, SaaS) com cobrança por uso e elasticidade.',
    aulas: ['fundamentos.m04.a03'],
  },
  {
    id: 'commit',
    termo: 'Commit',
    simples: 'Um ponto salvo do histórico do projeto, com uma mensagem.',
    tecnico: 'Registro identificado por hash que guarda o estado dos arquivos no repositório Git.',
    aulas: ['fundamentos.m04.a04'],
  },
  {
    id: 'sql',
    termo: 'SQL',
    simples: 'Linguagem para consultar e alterar dados em bancos relacionais.',
    tecnico: 'Linguagem declarativa com comandos como SELECT, WHERE, INSERT, UPDATE e DELETE.',
    aulas: ['fundamentos.m04.a05'],
  },
  {
    id: 'json',
    termo: 'JSON',
    simples: 'Formato de texto para representar dados, usado em quase toda API.',
    tecnico:
      'Notação de objetos, arrays, textos, números e booleanos com chaves entre aspas duplas.',
    aulas: ['javascript.m02.a01'],
  },
  {
    id: 'promise',
    termo: 'Promise',
    simples: 'Um resultado que vai chegar no futuro.',
    tecnico: 'Objeto que representa a conclusão ou falha de uma operação assíncrona.',
    aulas: ['javascript.m02.a05'],
  },
  {
    id: 'dom',
    termo: 'DOM',
    simples: 'A árvore de elementos da página que o JavaScript pode alterar.',
    tecnico: 'Representação em objetos do documento HTML, criada pelo navegador.',
    aulas: ['javascript.m02.a03'],
  },
  {
    id: 'f-string',
    termo: 'f-string',
    simples: 'Texto do Python com f na frente que aceita variáveis entre chaves.',
    tecnico: 'Literal de string formatada: f"Olá, {nome}" interpola expressões.',
    aulas: ['python.m01.a01'],
  },
  {
    id: 'dicionario',
    termo: 'Dicionário',
    simples: 'Estrutura do Python que guarda pares de chave e valor.',
    tecnico: 'Mapa hash com chaves únicas, acessado por d[chave]; base do JSON.',
    aulas: ['python.m01.a05'],
  },
  {
    id: 'funcao-pura',
    termo: 'Função pura',
    simples:
      'Função que, com a mesma entrada, sempre devolve a mesma saída e não mexe em nada fora dela.',
    tecnico: 'Função sem efeitos colaterais, determinística; base de código previsível e testável.',
    aulas: ['javascript.m03.a01'],
  },
  {
    id: 'local-storage',
    termo: 'localStorage',
    simples: 'Gaveta do navegador que guarda textos e os mantém depois de recarregar a página.',
    tecnico:
      'Armazenamento chave-valor síncrono por origem, de cerca de 5 MB, que só aceita strings.',
    aulas: ['javascript.m03.a03'],
  },
  {
    id: 'api',
    termo: 'API',
    simples: 'Endereço que recebe pedidos e devolve dados para outros programas.',
    tecnico:
      'Interface de comunicação entre sistemas; em web, normalmente HTTP com respostas em JSON.',
    aulas: ['javascript.m03.a04'],
  },
  {
    id: 'teste-automatizado',
    termo: 'Teste automatizado',
    simples: 'Código que confere sozinho se outra parte do código dá o resultado esperado.',
    tecnico:
      'Verificação repetível de entradas e saídas, executada localmente e na integração contínua.',
    aulas: ['javascript.m03.a05'],
  },
  {
    id: 'select',
    termo: 'SELECT',
    simples: 'Comando do SQL que escolhe quais colunas ler de uma tabela.',
    tecnico: 'Cláusula de projeção de uma consulta; só lê, nunca altera os dados.',
    aulas: ['sql.m01.a01'],
  },
  {
    id: 'where',
    termo: 'WHERE',
    simples: 'Parte da consulta que filtra quais linhas entram no resultado.',
    tecnico: 'Cláusula de seleção de linhas por condições com AND, OR, comparações e LIKE.',
    aulas: ['sql.m01.a02'],
  },
  {
    id: 'group-by',
    termo: 'GROUP BY',
    simples: 'Agrupa linhas iguais para resumi-las, como contar ou somar por grupo.',
    tecnico: 'Cláusula usada com funções de agregação (COUNT, SUM, AVG, MIN, MAX).',
    aulas: ['sql.m01.a04'],
  },
  {
    id: 'join',
    termo: 'JOIN',
    simples: 'Combina linhas de duas tabelas que se relacionam.',
    tecnico: 'Junção por condição ON, geralmente entre chave estrangeira e chave primária.',
    aulas: ['sql.m01.a05'],
  },
  {
    id: 'chave-estrangeira',
    termo: 'Chave estrangeira',
    simples: 'Coluna que aponta para a chave primária de outra tabela.',
    tecnico: 'Restrição de integridade referencial entre tabelas relacionadas.',
    aulas: ['sql.m01.a05'],
  },
  {
    id: 'null-sql',
    termo: 'NULL',
    simples: 'Marca de valor ausente ou desconhecido em uma coluna.',
    tecnico: 'Não é igual a nada, nem a outro NULL; usa-se IS NULL e IS NOT NULL para testar.',
    aulas: ['sql.m02.a01'],
  },
  {
    id: 'having',
    termo: 'HAVING',
    simples: 'Filtra grupos depois do GROUP BY, usando COUNT, SUM ou AVG.',
    tecnico: 'Executa depois do agrupamento; o WHERE age antes, sobre linhas individuais.',
    aulas: ['sql.m02.a02'],
  },
  {
    id: 'left-join',
    termo: 'LEFT JOIN',
    simples: 'Junção que mantém todas as linhas da tabela da esquerda, mesmo sem par.',
    tecnico: 'Colunas da tabela da direita vêm NULL quando não há correspondência.',
    aulas: ['sql.m02.a03'],
  },
  {
    id: 'insert-update',
    termo: 'INSERT e UPDATE',
    simples: 'INSERT cria linhas novas; UPDATE altera linhas que já existem.',
    tecnico: 'O WHERE do UPDATE escolhe as linhas afetadas; sem ele, todas mudam.',
    aulas: ['sql.m02.a04'],
  },
  {
    id: 'delete-sql',
    termo: 'DELETE',
    simples: 'Remove linhas de uma tabela; sem WHERE, remove todas.',
    tecnico:
      'Confira com SELECT antes, use transação e backup; exclusão lógica preserva histórico.',
    aulas: ['sql.m02.a05'],
  },
  {
    id: 'tupla',
    termo: 'Tupla',
    simples: 'Sequência de valores que não pode ser alterada depois de criada.',
    tecnico:
      'Em Python, (1, 2); imutável, permite desempacotamento e pode ser chave de dicionário.',
    aulas: ['python.m02.a02'],
  },
  {
    id: 'conjunto',
    termo: 'Conjunto (set)',
    simples: 'Coleção de valores únicos, sem posição fixa.',
    tecnico:
      'Usa tabela hash; oferece união, interseção e diferença, e testa pertencimento rapidamente.',
    aulas: ['python.m02.a02'],
  },
  {
    id: 'excecao',
    termo: 'Exceção',
    simples: 'Erro que ocorre durante a execução e pode ser tratado pelo programa.',
    tecnico: 'Em Python, tratada com try/except/else/finally e lançada com raise.',
    aulas: ['python.m02.a04'],
  },
  {
    id: 'pip',
    termo: 'pip',
    simples: 'Instalador de bibliotecas do Python.',
    tecnico: 'Baixa pacotes do PyPI; o requirements.txt registra as versões do projeto.',
    aulas: ['python.m02.a05'],
  },
  {
    id: 'ambiente-virtual',
    termo: 'Ambiente virtual',
    simples: 'Pasta isolada com as bibliotecas de um projeto.',
    tecnico: 'Criado com python -m venv; evita conflitos entre versões de projetos diferentes.',
    aulas: ['python.m02.a05'],
  },
  {
    id: 'encapsulamento',
    termo: 'Encapsulamento',
    simples: 'Cada camada da rede acrescenta seu cabeçalho aos dados ao enviar.',
    tecnico: 'No destino os cabeçalhos são removidos em ordem inversa (desencapsulamento).',
    aulas: ['redes.m01.a01'],
  },
  {
    id: 'tabela-de-rotas',
    termo: 'Tabela de rotas',
    simples: 'Lista que diz ao roteador para qual vizinho enviar cada destino.',
    tecnico: 'Vence a rota de maior prefixo; 0.0.0.0/0 é a rota padrão (gateway).',
    aulas: ['redes.m01.a03'],
  },
  {
    id: 'gateway',
    termo: 'Gateway',
    simples: 'Equipamento que leva o tráfego da rede local para outras redes.',
    tecnico: 'Normalmente o roteador, configurado como rota padrão do computador.',
    aulas: ['redes.m01.a03'],
  },
  {
    id: 'tcp',
    termo: 'TCP',
    simples: 'Protocolo de transporte confiável: confirma, reenvia e mantém a ordem.',
    tecnico: 'Abre a conexão com o handshake SYN, SYN-ACK, ACK.',
    aulas: ['redes.m01.a04'],
  },
  {
    id: 'udp',
    termo: 'UDP',
    simples: 'Protocolo de transporte rápido, sem confirmação nem reenvio.',
    tecnico: 'Usado em vídeo ao vivo, jogos e DNS, onde o atraso pesa mais que a perda.',
    aulas: ['redes.m01.a04'],
  },
  {
    id: 'porta-de-rede',
    termo: 'Porta (rede)',
    simples: 'Número que identifica o programa que recebe os dados na máquina.',
    tecnico: '16 bits (0 a 65535); exemplos: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS.',
    aulas: ['redes.m01.a04'],
  },
  {
    id: 'dhcp',
    termo: 'DHCP',
    simples: 'Serviço que entrega IP, gateway e DNS automaticamente.',
    tecnico:
      'Ciclo DORA: Discover, Offer, Request, Acknowledge; o IP é emprestado por um tempo (lease).',
    aulas: ['redes.m01.a05'],
  },
  {
    id: 'nat',
    termo: 'NAT',
    simples: 'Troca o IP privado pelo público na saída da rede.',
    tecnico:
      'Mantém uma tabela de tradução (com portas) para devolver as respostas ao dispositivo certo.',
    aulas: ['redes.m01.a05'],
  },
  {
    id: 'firewall',
    termo: 'Firewall',
    simples: 'Filtro que permite ou bloqueia tráfego conforme regras.',
    tecnico: 'Avalia regras em ordem (a primeira que casa vence); o ideal é negar por padrão.',
    aulas: ['redes.m01.a05'],
  },
  {
    id: 'vpn',
    termo: 'VPN',
    simples: 'Túnel criptografado que estende uma rede privada pela internet.',
    tecnico:
      'O pacote original é criptografado e encapsulado em outro; protocolos: IPsec, OpenVPN, WireGuard.',
    aulas: ['redes.m02.a04'],
  },
  {
    id: 'tls',
    termo: 'TLS',
    simples: 'Protocolo que protege o HTTP (HTTPS) com autenticação, sigilo e integridade.',
    tecnico:
      'Usa certificado para a identidade e chave pública para combinar uma chave de sessão simétrica.',
    aulas: ['redes.m02.a03'],
  },
  {
    id: 'certificado-digital',
    termo: 'Certificado digital',
    simples: 'Documento que prova a identidade de um servidor, assinado por uma CA.',
    tecnico: 'Forma uma cadeia de confiança até uma CA raiz instalada no sistema.',
    aulas: ['redes.m02.a03'],
  },
  {
    id: 'icmp-ping',
    termo: 'Ping (ICMP)',
    simples: 'Teste que envia um eco e mede se o destino responde e em quanto tempo.',
    tecnico: 'Mede latência e perda; firewalls podem bloquear o ICMP.',
    aulas: ['redes.m02.a01'],
  },
  {
    id: 'wpa3',
    termo: 'WPA3',
    simples: 'Padrão de segurança de Wi-Fi mais recente e forte.',
    tecnico: 'Usa a troca de chaves SAE, resistente a ataques de dicionário offline.',
    aulas: ['redes.m02.a02'],
  },
  {
    id: 'triade-cia',
    termo: 'Tríade CIA',
    simples: 'Os três pilares da segurança: confidencialidade, integridade e disponibilidade.',
    tecnico: 'Base para analisar ameaças, vulnerabilidades e riscos e escolher defesas.',
    aulas: ['ciberseguranca.m01.a01'],
  },
  {
    id: 'hash-senha',
    termo: 'Hash',
    simples: 'Impressão digital de mão única de um dado, como uma senha.',
    tecnico: 'Para senhas usam-se hashes lentos com sal (bcrypt, scrypt, Argon2).',
    aulas: ['ciberseguranca.m01.a02'],
  },
  {
    id: 'sal',
    termo: 'Sal (salt)',
    simples: 'Texto aleatório misturado à senha antes do hash, único por usuário.',
    tecnico: 'Faz senhas iguais gerarem hashes diferentes e inutiliza tabelas prontas.',
    aulas: ['ciberseguranca.m01.a02'],
  },
  {
    id: 'mfa',
    termo: 'MFA',
    simples: 'Autenticação com mais de um fator: algo que você sabe, tem ou é.',
    tecnico: 'Apps autenticadores e chaves FIDO2 são melhores que códigos por SMS.',
    aulas: ['ciberseguranca.m01.a02'],
  },
  {
    id: 'phishing',
    termo: 'Phishing',
    simples: 'Mensagem falsa que engana a vítima para obter dados ou acesso.',
    tecnico: 'Variações: spear phishing, smishing, vishing e BEC; confira o domínio real do link.',
    aulas: ['ciberseguranca.m01.a03'],
  },
  {
    id: 'injecao-sql',
    termo: 'Injeção de SQL',
    simples: 'Falha em que texto digitado vira parte do comando SQL.',
    tecnico: 'Evita-se com consultas parametrizadas e menor privilégio na conta do banco.',
    aulas: ['ciberseguranca.m01.a04'],
  },
  {
    id: 'backup-321',
    termo: 'Backup 3-2-1',
    simples: 'Regra de backup: 3 cópias, em 2 tipos de mídia, com 1 fora do local.',
    tecnico: 'Protege contra falhas e ransomware; a restauração precisa ser testada.',
    aulas: ['ciberseguranca.m01.a05'],
  },
  {
    id: 'html',
    termo: 'HTML',
    simples: 'Linguagem que descreve a estrutura e o significado do conteúdo de uma página.',
    tecnico: 'Usa tags e atributos; o navegador a converte na árvore DOM.',
    aulas: ['web.m01.a01'],
  },
  {
    id: 'css',
    termo: 'CSS',
    simples: 'Linguagem que define a aparência da página: cores, tamanhos e posições.',
    tecnico:
      'Regras com seletor e declarações; a cascata resolve conflitos por especificidade e ordem.',
    aulas: ['web.m01.a02'],
  },
  {
    id: 'modelo-de-caixa',
    termo: 'Modelo de caixa',
    simples: 'Todo elemento é uma caixa: conteúdo, padding, borda e margem.',
    tecnico: 'Com box-sizing: border-box a largura inclui padding e borda.',
    aulas: ['web.m01.a02'],
  },
  {
    id: 'flexbox',
    termo: 'Flexbox',
    simples: 'Layout que organiza os filhos de um elemento em linha ou coluna.',
    tecnico: 'justify-content alinha no eixo principal; align-items, no cruzado.',
    aulas: ['web.m01.a03'],
  },
  {
    id: 'design-responsivo',
    termo: 'Design responsivo',
    simples: 'Página que se adapta a telas de qualquer tamanho.',
    tecnico:
      'Usa meta viewport, unidades relativas, Flexbox ou Grid e media queries (mobile first).',
    aulas: ['web.m01.a03'],
  },
  {
    id: 'acessibilidade-web',
    termo: 'Acessibilidade web',
    simples:
      'Projetar páginas utilizáveis por todos, inclusive por quem usa leitor de tela ou só o teclado.',
    tecnico: 'Guiada pela WCAG (POUR): perceptível, operável, compreensível e robusto.',
    aulas: ['web.m01.a04'],
  },
  {
    id: 'github-pages',
    termo: 'GitHub Pages',
    simples: 'Serviço gratuito que publica páginas estáticas direto de um repositório.',
    tecnico: 'Serve por HTTPS; cada push gera uma nova publicação.',
    aulas: ['web.m01.a05'],
  },
];
