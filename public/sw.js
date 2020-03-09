const STATIC_CACHE_NAME = 'static-v8';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';
const requests = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

self.addEventListener('install', handleInstallEvent);
self.addEventListener('activate', handleActiveEvent);
self.addEventListener('fetch', handleFetchEvent);


function handleInstallEvent(e) {
    console.log('[SW] install', e);
    e.waitUntil(
        caches
            .open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('[SW] precaching app shell');
                cache.addAll(requests);
            })
    ); //waiting a connection with cache
}

function handleActiveEvent(e) {
    console.log('[SW] activate', e);

    e.waitUntil(
        caches
            .keys()
            .then(keys => Promise.all(keys.map(transformKeyToPromise)))
    );

}

function handleFetchEvent(e) {
    console.log('[SW] fetch event handle', e);

    function saveResToCache(res) {
        return caches
            .open(DYNAMIC_CACHE_NAME)
            .then(cache => void cache.put(e.request.url, res.clone()) || res)
    }

    const response = caches
        .match(e.request)
        .then(response => response
            ? response
            : fetch(e.request)
                .then(saveResToCache))
                .catch(() => caches
                    .open(STATIC_CACHE_NAME)
                    .then(cache => cache.match('/offline.html')));

    e.respondWith(response);
}

function transformKeyToPromise(key) {
    return STATIC_CACHE_NAME !== key || DYNAMIC_CACHE_NAME !== key
        ? console.log('[SW removing old cache]', key) || caches.delete(key)
        : new Promise(resolve => resolve(null))
}
