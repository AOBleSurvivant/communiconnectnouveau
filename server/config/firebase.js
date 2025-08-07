const admin = require('firebase-admin');

// Configuration Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Vérifier si Firebase est déjà initialisé
    if (admin.apps.length === 0) {
      let serviceAccount;
      
      // En production, utiliser les variables d'environnement
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } else if (process.env.FIREBASE_PRIVATE_KEY) {
        // Configuration avec clés individuelles
        serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
        };
      } else {
        // Mode développement - configuration par défaut
        console.log('🔧 Mode développement - Configuration Firebase par défaut');
        console.log('💡 Pour activer les notifications push, configurez les variables d\'environnement :');
        console.log('   - FIREBASE_PROJECT_ID=communiconnect-46934');
        console.log('   - FIREBASE_PRIVATE_KEY=your-private-key');
        console.log('   - FIREBASE_CLIENT_EMAIL=your-client-email');
        console.log('   - FIREBASE_CLIENT_ID=your-client-id');
        console.log('   - FIREBASE_PRIVATE_KEY_ID=your-private-key-id');
        console.log('   Ou utilisez FIREBASE_SERVICE_ACCOUNT_KEY avec le JSON complet');
        console.log('   📚 Consultez FIREBASE_DEV_SETUP.md pour les instructions détaillées');
        
        // Retourner null pour indiquer que Firebase n'est pas configuré
        // mais ne pas bloquer l'application
        return null;
      }

      // Initialiser Firebase Admin
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
      });

      console.log('✅ Firebase Admin SDK initialisé');
      return admin;
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
  initializeFirebase,
  getFirebaseAdmin,
  getMessaging,
  isFirebaseConfigured,
  getNotificationConfig
}; 