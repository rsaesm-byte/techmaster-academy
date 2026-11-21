import { Link, useParams } from 'react-router';
import { catalogo } from '@/content';
import { NaoEncontrada } from '@/features/NaoEncontrada';
import { MapaJornada } from '@/features/trilha/MapaJornada';
import { useProgressoGeral } from '@/features/trilha/useProgressoGeral';

/** A trilha de uma disciplina: um mapa por módulo, com o progresso real. */
export default function Trilha() {
  const { disciplinaId = '' } = useParams();
  const disciplina = catalogo.disciplinas.find((d) => d.id === disciplinaId);
  const dados = useProgressoGeral();
  if (!disciplina) return <NaoEncontrada />;
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="m-0 text-sm text-muted">
          <Link to="/escolas" className="text-muted">
            Escolas
          </Link>{' '}
          › Escola {disciplina.escola}
        </p>
        <h1 className="m-0 text-3xl font-bold tracking-tight">{disciplina.titulo}</h1>
        <p className="mt-2 mb-0 max-w-[70ch] text-muted">{disciplina.descricao}</p>
      </div>
      {!dados ? (
        <p role="status">Carregando seu progresso…</p>
      ) : (
        disciplina.modulos.map((m, i) => (
          <section key={m.id} aria-labelledby={`m-${m.id}`} className="flex flex-col gap-4">
            <div>
              <p className="m-0 text-sm font-semibold text-muted">MÓDULO {i + 1}</p>
              <h2 id={`m-${m.id}`} className="m-0 text-xl font-semibold">
                {m.titulo}
              </h2>
              <p className="mt-1 mb-0 text-muted">{m.descricao}</p>
            </div>
            <MapaJornada modulo={m} progressos={dados.progressos} />
          </section>
        ))
      )}
      <p className="m-0 text-sm text-muted">
        Você pode abrir qualquer aula a qualquer momento. A ordem do mapa é a recomendada: cada aula
        usa o que veio antes.
      </p>
    </div>
  );
}
