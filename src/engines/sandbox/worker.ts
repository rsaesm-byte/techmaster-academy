/// <reference lib="webworker" />
/**
 * WEB WORKER DE EXECUÇÃO — o código do aluno roda AQUI, numa thread separada:
 * sem acesso à página, ao armazenamento do app nem à rede. Se travar (laço infinito),
 * a página principal encerra o worker pelo tempo limite.
 */
import { executarCasos, type CasoJs } from '@/engines/sandbox/casos';

const escopo = self as unknown as Record<string, unknown>;
// Corta o acesso à rede e a carregamento de scripts antes de rodar qualquer código.
for (const nome of [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'importScripts',
  'indexedDB',
  'caches',
]) {
  try {
    escopo[nome] = undefined;
  } catch {
    /* algumas propriedades podem ser somente leitura */
  }
}

self.onmessage = (e: MessageEvent<{ codigo: string; funcao: string; casos: CasoJs[] }>) => {
  const { codigo, funcao, casos } = e.data;
  self.postMessage(executarCasos(codigo, funcao, casos));
};
