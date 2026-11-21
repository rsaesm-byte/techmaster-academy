import { useEffect, useId, useRef, useState } from 'react';
import type { Questao } from '@/domain/conteudo';
import type { Tentativa } from '@/domain/progresso';
import {
  corrigirQuestao,
  embaralhar,
  respostaCompleta,
  type Correcao,
  type Resposta,
} from '@/engines/grading/corrigir';
import {
  EntradaAssociacao,
  EntradaCompletar,
  EntradaIdentificarErro,
  EntradaMultiplaEscolha,
  EntradaOrdenacao,
  EntradaPreverSaida,
  EntradaPrograma,
} from '@/features/exercicios/Entradas';
import { RespostaAbertaCard } from '@/features/exercicios/RespostaAbertaCard';
import { BlocoCodigo } from '@/ui/BlocoCodigo';
import { TextoRico } from '@/ui/TextoRico';

/** Depois de quantos erros o botão "Ver resposta" aparece. */
const ERROS_PARA_REVELAR = 2;

export type NovaTentativa = Omit<Tentativa, 'id' | 'em' | 'aulaId'>;

function respostaInicial(q: Questao): Resposta | undefined {
  if (q.tipo === 'ordenacao') {
    return { tipo: 'ordenacao', ordem: embaralhar(q.itens, q.id).map((i) => i.id) };
  }
  if (q.tipo === 'completar-codigo')
    return { tipo: 'completar-codigo', lacunas: q.lacunas.map(() => '') };
  if (q.tipo === 'programa-portugol' || q.tipo === 'programa-js')
    return { tipo: q.tipo, codigo: q.codigoInicial };
  return undefined;
}

function respostaCertaEmTexto(q: Questao): string {
  switch (q.tipo) {
    case 'multipla-escolha':
      return q.alternativas.find((a) => a.id === q.correta)?.texto ?? '';
    case 'prever-saida':
      return q.respostasAceitas[0] ?? '';
    case 'ordenacao':
      return q.itens.map((item, i) => `${i + 1}. ${item.texto}`).join('\n');
    case 'associacao':
      return q.pares.map((p) => `${p.esquerda} → ${p.direita}`).join('\n');
    case 'completar-codigo':
      return q.lacunas.map((l, i) => `Lacuna ${i + 1}: \`${l.aceitas[0] ?? ''}\``).join('\n');
    case 'identificar-erro':
      return `Linha ${q.linhaErrada}: \`${q.codigo.fonte.split('\n')[q.linhaErrada - 1]?.trim() ?? ''}\``;
    case 'programa-portugol':
    case 'programa-js':
      return q.solucao;
    case 'resposta-aberta':
      return q.respostaModelo;
  }
}

/**
 * Uma questão completa: enunciado, entrada, pistas graduais, verificação,
 * feedback específico e — só depois de errar — a opção de ver a resposta.
 */
export function QuestaoCard(props: Parameters<typeof QuestaoFechada>[0]) {
  if (props.questao.tipo === 'resposta-aberta') {
    return <RespostaAbertaCard questao={props.questao} aoRegistrar={props.aoRegistrar} />;
  }
  return <QuestaoFechada {...props} />;
}

function QuestaoFechada({
  questao,
  numero,
  jaAcertou = false,
  aoRegistrar,
}: {
  questao: Questao;
  numero?: number | undefined;
  jaAcertou?: boolean;
  aoRegistrar: (t: NovaTentativa) => void | Promise<void>;
}) {
  const [resposta, setResposta] = useState<Resposta | undefined>(() => respostaInicial(questao));
  const [pistas, setPistas] = useState(0);
  const [correcao, setCorrecao] = useState<Correcao | null>(null);
  const [erros, setErros] = useState(0);
  const [revelada, setRevelada] = useState(false);
  const [verificando, setVerificando] = useState(false);
  // Marca de tempo do início da tentativa (definida no primeiro efeito, não durante a renderização).
  const inicio = useRef(0);
  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  const tituloId = useId();

  const resolvida = correcao?.correta === true || revelada;
  const travada = resolvida || correcao !== null || verificando;

  async function verificar() {
    if (!resposta || verificando) return;
    setVerificando(true);
    const r = await corrigirQuestao(questao, resposta);
    setVerificando(false);
    setCorrecao(r);
    if (!r.correta) setErros((e) => e + 1);
    void aoRegistrar({
      questaoId: questao.id,
      correta: r.correta,
      resposta,
      pistasUsadas: pistas,
      respostaRevelada: false,
      tempoMs: Date.now() - inicio.current,
    });
  }

  function revelar() {
    setRevelada(true);
    void aoRegistrar({
      questaoId: questao.id,
      correta: false,
      resposta: resposta ?? null,
      pistasUsadas: pistas,
      respostaRevelada: true,
      tempoMs: Date.now() - inicio.current,
    });
  }

  function tentarDeNovo() {
    setCorrecao(null);
    inicio.current = Date.now();
  }

  const entrada = (() => {
    const comum = { travada };
    switch (questao.tipo) {
      case 'multipla-escolha':
        return (
          <EntradaMultiplaEscolha
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'multipla-escolha' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'prever-saida':
        return (
          <EntradaPreverSaida
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'prever-saida' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'ordenacao':
        return (
          <EntradaOrdenacao
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'ordenacao' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'associacao':
        return (
          <EntradaAssociacao
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'associacao' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'completar-codigo':
        return (
          <EntradaCompletar
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'completar-codigo' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'identificar-erro':
        return (
          <EntradaIdentificarErro
            {...comum}
            questao={questao}
            resposta={resposta?.tipo === 'identificar-erro' ? resposta : undefined}
            aoMudar={setResposta}
          />
        );
      case 'programa-portugol':
      case 'programa-js':
        return (
          <EntradaPrograma
            {...comum}
            questao={questao}
            resposta={
              resposta?.tipo === 'programa-portugol' || resposta?.tipo === 'programa-js'
                ? resposta
                : undefined
            }
            aoMudar={setResposta}
          />
        );
      case 'resposta-aberta':
        return null; // tratada por RespostaAbertaCard
    }
  })();

  const botaoSecundario =
    'min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-40';

  return (
    <section
      aria-labelledby={tituloId}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={tituloId} className="m-0 text-lg leading-snug font-semibold">
          {numero !== undefined && <span className="text-muted">Questão {numero}. </span>}
          {questao.enunciado}
        </h3>
        {jaAcertou && !correcao && (
          <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
            ✓ Você já acertou esta
          </span>
        )}
      </header>

      {questao.codigo &&
        questao.tipo !== 'completar-codigo' &&
        questao.tipo !== 'identificar-erro' && <BlocoCodigo codigo={questao.codigo} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!travada && respostaCompleta(questao, resposta)) void verificar();
        }}
        className="flex flex-col gap-4"
      >
        {entrada}

        {questao.pistas.slice(0, pistas).map((p, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-accent-soft px-4 py-3 text-[15px]">
            <span className="font-bold whitespace-nowrap text-accent">Pista {i + 1}</span>
            <span>{p}</span>
          </div>
        ))}

        <div aria-live="polite">
          {correcao && !revelada && (
            <div
              className={`flex gap-3 rounded-xl border px-4 py-3 ${
                correcao.correta ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft'
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.4"
                aria-hidden="true"
                className={`mt-0.5 shrink-0 ${correcao.correta ? 'stroke-success' : 'stroke-danger'}`}
              >
                <path d={correcao.correta ? 'M5 12l5 5 9-10' : 'M6 6l12 12M18 6L6 18'} />
              </svg>
              <div>
                <p className={`m-0 font-bold ${correcao.correta ? 'text-success' : 'text-danger'}`}>
                  {correcao.correta ? 'Correto!' : 'Ainda não'}
                </p>
                <TextoRico texto={correcao.feedback} className="mt-1" />
              </div>
            </div>
          )}
          {revelada && (
            <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
              <p className="m-0 font-bold">Resposta</p>
              {questao.tipo === 'programa-portugol' || questao.tipo === 'programa-js' ? (
                <div className="mt-2">
                  <BlocoCodigo
                    codigo={{
                      linguagem: questao.tipo === 'programa-js' ? 'javascript' : 'pseudocodigo',
                      fonte: questao.solucao,
                    }}
                  />
                </div>
              ) : (
                <TextoRico texto={respostaCertaEmTexto(questao)} className="mt-1 font-medium" />
              )}
              <TextoRico texto={questao.explicacao} className="mt-2 text-muted" />
              <p className="mt-2 mb-0 text-sm text-muted">
                Ela volta na revisão: acertar sozinho depois é o que conta para o domínio.
              </p>
            </div>
          )}
        </div>

        {!resolvida && (
          <div className="flex flex-wrap gap-3">
            {correcao === null ? (
              // `key` diferente nos dois botões: sem isso o React reaproveita o MESMO elemento,
              // e o clique em "Tentar de novo" vira um envio do formulário (type="submit").
              <button
                key="verificar"
                type="submit"
                disabled={!respostaCompleta(questao, resposta)}
                className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-40"
              >
                {verificando
                  ? 'Testando…'
                  : questao.tipo.startsWith('programa')
                    ? 'Rodar testes'
                    : 'Verificar'}
              </button>
            ) : (
              <button
                key="tentar-de-novo"
                type="button"
                onClick={tentarDeNovo}
                className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary"
              >
                Tentar de novo
              </button>
            )}
            {questao.pistas.length > 0 && (
              <button
                type="button"
                className={botaoSecundario}
                disabled={pistas >= questao.pistas.length}
                onClick={() => setPistas((n) => n + 1)}
              >
                {pistas >= questao.pistas.length
                  ? 'Sem mais pistas'
                  : `Pedir pista (${pistas + 1} de ${questao.pistas.length})`}
              </button>
            )}
            {erros >= ERROS_PARA_REVELAR && (
              <button type="button" className={botaoSecundario} onClick={revelar}>
                Ver resposta
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
