/**
 * ALGORITMOS DE ORDENAÇÃO E BUSCA, instrumentados: cada função devolve a lista de QUADROS
 * (o vetor, o que está sendo comparado/trocado e a linha do pseudocódigo) que o laboratório anima.
 * Os índices aqui começam em 1, como no Portugol.
 */

export type AlgoritmoId = 'bolha' | 'selecao' | 'insercao' | 'linear' | 'binaria';

export interface Quadro {
  vetor: number[];
  linha: number;
  descricao: string;
  comparando?: [number, number];
  trocando?: [number, number];
  /** Posições já na posição final. */
  prontos: number[];
  /** Busca binária: faixa ainda possível. */
  faixa?: [number, number];
  meio?: number;
  encontrado?: number;
  comparacoes: number;
  trocas: number;
}

export interface Algoritmo {
  id: AlgoritmoId;
  nome: string;
  tipo: 'ordenacao' | 'busca';
  pseudocodigo: string;
  complexidade: string;
  executar: (v: number[], alvo?: number) => Quadro[];
}

class Gravador {
  quadros: Quadro[] = [];
  comparacoes = 0;
  trocas = 0;
  prontos = new Set<number>();
  constructor(public v: number[]) {}
  q(linha: number, descricao: string, extra: Partial<Quadro> = {}) {
    this.quadros.push({
      vetor: [...this.v],
      linha,
      descricao,
      prontos: [...this.prontos],
      comparacoes: this.comparacoes,
      trocas: this.trocas,
      ...extra,
    });
  }
  // i e j em base 1
  get(i: number) {
    return this.v[i - 1] as number;
  }
  trocar(i: number, j: number) {
    const a = this.get(i);
    this.v[i - 1] = this.get(j);
    this.v[j - 1] = a;
    this.trocas++;
  }
}

const bolha: Algoritmo = {
  id: 'bolha',
  nome: 'Bolha (bubble sort)',
  tipo: 'ordenacao',
  complexidade: 'Pior caso: cerca de n²/2 comparações. Simples, mas lento para vetores grandes.',
  pseudocodigo: [
    'para fim de n ate 2 passo -1 faca',
    '  para i de 1 ate fim - 1 faca',
    '    se v[i] > v[i + 1] entao',
    '      troca v[i] com v[i + 1]',
    '    fimse',
    '  fimpara',
    'fimpara',
  ].join('\n'),
  executar(entrada) {
    const g = new Gravador([...entrada]);
    const n = entrada.length;
    for (let fim = n; fim >= 2; fim--) {
      g.q(1, `Passada até a posição ${fim}: o maior valor vai "borbulhar" até o fim.`);
      for (let i = 1; i <= fim - 1; i++) {
        g.comparacoes++;
        g.q(3, `Compara v[${i}] = ${g.get(i)} com v[${i + 1}] = ${g.get(i + 1)}.`, {
          comparando: [i, i + 1],
        });
        if (g.get(i) > g.get(i + 1)) {
          g.trocar(i, i + 1);
          g.q(4, `${g.get(i + 1)} > ${g.get(i)}: troca os dois.`, { trocando: [i, i + 1] });
        }
      }
      g.prontos.add(fim);
    }
    g.prontos.add(1);
    g.q(7, 'Vetor ordenado.');
    return g.quadros;
  },
};

const selecao: Algoritmo = {
  id: 'selecao',
  nome: 'Seleção (selection sort)',
  tipo: 'ordenacao',
  complexidade: 'Sempre cerca de n²/2 comparações, mas no máximo n - 1 trocas.',
  pseudocodigo: [
    'para i de 1 ate n - 1 faca',
    '  menor <- i',
    '  para j de i + 1 ate n faca',
    '    se v[j] < v[menor] entao',
    '      menor <- j',
    '    fimse',
    '  fimpara',
    '  troca v[i] com v[menor]',
    'fimpara',
  ].join('\n'),
  executar(entrada) {
    const g = new Gravador([...entrada]);
    const n = entrada.length;
    for (let i = 1; i <= n - 1; i++) {
      let menor = i;
      g.q(
        2,
        `Procura o menor valor de v[${i}] até v[${n}]. Começa supondo v[${i}] = ${g.get(i)}.`,
        { comparando: [i, i] },
      );
      for (let j = i + 1; j <= n; j++) {
        g.comparacoes++;
        g.q(4, `v[${j}] = ${g.get(j)} é menor que o menor até agora (${g.get(menor)})?`, {
          comparando: [j, menor],
        });
        if (g.get(j) < g.get(menor)) {
          menor = j;
          g.q(5, `Sim: o novo menor é ${g.get(menor)}, na posição ${menor}.`, {
            comparando: [menor, menor],
          });
        }
      }
      if (menor !== i) {
        g.trocar(i, menor);
        g.q(8, `Coloca o menor (${g.get(i)}) na posição ${i}.`, { trocando: [i, menor] });
      }
      g.prontos.add(i);
    }
    g.prontos.add(n);
    g.q(9, 'Vetor ordenado.');
    return g.quadros;
  },
};

const insercao: Algoritmo = {
  id: 'insercao',
  nome: 'Inserção (insertion sort)',
  tipo: 'ordenacao',
  complexidade: 'Pior caso n²/2, mas quase ordenado é rapidíssimo: perto de n comparações.',
  pseudocodigo: [
    'para i de 2 ate n faca',
    '  j <- i',
    '  enquanto j > 1 e v[j - 1] > v[j] faca',
    '    troca v[j - 1] com v[j]',
    '    j <- j - 1',
    '  fimenquanto',
    'fimpara',
  ].join('\n'),
  executar(entrada) {
    const g = new Gravador([...entrada]);
    const n = entrada.length;
    g.prontos.add(1);
    for (let i = 2; i <= n; i++) {
      let j = i;
      g.q(2, `Pega v[${i}] = ${g.get(i)} e insere na parte já ordenada, como uma carta na mão.`, {
        comparando: [i, i],
      });
      for (;;) {
        if (j <= 1) break;
        g.comparacoes++;
        g.q(3, `v[${j - 1}] = ${g.get(j - 1)} é maior que ${g.get(j)}?`, {
          comparando: [j - 1, j],
        });
        if (!(g.get(j - 1) > g.get(j))) break;
        g.trocar(j - 1, j);
        g.q(4, `Sim: ${g.get(j)} anda uma casa para a direita.`, { trocando: [j - 1, j] });
        j--;
      }
      for (let k = 1; k <= i; k++) g.prontos.add(k);
    }
    g.q(7, 'Vetor ordenado.');
    return g.quadros;
  },
};

const linear: Algoritmo = {
  id: 'linear',
  nome: 'Busca linear',
  tipo: 'busca',
  complexidade: 'Até n comparações: olha um por um. Funciona com vetor desordenado.',
  pseudocodigo: [
    'para i de 1 ate n faca',
    '  se v[i] = alvo entao',
    '    retorne i',
    '  fimse',
    'fimpara',
    'retorne 0   // não encontrou',
  ].join('\n'),
  executar(entrada, alvo = 0) {
    const g = new Gravador([...entrada]);
    for (let i = 1; i <= entrada.length; i++) {
      g.comparacoes++;
      g.q(2, `v[${i}] = ${g.get(i)} é igual a ${alvo}?`, { comparando: [i, i] });
      if (g.get(i) === alvo) {
        g.q(3, `Encontrado na posição ${i}, com ${g.comparacoes} comparações.`, { encontrado: i });
        return g.quadros;
      }
    }
    g.q(6, `${alvo} não está no vetor: foram ${g.comparacoes} comparações.`);
    return g.quadros;
  },
};

const binaria: Algoritmo = {
  id: 'binaria',
  nome: 'Busca binária',
  tipo: 'busca',
  complexidade:
    'Cerca de log₂(n) comparações: 1 000 elementos em ~10 passos. Exige vetor ORDENADO.',
  pseudocodigo: [
    'ini <- 1',
    'fim <- n',
    'enquanto ini <= fim faca',
    '  meio <- (ini + fim) \\ 2',
    '  se v[meio] = alvo entao',
    '    retorne meio',
    '  senao se v[meio] < alvo entao',
    '    ini <- meio + 1',
    '  senao',
    '    fim <- meio - 1',
    '  fimse',
    'fimenquanto',
    'retorne 0   // não encontrou',
  ].join('\n'),
  executar(entrada, alvo = 0) {
    const g = new Gravador([...entrada]);
    let ini = 1;
    let fim = entrada.length;
    g.q(3, `Procura ${alvo} entre as posições ${ini} e ${fim}.`, { faixa: [ini, fim] });
    while (ini <= fim) {
      const meio = Math.trunc((ini + fim) / 2);
      g.comparacoes++;
      g.q(5, `Olha o meio: v[${meio}] = ${g.get(meio)}.`, {
        faixa: [ini, fim],
        meio,
        comparando: [meio, meio],
      });
      if (g.get(meio) === alvo) {
        g.q(6, `Encontrado na posição ${meio}, com ${g.comparacoes} comparações.`, {
          encontrado: meio,
          faixa: [ini, fim],
        });
        return g.quadros;
      }
      if (g.get(meio) < alvo) {
        ini = meio + 1;
        g.q(8, `${g.get(meio)} < ${alvo}: descarta a metade da esquerda.`, { faixa: [ini, fim] });
      } else {
        fim = meio - 1;
        g.q(10, `${g.get(meio)} > ${alvo}: descarta a metade da direita.`, { faixa: [ini, fim] });
      }
    }
    g.q(13, `${alvo} não está no vetor: foram ${g.comparacoes} comparações.`);
    return g.quadros;
  },
};

export const ALGORITMOS: Record<AlgoritmoId, Algoritmo> = {
  bolha,
  selecao,
  insercao,
  linear,
  binaria,
};

/** Gerador pseudoaleatório com semente: o mesmo "aleatório" a cada vez (reprodutível). */
export function gerarVetor(
  n: number,
  forma: 'aleatorio' | 'quase' | 'inverso' | 'ordenado',
  semente = 7,
): number[] {
  let s = semente;
  const rnd = () => {
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const base = Array.from({ length: n }, (_, i) => Math.round(((i + 1) / n) * 95) + 5);
  if (forma === 'ordenado') return base;
  if (forma === 'inverso') return [...base].reverse();
  const v = [...base];
  if (forma === 'quase') {
    for (let k = 0; k < Math.max(1, Math.round(n / 8)); k++) {
      const i = Math.floor(rnd() * (n - 1));
      [v[i], v[i + 1]] = [v[i + 1] as number, v[i] as number];
    }
    return v;
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [v[i], v[j]] = [v[j] as number, v[i] as number];
  }
  return v;
}
