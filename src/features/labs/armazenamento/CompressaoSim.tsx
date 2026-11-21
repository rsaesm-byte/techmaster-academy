import { useState } from 'react';
import { desrle, rle } from '@/engines/computacao/armazenamento';

export function CompressaoSim({ inicial = 'AAAAAAAABBBBCCCCCCCCCCDD' }: { inicial?: string }) {
  const [t, setT] = useState(inicial);
  const temDigito = /\d/.test(t);
  const c = temDigito ? '' : rle(t);
  const volta = temDigito ? '' : desrle(c);
  const economia = t.length ? Math.round((1 - c.length / t.length) * 100) : 0;

  return (
    <section
      aria-label="Simulador de compressão"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="rle-texto" className="text-sm text-muted">
          Texto (sem números)
        </label>
        <input
          id="rle-texto"
          value={t}
          onChange={(e) => setT(e.target.value)}
          maxLength={60}
          aria-invalid={temDigito}
          className="min-h-11 rounded-lg border border-border bg-surface-2 px-3 font-mono"
        />
      </div>
      {temDigito ? (
        <p role="alert" className="m-0 text-danger">
          Este método simples confundiria números do texto com contagens. Use só letras.
        </p>
      ) : (
        <>
          <dl className="m-0 grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
            <dt className="text-muted">Original ({t.length} caracteres)</dt>
            <dd className="m-0 break-all font-mono">{t}</dd>
            <dt className="text-muted">Comprimido ({c.length} caracteres)</dt>
            <dd className="m-0 break-all font-mono font-bold">{c}</dd>
            <dt className="text-muted">Descomprimido</dt>
            <dd className="m-0 break-all font-mono">{volta}</dd>
          </dl>
          <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
            {economia > 0
              ? `Economia de ${economia}%: as repetições viraram contagens.`
              : 'Sem economia: sem repetições, a contagem só aumenta o texto.'}{' '}
            {volta === t ? 'Voltou idêntico ao original (sem perdas).' : ''}
          </p>
        </>
      )}
    </section>
  );
}
export default CompressaoSim;
