import { describe, expect, it } from 'vitest';
import { catalogo } from '@/content';
import type { ProgressoAula, Tentativa } from '@/domain/progresso';
import {
  avaliarDiagnostico,
  conquistas,
  estatisticas,
  questoesPendentes,
  recomendacoes,
} from '@/engines/pedagogia/analise';

let n = 0;
const t = (
  questaoId: string,
  correta: boolean,
  minuto: number,
  extra: Partial<Tentativa> = {},
): Tentativa => ({
  id: `t${++n}`,
  aulaId: 'logica.m01.a01',
  questaoId,
  correta,
  resposta: null,
  pistasUsadas: 0,
  respostaRevelada: false,
  tempoMs: 0,
  em: `2026-11-21T10:${String(minuto).padStart(2, '0')}:00.000Z`,
  ...extra,
});
const prog = (aulaId: string, status: ProgressoAula['status']): ProgressoAula => ({
  aulaId,
  aulaVersao: 1,
  etapaAtual: 0,
  status,
  iniciadaEm: '2026-11-21T10:00:00.000Z',
  atualizadaEm: '2026-11-21T10:00:00.000Z',
});
const aula1 = catalogo.aulas.get('logica.m01.a01')!;

describe('questões pendentes', () => {
  it('errada e não superada fica pendente; superada some', () => {
    expect(questoesPendentes([t('rec.q1', false, 1), t('rec.q1', false, 2)])).toEqual([
      { aulaId: 'logica.m01.a01', questaoId: 'rec.q1', erros: 2 },
    ]);
    expect(questoesPendentes([t('rec.q1', false, 1), t('rec.q1', true, 2)])).toEqual([]);
  });
});

describe('recomendações', () => {
  it('prioriza a questão errada, com link direto para a etapa', () => {
    const r = recomendacoes(catalogo, new Map(), [t('rec.q1', false, 1)]);
    expect(r[0]).toMatchObject({
      tipo: 'reforcar-questao',
      rota: '/aula/logica.m01.a01?etapa=recuperacao',
    });
  });
  it('aula concluída sem domínio vira recomendação', () => {
    const r = recomendacoes(
      catalogo,
      new Map([['logica.m01.a01', prog('logica.m01.a01', 'concluida')]]),
      [],
    );
    expect(r[0]).toMatchObject({
      tipo: 'dominar-aula',
      motivo: expect.stringMatching(/0% \(meta 80%\)/),
    });
  });
  it('sugere pré-requisito não concluído, sem bloquear', () => {
    const r = recomendacoes(
      catalogo,
      new Map([['logica.m01.a03', prog('logica.m01.a03', 'em-andamento')]]),
      [],
    );
    expect(r[0]).toMatchObject({ tipo: 'pre-requisito', rota: '/aula/logica.m01.a02' });
  });
});

describe('diagnóstico adaptativo', () => {
  it('acertou de primeira e sem pista: sugere pular para o exemplo', () => {
    const r = avaliarDiagnostico(aula1, [t('diag.q1', true, 1)]);
    expect(r).toMatchObject({
      tipo: 'domina',
      pularPara: { titulo: 'Média de duas notas, em pseudocódigo' },
    });
  });
  it('vale a primeira tentativa: errar e depois acertar é "iniciante"', () => {
    expect(avaliarDiagnostico(aula1, [t('diag.q1', false, 1), t('diag.q1', true, 2)]).tipo).toBe(
      'iniciante',
    );
  });
  it('sem resposta ainda: incompleto', () => {
    expect(avaliarDiagnostico(aula1, []).tipo).toBe('incompleto');
  });
});

describe('estatísticas e conquistas', () => {
  it('taxa de acerto e questão mais errada', () => {
    const e = estatisticas(catalogo, new Map(), [
      t('rec.q1', false, 1),
      t('rec.q1', false, 2),
      t('rec.q1', true, 3),
    ]);
    const a1 = e.find((x) => x.aula.id === 'logica.m01.a01');
    expect(a1).toMatchObject({ tentativas: 3, taxaAcerto: 33, maisErrada: { erros: 2 } });
  });
  it('persistente: acertou depois de 3 erros', () => {
    const c = conquistas(
      catalogo,
      new Map(),
      [t('rec.q1', false, 1), t('rec.q1', false, 2), t('rec.q1', false, 3), t('rec.q1', true, 4)],
      [],
    );
    expect(c.find((x) => x.id === 'persistente')?.obtida).toBe(true);
    expect(c.find((x) => x.id === 'primeiro-passo')?.obtida).toBe(false);
  });
});
