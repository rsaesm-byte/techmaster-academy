import { describe, expect, it } from 'vitest';
import {
  chegou,
  executarComando,
  FASES,
  type Comando,
  type Estado,
  type Fase,
} from '@/features/labs/robo/robo';

/** Busca em largura: o menor programa que resolve a fase (prova que ela tem solução). */
function menorSolucao(fase: Fase): Comando[] | null {
  const chave = (e: Estado) => `${e.x},${e.y},${e.dir}`;
  const fila: { e: Estado; prog: Comando[] }[] = [{ e: fase.inicio, prog: [] }];
  const vistos = new Set([chave(fase.inicio)]);
  while (fila.length) {
    const { e, prog } = fila.shift()!;
    if (chegou(fase, e)) return prog;
    for (const c of ['andar', 'esquerda', 'direita'] as const) {
      const r = executarComando(fase, e, c);
      if (r.tipo !== 'ok' || vistos.has(chave(r.estado))) continue;
      vistos.add(chave(r.estado));
      fila.push({ e: r.estado, prog: [...prog, c] });
    }
  }
  return null;
}

describe('robô', () => {
  it.each(FASES.map((f) => [f.nome, f] as const))(
    '%s tem solução com o mínimo anunciado',
    (_n, fase) => {
      expect(menorSolucao(fase)?.length).toBe(fase.minimo);
    },
  );

  it('bate na borda e não se move', () => {
    const fase = FASES[0]!;
    const r = executarComando(fase, { x: 0, y: 1, dir: 'O' }, 'andar');
    expect(r).toMatchObject({ tipo: 'bateu', estado: { x: 0, y: 1 } });
  });

  it('instrução vaga não é executada', () => {
    expect(executarComando(FASES[0]!, FASES[0]!.inicio, 'vago').tipo).toBe('nao-entendeu');
  });

  it('giros completam a volta', () => {
    let e: Estado = { x: 0, y: 0, dir: 'N' };
    for (let i = 0; i < 4; i++) e = executarComando(FASES[0]!, e, 'direita').estado;
    expect(e.dir).toBe('N');
  });
});
