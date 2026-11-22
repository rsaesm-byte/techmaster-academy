import { mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j09 = montar({
  id: 'javascript.m02.a04',
  titulo: 'Erros e try/catch',
  objetivo: 'Entender mensagens de erro, tratar falhas com try/catch e lançar erros com throw.',
  pre: ['javascript.m02.a01', 'javascript.m01.a04'],
  min: 30,
  diag: mc(
    'O que acontece com o programa quando ocorre um erro não tratado?',
    'A execução para naquele ponto e o erro aparece no console',
    [
      ['Ele continua normalmente na linha seguinte ao erro', 'Sem tratamento, a execução para.'],
      [
        'Ele reinicia sozinho para tentar se recuperar do erro',
        'O JavaScript não reinicia o programa.',
      ],
    ],
    'Erros não tratados interrompem a execução. Com try/catch o programa pode se recuperar.',
  ),
  simples: {
    titulo: 'Rede de segurança',
    texto:
      'Falhas acontecem: um JSON inválido, uma conta com dado ausente. Com **try/catch** você tenta executar e, se algo der errado, trata:\n\n```\ntry {\n  const dados = JSON.parse(texto);\n} catch (erro) {\n  console.log("Texto inválido");\n}\n```\n\nVocê também pode **lançar** erros: `throw new Error("mensagem")`.',
    essencial:
      'try executa; catch trata a falha; throw lança um erro. Sem tratamento, o programa para.',
    guiado:
      'Para proteger um trecho arriscado:\n1. Coloque-o dentro de `try { }`.\n2. Em `catch (erro) { }`, decida o que fazer (mensagem, valor padrão).\n3. Use `erro.message` para ver o motivo.',
    tecnico:
      'Tipos comuns: SyntaxError (código ou JSON inválido), TypeError (usar algo de forma errada, como chamar propriedade de undefined), ReferenceError (variável inexistente), RangeError (valor fora da faixa). `finally` roda sempre, com ou sem erro. Capture só o que sabe tratar; esconder erros com catch vazio dificulta achar problemas.',
  },
  analogia: {
    titulo: 'Rede do trapezista',
    texto:
      'O trapezista tenta o salto (try). Se cair, a rede (catch) o segura e o show continua. O throw é quem grita "caí!" para chamar a rede.',
    limites:
      'Uma rede mal posta (catch vazio) esconde a queda e ninguém descobre por que o número falhou.',
  },
  demo: {
    titulo: 'Provoque e trate erros',
    instrucoes:
      'Execute e veja o erro tratado. Depois remova o try/catch e observe o programa parar com o erro.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function lerJson(texto) {\n  try {\n    return JSON.parse(texto);\n  } catch (erro) {\n    console.log("Falha:", erro.name);\n    return null;\n  }\n}\nconsole.log(lerJson("{\\"a\\":1}"));\nconsole.log(lerJson("{a:1}"));\nfinally_demo();\nfunction finally_demo() {\n  try {\n    throw new Error("ops");\n  } catch (e) {\n    console.log(e.message);\n  } finally {\n    console.log("sempre roda");\n  }\n}',
    },
  },
  tecnica: {
    titulo: 'try, catch, finally e throw',
    texto:
      '**Valor padrão:** devolva `null` ou um padrão no catch.\n**Validar entrada:** `if (!Number.isFinite(n)) throw new Error("número inválido")`.\n**finally:** limpeza que sempre ocorre.\n**Mensagem:** `erro.message`; tipo: `erro.name`.\n**Não faça:** `catch (e) {}` vazio.',
  },
  diagrama: {
    titulo: 'Caminho com e sem erro',
    nos: [
      { forma: 'inicio', texto: 'Entra no try' },
      { forma: 'decisao', texto: 'Ocorreu um erro?' },
      { forma: 'passo', texto: 'Sim: salta para o catch e trata' },
      { forma: 'fim', texto: 'Não: segue até o fim; o finally roda nos dois casos' },
    ],
    descricao:
      'Se não há erro, o try termina normalmente. Se há, o catch assume. O finally roda sempre.',
  },
  exemplo: {
    titulo: 'Dividir com segurança',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function dividir(a, b) {\n  if (b === 0) {\n    throw new Error("divisão por zero");\n  }\n  return a / b;\n}\ntry {\n  console.log(dividir(10, 0));\n} catch (e) {\n  console.log(e.message);\n}',
    },
    comentarios: [
      { linha: 3, texto: 'throw interrompe a função e sinaliza o problema.' },
      { linha: 9, texto: 'catch recebe o erro. Mostra: divisão por zero.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'try {\n  throw new Error("x");\n} catch (e) {\n  console.log("tratado");\n}',
      ['tratado'],
      'O throw salta para o catch.',
      [{ resposta: 'x', feedback: 'O que é mostrado é a string "tratado", não a mensagem.' }],
      [],
      'javascript',
    ),
    prever(
      'O que aparece, em ordem, no console?',
      'try {\n  console.log("a");\n} finally {\n  console.log("b");\n}',
      ['a b', 'a\nb', 'ab'],
      'O try roda e depois o finally, sempre.',
      [],
      [],
      'javascript',
    ),
  ],
  indep: [
    prever(
      'O que aparece no console?',
      'try {\n  JSON.parse("oi");\n} catch (e) {\n  console.log(e.name);\n}',
      ['SyntaxError'],
      'Texto que não é JSON válido gera SyntaxError.',
      [
        {
          resposta: 'TypeError',
          feedback: 'TypeError ocorre ao usar valor do tipo errado; aqui o texto é que é inválido.',
        },
      ],
      [],
      'javascript',
    ),
    programaJs(
      'Escreva lerJsonSeguro(texto): devolve o resultado de JSON.parse(texto); se o texto for inválido, devolve null.',
      'function lerJsonSeguro(texto) {\n  // seu código aqui\n}',
      'function lerJsonSeguro(texto) {\n  try {\n    return JSON.parse(texto);\n  } catch (erro) {\n    return null;\n  }\n}',
      'lerJsonSeguro',
      [
        { argumentos: ['{"a":1}'], esperado: { a: 1 } },
        { argumentos: ['isto não é json'], esperado: null },
        { argumentos: ['[1,2]'], esperado: [1, 2] },
      ],
      ['Coloque JSON.parse dentro de try.', 'No catch, devolva null.'],
      'O try captura o SyntaxError e o catch devolve o valor padrão.',
    ),
  ],
  desafio: programaJs(
    'Escreva tentarDividir(a, b): devolve a / b; se b for 0, devolve o texto "erro". Use throw dentro de uma função auxiliar e try/catch para tratar.',
    'function tentarDividir(a, b) {\n  // seu código aqui\n}',
    'function tentarDividir(a, b) {\n  try {\n    if (b === 0) throw new Error("divisão por zero");\n    return a / b;\n  } catch (e) {\n    return "erro";\n  }\n}',
    'tentarDividir',
    [
      { argumentos: [10, 2], esperado: 5 },
      { argumentos: [1, 0], esperado: 'erro' },
      { argumentos: [0, 4], esperado: 0 },
    ],
    ['Lance o erro com throw quando b for 0.', 'Capture com catch e devolva "erro".'],
    'throw sinaliza o problema e catch o converte no valor "erro".',
  ),
  rec: [
    mc(
      'Quando o bloco finally executa?',
      'Sempre, com ou sem erro',
      [
        ['Só quando há erro', 'Isso é o catch.'],
        ['Só quando não há erro', 'O finally roda nos dois casos.'],
      ],
      'finally serve para limpeza que deve ocorrer de qualquer forma.',
    ),
    mc(
      'Por que um catch vazio é má ideia?',
      'Esconde o erro e dificulta descobrir o problema',
      [
        [
          'Porque causa um erro de sintaxe ao rodar o código',
          'Um catch vazio é válido; o problema é esconder o erro.',
        ],
        [
          'Porque deixa o programa lento ao capturar todos os erros',
          'Não afeta o desempenho, mas esconde falhas.',
        ],
      ],
      'Trate o erro ou registre-o; não o engula em silêncio.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique para que servem try, catch e throw.',
    modelo:
      'try executa um trecho que pode falhar; se der erro, o catch trata e o programa continua. throw lança um erro de propósito quando algo inválido é detectado.',
    rubrica: [
      'Explicou o try',
      'Explicou o catch como tratamento',
      'Explicou o throw como lançar erro',
    ],
  },
  resumo: [
    'try/catch trata falhas sem parar o programa.',
    'throw new Error lança um erro.',
    'finally roda sempre.',
    'Nunca deixe o catch vazio.',
  ],
  cards: [
    ['Para que serve try/catch?', 'Tratar erros sem parar o programa.'],
    ['Como lançar um erro?', 'throw new Error("mensagem")'],
    ['Quando o finally roda?', 'Sempre.'],
    ['Que erro JSON.parse lança em texto inválido?', 'SyntaxError.'],
  ],
  conexoes: {
    disciplinas: [
      'Python: usa try/except, a mesma ideia.',
      'Cibersegurança: validar entradas evita muitos ataques.',
      'Engenharia de Software: bons testes verificam também os casos de erro.',
    ],
    profissional:
      'Sistemas reais recebem dados ruins o tempo todo. Tratar erros bem separa um app confiável de um que quebra.',
  },
});
