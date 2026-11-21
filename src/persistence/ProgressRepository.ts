import type { Backup, CartaoRevisao, ProgressoAula, Tentativa } from '@/domain/progresso';

/**
 * Tudo que a aplicação pode fazer com o progresso do aluno.
 *
 * As telas só conhecem esta interface, nunca o IndexedDB. Analogia: é a tomada na
 * parede — o aparelho não sabe se a energia vem da rua ou de um gerador. Hoje a
 * implementação é o IndexedDB do navegador; no futuro pode ser uma API, e nenhuma
 * tela precisa mudar.
 */
export interface ProgressRepository {
  obterProgresso(aulaId: string): Promise<ProgressoAula | undefined>;
  listarProgressos(): Promise<ProgressoAula[]>;
  salvarProgresso(progresso: ProgressoAula): Promise<void>;

  registrarTentativa(tentativa: Tentativa): Promise<void>;
  listarTentativas(aulaId: string): Promise<Tentativa[]>;

  listarCartoes(): Promise<CartaoRevisao[]>;
  /** Grava vários cartões de uma vez (cria ou atualiza). */
  salvarCartoes(cartoes: CartaoRevisao[]): Promise<void>;

  /** Cópia de tudo, para o aluno guardar ou levar para outro aparelho. */
  exportar(): Promise<Backup>;
  /** Substitui todo o progresso pelo do backup. Rejeita arquivos inválidos sem mexer em nada. */
  importar(backup: unknown): Promise<void>;
  apagarTudo(): Promise<void>;
}
