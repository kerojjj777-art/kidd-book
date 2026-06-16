const CACHE_NAME = 'kidds-crm-cache-v1.4.0'; // 每次更新程式碼，請更改這個版本號 (v2, v3...)
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// 安裝時快取靜態資源
self.addEventListener('install', event => {
  self.skipWaiting(); // 強制立刻接管
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 啟動時清除舊版快取 (Cache-busting)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('清除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即取得控制權
  );
});

// 攔截請求，使用 Network First 策略確保資料最新
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
