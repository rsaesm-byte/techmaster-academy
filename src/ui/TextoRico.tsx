import { Fragment } from 'react';
import { formatarLinha } from '@/ui/formatarLinha';

/**
 * Mostra o texto das aulas com segurança: entende só **negrito**, `código`,
 * parágrafos (linha em branco) e quebras de linha. Nunca interpreta HTML,
 * então um texto de conteúdo não consegue injetar script (prevenção de XSS).
 */
export function TextoRico({ texto, className }: { texto: string; className?: string }) {
  const paragrafos = texto.split(/\n\s*\n/);
  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {paragrafos.map((p, i) => (
        <p key={i} className="m-0">
          {p.split('\n').map((linha, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {formatarLinha(linha)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
