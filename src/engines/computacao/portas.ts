/** Portas lógicas: os "tijolos" de todo processador. Entradas e saídas valem 0 ou 1. */
export type Bit = 0 | 1;
export type Porta = 'and' | 'or' | 'not' | 'xor' | 'nand' | 'nor';

export const PORTAS: Record<Porta, { nome: string; entradas: 1 | 2; regra: string }> = {
  and: { nome: 'AND (E)', entradas: 2, regra: 'A saída é 1 só quando TODAS as entradas são 1.' },
  or: { nome: 'OR (OU)', entradas: 2, regra: 'A saída é 1 quando PELO MENOS UMA entrada é 1.' },
  not: { nome: 'NOT (NÃO)', entradas: 1, regra: 'A saída é o contrário da entrada.' },
  xor: {
    nome: 'XOR (OU exclusivo)',
    entradas: 2,
    regra: 'A saída é 1 quando as entradas são DIFERENTES.',
  },
  nand: {
    nome: 'NAND (NÃO-E)',
    entradas: 2,
    regra: 'O contrário do AND: só dá 0 se todas forem 1.',
  },
  nor: { nome: 'NOR (NÃO-OU)', entradas: 2, regra: 'O contrário do OR: só dá 1 se todas forem 0.' },
};

export function avaliar(porta: Porta, a: Bit, b: Bit = 0): Bit {
  switch (porta) {
    case 'and':
      return a & b ? 1 : 0;
    case 'or':
      return a | b ? 1 : 0;
    case 'not':
      return a ? 0 : 1;
    case 'xor':
      return a !== b ? 1 : 0;
    case 'nand':
      return a & b ? 0 : 1;
    case 'nor':
      return a | b ? 0 : 1;
  }
}

export interface LinhaVerdade {
  entradas: Bit[];
  saidas: Bit[];
}

const combinacoes = (n: number): Bit[][] =>
  Array.from({ length: 2 ** n }, (_, i) =>
    Array.from({ length: n }, (_, k) => ((i >> (n - 1 - k)) & 1) as Bit),
  );

export function tabelaDaPorta(porta: Porta): LinhaVerdade[] {
  return combinacoes(PORTAS[porta].entradas).map((e) => ({
    entradas: e,
    saidas: [avaliar(porta, e[0] ?? 0, e[1] ?? 0)],
  }));
}

/** Soma dois bits: XOR dá o bit do resultado, AND dá o "vai-um". */
export function meioSomador(a: Bit, b: Bit): { soma: Bit; vaiUm: Bit } {
  return { soma: avaliar('xor', a, b), vaiUm: avaliar('and', a, b) };
}

/** Soma três bits (A, B e o "vem-um" da coluna anterior): dois meios-somadores e um OR. */
export function somadorCompleto(a: Bit, b: Bit, vemUm: Bit): { soma: Bit; vaiUm: Bit } {
  const primeiro = meioSomador(a, b);
  const segundo = meioSomador(primeiro.soma, vemUm);
  return { soma: segundo.soma, vaiUm: avaliar('or', primeiro.vaiUm, segundo.vaiUm) };
}

export const tabelaMeioSomador = (): LinhaVerdade[] =>
  combinacoes(2).map((e) => {
    const r = meioSomador(e[0] ?? 0, e[1] ?? 0);
    return { entradas: e, saidas: [r.soma, r.vaiUm] };
  });

export const tabelaSomadorCompleto = (): LinhaVerdade[] =>
  combinacoes(3).map((e) => {
    const r = somadorCompleto(e[0] ?? 0, e[1] ?? 0, e[2] ?? 0);
    return { entradas: e, saidas: [r.soma, r.vaiUm] };
  });
