import { expect, test } from '@playwright/test';
import { abrir } from './apoio';

test.use({ serviceWorkers: 'allow' });

test('depois da primeira visita, o app funciona sem internet', async ({ page, context }) => {
  await abrir(page, '/');
  // Na primeira visita o service worker se instala, assume a página e o app
  // recarrega sozinho. Esperamos até a página estar sob controle dele.
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller).catch(() => false), {
      timeout: 15_000,
    })
    .toBe(true);
  await page.waitForLoadState('load');

  await context.setOffline(true);
  await page.goto('#/aula/logica.m02.a05?etapa=demo-fatorial');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'A pilha cresce e depois desempilha' }),
  ).toBeVisible();
});
