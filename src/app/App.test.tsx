import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { MemoriaProgressRepository } from '@/persistence/memoria';

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
  it('abre no painel, sugerindo a primeira aula', async () => {
    render(<App repositorio={new MemoriaProgressRepository()} />);
    expect(
      await screen.findByRole('heading', { level: 1, name: /Pronto para o próximo passo/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Começar aula' })).toHaveAttribute(
      'href',
      '#/aula/logica.m01.a01',
    );
  });

  it('troca para o tema escuro e lembra da escolha', async () => {
    const usuario = userEvent.setup();
    render(<App repositorio={new MemoriaProgressRepository()} />);
    await usuario.click(screen.getByRole('link', { name: 'Configurações' }));
    await usuario.click(screen.getByRole('radio', { name: 'Escuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('tm:tema')).toBe('escuro');
  });

  it('mostra página de não encontrada para rota desconhecida', () => {
    window.location.hash = '#/nao-existe';
    render(<App repositorio={new MemoriaProgressRepository()} />);
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
  });
});

describe('boas-vindas', () => {
  it('na primeira visita, leva às boas-vindas e aplica as escolhas', async () => {
    const u = userEvent.setup();
    localStorage.removeItem('tm:boasVindas');
    render(<App repositorio={new MemoriaProgressRepository()} />);
    expect(
      await screen.findByRole('heading', { name: 'Bem-vindo à TechMaster Academy' }),
    ).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Vamos lá' }));
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();
    await u.click(screen.getByRole('button', { name: /Já programo/ }));
    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('button', { name: /Técnico/ })).toHaveAttribute('aria-pressed', 'true');
    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    await u.click(screen.getByRole('button', { name: 'Grande' }));
    expect(document.documentElement).toHaveClass('texto-grande');
    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    await u.click(screen.getByRole('button', { name: 'Começar a Aula 1' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: /Antes de começar/ }),
    ).toBeVisible();
    expect(localStorage.getItem('tm:boasVindas')).toBe('feita');
  });
});

describe('Seus dados', () => {
  it('pede confirmação antes de apagar o progresso', async () => {
    const usuario = userEvent.setup();
    const repo = new MemoriaProgressRepository();
    await repo.salvarProgresso({
      aulaId: 'logica.m01.a01',
      aulaVersao: 1,
      etapaAtual: 2,
      status: 'em-andamento',
      iniciadaEm: '2026-11-21T10:00:00.000Z',
      atualizadaEm: '2026-11-21T10:00:00.000Z',
    });
    render(<App repositorio={repo} />);
    await usuario.click(screen.getByRole('link', { name: 'Configurações' }));
    await usuario.click(screen.getByRole('button', { name: 'Apagar todo o progresso' }));
    expect(await repo.listarProgressos()).toHaveLength(1);

    await usuario.click(screen.getByRole('button', { name: 'Sim, apagar' }));
    expect(await screen.findByText(/Todo o progresso foi apagado/)).toBeVisible();
    expect(await repo.listarProgressos()).toEqual([]);
  });

  it('recusa um arquivo de importação inválido', async () => {
    const usuario = userEvent.setup();
    render(<App repositorio={new MemoriaProgressRepository()} />);
    await usuario.click(screen.getByRole('link', { name: 'Configurações' }));
    const arquivo = new File(['{"qualquer": "coisa"}'], 'falso.json', { type: 'application/json' });
    await usuario.upload(screen.getByLabelText('Arquivo de progresso para importar'), arquivo);
    expect(await screen.findByText(/não é um backup válido/)).toBeVisible();
  });
});
