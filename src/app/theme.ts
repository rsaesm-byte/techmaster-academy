/**
 * Tema da interface. Lógica pura (sem React) para ser fácil de testar.
 * A preferência fica no localStorage por enquanto; na próxima etapa vai para o
 * IndexedDB junto com as outras preferências do aluno.
 */
export type PreferenciaTema = 'claro' | 'escuro' | 'sistema';

export const CHAVE_TEMA = 'tm:tema';

const VALIDOS: readonly PreferenciaTema[] = ['claro', 'escuro', 'sistema'];

export function ehPreferenciaTema(valor: unknown): valor is PreferenciaTema {
  return typeof valor === 'string' && (VALIDOS as readonly string[]).includes(valor);
}

/** Decide se o tema escuro deve ficar ativo. */
export function deveUsarEscuro(pref: PreferenciaTema, sistemaEscuro: boolean): boolean {
  if (pref === 'escuro') return true;
  if (pref === 'claro') return false;
  return sistemaEscuro;
}

export function lerPreferencia(storage: Pick<Storage, 'getItem'> | undefined): PreferenciaTema {
  try {
    const valor = storage?.getItem(CHAVE_TEMA);
    return ehPreferenciaTema(valor) ? valor : 'sistema';
  } catch {
    return 'sistema';
  }
}

export function salvarPreferencia(
  storage: Pick<Storage, 'setItem'> | undefined,
  pref: PreferenciaTema,
): void {
  try {
    storage?.setItem(CHAVE_TEMA, pref);
  } catch {
    /* armazenamento indisponível (modo privado, cota): a escolha vale só nesta sessão */
  }
}
