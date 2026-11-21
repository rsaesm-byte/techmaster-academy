import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de ponta a ponta (E2E): rodam no site JÁ CONSTRUÍDO, servido como no
 * GitHub Pages (em /techmaster-academy/), num Chrome de verdade.
 * Localmente: `npm run e2e`. Com Chrome instalado no sistema, defina
 * PW_CHROME=/caminho/do/chrome para não baixar o navegador do Playwright.
 */
const chromeLocal = process.env.PW_CHROME;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173/techmaster-academy/',
    trace: 'retain-on-failure',
    // O service worker recarrega a página na 1ª visita; só o teste offline o liga.
    serviceWorkers: 'block',
    ...(chromeLocal ? { launchOptions: { executablePath: chromeLocal } } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/servir.mjs',
    url: 'http://localhost:4173/techmaster-academy/',
    reuseExistingServer: !process.env.CI,
  },
});
