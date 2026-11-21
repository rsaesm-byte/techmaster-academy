import { useState } from 'react';
import {
  GRUPOS,
  LETRAS,
  deOctal,
  digito,
  paraOctal,
  paraSimbolico,
  type Permissoes,
} from '@/engines/computacao/permissoes';

const ROTULO = { dono: 'Dono', grupo: 'Grupo', outros: 'Outros' } as const;
const NOME_LETRA = { r: 'leitura', w: 'escrita', x: 'execução' } as const;

export function PermissoesSim({ octal = '644' }: { octal?: string }) {
  const [p, setP] = useState<Permissoes>(() => deOctal(octal) ?? (deOctal('644') as Permissoes));
  const alternar = (g: (typeof GRUPOS)[number], i: number) =>
    setP((a) => {
      const novo = [...a[g]] as Permissoes['dono'];
      novo[i] = !novo[i];
      return { ...a, [g]: novo };
    });

  return (
    <section
      aria-label="Simulador de permissões de arquivo"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {GRUPOS.map((g) => (
          <fieldset key={g} className="m-0 rounded-xl border border-border p-3">
            <legend className="px-1 font-semibold">{ROTULO[g]}</legend>
            <div className="flex flex-wrap gap-2">
              {LETRAS.map((l, i) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={p[g][i] === true}
                  aria-label={`${ROTULO[g]}: ${NOME_LETRA[l]}`}
                  onClick={() => alternar(g, i)}
                  className={`min-h-11 min-w-11 rounded-lg border font-mono font-bold ${
                    p[g][i]
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-border bg-surface-2'
                  }`}
                >
                  {p[g][i] ? l : '-'}
                </button>
              ))}
            </div>
            <p className="m-0 mt-2 font-mono text-sm text-muted">
              {p[g].map((v, i) => (v ? ['4', '2', '1'][i] : '0')).join(' + ')} ={' '}
              <strong className="text-base text-text">{digito(p[g])}</strong>
            </p>
          </fieldset>
        ))}
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3 font-mono text-lg">
        chmod <strong>{paraOctal(p)}</strong> arquivo &nbsp;→&nbsp;{' '}
        <strong>{paraSimbolico(p)}</strong>
      </p>
      <p className="m-0 text-sm text-muted">
        Cada permissão é um bit com peso: leitura (r) = 4, escrita (w) = 2, execução (x) = 1. A soma
        de cada grupo vira um dígito do número octal.
      </p>
    </section>
  );
}

export default PermissoesSim;
