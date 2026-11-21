import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  deveUsarEscuro,
  lerPreferencia,
  salvarPreferencia,
  type PreferenciaTema,
} from '@/app/theme';

interface ValorTema {
  preferencia: PreferenciaTema;
  escolher: (pref: PreferenciaTema) => void;
}

const TemaContext = createContext<ValorTema | null>(null);

function storageSeguro(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** Guarda a preferência de tema e aplica a classe "dark" no <html>. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preferencia, setPreferencia] = useState<PreferenciaTema>(() =>
    lerPreferencia(storageSeguro()),
  );

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const aplicar = () =>
      document.documentElement.classList.toggle(
        'dark',
        deveUsarEscuro(preferencia, mq?.matches ?? false),
      );
    aplicar();
    mq?.addEventListener('change', aplicar);
    return () => mq?.removeEventListener('change', aplicar);
  }, [preferencia]);

  const escolher = useCallback((pref: PreferenciaTema) => {
    salvarPreferencia(storageSeguro(), pref);
    setPreferencia(pref);
  }, []);

  const valor = useMemo(() => ({ preferencia, escolher }), [preferencia, escolher]);
  return <TemaContext value={valor}>{children}</TemaContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema(): ValorTema {
  const valor = use(TemaContext);
  if (!valor) throw new Error('useTema precisa estar dentro de <ThemeProvider>');
  return valor;
}
