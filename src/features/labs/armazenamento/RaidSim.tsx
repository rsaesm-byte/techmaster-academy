import { useState } from 'react';
import { raid, type NivelRaid } from '@/engines/computacao/armazenamento';

const NIVEIS: [NivelRaid, string, string][] = [
  [0, 'RAID 0', 'Divide os dados entre os discos: rápido, mas sem proteção.'],
  [1, 'RAID 1', 'Espelha: cada dado é gravado em todos os discos.'],
  [5, 'RAID 5', 'Divide e guarda paridade: tolera a perda de 1 disco.'],
];

export function RaidSim() {
  const [nivel, setNivel] = useState<NivelRaid>(1);
  const [discos, setDiscos] = useState(3);
  const [falhos, setFalhos] = useState<number[]>([]);
  const r = raid(nivel, discos, 4);
  const ok = r ? falhos.length <= r.tolera : false;

  const alternar = (i: number) =>
    setFalhos((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));

  return (
    <section
      aria-label="Simulador de RAID"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div role="group" aria-label="Nível de RAID" className="flex flex-wrap gap-2">
        {NIVEIS.map(([n, t]) => (
          <button
            key={n}
            type="button"
            aria-pressed={nivel === n}
            onClick={() => {
              setNivel(n);
              setFalhos([]);
              if (n === 5 && discos < 3) setDiscos(3);
            }}
            className={`min-h-11 rounded-lg border px-4 font-medium ${nivel === n ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="m-0">{NIVEIS.find((x) => x[0] === nivel)?.[2]}</p>
      <div className="flex items-center gap-3">
        <label htmlFor="raid-discos">Discos de 4 TB: {discos}</label>
        <input
          id="raid-discos"
          type="range"
          min={nivel === 5 ? 3 : 2}
          max={6}
          value={discos}
          onChange={(e) => {
            setDiscos(Number(e.target.value));
            setFalhos([]);
          }}
          className="min-h-11"
        />
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Discos: clique para simular uma falha"
      >
        {Array.from({ length: discos }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={falhos.includes(i)}
            aria-label={`Disco ${i + 1}: ${falhos.includes(i) ? 'com falha' : 'funcionando'}`}
            onClick={() => alternar(i)}
            className={`grid min-h-16 min-w-16 place-items-center rounded-lg border-2 font-mono font-bold ${falhos.includes(i) ? 'border-danger bg-danger/10 text-danger' : 'border-primary bg-primary-soft'}`}
          >
            <span aria-hidden="true">{falhos.includes(i) ? '✕' : '💽'}</span>
            <span className="text-xs">D{i + 1}</span>
          </button>
        ))}
      </div>
      {r && (
        <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
          Espaço útil: <strong>{r.util} TB</strong> de {discos * 4} TB (
          {Math.round(r.eficiencia * 100)}%) · Tolera a falha de <strong>{r.tolera}</strong>{' '}
          disco(s).{' '}
          {falhos.length === 0
            ? 'Clique num disco para simular uma falha.'
            : ok
              ? 'Os dados continuam acessíveis.'
              : 'Dados perdidos: houve mais falhas do que o RAID suporta.'}
        </p>
      )}
    </section>
  );
}
export default RaidSim;
