import { describe, expect, it } from 'vitest';
import { ALGORITMOS, gerarVetor } from '@/engines/algoritmos/ordenacao';

const ordenados = (v: number[]) => [...v].sort((a, b) => a - b);

describe('ordenação instrumentada', () => {
  for (const id of ['bolha', 'selecao', 'insercao'] as const) {
    it(`${id} ordena e o último quadro marca tudo pronto`, () => {
      for (const forma of ['aleatorio', 'quase', 'inverso', 'ordenado'] as const) {
        const v = gerarVetor(12, forma, 3);
        const q = ALGORITMOS[id].executar(v);
        const ultimo = q.at(-1)!;
        expect(ultimo.vetor).toEqual(ordenados(v));
        expect(ultimo.prontos.length).toBe(12);
      }
    });
  }

  it('comparações batem com a teoria: bolha sempre n(n-1)/2', () => {
    const q = ALGORITMOS.bolha.executar(gerarVetor(10, 'aleatorio'));
    expect(q.at(-1)?.comparacoes).toBe(45);
  });

  it('inserção em vetor já ordenado faz só n - 1 comparações e zero trocas', () => {
    const q = ALGORITMOS.insercao.executar(gerarVetor(20, 'ordenado'));
    expect(q.at(-1)).toMatchObject({ comparacoes: 19, trocas: 0 });
  });

  it('seleção faz no máximo n - 1 trocas', () => {
    expect(
      ALGORITMOS.selecao.executar(gerarVetor(15, 'inverso')).at(-1)!.trocas,
    ).toBeLessThanOrEqual(14);
  });
});

describe('busca', () => {
  const v = gerarVetor(32, 'ordenado');
  it('linear encontra e conta comparações', () => {
    const alvo = v[9]!;
    expect(ALGORITMOS.linear.executar(v, alvo).at(-1)).toMatchObject({
      encontrado: 10,
      comparacoes: 10,
    });
  });
  it('binária encontra com no máximo log2(n)+1 comparações', () => {
    for (const alvo of v) {
      const fim = ALGORITMOS.binaria.executar(v, alvo).at(-1)!;
      expect(v[fim.encontrado! - 1]).toBe(alvo);
      expect(fim.comparacoes).toBeLessThanOrEqual(6);
    }
  });
  it('binária: valor ausente', () => {
    expect(ALGORITMOS.binaria.executar(v, 1).at(-1)?.encontrado).toBeUndefined();
  });
  it('gerarVetor é reprodutível', () => {
    expect(gerarVetor(10, 'aleatorio', 5)).toEqual(gerarVetor(10, 'aleatorio', 5));
  });
});
