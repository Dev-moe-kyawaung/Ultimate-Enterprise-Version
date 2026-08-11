/**
 * Quantum Portfolio Pro - Service Worker v3.0.0
 */

const CACHE_NAME = 'quantum-portfolio-v3';
const CACHE_VERSION = 3;

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/components.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/css/themes.css',
    '/js/app.js',
    '/js/data.js',
    '/js/animations.js',
    '/js/particles.js',
    '/js/quantum.js',
    '/js/utilities.js',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@300;400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Navigation requests - network first, fallback to cache
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match('/index.html');
                })
        );
        return;
    }
    
    // Static assets - cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then((response) => {
                        // Cache new requests
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback
                        return caches.match('/404.html');
                    });
            })
    );
});

// Message event
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
