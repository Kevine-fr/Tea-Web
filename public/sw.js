/* public/sw.js — Service Worker Thé Tip Top */

const CACHE_NAME   = 'the-tip-top-v1'
const STATIC_CACHE = 'the-tip-top-static-v1'

/* Ressources mises en cache dès l'installation */
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/images/Footer/img_01.png',
]

/* ── Install : précache des ressources statiques ─────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

/* ── Activate : nettoyage des anciens caches ─────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

/* ── Fetch : stratégie Network-first pour l'API,
             Cache-first pour les assets statiques ────────── */
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  /* Ignorer les requêtes non-GET et cross-origin (API) */
  if (request.method !== 'GET') return
  if (!url.origin.includes(self.location.origin)) return

  /* Routes API → Network only (pas de cache) */
  if (url.pathname.startsWith('/api/')) return

  /* Assets statiques → Cache first, network fallback */
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(request, clone))
          return res
        })
      })
    )
    return
  }

  /* Pages HTML → Network first, cache fallback (offline) */
  event.respondWith(
    fetch(request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(request, clone))
        return res
      })
      .catch(() => caches.match(request).then(c => c || caches.match('/')))
  )
})