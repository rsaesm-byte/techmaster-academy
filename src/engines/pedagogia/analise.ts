/**
 * ANÁLISE PEDAGÓGICA — regras determinísticas e explicáveis (sem IA) sobre o progresso real.
 * Tudo aqui é função pura: recebe dados, devolve recomendações. Fácil de testar e de auditar.
 */
import type { Catalogo } from '@/content/catalogo';
import type { Aula, Questao } from '@/domain/conteudo';
import type { CartaoRevisao, ProgressoAula, Tentativa } from '@/domain/progresso';
import { avaliarDominio } from '@/engines/mastery/dominio';

export interface LocalQuestao {
  aula: Aula;
  etapaIndice: number;
  etapaId: string;
  questao: Questao;
}

export function localizarQuestao(aula: Aula, questaoId: string): LocalQuestao | undefined {
  for (const [i, e] of aula.etapas.entries()) {
    if (!('questoes' in e)) continue;
    const q = e.questoes.find((x) => x.id === questaoId);
    if (q) return { aula, etapaIndice: i, etapaId: e.id, questao: q };
  }
  return undefined;
}

/** Questões que o aluno errou e ainda não acertou sozinho depois. */
export function questoesPendentes(
  tentativas: readonly Tentativa[],
): { aulaId: string; questaoId: string; erros: number }[] {
  const porQuestao = new Map<string, Tentativa[]>();
  for (const t of tentativas) {
    const k = `${t.aulaId}#${t.questaoId}`;
    porQuestao.set(k, [...(porQuestao.get(k) ?? []), t]);
  }
  const pendentes: { aulaId: string; questaoId: string; erros: number }[] = [];
  for (const lista of porQuestao.values()) {
    const ordenada = [...lista].sort((a, b) => a.em.localeCompare(b.em));
    const ultimaErrada = ordenada.findLastIndex((t) => !t.correta);
    if (ultimaErrada === -1) continue;
    const acertouDepois = ordenada
      .slice(ultimaErrada + 1)
      .some((t) => t.correta && !t.respostaRevelada);
    if (!acertouDepois) {
      const t = ordenada[0] as Tentativa;
      pendentes.push({
        aulaId: t.aulaId,
        questaoId: t.questaoId,
        erros: ordenada.filter((x) => !x.correta).length,
      });
    }
  }
  return pendentes.sort((a, b) => b.erros - a.erros);
}

export type Recomendacao =
  | { tipo: 'reforcar-questao'; titulo: string; motivo: string; rota: string }
  | { tipo: 'dominar-aula'; titulo: string; motivo: string; rota: string }
  | { tipo: 'pre-requisito'; titulo: string; motivo: string; rota: string };

export function recomendacoes(
  catalogo: Catalogo,
  progressos: ReadonlyMap<string, ProgressoAula>,
  tentativas: readonly Tentativa[],
  limite = 3,
): Recomendacao[] {
  const r: Recomendacao[] = [];

  // 1. Questões erradas e ainda não superadas — o sinal mais específico de dificuldade.
  for (const p of questoesPendentes(tentativas)) {
    const aula = catalogo.aulas.get(p.aulaId);
    const local = aula && localizarQuestao(aula, p.questaoId);
    if (!local) continue;
    r.push({
      tipo: 'reforcar-questao',
      titulo: `Reforce: ${resumir(local.questao.enunciado)}`,
      motivo: `${p.erros} ${p.erros === 1 ? 'erro' : 'erros'} em "${aula.titulo}", ainda sem acerto. Tente de novo com calma — as pistas ajudam.`,
      rota: `/aula/${aula.id}?etapa=${local.etapaId}`,
    });
  }

  // 2. Aulas concluídas, mas ainda não dominadas.
  for (const p of progressos.values()) {
    if (p.status !== 'concluida') continue;
    const aula = catalogo.aulas.get(p.aulaId);
    if (!aula) continue;
    const d = avaliarDominio(
      aula.criterioDominio,
      tentativas.filter((t) => t.aulaId === aula.id),
    );
    const primeira = d.pendentes[0] && localizarQuestao(aula, d.pendentes[0]);
    r.push({
      tipo: 'dominar-aula',
      titulo: `Domine "${aula.titulo}"`,
      motivo: `Você está em ${d.percentual}% (meta ${aula.criterioDominio.minPercentual}%). Faltam ${d.pendentes.length} ${d.pendentes.length === 1 ? 'questão' : 'questões'}.`,
      rota: primeira ? `/aula/${aula.id}?etapa=${primeira.etapaId}` : `/aula/${aula.id}`,
    });
  }

  // 3. Aula em andamento cujo pré-requisito não foi concluído.
  for (const p of progressos.values()) {
    const aula = catalogo.aulas.get(p.aulaId);
    if (!aula || p.status !== 'em-andamento') continue;
    for (const pre of aula.preRequisitos) {
      const s = progressos.get(pre)?.status;
      if (s === 'concluida' || s === 'dominada') continue;
      const anterior = catalogo.aulas.get(pre);
      if (!anterior) continue;
      r.push({
        tipo: 'pre-requisito',
        titulo: `Antes, veja "${anterior.titulo}"`,
        motivo: `"${aula.titulo}" usa ideias dessa aula, que você ainda não concluiu. Não é obrigatório — é uma sugestão.`,
        rota: `/aula/${pre}`,
      });
    }
  }

  const vistos = new Set<string>();
  return r
    .filter((x) => (vistos.has(x.rota) ? false : (vistos.add(x.rota), true)))
    .slice(0, limite);
}

function resumir(texto: string, max = 70): string {
  const limpo = texto.replace(/`/g, '');
  return limpo.length <= max ? limpo : `${limpo.slice(0, max - 1).trimEnd()}…`;
}

// ---------- Diagnóstico adaptativo ----------

export type ResultadoDiagnostico =
  | { tipo: 'incompleto' }
  | { tipo: 'domina'; pularPara?: { indice: number; titulo: string } }
  | { tipo: 'parcial' }
  | { tipo: 'iniciante' };

/** Lê só a PRIMEIRA tentativa de cada questão do diagnóstico (a de antes de qualquer ajuda). */
export function avaliarDiagnostico(
  aula: Aula,
  tentativas: readonly Tentativa[],
): ResultadoDiagnostico {
  const diag = aula.etapas.find((e) => e.tipo === 'diagnostico');
  if (!diag || diag.tipo !== 'diagnostico') return { tipo: 'incompleto' };
  const primeiras = diag.questoes.map((q) =>
    [...tentativas].sort((a, b) => a.em.localeCompare(b.em)).find((t) => t.questaoId === q.id),
  );
  if (primeiras.some((t) => !t)) return { tipo: 'incompleto' };
  const acertos = primeiras.filter((t) => t?.correta && t.pistasUsadas === 0).length;
  if (acertos === diag.questoes.length) {
    const indice = aula.etapas.findIndex((e) => e.tipo === 'exemplo');
    const alvo = aula.etapas[indice];
    return indice > 0 && alvo && 'titulo' in alvo
      ? { tipo: 'domina', pularPara: { indice, titulo: alvo.titulo } }
      : { tipo: 'domina' };
  }
  return acertos > 0 ? { tipo: 'parcial' } : { tipo: 'iniciante' };
}

// ---------- Estatísticas ----------

export interface EstatisticaAula {
  aula: Aula;
  status: ProgressoAula['status'] | 'nao-iniciada';
  dominio: number;
  tentativas: number;
  taxaAcerto: number | null;
  maisErrada?: { enunciado: string; erros: number };
}

export function estatisticas(
  catalogo: Catalogo,
  progressos: ReadonlyMap<string, ProgressoAula>,
  tentativas: readonly Tentativa[],
): EstatisticaAula[] {
  return [...catalogo.aulas.values()].map((aula) => {
    const daAula = tentativas.filter((t) => t.aulaId === aula.id && !t.respostaRevelada);
    const erros = new Map<string, number>();
    for (const t of daAula)
      if (!t.correta) erros.set(t.questaoId, (erros.get(t.questaoId) ?? 0) + 1);
    const [qid, n] = [...erros.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
    const local = qid ? localizarQuestao(aula, qid) : undefined;
    return {
      aula,
      status: progressos.get(aula.id)?.status ?? 'nao-iniciada',
      dominio: avaliarDominio(
        aula.criterioDominio,
        tentativas.filter((t) => t.aulaId === aula.id),
      ).percentual,
      tentativas: daAula.length,
      taxaAcerto: daAula.length
        ? Math.round((daAula.filter((t) => t.correta).length / daAula.length) * 100)
        : null,
      ...(local && n
        ? { maisErrada: { enunciado: resumir(local.questao.enunciado, 90), erros: n } }
        : {}),
    };
  });
}

// ---------- Conquistas ----------

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  obtida: boolean;
  progresso?: string;
}

/**
 * Conquistas premiam APRENDIZAGEM (domínio, persistência, revisão, explicar), nunca tempo
 * gasto nem sequências de dias que punem quem precisa de pausa.
 */
export function conquistas(
  catalogo: Catalogo,
  progressos: ReadonlyMap<string, ProgressoAula>,
  tentativas: readonly Tentativa[],
  cartoes: readonly CartaoRevisao[],
): Conquista[] {
  const status = [...progressos.values()];
  const concluidas = status.filter(
    (p) => p.status === 'concluida' || p.status === 'dominada',
  ).length;
  const dominadas = status.filter((p) => p.status === 'dominada').length;
  const revisoes = cartoes.reduce((n, c) => n + c.historico.length, 0);
  const abertas = tentativas.filter(
    (t) => (t.resposta as { tipo?: string } | null)?.tipo === 'resposta-aberta',
  ).length;
  const programas = new Set(
    tentativas
      .filter(
        (t) =>
          t.correta &&
          !t.respostaRevelada &&
          /^programa-/.test((t.resposta as { tipo?: string } | null)?.tipo ?? ''),
      )
      .map((t) => `${t.aulaId}#${t.questaoId}`),
  ).size;

  // Persistência: acertou sozinho uma questão em que tinha errado 3 vezes ou mais.
  const porQuestao = new Map<string, Tentativa[]>();
  for (const t of tentativas)
    porQuestao.set(`${t.aulaId}#${t.questaoId}`, [
      ...(porQuestao.get(`${t.aulaId}#${t.questaoId}`) ?? []),
      t,
    ]);
  const persistente = [...porQuestao.values()].some((l) => {
    const o = [...l].sort((a, b) => a.em.localeCompare(b.em));
    const acerto = o.findIndex((t) => t.correta && !t.respostaRevelada);
    return acerto >= 3 && o.slice(0, acerto).filter((t) => !t.correta).length >= 3;
  });

  const modulos = catalogo.disciplinas.flatMap((d) => d.modulos);
  const moduloDominado = modulos.some((m) =>
    m.aulas.every((a) => progressos.get(a)?.status === 'dominada'),
  );

  return [
    {
      id: 'primeiro-passo',
      nome: 'Primeiro passo',
      descricao: 'Concluiu a primeira aula.',
      obtida: concluidas >= 1,
    },
    {
      id: 'dominio',
      nome: 'Domínio',
      descricao: 'Dominou uma aula: 80% ou mais sem ver a resposta.',
      obtida: dominadas >= 1,
    },
    {
      id: 'programador',
      nome: 'Programador',
      descricao: 'Resolveu 5 exercícios de programa, testados de verdade.',
      obtida: programas >= 5,
      progresso: `${Math.min(programas, 5)}/5`,
    },
    {
      id: 'persistente',
      nome: 'Persistente',
      descricao: 'Acertou sozinho uma questão depois de errar 3 vezes. Errar faz parte.',
      obtida: persistente,
    },
    {
      id: 'memoria',
      nome: 'Memória em dia',
      descricao: 'Fez 10 revisões espaçadas.',
      obtida: revisoes >= 10,
      progresso: `${Math.min(revisoes, 10)}/10`,
    },
    {
      id: 'explicador',
      nome: 'Explicador',
      descricao: 'Explicou 3 conceitos com as próprias palavras.',
      obtida: abertas >= 3,
      progresso: `${Math.min(abertas, 3)}/3`,
    },
    {
      id: 'modulo',
      nome: 'Módulo completo',
      descricao: 'Dominou todas as aulas de um módulo.',
      obtida: moduloDominado,
    },
  ];
}
