import { useState } from 'react';
import {
  UNIDADES,
  formatarBytes,
  paraBytes,
  quantosCabem,
  type Unidade,
} from '@/engines/computacao/armazenamento';

const ARQUIVOS: [string, number][] = [
  ['Foto do celular (4 MB)', 4e6],
  ['Música em MP3 (5 MB)', 5e6],
  ['Filme em HD (4 GB)', 4e9],
];

export function UnidadesSim() {
  const [valor, setValor] = useState(500);
  const [un, setUn] = useState<Unidade>('GB');
  const cap = paraBytes(valor, un, 1000);

  return (
    <section
      aria-label="Simulador de unidades de dados"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <p className="m-0">
        O fabricante anuncia a capacidade em <strong>base 1000</strong> (1 GB = 1.000.000.000
        bytes). O sistema conta em <strong>base 1024</strong> (1 GB = 1.073.741.824 bytes). Veja a
        diferença.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="un-valor" className="text-sm text-muted">
            Capacidade anunciada
          </label>
          <input
            id="un-valor"
            type="number"
            min={1}
            value={valor}
            onChange={(e) => setValor(Math.max(1, Number(e.target.value) || 1))}
            className="min-h-11 w-32 rounded-lg border border-border bg-surface-2 px-3 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="un-un" className="text-sm text-muted">
            Unidade
          </label>
          <select
            id="un-un"
            value={un}
            onChange={(e) => setUn(e.target.value as Unidade)}
            className="min-h-11 rounded-lg border border-border bg-surface-2 px-3"
          >
            {UNIDADES.slice(2).map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3">
        Anunciado: <strong>{formatarBytes(cap, 1000)}</strong> · O sistema mostra:{' '}
        <strong>{formatarBytes(cap, 1024)}</strong>
      </p>
      <table className="w-full max-w-lg border-collapse text-left">
        <caption className="mb-1 text-left text-sm text-muted">Quantos cabem</caption>
        <tbody>
          {ARQUIVOS.map(([nome, tam]) => (
            <tr key={nome} className="border-b border-border/50">
              <th scope="row" className="p-2 font-normal">
                {nome}
              </th>
              <td className="p-2 text-right font-mono font-bold">
                {quantosCabem(cap, tam).toLocaleString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
export default UnidadesSim;
