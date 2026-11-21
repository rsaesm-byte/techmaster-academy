import { useState } from 'react';
import {
  classificar,
  entropiaBits,
  formatarTempo,
  segundosParaQuebrar,
  type Alfabeto,
} from '@/engines/computacao/senha';

const OPCOES: [keyof Alfabeto, string][] = [
  ['minusculas', 'Letras minúsculas (26)'],
  ['maiusculas', 'Letras maiúsculas (26)'],
  ['digitos', 'Números (10)'],
  ['simbolos', 'Símbolos (32)'],
];

export function SenhaSim() {
  const [tam, setTam] = useState(8);
  const [alfa, setAlfa] = useState<Alfabeto>({
    minusculas: true,
    maiusculas: false,
    digitos: false,
    simbolos: false,
  });
  const bits = entropiaBits(tam, alfa);
  const nivel = classificar(bits);

  return (
    <section
      aria-label="Simulador de força de senha"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex items-center gap-3">
        <label htmlFor="senha-tam">Comprimento: {tam} caracteres</label>
        <input
          id="senha-tam"
          type="range"
          min={4}
          max={24}
          value={tam}
          onChange={(e) => setTam(Number(e.target.value))}
          className="min-h-11"
        />
      </div>
      <fieldset className="m-0 flex flex-wrap gap-x-6 gap-y-1 border-0 p-0">
        <legend className="mb-1 text-sm text-muted">Tipos de caractere usados</legend>
        {OPCOES.map(([k, t]) => (
          <label key={k} className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={alfa[k]}
              onChange={() => setAlfa((a) => ({ ...a, [k]: !a[k] }))}
              className="size-5"
            />
            {t}
          </label>
        ))}
      </fieldset>
      <div role="status" className="rounded-xl bg-primary-soft p-3">
        <p className="m-0">
          Entropia: <strong>{bits.toFixed(0)} bits</strong> · Força: <strong>{nivel}</strong>
        </p>
        <ul className="m-0 mt-2 list-none p-0 text-sm">
          <li>
            Um site que limita tentativas (1 por segundo):{' '}
            {formatarTempo(segundosParaQuebrar(bits, 1))}
          </li>
          <li>
            Ataque offline com placa de vídeo (10 bilhões por segundo):{' '}
            {formatarTempo(segundosParaQuebrar(bits, 1e10))}
          </li>
        </ul>
      </div>
      <p className="m-0 text-sm text-muted">
        Cada bit de entropia dobra o trabalho do atacante. Aumentar o comprimento ajuda mais do que
        trocar letras por símbolos.
      </p>
    </section>
  );
}

export default SenhaSim;
