import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { PortasSim } from './PortasSim';

describe('simulador de portas lógicas', () => {
  it('AND só acende com as duas entradas ligadas', async () => {
    const u = userEvent.setup();
    render(<PortasSim modo="porta" porta="and" />);
    expect(screen.getByRole('img', { name: 'Saída: 0' })).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Entrada A: 0' }));
    expect(screen.getByRole('img', { name: 'Saída: 0' })).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Entrada B: 0' }));
    expect(screen.getByRole('img', { name: 'Saída: 1' })).toBeVisible();
  });

  it('trocar de porta muda a regra e a tabela destaca a linha atual', async () => {
    const u = userEvent.setup();
    render(<PortasSim modo="porta" />);
    await u.click(screen.getByRole('button', { name: 'XOR' }));
    expect(screen.getByText(/entradas são DIFERENTES/)).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Entrada A: 0' }));
    const atual = screen
      .getAllByRole('row')
      .filter((l) => l.getAttribute('aria-current') === 'true');
    expect(atual).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Saída: 1' })).toBeVisible();
  });

  it('NOT tem uma entrada só', () => {
    render(<PortasSim modo="porta" porta="not" fixo />);
    expect(screen.queryByRole('button', { name: /Entrada B/ })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Saída: 1' })).toBeVisible();
  });

  it('meio-somador: 1 + 1 = 10', () => {
    render(<PortasSim modo="meio-somador" />);
    expect(screen.getByRole('status')).toHaveTextContent('1 + 1 = 10');
  });

  it('somador completo: 1 + 1 + 1 = 11', () => {
    render(<PortasSim modo="somador-completo" />);
    expect(screen.getByRole('status')).toHaveTextContent('1 + 1 + 1 = 3 = 11');
  });

  it.each(['porta', 'meio-somador', 'somador-completo'] as const)(
    'modo %s sem violações de acessibilidade',
    async (modo) => {
      const { container } = render(<PortasSim modo={modo} />);
      const r = await axe.run(container, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        rules: { 'color-contrast': { enabled: false } },
      });
      expect(
        r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80))}`),
      ).toEqual([]);
    },
  );
});
