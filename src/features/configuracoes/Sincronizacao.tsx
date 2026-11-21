import { useState, type FormEvent } from 'react';
import { conectar, desconectar, sincronizar, useEstadoSync } from '@/sync/sincronizador';

const LINK_TOKEN =
  'https://github.com/settings/tokens/new?scopes=gist&description=TechMaster%20Academy';

const botao =
  'min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-50';

function quando(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Sincronizar o progresso entre aparelhos usando um Gist privado do aluno. */
export function Sincronizacao() {
  const estado = useEstadoSync();
  const [token, setToken] = useState('');
  const [conectando, setConectando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setConectando(true);
    setErro('');
    try {
      await conectar(token);
      setToken('');
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível conectar.');
      desconectar();
    } finally {
      setConectando(false);
    }
  }

  return (
    <section
      id="sincronizar"
      aria-labelledby="titulo-sync"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h2 id="titulo-sync" className="text-lg font-semibold">
        Sincronizar entre aparelhos
      </h2>

      {estado.tipo === 'desligado' ? (
        <>
          <p className="mt-1 text-sm text-muted">
            Use o mesmo progresso no computador e no celular. Ele fica guardado num Gist{' '}
            <strong>privado</strong> da sua conta do GitHub — nenhum servidor nosso vê seus dados.
          </p>
          <ol className="mt-4 flex list-decimal flex-col gap-1.5 pl-5 text-[15px]">
            <li>
              Abra{' '}
              <a
                href={LINK_TOKEN}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                a página de criar token do GitHub
              </a>{' '}
              (já vem com a caixa <strong>gist</strong> marcada).
            </li>
            <li>
              Em <em>Expiration</em>, escolha a validade. Deixe marcada <strong>só</strong> a caixa
              gist e clique em <em>Generate token</em>.
            </li>
            <li>
              Copie o código que começa com <code className="font-mono">ghp_</code> e cole abaixo.
            </li>
            <li>No outro aparelho, faça o mesmo com o mesmo token (ou gere outro).</li>
          </ol>
          <form onSubmit={(e) => void enviar(e)} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
              Token do GitHub
              <input
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="min-h-11 rounded-lg border border-border bg-surface px-3 font-mono"
              />
            </label>
            <button
              type="submit"
              disabled={conectando || !token.trim()}
              className="min-h-11 self-end rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-50"
            >
              {conectando ? 'Conectando…' : 'Conectar'}
            </button>
          </form>
          {erro && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {erro}
            </p>
          )}
          <p className="mt-4 text-xs text-muted">
            O token fica salvo só neste navegador. Trate-o como uma senha: não envie por mensagem e
            não use em computador público. Se vazar, apague-o no GitHub e gere outro.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            Conectado como <strong className="text-text">{estado.usuario}</strong>. O progresso é
            sincronizado ao abrir o app, ao voltar para a aba e logo depois de cada mudança.
          </p>
          <p role="status" className="mt-4 flex items-center gap-2 text-[15px]">
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full ${
                estado.tipo === 'ok'
                  ? 'bg-success'
                  : estado.tipo === 'erro'
                    ? 'bg-danger'
                    : 'animate-pulse bg-primary'
              }`}
            />
            {estado.tipo === 'ok' && `Sincronizado às ${quando(estado.em)}`}
            {estado.tipo === 'sincronizando' && 'Sincronizando…'}
            {estado.tipo === 'erro' && estado.mensagem}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={botao}
              disabled={estado.tipo === 'sincronizando'}
              onClick={() => void sincronizar()}
            >
              Sincronizar agora
            </button>
            <button type="button" className={botao} onClick={desconectar}>
              Desconectar este aparelho
            </button>
          </div>
        </>
      )}
    </section>
  );
}
