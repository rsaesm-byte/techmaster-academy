/** Escalonador de processos: quem usa a CPU e por quanto tempo. */
export interface Processo {
  nome: string;
  duracao: number;
}
export interface Fatia {
  nome: string;
  inicio: number;
  fim: number;
}
export interface Resultado {
  fatias: Fatia[];
  /** Instante em que cada processo terminou. */
  termino: Record<string, number>;
  /** Tempo total esperando na fila, por processo (todos chegam no instante 0). */
  espera: Record<string, number>;
  esperaMedia: number;
}

export type Algoritmo = 'fifo' | 'rr';

export function escalonar(procs: Processo[], algoritmo: Algoritmo, quantum = 2): Resultado {
  const restante = new Map(procs.map((p) => [p.nome, p.duracao]));
  const fila = procs.map((p) => p.nome);
  const fatias: Fatia[] = [];
  const termino: Record<string, number> = {};
  let t = 0;
  while (fila.length) {
    const nome = fila.shift() as string;
    const falta = restante.get(nome) ?? 0;
    const uso = algoritmo === 'fifo' ? falta : Math.min(quantum, falta);
    const ultima = fatias[fatias.length - 1];
    if (ultima && ultima.nome === nome && ultima.fim === t) ultima.fim = t + uso;
    else fatias.push({ nome, inicio: t, fim: t + uso });
    t += uso;
    restante.set(nome, falta - uso);
    if (falta - uso > 0) fila.push(nome);
    else termino[nome] = t;
  }
  const espera: Record<string, number> = {};
  for (const p of procs) espera[p.nome] = (termino[p.nome] ?? 0) - p.duracao;
  const soma = Object.values(espera).reduce((a, b) => a + b, 0);
  return { fatias, termino, espera, esperaMedia: procs.length ? soma / procs.length : 0 };
}
