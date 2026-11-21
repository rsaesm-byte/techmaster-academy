import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { CpuSim } from './CpuSim';

const axeOpts = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
};

describe('simulador de CPU', () => {
  it('avança um passo por vez e descreve o que fez', async () => {
    const u = userEvent.setup();
    render(<CpuSim />);
    await u.click(screen.getByRole('button', { name: 'Próximo passo' }));
    expect(screen.getByRole('status')).toHaveTextContent('Copiou a memória[0] (7) para A');
    await u.click(screen.getByRole('button', { name: 'Próximo passo' }));
    await u.click(screen.getByRole('button', { name: 'Próximo passo' }));
    expect(screen.getByRole('status')).toHaveTextContent('A = 7 + 5 = 12');
  });

  it('executar tudo chega ao resultado e desabilita o avanço', async () => {
    const u = userEvent.setup();
    render(<CpuSim />);
    await u.click(screen.getByRole('button', { name: 'Executar tudo' }));
    expect(screen.getByLabelText('Memória 2: 12')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Próximo passo' })).toBeDisabled();
  });

  it('reiniciar volta ao começo', async () => {
    const u = userEvent.setup();
    render(<CpuSim />);
    await u.click(screen.getByRole('button', { name: 'Executar tudo' }));
    await u.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(screen.getByLabelText('Memória 2: 0')).toBeVisible();
  });

  it('mostra erro de montagem no modo editável', async () => {
    const u = userEvent.setup();
    render(<CpuSim editavel programa="LDI A, 1" />);
    const campo = screen.getByLabelText(/Edite o programa/);
    await u.clear(campo);
    await u.type(campo, 'PULA');
    expect(screen.getByRole('alert')).toHaveTextContent('Instrução desconhecida');
    expect(screen.getByRole('button', { name: 'Próximo passo' })).toBeDisabled();
  });

  it('laço infinito é interrompido com aviso', async () => {
    const u = userEvent.setup();
    render(<CpuSim programa="x: JMP x" memoria={[]} />);
    await u.click(screen.getByRole('button', { name: 'Executar tudo' }));
    expect(screen.getByRole('status')).toHaveTextContent(/laço infinito/);
  });

  it.each([false, true])('sem violações de acessibilidade (editável: %s)', async (editavel) => {
    const { container } = render(<CpuSim editavel={editavel} />);
    const r = await axe.run(container, axeOpts);
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80))}`)).toEqual(
      [],
    );
  });
});
