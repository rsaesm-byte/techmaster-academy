import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { BinarioSim } from './BinarioSim';

describe('simulador de binário', () => {
  it('clicar nos bits muda o valor decimal e hexadecimal', async () => {
    const u = userEvent.setup();
    render(<BinarioSim modo="bits" bits={8} />);
    await u.click(screen.getByRole('button', { name: 'Zerar' }));
    await u.click(screen.getByRole('button', { name: 'Bit de valor 128: 0' }));
    await u.click(screen.getByRole('button', { name: 'Bit de valor 1: 0' }));
    expect(screen.getByText('129')).toBeVisible();
    expect(screen.getByText('0x81')).toBeVisible();
    expect(screen.getByText('128 + 1 = 129')).toBeVisible();
  });

  it('com negativos, o bit mais à esquerda vale -128', async () => {
    const u = userEvent.setup();
    render(<BinarioSim modo="bits" bits={8} />);
    await u.click(screen.getByRole('button', { name: 'Tudo ligado' }));
    await u.click(screen.getByRole('checkbox', { name: /negativos/ }));
    expect(screen.getByText('-1')).toBeVisible();
  });

  it('soma coluna por coluna e avisa o estouro', async () => {
    const u = userEvent.setup();
    render(<BinarioSim modo="soma" bits={4} />);
    await u.clear(screen.getByLabelText(/Número A/));
    await u.type(screen.getByLabelText(/Número A/), '15');
    await u.clear(screen.getByLabelText(/Número B/));
    await u.type(screen.getByLabelText(/Número B/), '1');
    await u.click(screen.getByRole('button', { name: 'Próxima coluna' }));
    expect(screen.getByRole('status')).toHaveTextContent('Coluna 1: 1 + 1 = 2. Escreve 0');
    await u.click(screen.getByRole('button', { name: 'Mostrar tudo' }));
    expect(screen.getByRole('status')).toHaveTextContent('estouro');
  });

  it('texto vira bytes; acento usa dois bytes', async () => {
    const u = userEvent.setup();
    render(<BinarioSim modo="texto" />);
    const campo = screen.getByLabelText(/Escreva até 6/);
    await u.clear(campo);
    await u.type(campo, 'A');
    const tabela = screen.getByRole('table');
    expect(within(tabela).getByText('01000001')).toBeVisible();
    await u.clear(campo);
    await u.type(campo, 'é');
    expect(within(tabela).getByText('11000011')).toBeVisible();
    expect(within(tabela).getByText('10101001')).toBeVisible();
  });

  it.each(['bits', 'soma', 'texto'] as const)(
    'modo %s sem violações de acessibilidade',
    async (modo) => {
      const { container } = render(<BinarioSim modo={modo} />);
      const r = await axe.run(container, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        rules: { 'color-contrast': { enabled: false } },
      });
      expect(r.violations.map((v) => v.id)).toEqual([]);
    },
  );
});
