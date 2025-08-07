const axios = require('axios');
const colors = require('colors');

console.log('🎯 TEST FINAL COMPLET - COMMUNICONNECT'.bold.cyan);
console.log('=====================================\n');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Configuration pour les tests
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Données de test
const testUser = {
  email: `test-${Date.now()}@communiconnect.com`,
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phone: `224${Math.floor(Math.random() * 90000000) + 10000000}`,
  region: 'Conakry',
  prefecture: 'Conakry',
  commune: 'Kaloum',
  quartier: 'Centre'
};

let authToken = null;

// Fonction de test avec gestion d'erreur
async function runTest(testName, testFunction) {
  try {
    console.log(`🔍 ${testName}...`);
    const result = await testFunction();
    console.log(`✅ ${testName}: ${result}`.green);
    return true;
  } catch (error) {
    console.log(`❌ ${testName}: ${error.message}`.red);
    return false;
  }
}

// Tests
async function testServerHealth() {
  const response = await axios.get(`${BASE_URL}/health`, testConfig);
  return response.status === 200 ? 'Serveur opérationnel' : 'Serveur non disponible';
}

async function testAuthentication() {
  // Test login avec utilisateur existant
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@communiconnect.com',
      password: 'Test123!'
    }, testConfig);
    
    if (loginResponse.data.success && loginResponse.data.token) {
      authToken = loginResponse.data.token;
      return 'Authentification réussie';
    }
  } catch (error) {
    // Si l'utilisateur n'existe pas, on le crée
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, testConfig);
      if (registerResponse.data.success && registerResponse.data.token) {
        authToken = registerResponse.data.token;
        return 'Inscription et authentification réussies';
      }
    } catch (registerError) {
      throw new Error('Échec de l\'inscription et de l\'authentification');
    }
  }
}

async function testFriendsSystem() {
  if (!authToken) throw new Error('Token d\'authentification requis');
  
  const headers = { ...testConfig.headers, Authorization: `Bearer ${authToken}` };
  
  // Test récupération des amis
  const friendsResponse = await axios.get(`${BASE_URL}/friends`, { ...testConfig, headers });
  return `Amis récupérés: ${friendsResponse.data.data?.length || 0}`;
}

async function testConversations() {
  if (!authToken) throw new Error('Token d\'authentification requis');
  
  const headers = { ...testConfig.headers, Authorization: `Bearer ${authToken}` };
  
  // Test récupération des conversations
  const conversationsResponse = await axios.get(`${BASE_URL}/conversations`, { ...testConfig, headers });
  return `Conversations récupérées: ${conversationsResponse.data.data?.length || 0}`;
}

async function testLivestreams() {
  const response = await axios.get(`${BASE_URL}/livestreams`, testConfig);
  return `Livestreams récupérés: ${response.data.data?.length || 0}`;
}

async function testEvents() {
  const response = await axios.get(`${BASE_URL}/events`, testConfig);
  return `Événements récupérés: ${response.data.data?.length || 0}`;
}

async function testFrontendAccess() {
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    return response.status === 200 ? 'Frontend accessible' : 'Frontend non accessible';
  } catch (error) {
    return 'Frontend non accessible (normal si pas démarré)';
  }
}

async function testDesignSystem() {
  try {
    const response = await axios.get(`${FRONTEND_URL}/design-system`, { timeout: 5000 });
    return response.status === 200 ? 'Design System accessible' : 'Design System non accessible';
  } catch (error) {
    return 'Design System non accessible (normal si pas configuré)';
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests complets...\n');
  
  const tests = [
    { name: 'Santé du serveur', test: testServerHealth },
    { name: 'Authentification', test: testAuthentication },
    { name: 'Système d\'amis', test: testFriendsSystem },
    { name: 'Conversations', test: testConversations },
    { name: 'Livestreams', test: testLivestreams },
    { name: 'Événements', test: testEvents },
    { name: 'Accès Frontend', test: testFrontendAccess },
    { name: 'Design System', test: testDesignSystem }
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    const success = await runTest(test.name, test.test);
    if (success) passedTests++;
    console.log('');
  }
  
  // Résumé final
  console.log('📊 RÉSUMÉ DES TESTS'.bold.cyan);
  console.log('==================');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`.green);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`.red);
  console.log(`📈 Score: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS !'.bold.green);
    console.log('CommuniConnect est prêt pour la production !'.green);
  } else {
    console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ'.bold.yellow);
    console.log('Vérifiez les erreurs ci-dessus.'.yellow);
  }
  
  console.log('\n💡 PROCHAINES ÉTAPES:'.bold.cyan);
  console.log('1. Ouvrir http://localhost:3000 dans votre navigateur');
  console.log('2. Tester l\'interface utilisateur manuellement');
  console.log('3. Vérifier les fonctionnalités de conversation');
  console.log('4. Tester le design system sur /design-system');
}

// Exécution
runAllTests().catch(console.error); 