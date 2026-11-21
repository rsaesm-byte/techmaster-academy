import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { dataLocal, somarDias } from '@/engines/srs/sm2';
import { MemoriaProgressRepository } from '@/persistence/memoria';

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

const hoje = dataLocal(new Date());
const cartao = (id: string, item: string) => ({
  id,
  aulaId: 'logica.m01.a01',
  origem: 'flashcard' as const,
  itemId: item,
  facilidade: 2.5,
  repeticoes: 0,
  intervaloDias: 0,
  proximaRevisao: hoje,
  historico: [],
});

describe('revisão espaçada', () => {
  it('painel avisa as revisões vencidas; "Bom" agenda para amanhã; "Errei" volta para o fim da fila', async () => {
    const u = userEvent.setup();
    const repo = new MemoriaProgressRepository();
    await repo.salvarCartoes([
      cartao('fc:logica.m01.a01.fc1', 'logica.m01.a01.fc1'),
      cartao('fc:logica.m01.a01.fc2', 'logica.m01.a01.fc2'),
    ]);
    window.location.hash = '';
    render(<App repositorio={repo} />);
    await u.click(await screen.findByRole('link', { name: /revisões vencem hoje/ }));

    expect(await screen.findByText('O que é um algoritmo?')).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Mostrar resposta' }));
    await u.click(screen.getByRole('button', { name: /Bom/ }));

    expect(await screen.findByText('Quais são as três partes de um algoritmo?')).toBeVisible();
    await u.click(screen.getByRole('button', { name: 'Mostrar resposta' }));
    await u.click(screen.getByRole('button', { name: /Errei/ }));
    // Errou: o mesmo cartão volta (é o único que sobrou na fila).
    expect(await screen.findByText('Quais são as três partes de um algoritmo?')).toBeVisible();

    const salvos = new Map((await repo.listarCartoes()).map((c) => [c.itemId, c]));
    expect(salvos.get('logica.m01.a01.fc1')).toMatchObject({
      proximaRevisao: somarDias(hoje, 1),
      repeticoes: 1,
    });
    expect(salvos.get('logica.m01.a01.fc2')).toMatchObject({ proximaRevisao: hoje, repeticoes: 0 });
  });

  it('sem cartões vencidos, explica como eles chegam', async () => {
    window.location.hash = '#/revisao';
    render(<App repositorio={new MemoriaProgressRepository()} />);
    expect(await screen.findByText(/entram aqui quando você vê os flashcards/)).toBeVisible();
  });
});
