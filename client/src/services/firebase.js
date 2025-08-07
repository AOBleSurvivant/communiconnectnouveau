// Configuration Firebase CommuniConnect
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Configuration Firebase
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
const app = initializeApp(firebaseConfig);

// Initialiser Analytics (optionnel)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics non disponible:', error);
  }
}

// Initialiser Messaging
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Messaging non disponible:', error);
  }
}

export { app, analytics, messaging, firebaseConfig }; 