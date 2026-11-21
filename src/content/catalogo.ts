import type { z } from 'zod';
import {
  AulaSchema,
  DisciplinaSchema,
  type Aula,
  type Disciplina,
  type Modulo,
} from '@/domain/conteudo';

export interface Catalogo {
  disciplinas: Disciplina[];
  aulas: ReadonlyMap<string, Aula>;
  /** Para cada aula: a disciplina e o módulo a que pertence, e a posição nele. */
  localizar(aulaId: string): { disciplina: Disciplina; modulo: Modulo; indice: number } | undefined;
}

export class ConteudoInvalidoError extends Error {
  constructor(public readonly problemas: string[]) {
    super(`Conteúdo inválido (${problemas.length} problema(s)):\n- ${problemas.join('\n- ')}`);
    this.name = 'ConteudoInvalidoError';
  }
}

function descrever(origem: string, erro: z.ZodError): string[] {
  return erro.issues.map((i) => `${origem} › ${i.path.join('.') || '(raiz)'}: ${i.message}`);
}

/**
 * Valida todo o conteúdo e confere as ligações entre ele:
 * módulos apontam para aulas que existem, pré-requisitos existem,
 * cada aula está em exatamente um módulo.
 */
export function montarCatalogo(disciplinasEntrada: unknown[], aulasEntrada: unknown[]): Catalogo {
  const problemas: string[] = [];
  const aulas = new Map<string, Aula>();
  const disciplinas: Disciplina[] = [];

  for (const [i, bruta] of aulasEntrada.entries()) {
    const r = AulaSchema.safeParse(bruta);
    const origem = (bruta as { id?: string } | null)?.id ?? `aula #${i}`;
    if (!r.success) problemas.push(...descrever(origem, r.error));
    else if (aulas.has(r.data.id)) problemas.push(`${r.data.id}: id de aula repetido`);
    else aulas.set(r.data.id, r.data);
  }

  for (const [i, bruta] of disciplinasEntrada.entries()) {
    const r = DisciplinaSchema.safeParse(bruta);
    const origem = (bruta as { id?: string } | null)?.id ?? `disciplina #${i}`;
    if (!r.success) problemas.push(...descrever(origem, r.error));
    else disciplinas.push(r.data);
  }

  const onde = new Map<string, { disciplina: Disciplina; modulo: Modulo; indice: number }>();
  for (const disciplina of disciplinas) {
    for (const modulo of disciplina.modulos) {
      if (!modulo.id.startsWith(`${disciplina.id}.`)) {
        problemas.push(`${modulo.id}: módulo deveria começar com "${disciplina.id}."`);
      }
      modulo.aulas.forEach((aulaId, indice) => {
        if (!aulas.has(aulaId)) problemas.push(`${modulo.id}: aula "${aulaId}" não existe`);
        if (!aulaId.startsWith(`${modulo.id}.`)) {
          problemas.push(`${aulaId}: aula deveria começar com "${modulo.id}."`);
        }
        if (onde.has(aulaId)) problemas.push(`${aulaId}: aula listada em mais de um módulo`);
        onde.set(aulaId, { disciplina, modulo, indice });
      });
    }
  }

  for (const aula of aulas.values()) {
    if (!onde.has(aula.id)) problemas.push(`${aula.id}: aula não está em nenhum módulo`);
    for (const pre of aula.preRequisitos) {
      if (!aulas.has(pre)) problemas.push(`${aula.id}: pré-requisito "${pre}" não existe`);
    }
  }

  if (problemas.length > 0) throw new ConteudoInvalidoError(problemas);

  return { disciplinas, aulas, localizar: (id) => onde.get(id) };
}
