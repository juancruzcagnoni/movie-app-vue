const cache = "cinephile-cache";  
const assets = [  // Lista de recursos a almacenar en el caché
  "index.html",
  "movies.json",
  "img/avengers.png",
  "img/batman.png",
  "img/blackwidow.png",
  "img/darknight.png",
  "img/flight.png",
  "img/forrestgump.png",
  "img/godfather.png",
  "img/inception.png",
  "img/inglorious.png",
  "img/interstellar.png",
  "img/joker.png",
  "img/lion.png",
  "img/logo-fi.png",
  "img/logo-wh.png",
  "img/logo.png",
  "img/lord.png",
  "img/matrix.png",
  "img/pulp.png",
  "img/shawshank.png",
  "img/social.png",
  "img/spiderman.png",
  "img/theavengers.png",
  "img/titanic.png",
  "app.js",
  "css/style.css",
];

// Evento "install" del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cache).then((cache) => {
      // Almacenar los recursos en el caché
      return cache.addAll(assets);
    })
  );
});

// Evento "fetch" del Service Worker
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver el recurso desde el caché si está disponible, o realizar una solicitud de red
      return response || fetch(event.request);
    })
  );
});
