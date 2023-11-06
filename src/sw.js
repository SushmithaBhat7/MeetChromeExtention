const CACHE_NAME = "my-app-cache-v1"; // Change this to a unique name for your app
const CACHE_FILES = [
  //   "/", // Cache the root URL
  //   "/index.html", // Cache specific HTML files
  //   "/css/styles.css", // Cache CSS files
  //   "/js/main.js", // Cache JavaScript files
  // Add more files to cache as needed
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If a cached response is found, return it
      if (response) {
        return response;
      }

      // If no cached response is found, fetch from the network
      return fetch(event.request);
    })
  );
});
