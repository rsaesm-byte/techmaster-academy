import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const o02 = montar({
  id: 'poo.m01.a02',
  titulo: 'Encapsulamento',
  objetivo: 'Proteger o estado interno de um objeto e expor apenas uma interface segura.',
  pre: ['poo.m01.a01'],
  min: 30,
  diag: mc(
    'Qual problema ocorre se qualquer código puder alterar o saldo de uma conta diretamente?',
    'Valores inválidos, como saldo negativo, entram sem validação',
    [
      ['O programa fica mais rápido', 'Velocidade não é o ponto.'],
      ['O saldo some da memória', 'Nada disso acontece.'],
    ],
    'Encapsulamento = proteger dados e validar as mudanças.',
  ),
  simples: {
    titulo: 'A caixa-preta segura',
    texto:
      '**Encapsulamento** é esconder os detalhes internos e permitir o acesso só por uma **interface** (os métodos públicos).\n\n```\nclass Conta {\n  #saldo = 0;\n  depositar(v) {\n    if (v > 0) this.#saldo += v;\n  }\n  sacar(v) {\n    if (v > this.#saldo) return false;\n    this.#saldo -= v;\n    return true;\n  }\n  get saldo() { return this.#saldo; }\n}\n```\n\n- `#saldo` é **privado**: só a classe o acessa.\n- Os métodos **validam** antes de mudar.\n- O `get` permite ler sem permitir escrever.',
    essencial:
      'Esconda o estado (#privado) e exponha métodos que validam. Assim o objeto nunca fica em estado inválido.',
    guiado:
      'Para encapsular:\n1. Torne os atributos privados (#).\n2. Crie métodos para as operações permitidas.\n3. Valide as regras dentro desses métodos.\n4. Ofereça getters para leitura.\n5. Exponha o mínimo possível.',
    tecnico:
      'Campos `#privados` são aplicados pela linguagem: acessar de fora é um erro de sintaxe. Antes deles, usava-se a convenção `_nome`, que não protege de verdade. Encapsular cria **invariantes**: regras que sempre valem (saldo ≥ 0). Também facilita mudar a implementação interna sem quebrar quem usa. Em Java e C# existem `private`, `protected` e `public`; Python usa convenção com `_` e `__`.',
  },
  analogia: {
    titulo: 'Caixa eletrônico',
    texto:
      'Você não mexe no cofre do caixa eletrônico. Usa botões (a interface): sacar, depositar, ver saldo. Por trás, a máquina confere senha e saldo. Se o cofre ficasse aberto, qualquer um poderia errar ou fraudar.',
    limites: 'Encapsular não é esconder por esconder: é garantir que as regras sejam respeitadas.',
  },
  demo: {
    titulo: 'O saldo protegido',
    instrucoes:
      'Execute: o saque maior que o saldo é recusado. Tente acessar conta.#saldo de fora e veja o erro (apague a linha depois).',
    simulacao: {
      tipo: 'js',
      codigo:
        'class Conta {\n  #saldo = 100;\n  sacar(valor) {\n    if (valor > this.#saldo) {\n      console.log("Saque recusado:", valor);\n      return false;\n    }\n    this.#saldo -= valor;\n    console.log("Saque ok:", valor);\n    return true;\n  }\n  get saldo() {\n    return this.#saldo;\n  }\n}\nconst c = new Conta();\nc.sacar(30);\nc.sacar(500);\nconsole.log("Saldo:", c.saldo);',
    },
  },
  tecnica: {
    titulo: 'Getters e setters',
    texto:
      '**get:** lê um valor calculado ou protegido.\n**set:** altera passando por validação.\nUm setter pode recusar valores inválidos: `set idade(v) { if (v < 0) throw new Error("inválido"); this.#idade = v; }`.\nSem setter, o atributo é somente leitura.',
  },
  diagrama: {
    titulo: 'Acesso ao estado',
    nos: [
      { forma: 'inicio', texto: 'Código externo quer mudar o saldo' },
      { forma: 'passo', texto: 'Chama o método público sacar()' },
      { forma: 'decisao', texto: 'A regra permite?' },
      { forma: 'fim', texto: 'Sim: altera o #saldo. Não: recusa e nada muda' },
    ],
    descricao: 'Só o método toca no dado privado.',
  },
  exemplo: {
    titulo: 'Idade válida',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'class Pessoa {\n  #idade = 0;\n  set idade(v) {\n    if (v >= 0) this.#idade = v;\n  }\n  get idade() {\n    return this.#idade;\n  }\n}\nconst p = new Pessoa();\np.idade = -5;\nconsole.log(p.idade);',
    },
    comentarios: [
      { linha: 3, texto: 'O setter valida antes de gravar.' },
      { linha: 10, texto: 'Valor inválido é ignorado e a idade continua 0.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'class Conta {\n  #saldo = 100;\n  sacar(v) {\n    if (v > this.#saldo) return false;\n    this.#saldo -= v;\n    return true;\n  }\n  get saldo() {\n    return this.#saldo;\n  }\n}\nconst c = new Conta();\nc.sacar(30);\nc.sacar(100);\nconsole.log(c.saldo);',
      ['70'],
      'O saque de 30 passa (saldo 70); o de 100 é recusado.',
      [{ resposta: '0', feedback: 'O segundo saque foi recusado.' }],
    ),
    mc(
      'O que significa um campo privado (#)?',
      'Só o código dentro da classe pode acessá-lo',
      [
        ['É criptografado na memória', 'Privado não é criptografia.'],
        ['Fica invisível no console', 'O controle é de acesso, não de visualização.'],
      ],
      'Privado restringe quem acessa.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'class Conta {\n  #saldo = 100;\n  sacar(v) {\n    if (v > this.#saldo) return false;\n    this.#saldo -= v;\n    return true;\n  }\n}\nconst c = new Conta();\nconsole.log(c.sacar(150));',
      ['false'],
      '150 é maior que o saldo: o saque é recusado e o método devolve false.',
      [{ resposta: 'true', feedback: 'Só devolve true se o saque for aceito.' }],
    ),
    mc(
      'Qual é o principal benefício do encapsulamento?',
      'Garantir que o objeto nunca fique em estado inválido',
      [
        ['Deixar o código mais curto', 'Costuma até aumentar um pouco o código.'],
        ['Evitar o uso de classes', 'Ele é um recurso das classes.'],
      ],
      'Pense em invariantes.',
    ),
  ],
  desafio: programaJs(
    'Escreva saldoFinal(operacoes): comece com saldo 0 e aplique cada operação (positivo é depósito, negativo é saque). Um saque que deixaria o saldo negativo deve ser recusado (ignorado). Devolva o saldo final. Use uma classe com campo privado.',
    'function saldoFinal(operacoes) {\n  // seu código aqui\n}',
    'function saldoFinal(operacoes) {\n  class Conta {\n    #saldo = 0;\n    aplicar(v) {\n      if (this.#saldo + v < 0) return;\n      this.#saldo += v;\n    }\n    get saldo() {\n      return this.#saldo;\n    }\n  }\n  const c = new Conta();\n  for (const v of operacoes) c.aplicar(v);\n  return c.saldo;\n}',
    'saldoFinal',
    [
      { argumentos: [[100, -30, -100, 50]], esperado: 120 },
      { argumentos: [[]], esperado: 0 },
      { argumentos: [[-5]], esperado: 0 },
      { argumentos: [[10, -10]], esperado: 0 },
    ],
    [
      'Antes de somar, confira se o resultado ficaria negativo.',
      'A regra fica dentro do método da classe.',
    ],
    'A validação dentro do método impede o estado inválido.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Encapsulamento', 'Esconder o estado e expor uma interface'],
        ['Campo privado', 'Só a própria classe acessa'],
        ['Getter', 'Lê um valor de forma controlada'],
        ['Invariante', 'Regra que sempre deve valer'],
      ],
      'Conceitos de proteção de dados.',
    ),
    completar(
      'Complete: o prefixo de um campo privado em JavaScript.',
      'class Conta {\n  ___saldo = 0;\n}',
      [{ aceitas: ['#'], feedback: 'O # torna o campo privado.' }],
      'Sem ele o campo é público.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é encapsulamento e por que ele ajuda a evitar erros.',
    modelo:
      'Encapsulamento esconde o estado interno do objeto e só permite mudá-lo por métodos públicos, que validam as regras. Assim o objeto nunca fica em estado inválido (como saldo negativo) e a implementação pode mudar sem quebrar quem o usa.',
    rubrica: [
      'Definiu encapsulamento',
      'Citou campos privados e métodos que validam',
      'Explicou o benefício (estado sempre válido)',
    ],
  },
  resumo: [
    'Estado privado, interface pública.',
    'Métodos validam as regras.',
    'Getters leem; setters validam.',
    'Menos exposição, menos bugs.',
  ],
  cards: [
    ['O que é encapsulamento?', 'Esconder o estado e expor uma interface.'],
    ['Como tornar um campo privado em JS?', 'Prefixo #.'],
    ['O que é uma invariante?', 'Regra que sempre vale para o objeto.'],
    ['Para que serve um getter?', 'Ler um valor de forma controlada.'],
  ],
  conexoes: {
    disciplinas: [
      'Cibersegurança: princípio do menor privilégio, expor o mínimo.',
      'Banco de Dados: restrições de integridade protegem o estado dos dados.',
      'Engenharia de Software: baixo acoplamento.',
    ],
    profissional: 'Boas APIs e bibliotecas escondem os detalhes e deixam só o essencial à mostra.',
  },
});
