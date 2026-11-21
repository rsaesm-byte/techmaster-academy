import { HashRouter, Route, Routes } from 'react-router';
import { AppShell } from '@/app/AppShell';
import { ThemeProvider } from '@/app/ThemeProvider';
import { Configuracoes } from '@/features/configuracoes/Configuracoes';
import { Painel } from '@/features/dashboard/Painel';
import { NaoEncontrada } from '@/features/NaoEncontrada';
import { DexieProgressRepository } from '@/persistence/dexie';
import type { ProgressRepository } from '@/persistence/ProgressRepository';
import { RepositorioProvider } from '@/persistence/RepositorioProvider';

let repositorioPadrao: ProgressRepository | undefined;
const obterRepositorioPadrao = () => (repositorioPadrao ??= new DexieProgressRepository());

/**
 * Rotas com hash (/#/configuracoes): o GitHub Pages só entrega arquivos,
 * e com hash o navegador nunca pede ao servidor uma página que não existe.
 */
export function App({ repositorio }: { repositorio?: ProgressRepository }) {
  return (
    <RepositorioProvider repositorio={repositorio ?? obterRepositorioPadrao()}>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Painel />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </RepositorioProvider>
  );
}
