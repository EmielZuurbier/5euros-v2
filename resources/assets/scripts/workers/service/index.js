const cacheName = '5euro-cache-v1'
const cacheURLs = [
  '/',
  '/app/themes/5euros/dist/scripts/app.js',
  '/app/themes/5euros/dist/styles/app.css'
]

/**
 * Creates a cache directory and stores the links in the cacheURLs array
 *
 * @listens install
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(cacheURLs)
    })
  )
})

/**
 * Checks what resources are being fetched and checks the cache if
 * these are already present. If so they are sent to the client without having to reach the server
 * and if not they are fetched and stored into the cache.
 * @listens fetch
 */
self.addEventListener('fetch', event => {
  // Get the request of the event.
  const { request } = event
  const url = new URL(request.url)
  const { pathname, origin } = url

  // Don't do anything on the wp-admin or preview page.
  if (request.url.match(/wp-admin/) || request.url.match(/preview=true/)) {
    return
  }

  // Look for file types.
  const regex = /\.(?:jpg|mp3|mp4|css|js)$/i

  // If the origin of the file is the same as the site.
  if (origin === location.origin) {
    // If its match with the regex.
    const matches = pathname.match(regex)
    if (matches !== null) {
      // Bypass default event.
      event.respondWith(
        (async function () {
          // Check in cache if the files are already there.
          const cache = await caches.open(cacheName)
          const cachedResponse = await cache.match(event.request.url)

          // If it's there, return it.
          if (cachedResponse) {
            console.log(request.url, ' gotten from cache')
            return cachedResponse
          }

          // Otherwise fetch the file and store it in the cache.
          const response = await fetch(request)
          if (response.ok && response.status === 200) {
            const clonedResponse = response.clone()
            cache.put(request, response)
            console.log(request.url, ' stored in cache')

            // Return response result.
            return clonedResponse
          }

          // Return the error.
          throw new Error(response.status)
        })()
      )
    }
  }
})

/**
 * SW Activate event
 *
 * Removes all of the caches that arent whitelisted
 *
 * @listens activate
 */
self.addEventListener('activate', event => {
  console.info('Service Worker now active')
  const cacheWhiteList = [cacheName]
  const promise = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhiteList.indexOf(cacheName) === -1)
          return caches.delete(cacheName)
      })
    )
  })
  event.waitUntil(promise)
})
