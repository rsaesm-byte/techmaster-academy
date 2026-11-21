import { useCallback, useState } from 'react';
import { ModoSchema, type Modo } from '@/domain/conteudo';

const CHAVE = 'tm:modo';

function ler(): Modo {
  try {
    const r = ModoSchema.safeParse(localStorage.getItem(CHAVE));
    return r.success ? r.data : 'guiado';
  } catch {
    return 'guiado';
  }
}

/** Modo de apresentação (Essencial, Guiado, Técnico). Trocar o modo nunca mexe no progresso. */
export function useModo() {
  const [modo, setModo] = useState<Modo>(ler);
  const escolher = useCallback((m: Modo) => {
    try {
      localStorage.setItem(CHAVE, m);
    } catch {
      /* sem armazenamento: vale só nesta sessão */
    }
    setModo(m);
  }, []);
  return { modo, escolher };
}

export const MODOS: { valor: Modo; rotulo: string }[] = [
  { valor: 'essencial', rotulo: 'Essencial' },
  { valor: 'guiado', rotulo: 'Guiado' },
  { valor: 'tecnico', rotulo: 'Técnico' },
];
