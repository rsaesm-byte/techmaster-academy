import { describe, expect, it } from 'vitest';
import type { Tentativa } from '@/domain/progresso';
import { avaliarDominio, calcularStatus } from '@/engines/mastery/dominio';

const criterio = { questoes: ['q1', 'q2', 'q3', 'q4', 'q5'], minPercentual: 80 };

let n = 0;
const t = (questaoId: string, correta: boolean, minuto: number, revelada = false): Tentativa => ({
  id: `t${++n}`,
  aulaId: 'a',
  questaoId,
  correta,
  resposta: null,
  pistasUsadas: 0,
  respostaRevelada: revelada,
  tempoMs: 1000,
  em: `2026-11-21T10:${String(minuto).padStart(2, '0')}:00.000Z`,
});

describe('avaliarDominio', () => {
  it('4 de 5 acertadas = 80% = domínio', () => {
    const r = avaliarDominio(criterio, [
      t('q1', true, 1),
      t('q2', false, 2),
      t('q2', true, 3),
      t('q3', true, 4),
      t('q4', true, 5),
    ]);
    expect(r).toMatchObject({ percentual: 80, atingido: true, pendentes: ['q5'] });
  });

  it('acerto depois de ver a resposta não conta', () => {
    const r = avaliarDominio(criterio, [t('q1', false, 1, true), t('q1', true, 2)]);
    expect(r.acertadas).toEqual([]);
  });

  it('acerto antes de rever a resposta continua valendo', () => {
    const r = avaliarDominio(criterio, [t('q1', true, 1), t('q1', false, 2, true)]);
    expect(r.acertadas).toEqual(['q1']);
  });

  it('questões fora do critério não contam', () => {
    expect(avaliarDominio(criterio, [t('extra', true, 1)]).percentual).toBe(0);
  });
});

describe('calcularStatus', () => {
  const sem = { percentual: 40, acertadas: [], pendentes: [], atingido: false };
  const com = { ...sem, percentual: 100, atingido: true };
  it('domínio vence tudo', () => expect(calcularStatus(false, com)).toBe('dominada'));
  it('chegar ao fim sem domínio = concluída', () =>
    expect(calcularStatus(true, sem)).toBe('concluida'));
  it('nunca rebaixa', () => {
    expect(calcularStatus(false, sem, 'dominada')).toBe('dominada');
    expect(calcularStatus(false, sem, 'concluida')).toBe('concluida');
  });
});
