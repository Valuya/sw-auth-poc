# Run
* run `docker compose up --build -d`
* open http://localhost:7280/
* open web console
* click on login
* login with `roger` / `roger`
* expected output in console: mitigation should prevent service worker unregistration and authorization code should be `HIDDEN` (see last log line)
```
[I] Registering service worker
index.js:66 [Attack] Attack 1: trying to unregister service workers
index.js:19 [I] Service worker active
index.js:69 [I] Service worker registration:  ServiceWorkerRegistration {installing: null, waiting: null, active: ServiceWorker, navigationPreload: NavigationPreloadManager, scope: 'http://localhost:7280/', …}
index.js:5 [Mitigation] Service worker unregistration prevented.
service-worker.js:10 [I] *** service worker: fetch event:  http://localhost:7280/xxx.html?session_state=ed274d7c-f0b8-4e97-b1be-c51c2c9c36a3&code=d5ba3923-a07a-4631-809e-be67fa383217.ed274d7c-f0b8-4e97-b1be-c51c2c9c36a3.a1c409c9-5020-4d12-b8b5-09c1f78d980a
service-worker.js:15 [Mitigation] *** service worker: found code parameter
service-worker.js:34 [Mitigation] *** service worker: url:  URL {origin: 'http://localhost:7280', protocol: 'http:', username: '', password: '', host: 'localhost:7280', …}
service-worker.js:35 [Mitigation] *** service worker: rewriting:  Response {type: 'default', url: '', redirected: false, status: 302, ok: false, …}
service-worker.js:10 [I] *** service worker: fetch event:  http://localhost:7280/xxx.html?session_state=ed274d7c-f0b8-4e97-b1be-c51c2c9c36a3&code=HIDDEN
VM17136:4 [Attack] running in code stealing iframe, code:  HIDDEN
```