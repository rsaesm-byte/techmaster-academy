import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { MemoriaProgressRepository } from '@/persistence/memoria';

beforeAll(() => {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('responder pelo link direto de uma etapa', () => {
  it('o campo aceita digitação e o foco não foge ao verificar', async () => {
    const u = userEvent.setup();
    window.location.hash = '#/aula/logica.m02.a01?etapa=ex-guiado';
    render(<App repositorio={new MemoriaProgressRepository()} />);
    const campo = await screen.findByRole('textbox', { name: 'O que aparece na tela?' });
    fireEvent.change(campo, { target: { value: '8' } });
    expect(campo).toHaveValue('8');
    await u.click(screen.getAllByRole('button', { name: 'Verificar' })[0]!);
    expect(await screen.findByText(/v\[2\] vale 8, mas v\[3\]/)).toBeVisible();
    expect(document.activeElement).not.toHaveAttribute('id', 'etapa-ex-guiado');
  });
});
