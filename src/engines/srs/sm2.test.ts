import { describe, expect, it } from 'vitest';
import { estadoInicial, estaVencido, quandoVolta, revisar, somarDias } from '@/engines/srs/sm2';

const HOJE = '2026-11-21';

describe('SM-2', () => {
  it('cartão novo vence amanhã', () => {
    const e = estadoInicial(HOJE);
    expect(e.proximaRevisao).toBe('2026-11-22');
    expect(estaVencido(e, HOJE)).toBe(false);
    expect(estaVencido(e, '2026-11-22')).toBe(true);
  });

  it('sequência de acertos "bom": 1, 6, 15, 38 dias', () => {
    let e = estadoInicial(HOJE);
    const intervalos: number[] = [];
    for (let i = 0; i < 4; i++) {
      e = revisar(e, 'bom', HOJE);
      intervalos.push(e.intervaloDias);
    }
    expect(intervalos).toEqual([1, 6, 15, 38]);
    expect(e.facilidade).toBeCloseTo(2.5);
  });

  it('errar recomeça e volta hoje; facilidade cai', () => {
    let e = revisar(revisar(estadoInicial(HOJE), 'bom', HOJE), 'bom', HOJE);
    e = revisar(e, 'errei', HOJE);
    expect(e).toMatchObject({ repeticoes: 0, intervaloDias: 0, proximaRevisao: HOJE });
    expect(e.facilidade).toBeLessThan(2.5);
  });

  it('facilidade nunca cai abaixo de 1,3', () => {
    let e = estadoInicial(HOJE);
    for (let i = 0; i < 20; i++) e = revisar(e, 'errei', HOJE);
    expect(e.facilidade).toBe(1.3);
  });

  it('"fácil" aumenta a facilidade e afasta mais as revisões', () => {
    const base = revisar(revisar(estadoInicial(HOJE), 'bom', HOJE), 'bom', HOJE);
    expect(revisar(base, 'facil', HOJE).intervaloDias).toBeGreaterThan(
      revisar(base, 'dificil', HOJE).intervaloDias,
    );
  });

  it('textos dos botões', () => {
    const e = estadoInicial(HOJE);
    expect(
      ['errei', 'dificil', 'bom', 'facil'].map((n) => quandoVolta(e, n as never, HOJE)),
    ).toEqual(['hoje', 'amanhã', 'amanhã', 'amanhã']);
  });

  it('somarDias atravessa mês e ano', () => {
    expect(somarDias('2026-12-30', 3)).toBe('2027-01-02');
  });
});
