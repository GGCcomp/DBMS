'use client';

import { useEffect } from 'react';
import { messaging, getToken } from '@/lib/firebase';

export default function FirebaseSetup() {
  useEffect(() => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          // Get the FCM token
          getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
            serviceWorkerRegistration: registration,
          })
            .then((currentToken) => {
              if (currentToken) {
                //console.log('FCM Token:', currentToken);
                // Send this token to your backend to subscribe the user to notifications
              } else {
                console.error('No registration token available.');
              }
            })
            .catch((err) => {
              console.error('Error retrieving token:', err);
            });
        })
        .catch((err) => console.error('Service Worker registration failed:', err));
    }
  }, []);

  return null; // This component doesn't need to render anything
}
