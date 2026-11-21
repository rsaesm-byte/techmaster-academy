import { useRef, useState, type ChangeEvent } from 'react';
import { useRepositorio } from '@/persistence/RepositorioProvider';

type Aviso = { tipo: 'ok' | 'erro'; texto: string } | null;

/** Exportar, importar e apagar o progresso — o aluno é dono dos próprios dados (LGPD). */
export function SeusDados() {
  const repo = useRepositorio();
  const [aviso, setAviso] = useState<Aviso>(null);
  const [confirmando, setConfirmando] = useState(false);
  const arquivo = useRef<HTMLInputElement>(null);

  async function exportar() {
    const backup = await repo.exportar();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `techmaster-progresso-${backup.exportadoEm.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setAviso({ tipo: 'ok', texto: 'Arquivo de progresso baixado.' });
  }

  async function importar(evento: ChangeEvent<HTMLInputElement>) {
    const escolhido = evento.target.files?.[0];
    evento.target.value = '';
    if (!escolhido) return;
    try {
      await repo.importar(JSON.parse(await escolhido.text()));
      setAviso({ tipo: 'ok', texto: 'Progresso importado com sucesso.' });
    } catch {
      setAviso({
        tipo: 'erro',
        texto: 'Esse arquivo não é um backup válido da TechMaster. Nada foi alterado.',
      });
    }
  }

  async function apagar() {
    await repo.apagarTudo();
    setConfirmando(false);
    setAviso({
      tipo: 'ok',
      texto:
        'Todo o progresso foi apagado (e dos outros aparelhos, se a sincronização estiver ligada).',
    });
  }

  const botao =
    'min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-50';

  return (
    <section
      aria-labelledby="seus-dados"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h2 id="seus-dados" className="text-lg font-semibold">
        Seus dados
      </h2>
      <p className="mt-1 text-sm text-muted">
        Seu progresso fica neste navegador (e no seu Gist, se a sincronização estiver ligada).
        Exporte para guardar uma cópia em arquivo.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botao} onClick={exportar}>
          Exportar progresso
        </button>
        <button type="button" className={botao} onClick={() => arquivo.current?.click()}>
          Importar progresso
        </button>
        <input
          ref={arquivo}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Arquivo de progresso para importar"
          onChange={importar}
        />
        {!confirmando ? (
          <button
            type="button"
            className={`${botao} text-danger`}
            onClick={() => setConfirmando(true)}
          >
            Apagar todo o progresso
          </button>
        ) : (
          <div
            role="group"
            aria-label="Confirmar exclusão"
            className="flex w-full flex-wrap items-center gap-3 rounded-lg bg-danger-soft p-3"
          >
            <span className="text-sm">Isso não pode ser desfeito. Apagar mesmo?</span>
            <button
              type="button"
              className="min-h-11 rounded-lg bg-danger px-4 font-semibold text-bg"
              onClick={apagar}
            >
              Sim, apagar
            </button>
            <button type="button" className={botao} onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        )}
      </div>
      <p
        role="status"
        className={`mt-3 text-sm ${aviso?.tipo === 'erro' ? 'text-danger' : 'text-success'}`}
      >
        {aviso?.texto}
      </p>
    </section>
  );
}
