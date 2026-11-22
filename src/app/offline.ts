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
    void navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        if (!reg) return;
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
      })
      .catch(() => {
        // Sem service worker (navegador bloqueou, modo privado...): o app funciona, só não offline.
      });
  });
}

/**
 * Botão "Atualizar app": procura uma versão nova na hora.
 * - 'aplicando': havia versão nova; a página recarrega sozinha em seguida.
 * - 'atual': já está na última versão.
 * - 'sem-conexao': não deu para consultar o servidor.
 */
export type ResultadoAtualizacao = 'aplicando' | 'atual' | 'sem-conexao';

export async function verificarAtualizacao(): Promise<ResultadoAtualizacao> {
  if (!('serviceWorker' in navigator) || !navigator.onLine) {
    return navigator.onLine ? 'atual' : 'sem-conexao';
  }
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return 'atual';
    await reg.update();
    if (!reg.waiting && reg.installing) {
      const novo = reg.installing;
      await new Promise<void>((ok) => {
        novo.addEventListener('statechange', () => {
          if (novo.state === 'installed' || novo.state === 'redundant') ok();
        });
      });
    }
    if (reg.waiting) {
      reg.waiting.postMessage('atualizar');
      return 'aplicando';
    }
    return 'atual';
  } catch {
    return 'sem-conexao';
  }
}
