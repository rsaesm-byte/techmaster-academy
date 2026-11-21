import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { catalogo } from '@/content';
import { buscar, construirIndice } from '@/engines/busca';

const ROTULO = { aula: 'Aula', termo: 'Glossário', laboratorio: 'Laboratório' } as const;
const indice = construirIndice(catalogo);

export default function Busca() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const resultados = useMemo(() => buscar(indice, q), [q]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 text-3xl font-bold tracking-tight">Busca</h1>
      <p role="status" className="m-0 text-muted">
        {q.trim().length < 2
          ? 'Digite pelo menos 2 letras na busca do topo.'
          : `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'} para “${q}”`}
      </p>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {resultados.map((r) => (
          <li key={r.rota}>
            <Link
              to={r.rota}
              className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 no-underline hover:border-primary"
            >
              <span className="text-xs font-semibold text-muted">
                {ROTULO[r.tipo].toUpperCase()} · {r.subtitulo}
              </span>
              <span className="font-semibold text-text">{r.titulo}</span>
              <span className="text-sm text-muted">{r.trecho}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
