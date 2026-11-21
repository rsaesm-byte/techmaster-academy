import { describe, expect, it } from 'vitest';
import { deOctal, paraOctal, paraSimbolico } from './permissoes';
import { analisar, bitsDoIp, ipTexto, lerIp, mesmaRede, type Octetos } from './rede';
import { escalonar } from './escalonador';
import {
  classificar,
  entropiaBits,
  formatarTempo,
  segundosParaQuebrar,
  tamanhoAlfabeto,
} from './senha';
import { passosDoAcesso, SITES } from './web';

const ip = (t: string) => lerIp(t) as Octetos;

describe('permissões', () => {
  it('converte entre octal e simbólico', () => {
    const p = deOctal('754');
    expect(p && paraSimbolico(p)).toBe('rwxr-xr--');
    expect(p && paraOctal(p)).toBe('754');
    expect(paraSimbolico(deOctal('644') as NonNullable<ReturnType<typeof deOctal>>)).toBe(
      'rw-r--r--',
    );
  });
  it('rejeita octal inválido', () => {
    expect(deOctal('789')).toBeNull();
    expect(deOctal('75')).toBeNull();
  });
});

describe('rede', () => {
  it('analisa 192.168.1.130/24', () => {
    const a = analisar(ip('192.168.1.130'), 24);
    expect(a && ipTexto(a.rede)).toBe('192.168.1.0');
    expect(a && ipTexto(a.broadcast)).toBe('192.168.1.255');
    expect(a && ipTexto(a.mascara)).toBe('255.255.255.0');
    expect(a?.hosts).toBe(254);
    expect(a?.privado).toBe(true);
  });
  it('analisa /26 e /30', () => {
    const a = analisar(ip('10.0.0.70'), 26);
    expect(a && ipTexto(a.rede)).toBe('10.0.0.64');
    expect(a && ipTexto(a.broadcast)).toBe('10.0.0.127');
    expect(a?.hosts).toBe(62);
    expect(analisar(ip('10.0.0.1'), 30)?.hosts).toBe(2);
  });
  it('mesma rede e validações', () => {
    expect(mesmaRede(ip('192.168.1.10'), ip('192.168.1.200'), 24)).toBe(true);
    expect(mesmaRede(ip('192.168.1.10'), ip('192.168.2.10'), 24)).toBe(false);
    expect(lerIp('300.1.1.1')).toBeNull();
    expect(lerIp('1.2.3')).toBeNull();
    expect(analisar(ip('1.1.1.1'), 40)).toBeNull();
    expect(bitsDoIp(ip('192.168.0.1'))).toBe('11000000.10101000.00000000.00000001');
    expect(analisar(ip('8.8.8.8'), 24)?.privado).toBe(false);
  });
});

describe('escalonador', () => {
  const procs = [
    { nome: 'A', duracao: 5 },
    { nome: 'B', duracao: 2 },
    { nome: 'C', duracao: 3 },
  ];
  it('FIFO executa na ordem de chegada', () => {
    const r = escalonar(procs, 'fifo');
    expect(r.fatias.map((f) => f.nome)).toEqual(['A', 'B', 'C']);
    expect(r.termino).toEqual({ A: 5, B: 7, C: 10 });
    expect(r.esperaMedia).toBeCloseTo((0 + 5 + 7) / 3);
  });
  it('Round Robin reveza com quantum', () => {
    const r = escalonar(procs, 'rr', 2);
    expect(r.fatias.map((f) => f.nome).join('')).toBe('ABCACA');
    expect(r.termino.B).toBe(4);
    expect(r.termino.A).toBe(10);
    expect(r.fatias.at(-1)?.fim).toBe(10);
  });
});

describe('senha', () => {
  it('calcula entropia e classifica', () => {
    const so = { minusculas: true, maiusculas: false, digitos: false, simbolos: false };
    expect(tamanhoAlfabeto(so)).toBe(26);
    expect(entropiaBits(8, so)).toBeCloseTo(37.6, 1);
    expect(classificar(37.6)).toBe('fraca');
    const tudo = { minusculas: true, maiusculas: true, digitos: true, simbolos: true };
    expect(tamanhoAlfabeto(tudo)).toBe(94);
    expect(classificar(entropiaBits(16, tudo))).toBe('muito forte');
    expect(entropiaBits(0, tudo)).toBe(0);
  });
  it('formata o tempo', () => {
    expect(formatarTempo(0.2)).toBe('menos de 1 segundo');
    expect(formatarTempo(90)).toBe('1 minuto');
    expect(formatarTempo(3600 * 5)).toBe('5 horas');
    expect(formatarTempo(segundosParaQuebrar(37.6, 1e9))).toBe('1 minuto');
    expect(formatarTempo(segundosParaQuebrar(100, 1e9))).toMatch(/anos/);
  });
});

describe('web', () => {
  it('descreve os 6 passos com o domínio e o IP', () => {
    const p = passosDoAcesso(SITES[0] ?? { dominio: 'x', ip: '1.1.1.1' });
    expect(p).toHaveLength(6);
    expect(p[1]?.mensagem).toContain('203.0.113.10');
  });
});
