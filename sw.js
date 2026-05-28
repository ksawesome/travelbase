// TravelBase — Service Worker (PWA Offline Support)
const CACHE_NAME = 'travelbase-v1';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/login.css',
  './css/index.css',
  './css/components.css',
  './css/pages.css',
  './js/crypto.js',
  './js/auth.js',
  './js/store.js',
  './js/router.js',
  './js/timer.js',
  './js/app.js',
  './js/pages/dashboard.js',
  './js/pages/packing.js',
  './js/pages/predeparture.js',
  './js/pages/postarrival.js',
  './js/pages/documents.js',
  './js/pages/budget.js',
  './js/pages/timeline.js',
  './js/pages/transport.js',
  './js/pages/weather.js',
  './js/pages/contacts.js',
  './js/pages/admin.js',
];

// Install — precache all critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache-first for app assets, network-first for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for external APIs (weather, etc.)
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for app assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
