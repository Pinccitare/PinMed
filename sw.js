/* PinMed — Service Worker
   Guarda o app no computador para abrir sem internet.
   Estratégia: Stale-While-Revalidate com atualização segura (sem interromper consulta ativa). */
const CACHE = 'pinmed-v42';
const ARQUIVOS_CORE = ['./', './index.html', './manifest.json'];
const ARQUIVOS_OPCIONAIS = ['./icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const ARQUIVOS = [...ARQUIVOS_CORE, ...ARQUIVOS_OPCIONAIS];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Núcleo essencial: recarrega ignorando cache HTTP antigo
    await Promise.all(ARQUIVOS_CORE.map(async u => {
      const res = await fetch(new Request(u, { cache: 'reload' }));
      if (!res.ok) throw new Error(`Falha ao cachear ${u}: HTTP ${res.status}`);
      const clean = res.redirected
        ? new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers })
        : res;
      await cache.put(u, clean);
    }));
    // Ícones e recursos complementares: falha isolada não bloqueia a instalação
    await Promise.allSettled(
      ARQUIVOS_OPCIONAIS.map(u => cache.add(new Request(u, { cache: 'reload' })))
    );
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('pinmed-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.cache === 'no-store') return;
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/__pinmed/')) return;

  if (req.mode === 'navigate') {
    const rede = fetch(req).then(async res => {
      if (res && res.ok && res.type === 'basic' && !res.redirected) {
        const clone = res.clone();
        const cache = await caches.open(CACHE);
        await cache.put('./index.html', clone);
      }
      return res;
    });
    e.waitUntil(rede.catch(() => {}));
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = (await cache.match('./index.html')) || (await cache.match('./'));
      if (hit) return hit;
      try {
        return await rede;
      } catch {
        return (await cache.match('./index.html'))
          || (await cache.match('./'))
          || new Response('PinMed offline — recarregue a página.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  const assetKey = url.origin + url.pathname;
  const rede = fetch(req).then(async res => {
    if (res && res.ok && res.type === 'basic' && !res.redirected) {
      const clone = res.clone();
      const cache = await caches.open(CACHE);
      await cache.put(assetKey, clone);
    }
    return res;
  });
  e.waitUntil(rede.catch(() => {}));
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      return await rede;
    } catch {
      return new Response('', { status: 503 });
    }
  })());
});
