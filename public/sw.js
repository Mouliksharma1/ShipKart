const CACHE_NAME = "shipkart-v1.0.0";
const STATIC_CACHE = "shipkart-static-v1.0.0";
const DYNAMIC_CACHE = "shipkart-dynamic-v1.0.0";

const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/shipkartLogo.png",
  "/rajasthanmap.jpeg",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Routes that must NEVER be cached
const NEVER_CACHE_URLS = [
  "/api/auth",
  "/api/admin",
  "/api/finance",
  "/api/booking",
  "/api/dispatch",
  "/login",
  "/employee/login",
  "/admin/login"
];

// Service Worker Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[ServiceWorker] Pre-caching core static assets");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[ServiceWorker] Pre-cache partial failure:", err);
      });
    })
  );
  self.skipWaiting();
});

// Service Worker Activation & Old Cache Purge
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== CACHE_NAME) {
            console.log("[ServiceWorker] Purging old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Interception
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension requests
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Never cache sensitive authentication, admin, or API requests
  if (NEVER_CACHE_URLS.some((path) => url.pathname.startsWith(path))) {
    return;
  }

  // Strategy 1: Cache First for Static Assets (Images, Fonts, Scripts, Styles)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|woff2?|ttf|eot)$/i) ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return empty response or static fallback if needed
            return new Response("", { status: 408, statusText: "Offline static asset unavailable" });
          });
      })
    );
    return;
  }

  // Strategy 2: Network First with Cache Fallback for HTML Navigation
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return Offline Fallback Page if page not in cache
          const offlinePage = await caches.match("/offline");
          if (offlinePage) {
            return offlinePage;
          }
          return new Response("Offline mode active. Please reconnect to the internet.", {
            headers: { "Content-Type": "text/html" }
          });
        })
    );
    return;
  }
});

// Client Message Listener for SW Updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
