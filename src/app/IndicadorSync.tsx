import { Link } from 'react-router';
import { useEstadoSync } from '@/sync/sincronizador';

/** Nuvenzinha no topo: mostra se o progresso está sincronizado entre aparelhos. */
export function IndicadorSync() {
  const estado = useEstadoSync();
  if (estado.tipo === 'desligado') return null;
  const texto =
    estado.tipo === 'ok'
      ? 'Progresso sincronizado'
      : estado.tipo === 'erro'
        ? `Erro ao sincronizar: ${estado.mensagem}`
        : 'Sincronizando progresso…';
  const cor =
    estado.tipo === 'ok' ? 'text-success' : estado.tipo === 'erro' ? 'text-danger' : 'text-primary';
  return (
    <Link
      to="/configuracoes#sincronizar"
      title={texto}
      aria-label={texto}
      className={`grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-2 ${cor}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={estado.tipo === 'sincronizando' ? 'animate-pulse' : undefined}
      >
        <path d="M7 18a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5Z" />
        {estado.tipo === 'ok' && <path d="m9.5 13.5 2 2 3.5-4" />}
        {estado.tipo === 'erro' && <path d="M12 11v3m0 2.5v.01" />}
      </svg>
    </Link>
  );
}
