/**
 * Registra o service worker (só no site publicado) e avisa quando há versão nova.
 * Em desenvolvimento ele fica desligado para não servir arquivos velhos.
 */
type Ouvinte = () => void;
const ouvintes = new Set<Ouvinte>();
let esperando: ServiceWorker | null = null;

export function aoTerAtualizacao(o: Ouvinte) {
  ouvintes.add(o);
  if (esperando) o();
  return () => {
    ouvintes.delete(o);
  };
}

export function aplicarAtualizacao() {
  esperando?.postMessage('atualizar');
}

export function registrarOffline() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  let recarregando = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recarregando) return;
    recarregando = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js').then((reg) => {
      const avisar = (sw: ServiceWorker | null) => {
        if (sw && navigator.serviceWorker.controller) {
          esperando = sw;
          ouvintes.forEach((o) => o());
        }
      };
      avisar(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const novo = reg.installing;
        novo?.addEventListener('statechange', () => {
          if (novo.state === 'installed') avisar(novo);
        });
      });
    });
  });
}
