const disableServiceWorkerUnregistration = () => {
    // Monkey-patch the unregister method
    ServiceWorkerRegistration.prototype.unregister = async function () {
        // Perform your custom actions after unregistration
        console.log("[Mitigation] Service worker unregistration prevented.");
    };
};

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        disableServiceWorkerUnregistration();
        console.log('[I] Registering service worker');
        const registration = await navigator.serviceWorker.register('service-worker.js');
        if (registration.installing) {
            console.log("[I] Service worker installing");
        } else if (registration.waiting) {
            console.log("[I] Service worker installed");
        } else if (registration.active) {
            console.log("[I] Service worker active");
        }

        return registration;
    }
};

const startApplication = () => {

    function createIframe(src, script) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', src); // Initialize with an empty page
        iframe.setAttribute('width', '500');
        iframe.setAttribute('height', '300');
        document.body.appendChild(iframe);

        iframe.addEventListener('load', function () {
            // Access the iframe's document object
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            // Create a new script element
            const scriptElement = iframeDocument.createElement('script');

            // Set the script's content with your custom code
            scriptElement.textContent = script;

            // Append the script to the iframe's document
            iframeDocument.body.appendChild(scriptElement);
        });
    }

    createIframe('about:blank', `
            console.log('[Attack] Attack 2: trying to unregister service workers from iframe');
            navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
                console.log('[I] Service worker registration: ', registration);
                    registration.unregister();
                }
            });
        `);

    createIframe('http://localhost:7218/realms/swdemo/protocol/openid-connect/auth?client_id=swtest&response_type=code&scope=openid&redirect_uri=http://localhost:7280/xxx.html', `
            const url = new URL(window.location.href);
            const code = url.searchParams?.get('code');
            console.log('[Attack] running in code stealing iframe, code: ', code);
        `);

    console.log('[Attack] Attack 1: trying to unregister service workers');
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
            console.log('[I] Service worker registration: ', registration);
            registration.unregister();
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    registerServiceWorker()
        .then(startApplication());
});
