const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validateGuineanLocation } = require('../middleware/geographicValidation');
// Import conditionnel du modèle User
let User;
try {
  User = require('../models/User');
} catch (error) {
  console.log('⚠️ Modèle User non disponible en mode développement');
  User = null;
}
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

const router = express.Router();

// GET /api/auth - Route de base pour vérifier l'état du service
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Service d\'authentification opérationnel',
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      profile: '/api/auth/profile',
      logout: '/api/auth/logout'
    }
  });
});

// GET /api/auth/status - Route pour vérifier le statut du service d'authentification
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Service d\'authentification opérationnel',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      profile: '/api/auth/profile',
      logout: '/api/auth/logout'
    }
  });
});

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Inscription d'un nouvel utilisateur
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName').notEmpty().trim().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().trim().withMessage('Le nom de famille est requis'),
  body('phone').optional().matches(/^(\+224|224)?[0-9]{8,10}$/).withMessage('Numéro de téléphone guinéen invalide'),
  body('region').notEmpty().trim().withMessage('La région est requise'),
  body('prefecture').notEmpty().trim().withMessage('La préfecture est requise'),
  body('commune').notEmpty().trim().withMessage('La commune est requise'),
  body('quartier').notEmpty().trim().withMessage('Le quartier est requis'),
  body('address').notEmpty().trim().withMessage("L'adresse est requise"),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date de naissance invalide'),
  body('gender').optional().isIn(['Homme', 'Femme', 'Autre']).withMessage('Genre invalide')
], async (req, res) => {
  try {
    console.log('Données reçues:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erreurs de validation:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      region, 
      prefecture, 
      commune, 
      quartier, 
      address, 
      latitude, 
      longitude, 
      dateOfBirth, 
      gender 
    } = req.body;

    // Mode développement : créer un utilisateur fictif avec numéro de téléphone unique
    const uniquePhone = phone || `+224${Math.floor(Math.random() * 90000000) + 10000000}`;
    const mockUser = {
      _id: crypto.randomBytes(16).toString('hex'),
      email,
      firstName,
      lastName,
      phone: uniquePhone,
      region,
      prefecture,
      commune,
      quartier,
      address,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1990-01-01'),
      gender: gender || 'Homme',
      role: 'user',
      isVerified: true,
      isActive: true,
      createdAt: new Date()
    };

    // Générer le token JWT
    const token = generateToken(mockUser._id);

    console.log('✅ Utilisateur créé en mode développement:', mockUser.email);

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie (mode développement)',
      token,
      user: {
        _id: mockUser._id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', [
  body('identifier')
    .notEmpty()
    .withMessage('Email ou numéro de téléphone requis'),
  
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // En mode développement, accepter n'importe quel identifiant/mot de passe
    const user = {
      _id: crypto.randomBytes(16).toString('hex'),
      firstName: 'Utilisateur',
      lastName: 'Test',
      email: identifier.includes('@') ? identifier : 'test@example.com',
      phone: identifier.includes('@') ? '22412345678' : identifier,
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: '',
      quartier: '',
      role: 'user',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      getPublicProfile: function() {
        return {
          _id: this._id,
          firstName: this.firstName,
          lastName: this.lastName,
          fullName: `${this.firstName} ${this.lastName}`,
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

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie (mode développement)',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

// @route   PUT /api/auth/profile/picture
// @desc    Mettre à jour la photo de profil
// @access  Private
router.put('/profile/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier image fourni'
      });
    }

    // En mode développement, simuler l'upload avec le fichier reçu
    const imageUrl = `/api/static/avatars/${req.file.filename}`;
    
    console.log('📸 Upload de photo de profil:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: imageUrl
    });
    
    res.json({
      success: true,
      message: 'Photo de profil mise à jour avec succès',
      profilePicture: imageUrl
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la photo de profil'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Récupérer les informations de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    console.log('🔍 Route /me appelée avec user:', req.user);
    
    // En mode développement, retourner un utilisateur fictif
    if (process.env.NODE_ENV === 'development' || !global.mongoConnected || !User) {
      const mockUser = {
        _id: req.user?._id || req.user?.id || 'test-user-id',
        email: req.user?.email || 'test@example.com',
        firstName: req.user?.firstName || 'Utilisateur',
        lastName: req.user?.lastName || 'Test',
        role: req.user?.role || 'user',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        location: req.user?.location || {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: '',
          quartier: '',
          coordinates: {
            latitude: 9.5370,
            longitude: -13.6785
          }
        }
      };
      
      console.log('✅ Utilisateur fictif retourné:', mockUser);
      return res.json({
        success: true,
        user: mockUser
      });
    }

    // Mode production avec MongoDB
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Demande de réinitialisation de mot de passe
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // En mode développement, on retourne un message de succès
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/fake-token`;

    res.json({
      success: true,
      message: 'Email de réinitialisation envoyé (mode développement)',
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation',
      error: error.message
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Réinitialiser le mot de passe
// @access  Public
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { password } = req.body;
    const resetToken = req.params.token;

    // En mode développement, on retourne un message de succès
    const token = generateToken(crypto.randomBytes(16).toString('hex'));

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès (mode développement)',
      token
    });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Déconnexion de l'utilisateur
// @access  Private
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
});

// POST /api/auth/oauth/callback - Callback OAuth pour Google
router.post('/oauth/callback', async (req, res) => {
  try {
    const { code, state, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code d\'autorisation requis'
      });
    }

    // En mode développement, simuler une authentification OAuth Google réussie
    if (process.env.NODE_ENV === 'development') {
      const mockUser = {
        _id: 'google-oauth-user-id',
        firstName: 'Utilisateur',
        lastName: 'Google',
        email: 'google@example.com',
        phone: '22412345678',
        role: 'user',
        isVerified: true,
        isActive: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre',
          coordinates: {
            latitude: 9.537,
            longitude: -13.6785
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const token = jwt.sign(
        { userId: mockUser._id, email: mockUser.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Connexion Google OAuth réussie',
        user: mockUser,
        token
      });
    }

    // En production, échanger le code contre un token Google
    // TODO: Implémenter l'échange de code avec Google
    res.status(501).json({
      success: false,
      message: 'Authentification Google OAuth non implémentée en production'
    });

  } catch (error) {
    console.error('Erreur Google OAuth callback:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification Google OAuth'
    });
  }
});

module.exports = router; 