// Service Worker for QUANTUM TOOLS - Mobile Optimized
// Enhanced for better mobile device compatibility and performance

const CACHE_NAME = 'quantum-tools-v2.0';
const STATIC_CACHE = 'quantum-tools-static-v2.0';
const DYNAMIC_CACHE = 'quantum-tools-dynamic-v2.0';

// Core files for offline functionality (optimized for mobile)
const CORE_FILES = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './dropdown-styles.css',
    './navigation-config.js',
    './offline.html',
    './404.html',
    './manifest.json'
];

// Enhanced scripts and styles (mobile-optimized paths)
const ENHANCED_FILES = [
    './Home%20page/enhanced-script.js',
    './Home%20page/animations.css',
    './Home%20page/enhancements.css',
    './Home%20page/universal-nav.css',
    './Home%20page/preloader.css',
    './mobile-optimizations.css'
];

// Critical tool pages for mobile users
const CRITICAL_TOOLS = [
    './Image%20tools/bg%20remover/bg-remover.html',
    './PDF%20tools/pdf-toolkit.html',
    './Developer%20tools/Editor%20with%20Live%20Preview/code-editor.html',
    './utility%20tools/QR%20code%20generator/qr-generator.html',
    './text%20based%20tools/word-counter/index.html'
];

// Mobile device detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        self.navigator.userAgent || ''
    );
}

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing v2.0...');

    event.waitUntil(
        Promise.all([
            // Cache core files
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[ServiceWorker] Caching core files');
                return cache.addAll(CORE_FILES);
            }),
            // Cache enhanced files for better experience
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[ServiceWorker] Caching enhanced files');
                return cache.addAll(ENHANCED_FILES.filter(file => file)).catch(err => {
                    console.warn('[ServiceWorker] Some enhanced files not found:', err);
                });
            })
        ]).then(() => {
            console.log('[ServiceWorker] Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('[ServiceWorker] Installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating v2.0...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[ServiceWorker] Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - mobile-optimized request handling
self.addEventListener('fetch', event => {
    const request = event.request;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Mobile-specific handling
    const mobile = isMobileDevice();

    event.respondWith(handleRequest(request, mobile));
});

// Smart request handling strategy
async function handleRequest(request, isMobile) {
    const url = new URL(request.url);

    try {
        // Check cache first for static resources
        if (isStaticResource(request.url)) {
            return await cacheFirstStrategy(request);
        }

        // For HTML pages, use stale-while-revalidate
        if (request.headers.get('accept').includes('text/html')) {
            return await staleWhileRevalidateStrategy(request, isMobile);
        }

        // For other resources, try network first
        return await networkFirstStrategy(request);

    } catch (error) {
        console.error('[ServiceWorker] Request failed:', error);

        // Return appropriate fallback
        if (request.headers.get('accept').includes('text/html')) {
            return await getFallbackPage(request);
        }

        throw error;
    }
}

// Cache-first strategy for static resources
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Update cache in background
        fetch(request).then(response => {
            if (response.ok) {
                caches.open(STATIC_CACHE).then(cache => {
                    cache.put(request, response.clone());
                });
            }
        }).catch(() => { }); // Silently fail background updates

        return cachedResponse;
    }

    // If not in cache, fetch and cache
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }

    return networkResponse;
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Stale-while-revalidate strategy for pages
async function staleWhileRevalidateStrategy(request, isMobile) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await caches.match(request);

    // Start fetch in background
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('[ServiceWorker] Network failed for:', request.url);
        return null;
    });

    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // Otherwise wait for network
    return fetchPromise || getFallbackPage(request);
}

// Get appropriate fallback page
async function getFallbackPage(request) {
    // Try offline page first
    const offlinePage = await caches.match('./offline.html');
    if (offlinePage) {
        return offlinePage;
    }

    // Fallback to 404 page
    const errorPage = await caches.match('./404.html');
    if (errorPage) {
        return errorPage;
    }

    // Last resort - basic offline response
    return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
            <title>Offline - QUANTUM TOOLS</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .offline { color: #666; }
            </style>
        </head>
        <body>
            <div class="offline">
                <h1>You're Offline</h1>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        </body>
        </html>`,
        {
            headers: { 'Content-Type': 'text/html' }
        }
    );
}

// Helper function to identify static resources
function isStaticResource(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.includes(ext));
}

// Background sync for mobile data optimization
self.addEventListener('sync', event => {
    console.log('[ServiceWorker] Background sync:', event.tag);

    if (event.tag === 'mobile-analytics') {
        event.waitUntil(syncMobileAnalytics());
    }
});

// Sync analytics data efficiently for mobile
async function syncMobileAnalytics() {
    try {
        // Batch and compress analytics data for mobile networks
        console.log('[ServiceWorker] Syncing mobile analytics');
        // Implementation would go here
    } catch (error) {
        console.error('[ServiceWorker] Mobile analytics sync failed:', error);
    }
}

// Push notification handling optimized for mobile
self.addEventListener('push', event => {
    const defaultData = {
        title: 'QUANTUM TOOLS',
        body: 'New features available!',
        icon: './assets/icon-192x192.png',
        badge: './assets/badge-72x72.png',
        data: { url: './' },
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: './assets/action-open.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: './assets/action-dismiss.png'
            }
        ]
    };

    let notificationData = defaultData;

    if (event.data) {
        try {
            notificationData = { ...defaultData, ...event.data.json() };
        } catch (error) {
            console.error('[ServiceWorker] Push data parsing failed:', error);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    const targetUrl = event.notification.data?.url || './';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }

            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_CACHE_INFO') {
        getCacheInfo().then(info => {
            event.ports[0].postMessage(info);
        });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearOldCaches().then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Get cache information
async function getCacheInfo() {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
    }

    return {
        cacheNames,
        totalItems: totalSize,
        version: CACHE_NAME
    };
}

// Clear old caches
async function clearOldCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                return caches.delete(cacheName);
            }
        })
    );
}

// Error handling
self.addEventListener('error', event => {
    console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('[ServiceWorker] Unhandled promise rejection:', event.reason);
});

console.log('[ServiceWorker] Mobile-optimized service worker loaded');
