#!/usr/bin/env node

/**
 * 🧪 Test de Création de Compte Utilisateur
 * 
 * Ce script teste la fonctionnalité de création de compte utilisateur
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
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

// Tests
async function testServerHealth() {
  try {
    logStep('1️⃣', 'Vérification de la santé du serveur...');
    const response = await axios.get(`${BASE_URL}/health`);
    
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

async function testAuthService() {
  try {
    logStep('2️⃣', 'Vérification du service d\'authentification...');
    const response = await axios.get(`${BASE_URL}/auth/status`);
    
    if (response.data.success) {
      log('✅ Service d\'authentification opérationnel', 'green');
      return true;
    } else {
      log('❌ Service d\'authentification non opérationnel', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Service d\'authentification non accessible', 'red');
    log(`   Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testUserRegistration() {
  try {
    logStep('3️⃣', 'Test de création de compte utilisateur...');
    
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER, {
      headers: {
        'Content-Type': 'application/json'
      }
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
    } else {
      log(`   Erreur: ${error.message}`, 'red');
    }
    return null;
  }
}

async function testUserLogin() {
  try {
    logStep('4️⃣', 'Test de connexion utilisateur...');
    
    const loginData = {
      identifier: TEST_USER.email,
      password: TEST_USER.password
    };
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      log('✅ Connexion réussie', 'green');
      log(`   Utilisateur: ${response.data.user.email}`, 'green');
      log(`   Token: ${response.data.token ? 'Présent' : 'Absent'}`, 'green');
      return response.data;
    } else {
      log('❌ Connexion échouée', 'red');
      log(`   Message: ${response.data.message}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌ Erreur lors de la connexion', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.data?.message || error.response.data}`, 'red');
    } else {
      log(`   Erreur: ${error.message}`, 'red');
    }
    return null;
  }
}

async function testUserProfile() {
  try {
    logStep('5️⃣', 'Test de récupération du profil utilisateur...');
    
    // D'abord se connecter pour obtenir un token
    const loginData = {
      identifier: TEST_USER.email,
      password: TEST_USER.password
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (!loginResponse.data.success || !loginResponse.data.token) {
      log('❌ Impossible de se connecter pour tester le profil', 'red');
      return false;
    }
    
    const token = loginResponse.data.token;
    
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      log('✅ Récupération du profil réussie', 'green');
      log(`   Nom: ${response.data.user.firstName} ${response.data.user.lastName}`, 'green');
      log(`   Email: ${response.data.user.email}`, 'green');
      log(`   Région: ${response.data.user.region}`, 'green');
      return true;
    } else {
      log('❌ Récupération du profil échouée', 'red');
      log(`   Message: ${response.data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Erreur lors de la récupération du profil', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.data?.message || error.response.data}`, 'red');
    } else {
      log(`   Erreur: ${error.message}`, 'red');
    }
    return false;
  }
}

// Fonction principale
async function runTests() {
  logHeader('TEST DE CRÉATION DE COMPTE UTILISATEUR');
  
  // Test 1: Santé du serveur
  const serverHealthy = await testServerHealth();
  if (!serverHealthy) {
    log('\n❌ Le serveur n\'est pas accessible. Assurez-vous qu\'il est démarré avec `npm start`', 'red');
    return;
  }
  
  // Test 2: Service d'authentification
  const authServiceOk = await testAuthService();
  if (!authServiceOk) {
    log('\n❌ Le service d\'authentification n\'est pas accessible', 'red');
    return;
  }
  
  // Test 3: Création de compte
  const registrationResult = await testUserRegistration();
  if (!registrationResult) {
    log('\n❌ La création de compte a échoué', 'red');
    log('💡 Vérifiez les points suivants :', 'yellow');
    log('   1. MongoDB est-il connecté ?', 'yellow');
    log('   2. Les variables d\'environnement sont-elles configurées ?', 'yellow');
    log('   3. Le serveur est-il démarré correctement ?', 'yellow');
    return;
  }
  
  // Test 4: Connexion
  const loginResult = await testUserLogin();
  if (!loginResult) {
    log('\n❌ La connexion a échoué', 'red');
    return;
  }
  
  // Test 5: Profil utilisateur
  const profileResult = await testUserProfile();
  if (!profileResult) {
    log('\n❌ La récupération du profil a échoué', 'red');
    return;
  }
  
  logHeader('RÉSULTATS DES TESTS');
  log('🎉 Tous les tests de création de compte sont passés avec succès !', 'green');
  log('\n📊 Résumé :', 'cyan');
  log('   ✅ Serveur opérationnel', 'green');
  log('   ✅ Service d\'authentification fonctionnel', 'green');
  log('   ✅ Création de compte réussie', 'green');
  log('   ✅ Connexion utilisateur réussie', 'green');
  log('   ✅ Récupération de profil réussie', 'green');
  
  log('\n🔧 Prochaines étapes :', 'cyan');
  log('   1. Testez la création de compte depuis l\'interface utilisateur', 'yellow');
  log('   2. Vérifiez que les données sont bien sauvegardées en base', 'yellow');
  log('   3. Testez les fonctionnalités de profil et de modification', 'yellow');
  
  log('\n📚 Documentation :', 'cyan');
  log('   - API Documentation : http://localhost:5000/api-docs', 'yellow');
  log('   - Console Firebase : https://console.firebase.google.com/project/communiconnect-46934', 'yellow');
}

// Exécuter les tests
runTests().catch(error => {
  log('\n❌ Erreur lors de l\'exécution des tests', 'red');
  console.error(error);
  process.exit(1);
}); 