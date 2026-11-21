/** Cálculos de IPv4 e sub-redes (CIDR). */
export type Octetos = [number, number, number, number];

export function lerIp(texto: string): Octetos | null {
  const p = texto.trim().split('.');
  if (p.length !== 4 || p.some((x) => !/^\d{1,3}$/.test(x) || Number(x) > 255)) return null;
  return p.map(Number) as Octetos;
}

export const ipParaNumero = (o: Octetos) => ((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3];

export function numeroParaIp(n: number): Octetos {
  return [
    Math.floor(n / 16777216) % 256,
    Math.floor(n / 65536) % 256,
    Math.floor(n / 256) % 256,
    n % 256,
  ];
}

export const ipTexto = (o: Octetos) => o.join('.');

export const bitsDoIp = (o: Octetos) => o.map((x) => x.toString(2).padStart(8, '0')).join('.');

export interface Analise {
  mascara: Octetos;
  rede: Octetos;
  broadcast: Octetos;
  primeiro: Octetos;
  ultimo: Octetos;
  /** Quantidade de endereços utilizáveis por equipamentos. */
  hosts: number;
  privado: boolean;
}

const mascaraNumero = (cidr: number) => (cidr === 0 ? 0 : 2 ** 32 - 2 ** (32 - cidr));

export function analisar(ip: Octetos, cidr: number): Analise | null {
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) return null;
  const m = mascaraNumero(cidr);
  const n = ipParaNumero(ip);
  const total = 2 ** (32 - cidr);
  const rede = n - (n % total);
  const bcast = rede + total - 1;
  const ponto = cidr >= 31;
  return {
    mascara: numeroParaIp(m),
    rede: numeroParaIp(rede),
    broadcast: numeroParaIp(bcast),
    primeiro: numeroParaIp(ponto ? rede : rede + 1),
    ultimo: numeroParaIp(ponto ? bcast : bcast - 1),
    hosts: cidr === 32 ? 1 : cidr === 31 ? 2 : total - 2,
    privado:
      ip[0] === 10 ||
      (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) ||
      (ip[0] === 192 && ip[1] === 168),
  };
}

export function mesmaRede(a: Octetos, b: Octetos, cidr: number): boolean {
  const x = analisar(a, cidr);
  const y = analisar(b, cidr);
  return !!x && !!y && ipParaNumero(x.rede) === ipParaNumero(y.rede);
}
