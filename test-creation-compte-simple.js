#!/usr/bin/env node

/**
 * 🧪 Test Simple de Création de Compte Utilisateur
 * 
 * Ce script teste la fonctionnalité de création de compte utilisateur
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';

// Données de test complètes
const TEST_USER = {
  email: `test-${Date.now()}@communiconnect.com`,
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'Utilisateur',
  phone: '+22412345678',
  region: 'Conakry',
  prefecture: 'Conakry',
  commune: 'Kaloum',
  quartier: 'Centre-ville',
  address: '123 Rue du Commerce',
  latitude: 9.6412,
  longitude: -13.5784,
  dateOfBirth: '1990-01-01',
  gender: 'Homme'
};

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
  log(`🧪 ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logStep(step, message) {
  log(`  ${step} ${message}`, 'blue');
}

// Test de création de compte
async function testUserRegistration() {
  try {
    logStep('1️⃣', 'Test de création de compte utilisateur...');
    
    // Afficher les données envoyées
    console.log('Données envoyées:');
    Object.entries(TEST_USER).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data.success) {
      log('✅ Création de compte réussie', 'green');
      log(`   Utilisateur: ${response.data.user.email}`, 'green');
      log(`   Token: ${response.data.token ? 'Présent' : 'Absent'}`, 'green');
      return response.data;
    } else {
      log('❌ Création de compte échouée', 'red');
      log(`   Message: ${response.data.message}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌ Erreur lors de la création de compte', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.data?.message || error.response.data}`, 'red');
      if (error.response.data?.errors) {
        log('   Erreurs de validation:', 'red');
        error.response.data.errors.forEach(err => {
          log(`     - ${err.msg} (${err.param})`, 'red');
        });
      }
    } else if (error.code === 'ECONNREFUSED') {
      log('   Erreur: Serveur non accessible', 'red');
      log('   💡 Assurez-vous que le serveur est démarré avec: npm start', 'yellow');
    } else {
      log(`   Erreur: ${error.message}`, 'red');
    }
    return null;
  }
}

// Test de santé du serveur
async function testServerHealth() {
  try {
    logStep('0️⃣', 'Vérification de la santé du serveur...');
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    
    if (response.data.status === 'OK') {
      log('✅ Serveur opérationnel', 'green');
      return true;
    } else {
      log('❌ Serveur non opérationnel', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Serveur non accessible', 'red');
    log(`   Erreur: ${error.message}`, 'red');
    return false;
  }
}

// Fonction principale
async function runTest() {
  logHeader('TEST SIMPLE DE CRÉATION DE COMPTE');
  
  // Test 0: Santé du serveur
  const serverHealthy = await testServerHealth();
  if (!serverHealthy) {
    log('\n❌ Le serveur n\'est pas accessible', 'red');
    log('💡 Démarrez le serveur avec: npm start', 'yellow');
    return;
  }
  
  // Test 1: Création de compte
  const result = await testUserRegistration();
  
  if (result) {
    logHeader('RÉSULTAT');
    log('🎉 Création de compte réussie !', 'green');
    log('\n📊 Données de test :', 'cyan');
    log(`   Email: ${TEST_USER.email}`, 'yellow');
    log(`   Nom: ${TEST_USER.firstName} ${TEST_USER.lastName}`, 'yellow');
    log(`   Région: ${TEST_USER.region}`, 'yellow');
    log(`   Quartier: ${TEST_USER.quartier}`, 'yellow');
    
    log('\n🔧 Prochaines étapes :', 'cyan');
    log('   1. Testez la création de compte depuis l\'interface utilisateur', 'yellow');
    log('   2. Vérifiez que les données sont bien sauvegardées', 'yellow');
    log('   3. Testez la connexion avec le compte créé', 'yellow');
  } else {
    logHeader('ÉCHEC');
    log('❌ La création de compte a échoué', 'red');
    log('\n💡 Vérifiez les points suivants :', 'yellow');
    log('   1. Le serveur est-il démarré ? (npm start)', 'yellow');
    log('   2. MongoDB est-il connecté ?', 'yellow');
    log('   3. Les validations sont-elles corrigées ?', 'yellow');
    log('   4. Toutes les données requises sont-elles fournies ?', 'yellow');
  }
}

// Exécuter le test
runTest().catch(error => {
  log('\n❌ Erreur lors de l\'exécution du test', 'red');
  console.error(error);
  process.exit(1);
}); 