import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { EditorSim } from './EditorSim';

describe('EditorSim', () => {
  it('mostra o HTML inicial, troca de aba e restaura o original', async () => {
    const u = userEvent.setup();
    render(<EditorSim html="<h1>Oi</h1>" css="h1 { color: red; }" js="" />);
    const campo = screen.getByLabelText(/código html/i);
    expect(campo).toHaveValue('<h1>Oi</h1>');
    expect(screen.queryByRole('tab', { name: 'JavaScript' })).toBeNull();
    await u.type(campo, 'x');
    expect(campo).toHaveValue('<h1>Oi</h1>x');
    await u.click(screen.getByRole('tab', { name: 'CSS' }));
    expect(screen.getByLabelText(/código css/i)).toHaveValue('h1 { color: red; }');
    await u.click(screen.getByRole('button', { name: /restaurar/i }));
    await u.click(screen.getByRole('tab', { name: 'HTML' }));
    expect(screen.getByLabelText(/código html/i)).toHaveValue('<h1>Oi</h1>');
  });
  it('só mostra a aba de JavaScript quando há JS', () => {
    render(<EditorSim html="<p>a</p>" css="" js="console.log(1)" />);
    expect(screen.getByRole('tab', { name: 'JavaScript' })).toBeInTheDocument();
  });
  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<EditorSim html="<p>a</p>" css="" js="" />);
    const r = await axe.run(container, {
      iframes: false,
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(r.violations).toEqual([]);
  });
});
