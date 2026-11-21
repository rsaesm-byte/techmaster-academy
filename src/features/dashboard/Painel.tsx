import { Link, Navigate } from 'react-router';
import { usePreferencias } from '@/app/preferencias';
import { catalogo } from '@/content';
import { dataLocal } from '@/engines/srs/sm2';
import { boasVindasFeitas } from '@/features/boasvindas/estado';
import { vencidos } from '@/features/revisao/fila';
import { MapaJornada } from '@/features/trilha/MapaJornada';
import {
  proximaAula,
  useProgressoGeral,
  type ProgressoGeral,
} from '@/features/trilha/useProgressoGeral';

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DIAS_EXTENSO = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Dias desta semana (domingo a sábado) em que houve estudo: respostas ou revisões. */
function diasEstudados(dados: ProgressoGeral): Set<number> {
  const hoje = new Date();
  const domingo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay());
  const datas = [
    ...dados.tentativas.map((t) => t.em),
    ...[...dados.progressos.values()].map((p) => p.atualizadaEm),
    ...dados.cartoes.flatMap((c) => c.historico.map((h) => h.em)),
  ];
  const dias = new Set<number>();
  for (const iso of datas) {
    const d = new Date(iso);
    if (d >= domingo) dias.add(d.getDay());
  }
  return dias;
}

export function Painel() {
  const dados = useProgressoGeral();
  const { prefs } = usePreferencias();

  if (!dados) return <p role="status">Carregando seu progresso…</p>;
  if (dados.progressos.size === 0 && !boasVindasFeitas())
    return <Navigate to="/boas-vindas" replace />;

  const recente = [...dados.progressos.values()].sort((a, b) =>
    b.atualizadaEm.localeCompare(a.atualizadaEm),
  )[0];
  const aulaRecente = recente && catalogo.aulas.get(recente.aulaId);
  const emAndamento = aulaRecente && recente?.status === 'em-andamento';
  const disciplina = catalogo.disciplinas[0];
  const modulo = disciplina?.modulos[0];
  const sugestao = modulo ? proximaAula(modulo.aulas, dados.progressos) : undefined;
  const destino = emAndamento ? aulaRecente : sugestao ? catalogo.aulas.get(sugestao) : undefined;
  const revisoes = vencidos(dados.cartoes, dataLocal(new Date())).length;
  const dias = diasEstudados(dados);
  const hoje = new Date().getDay();
  const dominadas = [...dados.progressos.values()].filter((p) => p.status === 'dominada').length;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 text-3xl font-bold tracking-tight">
        {saudacao()}! {emAndamento ? 'Continue de onde parou' : 'Pronto para o próximo passo?'}
      </h1>

      {destino && (
        <section
          aria-labelledby="continuar"
          className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex min-w-64 flex-1 flex-col gap-2">
            <p className="m-0 text-sm text-muted">
              {emAndamento ? 'Em andamento' : 'Próxima aula recomendada'} ·{' '}
              {catalogo.localizar(destino.id)?.modulo.titulo}
            </p>
            <h2 id="continuar" className="m-0 text-xl font-semibold">
              {destino.titulo}
            </h2>
            {emAndamento && recente ? (
              <div className="flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-label="Progresso da aula"
                  aria-valuemin={1}
                  aria-valuemax={destino.etapas.length}
                  aria-valuenow={recente.etapaAtual + 1}
                  className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${((recente.etapaAtual + 1) / destino.etapas.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm whitespace-nowrap text-muted">
                  etapa {recente.etapaAtual + 1} de {destino.etapas.length}
                </span>
              </div>
            ) : (
              <p className="m-0 text-sm text-muted">{destino.objetivo}</p>
            )}
          </div>
          <Link
            to={`/aula/${destino.id}`}
            className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 font-semibold text-on-primary no-underline"
          >
            {emAndamento ? 'Continuar aula' : 'Começar aula'}
          </Link>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/revisao"
          className={`flex flex-col gap-1 rounded-2xl border p-5 no-underline ${revisoes > 0 ? 'border-2 border-accent bg-accent-soft' : 'border-border bg-surface'}`}
        >
          <span className="text-sm text-muted">Revisões para hoje</span>
          <span className="text-3xl font-bold text-text">{revisoes}</span>
          <span className="text-sm font-semibold text-text">
            {revisoes > 0
              ? revisoes === 1
                ? 'revisão vence hoje →'
                : 'revisões vencem hoje →'
              : 'Tudo em dia'}
          </span>
        </Link>
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5">
          <span className="text-sm text-muted">Aulas dominadas</span>
          <span className="text-3xl font-bold">
            {dominadas}
            <span className="text-base font-medium text-muted"> de {catalogo.aulas.size}</span>
          </span>
          <span className="text-sm text-muted">80% ou mais sem ver a resposta</span>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5">
          <span className="text-sm text-muted">Meta da semana</span>
          <span className="text-3xl font-bold">
            {dias.size}
            <span className="text-base font-medium text-muted">
              {' '}
              de {prefs.metaDiasSemana} dias
            </span>
          </span>
          <ol className="m-0 flex list-none gap-1 p-0" aria-label="Dias estudados nesta semana">
            {DIAS.map((d, i) => (
              <li
                key={i}
                aria-label={`${DIAS_EXTENSO[i]}: ${dias.has(i) ? 'estudou' : 'sem estudo'}${i === hoje ? ' (hoje)' : ''}`}
                className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${dias.has(i) ? 'bg-accent text-bg' : 'bg-surface-2 text-muted'} ${i === hoje ? 'ring-2 ring-primary' : ''}`}
              >
                {d}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {disciplina && modulo && (
        <section aria-labelledby="jornada" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="jornada" className="m-0 text-xl font-semibold">
              Sua jornada · {modulo.titulo}
            </h2>
            <Link to={`/trilha/${disciplina.id}`} className="text-sm font-semibold text-primary">
              Ver trilha completa
            </Link>
          </div>
          <MapaJornada modulo={modulo} progressos={dados.progressos} />
        </section>
      )}

      <section aria-labelledby="labs-painel" className="flex flex-col gap-3">
        <h2 id="labs-painel" className="m-0 text-xl font-semibold">
          Laboratórios
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/lab/algoritmos"
            className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 no-underline hover:border-primary"
          >
            <span className="font-semibold text-text">Visualizador de Algoritmos</span>
            <span className="text-sm text-muted">Escreva Portugol e veja cada linha executar.</span>
          </Link>
          <Link
            to="/lab/robo"
            className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 no-underline hover:border-primary"
          >
            <span className="font-semibold text-text">Robô do tabuleiro</span>
            <span className="text-sm text-muted">Algoritmos com comandos exatos, em 3 fases.</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
