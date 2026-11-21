import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { formatarValor } from '@/engines/portugol/expressao';
import { executar, type Passo } from '@/engines/portugol/interpretador';
import { usePrefereMenosMovimento } from '@/ui/usePrefereMenosMovimento';

const VELOCIDADES = [
  { rotulo: 'Devagar', ms: 1400 },
  { rotulo: 'Normal', ms: 800 },
  { rotulo: 'Rápido', ms: 300 },
];

/**
 * VISUALIZADOR DE ALGORITMOS
 * Executa Portugol de verdade (interpretador próprio) e mostra, a cada passo:
 * a linha em execução, as variáveis como "gavetas" com etiqueta e a saída da tela.
 */
export function Visualizador({
  codigoInicial,
  entradasIniciais = [],
  editavel = true,
  compacto = false,
}: {
  codigoInicial: string;
  entradasIniciais?: string[];
  editavel?: boolean;
  compacto?: boolean;
}) {
  const [codigo, setCodigo] = useState(codigoInicial);
  const [rascunho, setRascunho] = useState(codigoInicial);
  const [editando, setEditando] = useState(false);
  const [entradasTexto, setEntradasTexto] = useState(entradasIniciais.join(', '));
  const [indice, setIndice] = useState(-1); // -1 = antes de começar
  const [tocando, setTocando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const menosMovimento = usePrefereMenosMovimento();
  const ids = useId();

  const entradas = useMemo(
    () =>
      entradasTexto
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e !== ''),
    [entradasTexto],
  );
  const usaLeia = /\bleia\s*\(/i.test(codigo);
  const execucao = useMemo(() => executar(codigo, entradas), [codigo, entradas]);
  const total = execucao.passos.length;
  const passo: Passo | undefined = indice >= 0 ? execucao.passos[indice] : undefined;
  const terminou = indice === total - 1 && total > 0;
  const mostrarErro = execucao.erro && (total === 0 || terminou);

  // Reprodução automática: um passo a cada intervalo.
  useEffect(() => {
    if (!tocando) return;
    const t = setTimeout(() => {
      const proximo = indice + 1;
      setIndice(Math.min(proximo, total - 1));
      if (proximo >= total - 1) setTocando(false);
    }, VELOCIDADES[velocidade]?.ms ?? 800);
    return () => clearTimeout(t);
  }, [tocando, indice, total, velocidade]);

  const linhas = codigo.split('\n');
  const linhaAtual = passo?.linha ?? (mostrarErro ? execucao.erro?.linha : undefined);
  const variaveis =
    passo?.variaveis ??
    execucao.passos[0]?.variaveis.map((v) => ({ ...v, valor: undefined })) ??
    [];
  const saida = passo?.saida ?? [];

  // Mantém a linha atual visível no código.
  const codigoRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    codigoRef.current
      ?.querySelector('[data-atual="true"]')
      ?.scrollIntoView({ block: 'nearest', behavior: menosMovimento ? 'auto' : 'smooth' });
  }, [linhaAtual, menosMovimento]);

  function reiniciar() {
    setTocando(false);
    setIndice(-1);
  }

  function aplicarEdicao() {
    setCodigo(rascunho);
    setEditando(false);
    reiniciar();
  }

  const botao =
    'inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-border px-3 font-medium hover:bg-surface-2 disabled:opacity-40';

  return (
    <div
      className={`flex flex-col gap-4 ${compacto ? '' : 'rounded-2xl border border-border bg-surface p-4 sm:p-5'}`}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Código */}
        <section aria-labelledby={`${ids}-cod`} className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 id={`${ids}-cod`} className="m-0 text-sm font-semibold text-muted">
              Código (Portugol)
            </h3>
            {editavel && !editando && (
              <button
                type="button"
                className="min-h-9 rounded-lg px-3 text-sm font-medium text-primary hover:bg-surface-2"
                onClick={() => {
                  setRascunho(codigo);
                  setEditando(true);
                  setTocando(false);
                }}
              >
                Editar código
              </button>
            )}
          </div>
          {editando ? (
            <div className="flex flex-col gap-2">
              <label htmlFor={`${ids}-editor`} className="sr-only">
                Editor de código Portugol
              </label>
              <textarea
                id={`${ids}-editor`}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                spellCheck={false}
                rows={Math.max(8, rascunho.split('\n').length + 1)}
                className="w-full resize-y rounded-xl border border-border bg-bg p-3 font-mono text-[14px] leading-7 [font-variant-ligatures:none]"
                onKeyDown={(e) => {
                  if (e.key === 'Tab' && !e.shiftKey) {
                    // Tab insere 2 espaços (Esc + Tab sai do campo, para quem navega por teclado).
                    e.preventDefault();
                    const el = e.currentTarget;
                    const { selectionStart: a, selectionEnd: b } = el;
                    setRascunho(rascunho.slice(0, a) + '  ' + rascunho.slice(b));
                    requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
                  }
                  if (e.key === 'Escape') e.currentTarget.blur();
                }}
              />
              <p className="m-0 text-xs text-muted">Tab insere espaços · Esc sai do editor</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={aplicarEdicao}
                  className="min-h-11 rounded-lg bg-primary px-4 font-semibold text-on-primary"
                >
                  Usar este código
                </button>
                <button type="button" onClick={() => setEditando(false)} className={botao}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <ol
              ref={codigoRef}
              aria-label="Código, com a linha em execução destacada"
              className="m-0 max-h-96 list-none overflow-auto rounded-xl border border-border bg-surface-2 py-2 pl-0 font-mono text-[13.5px] leading-7 [font-variant-ligatures:none]"
            >
              {linhas.map((l, i) => {
                const atual = linhaAtual === i + 1;
                const comErro = mostrarErro && execucao.erro?.linha === i + 1;
                return (
                  <li
                    key={i}
                    data-atual={atual}
                    aria-current={atual ? 'step' : undefined}
                    className={`flex px-3 whitespace-pre ${
                      comErro ? 'bg-danger-soft' : atual ? 'bg-primary-soft' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mr-3 w-5 shrink-0 text-right ${atual ? 'font-bold text-primary' : 'text-muted'}`}
                    >
                      {atual ? '▶' : i + 1}
                    </span>
                    <span>{l || ' '}</span>
                  </li>
                );
              })}
            </ol>
          )}
          {usaLeia && (
            <div className="flex flex-col gap-1">
              <label htmlFor={`${ids}-entradas`} className="text-sm font-medium">
                Entradas para o <code className="font-mono">leia</code> (separadas por vírgula)
              </label>
              <input
                id={`${ids}-entradas`}
                value={entradasTexto}
                onChange={(e) => {
                  setEntradasTexto(e.target.value);
                  reiniciar();
                }}
                className="min-h-11 rounded-lg border border-border bg-bg px-3 font-mono"
              />
            </div>
          )}
        </section>

        {/* Estado */}
        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby={`${ids}-vars`} className="flex flex-col gap-2">
            <h3 id={`${ids}-vars`} className="m-0 text-sm font-semibold text-muted">
              Variáveis (memória)
            </h3>
            {variaveis.length === 0 ? (
              <p className="m-0 text-sm text-muted">Nenhuma variável ainda.</p>
            ) : (
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2 p-0">
                {variaveis.map((v) => {
                  const mudou = passo?.mudou === v.chave;
                  return (
                    <li
                      key={v.chave}
                      className={`flex flex-col overflow-hidden rounded-xl border-2 bg-bg ${
                        mudou ? 'border-accent' : 'border-border'
                      } ${mudou && !menosMovimento ? 'animate-[tm-pulso_600ms_ease-out]' : ''}`}
                    >
                      <span className="bg-surface-2 px-2 py-0.5 text-xs font-semibold">
                        {v.nome}
                        {v.tipo && <span className="font-normal text-muted"> · {v.tipo}</span>}
                      </span>
                      <span className="px-2 py-1.5 font-mono text-lg [font-variant-ligatures:none]">
                        {formatarValor(v.valor, true)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <section aria-labelledby={`${ids}-saida`} className="flex flex-col gap-2">
            <h3 id={`${ids}-saida`} className="m-0 text-sm font-semibold text-muted">
              Tela (saída)
            </h3>
            <pre className="m-0 min-h-20 overflow-auto rounded-xl bg-[#0b1220] p-3 font-mono text-[13.5px] leading-6 text-[#e2e8f0] [font-variant-ligatures:none]">
              {saida.length ? saida.join('\n') : <span className="text-[#94a3b8]">(vazia)</span>}
            </pre>
          </section>
        </div>
      </div>

      {/* Narração do passo */}
      <div
        aria-live="polite"
        className={`rounded-xl px-4 py-3 text-[15px] ${mostrarErro ? 'border border-danger bg-danger-soft' : 'bg-surface-2'}`}
      >
        {mostrarErro && execucao.erro ? (
          <>
            <strong className="text-danger">Erro na linha {execucao.erro.linha}: </strong>
            {execucao.erro.mensagem}
          </>
        ) : passo ? (
          <>
            <strong>
              Passo {indice + 1} de {total} · linha {passo.linha}:{' '}
            </strong>
            {passo.descricao}
            {terminou && ' — fim do algoritmo.'}
          </>
        ) : (
          <>
            Aperte <strong>Avançar</strong> para executar uma linha por vez, ou{' '}
            <strong>Reproduzir</strong> para assistir.
          </>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={botao}
          onClick={reiniciar}
          disabled={indice < 0}
          aria-label="Voltar ao início"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 5v14M19 6l-9 6 9 6z" />
          </svg>
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => setIndice((i) => Math.max(-1, i - 1))}
          disabled={indice < 0}
          aria-label="Passo anterior"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 font-semibold text-on-primary disabled:opacity-40"
          onClick={() => setIndice((i) => Math.min(total - 1, i + 1))}
          disabled={indice >= total - 1}
        >
          Avançar
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => {
            if (terminou) setIndice(-1);
            setTocando((t) => !t);
          }}
          disabled={total === 0}
          aria-pressed={tocando}
        >
          {tocando ? 'Pausar' : 'Reproduzir'}
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          Velocidade
          <select
            value={velocidade}
            onChange={(e) => setVelocidade(Number(e.target.value))}
            className="min-h-10 rounded-lg border border-border bg-bg px-2 text-text"
          >
            {VELOCIDADES.map((v, i) => (
              <option key={v.rotulo} value={i}>
                {v.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>
      {total > 1 && (
        <label className="flex items-center gap-3 text-sm text-muted">
          <span className="shrink-0">Linha do tempo</span>
          <input
            type="range"
            min={-1}
            max={total - 1}
            value={indice}
            onChange={(e) => {
              setTocando(false);
              setIndice(Number(e.target.value));
            }}
            className="w-full accent-[var(--tm-primary)]"
            aria-valuetext={indice < 0 ? 'Antes de começar' : `Passo ${indice + 1} de ${total}`}
          />
        </label>
      )}
    </div>
  );
}
