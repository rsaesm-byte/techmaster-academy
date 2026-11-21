/**
 * CPU didática: 3 registradores de 8 bits (A, B, C), memória de dados de 16 células
 * e 8 instruções. Cada instrução passa pelo ciclo buscar → decodificar → executar.
 *
 * Analogia: uma cozinheira que só sabe ler UMA linha da receita por vez e tem três
 * tigelas (registradores) para trabalhar; os ingredientes ficam na despensa (memória).
 */

export type Reg = 'A' | 'B' | 'C';
export const REGISTRADORES: Reg[] = ['A', 'B', 'C'];
export const TAMANHO_MEMORIA = 16;

export type Instrucao =
  | { op: 'LDI'; r: Reg; n: number }
  | { op: 'LOAD'; r: Reg; end: number }
  | { op: 'STORE'; r: Reg; end: number }
  | { op: 'ADD'; r: Reg; s: Reg }
  | { op: 'SUB'; r: Reg; s: Reg }
  | { op: 'JNZ'; r: Reg; alvo: number }
  | { op: 'JMP'; alvo: number }
  | { op: 'HALT' };

export interface ErroMontagem {
  linha: number;
  mensagem: string;
}

export interface Programa {
  instrucoes: Instrucao[];
  /** Linha do texto-fonte de cada instrução (para destacar na tela). */
  linhas: number[];
  /** Texto normalizado de cada instrução. */
  texto: string[];
  erros: ErroMontagem[];
}

const ehReg = (t: string | undefined): t is Reg => t === 'A' || t === 'B' || t === 'C';

/** Converte o texto assembly em instruções. Rótulos terminam com ":" (ex.: `laco:`). */
export function montar(fonte: string): Programa {
  const erros: ErroMontagem[] = [];
  const pendentes: { texto: string; linha: number }[] = [];
  const rotulos = new Map<string, number>();

  fonte.split('\n').forEach((bruta, i) => {
    let t = bruta.replace(/;.*/, '').trim();
    if (!t) return;
    const rot = /^([A-Za-z_]\w*):\s*(.*)$/.exec(t);
    if (rot) {
      const nome = (rot[1] ?? '').toLowerCase();
      if (rotulos.has(nome)) erros.push({ linha: i + 1, mensagem: `Rótulo repetido: ${nome}.` });
      rotulos.set(nome, pendentes.length);
      t = rot[2] ?? '';
      if (!t) return;
    }
    pendentes.push({ texto: t, linha: i + 1 });
  });

  const instrucoes: Instrucao[] = [];
  const linhas: number[] = [];
  const texto: string[] = [];

  for (const { texto: t, linha } of pendentes) {
    const [opBruto = '', ...resto] = t.split(/[\s,]+/).filter(Boolean);
    const op = opBruto.toUpperCase();
    const args = resto.map((a) => a.replace(/^\[|\]$/g, ''));
    const falha = (m: string) => erros.push({ linha, mensagem: m });
    const num = (s: string | undefined, max: number): number | null => {
      if (s === undefined || !/^\d+$/.test(s)) return null;
      const n = Number(s);
      return n <= max ? n : null;
    };
    const reg = (s: string | undefined) => (s ? s.toUpperCase() : undefined);
    const a0 = reg(args[0]);
    const a1 = reg(args[1]);
    let ins: Instrucao | null = null;

    if (op === 'HALT') {
      ins = { op: 'HALT' };
    } else if (op === 'LDI') {
      const n = num(args[1], 255);
      if (!ehReg(a0)) falha('LDI precisa de um registrador (A, B ou C).');
      else if (n === null) falha('LDI precisa de um número de 0 a 255.');
      else ins = { op, r: a0, n };
    } else if (op === 'LOAD' || op === 'STORE') {
      const end = num(args[1], TAMANHO_MEMORIA - 1);
      if (!ehReg(a0)) falha(`${op} precisa de um registrador (A, B ou C).`);
      else if (end === null) falha(`${op} precisa de um endereço de 0 a ${TAMANHO_MEMORIA - 1}.`);
      else ins = { op, r: a0, end };
    } else if (op === 'ADD' || op === 'SUB') {
      if (!ehReg(a0) || !ehReg(a1)) falha(`${op} precisa de dois registradores. Ex.: ${op} A, B`);
      else ins = { op, r: a0, s: a1 };
    } else if (op === 'JNZ') {
      const alvo = rotulos.get((args[1] ?? '').toLowerCase());
      if (!ehReg(a0)) falha('JNZ precisa de um registrador e um rótulo. Ex.: JNZ C, laco');
      else if (alvo === undefined) falha(`Rótulo desconhecido: ${args[1] ?? '(faltou)'}.`);
      else ins = { op, r: a0, alvo };
    } else if (op === 'JMP') {
      const alvo = rotulos.get((args[0] ?? '').toLowerCase());
      if (alvo === undefined) falha(`Rótulo desconhecido: ${args[0] ?? '(faltou)'}.`);
      else ins = { op, alvo };
    } else {
      falha(`Instrução desconhecida: ${opBruto}.`);
    }

    if (ins) {
      instrucoes.push(ins);
      linhas.push(linha);
      texto.push(t);
    }
  }
  if (instrucoes.length === 0 && erros.length === 0) {
    erros.push({ linha: 1, mensagem: 'O programa está vazio.' });
  }
  return { instrucoes, linhas, texto, erros };
}

export interface Estado {
  pc: number;
  regs: Record<Reg, number>;
  mem: number[];
  parado: boolean;
  passos: number;
  /** O que a última instrução fez, em português. */
  descricao: string;
  /** Registrador e célula alterados no último passo (para destacar). */
  mudou: { reg?: Reg; mem?: number };
}

export function estadoInicial(memoria: number[] = []): Estado {
  const mem = Array.from({ length: TAMANHO_MEMORIA }, (_, i) => (memoria[i] ?? 0) & 255);
  return {
    pc: 0,
    regs: { A: 0, B: 0, C: 0 },
    mem,
    parado: false,
    passos: 0,
    descricao: 'Pronto. A CPU vai buscar a instrução 0.',
    mudou: {},
  };
}

/** Executa UMA instrução (um ciclo completo) e devolve o novo estado. */
export function passo(prog: Programa, e: Estado): Estado {
  if (e.parado) return e;
  const ins = prog.instrucoes[e.pc];
  if (!ins) {
    return { ...e, parado: true, descricao: 'Acabaram as instruções: a CPU parou.', mudou: {} };
  }
  const regs = { ...e.regs };
  const mem = [...e.mem];
  let pc = e.pc + 1;
  let parado = false;
  let descricao = '';
  const mudou: Estado['mudou'] = {};
  const antes = `Buscou "${prog.texto[e.pc]}". `;

  switch (ins.op) {
    case 'LDI':
      regs[ins.r] = ins.n;
      mudou.reg = ins.r;
      descricao = `${antes}Colocou o número ${ins.n} em ${ins.r}.`;
      break;
    case 'LOAD':
      regs[ins.r] = mem[ins.end] ?? 0;
      mudou.reg = ins.r;
      descricao = `${antes}Copiou a memória[${ins.end}] (${mem[ins.end] ?? 0}) para ${ins.r}.`;
      break;
    case 'STORE':
      mem[ins.end] = regs[ins.r];
      mudou.mem = ins.end;
      descricao = `${antes}Guardou ${ins.r} (${regs[ins.r]}) na memória[${ins.end}].`;
      break;
    case 'ADD': {
      const v = (regs[ins.r] + regs[ins.s]) & 255;
      descricao = `${antes}${ins.r} = ${regs[ins.r]} + ${regs[ins.s]} = ${v}${regs[ins.r] + regs[ins.s] > 255 ? ' (estourou 8 bits!)' : ''}.`;
      regs[ins.r] = v;
      mudou.reg = ins.r;
      break;
    }
    case 'SUB': {
      const v = (regs[ins.r] - regs[ins.s]) & 255;
      descricao = `${antes}${ins.r} = ${regs[ins.r]} − ${regs[ins.s]} = ${v}.`;
      regs[ins.r] = v;
      mudou.reg = ins.r;
      break;
    }
    case 'JNZ':
      if (regs[ins.r] !== 0) {
        pc = ins.alvo;
        descricao = `${antes}${ins.r} vale ${regs[ins.r]} (não é zero): pulou para a instrução ${ins.alvo}.`;
      } else {
        descricao = `${antes}${ins.r} é zero: não pulou, segue para a próxima.`;
      }
      break;
    case 'JMP':
      pc = ins.alvo;
      descricao = `${antes}Pulou para a instrução ${ins.alvo}.`;
      break;
    case 'HALT':
      parado = true;
      pc = e.pc;
      descricao = `${antes}Parou a execução.`;
      break;
  }
  return { pc, regs, mem, parado, passos: e.passos + 1, descricao, mudou };
}

/** Roda até HALT ou até `limite` passos (protege contra laços infinitos). */
export function executar(
  prog: Programa,
  inicial: Estado = estadoInicial(),
  limite = 1000,
): { estado: Estado; esgotou: boolean } {
  let e = inicial;
  while (!e.parado && e.passos < limite) e = passo(prog, e);
  return { estado: e, esgotou: !e.parado };
}
