# 🔥 Configuration Firebase - Mode Développement

## ❓ Pourquoi ce message s'affiche ?

Le message `⚠️ Firebase non configuré - Mode développement` s'affiche parce que le backend ne trouve pas les variables d'environnement Firebase nécessaires.

## 🎯 Solution Rapide

### Option 1 : Configuration avec fichier JSON (Recommandée)

1. **Allez sur la console Firebase** :
   - https://console.firebase.google.com/project/communiconnect-46934

2. **Créez un compte de service** :
   - Cliquez sur "Paramètres du projet" (icône engrenage)
   - Onglet "Comptes de service"
   - Cliquez sur "Générer une nouvelle clé privée"
   - Téléchargez le fichier JSON

3. **Créez le fichier `.env` dans le dossier `server/`** :
   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=communiconnect-46934
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"communiconnect-46934","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@communiconnect-46934.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
   ```

### Option 2 : Configuration avec clés individuelles

Créez le fichier `.env` dans le dossier `server/` :
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=communiconnect-46934
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE_ICI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@communiconnect-46934.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_PRIVATE_KEY_ID=abcdef123456
```

## ✅ Vérification

Après configuration, redémarrez le serveur :
```bash
npm start
```

Vous devriez voir :
```
✅ Firebase Admin SDK initialisé
✅ Service de notifications push Firebase initialisé
```

## 🔗 Liens utiles

- **Console Firebase** : https://console.firebase.google.com/project/communiconnect-46934
- **Documentation** : https://firebase.google.com/docs/admin/setup
- **Guide complet** : FIREBASE_SETUP.md

## 🚨 Important

- Le fichier `.env` ne doit **PAS** être commité dans Git
- Gardez vos clés privées **secrètes**
- En production, utilisez les variables d'environnement de votre plateforme de déploiement

## 🎯 Statut actuel

- ✅ Configuration Firebase côté client
- ✅ Service Worker configuré
- ✅ Service de notifications push prêt
- ⚠️ Configuration serveur manquante (variables d'environnement)

**Une fois configuré, Firebase sera entièrement opérationnel !** 🔥 