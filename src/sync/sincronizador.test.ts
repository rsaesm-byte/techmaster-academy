import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Tentativa } from '@/domain/progresso';
import { MemoriaProgressRepository } from '@/persistence/memoria';

/** Um "GitHub" de mentira, em memória, que responde como a API de Gists. */
function githubFalso() {
  const gists = new Map<string, Record<string, { content: string }>>();
  let seq = 0;
  const responder = (corpo: unknown, status = 200) =>
    new Response(JSON.stringify(corpo), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  const fetchFalso = vi.fn(async (url: string, opcoes: RequestInit = {}) => {
    const auth = new Headers(opcoes.headers).get('Authorization');
    if (auth !== 'Bearer ghp_certo') return responder({}, 401);
    const caminho = new URL(url).pathname;
    const metodo = opcoes.method ?? 'GET';
    if (caminho === '/user') return responder({ login: 'rick' });
    if (caminho === '/gists' && metodo === 'GET')
      return responder([...gists].map(([id, files]) => ({ id, files })));
    if (caminho === '/gists' && metodo === 'POST') {
      const id = `g${++seq}`;
      gists.set(id, JSON.parse(String(opcoes.body)).files);
      return responder({ id, files: gists.get(id) }, 201);
    }
    const id = caminho.split('/')[2] ?? '';
    if (!gists.has(id)) return responder({}, 404);
    if (metodo === 'PATCH')
      gists.set(id, { ...gists.get(id), ...JSON.parse(String(opcoes.body)).files });
    return responder({ id, files: gists.get(id) });
  });
  return { gists, fetchFalso };
}

const tent = (id: string): Tentativa => ({
  id,
  aulaId: 'logica.m01.a01',
  questaoId: 'q',
  correta: true,
  resposta: 'x',
  pistasUsadas: 0,
  respostaRevelada: false,
  tempoMs: 0,
  em: new Date().toISOString(),
});

/** Cada "aparelho" é uma cópia nova do módulo, com seu próprio banco. */
async function aparelho() {
  vi.resetModules();
  const sync = await import('./sincronizador');
  const repo = new MemoriaProgressRepository();
  sync.iniciarSincronizacao(repo);
  return { sync, repo };
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('sincronização via Gist', () => {
  it('token errado não conecta e explica o motivo', async () => {
    const { fetchFalso } = githubFalso();
    vi.stubGlobal('fetch', fetchFalso);
    const { sync } = await aparelho();
    await expect(sync.conectar('ghp_errado')).rejects.toThrow(/recusou o token/);
  });

  it('computador e celular terminam com o progresso dos dois', async () => {
    const { gists, fetchFalso } = githubFalso();
    vi.stubGlobal('fetch', fetchFalso);

    const pc = await aparelho();
    await pc.repo.registrarTentativa(tent('do-computador'));
    await pc.sync.conectar('ghp_certo');
    expect(gists.size).toBe(1);

    // O celular usa o mesmo token: acha o MESMO Gist em vez de criar outro.
    localStorage.clear();
    const celular = await aparelho();
    await celular.repo.registrarTentativa(tent('do-celular'));
    await celular.sync.conectar('ghp_certo');
    expect(gists.size).toBe(1);
    const ids = (await celular.repo.exportar()).tentativas.map((t) => t.id).sort();
    expect(ids).toEqual(['do-celular', 'do-computador']);

    // De volta ao computador: a próxima sincronização traz o que o celular fez.
    await pc.sync.sincronizar();
    expect((await pc.repo.exportar()).tentativas).toHaveLength(2);
  });
});
