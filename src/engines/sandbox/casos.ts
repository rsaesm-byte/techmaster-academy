/**
 * Roda a função do aluno contra os casos de teste. Fica num arquivo próprio (sem DOM)
 * para ser usado DENTRO do Web Worker e também nos testes automatizados.
 */
export interface CasoJs {
  argumentos: unknown[];
  esperado: unknown;
}

export interface ResultadoCaso {
  argumentos: unknown[];
  esperado: unknown;
  obtido?: unknown;
  erro?: string;
  passou: boolean;
}

export interface ResultadoJs {
  erroGeral?: string;
  casos: ResultadoCaso[];
  logs: string[];
}

export function igual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function descrever(v: unknown): string {
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return JSON.stringify(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function executarCasos(codigo: string, funcao: string, casos: CasoJs[]): ResultadoJs {
  const logs: string[] = [];
  const consoleFalso = {
    log: (...a: unknown[]) => {
      if (logs.length < 100)
        logs.push(a.map((x) => (typeof x === 'string' ? x : descrever(x))).join(' '));
    },
  };
  let fn: unknown;
  try {
    // O código do aluno vira o corpo de uma função; "console" é o nosso, que só guarda o texto.
    fn = new Function(
      'console',
      `"use strict";\n${codigo}\nreturn typeof ${funcao} === "function" ? ${funcao} : undefined;`,
    )(consoleFalso);
  } catch (e) {
    return { erroGeral: `Erro no código: ${(e as Error).message}`, casos: [], logs };
  }
  if (typeof fn !== 'function') {
    return { erroGeral: `Não encontrei a função "${funcao}". Confira o nome.`, casos: [], logs };
  }
  const resultados = casos.map((c): ResultadoCaso => {
    try {
      const obtido = (fn as (...a: unknown[]) => unknown)(...structuredClone(c.argumentos));
      return { ...c, obtido, passou: igual(obtido, c.esperado) };
    } catch (e) {
      return { ...c, erro: (e as Error).message, passou: false };
    }
  });
  return { casos: resultados, logs };
}
