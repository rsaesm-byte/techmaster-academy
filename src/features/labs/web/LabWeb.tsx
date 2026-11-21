import { useEffect, useId, useRef, useState } from 'react';

type Aba = 'html' | 'css' | 'js';
interface Projeto {
  html: string;
  css: string;
  js: string;
}
interface Linha {
  tipo: 'log' | 'aviso' | 'erro';
  texto: string;
}

const MODELOS: { nome: string; desafio: string; projeto: Projeto }[] = [
  {
    nome: 'Cartão de perfil',
    desafio:
      'Troque o nome e a cor de fundo do cartão. Depois, aumente o arredondamento das bordas.',
    projeto: {
      html: '<div class="cartao">\n  <h1>Ana Souza</h1>\n  <p>Estudante de Sistemas de Informação</p>\n  <button>Seguir</button>\n</div>',
      css: 'body {\n  font-family: system-ui, sans-serif;\n  display: grid;\n  place-items: center;\n  min-height: 90vh;\n  background: #f1f5f9;\n}\n.cartao {\n  background: white;\n  padding: 24px;\n  border-radius: 12px;\n  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);\n  text-align: center;\n}\nbutton {\n  background: #1d4ed8;\n  color: white;\n  border: 0;\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-size: 16px;\n}',
      js: '',
    },
  },
  {
    nome: 'Contador com botão',
    desafio:
      'Faça o botão "−" diminuir o contador. Depois, impeça que ele fique negativo (use um se!).',
    projeto: {
      html: '<p>Cliques: <strong id="valor">0</strong></p>\n<button id="mais">+</button>\n<button id="menos">−</button>',
      css: 'body { font-family: system-ui, sans-serif; padding: 24px; font-size: 20px; }\nbutton { font-size: 20px; min-width: 48px; min-height: 48px; }',
      js: "let contador = 0;\nconst valor = document.getElementById('valor');\n\ndocument.getElementById('mais').addEventListener('click', () => {\n  contador = contador + 1;\n  valor.textContent = contador;\n  console.log('contador agora vale', contador);\n});\n\n// Desafio: complete o botão de menos\n",
    },
  },
  {
    nome: 'Lista com laço',
    desafio:
      'O laço "for" cria 5 itens. Mude para 10 e faça os números pares aparecerem em negrito.',
    projeto: {
      html: '<h1>Lista gerada por um laço</h1>\n<ul id="lista"></ul>',
      css: 'body { font-family: system-ui, sans-serif; padding: 24px; }\nli { padding: 4px 0; }',
      js: "const lista = document.getElementById('lista');\n\nfor (let i = 1; i <= 5; i++) {\n  const item = document.createElement('li');\n  item.textContent = 'Item ' + i;\n  lista.appendChild(item);\n}",
    },
  },
];

/** Laboratório 2 — Editor Web: HTML, CSS e JS com prévia ao vivo, isolada da plataforma. */
export default function LabWeb() {
  const [modelo, setModelo] = useState(0);
  const [projeto, setProjeto] = useState<Projeto>(
    () => (MODELOS[0] as (typeof MODELOS)[number]).projeto,
  );
  const [aba, setAba] = useState<Aba>('html');
  const [aoVivo, setAoVivo] = useState(true);
  const [execucao, setExecucao] = useState(0);
  const [console_, setConsole] = useState<Linha[]>([]);
  const iframe = useRef<HTMLIFrameElement>(null);
  const ids = useId();

  // Ao vivo: roda 700 ms depois da última tecla.
  useEffect(() => {
    if (!aoVivo) return;
    const t = setTimeout(() => setExecucao((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [projeto, aoVivo]);

  // Mensagens vindas SÓ do nosso iframe: "pronto" (manda o código) e console.
  useEffect(() => {
    const ouvir = (ev: MessageEvent) => {
      if (ev.source !== iframe.current?.contentWindow) return;
      const d = ev.data as { origem?: string; tipo?: string; texto?: string };
      if (d?.origem !== 'tm-lab') return;
      if (d.tipo === 'pronto') {
        iframe.current?.contentWindow?.postMessage(
          {
            origem: 'tm-editor',
            html: projeto.html,
            css: projeto.css,
            js: projeto.js.replace(/<\/script/gi, '<\\/script'),
          },
          '*',
        );
        return;
      }
      if (d.tipo === 'log' || d.tipo === 'aviso' || d.tipo === 'erro') {
        const tipo = d.tipo;
        setConsole((c) => [...c.slice(-49), { tipo, texto: d.texto ?? '' }]);
      }
    };
    window.addEventListener('message', ouvir);
    return () => window.removeEventListener('message', ouvir);
  }, [projeto]);

  function trocarModelo(i: number) {
    const m = MODELOS[i];
    if (!m) return;
    setModelo(i);
    setProjeto(m.projeto);
    setConsole([]);
    setExecucao((n) => n + 1);
  }

  const abas: { id: Aba; rotulo: string }[] = [
    { id: 'html', rotulo: 'HTML' },
    { id: 'css', rotulo: 'CSS' },
    { id: 'js', rotulo: 'JavaScript' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-sm text-muted">Laboratório 2</p>
        <h1 className="m-0 text-3xl font-bold tracking-tight">Editor Web</h1>
        <p className="mt-2 mb-0 max-w-[70ch] text-muted">
          Escreva HTML, CSS e JavaScript e veja o resultado ao lado. A prévia roda isolada: o código
          não acessa a plataforma, seus dados nem a internet.
        </p>
      </div>

      <div role="group" aria-label="Modelos" className="flex flex-wrap gap-2">
        {MODELOS.map((m, i) => (
          <button
            key={m.nome}
            type="button"
            aria-pressed={i === modelo}
            onClick={() => trocarModelo(i)}
            className={`min-h-10 rounded-full px-4 text-sm ${i === modelo ? 'bg-primary font-semibold text-on-primary' : 'border border-border hover:bg-surface-2'}`}
          >
            {m.nome}
          </button>
        ))}
      </div>
      <p className="m-0 rounded-xl bg-accent-soft px-4 py-3">
        <strong>Desafio: </strong>
        {MODELOS[modelo]?.desafio}
      </p>

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
                if (e.key === 'Tab' && !e.shiftKey) {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const { selectionStart: a, selectionEnd: b } = el;
                  setProjeto((p) => ({ ...p, [aba]: p[aba].slice(0, a) + '  ' + p[aba].slice(b) }));
                  requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
                }
                if (e.key === 'Escape') e.currentTarget.blur();
              }}
              className="h-80 w-full resize-y rounded-xl rounded-tl-none border border-border bg-surface-2 p-3 font-mono text-[13.5px] leading-6 [font-variant-ligatures:none]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setConsole([]);
                setExecucao((n) => n + 1);
              }}
              className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary"
            >
              Executar
            </button>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={aoVivo}
                onChange={(e) => setAoVivo(e.target.checked)}
                className="size-4 accent-[var(--tm-primary)]"
              />
              Atualizar ao digitar
            </label>
            <span className="text-xs text-muted">Tab insere espaços · Esc sai do editor</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="m-0 text-sm font-semibold text-muted">Prévia</p>
          <iframe
            key={execucao}
            ref={iframe}
            title="Prévia do seu código"
            src="./lab-runner.html"
            sandbox="allow-scripts allow-modals"
            className="h-80 w-full rounded-xl border border-border bg-white"
          />
          <section aria-labelledby={`${ids}-console`} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 id={`${ids}-console`} className="m-0 text-sm font-semibold text-muted">
                Console
              </h2>
              <button
                type="button"
                onClick={() => setConsole([])}
                className="min-h-9 rounded-md px-2 text-sm text-muted hover:bg-surface-2"
              >
                Limpar
              </button>
            </div>
            <ol
              aria-live="polite"
              className="m-0 max-h-40 min-h-16 list-none overflow-auto rounded-xl bg-[#0b1220] p-3 font-mono text-[13px] text-[#e2e8f0]"
            >
              {console_.length === 0 && (
                <li className="text-[#94a3b8]">(use console.log no JavaScript)</li>
              )}
              {console_.map((l, i) => (
                <li
                  key={i}
                  className={
                    l.tipo === 'erro'
                      ? 'text-[#f87171]'
                      : l.tipo === 'aviso'
                        ? 'text-[#e3b341]'
                        : ''
                  }
                >
                  {l.tipo === 'erro' ? '✕ ' : l.tipo === 'aviso' ? '! ' : '› '}
                  {l.texto}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
