const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des problèmes CORS et d\'authentification...');

// 1. Corriger la configuration CORS dans server/middleware/security.js
const securityPath = path.join(__dirname, 'server', 'middleware', 'security.js');
if (fs.existsSync(securityPath)) {
  let securityContent = fs.readFileSync(securityPath, 'utf8');
  
  // Mettre à jour la configuration CORS
  const newCorsConfig = `// Configuration CORS sécurisée
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (applications mobiles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://communiconnect.com',
      'https://www.communiconnect.com'
    ];
    
    // En développement, autoriser localhost et toutes les origines locales
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      allowedOrigins.push(
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://127.0.0.1:3000', 
        'http://127.0.0.1:3001',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
      );
      
      // En développement, autoriser toutes les origines locales
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logSecurity('Tentative d\'accès CORS non autorisée', {
        origin,
        allowedOrigins
      });
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'multipart/form-data', 'Accept'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 heures
};`;

  // Remplacer la configuration CORS existante
  securityContent = securityContent.replace(
    /\/\/ Configuration CORS sécurisée[\s\S]*?maxAge: 86400 \/\/ 24 heures/g,
    newCorsConfig
  );
  
  fs.writeFileSync(securityPath, securityContent);
  console.log('✅ Configuration CORS mise à jour dans security.js');
}

// 2. Corriger la configuration CORS dans server/index.js
const indexPath = path.join(__dirname, 'server', 'index.js');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Mettre à jour la configuration CORS
  const newCorsUsage = `// CORS sécurisé
app.use(cors({
  origin: function (origin, callback) {
    // En développement, autoriser toutes les origines locales
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Utiliser la configuration CORS existante
    return corsOptions.origin(origin, callback);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'multipart/form-data', 'Accept'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400
}));`;

  // Remplacer la configuration CORS existante
  indexContent = indexContent.replace(
    /\/\/ CORS sécurisé[\s\S]*?app\.use\(cors\(corsOptions\)\);/g,
    newCorsUsage
  );
  
  // Ajouter une route de santé simple
  if (!indexContent.includes('app.get(\'/health\'')) {
    const healthRoute = `
// Route de santé simple
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CommuniConnect API fonctionne correctement',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});`;

    indexContent = indexContent.replace(
      /\/\/ Route pour servir les images statiques/g,
      `${healthRoute}

// Route pour servir les images statiques`
    );
  }
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Configuration CORS mise à jour dans index.js');
}

// 3. Corriger le service d'authentification côté client
const authServicePath = path.join(__dirname, 'client', 'src', 'services', 'authService.js');
if (fs.existsSync(authServicePath)) {
  let authServiceContent = fs.readFileSync(authServicePath, 'utf8');
  
  // Mettre à jour la configuration axios
  const newAxiosConfig = `// Configuration axios avec intercepteur pour le token
const authAPI = axios.create({
  baseURL: \`\${API_URL}/auth\`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour CORS
});`;

  authServiceContent = authServiceContent.replace(
    /\/\/ Configuration axios avec intercepteur pour le token[\s\S]*?headers: \{[\s\S]*?\},/g,
    newAxiosConfig
  );
  
  // Mettre à jour l'intercepteur de réponse
  const newResponseInterceptor = `// Intercepteur pour gérer les erreurs de réponse
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);`;

  authServiceContent = authServiceContent.replace(
    /\/\/ Intercepteur pour gérer les erreurs de réponse[\s\S]*?return Promise\.reject\(error\);/g,
    newResponseInterceptor
  );
  
  fs.writeFileSync(authServicePath, authServiceContent);
  console.log('✅ Service d\'authentification mis à jour');
}

// 4. Créer un fichier .env pour le serveur s'il n'existe pas
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  const envContent = `# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/communiconnect

# JWT Secret
JWT_SECRET=communiconnect-dev-secret-key-2024
JWT_EXPIRE=7d

# Configuration CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(serverEnvPath, envContent);
  console.log('✅ Fichier .env créé pour le serveur');
}

// 5. Créer un fichier .env.local pour le client s'il n'existe pas
const clientEnvPath = path.join(__dirname, 'client', '.env.local');
if (!fs.existsSync(clientEnvPath)) {
  const clientEnvContent = `# Configuration API
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
`;
  
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Fichier .env.local créé pour le client');
}

console.log('\n🎉 Corrections terminées!');
console.log('\n📋 Prochaines étapes:');
console.log('1. Redémarrez le serveur: cd server && npm start');
console.log('2. Redémarrez le client: cd client && npm start');
console.log('3. Testez l\'application dans votre navigateur');
console.log('\n🔍 Si les problèmes persistent, exécutez: node test-server-fix.js');
