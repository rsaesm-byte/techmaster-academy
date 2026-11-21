import type { Codigo } from '@/domain/conteudo';

const NOMES: Record<Codigo['linguagem'], string> = {
  pseudocodigo: 'Pseudocódigo',
  javascript: 'JavaScript',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
};

/** Código com números de linha; linhas em `destaque` ganham fundo. */
export function BlocoCodigo({ codigo, destaque = [] }: { codigo: Codigo; destaque?: number[] }) {
  const linhas = codigo.fonte.split('\n');
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-border bg-surface-2">
      <figcaption className="border-b border-border px-4 py-1.5 text-xs font-semibold text-muted">
        {NOMES[codigo.linguagem]}
      </figcaption>
      <pre className="m-0 overflow-x-auto py-3 font-mono text-[13.5px] leading-7 [font-variant-ligatures:none]">
        <code>
          {linhas.map((linha, i) => (
            <span
              key={i}
              className={`block px-4 ${destaque.includes(i + 1) ? 'bg-primary-soft' : ''}`}
            >
              <span
                aria-hidden="true"
                className="mr-4 inline-block w-5 text-right text-muted select-none"
              >
                {i + 1}
              </span>
              {linha || ' '}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
