/* Service worker da TechMaster Academy — gerado no build (vite.config.ts).
 * Estratégia:
 *  - instalação: baixa e guarda TODOS os arquivos do site (funciona offline depois do 1º acesso);
 *  - páginas: tenta a rede primeiro (pega a versão nova) e cai no cache se estiver offline;
 *  - arquivos com hash no nome (assets/): cache primeiro — eles nunca mudam.
 * Só guarda arquivos do próprio site. Nenhum dado do aluno passa por aqui.
 */
const VERSAO = '__VERSAO__';
const CACHE = `techmaster-${VERSAO}`;
const ARQUIVOS = __ARQUIVOS__;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(
          nomes
            .filter((n) => n.startsWith('techmaster-') && n !== CACHE)
            .map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'atualizar') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copia = r.clone();
          caches.open(CACHE).then((c) => c.put('./', copia));
          return r;
        })
        .catch(() => caches.match('./')),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(
      (salvo) =>
        salvo ||
        fetch(req).then((r) => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(CACHE).then((c) => c.put(req, copia));
          }
          return r;
        }),
    ),
  );
});
