import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { MODOS } from '@/app/modo';
import { catalogo } from '@/content';
import type { Aula, Modo } from '@/domain/conteudo';
import { TextoRico } from '@/ui/TextoRico';

type Estrategia = 'outro-jeito' | 'analogia' | 'visual' | 'termo' | 'antes' | 'pratica' | 'travado';

const BOTOES: { id: Estrategia; rotulo: string }[] = [
  { id: 'outro-jeito', rotulo: 'Explique de outro jeito' },
  { id: 'analogia', rotulo: 'Me dê uma analogia' },
  { id: 'visual', rotulo: 'Mostre visualmente' },
  { id: 'termo', rotulo: 'Não entendi um termo' },
  { id: 'antes', rotulo: 'Revisar o que vem antes' },
  { id: 'pratica', rotulo: 'Quero mais prática' },
  { id: 'travado', rotulo: 'Travei num exercício' },
];

/**
 * TUTOR VIRTUAL (versão 1, determinística): respostas montadas a partir do próprio conteúdo
 * da aula — outras versões da explicação, a analogia, a simulação, o glossário e os pré-requisitos.
 * Não é IA e diz isso. A integração com IA fica para a Fase 6, com backend seguro.
 */
export function Tutor({
  aula,
  indice,
  modo,
  irPara,
  escolherModo,
}: {
  aula: Aula;
  indice: number;
  modo: Modo;
  irPara: (i: number) => void;
  escolherModo: (m: Modo) => void;
}) {
  const [ativa, setAtiva] = useState<Estrategia | null>(null);

  const resposta = (): ReactNode => {
    switch (ativa) {
      case 'outro-jeito': {
        const etapa = aula.etapas[indice];
        const exp =
          etapa?.tipo === 'explicacao' && etapa.porModo
            ? etapa
            : aula.etapas.find((e) => e.tipo === 'explicacao' && e.porModo);
        if (!exp || exp.tipo !== 'explicacao' || !exp.porModo)
          return <p className="m-0">Esta aula não tem outra versão da explicação.</p>;
        const outros = MODOS.filter((m) => m.valor !== modo && exp.porModo?.[m.valor]);
        const alvo = outros[0];
        if (!alvo) return <p className="m-0">Esta aula não tem outra versão da explicação.</p>;
        return (
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm font-semibold text-muted">
              NO MODO {alvo.rotulo.toUpperCase()}:
            </p>
            <TextoRico texto={exp.porModo[alvo.valor] ?? ''} />
            <button
              type="button"
              onClick={() => escolherModo(alvo.valor)}
              className="min-h-10 self-start rounded-lg border border-border px-3 text-sm hover:bg-surface"
            >
              Usar o modo {alvo.rotulo} nesta aula
            </button>
          </div>
        );
      }
      case 'analogia': {
        const a = aula.etapas.find((e) => e.tipo === 'analogia');
        if (!a || a.tipo !== 'analogia') return <p className="m-0">Esta aula não tem analogia.</p>;
        return (
          <div className="flex flex-col gap-2">
            <p className="m-0 font-semibold">{a.titulo}</p>
            <TextoRico texto={a.texto} />
            <p className="m-0 text-sm text-muted">
              <strong>Onde ela falha: </strong>
              {a.limites}
            </p>
          </div>
        );
      }
      case 'visual': {
        const visuais = aula.etapas
          .map((e, i) => ({ e, i }))
          .filter(({ e }) => e.tipo === 'demo' || e.tipo === 'diagrama');
        return (
          <div className="flex flex-col gap-2">
            <p className="m-0">Veja o conceito acontecendo:</p>
            {visuais.map(({ e, i }) => (
              <button
                key={e.id}
                type="button"
                onClick={() => irPara(i)}
                className="min-h-10 rounded-lg border border-border px-3 text-left hover:bg-surface"
              >
                {e.tipo === 'demo' ? '▶ Simulação: ' : '◆ Diagrama: '}
                {'titulo' in e ? e.titulo : ''}
              </button>
            ))}
            <Link to="/lab/algoritmos" className="text-sm">
              Ou experimente no Visualizador de Algoritmos
            </Link>
          </div>
        );
      }
      case 'termo': {
        const termos = catalogo.glossario.filter((t) => t.aulas.includes(aula.id));
        return termos.length ? (
          <dl className="m-0 flex flex-col gap-2">
            {termos.map((t) => (
              <div key={t.id}>
                <dt className="font-semibold">{t.termo}</dt>
                <dd className="m-0 text-[15px]">{t.simples}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="m-0">Nenhum termo do glossário nesta aula.</p>
        );
      }
      case 'antes': {
        if (aula.preRequisitos.length === 0) {
          return (
            <p className="m-0">Esta aula não depende de outra: é um ótimo ponto de partida.</p>
          );
        }
        return (
          <div className="flex flex-col gap-2">
            <p className="m-0">Esta aula usa ideias de:</p>
            {aula.preRequisitos.map((p) => (
              <Link key={p} to={`/aula/${p}`}>
                {catalogo.aulas.get(p)?.titulo}
              </Link>
            ))}
            <p className="m-0 text-sm text-muted">
              Dica: os flashcards dessa aula são uma revisão de 2 minutos.
            </p>
          </div>
        );
      }
      case 'pratica': {
        const i = aula.etapas.findIndex((e) => e.tipo === 'recuperacao');
        return (
          <div className="flex flex-col gap-2">
            {i >= 0 && (
              <button
                type="button"
                onClick={() => irPara(i)}
                className="min-h-10 rounded-lg border border-border px-3 text-left hover:bg-surface"
              >
                Ir para a recuperação ativa (responder de memória)
              </button>
            )}
            <Link to="/lab/algoritmos">Inventar seus próprios programas no Visualizador</Link>
            <Link to="/revisao">Fazer as revisões do dia</Link>
          </div>
        );
      }
      case 'travado':
        return (
          <ol className="m-0 flex flex-col gap-1.5 pl-5">
            <li>Releia o enunciado e sublinhe (de cabeça) o que ele pede de saída.</li>
            <li>Peça uma pista: elas vão da mais vaga para a mais direta.</li>
            <li>
              Execute o código no papel, linha por linha, anotando o valor de cada variável numa
              tabela.
            </li>
            <li>Cole o código no Visualizador e assista a execução.</li>
            <li>
              Errou duas vezes? "Ver resposta" aparece — e a questão volta na revisão para você
              acertar sozinho depois.
            </li>
          </ol>
        );
      default:
        return null;
    }
  };

  return (
    <section
      aria-labelledby="tutor-titulo"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-4"
    >
      <div>
        <h2 id="tutor-titulo" className="m-0 text-base font-semibold">
          Tutor
        </h2>
        <p className="m-0 text-xs text-muted">
          Respostas preparadas a partir desta aula · sem IA nesta versão
        </p>
      </div>
      <div role="group" aria-label="Como o tutor pode ajudar" className="flex flex-wrap gap-2">
        {BOTOES.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={ativa === b.id}
            onClick={() => setAtiva(ativa === b.id ? null : b.id)}
            className={`min-h-10 rounded-full px-3 text-sm ${ativa === b.id ? 'bg-primary font-semibold text-on-primary' : 'border border-border bg-surface hover:border-primary'}`}
          >
            {b.rotulo}
          </button>
        ))}
      </div>
      {ativa && (
        <div aria-live="polite" className="rounded-xl bg-surface p-4">
          {resposta()}
        </div>
      )}
    </section>
  );
}
