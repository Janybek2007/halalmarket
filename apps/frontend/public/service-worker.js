const CACHE_KEY = 'halal-market-cache-v1';
const VERSION = '1.0.1';

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const VAPID_PUBLIC_KEY =
	'BDeCFHO3DZ0xNb5rrZZvb3RGz7IPVe9dsxv4fi-11dCcBKVGTHnZXAM9_xtyv4QNTVnj6gzBLnc22k7iqVXr4ys';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_KEY).then(cache => {
      return cache.addAll([
        '/seo/favicon-16x16.png',
        '/seo/favicon-32x32.png',
        '/seo/favicon.ico',
        '/seo/favicon-192x192.png',
        '/seo/favicon-512x512.png',
        '/seo/apple-touch-icon.png',
        '/seo/preview.png',
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('push', event => {
  if (!event.data) {
    return;
  }

  let payload = {
    notification: {},
  };
  try {
    payload = event.data.json();
  } catch (e) {
    payload['notification'] = {
      title: event.data.text(),
    };
    return;
  }

  const notification = payload?.notification || {};

  const title = notification?.title || 'Новое уведомление (Client)';
  const body = notification?.body || 'У вас есть новые уведомления (Client)';
  const icon = notification?.icon || '/seo/favicon.ico';
  const url = notification?.url || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      data: { url },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('pushsubscriptionchange', async () => {
  try {
    const newSubscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    self.clients.matchAll().then(clients => {
      clients.forEach(client =>
        client.postMessage({
          type: 'SUBSCRIPTION_CHANGE',
          subscription: newSubscription,
        })
      );
    });
  } catch (error) {
    console.error('Push subscription renewal failed:', error);
  }
});
