import type { AulaEntrada } from '@/domain/conteudo';

export const aula03: AulaEntrada = {
  id: 'logica.m01.a03',
  versao: 1,
  status: 'publicada',
  titulo: 'Operadores e expressões',
  objetivo:
    'Usar operadores aritméticos, relacionais e lógicos, aplicar a ordem de precedência e calcular o resultado de expressões, inclusive o resto da divisão (%).',
  preRequisitos: ['logica.m01.a02'],
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
          enunciado: 'Quanto vale `2 + 3 * 4`?',
          alternativas: [
            { id: 'a', texto: '14' },
            {
              id: 'b',
              texto: '20',
              feedback:
                'Isso seria (2 + 3) * 4. Sem parênteses, a multiplicação vem antes da soma.',
            },
            { id: 'c', texto: '9', feedback: '9 seria 2 + 3 + 4. Aqui há uma multiplicação.' },
          ],
          correta: 'a',
          explicacao: 'Primeiro 3 * 4 = 12, depois 2 + 12 = 14 — a mesma regra da matemática.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Operadores fazem contas e comparações',
      texto:
        'Uma **expressão** é uma combinação de valores, variáveis e **operadores** que produz um resultado. `preco * 2` dá um número; `idade >= 18` dá VERDADEIRO ou FALSO.\n\nHá três famílias de operadores: os **aritméticos** fazem contas, os **relacionais** comparam e os **lógicos** combinam respostas de sim ou não.',
      porModo: {
        essencial:
          'Aritméticos: + - * / %. Relacionais: = <> < > <= >= (dão VERDADEIRO/FALSO). Lógicos: e, ou, nao. Multiplicação e divisão vêm antes de soma e subtração; parênteses mudam a ordem.',
        guiado:
          'Vamos por partes.\n1. Contas: `+`, `-`, `*` (vezes), `/` (dividido) e `%` (resto da divisão).\n2. Comparações: `=` (igual), `<>` (diferente), `<`, `>`, `<=`, `>=`. O resultado é VERDADEIRO ou FALSO.\n3. Combinações: `e` (as duas coisas), `ou` (pelo menos uma), `nao` (o contrário).\nQuando há várias operações juntas, existe uma ordem fixa — a precedência. Na dúvida, use parênteses.',
        tecnico:
          'Expressões são avaliadas segundo precedência e associatividade: unários (`nao`, `-`) > multiplicativos (`* / %`) > aditivos (`+ -`) > relacionais > `e` > `ou`. Operadores de mesmo nível associam da esquerda para a direita. Relacionais produzem valores lógicos, que são operandos de `e`/`ou`.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'A ordem das tarefas numa cozinha',
      texto:
        'Numa receita, você pica antes de refogar e refoga antes de servir — mesmo que a receita cite tudo numa frase só. Nas expressões é igual: existe uma ordem fixa de quem é feito primeiro, e os parênteses são o jeito de dizer "isto aqui antes de tudo".',
      limites:
        'Na cozinha, dá para adaptar a ordem com bom senso. Nas expressões, a regra é sempre a mesma: o computador não adivinha o que você "quis dizer". Por isso, na dúvida, escreva os parênteses.',
    },
    {
      id: 'demo-expressoes',
      tipo: 'demo',
      titulo: 'Veja a expressão sendo calculada',
      instrucoes:
        'Escolha uma expressão e aperte **Calcular próxima operação** até chegar ao resultado. Repare qual operação é feita primeiro.\n\nDepois, digite sua própria expressão no campo de baixo — tente prever o resultado antes de calcular.',
      simulacao: {
        tipo: 'expressao',
        expressoes: [
          { texto: '2 + 3 * 4' },
          { texto: '(2 + 3) * 4' },
          { texto: '10 - 2 * 3 + 1' },
          { texto: '17 % 5' },
          { texto: '(nota1 + nota2) / 2', variaveis: { nota1: 7, nota2: 8 } },
          { texto: 'idade >= 16 e idade < 18', variaveis: { idade: 17 } },
          { texto: 'nao (x > 5) ou x = 0', variaveis: { x: 3 } },
        ],
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Os operadores e a precedência',
      texto:
        '**Aritméticos:** `+` soma, `-` subtrai, `*` multiplica, `/` divide (10 / 4 = 2.5) e `%` dá o **resto** da divisão inteira (10 % 4 = 2). O resto é muito útil: `n % 2 = 0` diz se n é par.\n\n**Relacionais:** `=` igual, `<>` diferente, `<` menor, `>` maior, `<=` menor ou igual, `>=` maior ou igual. Sempre resultam em VERDADEIRO ou FALSO.\n\n**Lógicos:** `a e b` só é VERDADEIRO se os dois forem; `a ou b` é VERDADEIRO se pelo menos um for; `nao a` inverte.\n\n**Precedência** (de quem é feito primeiro): parênteses → `nao` e sinal de menos → `* / %` → `+ -` → comparações → `e` → `ou`. No mesmo nível, da esquerda para a direita: 10 - 6 + 1 = 5.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'A escada da precedência',
      nos: [
        { forma: 'inicio', texto: 'Feito primeiro' },
        { forma: 'passo', texto: '( ) parênteses' },
        { forma: 'passo', texto: 'nao e o sinal de menos' },
        { forma: 'passo', texto: '* / %' },
        { forma: 'passo', texto: '+ -' },
        { forma: 'passo', texto: '= <> < > <= >=' },
        { forma: 'passo', texto: 'e' },
        { forma: 'passo', texto: 'ou' },
        { forma: 'fim', texto: 'Feito por último' },
      ],
      descricao:
        'Da maior para a menor prioridade: parênteses; nao e o sinal de menos; multiplicação, divisão e resto; soma e subtração; comparações; o operador e; por último o operador ou.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Par ou ímpar com o resto da divisão',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'numero <- 17\nresto <- numero % 2\nehPar <- resto = 0\nescreva("Resto: ", resto)\nescreva("É par? ", ehPar)',
      },
      comentarios: [
        { linha: 2, texto: '17 dividido por 2 dá 8 e sobra 1: o resto é 1.' },
        {
          linha: 3,
          texto: 'Uma comparação também é um valor: resto = 0 é FALSO, e isso é guardado em ehPar.',
        },
        { linha: 5, texto: 'A tela mostra: É par? FALSO.' },
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
          codigo: { linguagem: 'pseudocodigo', fonte: 'escreva(10 - 2 * 3 + 1)' },
          respostasAceitas: ['5'],
          errosComuns: [
            {
              resposta: '25',
              feedback:
                'Você fez as contas da esquerda para a direita. A multiplicação vem primeiro: 2 * 3 = 6.',
            },
            {
              resposta: '3',
              feedback:
                'Quase! Depois de 2 * 3 = 6, soma e subtração vão da esquerda para a direita: 10 - 6 = 4, e 4 + 1 = 5.',
            },
          ],
          pistas: [
            'Qual operação tem prioridade aqui?',
            'Depois da multiplicação, resolva da esquerda para a direita.',
          ],
          explicacao: '2 * 3 = 6; depois 10 - 6 = 4; depois 4 + 1 = 5.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete para calcular a média das duas notas corretamente.',
          codigo: { linguagem: 'pseudocodigo', fonte: 'media <- ___ nota1 + nota2 ___ / 2' },
          lacunas: [
            { aceitas: ['('], feedback: 'Sem parêntese, só a nota2 seria dividida por 2.' },
            { aceitas: [')'], feedback: 'Feche o parêntese depois da soma.' },
          ],
          pistas: ['A soma precisa acontecer antes da divisão.'],
          explicacao: '(nota1 + nota2) / 2: os parênteses fazem a soma primeiro.',
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
          enunciado: 'O que aparece na tela?',
          codigo: { linguagem: 'pseudocodigo', fonte: 'escreva(17 % 5)' },
          respostasAceitas: ['2'],
          errosComuns: [
            {
              resposta: '3',
              feedback:
                '3 é o quociente (quantas vezes o 5 cabe em 17). O % dá o que SOBRA: 17 = 5 × 3 + 2.',
            },
            { resposta: '3.4', feedback: '3.4 seria 17 / 5. O operador % dá o resto da divisão.' },
          ],
          explicacao: '5 cabe 3 vezes em 17 (15) e sobram 2. Logo 17 % 5 = 2.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Com x valendo 7, qual é o valor de `x > 5 e x < 10`?',
          alternativas: [
            { id: 'a', texto: 'VERDADEIRO' },
            {
              id: 'b',
              texto: 'FALSO',
              feedback:
                '7 > 5 é VERDADEIRO e 7 < 10 também. Com "e", os dois verdadeiros dão VERDADEIRO.',
            },
            {
              id: 'c',
              texto: '7',
              feedback: 'Comparações e operadores lógicos sempre resultam em VERDADEIRO ou FALSO.',
            },
          ],
          correta: 'a',
          explicacao:
            'VERDADEIRO e VERDADEIRO = VERDADEIRO. A expressão testa se x está entre 5 e 10.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: par ou ímpar',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Complete o programa: ele lê um número inteiro e deve escrever VERDADEIRO se for par e FALSO se for ímpar.',
          codigoInicial: 'leia(n)\n',
          solucao: 'leia(n)\nescreva(n % 2 = 0)',
          casos: [
            { entradas: ['4'], saidaEsperada: ['VERDADEIRO'] },
            { entradas: ['7'], saidaEsperada: ['FALSO'] },
            { entradas: ['0'], saidaEsperada: ['VERDADEIRO'] },
          ],
          pistas: [
            'Um número é par quando o resto da divisão por 2 é zero.',
            'escreva pode mostrar o resultado de uma comparação.',
          ],
          explicacao: 'escreva(n % 2 = 0) mostra o resultado da comparação: VERDADEIRO para pares.',
        },
        {
          id: 'desafio.bonus',
          tipo: 'programa-js',
          enunciado:
            'Bônus — o mesmo raciocínio em JavaScript: complete a função ehPar(n) para devolver true se n for par e false se for ímpar. (Em JavaScript, a comparação de igualdade é `===`.)',
          codigoInicial: 'function ehPar(n) {\n  // seu código aqui\n}',
          solucao: 'function ehPar(n) {\n  return n % 2 === 0;\n}',
          funcao: 'ehPar',
          casos: [
            { argumentos: [4], esperado: true },
            { argumentos: [7], esperado: false },
            { argumentos: [0], esperado: true },
            { argumentos: [-3], esperado: false },
          ],
          pistas: ['Use `return` para devolver o resultado.', '`n % 2 === 0` já é true ou false.'],
          explicacao:
            'A ideia é a mesma do Portugol: o resto da divisão por 2. Muda só a escrita — `===` no lugar de `=` e `return` para devolver o valor.',
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
          tipo: 'ordenacao',
          enunciado: 'Ordene do que é calculado PRIMEIRO para o que é calculado POR ÚLTIMO.',
          itens: [
            { id: 'par', texto: 'Parênteses' },
            { id: 'mult', texto: 'Multiplicação, divisão e resto' },
            { id: 'soma', texto: 'Soma e subtração' },
            { id: 'comp', texto: 'Comparações (<, >, =...)' },
            { id: 'e', texto: 'e' },
            { id: 'ou', texto: 'ou' },
          ],
          explicacao: 'Parênteses → * / % → + - → comparações → e → ou.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Qual expressão é VERDADEIRA para qualquer número n ímpar e positivo?',
          alternativas: [
            { id: 'a', texto: 'n % 2 = 1' },
            {
              id: 'b',
              texto: 'n / 2 = 1',
              feedback: 'n / 2 = 1 só vale para n = 2. A divisão não diz se sobra algo.',
            },
            {
              id: 'c',
              texto: 'n % 2 = 0',
              feedback: 'Resto zero na divisão por 2 é a marca dos números pares.',
            },
          ],
          correta: 'a',
          explicacao: 'Todo número ímpar (positivo) deixa resto 1 quando dividido por 2.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado: 'Explique por que `2 + 3 * 4` dá 14 e não 20.',
          respostaModelo:
            'Pela precedência, a multiplicação é feita antes da soma: primeiro 3 * 4 = 12, depois 2 + 12 = 14. Para obter 20 seria preciso parênteses: (2 + 3) * 4.',
          rubrica: [
            'Citou que a multiplicação vem antes da soma (precedência)',
            'Mostrou o passo intermediário (3 * 4 = 12)',
            'Disse como obter 20 (com parênteses)',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Aritméticos: + - * / e % (resto). Relacionais: = <> < > <= >=. Lógicos: e, ou, nao.',
        'Comparações e operadores lógicos resultam em VERDADEIRO ou FALSO.',
        'Precedência: parênteses → * / % → + - → comparações → e → ou. Mesmo nível: da esquerda para a direita.',
        '`n % 2 = 0` testa se um número é par.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m01.a03.fc1',
          frente: 'O que o operador % calcula?',
          verso: 'O resto da divisão inteira. Ex.: 17 % 5 = 2.',
        },
        {
          id: 'logica.m01.a03.fc2',
          frente: 'Quanto vale 2 + 3 * 4? Por quê?',
          verso: '14, porque a multiplicação é feita antes da soma.',
        },
        {
          id: 'logica.m01.a03.fc3',
          frente: 'Quando `a e b` é VERDADEIRO?',
          verso: 'Só quando a e b são VERDADEIROS ao mesmo tempo.',
        },
        {
          id: 'logica.m01.a03.fc4',
          frente: 'Como testar se n é par?',
          verso: 'n % 2 = 0 (resto zero na divisão por 2).',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Linguagens de Programação: em JavaScript a igualdade é `===`, "e" é `&&`, "ou" é `||` e "nao" é `!`.',
        'Banco de Dados: filtros SQL usam os mesmos operadores: WHERE idade >= 18 AND ativo = TRUE.',
        'Redes: o cálculo de sub-redes usa operações com bits — outra família de operadores.',
      ],
      aplicacaoProfissional:
        'Planilhas, filtros de e-mail e regras de firewall são expressões: "se origem = rede interna e porta = 443". Entender a precedência evita regras que liberam mais do que deveriam.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
