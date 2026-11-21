import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { catalogo } from '@/content';
import { MemoriaProgressRepository } from '@/persistence/memoria';

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

/** Abre cada etapa de cada aula pelo link direto: nenhuma pode quebrar ou travar. */
describe('todas as etapas renderizam', () => {
  for (const aula of catalogo.aulas.values()) {
    it(
      aula.id,
      async () => {
        for (const etapa of aula.etapas) {
          window.location.hash = `#/aula/${aula.id}?etapa=${etapa.id}`;
          const { unmount } = render(<App repositorio={new MemoriaProgressRepository()} />);
          expect(await screen.findAllByRole('heading', { level: 1 })).not.toHaveLength(0);
          unmount();
        }
      },
      60_000,
    );
  }
});
