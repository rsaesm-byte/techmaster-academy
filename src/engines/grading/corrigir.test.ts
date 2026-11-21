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
