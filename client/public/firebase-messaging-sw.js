// Service Worker pour Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuration Firebase CommuniConnect
const firebaseConfig = {
  apiKey: "AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc",
  authDomain: "communiconnect-46934.firebaseapp.com",
  projectId: "communiconnect-46934",
  storageBucket: "communiconnect-46934.firebasestorage.app",
  messagingSenderId: "217198011802",
  appId: "1:217198011802:web:d3918c01560083424a4623",
  measurementId: "G-W2YGDJ8KS9"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Messaging
const messaging = firebase.messaging();

// Gestionnaire de messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: payload.data?.type || 'default',
    data: payload.data,
    actions: getNotificationActions(payload.data?.type),
    requireInteraction: payload.data?.type === 'alert' || payload.data?.type === 'critical'
  };

  // Afficher la notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestionnaire de clic sur notification
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event);

  event.notification.close();

  const { type, id, url } = event.notification.data || {};

  // Redirection selon le type de notification
  let targetUrl = '/';
  
  switch (type) {
    case 'message':
      targetUrl = `/messages?conversation=${id}`;
      break;
    case 'alert':
      targetUrl = `/alerts?alert=${id}`;
      break;
    case 'livestream':
      targetUrl = `/livestreams?stream=${id}`;
      break;
    case 'event':
      targetUrl = `/events?event=${id}`;
      break;
    case 'friend_request':
      targetUrl = '/friends?tab=requests';
      break;
    default:
      targetUrl = url || '/';
  }

  // Ouvrir ou focaliser la fenêtre
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Gestionnaire d'action sur notification
self.addEventListener('notificationaction', (event) => {
  console.log('Action sur notification:', event);

  const { action, notification } = event;
  const { type, id } = notification.data || {};

  switch (action) {
    case 'reply':
      // Ouvrir l'interface de réponse
      event.waitUntil(
        clients.openWindow(`/messages?conversation=${id}&action=reply`)
      );
      break;
    case 'view':
      // Ouvrir les détails
      event.waitUntil(
        clients.openWindow(`/${type}s?id=${id}`)
      );
      break;
    case 'join':
      // Rejoindre le livestream
      event.waitUntil(
        clients.openWindow(`/livestreams?stream=${id}&action=join`)
      );
      break;
    case 'rsvp':
      // Participer à l'événement
      event.waitUntil(
        clients.openWindow(`/events?event=${id}&action=rsvp`)
      );
      break;
    case 'share':
      // Partager l'alerte
      event.waitUntil(
        clients.openWindow(`/alerts?alert=${id}&action=share`)
      );
      break;
  }

  notification.close();
});

// Fonction pour obtenir les actions selon le type de notification
function getNotificationActions(type) {
  switch (type) {
    case 'message':
      return [
        { action: 'reply', title: 'Répondre', icon: '/icons/reply.png' },
        { action: 'view', title: 'Voir', icon: '/icons/view.png' }
      ];
    case 'alert':
      return [
        { action: 'view', title: 'Voir détails', icon: '/icons/view.png' },
        { action: 'share', title: 'Partager', icon: '/icons/share.png' }
      ];
    case 'livestream':
      return [
        { action: 'join', title: 'Rejoindre', icon: '/icons/join.png' },
        { action: 'view', title: 'Voir', icon: '/icons/view.png' }
      ];
    case 'event':
      return [
        { action: 'rsvp', title: 'Participer', icon: '/icons/rsvp.png' },
        { action: 'view', title: 'Voir détails', icon: '/icons/view.png' }
      ];
    default:
      return [
        { action: 'view', title: 'Voir', icon: '/icons/view.png' }
      ];
  }
}

// Gestionnaire d'installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

// Gestionnaire d'activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
  event.waitUntil(self.clients.claim());
}); 