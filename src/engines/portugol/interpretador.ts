/**
 * INTERPRETADOR DE PORTUGOL (subconjunto didático, estilo VisuAlg)
 *
 * Suporta: declaração de variáveis (var ... inicio ... fimalgoritmo, opcional),
 * atribuição (<-), escreva/escreval, leia, se/senao se/senao/fimse,
 * enquanto/fimenquanto, para/fimpara (com passo), repita/ate.
 *
 * Em vez de só dar o resultado final, ele grava um RASTRO: o estado de todas as
 * variáveis e da saída depois de cada passo. É isso que o Visualizador mostra.
 *
 * Limitações conhecidas (documentadas para o aluno): sem vetores, funções,
 * procedimentos, "escolha" nem divisão inteira "\". Isso entra em módulos futuros.
 */
import {
  avaliar,
  exprParaTexto,
  formatarValor,
  LeitorExpressao,
  type Expr,
  type Valor,
} from '@/engines/portugol/expressao';
import { ErroPortugol, normalizar, tokenizar, type Token } from '@/engines/portugol/lexer';

export type TipoVar = 'inteiro' | 'real' | 'caractere' | 'logico';

type Bloco = Comando[];
type Comando =
  | { k: 'atrib'; linha: number; nome: string; chave: string; expr: Expr }
  | { k: 'escreva'; linha: number; args: Expr[]; quebra: boolean }
  | { k: 'leia'; linha: number; nome: string; chave: string }
  | {
      k: 'se';
      linha: number;
      ramos: { linha: number; cond: Expr; corpo: Bloco }[];
      senao?: { linha: number; corpo: Bloco };
    }
  | { k: 'enquanto'; linha: number; cond: Expr; corpo: Bloco; linhaFim: number }
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
  | { k: 'repita'; linha: number; corpo: Bloco; cond: Expr; linhaAte: number };

export interface Programa {
  declaradas: Map<string, { nome: string; tipo: TipoVar }>;
  temSecaoVar: boolean;
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

export function lerPrograma(fonte: string): Programa {
  const linhas: Linha[] = fonte
    .split('\n')
    .map((texto, i) => ({ numero: i + 1, tokens: tokenizar(texto, i + 1) }))
    .filter((l) => l.tokens.length > 0)
    .map((l) => ({ ...l, primeira: palavra(l.tokens[0]) }));

  const declaradas = new Map<string, { nome: string; tipo: TipoVar }>();
  let temSecaoVar = false;
  let inicioCorpo = 0;
  let fimCorpo = linhas.length;

  const idxInicio = linhas.findIndex((l) => l.primeira === 'inicio');
  if (idxInicio >= 0) {
    inicioCorpo = idxInicio + 1;
    const idxFim = linhas.findIndex((l) => l.primeira === 'fimalgoritmo');
    if (idxFim === -1) {
      throw new ErroPortugol(linhas.at(-1)?.numero ?? 1, 'Faltou "fimalgoritmo" no final.');
    }
    fimCorpo = idxFim;
    for (const l of linhas.slice(0, idxInicio)) {
      if (l.primeira === 'algoritmo') continue;
      if (l.primeira === 'var') {
        temSecaoVar = true;
        continue;
      }
      lerDeclaracao(l, declaradas);
      temSecaoVar = true;
    }
  }

  const corpoLinhas = linhas.slice(inicioCorpo, fimCorpo);
  const leitor = { pos: 0 };
  const corpo = lerBloco(corpoLinhas, leitor, []);
  return { declaradas, temSecaoVar, corpo };
}

function palavra(t: Token | undefined): string {
  return t?.tipo === 'id' ? t.norm : (t?.texto ?? '');
}

function lerDeclaracao(l: Linha, declaradas: Programa['declaradas']) {
  const doisPontos = l.tokens.findIndex((t) => t.texto === ':');
  const tipoTok = l.tokens[doisPontos + 1];
  const tipo = tipoTok?.tipo === 'id' ? TIPOS[tipoTok.norm] : undefined;
  if (doisPontos < 1 || !tipo) {
    throw new ErroPortugol(
      l.numero,
      'Declaração inválida. Use, por exemplo: "idade: inteiro" (tipos: inteiro, real, caractere, logico).',
    );
  }
  for (const t of l.tokens.slice(0, doisPontos)) {
    if (t.tipo === 'id') declaradas.set(t.norm, { nome: t.texto, tipo });
    else if (t.texto !== ',')
      throw new ErroPortugol(l.numero, `Nome de variável inválido: "${t.texto}".`);
  }
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
      `Faltou fechar o bloco com "${fechamentos.filter((f) => f.startsWith('fim') || f === 'ate')[0] ?? fechamentos[0]}".`,
    );
  }
  return bloco;
}

function exigir(l: Linha, tokens: Token[], palavraFinal: string, aceitas: string[]): Token[] {
  const ultima = tokens.at(-1);
  if (!ultima || !aceitas.includes(palavra(ultima))) {
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
      return {
        k: 'escreva',
        linha: l.numero,
        args: lerArgumentos(t.slice(1), l.numero),
        quebra: true,
      };
    case 'leia': {
      const args = t.slice(1);
      const alvo = args[1];
      if (args[0]?.texto !== '(' || alvo?.tipo !== 'id' || args[2]?.texto !== ')') {
        throw new ErroPortugol(l.numero, 'Use leia(nomeDaVariavel).');
      }
      return { k: 'leia', linha: l.numero, nome: alvo.texto, chave: alvo.norm };
    }
    case 'se': {
      const primeiraCond = expr(exigir(l, t.slice(1), 'entao', ['entao']), l.numero);
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
          const cond = expr(exigir(atual, atual.tokens.slice(2), 'entao', ['entao']), atual.numero);
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
      const cond = expr(exigir(l, t.slice(1), 'faca', ['faca']), l.numero);
      const corpo = lerBloco(linhas, leitor, ['fimenquanto']);
      const fim = linhas[leitor.pos++] as Linha;
      return { k: 'enquanto', linha: l.numero, cond, corpo, linhaFim: fim.numero };
    }
    case 'para': {
      const resto = exigir(l, t.slice(1), 'faca', ['faca']);
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
    case 'senao':
    case 'ate':
      throw new ErroPortugol(l.numero, `"${t[0]?.texto}" sem o bloco correspondente aberto antes.`);
    default: {
      const alvo = t[0];
      if (alvo?.tipo === 'id' && t[1]?.texto === '<-') {
        return {
          k: 'atrib',
          linha: l.numero,
          nome: alvo.texto,
          chave: alvo.norm,
          expr: expr(t.slice(2), l.numero),
        };
      }
      if (alvo?.tipo === 'id' && t[1]?.texto === '=') {
        throw new ErroPortugol(
          l.numero,
          `Para guardar um valor use "<-": ${alvo.texto} <- ...  ("=" é comparação).`,
        );
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
    if (tok.texto === '(') profundidade++;
    if (tok.texto === ')') profundidade--;
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
}

export interface Passo {
  linha: number;
  descricao: string;
  variaveis: VariavelRastro[];
  saida: string[];
  /** Variável que mudou neste passo (para destacar). */
  mudou?: string;
}

export interface Execucao {
  passos: Passo[];
  saida: string[];
  erro?: { linha: number; mensagem: string };
  /** Entradas que sobraram sem ser lidas. */
  entradasRestantes: string[];
}

export const LIMITE_PASSOS = 2000;

class LimiteExcedido extends Error {}

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

  const ordem: string[] = [...programa.declaradas.keys()];
  const vars = new Map<string, VariavelRastro>();
  for (const [chave, d] of programa.declaradas)
    vars.set(chave, { chave, nome: d.nome, tipo: d.tipo, valor: undefined });

  const registrar = (linha: number, descricao: string, mudou?: string) => {
    if (passos.length >= limite) throw new LimiteExcedido();
    passos.push({
      linha,
      descricao,
      variaveis: ordem.map((c) => ({ ...(vars.get(c) as VariavelRastro) })),
      saida: [...saida],
      ...(mudou ? { mudou } : {}),
    });
  };

  const ler = (chave: string, nome: string, linha: number): Valor => {
    const v = vars.get(chave);
    if (!v) {
      throw new ErroPortugol(
        linha,
        programa.temSecaoVar
          ? `A variável "${nome}" não foi declarada.`
          : `A variável "${nome}" ainda não existe: dê um valor a ela antes de usar.`,
      );
    }
    if (v.valor === undefined)
      throw new ErroPortugol(linha, `A variável "${nome}" foi usada antes de receber um valor.`);
    return v.valor;
  };

  const guardar = (chave: string, nome: string, valor: Valor, linha: number) => {
    let v = vars.get(chave);
    if (!v) {
      if (programa.temSecaoVar)
        throw new ErroPortugol(linha, `A variável "${nome}" não foi declarada.`);
      v = { chave, nome, valor: undefined };
      vars.set(chave, v);
      ordem.push(chave);
    }
    conferirTipo(v, valor, linha);
    v.valor = valor;
  };

  const calc = (e: Expr, linha: number) => avaliar(e, (c, n) => ler(c, n, linha), linha);

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
        const tipo = vars.get(c.chave)?.tipo;
        guardar(c.chave, c.nome, converterEntrada(bruto, tipo, c.linha), c.linha);
        registrar(c.linha, `Lê a entrada ${bruto} e guarda em ${c.nome}`, c.chave);
        return;
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
            `${c.nome} = ${formatarValor(atual)}: ${continua ? `ainda ${passo > 0 ? '<=' : '>='} ${formatarValor(fim)}, executa o bloco` : `passou de ${formatarValor(fim)}, sai da repetição`}`,
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

function conferirTipo(v: VariavelRastro, valor: Valor, linha: number) {
  if (!v.tipo) return;
  const ok =
    (v.tipo === 'inteiro' && typeof valor === 'number' && Number.isInteger(valor)) ||
    (v.tipo === 'real' && typeof valor === 'number') ||
    (v.tipo === 'caractere' && typeof valor === 'string') ||
    (v.tipo === 'logico' && typeof valor === 'boolean');
  if (!ok) {
    throw new ErroPortugol(
      linha,
      `"${v.nome}" é do tipo ${v.tipo}, mas recebeu ${formatarValor(valor, true)}.`,
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
