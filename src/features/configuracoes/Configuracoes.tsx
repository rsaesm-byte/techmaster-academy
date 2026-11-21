import { useTema } from '@/app/ThemeProvider';
import type { PreferenciaTema } from '@/app/theme';
import { Leitura } from '@/features/configuracoes/Leitura';
import { SeusDados } from '@/features/configuracoes/SeusDados';

const opcoes: { valor: PreferenciaTema; rotulo: string; dica: string }[] = [
  { valor: 'sistema', rotulo: 'Automático', dica: 'Segue o tema do seu aparelho' },
  { valor: 'claro', rotulo: 'Claro', dica: 'Fundo claro, texto escuro' },
  { valor: 'escuro', rotulo: 'Escuro', dica: 'Fundo escuro, melhor à noite' },
];

export function Configuracoes() {
  const { preferencia, escolher } = useTema();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <fieldset className="rounded-xl border border-border bg-surface p-6">
        <legend className="px-1 text-lg font-semibold">Tema</legend>
        <div className="mt-2 flex flex-col gap-2">
          {opcoes.map((op) => (
            <label
              key={op.valor}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-2"
            >
              <input
                type="radio"
                name="tema"
                value={op.valor}
                checked={preferencia === op.valor}
                onChange={() => escolher(op.valor)}
                aria-labelledby={`tema-${op.valor}`}
                aria-describedby={`tema-${op.valor}-dica`}
                className="size-4 accent-[var(--tm-primary)]"
              />
              <span>
                <span id={`tema-${op.valor}`} className="block font-medium">
                  {op.rotulo}
                </span>
                <span id={`tema-${op.valor}-dica`} className="block text-sm text-muted">
                  {op.dica}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Leitura />
      <SeusDados />
      <p className="text-sm text-muted">
        Nenhum dado é enviado para servidores: tema e progresso ficam só neste navegador.
      </p>
    </div>
  );
}
