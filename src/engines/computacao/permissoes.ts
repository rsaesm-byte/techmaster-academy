/** Permissões estilo Linux: três grupos (dono, grupo, outros) × três bits (r, w, x). */
export type Bits3 = [boolean, boolean, boolean];
export type Permissoes = { dono: Bits3; grupo: Bits3; outros: Bits3 };

export const GRUPOS = ['dono', 'grupo', 'outros'] as const;
export const LETRAS = ['r', 'w', 'x'] as const;
const PESOS = [4, 2, 1];

/** Octal de um grupo: r=4, w=2, x=1. */
export const digito = (b: Bits3) =>
  b.reduce((s, ligado, i) => s + (ligado ? (PESOS[i] ?? 0) : 0), 0);

export const paraOctal = (p: Permissoes) =>
  `${digito(p.dono)}${digito(p.grupo)}${digito(p.outros)}`;

export const paraSimbolico = (p: Permissoes) =>
  GRUPOS.map((g) => p[g].map((v, i) => (v ? LETRAS[i] : '-')).join('')).join('');

/** Lê "754" e devolve as permissões; null se for inválido. */
export function deOctal(texto: string): Permissoes | null {
  if (!/^[0-7]{3}$/.test(texto)) return null;
  const grupo = (c: string | undefined): Bits3 => {
    const n = Number(c);
    return [(n & 4) !== 0, (n & 2) !== 0, (n & 1) !== 0];
  };
  return { dono: grupo(texto[0]), grupo: grupo(texto[1]), outros: grupo(texto[2]) };
}
