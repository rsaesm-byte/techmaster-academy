import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';

beforeAll(() => {
  // jsdom não implementa matchMedia; simulamos um sistema em tema claro.
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('App', () => {
  it('abre no painel', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Bem-vindo à TechMaster Academy' }),
    ).toBeInTheDocument();
  });

  it('troca para o tema escuro e lembra da escolha', async () => {
    const usuario = userEvent.setup();
    render(<App />);
    await usuario.click(screen.getByRole('link', { name: 'Configurações' }));
    await usuario.click(screen.getByRole('radio', { name: 'Escuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('tm:tema')).toBe('escuro');
  });

  it('mostra página de não encontrada para rota desconhecida', () => {
    window.location.hash = '#/nao-existe';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
  });
});
