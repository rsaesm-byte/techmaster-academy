/**
 * CRITÉRIO DE DOMÍNIO
 * Uma questão conta como acertada se houve ao menos uma tentativa correta
 * SEM a resposta ter sido revelada antes. Tempo gasto não entra no cálculo.
 */
import type { Aula } from '@/domain/conteudo';
import type { StatusAula, Tentativa } from '@/domain/progresso';

export interface ResultadoDominio {
  percentual: number;
  acertadas: string[];
  pendentes: string[];
  atingido: boolean;
}

export function avaliarDominio(
  criterio: Aula['criterioDominio'],
  tentativas: readonly Tentativa[],
): ResultadoDominio {
  const acertou = (id: string) => {
    const daQuestao = tentativas.filter((t) => t.questaoId === id);
    // Momento em que a resposta foi revelada pela primeira vez (se foi).
    const revelacao = daQuestao
      .filter((t) => t.respostaRevelada)
      .map((t) => t.em)
      .sort()[0];
    // Conta só o acerto feito ANTES de ver a resposta.
    return daQuestao.some(
      (t) => t.correta && !t.respostaRevelada && (revelacao === undefined || t.em < revelacao),
    );
  };

  const acertadas = criterio.questoes.filter(acertou);
  const pendentes = criterio.questoes.filter((id) => !acertadas.includes(id));
  const percentual = Math.round((acertadas.length / criterio.questoes.length) * 100);
  return { percentual, acertadas, pendentes, atingido: percentual >= criterio.minPercentual };
}

/** Status da aula: dominada > concluída > em andamento. Nunca rebaixa um domínio já atingido. */
export function calcularStatus(
  chegouAoFim: boolean,
  dominio: ResultadoDominio,
  anterior?: StatusAula,
): StatusAula {
  if (dominio.atingido || anterior === 'dominada') return 'dominada';
  if (chegouAoFim || anterior === 'concluida') return 'concluida';
  return 'em-andamento';
}
