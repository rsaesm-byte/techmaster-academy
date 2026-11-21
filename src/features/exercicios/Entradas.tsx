/**
 * Uma entrada por tipo de questão. Todas funcionam só com teclado:
 * ordenação usa botões ↑ ↓ (alternativa acessível ao "arrastar e soltar")
 * e associação usa listas de seleção.
 */
import { useMemo, useState } from 'react';
import type { Associacao, MultiplaEscolha, Ordenacao, PreverSaida } from '@/domain/conteudo';
import { embaralhar, type Resposta } from '@/engines/grading/corrigir';
import { formatarLinha } from '@/ui/formatarLinha';

interface Props<Q, R> {
  questao: Q;
  resposta: R | undefined;
  aoMudar: (r: R) => void;
  travada: boolean;
}

type RespostaDe<T extends Resposta['tipo']> = Extract<Resposta, { tipo: T }>;

export function EntradaMultiplaEscolha({
  questao,
  resposta,
  aoMudar,
  travada,
}: Props<MultiplaEscolha, RespostaDe<'multipla-escolha'>>) {
  const alternativas = useMemo(
    () => embaralhar(questao.alternativas, questao.id),
    [questao.alternativas, questao.id],
  );
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="sr-only">Alternativas</legend>
      {alternativas.map((a, i) => {
        const marcada = resposta?.alternativa === a.id;
        return (
          <label
            key={a.id}
            className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
              marcada ? 'border-2 border-primary bg-primary-soft' : 'border-border bg-surface'
            } ${travada ? 'cursor-default' : 'hover:border-primary'}`}
          >
            <input
              type="radio"
              name={questao.id}
              value={a.id}
              checked={marcada}
              disabled={travada}
              onChange={() => aoMudar({ tipo: 'multipla-escolha', alternativa: a.id })}
              className="size-4 accent-[var(--tm-primary)]"
            />
            <span aria-hidden="true" className="text-sm font-bold text-muted">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{formatarLinha(a.texto)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function EntradaPreverSaida({
  questao,
  resposta,
  aoMudar,
  travada,
}: Props<PreverSaida, RespostaDe<'prever-saida'>>) {
  const id = `${questao.id}-saida`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        O que aparece na tela?
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={resposta?.texto ?? ''}
        disabled={travada}
        onChange={(e) => aoMudar({ tipo: 'prever-saida', texto: e.target.value })}
        className="min-h-12 rounded-xl border border-border bg-surface px-4 font-mono text-base [font-variant-ligatures:none] disabled:opacity-70"
      />
    </div>
  );
}

export function EntradaOrdenacao({
  questao,
  resposta,
  aoMudar,
  travada,
}: Props<Ordenacao, RespostaDe<'ordenacao'>>) {
  // A ordem inicial (embaralhada) já vem pronta do QuestaoCard.
  const ordem = resposta?.ordem ?? questao.itens.map((i) => i.id);
  const [anuncio, setAnuncio] = useState('');
  const texto = (id: string) => questao.itens.find((i) => i.id === id)?.texto ?? id;

  function mover(de: number, para: number) {
    const nova = [...ordem];
    const [item] = nova.splice(de, 1);
    if (item === undefined) return;
    nova.splice(para, 0, item);
    aoMudar({ tipo: 'ordenacao', ordem: nova });
    setAnuncio(`"${texto(item)}" agora está na posição ${para + 1} de ${nova.length}.`);
  }

  const botao =
    'grid size-11 place-items-center rounded-lg border border-border hover:bg-surface-2 disabled:opacity-30';
  return (
    <div>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {ordem.map((id, i) => (
          <li
            key={id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface py-1.5 pr-1.5 pl-4"
          >
            <span className="w-5 text-sm font-bold text-muted">{i + 1}.</span>
            <span className="flex-1">{formatarLinha(texto(id))}</span>
            <button
              type="button"
              className={botao}
              disabled={travada || i === 0}
              aria-label={`Mover "${texto(id)}" para cima`}
              onClick={() => mover(i, i - 1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              className={botao}
              disabled={travada || i === ordem.length - 1}
              aria-label={`Mover "${texto(id)}" para baixo`}
              onClick={() => mover(i, i + 1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </button>
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>
    </div>
  );
}

export function EntradaAssociacao({
  questao,
  resposta,
  aoMudar,
  travada,
}: Props<Associacao, RespostaDe<'associacao'>>) {
  const opcoes = useMemo(() => embaralhar(questao.pares, questao.id), [questao.pares, questao.id]);
  const escolhas = resposta?.escolhas ?? {};
  return (
    <div className="flex flex-col gap-3">
      {questao.pares.map((par) => {
        const id = `${questao.id}-${par.id}`;
        return (
          <div
            key={par.id}
            className="grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:items-center"
          >
            <label htmlFor={id} className="font-semibold">
              {par.esquerda}
            </label>
            <select
              id={id}
              value={escolhas[par.id] ?? ''}
              disabled={travada}
              onChange={(e) =>
                aoMudar({ tipo: 'associacao', escolhas: { ...escolhas, [par.id]: e.target.value } })
              }
              className="min-h-11 w-full rounded-lg border border-border bg-bg px-3 disabled:opacity-70"
            >
              <option value="">Escolha…</option>
              {opcoes.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.direita}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
