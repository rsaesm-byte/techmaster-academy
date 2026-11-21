import { Link } from 'react-router';
import { catalogo } from '@/content';
import type { Modulo } from '@/domain/conteudo';
import type { ProgressoAula, StatusAula } from '@/domain/progresso';
import { proximaAula } from '@/features/trilha/useProgressoGeral';

type Estado = StatusAula | 'nao-iniciada';

const ESTILO: Record<Estado, { rotulo: string; marcador: string; texto: string }> = {
  dominada: {
    rotulo: 'Dominada',
    marcador: 'bg-accent text-bg border-accent',
    texto: 'text-accent',
  },
  concluida: {
    rotulo: 'Concluída · revisar',
    marcador: 'bg-success text-bg border-success',
    texto: 'text-success',
  },
  'em-andamento': {
    rotulo: 'Em andamento',
    marcador: 'bg-primary text-on-primary border-primary',
    texto: 'text-primary',
  },
  'nao-iniciada': {
    rotulo: 'Não iniciada',
    marcador: 'bg-surface text-muted border-border',
    texto: 'text-muted',
  },
};

/**
 * MAPA DA JORNADA — as aulas como paradas de um caminho.
 * Visualmente é uma estrada em zigue-zague (SVG decorativo); para leitores de tela é
 * uma lista ordenada comum, com o estado de cada aula escrito por extenso.
 */
export function MapaJornada({
  modulo,
  progressos,
}: {
  modulo: Modulo;
  progressos: Map<string, ProgressoAula>;
}) {
  const proxima = proximaAula(modulo.aulas, progressos);
  const n = modulo.aulas.length;
  const concluidas = modulo.aulas.filter((id) => {
    const s = progressos.get(id)?.status;
    return s === 'concluida' || s === 'dominada';
  }).length;

  // Estrada: curva que passa pelo centro de cada parada, alternando esquerda (25%) e direita (75%).
  const pontos = modulo.aulas.map((_, i) => ({ x: i % 2 === 0 ? 25 : 75, y: i * 100 + 50 }));
  const caminho = pontos
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const a = pontos[i - 1] as { x: number; y: number };
      return `C ${a.x} ${a.y + 60}, ${p.x} ${p.y - 60}, ${p.x} ${p.y}`;
    })
    .join(' ');
  const feito = Math.max(
    0,
    (pontos.findIndex((_, i) => modulo.aulas[i] === proxima) + 1 || n + 1) - 1,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label={`Progresso no módulo ${modulo.titulo}`}
          aria-valuemin={0}
          aria-valuemax={n}
          aria-valuenow={concluidas}
          className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${(concluidas / n) * 100}%` }}
          />
        </div>
        <span className="text-sm whitespace-nowrap text-muted">
          {concluidas} de {n} aulas
        </span>
      </div>

      <div className="relative">
        {/* Estrada (só visual, a partir de telas médias) */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 100 ${n * 100}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
        >
          <path
            d={caminho}
            fill="none"
            className="stroke-border"
            strokeWidth="10"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
          <path
            d={caminho}
            fill="none"
            className="stroke-surface-2"
            strokeWidth="2"
            strokeDasharray="8 10"
            vectorEffect="non-scaling-stroke"
          />
          {feito > 0 && (
            <path
              d={pontos
                .slice(0, feito + 1)
                .map((p, i, arr) => {
                  if (i === 0) return `M ${p.x} ${p.y}`;
                  const a = arr[i - 1] as { x: number; y: number };
                  return `C ${a.x} ${a.y + 60}, ${p.x} ${p.y - 60}, ${p.x} ${p.y}`;
                })
                .join(' ')}
              fill="none"
              className="stroke-accent"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          )}
        </svg>

        <ol className="relative m-0 list-none p-0">
          {modulo.aulas.map((id, i) => {
            const aula = catalogo.aulas.get(id);
            if (!aula) return null;
            const estado: Estado = progressos.get(id)?.status ?? 'nao-iniciada';
            const e = ESTILO[estado];
            const aqui = id === proxima;
            const direita = i % 2 === 1;
            return (
              <li
                key={id}
                className={`flex items-center sm:h-32 ${direita ? 'sm:justify-end' : 'sm:justify-start'} border-l-4 border-border py-2 pl-4 sm:border-0 sm:py-0 sm:pl-0`}
              >
                <Link
                  to={`/aula/${id}`}
                  aria-current={aqui ? 'step' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-2xl border bg-surface p-3 no-underline sm:w-[46%] ${
                    aqui
                      ? 'border-2 border-primary shadow-[0_0_0_4px_var(--tm-primary-soft)]'
                      : 'border-border hover:border-primary'
                  } ${direita ? 'sm:flex-row-reverse sm:text-right' : ''}`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-12 shrink-0 place-items-center rounded-full border-2 text-lg font-bold ${e.marcador}`}
                  >
                    {estado === 'dominada' ? '★' : estado === 'concluida' ? '✓' : i + 1}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs font-semibold text-muted">
                      AULA {i + 1} · {aula.duracaoMin} min
                    </span>
                    <span className="font-semibold text-text">{aula.titulo}</span>
                    <span className={`text-sm font-medium ${e.texto}`}>
                      {e.rotulo}
                      {aqui && <span className="text-primary"> · próximo passo</span>}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
