const axios = require('axios');

async function testInscription() {
  console.log('🔍 TEST D\'INSCRIPTION COMMUNICONNECT');
  console.log('=' .repeat(50));
  
  const testData = {
    email: 'test@communiconnect.gn',
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'Utilisateur',
    phone: '22412345678',
    region: 'Conakry',
    prefecture: 'Conakry',
    commune: 'Kaloum',
    quartier: 'Centre-ville',
    address: '123 Rue Test, Conakry',
    latitude: 9.6412,
    longitude: -13.5784,
    dateOfBirth: '1990-01-01',
    gender: 'Homme'
  };
  
  try {
    console.log('📤 Envoi de la requête d\'inscription...');
    console.log('Données:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ INSCRIPTION RÉUSSIE !');
    console.log('Status:', response.status);
    console.log('Réponse:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERREUR D\'INSCRIPTION');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
    console.log('Erreur complète:', JSON.stringify(error.response?.data, null, 2));
    
    // Afficher les détails de l'erreur
    if (error.response?.data?.errors) {
      console.log('\n🔍 DÉTAILS DES ERREURS:');
      error.response.data.errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.msg} (${err.param})`);
      });
    }
  }
}

async function testConnexion() {
  console.log('\n🔍 TEST DE CONNEXION');
  console.log('=' .repeat(30));
  
  const loginData = {
    identifier: 'test@communiconnect.gn',
    password: 'Test123!'
  };
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('Status:', response.status);
    console.log('Token:', response.data.token ? 'Présent' : 'Absent');
    
  } catch (error) {
    console.log('❌ ERREUR DE CONNEXION');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
  }
}

async function testHealth() {
  console.log('\n🔍 TEST DE SANTÉ DU SERVEUR');
  console.log('=' .repeat(35));
  
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Serveur opérationnel');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    
  } catch (error) {
    console.log('❌ Serveur inaccessible');
    console.log('Erreur:', error.message);
  }
}

async function runTests() {
  await testHealth();
  await testInscription();
  await testConnexion();
  
  console.log('\n🎯 TESTS TERMINÉS');
  console.log('=' .repeat(30));
}

// Exécuter les tests
runTests().catch(console.error); 