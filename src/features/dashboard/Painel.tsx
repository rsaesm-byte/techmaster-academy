import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { catalogo } from '@/content';
import type { ProgressoAula, StatusAula } from '@/domain/progresso';
import { useRepositorio } from '@/persistence/RepositorioProvider';

const STATUS: Record<StatusAula | 'nao-iniciada', { rotulo: string; cor: string; icone: string }> =
  {
    dominada: { rotulo: 'Dominada', cor: 'text-success', icone: 'M5 12l5 5 9-10' },
    concluida: { rotulo: 'Concluída · revisar', cor: 'text-accent', icone: 'M5 12l5 5 9-10' },
    'em-andamento': {
      rotulo: 'Em andamento',
      cor: 'text-primary',
      icone: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8v4l3 2',
    },
    'nao-iniciada': {
      rotulo: 'Não iniciada',
      cor: 'text-muted',
      icone: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18',
    },
  };

/** Painel: continuar de onde parou e o mapa do módulo, com o status real de cada aula. */
export function Painel() {
  const repo = useRepositorio();
  const [progressos, setProgressos] = useState<Map<string, ProgressoAula> | null>(null);

  useEffect(() => {
    let ativo = true;
    void repo.listarProgressos().then((lista) => {
      if (ativo) setProgressos(new Map(lista.map((p) => [p.aulaId, p])));
    });
    return () => {
      ativo = false;
    };
  }, [repo]);

  const recente = progressos
    ? [...progressos.values()].sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm))[0]
    : undefined;
  const aulaRecente = recente && catalogo.aulas.get(recente.aulaId);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 text-3xl font-bold tracking-tight">
        {aulaRecente ? 'Continue de onde parou' : 'Bem-vindo à TechMaster Academy'}
      </h1>

      {progressos === null ? (
        <p role="status">Carregando seu progresso…</p>
      ) : aulaRecente && recente ? (
        <section
          aria-labelledby="continuar"
          className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex min-w-64 flex-1 flex-col gap-2">
            <p className="m-0 text-sm text-muted">
              {catalogo.localizar(aulaRecente.id)?.modulo.titulo}
            </p>
            <h2 id="continuar" className="m-0 text-xl font-semibold">
              {aulaRecente.titulo}
            </h2>
            <p className="m-0 text-sm text-muted">
              Etapa {recente.etapaAtual + 1} de {aulaRecente.etapas.length} ·{' '}
              {STATUS[recente.status].rotulo}
            </p>
          </div>
          <Link
            to={`/aula/${aulaRecente.id}`}
            className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 font-semibold text-on-primary"
          >
            Continuar aula
          </Link>
        </section>
      ) : (
        <p className="m-0 max-w-[70ch] text-lg text-muted">
          Aqui você aprende tecnologia em quatro passos: entender, ver, fazer e lembrar. Comece pela
          primeira aula abaixo.
        </p>
      )}

      {catalogo.disciplinas.flatMap((d) =>
        d.modulos.map((m) => (
          <section key={m.id} aria-labelledby={`mod-${m.id}`} className="flex flex-col gap-3">
            <div>
              <p className="m-0 text-sm text-muted">{d.titulo}</p>
              <h2 id={`mod-${m.id}`} className="m-0 text-xl font-semibold">
                {m.titulo}
              </h2>
              <p className="m-0 mt-1 text-muted">{m.descricao}</p>
            </div>
            <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
              {m.aulas.map((aulaId, i) => {
                const aula = catalogo.aulas.get(aulaId);
                if (!aula) return null;
                const s = STATUS[progressos?.get(aulaId)?.status ?? 'nao-iniciada'];
                return (
                  <li key={aulaId}>
                    <Link
                      to={`/aula/${aulaId}`}
                      className="flex h-full min-h-32 flex-col gap-2 rounded-2xl border border-border bg-surface p-4 no-underline hover:border-primary"
                    >
                      <span className="text-xs font-semibold text-muted">AULA {i + 1}</span>
                      <span className="font-semibold text-text">{aula.titulo}</span>
                      <span className="text-sm text-muted">{aula.duracaoMin} min</span>
                      <span
                        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${s.cor}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          aria-hidden="true"
                        >
                          <path d={s.icone} />
                        </svg>
                        {s.rotulo}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="m-0 text-sm text-muted">
              As próximas aulas do módulo (variáveis, operadores, condicionais e repetição) estão em
              produção.
            </p>
          </section>
        )),
      )}
    </div>
  );
}
