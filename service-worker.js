const CACHE_NAME = 'cad-suite-v254-clean';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/css/style.css',
  '/css/roughness.css',
  '/js/app.js',
  '/js/data.js',
  '/js/drawProfile.js',
  '/js/reverseLookup.js',
  '/js/cameraUtils.js',
  '/js/toleranceCalculator.js',
  '/js/iso286_clean.js',
  '/js/iso286_data.js',
  '/js/isoCalculatorV2.js',
  '/js/isoExceptions.js',
  '/js/isoUI.js',
  '/js/fitApplications.js',
  '/js/keywayCalculator.js',
  '/js/keywayData.js',
  '/js/gearRatioCalculator.js',
  '/js/roughness.js',
  '/assets/icons/app-icon-192x192.png',
  '/assets/icons/app-icon-512x512.png',
  '/assets/icons/favicon-32x32.png',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Install Event: Cache all essential assets immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Opened new clean cache:', CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
});

// Activate Event: Purge ALL old caches completely
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First for HTML/Navigation, Cache fallback for offline
self.addEventListener('fetch', event => {
  const request = event.request;

  // For navigation requests or HTML pages, always try network first so user gets fresh updates
  if (request.mode === 'navigate' || request.destination === 'document' || request.url.endsWith('/') || request.url.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  // For other static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
