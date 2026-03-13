// Service Worker for Offline Support
const CACHE_NAME = 'travelhealthkit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/search.html',
  '/adventure-levels.html',
  '/emergency-protocols.html',
  '/infectious-diseases.html',
  '/environmental-risks.html',
  '/food-water-safety.html',
  '/kit-builder.html',
  '/shared-nav.css',
  '/level-1.html',
  '/level-2.html',
  '/level-3.html',
  '/level-4.html'
];

// Install event - cache critical pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If both cache and network fail, show offline message
          if (event.request.destination === 'document') {
            return new Response(
              '<h1>You are offline</h1><p>Some features may not be available. Emergency protocols are cached for offline access.</p>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
