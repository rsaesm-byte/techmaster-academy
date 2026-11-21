import type { CasoJs, ResultadoJs } from '@/engines/sandbox/casos';

export const TEMPO_LIMITE_MS = 2000;

/** Roda o código num Web Worker novo e o encerra ao terminar ou ao estourar o tempo. */
export function rodarJs(
  codigo: string,
  funcao: string,
  casos: CasoJs[],
  limiteMs = TEMPO_LIMITE_MS,
): Promise<ResultadoJs> {
  return new Promise((resolver) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    } catch {
      resolver({
        erroGeral: 'Seu navegador não permitiu criar a área isolada de execução.',
        casos: [],
        logs: [],
      });
      return;
    }
    const relogio = setTimeout(() => {
      worker.terminate();
      resolver({
        erroGeral: `O código passou de ${limiteMs / 1000} segundos e foi interrompido. Há algum laço que nunca termina?`,
        casos: [],
        logs: [],
      });
    }, limiteMs);
    worker.onmessage = (e: MessageEvent<ResultadoJs>) => {
      clearTimeout(relogio);
      worker.terminate();
      resolver(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(relogio);
      worker.terminate();
      resolver({ erroGeral: `Erro: ${e.message}`, casos: [], logs: [] });
    };
    worker.postMessage({ codigo, funcao, casos });
  });
}
