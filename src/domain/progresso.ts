/**
 * CONTRATOS DE PROGRESSO — o "caderno" do aluno.
 * O conteúdo é o livro (igual para todos); o progresso aponta para ele só por IDs,
 * então corrigir uma aula não apaga o histórico de ninguém.
 */
import { z } from 'zod';

const DataIso = z.iso.datetime();

export const StatusAulaSchema = z.enum(['em-andamento', 'concluida', 'dominada']);

export const ProgressoAulaSchema = z.object({
  aulaId: z.string().min(1),
  /** Versão da aula quando o progresso foi salvo (para migrar se a aula mudar). */
  aulaVersao: z.number().int().positive(),
  /** Índice da etapa em que o aluno parou. */
  etapaAtual: z.number().int().min(0),
  status: StatusAulaSchema,
  iniciadaEm: DataIso,
  atualizadaEm: DataIso,
});

export const TentativaSchema = z.object({
  id: z.string().min(1),
  aulaId: z.string().min(1),
  questaoId: z.string().min(1),
  correta: z.boolean(),
  /** A resposta dada, para mostrar o histórico. Nunca contém dados pessoais. */
  resposta: z.unknown(),
  pistasUsadas: z.number().int().min(0),
  /** Se o aluno pediu para ver a resposta antes de acertar. Não conta para domínio. */
  respostaRevelada: z.boolean(),
  /** Registrado, mas NUNCA usado para calcular domínio: tempo gasto não é aprendizado. */
  tempoMs: z.number().int().min(0),
  em: DataIso,
});

const DataLocal = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Um cartão na fila de revisão espaçada: um flashcard ou uma questão de uma aula. */
export const CartaoRevisaoSchema = z.object({
  /** "fc:<id do flashcard>" ou "q:<aula>#<questão>". */
  id: z.string().min(1),
  aulaId: z.string().min(1),
  origem: z.enum(['flashcard', 'questao']),
  /** Id do flashcard ou da questão dentro da aula. */
  itemId: z.string().min(1),
  facilidade: z.number().min(1.3),
  repeticoes: z.number().int().min(0),
  intervaloDias: z.number().int().min(0),
  proximaRevisao: DataLocal,
  historico: z
    .array(z.object({ em: DataIso, nota: z.enum(['errei', 'dificil', 'bom', 'facil']) }))
    .default([]),
});

export const FORMATO_BACKUP = 'techmaster-progresso' as const;

export const BackupSchema = z.object({
  formato: z.literal(FORMATO_BACKUP),
  schemaVersion: z.literal(1),
  exportadoEm: DataIso,
  progressos: z.array(ProgressoAulaSchema),
  tentativas: z.array(TentativaSchema),
  cartoes: z.array(CartaoRevisaoSchema).default([]),
});

export type StatusAula = z.infer<typeof StatusAulaSchema>;
export type ProgressoAula = z.infer<typeof ProgressoAulaSchema>;
export type Tentativa = z.infer<typeof TentativaSchema>;
export type Backup = z.infer<typeof BackupSchema>;
export type CartaoRevisao = z.infer<typeof CartaoRevisaoSchema>;
