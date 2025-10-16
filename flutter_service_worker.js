'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "f641000894f3b28940a7ec7906788f77",
"assets/AssetManifest.bin.json": "2feefa7978ebf744f3c12d02b2d958c7",
"assets/AssetManifest.json": "a99a9acd922cd2f22774151b026cae22",
"assets/assets/data/contact.json": "a555ee65ffd3577738285d1bbad101be",
"assets/assets/data/educations.json": "ba17e868da863a2f580daa72a592e148",
"assets/assets/data/projects.json": "530f0e2fb7076b235ca9f4ab82fabcc5",
"assets/assets/data/skills.json": "b2e8eed1222f09fb6bd46ba0a50fc943",
"assets/assets/data/work_experience.json": "d4762bd0750102776fd1f13322f9948f",
"assets/assets/icons/CustomIcons.ttf": "2e06f3c3d0384e90fa177940bcf740e7",
"assets/assets/images/development_icon.png": "189541aa0f95e7c39331c63346613111",
"assets/assets/images/profile_picture.jpg": "a696152e051cf2b6d33f5f85229c8bf0",
"assets/assets/images/projects/kantin_go.png": "d4e732731c9fd56557ddf2718449dcaa",
"assets/assets/images/projects/ppid_kemenparekraf.png": "f248787c13090384bae5a9fe5ab63326",
"assets/assets/images/projects/renaldocx.png": "2ca20c81c07259a7bda8eab9d77992c7",
"assets/assets/images/projects/servd.png": "6df989be0e03fb4fd4c96b063bd66cea",
"assets/assets/images/projects/slidable_button.png": "022cd12017b4a372876eae55cb3fc743",
"assets/assets/images/projects/web_portfolio.png": "05e8edd23cf8ba9f3d3b97e47124647e",
"assets/assets/images/work_experience/berrypay.jpg": "b8afe4295f28a54a34954893e4e84272",
"assets/assets/images/work_experience/cilsy_fiolution.jpeg": "c108921da93fab069c27ebb57ee8eae0",
"assets/assets/images/work_experience/frisidea.jpeg": "adbb35ee1ad6ea752bd0fb2bdbc40255",
"assets/assets/images/work_experience/solu.jpeg": "8736d1355f4b77fa48c53d14b93aa885",
"assets/assets/images/work_experience/tmi.jpg": "6277d7ae69cbe25fc510cc20a1c0ea1b",
"assets/FontManifest.json": "2da28a2f7f57394156f12453629146ed",
"assets/fonts/MaterialIcons-Regular.otf": "a0fbe05c9cda246b42e2e94b71f7f2d9",
"assets/NOTICES": "6e3412e80a17721ba872a809c4a98676",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "151bc4ba7e602eb14c77545c995d1454",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "d23e7505322b0014971a9624295d0ade",
"icons/Icon-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"icons/Icon-maskable-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"index.html": "b0651ab80d4ee0efb70d6d72d0218b27",
"/": "b0651ab80d4ee0efb70d6d72d0218b27",
"main.dart.js": "d88e492738f1142f5d2dc171b6a430d1",
"manifest.json": "f4a9c5dccbe1ea6d5908e6d1ef8e65ce",
"version.json": "1efd93f4515e7d182be449d3fbefc700"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
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
