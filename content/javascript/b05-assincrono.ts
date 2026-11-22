import { associar, mc, montar, ordenar, prever } from '../fundamentos/montar';

export const j10 = montar({
  id: 'javascript.m02.a05',
  titulo: 'Assíncrono: Promises e async/await',
  objetivo: 'Entender por que algumas tarefas esperam, e usar Promises, async e await.',
  pre: ['javascript.m02.a04'],
  min: 35,
  diag: mc(
    'Por que buscar dados em um servidor não deve travar a página?',
    'Porque a resposta demora; o navegador continua trabalhando enquanto espera',
    [
      [
        'Porque o servidor sempre responde rápido e não causa atrasos',
        'A resposta demora e é imprevisível.',
      ],
      [
        'Porque a página não depende dos dados para funcionar',
        'A página precisa dos dados; o ponto é não travar enquanto espera.',
      ],
    ],
    'Operações assíncronas deixam o programa seguir em frente e retomam quando o resultado chega.',
  ),
  simples: {
    titulo: 'Pedir comida e continuar a conversa',
    texto:
      'Em um restaurante, você faz o pedido e **continua conversando** até o prato chegar. Em JavaScript, tarefas demoradas (rede, temporizador) são **assíncronas**: o código segue e o resultado é entregue depois.\n\nUma **Promise** representa um resultado futuro. Com `async/await` o código fica parecido com o normal:\n\n```\nasync function buscar() {\n  const resposta = await fetch("/dados");\n  const dados = await resposta.json();\n  console.log(dados);\n}\n```\n\n`await` pausa **só aquela função** até a Promise terminar.',
    essencial:
      'Assíncrono = esperar sem travar. Promise = resultado futuro. await espera dentro de função async.',
    guiado:
      'Para buscar dados:\n1. Declare `async function`.\n2. Use `await fetch(url)`.\n3. Converta com `await resposta.json()`.\n4. Cerque com try/catch para tratar falhas de rede.',
    tecnico:
      'JavaScript roda em uma única linha de execução e usa um laço de eventos (event loop): tarefas demoradas são entregues ao navegador e, ao terminarem, seus callbacks entram numa fila. Promises têm três estados: pendente, cumprida e rejeitada. `.then/.catch` e `async/await` são duas sintaxes para o mesmo mecanismo. setTimeout agenda uma função para depois; mesmo com 0 ms ela roda depois do código síncrono.',
  },
  analogia: {
    titulo: 'Senha da lanchonete',
    texto:
      'Você pede o lanche e recebe uma senha (a Promise). Vai sentar e fazer outras coisas. Quando o pedido fica pronto, chamam sua senha (a Promise é cumprida). Se faltar ingrediente, avisam (rejeitada).',
    limites:
      'Na lanchonete só você espera; em JavaScript uma função com await pausa, mas o resto do programa segue.',
  },
  demo: {
    titulo: 'Veja a ordem de execução',
    instrucoes:
      'No editor web, execute `<script> console.log("1"); setTimeout(() => console.log("2"), 0); Promise.resolve().then(() => console.log("3")); console.log("4"); </script>` e observe a ordem no console do navegador (F12). Depois tente prever antes de olhar.',
    simulacao: { tipo: 'web' },
  },
  tecnica: {
    titulo: 'Ordem e tratamento',
    texto:
      '**Ordem:** código síncrono primeiro; depois as Promises (microtarefas); depois os timers (tarefas).\n**Erros:** `try { await ... } catch (e) { ... }` ou `.catch`.\n**Em paralelo:** `await Promise.all([a, b])` espera várias.\n**fetch:** só rejeita em falha de rede; verifique `resposta.ok` para erros HTTP.',
  },
  diagrama: {
    titulo: 'Vida de uma requisição',
    nos: [
      { forma: 'inicio', texto: 'O código chama fetch e recebe uma Promise' },
      { forma: 'passo', texto: 'O programa segue executando outras coisas' },
      { forma: 'decisao', texto: 'A resposta chegou?' },
      { forma: 'fim', texto: 'Sim: o código após o await retoma com o resultado' },
    ],
    descricao:
      'A chamada devolve uma Promise, o programa continua, e quando a resposta chega o código após o await é retomado.',
  },
  exemplo: {
    titulo: 'Buscar com tratamento de erro',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'async function carregar() {\n  try {\n    const resposta = await fetch("/api/produtos");\n    if (!resposta.ok) throw new Error("HTTP " + resposta.status);\n    const itens = await resposta.json();\n    console.log(itens.length);\n  } catch (e) {\n    console.log("Falhou:", e.message);\n  }\n}\ncarregar();',
    },
    comentarios: [
      { linha: 3, texto: 'await pausa a função até chegar a resposta.' },
      { linha: 4, texto: 'fetch só rejeita em falha de rede; erros HTTP exigem esta checagem.' },
      { linha: 8, texto: 'Qualquer falha cai no catch.' },
    ],
  },
  guiado: [
    prever(
      'Qual é a ordem de saída?',
      'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");',
      ['A C B', 'ACB', 'A\nC\nB'],
      'O código síncrono (A, C) roda primeiro; o timer, mesmo com 0 ms, roda depois.',
      [{ resposta: 'A B C', feedback: 'setTimeout sempre espera o código síncrono terminar.' }],
      [],
      'javascript',
    ),
    mc(
      'O que o await faz?',
      'Pausa a função async até a Promise ser resolvida',
      [
        ['Cancela a Promise se ela demorar mais que o esperado', 'O await espera, não cancela.'],
        ['Trava todo o navegador até a Promise ser resolvida', 'Ele só pausa a função async.'],
      ],
      'await só pode ser usado dentro de funções async.',
    ),
  ],
  indep: [
    prever(
      'Qual é a ordem de saída?',
      'console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);',
      ['1 3 2', '132', '1\n3\n2'],
      'O then roda depois do código síncrono atual.',
      [
        {
          resposta: '1 2 3',
          feedback: 'O callback do then só executa quando o código síncrono acaba.',
        },
      ],
      [],
      'javascript',
    ),
    ordenar(
      'Coloque em ordem o que acontece ao buscar dados com async/await.',
      [
        'A função chama fetch e recebe uma Promise',
        'O await pausa a função, e o programa segue com outras tarefas',
        'A resposta chega e a Promise é cumprida',
        'A função retoma e usa os dados',
      ],
      'A pausa do await não trava o resto do programa; ao receber a resposta, a função continua.',
    ),
  ],
  desafio: associar(
    'Associe cada termo à sua função.',
    [
      ['Promise', 'Representa um resultado que chegará no futuro'],
      ['await', 'Pausa a função async até o resultado chegar'],
      ['catch', 'Trata uma falha ou rejeição'],
      ['setTimeout', 'Agenda uma função para executar depois'],
    ],
    'Esses quatro elementos formam a base do código assíncrono.',
  ),
  rec: [
    mc(
      'Quais são os estados de uma Promise?',
      'Pendente, cumprida e rejeitada',
      [
        [
          'Ligada e desligada, conforme a conexão com o servidor',
          'Os estados são pendente, cumprida e rejeitada.',
        ],
        [
          'Inicial e final, indicando o começo e o fim da operação',
          'Os estados são pendente, cumprida e rejeitada.',
        ],
      ],
      'Pendente enquanto espera; cumprida com sucesso; rejeitada com erro.',
    ),
    mc(
      'Em qual caso o fetch rejeita a Promise?',
      'Quando há falha de rede',
      [
        [
          'Quando o servidor responde 404',
          'Respostas HTTP de erro não rejeitam; verifique resposta.ok.',
        ],
        ['Sempre que a resposta demora', 'Demora não é erro.'],
      ],
      'Por isso se confere resposta.ok.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique por que o código assíncrono é necessário e o que faz o await.',
    modelo:
      'Tarefas como acessar a rede demoram. Se o programa esperasse parado, a página travaria. O código assíncrono deixa o resto continuar, e o await pausa apenas a função até a Promise ter resultado.',
    rubrica: [
      'Citou que tarefas demoram',
      'Citou evitar travar a página',
      'Explicou o await como pausa da função',
    ],
  },
  resumo: [
    'Assíncrono evita travar enquanto se espera.',
    'Promise = resultado futuro.',
    'await pausa só a função async.',
    'Trate falhas com try/catch.',
  ],
  cards: [
    ['O que é uma Promise?', 'Um resultado que chegará no futuro.'],
    ['O que faz o await?', 'Espera a Promise dentro de função async.'],
    ['Qual vem primeiro, código síncrono ou setTimeout(0)?', 'O código síncrono.'],
    ['fetch rejeita em erro HTTP 404?', 'Não; só em falha de rede.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos (DNS e HTTP): fetch faz requisições HTTP.',
      'Python: asyncio tem o mesmo conceito.',
      'Sistemas operacionais: o escalonador também intercala tarefas que esperam.',
    ],
    profissional:
      'Quase todo app conversa com servidores. Dominar async/await é essencial para qualquer trabalho com web e APIs.',
  },
});
