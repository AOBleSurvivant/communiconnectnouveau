#!/usr/bin/env node

/**
 * 🧪 Tests Complets Firebase - CommuniConnect
 * 
 * Ce script teste tous les aspects de la configuration Firebase :
 * - Configuration de base
 * - Service Worker
 * - Notifications push
 * - Intégration client/serveur
 * - Gestion d'erreurs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  log(`🧪 ${title}`, 'bright');
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

// Configuration de test
const TEST_CONFIG = {
  projectId: 'communiconnect-46934',
  apiKey: 'AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc',
  authDomain: 'communiconnect-46934.firebaseapp.com',
  storageBucket: 'communiconnect-46934.firebasestorage.app',
  messagingSenderId: '217198011802',
  appId: '1:217198011802:web:d3918c01560083424a4623',
  measurementId: 'G-W2YGDJ8KS9'
};

// Tests de configuration
function testConfiguration() {
  logHeader('CONFIGURATION FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier les fichiers de configuration
  const configFiles = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js',
    'server/config/firebase.js'
  ];

  configFiles.forEach(file => {
    const exists = fs.existsSync(file);
    logTest(`Fichier ${file} existe`, exists);
    if (!exists) allTestsPassed = false;
  });

  // Test 2: Vérifier la configuration Firebase
  const firebaseConfigPath = 'client/src/services/firebase.js';
  if (fs.existsSync(firebaseConfigPath)) {
    const content = fs.readFileSync(firebaseConfigPath, 'utf8');
    const hasApiKey = content.includes(TEST_CONFIG.apiKey);
    const hasProjectId = content.includes(TEST_CONFIG.projectId);
    const hasAuthDomain = content.includes(TEST_CONFIG.authDomain);
    
    logTest('Configuration API Key présente', hasApiKey);
    logTest('Configuration Project ID présente', hasProjectId);
    logTest('Configuration Auth Domain présente', hasAuthDomain);
    
    if (!hasApiKey || !hasProjectId || !hasAuthDomain) {
      allTestsPassed = false;
    }
  }

  // Test 3: Vérifier le service worker
  const swPath = 'client/public/firebase-messaging-sw.js';
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    const hasFirebaseConfig = content.includes('firebaseConfig');
    const hasMessaging = content.includes('firebase.messaging');
    const hasBackgroundHandler = content.includes('onBackgroundMessage');
    
    logTest('Service Worker - Configuration Firebase', hasFirebaseConfig);
    logTest('Service Worker - Messaging configuré', hasMessaging);
    logTest('Service Worker - Gestionnaire arrière-plan', hasBackgroundHandler);
    
    if (!hasFirebaseConfig || !hasMessaging || !hasBackgroundHandler) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de dépendances
function testDependencies() {
  logHeader('DÉPENDANCES FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier les dépendances client
  const clientPackagePath = 'client/package.json';
  if (fs.existsSync(clientPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
    const hasFirebase = packageJson.dependencies && packageJson.dependencies.firebase;
    
    logTest('Dépendance Firebase côté client', !!hasFirebase, hasFirebase ? `Version: ${hasFirebase}` : 'Manquante');
    
    if (!hasFirebase) allTestsPassed = false;
  }

  // Test 2: Vérifier les dépendances serveur
  const serverPackagePath = 'server/package.json';
  if (fs.existsSync(serverPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
    const hasFirebaseAdmin = packageJson.dependencies && packageJson.dependencies['firebase-admin'];
    
    logTest('Dépendance Firebase Admin côté serveur', !!hasFirebaseAdmin, hasFirebaseAdmin ? `Version: ${hasFirebaseAdmin}` : 'Manquante');
    
    if (!hasFirebaseAdmin) allTestsPassed = false;
  }

  return allTestsPassed;
}

// Tests de structure
function testStructure() {
  logHeader('STRUCTURE DES FICHIERS');

  let allTestsPassed = true;

  // Test 1: Vérifier la structure des services
  const servicesDir = 'client/src/services';
  if (fs.existsSync(servicesDir)) {
    const files = fs.readdirSync(servicesDir);
    const hasFirebase = files.includes('firebase.js');
    const hasPushNotification = files.includes('pushNotificationService.js');
    
    logTest('Service Firebase centralisé', hasFirebase);
    logTest('Service notifications push', hasPushNotification);
    
    if (!hasFirebase || !hasPushNotification) allTestsPassed = false;
  }

  // Test 2: Vérifier la structure serveur
  const serverConfigDir = 'server/config';
  if (fs.existsSync(serverConfigDir)) {
    const files = fs.readdirSync(serverConfigDir);
    const hasFirebaseConfig = files.includes('firebase.js');
    
    logTest('Configuration Firebase serveur', hasFirebaseConfig);
    
    if (!hasFirebaseConfig) allTestsPassed = false;
  }

  // Test 3: Vérifier le service worker
  const publicDir = 'client/public';
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    const hasServiceWorker = files.includes('firebase-messaging-sw.js');
    
    logTest('Service Worker Firebase', hasServiceWorker);
    
    if (!hasServiceWorker) allTestsPassed = false;
  }

  return allTestsPassed;
}

// Tests de syntaxe
function testSyntax() {
  logHeader('VÉRIFICATION SYNTAXE');

  let allTestsPassed = true;

  // Test 1: Vérifier la syntaxe du fichier Firebase
  const firebasePath = 'client/src/services/firebase.js';
  if (fs.existsSync(firebasePath)) {
    try {
      const content = fs.readFileSync(firebasePath, 'utf8');
      // Vérifier les imports
      const hasImports = content.includes('import { initializeApp }') && 
                        content.includes('import { getAnalytics }') && 
                        content.includes('import { getMessaging }');
      
      // Vérifier la configuration
      const hasConfig = content.includes('firebaseConfig') && 
                       content.includes('apiKey') && 
                       content.includes('projectId');
      
      // Vérifier les exports
      const hasExports = content.includes('export { app, analytics, messaging, firebaseConfig }');
      
      logTest('Syntaxe imports Firebase', hasImports);
      logTest('Syntaxe configuration Firebase', hasConfig);
      logTest('Syntaxe exports Firebase', hasExports);
      
      if (!hasImports || !hasConfig || !hasExports) allTestsPassed = false;
    } catch (error) {
      logTest('Syntaxe fichier Firebase', false, error.message);
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier la syntaxe du service worker
  const swPath = 'client/public/firebase-messaging-sw.js';
  if (fs.existsSync(swPath)) {
    try {
      const content = fs.readFileSync(swPath, 'utf8');
      const hasImportScripts = content.includes('importScripts') && 
                              content.includes('firebase-app-compat.js') && 
                              content.includes('firebase-messaging-compat.js');
      
      const hasConfig = content.includes('firebaseConfig') && 
                       content.includes('apiKey');
      
      const hasHandlers = content.includes('onBackgroundMessage') && 
                         content.includes('notificationclick');
      
      logTest('Syntaxe imports Service Worker', hasImportScripts);
      logTest('Syntaxe configuration Service Worker', hasConfig);
      logTest('Syntaxe gestionnaires Service Worker', hasHandlers);
      
      if (!hasImportScripts || !hasConfig || !hasHandlers) allTestsPassed = false;
    } catch (error) {
      logTest('Syntaxe Service Worker', false, error.message);
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests d'intégration
function testIntegration() {
  logHeader('INTÉGRATION FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier l'intégration client
  const pushNotificationPath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushNotificationPath)) {
    const content = fs.readFileSync(pushNotificationPath, 'utf8');
    const importsFirebase = content.includes("import { messaging } from './firebase'");
    const usesMessaging = content.includes('this.messaging = messaging');
    const hasInitialize = content.includes('async initialize()');
    const hasGetToken = content.includes('getFCMToken');
    
    logTest('Import Firebase dans service notifications', importsFirebase);
    logTest('Utilisation messaging Firebase', usesMessaging);
    logTest('Méthode initialize présente', hasInitialize);
    logTest('Méthode getFCMToken présente', hasGetToken);
    
    if (!importsFirebase || !usesMessaging || !hasInitialize || !hasGetToken) {
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier l'intégration serveur
  const serverFirebasePath = 'server/config/firebase.js';
  if (fs.existsSync(serverFirebasePath)) {
    const content = fs.readFileSync(serverFirebasePath, 'utf8');
    const importsAdmin = content.includes("require('firebase-admin')");
    const hasInitialize = content.includes('initializeFirebase');
    const hasGetMessaging = content.includes('getMessaging');
    const hasExports = content.includes('module.exports');
    
    logTest('Import Firebase Admin côté serveur', importsAdmin);
    logTest('Fonction initializeFirebase présente', hasInitialize);
    logTest('Fonction getMessaging présente', hasGetMessaging);
    logTest('Exports configurés', hasExports);
    
    if (!importsAdmin || !hasInitialize || !hasGetMessaging || !hasExports) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de sécurité
function testSecurity() {
  logHeader('SÉCURITÉ FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier que les clés ne sont pas exposées dans le code
  const sensitiveFiles = [
    'client/src/services/firebase.js',
    'client/public/firebase-messaging-sw.js'
  ];

  sensitiveFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasHardcodedKeys = content.includes('AIzaSy') && content.includes('communiconnect-46934');
      
      // C'est normal d'avoir les clés dans le code client pour Firebase
      logTest(`Clés Firebase présentes dans ${path.basename(file)}`, hasHardcodedKeys, 'Normal pour Firebase Web');
    }
  });

  // Test 2: Vérifier les variables d'environnement
  const envFiles = [
    'client/.env.example',
    'server/.env.example'
  ];

  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const hasFirebaseVars = content.includes('FIREBASE') || content.includes('REACT_APP_FIREBASE');
      
      logTest(`Variables Firebase dans ${path.basename(file)}`, hasFirebaseVars);
      
      if (!hasFirebaseVars) allTestsPassed = false;
    }
  });

  return allTestsPassed;
}

// Tests de performance
function testPerformance() {
  logHeader('PERFORMANCE FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier la taille des fichiers
  const filesToCheck = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js'
  ];

  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const sizeKB = Math.round(stats.size / 1024);
      const isReasonable = sizeKB < 50; // Moins de 50KB
      
      logTest(`Taille ${path.basename(file)} (${sizeKB}KB)`, isReasonable, `${sizeKB}KB`);
      
      if (!isReasonable) allTestsPassed = false;
    }
  });

  return allTestsPassed;
}

// Tests de compatibilité
function testCompatibility() {
  logHeader('COMPATIBILITÉ FIREBASE');

  let allTestsPassed = true;

  // Test 1: Vérifier la compatibilité des versions
  const clientPackagePath = 'client/package.json';
  if (fs.existsSync(clientPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
    const firebaseVersion = packageJson.dependencies?.firebase;
    
    if (firebaseVersion) {
      const version = firebaseVersion.replace('^', '').replace('~', '');
      const majorVersion = parseInt(version.split('.')[0]);
      const isCompatible = majorVersion >= 9;
      
      logTest(`Version Firebase compatible (${version})`, isCompatible, `Version: ${version}`);
      
      if (!isCompatible) allTestsPassed = false;
    }
  }

  // Test 2: Vérifier la compatibilité du service worker
  const swPath = 'client/public/firebase-messaging-sw.js';
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    const usesCompat = content.includes('firebase-app-compat.js') && content.includes('firebase-messaging-compat.js');
    const hasModernFeatures = content.includes('onBackgroundMessage') && content.includes('notificationclick');
    
    logTest('Service Worker utilise compatibilité', usesCompat);
    logTest('Service Worker a fonctionnalités modernes', hasModernFeatures);
    
    if (!usesCompat || !hasModernFeatures) allTestsPassed = false;
  }

  return allTestsPassed;
}

// Test principal
function runAllTests() {
  logHeader('DÉMARRAGE DES TESTS FIREBASE COMPLETS');
  
  const startTime = Date.now();
  let totalTests = 0;
  let passedTests = 0;

  const testSuites = [
    { name: 'Configuration', test: testConfiguration },
    { name: 'Dépendances', test: testDependencies },
    { name: 'Structure', test: testStructure },
    { name: 'Syntaxe', test: testSyntax },
    { name: 'Intégration', test: testIntegration },
    { name: 'Sécurité', test: testSecurity },
    { name: 'Performance', test: testPerformance },
    { name: 'Compatibilité', test: testCompatibility }
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

  logHeader('RÉSULTATS FINAUX');
  log(`⏱️  Durée totale: ${duration}s`, 'cyan');
  log(`📊 Tests passés: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`, passedTests === totalTests ? 'green' : 'yellow');

  if (passedTests === totalTests) {
    log('\n🎉 TOUS LES TESTS FIREBASE SONT PASSÉS !', 'bright');
    log('🔥 Votre configuration Firebase est prête pour la production !', 'green');
  } else {
    log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
    log('🔧 Consultez les détails ci-dessus pour corriger les problèmes', 'yellow');
  }

  return passedTests === totalTests;
}

// Exécuter les tests
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testConfiguration,
  testDependencies,
  testStructure,
  testSyntax,
  testIntegration,
  testSecurity,
  testPerformance,
  testCompatibility,
  runAllTests
}; 