/**
 * 🔥 Configuration Firebase - Mode Développement
 * 
 * Ce fichier contient la configuration Firebase pour le mode développement
 * sans nécessiter de variables d'environnement
 */

const admin = require('firebase-admin');

// Configuration Firebase pour le développement
const DEV_FIREBASE_CONFIG = {
  projectId: 'communiconnect-46934',
  apiKey: 'AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc',
  authDomain: 'communiconnect-46934.firebaseapp.com',
  storageBucket: 'communiconnect-46934.firebasestorage.app',
  messagingSenderId: '217198011802',
  appId: '1:217198011802:web:d3918c01560083424a4623',
  measurementId: 'G-W2YGDJ8KS9'
};

// Configuration par défaut pour le mode développement
const DEV_SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "communiconnect-46934",
  private_key_id: "dev-private-key-id",
  private_key: "-----BEGIN PRIVATE KEY-----\nDEV_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-dev@communiconnect-46934.iam.gserviceaccount.com",
  client_id: "123456789",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dev%40communiconnect-46934.iam.gserviceaccount.com"
};

// Initialiser Firebase en mode développement
const initializeFirebaseDev = () => {
  try {
    // Vérifier si Firebase est déjà initialisé
    if (admin.apps.length === 0) {
      // Mode développement - utiliser la configuration par défaut
      console.log('🔧 Mode développement - Configuration Firebase par défaut');
      console.log('💡 Pour activer les notifications push, configurez les variables d\'environnement :');
      console.log('   - FIREBASE_PROJECT_ID=communiconnect-46934');
      console.log('   - FIREBASE_PRIVATE_KEY=your-private-key');
      console.log('   - FIREBASE_CLIENT_EMAIL=your-client-email');
      console.log('   - FIREBASE_CLIENT_ID=your-client-id');
      console.log('   - FIREBASE_PRIVATE_KEY_ID=your-private-key-id');
      console.log('   Ou utilisez FIREBASE_SERVICE_ACCOUNT_KEY avec le JSON complet');
      
      // Ne pas initialiser Firebase en mode développement
      // L'application continuera de fonctionner sans notifications push
      return null;
    }

    return admin;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Firebase:', error);
    return null;
  }
};

// Obtenir l'instance Firebase Admin
const getFirebaseAdmin = () => {
  return admin;
};

// Obtenir le service Messaging
const getMessaging = () => {
  if (admin.apps.length > 0) {
    return admin.messaging();
  }
  return null;
};

// Vérifier si Firebase est configuré
const isFirebaseConfigured = () => {
  return admin.apps.length > 0;
};

// Configuration pour les notifications
const getNotificationConfig = () => {
  return {
    // Configuration Android
    android: {
      notification: {
        channelId: 'communiconnect',
        priority: 'high',
        defaultSound: true,
        defaultVibrateTimings: true,
        icon: 'ic_notification',
        color: '#2196F3'
      }
    },
    // Configuration iOS
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          category: 'communiconnect'
        }
      }
    },
    // Configuration Web
    webpush: {
      notification: {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        actions: [
          {
            action: 'reply',
            title: 'Répondre',
            icon: '/reply-icon.png'
          },
          {
            action: 'mark_read',
            title: 'Marquer comme lu',
            icon: '/read-icon.png'
          }
        ]
      }
    }
  };
};

module.exports = {
  initializeFirebaseDev,
  getFirebaseAdmin,
  getMessaging,
  isFirebaseConfigured,
  getNotificationConfig,
  DEV_FIREBASE_CONFIG,
  DEV_SERVICE_ACCOUNT
}; 