import { associar, completar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const p08 = montar({
  id: 'python.m02.a03',
  titulo: 'Python: lendo e escrevendo arquivos',
  objetivo: 'Ler e gravar arquivos de texto com open e with, escolhendo o modo certo.',
  pre: ['python.m02.a02'],
  min: 30,
  diag: mc(
    'Para que serve o comando open("dados.txt")?',
    'Abrir um arquivo para ler ou gravar',
    [
      ['Apagar o arquivo', 'open não apaga.'],
      ['Mostrar o arquivo na tela', 'Ele só abre; é preciso ler o conteúdo.'],
    ],
    'open devolve um objeto de arquivo para ler ou escrever.',
  ),
  simples: {
    titulo: 'Programas que lembram',
    texto:
      'Variáveis somem quando o programa termina. **Arquivos** guardam dados para sempre.\n\n```\nwith open("notas.txt", "w", encoding="utf-8") as f:\n    f.write("Ana,9\\n")\n\nwith open("notas.txt", encoding="utf-8") as f:\n    for linha in f:\n        print(linha.strip())\n```\n\nO **with** fecha o arquivo sozinho no final, mesmo se der erro.',
    essencial:
      'open(caminho, modo) abre o arquivo; with fecha sozinho. Modos: "r" ler, "w" sobrescrever, "a" acrescentar.',
    guiado:
      'Para processar um arquivo:\n1. `with open(caminho, encoding="utf-8") as f:`.\n2. Percorra com `for linha in f:` ou use `f.read()`.\n3. Use `strip()` para tirar o \\n do fim.\n4. Para gravar, abra com "w" ou "a".',
    tecnico:
      'O modo "w" **apaga** o conteúdo anterior; "a" acrescenta no fim; "r" (padrão) lê e falha se o arquivo não existir (FileNotFoundError). Sempre informe `encoding="utf-8"` para evitar surpresas com acentos entre sistemas. Para arquivos grandes, percorrer linha a linha (`for linha in f`) usa pouca memória, ao contrário de `f.read()`, que carrega tudo. O módulo `pathlib` oferece uma forma moderna de lidar com caminhos.',
  },
  analogia: {
    titulo: 'Caderno e caneta',
    texto:
      'Abrir um arquivo é abrir um caderno. No modo "r" você só lê; em "w" você apaga tudo e escreve do zero; em "a" escreve no fim. O with é fechar o caderno e guardá-lo sempre, mesmo com pressa.',
    limites:
      'Esquecer de fechar o arquivo pode perder dados que estavam na memória; o with resolve.',
  },
  demo: {
    titulo: 'Simulando um arquivo em JavaScript',
    instrucoes:
      'O laboratório não tem arquivos de verdade. Aqui o conteúdo é um texto e as linhas são separadas com split, como o Python faz ao ler.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: for linha in f:\nconst conteudo = "Ana,9\\nBia,7\\nCaio,8\\n";\nconst linhas = conteudo.split("\\n").filter((l) => l !== "");\nfor (const linha of linhas) {\n  const [nome, nota] = linha.split(",");\n  console.log(nome + " tirou " + nota);\n}',
    },
  },
  tecnica: {
    titulo: 'Métodos de leitura e escrita',
    texto:
      '`f.read()`: tudo em um texto.\n`f.readline()`: uma linha.\n`f.readlines()`: lista de linhas.\n`f.write(texto)`: grava (sem \\n automático).\n`for linha in f`: percorre linha a linha.\n**CSV:** o módulo `csv` separa colunas corretamente.',
  },
  diagrama: {
    titulo: 'Ciclo de vida do arquivo',
    nos: [
      { forma: 'inicio', texto: 'with open(...) abre o arquivo' },
      { forma: 'passo', texto: 'Lê ou escreve dentro do bloco' },
      { forma: 'passo', texto: 'O bloco termina' },
      { forma: 'fim', texto: 'O arquivo é fechado automaticamente' },
    ],
    descricao: 'O with garante o fechamento, mesmo se acontecer um erro no bloco.',
  },
  exemplo: {
    titulo: 'Média das notas de um arquivo',
    codigo: {
      linguagem: 'python',
      fonte:
        'total = 0\nqtd = 0\nwith open("notas.txt", encoding="utf-8") as f:\n    for linha in f:\n        nome, nota = linha.strip().split(",")\n        total += int(nota)\n        qtd += 1\nprint(total / qtd)',
    },
    comentarios: [
      { linha: 3, texto: 'Abre para leitura e fecha sozinho no final.' },
      { linha: 5, texto: 'Tira o \\n e separa nome e nota pela vírgula.' },
      { linha: 6, texto: 'int converte o texto em número antes de somar.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'with open("a.txt", "w") as f:\n    f.write("oi")\nwith open("a.txt") as f:\n    print(f.read())',
      ['oi'],
      'Grava "oi" e depois lê o conteúdo de volta.',
      [{ resposta: 'a.txt', feedback: 'a.txt é o nome do arquivo; read devolve o conteúdo.' }],
      [],
      'python',
    ),
    mc(
      'Qual modo apaga o conteúdo anterior do arquivo?',
      '"w"',
      [
        ['"r"', 'O modo "r" só lê.'],
        ['"a"', 'O modo "a" acrescenta no fim.'],
      ],
      'Use "w" com cuidado: ele sobrescreve.',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'print(len("a\\nb\\nc".splitlines()))',
      ['3'],
      'splitlines separa nas quebras de linha: a, b e c.',
      [
        {
          resposta: '5',
          feedback: '5 é o tamanho do texto com as quebras; splitlines conta linhas.',
        },
      ],
      [],
      'python',
    ),
    completar(
      'Complete para abrir o arquivo com fechamento automático.',
      'with ___("dados.txt") as f:\n    print(f.read())',
      [{ aceitas: ['open'], feedback: 'open abre o arquivo.' }],
      'with open(...) as f é o padrão.',
      'python',
    ),
  ],
  desafio: ordenar(
    'Ordene os passos para somar os números de um arquivo.',
    [
      'Abrir o arquivo com with open',
      'Percorrer cada linha',
      'Converter o texto da linha em número',
      'Somar ao total',
      'Mostrar o total',
    ],
    'Abrir, percorrer, converter, somar e mostrar: um padrão de processamento de dados.',
  ),
  rec: [
    mc(
      'Por que usar with ao abrir arquivos?',
      'Ele fecha o arquivo automaticamente',
      [
        ['Deixa o arquivo mais rápido', 'O objetivo é fechar com segurança.'],
        ['Cria o arquivo se não existir', 'Isso depende do modo, não do with.'],
      ],
      'Mesmo com erro no bloco, o arquivo é fechado.',
    ),
    associar(
      'Associe o modo de abertura ao efeito.',
      [
        ['"r"', 'Lê; falha se o arquivo não existe'],
        ['"w"', 'Apaga o conteúdo e escreve do zero'],
        ['"a"', 'Acrescenta ao final'],
      ],
      'Os três modos principais.',
    ),
  ],
  explique: {
    enunciado: 'Explique a diferença entre os modos "w" e "a" ao abrir um arquivo.',
    modelo:
      'O modo "w" apaga o conteúdo existente e começa um arquivo do zero, enquanto o modo "a" mantém o conteúdo e acrescenta o novo texto no final.',
    rubrica: [
      'Disse que "w" sobrescreve',
      'Disse que "a" acrescenta no fim',
      'Alertou sobre o risco de perder dados com "w"',
    ],
  },
  resumo: [
    'open(caminho, modo) abre; with fecha sozinho.',
    'Modos: "r" ler, "w" sobrescrever, "a" acrescentar.',
    'for linha in f lê linha a linha.',
    'Use encoding="utf-8" e strip() para o \\n.',
  ],
  cards: [
    ['Como abrir um arquivo com segurança?', 'with open(caminho) as f:'],
    ['Que modo sobrescreve?', '"w"'],
    ['Que modo acrescenta?', '"a"'],
    ['Como ler linha a linha?', 'for linha in f:'],
  ],
  conexoes: {
    disciplinas: [
      'Sistemas Operacionais: arquivos, caminhos e permissões.',
      'JavaScript: no Node, fs.readFile; no navegador, localStorage.',
      'Engenharia de Dados: ler CSV e JSON é o começo de todo pipeline.',
    ],
    profissional:
      'Automação de planilhas, logs e relatórios começa abrindo, lendo e gravando arquivos.',
  },
});
