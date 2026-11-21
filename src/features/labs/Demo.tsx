import { lazy, Suspense } from 'react';
import type { Simulacao } from '@/domain/conteudo';

// Cada simulação é baixada só quando aparece na tela (code splitting):
// quem não abre a aula 5 nunca baixa o código WebGL.
const Visualizador = lazy(() =>
  import('@/features/labs/algoritmos/Visualizador').then((m) => ({ default: m.Visualizador })),
);
const RoboSim = lazy(() =>
  import('@/features/labs/robo/RoboSim').then((m) => ({ default: m.RoboSim })),
);
const ExpressaoDemo = lazy(() =>
  import('@/features/labs/expressao/ExpressaoDemo').then((m) => ({ default: m.ExpressaoDemo })),
);
const OrdenacaoSim = lazy(() =>
  import('@/features/labs/ordenacao/OrdenacaoSim').then((m) => ({ default: m.OrdenacaoSim })),
);
const BinarioSim = lazy(() =>
  import('@/features/labs/binario/BinarioSim').then((m) => ({ default: m.BinarioSim })),
);
const PortasSim = lazy(() =>
  import('@/features/labs/portas/PortasSim').then((m) => ({ default: m.PortasSim })),
);
const CpuSim = lazy(() =>
  import('@/features/labs/cpu/CpuSim').then((m) => ({ default: m.CpuSim })),
);
const TerminalSim = lazy(() =>
  import('@/features/labs/terminal/TerminalSim').then((m) => ({ default: m.TerminalSim })),
);
const LacoGrafico = lazy(() =>
  import('@/features/labs/laco/LacoGrafico').then((m) => ({ default: m.LacoGrafico })),
);

export function Demo({ simulacao }: { simulacao: Simulacao }) {
  return (
    <Suspense
      fallback={
        <p role="status" className="m-0 rounded-2xl border border-border bg-surface p-6 text-muted">
          Carregando a simulação…
        </p>
      }
    >
      {(() => {
        switch (simulacao.tipo) {
          case 'visualizador':
            return (
              <Visualizador
                codigoInicial={simulacao.codigo}
                entradasIniciais={simulacao.entradas}
                editavel={simulacao.editavel}
              />
            );
          case 'robo':
            return <RoboSim />;
          case 'expressao':
            return <ExpressaoDemo expressoes={simulacao.expressoes} />;
          case 'laco-grafico':
            return <LacoGrafico />;
          case 'ordenacao':
            return <OrdenacaoSim algoritmoInicial={simulacao.algoritmo} fixo={simulacao.fixo} />;
          case 'binario':
            return <BinarioSim modo={simulacao.modo} bits={simulacao.bits} />;
          case 'cpu':
            return (
              <CpuSim
                {...(simulacao.programa !== undefined ? { programa: simulacao.programa } : {})}
                memoria={simulacao.memoria}
                editavel={simulacao.editavel}
              />
            );
          case 'terminal':
            return <TerminalSim cenario={simulacao.cenario} />;
          case 'portas':
            return (
              <PortasSim modo={simulacao.modo} porta={simulacao.porta} fixo={simulacao.fixo} />
            );
        }
      })()}
    </Suspense>
  );
}
