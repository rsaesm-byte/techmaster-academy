import { Link } from 'react-router';
import { catalogo } from '@/content';
import { ESCOLAS } from '@/content/escolas';

/** Catálogo das 12 escolas. Só as que têm disciplina publicada levam a algum lugar. */
export default function Escolas() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 text-3xl font-bold tracking-tight">Escolas</h1>
        <p className="mt-2 mb-0 max-w-[70ch] text-muted">
          O currículo completo tem 12 escolas. As primeiras já estão abertas; as outras entram uma
          de cada vez, sempre com aulas completas — nada de página vazia.
        </p>
      </div>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {ESCOLAS.map((e) => {
          const doEscola = catalogo.disciplinas.filter((d) => d.escola === e.letra);
          const disciplina = doEscola[0];
          const varias = doEscola.length > 1;
          const conteudo = (
            <>
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`grid size-11 shrink-0 place-items-center rounded-xl ${disciplina ? 'bg-primary-soft text-primary' : 'bg-surface-2 text-muted'}`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={e.icone} />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold text-muted">ESCOLA {e.letra}</span>
                  <span className="font-semibold text-text">{e.nome}</span>
                </span>
              </span>
              <span className="text-sm text-muted">{e.resumo}</span>
              <span
                className={`mt-auto text-sm font-semibold ${disciplina ? 'text-primary' : 'text-muted'}`}
              >
                {disciplina
                  ? varias
                    ? `Disponível · ${doEscola.length} disciplinas`
                    : 'Disponível · entrar →'
                  : 'No roadmap'}
              </span>
            </>
          );
          return (
            <li key={e.letra}>
              {varias ? (
                <div className="flex h-full min-h-40 flex-col gap-3 rounded-2xl border-2 border-primary bg-surface p-5">
                  {conteudo}
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {doEscola.map((d) => (
                      <li key={d.id}>
                        <Link
                          to={`/trilha/${d.id}`}
                          className="inline-block rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary no-underline"
                        >
                          {d.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : disciplina ? (
                <Link
                  to={`/trilha/${disciplina.id}`}
                  className="flex h-full min-h-40 flex-col gap-3 rounded-2xl border-2 border-primary bg-surface p-5 no-underline"
                >
                  {conteudo}
                </Link>
              ) : (
                <div className="flex h-full min-h-40 flex-col gap-3 rounded-2xl border border-dashed border-border p-5 opacity-80">
                  {conteudo}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
