import { describe, expect, it } from 'vitest';
import { comSinal, paraBits, paraHex, semSinal, somar, textoParaBytes } from './binario';

describe('binário', () => {
  it('converte para bits e de volta', () => {
    expect(paraBits(11, 4)).toEqual([1, 0, 1, 1]);
    expect(semSinal([1, 0, 1, 1])).toBe(11);
    expect(paraBits(5, 8)).toEqual([0, 0, 0, 0, 0, 1, 0, 1]);
  });

  it('valor grande demais é cortado (como o hardware faz)', () => {
    expect(paraBits(256, 8)).toEqual(Array(8).fill(0));
    expect(semSinal(paraBits(300, 8))).toBe(44);
    expect(semSinal(paraBits(-1, 8))).toBe(255);
  });

  it('complemento de dois', () => {
    expect(comSinal(paraBits(255, 8))).toBe(-1);
    expect(comSinal(paraBits(128, 8))).toBe(-128);
    expect(comSinal(paraBits(127, 8))).toBe(127);
    expect(comSinal(paraBits(-5, 8))).toBe(-5);
  });

  it('hexadecimal', () => {
    expect(paraHex(paraBits(255, 8))).toBe('FF');
    expect(paraHex(paraBits(10, 4))).toBe('A');
    expect(paraHex(paraBits(0x4a, 8))).toBe('4A');
  });

  it('soma com vai-um', () => {
    const r = somar(paraBits(5, 4), paraBits(3, 4));
    expect(semSinal(r.resultado)).toBe(8);
    expect(r.estouro).toBe(false);
    expect(r.passos[0]).toMatchObject({ posicao: 3, a: 1, b: 1, soma: 0, saida: 1 });
  });

  it('detecta estouro sem sinal e com sinal', () => {
    const sem = somar(paraBits(15, 4), paraBits(1, 4));
    expect(sem.estouro).toBe(true);
    expect(semSinal(sem.resultado)).toBe(0);
    // 7 + 1 = 8 cabe sem sinal, mas em complemento de dois 8 vira -8.
    const com = somar(paraBits(7, 4), paraBits(1, 4));
    expect(com.estouro).toBe(false);
    expect(com.estouroComSinal).toBe(true);
  });

  it('subtrair é somar o negativo', () => {
    const r = somar(paraBits(5, 8), paraBits(-3, 8));
    expect(comSinal(r.resultado)).toBe(2);
    expect(r.estouroComSinal).toBe(false);
  });

  it('texto vira bytes UTF-8', () => {
    expect(textoParaBytes('A')).toEqual([{ caractere: 'A', bytes: [65] }]);
    expect(textoParaBytes('é')[0]?.bytes).toEqual([195, 169]);
  });
});
