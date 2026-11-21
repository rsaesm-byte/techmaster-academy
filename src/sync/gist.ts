/**
 * Conversa com a API do GitHub para guardar o progresso num Gist PRIVADO
 * da conta do próprio aluno. O token precisa só do escopo "gist".
 */
import { z } from 'zod';
import { BackupSchema } from '@/domain/progresso';
import type { DocumentoSync } from './mesclar';

export const ARQUIVO = 'techmaster-progresso.json';
export const DESCRICAO = 'TechMaster Academy: meu progresso (não apague)';
const API = 'https://api.github.com';

export class ErroGitHub extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

const DocumentoSchema = BackupSchema.extend({ limpoEm: z.iso.datetime().optional() });

const ArquivoGistSchema = z.object({
  content: z.string().optional(),
  truncated: z.boolean().optional(),
  raw_url: z.string().optional(),
});
const GistSchema = z.object({
  id: z.string(),
  description: z.string().nullable().optional(),
  files: z.record(z.string(), ArquivoGistSchema.nullable()),
});

async function chamar(token: string, caminho: string, opcoes: RequestInit = {}) {
  let r: Response;
  try {
    r = await fetch(API + caminho, {
      ...opcoes,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  } catch {
    throw new ErroGitHub(0, 'Sem conexão com o GitHub. Tentaremos de novo em instantes.');
  }
  if (r.status === 401)
    throw new ErroGitHub(401, 'O GitHub recusou o token. Ele pode ter expirado ou sido apagado.');
  if (r.status === 403 || r.status === 404) {
    // 404 em /gists com token válido = token sem o escopo "gist".
    throw new ErroGitHub(r.status, 'O token não tem permissão de Gist (marque só a caixa "gist").');
  }
  if (!r.ok) throw new ErroGitHub(r.status, `O GitHub respondeu com erro ${r.status}.`);
  return r;
}

/** Confere o token e devolve o nome de usuário dono dele. */
export async function quemSou(token: string): Promise<string> {
  const r = await chamar(token, '/user');
  const { login } = z.object({ login: z.string() }).parse(await r.json());
  return login;
}

/** Procura o Gist da TechMaster nesta conta (o outro aparelho pode já ter criado). */
export async function acharGist(token: string): Promise<string | undefined> {
  for (let pagina = 1; pagina <= 10; pagina++) {
    const r = await chamar(token, `/gists?per_page=100&page=${pagina}`);
    const lista = z.array(GistSchema).parse(await r.json());
    const achado = lista.find((g) => ARQUIVO in g.files);
    if (achado) return achado.id;
    if (lista.length < 100) return undefined;
  }
  return undefined;
}

/** Lê o documento salvo. Devolve undefined se o Gist sumiu (foi apagado). */
export async function lerGist(token: string, id: string): Promise<DocumentoSync | undefined> {
  let r: Response;
  try {
    r = await chamar(token, `/gists/${id}`);
  } catch (e) {
    if (e instanceof ErroGitHub && e.status === 404) return undefined;
    throw e;
  }
  const gist = GistSchema.parse(await r.json());
  const arquivo = gist.files[ARQUIVO];
  if (!arquivo) return undefined;
  let texto = arquivo.content ?? '';
  if (arquivo.truncated && arquivo.raw_url) texto = await (await fetch(arquivo.raw_url)).text();
  const { limpoEm, ...backup } = DocumentoSchema.parse(JSON.parse(texto));
  return limpoEm ? { backup, limpoEm } : { backup };
}

/** Grava o documento. Sem id, cria um Gist privado novo e devolve o id dele. */
export async function gravarGist(token: string, id: string | undefined, doc: DocumentoSync) {
  const files = { [ARQUIVO]: { content: JSON.stringify({ ...doc.backup, limpoEm: doc.limpoEm }) } };
  if (id) {
    await chamar(token, `/gists/${id}`, { method: 'PATCH', body: JSON.stringify({ files }) });
    return id;
  }
  const r = await chamar(token, '/gists', {
    method: 'POST',
    body: JSON.stringify({ description: DESCRICAO, public: false, files }),
  });
  return GistSchema.parse(await r.json()).id;
}
