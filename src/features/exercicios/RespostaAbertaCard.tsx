import { useId, useState } from 'react';
import type { RespostaAberta } from '@/domain/conteudo';
import { corrigir } from '@/engines/grading/corrigir';
import type { NovaTentativa } from '@/features/exercicios/QuestaoCard';
import { TextoRico } from '@/ui/TextoRico';

/** Explicar com as próprias palavras, depois comparar com a resposta-modelo e se autoavaliar. */
export function RespostaAbertaCard({
  questao,
  aoRegistrar,
}: {
  questao: RespostaAberta;
  aoRegistrar: (t: NovaTentativa) => void | Promise<void>;
}) {
  const [texto, setTexto] = useState('');
  const [comparando, setComparando] = useState(false);
  const [marcados, setMarcados] = useState<Set<number>>(new Set());
  const [resultado, setResultado] = useState<string | null>(null);
  const id = useId();

  function concluir() {
    const resposta = { tipo: 'resposta-aberta' as const, texto, criteriosCumpridos: marcados.size };
    const r = corrigir(questao, resposta);
    setResultado(r.feedback);
    void aoRegistrar({
      questaoId: questao.id,
      correta: r.correta,
      resposta,
      pistasUsadas: 0,
      respostaRevelada: false,
      tempoMs: 0,
    });
  }

  return (
    <section
      aria-labelledby={`${id}-t`}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <h3 id={`${id}-t`} className="m-0 text-lg leading-snug font-semibold">
        {questao.enunciado}
      </h3>
      <label htmlFor={`${id}-r`} className="text-sm text-muted">
        Escreva com suas palavras (sem consultar). Não precisa ser perfeito.
      </label>
      <textarea
        id={`${id}-r`}
        value={texto}
        disabled={comparando}
        rows={4}
        onChange={(e) => setTexto(e.target.value)}
        className="w-full resize-y rounded-xl border border-border bg-bg p-3 text-base disabled:opacity-80"
      />
      {!comparando ? (
        <button
          type="button"
          disabled={texto.trim().length < 20}
          onClick={() => setComparando(true)}
          className="min-h-11 self-start rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-40"
        >
          Comparar com a resposta-modelo
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-surface-2 p-4">
            <p className="m-0 text-sm font-semibold text-muted">RESPOSTA-MODELO</p>
            <TextoRico texto={questao.respostaModelo} className="mt-1" />
          </div>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 font-medium">Marque o que a SUA resposta cobriu:</legend>
            <div className="flex flex-col gap-2">
              {questao.rubrica.map((c, i) => (
                <label key={i} className="flex min-h-11 cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={marcados.has(i)}
                    disabled={resultado !== null}
                    onChange={(e) =>
                      setMarcados((m) => {
                        const n = new Set(m);
                        if (e.target.checked) n.add(i);
                        else n.delete(i);
                        return n;
                      })
                    }
                    className="mt-1 size-5 accent-[var(--tm-primary)]"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {resultado === null ? (
            <button
              type="button"
              onClick={concluir}
              className="min-h-11 self-start rounded-lg bg-primary px-5 font-semibold text-on-primary"
            >
              Concluir autoavaliação
            </button>
          ) : (
            <p aria-live="polite" className="m-0 rounded-xl bg-accent-soft px-4 py-3">
              <strong>
                {marcados.size} de {questao.rubrica.length} critérios.{' '}
              </strong>
              {resultado}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
