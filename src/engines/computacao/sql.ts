/**
 * Mini SQL didático. Consultas: SELECT [DISTINCT] com colunas, apelidos (AS),
 * COUNT/SUM/AVG/MIN/MAX, [LEFT] JOIN ... ON, WHERE (AND/OR; =, !=, <>, <, <=, >, >=,
 * LIKE, IN, IS [NOT] NULL), GROUP BY (uma coluna), HAVING, ORDER BY e LIMIT.
 * Alterações: INSERT, UPDATE e DELETE. Roda sobre tabelas na memória, sem mutar a entrada.
 */
export type Valor = string | number | null;
export type Tabela = { colunas: string[]; linhas: Valor[][] };
export type Tabelas = Record<string, Tabela>;

export type Resultado =
  | { ok: true; colunas: string[]; linhas: Valor[][]; mensagem?: string }
  | { ok: false; erro: string };

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

export function copiar(tabelas: Tabelas): Tabelas {
  return Object.fromEntries(
    Object.entries(tabelas).map(([n, t]) => [
      n,
      { colunas: [...t.colunas], linhas: t.linhas.map((l) => [...l]) },
    ]),
  );
}

function pegar<T>(lista: readonly T[], i: number): T {
  const v = lista[i];
  if (v === undefined) throw new Error('Erro interno do mini SQL.');
  return v;
}

type Token = { t: 'id' | 'num' | 'str' | 'op' | 'p'; v: string };

function tokenizar(sql: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /\s*(?:('(?:[^']*)')|(-?\d+(?:\.\d+)?)|([A-Za-zÀ-ÿ_][\wÀ-ÿ]*(?:\.[A-Za-zÀ-ÿ_][\wÀ-ÿ]*)?)|(<=|>=|<>|!=|=|<|>)|([(),*;]))/y;
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
type Item = { agg?: string; col?: string; texto: string; alias?: string };
type Cond = { item: Item; op: string; valor: Valor | Valor[] };

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
const RESERVADAS = [
  'FROM',
  'WHERE',
  'GROUP',
  'HAVING',
  'ORDER',
  'LIMIT',
  'JOIN',
  'LEFT',
  'ON',
  'AND',
  'OR',
  'VALUES',
  'SET',
  'AS',
];

function lerItem(l: Leitor, aceitaAlias = false): Item {
  const nome = l.identificador();
  let item: Item;
  if (AGREGADOS.includes(nome.toUpperCase()) && l.simbolo('(')) {
    const agg = nome.toUpperCase();
    if (l.simbolo('*')) {
      if (agg !== 'COUNT') throw new Error('Só COUNT aceita *.');
      l.exigirSimbolo(')');
      item = { agg, texto: 'COUNT(*)' };
    } else {
      const col = l.identificador();
      l.exigirSimbolo(')');
      item = { agg, col, texto: `${agg}(${col})` };
    }
  } else item = { col: nome, texto: nome };
  if (aceitaAlias && l.palavra('AS')) item.alias = l.identificador();
  return item;
}

function lerValor(l: Leitor): Valor {
  const t = l.ver();
  if (t && t.t === 'id' && t.v.toUpperCase() === 'NULL') {
    l.i++;
    return null;
  }
  if (!t || (t.t !== 'num' && t.t !== 'str'))
    throw new Error('Esperava um número ou um texto entre aspas simples.');
  l.i++;
  return t.t === 'num' ? Number(t.v) : t.v;
}

function lerCondicoes(l: Leitor): Cond[][] {
  const grupos: Cond[][] = [[]];
  for (;;) {
    const item = lerItem(l);
    const t = l.ver();
    let op: string;
    let valor: Valor | Valor[];
    if (t && t.t === 'op') {
      op = t.v === '<>' ? '!=' : t.v;
      l.i++;
      valor = lerValor(l);
    } else if (l.palavra('LIKE')) {
      op = 'LIKE';
      valor = lerValor(l);
    } else if (l.palavra('IN')) {
      op = 'IN';
      l.exigirSimbolo('(');
      const lista: Valor[] = [];
      do lista.push(lerValor(l));
      while (l.simbolo(','));
      l.exigirSimbolo(')');
      valor = lista;
    } else if (l.palavra('IS')) {
      op = l.palavra('NOT') ? 'IS NOT NULL' : 'IS NULL';
      l.exigirPalavra('NULL');
      valor = null;
    } else throw new Error('Esperava um comparador (=, <, >, LIKE, IN, IS NULL...).');
    pegar(grupos, grupos.length - 1).push({ item, op, valor });
    if (l.palavra('AND')) continue;
    if (l.palavra('OR')) {
      grupos.push([]);
      continue;
    }
    return grupos;
  }
}

function comparar(a: Valor, op: string, b: Valor | Valor[]): boolean {
  if (op === 'IS NULL') return a === null;
  if (op === 'IS NOT NULL') return a !== null;
  if (a === null) return false;
  if (op === 'IN') return Array.isArray(b) && b.includes(a);
  const alvo = b as Valor;
  if (op === 'LIKE') {
    const re = new RegExp(
      '^' +
        String(alvo)
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/%/g, '.*')
          .replace(/_/g, '.') +
        '$',
      'i',
    );
    return re.test(String(a));
  }
  if (alvo === null) return false;
  switch (op) {
    case '=':
      return a === alvo;
    case '!=':
      return a !== alvo;
    case '<':
      return a < alvo;
    case '<=':
      return a <= alvo;
    case '>':
      return a > alvo;
    default:
      return a >= alvo;
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

function carregar(tabelas: Tabelas, nome: string) {
  const chave = Object.keys(tabelas).find((k) => k.toLowerCase() === nome.toLowerCase());
  if (!chave) throw new Error(`Não existe a tabela "${nome}".`);
  const tb = tabelas[chave];
  if (!tb) throw new Error(`Não existe a tabela "${nome}".`);
  const linhas = tb.linhas.map((v): Linha =>
    Object.fromEntries(tb.colunas.map((c, i) => [`${chave}.${c}`, v[i] ?? null])),
  );
  const vazia: Linha = Object.fromEntries(tb.colunas.map((c) => [`${chave}.${c}`, null]));
  return { chave, tb, linhas, vazia };
}

function agregar(itens: Item[], grupo: Linha[]): Valor[] {
  return itens.map((it) => {
    if (!it.agg) {
      const primeira = grupo[0];
      return primeira ? (primeira[resolver(primeira, colunaDe(it))] ?? null) : null;
    }
    if (it.agg === 'COUNT') {
      if (!it.col) return grupo.length;
      const primeira = grupo[0];
      if (!primeira) return 0;
      const chave = resolver(primeira, it.col);
      return grupo.filter((g) => g[chave] !== null).length;
    }
    const primeira = grupo[0];
    if (!primeira) return null;
    const chave = resolver(primeira, colunaDe(it));
    const nums = grupo.map((g) => g[chave]).filter((v): v is number => typeof v === 'number');
    if (nums.length === 0) return null;
    if (it.agg === 'SUM') return nums.reduce((a, b) => a + b, 0);
    if (it.agg === 'AVG')
      return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    if (it.agg === 'MIN') return Math.min(...nums);
    return Math.max(...nums);
  });
}

function cmp(a: Valor, b: Valor): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a < b ? -1 : 1;
}

function passa(grupos: Cond[][], valorDe: (it: Item) => Valor): boolean {
  return grupos.some((g) => g.every((c) => comparar(valorDe(c.item), c.op, c.valor)));
}

function textoSql(v: Valor): string {
  return v === null ? 'NULL' : String(v);
}

function selecionar(l: Leitor, tabelas: Tabelas): Resultado {
  const distinto = l.palavra('DISTINCT');
  let todas = false;
  const itens: Item[] = [];
  if (l.simbolo('*')) todas = true;
  else {
    do itens.push(lerItem(l, true));
    while (l.simbolo(','));
  }
  l.exigirPalavra('FROM');
  let linhas = carregar(tabelas, l.identificador()).linhas;
  for (;;) {
    const esquerda = l.palavra('LEFT');
    if (!l.palavra('JOIN')) {
      if (esquerda) throw new Error('Faltou a palavra JOIN depois de LEFT.');
      break;
    }
    const outra = carregar(tabelas, l.identificador());
    l.exigirPalavra('ON');
    const a = l.identificador();
    const t = l.ver();
    if (!t || t.t !== 'op' || t.v !== '=') throw new Error('O ON aceita só igualdade (a = b).');
    l.i++;
    const b = l.identificador();
    const novas: Linha[] = [];
    for (const x of linhas) {
      let achou = false;
      for (const y of outra.linhas) {
        const junta = { ...x, ...y };
        if (junta[resolver(junta, a)] === junta[resolver(junta, b)]) {
          novas.push(junta);
          achou = true;
        }
      }
      if (!achou && esquerda) novas.push({ ...x, ...outra.vazia });
    }
    linhas = novas;
  }
  if (l.palavra('WHERE')) {
    const grupos = lerCondicoes(l);
    if (grupos.some((g) => g.some((c) => c.item.agg)))
      throw new Error('Funções como COUNT não funcionam no WHERE: use HAVING depois do GROUP BY.');
    linhas = linhas.filter((r) => passa(grupos, (it) => r[resolver(r, colunaDe(it))] ?? null));
  }
  let agrupar: string | null = null;
  if (l.palavra('GROUP')) {
    l.exigirPalavra('BY');
    agrupar = l.identificador();
  }
  let having: Cond[][] | null = null;
  if (l.palavra('HAVING')) {
    if (!agrupar) throw new Error('O HAVING precisa de um GROUP BY antes.');
    having = lerCondicoes(l);
  }
  let ordem: { item: Item; desc: boolean } | null = null;
  if (l.palavra('ORDER')) {
    l.exigirPalavra('BY');
    const item = lerItem(l);
    const desc = l.palavra('DESC');
    if (!desc) l.palavra('ASC');
    ordem = { item, desc };
  }
  let limite: number | null = null;
  if (l.palavra('LIMIT')) limite = Number(lerValor(l));
  l.simbolo(';');
  const sobra = l.ver();
  if (sobra) throw new Error(`Sobrou algo no fim: ${sobra.v}`);
  const reservada = itens.find((i) => i.col && !i.agg && RESERVADAS.includes(i.col.toUpperCase()));
  if (reservada) throw new Error(`Faltou uma vírgula perto de ${reservada.texto}.`);

  const temAgg = itens.some((i) => i.agg);
  let colunas: string[];
  let saida: Valor[][];
  let fontes: Linha[] | null = null;
  if (todas) {
    const chaves = linhas[0] ? Object.keys(linhas[0]) : [];
    colunas = chaves.map((k) => k.split('.')[1] ?? k);
    saida = linhas.map((r) => chaves.map((k) => r[k] ?? null));
  } else if (temAgg || agrupar) {
    colunas = itens.map((i) => i.alias ?? i.texto);
    let grupos: Linha[][];
    if (agrupar) {
      const chaveGrupo = agrupar;
      const naoAgg = itens.find(
        (i) => !i.agg && colunaDe(i).split('.').pop() !== chaveGrupo.split('.').pop(),
      );
      if (naoAgg)
        throw new Error(`"${naoAgg.texto}" precisa estar no GROUP BY ou dentro de COUNT/SUM/AVG.`);
      const mapa = new Map<Valor, Linha[]>();
      for (const r of linhas) {
        const k = r[resolver(r, chaveGrupo)] ?? null;
        mapa.set(k, [...(mapa.get(k) ?? []), r]);
      }
      grupos = [...mapa.values()];
    } else {
      if (itens.some((i) => !i.agg))
        throw new Error('Misturar colunas e COUNT/SUM sem GROUP BY não funciona.');
      grupos = [linhas];
    }
    const condHaving = having;
    if (condHaving)
      grupos = grupos.filter((g) => passa(condHaving, (it) => agregar([it], g)[0] ?? null));
    saida = grupos.map((g) => agregar(itens, g));
  } else {
    colunas = itens.map((i) => i.alias ?? i.texto);
    saida = linhas.map((r) => itens.map((i) => r[resolver(r, colunaDe(i))] ?? null));
    fontes = linhas;
  }
  if (distinto) {
    const vistos = new Set<string>();
    const novaSaida: Valor[][] = [];
    const novasFontes: Linha[] = [];
    saida.forEach((s, k) => {
      const chave = JSON.stringify(s);
      if (vistos.has(chave)) return;
      vistos.add(chave);
      novaSaida.push(s);
      if (fontes) novasFontes.push(pegar(fontes, k));
    });
    saida = novaSaida;
    if (fontes) fontes = novasFontes;
  }
  if (ordem) {
    const alvo = ordem.item;
    const nomes = [alvo.texto, alvo.col ?? ''].map((x) => x.toLowerCase());
    const idx = colunas.findIndex((c) => {
      const cl = c.toLowerCase();
      return nomes.some((n) => n !== '' && (cl === n || cl.endsWith('.' + n)));
    });
    const idxTexto = itens.findIndex((i) => i.texto.toLowerCase() === alvo.texto.toLowerCase());
    const pos = idx >= 0 ? idx : idxTexto;
    if (pos >= 0) {
      saida = [...saida].sort((p, q) => cmp(p[pos] ?? null, q[pos] ?? null));
      if (ordem.desc) saida.reverse();
    } else if (fontes && !alvo.agg) {
      const col = colunaDe(alvo);
      const pares = saida.map((s, k) => ({ s, r: pegar(fontes ?? [], k) }));
      pares.sort((p, q) => cmp(p.r[resolver(p.r, col)] ?? null, q.r[resolver(q.r, col)] ?? null));
      if (ordem.desc) pares.reverse();
      saida = pares.map((p) => p.s);
    } else throw new Error(`Não dá para ordenar por "${alvo.texto}": use uma coluna do resultado.`);
  }
  if (limite !== null) saida = saida.slice(0, limite);
  return { ok: true, colunas, linhas: saida };
}

function inserir(l: Leitor, tabelas: Tabelas): Resultado {
  l.exigirPalavra('INTO');
  const nome = l.identificador();
  const { chave, tb } = carregar(tabelas, nome);
  let colunas = tb.colunas;
  if (l.simbolo('(')) {
    colunas = [];
    do colunas.push(l.identificador());
    while (l.simbolo(','));
    l.exigirSimbolo(')');
    const ruim = colunas.find((c) => !tb.colunas.includes(c));
    if (ruim) throw new Error(`A tabela ${chave} não tem a coluna "${ruim}".`);
  }
  l.exigirPalavra('VALUES');
  const novas: Valor[][] = [];
  do {
    l.exigirSimbolo('(');
    const vals: Valor[] = [];
    do vals.push(lerValor(l));
    while (l.simbolo(','));
    l.exigirSimbolo(')');
    if (vals.length !== colunas.length)
      throw new Error(`Foram dados ${vals.length} valor(es) para ${colunas.length} coluna(s).`);
    novas.push(tb.colunas.map((c) => vals[colunas.indexOf(c)] ?? null));
  } while (l.simbolo(','));
  l.simbolo(';');
  if (l.ver()) throw new Error(`Sobrou algo no fim: ${l.ver()?.v ?? ''}`);
  const pk = tb.colunas.indexOf('id');
  for (const n of novas) {
    if (pk >= 0 && n[pk] === null) throw new Error('O id (chave primária) não pode ficar vazio.');
    if (pk >= 0 && tb.linhas.some((r) => r[pk] === n[pk]))
      throw new Error(
        `Já existe um registro com id ${textoSql(n[pk] ?? null)} (a chave primária não pode repetir).`,
      );
    tb.linhas.push(n);
  }
  return {
    ok: true,
    colunas: [],
    linhas: [],
    mensagem: `${novas.length} linha(s) inserida(s) em ${chave}.`,
  };
}

function filtrarTabela(l: Leitor, chave: string, tb: Tabela): number[] {
  const grupos = l.palavra('WHERE') ? lerCondicoes(l) : null;
  l.simbolo(';');
  if (l.ver()) throw new Error(`Sobrou algo no fim: ${l.ver()?.v ?? ''}`);
  const indices: number[] = [];
  tb.linhas.forEach((v, k) => {
    if (!grupos) return indices.push(k);
    const linha: Linha = Object.fromEntries(
      tb.colunas.map((c, i) => [`${chave}.${c}`, v[i] ?? null]),
    );
    if (grupos.some((g) => g.some((c) => c.item.agg)))
      throw new Error('COUNT e SUM não funcionam no WHERE.');
    if (passa(grupos, (it) => linha[resolver(linha, colunaDe(it))] ?? null)) indices.push(k);
  });
  return indices;
}

function atualizar(l: Leitor, tabelas: Tabelas): Resultado {
  const { chave, tb } = carregar(tabelas, l.identificador());
  l.exigirPalavra('SET');
  const trocas: { i: number; v: Valor }[] = [];
  do {
    const col = l.identificador();
    const i = tb.colunas.indexOf(col.split('.').pop() ?? col);
    if (i < 0) throw new Error(`A tabela ${chave} não tem a coluna "${col}".`);
    const t = l.ver();
    if (!t || t.t !== 'op' || t.v !== '=') throw new Error('Faltou o = depois do nome da coluna.');
    l.i++;
    trocas.push({ i, v: lerValor(l) });
  } while (l.simbolo(','));
  const alvo = filtrarTabela(l, chave, tb);
  if (trocas.some((t) => tb.colunas[t.i] === 'id') && alvo.length > 1)
    throw new Error('Trocar o id de várias linhas de uma vez geraria ids repetidos.');
  for (const k of alvo) for (const t of trocas) pegar(tb.linhas, k)[t.i] = t.v;
  return {
    ok: true,
    colunas: [],
    linhas: [],
    mensagem: `${alvo.length} linha(s) atualizada(s) em ${chave}.`,
  };
}

function apagar(l: Leitor, tabelas: Tabelas): Resultado {
  l.exigirPalavra('FROM');
  const { chave, tb } = carregar(tabelas, l.identificador());
  const alvo = new Set(filtrarTabela(l, chave, tb));
  tb.linhas = tb.linhas.filter((_, k) => !alvo.has(k));
  return {
    ok: true,
    colunas: [],
    linhas: [],
    mensagem: `${alvo.size} linha(s) apagada(s) de ${chave}.`,
  };
}

/**
 * Executa um comando. Devolve o resultado e o estado das tabelas depois dele
 * (INSERT, UPDATE e DELETE geram uma cópia alterada; a entrada nunca é mutada).
 */
export function executarSql(
  sql: string,
  tabelas: Tabelas = TABELAS,
): { resultado: Resultado; tabelas: Tabelas } {
  const copia = copiar(tabelas);
  try {
    const l = new Leitor(tokenizar(sql));
    const t = l.ver();
    const comando = t && t.t === 'id' ? t.v.toUpperCase() : '';
    l.i++;
    let resultado: Resultado;
    if (comando === 'SELECT') resultado = selecionar(l, copia);
    else if (comando === 'INSERT') resultado = inserir(l, copia);
    else if (comando === 'UPDATE') resultado = atualizar(l, copia);
    else if (comando === 'DELETE') resultado = apagar(l, copia);
    else throw new Error('Comece o comando com SELECT, INSERT, UPDATE ou DELETE.');
    return { resultado, tabelas: copia };
  } catch (e) {
    return { resultado: { ok: false, erro: (e as Error).message }, tabelas };
  }
}

/** Consulta sem alterar nada (as alterações são descartadas). */
export function consultar(sql: string, tabelas: Tabelas = TABELAS): Resultado {
  return executarSql(sql, tabelas).resultado;
}
