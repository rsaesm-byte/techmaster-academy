/**
 * Lógica do robô do tabuleiro (pura, testável). O robô só entende 3 comandos
 * exatos; qualquer coisa vaga ele não executa — é a "definição" de um algoritmo.
 */
export type Direcao = 'N' | 'L' | 'S' | 'O';
export type Comando = 'andar' | 'esquerda' | 'direita' | 'vago';

export interface Fase {
  nome: string;
  objetivo: string;
  largura: number;
  altura: number;
  inicio: { x: number; y: number; dir: Direcao };
  meta: { x: number; y: number };
  paredes: { x: number; y: number }[];
  /** Menor número de comandos possível (para dar um desafio extra). */
  minimo: number;
}

export interface Estado {
  x: number;
  y: number;
  dir: Direcao;
}

export type ResultadoPasso =
  | { tipo: 'ok'; estado: Estado; descricao: string }
  | { tipo: 'bateu'; estado: Estado; descricao: string }
  | { tipo: 'nao-entendeu'; estado: Estado; descricao: string };

const GIRO_ESQ: Record<Direcao, Direcao> = { N: 'O', O: 'S', S: 'L', L: 'N' };
const GIRO_DIR: Record<Direcao, Direcao> = { N: 'L', L: 'S', S: 'O', O: 'N' };
const DELTA: Record<Direcao, [number, number]> = { N: [0, -1], S: [0, 1], L: [1, 0], O: [-1, 0] };
export const NOME_DIRECAO: Record<Direcao, string> = {
  N: 'norte (cima)',
  S: 'sul (baixo)',
  L: 'leste (direita)',
  O: 'oeste (esquerda)',
};

export const NOME_COMANDO: Record<Comando, string> = {
  andar: 'Andar 1 casa',
  esquerda: 'Virar à esquerda',
  direita: 'Virar à direita',
  vago: 'Ir mais ou menos para lá',
};

export function executarComando(fase: Fase, e: Estado, c: Comando): ResultadoPasso {
  switch (c) {
    case 'esquerda': {
      const dir = GIRO_ESQ[e.dir];
      return {
        tipo: 'ok',
        estado: { ...e, dir },
        descricao: `Virou à esquerda: agora olha para ${NOME_DIRECAO[dir]}.`,
      };
    }
    case 'direita': {
      const dir = GIRO_DIR[e.dir];
      return {
        tipo: 'ok',
        estado: { ...e, dir },
        descricao: `Virou à direita: agora olha para ${NOME_DIRECAO[dir]}.`,
      };
    }
    case 'andar': {
      const [dx, dy] = DELTA[e.dir];
      const x = e.x + dx;
      const y = e.y + dy;
      const fora = x < 0 || y < 0 || x >= fase.largura || y >= fase.altura;
      if (fora || fase.paredes.some((p) => p.x === x && p.y === y)) {
        return {
          tipo: 'bateu',
          estado: e,
          descricao: fora
            ? 'Bateu na borda do tabuleiro! O robô faz exatamente o que você manda, mesmo que seja errado.'
            : 'Bateu na parede! O robô não "desvia sozinho": cada movimento precisa estar no algoritmo.',
        };
      }
      return {
        tipo: 'ok',
        estado: { ...e, x, y },
        descricao: `Andou 1 casa para ${NOME_DIRECAO[e.dir]}.`,
      };
    }
    case 'vago':
      return {
        tipo: 'nao-entendeu',
        estado: e,
        descricao:
          '"Mais ou menos para lá" quanto? Para onde? O robô não interpreta: instrução ambígua não pode ser executada.',
      };
  }
}

export function chegou(fase: Fase, e: Estado): boolean {
  return e.x === fase.meta.x && e.y === fase.meta.y;
}

export const FASES: Fase[] = [
  {
    nome: 'Fase 1 · Linha reta',
    objetivo: 'Leve o robô até a bandeira.',
    largura: 5,
    altura: 3,
    inicio: { x: 0, y: 1, dir: 'L' },
    meta: { x: 3, y: 1 },
    paredes: [],
    minimo: 3,
  },
  {
    nome: 'Fase 2 · Uma curva',
    objetivo: 'Agora a bandeira está em outra linha. Vai precisar virar.',
    largura: 5,
    altura: 5,
    inicio: { x: 0, y: 4, dir: 'L' },
    meta: { x: 3, y: 1 },
    paredes: [
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    minimo: 7,
  },
  {
    nome: 'Fase 3 · Labirinto',
    objetivo: 'Planeje antes de executar: decomponha o caminho em trechos.',
    largura: 5,
    altura: 4,
    inicio: { x: 0, y: 0, dir: 'S' },
    meta: { x: 4, y: 3 },
    paredes: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
    ],
    minimo: 13,
  },
];
