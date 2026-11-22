import { associar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const j13 = montar({
  id: 'javascript.m03.a03',
  titulo: 'Projeto: salvar dados no navegador',
  objetivo:
    'Guardar e recuperar o estado com localStorage e JSON, tratando dados ausentes ou inválidos.',
  pre: ['javascript.m03.a02', 'javascript.m02.a04'],
  min: 30,
  diag: mc(
    'O que acontece com os dados de uma variável JavaScript ao recarregar a página?',
    'Eles se perdem',
    [
      ['Ficam salvos automaticamente', 'Variáveis vivem só na memória da página.'],
      ['Vão para o servidor', 'Nada é enviado sozinho.'],
    ],
    'Para manter os dados é preciso guardá-los, por exemplo no localStorage.',
  ),
  simples: {
    titulo: 'Gaveta do navegador',
    texto:
      'O **localStorage** é uma gaveta de pares chave-valor que fica no navegador e **sobrevive** a recarregamentos. Só guarda **texto**, então usamos JSON:\n\n```\nlocalStorage.setItem("tarefas", JSON.stringify(tarefas));\nconst texto = localStorage.getItem("tarefas");\nconst tarefas = texto ? JSON.parse(texto) : [];\n```\n\nTrate sempre o caso de não haver nada salvo (`null`) e de o texto estar quebrado.',
    essencial:
      'localStorage guarda texto por chave. Use JSON.stringify para salvar e JSON.parse para ler, tratando null e erros.',
    guiado:
      'Para persistir:\n1. Depois de cada mudança, `setItem` com `JSON.stringify(estado)`.\n2. Ao abrir, `getItem` e `JSON.parse`.\n3. Se vier null ou erro, use um estado inicial.',
    tecnico:
      'localStorage é por origem (domínio), síncrono e limitado a cerca de 5 MB. Não é seguro para segredos, pois qualquer script da página o lê. Dados são apagados se o usuário limpar o navegador. Para dados grandes ou estruturados existe o IndexedDB. Este próprio app (TechMaster Academy) guarda seu progresso assim, no seu aparelho.',
  },
  analogia: {
    titulo: 'Gaveta do próprio quarto',
    texto:
      'O localStorage é a gaveta do seu quarto: guarda o que você deixar, mesmo depois de sair e voltar. Mas é só nesse quarto (navegador): em outro computador a gaveta está vazia.',
    limites:
      'Qualquer um com acesso ao seu navegador abre a gaveta; por isso nunca guarde senhas ali.',
  },
  demo: {
    titulo: 'Ida e volta com JSON',
    instrucoes:
      'O console aqui não tem localStorage; o código simula a gaveta com um objeto, para treinar a conversão. Execute e quebre o texto de propósito.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const gaveta = {};\nconst tarefas = [{ id: 1, texto: "Estudar", feita: false }];\ngaveta["tarefas"] = JSON.stringify(tarefas);\nconsole.log(gaveta["tarefas"]);\nconst lido = JSON.parse(gaveta["tarefas"]);\nconsole.log(lido[0].texto);\nconsole.log(gaveta["outra"]);',
    },
  },
  tecnica: {
    titulo: 'Padrão seguro de leitura',
    texto:
      '```\nfunction carregar(texto) {\n  if (!texto) return [];\n  try { return JSON.parse(texto); }\n  catch { return []; }\n}\n```\n**Remover:** `localStorage.removeItem(chave)`.\n**Limpar tudo:** `localStorage.clear()`.\n**Versão:** guardar um campo `versao` ajuda a migrar dados antigos.',
  },
  diagrama: {
    titulo: 'Salvar e carregar',
    nos: [
      { forma: 'inicio', texto: 'Estado muda' },
      { forma: 'passo', texto: 'JSON.stringify e setItem salvam' },
      { forma: 'passo', texto: 'Ao reabrir: getItem lê o texto' },
      { forma: 'fim', texto: 'JSON.parse restaura o estado (ou usa o inicial se não houver)' },
    ],
    descricao: 'Cada mudança é salva como texto; ao reabrir o texto é lido e convertido de volta.',
  },
  exemplo: {
    titulo: 'Contador que persiste',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'const salvo = localStorage.getItem("visitas");\nconst visitas = salvo ? Number(salvo) : 0;\nlocalStorage.setItem("visitas", String(visitas + 1));',
    },
    comentarios: [
      { linha: 1, texto: 'Pode ser null na primeira visita.' },
      { linha: 2, texto: 'Number converte o texto; sem valor, começa em 0.' },
      { linha: 3, texto: 'Guarda sempre como texto.' },
    ],
  },
  guiado: [
    prever(
      'O que aparece no console?',
      'console.log(typeof JSON.stringify([1, 2]));',
      ['string'],
      'stringify devolve texto.',
      [{ resposta: 'object', feedback: 'O resultado é texto, pronto para o localStorage.' }],
      [],
      'javascript',
    ),
    mc(
      'Qual tipo de dado o localStorage aceita?',
      'Apenas texto (strings)',
      [
        [
          'Qualquer objeto, que é convertido sozinho para o formato certo',
          'O localStorage só guarda texto; use JSON.stringify.',
        ],
        ['Somente números, e qualquer texto precisa de conversão', 'Ele aceita textos (strings).'],
      ],
      'Por isso usamos JSON.stringify.',
    ),
  ],
  indep: [
    associar(
      'Associe a operação ao método.',
      [
        ['Guardar um valor', 'setItem'],
        ['Ler um valor', 'getItem'],
        ['Apagar uma chave', 'removeItem'],
        ['Apagar tudo', 'clear'],
      ],
      'Os quatro métodos do localStorage.',
    ),
    prever(
      'O que getItem devolve para uma chave que nunca foi salva?',
      'localStorage.getItem("nada")',
      ['null'],
      'Chave inexistente devolve null.',
      [{ resposta: 'undefined', feedback: 'getItem devolve null, não undefined.' }],
      [],
      'javascript',
    ),
  ],
  desafio: programaJs(
    'Escreva carregar(texto): devolve JSON.parse(texto), mas devolve [] se o texto for null, vazio ou JSON inválido.',
    'function carregar(texto) {\n  // seu código aqui\n}',
    'function carregar(texto) {\n  if (!texto) return [];\n  try {\n    return JSON.parse(texto);\n  } catch (e) {\n    return [];\n  }\n}',
    'carregar',
    [
      { argumentos: ['[1,2]'], esperado: [1, 2] },
      { argumentos: [null], esperado: [] },
      { argumentos: [''], esperado: [] },
      { argumentos: ['{quebrado'], esperado: [] },
    ],
    ['Trate primeiro null e texto vazio.', 'Use try/catch ao redor de JSON.parse.'],
    'Dados externos podem faltar ou estar quebrados; o try/catch garante um valor padrão.',
  ),
  rec: [
    mc(
      'Por que não guardar senhas no localStorage?',
      'Qualquer script da página consegue lê-lo',
      [
        [
          'Porque o localStorage só consegue guardar números',
          'Ele guarda textos; o problema é a segurança.',
        ],
        [
          'Porque o localStorage é apagado automaticamente a cada segundo',
          'Ele fica guardado até alguém apagar.',
        ],
      ],
      'Dados sensíveis exigem proteção no servidor.',
    ),
    mc(
      'O que acontece se o usuário trocar de navegador?',
      'Os dados não aparecem, pois ficam guardados naquele navegador',
      [
        [
          'Eles são copiados automaticamente para o outro navegador',
          'Cada navegador tem o seu localStorage.',
        ],
        [
          'Ficam salvos na nuvem e aparecem em qualquer navegador',
          'O localStorage é local, não vai para a nuvem.',
        ],
      ],
      'Para sincronizar entre aparelhos é preciso um servidor ou serviço de nuvem.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique como salvar e recuperar uma lista no localStorage e quais cuidados tomar.',
    modelo:
      'Converte-se a lista em texto com JSON.stringify e guarda-se com setItem. Ao abrir, lê-se com getItem e converte-se com JSON.parse. É preciso tratar o caso de não haver valor (null) e de o JSON estar inválido, usando um valor padrão.',
    rubrica: ['Citou stringify e setItem', 'Citou getItem e parse', 'Citou tratar null ou erro'],
  },
  resumo: [
    'localStorage guarda texto por chave e sobrevive ao recarregar.',
    'Use JSON.stringify e JSON.parse.',
    'Trate null e JSON inválido.',
    'Não guarde segredos ali.',
  ],
  cards: [
    ['O que é localStorage?', 'Armazenamento chave-valor do navegador.'],
    ['Que tipo de dado aceita?', 'Apenas texto.'],
    ['O que getItem devolve se não existe?', 'null.'],
    ['Pode guardar senhas?', 'Não.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos (Armazenamento): dados persistem em disco ou memória flash.',
      'Segurança: dados do navegador são legíveis por scripts.',
      'Banco de Dados: para vários usuários, usa-se um banco no servidor.',
    ],
    profissional:
      'Persistência é requisito de quase todo app. Saber a diferença entre guardar local e no servidor orienta boas decisões de arquitetura.',
  },
});
