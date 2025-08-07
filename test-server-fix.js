const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000';

async function testServer() {
  console.log('🔍 Test du serveur CommuniConnect...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Test du health check...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check réussi:', healthResponse.data);
    
    // Test 2: API health check
    console.log('\n2. Test de l\'API health...');
    const apiHealthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ API health réussi:', apiHealthResponse.data);
    
    // Test 3: Auth status
    console.log('\n3. Test du statut d\'authentification...');
    const authStatusResponse = await axios.get(`${API_URL}/api/auth/status`);
    console.log('✅ Statut d\'authentification réussi:', authStatusResponse.data);
    
    // Test 4: CORS test
    console.log('\n4. Test CORS...');
    const corsTestResponse = await axios.get(`${API_URL}/api/auth`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✅ Test CORS réussi:', corsTestResponse.data);
    
    console.log('\n🎉 Tous les tests sont passés avec succès!');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Le serveur ne semble pas démarré. Démarrez-le avec:');
      console.log('   cd server && npm start');
    }
    
    if (error.response) {
      console.log('\n📊 Détails de l\'erreur:');
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServerStatus() {
  try {
    await axios.get(`${API_URL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Diagnostic du serveur CommuniConnect');
  console.log('=====================================\n');
  
  const isServerRunning = await checkServerStatus();
  
  if (!isServerRunning) {
    console.log('⚠️ Le serveur ne semble pas démarré.');
    console.log('💡 Pour démarrer le serveur:');
    console.log('   1. Ouvrez un terminal');
    console.log('   2. Naviguez vers le dossier server: cd server');
    console.log('   3. Installez les dépendances: npm install');
    console.log('   4. Démarrez le serveur: npm start');
    console.log('\n🔄 Relancez ce script une fois le serveur démarré.');
    return;
  }
  
  await testServer();
}

main().catch(console.error);
