/**
 * Mini SQL didático: SELECT com colunas, COUNT/SUM/AVG/MIN/MAX, JOIN ... ON,
 * WHERE (AND/OR, =, !=, <>, <, <=, >, >=, LIKE), GROUP BY (uma coluna),
 * ORDER BY (ASC/DESC) e LIMIT. Roda sobre tabelas na memória.
 */
export type Valor = string | number | null;
export type Tabela = { colunas: string[]; linhas: Valor[][] };
export type Tabelas = Record<string, Tabela>;

export type Resultado =
  { ok: true; colunas: string[]; linhas: Valor[][] } | { ok: false; erro: string };

export const TABELAS: Tabelas = {
  clientes: {
    colunas: ['id', 'nome', 'cidade', 'idade'],
    linhas: [
      [1, 'Ana', 'Sorocaba', 28],
      [2, 'Bruno', 'Campinas', 35],
      [3, 'Carla', 'Sorocaba', 22],
      [4, 'Diego', 'São Paulo', 41],
      [5, 'Elisa', 'Campinas', 30],
    ],
  },
  pedidos: {
    colunas: ['id', 'cliente_id', 'produto', 'valor'],
    linhas: [
      [1, 1, 'Caderno', 25],
      [2, 1, 'Caneta', 5],
      [3, 2, 'Mochila', 120],
      [4, 3, 'Caderno', 25],
      [5, 3, 'Mochila', 120],
      [6, 3, 'Caneta', 5],
      [7, 5, 'Caneta', 5],
    ],
  },
};

function pegar<T>(lista: readonly T[], i: number): T {
  const v = lista[i];
  if (v === undefined) throw new Error('Erro interno do mini SQL.');
  return v;
}

type Token = { t: 'id' | 'num' | 'str' | 'op' | 'p'; v: string };

function tokenizar(sql: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /\s*(?:('(?:[^']*)')|(\d+(?:\.\d+)?)|([A-Za-zÀ-ÿ_][\wÀ-ÿ]*(?:\.[A-Za-zÀ-ÿ_][\wÀ-ÿ]*)?)|(<=|>=|<>|!=|=|<|>)|([(),*;]))/y;
  let pos = 0;
  while (pos < sql.length) {
    if (/^\s*$/.test(sql.slice(pos))) break;
    re.lastIndex = pos;
    const m = re.exec(sql);
    if (!m) throw new Error(`Não entendi o trecho: ${sql.slice(pos).trim().slice(0, 12)}`);
    pos = re.lastIndex;
    if (m[1] !== undefined) tokens.push({ t: 'str', v: m[1].slice(1, -1) });
    else if (m[2] !== undefined) tokens.push({ t: 'num', v: m[2] });
    else if (m[3] !== undefined) tokens.push({ t: 'id', v: m[3] });
    else if (m[4] !== undefined) tokens.push({ t: 'op', v: m[4] });
    else if (m[5] !== undefined) tokens.push({ t: 'p', v: m[5] });
  }
  return tokens;
}

type Linha = Record<string, Valor>;
type Cond = { col: string; op: string; valor: Valor };
type Item = { agg?: string; col?: string; texto: string };

class Leitor {
  i = 0;
  constructor(public tokens: Token[]) {}
  ver(): Token | undefined {
    return this.tokens[this.i];
  }
  ehPalavra(p: string): boolean {
    const t = this.ver();
    return !!t && t.t === 'id' && t.v.toUpperCase() === p;
  }
  palavra(p: string): boolean {
    if (this.ehPalavra(p)) {
      this.i++;
      return true;
    }
    return false;
  }
  exigirPalavra(p: string): void {
    if (!this.palavra(p)) throw new Error(`Faltou a palavra ${p}.`);
  }
  simbolo(s: string): boolean {
    const t = this.ver();
    if (t && t.t === 'p' && t.v === s) {
      this.i++;
      return true;
    }
    return false;
  }
  exigirSimbolo(s: string): void {
    if (!this.simbolo(s)) throw new Error(`Faltou "${s}".`);
  }
  identificador(): string {
    const t = this.ver();
    if (!t || t.t !== 'id') throw new Error('Esperava um nome de coluna ou tabela.');
    this.i++;
    return t.v;
  }
}

function colunaDe(it: Item): string {
  if (!it.col) throw new Error('Faltou o nome da coluna.');
  return it.col;
}

const AGREGADOS = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
const RESERVADAS = ['FROM', 'WHERE', 'GROUP', 'ORDER', 'LIMIT', 'JOIN', 'ON', 'AND', 'OR'];

function lerItem(l: Leitor): Item {
  const nome = l.identificador();
  if (AGREGADOS.includes(nome.toUpperCase()) && l.simbolo('(')) {
    const agg = nome.toUpperCase();
    if (l.simbolo('*')) {
      if (agg !== 'COUNT') throw new Error('Só COUNT aceita *.');
      l.exigirSimbolo(')');
      return { agg, texto: 'COUNT(*)' };
    }
    const col = l.identificador();
    l.exigirSimbolo(')');
    return { agg, col, texto: `${agg}(${col})` };
  }
  return { col: nome, texto: nome };
}

function lerValor(l: Leitor): Valor {
  const t = l.ver();
  if (!t || (t.t !== 'num' && t.t !== 'str'))
    throw new Error('Esperava um número ou um texto entre aspas simples.');
  l.i++;
  return t.t === 'num' ? Number(t.v) : t.v;
}

function lerCondicoes(l: Leitor): Cond[][] {
  const grupos: Cond[][] = [[]];
  for (;;) {
    const col = l.identificador();
    const t = l.ver();
    let op: string;
    if (t && t.t === 'op') {
      op = t.v === '<>' ? '!=' : t.v;
      l.i++;
    } else if (l.palavra('LIKE')) op = 'LIKE';
    else throw new Error('Esperava um comparador (=, <, >, LIKE...).');
    const valor = lerValor(l);
    pegar(grupos, grupos.length - 1).push({ col, op, valor });
    if (l.palavra('AND')) continue;
    if (l.palavra('OR')) {
      grupos.push([]);
      continue;
    }
    return grupos;
  }
}

function comparar(a: Valor, op: string, b: Valor): boolean {
  if (a === null) return false;
  if (op === 'LIKE') {
    const re = new RegExp(
      '^' +
        String(b)
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/%/g, '.*')
          .replace(/_/g, '.') +
        '$',
      'i',
    );
    return re.test(String(a));
  }
  switch (op) {
    case '=':
      return a === b;
    case '!=':
      return a !== b;
    case '<':
      return a < (b as string);
    case '<=':
      return a <= (b as string);
    case '>':
      return a > (b as string);
    default:
      return a >= (b as string);
  }
}

function resolver(linha: Linha, col: string): string {
  if (col.includes('.')) {
    if (!(col in linha)) throw new Error(`Não existe a coluna ${col}.`);
    return col;
  }
  const achadas = Object.keys(linha).filter((k) => k.endsWith('.' + col));
  if (achadas.length === 0) throw new Error(`Não existe a coluna "${col}".`);
  if (achadas.length > 1) throw new Error(`A coluna "${col}" é ambígua: escreva tabela.${col}.`);
  return pegar(achadas, 0);
}

function linhasDe(tabelas: Tabelas, nome: string): Linha[] {
  const chave = Object.keys(tabelas).find((k) => k.toLowerCase() === nome.toLowerCase());
  if (!chave) throw new Error(`Não existe a tabela "${nome}".`);
  const tb = pegar(Object.values(tabelas), Object.keys(tabelas).indexOf(chave));
  return tb.linhas.map((v) =>
    Object.fromEntries(tb.colunas.map((c, i) => [`${chave}.${c}`, v[i] ?? null])),
  );
}

function agregar(itens: Item[], grupo: Linha[]): Valor[] {
  return itens.map((it) => {
    if (!it.agg) {
      const primeira = grupo[0];
      return primeira ? (primeira[resolver(primeira, colunaDe(it))] ?? null) : null;
    }
    if (it.agg === 'COUNT') return grupo.length;
    if (grupo.length === 0) return null;
    const chave = resolver(pegar(grupo, 0), colunaDe(it));
    const nums = grupo.map((g) => g[chave]).filter((v): v is number => typeof v === 'number');
    if (it.agg === 'SUM') return nums.reduce((a, b) => a + b, 0);
    if (it.agg === 'AVG')
      return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    if (it.agg === 'MIN') return Math.min(...nums);
    return Math.max(...nums);
  });
}

export function consultar(sql: string, tabelas: Tabelas = TABELAS): Resultado {
  try {
    const l = new Leitor(tokenizar(sql));
    l.exigirPalavra('SELECT');
    let todas = false;
    const itens: Item[] = [];
    if (l.simbolo('*')) todas = true;
    else {
      do itens.push(lerItem(l));
      while (l.simbolo(','));
    }
    l.exigirPalavra('FROM');
    let linhas = linhasDe(tabelas, l.identificador());
    while (l.palavra('JOIN')) {
      const outra = linhasDe(tabelas, l.identificador());
      l.exigirPalavra('ON');
      const a = l.identificador();
      const t = l.ver();
      if (!t || t.t !== 'op' || t.v !== '=') throw new Error('O ON aceita só igualdade (a = b).');
      l.i++;
      const b = l.identificador();
      const novas: Linha[] = [];
      for (const x of linhas)
        for (const y of outra) {
          const junta = { ...x, ...y };
          if (junta[resolver(junta, a)] === junta[resolver(junta, b)]) novas.push(junta);
        }
      linhas = novas;
    }
    if (l.palavra('WHERE')) {
      const grupos = lerCondicoes(l);
      linhas = linhas.filter((r) =>
        grupos.some((g) => g.every((c) => comparar(r[resolver(r, c.col)] ?? null, c.op, c.valor))),
      );
    }
    let agrupar: string | null = null;
    if (l.palavra('GROUP')) {
      l.exigirPalavra('BY');
      agrupar = l.identificador();
    }
    let ordem: { col: string; desc: boolean } | null = null;
    if (l.palavra('ORDER')) {
      l.exigirPalavra('BY');
      const col = l.identificador();
      const desc = l.palavra('DESC');
      if (!desc) l.palavra('ASC');
      ordem = { col, desc };
    }
    let limite: number | null = null;
    if (l.palavra('LIMIT')) limite = Number(lerValor(l));
    l.simbolo(';');
    if (l.ver()) throw new Error(`Sobrou algo no fim: ${l.ver()?.v ?? ''}`);
    const reservada = itens.find((i) => i.col && RESERVADAS.includes(i.col.toUpperCase()));
    if (reservada) throw new Error(`Faltou uma vírgula perto de ${reservada.texto}.`);

    const temAgg = itens.some((i) => i.agg);
    let colunas: string[];
    let saida: Valor[][];
    if (todas) {
      const chaves = linhas[0] ? Object.keys(linhas[0]) : [];
      colunas = chaves.map((k) => k.split('.')[1] ?? k);
      saida = linhas.map((r) => chaves.map((k) => r[k] ?? null));
    } else if (temAgg || agrupar) {
      colunas = itens.map((i) => i.texto);
      if (agrupar) {
        const mapa = new Map<Valor, Linha[]>();
        for (const r of linhas) {
          const k = r[resolver(r, agrupar)] ?? null;
          mapa.set(k, [...(mapa.get(k) ?? []), r]);
        }
        saida = [...mapa.values()].map((g) => agregar(itens, g));
        const naoAgg = itens.find(
          (i) => !i.agg && colunaDe(i).split('.').pop() !== agrupar?.split('.').pop(),
        );
        if (naoAgg)
          throw new Error(
            `"${naoAgg.texto}" precisa estar no GROUP BY ou dentro de COUNT/SUM/AVG.`,
          );
      } else {
        if (itens.some((i) => !i.agg))
          throw new Error('Misturar colunas e COUNT/SUM sem GROUP BY não funciona.');
        saida = [agregar(itens, linhas)];
      }
    } else {
      colunas = itens.map((i) => i.texto);
      saida = linhas.map((r) => itens.map((i) => r[resolver(r, colunaDe(i))] ?? null));
    }
    if (ordem) {
      const ordemFinal = ordem;
      let idx = colunas.findIndex((c) => c.toLowerCase() === ordemFinal.col.toLowerCase());
      if (idx < 0)
        idx = colunas.findIndex((c) =>
          c.toLowerCase().endsWith('.' + ordemFinal.col.toLowerCase()),
        );
      if (idx < 0) {
        if (!todas && !temAgg && !agrupar) {
          // Ordenar por coluna que não aparece no SELECT: ordena as linhas de origem.
          const pares = linhas.map((r, k) => ({ r, s: pegar(saida, k) }));
          pares.sort((p, q) =>
            cmp(
              p.r[resolver(p.r, ordemFinal.col)] ?? null,
              q.r[resolver(q.r, ordemFinal.col)] ?? null,
            ),
          );
          if (ordemFinal.desc) pares.reverse();
          saida = pares.map((p) => p.s);
        } else
          throw new Error(`Não dá para ordenar por "${ordem.col}": use uma coluna do resultado.`);
      } else {
        saida = [...saida].sort((p, q) => cmp(p[idx] ?? null, q[idx] ?? null));
        if (ordemFinal.desc) saida.reverse();
      }
    }
    if (limite !== null) saida = saida.slice(0, limite);
    return { ok: true, colunas, linhas: saida };
  } catch (e) {
    return { ok: false, erro: (e as Error).message };
  }
}

function cmp(a: Valor, b: Valor): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a < b ? -1 : 1;
}
