import { describe, expect, it } from 'vitest';
import {
  cesar,
  desrle,
  formatarBytes,
  paraBytes,
  quantosCabem,
  raid,
  rle,
  simularCache,
} from './armazenamento';

describe('unidades', () => {
  it('base 1000 e 1024 dão resultados diferentes', () => {
    expect(paraBytes(1, 'GB', 1000)).toBe(1_000_000_000);
    expect(paraBytes(1, 'GB', 1024)).toBe(1_073_741_824);
    expect(formatarBytes(500e9, 1024)).toBe('466 GB');
    expect(formatarBytes(500e9, 1000)).toBe('500 GB');
    expect(formatarBytes(1536, 1024)).toBe('1,5 KB');
    expect(formatarBytes(0)).toBe('0 B');
  });
  it('quantos arquivos cabem', () => {
    expect(quantosCabem(paraBytes(64, 'GB', 1000), paraBytes(4, 'MB', 1000))).toBe(16000);
    expect(quantosCabem(10, 0)).toBe(0);
  });
});

describe('cache', () => {
  const seq = [1, 2, 3, 1, 4, 1, 2];
  it('LRU mantém o que foi usado há pouco', () => {
    const r = simularCache(seq, 3, 'lru');
    expect(r.passos.map((p) => (p.acerto ? 'H' : 'M')).join('')).toBe('MMMHMHM');
    expect(r.passos[4]?.removido).toBe(2);
  });
  it('FIFO remove o mais antigo mesmo se for usado', () => {
    const r = simularCache(seq, 3, 'fifo');
    expect(r.passos.map((p) => (p.acerto ? 'H' : 'M')).join('')).toBe('MMMHMMM');
    expect(r.passos[4]?.removido).toBe(1);
  });
  it('taxa de acerto', () => {
    expect(simularCache([1, 1, 1, 1], 2, 'lru').taxa).toBe(0.75);
    expect(simularCache([], 2, 'lru').taxa).toBe(0);
  });
});

describe('raid', () => {
  it('capacidade e tolerância', () => {
    expect(raid(0, 2, 4)).toEqual({ util: 8, tolera: 0, eficiencia: 1 });
    expect(raid(1, 2, 4)).toEqual({ util: 4, tolera: 1, eficiencia: 0.5 });
    expect(raid(5, 4, 4)).toEqual({ util: 12, tolera: 1, eficiencia: 0.75 });
    expect(raid(5, 2, 4)).toBeNull();
  });
});

describe('compressão e cifra', () => {
  it('rle vai e volta', () => {
    expect(rle('AAAABBBCC')).toBe('4A3B2C');
    expect(desrle('4A3B2C')).toBe('AAAABBBCC');
    expect(rle('ABC')).toBe('1A1B1C');
    expect(rle('')).toBe('');
  });
  it('césar cifra e decifra', () => {
    expect(cesar('ABC xyz', 3)).toBe('DEF abc');
    expect(cesar(cesar('Olá, Mundo!', 5), -5)).toBe('Olá, Mundo!');
    expect(cesar('a', 26)).toBe('a');
  });
});
