import { useEffect, useState } from 'react';
import { aoTerAtualizacao, aplicarAtualizacao } from '@/app/offline';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { usePreferencias } from '@/app/preferencias';
import { Logo } from '@/ui/Logo';

const itens = [
  { para: '/', rotulo: 'Painel', fim: true },
  { para: '/escolas', rotulo: 'Trilhas', fim: false },
  { para: '/revisao', rotulo: 'Revisão', fim: false },
  { para: '/labs', rotulo: 'Laboratórios', fim: false },
  { para: '/glossario', rotulo: 'Glossário', fim: false },
  { para: '/configuracoes', rotulo: 'Configurações', fim: false },
] as const;

/** Moldura comum a todas as páginas: cabeçalho, navegação e área principal. */
export function AppShell() {
  const { pathname } = useLocation();
  const { prefs } = usePreferencias();
  // Modo foco: dentro de uma aula, o menu some para reduzir distrações.
  const esconder = prefs.modoFoco && pathname.startsWith('/aula/');
  const [consulta, setConsulta] = useState('');
  const [temAtualizacao, setTemAtualizacao] = useState(false);
  useEffect(() => aoTerAtualizacao(() => setTemAtualizacao(true)), []);
  const navegar = useNavigate();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Pular para o conteúdo
      </a>
      {temAtualizacao && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-center gap-3 bg-primary px-4 py-2 text-sm text-on-primary"
        >
          Uma nova versão da plataforma está pronta.
          <button
            type="button"
            onClick={aplicarAtualizacao}
            className="min-h-9 rounded-md bg-on-primary px-3 font-semibold text-primary"
          >
            Atualizar agora
          </button>
        </div>
      )}
      <header className="flex items-center gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
        <NavLink to="/" aria-label="TechMaster Academy — ir para o painel" className="rounded-lg">
          <Logo />
        </NavLink>
        <form
          role="search"
          className="ml-auto flex min-w-0 flex-1 justify-end"
          onSubmit={(e) => {
            e.preventDefault();
            void navegar(`/busca?q=${encodeURIComponent(consulta)}`);
          }}
        >
          <label className="flex h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-bg px-3 text-muted">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="sr-only">Buscar aulas, termos e laboratórios</span>
            <input
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar…"
              className="min-w-0 flex-1 bg-transparent text-text outline-offset-4"
            />
          </label>
        </form>
      </header>
      <div className="flex flex-1 flex-wrap content-start sm:content-stretch">
        <nav
          hidden={esconder}
          aria-label="Principal"
          className="flex w-full gap-1 overflow-x-auto border-b border-border bg-surface p-3 text-sm font-medium whitespace-nowrap sm:w-56 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0"
        >
          {itens.map((item) => (
            <NavLink
              key={item.para}
              to={item.para}
              end={item.fim}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-lg px-3 ${
                  isActive
                    ? 'bg-primary-soft text-text'
                    : 'text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
        <main id="conteudo" tabIndex={-1} className="min-w-0 flex-[999_1_560px] px-4 py-8 sm:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
