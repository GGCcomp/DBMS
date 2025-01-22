// Import Firebase scripts (Firebase Hosting will cache this for your app)
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyASrWv-YiTQLKf2bhB3nqvONvgekcYbgR0",
  authDomain: "fcm-mis-2d94d.firebaseapp.com",
  projectId: "fcm-mis-2d94d",
  storageBucket: "fcm-mis-2d94d.firebasestorage.app",
  messagingSenderId: "772792722842",
  appId: "1:772792722842:web:9f74b2be9cd938c179c623"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', 
    click_action: payload.notification.click_action
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Add a listener for notification clicks
self.addEventListener('notificationclick', (event) => {
  const url = event.notification.data.click_action || '/';
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
