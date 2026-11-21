import { createContext, use, type ReactNode } from 'react';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

const RepositorioContext = createContext<ProgressRepository | null>(null);

/** Entrega o repositório de progresso às telas. Nos testes, recebe um em memória. */
export function RepositorioProvider({
  repositorio,
  children,
}: {
  repositorio: ProgressRepository;
  children: ReactNode;
}) {
  return <RepositorioContext value={repositorio}>{children}</RepositorioContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRepositorio(): ProgressRepository {
  const repo = use(RepositorioContext);
  if (!repo) throw new Error('useRepositorio precisa estar dentro de <RepositorioProvider>');
  return repo;
}
