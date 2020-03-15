const STATIC_CACHE_NAME = 'static-v4.2';
const DYNAMIC_CACHE_NAME = 'dynamic-v3.4';
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

    return self.clients.claim();
}

//TODO:Strategy cache first

// function handleFetchEvent(e) {
//     console.log('[SW] fetch event handle', e);
//
//     function saveResToCache(res) {
//         return caches
//             .open(DYNAMIC_CACHE_NAME)
//             .then(cache => void cache.put(e.request.url, res.clone()) || res)
//     }
//
//     const response = caches
//         .match(e.request)
//         .then(response => response
//             ? response
//             : fetch(e.request)
//                 .then(saveResToCache))
//                 .catch(() => caches
//                     .open(STATIC_CACHE_NAME)
//                     .then(cache => cache.match('/offline.html')));
//
//     e.respondWith(response);
// }


//TODO: Strategy network first
function handleFetchEvent(event) {
    console.log('[SW] fetch event handle', event);

    const response = fetch(event.request)
        .then((res) => saveResToCache(res, event))
        .catch((err) => errorHandler(err, event));

    event.respondWith(response);
}


function saveResToCache(res, e) {
    return caches
        .open(DYNAMIC_CACHE_NAME)
        .then(cache => void cache.put(e.request.url, res.clone()) || res)
}

function errorHandler(err, e) {
    console.error('[SW fetch handler request catching]', err);

    return caches
        .match(e.request)
        .then(response => {
            if (response) return response;

            return caches
                .open(STATIC_CACHE_NAME)
                .then(cache => cache.match('/offline.html'))
                .catch(err => console.log('[SW] failed attempt to get an offline page from the cache'))
        });
}

function transformKeyToPromise(key) {
    if (STATIC_CACHE_NAME !== key && DYNAMIC_CACHE_NAME !== key) {
        console.log('[SW removing old cache]', key);

        return caches.delete(key);
    }

    return new Promise(resolve => resolve(null));
}
