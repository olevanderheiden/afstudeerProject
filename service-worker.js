const MEDIA_CACHE = "audio-tour-media-v1";
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

self.addEventListener("fetch", (event) => {
  const url = event.request.url.toLowerCase();
  if (MEDIA_FILE_TYPES.some((ext) => url.includes(ext))) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        const networkResponse = await fetch(event.request);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      })
    );
  }
});
