const CACHE_NAME = 'cokhixuong-pwa-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/data.js',
  '/js/iso286_data.js',
  '/js/app.js',
  '/js/reverseLookup.js',
  '/js/toleranceCalculator.js',
  '/js/drawProfile.js',
  '/js/cameraUtils.js',
  '/manifest.json',
  '/assets/icons/app-icon-192x192.png',
  '/assets/icons/app-icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Install Event: Cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request).then(
          response => {
            // Optional: cache newly fetched resources dynamically
            // (Leaving this basic Cache-First for static assets)
            return response;
          }
        ).catch(() => {
            // Handle offline fallback if necessary
        });
      })
  );
});
