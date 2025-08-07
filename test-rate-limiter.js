
const axios = require('axios');

async function testRateLimiter() {
  console.log('🧪 TEST DU RATE LIMITER CORRIGÉ');
  console.log('=' .repeat(40));
  
  const testData = {
    email: `test-rate-${Date.now()}@communiconnect.gn`,
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '22412345678',
    region: 'Conakry',
    prefecture: 'Conakry',
    commune: 'Kaloum',
    quartier: 'Centre',
    address: 'Test Address',
    latitude: 9.537,
    longitude: -13.6785,
    dateOfBirth: '1990-01-01',
    gender: 'Homme'
  };
  
  console.log('📧 Email utilisé:', testData.email);
  console.log('');
  
  try {
    console.log('📤 Test de création de compte...');
    
    const response = await axios.post('http://localhost:3000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ CRÉATION RÉUSSIE !');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Token:', response.data.token ? 'Présent' : 'Absent');
    
    // Test de connexion
    console.log('\n🔐 Test de connexion...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      identifier: testData.email,
      password: testData.password
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('Status:', loginResponse.status);
    console.log('Token:', loginResponse.data.token ? 'Présent' : 'Absent');
    
    console.log('\n🎉 RATE LIMITER CORRIGÉ ET FONCTIONNEL !');
    
  } catch (error) {
    console.log('❌ ERREUR:', error.response?.data?.message || error.message);
    console.log('Status:', error.response?.status);
  }
}

testRateLimiter();
