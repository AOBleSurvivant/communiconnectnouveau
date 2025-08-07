#!/usr/bin/env node

/**
 * 🔥 Script de Configuration Firebase - Mode Développement
 * 
 * Ce script configure Firebase pour le mode développement
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🔥 ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logStep(step, message) {
  log(`  ${step} ${message}`, 'blue');
}

// Configuration Firebase pour le développement
const FIREBASE_CONFIG = {
  projectId: 'communiconnect-46934',
  apiKey: 'AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc',
  authDomain: 'communiconnect-46934.firebaseapp.com',
  storageBucket: 'communiconnect-46934.firebasestorage.app',
  messagingSenderId: '217198011802',
  appId: '1:217198011802:web:d3918c01560083424a4623',
  measurementId: 'G-W2YGDJ8KS9'
};

// Instructions pour configurer Firebase
const SETUP_INSTRUCTIONS = `
# 🔥 Configuration Firebase - Mode Développement

## 📋 Étapes pour configurer Firebase

### 1. Créer un compte de service Firebase

1. Allez sur : https://console.firebase.google.com/project/communiconnect-46934
2. Cliquez sur "Paramètres du projet" (icône engrenage)
3. Onglet "Comptes de service"
4. Cliquez sur "Générer une nouvelle clé privée"
5. Téléchargez le fichier JSON

### 2. Configurer les variables d'environnement

Créez un fichier \`.env\` dans le dossier \`server/\` avec :

\`\`\`env
# Firebase Configuration
FIREBASE_PROJECT_ID=communiconnect-46934
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"communiconnect-46934",...}
\`\`\`

**OU** utilisez les clés individuelles :

\`\`\`env
FIREBASE_PROJECT_ID=communiconnect-46934
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nVOTRE_CLE_PRIVEE\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@communiconnect-46934.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_PRIVATE_KEY_ID=abcdef123456
\`\`\`

### 3. Redémarrer le serveur

\`\`\`bash
npm start
\`\`\`

## ✅ Vérification

Après configuration, vous devriez voir :
\`\`\`
✅ Firebase Admin SDK initialisé
✅ Service de notifications push Firebase initialisé
\`\`\`

## 🔗 Liens utiles

- Console Firebase : https://console.firebase.google.com/project/communiconnect-46934
- Documentation : https://firebase.google.com/docs/admin/setup
`;

// Fonction principale
function setupFirebaseDev() {
  logHeader('CONFIGURATION FIREBASE - MODE DÉVELOPPEMENT');
  
  logStep('1️⃣', 'Vérification de la configuration actuelle...');
  
  // Vérifier si les variables d'environnement sont configurées
  const envPath = path.join(__dirname, 'server', '.env');
  const hasEnvFile = fs.existsSync(envPath);
  
  if (hasEnvFile) {
    log('✅ Fichier .env trouvé', 'green');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasFirebaseConfig = envContent.includes('FIREBASE_');
    
    if (hasFirebaseConfig) {
      log('✅ Configuration Firebase trouvée dans .env', 'green');
      log('🚀 Firebase devrait être configuré correctement', 'green');
    } else {
      log('⚠️ Fichier .env trouvé mais pas de configuration Firebase', 'yellow');
    }
  } else {
    log('❌ Fichier .env non trouvé', 'red');
  }
  
  logStep('2️⃣', 'Affichage des instructions de configuration...');
  
  console.log(SETUP_INSTRUCTIONS);
  
  logStep('3️⃣', 'Vérification des fichiers de configuration...');
  
  const configFiles = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js',
    'server/config/firebase.js'
  ];
  
  configFiles.forEach(file => {
    const exists = fs.existsSync(file);
    const status = exists ? '✅' : '❌';
    const color = exists ? 'green' : 'red';
    log(`  ${status} ${file}`, color);
  });
  
  logStep('4️⃣', 'Configuration actuelle Firebase...');
  
  log('📊 Project ID:', 'cyan');
  log(`   ${FIREBASE_CONFIG.projectId}`, 'yellow');
  
  log('🔑 API Key:', 'cyan');
  log(`   ${FIREBASE_CONFIG.apiKey}`, 'yellow');
  
  log('🌐 Auth Domain:', 'cyan');
  log(`   ${FIREBASE_CONFIG.authDomain}`, 'yellow');
  
  logStep('5️⃣', 'Recommandations...');
  
  log('💡 Pour activer Firebase complètement :', 'cyan');
  log('   1. Créez un compte de service Firebase', 'yellow');
  log('   2. Téléchargez le fichier JSON', 'yellow');
  log('   3. Configurez les variables d\'environnement', 'yellow');
  log('   4. Redémarrez le serveur', 'yellow');
  
  log('\n🎯 Statut actuel :', 'bright');
  if (hasEnvFile) {
    log('   ✅ Configuration partielle détectée', 'green');
    log('   🔧 Complétez la configuration pour activer Firebase', 'yellow');
  } else {
    log('   ❌ Configuration Firebase manquante', 'red');
    log('   🔧 Suivez les instructions ci-dessus', 'yellow');
  }
  
  logHeader('FIN DE LA CONFIGURATION');
  log('📚 Consultez FIREBASE_SETUP.md pour plus de détails', 'cyan');
  log('🔗 Console Firebase : https://console.firebase.google.com/project/communiconnect-46934', 'cyan');
}

// Exécuter si appelé directement
if (require.main === module) {
  setupFirebaseDev();
}

module.exports = { setupFirebaseDev }; 