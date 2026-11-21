import { useMemo, useState } from 'react';
import { simularCache } from '@/engines/computacao/armazenamento';

export function CacheSim({ sequencia = '1 2 3 1 4 1 2' }: { sequencia?: string }) {
  const [texto, setTexto] = useState(sequencia);
  const [cap, setCap] = useState(3);
  const [pol, setPol] = useState<'lru' | 'fifo'>('lru');
  const acessos = useMemo(
    () =>
      texto
        .split(/[\s,]+/)
        .filter((x) => /^\d+$/.test(x))
        .slice(0, 20)
        .map(Number),
    [texto],
  );
  const r = useMemo(() => simularCache(acessos, cap, pol), [acessos, cap, pol]);

  return (
    <section
      aria-label="Simulador de memória cache"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="cache-seq" className="text-sm text-muted">
            Endereços acessados (números separados por espaço)
          </label>
          <input
            id="cache-seq"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-h-11 w-64 rounded-lg border border-border bg-surface-2 px-3 font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="cache-cap">Tamanho da cache: {cap}</label>
          <input
            id="cache-cap"
            type="range"
            min={1}
            max={5}
            value={cap}
            onChange={(e) => setCap(Number(e.target.value))}
            className="min-h-11"
          />
        </div>
      </div>
      <div role="group" aria-label="Política de troca" className="flex gap-2">
        {(
          [
            ['lru', 'LRU (remove o menos usado recentemente)'],
            ['fifo', 'FIFO (remove o mais antigo)'],
          ] as const
        ).map(([v, t]) => (
          <button
            key={v}
            type="button"
            aria-pressed={pol === v}
            onClick={() => setPol(v)}
            className={`min-h-11 rounded-lg border px-3 text-sm font-medium ${pol === v ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse text-center font-mono">
          <caption className="mb-1 text-left font-sans text-sm text-muted">
            Cada coluna é um acesso. Acerto (H) = achou na cache; falha (M) = foi buscar na RAM.
          </caption>
          <tbody>
            <tr>
              <th scope="row" className="p-2 text-left font-sans font-normal">
                Endereço
              </th>
              {r.passos.map((p, i) => (
                <td key={i} className="p-2 font-bold">
                  {p.endereco}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-2 text-left font-sans font-normal">
                Resultado
              </th>
              {r.passos.map((p, i) => (
                <td
                  key={i}
                  className={`p-2 font-bold ${p.acerto ? 'bg-primary-soft text-primary' : 'text-danger'}`}
                >
                  {p.acerto ? 'H' : 'M'}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-2 text-left font-sans font-normal">
                Na cache
              </th>
              {r.passos.map((p, i) => (
                <td key={i} className="p-2 text-sm">
                  {p.linhas.join(' ')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
        {r.acertos} acertos em {acessos.length} acessos: taxa de{' '}
        <strong>{Math.round(r.taxa * 100)}%</strong>. Cada acerto evita uma ida lenta à RAM.
      </p>
    </section>
  );
}
export default CacheSim;
