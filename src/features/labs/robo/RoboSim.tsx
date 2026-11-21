import { useEffect, useId, useState } from 'react';
import {
  chegou,
  executarComando,
  FASES,
  NOME_COMANDO,
  NOME_DIRECAO,
  type Comando,
  type Estado,
} from '@/features/labs/robo/robo';
import { usePrefereMenosMovimento } from '@/ui/usePrefereMenosMovimento';

const CELULA = 56;
const ANGULO = { N: 0, L: 90, S: 180, O: 270 } as const;
const PALETA: Comando[] = ['andar', 'esquerda', 'direita', 'vago'];

type Situacao = 'montando' | 'executando' | 'venceu' | 'falhou' | 'incompleto';

/** Simulação: o aluno monta um algoritmo de comandos e o robô executa um por vez. */
export function RoboSim() {
  const [faseIdx, setFaseIdx] = useState(0);
  const fase = FASES[faseIdx] ?? (FASES[0] as (typeof FASES)[number]);
  const [programa, setPrograma] = useState<Comando[]>([]);
  const [estado, setEstado] = useState<Estado>(fase.inicio);
  const [passo, setPasso] = useState(-1);
  const [situacao, setSituacao] = useState<Situacao>('montando');
  const [mensagem, setMensagem] = useState(
    'Monte o algoritmo com os comandos abaixo e aperte Executar.',
  );
  const [rastro, setRastro] = useState<Estado[]>([]);
  const menosMovimento = usePrefereMenosMovimento();
  const ids = useId();

  function reiniciar(novaFase = faseIdx, manterPrograma = true) {
    const f = FASES[novaFase] ?? fase;
    setFaseIdx(novaFase);
    setEstado(f.inicio);
    setPasso(-1);
    setRastro([]);
    setSituacao('montando');
    setMensagem(f.objetivo);
    if (!manterPrograma) setPrograma([]);
  }

  // Executa um comando a cada intervalo enquanto estiver "executando".
  useEffect(() => {
    if (situacao !== 'executando') return;
    const t = setTimeout(
      () => {
        const proximo = passo + 1;
        const cmd = programa[proximo];
        if (cmd === undefined) {
          setSituacao(chegou(fase, estado) ? 'venceu' : 'incompleto');
          setMensagem(
            chegou(fase, estado)
              ? 'Chegou!'
              : 'Os comandos acabaram e o robô não chegou. Um algoritmo precisa levar ao resultado — revise a sequência.',
          );
          return;
        }
        const r = executarComando(fase, estado, cmd);
        setPasso(proximo);
        setMensagem(`Comando ${proximo + 1}: ${r.descricao}`);
        if (r.tipo !== 'ok') {
          setSituacao('falhou');
          return;
        }
        setRastro((rs) => [...rs, estado]);
        setEstado(r.estado);
        if (chegou(fase, r.estado)) {
          setSituacao('venceu');
          const extra = proximo + 1 === programa.length;
          setMensagem(
            programa.length <= fase.minimo
              ? `Chegou com ${programa.length} comandos — o menor algoritmo possível!`
              : `Chegou com ${proximo + 1} comandos${extra ? '' : ` (sobraram ${programa.length - proximo - 1} comandos sem uso)`}. Desafio: dá para fazer com ${fase.minimo}?`,
          );
        }
      },
      menosMovimento ? 250 : 650,
    );
    return () => clearTimeout(t);
  }, [situacao, passo, programa, fase, estado, menosMovimento]);

  const travado = situacao === 'executando';
  const L = fase.largura * CELULA;
  const A = fase.altura * CELULA;

  const botao =
    'inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-2 disabled:opacity-40';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div role="group" aria-label="Fases" className="flex flex-wrap gap-2">
        {FASES.map((f, i) => (
          <button
            key={f.nome}
            type="button"
            aria-pressed={i === faseIdx}
            disabled={travado}
            onClick={() => reiniciar(i, false)}
            className={`min-h-10 rounded-full px-4 text-sm ${i === faseIdx ? 'bg-primary font-semibold text-on-primary' : 'border border-border hover:bg-surface-2'}`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)]">
        <figure className="m-0 flex flex-col items-center gap-2">
          <svg
            viewBox={`-4 -4 ${L + 8} ${A + 8}`}
            width={Math.min(L + 8, 340)}
            role="img"
            aria-label={`Tabuleiro ${fase.largura} por ${fase.altura}. Robô na coluna ${estado.x + 1}, linha ${estado.y + 1}, olhando para ${NOME_DIRECAO[estado.dir]}. Bandeira na coluna ${fase.meta.x + 1}, linha ${fase.meta.y + 1}.`}
            className="h-auto max-w-full"
          >
            {Array.from({ length: fase.altura }, (_, y) =>
              Array.from({ length: fase.largura }, (_, x) => {
                const parede = fase.paredes.some((p) => p.x === x && p.y === y);
                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x * CELULA + 2}
                    y={y * CELULA + 2}
                    width={CELULA - 4}
                    height={CELULA - 4}
                    rx="8"
                    className={parede ? 'fill-muted' : 'fill-bg stroke-border'}
                    strokeWidth={parede ? 0 : 1.5}
                  />
                );
              }),
            )}
            {rastro.map((r, i) => (
              <circle
                key={i}
                cx={r.x * CELULA + CELULA / 2}
                cy={r.y * CELULA + CELULA / 2}
                r="4"
                className="fill-primary opacity-50"
              />
            ))}
            {/* Bandeira */}
            <g transform={`translate(${fase.meta.x * CELULA + 16} ${fase.meta.y * CELULA + 12})`}>
              <path d="M4 0v32" className="stroke-text" strokeWidth="2.5" />
              <path d="M6 2h18l-5 6 5 6H6z" className="fill-accent" />
            </g>
            {/* Robô */}
            <g
              style={{
                transform: `translate(${estado.x * CELULA + CELULA / 2}px, ${estado.y * CELULA + CELULA / 2}px) rotate(${ANGULO[estado.dir]}deg)`,
                transition: menosMovimento ? 'none' : 'transform 450ms ease-in-out',
              }}
            >
              <rect
                x="-17"
                y="-17"
                width="34"
                height="34"
                rx="10"
                className={situacao === 'falhou' ? 'fill-danger' : 'fill-primary'}
              />
              <circle cx="-7" cy="-5" r="4" className="fill-bg" />
              <circle cx="7" cy="-5" r="4" className="fill-bg" />
              <path d="M-8 -24 L0 -32 L8 -24 Z" className="fill-primary" />
            </g>
          </svg>
          <figcaption className="text-center text-sm text-muted">
            A seta em cima do robô mostra para onde ele está olhando.
          </figcaption>
        </figure>

        <div className="flex min-w-0 flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-muted">Comandos que o robô entende</p>
          <div className="flex flex-wrap gap-2">
            {PALETA.map((c) => (
              <button
                key={c}
                type="button"
                disabled={travado || programa.length >= 30}
                onClick={() => setPrograma((p) => [...p, c])}
                className={`${botao} ${c === 'vago' ? 'border-dashed' : ''}`}
              >
                + {NOME_COMANDO[c]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <p id={`${ids}-prog`} className="m-0 text-sm font-semibold text-muted">
              Seu algoritmo ({programa.length} {programa.length === 1 ? 'comando' : 'comandos'})
            </p>
            {programa.length === 0 ? (
              <p className="m-0 rounded-xl border border-dashed border-border p-3 text-sm text-muted">
                Vazio. Adicione comandos.
              </p>
            ) : (
              <ol
                aria-labelledby={`${ids}-prog`}
                className="m-0 flex max-h-64 list-none flex-col gap-1 overflow-auto p-0"
              >
                {programa.map((c, i) => (
                  <li
                    key={i}
                    aria-current={i === passo ? 'step' : undefined}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${
                      i === passo
                        ? situacao === 'falhou'
                          ? 'bg-danger-soft font-semibold'
                          : 'bg-primary-soft font-semibold'
                        : 'bg-surface-2'
                    }`}
                  >
                    <span className="w-6 text-muted">{i + 1}.</span>
                    <span className="flex-1">{NOME_COMANDO[c]}</span>
                    <button
                      type="button"
                      disabled={travado}
                      aria-label={`Remover comando ${i + 1}: ${NOME_COMANDO[c]}`}
                      onClick={() => setPrograma((p) => p.filter((_, j) => j !== i))}
                      className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface hover:text-danger disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={travado || programa.length === 0}
              onClick={() => {
                reiniciar(faseIdx);
                setSituacao('executando');
                setMensagem('Executando…');
              }}
              className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-40"
            >
              Executar
            </button>
            <button
              type="button"
              className={botao}
              onClick={() => reiniciar(faseIdx)}
              disabled={situacao === 'montando'}
            >
              Reiniciar posição
            </button>
            <button
              type="button"
              className={botao}
              disabled={travado || programa.length === 0}
              onClick={() => reiniciar(faseIdx, false)}
            >
              Apagar algoritmo
            </button>
          </div>

          <p
            aria-live="polite"
            className={`m-0 rounded-xl px-4 py-3 text-[15px] ${
              situacao === 'venceu'
                ? 'bg-success-soft font-medium text-text'
                : situacao === 'falhou' || situacao === 'incompleto'
                  ? 'bg-danger-soft'
                  : 'bg-surface-2'
            }`}
          >
            {situacao === 'venceu' && <strong className="text-success">Missão cumprida. </strong>}
            {mensagem}
          </p>
          {situacao === 'venceu' && faseIdx < FASES.length - 1 && (
            <button
              type="button"
              className={`${botao} self-start`}
              onClick={() => reiniciar(faseIdx + 1, false)}
            >
              Próxima fase →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
