import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { executarCasos } from '@/engines/sandbox/casos';
import { JsSim } from './JsSim';

// jsdom não tem Web Worker: o teste usa o mesmo executor, direto.
vi.mock('@/engines/sandbox/rodarJs', () => ({
  rodarJs: (codigo: string, funcao: string, casos: never[]) =>
    Promise.resolve(executarCasos(codigo, funcao, casos)),
}));

describe('console de JavaScript', () => {
  it('executa e mostra o console.log', async () => {
    const u = userEvent.setup();
    render(<JsSim codigo={'const x = 2 + 3;\nconsole.log(x);'} />);
    await u.click(screen.getByRole('button', { name: 'Executar' }));
    expect(await screen.findByText('5')).toBeVisible();
  });

  it('mostra erros do código', async () => {
    const u = userEvent.setup();
    render(<JsSim codigo={'console.log(naoExiste);'} />);
    await u.click(screen.getByRole('button', { name: 'Executar' }));
    expect((await screen.findAllByText(/naoExiste/)).length).toBeGreaterThan(0);
  });

  it('restaurar volta o código original', async () => {
    const u = userEvent.setup();
    render(<JsSim codigo="console.log(1);" />);
    const campo = screen.getByLabelText(/Código/);
    await u.clear(campo);
    await u.type(campo, 'x');
    await u.click(screen.getByRole('button', { name: 'Restaurar' }));
    expect(campo).toHaveValue('console.log(1);');
  });

  it('sem violações de acessibilidade', async () => {
    const { container } = render(<JsSim codigo="console.log(1);" />);
    const r = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });
});
