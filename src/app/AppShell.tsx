import { NavLink, Outlet } from 'react-router';
import { Logo } from '@/ui/Logo';

const itens = [
  { para: '/', rotulo: 'Painel', fim: true },
  { para: '/revisao', rotulo: 'Revisão', fim: false },
  { para: '/labs', rotulo: 'Laboratórios', fim: false },
  { para: '/configuracoes', rotulo: 'Configurações', fim: false },
] as const;

/** Moldura comum a todas as páginas: cabeçalho, navegação e área principal. */
export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Pular para o conteúdo
      </a>
      <header className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3.5">
        <NavLink to="/" aria-label="TechMaster Academy — ir para o painel" className="rounded-lg">
          <Logo />
        </NavLink>
      </header>
      <div className="flex flex-1 flex-wrap content-start sm:content-stretch">
        <nav
          aria-label="Principal"
          className="flex w-full gap-1 border-b border-border bg-surface p-3 text-sm font-medium sm:w-56 sm:flex-col sm:border-r sm:border-b-0"
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
