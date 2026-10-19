// Custom Service Worker script for Background Push & Notification Click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL('/', self.location.origin).href;

  if (event.action === 'stop') {
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        client.postMessage({ type: 'STOP_ADZAN' });
      }
    });
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Push notification listener (if Web Push is sent from server in future)
self.addEventListener('push', (event) => {
  let data = {
    title: 'Waktu Shalat Telah Tiba!',
    body: 'Mari tunaikan shalat tepat waktu.',
    icon: '/pwa-192x192.png',
  };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'prayer-push',
    vibrate: [500, 250, 500, 250, 500],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
