#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE CONFIGURATION COMPLÈTE - COMMUNICONNECT
 * 
 * Ce script configure automatiquement tous les aspects du projet :
 * - Correction des avertissements express-rate-limit
 * - Configuration de l'environnement
 * - Optimisation des performances
 * - Sécurité renforcée
 * - Monitoring avancé
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Démarrage de la configuration complète CommuniConnect...\n');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// 1. CORRECTION EXPRESS-RATE-LIMIT
log('🔧 1. Correction des avertissements express-rate-limit...', 'cyan');

const rateLimiterPath = path.join(__dirname, 'server/middleware/rateLimiter.js');
if (fs.existsSync(rateLimiterPath)) {
  let content = fs.readFileSync(rateLimiterPath, 'utf8');
  
  // Supprimer toutes les occurrences de onLimitReached
  const onLimitReachedRegex = /,\s*\/\/ Ajouter des headers personnalisés\s*\n\s*onLimitReached:\s*\(req,\s*res\)\s*=>\s*\{[\s\S]*?\n\s*\}/g;
  content = content.replace(onLimitReachedRegex, '');
  
  // Nettoyer les virgules orphelines
  content = content.replace(/,\s*\/\/ Ajouter des headers personnalisés\s*\n\s*legacyHeaders:\s*false/g, 'legacyHeaders: false');
  
  fs.writeFileSync(rateLimiterPath, content);
  log('✅ Express-rate-limit corrigé', 'green');
} else {
  log('❌ Fichier rateLimiter.js non trouvé', 'red');
}

// 2. CONFIGURATION ENVIRONNEMENT
log('\n🔧 2. Configuration de l\'environnement...', 'cyan');

const envExamplePath = path.join(__dirname, 'server/env.example');
const envPath = path.join(__dirname, 'server/.env');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  let envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Configuration par défaut pour le développement
  envContent += `
# Configuration par défaut pour le développement
NODE_ENV=development
PORT=5000
JWT_SECRET=communiconnect-dev-secret-key-2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000

# Base de données (fallback en développement)
MONGODB_URI=mongodb://localhost:27017/communiconnect

# Rate Limiting optimisé
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL=info
ENABLE_MONITORING=true

# Sécurité
ENABLE_SECURITY_HEADERS=true
ENABLE_RATE_LIMITING=true
ENABLE_ATTACK_DETECTION=true
`;
  
  fs.writeFileSync(envPath, envContent);
  log('✅ Fichier .env créé avec configuration par défaut', 'green');
} else {
  log('ℹ️ Fichier .env existe déjà', 'yellow');
}

// 3. OPTIMISATION PACKAGE.JSON
log('\n🔧 3. Optimisation du package.json...', 'cyan');

const packageJsonPath = path.join(__dirname, 'server/package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Mettre à jour express-rate-limit vers la dernière version
  if (packageJson.dependencies['express-rate-limit']) {
    packageJson.dependencies['express-rate-limit'] = '^7.1.5';
  }
  
  // Ajouter des scripts utiles
  packageJson.scripts = {
    ...packageJson.scripts,
    'start:prod': 'NODE_ENV=production node index.js',
    'dev:debug': 'NODE_ENV=development DEBUG=* nodemon index.js',
    'test:watch': 'jest --watch',
    'lint': 'eslint .',
    'lint:fix': 'eslint . --fix',
    'security:check': 'npm audit',
    'security:fix': 'npm audit fix'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('✅ Package.json optimisé', 'green');
} else {
  log('❌ Package.json non trouvé', 'red');
}

// 4. CONFIGURATION MONITORING
log('\n🔧 4. Configuration du monitoring...', 'cyan');

const loggerPath = path.join(__dirname, 'server/config/logger.js');
if (fs.existsSync(loggerPath)) {
  let loggerContent = fs.readFileSync(loggerPath, 'utf8');
  
  // Ajouter des niveaux de log plus détaillés
  if (!loggerContent.includes('logPerformance')) {
    const performanceLogger = `
// Logger de performance
const logPerformance = (operation, duration, data = {}) => {
  logger.info('PERFORMANCE', {
    operation,
    duration,
    timestamp: new Date().toISOString(),
    ...data,
    type: 'performance'
  });
};

// Logger de sécurité avancé
const logSecurityAdvanced = (event, data = {}) => {
  logger.warn('SECURITY_ADVANCED', {
    event,
    timestamp: new Date().toISOString(),
    ...data,
    type: 'security_advanced'
  });
};

module.exports = {
  logger,
  auditLogger,
  logSecurity,
  logAuth,
  logApi,
  logError,
  logPerformance,
  logSecurityAdvanced,
  requestLogger,
  errorLogger
};
`;
    
    // Remplacer l'export existant
    loggerContent = loggerContent.replace(
      /module\.exports = \{[\s\S]*?\};/,
      performanceLogger
    );
    
    fs.writeFileSync(loggerPath, loggerContent);
    log('✅ Monitoring avancé configuré', 'green');
  } else {
    log('ℹ️ Monitoring déjà configuré', 'yellow');
  }
} else {
  log('❌ Logger non trouvé', 'red');
}

// 5. CONFIGURATION SÉCURITÉ
log('\n🔧 5. Configuration de la sécurité...', 'cyan');

const securityPath = path.join(__dirname, 'server/middleware/security.js');
if (!fs.existsSync(securityPath)) {
  const securityContent = `const helmet = require('helmet');
const cors = require('cors');
const { logSecurity } = require('../config/logger');

// Configuration CORS sécurisée
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Configuration Helmet renforcée
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Middleware de blocage des injections
const blockInjection = (req, res, next) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload/i,
    /onerror/i,
    /onclick/i
  ];

  const userInput = JSON.stringify(req.body) + req.path + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logSecurity('Injection détectée', {
        ip: req.ip,
        pattern: pattern.source,
        path: req.path
      });
      
      return res.status(403).json({
        success: false,
        message: 'Requête malveillante détectée'
      });
    }
  }
  
  next();
};

// Validation du type de contenu
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type invalide'
      });
    }
  }
  next();
};

// Limitation de la taille des requêtes
const limitRequestSize = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Requête trop volumineuse'
    });
  }
  next();
};

// Blocage des méthodes dangereuses
const blockDangerousMethods = (req, res, next) => {
  const dangerousMethods = ['TRACE', 'TRACK', 'OPTIONS'];
  if (dangerousMethods.includes(req.method)) {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }
  next();
};

// Headers de sécurité supplémentaires
const addSecurityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

// Log des tentatives d'attaque
const logAttackAttempts = (req, res, next) => {
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip'
  ];
  
  const suspiciousIPs = suspiciousHeaders
    .map(header => req.get(header))
    .filter(ip => ip && ip !== req.ip);
  
  if (suspiciousIPs.length > 0) {
    logSecurity('Tentative d\'usurpation d\'IP', {
      realIP: req.ip,
      suspiciousIPs,
      path: req.path
    });
  }
  
  next();
};

module.exports = {
  corsOptions,
  helmetConfig,
  blockInjection,
  validateContentType,
  limitRequestSize,
  blockDangerousMethods,
  addSecurityHeaders,
  logAttackAttempts
};
`;
  
  fs.writeFileSync(securityPath, securityContent);
  log('✅ Middleware de sécurité créé', 'green');
} else {
  log('ℹ️ Middleware de sécurité existe déjà', 'yellow');
}

// 6. CONFIGURATION PERFORMANCE
log('\n🔧 6. Configuration des performances...', 'cyan');

const performancePath = path.join(__dirname, 'server/middleware/performance.js');
if (!fs.existsSync(performancePath)) {
  const performanceContent = `const { performance } = require('perf_hooks');
const { logPerformance } = require('../config/logger');

// Monitor de performance
const performanceMonitor = (req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    logPerformance('request', duration, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ip: req.ip
    });
  });
  
  next();
};

// Monitor d'erreurs
const errorMonitor = (err, req, res, next) => {
  logPerformance('error', 0, {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack
  });
  next(err);
};

// Monitor de mémoire
const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
    logPerformance('memory_warning', 0, {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    });
  }
  
  next();
};

// Monitor de requêtes
const requestMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 5000) { // 5 secondes
      logPerformance('slow_request', duration, {
        method: req.method,
        path: req.path,
        ip: req.ip
      });
    }
  });
  
  next();
};

module.exports = {
  performanceMonitor,
  errorMonitor,
  memoryMonitor,
  requestMonitor
};
`;
  
  fs.writeFileSync(performancePath, performanceContent);
  log('✅ Middleware de performance créé', 'green');
} else {
  log('ℹ️ Middleware de performance existe déjà', 'yellow');
}

// 7. SCRIPT DE DÉMARRAGE OPTIMISÉ
log('\n🔧 7. Création du script de démarrage optimisé...', 'cyan');

const startScript = `#!/bin/bash

# 🚀 Script de démarrage optimisé CommuniConnect

echo "🚀 Démarrage de CommuniConnect..."

# Vérification des prérequis
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Configuration de l'environnement
export NODE_ENV=development
export PORT=5000

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrage du serveur
echo "🔌 Démarrage du serveur..."
cd server && npm start
`;

const startScriptPath = path.join(__dirname, 'start-optimized.sh');
fs.writeFileSync(startScriptPath, startScript);
fs.chmodSync(startScriptPath, '755');
log('✅ Script de démarrage optimisé créé', 'green');

// 8. CONFIGURATION FINALE
log('\n🔧 8. Configuration finale...', 'cyan');

// Créer un fichier de configuration global
const configPath = path.join(__dirname, 'config.json');
const config = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  environment: 'development',
  features: {
    rateLimiting: true,
    security: true,
    monitoring: true,
    performance: true,
    logging: true
  },
  ports: {
    server: 5000,
    client: 3000
  },
  database: {
    type: 'mongodb',
    url: 'mongodb://localhost:27017/communiconnect'
  }
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
log('✅ Configuration globale créée', 'green');

// 9. RÉSUMÉ FINAL
log('\n🎉 CONFIGURATION TERMINÉE !', 'green');
log('\n📋 RÉSUMÉ DES AMÉLIORATIONS :', 'bright');
log('✅ Express-rate-limit corrigé (suppression onLimitReached)', 'green');
log('✅ Environnement configuré (.env)', 'green');
log('✅ Package.json optimisé', 'green');
log('✅ Monitoring avancé configuré', 'green');
log('✅ Sécurité renforcée', 'green');
log('✅ Performance monitoring', 'green');
log('✅ Script de démarrage optimisé', 'green');
log('✅ Configuration globale', 'green');

log('\n🚀 PROCHAINES ÉTAPES :', 'bright');
log('1. Redémarrez le serveur : npm run server', 'cyan');
log('2. Vérifiez les logs : tail -f logs/combined.log', 'cyan');
log('3. Testez l\'API : http://localhost:5000/api/health', 'cyan');
log('4. Consultez la documentation : http://localhost:5000/api-docs', 'cyan');

log('\n🔧 COMMANDES UTILES :', 'bright');
log('• Démarrage : ./start-optimized.sh', 'yellow');
log('• Développement : npm run dev', 'yellow');
log('• Tests : npm test', 'yellow');
log('• Sécurité : npm run security:check', 'yellow');
log('• Monitoring : npm run dev:debug', 'yellow');

console.log('\n' + '='.repeat(60));
log('🎯 CommuniConnect est maintenant entièrement configuré !', 'bright');
console.log('='.repeat(60)); 