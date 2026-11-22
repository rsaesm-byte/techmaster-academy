import { associar, mc, montar, ordenar } from './montar';

export const f09 = montar({
  id: 'fundamentos.m02.a04',
  titulo: 'Como a web funciona: DNS e HTTP',
  objetivo:
    'Descrever o caminho de abrir um site (DNS, conexão, pedido e resposta HTTP) e interpretar códigos de status como 200, 404 e 500.',
  pre: ['fundamentos.m02.a03'],
  min: 30,
  diag: mc(
    'Você digita "exemplo.com.br" no navegador. Qual é o primeiro passo?',
    'Descobrir o endereço IP desse nome',
    [
      [
        'Baixar a página imediatamente',
        'Antes de pedir qualquer coisa, o navegador precisa saber onde o servidor está.',
      ],
      [
        'Perguntar ao seu provedor qual a senha do site',
        'Não há senha nessa etapa: é uma consulta de nome para endereço.',
      ],
    ],
    'O navegador pergunta a um servidor DNS qual é o IP do nome. Só então consegue se conectar.',
  ),
  simples: {
    titulo: 'A lista telefônica e o pedido',
    texto:
      'Pessoas usam **nomes** (exemplo.com.br); redes usam **IPs**. O **DNS** é a "lista telefônica da internet": traduz o nome em IP.\n\nCom o IP, o navegador abre uma conexão (hoje, **segura**, com HTTPS) e faz um **pedido HTTP**: "GET /" (me entregue a página inicial). O servidor devolve uma **resposta** com um **código de status** e o conteúdo (HTML). O navegador lê o HTML e pede o que faltar: estilos, imagens e scripts.',
    essencial:
      'DNS traduz nome em IP. HTTP é pedido (GET) e resposta (200, 404, 500). HTTPS = HTTP com criptografia.',
    guiado:
      'Ao abrir um site:\n1. O navegador pergunta ao DNS o IP do nome.\n2. O DNS responde com o IP.\n3. O navegador conecta ao servidor.\n4. Envia o pedido GET.\n5. O servidor responde com 200 e a página.\n6. O navegador monta a página, pedindo mais arquivos se precisar.',
    tecnico:
      'A resolução DNS usa registros (A para IPv4, AAAA para IPv6, CNAME para apelidos) e guarda respostas em cache por um tempo (TTL). HTTP é um protocolo de pedido e resposta sobre TCP; HTTPS acrescenta TLS, que autentica o servidor por certificado e criptografa os dados. Métodos comuns: GET (ler), POST (enviar), PUT e DELETE. Status: 2xx sucesso, 3xx redirecionamento, 4xx erro do cliente, 5xx erro do servidor.',
  },
  analogia: {
    titulo: 'Ligar para uma loja',
    texto:
      'Você quer falar com a "Loja Exemplo". Primeiro consulta a lista telefônica (DNS) e acha o número (IP). Liga (conexão), faz o pedido ("quero uma pizza": GET) e a loja responde ("pronto, aqui está": 200) ou diz que não tem esse item (404) ou que a cozinha pegou fogo (500).',
    limites:
      'Na vida real, uma ligação ocupa a linha. Na web, cada pedido é independente, e o navegador faz dezenas deles por página. Além disso, o DNS guarda respostas em cache para não consultar toda vez.',
  },
  demo: {
    titulo: 'Acompanhe a abertura de um site',
    instrucoes:
      'Avance passo a passo e observe quem fala com quem: navegador, servidor DNS ou servidor do site. Troque o site e veja o IP mudar. Repare no que cada mensagem pede e devolve.',
    simulacao: { tipo: 'web' },
  },
  tecnica: {
    titulo: 'Códigos de status e URLs',
    texto:
      '**Partes de uma URL:** `https://exemplo.com.br/loja?item=3` → protocolo (https), domínio (exemplo.com.br), caminho (/loja) e parâmetros (?item=3).\n\n**Status mais comuns:**\n- `200 OK`: deu certo.\n- `301`: a página mudou de endereço (redirecionamento).\n- `403`: proibido (falta permissão).\n- `404`: não encontrado (o endereço está errado ou foi removido).\n- `500`: erro interno no servidor.\n\n**Regra de ouro:** 4xx = o problema está no pedido; 5xx = o problema está no servidor.\n\n**Cache:** navegador e DNS guardam respostas para ganhar velocidade; por isso, às vezes, uma mudança demora a aparecer.',
  },
  diagrama: {
    titulo: 'Abrindo uma página',
    nos: [
      { forma: 'inicio', texto: 'Você digita exemplo.com.br' },
      { forma: 'passo', texto: 'DNS: o nome vira um endereço IP' },
      { forma: 'passo', texto: 'Conexão segura (HTTPS) com o servidor' },
      { forma: 'passo', texto: 'Pedido GET e resposta 200 com o HTML' },
      { forma: 'fim', texto: 'O navegador monta e exibe a página' },
    ],
    descricao:
      'O nome digitado é convertido em IP pelo DNS. O navegador abre uma conexão segura com o servidor, envia um pedido GET e recebe a resposta 200 com o HTML. Por fim, monta e exibe a página.',
  },
  exemplo: {
    titulo: 'Um pedido que dá errado',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'GET /produtos/999 HTTP/1.1\nHost: loja.exemplo.com.br\n\nHTTP/1.1 404 Not Found\nContent-Type: text/html',
    },
    comentarios: [
      { linha: 1, texto: 'O navegador pede o produto 999.' },
      { linha: 2, texto: 'O Host indica qual site é: um servidor pode hospedar muitos.' },
      {
        linha: 4,
        texto:
          '404: o servidor está funcionando, mas esse produto não existe. É um erro do pedido, não do servidor.',
      },
    ],
  },
  guiado: [
    mc(
      'Para que serve o DNS?',
      'Para traduzir nomes de sites em endereços IP',
      [
        [
          'Para proteger a conexão com o site, embaralhando os dados trocados',
          'Criptografar é função do TLS (HTTPS), não do DNS.',
        ],
        [
          'Para guardar uma cópia das páginas do site e entregá-las mais rápido',
          'Guardar páginas é papel de cache e do servidor, não do DNS.',
        ],
      ],
      'O DNS funciona como uma lista telefônica: dado o nome, devolve o IP.',
    ),
    mc(
      'O que significa o status 200?',
      'A requisição deu certo',
      [
        ['A página não foi encontrada', 'Esse é o 404.'],
        ['O servidor quebrou', 'Esse é o 500.'],
      ],
      '2xx indica sucesso. O 200 é o "OK" padrão.',
      1,
    ),
  ],
  indep: [
    mc(
      'Um site responde 500. De quem é, provavelmente, o problema?',
      'Do servidor do site, que teve um erro interno',
      [
        [
          'Do seu navegador, que enviou um pedido errado',
          'Pedido errado costuma gerar 4xx. O 5xx indica falha no servidor.',
        ],
        [
          'Do seu cabo de rede',
          'Se houvesse falha na rede, nem chegaria uma resposta com número de status.',
        ],
      ],
      'Códigos 5xx indicam erro do lado do servidor. 4xx indicam problema no pedido.',
    ),
    mc(
      'O que a letra S de HTTPS acrescenta?',
      'Criptografia da conexão (TLS), para ninguém no caminho ler os dados',
      [
        [
          'Mais velocidade ao carregar a página, por usar uma conexão otimizada',
          'O S traz segurança; a velocidade não é o objetivo.',
        ],
        [
          'Um servidor DNS exclusivo para cuidar do domínio do site',
          'O S não tem relação com DNS; trata de segurança.',
        ],
      ],
      'HTTPS usa TLS para autenticar o servidor e criptografar o tráfego.',
      2,
    ),
  ],
  desafio: ordenar(
    'Coloque na ordem o que acontece ao abrir um site.',
    [
      'O navegador pergunta ao DNS o IP do nome',
      'O DNS responde com o endereço IP',
      'O navegador abre a conexão com o servidor',
      'O navegador envia o pedido GET',
      'O servidor responde com 200 e o HTML',
    ],
    'Sem o IP não há conexão; sem conexão não há pedido; e a resposta só vem depois do pedido.',
  ),
  rec: [
    associar(
      'Associe cada código de status ao seu significado.',
      [
        ['200', 'Sucesso'],
        ['404', 'Não encontrado'],
        ['403', 'Proibido (sem permissão)'],
        ['500', 'Erro interno do servidor'],
      ],
      'Os códigos são agrupados: 2xx sucesso, 4xx erro no pedido, 5xx erro no servidor.',
    ),
    mc(
      'Você corrigiu o IP no DNS, mas alguns usuários ainda veem o site antigo. Qual é uma causa provável?',
      'O cache do DNS ainda guarda a resposta antiga por algum tempo (TTL)',
      [
        [
          'O protocolo HTTP só atualiza o conteúdo do site uma vez por dia',
          'O HTTP não tem esse limite; o atraso vem do cache.',
        ],
        [
          'Depois de definido, o IP de um site não pode mais ser alterado',
          'IPs podem mudar; o DNS guarda o antigo por algum tempo (TTL).',
        ],
      ],
      'Respostas DNS ficam em cache pelo tempo definido (TTL). Só depois o novo endereço é consultado.',
    ),
  ],
  explique: {
    enunciado:
      'Explique com suas palavras o que acontece entre digitar um endereço e ver a página.',
    modelo:
      'O navegador pergunta ao DNS qual é o IP do nome, abre uma conexão segura com o servidor desse IP, envia um pedido HTTP (GET) e recebe a resposta com o HTML. Depois monta a página, pedindo outros arquivos se precisar.',
    rubrica: [
      'Citou a consulta ao DNS para obter o IP',
      'Citou o pedido e a resposta HTTP',
      'Mencionou que o navegador monta a página',
    ],
  },
  resumo: [
    'O DNS traduz nomes em IPs.',
    'HTTP é pedido e resposta; HTTPS acrescenta criptografia.',
    '2xx sucesso, 3xx redirecionamento, 4xx erro do pedido, 5xx erro do servidor.',
    'DNS e navegador guardam respostas em cache.',
  ],
  cards: [
    ['O que é o DNS?', 'O sistema que traduz nomes de sites em endereços IP.'],
    ['O que faz o método GET?', 'Pede ao servidor que entregue um recurso (como uma página).'],
    ['O que significa o status 404?', 'Não encontrado: o endereço pedido não existe no servidor.'],
    ['Qual a diferença entre HTTP e HTTPS?', 'O HTTPS criptografa a conexão com TLS.'],
  ],
  conexoes: {
    disciplinas: [
      'HTML, CSS e a Web: toda API e todo front-end usam pedidos e respostas HTTP.',
      'Cibersegurança: certificados TLS e ataques de DNS (como envenenamento de cache).',
      'Infraestrutura e Servidores: balanceadores e CDNs decidem qual servidor responde.',
      'Redes de Computadores (HTTPS e TLS; Diagnóstico: ping, traceroute e nslookup): veja o cadeado do navegador e como investigar quando o DNS falha.',
    ],
    profissional:
      'Um chamado "o site não abre" tem causas bem diferentes conforme a etapa: o nome não resolve (DNS), a conexão falha (rede) ou o servidor responde 5xx. Saber a sequência permite descobrir onde quebrou.',
  },
});
