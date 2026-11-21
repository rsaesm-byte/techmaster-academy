import { useState } from 'react';
import { cesar } from '@/engines/computacao/armazenamento';

export function CesarSim({ inicial = 'Ola Mundo' }: { inicial?: string }) {
  const [t, setT] = useState(inicial);
  const [d, setD] = useState(3);
  const [todas, setTodas] = useState(false);
  const cifrado = cesar(t, d);

  return (
    <section
      aria-label="Simulador de cifra de César"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="cesar-texto" className="text-sm text-muted">
          Mensagem
        </label>
        <input
          id="cesar-texto"
          value={t}
          onChange={(e) => setT(e.target.value)}
          maxLength={60}
          className="min-h-11 rounded-lg border border-border bg-surface-2 px-3 font-mono"
        />
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="cesar-d">Deslocamento (chave): {d}</label>
        <input
          id="cesar-d"
          type="range"
          min={1}
          max={25}
          value={d}
          onChange={(e) => setD(Number(e.target.value))}
          className="min-h-11"
        />
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3 font-mono">
        {t} → <strong>{cifrado}</strong>
      </p>
      <button
        type="button"
        aria-pressed={todas}
        onClick={() => setTodas((v) => !v)}
        className="min-h-11 w-fit rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
      >
        {todas ? 'Esconder' : 'Quebrar a cifra: testar as 25 chaves'}
      </button>
      {todas && (
        <ol className="m-0 grid list-none gap-1 p-0 font-mono text-sm sm:grid-cols-2">
          {Array.from({ length: 25 }, (_, i) => (
            <li key={i} className={26 - (i + 1) === d ? 'font-bold text-primary' : ''}>
              chave {i + 1}: {cesar(cifrado, -(i + 1))}
            </li>
          ))}
        </ol>
      )}
      {todas && (
        <p className="m-0 text-sm text-muted">
          Com só 25 chaves possíveis, qualquer pessoa testa todas em segundos: por isso a cifra de
          César não protege nada de verdade.
        </p>
      )}
    </section>
  );
}
export default CesarSim;
