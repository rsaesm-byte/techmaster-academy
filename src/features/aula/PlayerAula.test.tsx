import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { MemoriaProgressRepository } from '@/persistence/memoria';

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('player de aula', () => {
  it('avança etapas, salva a posição e retoma após "recarregar"', async () => {
    const u = userEvent.setup();
    const repo = new MemoriaProgressRepository();
    const { unmount } = render(<App repositorio={repo} />);

    await u.click(await screen.findByRole('link', { name: /O que é um algoritmo/ }));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Antes de começar: o que você já sabe?',
      }),
    ).toBeVisible();

    await u.click(screen.getByRole('button', { name: 'Continuar →' }));
    await u.click(screen.getByRole('button', { name: 'Continuar →' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'A receita de bolo' }),
    ).toBeVisible();
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ etapaAtual: 2 });

    // Simula fechar e abrir o navegador: novo App, mesmo "banco".
    unmount();
    window.location.hash = '';
    render(<App repositorio={repo} />);
    await u.click(await screen.findByRole('link', { name: 'Continuar aula' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'A receita de bolo' }),
    ).toBeVisible();
  });

  it('trocar o modo muda a explicação sem perder a posição', async () => {
    const u = userEvent.setup();
    const repo = new MemoriaProgressRepository();
    window.location.hash = '#/aula/logica.m01.a01';
    render(<App repositorio={repo} />);
    await u.click(await screen.findByRole('button', { name: 'Continuar →' }));
    await screen.findByRole('heading', { level: 1, name: 'Algoritmo é uma sequência de passos' });

    await u.click(screen.getByRole('button', { name: 'Essencial' }));
    expect(screen.getByText(/Algoritmo = passos em ordem/)).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Técnico' }));
    expect(screen.getByText(/sequência finita de instruções bem definidas/)).toBeVisible();
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ etapaAtual: 1 });
  });

  it('aula inexistente mostra página não encontrada', async () => {
    window.location.hash = '#/aula/nao.existe';
    render(<App repositorio={new MemoriaProgressRepository()} />);
    expect(await screen.findByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  });

  it('concluir sem domínio mostra "concluída" e não bloqueia', async () => {
    const u = userEvent.setup();
    const repo = new MemoriaProgressRepository();
    window.location.hash = '#/aula/logica.m01.a01';
    render(<App repositorio={repo} />);
    await screen.findByRole('heading', { level: 1, name: /Antes de começar/ });
    await u.click(screen.getByText(/ver todas/));
    await u.click(screen.getByRole('button', { name: /^15\. / }));
    await u.click(await screen.findByRole('button', { name: 'Concluir aula' }));
    expect(await screen.findByRole('heading', { name: 'Aula concluída' })).toBeVisible();
    expect(screen.getByText(/0% das questões/)).toBeVisible();
    expect(await repo.obterProgresso('logica.m01.a01')).toMatchObject({ status: 'concluida' });
  });
});
