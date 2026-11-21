import {
  BackupSchema,
  FORMATO_BACKUP,
  type CartaoRevisao,
  type ProgressoAula,
  type Tentativa,
} from '@/domain/progresso';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

/** Implementação em memória: some ao recarregar. Usada nos testes. */
export class MemoriaProgressRepository implements ProgressRepository {
  private progressos = new Map<string, ProgressoAula>();
  private tentativas: Tentativa[] = [];
  private cartoes = new Map<string, CartaoRevisao>();

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

  async listarCartoes() {
    return [...this.cartoes.values()].map((c) => structuredClone(c));
  }

  async salvarCartoes(cartoes: CartaoRevisao[]) {
    for (const c of cartoes) this.cartoes.set(c.id, structuredClone(c));
  }

  async exportar() {
    return {
      formato: FORMATO_BACKUP,
      schemaVersion: 1 as const,
      exportadoEm: new Date().toISOString(),
      progressos: await this.listarProgressos(),
      tentativas: this.tentativas.map((t) => structuredClone(t)),
      cartoes: await this.listarCartoes(),
    };
  }

  async importar(backup: unknown) {
    const dados = BackupSchema.parse(backup);
    this.progressos = new Map(dados.progressos.map((p) => [p.aulaId, p]));
    this.tentativas = [...dados.tentativas];
    this.cartoes = new Map(dados.cartoes.map((c) => [c.id, c]));
  }

  async apagarTudo() {
    this.progressos.clear();
    this.tentativas = [];
    this.cartoes.clear();
  }
}
