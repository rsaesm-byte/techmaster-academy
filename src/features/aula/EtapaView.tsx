import type { Etapa, Modo } from '@/domain/conteudo';
import type { Tentativa } from '@/domain/progresso';
import { Diagrama } from '@/features/aula/Diagrama';
import { Flashcards } from '@/features/aula/Flashcards';
import { QuestaoCard, type NovaTentativa } from '@/features/exercicios/QuestaoCard';
import { BlocoCodigo } from '@/ui/BlocoCodigo';
import { TextoRico } from '@/ui/TextoRico';

const DESCRICAO_EXERCICIO = {
  guiado: 'Com pistas à mão: use-as sem culpa.',
  independente: 'Tente sem pistas primeiro.',
  desafio: 'Um problema para aplicar o que você aprendeu.',
} as const;

/** Mostra o conteúdo de uma etapa conforme o tipo dela. */
export function EtapaView({
  etapa,
  modo,
  tentativas,
  aoRegistrar,
}: {
  etapa: Etapa;
  modo: Modo;
  tentativas: readonly Tentativa[];
  aoRegistrar: (t: NovaTentativa) => void | Promise<void>;
}) {
  const jaAcertou = (id: string) => tentativas.some((t) => t.questaoId === id && t.correta);
  const questoes = (lista: Extract<Etapa, { questoes: unknown }>['questoes']) => (
    <div className="flex flex-col gap-5">
      {lista.map((q, i) => (
        <QuestaoCard
          key={q.id}
          questao={q}
          numero={lista.length > 1 ? i + 1 : undefined}
          jaAcertou={jaAcertou(q.id)}
          aoRegistrar={aoRegistrar}
        />
      ))}
    </div>
  );

  switch (etapa.tipo) {
    case 'diagnostico':
      return (
        <>
          <p className="m-0 text-muted">
            Sem nota e sem pressão: serve para você (e a plataforma) saber de onde partir.
          </p>
          {questoes(etapa.questoes)}
        </>
      );
    case 'explicacao':
      return <TextoRico texto={etapa.porModo?.[modo] ?? etapa.texto} className="text-[17px]" />;
    case 'analogia':
      return (
        <aside
          aria-label="Analogia"
          className="flex flex-col gap-3 rounded-2xl border border-border bg-accent-soft p-5"
        >
          <TextoRico texto={etapa.texto} className="text-[17px]" />
          <p className="m-0 text-[15px] text-muted">
            <strong className="text-text">Onde a analogia falha: </strong>
            {etapa.limites}
          </p>
        </aside>
      );
    case 'diagrama':
      return <Diagrama etapa={etapa} />;
    case 'exemplo':
      return (
        <div className="flex flex-col gap-4">
          <BlocoCodigo codigo={etapa.codigo} destaque={etapa.comentarios.map((c) => c.linha)} />
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {etapa.comentarios.map((c) => (
              <li key={c.linha} className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-sm font-semibold whitespace-nowrap text-primary">
                  linha {c.linha}
                </span>
                <span>{c.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'exercicio':
      return (
        <>
          <p className="m-0 text-muted">{DESCRICAO_EXERCICIO[etapa.modo]}</p>
          {questoes(etapa.questoes)}
        </>
      );
    case 'recuperacao':
      return (
        <>
          <p className="m-0 text-muted">
            Sem voltar às etapas anteriores: puxar da memória é o que fortalece a lembrança.
          </p>
          {questoes(etapa.questoes)}
        </>
      );
    case 'resumo':
      return (
        <ul className="m-0 flex flex-col gap-2 pl-5 text-[17px]">
          {etapa.pontos.map((p, i) => (
            <li key={i}>
              <TextoRico texto={p} />
            </li>
          ))}
        </ul>
      );
    case 'flashcards':
      return <Flashcards etapa={etapa} />;
    case 'conexoes':
      return (
        <div className="flex flex-col gap-4">
          <ul className="m-0 flex flex-col gap-2 pl-5">
            {etapa.disciplinas.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div className="rounded-2xl border border-dashed border-border p-5">
            <p className="m-0 font-semibold">No trabalho</p>
            <p className="mt-1 mb-0">{etapa.aplicacaoProfissional}</p>
          </div>
        </div>
      );
  }
}
