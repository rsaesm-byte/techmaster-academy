import { useState } from 'react';
import { SITES, passosDoAcesso } from '@/engines/computacao/web';

const NOME = { navegador: 'Navegador', dns: 'Servidor DNS', servidor: 'Servidor do site' } as const;

export function WebSim() {
  const [i, setI] = useState(0);
  const [site, setSite] = useState(0);
  const s = SITES[site] ?? SITES[0];
  const passos = s ? passosDoAcesso(s) : [];
  const atual = passos[i];

  return (
    <section
      aria-label="Simulador de acesso a um site"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="web-site">Site</label>
        <select
          id="web-site"
          value={site}
          onChange={(e) => {
            setSite(Number(e.target.value));
            setI(0);
          }}
          className="min-h-11 rounded-lg border border-border bg-surface-2 px-3"
        >
          {SITES.map((x, k) => (
            <option key={x.dominio} value={k}>
              {x.dominio}
            </option>
          ))}
        </select>
      </div>
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Etapas">
        {passos.map((p, k) => (
          <li
            key={p.titulo}
            aria-current={k === i ? 'step' : undefined}
            className={`rounded-lg border px-2 py-1 text-sm ${k === i ? 'border-primary bg-primary-soft font-bold' : k < i ? 'border-border opacity-70' : 'border-border text-muted'}`}
          >
            {k + 1}
          </li>
        ))}
      </ol>
      {atual && (
        <div className="rounded-xl bg-surface-2 p-4">
          <h3 className="m-0 mb-2 text-base">{atual.titulo}</h3>
          <p className="m-0 mb-2 text-sm text-muted">
            {NOME[atual.de]} {atual.de !== atual.para && <>→ {NOME[atual.para]}</>}
          </p>
          <p className="m-0 mb-2 rounded-lg bg-surface p-3 font-mono text-sm">{atual.mensagem}</p>
          <p className="m-0">{atual.explicacao}</p>
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(passos.length - 1, v + 1))}
          disabled={i >= passos.length - 1}
          className="min-h-11 rounded-lg bg-primary px-4 font-medium text-on-primary disabled:opacity-50"
        >
          Próximo passo
        </button>
      </div>
    </section>
  );
}

export default WebSim;
