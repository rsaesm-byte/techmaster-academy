import { useCallback, useEffect, useRef, useState } from 'react';
import type { Aula } from '@/domain/conteudo';
import type { ProgressoAula, Tentativa } from '@/domain/progresso';
import { avaliarDominio, calcularStatus, type ResultadoDominio } from '@/engines/mastery/dominio';
import { dataLocal } from '@/engines/srs/sm2';
import type { NovaTentativa } from '@/features/exercicios/QuestaoCard';
import { garantirCartoes } from '@/features/revisao/fila';
import { useRepositorio } from '@/persistence/RepositorioProvider';

const agora = () => new Date().toISOString();

/**
 * Liga uma aula ao progresso salvo: em que etapa o aluno está, as tentativas
 * e o domínio. Cada mudança é gravada na hora — fechar o navegador não perde nada.
 */
export function useProgressoAula(aula: Aula) {
  const repo = useRepositorio();
  const [progresso, setProgresso] = useState<ProgressoAula | null>(null);
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const atual = useRef<ProgressoAula | null>(null);

  useEffect(() => {
    let ativo = true;
    void (async () => {
      const [salvo, lista] = await Promise.all([
        repo.obterProgresso(aula.id),
        repo.listarTentativas(aula.id),
      ]);
      const inicial: ProgressoAula = salvo
        ? { ...salvo, etapaAtual: Math.min(salvo.etapaAtual, aula.etapas.length - 1) }
        : {
            aulaId: aula.id,
            aulaVersao: aula.versao,
            etapaAtual: 0,
            status: 'em-andamento',
            iniciadaEm: agora(),
            atualizadaEm: agora(),
          };
      if (!salvo) await repo.salvarProgresso(inicial);
      if (!ativo) return;
      atual.current = inicial;
      setProgresso(inicial);
      setTentativas(lista);
    })();
    return () => {
      ativo = false;
    };
  }, [repo, aula]);

  const gravar = useCallback(
    async (mudanca: Partial<ProgressoAula>) => {
      if (!atual.current) return;
      const novo = { ...atual.current, ...mudanca, aulaVersao: aula.versao, atualizadaEm: agora() };
      atual.current = novo;
      setProgresso(novo);
      await repo.salvarProgresso(novo);
    },
    [repo, aula.versao],
  );

  const irPara = useCallback(
    async (indice: number) => {
      await gravar({ etapaAtual: indice });
      // Ao ver os flashcards, eles entram na fila de revisão espaçada (primeira revisão amanhã).
      if (aula.etapas[indice]?.tipo === 'flashcards')
        await garantirCartoes(repo, aula, dataLocal(new Date()), false);
    },
    [gravar, aula, repo],
  );

  const registrar = useCallback(
    async (nova: NovaTentativa) => {
      const tentativa: Tentativa = {
        ...nova,
        id: crypto.randomUUID(),
        aulaId: aula.id,
        em: agora(),
      };
      await repo.registrarTentativa(tentativa);
      const lista = [...(await repo.listarTentativas(aula.id))];
      setTentativas(lista);
      const dominio = avaliarDominio(aula.criterioDominio, lista);
      await gravar({ status: calcularStatus(false, dominio, atual.current?.status) });
    },
    [repo, aula, gravar],
  );

  const concluir = useCallback(async (): Promise<ResultadoDominio> => {
    const lista = await repo.listarTentativas(aula.id);
    const dominio = avaliarDominio(aula.criterioDominio, lista);
    await gravar({ status: calcularStatus(true, dominio, atual.current?.status) });
    // Concluir a aula põe flashcards e questões do critério na revisão espaçada.
    await garantirCartoes(repo, aula, dataLocal(new Date()), true);
    return dominio;
  }, [repo, aula, gravar]);

  return { progresso, tentativas, irPara, registrar, concluir };
}
