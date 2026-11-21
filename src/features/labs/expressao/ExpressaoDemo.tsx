import { useId, useMemo, useState } from 'react';
import { LeitorExpressao, passosDaExpressao } from '@/engines/portugol/expressao';
import { ErroPortugol, normalizar, tokenizar } from '@/engines/portugol/lexer';

function calcularPassos(texto: string, variaveis: Record<string, number>) {
  try {
    const expr = new LeitorExpressao(tokenizar(texto, 1), 1).lerTudo();
    const vars = Object.fromEntries(Object.entries(variaveis).map(([k, v]) => [normalizar(k), v]));
    return {
      passos: passosDaExpressao(expr, (chave, nome) => {
        const v = vars[chave];
        if (v === undefined)
          throw new ErroPortugol(1, `A variável "${nome}" não tem valor nesta demonstração.`);
        return v;
      }),
    };
  } catch (e) {
    return { erro: e instanceof Error ? e.message : String(e) };
  }
}

/** Avalia uma expressão uma operação por vez, mostrando a precedência acontecer. */
export function ExpressaoDemo({
  expressoes,
}: {
  expressoes: { texto: string; variaveis: Record<string, number> }[];
}) {
  const [escolhida, setEscolhida] = useState(0);
  const [livre, setLivre] = useState('');
  const [mostrados, setMostrados] = useState(1);
  const ids = useId();

  const atual = useMemo(
    () => (livre.trim() !== '' ? { texto: livre, variaveis: {} } : expressoes[escolhida]),
    [livre, expressoes, escolhida],
  );
  const r = useMemo(
    () => (atual ? calcularPassos(atual.texto, atual.variaveis) : { erro: '' }),
    [atual],
  );
  const passos = r.passos ?? [];
  const fim = mostrados >= passos.length;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div role="group" aria-label="Expressões de exemplo" className="flex flex-wrap gap-2">
        {expressoes.map((e, i) => (
          <button
            key={e.texto}
            type="button"
            aria-pressed={livre === '' && i === escolhida}
            onClick={() => {
              setLivre('');
              setEscolhida(i);
              setMostrados(1);
            }}
            className={`min-h-10 rounded-full px-4 font-mono text-sm [font-variant-ligatures:none] ${
              livre === '' && i === escolhida
                ? 'bg-primary text-on-primary'
                : 'border border-border hover:bg-surface-2'
            }`}
          >
            {e.texto}
          </button>
        ))}
      </div>
      {atual && Object.keys(atual.variaveis).length > 0 && (
        <p className="m-0 text-sm text-muted">
          Valores:{' '}
          {Object.entries(atual.variaveis)
            .map(([k, v]) => `${k} = ${v}`)
            .join(', ')}
        </p>
      )}

      <ol aria-live="polite" className="m-0 flex list-none flex-col gap-2 p-0">
        {passos.slice(0, mostrados).map((p, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 rounded-xl px-4 py-2 font-mono text-lg [font-variant-ligatures:none] ${
              i === mostrados - 1
                ? fim
                  ? 'bg-success-soft font-semibold'
                  : 'bg-primary-soft'
                : 'bg-surface-2 text-muted'
            }`}
          >
            <span className="w-14 shrink-0 font-sans text-xs font-semibold text-muted">
              {i === 0 ? 'início' : `passo ${i}`}
            </span>
            {p}
          </li>
        ))}
      </ol>
      {r.erro && <p className="m-0 rounded-xl bg-danger-soft px-4 py-2">{r.erro}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={fim || passos.length === 0}
          onClick={() => setMostrados((m) => m + 1)}
          className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-40"
        >
          {fim ? 'Resultado final' : 'Calcular próxima operação'}
        </button>
        <button
          type="button"
          onClick={() => setMostrados(1)}
          className="min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
        >
          Recomeçar
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${ids}-livre`} className="text-sm font-medium">
          Ou digite sua própria expressão (só números):
        </label>
        <input
          id={`${ids}-livre`}
          value={livre}
          placeholder="ex.: 10 - 2 * 3 + 1"
          onChange={(e) => {
            setLivre(e.target.value);
            setMostrados(1);
          }}
          className="min-h-11 rounded-lg border border-border bg-bg px-3 font-mono [font-variant-ligatures:none]"
        />
      </div>
    </div>
  );
}
