import { precacheAndRoute } from 'workbox-precaching';

// This will be replaced with the precache manifest during the build
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'vansale-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Listen for push events
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Notification Title';
    const options = {
        body: data.body || 'Here is the body of the notification.',
        icon: 'icon.png',  // You can add your icon path here
        badge: 'badge.png' // Add a small badge icon if you have one
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/') // Open your app when the notification is clicked
    );
});
