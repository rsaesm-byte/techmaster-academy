import type { Etapa } from '@/domain/conteudo';

type EtapaDiagrama = Extract<Etapa, { tipo: 'diagrama' }>;

const ESTILO: Record<EtapaDiagrama['nos'][number]['forma'], string> = {
  inicio: 'rounded-full bg-primary text-on-primary font-semibold',
  fim: 'rounded-full bg-primary text-on-primary font-semibold',
  passo: 'rounded-lg border border-border bg-surface',
  decisao: 'rounded-lg border-2 border-accent bg-accent-soft',
};

const ROTULO: Record<EtapaDiagrama['nos'][number]['forma'], string> = {
  inicio: 'Início',
  fim: 'Fim',
  passo: 'Passo',
  decisao: 'Decisão',
};

/** Fluxograma vertical feito de HTML (não imagem): leitores de tela leem como uma lista ordenada. */
export function Diagrama({ etapa }: { etapa: EtapaDiagrama }) {
  return (
    <figure className="m-0 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <ol aria-label={etapa.titulo} className="m-0 flex list-none flex-col items-center p-0">
        {etapa.nos.map((no, i) => (
          <li key={i} className="flex w-full max-w-sm flex-col items-center">
            {i > 0 && (
              <svg
                width="16"
                height="28"
                viewBox="0 0 16 28"
                aria-hidden="true"
                className="text-muted"
              >
                <path
                  d="M8 0v22M3 17l5 6 5-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            )}
            <div className={`w-full px-4 py-2.5 text-center text-[15px] ${ESTILO[no.forma]}`}>
              <span className="sr-only">{ROTULO[no.forma]}: </span>
              {no.forma === 'decisao' && (
                <span aria-hidden="true" className="mr-1 font-bold text-accent">
                  ◆
                </span>
              )}
              {no.texto}
            </div>
          </li>
        ))}
      </ol>
      <details className="text-[15px]">
        <summary className="cursor-pointer font-medium">Descrição do diagrama em texto</summary>
        <p className="mt-2 mb-0 text-muted">{etapa.descricao}</p>
      </details>
    </figure>
  );
}
