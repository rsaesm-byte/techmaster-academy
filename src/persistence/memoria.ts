import {
  BackupSchema,
  FORMATO_BACKUP,
  type ProgressoAula,
  type Tentativa,
} from '@/domain/progresso';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

/** Implementação em memória: some ao recarregar. Usada nos testes. */
export class MemoriaProgressRepository implements ProgressRepository {
  private progressos = new Map<string, ProgressoAula>();
  private tentativas: Tentativa[] = [];

  async obterProgresso(aulaId: string) {
    const p = this.progressos.get(aulaId);
    return p && structuredClone(p);
  }

  async listarProgressos() {
    return [...this.progressos.values()].map((p) => structuredClone(p));
  }

  async salvarProgresso(progresso: ProgressoAula) {
    this.progressos.set(progresso.aulaId, structuredClone(progresso));
  }

  async registrarTentativa(tentativa: Tentativa) {
    this.tentativas.push(structuredClone(tentativa));
  }

  async listarTentativas(aulaId: string) {
    return this.tentativas
      .filter((t) => t.aulaId === aulaId)
      .sort((a, b) => a.em.localeCompare(b.em))
      .map((t) => structuredClone(t));
  }

  async exportar() {
    return {
      formato: FORMATO_BACKUP,
      schemaVersion: 1 as const,
      exportadoEm: new Date().toISOString(),
      progressos: await this.listarProgressos(),
      tentativas: this.tentativas.map((t) => structuredClone(t)),
    };
  }

  async importar(backup: unknown) {
    const dados = BackupSchema.parse(backup);
    this.progressos = new Map(dados.progressos.map((p) => [p.aulaId, p]));
    this.tentativas = [...dados.tentativas];
  }

  async apagarTudo() {
    this.progressos.clear();
    this.tentativas = [];
  }
}
