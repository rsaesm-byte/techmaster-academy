import { Dexie, type EntityTable } from 'dexie';
import {
  BackupSchema,
  FORMATO_BACKUP,
  type CartaoRevisao,
  type ProgressoAula,
  type Tentativa,
} from '@/domain/progresso';
import type { ProgressRepository } from '@/persistence/ProgressRepository';

/**
 * O banco no navegador. Cada `version(n)` descreve as tabelas e índices;
 * quando o formato mudar, criamos `version(n + 1)` com um `.upgrade()` que migra os dados.
 */
class BancoTechMaster extends Dexie {
  progressos!: EntityTable<ProgressoAula, 'aulaId'>;
  tentativas!: EntityTable<Tentativa, 'id'>;
  cartoes!: EntityTable<CartaoRevisao, 'id'>;

  constructor(nome: string) {
    super(nome);
    this.version(1).stores({
      progressos: 'aulaId, atualizadaEm',
      tentativas: 'id, aulaId, em',
    });
    // Versão 2: fila de revisão espaçada. Bancos antigos ganham a tabela vazia, sem perder nada.
    this.version(2).stores({
      cartoes: 'id, aulaId, proximaRevisao',
    });
  }
}

export class DexieProgressRepository implements ProgressRepository {
  private readonly db: BancoTechMaster;

  constructor(nomeBanco = 'techmaster') {
    this.db = new BancoTechMaster(nomeBanco);
  }

  obterProgresso(aulaId: string) {
    return this.db.progressos.get(aulaId);
  }

  listarProgressos() {
    return this.db.progressos.orderBy('atualizadaEm').reverse().toArray();
  }

  async salvarProgresso(progresso: ProgressoAula) {
    await this.db.progressos.put(progresso);
  }

  async registrarTentativa(tentativa: Tentativa) {
    await this.db.tentativas.put(tentativa);
  }

  async listarTentativas(aulaId: string) {
    const lista = await this.db.tentativas.where('aulaId').equals(aulaId).toArray();
    return lista.sort((a, b) => a.em.localeCompare(b.em));
  }

  listarCartoes() {
    return this.db.cartoes.toArray();
  }

  async salvarCartoes(cartoes: CartaoRevisao[]) {
    await this.db.cartoes.bulkPut(cartoes);
  }

  async exportar() {
    return {
      formato: FORMATO_BACKUP,
      schemaVersion: 1 as const,
      exportadoEm: new Date().toISOString(),
      progressos: await this.db.progressos.toArray(),
      tentativas: await this.db.tentativas.toArray(),
      cartoes: await this.db.cartoes.toArray(),
    };
  }

  async importar(backup: unknown) {
    // Valida ANTES de abrir a transação: arquivo inválido não apaga nada.
    const dados = BackupSchema.parse(backup);
    await this.db.transaction(
      'rw',
      [this.db.progressos, this.db.tentativas, this.db.cartoes],
      async () => {
        await this.db.progressos.clear();
        await this.db.tentativas.clear();
        await this.db.cartoes.clear();
        await this.db.progressos.bulkPut(dados.progressos);
        await this.db.tentativas.bulkPut(dados.tentativas);
        await this.db.cartoes.bulkPut(dados.cartoes);
      },
    );
  }

  async apagarTudo() {
    await this.db.transaction(
      'rw',
      [this.db.progressos, this.db.tentativas, this.db.cartoes],
      async () => {
        await this.db.progressos.clear();
        await this.db.tentativas.clear();
        await this.db.cartoes.clear();
      },
    );
  }

  fechar() {
    this.db.close();
  }
}

/** Pede ao navegador para não apagar o banco quando faltar espaço. O navegador pode recusar. */
export async function solicitarArmazenamentoPersistente(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
