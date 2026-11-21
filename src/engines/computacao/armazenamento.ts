/** Unidades de dados, cache, RAID, compressão simples e cifra de César. */

// ---------- Unidades ----------
export const UNIDADES = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
export type Unidade = (typeof UNIDADES)[number];

/** Base 1000 é a dos fabricantes (KB); base 1024 é a dos sistemas (KiB). */
export function paraBytes(valor: number, un: Unidade, base: 1000 | 1024): number {
  return valor * base ** UNIDADES.indexOf(un);
}

export function formatarBytes(bytes: number, base: 1000 | 1024 = 1000): string {
  let v = bytes;
  let i = 0;
  while (v >= base && i < UNIDADES.length - 1) {
    v /= base;
    i++;
  }
  const t = v >= 100 || Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
  return `${t.replace('.', ',')} ${UNIDADES[i]}`;
}

export const quantosCabem = (capacidade: number, arquivo: number) =>
  arquivo <= 0 ? 0 : Math.floor(capacidade / arquivo);

// ---------- Cache ----------
export interface PassoCache {
  endereco: number;
  acerto: boolean;
  /** Conteúdo da cache depois do acesso, do mais antigo para o mais recente. */
  linhas: number[];
  removido?: number;
}

export function simularCache(acessos: number[], capacidade: number, politica: 'lru' | 'fifo') {
  let linhas: number[] = [];
  const passos: PassoCache[] = [];
  for (const endereco of acessos) {
    const acerto = linhas.includes(endereco);
    let removido: number | undefined;
    if (acerto) {
      if (politica === 'lru') linhas = [...linhas.filter((x) => x !== endereco), endereco];
    } else {
      if (linhas.length >= capacidade) removido = linhas[0];
      linhas = [...linhas.slice(removido === undefined ? 0 : 1), endereco];
    }
    passos.push({ endereco, acerto, linhas, ...(removido !== undefined ? { removido } : {}) });
  }
  const acertos = passos.filter((p) => p.acerto).length;
  return { passos, acertos, taxa: passos.length ? acertos / passos.length : 0 };
}

// ---------- RAID ----------
export type NivelRaid = 0 | 1 | 5;
export function raid(nivel: NivelRaid, discos: number, tamanho: number) {
  const minimo = nivel === 5 ? 3 : 2;
  if (discos < minimo) return null;
  const util = nivel === 0 ? discos * tamanho : nivel === 1 ? tamanho : (discos - 1) * tamanho;
  const tolera = nivel === 0 ? 0 : nivel === 1 ? discos - 1 : 1;
  return { util, tolera, eficiencia: util / (discos * tamanho) };
}

// ---------- Compressão (RLE) ----------
/** "AAAABBB" -> "4A3B". Só serve para texto sem dígitos. */
export function rle(texto: string): string {
  let saida = '';
  for (let i = 0; i < texto.length;) {
    let j = i;
    while (j < texto.length && texto[j] === texto[i]) j++;
    saida += `${j - i}${texto[i]}`;
    i = j;
  }
  return saida;
}

export function desrle(codigo: string): string {
  return [...codigo.matchAll(/(\d+)(\D)/g)].map((m) => (m[2] ?? '').repeat(Number(m[1]))).join('');
}

// ---------- Cifra de César ----------
export function cesar(texto: string, deslocamento: number): string {
  const d = ((deslocamento % 26) + 26) % 26;
  return [...texto]
    .map((c) => {
      const cod = c.charCodeAt(0);
      if (cod >= 65 && cod <= 90) return String.fromCharCode(((cod - 65 + d) % 26) + 65);
      if (cod >= 97 && cod <= 122) return String.fromCharCode(((cod - 97 + d) % 26) + 97);
      return c;
    })
    .join('');
}
