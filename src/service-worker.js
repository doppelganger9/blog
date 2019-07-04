import { timestamp, files, shell, routes } from '@sapper/service-worker';

const ASSETS = `cache${timestamp}`;

// for running an exported build, else, ignore!
const forgottenExportJsonFiles = [
  'index.json',
  '2019/07/04.json',
  '2019/06/30.json',
  '2019/06/21.json',
  '2019/06/29.json',
  '2019/06/16.json',
  '2019/05/20.json',
  '2019/03/31.json',
  '2019/04/02.json',
  'rss',
  '2019/03/20.json',
  '2019/03/26.json',
  'sitemap.xml',
  '2019/03/17.json',
  '2019/03/16.json',
  '2019/03/14.json',
  '2019/03/12.json',
  '2019/03/10.json',
  '2019/03/07.json',
  '2019/03/06.json',
  'hello-world.json',
  'browserconfig.xml',
  'future/this-blog-is-100-PWA.json',
  'alternate-reality/migrating-to-lumen-starter.json',
  'future/publishing-all-the-things.json',
  'future/bias-of-using-too-much-biases.json',
];

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = shell.concat(files).concat(forgottenExportJsonFiles);

const cached = new Set(to_cache);

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(ASSETS)
      .then(cache => cache.addAll(to_cache))
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(async keys => {
      // delete old caches
      for (const key of keys) {
        if (key !== ASSETS) await caches.delete(key);
      }

      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

  const url = new URL(event.request.url);

  // don't try to handle e.g. data: URIs
  if (!url.protocol.startsWith('http')) return;

  // ignore dev server requests
  if (url.hostname === self.location.hostname && url.port !== self.location.port) return;

  // always serve static files and bundler-generated assets from cache
  if (url.host === self.location.host && cached.has(url.pathname.slice(1))) {
    event.respondWith(caches.match(event.request));
    return;
  }

  // for pages, you might want to serve a shell `service-worker-index.html` file,
  // which Sapper has generated for you. It's not right for every
  // app, but if it's right for yours then uncomment this section
  /*
  if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
    event.respondWith(caches.match('/service-worker-index.html'));
    return;
  }
  */

  if (event.request.cache === 'only-if-cached') return;

  // for everything else, try the network first, falling back to
  // cache if the user is offline. (If the pages never change, you
  // might prefer a cache-first approach to a network-first one.)
  event.respondWith(
    caches
      .open(`offline${timestamp}`)
      .then(async cache => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch(err) {
          const response = await cache.match(event.request);
          if (response) return response;

          throw err;
        }
      })
  );
});
