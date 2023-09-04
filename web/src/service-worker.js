// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        console.log('sw installed')
    );
});

self.addEventListener('fetch', event => {
    console.log('[I] *** service worker: fetch event: ', event.request.url);

    const url = new URL(event.request.url);
    const code = url.searchParams.get('code');
    if (code && code != 'HIDDEN') {
        console.log('[Mitigation] *** service worker: found code parameter');
        event.respondWith(removeCodeParameter(event.request));
    }

});

async function removeCodeParameter(request) {
    // Parse the URL and remove the "code" parameter
    const modifiedUrl = new URL(request.url);
    modifiedUrl.searchParams.set('code', 'HIDDEN')

    const response = new Response(null, {
        status: 302,
        statusText: 'Found',
        url: modifiedUrl.toString(),
        headers: {
            'Location': modifiedUrl.toString()
        }
    });
    console.log('[Mitigation] *** service worker: url: ', modifiedUrl);
    console.log('[Mitigation] *** service worker: rewriting: ', response);

    // Fetch the modified request
    return response;
}
