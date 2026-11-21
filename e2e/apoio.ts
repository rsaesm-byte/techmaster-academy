import { expect, type Page } from '@playwright/test';

/** Abre uma rota do app já tendo passado pelas boas-vindas. */
export async function abrir(page: Page, rota = '/') {
  await page.goto('');
  await page.evaluate(() => localStorage.setItem('tm:boasVindas', 'feita'));
  await page.goto(`#${rota}`);
  await page.reload();
}

/** Coleta erros de JavaScript da página; use expectSemErros no fim do teste. */
export function vigiarErros(page: Page) {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text());
  });
  return { expectSemErros: () => expect(erros).toEqual([]) };
}
