Rconst CACHE = "taawon-v1";
const FILES = [
  "/http-taawon-good.github.io/",
  "/http-taawon-good.github.io/index.html",
  "/http-taawon-good.github.io/style.css",
  "/http-taawon-good.github.io/app.js",
  "/http-taawon-good.github.io/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
