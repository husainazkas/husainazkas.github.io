'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "304c060da638f78d0869eebeb274b3ca",
"index.html": "81641af7113d4db1d4ba865dcb9b3a64",
"/": "81641af7113d4db1d4ba865dcb9b3a64",
"main.dart.js": "71d8d8d13eb103c9551bafe2be809fde",
"favicon.png": "151bc4ba7e602eb14c77545c995d1454",
"icons/Icon-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-192.png": "9db091a6f15f389eb3539586db3dad7e",
"icons/Icon-maskable-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"icons/Icon-512.png": "c4b64e791ec108c4fbc2af5ee5239fb8",
"manifest.json": "c5c6a3f78ed3a26eda8689ed6ad99062",
"assets/AssetManifest.json": "92bb53a8a9f3fde5a59797db65c460c6",
"assets/NOTICES": "44a1955bc81aa94335e5394550491a30",
"assets/FontManifest.json": "f8ec27312bf02bf4ac4f918c39934293",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/images/projects/renaldocx.png": "2ca20c81c07259a7bda8eab9d77992c7",
"assets/assets/images/projects/web_portfolio.png": "05e8edd23cf8ba9f3d3b97e47124647e",
"assets/assets/images/projects/kantin_go.png": "d4e732731c9fd56557ddf2718449dcaa",
"assets/assets/images/projects/slidable_button.png": "022cd12017b4a372876eae55cb3fc743",
"assets/assets/images/projects/ppid_kemenparekraf.png": "f248787c13090384bae5a9fe5ab63326",
"assets/assets/images/profile_picture.jpg": "a696152e051cf2b6d33f5f85229c8bf0",
"assets/assets/images/development_icon.png": "189541aa0f95e7c39331c63346613111",
"assets/assets/images/work_experience/solu.jpeg": "8736d1355f4b77fa48c53d14b93aa885",
"assets/assets/fonts/CustomIcons.ttf": "68695f0fecac3212ad6295dfa139660a",
"assets/assets/data/projects.json": "f0ecdeaef18fd62167e96fe5b7f83ed4",
"assets/assets/data/work_experience.json": "2a7540e2248eb6047af84e844588bdcf",
"assets/assets/data/contact.json": "1a01092927888dc5653d7ed8c77785f5",
"assets/assets/data/educations.json": "00b6f7cd7696b2d7fc07c6c8ee04c378",
"assets/assets/data/skills.json": "24915a8e47b42b45044f54f63c17c1b5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
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
