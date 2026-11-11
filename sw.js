const CACHE_NAME = 'iob-prep-v1.0.0';
const CACHE_FILES = [
  './',
  './IOB_Study_Hub.html',
  './IOB_Module_A.html',
  './IOB_Module_B.html',
  './IOB_Module_C.html',
  './IOB_Module_D.html',
  './IOB_Module_E.html',
  './IOB_Module_F.html',
  './IOB_Module_G.html',
  './IOB_Module_H.html',
  './IOB_Module_I.html',
  './IOB_Module_J.html',
  './IOB_Module_K.html',
  './IOB_Exam_Prep_Tracker.html',
  './IOB_Crash_Notes_2027.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CACHE_FILES.map((file) =>
          cache.add(file).catch((err) => console.warn('Failed:', file))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });