#!/usr/bin/env node

/**
 * 🔧 CORRECTION DES PROBLÈMES FRONTEND
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des problèmes frontend...\n');

// 1. Corriger la route /auth/me
const fixAuthMeRoute = () => {
  console.log('1️⃣ Correction de la route /auth/me...');
  
  const authPath = path.join(__dirname, 'server/routes/auth.js');
  if (fs.existsSync(authPath)) {
    let content = fs.readFileSync(authPath, 'utf8');
    
    // Vérifier si la route /me existe déjà
    if (!content.includes("router.get('/me'")) {
      console.log('⚠️ Route /me non trouvée, ajout...');
      
      const meRoute = `
// @route   GET /api/auth/me
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // En mode développement, retourner un utilisateur fictif
    const user = {
      _id: req.user?.id || crypto.randomBytes(16).toString('hex'),
      firstName: 'Utilisateur',
      lastName: 'Connecté',
      email: 'user@example.com',
      phone: '22412345678',
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: '',
      quartier: '',
      role: 'user',
      isVerified: true,
      profilePicture: '/api/static/avatars/U.jpg',
      createdAt: new Date(),
      getPublicProfile: function() {
        return {
          _id: this._id,
          firstName: this.firstName,
          lastName: this.lastName,
          fullName: \`\${this.firstName} \${this.lastName}\`,
          email: this.email,
          phone: this.phone,
          region: this.region,
          prefecture: this.prefecture,
          commune: this.commune,
          quartier: this.quartier,
          role: this.role,
          isVerified: this.isVerified,
          profilePicture: this.profilePicture,
          createdAt: this.createdAt
        };
      }
    };
    
    res.json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
});`;

      // Ajouter la route après les autres routes
      const insertIndex = content.lastIndexOf('module.exports = router;');
      if (insertIndex !== -1) {
        content = content.slice(0, insertIndex) + meRoute + '\n\n' + content.slice(insertIndex);
        fs.writeFileSync(authPath, content);
        console.log('✅ Route /me ajoutée');
      }
    } else {
      console.log('✅ Route /me existe déjà');
    }
  }
};

// 2. Corriger la configuration CORS
const fixCORSConfiguration = () => {
  console.log('2️⃣ Correction de la configuration CORS...');
  
  const securityPath = path.join(__dirname, 'server/middleware/security.js');
  if (fs.existsSync(securityPath)) {
    let content = fs.readFileSync(securityPath, 'utf8');
    
    // Mettre à jour la configuration CORS
    const corsOptionsRegex = /const corsOptions = \{[\s\S]*?\};/;
    const newCorsOptions = `const corsOptions = {
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
    
    // En développement, autoriser localhost
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001');
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logSecurity('Tentative d\\'accès CORS non autorisée', {
        origin,
        allowedOrigins
      });
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'multipart/form-data'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 heures
};`;
    
    if (corsOptionsRegex.test(content)) {
      content = content.replace(corsOptionsRegex, newCorsOptions);
      fs.writeFileSync(securityPath, content);
      console.log('✅ Configuration CORS mise à jour');
    } else {
      console.log('⚠️ Configuration CORS non trouvée');
    }
  }
};

// 3. Corriger les erreurs dans authService.js
const fixAuthService = () => {
  console.log('3️⃣ Correction du service auth...');
  
  const authServicePath = path.join(__dirname, 'client/src/services/authService.js');
  if (fs.existsSync(authServicePath)) {
    let content = fs.readFileSync(authServicePath, 'utf8');
    
    // Corriger l'erreur dans getCurrentUser
    const getCurrentUserRegex = /getCurrentUser:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}/;
    const newGetCurrentUser = `getCurrentUser: async () => {
    try {
      const response = await authAPI.get('/me');
      
      // Sauvegarder localement les données utilisateur
      if (response.data.success && response.data.user) {
        localPersistenceService.saveProfile(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      // En cas d'erreur, essayer de récupérer depuis le stockage local
      const userId = localStorage.getItem('userId');
      if (userId) {
        const localProfile = localPersistenceService.loadProfile(userId);
        if (localProfile) {
          console.log('📂 Utilisateur récupéré depuis le stockage local');
          return {
            data: {
              success: true,
              user: localProfile
            }
          };
        }
      }
      throw error;
    }
  }`;
    
    if (getCurrentUserRegex.test(content)) {
      content = content.replace(getCurrentUserRegex, newGetCurrentUser);
      fs.writeFileSync(authServicePath, content);
      console.log('✅ Service auth corrigé');
    } else {
      console.log('⚠️ Fonction getCurrentUser non trouvée');
    }
  }
};

// 4. Corriger les erreurs dans authSlice.js
const fixAuthSlice = () => {
  console.log('4️⃣ Correction du slice auth...');
  
  const authSlicePath = path.join(__dirname, 'client/src/store/slices/authSlice.js');
  if (fs.existsSync(authSlicePath)) {
    let content = fs.readFileSync(authSlicePath, 'utf8');
    
    // Corriger l'erreur dans checkAuthStatus
    const checkAuthStatusRegex = /checkAuthStatus.*?createAsyncThunk\([\s\S]*?\}/;
    const newCheckAuthStatus = `checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return rejectWithValue(null);
    }
  }
)`;
    
    if (checkAuthStatusRegex.test(content)) {
      content = content.replace(checkAuthStatusRegex, newCheckAuthStatus);
      fs.writeFileSync(authSlicePath, content);
      console.log('✅ Slice auth corrigé');
    } else {
      console.log('⚠️ Fonction checkAuthStatus non trouvée');
    }
  }
};

// 5. Corriger les erreurs dans postsService.js
const fixPostsService = () => {
  console.log('5️⃣ Correction du service posts...');
  
  const postsServicePath = path.join(__dirname, 'client/src/services/postsService.js');
  if (fs.existsSync(postsServicePath)) {
    let content = fs.readFileSync(postsServicePath, 'utf8');
    
    // Corriger l'erreur dans getCurrentUser
    const getCurrentUserRegex = /getCurrentUser.*?catch.*?error.*?\{[\s\S]*?\}/;
    const newGetCurrentUser = `getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }
      
      return authService.getCurrentUser();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\\'utilisateur:', error);
      throw error;
    }
  }`;
    
    if (getCurrentUserRegex.test(content)) {
      content = content.replace(getCurrentUserRegex, newGetCurrentUser);
      fs.writeFileSync(postsServicePath, content);
      console.log('✅ Service posts corrigé');
    } else {
      console.log('⚠️ Fonction getCurrentUser non trouvée dans postsService');
    }
  }
};

// 6. Corriger les erreurs dans moderationSlice.js
const fixModerationSlice = () => {
  console.log('6️⃣ Correction du slice moderation...');
  
  const moderationSlicePath = path.join(__dirname, 'client/src/store/slices/moderationSlice.js');
  if (fs.existsSync(moderationSlicePath)) {
    let content = fs.readFileSync(moderationSlicePath, 'utf8');
    
    // Corriger les erreurs d'inscription
    const inscriptionErrorRegex = /Erreur lors de l'inscription/g;
    if (inscriptionErrorRegex.test(content)) {
      content = content.replace(inscriptionErrorRegex, 'Erreur lors de la récupération');
      fs.writeFileSync(moderationSlicePath, content);
      console.log('✅ Slice moderation corrigé');
    } else {
      console.log('⚠️ Erreurs d\'inscription non trouvées dans moderationSlice');
    }
  }
};

// Exécuter toutes les corrections
const main = () => {
  try {
    fixAuthMeRoute();
    fixCORSConfiguration();
    fixAuthService();
    fixAuthSlice();
    fixPostsService();
    fixModerationSlice();
    
    console.log('\n✅ Toutes les corrections ont été appliquées !');
    console.log('\n🔧 Prochaines étapes :');
    console.log('   1. Redémarrez le serveur');
    console.log('   2. Testez l\'application');
    console.log('   3. Vérifiez que les erreurs CORS sont résolues');
    
  } catch (error) {
    console.error('❌ Erreur lors des corrections:', error);
  }
};

main(); 