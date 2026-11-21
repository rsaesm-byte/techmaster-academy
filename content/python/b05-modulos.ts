import { associar, completar, mc, montar, prever } from '../fundamentos/montar';

export const p10 = montar({
  id: 'python.m02.a05',
  titulo: 'Python: módulos, pip e ambientes virtuais',
  objetivo:
    'Importar módulos, instalar bibliotecas com pip e isolar projetos com ambientes virtuais.',
  pre: ['python.m02.a04'],
  min: 30,
  diag: mc(
    'Para usar funções prontas de outro arquivo ou biblioteca, o que se faz?',
    'import',
    [
      ['include', 'Essa é a palavra de outras linguagens.'],
      ['load', 'Não é a palavra de Python.'],
    ],
    'import traz módulos para o seu código.',
  ),
  simples: {
    titulo: 'Não reinvente a roda',
    texto:
      'Um **módulo** é um arquivo Python com funções prontas. A **biblioteca padrão** já traz muitos:\n\n```\nimport math\nprint(math.sqrt(16))      # 4.0\n\nfrom math import floor\nprint(floor(3.9))         # 3\n\nimport json\nprint(json.dumps({"a": 1}))\n```\n\nPara bibliotecas de terceiros usa-se o **pip** (`pip install requests`), de preferência dentro de um **ambiente virtual** (`python -m venv .venv`).',
    essencial:
      'import traz módulos; pip instala bibliotecas externas; venv isola as dependências de cada projeto.',
    guiado:
      'Para começar um projeto:\n1. `python -m venv .venv` cria o ambiente.\n2. Ative o ambiente.\n3. `pip install biblioteca`.\n4. `pip freeze > requirements.txt` registra as versões.\n5. No código, use `import`.',
    tecnico:
      '`import x` carrega o módulo inteiro (use `x.funcao`); `from x import f` traz só o nome. Cada projeto deve ter seu ambiente virtual para evitar conflito de versões; o `requirements.txt` permite recriar o ambiente com `pip install -r requirements.txt`. O PyPI é o repositório público de pacotes. Seu próprio arquivo `util.py` também é um módulo, e `if __name__ == "__main__":` separa o que roda só quando o arquivo é executado diretamente.',
  },
  analogia: {
    titulo: 'Caixa de ferramentas e oficina',
    texto:
      'A biblioteca padrão é a caixa de ferramentas que já vem com a casa. O pip é a loja onde você compra ferramentas extras. O ambiente virtual é uma bancada separada para cada projeto, para que as ferramentas de um não bagunçem o outro.',
    limites: 'Ferramentas de terceiros precisam ser mantidas e atualizadas.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes:
      'JavaScript tem Math e JSON embutidos, além do npm para bibliotecas externas. Compare com os imports do Python.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: import math; math.sqrt(16)\nconsole.log(Math.sqrt(16));\n// Python: from math import floor\nconsole.log(Math.floor(3.9));\n// Python: import json; json.dumps({"a": 1})\nconsole.log(JSON.stringify({ a: 1 }));\n// Python: json.loads(texto)\nconsole.log(JSON.parse(\'{"b": 2}\').b);',
    },
  },
  tecnica: {
    titulo: 'Módulos úteis da biblioteca padrão',
    texto:
      '`math`: matemática.\n`random`: sorteios.\n`datetime`: datas e horas.\n`json`: ler e gravar JSON.\n`csv`: planilhas em texto.\n`pathlib`: caminhos de arquivos.\n`os`, `sys`: sistema.\nDe terceiros: `requests` (HTTP), `pandas` (dados), `fastapi` (APIs).',
  },
  diagrama: {
    titulo: 'De onde vem o código?',
    nos: [
      { forma: 'inicio', texto: 'Preciso de uma função pronta' },
      { forma: 'decisao', texto: 'Está na biblioteca padrão?' },
      { forma: 'passo', texto: 'Sim: import direto' },
      { forma: 'fim', texto: 'Não: pip install no ambiente virtual e depois import' },
    ],
    descricao: 'Primeiro a biblioteca padrão; depois pacotes externos, instalados com pip.',
  },
  exemplo: {
    titulo: 'Lendo JSON e somando',
    codigo: {
      linguagem: 'python',
      fonte:
        'import json\n\ntexto = \'{"itens": [3, 4, 5]}\'\ndados = json.loads(texto)\nprint(sum(dados["itens"]))',
    },
    comentarios: [
      { linha: 1, texto: 'Traz o módulo json da biblioteca padrão.' },
      { linha: 4, texto: 'loads converte o texto JSON em dicionário Python.' },
      { linha: 5, texto: 'sum soma a lista e mostra 12.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'import math\nprint(math.sqrt(16))',
      ['4.0', '4'],
      'A raiz quadrada de 16 é 4; sqrt devolve um número decimal: 4.0.',
      [{ resposta: '256', feedback: 'sqrt é a raiz quadrada, não o quadrado.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'from math import floor\nprint(floor(3.9))',
      ['3'],
      'floor arredonda para baixo.',
      [{ resposta: '4', feedback: 'floor sempre arredonda para baixo.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'import json\nprint(json.loads(\'{"a": 5}\')["a"])',
      ['5'],
      'loads converte o JSON em dicionário e ["a"] lê o valor 5.',
      [{ resposta: 'a', feedback: 'O que sai é o valor da chave, não a chave.' }],
      [],
      'python',
    ),
    completar(
      'Complete para trazer o módulo json.',
      '___ json',
      [{ aceitas: ['import'], feedback: 'import traz o módulo.' }],
      'A forma é import nome_do_modulo.',
      'python',
    ),
  ],
  desafio: associar(
    'Associe cada comando à sua função.',
    [
      ['python -m venv .venv', 'Cria um ambiente virtual'],
      ['pip install requests', 'Instala uma biblioteca externa'],
      ['pip freeze > requirements.txt', 'Registra as dependências do projeto'],
      ['import json', 'Traz um módulo para o código'],
    ],
    'Esse é o fluxo básico de qualquer projeto Python.',
  ),
  rec: [
    mc(
      'Por que usar um ambiente virtual em cada projeto?',
      'Para isolar as versões das bibliotecas de cada projeto',
      [
        ['Para o código rodar mais rápido', 'O ganho é isolamento, não velocidade.'],
        ['Para não precisar do pip', 'O pip continua sendo usado, dentro do ambiente.'],
      ],
      'Evita conflitos entre projetos que pedem versões diferentes.',
    ),
    mc(
      'Qual a diferença entre import math e from math import floor?',
      'O primeiro traz o módulo (math.floor); o segundo traz só o nome floor',
      [
        ['Não há diferença', 'Muda como você chama a função.'],
        ['O segundo instala o módulo', 'Quem instala é o pip.'],
      ],
      'import traz o módulo; from ... import traz nomes específicos.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique o que são módulos, pip e ambientes virtuais e como se relacionam.',
    modelo:
      'Módulos são arquivos com código reutilizável que se traz com import. O pip instala bibliotecas externas, e o ambiente virtual isola essas instalações por projeto, evitando conflitos de versão. O requirements.txt registra o que o projeto precisa.',
    rubrica: ['Explicou módulos e import', 'Explicou o pip', 'Explicou o ambiente virtual'],
  },
  resumo: [
    'import traz módulos; from ... import traz nomes.',
    'A biblioteca padrão já resolve muita coisa.',
    'pip instala pacotes do PyPI.',
    'venv isola as dependências de cada projeto.',
  ],
  cards: [
    ['Como instalar uma biblioteca?', 'pip install nome'],
    ['Como criar um ambiente virtual?', 'python -m venv .venv'],
    ['Para que serve requirements.txt?', 'Registrar as dependências do projeto.'],
    ['Como ler JSON em Python?', 'json.loads(texto)'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: import/export e npm fazem papel parecido.',
      'Fundamentos: Git e contêineres também isolam e reproduzem ambientes.',
      'Engenharia de Dados e IA: pandas, FastAPI e bibliotecas de IA vêm do pip.',
    ],
    profissional:
      'Ambiente virtual e requirements.txt são o mínimo para qualquer projeto Python que outra pessoa precise rodar.',
  },
});
