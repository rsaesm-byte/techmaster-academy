import type { Aula } from '@/domain/conteudo';
import type { Tentativa } from '@/domain/progresso';
import { avaliarDominio, calcularStatus } from '@/engines/mastery/dominio';
import type { NovaTentativa } from '@/features/exercicios/QuestaoCard';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

/** Grava uma tentativa e atualiza o status da aula (pode virar "dominada"). Usado na aula e na revisão. */
export async function registrarTentativa(
  repo: ProgressRepository,
  aula: Aula,
  nova: NovaTentativa,
): Promise<Tentativa[]> {
  const agora = new Date().toISOString();
  await repo.registrarTentativa({ ...nova, id: crypto.randomUUID(), aulaId: aula.id, em: agora });
  const lista = await repo.listarTentativas(aula.id);
  const progresso = await repo.obterProgresso(aula.id);
  if (progresso) {
    const status = calcularStatus(
      false,
      avaliarDominio(aula.criterioDominio, lista),
      progresso.status,
    );
    if (status !== progresso.status)
      await repo.salvarProgresso({ ...progresso, status, atualizadaEm: agora });
  }
  return lista;
}
