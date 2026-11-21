// Servidor estático mínimo que imita o GitHub Pages: serve dist/ em /techmaster-academy/.
// Usado pelos testes de ponta a ponta (npm run e2e).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const BASE = '/techmaster-academy/';
const PORTA = Number(process.env.PORTA ?? 4173);
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

createServer((req, res) => {
  const caminho = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
  if (!caminho.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE }).end();
    return;
  }
  let arquivo = normalize(join('dist', caminho.slice(BASE.length)));
  if (!arquivo.startsWith('dist')) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, 'index.html');
  if (!existsSync(arquivo)) {
    res.writeHead(404).end('não encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] ?? 'application/octet-stream' });
  createReadStream(arquivo).pipe(res);
}).listen(PORTA, () => console.log(`Servindo dist/ em http://localhost:${PORTA}${BASE}`));
