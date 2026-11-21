import { Fragment, type ReactNode } from 'react';

/** Entende só **negrito** e `código` dentro de uma linha. Nunca interpreta HTML. */
export function formatarLinha(linha: string): ReactNode[] {
  return linha.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith('`') && parte.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">
          {parte.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{parte}</Fragment>;
  });
}
