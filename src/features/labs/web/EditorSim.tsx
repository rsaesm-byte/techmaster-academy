import { useEffect, useId, useRef, useState } from 'react';

type Aba = 'html' | 'css' | 'js';

interface Props {
  html: string;
  css: string;
  js: string;
}

/** Editor de HTML, CSS e JS com prévia isolada (a mesma iframe segura do Editor Web). */
export function EditorSim({ html, css, js }: Props) {
  const inicial = { html, css, js };
  const [projeto, setProjeto] = useState(inicial);
  const [aba, setAba] = useState<Aba>('html');
  const [execucao, setExecucao] = useState(0);
  const iframe = useRef<HTMLIFrameElement>(null);
  const ids = useId();

  // Atualiza a prévia 600 ms depois da última tecla.
  useEffect(() => {
    const t = setTimeout(() => setExecucao((n) => n + 1), 600);
    return () => clearTimeout(t);
  }, [projeto]);

  // Só aceita mensagens da nossa própria iframe.
  useEffect(() => {
    const ouvir = (ev: MessageEvent) => {
      if (ev.source !== iframe.current?.contentWindow) return;
      const d = ev.data as { origem?: string; tipo?: string };
      if (d?.origem !== 'tm-lab' || d.tipo !== 'pronto') return;
      iframe.current?.contentWindow?.postMessage(
        {
          origem: 'tm-editor',
          html: projeto.html,
          css: projeto.css,
          js: projeto.js.replace(/<\/script/gi, '<\\/script'),
        },
        '*',
      );
    };
    window.addEventListener('message', ouvir);
    return () => window.removeEventListener('message', ouvir);
  }, [projeto]);

  const abas: { id: Aba; rotulo: string }[] = [
    { id: 'html', rotulo: 'HTML' },
    { id: 'css', rotulo: 'CSS' },
    ...(inicial.js ? [{ id: 'js' as const, rotulo: 'JavaScript' }] : []),
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-2">
        <div role="tablist" aria-label="Arquivos" className="flex gap-1">
          {abas.map((a) => (
            <button
              key={a.id}
              id={`${ids}-aba-${a.id}`}
              role="tab"
              type="button"
              aria-selected={aba === a.id}
              aria-controls={`${ids}-painel`}
              onClick={() => setAba(a.id)}
              className={`min-h-10 rounded-t-lg px-4 text-sm font-medium ${aba === a.id ? 'bg-surface-2 text-text' : 'text-muted hover:text-text'}`}
            >
              {a.rotulo}
            </button>
          ))}
        </div>
        <div id={`${ids}-painel`} role="tabpanel" aria-labelledby={`${ids}-aba-${aba}`}>
          <label htmlFor={`${ids}-codigo`} className="sr-only">
            Código {aba.toUpperCase()}
          </label>
          <textarea
            id={`${ids}-codigo`}
            value={projeto[aba]}
            spellCheck={false}
            onChange={(e) => setProjeto((p) => ({ ...p, [aba]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Escape') e.currentTarget.blur();
            }}
            className="h-64 w-full resize-y rounded-xl rounded-tl-none border border-border bg-surface-2 p-3 font-mono text-[13.5px] leading-6 [font-variant-ligatures:none]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setProjeto(inicial)}
            className="min-h-11 rounded-lg border border-border px-4 text-sm hover:bg-surface-2"
          >
            Restaurar código original
          </button>
          <span className="text-xs text-muted">
            A prévia atualiza ao digitar · Esc sai do editor
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="m-0 text-sm font-semibold text-muted">Prévia</p>
        <iframe
          key={execucao}
          ref={iframe}
          title="Prévia da página"
          src="./lab-runner.html"
          sandbox="allow-scripts allow-modals"
          className="h-64 w-full rounded-xl border border-border bg-white"
        />
      </div>
    </div>
  );
}
