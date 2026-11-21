/**
 * TESTE DE CONTRATO: as mesmas regras valem para QUALQUER implementação do repositório.
 * Quando existir uma versão com API remota, ela entra nesta lista e precisa passar igual.
 */
import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import type { ProgressoAula, Tentativa } from '@/domain/progresso';
import { DexieProgressRepository } from '@/persistence/dexie';
import { MemoriaProgressRepository } from '@/persistence/memoria';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

let contador = 0;
const abertos: DexieProgressRepository[] = [];

const implementacoes: [string, () => ProgressRepository][] = [
  ['memória', () => new MemoriaProgressRepository()],
  [
    'IndexedDB (Dexie)',
    () => {
      const repo = new DexieProgressRepository(`teste-${++contador}`);
      abertos.push(repo);
      return repo;
    },
  ],
];

afterEach(() => {
  abertos.splice(0).forEach((r) => r.fechar());
});

const progresso = (aulaId: string, etapaAtual = 0): ProgressoAula => ({
  aulaId,
  aulaVersao: 1,
  etapaAtual,
  status: 'em-andamento',
  iniciadaEm: '2026-11-21T10:00:00.000Z',
  atualizadaEm: `2026-11-21T10:0${etapaAtual}:00.000Z`,
});

const tentativa = (id: string, em: string, correta = true): Tentativa => ({
  id,
  aulaId: 'logica.m01.a01',
  questaoId: 'rec.q1',
  correta,
  resposta: 'a',
  pistasUsadas: 0,
  respostaRevelada: false,
  tempoMs: 4200,
  em,
});

describe.each(implementacoes)('ProgressRepository — %s', (_nome, criar) => {
  it('salva e retoma o progresso de uma aula', async () => {
    const repo = criar();
    expect(await repo.obterProgresso('logica.m01.a01')).toBeUndefined();

    await repo.salvarProgresso(progresso('logica.m01.a01', 3));
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ etapaAtual: 3 });

    await repo.salvarProgresso(progresso('logica.m01.a01', 5));
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ etapaAtual: 5 });
    expect(await repo.listarProgressos()).toHaveLength(1);
  });

  it('lista tentativas da aula em ordem cronológica', async () => {
    const repo = criar();
    await repo.registrarTentativa(tentativa('t2', '2026-11-21T10:05:00.000Z'));
    await repo.registrarTentativa(tentativa('t1', '2026-11-21T10:01:00.000Z', false));
    const lista = await repo.listarTentativas('logica.m01.a01');
    expect(lista.map((t) => t.id)).toEqual(['t1', 't2']);
    expect(await repo.listarTentativas('outra.aula')).toEqual([]);
  });

  it('exportar → apagar → importar restaura tudo igual', async () => {
    const repo = criar();
    await repo.salvarProgresso(progresso('logica.m01.a01', 2));
    await repo.registrarTentativa(tentativa('t1', '2026-11-21T10:01:00.000Z'));
    const backup = await repo.exportar();

    await repo.apagarTudo();
    expect(await repo.listarProgressos()).toEqual([]);

    await repo.importar(JSON.parse(JSON.stringify(backup)));
    expect(await repo.obterProgresso('logica.m01.a01')).toEqual(progresso('logica.m01.a01', 2));
    expect(await repo.listarTentativas('logica.m01.a01')).toHaveLength(1);
  });

  it('rejeita backup inválido sem apagar o que existe', async () => {
    const repo = criar();
    await repo.salvarProgresso(progresso('logica.m01.a01', 4));
    await expect(repo.importar({ formato: 'outro-app', dados: [] })).rejects.toThrow();
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ etapaAtual: 4 });
  });
});
