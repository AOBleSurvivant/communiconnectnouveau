#!/usr/bin/env node

/**
 * Test simple CommuniConnect
 * Test rapide pour verifier que CommuniConnect fonctionne correctement
 */

const http = require('http');

console.log('Test simple CommuniConnect...\n');

// Test de l'API
const testAPI = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'OK') {
            console.log('✅ API CommuniConnect fonctionne');
            console.log(`   Message: ${response.message}`);
            console.log(`   Timestamp: ${response.timestamp}`);
            resolve(true);
          } else {
            console.log('❌ API ne repond pas correctement');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Reponse API invalide');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Impossible de se connecter a l\'API');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Timeout de connexion a l\'API');
      resolve(false);
    });
  });
};

// Test de la documentation
const testDocs = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api-docs', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Documentation Swagger accessible');
        resolve(true);
      } else {
        console.log('❌ Documentation non accessible');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Documentation non accessible');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Timeout de connexion a la documentation');
      resolve(false);
    });
  });
};

// Test principal
const main = async () => {
  console.log('🚀 Demarrage des tests...');
  
  try {
    // Test 1: API
    console.log('\n🔍 Test 1: API CommuniConnect');
    const apiTest = await testAPI();
    
    // Test 2: Documentation
    console.log('\n🔍 Test 2: Documentation Swagger');
    const docsTest = await testDocs();
    
    // Resume
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUME DES TESTS');
    console.log('='.repeat(50));
    
    if (apiTest && docsTest) {
      console.log('\n🎉 SUCCES COMPLET !');
      console.log('✅ CommuniConnect fonctionne parfaitement');
      console.log('✅ API accessible');
      console.log('✅ Documentation accessible');
      
      console.log('\n🚀 COMMUNICONNECT EST PRET !');
      console.log('\n🔗 Liens utiles :');
      console.log('   • API Health : http://localhost:5000/api/health');
      console.log('   • Documentation : http://localhost:5000/api-docs');
      console.log('   • Interface : http://localhost:3000');
      
    } else {
      console.log('\n⚠️ PROBLEMES DETECTES');
      if (!apiTest) console.log('❌ API non fonctionnelle');
      if (!docsTest) console.log('❌ Documentation non accessible');
      
      console.log('\n🔧 Solutions possibles :');
      console.log('   1. Verifiez que le serveur est demarre');
      console.log('   2. Redemarrez : cd server && npm start');
      console.log('   3. Verifiez les logs : tail -f logs/error.log');
    }
    
  } catch (error) {
    console.log(`\n❌ ERREUR : ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Test termine !');
  console.log('='.repeat(50));
};

// Demarrer les tests
main(); 