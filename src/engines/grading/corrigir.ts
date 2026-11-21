/**
 * MOTOR DE CORREÇÃO — TypeScript puro, sem React, fácil de testar.
 * Recebe a questão e a resposta do aluno e devolve se acertou e um feedback
 * ESPECÍFICO: explicar o erro provável ensina mais do que só dizer "errado".
 */
import type { Questao } from '@/domain/conteudo';

export type Resposta =
  | { tipo: 'multipla-escolha'; alternativa: string }
  | { tipo: 'prever-saida'; texto: string }
  | { tipo: 'ordenacao'; ordem: string[] }
  /** Para cada par (pelo id da esquerda), o id do par cuja direita o aluno escolheu. */
  | { tipo: 'associacao'; escolhas: Record<string, string> };

export interface Correcao {
  correta: boolean;
  feedback: string;
}

const FEEDBACK_GENERICO_SAIDA =
  'Não é isso. Execute o código linha por linha, anotando o valor de cada variável.';

/** Compara saídas ignorando maiúsculas, espaços extras e aspas em volta. */
export function normalizarSaida(texto: string): string {
  return texto
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function corrigir(questao: Questao, resposta: Resposta): Correcao {
  if (questao.tipo !== resposta.tipo) {
    throw new Error(`Resposta do tipo ${resposta.tipo} para questão do tipo ${questao.tipo}`);
  }
  const acerto = { correta: true, feedback: questao.explicacao };

  switch (questao.tipo) {
    case 'multipla-escolha': {
      const { alternativa } = resposta as Extract<Resposta, { tipo: 'multipla-escolha' }>;
      if (alternativa === questao.correta) return acerto;
      const escolhida = questao.alternativas.find((a) => a.id === alternativa);
      return { correta: false, feedback: escolhida?.feedback ?? 'Essa não é a resposta.' };
    }

    case 'prever-saida': {
      const { texto } = resposta as Extract<Resposta, { tipo: 'prever-saida' }>;
      const dada = normalizarSaida(texto);
      if (questao.respostasAceitas.some((r) => normalizarSaida(r) === dada)) return acerto;
      const comum = questao.errosComuns.find((e) => normalizarSaida(e.resposta) === dada);
      return { correta: false, feedback: comum?.feedback ?? FEEDBACK_GENERICO_SAIDA };
    }

    case 'ordenacao': {
      const { ordem } = resposta as Extract<Resposta, { tipo: 'ordenacao' }>;
      const certos = questao.itens.filter((item, i) => ordem[i] === item.id).length;
      if (certos === questao.itens.length && ordem.length === certos) return acerto;
      return {
        correta: false,
        feedback: `${certos} de ${questao.itens.length} passos estão na posição certa. Releia a sequência perguntando: o que precisa acontecer antes deste passo?`,
      };
    }

    case 'associacao': {
      const { escolhas } = resposta as Extract<Resposta, { tipo: 'associacao' }>;
      const certos = questao.pares.filter((p) => escolhas[p.id] === p.id).length;
      if (certos === questao.pares.length) return acerto;
      return {
        correta: false,
        feedback: `${certos} de ${questao.pares.length} associações estão certas. Mantenha as que você tem certeza e revise as outras.`,
      };
    }
  }
}

/** A resposta foi preenchida o suficiente para ser verificada? */
export function respostaCompleta(questao: Questao, resposta: Resposta | undefined): boolean {
  if (!resposta) return false;
  switch (resposta.tipo) {
    case 'multipla-escolha':
      return resposta.alternativa !== '';
    case 'prever-saida':
      return resposta.texto.trim() !== '';
    case 'ordenacao':
      return true;
    case 'associacao':
      return (
        questao.tipo === 'associacao' &&
        questao.pares.every((p) => Boolean(resposta.escolhas[p.id]))
      );
  }
}

/**
 * Embaralha de forma DETERMINÍSTICA a partir de uma semente (o id da questão):
 * a mesma questão sempre aparece na mesma ordem, e nunca já resolvida.
 */
export function embaralhar<T>(itens: readonly T[], semente: string): T[] {
  let h = 2166136261;
  for (const c of semente) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const aleatorio = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h >>> 0) % 10000) / 10000;
  };
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j] as T, copia[i] as T];
  }
  if (copia.length > 1 && copia.every((x, i) => x === itens[i])) copia.push(copia.shift() as T);
  return copia;
}
