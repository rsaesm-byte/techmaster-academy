import { expect, test, type Locator, type Page } from '@playwright/test';
import { abrir, vigiarErros } from './apoio';

/** Responde uma questão de texto e espera o retorno aparecer. */
async function responder(resposta: Locator, texto: string, retorno: Locator) {
  // A aula carrega o progresso salvo logo depois de aparecer; se a resposta for
  // digitada nesse instante, a tela é redesenhada. Por isso tentamos até o retorno aparecer.
  await expect(async () => {
    if (await retorno.isVisible()) return;
    await resposta.fill(texto);
    await resposta.press('Enter');
    await expect(retorno).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 10_000 });
}

const contarTentativas = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<number>((ok) => {
        const req = indexedDB.open('techmaster');
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('tentativas')) return ok(0);
          const c = db.transaction('tentativas', 'readonly').objectStore('tentativas').count();
          c.onsuccess = () => ok(c.result);
        };
        req.onerror = () => ok(0);
      }),
  );

test('primeira visita leva às boas-vindas', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveURL(/#\/boas-vindas/);
});

test('aula: responder, errar, tentar de novo e acertar', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/logica.m02.a01?etapa=ex-guiado');
  await expect(page.getByRole('heading', { name: 'Exercício guiado' })).toBeVisible({
    timeout: 15_000,
  });

  const resposta = page.getByRole('textbox', { name: 'O que aparece na tela?' });
  await responder(resposta, '8', page.getByText('v[2] vale 8, mas v[3]'));

  await page.getByRole('button', { name: 'Tentar de novo' }).first().click();
  await responder(resposta, '12', page.getByText('v[1] = 4; v[2] = 4 * 2 = 8'));
  expectSemErros();
});

test('o progresso sobrevive a recarregar a página', async ({ page }) => {
  await abrir(page, '/aula/logica.m01.a01?etapa=diag');
  await page.locator('input[type=radio]').first().check();
  await page.getByRole('button', { name: 'Verificar' }).first().click();
  await expect.poll(() => contarTentativas(page)).toBeGreaterThan(0);

  await page.reload();
  await page.goto('#/progresso');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await contarTentativas(page)).toBeGreaterThan(0);
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

test('aula de Fundamentos abre com a simulação de binário', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/fundamentos.m01.a01?etapa=demo');
  await expect(page.getByRole('heading', { name: 'Ligue e desligue os bits' })).toBeVisible();
  await expect(page.getByRole('region', { name: /binário/i }).first()).toBeVisible();
  expectSemErros();
});

test('trilha de Fundamentos mostra os dois módulos', async ({ page }) => {
  await abrir(page, '/trilha/fundamentos');
  await expect(page.getByText('Como o computador pensa')).toBeVisible();
  await expect(page.getByText('Sistemas, redes e segurança').first()).toBeVisible();
});

test('aula de JavaScript executa o código no console', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/javascript.m01.a01?etapa=demo');
  await page.getByRole('button', { name: /executar/i }).click();
  await expect(page.getByRole('log')).toContainText('Ana tem 21 anos', { timeout: 15_000 });
  expectSemErros();
});

test('aula de SQL executa a consulta e mostra a tabela', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/sql.m01.a01?etapa=demo');
  await expect(page.getByRole('cell', { name: 'Sorocaba' }).first()).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole('button', { name: 'Executar' }).click();
  await expect(page.getByRole('columnheader', { name: 'cidade' })).toBeVisible();
  expectSemErros();
});

test('exercício de SQL: escrever a consulta e ser corrigido pelo resultado', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/aula/sql.m01.a01?etapa=desafio');
  const campo = page.getByLabel('Sua consulta (SQL)');
  await campo.fill('SELECT nome FROM clientes;');
  await page.getByRole('button', { name: 'Verificar' }).first().click();
  await expect(page.getByText(/devolveu 1 coluna/)).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Tentar de novo' }).click();
  await campo.fill('SELECT nome, idade FROM clientes;');
  await page.getByRole('button', { name: 'Verificar' }).first().click();
  await expect(page.getByText('Correto!')).toBeVisible({ timeout: 15_000 });
  expectSemErros();
});
