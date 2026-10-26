// Vanilla Service Worker: network-first for GET /api/credentials, cache fallback when offline.
const API_CACHE = 'credentials-api-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.pathname !== '/api/credentials') return;

  event.respondWith((async () => {
    const cache = await caches.open(API_CACHE);
    try {
      const fresh = await fetch(request);
      if (fresh.ok) await cache.put(request, fresh.clone()); // store last known good list
      return fresh;
    } catch (err) {
      const cached = await cache.match(request);             // offline -> last known list
      return cached || new Response(JSON.stringify({ error: 'offline_no_cache' }), {
        status: 503, headers: { 'Content-Type': 'application/json' },
      });
    }
  })());
});
// Security note: for real PII, use short TTLs / encrypted storage and clear this cache on logout.
