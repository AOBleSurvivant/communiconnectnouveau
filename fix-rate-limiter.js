const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DU RATE LIMITER POUR LE DÉVELOPPEMENT');
console.log('=' .repeat(60));

const rateLimiterPath = path.join(__dirname, 'server/middleware/rateLimiter.js');

if (fs.existsSync(rateLimiterPath)) {
  let content = fs.readFileSync(rateLimiterPath, 'utf8');
  let modified = false;
  
  // Assouplir le rate limiter pour l'authentification en mode développement
  if (content.includes('max: 5, // 5 tentatives de connexion')) {
    console.log('🔧 Assouplissement du rate limiter d\'authentification...');
    content = content.replace(
      /max: 5, \/\/ 5 tentatives de connexion/g,
      'max: process.env.NODE_ENV === \'development\' ? 100 : 5, // 100 tentatives en dev, 5 en prod'
    );
    modified = true;
  }
  
  // Assouplir la fenêtre de temps en mode développement
  if (content.includes('windowMs: 15 * 60 * 1000, // 15 minutes')) {
    console.log('🔧 Réduction de la fenêtre de temps en développement...');
    content = content.replace(
      /windowMs: 15 \* 60 \* 1000, \/\/ 15 minutes/g,
      'windowMs: process.env.NODE_ENV === \'development\' ? 60 * 1000 : 15 * 60 * 1000, // 1 minute en dev, 15 minutes en prod'
    );
    modified = true;
  }
  
  // Ajouter un message plus clair pour le développement
  if (content.includes('Trop de tentatives de connexion, réessayez dans 15 minutes')) {
    console.log('🔧 Amélioration du message d\'erreur...');
    content = content.replace(
      /message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',/g,
      'message: process.env.NODE_ENV === \'development\' ? \'Rate limit atteint (mode développement)\' : \'Trop de tentatives de connexion, réessayez dans 15 minutes\','
    );
    modified = true;
  }
  
  // Assouplir le rate limiter API général
  if (content.includes('max: 100, // 100 requêtes par IP')) {
    console.log('🔧 Assouplissement du rate limiter API...');
    content = content.replace(
      /max: 100, \/\/ 100 requêtes par IP/g,
      'max: process.env.NODE_ENV === \'development\' ? 1000 : 100, // 1000 requêtes en dev, 100 en prod'
    );
    modified = true;
  }
  
  // Assouplir le strict limiter
  if (content.includes('max: 30, // 30 requêtes par minute')) {
    console.log('🔧 Assouplissement du strict limiter...');
    content = content.replace(
      /max: 30, \/\/ 30 requêtes par minute/g,
      'max: process.env.NODE_ENV === \'development\' ? 300 : 30, // 300 requêtes en dev, 30 en prod'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(rateLimiterPath, content);
    console.log('✅ Rate limiter corrigé pour le développement');
    console.log('\n🎯 Modifications apportées :');
    console.log('   • Authentification : 100 tentatives au lieu de 5 en dev');
    console.log('   • Fenêtre de temps : 1 minute au lieu de 15 minutes en dev');
    console.log('   • API générale : 1000 requêtes au lieu de 100 en dev');
    console.log('   • Strict limiter : 300 requêtes au lieu de 30 en dev');
    console.log('   • Messages d\'erreur adaptés au mode développement');
  } else {
    console.log('✅ Rate limiter déjà configuré pour le développement');
  }
} else {
  console.log('❌ Fichier rateLimiter.js non trouvé');
}

// Créer un script de test pour vérifier le rate limiter
const testRateLimiterScript = `
const axios = require('axios');

async function testRateLimiter() {
  console.log('🧪 TEST DU RATE LIMITER CORRIGÉ');
  console.log('=' .repeat(40));
  
  const testData = {
    email: \`test-rate-\${Date.now()}@communiconnect.gn\`,
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
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
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
    console.log('\\n🔐 Test de connexion...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: testData.email,
      password: testData.password
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('Status:', loginResponse.status);
    console.log('Token:', loginResponse.data.token ? 'Présent' : 'Absent');
    
    console.log('\\n🎉 RATE LIMITER CORRIGÉ ET FONCTIONNEL !');
    
  } catch (error) {
    console.log('❌ ERREUR:', error.response?.data?.message || error.message);
    console.log('Status:', error.response?.status);
  }
}

testRateLimiter();
`;

fs.writeFileSync('test-rate-limiter.js', testRateLimiterScript);
console.log('\n✅ Script de test créé: test-rate-limiter.js');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Redémarrez le serveur backend');
console.log('2. Exécutez: node test-rate-limiter.js');
console.log('3. Testez la création de compte sur l\'interface web'); 