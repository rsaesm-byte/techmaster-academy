/**
 * PREFERÊNCIAS DE LEITURA E ACESSIBILIDADE — aplicadas como classes no <html>.
 * O arquivo public/theme-boot.js aplica as mesmas classes antes do React carregar.
 */
import { useCallback, useSyncExternalStore } from 'react';
import { z } from 'zod';

export const PreferenciasSchema = z.object({
  tamanhoTexto: z.enum(['normal', 'grande', 'muito-grande']).default('normal'),
  reduzirMovimento: z.boolean().default(false),
  densidade: z.enum(['confortavel', 'compacta']).default('confortavel'),
  modoFoco: z.boolean().default(false),
  /** Meta de dias de estudo por semana (painel). */
  metaDiasSemana: z.number().int().min(1).max(7).default(4),
  experiencia: z.enum(['nunca', 'pouco', 'programo']).optional(),
});

export type Preferencias = z.infer<typeof PreferenciasSchema>;

export const CHAVE_PREFERENCIAS = 'tm:prefs';

let cache: Preferencias | undefined;
const ouvintes = new Set<() => void>();

export function lerPreferencias(): Preferencias {
  if (cache) return cache;
  try {
    cache = PreferenciasSchema.parse(JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS) ?? '{}'));
  } catch {
    cache = PreferenciasSchema.parse({});
  }
  return cache;
}

export function aplicarNoDocumento(p: Preferencias) {
  const c = document.documentElement.classList;
  c.toggle('texto-grande', p.tamanhoTexto === 'grande');
  c.toggle('texto-muito-grande', p.tamanhoTexto === 'muito-grande');
  c.toggle('reduzir-movimento', p.reduzirMovimento);
  c.toggle('densidade-compacta', p.densidade === 'compacta');
  c.toggle('modo-foco', p.modoFoco);
}

export function salvarPreferencias(mudanca: Partial<Preferencias>) {
  const nova = PreferenciasSchema.parse({ ...lerPreferencias(), ...mudanca });
  cache = nova;
  try {
    localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(nova));
  } catch {
    /* sem armazenamento: vale nesta sessão */
  }
  aplicarNoDocumento(nova);
  ouvintes.forEach((o) => o());
}

/** Para os testes: esquece o que está em memória. */
export function _limparCachePreferencias() {
  cache = undefined;
}

export function usePreferencias() {
  const prefs = useSyncExternalStore(
    (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    lerPreferencias,
    lerPreferencias,
  );
  const mudar = useCallback((m: Partial<Preferencias>) => salvarPreferencias(m), []);
  return { prefs, mudar };
}
