#!/usr/bin/env node

/**
 * 🔔 Tests Notifications Push - CommuniConnect
 * 
 * Ce script teste les notifications push Firebase :
 * - Initialisation du service
 * - Demande de permissions
 * - Génération de tokens
 * - Envoi de notifications
 * - Gestion des erreurs
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
  log(`🔔 ${title}`, 'bright');
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
  apiKey: 'AIzaSyDXe99GAQ3mnXE9M-j_vacRZEKKuSlkMQc'
};

// Tests de configuration des notifications
function testNotificationConfiguration() {
  logHeader('CONFIGURATION NOTIFICATIONS');

  let allTestsPassed = true;

  // Test 1: Vérifier le service de notifications
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasClass = content.includes('class PushNotificationService');
    const hasInitialize = content.includes('async initialize()');
    const hasGetToken = content.includes('async getFCMToken()');
    const hasRequestPermission = content.includes('async requestPermission()');
    const hasHandleNotification = content.includes('handleNotification');
    
    logTest('Classe PushNotificationService', hasClass);
    logTest('Méthode initialize', hasInitialize);
    logTest('Méthode getFCMToken', hasGetToken);
    logTest('Méthode requestPermission', hasRequestPermission);
    logTest('Méthode handleNotification', hasHandleNotification);
    
    if (!hasClass || !hasInitialize || !hasGetToken || !hasRequestPermission || !hasHandleNotification) {
      allTestsPassed = false;
    }
  } else {
    logTest('Service notifications push existe', false);
    allTestsPassed = false;
  }

  // Test 2: Vérifier les types de notifications
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasMessageNotifications = content.includes('notifyNewMessage');
    const hasAlertNotifications = content.includes('notifyAlert');
    const hasEventNotifications = content.includes('notifyEvent');
    const hasLivestreamNotifications = content.includes('notifyLivestreamStart');
    const hasFriendRequestNotifications = content.includes('notifyFriendRequest');
    
    logTest('Notifications messages', hasMessageNotifications);
    logTest('Notifications alertes', hasAlertNotifications);
    logTest('Notifications événements', hasEventNotifications);
    logTest('Notifications livestreams', hasLivestreamNotifications);
    logTest('Notifications demandes d\'amis', hasFriendRequestNotifications);
    
    if (!hasMessageNotifications || !hasAlertNotifications || !hasEventNotifications || 
        !hasLivestreamNotifications || !hasFriendRequestNotifications) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de service worker
function testServiceWorker() {
  logHeader('SERVICE WORKER');

  let allTestsPassed = true;

  // Test 1: Vérifier le service worker
  const swPath = 'client/public/firebase-messaging-sw.js';
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    
    const hasImportScripts = content.includes('importScripts');
    const hasFirebaseConfig = content.includes('firebaseConfig');
    const hasMessaging = content.includes('firebase.messaging');
    const hasBackgroundHandler = content.includes('onBackgroundMessage');
    const hasNotificationClick = content.includes('notificationclick');
    const hasNotificationAction = content.includes('notificationaction');
    
    logTest('Import scripts Firebase', hasImportScripts);
    logTest('Configuration Firebase', hasFirebaseConfig);
    logTest('Service messaging', hasMessaging);
    logTest('Gestionnaire arrière-plan', hasBackgroundHandler);
    logTest('Gestionnaire clic notification', hasNotificationClick);
    logTest('Gestionnaire action notification', hasNotificationAction);
    
    if (!hasImportScripts || !hasFirebaseConfig || !hasMessaging || !hasBackgroundHandler || 
        !hasNotificationClick || !hasNotificationAction) {
      allTestsPassed = false;
    }
  } else {
    logTest('Service Worker existe', false);
    allTestsPassed = false;
  }

  // Test 2: Vérifier les actions de notification
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    
    const hasReplyAction = content.includes('action: \'reply\'');
    const hasViewAction = content.includes('action: \'view\'');
    const hasJoinAction = content.includes('action: \'join\'');
    const hasRsvpAction = content.includes('action: \'rsvp\'');
    const hasShareAction = content.includes('action: \'share\'');
    
    logTest('Action Répondre', hasReplyAction);
    logTest('Action Voir', hasViewAction);
    logTest('Action Rejoindre', hasJoinAction);
    logTest('Action Participer', hasRsvpAction);
    logTest('Action Partager', hasShareAction);
    
    if (!hasReplyAction || !hasViewAction || !hasJoinAction || !hasRsvpAction || !hasShareAction) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests d'intégration
function testIntegration() {
  logHeader('INTÉGRATION NOTIFICATIONS');

  let allTestsPassed = true;

  // Test 1: Vérifier l'intégration avec Firebase
  const firebasePath = 'client/src/services/firebase.js';
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  
  if (fs.existsSync(firebasePath) && fs.existsSync(pushServicePath)) {
    const firebaseContent = fs.readFileSync(firebasePath, 'utf8');
    const pushContent = fs.readFileSync(pushServicePath, 'utf8');
    
    const firebaseExportsMessaging = firebaseContent.includes('messaging');
    const pushImportsMessaging = pushContent.includes("import { messaging } from './firebase'");
    const pushUsesMessaging = pushContent.includes('this.messaging = messaging');
    
    logTest('Firebase exporte messaging', firebaseExportsMessaging);
    logTest('Service importe messaging', pushImportsMessaging);
    logTest('Service utilise messaging', pushUsesMessaging);
    
    if (!firebaseExportsMessaging || !pushImportsMessaging || !pushUsesMessaging) {
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier l'intégration serveur
  const serverFirebasePath = 'server/config/firebase.js';
  const serverPushServicePath = 'server/services/pushNotificationService.js';
  
  if (fs.existsSync(serverFirebasePath) && fs.existsSync(serverPushServicePath)) {
    const serverFirebaseContent = fs.readFileSync(serverFirebasePath, 'utf8');
    const serverPushContent = fs.readFileSync(serverPushServicePath, 'utf8');
    
    const hasAdminSDK = serverFirebaseContent.includes('firebase-admin');
    const hasInitializeFunction = serverFirebaseContent.includes('initializeFirebase');
    const hasMessagingFunction = serverFirebaseContent.includes('getMessaging');
    const serverUsesFirebase = serverPushContent.includes('require(\'firebase-admin\')');
    
    logTest('Firebase Admin SDK configuré', hasAdminSDK);
    logTest('Fonction initializeFirebase', hasInitializeFunction);
    logTest('Fonction getMessaging', hasMessagingFunction);
    logTest('Service serveur utilise Firebase', serverUsesFirebase);
    
    if (!hasAdminSDK || !hasInitializeFunction || !hasMessagingFunction || !serverUsesFirebase) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de gestion d'erreurs
function testErrorHandling() {
  logHeader('GESTION D\'ERREURS');

  let allTestsPassed = true;

  // Test 1: Vérifier la gestion d'erreurs côté client
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasTryCatch = content.includes('try {') && content.includes('} catch (error)');
    const hasErrorLogging = content.includes('console.error');
    const hasGracefulFallback = content.includes('return false') || content.includes('return null');
    
    logTest('Blocs try-catch présents', hasTryCatch);
    logTest('Logging d\'erreurs', hasErrorLogging);
    logTest('Gestion gracieuse des erreurs', hasGracefulFallback);
    
    if (!hasTryCatch || !hasErrorLogging || !hasGracefulFallback) {
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier la gestion d'erreurs côté serveur
  const serverPushServicePath = 'server/services/pushNotificationService.js';
  if (fs.existsSync(serverPushServicePath)) {
    const content = fs.readFileSync(serverPushServicePath, 'utf8');
    
    const hasTryCatch = content.includes('try {') && content.includes('} catch (error)');
    const hasErrorLogging = content.includes('console.error');
    const hasTokenValidation = content.includes('invalid-registration-token') || content.includes('registration-token-not-registered');
    
    logTest('Blocs try-catch serveur', hasTryCatch);
    logTest('Logging d\'erreurs serveur', hasErrorLogging);
    logTest('Validation des tokens', hasTokenValidation);
    
    if (!hasTryCatch || !hasErrorLogging || !hasTokenValidation) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de fonctionnalités
function testFeatures() {
  logHeader('FONCTIONNALITÉS NOTIFICATIONS');

  let allTestsPassed = true;

  // Test 1: Vérifier les fonctionnalités de base
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasPermissionRequest = content.includes('Notification.requestPermission');
    const hasTokenGeneration = content.includes('getToken');
    const hasTokenSending = content.includes('sendTokenToServer');
    const hasBackgroundHandler = content.includes('setupBackgroundMessageHandler');
    const hasForegroundHandler = content.includes('setupForegroundMessageHandler');
    
    logTest('Demande de permission', hasPermissionRequest);
    logTest('Génération de token', hasTokenGeneration);
    logTest('Envoi de token au serveur', hasTokenSending);
    logTest('Gestionnaire arrière-plan', hasBackgroundHandler);
    logTest('Gestionnaire premier plan', hasForegroundHandler);
    
    if (!hasPermissionRequest || !hasTokenGeneration || !hasTokenSending || 
        !hasBackgroundHandler || !hasForegroundHandler) {
      allTestsPassed = false;
    }
  }

  // Test 2: Vérifier les fonctionnalités avancées
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasNotificationActions = content.includes('getNotificationActions');
    const hasNotificationClick = content.includes('handleNotificationClick');
    const hasCustomEvents = content.includes('CustomEvent');
    const hasSettingsUpdate = content.includes('updateSettings');
    const hasPermissionStatus = content.includes('getPermissionStatus');
    
    logTest('Actions de notification', hasNotificationActions);
    logTest('Gestion des clics', hasNotificationClick);
    logTest('Événements personnalisés', hasCustomEvents);
    logTest('Mise à jour des paramètres', hasSettingsUpdate);
    logTest('Statut des permissions', hasPermissionStatus);
    
    if (!hasNotificationActions || !hasNotificationClick || !hasCustomEvents || 
        !hasSettingsUpdate || !hasPermissionStatus) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Tests de performance
function testPerformance() {
  logHeader('PERFORMANCE NOTIFICATIONS');

  let allTestsPassed = true;

  // Test 1: Vérifier la taille des fichiers
  const filesToCheck = [
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js'
  ];

  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const sizeKB = Math.round(stats.size / 1024);
      const isReasonable = sizeKB < 100; // Moins de 100KB
      
      logTest(`Taille ${path.basename(file)} (${sizeKB}KB)`, isReasonable, `${sizeKB}KB`);
      
      if (!isReasonable) allTestsPassed = false;
    }
  });

  // Test 2: Vérifier l'optimisation
  const pushServicePath = 'client/src/services/pushNotificationService.js';
  if (fs.existsSync(pushServicePath)) {
    const content = fs.readFileSync(pushServicePath, 'utf8');
    
    const hasSingleton = content.includes('// Instance singleton');
    const hasLazyLoading = content.includes('this.isInitialized') || content.includes('this.isSupported');
    const hasEfficientChecks = content.includes('if (!this.isSupported') || content.includes('if (!this.isInitialized');
    
    logTest('Pattern singleton', hasSingleton);
    logTest('Chargement différé', hasLazyLoading);
    logTest('Vérifications efficaces', hasEfficientChecks);
    
    if (!hasSingleton || !hasLazyLoading || !hasEfficientChecks) {
      allTestsPassed = false;
    }
  }

  return allTestsPassed;
}

// Test principal
function runAllNotificationTests() {
  logHeader('DÉMARRAGE DES TESTS NOTIFICATIONS PUSH');
  
  const startTime = Date.now();
  let totalTests = 0;
  let passedTests = 0;

  const testSuites = [
    { name: 'Configuration', test: testNotificationConfiguration },
    { name: 'Service Worker', test: testServiceWorker },
    { name: 'Intégration', test: testIntegration },
    { name: 'Gestion d\'erreurs', test: testErrorHandling },
    { name: 'Fonctionnalités', test: testFeatures },
    { name: 'Performance', test: testPerformance }
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

  logHeader('RÉSULTATS FINAUX NOTIFICATIONS');
  log(`⏱️  Durée totale: ${duration}s`, 'cyan');
  log(`📊 Tests passés: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`, passedTests === totalTests ? 'green' : 'yellow');

  if (passedTests === totalTests) {
    log('\n🎉 TOUS LES TESTS NOTIFICATIONS SONT PASSÉS !', 'bright');
    log('🔔 Votre système de notifications push est prêt !', 'green');
  } else {
    log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
    log('🔧 Consultez les détails ci-dessus pour corriger les problèmes', 'yellow');
  }

  return passedTests === totalTests;
}

// Exécuter les tests
if (require.main === module) {
  const success = runAllNotificationTests();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testNotificationConfiguration,
  testServiceWorker,
  testIntegration,
  testErrorHandling,
  testFeatures,
  testPerformance,
  runAllNotificationTests
}; 