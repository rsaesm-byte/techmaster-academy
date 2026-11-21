import { useMemo, useState } from 'react';
import { escalonar, type Algoritmo, type Processo } from '@/engines/computacao/escalonador';

const PROCESSOS: Processo[] = [
  { nome: 'Navegador', duracao: 5 },
  { nome: 'Música', duracao: 2 },
  { nome: 'Antivírus', duracao: 3 },
];
const CORES = ['var(--tm-primary)', 'var(--tm-accent)', '#f59e0b', '#ec4899'];

export function EscalonadorSim({
  algoritmo = 'rr',
  quantum = 2,
}: {
  algoritmo?: Algoritmo;
  quantum?: number;
}) {
  const [alg, setAlg] = useState<Algoritmo>(algoritmo);
  const [q, setQ] = useState(quantum);
  const r = useMemo(() => escalonar(PROCESSOS, alg, q), [alg, q]);
  const total = r.fatias.at(-1)?.fim ?? 1;

  return (
    <section
      aria-label="Simulador de escalonador de processos"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div role="group" aria-label="Algoritmo" className="flex flex-wrap gap-2">
        {(
          [
            ['fifo', 'Um de cada vez (FIFO)'],
            ['rr', 'Revezamento (Round Robin)'],
          ] as const
        ).map(([v, t]) => (
          <button
            key={v}
            type="button"
            aria-pressed={alg === v}
            onClick={() => setAlg(v)}
            className={`min-h-11 rounded-lg border px-4 font-medium ${alg === v ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {alg === 'rr' && (
        <div className="flex items-center gap-3">
          <label htmlFor="quantum">Fatia de tempo: {q}</label>
          <input
            id="quantum"
            type="range"
            min={1}
            max={5}
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
            className="min-h-11"
          />
        </div>
      )}
      <ul className="m-0 flex list-none flex-wrap gap-3 p-0 text-sm">
        {PROCESSOS.map((p, i) => (
          <li key={p.nome} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded" style={{ background: CORES[i] }} />
            {p.nome} precisa de {p.duracao} unidades
          </li>
        ))}
      </ul>
      <div
        role="img"
        aria-label={`Linha do tempo da CPU: ${r.fatias.map((f) => `${f.nome} de ${f.inicio} a ${f.fim}`).join('; ')}`}
        className="flex h-12 overflow-hidden rounded-lg border border-border"
      >
        {r.fatias.map((f, i) => {
          const idx = PROCESSOS.findIndex((p) => p.nome === f.nome);
          return (
            <div
              key={i}
              style={{ width: `${((f.fim - f.inicio) / total) * 100}%`, background: CORES[idx] }}
              className="grid place-items-center overflow-hidden text-xs font-bold text-white"
            >
              {f.nome.slice(0, 3)}
            </div>
          );
        })}
      </div>
      <table className="w-full max-w-md border-collapse text-left">
        <caption className="mb-1 text-left text-sm text-muted">
          Quanto cada programa esperou até terminar
        </caption>
        <thead>
          <tr className="border-b border-border text-sm">
            <th scope="col" className="p-2">
              Programa
            </th>
            <th scope="col" className="p-2">
              Terminou em
            </th>
            <th scope="col" className="p-2">
              Esperou
            </th>
          </tr>
        </thead>
        <tbody>
          {PROCESSOS.map((p) => (
            <tr key={p.nome} className="border-b border-border/50">
              <td className="p-2">{p.nome}</td>
              <td className="p-2">{r.termino[p.nome]}</td>
              <td className="p-2">{r.espera[p.nome]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
        Espera média: <strong>{r.esperaMedia.toFixed(1)}</strong> unidades.{' '}
        {alg === 'fifo'
          ? 'Quem chega depois de um programa longo fica parado esperando.'
          : 'Cada programa recebe a CPU em fatias: todos começam logo e os curtos terminam cedo, mesmo que a espera média possa subir um pouco.'}
      </p>
    </section>
  );
}

export default EscalonadorSim;
