import { Link } from 'react-router';
import { catalogo } from '@/content';
import { conquistas, estatisticas } from '@/engines/pedagogia/analise';
import { useProgressoGeral } from '@/features/trilha/useProgressoGeral';

const STATUS = {
  dominada: 'Dominada',
  concluida: 'Concluída',
  'em-andamento': 'Em andamento',
  'nao-iniciada': 'Não iniciada',
} as const;

/** "Meu progresso": domínio por aula (gráfico + tabela), dificuldades e conquistas. */
export default function MeuProgresso() {
  const dados = useProgressoGeral();
  if (!dados) return <p role="status">Carregando seu progresso…</p>;
  const stats = estatisticas(catalogo, dados.progressos, dados.tentativas);
  const lista = conquistas(catalogo, dados.progressos, dados.tentativas, dados.cartoes);
  const revisoes = dados.cartoes.reduce((n, c) => n + c.historico.length, 0);
  const META = 80;
  const W = 640;
  const linha = 44;
  const H = stats.length * linha + 30;
  const x0 = 170;
  const escala = (W - x0 - 50) / 100;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="m-0 text-3xl font-bold tracking-tight">Meu progresso</h1>
        <p className="mt-2 mb-0 text-muted">
          {dados.tentativas.length} respostas · {revisoes} revisões feitas · tudo guardado só neste
          navegador.
        </p>
      </div>

      <section aria-labelledby="dominio" className="flex flex-col gap-3">
        <h2 id="dominio" className="m-0 text-xl font-semibold">
          Domínio por aula
        </h2>
        <figure className="m-0 rounded-2xl border border-border bg-surface p-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Gráfico de barras do domínio por aula; os mesmos números estão na tabela abaixo."
            className="h-auto w-full"
          >
            <line
              x1={x0 + META * escala}
              x2={x0 + META * escala}
              y1="4"
              y2={H - 22}
              className="stroke-accent"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text
              x={x0 + META * escala}
              y={H - 6}
              textAnchor="middle"
              fontSize="12"
              className="fill-accent"
            >
              meta {META}%
            </text>
            {stats.map((s, i) => {
              const y = i * linha + 10;
              return (
                <g key={s.aula.id}>
                  <text x={x0 - 10} y={y + 18} textAnchor="end" fontSize="13" className="fill-text">
                    {s.aula.titulo.length > 22 ? `${s.aula.titulo.slice(0, 21)}…` : s.aula.titulo}
                  </text>
                  <rect
                    x={x0}
                    y={y + 4}
                    width={100 * escala}
                    height="20"
                    rx="6"
                    className="fill-surface-2"
                  />
                  <rect
                    x={x0}
                    y={y + 4}
                    width={Math.max(0, s.dominio * escala)}
                    height="20"
                    rx="6"
                    className={s.dominio >= META ? 'fill-accent' : 'fill-primary'}
                  />
                  <text
                    x={x0 + Math.max(s.dominio, 0) * escala + 8}
                    y={y + 19}
                    fontSize="13"
                    fontWeight="600"
                    className="fill-text"
                  >
                    {s.dominio}%
                  </text>
                </g>
              );
            })}
          </svg>
        </figure>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Detalhes por aula</caption>
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Aula
                </th>
                <th scope="col" className="px-4 py-2">
                  Situação
                </th>
                <th scope="col" className="px-4 py-2">
                  Domínio
                </th>
                <th scope="col" className="px-4 py-2">
                  Acertos
                </th>
                <th scope="col" className="px-4 py-2">
                  Mais difícil para você
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.aula.id} className="border-t border-border">
                  <th scope="row" className="px-4 py-2 font-medium">
                    <Link to={`/aula/${s.aula.id}`}>{s.aula.titulo}</Link>
                  </th>
                  <td className="px-4 py-2">{STATUS[s.status]}</td>
                  <td className="px-4 py-2">{s.dominio}%</td>
                  <td className="px-4 py-2">
                    {s.taxaAcerto === null ? '—' : `${s.taxaAcerto}% de ${s.tentativas}`}
                  </td>
                  <td className="px-4 py-2 text-muted">
                    {s.maisErrada ? `${s.maisErrada.enunciado} (${s.maisErrada.erros}×)` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-sm text-muted">
          Errar faz parte: a taxa de acertos mostra onde vale praticar, não uma nota. O que conta é
          acertar sozinho depois.
        </p>
      </section>

      <section aria-labelledby="conquistas" className="flex flex-col gap-3">
        <h2 id="conquistas" className="m-0 text-xl font-semibold">
          Conquistas
        </h2>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((c) => (
            <li
              key={c.id}
              className={`flex gap-3 rounded-2xl border p-4 ${c.obtida ? 'border-2 border-accent bg-accent-soft' : 'border-dashed border-border'}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-11 shrink-0 place-items-center rounded-full text-xl ${c.obtida ? 'bg-accent text-bg' : 'bg-surface-2 text-muted'}`}
              >
                {c.obtida ? '★' : '☆'}
              </span>
              <span className="flex flex-col">
                <span className="font-semibold">
                  {c.nome}
                  <span className="sr-only">{c.obtida ? ' (obtida)' : ' (ainda não)'}</span>
                </span>
                <span className="text-sm text-muted">{c.descricao}</span>
                {!c.obtida && c.progresso && (
                  <span className="text-sm font-medium">{c.progresso}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
