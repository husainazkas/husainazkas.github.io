'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "4ad70ef3aafdcd9f6975e4f7218e4a5a",
"version.json": "7ba06223682192cc87bd2171ea7cbbde",
"index.html": "466947a44913d530ecf60b69c1d66d4a",
"/": "466947a44913d530ecf60b69c1d66d4a",
"main.dart.js": "c869c4d7e4e9c4a7232d006e6a815004",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"favicon.png": "151bc4ba7e602eb14c77545c995d1454",
"icons/Icon-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"icons/Icon-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"manifest.json": "0bf0980b639140c925ee33956568b57e",
"assets/AssetManifest.json": "b815179613773205a0d11b16f4942ea2",
"assets/NOTICES": "64fbae5ff89b7331fcb5f0991fbc8591",
"assets/FontManifest.json": "2da28a2f7f57394156f12453629146ed",
"assets/AssetManifest.bin.json": "686afe3721d392ad72ebe4f2c0e20da7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "1af66d19fbd74d14aade898ecc24a06e",
"assets/fonts/MaterialIcons-Regular.otf": "a0fbe05c9cda246b42e2e94b71f7f2d9",
"assets/assets/images/projects/renaldocx.png": "2ca20c81c07259a7bda8eab9d77992c7",
"assets/assets/images/projects/web_portfolio.png": "05e8edd23cf8ba9f3d3b97e47124647e",
"assets/assets/images/projects/servd.png": "6df989be0e03fb4fd4c96b063bd66cea",
"assets/assets/images/projects/kantin_go.png": "d4e732731c9fd56557ddf2718449dcaa",
"assets/assets/images/projects/slidable_button.png": "022cd12017b4a372876eae55cb3fc743",
"assets/assets/images/projects/ppid_kemenparekraf.png": "f248787c13090384bae5a9fe5ab63326",
"assets/assets/images/profile_picture.jpg": "a696152e051cf2b6d33f5f85229c8bf0",
"assets/assets/images/development_icon.png": "189541aa0f95e7c39331c63346613111",
"assets/assets/images/work_experience/cilsy_fiolution.jpeg": "c108921da93fab069c27ebb57ee8eae0",
"assets/assets/images/work_experience/berrypay.jpg": "b8afe4295f28a54a34954893e4e84272",
"assets/assets/images/work_experience/frisidea.jpeg": "adbb35ee1ad6ea752bd0fb2bdbc40255",
"assets/assets/images/work_experience/tmi.jpg": "6277d7ae69cbe25fc510cc20a1c0ea1b",
"assets/assets/images/work_experience/solu.jpeg": "8736d1355f4b77fa48c53d14b93aa885",
"assets/assets/icons/CustomIcons.ttf": "2e06f3c3d0384e90fa177940bcf740e7",
"assets/assets/data/projects.json": "f0f9d6fd766a8b40191bd2438af3133c",
"assets/assets/data/work_experience.json": "57dadee7f2a4d7e5ed71bc1a1b1ce534",
"assets/assets/data/contact.json": "1a01092927888dc5653d7ed8c77785f5",
"assets/assets/data/educations.json": "00b6f7cd7696b2d7fc07c6c8ee04c378",
"assets/assets/data/skills.json": "ec314be8038ff3fdf4df863b28116cd3",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.js": "ba4a8ae1a65ff3ad81c6818fd47e348b",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/canvaskit.js": "6cfe36b4647fbfa15683e09e7dd366bc",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206"};
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
