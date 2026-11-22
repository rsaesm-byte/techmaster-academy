import { associar, completar, mc, montar, prever } from '../fundamentos/montar';

export const p06 = montar({
  id: 'python.m02.a01',
  titulo: 'Python: textos e seus métodos',
  objetivo: 'Manipular textos com métodos (upper, strip, split, join, replace) e fatiamento.',
  pre: ['python.m01.a05'],
  min: 25,
  diag: mc(
    'Qual método transforma "oi" em "OI"?',
    'upper(), que devolve o texto todo em maiúsculas',
    [
      ['big(), que deixa todas as letras do texto maiúsculas', 'O método se chama upper().'],
      ['caps(), que coloca as letras em caixa alta', 'O método se chama upper().'],
    ],
    'upper() devolve o texto em maiúsculas.',
  ),
  simples: {
    titulo: 'Textos são objetos com ferramentas',
    texto:
      'Todo texto (`str`) vem com métodos prontos:\n\n```\nnome = "  Ana Souza  "\nprint(nome.strip())          # tira espaços das pontas\nprint(nome.upper())          # maiúsculas\nprint("a,b,c".split(","))    # separa em lista\nprint("-".join(["a", "b"]))  # junta com separador\nprint("casa".replace("a", "o"))\n```\n\nO **fatiamento** pega um pedaço: `"python"[0:3]` é `"pyt"`.',
    essencial:
      'Textos têm métodos: strip, upper, lower, split, join, replace. Fatias usam [início:fim], com o fim excluído.',
    guiado:
      'Para limpar e separar uma entrada:\n1. `strip()` tira espaços sobrando.\n2. `lower()` padroniza a caixa.\n3. `split(",")` separa em partes.\n4. `join` reúne de novo, se precisar.',
    tecnico:
      'Textos em Python são **imutáveis**: os métodos devolvem um texto novo e não alteram o original, então é preciso guardar o resultado (`nome = nome.strip()`). A fatia `s[a:b]` vai do índice a até b-1; índices negativos contam do fim (`s[-1]` é o último caractere). Strings são Unicode, então acentos funcionam normalmente.',
  },
  analogia: {
    titulo: 'Fita de papel',
    texto:
      'Pense num texto como uma fita de papel numerada. Métodos geram uma fita nova (cópia limpa, em maiúsculas...), e o fatiamento recorta um trecho entre dois números. A fita original nunca muda.',
    limites: 'Para "alterar" um texto, você cria outro e guarda na variável.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'JavaScript tem métodos parecidos com outros nomes. Compare com o código Python nos comentários.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: "  Ana  ".strip()\nconsole.log("  Ana  ".trim());\n// Python: "oi".upper()\nconsole.log("oi".toUpperCase());\n// Python: "a,b,c".split(",")\nconsole.log("a,b,c".split(","));\n// Python: "-".join(["a", "b"])\nconsole.log(["a", "b"].join("-"));\n// Python: "python"[0:3]\nconsole.log("python".slice(0, 3));',
    },
  },
  tecnica: {
    titulo: 'Mais ferramentas',
    texto:
      '`s.lower()`, `s.title()`, `s.startswith("x")`, `s.endswith("x")`.\n`s.find("x")`: posição ou -1.\n`"x" in s`: contém?\n`len(s)`: tamanho.\n`s[::-1]`: texto invertido.\n**f-strings:** `f"Olá, {nome.title()}!"`.',
  },
  diagrama: {
    titulo: 'Limpando uma entrada',
    nos: [
      { forma: 'inicio', texto: 'Texto digitado: "  Ana,Bia  "' },
      { forma: 'passo', texto: 'strip(): remove espaços das pontas' },
      { forma: 'passo', texto: 'split(","): separa em lista' },
      { forma: 'fim', texto: 'Lista ["Ana", "Bia"] pronta para usar' },
    ],
    descricao: 'Cada método devolve um texto ou lista novo para o próximo passo.',
  },
  exemplo: {
    titulo: 'Padronizando um e-mail',
    codigo: {
      linguagem: 'python',
      fonte:
        'email = "  Ana@Exemplo.COM "\nlimpo = email.strip().lower()\nusuario = limpo.split("@")[0]\nprint(usuario)',
    },
    comentarios: [
      { linha: 2, texto: 'Encadeia strip e lower: "ana@exemplo.com".' },
      { linha: 3, texto: 'split("@") devolve ["ana", "exemplo.com"]; [0] pega o primeiro.' },
      { linha: 4, texto: 'Mostra ana.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'print("python".upper())',
      ['PYTHON'],
      'upper() devolve o texto todo em maiúsculas.',
      [{ resposta: 'python', feedback: 'O texto foi convertido para maiúsculas.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'print("a,b,c".split(","))',
      ["['a', 'b', 'c']", "['a','b','c']"],
      'split devolve uma lista com as três partes.',
      [{ resposta: 'a b c', feedback: 'O resultado é uma lista, mostrada com colchetes e aspas.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'print("banana"[1:4])',
      ['ana'],
      'Os índices 1, 2 e 3 são a, n e a; o 4 não entra.',
      [{ resposta: 'anan', feedback: 'O índice final (4) é excluído.' }],
      [],
      'python',
    ),
    completar(
      'Complete para juntar as palavras separadas por espaço.',
      'print(" ".___(["oi", "mundo"]))',
      [{ aceitas: ['join'], feedback: 'join junta os itens usando o texto como separador.' }],
      'O separador chama join, e a lista é o argumento.',
      'python',
    ),
  ],
  desafio: associar(
    'Associe cada método ao que ele faz.',
    [
      ['strip()', 'Remove espaços das pontas'],
      ['split(",")', 'Separa o texto em uma lista'],
      ['replace("a", "o")', 'Troca trechos por outros'],
      ['lower()', 'Converte para minúsculas'],
    ],
    'Esses quatro cobrem a maior parte da limpeza de textos.',
  ),
  rec: [
    mc(
      'O que s.strip() faz com s?',
      'Devolve um texto novo e não altera s',
      [
        [
          'Altera o próprio s, removendo os espaços das pontas',
          'Textos são imutáveis: strip devolve um novo texto.',
        ],
        ['Apaga o conteúdo de s e deixa o texto vazio', 'strip só remove espaços das pontas.'],
      ],
      'Guarde o resultado: s = s.strip().',
    ),
    mc(
      'Em "python"[0:3], o que acontece com o índice 3?',
      'Ele não entra na fatia',
      [
        ['Entra na fatia, pois o fim é incluído', 'O fim da fatia é excluído.'],
        ['Causa erro', 'É um uso normal de fatia.'],
      ],
      'A fatia vai do início até o fim menos 1.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique por que strip() sozinho não muda a variável original.',
    modelo:
      'Textos em Python são imutáveis: os métodos devolvem um texto novo. Para usar o resultado é preciso guardá-lo, por exemplo nome = nome.strip().',
    rubrica: [
      'Citou a imutabilidade',
      'Disse que o método devolve um texto novo',
      'Mostrou como guardar o resultado',
    ],
  },
  resumo: [
    'Textos têm métodos: strip, upper, lower, split, join, replace.',
    'Eles devolvem textos novos (imutabilidade).',
    'Fatia [a:b] exclui o índice b.',
    'f-strings montam textos com valores.',
  ],
  cards: [
    ['Como separar um texto em lista?', 'split(separador)'],
    ['Como juntar uma lista em texto?', '"sep".join(lista)'],
    ['Textos são mutáveis?', 'Não, são imutáveis.'],
    ['Como inverter um texto?', 's[::-1]'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: trim, toUpperCase, split, join e slice.',
      'SQL: LIKE e funções de texto fazem trabalho parecido no banco.',
      'Engenharia de Dados: limpar textos é a primeira etapa de quase todo pipeline.',
    ],
    profissional:
      'Dados reais chegam sujos: espaços, caixas diferentes e separadores. Os métodos de texto resolvem a maior parte.',
  },
});
