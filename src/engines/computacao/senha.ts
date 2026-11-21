/** Força de senha: entropia = comprimento × log2(tamanho do alfabeto). */
export interface Alfabeto {
  minusculas: boolean;
  maiusculas: boolean;
  digitos: boolean;
  simbolos: boolean;
}

export const tamanhoAlfabeto = (a: Alfabeto) =>
  (a.minusculas ? 26 : 0) + (a.maiusculas ? 26 : 0) + (a.digitos ? 10 : 0) + (a.simbolos ? 32 : 0);

export function entropiaBits(comprimento: number, alfabeto: Alfabeto): number {
  const n = tamanhoAlfabeto(alfabeto);
  return n <= 1 || comprimento <= 0 ? 0 : comprimento * Math.log2(n);
}

/** Tempo médio (segundos) para achar a senha testando `tentativasPorSegundo` palpites. */
export const segundosParaQuebrar = (bits: number, tentativasPorSegundo: number) =>
  bits <= 0 ? 0 : 2 ** (bits - 1) / tentativasPorSegundo;

export function formatarTempo(seg: number): string {
  if (seg < 1) return 'menos de 1 segundo';
  const un: [number, string, string][] = [
    [60, 'segundo', 'segundos'],
    [60, 'minuto', 'minutos'],
    [24, 'hora', 'horas'],
    [365, 'dia', 'dias'],
    [1000, 'ano', 'anos'],
  ];
  let v = seg;
  for (const [lim, s, p] of un) {
    if (v < lim) {
      const r = Math.floor(v);
      return `${r} ${r === 1 ? s : p}`;
    }
    v /= lim;
  }
  return v < 1e6 ? `${Math.floor(v)} mil anos` : 'mais de 1 milhão de anos';
}

export function classificar(bits: number): 'fraca' | 'razoável' | 'forte' | 'muito forte' {
  if (bits < 40) return 'fraca';
  if (bits < 60) return 'razoável';
  if (bits < 80) return 'forte';
  return 'muito forte';
}
