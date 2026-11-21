import { z } from 'zod';
import { IdSchema, TextoSchema } from '@/domain/conteudo';

export const TermoSchema = z.object({
  id: IdSchema,
  termo: TextoSchema,
  /** Definição em linguagem simples. */
  simples: TextoSchema,
  /** Definição técnica, para o modo Técnico. */
  tecnico: TextoSchema,
  exemplo: z.string().optional(),
  /** Aulas onde o termo é ensinado. */
  aulas: z.array(IdSchema).min(1),
});

export type Termo = z.infer<typeof TermoSchema>;
export type TermoEntrada = z.input<typeof TermoSchema>;
