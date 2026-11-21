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
          O currículo completo tem 12 escolas. A primeira já está aberta; as outras entram uma de
          cada vez, sempre com aulas completas — nada de página vazia.
        </p>
      </div>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {ESCOLAS.map((e) => {
          const disciplina = catalogo.disciplinas.find((d) => d.escola === e.letra);
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
                {disciplina ? 'Disponível · entrar →' : 'No roadmap'}
              </span>
            </>
          );
          return (
            <li key={e.letra}>
              {disciplina ? (
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
