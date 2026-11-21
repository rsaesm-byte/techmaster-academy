import { useState } from 'react';
import { analisar, bitsDoIp, ipTexto, lerIp } from '@/engines/computacao/rede';

export function RedeSim({ ip = '192.168.1.130', cidr = 24 }: { ip?: string; cidr?: number }) {
  const [texto, setTexto] = useState(ip);
  const [prefixo, setPrefixo] = useState(cidr);
  const o = lerIp(texto);
  const a = o ? analisar(o, prefixo) : null;

  const linhas: [string, string][] = a
    ? [
        ['Máscara de sub-rede', ipTexto(a.mascara)],
        ['Endereço da rede', ipTexto(a.rede)],
        ['Primeiro equipamento', ipTexto(a.primeiro)],
        ['Último equipamento', ipTexto(a.ultimo)],
        ['Broadcast', ipTexto(a.broadcast)],
        ['Equipamentos possíveis', a.hosts.toLocaleString('pt-BR')],
        ['Tipo', a.privado ? 'Privado (rede interna)' : 'Público (internet)'],
      ]
    : [];

  return (
    <section
      aria-label="Calculadora de IP e sub-rede"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="rede-ip" className="text-sm text-muted">
            Endereço IP
          </label>
          <input
            id="rede-ip"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            inputMode="decimal"
            aria-invalid={!o}
            className="min-h-11 w-48 rounded-lg border border-border bg-surface-2 px-3 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rede-cidr" className="text-sm text-muted">
            Prefixo (/{prefixo})
          </label>
          <input
            id="rede-cidr"
            type="range"
            min={8}
            max={30}
            value={prefixo}
            onChange={(e) => setPrefixo(Number(e.target.value))}
            className="min-h-11 w-48"
          />
        </div>
      </div>
      {!o && (
        <p role="alert" className="m-0 text-danger">
          Digite um IP válido: quatro números de 0 a 255 separados por pontos.
        </p>
      )}
      {a && o && (
        <>
          <p className="m-0 break-all font-mono text-sm" aria-label="IP em binário">
            {bitsDoIp(o)}
            <br />
            <span className="text-primary">{'■'.repeat(Math.min(prefixo, 32))}</span>
            <span className="text-muted">
              {' '}
              = parte da rede ({prefixo} bits); o resto identifica o equipamento
            </span>
          </p>
          <dl className="m-0 grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
            {linhas.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 font-mono font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}

export default RedeSim;
