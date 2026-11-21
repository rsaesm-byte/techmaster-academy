import { lazy, Suspense, type ReactNode } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { AppShell } from '@/app/AppShell';
import { ThemeProvider } from '@/app/ThemeProvider';
import { Configuracoes } from '@/features/configuracoes/Configuracoes';
import { PlayerAulaRota } from '@/features/aula/PlayerAula';
import { Painel } from '@/features/dashboard/Painel';
import { NaoEncontrada } from '@/features/NaoEncontrada';
import { DexieProgressRepository } from '@/persistence/dexie';
import type { ProgressRepository } from '@/persistence/ProgressRepository';
import { RepositorioProvider } from '@/persistence/RepositorioProvider';

const Labs = lazy(() => import('@/features/labs/Labs'));
const LabAlgoritmos = lazy(() => import('@/features/labs/algoritmos/LabAlgoritmos'));
const LabRobo = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabRobo })),
);
const LabLaco = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabLaco })),
);

const carregando = <p role="status">Carregando…</p>;
const preguicoso = (el: ReactNode) => <Suspense fallback={carregando}>{el}</Suspense>;

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
              <Route path="aula/:aulaId" element={<PlayerAulaRota />} />
              <Route path="labs" element={preguicoso(<Labs />)} />
              <Route path="lab/algoritmos" element={preguicoso(<LabAlgoritmos />)} />
              <Route path="lab/robo" element={preguicoso(<LabRobo />)} />
              <Route path="lab/laco" element={preguicoso(<LabLaco />)} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </RepositorioProvider>
  );
}
