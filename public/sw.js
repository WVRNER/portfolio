// WVRNER Service Worker - Offline reading & installable PWA
const CACHE_VERSION = "wvrner-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const POSTS_CACHE = `${CACHE_VERSION}-posts`;

const PRECACHE_ASSETS = [
  "/offline.html",
  "/favicon.ico",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Routes that must NEVER be cached (Ghost CMS admin, previews, mutations)
function isBypassedRoute(url) {
  const pathname = url.pathname.toLowerCase();
  return (
    pathname.startsWith("/ghost") ||
    pathname.startsWith("/admin") ||
    pathname.includes("/preview") ||
    url.searchParams.has("preview") ||
    url.searchParams.has("token")
  );
}

// Install Event: Pre-cache essential fallback shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up legacy caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== POSTS_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extensions
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Never cache Ghost Admin or Preview routes
  if (isBypassedRoute(url)) {
    return;
  }

  // 1. Navigation / HTML pages (Stories, Home, Articles)
  // Strategy: Network-First so updates/new posts appear immediately when online.
  // When offline, serves previously opened pages from cache, or falls back to /offline.html.
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(POSTS_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Try blog index or offline page
          const offlinePage = await caches.match("/offline.html");
          return offlinePage || new Response("Offline", { status: 503, statusText: "Offline" });
        })
    );
    return;
  }

  // 2. Static Assets (_next/static, images, fonts, styles)
  // Strategy: Stale-While-Revalidate (Fast response from cache, background refresh)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?|css|js)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
