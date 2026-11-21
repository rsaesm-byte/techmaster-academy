/**
 * INTERPRETADOR DE PORTUGOL (subconjunto didático, estilo VisuAlg)
 *
 * Suporta: declaração de variáveis e vetores (var ... inicio ... fimalgoritmo, opcional),
 * atribuição (<-), escreva/escreval, leia, se/senao se/senao/fimse,
 * enquanto/fimenquanto, para/fimpara (com passo), repita/ate,
 * funções (funcao ... retorne ... fimfuncao), procedimentos e recursão,
 * divisão inteira (\) e as funções prontas abs, int, raizq, quad e compr.
 *
 * Em vez de só dar o resultado final, ele grava um RASTRO: o estado da memória,
 * da pilha de chamadas e da saída depois de cada passo. É isso que o Visualizador mostra.
 *
 * Limitações conhecidas: parâmetros só por valor (sem "var" em parâmetros), sem vetores
 * como parâmetro, sem matrizes e sem "escolha". Tudo isso entra em módulos futuros.
 */
import {
  avaliar,
  exprParaTexto,
  formatarValor,
  FUNCOES_NATIVAS,
  LeitorExpressao,
  type Ambiente,
  type Expr,
  type Valor,
} from '@/engines/portugol/expressao';
import { ErroPortugol, normalizar, tokenizar, type Token } from '@/engines/portugol/lexer';

export type TipoVar = 'inteiro' | 'real' | 'caractere' | 'logico';

type Bloco = Comando[];
type Comando =
  | { k: 'atrib'; linha: number; nome: string; chave: string; expr: Expr }
  | { k: 'atribIndice'; linha: number; nome: string; chave: string; idx: Expr; expr: Expr }
  | { k: 'escreva'; linha: number; args: Expr[] }
  | { k: 'leia'; linha: number; nome: string; chave: string; idx?: Expr }
  | {
      k: 'se';
      linha: number;
      ramos: { linha: number; cond: Expr; corpo: Bloco }[];
      senao?: { linha: number; corpo: Bloco };
    }
  | { k: 'enquanto'; linha: number; cond: Expr; corpo: Bloco }
  | {
      k: 'para';
      linha: number;
      nome: string;
      chave: string;
      de: Expr;
      ate: Expr;
      passo?: Expr;
      corpo: Bloco;
      linhaFim: number;
    }
  | { k: 'repita'; linha: number; corpo: Bloco; cond: Expr; linhaAte: number }
  | { k: 'chamada'; linha: number; nome: string; chave: string; args: Expr[] }
  | { k: 'retorne'; linha: number; expr?: Expr };

interface Declaracao {
  nome: string;
  tipo: TipoVar;
  vetor?: { inicio: number; fim: number };
}

interface Subrotina {
  nome: string;
  chave: string;
  tipo: 'funcao' | 'procedimento';
  linha: number;
  linhaFim: number;
  parametros: { nome: string; chave: string; tipo: TipoVar }[];
  retorno?: TipoVar;
  locais: Map<string, Declaracao>;
  corpo: Bloco;
}

export interface Programa {
  declaradas: Map<string, Declaracao>;
  temSecaoVar: boolean;
  subrotinas: Map<string, Subrotina>;
  corpo: Bloco;
}

// ---------- Leitura do programa ----------

interface Linha {
  numero: number;
  tokens: Token[];
  primeira: string;
}

const TIPOS: Record<string, TipoVar> = {
  inteiro: 'inteiro',
  real: 'real',
  caractere: 'caractere',
  caracter: 'caractere',
  logico: 'logico',
};

const CABECALHO = new Set(['algoritmo', 'var', 'funcao', 'procedimento', 'inicio']);

export function lerPrograma(fonte: string): Programa {
  const linhas: Linha[] = fonte
    .split('\n')
    .map((texto, i) => ({ numero: i + 1, tokens: tokenizar(texto, i + 1) }))
    .filter((l) => l.tokens.length > 0)
    .map((l) => ({ ...l, primeira: palavra(l.tokens[0]) }));

  const declaradas = new Map<string, Declaracao>();
  const subrotinas = new Map<string, Subrotina>();

  // Sem cabeçalho: o arquivo inteiro é o corpo (bom para exemplos curtos).
  if (!linhas.some((l) => l.primeira === 'inicio') || !CABECALHO.has(linhas[0]?.primeira ?? '')) {
    return { declaradas, temSecaoVar: false, subrotinas, corpo: lerBloco(linhas, { pos: 0 }, []) };
  }

  let temSecaoVar = false;
  const leitor = { pos: 0 };
  while (leitor.pos < linhas.length) {
    const l = linhas[leitor.pos] as Linha;
    if (l.primeira === 'algoritmo') {
      leitor.pos++;
    } else if (l.primeira === 'var') {
      temSecaoVar = true;
      leitor.pos++;
    } else if (l.primeira === 'funcao' || l.primeira === 'procedimento') {
      const s = lerSubrotina(linhas, leitor);
      if (subrotinas.has(s.chave))
        throw new ErroPortugol(s.linha, `Já existe uma sub-rotina chamada "${s.nome}".`);
      subrotinas.set(s.chave, s);
    } else if (l.primeira === 'inicio') {
      leitor.pos++;
      const corpo = lerBloco(linhas, leitor, ['fimalgoritmo']);
      if (leitor.pos >= linhas.length) {
        throw new ErroPortugol(linhas.at(-1)?.numero ?? 1, 'Faltou "fimalgoritmo" no final.');
      }
      return { declaradas, temSecaoVar, subrotinas, corpo };
    } else {
      lerDeclaracao(l, declaradas);
      temSecaoVar = true;
      leitor.pos++;
    }
  }
  throw new ErroPortugol(linhas.at(-1)?.numero ?? 1, 'Faltou o "inicio" do programa.');
}

function palavra(t: Token | undefined): string {
  return t?.tipo === 'id' ? t.norm : (t?.texto ?? '');
}

function lerTipo(
  tokens: Token[],
  linha: number,
): { tipo: TipoVar; vetor?: { inicio: number; fim: number } } {
  const primeiro = tokens[0];
  if (primeiro?.tipo === 'id' && primeiro.norm === 'vetor') {
    // vetor[1..10] de inteiro
    const [abre, ini, pontos, fim, fecha, de, tipoTok] = tokens.slice(1);
    const tipo = tipoTok?.tipo === 'id' ? TIPOS[tipoTok.norm] : undefined;
    if (
      abre?.texto !== '[' ||
      ini?.tipo !== 'num' ||
      pontos?.texto !== '..' ||
      fim?.tipo !== 'num' ||
      fecha?.texto !== ']' ||
      palavra(de) !== 'de' ||
      !tipo
    ) {
      throw new ErroPortugol(linha, 'Declare vetores assim: notas: vetor[1..5] de real');
    }
    if (fim.valor < ini.valor)
      throw new ErroPortugol(linha, 'O fim do vetor precisa ser maior ou igual ao início.');
    if (fim.valor - ini.valor >= 10000)
      throw new ErroPortugol(linha, 'Vetor grande demais (máximo 10 000 posições).');
    return { tipo, vetor: { inicio: ini.valor, fim: fim.valor } };
  }
  const tipo = primeiro?.tipo === 'id' ? TIPOS[primeiro.norm] : undefined;
  if (!tipo || tokens.length !== 1) {
    throw new ErroPortugol(
      linha,
      'Tipo inválido. Use inteiro, real, caractere, logico ou vetor[1..N] de <tipo>.',
    );
  }
  return { tipo };
}

function lerDeclaracao(l: Linha, declaradas: Map<string, Declaracao>) {
  const doisPontos = l.tokens.findIndex((t) => t.texto === ':');
  if (doisPontos < 1) {
    throw new ErroPortugol(l.numero, 'Declaração inválida. Use, por exemplo: "idade: inteiro".');
  }
  const { tipo, vetor } = lerTipo(l.tokens.slice(doisPontos + 1), l.numero);
  for (const t of l.tokens.slice(0, doisPontos)) {
    if (t.tipo === 'id')
      declaradas.set(t.norm, vetor ? { nome: t.texto, tipo, vetor } : { nome: t.texto, tipo });
    else if (t.texto !== ',')
      throw new ErroPortugol(l.numero, `Nome de variável inválido: "${t.texto}".`);
  }
}

function lerSubrotina(linhas: Linha[], leitor: { pos: number }): Subrotina {
  const l = linhas[leitor.pos++] as Linha;
  const tipo = l.primeira as 'funcao' | 'procedimento';
  const nomeTok = l.tokens[1];
  if (nomeTok?.tipo !== 'id') throw new ErroPortugol(l.numero, `Dê um nome ao ${tipo}.`);
  const t = l.tokens.slice(2);
  const parametros: Subrotina['parametros'] = [];
  let resto = t;
  if (t[0]?.texto === '(') {
    const fecha = t.findIndex((x) => x.texto === ')');
    if (fecha < 0) throw new ErroPortugol(l.numero, 'Faltou fechar os parênteses dos parâmetros.');
    const dentro = t.slice(1, fecha);
    resto = t.slice(fecha + 1);
    // Grupos separados por ";": a, b: inteiro; c: real
    const grupos: Token[][] = [[]];
    for (const tok of dentro) {
      if (tok.texto === ';') grupos.push([]);
      else grupos.at(-1)?.push(tok);
    }
    for (const g of grupos.filter((x) => x.length > 0)) {
      if (palavra(g[0]) === 'var') {
        throw new ErroPortugol(
          l.numero,
          'Parâmetros por referência ("var") ainda não são suportados.',
        );
      }
      const dp = g.findIndex((x) => x.texto === ':');
      const tipoTok = g[dp + 1];
      const tp = tipoTok?.tipo === 'id' ? TIPOS[tipoTok.norm] : undefined;
      if (dp < 1 || !tp)
        throw new ErroPortugol(l.numero, 'Parâmetros assim: (a, b: inteiro; nome: caractere)');
      for (const p of g.slice(0, dp))
        if (p.tipo === 'id') parametros.push({ nome: p.texto, chave: p.norm, tipo: tp });
    }
  }
  let retorno: TipoVar | undefined;
  if (tipo === 'funcao') {
    const tr = resto[1];
    retorno = resto[0]?.texto === ':' && tr?.tipo === 'id' ? TIPOS[tr.norm] : undefined;
    if (!retorno)
      throw new ErroPortugol(
        l.numero,
        'Diga o tipo que a função devolve: funcao dobro(x: inteiro): inteiro',
      );
  }
  const locais = new Map<string, Declaracao>();
  const fim = tipo === 'funcao' ? 'fimfuncao' : 'fimprocedimento';
  while (leitor.pos < linhas.length && (linhas[leitor.pos] as Linha).primeira !== 'inicio') {
    const d = linhas[leitor.pos++] as Linha;
    if (d.primeira === 'var') continue;
    lerDeclaracao(d, locais);
  }
  if (leitor.pos >= linhas.length)
    throw new ErroPortugol(l.numero, `Faltou "inicio" dentro de ${nomeTok.texto}.`);
  leitor.pos++;
  const corpo = lerBloco(linhas, leitor, [fim]);
  const linhaFim = (linhas[leitor.pos++] as Linha).numero;
  return {
    nome: nomeTok.texto,
    chave: nomeTok.norm,
    tipo,
    linha: l.numero,
    linhaFim,
    parametros,
    ...(retorno ? { retorno } : {}),
    locais,
    corpo,
  };
}

/** Lê comandos até encontrar uma das palavras de fechamento esperadas. */
function lerBloco(linhas: Linha[], leitor: { pos: number }, fechamentos: string[]): Bloco {
  const bloco: Bloco = [];
  while (leitor.pos < linhas.length) {
    const l = linhas[leitor.pos] as Linha;
    if (fechamentos.includes(l.primeira)) return bloco;
    leitor.pos++;
    bloco.push(lerComando(l, linhas, leitor));
  }
  if (fechamentos.length > 0) {
    throw new ErroPortugol(
      linhas.at(-1)?.numero ?? 1,
      `Faltou fechar o bloco com "${fechamentos.at(-1)}".`,
    );
  }
  return bloco;
}

function exigir(l: Linha, tokens: Token[], palavraFinal: string): Token[] {
  const ultima = tokens.at(-1);
  if (!ultima || palavra(ultima) !== palavraFinal) {
    throw new ErroPortugol(l.numero, `Faltou "${palavraFinal}" no fim da linha.`);
  }
  return tokens.slice(0, -1);
}

function expr(tokens: Token[], linha: number): Expr {
  if (tokens.length === 0) throw new ErroPortugol(linha, 'Faltou a expressão.');
  return new LeitorExpressao(tokens, linha).lerTudo();
}

function lerComando(l: Linha, linhas: Linha[], leitor: { pos: number }): Comando {
  const t = l.tokens;
  switch (l.primeira) {
    case 'escreva':
    case 'escreval':
      return { k: 'escreva', linha: l.numero, args: lerArgumentos(t.slice(1), l.numero) };
    case 'leia': {
      const args = t.slice(1);
      if (args[0]?.texto !== '(' || args.at(-1)?.texto !== ')')
        throw new ErroPortugol(l.numero, 'Use leia(nomeDaVariavel).');
      const alvo = expr(args.slice(1, -1), l.numero);
      if (alvo.k === 'var')
        return { k: 'leia', linha: l.numero, nome: alvo.nome, chave: alvo.chave };
      if (alvo.k === 'indice')
        return { k: 'leia', linha: l.numero, nome: alvo.nome, chave: alvo.chave, idx: alvo.idx };
      throw new ErroPortugol(
        l.numero,
        'leia(...) precisa de uma variável ou de um elemento de vetor.',
      );
    }
    case 'retorne':
      return t.length > 1
        ? { k: 'retorne', linha: l.numero, expr: expr(t.slice(1), l.numero) }
        : { k: 'retorne', linha: l.numero };
    case 'se': {
      const primeiraCond = expr(exigir(l, t.slice(1), 'entao'), l.numero);
      const ramos = [
        {
          linha: l.numero,
          cond: primeiraCond,
          corpo: lerBloco(linhas, leitor, ['senao', 'fimse']),
        },
      ];
      let senao: { linha: number; corpo: Bloco } | undefined;
      for (;;) {
        const atual = linhas[leitor.pos] as Linha;
        leitor.pos++;
        if (atual.primeira === 'fimse') break;
        // "senao se ... entao" continua a cadeia; "senao" sozinho é o último ramo.
        if (palavra(atual.tokens[1]) === 'se') {
          const cond = expr(exigir(atual, atual.tokens.slice(2), 'entao'), atual.numero);
          ramos.push({
            linha: atual.numero,
            cond,
            corpo: lerBloco(linhas, leitor, ['senao', 'fimse']),
          });
        } else {
          if (atual.tokens.length > 1) {
            throw new ErroPortugol(
              atual.numero,
              'Depois de "senao" vem uma nova linha (ou "senao se ... entao").',
            );
          }
          senao = { linha: atual.numero, corpo: lerBloco(linhas, leitor, ['fimse']) };
          leitor.pos++;
          break;
        }
      }
      return senao
        ? { k: 'se', linha: l.numero, ramos, senao }
        : { k: 'se', linha: l.numero, ramos };
    }
    case 'enquanto': {
      const cond = expr(exigir(l, t.slice(1), 'faca'), l.numero);
      const corpo = lerBloco(linhas, leitor, ['fimenquanto']);
      leitor.pos++;
      return { k: 'enquanto', linha: l.numero, cond, corpo };
    }
    case 'para': {
      const resto = exigir(l, t.slice(1), 'faca');
      const varTok = resto[0];
      const iDe = resto.findIndex((x) => palavra(x) === 'de');
      const iAte = resto.findIndex((x) => palavra(x) === 'ate');
      const iPasso = resto.findIndex((x) => palavra(x) === 'passo');
      if (varTok?.tipo !== 'id' || iDe !== 1 || iAte < 0) {
        throw new ErroPortugol(l.numero, 'Use: para i de 1 ate 10 faca  (opcional: passo 2).');
      }
      const de = expr(resto.slice(iDe + 1, iAte), l.numero);
      const ate = expr(resto.slice(iAte + 1, iPasso > 0 ? iPasso : undefined), l.numero);
      const corpo = lerBloco(linhas, leitor, ['fimpara']);
      const fim = linhas[leitor.pos++] as Linha;
      const base = {
        k: 'para' as const,
        linha: l.numero,
        nome: varTok.texto,
        chave: varTok.norm,
        de,
        ate,
        corpo,
        linhaFim: fim.numero,
      };
      return iPasso > 0 ? { ...base, passo: expr(resto.slice(iPasso + 1), l.numero) } : base;
    }
    case 'repita': {
      const corpo = lerBloco(linhas, leitor, ['ate']);
      const fim = linhas[leitor.pos++] as Linha;
      return {
        k: 'repita',
        linha: l.numero,
        corpo,
        cond: expr(fim.tokens.slice(1), fim.numero),
        linhaAte: fim.numero,
      };
    }
    case 'fimse':
    case 'fimenquanto':
    case 'fimpara':
    case 'fimfuncao':
    case 'fimprocedimento':
    case 'senao':
    case 'ate':
      throw new ErroPortugol(l.numero, `"${t[0]?.texto}" sem o bloco correspondente aberto antes.`);
    default: {
      const alvo = t[0];
      const seta = t.findIndex((x) => x.texto === '<-');
      if (alvo?.tipo === 'id' && seta > 0) {
        const esquerda = expr(t.slice(0, seta), l.numero);
        const direita = expr(t.slice(seta + 1), l.numero);
        if (esquerda.k === 'var')
          return {
            k: 'atrib',
            linha: l.numero,
            nome: esquerda.nome,
            chave: esquerda.chave,
            expr: direita,
          };
        if (esquerda.k === 'indice') {
          return {
            k: 'atribIndice',
            linha: l.numero,
            nome: esquerda.nome,
            chave: esquerda.chave,
            idx: esquerda.idx,
            expr: direita,
          };
        }
        throw new ErroPortugol(
          l.numero,
          'Do lado esquerdo do "<-" vai uma variável ou um elemento de vetor.',
        );
      }
      if (alvo?.tipo === 'id' && t[1]?.texto === '=') {
        throw new ErroPortugol(
          l.numero,
          `Para guardar um valor use "<-": ${alvo.texto} <- ...  ("=" é comparação).`,
        );
      }
      if (alvo?.tipo === 'id' && (t.length === 1 || t[1]?.texto === '(')) {
        const chamada: Expr =
          t.length === 1
            ? { k: 'chamada', nome: alvo.texto, chave: alvo.norm, args: [] }
            : expr(t, l.numero);
        if (chamada.k === 'chamada') {
          return {
            k: 'chamada',
            linha: l.numero,
            nome: chamada.nome,
            chave: chamada.chave,
            args: chamada.args,
          };
        }
      }
      throw new ErroPortugol(
        l.numero,
        `Não reconheci o comando "${t.map((x) => x.texto).join(' ')}".`,
      );
    }
  }
}

function lerArgumentos(t: Token[], linha: number): Expr[] {
  if (t[0]?.texto !== '(' || t.at(-1)?.texto !== ')') {
    throw new ErroPortugol(linha, 'Use escreva( ... ) com parênteses.');
  }
  const dentro = t.slice(1, -1);
  if (dentro.length === 0) return [];
  const args: Expr[] = [];
  let profundidade = 0;
  let inicio = 0;
  dentro.forEach((tok, i) => {
    if (tok.texto === '(' || tok.texto === '[') profundidade++;
    if (tok.texto === ')' || tok.texto === ']') profundidade--;
    if (tok.texto === ',' && profundidade === 0) {
      args.push(expr(dentro.slice(inicio, i), linha));
      inicio = i + 1;
    }
  });
  args.push(expr(dentro.slice(inicio), linha));
  return args;
}

// ---------- Execução com rastro ----------

export interface VariavelRastro {
  chave: string;
  nome: string;
  tipo?: TipoVar;
  valor: Valor | undefined;
  /** Presente quando a variável é um vetor. */
  vetor?: { inicio: number; elementos: (Valor | undefined)[] };
}

export interface QuadroRastro {
  nome: string;
  variaveis: VariavelRastro[];
}

export interface Passo {
  linha: number;
  descricao: string;
  /** Variáveis do programa principal (globais). */
  variaveis: VariavelRastro[];
  /** Pilha de chamadas: [programa principal, ...sub-rotinas ativas]. */
  pilha: QuadroRastro[];
  saida: string[];
  /** Variável que mudou neste passo (para destacar). */
  mudou?: string;
  /** Posição do vetor que mudou. */
  mudouIndice?: number;
}

export interface Execucao {
  passos: Passo[];
  saida: string[];
  erro?: { linha: number; mensagem: string };
  /** Entradas que sobraram sem ser lidas. */
  entradasRestantes: string[];
}

export const LIMITE_PASSOS = 2000;
const LIMITE_PILHA = 200;

class LimiteExcedido extends Error {}
class Retorno {
  constructor(public readonly valor: Valor | undefined) {}
}

interface Quadro {
  nome: string;
  vars: Map<string, VariavelRastro>;
  ordem: string[];
}

function criarVariavel(chave: string, d: Declaracao): VariavelRastro {
  return d.vetor
    ? {
        chave,
        nome: d.nome,
        tipo: d.tipo,
        valor: undefined,
        vetor: {
          inicio: d.vetor.inicio,
          elementos: Array<Valor | undefined>(d.vetor.fim - d.vetor.inicio + 1).fill(undefined),
        },
      }
    : { chave, nome: d.nome, tipo: d.tipo, valor: undefined };
}

function copiar(v: VariavelRastro): VariavelRastro {
  return v.vetor
    ? { ...v, vetor: { inicio: v.vetor.inicio, elementos: [...v.vetor.elementos] } }
    : { ...v };
}

export function executar(fonte: string, entradas: string[] = [], limite = LIMITE_PASSOS): Execucao {
  const passos: Passo[] = [];
  const saida: string[] = [];
  const fila = [...entradas];
  let programa: Programa;
  try {
    programa = lerPrograma(fonte);
  } catch (e) {
    if (e instanceof ErroPortugol)
      return {
        passos,
        saida,
        erro: { linha: e.linha, mensagem: e.message },
        entradasRestantes: fila,
      };
    throw e;
  }

  const global: Quadro = { nome: 'Programa principal', vars: new Map(), ordem: [] };
  for (const [chave, d] of programa.declaradas) {
    global.vars.set(chave, criarVariavel(chave, d));
    global.ordem.push(chave);
  }
  const pilha: Quadro[] = [global];
  const topo = () => pilha.at(-1) as Quadro;

  const instantaneo = (q: Quadro) => q.ordem.map((c) => copiar(q.vars.get(c) as VariavelRastro));
  const registrar = (linha: number, descricao: string, mudou?: string, mudouIndice?: number) => {
    if (passos.length >= limite) throw new LimiteExcedido();
    passos.push({
      linha,
      descricao,
      variaveis: instantaneo(global),
      pilha: pilha.map((q) => ({ nome: q.nome, variaveis: instantaneo(q) })),
      saida: [...saida],
      ...(mudou ? { mudou } : {}),
      ...(mudouIndice !== undefined ? { mudouIndice } : {}),
    });
  };

  /** Procura a variável no quadro atual e depois no programa principal. */
  const achar = (chave: string): VariavelRastro | undefined =>
    topo().vars.get(chave) ?? global.vars.get(chave);

  const ler = (chave: string, nome: string, linha: number): Valor => {
    const v = achar(chave);
    if (!v) {
      if (programa.subrotinas.has(chave)) {
        throw new ErroPortugol(
          linha,
          `"${nome}" é uma sub-rotina: chame com parênteses, ${nome}(...).`,
        );
      }
      throw new ErroPortugol(
        linha,
        programa.temSecaoVar
          ? `A variável "${nome}" não foi declarada.`
          : `A variável "${nome}" ainda não existe: dê um valor a ela antes de usar.`,
      );
    }
    if (v.vetor)
      throw new ErroPortugol(
        linha,
        `"${nome}" é um vetor: use ${nome}[posição] para pegar um elemento.`,
      );
    if (v.valor === undefined)
      throw new ErroPortugol(linha, `A variável "${nome}" foi usada antes de receber um valor.`);
    return v.valor;
  };

  const posicao = (v: VariavelRastro, i: number, linha: number): number => {
    const vet = v.vetor;
    if (!vet) throw new ErroPortugol(linha, `"${v.nome}" não é um vetor.`);
    const fim = vet.inicio + vet.elementos.length - 1;
    if (i < vet.inicio || i > fim) {
      throw new ErroPortugol(
        linha,
        `Posição ${i} fora do vetor "${v.nome}", que vai de ${vet.inicio} a ${fim}.`,
      );
    }
    return i - vet.inicio;
  };

  const lerIndice = (chave: string, nome: string, i: number, linha: number): Valor => {
    const v = achar(chave);
    if (!v) throw new ErroPortugol(linha, `O vetor "${nome}" não foi declarado.`);
    const valor = v.vetor?.elementos[posicao(v, i, linha)];
    if (valor === undefined)
      throw new ErroPortugol(linha, `${nome}[${i}] foi usado antes de receber um valor.`);
    return valor;
  };

  const guardar = (chave: string, nome: string, valor: Valor, linha: number) => {
    let v = achar(chave);
    if (!v) {
      if (programa.temSecaoVar)
        throw new ErroPortugol(linha, `A variável "${nome}" não foi declarada.`);
      v = { chave, nome, valor: undefined };
      topo().vars.set(chave, v);
      topo().ordem.push(chave);
    }
    if (v.vetor)
      throw new ErroPortugol(
        linha,
        `"${nome}" é um vetor: guarde em uma posição, como ${nome}[1] <- ...`,
      );
    conferirTipo(v.nome, v.tipo, valor, linha);
    v.valor = valor;
  };

  const guardarIndice = (chave: string, nome: string, i: number, valor: Valor, linha: number) => {
    const v = achar(chave);
    if (!v?.vetor) throw new ErroPortugol(linha, `O vetor "${nome}" não foi declarado.`);
    const p = posicao(v, i, linha);
    conferirTipo(`${nome}[${i}]`, v.tipo, valor, linha);
    v.vetor.elementos[p] = valor;
  };

  const chamar = (
    chave: string,
    nome: string,
    args: Valor[],
    linha: number,
    comoComando: boolean,
  ): Valor | undefined => {
    const s = programa.subrotinas.get(chave);
    if (!s) {
      const nativa = FUNCOES_NATIVAS[chave];
      if (nativa && !comoComando) return nativa(args, linha);
      throw new ErroPortugol(
        linha,
        `"${nome}" não existe. Confira o nome da função ou do procedimento.`,
      );
    }
    if (!comoComando && s.tipo === 'procedimento') {
      throw new ErroPortugol(
        linha,
        `"${s.nome}" é um procedimento e não devolve valor; chame-o numa linha sozinho.`,
      );
    }
    if (args.length !== s.parametros.length) {
      throw new ErroPortugol(
        linha,
        `${s.nome} espera ${s.parametros.length} valor(es), mas recebeu ${args.length}.`,
      );
    }
    if (pilha.length >= LIMITE_PILHA) {
      throw new ErroPortugol(
        linha,
        `Mais de ${LIMITE_PILHA} chamadas ativas: a recursão de "${s.nome}" parece não ter caso base.`,
      );
    }
    const quadro: Quadro = {
      nome: `${s.nome}(${args.map((a) => formatarValor(a, true)).join(', ')})`,
      vars: new Map(),
      ordem: [],
    };
    s.parametros.forEach((p, i) => {
      const v = args[i] as Valor;
      conferirTipo(p.nome, p.tipo, v, linha);
      quadro.vars.set(p.chave, { chave: p.chave, nome: p.nome, tipo: p.tipo, valor: v });
      quadro.ordem.push(p.chave);
    });
    for (const [c, d] of s.locais) {
      quadro.vars.set(c, criarVariavel(c, d));
      quadro.ordem.push(c);
    }
    pilha.push(quadro);
    registrar(s.linha, `Chama ${quadro.nome}: os parâmetros recebem os valores`);
    try {
      rodar(s.corpo);
    } catch (e) {
      if (!(e instanceof Retorno)) throw e;
      pilha.pop();
      if (s.tipo === 'funcao') {
        if (e.valor === undefined) {
          throw new ErroPortugol(
            s.linhaFim,
            `A função "${s.nome}" precisa devolver um valor: retorne <valor>.`,
          );
        }
        conferirTipo(`o retorno de ${s.nome}`, s.retorno, e.valor, s.linhaFim);
      }
      registrar(
        linha,
        e.valor === undefined
          ? `${quadro.nome} terminou`
          : `${quadro.nome} devolveu ${formatarValor(e.valor, true)}`,
      );
      return e.valor;
    }
    if (s.tipo === 'funcao')
      throw new ErroPortugol(s.linhaFim, `A função "${s.nome}" terminou sem "retorne".`);
    pilha.pop();
    registrar(s.linhaFim, `Fim de ${quadro.nome}: volta para quem chamou`);
    return undefined;
  };

  const ambiente = (linha: number): Ambiente => ({
    variavel: (c, n) => ler(c, n, linha),
    indice: (c, n, i) => lerIndice(c, n, i, linha),
    chamar: (c, n, args) => chamar(c, n, args, linha, false) as Valor,
  });
  const calc = (e: Expr, linha: number) => avaliar(e, ambiente(linha), linha);
  const indiceDe = (e: Expr, nome: string, linha: number): number => {
    const i = calc(e, linha);
    if (typeof i !== 'number' || !Number.isInteger(i)) {
      throw new ErroPortugol(
        linha,
        `O índice de ${nome}[...] precisa ser um número inteiro, mas foi ${formatarValor(i, true)}.`,
      );
    }
    return i;
  };

  const condicao = (e: Expr, linha: number): boolean => {
    const v = calc(e, linha);
    if (typeof v !== 'boolean') {
      throw new ErroPortugol(
        linha,
        `A condição "${exprParaTexto(e)}" deveria dar VERDADEIRO ou FALSO, mas deu ${formatarValor(v, true)}.`,
      );
    }
    return v;
  };

  const rodar = (bloco: Bloco) => {
    for (const c of bloco) rodarComando(c);
  };

  const rodarComando = (c: Comando) => {
    switch (c.k) {
      case 'atrib': {
        const v = calc(c.expr, c.linha);
        guardar(c.chave, c.nome, v, c.linha);
        registrar(c.linha, `${c.nome} recebe ${formatarValor(v, true)}`, c.chave);
        return;
      }
      case 'atribIndice': {
        const i = indiceDe(c.idx, c.nome, c.linha);
        const v = calc(c.expr, c.linha);
        guardarIndice(c.chave, c.nome, i, v, c.linha);
        registrar(c.linha, `${c.nome}[${i}] recebe ${formatarValor(v, true)}`, c.chave, i);
        return;
      }
      case 'escreva': {
        const texto = c.args.map((a) => formatarValor(calc(a, c.linha))).join('');
        saida.push(texto);
        registrar(c.linha, `Escreve na tela: ${texto}`);
        return;
      }
      case 'leia': {
        const bruto = fila.shift();
        if (bruto === undefined) {
          throw new ErroPortugol(
            c.linha,
            `leia(${c.nome}) precisa de uma entrada, mas a lista de entradas acabou.`,
          );
        }
        const valor = converterEntrada(bruto, achar(c.chave)?.tipo, c.linha);
        if (c.idx) {
          const i = indiceDe(c.idx, c.nome, c.linha);
          guardarIndice(c.chave, c.nome, i, valor, c.linha);
          registrar(c.linha, `Lê a entrada ${bruto} e guarda em ${c.nome}[${i}]`, c.chave, i);
        } else {
          guardar(c.chave, c.nome, valor, c.linha);
          registrar(c.linha, `Lê a entrada ${bruto} e guarda em ${c.nome}`, c.chave);
        }
        return;
      }
      case 'chamada': {
        const args = c.args.map((a) => calc(a, c.linha));
        chamar(c.chave, c.nome, args, c.linha, true);
        return;
      }
      case 'retorne': {
        if (pilha.length === 1)
          throw new ErroPortugol(c.linha, '"retorne" só pode ser usado dentro de uma função.');
        const v = c.expr ? calc(c.expr, c.linha) : undefined;
        registrar(c.linha, v === undefined ? 'Retorna' : `Retorna ${formatarValor(v, true)}`);
        throw new Retorno(v);
      }
      case 'se': {
        for (const ramo of c.ramos) {
          const ok = condicao(ramo.cond, ramo.linha);
          registrar(
            ramo.linha,
            `Condição ${exprParaTexto(ramo.cond)} é ${ok ? 'VERDADEIRA: entra neste bloco' : 'FALSA'}`,
          );
          if (ok) return rodar(ramo.corpo);
        }
        if (c.senao) {
          registrar(c.senao.linha, 'Nenhuma condição foi verdadeira: executa o senao');
          rodar(c.senao.corpo);
        }
        return;
      }
      case 'enquanto': {
        for (;;) {
          const ok = condicao(c.cond, c.linha);
          registrar(
            c.linha,
            `Condição ${exprParaTexto(c.cond)} é ${ok ? 'VERDADEIRA: executa o bloco' : 'FALSA: sai da repetição'}`,
          );
          if (!ok) return;
          rodar(c.corpo);
        }
      }
      case 'para': {
        const inicio = calc(c.de, c.linha);
        const fim = calc(c.ate, c.linha);
        const passo = c.passo ? calc(c.passo, c.linha) : 1;
        if (typeof inicio !== 'number' || typeof fim !== 'number' || typeof passo !== 'number') {
          throw new ErroPortugol(c.linha, 'No "para", início, fim e passo precisam ser números.');
        }
        if (passo === 0) throw new ErroPortugol(c.linha, 'O passo do "para" não pode ser 0.');
        guardar(c.chave, c.nome, inicio, c.linha);
        registrar(c.linha, `${c.nome} começa em ${formatarValor(inicio)}`, c.chave);
        for (;;) {
          const atual = ler(c.chave, c.nome, c.linha) as number;
          const continua = passo > 0 ? atual <= fim : atual >= fim;
          registrar(
            c.linha,
            `${c.nome} = ${formatarValor(atual)}: ${
              continua
                ? `ainda ${passo > 0 ? '<=' : '>='} ${formatarValor(fim)}, executa o bloco`
                : `passou de ${formatarValor(fim)}, sai da repetição`
            }`,
          );
          if (!continua) return;
          rodar(c.corpo);
          guardar(
            c.chave,
            c.nome,
            (ler(c.chave, c.nome, c.linhaFim) as number) + passo,
            c.linhaFim,
          );
          registrar(
            c.linhaFim,
            `${c.nome} aumenta ${formatarValor(passo)} e passa a ${formatarValor(ler(c.chave, c.nome, c.linhaFim))}`,
            c.chave,
          );
        }
      }
      case 'repita': {
        for (;;) {
          rodar(c.corpo);
          const ok = condicao(c.cond, c.linhaAte);
          registrar(
            c.linhaAte,
            `Condição ${exprParaTexto(c.cond)} é ${ok ? 'VERDADEIRA: para de repetir' : 'FALSA: repete de novo'}`,
          );
          if (ok) return;
        }
      }
    }
  };

  try {
    rodar(programa.corpo);
  } catch (e) {
    if (e instanceof LimiteExcedido) {
      const ultima = passos.at(-1)?.linha ?? 1;
      return {
        passos,
        saida,
        erro: {
          linha: ultima,
          mensagem: `Parei depois de ${limite} passos: parece um laço que nunca termina. Confira se a condição de parada muda dentro da repetição.`,
        },
        entradasRestantes: fila,
      };
    }
    if (e instanceof ErroPortugol) {
      return {
        passos,
        saida,
        erro: { linha: e.linha, mensagem: e.message },
        entradasRestantes: fila,
      };
    }
    throw e;
  }
  return { passos, saida, entradasRestantes: fila };
}

function conferirTipo(nome: string, tipo: TipoVar | undefined, valor: Valor, linha: number) {
  if (!tipo) return;
  const ok =
    (tipo === 'inteiro' && typeof valor === 'number' && Number.isInteger(valor)) ||
    (tipo === 'real' && typeof valor === 'number') ||
    (tipo === 'caractere' && typeof valor === 'string') ||
    (tipo === 'logico' && typeof valor === 'boolean');
  if (!ok) {
    throw new ErroPortugol(
      linha,
      `"${nome}" é do tipo ${tipo}, mas recebeu ${formatarValor(valor, true)}.`,
    );
  }
}

function converterEntrada(bruto: string, tipo: TipoVar | undefined, linha: number): Valor {
  const texto = bruto.trim();
  const numero = Number(texto.replace(',', '.'));
  if (tipo === 'caractere') return bruto;
  if (tipo === 'logico') {
    const n = normalizar(texto);
    if (n === 'verdadeiro') return true;
    if (n === 'falso') return false;
    throw new ErroPortugol(linha, `A entrada "${bruto}" não é VERDADEIRO nem FALSO.`);
  }
  if (tipo === 'inteiro' || tipo === 'real') {
    if (texto === '' || Number.isNaN(numero))
      throw new ErroPortugol(linha, `A entrada "${bruto}" não é um número.`);
    return numero;
  }
  return texto !== '' && !Number.isNaN(numero) ? numero : bruto;
}

// Reexporta para quem só precisa do interpretador.
export { ErroPortugol } from '@/engines/portugol/lexer';
