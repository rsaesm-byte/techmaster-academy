import { describe, expect, it } from 'vitest';
import { semSinal, somar, paraBits } from './binario';
import {
  avaliar,
  meioSomador,
  somadorCompleto,
  tabelaDaPorta,
  tabelaSomadorCompleto,
  type Bit,
  type Porta,
} from './portas';

describe('portas lógicas', () => {
  const casos: [Porta, Bit, Bit, Bit][] = [
    ['and', 1, 1, 1],
    ['and', 1, 0, 0],
    ['or', 0, 0, 0],
    ['or', 1, 0, 1],
    ['xor', 1, 1, 0],
    ['xor', 1, 0, 1],
    ['nand', 1, 1, 0],
    ['nand', 0, 1, 1],
    ['nor', 0, 0, 1],
    ['nor', 1, 0, 0],
  ];
  it.each(casos)('%s(%i,%i) = %i', (porta, a, b, saida) => {
    expect(avaliar(porta, a, b)).toBe(saida);
  });

  it('NOT inverte', () => {
    expect(avaliar('not', 0)).toBe(1);
    expect(avaliar('not', 1)).toBe(0);
    expect(tabelaDaPorta('not')).toHaveLength(2);
    expect(tabelaDaPorta('and')).toHaveLength(4);
  });

  it('meio-somador: 1 + 1 = 10 (soma 0, vai-um 1)', () => {
    expect(meioSomador(1, 1)).toEqual({ soma: 0, vaiUm: 1 });
    expect(meioSomador(1, 0)).toEqual({ soma: 1, vaiUm: 0 });
  });

  it('somador completo equivale a somar três bits', () => {
    for (const linha of tabelaSomadorCompleto()) {
      const total = linha.entradas.reduce<number>((s, b) => s + b, 0);
      expect(linha.saidas[0]! + 2 * linha.saidas[1]!).toBe(total);
    }
  });

  it('encadear somadores completos reproduz a soma em binário do módulo anterior', () => {
    const a = paraBits(100, 8);
    const b = paraBits(27, 8);
    const resultado: number[] = Array(8).fill(0);
    let vem: Bit = 0;
    for (let p = 7; p >= 0; p--) {
      const r = somadorCompleto(a[p] as Bit, b[p] as Bit, vem);
      resultado[p] = r.soma;
      vem = r.vaiUm;
    }
    expect(resultado).toEqual(somar(a, b).resultado);
    expect(semSinal(resultado)).toBe(127);
  });
});
