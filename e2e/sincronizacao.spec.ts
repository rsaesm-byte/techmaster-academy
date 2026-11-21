import { expect, test, type Route } from '@playwright/test';
import { abrir } from './apoio';

/** Simula a API de Gists do GitHub (a CSP do site precisa permitir api.github.com). */
async function githubFalso(route: Route) {
  const req = route.request();
  const url = new URL(req.url());
  const json = (corpo: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(corpo) });
  if (req.headers()['authorization'] !== 'Bearer ghp_teste') return json({}, 401);
  if (url.pathname === '/user') return json({ login: 'aluno-teste' });
  if (url.pathname === '/gists' && req.method() === 'GET') return json([]);
  if (url.pathname === '/gists' && req.method() === 'POST')
    return json({ id: 'g1', files: JSON.parse(req.postData() ?? '{}').files }, 201);
  return json({ id: 'g1', files: {} });
}

test('conectar o token e ver o progresso sincronizado', async ({ page }) => {
  await page.route('https://api.github.com/**', githubFalso);
  await abrir(page, '/configuracoes');

  const campo = page.getByLabel('Token do GitHub');
  await campo.fill('ghp_errado');
  await page.getByRole('button', { name: 'Conectar' }).click();
  await expect(page.getByRole('alert')).toContainText('recusou o token');

  await campo.fill('ghp_teste');
  await page.getByRole('button', { name: 'Conectar' }).click();
  await expect(page.getByText('Conectado como')).toContainText('aluno-teste');
  await expect(page.getByRole('status').filter({ hasText: 'Sincronizado' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Progresso sincronizado' })).toBeVisible();
});
