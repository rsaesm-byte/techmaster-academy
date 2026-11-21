/**
 * BUSCA GLOBAL — índice simples em memória (o conteúdo é pequeno e já está no navegador).
 * Ignora maiúsculas e acentos; todas as palavras digitadas precisam aparecer.
 */
import type { Catalogo } from '@/content/catalogo';
import type { Etapa } from '@/domain/conteudo';
import { normalizar } from '@/engines/portugol/lexer';

export interface Documento {
  tipo: 'aula' | 'termo' | 'laboratorio';
  titulo: string;
  subtitulo: string;
  rota: string;
  texto: string;
}

export interface Resultado extends Documento {
  trecho: string;
  pontos: number;
}

function textoDaEtapa(e: Etapa): string {
  switch (e.tipo) {
    case 'explicacao':
      return [e.titulo, e.texto, ...Object.values(e.porModo ?? {})].join(' ');
    case 'analogia':
      return `${e.titulo} ${e.texto} ${e.limites}`;
    case 'diagrama':
      return `${e.titulo} ${e.descricao}`;
    case 'exemplo':
      return `${e.titulo} ${e.comentarios.map((c) => c.texto).join(' ')}`;
    case 'resumo':
      return e.pontos.join(' ');
    case 'flashcards':
      return e.cards.map((c) => `${c.frente} ${c.verso}`).join(' ');
    case 'demo':
      return `${e.titulo} ${e.instrucoes}`;
    case 'conexoes':
      return `${e.disciplinas.join(' ')} ${e.aplicacaoProfissional}`;
    default:
      return 'titulo' in e ? e.titulo : '';
  }
}

const LABS: Documento[] = [
  {
    tipo: 'laboratorio',
    titulo: 'Visualizador de Algoritmos',
    subtitulo: 'Laboratório',
    rota: '/lab/algoritmos',
    texto: 'executar portugol passo a passo variaveis memoria linha depurar',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Robô do tabuleiro',
    subtitulo: 'Laboratório',
    rota: '/lab/robo',
    texto: 'robo comandos algoritmo sequencia instrucoes exatas',
  },
  {
    tipo: 'laboratorio',
    titulo: 'O laço que desenha',
    subtitulo: 'Laboratório',
    rota: '/lab/laco',
    texto: 'laco repeticao para webgl desenho espiral',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Busca e ordenação',
    subtitulo: 'Laboratório',
    rota: '/lab/ordenacao',
    texto: 'ordenacao bolha selecao insercao busca linear binaria comparacoes trocas',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Binário',
    subtitulo: 'Laboratório',
    rota: '/lab/binario',
    texto: 'binario bits bytes hexadecimal complemento de dois soma vai-um ascii utf-8 texto',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Portas lógicas',
    subtitulo: 'Laboratório',
    rota: '/lab/portas',
    texto:
      'portas logicas and or not xor nand nor tabela verdade circuito somador meio somador hardware',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Sistemas, redes e segurança',
    subtitulo: 'Laboratório',
    rota: '/lab/sistemas',
    texto:
      'processos escalonador permissoes chmod ip sub rede mascara cidr dns http senha entropia seguranca',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Dados: cache, RAID e criptografia',
    subtitulo: 'Laboratório',
    rota: '/lab/dados',
    texto:
      'unidades gb mb cache lru fifo raid compressao rle cifra cesar criptografia armazenamento disco',
  },
  {
    tipo: 'laboratorio',
    titulo: 'CPU e memória',
    subtitulo: 'Laboratório',
    rota: '/lab/cpu',
    texto:
      'cpu processador memoria registrador assembly instrucao ciclo buscar decodificar executar',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Terminal',
    subtitulo: 'Laboratório',
    rota: '/lab/terminal',
    texto: 'terminal linux comandos ls cd mkdir cat shell linha de comando arquivos pastas',
  },
  {
    tipo: 'laboratorio',
    titulo: 'Editor Web',
    subtitulo: 'Laboratório',
    rota: '/lab/web',
    texto: 'html css javascript pagina web previa editor',
  },
];

export function construirIndice(c: Catalogo): Documento[] {
  const aulas = [...c.aulas.values()].map((a) => ({
    tipo: 'aula' as const,
    titulo: a.titulo,
    subtitulo: c.localizar(a.id)?.modulo.titulo ?? 'Aula',
    rota: `/aula/${a.id}`,
    texto: [a.titulo, a.objetivo, ...a.etapas.map(textoDaEtapa)].join(' '),
  }));
  const termos = c.glossario.map((t) => ({
    tipo: 'termo' as const,
    titulo: t.termo,
    subtitulo: 'Glossário',
    rota: `/glossario#${t.id}`,
    texto: `${t.termo} ${t.simples} ${t.tecnico}`,
  }));
  return [...termos, ...aulas, ...LABS];
}

function trechoAoRedor(texto: string, palavra: string): string {
  const i = normalizar(texto).indexOf(palavra);
  if (i < 0) return texto.slice(0, 140);
  const inicio = Math.max(0, i - 60);
  const fim = Math.min(texto.length, i + palavra.length + 80);
  return `${inicio > 0 ? '…' : ''}${texto
    .slice(inicio, fim)
    .replace(/\*\*|`/g, '')
    .replace(/\s+/g, ' ')}${fim < texto.length ? '…' : ''}`;
}

export function buscar(indice: Documento[], consulta: string, limite = 20): Resultado[] {
  const palavras = normalizar(consulta)
    .split(/\s+/)
    .filter((p) => p.length >= 2);
  if (palavras.length === 0) return [];
  const resultados: Resultado[] = [];
  for (const d of indice) {
    const titulo = normalizar(d.titulo);
    const texto = normalizar(d.texto);
    if (!palavras.every((p) => texto.includes(p) || titulo.includes(p))) continue;
    let pontos = 0;
    for (const p of palavras) {
      if (titulo === p) pontos += 20;
      else if (titulo.startsWith(p)) pontos += 12;
      else if (titulo.includes(p)) pontos += 8;
      pontos += Math.min(5, texto.split(p).length - 1);
    }
    if (d.tipo === 'termo') pontos += 2;
    resultados.push({ ...d, pontos, trecho: trechoAoRedor(d.texto, palavras[0] ?? '') });
  }
  return resultados.sort((a, b) => b.pontos - a.pontos).slice(0, limite);
}
