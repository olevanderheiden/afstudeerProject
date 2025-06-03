const MEDIA_CACHE = "audio-tour-media-v1";
const SHELL_CACHE = "audio-tour-shell-v1";

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

self.addEventListener("fetch", (event) => {
  const url = event.request.url.toLowerCase();

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
