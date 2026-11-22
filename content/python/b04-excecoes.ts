import { associar, completar, mc, montar, prever } from '../fundamentos/montar';

export const p09 = montar({
  id: 'python.m02.a04',
  titulo: 'Python: tratando erros com try e except',
  objetivo: 'Capturar e tratar exceções com try/except/else/finally e lançar erros com raise.',
  pre: ['python.m02.a03'],
  min: 25,
  diag: mc(
    'O que acontece quando um erro não é tratado?',
    'O programa para e mostra uma mensagem de erro',
    [
      ['O programa ignora o erro e continua na linha seguinte', 'Sem tratamento, o programa para.'],
      [
        'O computador reinicia para limpar o estado do programa',
        'Um erro de programa não reinicia o computador.',
      ],
    ],
    'Tratar o erro permite continuar ou avisar com clareza.',
  ),
  simples: {
    titulo: 'Plano B para o inesperado',
    texto:
      'Entradas ruins acontecem: um texto onde era número, um arquivo ausente. Em Python você prepara um **plano B**:\n\n```\ntry:\n    n = int(input("Idade: "))\nexcept ValueError:\n    print("Digite um número.")\nelse:\n    print("Ano que vem:", n + 1)\nfinally:\n    print("Fim")\n```\n\n- **try:** o que pode falhar.\n- **except:** o que fazer se falhar.\n- **else:** se NÃO falhou.\n- **finally:** sempre roda.',
    essencial:
      'try tenta; except trata o erro; else roda se deu certo; finally roda sempre. raise lança um erro seu.',
    guiado:
      'Para proteger uma conversão:\n1. Ponha o código arriscado no `try`.\n2. Capture o erro **específico** no `except` (ex.: ValueError).\n3. Dê uma resposta útil ao usuário.\n4. Use `finally` para limpezas.',
    tecnico:
      'Capture tipos específicos (ValueError, KeyError, FileNotFoundError, ZeroDivisionError). Um `except:` genérico esconde bugs reais. Você pode lançar erros com `raise ValueError("idade negativa")` e criar exceções próprias herdando de `Exception`. Em Python vale o estilo EAFP ("é mais fácil pedir perdão que permissão"): tente e trate, em vez de checar tudo antes.',
  },
  analogia: {
    titulo: 'Rede de proteção no circo',
    texto:
      'O trapezista (try) faz a acrobacia arriscada. A rede (except) pega a queda e evita o desastre. O aplauso final (finally) acontece de qualquer jeito, caindo ou não.',
    limites:
      'A rede deve ser para quedas previstas: erros de programação precisam ser corrigidos, não escondidos.',
  },
  demo: {
    titulo: 'O equivalente em JavaScript',
    instrucoes: 'O try/catch/finally de JavaScript é o primo do try/except/finally de Python.',
    simulacao: {
      tipo: 'js',
      codigo:
        '// Python: try / except ValueError / finally\nfunction lerNumero(texto) {\n  const n = Number(texto);\n  if (Number.isNaN(n)) throw new Error("não é número");\n  return n;\n}\nfor (const entrada of ["7", "abc"]) {\n  try {\n    console.log("ok:", lerNumero(entrada) + 1);\n  } catch (e) {\n    console.log("erro:", e.message);\n  } finally {\n    console.log("fim de", entrada);\n  }\n}',
    },
  },
  tecnica: {
    titulo: 'Erros comuns',
    texto:
      '`ValueError`: valor inadequado (`int("abc")`).\n`ZeroDivisionError`: divisão por zero.\n`IndexError`: posição inexistente na lista.\n`KeyError`: chave inexistente no dicionário.\n`FileNotFoundError`: arquivo ausente.\n`except (A, B):` trata mais de um tipo.\n`except ValueError as e:` dá acesso à mensagem.',
  },
  diagrama: {
    titulo: 'Fluxo do try/except',
    nos: [
      { forma: 'inicio', texto: 'Executa o bloco try' },
      { forma: 'decisao', texto: 'Ocorreu uma exceção?' },
      { forma: 'passo', texto: 'Sim: pula para o except; Não: executa o else' },
      { forma: 'fim', texto: 'O finally roda nos dois casos' },
    ],
    descricao: 'O caminho muda conforme o erro acontece, mas o finally sempre roda.',
  },
  exemplo: {
    titulo: 'Divisão segura',
    codigo: {
      linguagem: 'python',
      fonte:
        'def dividir(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\nprint(dividir(10, 2))\nprint(dividir(1, 0))',
    },
    comentarios: [
      { linha: 3, texto: 'Se b for diferente de zero, devolve o resultado.' },
      { linha: 5, texto: 'Se b for zero, devolve None em vez de quebrar.' },
      { linha: 8, texto: 'Mostra 5.0 e depois None.' },
    ],
  },
  guiado: [
    prever(
      'O que o código mostra?',
      'try:\n    n = int("abc")\nexcept ValueError:\n    print("inválido")',
      ['inválido', 'invalido'],
      'int("abc") lança ValueError, tratado pelo except.',
      [{ resposta: 'abc', feedback: 'O erro interrompe o try antes de qualquer print do valor.' }],
      [],
      'python',
    ),
    prever(
      'O que o código mostra?',
      'try:\n    n = int("7")\nexcept ValueError:\n    print("erro")\nelse:\n    print(n + 1)',
      ['8'],
      'A conversão funcionou, então roda o else: 7 + 1.',
      [{ resposta: 'erro', feedback: '"7" é um número válido, então não há exceção.' }],
      [],
      'python',
    ),
  ],
  indep: [
    prever(
      'O que o código mostra?',
      'try:\n    x = [1, 2][5]\nexcept IndexError:\n    print("fora")',
      ['fora'],
      'A lista só tem posições 0 e 1, então o índice 5 lança IndexError.',
      [{ resposta: 'erro', feedback: 'O erro foi tratado e o print do except roda.' }],
      [],
      'python',
    ),
    completar(
      'Complete para tratar a divisão por zero.',
      'try:\n    r = 10 / 0\n___ ZeroDivisionError:\n    r = 0',
      [{ aceitas: ['except'], feedback: 'except captura o erro do try.' }],
      'A estrutura é try ... except TipoDoErro.',
      'python',
    ),
  ],
  desafio: associar(
    'Associe cada situação ao erro do Python.',
    [
      ['int("abc")', 'ValueError'],
      ['10 / 0', 'ZeroDivisionError'],
      ['[1, 2][9]', 'IndexError'],
      ['{"a": 1}["b"]', 'KeyError'],
    ],
    'Reconhecer o tipo do erro ajuda a tratá-lo com precisão.',
  ),
  rec: [
    mc(
      'Qual bloco roda sempre, com ou sem erro?',
      'finally, que roda com ou sem erro',
      [
        [
          'else, que roda só quando nenhum erro aconteceu',
          'O else roda só sem erro; o finally roda sempre.',
        ],
        ['except, que roda só quando acontece um erro', 'O except roda só quando há erro.'],
      ],
      'Use finally para limpezas, como fechar recursos.',
    ),
    mc(
      'Por que evitar um except genérico, sem tipo?',
      'Porque esconde erros de programação',
      [
        [
          'Porque o except genérico deixa o programa mais lento',
          'O problema é esconder erros de programação.',
        ],
        [
          'Porque o Python não permite um except sem tipo',
          'Ele permite, mas não é uma boa prática.',
        ],
      ],
      'Trate o erro específico que você espera.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem try, except, else e finally.',
    modelo:
      'O try contém o código que pode falhar. O except trata o erro, se ocorrer. O else roda quando não houve erro. O finally roda sempre, por exemplo para liberar recursos.',
    rubrica: ['Explicou try e except', 'Explicou else', 'Explicou finally'],
  },
  resumo: [
    'try tenta; except trata; else roda sem erro; finally roda sempre.',
    'Capture tipos específicos de erro.',
    'raise lança um erro seu.',
    'Não esconda bugs com except genérico.',
  ],
  cards: [
    ['Qual bloco trata o erro?', 'except'],
    ['Qual bloco roda sempre?', 'finally'],
    ['Como lançar um erro?', 'raise ValueError("mensagem")'],
    ['Erro de int("abc")?', 'ValueError'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: try/catch/finally e throw.',
      'Lógica de Programação: tratar casos excepcionais é parte do algoritmo.',
      'Engenharia de Dados: pipelines precisam sobreviver a linhas ruins.',
    ],
    profissional:
      'Programas profissionais tratam erros de entrada, rede e arquivos e deixam mensagens claras nos logs.',
  },
});
