import { useState } from 'react';
import { verificarAtualizacao, type ResultadoAtualizacao } from '@/app/offline';

const MENSAGENS: Record<ResultadoAtualizacao, string> = {
  aplicando: 'Versão nova encontrada. Atualizando…',
  atual: 'Você já está na versão mais recente.',
  'sem-conexao': 'Sem conexão. Tente de novo quando estiver online.',
};

/** Procura uma versão nova do app e a aplica, sem precisar limpar o navegador. */
export function BotaoAtualizar() {
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAtualizacao | null>(null);

  async function clicar() {
    setBuscando(true);
    setResultado(null);
    setResultado(await verificarAtualizacao());
    setBuscando(false);
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => void clicar()}
        disabled={buscando}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold hover:bg-surface-2 disabled:opacity-60"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={buscando ? 'animate-spin' : ''}
        >
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v6h-6" />
        </svg>
        {buscando ? 'Procurando…' : 'Atualizar app'}
      </button>
      <p role="status" className="m-0 min-h-5 text-sm text-muted">
        {resultado ? MENSAGENS[resultado] : ''}
      </p>
    </div>
  );
}
