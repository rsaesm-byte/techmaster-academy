import { useState } from 'react';
import { consultar, TABELAS, type Resultado } from '@/engines/computacao/sql';

/** Banco de dados de brinquedo: escreva um SELECT e veja a tabela de resultado. */
export function SqlSim({ consulta }: { consulta: string }) {
  const [texto, setTexto] = useState(consulta);
  const [resultado, setResultado] = useState<Resultado>(() => consultar(consulta));

  return (
    <section
      aria-label="Banco de dados de treino (SQL)"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap gap-3">
        {Object.entries(TABELAS).map(([nome, tb]) => (
          <div key={nome} className="rounded-lg border border-border bg-surface-2 p-3 text-sm">
            <strong className="font-mono">{nome}</strong>
            <div className="font-mono text-muted">{tb.colunas.join(', ')}</div>
          </div>
        ))}
      </div>
      <label htmlFor="sql-consulta" className="text-sm text-muted">
        Consulta SQL (edite à vontade)
      </label>
      <textarea
        id="sql-consulta"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        spellCheck={false}
        rows={Math.min(8, Math.max(3, texto.split('\n').length + 1))}
        className="w-full rounded-lg border border-border bg-surface-2 p-3 font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setResultado(consultar(texto))}
          className="min-h-11 rounded-lg bg-primary px-4 font-medium text-on-primary"
        >
          Executar
        </button>
        <button
          type="button"
          onClick={() => {
            setTexto(consulta);
            setResultado(consultar(consulta));
          }}
          className="min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
        >
          Restaurar
        </button>
      </div>
      <div aria-live="polite" className="overflow-x-auto">
        {resultado.ok ? (
          resultado.linhas.length === 0 ? (
            <p className="m-0 text-sm text-muted">Nenhuma linha encontrada.</p>
          ) : (
            <table className="w-full border-collapse text-left font-mono text-sm">
              <caption className="pb-2 text-left text-xs text-muted">
                {resultado.linhas.length} linha(s)
              </caption>
              <thead>
                <tr>
                  {resultado.colunas.map((c) => (
                    <th key={c} scope="col" className="border-b border-border px-3 py-1.5">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.linhas.map((l, i) => (
                  <tr key={i}>
                    {l.map((v, j) => (
                      <td key={j} className="border-b border-border px-3 py-1.5">
                        {v === null ? 'NULL' : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <p role="alert" className="m-0 text-sm text-danger">
            {resultado.erro}
          </p>
        )}
      </div>
    </section>
  );
}

export default SqlSim;
