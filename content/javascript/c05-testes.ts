import { associar, mc, montar, ordenar, prever, programaJs } from '../fundamentos/montar';

export const j15 = montar({
  id: 'javascript.m03.a05',
  titulo: 'Projeto: testar e entregar',
  objetivo:
    'Escrever testes simples com casos de entrada e saída, depurar com console.log e publicar o projeto.',
  pre: ['javascript.m03.a04', 'fundamentos.m04.a04'],
  min: 35,
  diag: mc(
    'Para que servem testes automatizados?',
    'Verificar sozinhos se o código continua funcionando após mudanças',
    [
      ['Deixar o código mais rápido', 'Testes verificam, não aceleram.'],
      ['Substituir a documentação', 'Ajudam, mas têm outro propósito.'],
    ],
    'Cada teste confirma que uma entrada produz a saída esperada.',
  ),
  simples: {
    titulo: 'Conferir o troco antes de sair da loja',
    texto:
      'Um **teste** chama uma função com uma entrada conhecida e compara o resultado com o **esperado**:\n\n```\nfunction testar(nome, obtido, esperado) {\n  const ok = JSON.stringify(obtido) === JSON.stringify(esperado);\n  console.log(ok ? "OK " : "FALHOU ", nome);\n}\ntestar("dobro de 4", dobro(4), 8);\n```\n\nBons testes cobrem o **caso normal**, os **limites** (0, lista vazia) e os **casos de erro**. Quando algo falha, use `console.log` para ver os valores no meio do caminho.',
    essencial:
      'Teste = chamar com entrada conhecida e comparar com o esperado. Cubra caso normal, limites e erros.',
    guiado:
      'Para testar uma função:\n1. Escolha 3 entradas: normal, limite e erro.\n2. Escreva o resultado esperado de cada uma.\n3. Rode e compare.\n4. Se falhar, depure com console.log.',
    tecnico:
      'Ferramentas profissionais (Vitest, Jest) oferecem `expect(valor).toBe(esperado)`, execução automática e relatórios. Este projeto usa o Vitest: cada exercício de programação das aulas é corrigido por casos de teste, como você viu. Testes rodando a cada push (integração contínua) impedem que um erro chegue ao site publicado.',
  },
  analogia: {
    titulo: 'Checklist de decolagem',
    texto:
      'O piloto não confia na memória: segue um checklist antes de cada voo. Os testes são o checklist do código; rodam sempre, antes de decolar (publicar).',
    limites:
      'Um checklist só cobre o que está escrito; testes também não pegam o que ninguém pensou em testar.',
  },
  demo: {
    titulo: 'Seu mini framework de testes',
    instrucoes:
      'Execute. Depois inclua um teste que falha e use console.log para descobrir o motivo.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function testar(nome, obtido, esperado) {\n  const ok = JSON.stringify(obtido) === JSON.stringify(esperado);\n  console.log((ok ? "OK     " : "FALHOU ") + nome);\n}\nfunction dobro(n) {\n  return n * 2;\n}\ntestar("dobro de 4", dobro(4), 8);\ntestar("dobro de 0", dobro(0), 0);\ntestar("dobro de -3", dobro(-3), -6);\ntestar("exemplo que falha", dobro(2), 5);',
    },
  },
  tecnica: {
    titulo: 'Boas práticas',
    texto:
      '**Um comportamento por teste.**\n**Nomes claros:** "devolve 0 para lista vazia".\n**Casos-limite:** vazio, zero, negativo, repetidos.\n**Depurar:** `console.log(variavel)` e leia o valor real, não o que acha que é.\n**Entregar:** commit, push e deploy automático (como este site).',
  },
  diagrama: {
    titulo: 'Ciclo de entrega',
    nos: [
      { forma: 'inicio', texto: 'Escreve ou altera o código' },
      { forma: 'passo', texto: 'Roda os testes' },
      { forma: 'decisao', texto: 'Todos passaram?' },
      { forma: 'fim', texto: 'Sim: commit, push e publicação; Não: corrige e repete' },
    ],
    descricao: 'O código só é publicado se todos os testes passarem.',
  },
  exemplo: {
    titulo: 'Testando casos-limite',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function somar(lista) {\n  return lista.reduce((s, n) => s + n, 0);\n}\ntestar("lista comum", somar([1, 2, 3]), 6);\ntestar("lista vazia", somar([]), 0);\ntestar("negativos", somar([-1, -2]), -3);',
    },
    comentarios: [
      { linha: 4, texto: 'Caso normal.' },
      { linha: 5, texto: 'Limite: lista vazia.' },
      { linha: 6, texto: 'Variação: números negativos.' },
    ],
  },
  guiado: [
    mc(
      'Qual é um bom caso-limite para uma função que soma uma lista?',
      'A lista vazia',
      [
        ['Uma lista com 3 números', 'Esse é o caso normal.'],
        ['Uma lista com a palavra "oi"', 'Esse é um caso inválido, não um limite.'],
      ],
      'Limites são onde erros costumam aparecer.',
    ),
    prever(
      'O que aparece no console?',
      'const ok = JSON.stringify([1, 2]) === JSON.stringify([1, 2]);\nconsole.log(ok);',
      ['true'],
      'Os dois textos JSON são iguais.',
      [
        {
          resposta: 'false',
          feedback:
            'Comparar o JSON dos dois arrays dá true; comparar os arrays com === é que daria false.',
        },
      ],
      [],
      'javascript',
    ),
  ],
  indep: [
    ordenar(
      'Ordene o ciclo de correção de um erro.',
      [
        'Um teste falha',
        'Você investiga com console.log',
        'Você corrige o código',
        'Roda os testes de novo e todos passam',
      ],
      'Falha, investigação, correção e nova verificação.',
    ),
    associar(
      'Associe a situação ao tipo de caso de teste.',
      [
        ['Somar [1, 2, 3]', 'Caso normal'],
        ['Somar []', 'Caso-limite'],
        ['Dividir por zero', 'Caso de erro'],
      ],
      'Cobrir os três tipos evita surpresas.',
    ),
  ],
  desafio: programaJs(
    'Escreva ehPalindromo(texto): devolve true se o texto é igual quando lido de trás para frente, ignorando maiúsculas e espaços. Exemplo: "Ana" → true; "Arara" → true; "casa" → false.',
    'function ehPalindromo(texto) {\n  // seu código aqui\n}',
    'function ehPalindromo(texto) {\n  const limpo = texto.toLowerCase().replaceAll(" ", "");\n  return limpo === limpo.split("").reverse().join("");\n}',
    'ehPalindromo',
    [
      { argumentos: ['Ana'], esperado: true },
      { argumentos: ['Arara'], esperado: true },
      { argumentos: ['casa'], esperado: false },
      { argumentos: ['A sacada da casa'], esperado: true },
      { argumentos: ['socorram me subi no onibus em marrocos'], esperado: true },
      { argumentos: [''], esperado: true },
    ],
    [
      'Normalize: toLowerCase e remova os espaços.',
      'Inverta com split("").reverse().join("") e compare.',
    ],
    'Depois de normalizar o texto, basta compará-lo com sua versão invertida. Observe que o teste de string vazia e o de frase longa cobrem limites.',
  ),
  rec: [
    mc(
      'O que um teste automatizado compara?',
      'O resultado obtido com o resultado esperado',
      [
        ['O código com a documentação', 'Compara resultados, não textos.'],
        ['O tempo de execução com o do vizinho', 'Isso seria um teste de desempenho.'],
      ],
      'Entrada conhecida, saída esperada.',
    ),
    mc(
      'Por que rodar testes antes de publicar?',
      'Para impedir que um erro chegue ao site no ar',
      [
        ['Para deixar o site mais bonito', 'Não afetam a aparência.'],
        ['Porque o GitHub exige', 'É uma boa prática, não uma exigência.'],
      ],
      'Testes na integração contínua bloqueiam publicações com erro.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que são casos-limite e por que testá-los.',
    modelo:
      'Casos-limite são entradas nos extremos, como lista vazia, zero ou valores negativos. É neles que erros costumam aparecer, então testá-los dá mais confiança de que a função funciona sempre.',
    rubrica: [
      'Definiu casos-limite com exemplos',
      'Disse que erros costumam aparecer neles',
      'Concluiu que isso dá confiança ao código',
    ],
  },
  resumo: [
    'Teste compara resultado obtido com esperado.',
    'Cubra casos normais, limites e de erro.',
    'console.log ajuda a depurar.',
    'Testes automáticos protegem a publicação.',
  ],
  cards: [
    ['O que é um teste?', 'Comparar o resultado obtido com o esperado.'],
    ['O que é caso-limite?', 'Entrada extrema, como lista vazia ou zero.'],
    ['Como depurar?', 'console.log dos valores intermediários.'],
    ['O que é integração contínua?', 'Rodar os testes automaticamente a cada envio.'],
  ],
  conexoes: {
    disciplinas: [
      'Git: testes rodam a cada push.',
      'Engenharia de Software: TDD escreve o teste antes do código.',
      'Python: pytest é o equivalente.',
    ],
    profissional:
      'Quem escreve testes entrega com mais segurança e é mais valorizado. É requisito comum em vagas.',
  },
});
