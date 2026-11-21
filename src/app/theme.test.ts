import { describe, expect, it } from 'vitest';
import { deveUsarEscuro, lerPreferencia, salvarPreferencia, CHAVE_TEMA } from '@/app/theme';

describe('deveUsarEscuro', () => {
  it('respeita a escolha explícita, ignorando o sistema', () => {
    expect(deveUsarEscuro('escuro', false)).toBe(true);
    expect(deveUsarEscuro('claro', true)).toBe(false);
  });

  it('no modo sistema, segue o aparelho', () => {
    expect(deveUsarEscuro('sistema', true)).toBe(true);
    expect(deveUsarEscuro('sistema', false)).toBe(false);
  });
});

describe('lerPreferencia', () => {
  it('volta para "sistema" quando não há nada salvo', () => {
    expect(lerPreferencia({ getItem: () => null })).toBe('sistema');
  });

  it('ignora valores inválidos ou adulterados', () => {
    expect(lerPreferencia({ getItem: () => '<script>' })).toBe('sistema');
  });

  it('não quebra se o armazenamento lançar erro', () => {
    const quebrado = {
      getItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(lerPreferencia(quebrado)).toBe('sistema');
  });
});

describe('salvarPreferencia', () => {
  it('grava na chave combinada', () => {
    const dados = new Map<string, string>();
    salvarPreferencia({ setItem: (k, v) => dados.set(k, v) }, 'escuro');
    expect(dados.get(CHAVE_TEMA)).toBe('escuro');
  });
});
