import { useMemo, useState } from 'react';
import {
  REGISTRADORES,
  estadoInicial,
  executar,
  montar,
  passo,
  type Estado,
} from '@/engines/computacao/cpu';

export const PROGRAMA_EXEMPLO = `; soma 7 + 5 e guarda o resultado na memória[2]
LOAD A, [0]
LOAD B, [1]
ADD A, B
STORE A, [2]
HALT`;

const botao =
  'min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-50';

const bin = (n: number) => n.toString(2).padStart(8, '0');

export function CpuSim({
  programa = PROGRAMA_EXEMPLO,
  memoria = [7, 5],
  editavel = false,
}: {
  programa?: string;
  memoria?: number[];
  editavel?: boolean;
}) {
  const [fonte, setFonte] = useState(programa);
  const prog = useMemo(() => montar(fonte), [fonte]);
  const [estado, setEstado] = useState<Estado>(() => estadoInicial(memoria));
  const [aviso, setAviso] = useState('');
  const pronto = prog.erros.length === 0;

  const reiniciar = () => {
    setEstado(estadoInicial(memoria));
    setAviso('');
  };

  const editar = (texto: string) => {
    setFonte(texto);
    setEstado(estadoInicial(memoria));
    setAviso('');
  };

  const rodarTudo = () => {
    const r = executar(prog, estado, 1000);
    setEstado(r.estado);
    setAviso(r.esgotou ? 'Parei depois de 1000 passos: o programa deve ter um laço infinito.' : '');
  };

  return (
    <section
      aria-label="Simulador de CPU"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="m-0 mb-2 text-base font-semibold">Programa</h3>
          {editavel ? (
            <>
              <label htmlFor="cpu-fonte" className="mb-1 block text-sm text-muted">
                Edite o programa (uma instrução por linha)
              </label>
              <textarea
                id="cpu-fonte"
                value={fonte}
                onChange={(e) => editar(e.target.value)}
                spellCheck={false}
                rows={9}
                className="w-full rounded-lg border border-border bg-surface-2 p-3 font-mono text-sm"
              />
              {!pronto && (
                <ul role="alert" className="m-0 mt-2 list-none p-0 text-sm text-danger">
                  {prog.erros.map((e) => (
                    <li key={e.linha + e.mensagem}>
                      Linha {e.linha}: {e.mensagem}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <ol start={0} className="m-0 list-none rounded-lg bg-surface-2 p-0 font-mono text-sm">
              {prog.texto.map((t, i) => (
                <li
                  key={i}
                  aria-current={!estado.parado && estado.pc === i ? 'step' : undefined}
                  className={`flex gap-3 px-3 py-1 ${!estado.parado && estado.pc === i ? 'bg-primary-soft font-bold' : ''}`}
                >
                  <span className="w-5 text-right text-muted">{i}</span>
                  {t}
                </li>
              ))}
            </ol>
          )}
          {editavel && pronto && (
            <p className="m-0 mt-2 text-sm text-muted">
              Instrução atual:{' '}
              <strong className="font-mono">
                {estado.parado ? 'fim' : `${estado.pc}: ${prog.texto[estado.pc] ?? '(nenhuma)'}`}
              </strong>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="m-0 mb-2 text-base font-semibold">
              Registradores <span className="font-normal text-muted">(as tigelas da CPU)</span>
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {REGISTRADORES.map((r) => (
                <li
                  key={r}
                  className={`min-w-28 rounded-lg border p-2 text-center font-mono ${
                    estado.mudou.reg === r ? 'border-accent bg-primary-soft' : 'border-border'
                  }`}
                >
                  <div className="text-sm text-muted">{r}</div>
                  <div className="text-xl font-bold">{estado.regs[r]}</div>
                  <div className="text-xs text-muted">{bin(estado.regs[r])}</div>
                </li>
              ))}
              <li className="min-w-28 rounded-lg border border-border p-2 text-center font-mono">
                <div className="text-sm text-muted">PC</div>
                <div className="text-xl font-bold">{estado.pc}</div>
                <div className="text-xs text-muted">próxima</div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="m-0 mb-2 text-base font-semibold">
              Memória <span className="font-normal text-muted">(a despensa, 16 células)</span>
            </h3>
            <ul className="m-0 grid list-none grid-cols-8 gap-1 p-0 font-mono text-sm">
              {estado.mem.map((v, i) => (
                <li
                  key={i}
                  aria-label={`Memória ${i}: ${v}`}
                  className={`rounded border p-1 text-center ${
                    estado.mudou.mem === i ? 'border-accent bg-primary-soft' : 'border-border'
                  }`}
                >
                  <div className="text-[10px] text-muted">{i}</div>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
        {aviso || estado.descricao}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={botao}
          onClick={() => setEstado((e) => passo(prog, e))}
          disabled={!pronto || estado.parado}
        >
          Próximo passo
        </button>
        <button
          type="button"
          className={botao}
          onClick={rodarTudo}
          disabled={!pronto || estado.parado}
        >
          Executar tudo
        </button>
        <button type="button" className={botao} onClick={reiniciar}>
          Reiniciar
        </button>
      </div>
      <p className="m-0 text-sm text-muted">
        Cada passo é um ciclo completo: <strong>buscar</strong> a instrução,{' '}
        <strong>decodificar</strong> o que ela pede e <strong>executar</strong>. Passos executados:{' '}
        {estado.passos}.
      </p>
    </section>
  );
}

export default CpuSim;
