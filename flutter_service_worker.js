'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "700319c313f935c4d4f54fa0a333367e",
"index.html": "797e5050a43819e4d519d635602ef71d",
"/": "797e5050a43819e4d519d635602ef71d",
"main.dart.js": "b20127f452a9bc5e5c71493d9df280a0",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "151bc4ba7e602eb14c77545c995d1454",
"icons/Icon-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"icons/Icon-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"manifest.json": "0bf0980b639140c925ee33956568b57e",
"assets/AssetManifest.json": "1de4d3494f8c0860b7b99f6ef58ddec8",
"assets/NOTICES": "d4d858515c2c68f254d9aaff56cfcd19",
"assets/FontManifest.json": "f8ec27312bf02bf4ac4f918c39934293",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "8c7bf4a6ef9a1fa6dde4424355f97fa2",
"assets/fonts/MaterialIcons-Regular.otf": "7cb8ada5d2c983d6498d2cdf4de3f7a7",
"assets/assets/images/projects/renaldocx.png": "2ca20c81c07259a7bda8eab9d77992c7",
"assets/assets/images/projects/web_portfolio.png": "05e8edd23cf8ba9f3d3b97e47124647e",
"assets/assets/images/projects/servd.png": "6df989be0e03fb4fd4c96b063bd66cea",
"assets/assets/images/projects/kantin_go.png": "d4e732731c9fd56557ddf2718449dcaa",
"assets/assets/images/projects/slidable_button.png": "022cd12017b4a372876eae55cb3fc743",
"assets/assets/images/projects/ppid_kemenparekraf.png": "f248787c13090384bae5a9fe5ab63326",
"assets/assets/images/profile_picture.jpg": "a696152e051cf2b6d33f5f85229c8bf0",
"assets/assets/images/development_icon.png": "189541aa0f95e7c39331c63346613111",
"assets/assets/images/work_experience/cilsy_fiolution.jpeg": "c108921da93fab069c27ebb57ee8eae0",
"assets/assets/images/work_experience/frisidea.jpeg": "adbb35ee1ad6ea752bd0fb2bdbc40255",
"assets/assets/images/work_experience/tmi.jpg": "6277d7ae69cbe25fc510cc20a1c0ea1b",
"assets/assets/images/work_experience/solu.jpeg": "8736d1355f4b77fa48c53d14b93aa885",
"assets/assets/fonts/CustomIcons.ttf": "2e06f3c3d0384e90fa177940bcf740e7",
"assets/assets/data/projects.json": "138770edb1a65c0c2ad099ae09365ceb",
"assets/assets/data/work_experience.json": "7ed21322d7bc7f9b40cfe5a7d71b7dee",
"assets/assets/data/contact.json": "1a01092927888dc5653d7ed8c77785f5",
"assets/assets/data/educations.json": "00b6f7cd7696b2d7fc07c6c8ee04c378",
"assets/assets/data/skills.json": "82df916f14a116f6709a461252c35ba4",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "1a074e8452fe5e0d02b112e22cdcf455",
"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "be0e3b33510f5b7b0cc76cc4d3e50048",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/canvaskit.wasm": "42df12e09ecc0d5a4a34a69d7ee44314",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
