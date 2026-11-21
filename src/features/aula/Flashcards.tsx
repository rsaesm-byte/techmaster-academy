import { useState } from 'react';
import type { Etapa } from '@/domain/conteudo';

type EtapaFlashcards = Extract<Etapa, { tipo: 'flashcards' }>;

/** Prévia dos flashcards da aula. A revisão espaçada de verdade chega no item 12. */
export function Flashcards({ etapa }: { etapa: EtapaFlashcards }) {
  const [virados, setVirados] = useState<Set<string>>(new Set());
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-muted">
        Tente responder de cabeça antes de virar cada cartão — lembrar é o que fixa.
      </p>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {etapa.cards.map((c) => {
          const virado = virados.has(c.id);
          return (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
            >
              <p className="m-0 text-xs font-semibold text-primary">PERGUNTA</p>
              <p className="m-0 font-semibold">{c.frente}</p>
              {virado ? (
                <>
                  <p className="m-0 text-xs font-semibold text-success">RESPOSTA</p>
                  <p className="m-0">{c.verso}</p>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setVirados((v) => new Set(v).add(c.id))}
                  className="mt-auto min-h-11 self-start rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
                >
                  Mostrar resposta
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
