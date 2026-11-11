// ==========================================
// 스마트 농업도우미 Pro 서비스 워커 (sw.js)
// ==========================================

const CACHE_NAME = 'agri-pro-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. 서비스 워커 설치: 자원 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 스마트 농업도우미 Pro 캐시 완료');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. 서비스 워커 활성화: 옛 캐시 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. 네트워크 요청 처리 (GET: 네트워크 우선, POST: Bypass)
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseCopy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
