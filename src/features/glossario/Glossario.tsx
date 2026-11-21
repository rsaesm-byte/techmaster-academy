import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { catalogo } from '@/content';
import { normalizar } from '@/engines/portugol/lexer';
import { BlocoCodigo } from '@/ui/BlocoCodigo';

/** Glossário: cada termo com uma definição simples, uma técnica, exemplo e as aulas onde aparece. */
export default function Glossario() {
  const [filtro, setFiltro] = useState('');
  const { hash } = useLocation();
  const termos = useMemo(() => {
    const f = normalizar(filtro.trim());
    return f
      ? catalogo.glossario.filter((t) => normalizar(`${t.termo} ${t.simples}`).includes(f))
      : catalogo.glossario;
  }, [filtro]);

  // Vindo da busca (#termo): rola até ele.
  useEffect(() => {
    const id = hash.replace('#', '');
    if (id) document.getElementById(`termo-${id}`)?.scrollIntoView({ block: 'start' });
  }, [hash]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 text-3xl font-bold tracking-tight">Glossário</h1>
        <p className="mt-2 mb-0 text-muted">
          {catalogo.glossario.length} termos da trilha, cada um com uma definição simples e uma
          técnica.
        </p>
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-medium">Filtrar termos</span>
        <input
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="ex.: variável"
          className="min-h-11 max-w-md rounded-lg border border-border bg-bg px-3"
        />
      </label>
      <p role="status" className="sr-only">
        {termos.length} termos encontrados
      </p>
      <dl className="m-0 flex flex-col gap-3">
        {termos.map((t) => (
          <div
            key={t.id}
            id={`termo-${t.id}`}
            className={`scroll-mt-4 rounded-2xl border bg-surface p-5 ${hash === `#${t.id}` ? 'border-2 border-primary' : 'border-border'}`}
          >
            <dt className="text-lg font-semibold">{t.termo}</dt>
            <dd className="m-0 mt-1 flex flex-col gap-2">
              <p className="m-0 text-[17px]">{t.simples}</p>
              <details>
                <summary className="cursor-pointer text-sm font-medium text-primary">
                  Definição técnica
                </summary>
                <p className="mt-1 mb-0 text-muted">{t.tecnico}</p>
              </details>
              {t.exemplo && (
                <BlocoCodigo codigo={{ linguagem: 'pseudocodigo', fonte: t.exemplo }} />
              )}
              <p className="m-0 text-sm text-muted">
                Aparece em:{' '}
                {t.aulas.map((a, i) => (
                  <span key={a}>
                    {i > 0 && ', '}
                    <Link to={`/aula/${a}`}>{catalogo.aulas.get(a)?.titulo}</Link>
                  </span>
                ))}
              </p>
            </dd>
          </div>
        ))}
      </dl>
      {termos.length === 0 && <p className="m-0 text-muted">Nenhum termo com “{filtro}”.</p>}
    </div>
  );
}
