import type { Aula, Modo } from '@/domain/conteudo';
import type { Tentativa } from '@/domain/progresso';
import { avaliarDiagnostico } from '@/engines/pedagogia/analise';

/** Depois do diagnóstico, uma recomendação — nunca um bloqueio. */
export function DiagnosticoResultado({
  aula,
  tentativas,
  irPara,
  modo,
  escolherModo,
}: {
  aula: Aula;
  tentativas: readonly Tentativa[];
  irPara: (i: number) => void;
  modo: Modo;
  escolherModo: (m: Modo) => void;
}) {
  const r = avaliarDiagnostico(aula, tentativas);
  if (r.tipo === 'incompleto') return null;
  const botao =
    'min-h-11 rounded-lg border border-border bg-surface px-4 font-medium hover:border-primary';
  return (
    <aside
      aria-live="polite"
      className="flex flex-col gap-3 rounded-2xl border-2 border-primary bg-primary-soft p-5"
    >
      {r.tipo === 'domina' ? (
        <>
          <p className="m-0 font-semibold">Parece que você já conhece o básico deste assunto.</p>
          <p className="m-0">
            Você pode seguir a aula toda ou ir direto para a parte prática. Os exercícios dizem se
            valeu a pena pular.
          </p>
          <div className="flex flex-wrap gap-2">
            {r.pularPara && (
              <button
                type="button"
                className={botao}
                onClick={() => irPara(r.pularPara?.indice ?? 0)}
              >
                Ir para: {r.pularPara.titulo}
              </button>
            )}
            {modo !== 'tecnico' && (
              <button type="button" className={botao} onClick={() => escolherModo('tecnico')}>
                Usar o modo Técnico
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="m-0 font-semibold">
            {r.tipo === 'parcial' ? 'Você já tem uma base.' : 'Ótimo ponto de partida.'} Esta aula
            foi feita para isso.
          </p>
          <p className="m-0">Siga as etapas em ordem; o modo Guiado explica passo a passo.</p>
          {modo !== 'guiado' && (
            <button
              type="button"
              className={`${botao} self-start`}
              onClick={() => escolherModo('guiado')}
            >
              Usar o modo Guiado
            </button>
          )}
        </>
      )}
    </aside>
  );
}
