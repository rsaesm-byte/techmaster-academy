import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { SqlSim } from './SqlSim';

describe('SqlSim', () => {
  it('mostra o resultado da consulta inicial', () => {
    render(<SqlSim consulta="SELECT nome FROM clientes WHERE idade > 40" />);
    expect(screen.getByRole('cell', { name: 'Diego' })).toBeInTheDocument();
  });
  it('executa uma consulta nova e mostra erros', async () => {
    const u = userEvent.setup();
    render(<SqlSim consulta="SELECT * FROM clientes" />);
    const campo = screen.getByLabelText(/consulta sql/i);
    await u.clear(campo);
    await u.type(campo, 'SELECT COUNT(*) FROM pedidos');
    await u.click(screen.getByRole('button', { name: 'Executar' }));
    expect(screen.getByRole('cell', { name: '7' })).toBeInTheDocument();
    await u.clear(campo);
    await u.type(campo, 'SELECT * FROM nada');
    await u.click(screen.getByRole('button', { name: 'Executar' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/nada/);
  });
  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<SqlSim consulta="SELECT * FROM clientes" />);
    const r = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });
});
