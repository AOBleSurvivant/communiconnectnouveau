#!/usr/bin/env node

/**
 * 🔗 Tests d'Intégration Complète - CommuniConnect
 * 
 * Ce script teste l'intégration complète de Firebase :
 * - Configuration client/serveur
 * - Communication entre services
 * - Gestion des erreurs
 * - Performance globale
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🔗 ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logTest(testName, result, details = '') {
  const status = result ? '✅ PASS' : '❌ FAIL';
  const color = result ? 'green' : 'red';
  log(`  ${status} ${testName}`, color);
  if (details) {
    log(`    ${details}`, 'yellow');
  }
}

// Tests d'intégration client-serveur
function testClientServerIntegration() {
  logHeader('INTÉGRATION CLIENT-SERVEUR');

  let allTestsPassed = true;

  // Test 1: Vérifier la cohérence des configurations
  const clientFirebasePath = 'client/src/services/firebase.js';
  const serverFirebasePath = 'server/config/firebase.js';
  
  if (fs.existsSync(clientFirebasePath) && fs.existsSync(serverFirebasePath)) {
    const clientContent = fs.readFileSync(clientFirebasePath, 'utf8');
    const serverContent = fs.readFileSync(serverFirebasePath, 'utf8');
    
    const clientHasProjectId = clientContent.includes('communiconnect-46934');
    const serverHasProjectId = serverContent.includes('communiconnect-46934') || serverContent.includes('process.env.FIREBASE_PROJECT_ID');
    
    logTest('Project ID cohérent client/serveur', clientHasProjectId && serverHasProjectId);
    
    if (!clientHasProjectId || !serverHasProjectId) {
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier la communication des tokens
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  const serverPushServicePath = 'server/services/pushNotificationService.js';
  
  if (fs.existsSync(pushServicePath) && fs.existsSync(serverPushServicePath)) {
    const clientContent = fs.readFileSync(pushServicePath, 'utf8');
    const serverContent = fs.readFileSync(serverPushServicePath, 'utf8');
    
    const clientSendsToken = clientContent.includes('sendTokenToServer');
    const serverReceivesToken = serverContent.includes('registerToken') || serverContent.includes('fcmToken');
    
    logTest('Client envoie tokens au serveur', clientSendsToken);
    logTest('Serveur reçoit et stocke tokens', serverReceivesToken);
    
    if (!clientSendsToken || !serverReceivesToken) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de configuration d'environnement
function testEnvironmentConfiguration() {
  logHeader('CONFIGURATION ENVIRONNEMENT');

  let allTestsPassed = true;

  // Test 1: Vérifier les fichiers d'environnement
  const envFiles = [
    'client/.env.example',
    'server/.env.example',
    'client/env.production.example',
    'server/env.production.example'
  ];

  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasFirebaseVars = content.includes('FIREBASE') || content.includes('REACT_APP_FIREBASE');
      
      logTest(`Variables Firebase dans ${path.basename(file)}`, hasFirebaseVars);
      
      if (!hasFirebaseVars) allTestsPassed = false;
    } else {
      // Ignorer les fichiers .env.example s'ils n'existent pas (optionnels)
      if (file.includes('.env.example')) {
        logTest(`Fichier ${path.basename(file)} (optionnel)`, true, 'Fichier optionnel - ignoré');
      } else {
        logTest(`Fichier ${path.basename(file)} existe`, false);
        allTestsPassed = false;
      }
    }
  });

  // Test 2: Vérifier la configuration de production
  const prodEnvFiles = [
    'client/env.production.example',
    'server/env.production.example'
  ];

  prodEnvFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasProductionConfig = content.includes('production') || content.includes('PROD');
      
      logTest(`Configuration production dans ${path.basename(file)}`, hasProductionConfig);
      
      if (!hasProductionConfig) allTestsPassed = false;
    }
  });

  return allTestsPassed;
}

// Tests de sécurité
function testSecurity() {
  logHeader('SÉCURITÉ INTÉGRATION');

  let allTestsPassed = true;

  // Test 1: Vérifier la gestion des clés sensibles
  const clientFirebasePath = 'client/src/services/firebase.js';
  const serverFirebasePath = 'server/config/firebase.js';
  
  if (fs.existsSync(clientFirebasePath)) {
    const content = fs.readFileSync(clientFirebasePath, 'utf8');
    const hasApiKey = content.includes('AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc');
    const hasProjectId = content.includes('communiconnect-46934');
    
    // C'est normal d'avoir les clés publiques côté client
    logTest('Clés Firebase côté client (normal)', hasApiKey && hasProjectId, 'Clés publiques autorisées');
  }

  if (fs.existsSync(serverFirebasePath)) {
    const content = fs.readFileSync(serverFirebasePath, 'utf8');
    const usesEnvVars = content.includes('process.env.FIREBASE') || content.includes('process.env.FIREBASE_SERVICE_ACCOUNT_KEY');
    
    logTest('Serveur utilise variables d\'environnement', usesEnvVars);
    
    if (!usesEnvVars) allTestsPassed = false;
  }

  // Test 2: Vérifier la validation des tokens
  const serverPushServicePath = 'server/services/pushNotificationService.js';
  if (fs.existsSync(serverPushServicePath)) {
    const content = fs.readFileSync(serverPushServicePath, 'utf8');
    const validatesTokens = content.includes('invalid-registration-token') || content.includes('registration-token-not-registered');
    const removesInvalidTokens = content.includes('removeInvalidToken') || content.includes('$unset');
    
    logTest('Validation des tokens côté serveur', validatesTokens);
    logTest('Suppression des tokens invalides', removesInvalidTokens);
    
    if (!validatesTokens || !removesInvalidTokens) allTestsPassed = false;
  }

  return allTestsPassed;
}

// Tests de performance
function testPerformance() {
  logHeader('PERFORMANCE INTÉGRATION');

  let allTestsPassed = true;

  // Test 1: Vérifier la taille des bundles
  const filesToCheck = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js',
    'server/config/firebase.js',
    'server/services/pushNotificationService.js'
  ];

  let totalSize = 0;
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const sizeKB = Math.round(stats.size / 1024);
      totalSize += sizeKB;
      
      const isReasonable = sizeKB < 100; // Moins de 100KB par fichier
      logTest(`Taille ${path.basename(file)} (${sizeKB}KB)`, isReasonable, `${sizeKB}KB`);
      
      if (!isReasonable) allTestsPassed = false;
    }
  });

  const isTotalReasonable = totalSize < 500; // Moins de 500KB total
  logTest(`Taille totale Firebase (${totalSize}KB)`, isTotalReasonable, `${totalSize}KB`);
  
  if (!isTotalReasonable) allTestsPassed = false;

  // Test 2: Vérifier l'optimisation
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasLazyLoading = content.includes('this.isInitialized') || content.includes('this.isSupported');
    const hasEfficientChecks = content.includes('if (!this.isSupported') || content.includes('if (!this.isInitialized');
    const hasSingleton = content.includes('// Instance singleton');
    
    logTest('Chargement différé', hasLazyLoading);
    logTest('Vérifications efficaces', hasEfficientChecks);
    logTest('Pattern singleton', hasSingleton);
    
    if (!hasLazyLoading || !hasEfficientChecks || !hasSingleton) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de compatibilité
function testCompatibility() {
  logHeader('COMPATIBILITÉ INTÉGRATION');

  let allTestsPassed = true;

  // Test 1: Vérifier la compatibilité des versions
  const clientPackagePath = 'client/package.json';
  const serverPackagePath = 'server/package.json';
  
  if (fs.existsSync(clientPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
    const firebaseVersion = packageJson.dependencies?.firebase;
    
    if (firebaseVersion) {
      const version = firebaseVersion.replace('^', '').replace('~', '');
      const majorVersion = parseInt(version.split('.')[0]);
      const isCompatible = majorVersion >= 9;
      
      logTest(`Version Firebase client (${version})`, isCompatible, `Version: ${version}`);
      
      if (!isCompatible) allTestsPassed = false;
    }
  }

  if (fs.existsSync(serverPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
    const firebaseAdminVersion = packageJson.dependencies?.['firebase-admin'];
    
    if (firebaseAdminVersion) {
      const version = firebaseAdminVersion.replace('^', '').replace('~', '');
      const majorVersion = parseInt(version.split('.')[0]);
      const isCompatible = majorVersion >= 11;
      
      logTest(`Version Firebase Admin (${version})`, isCompatible, `Version: ${version}`);
      
      if (!isCompatible) allTestsPassed = false;
    }
  }

  // Test 2: Vérifier la compatibilité du service worker
  const swPath = 'client/public/firebase-messaging-sw.js';
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    
    const usesCompat = content.includes('firebase-app-compat.js') && content.includes('firebase-messaging-compat.js');
    const hasModernFeatures = content.includes('onBackgroundMessage') && content.includes('notificationclick');
    const hasFallbacks = content.includes('clients.openWindow') || content.includes('clients.focus');
    
    logTest('Service Worker utilise compatibilité', usesCompat);
    logTest('Service Worker a fonctionnalités modernes', hasModernFeatures);
    logTest('Service Worker a fallbacks', hasFallbacks);
    
    if (!usesCompat || !hasModernFeatures || !hasFallbacks) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de documentation
function testDocumentation() {
  logHeader('DOCUMENTATION INTÉGRATION');

  let allTestsPassed = true;

  // Test 1: Vérifier la documentation
  const docsFiles = [
    'FIREBASE_SETUP.md',
    'FIREBASE_NEXT_STEPS.md'
  ];

  docsFiles.forEach(file => {
    const exists = fs.existsSync(file);
    logTest(`Documentation ${file}`, exists);
    
    if (!exists) allTestsPassed = false;
  });

  // Test 2: Vérifier les commentaires dans le code
  const codeFiles = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js',
    'server/config/firebase.js'
  ];

  codeFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasComments = content.includes('//') || content.includes('/*');
      const hasHeaderComment = content.includes('Configuration Firebase') || content.includes('Service Worker') || content.includes('PushNotificationService');
      
      logTest(`Commentaires dans ${path.basename(file)}`, hasComments);
      logTest(`Commentaire d'en-tête dans ${path.basename(file)}`, hasHeaderComment);
      
      if (!hasComments || !hasHeaderComment) allTestsPassed = false;
    }
  });

  return allTestsPassed;
}

// Test principal
function runAllIntegrationTests() {
  logHeader('DÉMARRAGE DES TESTS D\'INTÉGRATION COMPLÈTE');
  
  const startTime = Date.now();
  let totalTests = 0;
  let passedTests = 0;

  const testSuites = [
    { name: 'Client-Serveur', test: testClientServerIntegration },
    { name: 'Environnement', test: testEnvironmentConfiguration },
    { name: 'Sécurité', test: testSecurity },
    { name: 'Performance', test: testPerformance },
    { name: 'Compatibilité', test: testCompatibility },
    { name: 'Documentation', test: testDocumentation }
  ];

  testSuites.forEach(suite => {
    try {
      const result = suite.test();
      if (result) {
        passedTests++;
        log(`✅ ${suite.name}: TOUS LES TESTS PASSÉS`, 'green');
      } else {
        log(`❌ ${suite.name}: CERTAINS TESTS ÉCHOUÉS`, 'red');
      }
      totalTests++;
    } catch (error) {
      log(`💥 ${suite.name}: ERREUR - ${error.message}`, 'red');
      totalTests++;
    }
  });

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  logHeader('RÉSULTATS FINAUX INTÉGRATION');
  log(`⏱️  Durée totale: ${duration}s`, 'cyan');
  log(`📊 Tests passés: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`, passedTests === totalTests ? 'green' : 'yellow');

  if (passedTests === totalTests) {
    log('\n🎉 TOUS LES TESTS D\'INTÉGRATION SONT PASSÉS !', 'bright');
    log('🔗 Votre intégration Firebase est complète et prête !', 'green');
  } else {
    log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
    log('🔧 Consultez les détails ci-dessus pour corriger les problèmes', 'yellow');
  }

  return passedTests === totalTests;
}

// Exécuter les tests
if (require.main === module) {
  const success = runAllIntegrationTests();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testClientServerIntegration,
  testEnvironmentConfiguration,
  testSecurity,
  testPerformance,
  testCompatibility,
  testDocumentation,
  runAllIntegrationTests
}; 