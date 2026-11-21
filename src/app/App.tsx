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
import { comSincronizacao, iniciarSincronizacao } from '@/sync/sincronizador';

const Escolas = lazy(() => import('@/features/catalogo/Escolas'));
const Trilha = lazy(() => import('@/features/trilha/Trilha'));
const BoasVindas = lazy(() => import('@/features/boasvindas/BoasVindas'));
const Glossario = lazy(() => import('@/features/glossario/Glossario'));
const Busca = lazy(() => import('@/features/busca/Busca'));
const MeuProgresso = lazy(() => import('@/features/progresso/MeuProgresso'));
const Revisao = lazy(() => import('@/features/revisao/Revisao'));
const Labs = lazy(() => import('@/features/labs/Labs'));
const LabWeb = lazy(() => import('@/features/labs/web/LabWeb'));
const LabAlgoritmos = lazy(() => import('@/features/labs/algoritmos/LabAlgoritmos'));
const LabRobo = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabRobo })),
);
const LabOrdenacao = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabOrdenacao })),
);
const LabBinario = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabBinario })),
);
const LabPortas = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabPortas })),
);
const LabCpu = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabCpu })),
);
const LabTerminal = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabTerminal })),
);
const LabSistemas = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabSistemas })),
);
const LabDados = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabDados })),
);
const LabLaco = lazy(() =>
  import('@/features/labs/LabSimples').then((m) => ({ default: m.LabLaco })),
);

const carregando = <p role="status">Carregando…</p>;
const preguicoso = (el: ReactNode) => <Suspense fallback={carregando}>{el}</Suspense>;

let repositorioPadrao: ProgressRepository | undefined;
function obterRepositorioPadrao() {
  if (!repositorioPadrao) {
    const base = new DexieProgressRepository();
    // O sincronizador lê e grava direto no banco; as telas usam a versão que avisa a nuvem.
    iniciarSincronizacao(base);
    repositorioPadrao = comSincronizacao(base);
  }
  return repositorioPadrao;
}

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
              <Route path="boas-vindas" element={preguicoso(<BoasVindas />)} />
              <Route path="escolas" element={preguicoso(<Escolas />)} />
              <Route path="trilha/:disciplinaId" element={preguicoso(<Trilha />)} />
              <Route path="glossario" element={preguicoso(<Glossario />)} />
              <Route path="busca" element={preguicoso(<Busca />)} />
              <Route path="progresso" element={preguicoso(<MeuProgresso />)} />
              <Route path="revisao" element={preguicoso(<Revisao />)} />
              <Route path="labs" element={preguicoso(<Labs />)} />
              <Route path="lab/algoritmos" element={preguicoso(<LabAlgoritmos />)} />
              <Route path="lab/web" element={preguicoso(<LabWeb />)} />
              <Route path="lab/robo" element={preguicoso(<LabRobo />)} />
              <Route path="lab/ordenacao" element={preguicoso(<LabOrdenacao />)} />
              <Route path="lab/binario" element={preguicoso(<LabBinario />)} />
              <Route path="lab/portas" element={preguicoso(<LabPortas />)} />
              <Route path="lab/sistemas" element={preguicoso(<LabSistemas />)} />
              <Route path="lab/dados" element={preguicoso(<LabDados />)} />
              <Route path="lab/cpu" element={preguicoso(<LabCpu />)} />
              <Route path="lab/terminal" element={preguicoso(<LabTerminal />)} />
              <Route path="lab/laco" element={preguicoso(<LabLaco />)} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </RepositorioProvider>
  );
}
