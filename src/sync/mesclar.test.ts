import { describe, expect, it } from 'vitest';
import type { Backup, CartaoRevisao, ProgressoAula, Tentativa } from '@/domain/progresso';
import { assinatura, mesclar } from './mesclar';

const backup = (p: Partial<Backup> = {}): Backup => ({
  formato: 'techmaster-progresso',
  schemaVersion: 1,
  exportadoEm: '2026-11-01T00:00:00.000Z',
  progressos: [],
  tentativas: [],
  cartoes: [],
  ...p,
});
const prog = (
  aulaId: string,
  atualizadaEm: string,
  extra: Partial<ProgressoAula> = {},
): ProgressoAula => ({
  aulaId,
  aulaVersao: 1,
  etapaAtual: 0,
  status: 'em-andamento',
  iniciadaEm: '2026-11-01T00:00:00.000Z',
  atualizadaEm,
  ...extra,
});
const tent = (id: string, em = '2026-11-10T00:00:00.000Z'): Tentativa => ({
  id,
  aulaId: 'a',
  questaoId: 'q',
  correta: true,
  resposta: null,
  pistasUsadas: 0,
  respostaRevelada: false,
  tempoMs: 0,
  em,
});
const cartao = (id: string, revisoes: string[]): CartaoRevisao => ({
  id,
  aulaId: 'a',
  origem: 'flashcard',
  itemId: id,
  facilidade: 2.5,
  repeticoes: revisoes.length,
  intervaloDias: 1,
  proximaRevisao: '2026-11-20',
  historico: revisoes.map((em) => ({ em, nota: 'bom' as const })),
});

describe('mesclar progresso de dois aparelhos', () => {
  it('une as tentativas dos dois lados sem duplicar', () => {
    const r = mesclar(
      { backup: backup({ tentativas: [tent('1'), tent('2')] }) },
      { backup: backup({ tentativas: [tent('2'), tent('3')] }) },
    );
    expect(r.backup.tentativas.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('fica com a etapa mais recente, mas o status nunca regride', () => {
    const computador = prog('a', '2026-11-10T10:00:00.000Z', {
      etapaAtual: 13,
      status: 'dominada',
    });
    const celular = prog('a', '2026-11-11T10:00:00.000Z', { etapaAtual: 4 });
    const r = mesclar(
      { backup: backup({ progressos: [computador] }) },
      { backup: backup({ progressos: [celular] }) },
    );
    expect(r.backup.progressos[0]).toMatchObject({ etapaAtual: 4, status: 'dominada' });
  });

  it('aulas diferentes em cada aparelho somam', () => {
    const r = mesclar(
      { backup: backup({ progressos: [prog('a', '2026-11-10T00:00:00.000Z')] }) },
      { backup: backup({ progressos: [prog('b', '2026-11-10T00:00:00.000Z')] }) },
    );
    expect(r.backup.progressos.map((p) => p.aulaId)).toEqual(['a', 'b']);
  });

  it('cartão de revisão: vence o que foi revisado mais vezes', () => {
    const r = mesclar(
      { backup: backup({ cartoes: [cartao('fc1', ['2026-11-10T00:00:00.000Z'])] }) },
      {
        backup: backup({
          cartoes: [cartao('fc1', ['2026-11-10T00:00:00.000Z', '2026-11-12T00:00:00.000Z'])],
        }),
      },
    );
    expect(r.backup.cartoes[0]?.historico).toHaveLength(2);
  });

  it('apagar tudo num aparelho descarta o que é mais antigo em todos', () => {
    const r = mesclar(
      { backup: backup(), limpoEm: '2026-11-15T00:00:00.000Z' },
      {
        backup: backup({
          tentativas: [
            tent('velha', '2026-11-10T00:00:00.000Z'),
            tent('nova', '2026-11-16T00:00:00.000Z'),
          ],
          progressos: [prog('a', '2026-11-10T00:00:00.000Z')],
        }),
      },
    );
    expect(r.limpoEm).toBe('2026-11-15T00:00:00.000Z');
    expect(r.backup.tentativas.map((t) => t.id)).toEqual(['nova']);
    expect(r.backup.progressos).toEqual([]);
  });

  it('a assinatura ignora a data de exportação e a ordem', () => {
    const a = { backup: backup({ tentativas: [tent('1'), tent('2')] }) };
    const b = {
      backup: backup({
        exportadoEm: '2026-12-01T00:00:00.000Z',
        tentativas: [tent('2'), tent('1')],
      }),
    };
    expect(assinatura(a)).toBe(assinatura(b));
  });
});
