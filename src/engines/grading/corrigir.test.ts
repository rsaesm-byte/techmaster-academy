import { describe, expect, it } from 'vitest';
import type { Questao } from '@/domain/conteudo';
import {
  corrigir,
  embaralhar,
  normalizarSaida,
  respostaCompleta,
} from '@/engines/grading/corrigir';

const base = { enunciado: 'E?', pistas: [], explicacao: 'Porque sim.' };

const me: Questao = {
  ...base,
  id: 'q-me',
  tipo: 'multipla-escolha',
  alternativas: [
    { id: 'a', texto: 'Certa' },
    { id: 'b', texto: 'Errada', feedback: 'Confundiu X com Y.' },
  ],
  correta: 'a',
};

const saida: Questao = {
  ...base,
  id: 'q-saida',
  tipo: 'prever-saida',
  codigo: { linguagem: 'pseudocodigo', fonte: 'escreva("Pode votar")' },
  respostasAceitas: ['Pode votar'],
  errosComuns: [{ resposta: 'Ainda não vota', feedback: '>= inclui o igual.' }],
};

const ordem: Questao = {
  ...base,
  id: 'q-ordem',
  tipo: 'ordenacao',
  itens: [
    { id: '1', texto: 'um' },
    { id: '2', texto: 'dois' },
    { id: '3', texto: 'três' },
  ],
};

const assoc: Questao = {
  ...base,
  id: 'q-assoc',
  tipo: 'associacao',
  pares: [
    { id: 'x', esquerda: 'X', direita: 'xis' },
    { id: 'y', esquerda: 'Y', direita: 'ípsilon' },
  ],
};

describe('múltipla escolha', () => {
  it('acerto devolve a explicação', () => {
    expect(corrigir(me, { tipo: 'multipla-escolha', alternativa: 'a' })).toEqual({
      correta: true,
      feedback: 'Porque sim.',
    });
  });
  it('erro devolve o feedback da alternativa escolhida', () => {
    expect(corrigir(me, { tipo: 'multipla-escolha', alternativa: 'b' })).toEqual({
      correta: false,
      feedback: 'Confundiu X com Y.',
    });
  });
});

describe('prever a saída', () => {
  it.each(['Pode votar', '  pode   VOTAR ', '"Pode votar"'])(
    'aceita variações de escrita: %j',
    (t) => {
      expect(corrigir(saida, { tipo: 'prever-saida', texto: t }).correta).toBe(true);
    },
  );
  it('reconhece um erro comum e explica', () => {
    expect(corrigir(saida, { tipo: 'prever-saida', texto: 'ainda não vota' }).feedback).toBe(
      '>= inclui o igual.',
    );
  });
  it('erro desconhecido recebe orientação genérica', () => {
    const r = corrigir(saida, { tipo: 'prever-saida', texto: '42' });
    expect(r.correta).toBe(false);
    expect(r.feedback).toMatch(/linha por linha/);
  });
});

describe('ordenação', () => {
  it('ordem certa', () => {
    expect(corrigir(ordem, { tipo: 'ordenacao', ordem: ['1', '2', '3'] }).correta).toBe(true);
  });
  it('conta quantos estão na posição certa', () => {
    const r = corrigir(ordem, { tipo: 'ordenacao', ordem: ['1', '3', '2'] });
    expect(r).toMatchObject({ correta: false });
    expect(r.feedback).toMatch(/^1 de 3/);
  });
});

describe('associação', () => {
  it('todas certas', () => {
    expect(corrigir(assoc, { tipo: 'associacao', escolhas: { x: 'x', y: 'y' } }).correta).toBe(
      true,
    );
  });
  it('trocadas', () => {
    const r = corrigir(assoc, { tipo: 'associacao', escolhas: { x: 'y', y: 'x' } });
    expect(r.feedback).toMatch(/^0 de 2/);
  });
  it('só fica completa com todas preenchidas', () => {
    expect(respostaCompleta(assoc, { tipo: 'associacao', escolhas: { x: 'x' } })).toBe(false);
    expect(respostaCompleta(assoc, { tipo: 'associacao', escolhas: { x: 'x', y: 'x' } })).toBe(
      true,
    );
  });
});

describe('utilitários', () => {
  it('normalizarSaida', () => {
    expect(normalizarSaida('  “Olá   Mundo” ')).toBe('olá mundo');
  });
  it('embaralhar é determinístico e nunca devolve a ordem original', () => {
    const itens = ['a', 'b', 'c', 'd'];
    expect(embaralhar(itens, 'semente')).toEqual(embaralhar(itens, 'semente'));
    for (const semente of ['s1', 's2', 's3', 's4', 's5']) {
      const r = embaralhar(itens, semente);
      expect(r).not.toEqual(itens);
      expect([...r].sort()).toEqual(itens);
    }
  });
  it('recusa resposta de tipo diferente da questão', () => {
    expect(() => corrigir(me, { tipo: 'prever-saida', texto: 'x' })).toThrow();
  });
});

describe('exercícios de código', () => {
  const completar: Questao = {
    ...base,
    id: 'q-comp',
    tipo: 'completar-codigo',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'soma <- ___\npara i de 1 ate 3 faca\n  soma <- soma ___ i\nfimpara',
    },
    lacunas: [{ aceitas: ['0'] }, { aceitas: ['+'], feedback: 'Somar acumula.' }],
  };
  it('completar: aceita espaços e maiúsculas diferentes', () => {
    expect(corrigir(completar, { tipo: 'completar-codigo', lacunas: [' 0 ', '+'] }).correta).toBe(
      true,
    );
  });
  it('completar: aponta a lacuna errada com o feedback dela', () => {
    const r = corrigir(completar, { tipo: 'completar-codigo', lacunas: ['0', '*'] });
    expect(r.feedback).toMatch(/1 de 2 lacunas/);
    expect(r.feedback).toMatch(/Lacuna 2: Somar acumula/);
  });

  const identificar: Questao = {
    ...base,
    id: 'q-id',
    tipo: 'identificar-erro',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte: 'c <- 1\nenquanto c <= 3 faca\n escreva(c)\nfimenquanto',
    },
    linhaErrada: 3,
    feedbackPorLinha: { '2': 'A condição está certa.' },
  };
  it('identificar erro', () => {
    expect(corrigir(identificar, { tipo: 'identificar-erro', linha: 3 }).correta).toBe(true);
    expect(corrigir(identificar, { tipo: 'identificar-erro', linha: 2 }).feedback).toBe(
      'A condição está certa.',
    );
  });

  const programa: Questao = {
    ...base,
    id: 'q-prog',
    tipo: 'programa-portugol',
    codigoInicial: 'leia(n)\n',
    solucao: 'leia(n)\nescreva(n * 2)',
    casos: [
      { entradas: ['2'], saidaEsperada: ['4'] },
      { entradas: ['5'], saidaEsperada: ['10'] },
    ],
  };
  it('programa Portugol: roda os casos no interpretador', () => {
    expect(
      corrigir(programa, { tipo: 'programa-portugol', codigo: 'leia(n)\nescreva(n + n)' }).correta,
    ).toBe(true);
    const r = corrigir(programa, { tipo: 'programa-portugol', codigo: 'leia(n)\nescreva(n + 2)' });
    expect(r.feedback).toMatch(/Teste 2 de 2 com as entradas 5/);
  });
});

describe('sandbox JavaScript (lógica dos casos)', async () => {
  const { executarCasos } = await import('@/engines/sandbox/casos');
  const { resultadoJsParaCorrecao } = await import('@/engines/grading/corrigir');
  const casos = [
    { argumentos: [2, 3], esperado: 5 },
    { argumentos: [-1, 1], esperado: 0 },
  ];
  it('todos os casos passam', () => {
    const r = executarCasos('function somar(a, b) { return a + b; }', 'somar', casos);
    expect(resultadoJsParaCorrecao(r, 'ok').correta).toBe(true);
  });
  it('mostra o primeiro caso que falhou', () => {
    const r = executarCasos('function somar(a, b) { return a - b; }', 'somar', casos);
    expect(resultadoJsParaCorrecao(r, 'ok').feedback).toMatch(
      /Com os argumentos \(2, 3\): esperado 5, sua função devolveu -1/,
    );
  });
  it('nome errado de função e erro de sintaxe', () => {
    expect(executarCasos('function soma(a,b){return a+b}', 'somar', casos).erroGeral).toMatch(
      /Não encontrei a função "somar"/,
    );
    expect(
      executarCasos('function somar(a, b) { return a + ; }', 'somar', casos).erroGeral,
    ).toMatch(/Erro no código/);
  });
  it('captura console.log sem sujar o console real', () => {
    expect(
      executarCasos('function somar(a,b){ console.log("oi", a); return a+b }', 'somar', casos)
        .logs[0],
    ).toBe('oi 2');
  });
});

describe('consulta SQL', () => {
  const q = {
    id: 'q',
    tipo: 'consulta-sql',
    enunciado: 'x',
    codigoInicial: '',
    solucao: "SELECT nome FROM clientes WHERE cidade = 'Sorocaba'",
    ordenada: false,
    pistas: [],
    explicacao: 'ok',
  } as unknown as Questao;
  const c = (codigo: string) => corrigir(q, { tipo: 'consulta-sql', codigo });

  it('aceita outra consulta com o mesmo resultado, em outra ordem', () => {
    expect(
      c("SELECT nome FROM clientes WHERE cidade = 'Sorocaba' ORDER BY nome DESC").correta,
    ).toBe(true);
  });
  it('explica quando faltam colunas, linhas ou há erro', () => {
    expect(c('SELECT nome, cidade FROM clientes').feedback).toMatch(/coluna/);
    expect(c('SELECT nome FROM clientes').feedback).toMatch(/linha/);
    expect(c('SELECT nome FROM nada').feedback).toMatch(/Erro na consulta/);
    expect(c("SELECT cidade FROM clientes WHERE cidade = 'Sorocaba'").correta).toBe(false);
  });
});

describe('consulta SQL que altera dados', () => {
  const q = {
    id: 'q',
    tipo: 'consulta-sql',
    enunciado: 'x',
    codigoInicial: '',
    solucao: "UPDATE clientes SET cidade = 'Itu' WHERE id = 1",
    ordenada: false,
    pistas: [],
    explicacao: 'ok',
  } as unknown as Questao;
  const c = (codigo: string) => corrigir(q, { tipo: 'consulta-sql', codigo });

  it('compara o estado final das tabelas', () => {
    expect(c("UPDATE clientes SET cidade = 'Itu' WHERE nome = 'Ana'").correta).toBe(true);
    expect(c("UPDATE clientes SET cidade = 'Itu'").feedback).toMatch(/Revise o WHERE|valor/);
    expect(c("UPDATE clientes SET cidade = 'Itu' WHERE id = 2").feedback).toMatch(/valor/);
    expect(c('SELECT * FROM clientes').feedback).toMatch(/ALTERA/);
  });
});
