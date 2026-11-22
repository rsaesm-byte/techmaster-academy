import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j02 = montar({
  id: 'javascript.m01.a02',
  titulo: 'Condicionais e comparações',
  objetivo:
    'Comparar valores com ===, combinar condições com && e ||, e decidir caminhos com if, else e o operador ternário.',
  pre: ['javascript.m01.a01', 'logica.m01.a04'],
  min: 30,
  diag: mc(
    'Qual é a forma recomendada de comparar se dois valores são iguais em JavaScript?',
    '===',
    [
      ['=', 'Um único = é atribuição: guarda um valor numa variável, não compara.'],
      [
        '==',
        'O == compara convertendo tipos (5 == "5" é true), o que causa surpresas. Prefira ===.',
      ],
    ],
    '`===` compara valor e tipo, sem conversões escondidas. É o padrão em código profissional.',
  ),
  simples: {
    titulo: 'Decidir com if e else',
    texto:
      'Uma **condição** é uma pergunta cuja resposta é `true` ou `false`. Com `if`, o programa só executa um bloco quando a condição é verdadeira:\n\n```\nif (idade >= 18) {\n  console.log("adulto");\n} else {\n  console.log("menor");\n}\n```\n\n**Comparadores:** `===` (igual), `!==` (diferente), `>`, `<`, `>=`, `<=`.\n**Combinar condições:** `&&` (E: as duas verdadeiras), `||` (OU: pelo menos uma) e `!` (NÃO: inverte).\n\nPara escolhas curtas existe o **ternário**: `condição ? valorSeVerdadeiro : valorSeFalso`.',
    essencial:
      'if/else escolhe caminhos. Comparadores: ===, !==, >, <, >=, <=. && = E; || = OU; ! = NÃO. Ternário: cond ? a : b.',
    guiado:
      'Para decidir:\n1. Escreva a pergunta como comparação (`nota >= 7`).\n2. Coloque entre parênteses depois do `if`.\n3. Escreva o que fazer se for verdadeiro, entre chaves.\n4. Use `else` para o caso contrário.\n5. Para mais de dois caminhos, encadeie `else if`.',
    tecnico:
      'As condições são avaliadas como booleanas; valores "falsy" (0, "", null, undefined, NaN, false) contam como falso. `&&` e `||` usam avaliação em curto-circuito: `a && b` só avalia b se a for verdadeiro. `==` aplica coerção de tipos; `===` não. O ternário é uma expressão (devolve valor), enquanto if é uma instrução.',
  },
  analogia: {
    titulo: 'Bifurcação na estrada',
    texto:
      'O if é uma placa na estrada: "se estiver chovendo, vá pela esquerda; senão, pela direita". O && é uma cancela que só abre se duas condições forem atendidas (ingresso E documento); o || abre com uma delas (cartão OU dinheiro).',
    limites:
      'A estrada só tem dois caminhos por placa; para mais opções, é preciso encadear várias perguntas (else if) na ordem certa, pois a primeira verdadeira vence.',
  },
  demo: {
    titulo: 'Teste condições',
    instrucoes:
      'Execute e leia a saída. Depois mude a nota para 5 e 4.9 e veja o caminho mudar. Troque o `>=` por `>` na primeira condição: o que acontece com a nota 7?',
    simulacao: {
      tipo: 'js',
      codigo:
        'const nota = 7;\nif (nota >= 7) {\n  console.log("aprovado");\n} else if (nota >= 5) {\n  console.log("recuperação");\n} else {\n  console.log("reprovado");\n}\nconsole.log(5 === "5");\nconsole.log(5 == "5");\nconsole.log(nota > 5 && nota < 10);',
    },
  },
  tecnica: {
    titulo: 'Combinações, else if e ternário',
    texto:
      '**Ordem importa em else if:** a primeira condição verdadeira vence. Teste os casos mais específicos primeiro.\n\n**Tabela do E e do OU:**\n- `true && true` → true; `true && false` → false\n- `false || true` → true; `false || false` → false\n\n**Intervalo:** "entre 5 e 10" é `n >= 5 && n <= 10` (não existe `5 <= n <= 10`).\n\n**Ternário:** `const status = nota >= 7 ? "aprovado" : "reprovado";`\n\n**Cuidado:** `if (x = 5)` atribui em vez de comparar. Use sempre `===`.',
  },
  diagrama: {
    titulo: 'Classificar uma nota',
    nos: [
      { forma: 'inicio', texto: 'Recebe a nota' },
      { forma: 'decisao', texto: 'nota >= 7? Se sim: aprovado' },
      { forma: 'decisao', texto: 'Senão, nota >= 5? Se sim: recuperação' },
      { forma: 'fim', texto: 'Senão: reprovado' },
    ],
    descricao:
      'A nota é testada em ordem. Se for maior ou igual a 7, aprovado. Senão, se for maior ou igual a 5, recuperação. Senão, reprovado.',
  },
  exemplo: {
    titulo: 'Ingresso com desconto',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const idade = 70;\nconst estudante = false;\nconst meia = idade >= 60 || estudante;\nconst preco = meia ? 20 : 40;\nconsole.log(`Ingresso: R$ ${preco}`);',
    },
    comentarios: [
      { linha: 3, texto: 'OU: idoso ou estudante têm meia-entrada. Aqui, idade >= 60 é true.' },
      { linha: 4, texto: 'Ternário: se meia for true o preço é 20, senão 40.' },
      { linha: 5, texto: 'Mostra: Ingresso: R$ 20.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'const idade = 20;\nif (idade >= 18) {\n  console.log("adulto");\n} else {\n  console.log("menor");\n}',
      ['adulto'],
      '20 >= 18 é verdadeiro, então executa o bloco do if.',
      [{ resposta: 'menor', feedback: '20 é maior que 18: a condição é verdadeira.' }],
      [],
      'javascript',
    ),
    mc(
      'Qual é o resultado de 5 === "5"?',
      'false',
      [
        ['true', 'O === também compara o tipo: número e texto são diferentes.'],
        ['5', 'Uma comparação devolve true ou false, não o valor.'],
      ],
      'Um número e um texto são tipos diferentes, então === dá false. (Já 5 == "5" daria true, por coerção.)',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'console.log(10 > 5 && 3 > 4);',
      ['false'],
      '10 > 5 é true, mas 3 > 4 é false. true && false dá false.',
      [{ resposta: 'true', feedback: 'O && exige que as DUAS condições sejam verdadeiras.' }],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva classificarNota(nota): "aprovado" se nota >= 7, "recuperação" se nota >= 5 e "reprovado" nos demais casos.',
      'function classificarNota(nota) {\n  // seu código aqui\n}',
      'function classificarNota(nota) {\n  if (nota >= 7) {\n    return "aprovado";\n  } else if (nota >= 5) {\n    return "recuperação";\n  }\n  return "reprovado";\n}',
      'classificarNota',
      [
        { argumentos: [8], esperado: 'aprovado' },
        { argumentos: [7], esperado: 'aprovado' },
        { argumentos: [5], esperado: 'recuperação' },
        { argumentos: [4.9], esperado: 'reprovado' },
      ],
      [
        'Teste primeiro o caso mais alto (>= 7).',
        'Use else if para o segundo caso e devolva "reprovado" no fim.',
      ],
      'As condições são testadas em ordem; a primeira verdadeira devolve o resultado.',
    ),
  ],
  desafio: programaJs(
    'Escreva ehBissexto(ano): um ano é bissexto se for divisível por 4 e não por 100, ou se for divisível por 400. Devolva true ou false.',
    'function ehBissexto(ano) {\n  // seu código aqui\n}',
    'function ehBissexto(ano) {\n  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;\n}',
    'ehBissexto',
    [
      { argumentos: [2024], esperado: true },
      { argumentos: [1900], esperado: false },
      { argumentos: [2000], esperado: true },
      { argumentos: [2023], esperado: false },
    ],
    ['Quatro condições combinadas com && e ||.', 'Use parênteses para agrupar a primeira parte.'],
    'Divisível por 4 e não por 100, OU divisível por 400. Os parênteses garantem a ordem das operações.',
  ),
  rec: [
    mc(
      'Quando "a || b" é verdadeiro?',
      'Quando pelo menos uma das duas é verdadeira',
      [
        ['Somente quando as duas são verdadeiras', 'Isso descreve o &&.'],
        ['Somente quando as duas são falsas', 'Com as duas falsas, o || dá false.'],
      ],
      '|| é o OU: basta uma condição verdadeira.',
    ),
    mc(
      'O que a variável resultado guarda?',
      '"sim"',
      [
        ['"não"', '5 > 3 é verdadeiro, então vale o primeiro valor do ternário.'],
        [
          'true',
          'O ternário devolve um dos dois valores escritos ("sim" ou "não"), não o resultado da comparação.',
        ],
      ],
      'Ternário: condição ? valorSeVerdadeiro : valorSeFalso.',
      2,
      { linguagem: 'javascript', fonte: 'const resultado = 5 > 3 ? "sim" : "não";' },
    ),
  ],
  explique: {
    enunciado: 'Explique por que se deve preferir === a == em JavaScript.',
    modelo:
      'O == converte os tipos antes de comparar, o que dá resultados surpreendentes (5 == "5" é true). O === compara valor e tipo sem conversão, então o resultado é previsível.',
    rubrica: [
      'Citou que == converte tipos',
      'Citou que === compara valor e tipo',
      'Concluiu que === é mais previsível',
    ],
  },
  resumo: [
    'if/else escolhe caminhos; else if encadeia mais opções (a primeira verdadeira vence).',
    'Use === e !== para comparar; evite ==.',
    '&& (E), || (OU) e ! (NÃO) combinam condições.',
    'Ternário: condição ? valorA : valorB.',
  ],
  cards: [
    ['Como comparar igualdade em JavaScript?', 'Com ===, que compara valor e tipo.'],
    ['O que faz o &&?', 'Verdadeiro só se as duas condições forem verdadeiras.'],
    ['O que faz o ||?', 'Verdadeiro se pelo menos uma condição for verdadeira.'],
    ['Como é o operador ternário?', 'condição ? valorSeVerdadeiro : valorSeFalso'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: && e || são as portas AND e OR, agora em código.',
      'SQL: o WHERE do SQL combina condições com AND e OR.',
      'HTML, CSS e a Web: validação de formulários é cheia de condicionais.',
    ],
    profissional:
      'A maior parte da lógica de negócio (descontos, permissões, validações) é feita de condicionais. Escrever condições claras evita erros caros em produção.',
  },
});
