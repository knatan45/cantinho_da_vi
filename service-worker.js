/* ALECRIM — service worker.
   Guarda em cache SOMENTE os arquivos estáticos deste próprio site.
   Páginas de outros sites nunca passam por aqui nem são armazenadas.
   Para forçar atualização depois de editar arquivos, troque CACHE_VERSION. */
const CACHE_VERSION = 'alecrim-v1';
const ASSETS = [
  './', 'index.html', 'style.css', 'script.js', 'sites.js', 'config.js',
  'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // nunca intercepta sites de terceiros

  // Rede primeiro (para as edições aparecerem); cache como reserva sem internet.
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
  );
});
