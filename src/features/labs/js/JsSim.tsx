import { useState } from 'react';
import { rodarJs } from '@/engines/sandbox/rodarJs';

/**
 * Pequeno "console" de JavaScript: o código roda no Web Worker isolado do app
 * (sem rede, sem acesso à página) e o que sai de `console.log` aparece abaixo.
 */
export function JsSim({ codigo }: { codigo: string }) {
  const [fonte, setFonte] = useState(codigo);
  const [saida, setSaida] = useState<string[] | null>(null);
  const [erro, setErro] = useState('');
  const [rodando, setRodando] = useState(false);

  const executar = async () => {
    setRodando(true);
    setErro('');
    // O código do aluno vira o corpo de uma função chamada uma vez; os logs voltam junto.
    const r = await rodarJs(`function __principal() {\n${fonte}\n}`, '__principal', [
      { argumentos: [], esperado: undefined },
    ]);
    setSaida(r.logs);
    setErro(r.erroGeral ?? r.casos[0]?.erro ?? '');
    setRodando(false);
  };

  return (
    <section
      aria-label="Console de JavaScript"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
    >
      <label htmlFor="js-fonte" className="text-sm text-muted">
        Código (edite à vontade)
      </label>
      <textarea
        id="js-fonte"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
        spellCheck={false}
        rows={Math.min(14, Math.max(5, fonte.split('\n').length + 1))}
        className="w-full rounded-lg border border-border bg-surface-2 p-3 font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void executar()}
          disabled={rodando}
          className="min-h-11 rounded-lg bg-primary px-4 font-medium text-on-primary disabled:opacity-60"
        >
          {rodando ? 'Executando…' : 'Executar'}
        </button>
        <button
          type="button"
          onClick={() => {
            setFonte(codigo);
            setSaida(null);
            setErro('');
          }}
          className="min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
        >
          Restaurar
        </button>
      </div>
      <div
        role="log"
        aria-label="Saída do código"
        className="min-h-16 rounded-xl bg-[#0b1020] p-3 font-mono text-sm text-[#d7e3ff]"
      >
        {saida === null && <span className="opacity-60">A saída aparece aqui.</span>}
        {saida?.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {l}
          </div>
        ))}
        {saida !== null && saida.length === 0 && !erro && (
          <span className="opacity-60">(nenhuma saída: use console.log para mostrar valores)</span>
        )}
        {erro && <div className="text-[#fca5a5]">{erro}</div>}
      </div>
    </section>
  );
}

export default JsSim;
