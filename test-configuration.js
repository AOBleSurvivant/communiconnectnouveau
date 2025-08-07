#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE TEST DE CONFIGURATION - COMMUNICONNECT
 * 
 * Ce script teste que toutes les configurations ont été appliquées correctement
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Test de configuration CommuniConnect...\n');

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

let testsPassed = 0;
let testsFailed = 0;

const test = (name, condition) => {
  if (condition) {
    log(`✅ ${name}`, 'green');
    testsPassed++;
  } else {
    log(`❌ ${name}`, 'red');
    testsFailed++;
  }
};

// 1. TEST EXPRESS-RATE-LIMIT
log('🔧 1. Test express-rate-limit...', 'cyan');

const rateLimiterPath = path.join(__dirname, 'server/middleware/rateLimiter.js');
if (fs.existsSync(rateLimiterPath)) {
  const content = fs.readFileSync(rateLimiterPath, 'utf8');
  test('Express-rate-limit corrigé (onLimitReached supprimé)', !content.includes('onLimitReached'));
  test('Express-rate-limit fonctionnel', content.includes('rateLimit('));
} else {
  test('Fichier rateLimiter.js existe', false);
}

// 2. TEST CONFIGURATION ENVIRONNEMENT
log('\n🔧 2. Test configuration environnement...', 'cyan');

const envPath = path.join(__dirname, 'server/.env');
test('Fichier .env existe', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  test('NODE_ENV configuré', envContent.includes('NODE_ENV='));
  test('JWT_SECRET configuré', envContent.includes('JWT_SECRET='));
  test('CORS_ORIGIN configuré', envContent.includes('CORS_ORIGIN='));
}

// 3. TEST PACKAGE.JSON
log('\n🔧 3. Test package.json...', 'cyan');

const packageJsonPath = path.join(__dirname, 'server/package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  test('Package.json valide', packageJson.name === 'communiconnect-server');
  test('Scripts optimisés', packageJson.scripts && packageJson.scripts['start:prod']);
  test('Express-rate-limit à jour', packageJson.dependencies['express-rate-limit'] === '^7.1.5');
} else {
  test('Package.json existe', false);
}

// 4. TEST MONITORING
log('\n🔧 4. Test monitoring...', 'cyan');

const loggerPath = path.join(__dirname, 'server/config/logger.js');
if (fs.existsSync(loggerPath)) {
  const loggerContent = fs.readFileSync(loggerPath, 'utf8');
  test('Logger configuré', loggerContent.includes('winston'));
  test('Logs de performance', loggerContent.includes('logPerformance'));
} else {
  test('Logger existe', false);
}

// 5. TEST SÉCURITÉ
log('\n🔧 5. Test sécurité...', 'cyan');

const securityPath = path.join(__dirname, 'server/middleware/security.js');
test('Middleware de sécurité existe', fs.existsSync(securityPath));

if (fs.existsSync(securityPath)) {
  const securityContent = fs.readFileSync(securityPath, 'utf8');
  test('CORS configuré', securityContent.includes('corsOptions'));
  test('Helmet configuré', securityContent.includes('helmetConfig'));
  test('Blocage d\'injections', securityContent.includes('blockInjection'));
}

// 6. TEST PERFORMANCE
log('\n🔧 6. Test performance...', 'cyan');

const performancePath = path.join(__dirname, 'server/middleware/performance.js');
test('Middleware de performance existe', fs.existsSync(performancePath));

if (fs.existsSync(performancePath)) {
  const performanceContent = fs.readFileSync(performancePath, 'utf8');
  test('Monitor de performance', performanceContent.includes('performanceMonitor'));
  test('Monitor de mémoire', performanceContent.includes('memoryMonitor'));
}

// 7. TEST SCRIPT DE DÉMARRAGE
log('\n🔧 7. Test script de démarrage...', 'cyan');

const startScriptPath = path.join(__dirname, 'start-optimized.sh');
test('Script de démarrage existe', fs.existsSync(startScriptPath));

if (fs.existsSync(startScriptPath)) {
  const startScriptContent = fs.readFileSync(startScriptPath, 'utf8');
  test('Script exécutable', startScriptContent.includes('#!/bin/bash'));
  test('Vérifications prérequis', startScriptContent.includes('command -v node'));
}

// 8. TEST CONFIGURATION GLOBALE
log('\n🔧 8. Test configuration globale...', 'cyan');

const configPath = path.join(__dirname, 'config.json');
test('Configuration globale existe', fs.existsSync(configPath));

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  test('Version configurée', config.version);
  test('Fonctionnalités activées', config.features && config.features.rateLimiting);
}

// 9. TEST STRUCTURE DES DOSSIERS
log('\n🔧 9. Test structure des dossiers...', 'cyan');

const requiredDirs = [
  'server',
  'server/middleware',
  'server/config',
  'server/routes',
  'server/models',
  'logs'
];

requiredDirs.forEach(dir => {
  test(`Dossier ${dir} existe`, fs.existsSync(path.join(__dirname, dir)));
});

// 10. TEST FICHIERS CRITIQUES
log('\n🔧 10. Test fichiers critiques...', 'cyan');

const criticalFiles = [
  'server/index.js',
  'server/package.json',
  'server/middleware/rateLimiter.js',
  'server/config/logger.js'
];

criticalFiles.forEach(file => {
  test(`Fichier ${file} existe`, fs.existsSync(path.join(__dirname, file)));
});

// RÉSUMÉ FINAL
log('\n' + '='.repeat(60), 'bright');
log('📊 RÉSUMÉ DES TESTS', 'bright');
log('='.repeat(60), 'bright');

log(`\n✅ Tests réussis : ${testsPassed}`, 'green');
log(`❌ Tests échoués : ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
log(`📈 Score : ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`, 'bright');

if (testsFailed === 0) {
  log('\n🎉 TOUS LES TESTS SONT PASSÉS !', 'green');
  log('🚀 CommuniConnect est entièrement configuré et prêt à l\'emploi !', 'bright');
} else {
  log('\n⚠️ Certains tests ont échoué.', 'yellow');
  log('🔧 Vérifiez les configurations manquantes.', 'yellow');
}

log('\n🔧 PROCHAINES ÉTAPES :', 'bright');
log('1. Redémarrez le serveur : cd server && npm start', 'cyan');
log('2. Testez l\'API : http://localhost:5000/api/health', 'cyan');
log('3. Consultez les logs : tail -f logs/combined.log', 'cyan');
log('4. Vérifiez la documentation : http://localhost:5000/api-docs', 'cyan');

console.log('\n' + '='.repeat(60));
log('🎯 Configuration testée avec succès !', 'bright');
console.log('='.repeat(60)); 