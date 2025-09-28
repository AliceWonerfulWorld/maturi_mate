// Service Worker for Matsuri Mate
// 基本的なService Worker設定

const CACHE_NAME = 'matsuri-mate-v1';
const urlsToCache = [
  '/',
  '/participant',
  '/organizer',
  '/manifest.json'
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時の処理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあれば返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      }
    )
  );
});

// アクティベート時の処理
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
