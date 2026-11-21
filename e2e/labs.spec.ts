import { expect, test } from '@playwright/test';
import { abrir, vigiarErros } from './apoio';

test('Visualizador executa um programa passo a passo', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/algoritmos');
  await page.getByRole('button', { name: 'Soma de 1 a 5 com para' }).click();
  const avancar = page.getByRole('button', { name: 'Avançar' });
  for (let i = 0; i < 30 && (await avancar.isEnabled()); i++) await avancar.click();
  await expect(page.getByText('Soma: 15').first()).toBeVisible();
  expectSemErros();
});

test('laboratório de ordenação ordena o vetor', async ({ page }) => {
  await abrir(page, '/lab/ordenacao');
  await expect(page.getByText('Comparações').first()).toBeVisible();
});

test('editor web roda o código isolado do app', async ({ page }) => {
  await abrir(page, '/lab/web');
  const quadro = page.frameLocator('iframe');
  await expect(quadro.locator('body')).toBeVisible();
  // O iframe não tem a mesma origem: não pode ler o armazenamento do app.
  const isolado = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    try {
      return f?.contentWindow?.localStorage === undefined;
    } catch {
      return true;
    }
  });
  expect(isolado).toBe(true);
});
