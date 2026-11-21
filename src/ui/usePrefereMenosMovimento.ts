import { useSyncExternalStore } from 'react';

/**
 * Verdadeiro se a pessoa pediu menos movimento — no sistema (prefers-reduced-motion)
 * ou nas Configurações da plataforma (classe "reduzir-movimento" no <html>).
 */
export function usePrefereMenosMovimento(): boolean {
  return useSyncExternalStore(assinar, ler, () => false);
}

function ler(): boolean {
  return (
    document.documentElement.classList.contains('reduzir-movimento') ||
    (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  );
}

function assinar(aviso: () => void) {
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  mq?.addEventListener('change', aviso);
  const obs = new MutationObserver(aviso);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => {
    mq?.removeEventListener('change', aviso);
    obs.disconnect();
  };
}
