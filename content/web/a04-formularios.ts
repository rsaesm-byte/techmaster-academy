import { associar, completar, mc, montar, ordenar } from '../fundamentos/montar';

export const w04 = montar({
  id: 'web.m01.a04',
  titulo: 'Formulários e acessibilidade',
  objetivo:
    'Criar formulários utilizáveis por todos, com rótulos, tipos de campo, validação e teclado.',
  pre: ['web.m01.a03'],
  min: 30,
  diag: mc(
    'Por que todo campo de formulário precisa de um rótulo (label) associado?',
    'Para que todos, inclusive quem usa leitor de tela, saibam o que preencher',
    [
      [
        'Apenas para enfeitar o formulário e deixá-lo mais claro visualmente',
        'O rótulo tem função: dizer o que preencher, inclusive a leitores de tela.',
      ],
      [
        'Porque o navegador se recusa a enviar o formulário sem rótulos',
        'O navegador não exige; a acessibilidade, sim.',
      ],
    ],
    'O label identifica o campo e aumenta a área de clique.',
  ),
  simples: {
    titulo: 'Conversar com o usuário',
    texto:
      'Formulários coletam dados:\n\n```\n<form>\n  <label for="email">E-mail</label>\n  <input type="email" id="email" name="email" required>\n\n  <label for="idade">Idade</label>\n  <input type="number" id="idade" min="0" max="120">\n\n  <button type="submit">Enviar</button>\n</form>\n```\n\n- **`label for`** liga o rótulo ao campo (`id`).\n- **`type`** escolhe o teclado e a validação certos (`email`, `number`, `date`, `password`).\n- **`required`, `min`, `max`, `pattern`** validam no navegador.\n\n**Acessibilidade** é projetar para todos: quem usa só o teclado, leitor de tela, zoom, ou tem daltonismo.',
    essencial:
      'Todo campo tem label; use o type certo e validação nativa; tudo deve funcionar só com o teclado e ter bom contraste.',
    guiado:
      'Para um formulário acessível:\n1. Um `label` para cada campo, ligado por `for` e `id`.\n2. `type` adequado.\n3. Mensagens de erro claras, perto do campo.\n4. Navegação por Tab na ordem lógica.\n5. Contraste e foco visível.',
    tecnico:
      'A validação do navegador é conveniência: o **servidor sempre deve validar de novo**, pois o cliente pode ser contornado. Princípios da **WCAG** (POUR): **P**erceptível, **O**perável, **C**ompreensível e **R**obusto. Cores não devem ser a única forma de transmitir informação (use texto e ícones). O atributo `aria-label` e os papéis ARIA complementam o HTML quando não há tag semântica, mas **HTML nativo** (como `<button>`) já vem acessível, e deve ser preferido a `<div onclick>`. Teste com o teclado (Tab, Enter, Esc) e com um leitor de tela.',
  },
  analogia: {
    titulo: 'Rampa ao lado da escada',
    texto:
      'Acessibilidade é como projetar a entrada de um prédio com rampa e escada: ajuda quem usa cadeira de rodas, mas também quem leva um carrinho de bebê ou uma mala. Recursos acessíveis beneficiam todos.',
    limites: 'Acessibilidade precisa ser pensada desde o início; reformar depois custa muito mais.',
  },
  demo: {
    titulo: 'Um formulário utilizável',
    instrucoes:
      'Tente enviar vazio e veja a validação nativa. Depois clique no texto do rótulo (o campo recebe foco) e navegue só com a tecla Tab. Remova o required de um campo para ver a diferença.',
    simulacao: {
      tipo: 'editor',
      html: '<form>\n  <p>\n    <label for="nome">Nome</label><br>\n    <input id="nome" name="nome" required>\n  </p>\n  <p>\n    <label for="email">E-mail</label><br>\n    <input type="email" id="email" name="email" required>\n  </p>\n  <p>\n    <label for="idade">Idade (0 a 120)</label><br>\n    <input type="number" id="idade" min="0" max="120">\n  </p>\n  <button type="submit">Enviar</button>\n</form>',
      css: 'body { font-family: system-ui, sans-serif; padding: 16px; }\ninput { padding: 8px; font-size: 16px; border: 2px solid #64748b; border-radius: 6px; }\ninput:focus-visible, button:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }\nbutton { padding: 10px 20px; font-size: 16px; background: #1d4ed8; color: white; border: 0; border-radius: 8px; }',
      js: '',
    },
  },
  tecnica: {
    titulo: 'Checklist de acessibilidade',
    texto:
      '**Rótulos** em todos os campos.\n**Teclado:** tudo alcançável com Tab e acionável com Enter/Espaço.\n**Foco visível:** nunca `outline: none` sem substituto.\n**Contraste:** mínimo de 4,5:1 no texto comum.\n**alt** em imagens significativas (vazio em decorativas).\n**Títulos** em ordem (h1, h2, h3).\n**Alvos de toque** com pelo menos 44px.\n**Idioma** declarado em `<html lang>`.',
  },
  diagrama: {
    titulo: 'Do envio à validação',
    nos: [
      { forma: 'inicio', texto: 'O usuário preenche e envia o formulário' },
      { forma: 'decisao', texto: 'O navegador valida (required, type, min, max)?' },
      { forma: 'passo', texto: 'Não: mostra o erro e devolve o foco ao campo' },
      { forma: 'fim', texto: 'Sim: envia ao servidor, que valida de novo' },
    ],
    descricao: 'Validação no cliente é conforto; no servidor é segurança.',
  },
  exemplo: {
    titulo: 'Campo com rótulo e dica',
    codigo: {
      linguagem: 'html',
      fonte:
        '<label for="senha">Senha</label>\n<input type="password" id="senha" minlength="8" aria-describedby="dica" required>\n<small id="dica">Use pelo menos 8 caracteres.</small>',
    },
    comentarios: [
      { linha: 1, texto: 'for aponta para o id do campo.' },
      { linha: 2, texto: 'minlength valida o tamanho; aria-describedby liga a dica ao campo.' },
      { linha: 3, texto: 'O leitor de tela lê a dica junto com o campo.' },
    ],
  },
  guiado: [
    mc(
      'Qual type de input mostra o teclado adequado para e-mails em celulares?',
      'email',
      [
        ['text', 'text funciona, mas sem teclado nem validação específicos.'],
        ['mail', 'Esse valor não existe.'],
      ],
      'type="email" também valida o formato.',
    ),
    mc(
      'Por que o servidor precisa validar os dados mesmo que o navegador já tenha validado?',
      'Porque a validação do navegador pode ser contornada',
      [
        [
          'Porque o navegador nunca valida os campos e deixa tudo para o servidor',
          'O navegador valida, mas essa validação pode ser contornada.',
        ],
        [
          'Porque o servidor é mais lento e precisa conferir os dados com calma',
          'Velocidade não é o motivo: é segurança.',
        ],
      ],
      'Nunca confie em dados vindos do cliente.',
    ),
  ],
  indep: [
    completar(
      'Complete para ligar o rótulo ao campo com id "nome".',
      '<label ___="nome">Nome</label>\n<input id="nome">',
      [{ aceitas: ['for'], feedback: 'O atributo for referencia o id do campo.' }],
      'Clicar no rótulo passa a focar o campo.',
      'html',
    ),
    completar(
      'Complete para tornar o campo obrigatório.',
      '<input type="text" ___>',
      [{ aceitas: ['required'], feedback: 'required impede o envio sem preenchimento.' }],
      'O navegador mostra a mensagem de erro.',
      'html',
    ),
  ],
  desafio: associar(
    'Associe o princípio de acessibilidade ao exemplo.',
    [
      ['Perceptível', 'Texto alternativo em imagens e bom contraste'],
      ['Operável', 'Todo o site pode ser usado só com o teclado'],
      ['Compreensível', 'Mensagens de erro claras e rótulos explícitos'],
      ['Robusto', 'HTML semântico que funciona com tecnologias assistivas'],
    ],
    'Os quatro princípios da WCAG (POUR).',
  ),
  rec: [
    ordenar(
      'Ordene o caminho de um dado digitado até o servidor.',
      [
        'O usuário digita no campo',
        'O navegador valida as regras do formulário',
        'O formulário é enviado ao servidor',
        'O servidor valida de novo e processa',
      ],
      'Duas validações, com funções diferentes.',
    ),
    mc(
      'Qual é a melhor forma de criar um botão acessível?',
      'Usar a tag <button>',
      [
        ['Usar um <div> com onclick', 'Falta teclado, foco e semântica.'],
        ['Usar uma imagem sem alt', 'Leitores de tela não saberão o que ela faz.'],
      ],
      'Elementos nativos já vêm acessíveis.',
      1,
    ),
  ],
  explique: {
    enunciado: 'Explique por que acessibilidade importa e dê três práticas para um formulário.',
    modelo:
      'Acessibilidade permite que todas as pessoas, incluindo quem usa leitor de tela, só o teclado ou tem baixa visão, usem o site, e ajuda todos em geral. Práticas: rótulos ligados aos campos, bom contraste com foco visível, navegação completa por teclado e mensagens de erro claras.',
    rubrica: [
      'Explicou o motivo da acessibilidade',
      'Citou ao menos três práticas',
      'Relacionou com formulários',
    ],
  },
  resumo: [
    'Todo campo tem label ligado por for e id.',
    'Use o type correto e a validação nativa.',
    'O servidor valida de novo.',
    'Teclado, foco visível e contraste são obrigatórios.',
  ],
  cards: [
    ['Como ligar label e campo?', 'for no label, id no campo.'],
    ['O navegador basta para validar?', 'Não, o servidor valida de novo.'],
    ['O que é WCAG?', 'Diretrizes internacionais de acessibilidade web.'],
    ['Melhor tag para botão?', '<button>.'],
  ],
  conexoes: {
    disciplinas: [
      'UX/UI: usabilidade e inclusão.',
      'Cibersegurança: validar entradas do usuário no servidor.',
      'JavaScript: validação customizada e eventos de formulário.',
    ],
    profissional:
      'No Brasil, a LBI exige acessibilidade em sites e aplicativos; além de ser lei, amplia o público do produto.',
  },
});
