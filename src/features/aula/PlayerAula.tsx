import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { Tutor } from '@/features/aula/Tutor';
import { MODOS, useModo } from '@/app/modo';
import { catalogo } from '@/content';
import type { Aula } from '@/domain/conteudo';
import type { ResultadoDominio } from '@/engines/mastery/dominio';
import { EtapaView } from '@/features/aula/EtapaView';
import { faseEtapa, tituloEtapa } from '@/features/aula/rotulos';
import { useProgressoAula } from '@/features/aula/useProgressoAula';
import { NaoEncontrada } from '@/features/NaoEncontrada';

export function PlayerAulaRota() {
  const { aulaId = '' } = useParams();
  const aula = catalogo.aulas.get(aulaId);
  return aula ? <PlayerAula key={aula.id} aula={aula} /> : <NaoEncontrada />;
}

function PlayerAula({ aula }: { aula: Aula }) {
  const { progresso, tentativas, irPara, registrar, concluir } = useProgressoAula(aula);
  const { modo, escolher } = useModo();
  const [resultado, setResultado] = useState<ResultadoDominio | null>(null);
  const [listaAberta, setListaAberta] = useState(false);
  const [tutorAberto, setTutorAberto] = useState(false);
  const [params, setParams] = useSearchParams();
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const primeiraRenderizacao = useRef(true);
  const local = catalogo.localizar(aula.id);

  const indice = progresso?.etapaAtual ?? 0;
  const etapa = aula.etapas[indice];
  const ultima = indice === aula.etapas.length - 1;

  // Ao trocar de etapa, o foco vai para o título: quem usa leitor de tela sabe onde está.
  useEffect(() => {
    if (!progresso) return;
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    tituloRef.current?.focus();
  }, [indice, resultado, progresso]);

  // Link direto para uma etapa (?etapa=id), usado pelas recomendações do painel.
  const etapaPedida = params.get('etapa');
  useEffect(() => {
    if (!progresso || !etapaPedida) return;
    const i = aula.etapas.findIndex((e) => e.id === etapaPedida);
    setParams({}, { replace: true });
    if (i >= 0) void irPara(i);
  }, [progresso, etapaPedida, aula, irPara, setParams]);

  if (!progresso || !etapa) {
    return <p role="status">Carregando aula…</p>;
  }

  const proximaAulaId = local?.modulo.aulas[local.indice + 1];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm text-muted">
            {local?.disciplina.titulo} · {local?.modulo.titulo}
          </p>
          <p className="m-0 text-lg font-semibold">{aula.titulo}</p>
        </div>
        <div
          role="group"
          aria-label="Modo de apresentação"
          className="flex rounded-xl border border-border bg-surface-2 p-1 text-sm"
        >
          {MODOS.map((m) => (
            <button
              key={m.valor}
              type="button"
              aria-pressed={modo === m.valor}
              onClick={() => escolher(m.valor)}
              className={`min-h-10 rounded-lg px-3 ${
                modo === m.valor
                  ? 'bg-surface font-semibold shadow-[0_0_0_1px_var(--tm-border)]'
                  : 'text-muted'
              }`}
            >
              {m.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-expanded={tutorAberto}
          aria-controls="tutor-painel"
          onClick={() => setTutorAberto((a) => !a)}
          className="min-h-10 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-2"
        >
          {tutorAberto ? 'Fechar tutor' : 'Precisa de ajuda? Tutor'}
        </button>
      </div>
      {tutorAberto && (
        <div id="tutor-painel">
          <Tutor
            aula={aula}
            indice={indice}
            modo={modo}
            irPara={(i) => void irPara(i)}
            escolherModo={escolher}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div
          role="progressbar"
          aria-label="Progresso da aula"
          aria-valuemin={1}
          aria-valuemax={aula.etapas.length}
          aria-valuenow={indice + 1}
          className="h-2 overflow-hidden rounded-full bg-surface-2"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${((indice + 1) / aula.etapas.length) * 100}%` }}
          />
        </div>
        <details
          className="text-sm text-muted"
          open={listaAberta}
          onToggle={(e) => setListaAberta(e.currentTarget.open)}
        >
          <summary className="cursor-pointer">
            Etapa {indice + 1} de {aula.etapas.length} · {faseEtapa(etapa)} — ver todas
          </summary>
          <ol className="mt-2 grid gap-1 pl-0 sm:grid-cols-2">
            {aula.etapas.map((e, i) => (
              <li key={e.id} className="list-none">
                <button
                  type="button"
                  aria-current={i === indice ? 'step' : undefined}
                  onClick={() => {
                    setResultado(null);
                    setListaAberta(false);
                    void irPara(i);
                  }}
                  className={`min-h-10 w-full rounded-lg px-3 text-left ${
                    i === indice ? 'bg-primary-soft font-semibold text-text' : 'hover:bg-surface-2'
                  }`}
                >
                  {i + 1}. {tituloEtapa(e)}
                </button>
              </li>
            ))}
          </ol>
        </details>
      </div>

      {resultado ? (
        <section aria-labelledby="resultado" className="flex flex-col gap-4">
          <h1
            id="resultado"
            ref={tituloRef}
            tabIndex={-1}
            className="m-0 text-3xl font-bold tracking-tight"
          >
            {resultado.atingido ? 'Aula dominada!' : 'Aula concluída'}
          </h1>
          <p className="m-0 text-lg">
            Você acertou {resultado.percentual}% das questões que medem o domínio (meta:{' '}
            {aula.criterioDominio.minPercentual}%).
          </p>
          {!resultado.atingido && (
            <p className="m-0 text-muted">
              Volte aos exercícios quando quiser: acertar sem ver a resposta é o que conta. Isso não
              bloqueia nada — você pode seguir para a próxima aula.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {proximaAulaId ? (
              <Link
                to={`/aula/${proximaAulaId}`}
                className="inline-flex min-h-12 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary"
              >
                Próxima aula
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex min-h-12 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary"
              >
                Voltar ao painel
              </Link>
            )}
            <button
              type="button"
              onClick={() => setResultado(null)}
              className="min-h-12 rounded-lg border border-border px-5 font-medium hover:bg-surface-2"
            >
              Rever a aula
            </button>
          </div>
        </section>
      ) : (
        <article aria-labelledby={`etapa-${etapa.id}`} className="flex flex-col gap-5">
          <h1
            id={`etapa-${etapa.id}`}
            ref={tituloRef}
            tabIndex={-1}
            className="m-0 text-3xl leading-tight font-bold tracking-tight"
          >
            {tituloEtapa(etapa)}
          </h1>
          <EtapaView
            key={etapa.id}
            etapa={etapa}
            modo={modo}
            tentativas={tentativas}
            aoRegistrar={registrar}
            aula={aula}
            irPara={(i) => void irPara(i)}
            escolherModo={escolher}
          />
        </article>
      )}

      {!resultado && (
        <nav
          aria-label="Navegação entre etapas"
          className="flex justify-between gap-3 border-t border-border pt-5"
        >
          <button
            type="button"
            disabled={indice === 0}
            onClick={() => void irPara(indice - 1)}
            className="min-h-12 rounded-lg border border-border px-5 font-medium hover:bg-surface-2 disabled:invisible"
          >
            ← Voltar
          </button>
          <button
            type="button"
            onClick={async () => {
              if (ultima) setResultado(await concluir());
              else void irPara(indice + 1);
            }}
            className="min-h-12 rounded-lg bg-primary px-6 font-semibold text-on-primary"
          >
            {ultima ? 'Concluir aula' : 'Continuar →'}
          </button>
        </nav>
      )}
    </div>
  );
}
