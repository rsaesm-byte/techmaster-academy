export const CHAVE_BOAS_VINDAS = 'tm:boasVindas';

export function boasVindasFeitas(): boolean {
  try {
    return localStorage.getItem(CHAVE_BOAS_VINDAS) === 'feita';
  } catch {
    return true;
  }
}
