const MEDIA_CACHE = "audio-tour-media-v1";
const SHELL_CACHE = "audio-tour-shell-v1";
const API_CACHE = "audio-tour-api-v1";

const MEDIA_FILE_TYPES = [
  ".mp3",
  ".wav",
  ".mp4",
  ".webm",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
];

const SHELL_FILE_TYPES = [".js", ".css", ".html"];

// Precache app shell on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll([
        "/", // index.html
        "/index.html",
        // Add your main JS and CSS build files here:
        // "/assets/main.js",
        // "/assets/style.css",
      ])
    )
  );
  self.skipWaiting();
});

// Activate event: clean up old caches if needed
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => ![MEDIA_CACHE, SHELL_CACHE, API_CACHE].includes(key)
            )
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url.toLowerCase();

  // Cache API responses (stale-while-revalidate)
  if (
    url.includes("/wp-json/wp/v2/audio_tour") ||
    url.includes("/wp-json/wp/v2/media")
  ) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached); // fallback to cache if offline
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Cache media files
  if (MEDIA_FILE_TYPES.some((ext) => url.includes(ext))) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  // Cache app shell files
  if (SHELL_FILE_TYPES.some((ext) => url.includes(ext))) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }
});
