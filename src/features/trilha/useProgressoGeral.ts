import { useEffect, useState } from 'react';
import { catalogo } from '@/content';
import type { CartaoRevisao, ProgressoAula, Tentativa } from '@/domain/progresso';
import { useRepositorio } from '@/persistence/RepositorioProvider';

export interface ProgressoGeral {
  progressos: Map<string, ProgressoAula>;
  cartoes: CartaoRevisao[];
  tentativas: Tentativa[];
}

/** Carrega de uma vez tudo o que o painel e o mapa precisam. */
export function useProgressoGeral(): ProgressoGeral | null {
  const repo = useRepositorio();
  const [dados, setDados] = useState<ProgressoGeral | null>(null);
  useEffect(() => {
    let ativo = true;
    void (async () => {
      const [progressos, cartoes, ...listas] = await Promise.all([
        repo.listarProgressos(),
        repo.listarCartoes(),
        ...[...catalogo.aulas.keys()].map((id) => repo.listarTentativas(id)),
      ]);
      if (!ativo) return;
      setDados({
        progressos: new Map(progressos.map((p) => [p.aulaId, p])),
        cartoes,
        tentativas: listas.flat(),
      });
    })();
    return () => {
      ativo = false;
    };
  }, [repo]);
  return dados;
}

/** Primeira aula do módulo que ainda não foi concluída: a sugestão de "próximo passo". */
export function proximaAula(
  aulas: string[],
  progressos: Map<string, ProgressoAula>,
): string | undefined {
  return aulas.find((id) => {
    const s = progressos.get(id)?.status;
    return s !== 'concluida' && s !== 'dominada';
  });
}
