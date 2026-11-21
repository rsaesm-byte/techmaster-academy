import type { Catalogo } from '@/content/catalogo';
import type { Aula, Questao } from '@/domain/conteudo';
import type { CartaoRevisao } from '@/domain/progresso';
import { estadoInicial, estaVencido } from '@/engines/srs/sm2';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

export type ItemRevisao =
  | { tipo: 'flashcard'; cartao: CartaoRevisao; aula: Aula; frente: string; verso: string }
  | { tipo: 'questao'; cartao: CartaoRevisao; aula: Aula; questao: Questao };

function novoCartao(
  aula: Aula,
  origem: CartaoRevisao['origem'],
  itemId: string,
  hoje: string,
): CartaoRevisao {
  return {
    id: origem === 'flashcard' ? `fc:${itemId}` : `q:${aula.id}#${itemId}`,
    aulaId: aula.id,
    origem,
    itemId,
    ...estadoInicial(hoje),
    historico: [],
  };
}

/** Os cartões que uma aula gera: seus flashcards e (se pedido) as questões do critério de domínio. */
export function cartoesDaAula(aula: Aula, hoje: string, incluirQuestoes: boolean): CartaoRevisao[] {
  const flash = aula.etapas.flatMap((e) =>
    e.tipo === 'flashcards' ? e.cards.map((c) => novoCartao(aula, 'flashcard', c.id, hoje)) : [],
  );
  const questoes = incluirQuestoes
    ? aula.criterioDominio.questoes.map((q) => novoCartao(aula, 'questao', q, hoje))
    : [];
  return [...flash, ...questoes];
}

/** Coloca na fila os cartões que ainda não existem — nunca reinicia um cartão já em revisão. */
export async function garantirCartoes(
  repo: ProgressRepository,
  aula: Aula,
  hoje: string,
  incluirQuestoes: boolean,
) {
  const existentes = new Set((await repo.listarCartoes()).map((c) => c.id));
  const novos = cartoesDaAula(aula, hoje, incluirQuestoes).filter((c) => !existentes.has(c.id));
  if (novos.length) await repo.salvarCartoes(novos);
}

export function resolverItem(catalogo: Catalogo, cartao: CartaoRevisao): ItemRevisao | undefined {
  const aula = catalogo.aulas.get(cartao.aulaId);
  if (!aula) return undefined;
  for (const e of aula.etapas) {
    if (cartao.origem === 'flashcard' && e.tipo === 'flashcards') {
      const c = e.cards.find((x) => x.id === cartao.itemId);
      if (c) return { tipo: 'flashcard', cartao, aula, frente: c.frente, verso: c.verso };
    }
    if (cartao.origem === 'questao' && 'questoes' in e) {
      const q = e.questoes.find((x) => x.id === cartao.itemId);
      if (q) return { tipo: 'questao', cartao, aula, questao: q };
    }
  }
  return undefined; // conteúdo mudou e o item não existe mais: ignorado
}

export function vencidos(cartoes: CartaoRevisao[], hoje: string): CartaoRevisao[] {
  return cartoes
    .filter((c) => estaVencido(c, hoje))
    .sort((a, b) => a.proximaRevisao.localeCompare(b.proximaRevisao) || a.id.localeCompare(b.id));
}
