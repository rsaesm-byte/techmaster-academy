/**
 * ANALISADOR LÉXICO — quebra uma linha de Portugol em "fichas" (tokens).
 * Ex.: `media <- (n1 + n2) / 2` → [media] [<-] [(] [n1] [+] [n2] [)] [/] [2]
 * Analogia: é separar uma frase em palavras e pontuação antes de entender o sentido.
 */

export type Token =
  | { tipo: 'num'; valor: number; texto: string }
  | { tipo: 'str'; valor: string; texto: string }
  | { tipo: 'id'; texto: string; norm: string }
  | { tipo: 'op'; texto: string };

export class ErroPortugol extends Error {
  constructor(
    public readonly linha: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroPortugol';
  }
}

/** Minúsculas e sem acento: "Então" e "entao" viram a mesma palavra-chave. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const OPERADORES = [
  '<-',
  '<=',
  '>=',
  '<>',
  '==',
  '←',
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '<',
  '>',
  '(',
  ')',
  ',',
  ':',
];

export function tokenizar(fonte: string, linha: number): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < fonte.length) {
    const c = fonte.charAt(i);
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === '/' && fonte.charAt(i + 1) === '/') break; // comentário até o fim da linha
    if (c === '"') {
      const fim = fonte.indexOf('"', i + 1);
      if (fim === -1) throw new ErroPortugol(linha, 'Texto aberto com " e não fechado.');
      const valor = fonte.slice(i + 1, fim);
      tokens.push({ tipo: 'str', valor, texto: `"${valor}"` });
      i = fim + 1;
      continue;
    }
    const num = /^\d+(?:\.\d+)?/.exec(fonte.slice(i));
    if (num) {
      tokens.push({ tipo: 'num', valor: Number(num[0]), texto: num[0] });
      i += num[0].length;
      continue;
    }
    const id = /^[\p{L}_][\p{L}\p{N}_]*/u.exec(fonte.slice(i));
    if (id) {
      tokens.push({ tipo: 'id', texto: id[0], norm: normalizar(id[0]) });
      i += id[0].length;
      continue;
    }
    const op = OPERADORES.find((o) => fonte.startsWith(o, i));
    if (op) {
      tokens.push({ tipo: 'op', texto: op === '←' ? '<-' : op === '==' ? '=' : op });
      i += op.length;
      continue;
    }
    throw new ErroPortugol(linha, `Símbolo não reconhecido: "${c}".`);
  }
  return tokens;
}
