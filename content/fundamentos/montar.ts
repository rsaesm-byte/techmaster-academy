/**
 * Montador de aulas da escola A. As aulas de Fundamentos seguem sempre as mesmas
 * etapas obrigatórias; este arquivo cuida da parte repetitiva (ids, ordem, critério
 * de domínio) para o arquivo de cada aula conter só o conteúdo.
 */
import type { AulaEntrada } from '@/domain/conteudo';

type Etapas = AulaEntrada['etapas'];
type Etapa = Etapas[number];
type Questao = Extract<Etapa, { questoes: unknown[] }>['questoes'][number];
type Q = Omit<Questao, 'id'>;
type Simulacao = Extract<Etapa, { tipo: 'demo' }>['simulacao'];

/** Questão de múltipla escolha: a correta vem primeiro; `pos` (0–2) escolhe onde ela aparece. */
export function mc(
  enunciado: string,
  correta: string,
  erradas: [string, string][],
  explicacao: string,
  pos = 0,
  codigo?: { linguagem: 'pseudocodigo' | 'javascript' | 'python'; fonte: string },
): Q {
  const alt = [...erradas.map(([texto, feedback]) => ({ texto, feedback }))];
  alt.splice(Math.min(pos, alt.length), 0, { texto: correta, feedback: '' });
  const alternativas = alt.map((a, i) => ({
    id: 'abcdef'.charAt(i),
    texto: a.texto,
    ...(a.feedback ? { feedback: a.feedback } : {}),
  }));
  const id = alternativas.find((a) => a.texto === correta)?.id ?? 'a';
  return {
    tipo: 'multipla-escolha',
    enunciado,
    alternativas,
    correta: id,
    explicacao,
    ...(codigo ? { codigo } : {}),
  } as Q;
}

export function prever(
  enunciado: string,
  fonte: string,
  aceitas: string[],
  explicacao: string,
  erros: { resposta: string; feedback: string }[] = [],
  pistas: string[] = [],
): Q {
  return {
    tipo: 'prever-saida',
    enunciado,
    codigo: { linguagem: 'pseudocodigo', fonte },
    respostasAceitas: aceitas,
    errosComuns: erros,
    pistas,
    explicacao,
  } as Q;
}

export function associar(enunciado: string, pares: [string, string][], explicacao: string): Q {
  return {
    tipo: 'associacao',
    enunciado,
    pares: pares.map(([esquerda, direita], i) => ({ id: `p${i + 1}`, esquerda, direita })),
    explicacao,
  } as Q;
}

export function ordenar(enunciado: string, itens: string[], explicacao: string): Q {
  return {
    tipo: 'ordenacao',
    enunciado,
    itens: itens.map((texto, i) => ({ id: `i${i + 1}`, texto })),
    explicacao,
  } as Q;
}

export function completar(
  enunciado: string,
  fonte: string,
  lacunas: { aceitas: string[]; feedback?: string }[],
  explicacao: string,
): Q {
  return {
    tipo: 'completar-codigo',
    enunciado,
    codigo: { linguagem: 'pseudocodigo', fonte },
    lacunas,
    explicacao,
  } as Q;
}

export interface Spec {
  id: string;
  titulo: string;
  objetivo: string;
  pre: string[];
  min: number;
  diag: Q;
  simples: { titulo: string; texto: string; essencial: string; guiado: string; tecnico: string };
  analogia: { titulo: string; texto: string; limites: string };
  demo: { titulo: string; instrucoes: string; simulacao: Simulacao };
  tecnica: { titulo: string; texto: string };
  diagrama: {
    titulo: string;
    nos: { forma: 'inicio' | 'passo' | 'decisao' | 'fim'; texto: string }[];
    descricao: string;
  };
  exemplo: {
    titulo: string;
    codigo: { linguagem: 'pseudocodigo' | 'javascript' | 'python'; fonte: string };
    comentarios: { linha: number; texto: string }[];
  };
  guiado: [Q, Q];
  indep: [Q, Q];
  desafio: Q;
  rec: [Q, Q];
  explique: { enunciado: string; modelo: string; rubrica: string[] };
  resumo: string[];
  cards: [string, string][];
  conexoes: { disciplinas: string[]; profissional: string };
}

const comId = (prefixo: string, qs: Q[]): Questao[] =>
  qs.map((q, i) => ({ ...q, id: `${prefixo}.q${i + 1}` }) as Questao);

export function montar(s: Spec): AulaEntrada {
  const exGuiado = comId('ex-guiado', s.guiado);
  const exIndep = comId('ex-indep', s.indep);
  const desafio = comId('desafio', [s.desafio]);
  const rec = comId('rec', s.rec);
  const aberta: Questao = {
    id: 'rec.explique',
    tipo: 'resposta-aberta',
    enunciado: s.explique.enunciado,
    respostaModelo: s.explique.modelo,
    rubrica: s.explique.rubrica,
    explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
  } as Questao;
  return {
    id: s.id,
    versao: 1,
    status: 'publicada',
    titulo: s.titulo,
    objetivo: s.objetivo,
    preRequisitos: s.pre,
    duracaoMin: s.min,
    etapas: [
      {
        id: 'diag',
        tipo: 'diagnostico',
        titulo: 'Antes de começar: o que você já sabe?',
        questoes: comId('diag', [s.diag]),
      },
      {
        id: 'exp-simples',
        tipo: 'explicacao',
        nivel: 'simples',
        titulo: s.simples.titulo,
        texto: s.simples.texto,
        porModo: {
          essencial: s.simples.essencial,
          guiado: s.simples.guiado,
          tecnico: s.simples.tecnico,
        },
      },
      { id: 'analogia', tipo: 'analogia', ...s.analogia } as Etapa,
      {
        id: 'demo',
        tipo: 'demo',
        titulo: s.demo.titulo,
        instrucoes: s.demo.instrucoes,
        simulacao: s.demo.simulacao,
      },
      { id: 'exp-tecnica', tipo: 'explicacao', nivel: 'tecnica', ...s.tecnica },
      {
        id: 'diagrama',
        tipo: 'diagrama',
        titulo: s.diagrama.titulo,
        nos: s.diagrama.nos,
        descricao: s.diagrama.descricao,
      },
      { id: 'exemplo', tipo: 'exemplo', ...s.exemplo },
      {
        id: 'ex-guiado',
        tipo: 'exercicio',
        modo: 'guiado',
        titulo: 'Exercício guiado',
        questoes: exGuiado,
      },
      {
        id: 'ex-indep',
        tipo: 'exercicio',
        modo: 'independente',
        titulo: 'Agora é com você',
        questoes: exIndep,
      },
      { id: 'desafio', tipo: 'exercicio', modo: 'desafio', titulo: 'Desafio', questoes: desafio },
      {
        id: 'recuperacao',
        tipo: 'recuperacao',
        titulo: 'Sem olhar para cima: responda de memória',
        questoes: [...rec, aberta],
      },
      { id: 'resumo', tipo: 'resumo', pontos: s.resumo },
      {
        id: 'flashcards',
        tipo: 'flashcards',
        cards: s.cards.map(([frente, verso], i) => ({
          id: `${s.id}.fc${i + 1}`,
          frente,
          verso,
        })),
      },
      {
        id: 'conexoes',
        tipo: 'conexoes',
        disciplinas: s.conexoes.disciplinas,
        aplicacaoProfissional: s.conexoes.profissional,
      },
    ],
    criterioDominio: {
      questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
      minPercentual: 80,
    },
  };
}
