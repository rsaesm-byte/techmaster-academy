/**
 * O "carteiro" da sincronização: leva o progresso deste aparelho até o Gist
 * e traz o dos outros aparelhos, juntando os dois (ver mesclar.ts).
 *
 * Quando roda: ao abrir o app, ao voltar para a aba, a cada minuto e alguns
 * segundos depois de cada mudança no progresso.
 */
import { useSyncExternalStore } from 'react';
import type { ProgressRepository } from '@/persistence/ProgressRepository';
import { acharGist, ErroGitHub, gravarGist, lerGist, quemSou } from './gist';
import { assinatura, mesclar, type DocumentoSync } from './mesclar';

const CHAVE = 'tm:sync';

interface Config {
  token: string;
  usuario: string;
  gistId?: string | undefined;
  /** Última limpeza conhecida por este aparelho. */
  limpoEm?: string;
}

export type Estado =
  | { tipo: 'desligado' }
  | { tipo: 'sincronizando'; usuario: string }
  | { tipo: 'ok'; usuario: string; em: string }
  | { tipo: 'erro'; usuario: string; mensagem: string };

function lerConfig(): Config | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Config) : null;
  } catch {
    return null;
  }
}

function salvarConfig(c: Config | null) {
  try {
    if (c) localStorage.setItem(CHAVE, JSON.stringify(c));
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem localStorage (modo privado restrito): a sincronização só dura esta visita.
  }
}

// ---- Estado observável (para a interface) ----
let estado: Estado = lerConfig()
  ? { tipo: 'sincronizando', usuario: lerConfig()?.usuario ?? '' }
  : { tipo: 'desligado' };
let versaoDados = 0;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((o) => o());
function mudarEstado(novo: Estado) {
  estado = novo;
  avisar();
}
function inscrever(o: () => void) {
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}

export const useEstadoSync = () => useSyncExternalStore(inscrever, () => estado);
/** Muda quando chegam dados de outro aparelho: as telas devem reler o progresso. */
export const useVersaoDados = () => useSyncExternalStore(inscrever, () => versaoDados);

// ---- O ciclo de sincronização ----
let repo: ProgressRepository | null = null;
let rodando: Promise<void> | null = null;
let deNovo = false;

async function ciclo(config: Config, repo: ProgressRepository) {
  const local: DocumentoSync = config.limpoEm
    ? { backup: await repo.exportar(), limpoEm: config.limpoEm }
    : { backup: await repo.exportar() };

  config.gistId ??= await acharGist(config.token);
  const remoto = config.gistId ? await lerGist(config.token, config.gistId) : undefined;
  if (!remoto) config.gistId = undefined;

  const junto = remoto ? mesclar(local, remoto) : local;
  const sJunto = assinatura(junto);

  if (sJunto !== assinatura(local)) {
    await repo.importar(junto.backup);
    versaoDados++;
  }
  if (!remoto || sJunto !== assinatura(remoto)) {
    config.gistId = await gravarGist(config.token, config.gistId, junto);
  }
  if (junto.limpoEm) config.limpoEm = junto.limpoEm;
  salvarConfig(config);
}

/** Sincroniza agora. Se já estiver rodando, agenda mais uma rodada no fim. */
export function sincronizar(): Promise<void> {
  const config = lerConfig();
  const base = repo;
  if (!config || !base) return Promise.resolve();
  if (rodando) {
    deNovo = true;
    return rodando;
  }
  mudarEstado({ tipo: 'sincronizando', usuario: config.usuario });
  rodando = (async () => {
    try {
      await ciclo(config, base);
      if (lerConfig())
        mudarEstado({ tipo: 'ok', usuario: config.usuario, em: new Date().toISOString() });
    } catch (e) {
      const mensagem =
        e instanceof ErroGitHub
          ? e.message
          : 'Não foi possível sincronizar agora. Tentaremos de novo.';
      if (lerConfig()) mudarEstado({ tipo: 'erro', usuario: config.usuario, mensagem });
    } finally {
      rodando = null;
      if (deNovo) {
        deNovo = false;
        void sincronizar();
      }
    }
  })();
  return rodando;
}

let espera: ReturnType<typeof setTimeout> | undefined;
/** Chamado depois de cada gravação: junta várias mudanças seguidas numa sincronização só. */
export function agendar() {
  if (!lerConfig()) return;
  clearTimeout(espera);
  espera = setTimeout(() => void sincronizar(), 3000);
}

/** Liga o token: confere no GitHub, acha (ou cria) o Gist e sincroniza. */
export async function conectar(token: string): Promise<void> {
  const limpo = token.trim();
  const usuario = await quemSou(limpo);
  salvarConfig({ token: limpo, usuario });
  await sincronizar();
  if (estado.tipo === 'erro') throw new Error(estado.mensagem);
}

/** Esquece o token neste aparelho. O progresso continua aqui e no Gist. */
export function desconectar() {
  salvarConfig(null);
  mudarEstado({ tipo: 'desligado' });
}

/** Ao apagar tudo com a sincronização ligada, os outros aparelhos também apagam. */
export function marcarLimpeza() {
  const config = lerConfig();
  if (!config) return;
  config.limpoEm = new Date().toISOString();
  salvarConfig(config);
  void sincronizar();
}

/** Liga o sincronizador ao repositório do app (uma vez, ao iniciar). */
export function iniciarSincronizacao(repositorio: ProgressRepository) {
  if (repo) return;
  repo = repositorio;
  void sincronizar();
  setInterval(() => void sincronizar(), 60_000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void sincronizar();
  });
  window.addEventListener('online', () => void sincronizar());
}

/**
 * Embrulha o repositório: toda gravação agenda uma sincronização.
 * As telas continuam usando a mesma interface, sem saber que existe nuvem.
 */
export function comSincronizacao(base: ProgressRepository): ProgressRepository {
  const depois =
    <A extends unknown[], R>(f: (...a: A) => Promise<R>) =>
    async (...a: A) => {
      const r = await f(...a);
      agendar();
      return r;
    };
  return {
    obterProgresso: (id) => base.obterProgresso(id),
    listarProgressos: () => base.listarProgressos(),
    listarTentativas: (id) => base.listarTentativas(id),
    listarCartoes: () => base.listarCartoes(),
    exportar: () => base.exportar(),
    salvarProgresso: depois((p) => base.salvarProgresso(p)),
    registrarTentativa: depois((t) => base.registrarTentativa(t)),
    salvarCartoes: depois((c) => base.salvarCartoes(c)),
    importar: depois((b) => base.importar(b)),
    apagarTudo: async () => {
      await base.apagarTudo();
      marcarLimpeza();
    },
  };
}
