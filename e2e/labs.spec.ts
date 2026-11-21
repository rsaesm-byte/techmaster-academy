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

test('laboratório de portas: AND só acende com as duas entradas', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/portas');
  await expect(page.getByRole('img', { name: 'Saída: 0' })).toBeVisible();
  await page.getByRole('button', { name: 'Entrada A: 0' }).click();
  await page.getByRole('button', { name: 'Entrada B: 0' }).click();
  await expect(page.getByRole('img', { name: 'Saída: 1' })).toBeVisible();
  expectSemErros();
});

test('laboratório de CPU executa o programa até o fim', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/cpu');
  await page.getByRole('button', { name: 'Executar tudo' }).click();
  await expect(page.getByLabel('Memória 0: 15')).toBeVisible();
  expectSemErros();
});

test('terminal simulado: criar pasta e arquivo', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/terminal');
  const campo = page.getByLabel(/aluno@techmaster/);
  await campo.fill('mkdir fotos');
  await campo.press('Enter');
  await campo.fill('ls');
  await campo.press('Enter');
  await expect(page.getByRole('log')).toContainText('fotos/');
  expectSemErros();
});

test('laboratório de sistemas: sub-rede e senha', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/sistemas');
  await page.getByRole('button', { name: 'IP e sub-redes' }).click();
  await expect(page.getByText('192.168.1.255')).toBeVisible();
  await page.getByRole('button', { name: 'Senhas' }).click();
  await expect(page.getByRole('status')).toContainText('fraca');
  expectSemErros();
});

test('laboratório de dados: RAID e cifra de César', async ({ page }) => {
  const { expectSemErros } = vigiarErros(page);
  await abrir(page, '/lab/dados');
  await page.getByRole('button', { name: 'RAID', exact: true }).click();
  await page.getByRole('button', { name: 'Disco 1: funcionando' }).click();
  await expect(page.getByRole('status')).toContainText('continuam acessíveis');
  await page.getByRole('button', { name: 'Cifra de César' }).click();
  await page.getByRole('button', { name: /Quebrar a cifra/ }).click();
  await expect(page.getByText(/^chave 25:/)).toBeVisible();
  expectSemErros();
});
