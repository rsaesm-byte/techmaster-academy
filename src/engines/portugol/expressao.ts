/**
 * EXPRESSÕES — transforma fichas em uma árvore que respeita a precedência:
 *   nao, - (unário)  >  * / %  >  + -  >  = <> < > <= >=  >  e  >  ou
 * Ex.: 2 + 3 * 4 vira  (+ 2 (* 3 4)), porque a multiplicação "gruda" mais forte.
 */
import { ErroPortugol, type Token } from '@/engines/portugol/lexer';

export type Valor = number | string | boolean;

export type Expr =
  | { k: 'lit'; v: Valor }
  | { k: 'var'; nome: string; chave: string }
  | { k: 'indice'; nome: string; chave: string; idx: Expr }
  | { k: 'chamada'; nome: string; chave: string; args: Expr[] }
  | { k: 'un'; op: '-' | 'nao'; e: Expr }
  | { k: 'bin'; op: OpBinario; a: Expr; b: Expr };

export type OpBinario =
  '+' | '-' | '*' | '/' | '\\' | '%' | '=' | '<>' | '<' | '>' | '<=' | '>=' | 'e' | 'ou';

const NIVEIS: OpBinario[][] = [
  ['ou'],
  ['e'],
  ['=', '<>', '<', '>', '<=', '>='],
  ['+', '-'],
  ['*', '/', '\\', '%'],
];

function precedencia(op: OpBinario): number {
  return NIVEIS.findIndex((n) => n.includes(op));
}

export class LeitorExpressao {
  private pos = 0;
  constructor(
    private readonly tokens: Token[],
    private readonly linha: number,
  ) {}

  lerTudo(): Expr {
    const e = this.ler();
    if (this.pos < this.tokens.length) {
      throw new ErroPortugol(this.linha, `Não entendi a parte "${this.restante()}".`);
    }
    return e;
  }

  restante(): string {
    return this.tokens
      .slice(this.pos)
      .map((t) => t.texto)
      .join(' ');
  }

  /** Lê uma expressão e para antes de uma vírgula/parêntese de fechamento que não seja dela. */
  ler(nivel = 0): Expr {
    if (nivel >= NIVEIS.length) return this.lerUnario();
    let esq = this.ler(nivel + 1);
    for (;;) {
      const t = this.tokens[this.pos];
      const op = t && operadorBinario(t);
      if (!op || !NIVEIS[nivel]?.includes(op)) return esq;
      this.pos++;
      const dir = this.ler(nivel + 1);
      esq = { k: 'bin', op, a: esq, b: dir };
    }
  }

  private lerUnario(): Expr {
    const t = this.tokens[this.pos];
    if (t?.tipo === 'op' && t.texto === '-') {
      this.pos++;
      return { k: 'un', op: '-', e: this.lerUnario() };
    }
    if (t?.tipo === 'id' && t.norm === 'nao') {
      this.pos++;
      return { k: 'un', op: 'nao', e: this.lerUnario() };
    }
    return this.lerPrimario();
  }

  private lerPrimario(): Expr {
    const t = this.tokens[this.pos++];
    if (!t) throw new ErroPortugol(this.linha, 'A expressão terminou antes da hora.');
    if (t.tipo === 'num' || t.tipo === 'str') return { k: 'lit', v: t.valor };
    if (t.tipo === 'id') {
      if (t.norm === 'verdadeiro') return { k: 'lit', v: true };
      if (t.norm === 'falso') return { k: 'lit', v: false };
      const prox = this.tokens[this.pos];
      if (prox?.texto === '[') {
        this.pos++;
        const idx = this.ler();
        if (this.tokens[this.pos]?.texto !== ']')
          throw new ErroPortugol(this.linha, 'Faltou fechar o colchete "]".');
        this.pos++;
        return { k: 'indice', nome: t.texto, chave: t.norm, idx };
      }
      if (prox?.texto === '(') {
        this.pos++;
        const args: Expr[] = [];
        if (this.tokens[this.pos]?.texto !== ')') {
          for (;;) {
            args.push(this.ler());
            if (this.tokens[this.pos]?.texto === ',') {
              this.pos++;
              continue;
            }
            break;
          }
        }
        if (this.tokens[this.pos]?.texto !== ')')
          throw new ErroPortugol(
            this.linha,
            `Faltou fechar o parêntese da chamada ${t.texto}(...).`,
          );
        this.pos++;
        return { k: 'chamada', nome: t.texto, chave: t.norm, args };
      }
      return { k: 'var', nome: t.texto, chave: t.norm };
    }
    if (t.texto === '(') {
      const e = this.ler();
      if (this.tokens[this.pos]?.texto !== ')') {
        throw new ErroPortugol(this.linha, 'Faltou fechar um parêntese ")".');
      }
      this.pos++;
      return e;
    }
    throw new ErroPortugol(this.linha, `Esperava um valor, mas encontrei "${t.texto}".`);
  }

  get posicao() {
    return this.pos;
  }
  avancar() {
    this.pos++;
  }
  espiar(): Token | undefined {
    return this.tokens[this.pos];
  }
}

function operadorBinario(t: Token): OpBinario | undefined {
  if (
    t.tipo === 'op' &&
    ['+', '-', '*', '/', '\\', '%', '=', '<>', '<', '>', '<=', '>='].includes(t.texto)
  ) {
    return t.texto as OpBinario;
  }
  if (t.tipo === 'id' && (t.norm === 'e' || t.norm === 'ou')) return t.norm;
  if (t.tipo === 'id' && t.norm === 'mod') return '%';
  return undefined;
}

// ---------- Mostrar como texto ----------

export function formatarValor(v: Valor | undefined, comAspas = false): string {
  if (v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
  if (typeof v === 'string') return comAspas ? `"${v}"` : v;
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 10000) / 10000);
}

/** Escreve a expressão de volta como texto, com parênteses só onde precisa. */
export function exprParaTexto(e: Expr, pai?: OpBinario, lado?: 'a' | 'b'): string {
  switch (e.k) {
    case 'lit':
      return formatarValor(e.v, true);
    case 'var':
      return e.nome;
    case 'indice':
      return `${e.nome}[${exprParaTexto(e.idx)}]`;
    case 'chamada':
      return `${e.nome}(${e.args.map((a) => exprParaTexto(a)).join(', ')})`;
    case 'un':
      return e.op === '-' ? `-${exprParaTexto(e.e)}` : `nao ${exprParaTexto(e.e)}`;
    case 'bin': {
      const t = `${exprParaTexto(e.a, e.op, 'a')} ${e.op} ${exprParaTexto(e.b, e.op, 'b')}`;
      if (!pai) return t;
      const p = precedencia(e.op);
      const pp = precedencia(pai);
      const precisa = p < pp || (p === pp && lado === 'b' && ['-', '/', '\\', '%'].includes(pai));
      return precisa ? `(${t})` : t;
    }
  }
}

// ---------- Calcular ----------

/** Como a expressão obtém valores de fora: variáveis, elementos de vetor e chamadas de função. */
export interface Ambiente {
  variavel(chave: string, nome: string): Valor;
  indice?(chave: string, nome: string, i: number): Valor;
  chamar?(chave: string, nome: string, args: Valor[]): Valor;
}

/** Funções prontas do Portugol (as mais usadas nas aulas). */
export const FUNCOES_NATIVAS: Record<string, (args: Valor[], linha: number) => Valor> = {
  abs: ([x], l) => Math.abs(numero(x, 'abs', l)),
  int: ([x], l) => Math.trunc(numero(x, 'int', l)),
  raizq: ([x], l) => Math.sqrt(numero(x, 'raizq', l)),
  quad: ([x], l) => numero(x, 'quad', l) ** 2,
  compr: ([x], l) => {
    if (typeof x !== 'string') throw new ErroPortugol(l, 'compr(...) precisa de um texto.');
    return x.length;
  },
};

function numero(x: Valor | undefined, nome: string, linha: number): number {
  if (typeof x !== 'number') throw new ErroPortugol(linha, `${nome}(...) precisa de um número.`);
  return x;
}

export function avaliar(e: Expr, amb: Ambiente, linha: number): Valor {
  switch (e.k) {
    case 'lit':
      return e.v;
    case 'var':
      return amb.variavel(e.chave, e.nome);
    case 'indice': {
      const i = avaliar(e.idx, amb, linha);
      if (typeof i !== 'number' || !Number.isInteger(i)) {
        throw new ErroPortugol(
          linha,
          `O índice de ${e.nome}[...] precisa ser um número inteiro, mas foi ${formatarValor(i, true)}.`,
        );
      }
      if (!amb.indice) throw new ErroPortugol(linha, `"${e.nome}" não é um vetor.`);
      return amb.indice(e.chave, e.nome, i);
    }
    case 'chamada': {
      const args = e.args.map((a) => avaliar(a, amb, linha));
      const nativa = FUNCOES_NATIVAS[e.chave];
      if (amb.chamar) return amb.chamar(e.chave, e.nome, args);
      if (nativa) return nativa(args, linha);
      throw new ErroPortugol(linha, `Função "${e.nome}" não existe.`);
    }
    case 'un': {
      const v = avaliar(e.e, amb, linha);
      if (e.op === '-') {
        if (typeof v !== 'number')
          throw new ErroPortugol(linha, 'O sinal "-" só vale para números.');
        return -v;
      }
      if (typeof v !== 'boolean') {
        throw new ErroPortugol(linha, '"nao" só vale para VERDADEIRO ou FALSO.');
      }
      return !v;
    }
    case 'bin':
      return aplicar(e.op, avaliar(e.a, amb, linha), avaliar(e.b, amb, linha), linha);
  }
}

export function aplicar(op: OpBinario, a: Valor, b: Valor, linha: number): Valor {
  const num = (x: Valor) => {
    if (typeof x !== 'number') {
      throw new ErroPortugol(
        linha,
        `"${op}" precisa de números, mas recebeu ${formatarValor(x, true)}.`,
      );
    }
    return x;
  };
  const log = (x: Valor) => {
    if (typeof x !== 'boolean') {
      throw new ErroPortugol(
        linha,
        `"${op}" precisa de VERDADEIRO ou FALSO, mas recebeu ${formatarValor(x, true)}.`,
      );
    }
    return x;
  };
  switch (op) {
    case '+':
      if (typeof a === 'string' || typeof b === 'string')
        return formatarValor(a) + formatarValor(b);
      return num(a) + num(b);
    case '-':
      return num(a) - num(b);
    case '*':
      return num(a) * num(b);
    case '/':
      if (num(b) === 0) throw new ErroPortugol(linha, 'Divisão por zero.');
      return num(a) / num(b);
    case '\\':
      if (num(b) === 0) throw new ErroPortugol(linha, 'Divisão por zero.');
      return Math.trunc(num(a) / num(b));
    case '%':
      if (num(b) === 0) throw new ErroPortugol(linha, 'Resto de divisão por zero.');
      return num(a) % num(b);
    case '=':
      return a === b;
    case '<>':
      return a !== b;
    case '<':
    case '>':
    case '<=':
    case '>=': {
      if (typeof a !== typeof b || typeof a === 'boolean') {
        throw new ErroPortugol(
          linha,
          `Não dá para comparar ${formatarValor(a, true)} com ${formatarValor(b, true)} usando "${op}".`,
        );
      }
      if (op === '<') return a < b;
      if (op === '>') return a > b;
      if (op === '<=') return a <= b;
      return a >= b;
    }
    case 'e':
      return log(a) && log(b);
    case 'ou':
      return log(a) || log(b);
  }
}

/**
 * Mostra a avaliação de uma expressão, uma operação por vez, na ordem da precedência.
 * Ex.: "2 + 3 * 4" → ["2 + 3 * 4", "2 + 12", "14"]
 */
export function passosDaExpressao(e: Expr, amb: Ambiente, linha = 1): string[] {
  const passos = [exprParaTexto(e)];
  let atual = e;
  // Troca variáveis pelos valores primeiro, num passo só.
  const semVars = substituirVariaveis(atual, amb);
  if (exprParaTexto(semVars) !== passos[0]) passos.push(exprParaTexto(semVars));
  atual = semVars;
  while (atual.k !== 'lit') {
    atual = reduzirUm(atual, linha);
    passos.push(exprParaTexto(atual));
  }
  return passos;
}

function substituirVariaveis(e: Expr, amb: Ambiente): Expr {
  switch (e.k) {
    case 'var':
    case 'indice':
    case 'chamada':
      return { k: 'lit', v: avaliar(e, amb, 1) };
    case 'un':
      return { ...e, e: substituirVariaveis(e.e, amb) };
    case 'bin':
      return { ...e, a: substituirVariaveis(e.a, amb), b: substituirVariaveis(e.b, amb) };
    default:
      return e;
  }
}

/** Calcula a operação mais "funda" (a primeira que pode ser feita), da esquerda para a direita. */
function reduzirUm(e: Expr, linha: number): Expr {
  if (e.k === 'un') {
    if (e.e.k === 'lit') return { k: 'lit', v: avaliar(e, { variavel: () => 0 }, linha) };
    return { ...e, e: reduzirUm(e.e, linha) };
  }
  if (e.k === 'bin') {
    if (e.a.k !== 'lit') return { ...e, a: reduzirUm(e.a, linha) };
    if (e.b.k !== 'lit') return { ...e, b: reduzirUm(e.b, linha) };
    return { k: 'lit', v: aplicar(e.op, e.a.v, e.b.v, linha) };
  }
  return e;
}
