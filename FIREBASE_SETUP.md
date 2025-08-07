# 🔥 Configuration Firebase - CommuniConnect

## 📋 **Étapes de Configuration**

### **1. Créer un projet Firebase**

1. **Allez sur [Firebase Console](https://console.firebase.google.com/)**
2. **Cliquez sur "Créer un projet"**
3. **Nom du projet** : `CommuniConnect`
4. **Activez Google Analytics** (optionnel)
5. **Cliquez sur "Créer le projet"**

### **2. Ajouter une application Web**

1. **Dans la console Firebase, cliquez sur l'icône Web (</>)**
2. **Nom de l'app** : `CommuniConnect Web`
3. **Activez "Firebase Hosting"** (optionnel)
4. **Cliquez sur "Enregistrer l'app"**

### **3. Récupérer les clés de configuration**

Après avoir créé l'app, vous obtiendrez un objet de configuration :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "communiconnect.firebaseapp.com",
  projectId: "communiconnect",
  storageBucket: "communiconnect.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### **4. Activer Cloud Messaging**

1. **Dans la console Firebase, allez dans "Messaging"**
2. **Cliquez sur "Commencer"**
3. **Générez une clé VAPID** pour les notifications web
4. **Notez la clé VAPID** (elle sera utilisée côté client)

### **5. Créer un compte de service**

1. **Dans la console Firebase, allez dans "Paramètres du projet"**
2. **Onglet "Comptes de service"**
3. **Cliquez sur "Générer une nouvelle clé privée"**
4. **Téléchargez le fichier JSON**

## 🔧 **Configuration des Variables d'Environnement**

### **Frontend (.env.production)**

```env
# Configuration Firebase
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=communiconnect.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=communiconnect
REACT_APP_FIREBASE_STORAGE_BUCKET=communiconnect.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_FIREBASE_VAPID_KEY=BLBz...
```

### **Backend (.env.production)**

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=communiconnect
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@communiconnect.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_PRIVATE_KEY_ID=abcdef123456
```

**OU utilisez le fichier JSON complet :**

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"communiconnect",...}
```

## 📱 **Configuration des Notifications**

### **1. Mettre à jour le Service Worker**

Remplacez les valeurs dans `client/public/firebase-messaging-sw.js` :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

### **2. Mettre à jour le service de notifications**

Dans `client/src/services/pushNotificationService.js`, remplacez :

```javascript
vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || 'VOTRE_VAPID_KEY'
```

## 🧪 **Tests de Configuration**

### **1. Test côté client**

```javascript
// Dans la console du navigateur
import pushNotificationService from './services/pushNotificationService';

// Initialiser les notifications
await pushNotificationService.initialize();

// Vérifier le statut
console.log('Supporté:', pushNotificationService.isSupported());
console.log('Initialisé:', pushNotificationService.isInitialized());
console.log('Permission:', pushNotificationService.getPermissionStatus());
```

### **2. Test côté serveur**

```javascript
// Dans le serveur
const PushNotificationService = require('./services/pushNotificationService');
const pushService = new PushNotificationService();

// Envoyer une notification de test
await pushService.sendToUser(userId, {
  title: 'Test Notification',
  body: 'Ceci est un test',
  type: 'test'
});
```

## 🚀 **Déploiement**

### **1. Variables d'environnement sur Vercel**

Ajoutez toutes les variables Firebase dans les paramètres de votre projet Vercel.

### **2. Variables d'environnement sur Render**

Ajoutez toutes les variables Firebase dans les paramètres de votre service Render.

### **3. Vérification post-déploiement**

1. **Testez les notifications push**
2. **Vérifiez les logs Firebase**
3. **Testez les notifications en arrière-plan**

## 🔍 **Dépannage**

### **Problèmes courants :**

1. **"Firebase non configuré"**
   - Vérifiez les variables d'environnement
   - Assurez-vous que les clés sont correctes

2. **"Permission refusée"**
   - Vérifiez que l'utilisateur a autorisé les notifications
   - Testez sur HTTPS (requis pour les notifications)

3. **"Token invalide"**
   - Vérifiez la clé VAPID
   - Assurez-vous que le service worker est correctement configuré

### **Logs utiles :**

```bash
# Vérifier les logs Firebase
firebase functions:log

# Vérifier les notifications
firebase messaging:send --token=TOKEN --message='{"notification":{"title":"Test","body":"Test"}}'
```

## 📊 **Monitoring**

### **Firebase Console :**
- **Analytics** : Utilisation des notifications
- **Messaging** : Statistiques d'envoi
- **Crashlytics** : Erreurs (si activé)

### **Logs personnalisés :**
- Surveillez les logs du serveur pour les erreurs d'envoi
- Vérifiez les tokens invalides
- Suivez les taux de livraison

## ✅ **Checklist de Configuration**

- [ ] Projet Firebase créé
- [ ] Application web ajoutée
- [ ] Cloud Messaging activé
- [ ] Clé VAPID générée
- [ ] Compte de service créé
- [ ] Variables d'environnement configurées
- [ ] Service Worker mis à jour
- [ ] Tests effectués
- [ ] Déploiement vérifié

## 🎯 **Avantages de Firebase pour CommuniConnect**

1. **Notifications push en temps réel**
2. **Support multi-plateforme** (Web, Android, iOS)
3. **Analytics intégrés**
4. **Gestion automatique des tokens**
5. **Notifications en arrière-plan**
6. **Actions personnalisées**
7. **Gestion des erreurs robuste**

---

**💡 Conseil :** Configurez Firebase dès maintenant pour profiter de toutes les fonctionnalités de notifications de CommuniConnect ! 