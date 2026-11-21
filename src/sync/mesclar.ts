/**
 * JUNTAR o progresso de dois aparelhos sem perder nada.
 *
 * Analogia: dois cadernos do mesmo aluno. Juntar não é "o mais novo vence";
 * é copiar para um caderno só tudo o que existe em qualquer um dos dois:
 * - tentativas nunca mudam depois de feitas: basta unir pelo id;
 * - o progresso de uma aula fica com a etapa da edição mais recente, mas o
 *   status nunca "regride" (dominada em um aparelho continua dominada);
 * - um cartão de revisão fica com a versão que foi revisada mais vezes
 *   (ou mais recentemente).
 * Apagar tudo em um aparelho grava "limpoEm"; o que for mais antigo que isso
 * é descartado em todos.
 */
import {
  FORMATO_BACKUP,
  type Backup,
  type CartaoRevisao,
  type ProgressoAula,
  type StatusAula,
} from '@/domain/progresso';

export interface DocumentoSync {
  backup: Backup;
  /** Momento em que alguém apagou todo o progresso (ISO). Itens anteriores não voltam. */
  limpoEm?: string;
}

const PESO: Record<StatusAula, number> = { 'em-andamento': 0, concluida: 1, dominada: 2 };

const ultimaRevisao = (c: CartaoRevisao) => c.historico.at(-1)?.em ?? '';

function melhorProgresso(a: ProgressoAula, b: ProgressoAula): ProgressoAula {
  const recente = a.atualizadaEm >= b.atualizadaEm ? a : b;
  const status = PESO[a.status] >= PESO[b.status] ? a.status : b.status;
  const iniciadaEm = a.iniciadaEm <= b.iniciadaEm ? a.iniciadaEm : b.iniciadaEm;
  return { ...recente, status, iniciadaEm };
}

function melhorCartao(a: CartaoRevisao, b: CartaoRevisao): CartaoRevisao {
  if (a.historico.length !== b.historico.length)
    return a.historico.length > b.historico.length ? a : b;
  return ultimaRevisao(a) >= ultimaRevisao(b) ? a : b;
}

function unirPor<T>(chave: (x: T) => string, melhor: (a: T, b: T) => T, ...listas: T[][]): T[] {
  const mapa = new Map<string, T>();
  for (const lista of listas)
    for (const item of lista) {
      const k = chave(item);
      const ja = mapa.get(k);
      mapa.set(k, ja ? melhor(ja, item) : item);
    }
  return [...mapa.values()].sort((x, y) => chave(x).localeCompare(chave(y)));
}

/** Remove o que é mais antigo que a limpeza. */
export function descartarAntesDe(backup: Backup, limpoEm: string | undefined): Backup {
  if (!limpoEm) return backup;
  return {
    ...backup,
    progressos: backup.progressos.filter((p) => p.atualizadaEm > limpoEm),
    tentativas: backup.tentativas.filter((t) => t.em > limpoEm),
    cartoes: backup.cartoes.filter((c) => ultimaRevisao(c) > limpoEm),
  };
}

const maisRecente = (a?: string, b?: string) => (!a ? b : !b ? a : a > b ? a : b);

export function mesclar(local: DocumentoSync, remoto: DocumentoSync): DocumentoSync {
  const limpoEm = maisRecente(local.limpoEm, remoto.limpoEm);
  const a = descartarAntesDe(local.backup, limpoEm);
  const b = descartarAntesDe(remoto.backup, limpoEm);
  const backup: Backup = {
    formato: FORMATO_BACKUP,
    schemaVersion: 1,
    exportadoEm: new Date().toISOString(),
    progressos: unirPor((p) => p.aulaId, melhorProgresso, a.progressos, b.progressos),
    tentativas: unirPor(
      (t) => t.id,
      (x) => x,
      a.tentativas,
      b.tentativas,
    ),
    cartoes: unirPor((c) => c.id, melhorCartao, a.cartoes, b.cartoes),
  };
  return limpoEm ? { backup, limpoEm } : { backup };
}

/** "Impressão digital" do conteúdo, para saber se algo mudou (ignora a data de exportação). */
export function assinatura(doc: DocumentoSync): string {
  const ordenar = <T>(lista: T[], chave: (x: T) => string) =>
    [...lista].sort((x, y) => chave(x).localeCompare(chave(y)));
  return JSON.stringify([
    doc.limpoEm ?? '',
    ordenar(doc.backup.progressos, (p) => p.aulaId),
    ordenar(doc.backup.tentativas, (t) => t.id).map((t) => t.id),
    ordenar(doc.backup.cartoes, (c) => c.id),
  ]);
}
