self.addEventListener('install', event => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
});

self.addEventListener('message', event => {
    if (event.data.type === 'CHRONO_NOTIFICATION') {
        self.registration.showNotification('Chrono Alert', {
            body: event.data.message,
            icon: '/icon.png',
            vibrate: [200, 100, 200]
        });
    }
}); 