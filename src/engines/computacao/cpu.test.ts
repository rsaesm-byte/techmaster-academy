import { describe, expect, it } from 'vitest';
import { estadoInicial, executar, montar, passo } from './cpu';

const rodar = (fonte: string, mem: number[] = []) => {
  const p = montar(fonte);
  expect(p.erros).toEqual([]);
  return executar(p, estadoInicial(mem)).estado;
};

describe('CPU didática', () => {
  it('soma dois números da memória e guarda o resultado', () => {
    const e = rodar('LOAD A, [0]\nLOAD B, [1]\nADD A, B\nSTORE A, [2]\nHALT', [7, 5]);
    expect(e.mem[2]).toBe(12);
    expect(e.regs.A).toBe(12);
    expect(e.parado).toBe(true);
  });

  it('laço de verdade: 5 + 4 + 3 + 2 + 1', () => {
    const e = rodar('LDI A, 0\nLDI B, 5\nLDI C, 1\nsoma: ADD A, B\nSUB B, C\nJNZ B, soma\nHALT');
    expect(e.regs.A).toBe(15);
    expect(e.regs.B).toBe(0);
  });

  it('estoura em 8 bits', () => {
    const e = rodar('LDI A, 255\nLDI B, 1\nADD A, B\nHALT');
    expect(e.regs.A).toBe(0);
  });

  it('SUB abaixo de zero dá a volta', () => {
    const e = rodar('LDI A, 0\nLDI B, 1\nSUB A, B\nHALT');
    expect(e.regs.A).toBe(255);
  });

  it('um passo executa uma instrução e descreve', () => {
    const p = montar('LDI A, 9\nHALT');
    const e = passo(p, estadoInicial());
    expect(e.pc).toBe(1);
    expect(e.regs.A).toBe(9);
    expect(e.descricao).toMatch(/Colocou o número 9 em A/);
  });

  it('laço infinito é interrompido pelo limite', () => {
    const p = montar('x: JMP x');
    expect(executar(p, estadoInicial(), 50).esgotou).toBe(true);
  });

  it('relata erros com a linha', () => {
    const p = montar('LDI A, 300\nPULA\nADD A\nJNZ A, nada');
    expect(p.erros.map((e) => e.linha)).toEqual([1, 2, 3, 4]);
  });
});
