/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

// O GitHub Pages serve o site em https://<usuario>.github.io/<repositorio>/.
// Por isso o "base" precisa ser o nome do repositório. Em dev local fica "/".
const REPO_BASE = '/techmaster-academy/';

// Content Security Policy: diz ao navegador de onde o site pode carregar código.
// O GitHub Pages não deixa configurar cabeçalhos HTTP, então usamos a tag <meta>.
// Só entra no build: o servidor de desenvolvimento do Vite precisa de scripts inline.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.github.com https://gist.githubusercontent.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/**
 * Gera o service worker (modo offline) no build, com a lista EXATA dos arquivos do site.
 * A versão do cache é um hash dessa lista: cada deploy novo substitui o cache antigo.
 */
function serviceWorkerPlugin(): Plugin {
  return {
    name: 'techmaster-sw',
    apply: 'build',
    generateBundle(_opcoes, bundle) {
      const arquivos = Object.keys(bundle).filter((f) => !f.endsWith('.map'));
      const publicos = [
        './',
        'favicon.svg',
        'theme-boot.js',
        'lab-runner.html',
        'manifest.webmanifest',
        'icones/icon-192.png',
        'icones/icon-512.png',
        'icones/icon-maskable-512.png',
        'icones/apple-touch-icon.png',
        'icones/icone.svg',
      ];
      const lista = [...publicos, ...arquivos];
      let h = 0;
      for (const c of lista.join('|')) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
      const versao = (h >>> 0).toString(36);
      const fonte = readFileSync(fileURLToPath(new URL('./src/sw/sw.js', import.meta.url)), 'utf8')
        .replace('__VERSAO__', versao)
        .replace('__ARQUIVOS__', JSON.stringify(lista));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: fonte });
    },
  };
}

function cspPlugin(): Plugin {
  return {
    name: 'techmaster-csp',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      ),
  };
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [react(), tailwindcss(), cspPlugin(), serviceWorkerPlugin()],
  resolve: {
    alias: {
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Nunca embutir arquivos como data: URI — a CSP (font-src 'self') bloquearia.
    assetsInlineLimit: 0,
    // O conteúdo das aulas vai para pedaços próprios (um por disciplina): o código do app
    // não cresce a cada aula nova e o navegador reaproveita o cache do que não mudou.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'aulas-logica', test: /[\\/]content[\\/]logica[\\/]/ },
            { name: 'aulas-fundamentos-a', test: /[\\/]content[\\/]fundamentos[\\/][ab]\d\d-/ },
            { name: 'aulas-fundamentos-b', test: /[\\/]content[\\/]fundamentos[\\/][cd]\d\d-/ },
            { name: 'aulas-fundamentos', test: /[\\/]content[\\/]fundamentos[\\/]/ },
            { name: 'aulas-javascript', test: /[\\/]content[\\/]javascript[\\/]/ },
            { name: 'aulas-sql', test: /[\\/]content[\\/]sql[\\/]/ },
            { name: 'aulas-redes', test: /[\\/]content[\\/]redes[\\/]/ },
            { name: 'aulas-ciberseguranca', test: /[\\/]content[\\/]ciberseguranca[\\/]/ },
            { name: 'aulas-web', test: /[\\/]content[\\/]web[\\/]/ },
            { name: 'aulas-python', test: /[\\/]content[\\/]python[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
}));
