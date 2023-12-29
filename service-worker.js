var cacheName = 'hugo-nuo-v7';
var filesToCache = [
    'https://edenmal.moe/404.html',
    'https://edenmal.moe/favicon.ico',
    'https://edenmal.moe/manifest.json',
    'https://edenmal.moe/icons/icon-16x16.png',
    'https://edenmal.moe/icons/icon-32x32.png',
    'https://edenmal.moe/icons/icon-128x128.png',
    'https://edenmal.moe/icons/icon-144x144.png',
    'https://edenmal.moe/icons/icon-152x152.png',
    'https://edenmal.moe/icons/icon-192x192.png',
    'https://edenmal.moe/icons/icon-256x256.png',
    'https://edenmal.moe/icons/icon-512x512.png',
    'https://edenmal.moe/images/avatar.png',
    'https://edenmal.moe/images/grey-prism.svg',

    'https://edenmal.moe/styles/main-rendered.min.css',


    'https://edenmal.moe/scripts/index.min.js',

    'https://edenmal.moe/scripts/pswp-init.min.js',

    // Google fonts (local)
    'https://edenmal.moe/fonts/lobster.woff2',

    
    
    
    'https://edenmal.moe/styles/icofont.min.min.css',
    'https://edenmal.moe/fonts/icofont.woff2',
    
    

    // MathJax

    'https://edenmal.moe/cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.min.120e30ad299b8d6548dd1fbb6ab1d45fb508bf080219df63e5ab9750b1241207.js',
    'https://edenmal.moe/cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/extensions/MathMenu.js',
    'https://edenmal.moe/cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/extensions/MathZoom.js',
];

// Cache the application assets
self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(filesToCache)));
});

// network first
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            return fetch(event.request)
                .then(function(response) {
                    if (response.status === 404) return caches.match('404.html');
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(function() {
                    return caches.match(event.request);
                });
        }),
    );
});

// cache-first
// If you want to use cache first, you should change cacheName manually

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then(response => {
//         if (response) return response;
//         return fetch(event.request);
//       })
//       .then(response => {
//         if (response.status === 404) return caches.match('404.html');
//         return caches.open(cacheName).then(cache => {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       })
//       .catch(error => console.log('Error, ', error)),
//   );
// });

// Delete outdated caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});
