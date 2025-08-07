const http = require('http');

console.log('Test simple CommuniConnect...\n');

// Test de l'API health
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'OK') {
            console.log('API Health : OK');
            console.log('Message :', response.message);
            console.log('Timestamp :', response.timestamp);
            resolve(true);
          } else {
            console.log('API Health : Erreur');
            reject(new Error('API non fonctionnelle'));
          }
        } catch (e) {
          console.log('Reponse API invalide');
          reject(e);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('Erreur de connexion a l\'API');
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

// Test principal
const main = async () => {
  try {
    console.log('Demarrage des tests...\n');
    
    // Test API Health
    await testHealth();
    
    console.log('\n' + '='.repeat(50));
    console.log('TOUS LES TESTS SONT PASSES !');
    console.log('='.repeat(50));
    
    console.log('\nCommuniConnect fonctionne parfaitement !');
    console.log('\nLiens utiles :');
    console.log('API Health : http://localhost:5000/api/health');
    console.log('Documentation : http://localhost:5000/api-docs');
    console.log('Interface : http://localhost:3000');
    
  } catch (error) {
    console.log('\nERREUR :', error.message);
    console.log('\nSolutions possibles :');
    console.log('1. Verifiez que le serveur est demarre');
    console.log('2. Verifiez que le port 5000 est libre');
    console.log('3. Redemarrez le serveur : cd server && npm start');
  }
};

// Demarrer les tests
main(); 