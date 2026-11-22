import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j14 = montar({
  id: 'javascript.m03.a04',
  titulo: 'Projeto: consumindo uma API',
  objetivo:
    'Entender requisições HTTP com fetch, ler respostas JSON e transformar os dados para exibir.',
  pre: ['javascript.m03.a03', 'javascript.m02.a05'],
  min: 35,
  diag: mc(
    'O que é uma API web?',
    'Um endereço que recebe pedidos e devolve dados, geralmente em JSON',
    [
      [
        'Um tipo de navegador usado só por desenvolvedores',
        'API é uma interface de pedidos e respostas.',
      ],
      ['Um programa de edição de imagens que roda na web', 'API não tem relação com imagens.'],
    ],
    'APIs permitem que programas conversem entre si pela internet.',
  ),
  simples: {
    titulo: 'Fazer um pedido ao garçom',
    texto:
      'Uma **API** é como o garçom: você faz um pedido (requisição) em um endereço (URL), e ele volta com a resposta, quase sempre em **JSON**.\n\n```\nasync function carregar() {\n  const resposta = await fetch("https://api.exemplo.com/usuarios");\n  if (!resposta.ok) throw new Error("Erro " + resposta.status);\n  const usuarios = await resposta.json();\n  return usuarios.map((u) => u.nome);\n}\n```\n\nMétodos HTTP: `GET` (ler), `POST` (criar), `PUT` (substituir), `DELETE` (apagar). Códigos: 200 ok, 404 não achou, 500 erro do servidor.',
    essencial: 'fetch pede, await espera, json() converte. Confira resposta.ok. GET lê; POST cria.',
    guiado:
      'Para consumir uma API:\n1. Leia a documentação (URL e formato).\n2. `await fetch(url)`.\n3. Verifique `resposta.ok`.\n4. `await resposta.json()`.\n5. Use map e filter nos dados.',
    tecnico:
      'Para enviar dados: `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })`. O navegador aplica CORS: o servidor precisa autorizar a origem. Chaves de API secretas não devem ficar no código do navegador. Respeite limites de requisições (rate limit).',
  },
  analogia: {
    titulo: 'Cardápio e garçom',
    texto:
      'A documentação da API é o cardápio: diz o que pode ser pedido. fetch é chamar o garçom; o JSON é o prato; o código de status avisa se o pedido deu certo ou se acabou.',
    limites:
      'O garçom pode demorar ou não aparecer (falha de rede), então o app precisa tratar a espera e o erro.',
  },
  demo: {
    titulo: 'Tratando uma resposta',
    instrucoes:
      'O console aqui bloqueia a rede, então o código simula uma resposta JSON já recebida. Treine a transformação dos dados.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const resposta = `[\n  {"id":1,"nome":"Ana","ativo":true},\n  {"id":2,"nome":"Rick","ativo":false},\n  {"id":3,"nome":"Bia","ativo":true}\n]`;\nconst usuarios = JSON.parse(resposta);\nconst ativos = usuarios.filter((u) => u.ativo).map((u) => u.nome);\nconsole.log(ativos);\nconsole.log(usuarios.length);',
    },
  },
  tecnica: {
    titulo: 'Anatomia de uma requisição',
    texto:
      '**URL:** `https://api.exemplo.com/usuarios?pagina=2` (o `?` abre parâmetros).\n**Método:** GET, POST...\n**Cabeçalhos:** metadados (tipo do conteúdo, autenticação).\n**Corpo:** dados enviados (POST).\n**Status:** 2xx sucesso, 4xx erro do cliente, 5xx erro do servidor.',
  },
  diagrama: {
    titulo: 'Ciclo de uma consulta',
    nos: [
      { forma: 'inicio', texto: 'O app chama fetch(url)' },
      { forma: 'passo', texto: 'O servidor processa e responde com status e JSON' },
      { forma: 'decisao', texto: 'resposta.ok?' },
      { forma: 'fim', texto: 'Sim: json() e exibir; Não: mostrar mensagem de erro' },
    ],
    descricao:
      'O app pede, o servidor responde, e o código confere o status antes de usar os dados.',
  },
  exemplo: {
    titulo: 'Enviando um dado com POST',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const r = await fetch("/api/tarefas", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ texto: "Estudar" }),\n});\nconsole.log(r.status);',
    },
    comentarios: [
      { linha: 2, texto: 'POST cria um recurso.' },
      { linha: 3, texto: 'Informa que o corpo é JSON.' },
      { linha: 4, texto: 'O corpo precisa ser texto: stringify.' },
    ],
  },
  guiado: [
    mc(
      'Qual status HTTP significa "não encontrado"?',
      '404',
      [
        ['200', '200 significa sucesso.'],
        ['500', '500 é erro interno do servidor.'],
      ],
      '4xx são erros do cliente; 404 é recurso inexistente.',
    ),
    prever(
      'Qual método HTTP serve para LER dados?',
      'método = ?',
      ['GET', 'get'],
      'GET lê; POST cria.',
      [{ resposta: 'POST', feedback: 'POST envia dados para criar algo.' }],
    ),
  ],
  indep: [
    completar(
      'Complete a leitura da resposta.',
      'const resposta = ___ fetch(url);\nconst dados = await resposta.___();',
      [
        { aceitas: ['await'], feedback: 'await espera a Promise do fetch.' },
        { aceitas: ['json'], feedback: 'json() converte o corpo em objeto.' },
      ],
      'await espera, e json() lê o JSON da resposta.',
      'javascript',
    ),
    associar(
      'Associe o código de status ao significado.',
      [
        ['200', 'Sucesso'],
        ['404', 'Recurso não encontrado'],
        ['500', 'Erro interno do servidor'],
        ['401', 'Não autenticado'],
      ],
      'Códigos 2xx, 4xx e 5xx indicam sucesso, erro do cliente e erro do servidor.',
    ),
  ],
  desafio: programaJs(
    'Escreva nomesAtivos(texto): o texto é JSON de uma lista de { nome, ativo }. Devolva só os nomes dos usuários ativos, na ordem original.',
    'function nomesAtivos(texto) {\n  // seu código aqui\n}',
    'function nomesAtivos(texto) {\n  return JSON.parse(texto)\n    .filter((u) => u.ativo)\n    .map((u) => u.nome);\n}',
    'nomesAtivos',
    [
      {
        argumentos: ['[{"nome":"Ana","ativo":true},{"nome":"Rick","ativo":false}]'],
        esperado: ['Ana'],
      },
      { argumentos: ['[]'], esperado: [] },
      {
        argumentos: ['[{"nome":"A","ativo":true},{"nome":"B","ativo":true}]'],
        esperado: ['A', 'B'],
      },
    ],
    ['Faça o parse do texto.', 'filter pelos ativos e map para pegar o nome.'],
    'parse, filter e map: o trio básico para tratar respostas de APIs.',
  ),
  rec: [
    mc(
      'Por que verificar resposta.ok?',
      'Porque o fetch não rejeita a Promise em erros HTTP como 404',
      [
        [
          'Porque o fetch sempre falha quando o servidor demora',
          'O fetch só rejeita em falhas de rede.',
        ],
        [
          'Porque o json() só existe se resposta.ok for verdadeiro',
          'O json() existe sempre; o ok revela o erro HTTP.',
        ],
      ],
      'Só falhas de rede rejeitam a Promise.',
    ),
    mc(
      'Onde NÃO se deve colocar uma chave secreta de API?',
      'No código JavaScript do navegador',
      [
        ['No servidor', 'O servidor é o lugar adequado.'],
        ['Em variáveis de ambiente do servidor', 'É uma boa prática.'],
      ],
      'Qualquer pessoa pode ler o código do navegador.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique os passos para ler dados de uma API com fetch.',
    modelo:
      'Chama-se fetch com a URL usando await, confere-se resposta.ok para tratar erros HTTP, converte-se o corpo com resposta.json() e usa-se map e filter para transformar os dados. Tudo dentro de try/catch para falhas de rede.',
    rubrica: [
      'Citou fetch com await',
      'Citou conferir resposta.ok ou tratar erros',
      'Citou json() e uso dos dados',
    ],
  },
  resumo: [
    'fetch + await + json() leem APIs.',
    'Confira resposta.ok.',
    'GET lê, POST cria.',
    'Chaves secretas não ficam no navegador.',
  ],
  cards: [
    ['Como ler JSON de uma API?', 'await fetch(url) e await resposta.json()'],
    ['O que significa 404?', 'Recurso não encontrado.'],
    ['GET ou POST para criar?', 'POST.'],
    ['O que CORS controla?', 'Quais origens podem acessar a API pelo navegador.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos (DNS e HTTP): fetch usa o protocolo HTTP.',
      'Python: bibliotecas como requests fazem o mesmo.',
      'Segurança: autenticação e CORS protegem APIs.',
    ],
    profissional: 'Integrar APIs é uma das tarefas mais comuns de quem desenvolve software.',
  },
});
