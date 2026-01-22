const CACHE_NAME = 'manhwalog-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Solo cacheamos peticiones GET y evitamos cachear Firestore/Firebase
  if (e.request.method === 'GET' && !e.request.url.includes('firestore.googleapis.com') && !e.request.url.includes('google-analytics.com')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        // Estrategia Stale-While-Revalidate: Devuelve cache pero actualiza en fondo
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse.clone()));
          return networkResponse;
        });
        return cached || fetchPromise;
      })
    );
  }
});