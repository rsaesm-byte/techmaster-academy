import { usePreferencias, type Preferencias } from '@/app/preferencias';

function Grupo<T extends string>({
  legenda,
  nome,
  valor,
  opcoes,
  aoMudar,
}: {
  legenda: string;
  nome: string;
  valor: T;
  opcoes: { valor: T; rotulo: string }[];
  aoMudar: (v: T) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 font-medium">{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <label
            key={o.valor}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 ${valor === o.valor ? 'border-2 border-primary bg-primary-soft' : 'border-border'}`}
          >
            <input
              type="radio"
              name={nome}
              checked={valor === o.valor}
              onChange={() => aoMudar(o.valor)}
              className="size-4 accent-[var(--tm-primary)]"
            />
            {o.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Interruptor({
  rotulo,
  dica,
  ligado,
  aoMudar,
}: {
  rotulo: string;
  dica: string;
  ligado: boolean;
  aoMudar: (v: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        role="switch"
        checked={ligado}
        onChange={(e) => aoMudar(e.target.checked)}
        className="mt-1 size-5 accent-[var(--tm-primary)]"
      />
      <span>
        <span className="block font-medium">{rotulo}</span>
        <span className="block text-sm text-muted">{dica}</span>
      </span>
    </label>
  );
}

/** Ajustes de leitura e acessibilidade (WCAG 2.2): o aluno adapta a plataforma a si. */
export function Leitura() {
  const { prefs, mudar } = usePreferencias();
  return (
    <section
      aria-labelledby="leitura"
      className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-6"
    >
      <h2 id="leitura" className="m-0 text-lg font-semibold">
        Leitura e acessibilidade
      </h2>
      <Grupo<Preferencias['tamanhoTexto']>
        legenda="Tamanho do texto"
        nome="tamanho"
        valor={prefs.tamanhoTexto}
        opcoes={[
          { valor: 'normal', rotulo: 'Normal' },
          { valor: 'grande', rotulo: 'Grande' },
          { valor: 'muito-grande', rotulo: 'Muito grande' },
        ]}
        aoMudar={(v) => mudar({ tamanhoTexto: v })}
      />
      <Grupo<Preferencias['densidade']>
        legenda="Espaçamento"
        nome="densidade"
        valor={prefs.densidade}
        opcoes={[
          { valor: 'confortavel', rotulo: 'Confortável' },
          { valor: 'compacta', rotulo: 'Compacto' },
        ]}
        aoMudar={(v) => mudar({ densidade: v })}
      />
      <Interruptor
        rotulo="Reduzir movimento"
        dica="Desliga animações e transições. Simulações passam a mostrar o resultado direto."
        ligado={prefs.reduzirMovimento}
        aoMudar={(v) => mudar({ reduzirMovimento: v })}
      />
      <Interruptor
        rotulo="Modo foco nas aulas"
        dica="Esconde o menu durante as aulas, para menos distração."
        ligado={prefs.modoFoco}
        aoMudar={(v) => mudar({ modoFoco: v })}
      />
      <label className="flex flex-col gap-1">
        <span className="font-medium">Meta de dias de estudo por semana</span>
        <select
          value={prefs.metaDiasSemana}
          onChange={(e) => mudar({ metaDiasSemana: Number(e.target.value) })}
          className="min-h-11 w-40 rounded-lg border border-border bg-bg px-3"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <option key={d} value={d}>
              {d} {d === 1 ? 'dia' : 'dias'}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
