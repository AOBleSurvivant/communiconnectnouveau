#!/usr/bin/env node

/**
 * 🧪 Tests Complets Firebase - CommuniConnect
 * 
 * Script principal pour exécuter tous les tests Firebase :
 * - Tests de configuration
 * - Tests de notifications push
 * - Tests d'intégration
 * - Tests de performance
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
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`🧪 ${title}`, 'bright');
  log(`${'='.repeat(80)}`, 'cyan');
}

function logSection(title) {
  log(`\n${'-'.repeat(60)}`, 'blue');
  log(`📋 ${title}`, 'blue');
  log(`${'-'.repeat(60)}`, 'blue');
}

// Importer les modules de test
let testFirebaseComplet, testNotificationsPush, testIntegrationComplete;

try {
  testFirebaseComplet = require('./test-firebase-complet');
  testNotificationsPush = require('./test-notifications-push');
  testIntegrationComplete = require('./test-integration-complete');
} catch (error) {
  log('❌ Erreur lors du chargement des modules de test', 'red');
  log(`   ${error.message}`, 'yellow');
  process.exit(1);
}

// Fonction pour exécuter les tests avec gestion d'erreurs
async function runTestSuite(suiteName, testFunction) {
  try {
    logSection(`Exécution des tests : ${suiteName}`);
    const startTime = Date.now();
    
    const result = await testFunction();
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    if (result) {
      log(`✅ ${suiteName} : TOUS LES TESTS PASSÉS (${duration}s)`, 'green');
    } else {
      log(`❌ ${suiteName} : CERTAINS TESTS ÉCHOUÉS (${duration}s)`, 'red');
    }
    
    return { success: result, duration, name: suiteName };
  } catch (error) {
    log(`💥 ${suiteName} : ERREUR - ${error.message}`, 'red');
    return { success: false, duration: 0, name: suiteName, error: error.message };
  }
}

// Fonction principale
async function runAllTests() {
  logHeader('DÉMARRAGE DES TESTS FIREBASE COMPLETS - COMMUNICONNECT');
  
  const startTime = Date.now();
  const results = [];
  
  // Test 1: Tests de configuration Firebase
  logSection('1. TESTS DE CONFIGURATION FIREBASE');
  const configResult = await runTestSuite('Configuration Firebase', () => {
    return testFirebaseComplet.runAllTests();
  });
  results.push(configResult);
  
  // Test 2: Tests de notifications push
  logSection('2. TESTS DE NOTIFICATIONS PUSH');
  const notificationsResult = await runTestSuite('Notifications Push', () => {
    return testNotificationsPush.runAllNotificationTests();
  });
  results.push(notificationsResult);
  
  // Test 3: Tests d'intégration complète
  logSection('3. TESTS D\'INTÉGRATION COMPLÈTE');
  const integrationResult = await runTestSuite('Intégration Complète', () => {
    return testIntegrationComplete.runAllIntegrationTests();
  });
  results.push(integrationResult);
  
  // Calcul des résultats finaux
  const endTime = Date.now();
  const totalDuration = Math.round((endTime - startTime) / 1000);
  
  const passedSuites = results.filter(r => r.success).length;
  const totalSuites = results.length;
  const successRate = Math.round((passedSuites / totalSuites) * 100);
  
  // Affichage des résultats finaux
  logHeader('RÉSULTATS FINAUX COMPLETS');
  
  log(`⏱️  Durée totale : ${totalDuration}s`, 'cyan');
  log(`📊 Suites passées : ${passedSuites}/${totalSuites}`, passedSuites === totalSuites ? 'green' : 'yellow');
  log(`📈 Taux de réussite global : ${successRate}%`, passedSuites === totalSuites ? 'green' : 'yellow');
  
  // Détail des résultats
  logSection('DÉTAIL DES RÉSULTATS');
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const color = result.success ? 'green' : 'red';
    const duration = result.duration > 0 ? ` (${result.duration}s)` : '';
    const error = result.error ? ` - ${result.error}` : '';
    
    log(`  ${status} ${result.name}${duration}${error}`, color);
  });
  
  // Recommandations
  logSection('RECOMMANDATIONS');
  
  if (passedSuites === totalSuites) {
    log('🎉 FÉLICITATIONS ! TOUS LES TESTS SONT PASSÉS !', 'bright');
    log('🔥 Votre configuration Firebase est parfaitement opérationnelle !', 'green');
    log('🚀 Vous pouvez maintenant déployer en production avec confiance.', 'green');
  } else {
    log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
    log('🔧 Voici les actions recommandées :', 'yellow');
    
    results.forEach(result => {
      if (!result.success) {
        log(`   • Corriger les problèmes dans : ${result.name}`, 'yellow');
      }
    });
    
    log('\n📋 Étapes de correction :', 'cyan');
    log('   1. Consultez les détails des tests échoués ci-dessus', 'cyan');
    log('   2. Corrigez les problèmes identifiés', 'cyan');
    log('   3. Relancez les tests avec : node run-all-tests.js', 'cyan');
    log('   4. Répétez jusqu\'à ce que tous les tests passent', 'cyan');
  }
  
  // Informations supplémentaires
  logSection('INFORMATIONS SUPPLÉMENTAIRES');
  log('📚 Documentation :', 'cyan');
  log('   • FIREBASE_SETUP.md - Guide de configuration', 'cyan');
  log('   • FIREBASE_NEXT_STEPS.md - Prochaines étapes', 'cyan');
  
  log('🔗 Liens utiles :', 'cyan');
  log('   • Console Firebase : https://console.firebase.google.com/project/communiconnect-46934', 'cyan');
  log('   • Documentation Firebase : https://firebase.google.com/docs', 'cyan');
  
  log('📞 Support :', 'cyan');
  log('   • Consultez les logs ci-dessus pour les erreurs', 'cyan');
  log('   • Vérifiez la configuration dans les fichiers mentionnés', 'cyan');
  
  return passedSuites === totalSuites;
}

// Fonction pour vérifier les prérequis
function checkPrerequisites() {
  logSection('VÉRIFICATION DES PRÉREQUIS');
  
  let allPrerequisitesMet = true;
  
  // Vérifier que les fichiers de test existent
  const testFiles = [
    'test-firebase-complet.js',
    'test-notifications-push.js',
    'test-integration-complete.js'
  ];
  
  testFiles.forEach(file => {
    const exists = fs.existsSync(file);
    log(`  ${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
    if (!exists) allPrerequisitesMet = false;
  });
  
  // Vérifier que les fichiers de configuration Firebase existent
  const configFiles = [
    'client/src/services/firebase.js',
    'client/src/services/pushNotificationService.js',
    'client/public/firebase-messaging-sw.js',
    'server/config/firebase.js'
  ];
  
  log('\n  Vérification des fichiers de configuration :', 'cyan');
  configFiles.forEach(file => {
    const exists = fs.existsSync(file);
    log(`    ${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
    if (!exists) allPrerequisitesMet = false;
  });
  
  if (!allPrerequisitesMet) {
    log('\n❌ Certains prérequis ne sont pas satisfaits', 'red');
    log('🔧 Veuillez corriger les problèmes ci-dessus avant de relancer les tests', 'yellow');
    return false;
  }
  
  log('\n✅ Tous les prérequis sont satisfaits', 'green');
  return true;
}

// Point d'entrée principal
async function main() {
  try {
    // Vérifier les prérequis
    if (!checkPrerequisites()) {
      process.exit(1);
    }
    
    // Exécuter tous les tests
    const success = await runAllTests();
    
    // Code de sortie
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`💥 Erreur fatale : ${error.message}`, 'red');
    log('🔧 Veuillez vérifier la configuration et relancer les tests', 'yellow');
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  runAllTests,
  checkPrerequisites,
  main
};