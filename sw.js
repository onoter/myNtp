const CACHE_NAME = 'myinfinity-offline-v3';
// 只缓存本地核心文件，不依赖任何外部 CDN
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 拦截网络请求，优先使用缓存
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存里有，直接返回缓存
        if (response) {
          return response;
        }
        // 如果缓存没有，才去联网
        return fetch(event.request);
      })
  );
});