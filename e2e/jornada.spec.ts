import { expect, test } from '@playwright/test';
import { abrir, vigiarErros } from './apoio';

test('primeira visita leva às boas-vindas', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveURL(/#\/boas-vindas/);
});

test('aula: responder, errar, tentar de novo e acertar', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/logica.m02.a01?etapa=ex-guiado');
  await expect(page.getByRole('heading', { name: 'Exercício guiado' })).toBeVisible();

  const resposta = page.getByRole('textbox', { name: 'O que aparece na tela?' });
  await resposta.fill('8');
  await resposta.press('Enter');
  await expect(page.getByText('v[2] vale 8, mas v[3]')).toBeVisible();

  await page.getByRole('button', { name: 'Tentar de novo' }).first().click();
  await resposta.fill('12');
  await resposta.press('Enter');
  await expect(page.getByText('v[1] = 4; v[2] = 4 * 2 = 8')).toBeVisible();
  expectSemErros();
});

test('o progresso sobrevive a recarregar a página', async ({ page }) => {
  await abrir(page, '/aula/logica.m01.a01?etapa=diag');
  await page.locator('input[type=radio]').first().check();
  await page.getByRole('button', { name: 'Verificar' }).first().click();
  await page.reload();
  await page.goto('#/progresso');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const tentativas = await page.evaluate(
    () =>
      new Promise<number>((ok) => {
        const req = indexedDB.open('techmaster');
        req.onsuccess = () => {
          const tx = req.result.transaction('tentativas', 'readonly');
          const c = tx.objectStore('tentativas').count();
          c.onsuccess = () => ok(c.result);
        };
      }),
  );
  expect(tentativas).toBeGreaterThan(0);
});

test('busca encontra aulas e termos', async ({ page }) => {
  await abrir(page, '/busca?q=recursão');
  await expect(page.getByRole('link', { name: /Recursividade/ }).first()).toBeVisible();
});

test('trilha mostra os dois módulos de Lógica', async ({ page }) => {
  await abrir(page, '/trilha/logica');
  await expect(page.getByText('Do problema ao algoritmo').first()).toBeVisible();
  await expect(page.getByText('Organizando dados e código').first()).toBeVisible();
});
