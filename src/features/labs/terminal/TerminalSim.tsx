import { useRef, useState } from 'react';
import {
  buscar,
  caminhoTexto,
  estadoInicialTerminal,
  executarComando,
  type EstadoTerminal,
} from '@/engines/computacao/terminal';

export type CenarioTerminal = 'livre' | 'navegar' | 'arquivos';

interface Missao {
  texto: string;
  /** Verifica o estado após cada comando. */
  ok: (e: EstadoTerminal) => boolean;
}

const em = (e: EstadoTerminal, ...caminho: string[]) =>
  buscar(e.raiz, ['home', 'aluno', ...caminho]);
const aqui = (e: EstadoTerminal, ...caminho: string[]) =>
  e.cwd.join('/') === ['home', 'aluno', ...caminho].join('/');

const MISSOES: Record<CenarioTerminal, Missao[]> = {
  livre: [],
  navegar: [
    { texto: 'Entre na pasta projetos/site', ok: (e) => aqui(e, 'projetos', 'site') },
    { texto: 'Volte para a sua pasta pessoal (home)', ok: (e) => aqui(e) },
  ],
  arquivos: [
    { texto: 'Crie a pasta estudos', ok: (e) => em(e, 'estudos')?.tipo === 'dir' },
    {
      texto: 'Crie estudos/anotacoes.txt com algum texto dentro',
      ok: (e) => {
        const n = em(e, 'estudos', 'anotacoes.txt');
        return n?.tipo === 'arq' && n.conteudo.trim().length > 0;
      },
    },
    {
      texto: 'Copie ola.txt para dentro de estudos',
      ok: (e) => em(e, 'estudos', 'ola.txt')?.tipo === 'arq',
    },
  ],
};

interface Linha {
  prompt: string;
  comando: string;
  saida: string[];
  erro: boolean;
}

export function TerminalSim({ cenario = 'livre' }: { cenario?: CenarioTerminal }) {
  const [estado, setEstado] = useState<EstadoTerminal>(estadoInicialTerminal);
  const [historico, setHistorico] = useState<Linha[]>([]);
  const [valor, setValor] = useState('');
  const [feitas, setFeitas] = useState<Set<number>>(new Set());
  const campo = useRef<HTMLInputElement>(null);
  const missoes = MISSOES[cenario];

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const comando = valor.trim();
    if (!comando) return;
    const prompt = caminhoTexto(estado.cwd);
    if (comando === 'clear') {
      setHistorico([]);
      setValor('');
      return;
    }
    const r = executarComando(estado, comando);
    setEstado(r.estado);
    setHistorico((h) => [...h, { prompt, comando, saida: r.saida, erro: !!r.erro }]);
    setFeitas((antigas) => {
      const novas = new Set(antigas);
      missoes.forEach((m, i) => {
        if (m.ok(r.estado) && (i === 0 || novas.has(i - 1) || cenario === 'arquivos')) novas.add(i);
      });
      return novas;
    });
    setValor('');
    campo.current?.focus();
  };

  const reiniciar = () => {
    setEstado(estadoInicialTerminal());
    setHistorico([]);
    setFeitas(new Set());
    setValor('');
  };

  return (
    <section
      aria-label="Terminal simulado"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <p className="m-0 text-sm text-muted">
        Um terminal de mentira: pode errar e apagar à vontade, nada do seu computador é tocado.
        Digite <code>help</code> para ver os comandos.
      </p>

      {missoes.length > 0 && (
        <div>
          <h3 className="m-0 mb-2 text-base font-semibold">Missões</h3>
          <ul className="m-0 list-none p-0">
            {missoes.map((m, i) => (
              <li key={m.texto} className="flex items-center gap-2 py-1">
                <span aria-hidden="true">{feitas.has(i) ? '✅' : '⬜'}</span>
                <span className={feitas.has(i) ? 'line-through opacity-70' : ''}>{m.texto}</span>
                <span className="sr-only">{feitas.has(i) ? ' (feita)' : ' (pendente)'}</span>
              </li>
            ))}
          </ul>
          {feitas.size === missoes.length && (
            <p role="status" className="m-0 mt-2 rounded-xl bg-primary-soft p-3 font-medium">
              Missões cumpridas! Você usou o terminal como um profissional.
            </p>
          )}
        </div>
      )}

      <div
        role="log"
        aria-label="Saída do terminal"
        className="min-h-40 overflow-x-auto rounded-xl bg-[#0b1020] p-3 font-mono text-sm text-[#d7e3ff]"
      >
        {historico.map((l, i) => (
          <div key={i}>
            <div>
              <span className="text-[#6ee7b7]">aluno@techmaster</span>:
              <span className="text-[#93c5fd]">{l.prompt}</span>$ {l.comando}
            </div>
            {l.saida.map((s, j) => (
              <div key={j} className={`whitespace-pre-wrap ${l.erro ? 'text-[#fca5a5]' : ''}`}>
                {s}
              </div>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={enviar} className="flex flex-wrap items-center gap-2">
        <label htmlFor="terminal-entrada" className="font-mono text-sm">
          <span className="text-accent">aluno@techmaster</span>:{caminhoTexto(estado.cwd)}$
        </label>
        <input
          id="terminal-entrada"
          ref={campo}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-h-11 min-w-40 flex-1 rounded-lg border border-border bg-surface-2 px-3 font-mono"
        />
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-primary px-4 font-medium text-on-primary"
        >
          Executar
        </button>
        <button
          type="button"
          onClick={reiniciar}
          className="min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
        >
          Reiniciar
        </button>
      </form>
    </section>
  );
}

export default TerminalSim;
