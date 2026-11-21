import { describe, expect, it } from 'vitest';
import {
  buscar,
  caminhoTexto,
  estadoInicialTerminal,
  executarComando,
  resolver,
  tokenizar,
  type EstadoTerminal,
} from './terminal';

function rodar(...linhas: string[]) {
  let e: EstadoTerminal = estadoInicialTerminal();
  let ultima: string[] = [];
  let erro = false;
  for (const l of linhas) {
    const r = executarComando(e, l);
    e = r.estado;
    ultima = r.saida;
    erro = !!r.erro;
  }
  return { e, saida: ultima, erro };
}

describe('terminal simulado', () => {
  it('pwd e cd', () => {
    expect(rodar('pwd').saida).toEqual(['/home/aluno']);
    expect(rodar('cd documentos', 'pwd').saida).toEqual(['/home/aluno/documentos']);
    expect(rodar('cd /tmp', 'cd ~', 'pwd').saida).toEqual(['/home/aluno']);
    expect(rodar('cd documentos', 'cd ..', 'pwd').saida).toEqual(['/home/aluno']);
  });

  it('ls lista pastas com barra', () => {
    expect(rodar('ls').saida).toEqual(['documentos/  ola.txt  projetos/']);
    expect(rodar('ls documentos').saida).toEqual(['lista.txt  notas.txt']);
  });

  it('erros viram mensagem, sem lançar', () => {
    expect(rodar('cd nada').erro).toBe(true);
    expect(rodar('cd nada').saida[0]).toMatch(/inexistente/);
    expect(rodar('abracadabra').saida[0]).toMatch(/comando não encontrado/);
  });

  it('mkdir, touch e cat', () => {
    const { e } = rodar('mkdir fotos', 'touch fotos/a.txt');
    expect(buscar(e.raiz, ['home', 'aluno', 'fotos', 'a.txt'])?.tipo).toBe('arq');
    expect(rodar('cat ola.txt').saida).toEqual(['Olá, mundo!']);
    expect(rodar('mkdir documentos').erro).toBe(true);
  });

  it('echo com > sobrescreve e >> acrescenta', () => {
    expect(rodar('echo "oi" > a.txt', 'cat a.txt').saida).toEqual(['oi']);
    expect(rodar('echo "oi" > a.txt', 'echo "tchau" >> a.txt', 'cat a.txt').saida).toEqual([
      'oi',
      'tchau',
    ]);
    expect(rodar('echo ola mundo').saida).toEqual(['ola mundo']);
  });

  it('cp, mv e rm', () => {
    expect(rodar('cp ola.txt copia.txt', 'cat copia.txt').saida).toEqual(['Olá, mundo!']);
    const mv = rodar('mv ola.txt documentos', 'ls documentos');
    expect(mv.saida[0]).toContain('ola.txt');
    expect(rodar('mv ola.txt documentos', 'cat ola.txt').erro).toBe(true);
    expect(rodar('rm ola.txt', 'ls').saida[0]).not.toContain('ola.txt');
    expect(rodar('rm documentos').erro).toBe(true);
    expect(rodar('rm -r documentos', 'ls').saida[0]).not.toContain('documentos');
  });

  it('não apaga a pasta em que você está', () => {
    expect(rodar('cd documentos', 'rm -r ~/documentos').erro).toBe(true);
  });

  it('não altera o estado anterior (imutável)', () => {
    const e0 = estadoInicialTerminal();
    executarComando(e0, 'rm ola.txt');
    expect(buscar(e0.raiz, ['home', 'aluno', 'ola.txt'])).toBeDefined();
  });

  it('utilitários', () => {
    expect(resolver(['home', 'aluno'], '../..')).toEqual([]);
    expect(resolver(['tmp'], '~/projetos')).toEqual(['home', 'aluno', 'projetos']);
    expect(tokenizar('echo "a b" c')).toEqual(['echo', 'a b', 'c']);
    expect(caminhoTexto(['home', 'aluno', 'documentos'])).toBe('~/documentos');
    expect(caminhoTexto(['tmp'])).toBe('/tmp');
  });
});
