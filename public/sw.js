const CACHE_NAME = 'all-movies-v1'
const RUNTIME_CACHE = 'all-movies-runtime-v1'

// Recursos críticos para cachear en instalación
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install event - cache recursos críticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell')
        return cache.addAll(URLS_TO_CACHE)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - estrategia de cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo manejar GET requests
  if (request.method !== 'GET') return

  // Estrategia para diferentes tipos de recursos
  if (url.origin === location.origin) {
    // Navegación: Network First, fallback a cache
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
            return response
          })
          .catch(() => {
            return caches.match(request).then((response) => {
              return response || caches.match('/index.html')
            })
          })
      )
      return
    }

    // Assets estáticos: Cache First
    if (request.destination === 'script' || 
        request.destination === 'style' ||
        request.destination === 'font') {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone())
              return fetchResponse
            })
          })
        })
      )
      return
    }
  }

  // API requests y imágenes externas: Network First con cache fallback
  if (url.hostname.includes('api.themoviedb.org') || 
      url.hostname.includes('image.tmdb.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Solo cachear respuestas exitosas
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
    return
  }

  // Default: Network First
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  )
})

// Message event - comunicación con la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      })
    )
  }
})

// Push notifications (opcional - para futuras features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification('AllMovies', options)
  )
})

// Notification click (opcional)
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
