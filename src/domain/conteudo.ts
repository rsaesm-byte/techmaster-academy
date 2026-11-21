/**
 * CONTRATOS DE CONTEÚDO
 *
 * Toda aula da plataforma precisa caber nestes schemas. Eles fazem dois papéis:
 * 1. Geram os tipos TypeScript (z.infer), então o editor avisa erros enquanto você escreve.
 * 2. Validam o conteúdo de verdade (teste "conteúdo válido"), barrando aula incompleta.
 *
 * Analogia: o schema é o formulário de matrícula da aula. Se faltar um campo
 * obrigatório, a secretaria (o CI) devolve o formulário e a aula não entra no ar.
 */
import { z } from 'zod';

// ---------- Blocos básicos ----------

/** IDs estáveis no formato "logica.m01.a01.ex1". Nunca mudam depois de publicados. */
export const IdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, 'use só minúsculas, números, "." e "-"');

/** Texto didático: parágrafos separados por linha em branco; `código` entre crases. */
export const TextoSchema = z.string().trim().min(1, 'texto vazio');

export const LinguagemSchema = z.enum(['pseudocodigo', 'javascript', 'python']);

export const CodigoSchema = z.object({
  linguagem: LinguagemSchema,
  fonte: z.string().min(1),
});

const PistasSchema = z.array(TextoSchema).max(3, 'no máximo 3 pistas');

const questaoBase = {
  id: IdSchema,
  enunciado: TextoSchema,
  /** Pistas graduais: da mais vaga para a mais direta. */
  pistas: PistasSchema.default([]),
  /** Mostrada quando o aluno acerta ou pede a resposta: explica o PORQUÊ. */
  explicacao: TextoSchema,
  codigo: CodigoSchema.optional(),
};

// ---------- Questões ----------

export const AlternativaSchema = z.object({
  id: z.string().min(1),
  texto: TextoSchema,
  /** Obrigatório nas alternativas erradas: diz qual raciocínio levou ao erro. */
  feedback: TextoSchema.optional(),
});

export const MultiplaEscolhaSchema = z
  .object({
    ...questaoBase,
    tipo: z.literal('multipla-escolha'),
    alternativas: z.array(AlternativaSchema).min(2).max(6),
    correta: z.string().min(1),
  })
  .superRefine((q, ctx) => {
    if (!q.alternativas.some((a) => a.id === q.correta)) {
      ctx.addIssue({
        code: 'custom',
        path: ['correta'],
        message: `"${q.correta}" não é uma alternativa`,
      });
    }
    q.alternativas.forEach((a, i) => {
      if (a.id !== q.correta && !a.feedback) {
        ctx.addIssue({
          code: 'custom',
          path: ['alternativas', i, 'feedback'],
          message: 'alternativa errada precisa de feedback explicando o erro',
        });
      }
    });
    avisarIdsRepetidos(
      q.alternativas.map((a) => a.id),
      ['alternativas'],
      ctx,
    );
  });

export const PreverSaidaSchema = z.object({
  ...questaoBase,
  tipo: z.literal('prever-saida'),
  codigo: CodigoSchema,
  /** Respostas aceitas; a comparação ignora maiúsculas, espaços extras e aspas. */
  respostasAceitas: z.array(z.string().min(1)).min(1),
  errosComuns: z
    .array(z.object({ resposta: z.string().min(1), feedback: TextoSchema }))
    .default([]),
});

export const OrdenacaoSchema = z
  .object({
    ...questaoBase,
    tipo: z.literal('ordenacao'),
    /** Itens JÁ na ordem correta. A interface embaralha. */
    itens: z
      .array(z.object({ id: z.string().min(1), texto: TextoSchema }))
      .min(3)
      .max(8),
  })
  .superRefine((q, ctx) =>
    avisarIdsRepetidos(
      q.itens.map((i) => i.id),
      ['itens'],
      ctx,
    ),
  );

export const AssociacaoSchema = z
  .object({
    ...questaoBase,
    tipo: z.literal('associacao'),
    /** Cada par certo: "esquerda" combina com "direita". */
    pares: z
      .array(z.object({ id: z.string().min(1), esquerda: TextoSchema, direita: TextoSchema }))
      .min(2)
      .max(6),
  })
  .superRefine((q, ctx) =>
    avisarIdsRepetidos(
      q.pares.map((p) => p.id),
      ['pares'],
      ctx,
    ),
  );

export const QuestaoSchema = z.discriminatedUnion('tipo', [
  MultiplaEscolhaSchema,
  PreverSaidaSchema,
  OrdenacaoSchema,
  AssociacaoSchema,
]);

// ---------- Etapas da aula ----------

export const ModoSchema = z.enum(['essencial', 'guiado', 'tecnico']);

const etapaBase = { id: IdSchema };

export const EtapaSchema = z.discriminatedUnion('tipo', [
  z.object({
    ...etapaBase,
    tipo: z.literal('diagnostico'),
    titulo: TextoSchema,
    questoes: z.array(QuestaoSchema).min(1),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('explicacao'),
    nivel: z.enum(['simples', 'tecnica']),
    titulo: TextoSchema,
    texto: TextoSchema,
    /** Versões alternativas do texto para cada modo de apresentação. */
    porModo: z
      .object({ essencial: TextoSchema, guiado: TextoSchema, tecnico: TextoSchema })
      .partial()
      .optional(),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('analogia'),
    titulo: TextoSchema,
    texto: TextoSchema,
    /** Onde a analogia deixa de valer — evita que a simplificação vire erro conceitual. */
    limites: TextoSchema,
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('diagrama'),
    titulo: TextoSchema,
    nos: z
      .array(
        z.object({
          texto: TextoSchema,
          forma: z.enum(['inicio', 'passo', 'decisao', 'fim']),
        }),
      )
      .min(2),
    /** Mesma informação do diagrama, em texto, para leitores de tela. */
    descricao: TextoSchema,
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('exemplo'),
    titulo: TextoSchema,
    codigo: CodigoSchema,
    comentarios: z
      .array(z.object({ linha: z.number().int().positive(), texto: TextoSchema }))
      .min(1),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('exercicio'),
    modo: z.enum(['guiado', 'independente', 'desafio']),
    titulo: TextoSchema,
    questoes: z.array(QuestaoSchema).min(1),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('recuperacao'),
    titulo: TextoSchema,
    questoes: z.array(QuestaoSchema).min(1),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('resumo'),
    pontos: z.array(TextoSchema).min(2),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('flashcards'),
    cards: z.array(z.object({ id: IdSchema, frente: TextoSchema, verso: TextoSchema })).min(3),
  }),
  z.object({
    ...etapaBase,
    tipo: z.literal('conexoes'),
    disciplinas: z.array(TextoSchema).min(1),
    aplicacaoProfissional: TextoSchema,
  }),
]);

// ---------- Aula ----------

/** O que uma aula publicada precisa ter, no mínimo (as 20 etapas do plano, agrupadas). */
export const REQUISITOS_PUBLICACAO: { descricao: string; atende: (e: Etapa) => boolean }[] = [
  { descricao: 'diagnóstico rápido', atende: (e) => e.tipo === 'diagnostico' },
  {
    descricao: 'explicação simples',
    atende: (e) => e.tipo === 'explicacao' && e.nivel === 'simples',
  },
  {
    descricao: 'explicação técnica',
    atende: (e) => e.tipo === 'explicacao' && e.nivel === 'tecnica',
  },
  { descricao: 'diagrama', atende: (e) => e.tipo === 'diagrama' },
  { descricao: 'exemplo comentado', atende: (e) => e.tipo === 'exemplo' },
  { descricao: 'exercício guiado', atende: (e) => e.tipo === 'exercicio' && e.modo === 'guiado' },
  {
    descricao: 'exercício independente',
    atende: (e) => e.tipo === 'exercicio' && e.modo === 'independente',
  },
  { descricao: 'desafio aplicado', atende: (e) => e.tipo === 'exercicio' && e.modo === 'desafio' },
  { descricao: 'recuperação ativa', atende: (e) => e.tipo === 'recuperacao' },
  { descricao: 'resumo', atende: (e) => e.tipo === 'resumo' },
  { descricao: 'flashcards', atende: (e) => e.tipo === 'flashcards' },
  { descricao: 'conexões e aplicação profissional', atende: (e) => e.tipo === 'conexoes' },
];

export const AulaSchema = z
  .object({
    id: IdSchema,
    versao: z.number().int().positive(),
    status: z.enum(['rascunho', 'publicada']),
    titulo: TextoSchema,
    objetivo: TextoSchema,
    preRequisitos: z.array(IdSchema).default([]),
    duracaoMin: z.number().int().min(5).max(90),
    etapas: z.array(EtapaSchema).min(1),
    criterioDominio: z.object({
      /** Questões que contam para o domínio (devem estar em exercícios ou recuperação). */
      questoes: z.array(IdSchema).min(1),
      minPercentual: z.number().min(50).max(100),
    }),
  })
  .superRefine((aula, ctx) => {
    avisarIdsRepetidos(
      aula.etapas.map((e) => e.id),
      ['etapas'],
      ctx,
    );

    const questoes = aula.etapas.flatMap((e) => ('questoes' in e ? e.questoes : []));
    avisarIdsRepetidos(
      questoes.map((q) => q.id),
      ['etapas', '(questões)'],
      ctx,
    );

    const avaliaveis = new Set(
      aula.etapas
        .filter((e) => e.tipo === 'exercicio' || e.tipo === 'recuperacao')
        .flatMap((e) => e.questoes.map((q) => q.id)),
    );
    aula.criterioDominio.questoes.forEach((id, i) => {
      if (!avaliaveis.has(id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['criterioDominio', 'questoes', i],
          message: `"${id}" não é uma questão de exercício ou recuperação desta aula`,
        });
      }
    });

    if (aula.status === 'publicada') {
      for (const req of REQUISITOS_PUBLICACAO) {
        if (!aula.etapas.some(req.atende)) {
          ctx.addIssue({
            code: 'custom',
            path: ['etapas'],
            message: `aula publicada sem ${req.descricao}`,
          });
        }
      }
    }
  });

// ---------- Disciplina e módulos ----------

export const ModuloSchema = z.object({
  id: IdSchema,
  titulo: TextoSchema,
  descricao: TextoSchema,
  /** IDs das aulas, na ordem recomendada. */
  aulas: z.array(IdSchema).min(1),
});

export const DisciplinaSchema = z.object({
  id: IdSchema,
  escola: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']),
  titulo: TextoSchema,
  descricao: TextoSchema,
  modulos: z.array(ModuloSchema).min(1),
});

// ---------- Tipos derivados ----------

export type Codigo = z.infer<typeof CodigoSchema>;
export type Questao = z.infer<typeof QuestaoSchema>;
export type MultiplaEscolha = z.infer<typeof MultiplaEscolhaSchema>;
export type PreverSaida = z.infer<typeof PreverSaidaSchema>;
export type Ordenacao = z.infer<typeof OrdenacaoSchema>;
export type Associacao = z.infer<typeof AssociacaoSchema>;
export type Etapa = z.infer<typeof EtapaSchema>;
export type Aula = z.infer<typeof AulaSchema>;
export type Modulo = z.infer<typeof ModuloSchema>;
export type Disciplina = z.infer<typeof DisciplinaSchema>;
export type Modo = z.infer<typeof ModoSchema>;

/** Tipo de ENTRADA: o que se escreve nos arquivos de conteúdo (campos com default são opcionais). */
export type AulaEntrada = z.input<typeof AulaSchema>;
export type DisciplinaEntrada = z.input<typeof DisciplinaSchema>;

// ---------- Utilitário ----------

function avisarIdsRepetidos(ids: string[], path: (string | number)[], ctx: z.RefinementCtx) {
  const vistos = new Set<string>();
  for (const id of ids) {
    if (vistos.has(id)) ctx.addIssue({ code: 'custom', path, message: `id repetido: "${id}"` });
    vistos.add(id);
  }
}
