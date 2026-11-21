import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { catalogo } from '@/content';
import type { CartaoRevisao } from '@/domain/progresso';
import { dataLocal, quandoVolta, revisar, type Nota } from '@/engines/srs/sm2';
import { registrarTentativa } from '@/features/aula/registro';
import { QuestaoCard, type NovaTentativa } from '@/features/exercicios/QuestaoCard';
import { resolverItem, vencidos, type ItemRevisao } from '@/features/revisao/fila';
import { useRepositorio } from '@/persistence/RepositorioProvider';

const NOTAS: { nota: Nota; rotulo: string; cor: string }[] = [
  { nota: 'errei', rotulo: 'Errei', cor: 'border-danger text-danger' },
  { nota: 'dificil', rotulo: 'Difícil', cor: 'border-accent text-accent' },
  { nota: 'bom', rotulo: 'Bom', cor: 'border-primary text-primary' },
  { nota: 'facil', rotulo: 'Fácil', cor: 'border-success text-success' },
];

/** Revisão do dia: cartões vencidos, um por vez. Errou? Ele volta no fim da fila. */
export default function Revisao() {
  const repo = useRepositorio();
  const hoje = dataLocal(new Date());
  const [fila, setFila] = useState<ItemRevisao[] | null>(null);
  const [virado, setVirado] = useState(false);
  const [notaQuestao, setNotaQuestao] = useState<Nota | null>(null);
  const [feitos, setFeitos] = useState(0);
  const [proximoTotal, setProximoTotal] = useState<string | null>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ativo = true;
    void repo.listarCartoes().then((cartoes) => {
      if (!ativo) return;
      const itens = vencidos(cartoes, hoje)
        .map((c) => resolverItem(catalogo, c))
        .filter((x): x is ItemRevisao => x !== undefined);
      setFila(itens);
      const futuras = cartoes
        .filter((c) => c.proximaRevisao > hoje)
        .map((c) => c.proximaRevisao)
        .sort();
      setProximoTotal(futuras[0] ?? null);
    });
    return () => {
      ativo = false;
    };
  }, [repo, hoje]);

  const atual = fila?.[0];

  async function avaliar(nota: Nota) {
    if (!atual || !fila) return;
    const novo: CartaoRevisao = {
      ...atual.cartao,
      ...revisar(atual.cartao, nota, hoje),
      historico: [...atual.cartao.historico, { em: new Date().toISOString(), nota }],
    };
    await repo.salvarCartoes([novo]);
    const resto = fila.slice(1);
    // "Errei" volta para o fim da fila de hoje: recuperar de novo daqui a pouco fortalece a memória.
    setFila(nota === 'errei' ? [...resto, { ...atual, cartao: novo }] : resto);
    setFeitos((n) => n + 1);
    setVirado(false);
    setNotaQuestao(null);
    requestAnimationFrame(() => tituloRef.current?.focus());
  }

  async function aoRegistrarQuestao(t: NovaTentativa) {
    if (!atual) return;
    await registrarTentativa(repo, atual.aula, t);
    if (notaQuestao) return; // vale a primeira tentativa
    setNotaQuestao(t.correta ? (t.pistasUsadas > 0 ? 'dificil' : 'bom') : 'errei');
  }

  if (!fila) return <p role="status">Carregando revisões…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 ref={tituloRef} tabIndex={-1} className="m-0 text-3xl font-bold tracking-tight">
          Revisão do dia
        </h1>
        <p className="mt-1 mb-0 text-muted">
          {atual
            ? `${fila.length} ${fila.length === 1 ? 'item' : 'itens'} para hoje · ${feitos} revisados`
            : feitos > 0
              ? `Pronto! ${feitos} revisões feitas hoje.`
              : 'Nada para revisar hoje.'}
        </p>
      </div>

      {!atual && (
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
          <p className="m-0 text-lg font-semibold">
            {feitos > 0 ? 'Revisão concluída' : 'Tudo em dia'}
          </p>
          <p className="m-0 text-muted">
            {proximoTotal
              ? `A próxima revisão vence em ${proximoTotal.split('-').reverse().join('/')}.`
              : 'Os cartões entram aqui quando você vê os flashcards ou conclui uma aula.'}{' '}
            Revisar um pouco antes de esquecer é o que faz o conteúdo ficar.
          </p>
          <Link to="/" className="font-semibold text-primary">
            Voltar ao painel
          </Link>
        </section>
      )}

      {atual?.tipo === 'flashcard' && (
        <section
          aria-live="polite"
          className="flex min-h-72 flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
        >
          <p className="m-0 text-xs font-semibold text-muted">{atual.aula.titulo.toUpperCase()}</p>
          <p className="m-0 text-xs font-semibold text-primary">PERGUNTA</p>
          <p className="m-0 text-xl font-semibold">{atual.frente}</p>
          {virado ? (
            <div className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
              <p className="m-0 text-xs font-semibold text-success">RESPOSTA</p>
              <p className="m-0 text-lg">{atual.verso}</p>
            </div>
          ) : (
            <p className="mt-auto mb-0 text-muted">Responda de cabeça antes de virar.</p>
          )}
        </section>
      )}

      {atual?.tipo === 'questao' && (
        <QuestaoCard
          key={`${atual.cartao.id}-${feitos}`}
          questao={atual.questao}
          aoRegistrar={aoRegistrarQuestao}
        />
      )}

      {atual && (
        <div>
          {atual.tipo === 'flashcard' && !virado ? (
            <button
              type="button"
              onClick={() => setVirado(true)}
              className="min-h-12 w-full rounded-lg bg-primary font-semibold text-on-primary sm:w-auto sm:px-8"
            >
              Mostrar resposta
            </button>
          ) : atual.tipo === 'flashcard' ? (
            <div className="flex flex-col gap-2">
              <p className="m-0 text-center text-sm text-muted sm:text-left">Como foi lembrar?</p>
              <div
                role="group"
                aria-label="Avaliar a lembrança"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {NOTAS.map((n) => (
                  <button
                    key={n.nota}
                    type="button"
                    onClick={() => void avaliar(n.nota)}
                    className={`flex min-h-16 flex-col items-center justify-center rounded-xl border-2 bg-surface ${n.cor}`}
                  >
                    <span className="font-semibold">{n.rotulo}</span>
                    <span className="text-xs text-muted">
                      volta {quandoVolta(atual.cartao, n.nota, hoje)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            notaQuestao && (
              <button
                type="button"
                onClick={() => void avaliar(notaQuestao)}
                className="min-h-12 rounded-lg bg-primary px-8 font-semibold text-on-primary"
              >
                Próximo (volta {quandoVolta(atual.cartao, notaQuestao, hoje)})
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
