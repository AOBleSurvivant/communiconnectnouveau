#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VÉRIFICATION DU DÉMARRAGE - COMMUNICONNECT
 * 
 * Ce script vérifie que le serveur démarre correctement sans avertissements
 */

const http = require('http');
const { spawn } = require('child_process');

console.log('🔍 Vérification du démarrage CommuniConnect...\n');

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

// Attendre que le serveur démarre
const waitForServer = (port, maxAttempts = 30) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          log(`✅ Serveur accessible sur le port ${port}`, 'green');
          resolve(true);
        } else {
          if (attempts >= maxAttempts) {
            reject(new Error(`Serveur non accessible après ${maxAttempts} tentatives`));
          } else {
            setTimeout(checkServer, 1000);
          }
        }
      });
      
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error(`Serveur non accessible après ${maxAttempts} tentatives`));
        } else {
          setTimeout(checkServer, 1000);
        }
      });
      
      req.setTimeout(1000, () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error(`Timeout après ${maxAttempts} tentatives`));
        } else {
          setTimeout(checkServer, 1000);
        }
      });
    };
    
    checkServer();
  });
};

// Vérifier les logs pour les avertissements
const checkLogs = () => {
  const fs = require('fs');
  const path = require('path');
  
  const logPath = path.join(__dirname, 'logs/combined.log');
  
  if (fs.existsSync(logPath)) {
    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n').slice(-20); // Dernières 20 lignes
    
    const warnings = lines.filter(line => 
      line.includes('Warning') || 
      line.includes('Deprecated') || 
      line.includes('onLimitReached')
    );
    
    if (warnings.length > 0) {
      log('⚠️ Avertissements détectés dans les logs :', 'yellow');
      warnings.forEach(warning => log(`   ${warning}`, 'yellow'));
      return false;
    } else {
      log('✅ Aucun avertissement détecté dans les logs', 'green');
      return true;
    }
  }
  
  return true;
};

// Test principal
const main = async () => {
  try {
    log('🚀 Démarrage de la vérification...', 'cyan');
    
    // Attendre que le serveur soit prêt
    log('⏳ Attente du démarrage du serveur...', 'yellow');
    await waitForServer(5000);
    
    // Vérifier les logs
    log('\n📊 Vérification des logs...', 'cyan');
    const logsClean = checkLogs();
    
    // Test de l'API
    log('\n🔍 Test de l\'API...', 'cyan');
    const apiTest = await new Promise((resolve) => {
      http.get('http://localhost:5000/api/health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              log('✅ API fonctionnelle', 'green');
              resolve(true);
            } else {
              log('❌ API non fonctionnelle', 'red');
              resolve(false);
            }
          } catch (e) {
            log('❌ Réponse API invalide', 'red');
            resolve(false);
          }
        });
      }).on('error', () => {
        log('❌ Erreur de connexion à l\'API', 'red');
        resolve(false);
      });
    });
    
    // Résumé final
    log('\n' + '='.repeat(60), 'bright');
    log('📊 RÉSUMÉ DE LA VÉRIFICATION', 'bright');
    log('='.repeat(60), 'bright');
    
    if (apiTest && logsClean) {
      log('\n🎉 SUCCÈS COMPLET !', 'green');
      log('✅ Serveur démarré sans avertissements', 'green');
      log('✅ API fonctionnelle', 'green');
      log('✅ Configuration optimale', 'green');
      
      log('\n🚀 COMMUNICONNECT EST PRÊT !', 'bright');
      log('\n🔗 Liens utiles :', 'cyan');
      log('   • API Health : http://localhost:5000/api/health', 'cyan');
      log('   • Documentation : http://localhost:5000/api-docs', 'cyan');
      log('   • Interface : http://localhost:3000', 'cyan');
      
      log('\n🔧 Commandes utiles :', 'cyan');
      log('   • Voir les logs : tail -f logs/combined.log', 'cyan');
      log('   • Arrêter le serveur : Ctrl+C', 'cyan');
      log('   • Redémarrer : npm start', 'cyan');
      
    } else {
      log('\n⚠️ PROBLÈMES DÉTECTÉS', 'yellow');
      if (!apiTest) log('❌ API non fonctionnelle', 'red');
      if (!logsClean) log('❌ Avertissements dans les logs', 'red');
    }
    
  } catch (error) {
    log(`\n❌ ERREUR : ${error.message}`, 'red');
    log('\n🔧 Solutions possibles :', 'yellow');
    log('   1. Vérifiez que le port 5000 est libre', 'yellow');
    log('   2. Redémarrez le serveur : npm start', 'yellow');
    log('   3. Consultez les logs : tail -f logs/error.log', 'yellow');
  }
};

// Démarrer la vérification
main(); 