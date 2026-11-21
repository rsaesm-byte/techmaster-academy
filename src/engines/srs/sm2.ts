/**
 * REPETIÇÃO ESPAÇADA — algoritmo SM-2 (Wozniak, SuperMemo, 1987), base do Anki clássico.
 *
 * Ideia: revisar um pouco ANTES de esquecer. Cada acerto aumenta o intervalo até a próxima
 * revisão (1 dia → 6 dias → ~15 → ~38…); cada erro recomeça do zero. A "facilidade" de cada
 * cartão se ajusta com as notas: cartão difícil volta mais vezes.
 *
 * Adaptação: 4 botões (Errei, Difícil, Bom, Fácil) mapeados nas notas 2, 3, 4 e 5 do SM-2.
 * Fonte: https://super-memory.com/english/ol/sm2.htm
 */

export type Nota = 'errei' | 'dificil' | 'bom' | 'facil';

export interface EstadoSrs {
  facilidade: number;
  repeticoes: number;
  intervaloDias: number;
  /** Data local "AAAA-MM-DD" da próxima revisão. */
  proximaRevisao: string;
}

const QUALIDADE: Record<Nota, number> = { errei: 2, dificil: 3, bom: 4, facil: 5 };
export const FACILIDADE_INICIAL = 2.5;
const FACILIDADE_MINIMA = 1.3;

/** Data local no formato AAAA-MM-DD (sem fuso: "hoje" é o hoje de quem estuda). */
export function dataLocal(d: Date): string {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function somarDias(data: string, dias: number): string {
  const [a, m, d] = data.split('-').map(Number);
  return dataLocal(new Date(a ?? 2000, (m ?? 1) - 1, (d ?? 1) + dias));
}

export function estadoInicial(hoje: string): EstadoSrs {
  // Novo cartão: primeira revisão amanhã — o espaçamento começa no primeiro dia.
  return {
    facilidade: FACILIDADE_INICIAL,
    repeticoes: 0,
    intervaloDias: 0,
    proximaRevisao: somarDias(hoje, 1),
  };
}

export function revisar(e: EstadoSrs, nota: Nota, hoje: string): EstadoSrs {
  const q = QUALIDADE[nota];
  const facilidade = Math.max(
    FACILIDADE_MINIMA,
    e.facilidade + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );
  if (q < 3) {
    // Errou: recomeça. Volta ainda hoje, no fim da fila da sessão.
    return { facilidade, repeticoes: 0, intervaloDias: 0, proximaRevisao: hoje };
  }
  const repeticoes = e.repeticoes + 1;
  const intervaloDias =
    repeticoes === 1 ? 1 : repeticoes === 2 ? 6 : Math.round(e.intervaloDias * facilidade);
  return { facilidade, repeticoes, intervaloDias, proximaRevisao: somarDias(hoje, intervaloDias) };
}

/** Texto curto de quando o cartão volta, para mostrar em cada botão. */
export function quandoVolta(e: EstadoSrs, nota: Nota, hoje: string): string {
  const d = revisar(e, nota, hoje).intervaloDias;
  if (d === 0) return 'hoje';
  if (d === 1) return 'amanhã';
  if (d < 30) return `${d} dias`;
  const meses = Math.round(d / 30);
  return meses === 1 ? '1 mês' : `${meses} meses`;
}

export function estaVencido(e: EstadoSrs, hoje: string): boolean {
  return e.proximaRevisao <= hoje;
}
