/**
 * Binário: a "língua" do computador. Funções puras, sem tela.
 * Um vetor de bits é sempre escrito do mais significativo (esquerda) para o menos (direita),
 * como no papel: [1,0,1,1] = 8 + 0 + 2 + 1 = 11.
 */
export type Bits = number[];

/** Converte um número sem sinal em n bits. Valores fora do intervalo são "cortados" (overflow). */
export function paraBits(valor: number, n: number): Bits {
  const m = ((Math.trunc(valor) % 2 ** n) + 2 ** n) % 2 ** n;
  return Array.from({ length: n }, (_, i) => Math.floor(m / 2 ** (n - 1 - i)) % 2);
}

export function semSinal(bits: Bits): number {
  return bits.reduce((soma, b) => soma * 2 + b, 0);
}

/** Complemento de dois: o bit mais à esquerda "vale" -2^(n-1). */
export function comSinal(bits: Bits): number {
  const v = semSinal(bits);
  return bits[0] === 1 ? v - 2 ** bits.length : v;
}

export function peso(posicao: number, n: number): number {
  return 2 ** (n - 1 - posicao);
}

export function paraHex(bits: Bits): string {
  const digitos: string[] = [];
  const preenchido = [...Array((4 - (bits.length % 4)) % 4).fill(0), ...bits] as Bits;
  for (let i = 0; i < preenchido.length; i += 4)
    digitos.push(
      semSinal(preenchido.slice(i, i + 4))
        .toString(16)
        .toUpperCase(),
    );
  return digitos.join('');
}

export const bitsParaTexto = (bits: Bits) => bits.join('');

export interface PassoSoma {
  /** Posição do bit (0 = mais à esquerda). */
  posicao: number;
  a: number;
  b: number;
  entrada: number; // "vai-um" que veio da coluna da direita
  soma: number; // bit escrito no resultado
  saida: number; // "vai-um" que vai para a coluna da esquerda
}

export interface ResultadoSoma {
  passos: PassoSoma[];
  resultado: Bits;
  /** O "vai-um" que sobrou além do último bit: o resultado não coube. */
  estouro: boolean;
  /** Estouro considerando números COM sinal (complemento de dois). */
  estouroComSinal: boolean;
}

/** Soma coluna por coluna, da direita para a esquerda, como na escola. */
export function somar(a: Bits, b: Bits): ResultadoSoma {
  const n = a.length;
  const passos: PassoSoma[] = [];
  const resultado: Bits = Array(n).fill(0);
  let vaiUm = 0;
  for (let p = n - 1; p >= 0; p--) {
    const x = a[p] ?? 0;
    const y = b[p] ?? 0;
    const total = x + y + vaiUm;
    passos.push({ posicao: p, a: x, b: y, entrada: vaiUm, soma: total % 2, saida: total >> 1 });
    resultado[p] = total % 2;
    vaiUm = total >> 1;
  }
  const sinalA = comSinal(a);
  const sinalB = comSinal(b);
  const esperado = sinalA + sinalB;
  const estouroComSinal = esperado !== comSinal(resultado);
  return { passos, resultado, estouro: vaiUm === 1, estouroComSinal };
}

/** Texto em bytes UTF-8: cada letra vira um ou mais bytes (acentos e emojis usam mais de um). */
export function textoParaBytes(texto: string): { caractere: string; bytes: number[] }[] {
  const codificador = new TextEncoder();
  return [...texto].map((c) => ({ caractere: c, bytes: [...codificador.encode(c)] }));
}
