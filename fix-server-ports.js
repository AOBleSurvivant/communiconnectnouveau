const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURATION DES PORTS SERVEUR (3000/5000)');
console.log('=' .repeat(50));

// 1. Corriger le serveur backend (port 5000)
const fixBackendPort = () => {
  const serverIndexPath = path.join(__dirname, 'server/index.js');
  
  if (fs.existsSync(serverIndexPath)) {
    let content = fs.readFileSync(serverIndexPath, 'utf8');
    let modified = false;
    
    // Forcer le port 5000
    if (!content.includes('const PORT = process.env.PORT || 5000')) {
      console.log('🔧 Configuration du port backend sur 5000...');
      content = content.replace(
        /const PORT = process\.env\.PORT \|\| \d+/g,
        'const PORT = process.env.PORT || 5000'
      );
      modified = true;
    }
    
    // Ajouter un message clair pour le port
    if (!content.includes('Serveur démarré sur le port 5000')) {
      console.log('🔧 Ajout du message de démarrage...');
      content = content.replace(
        /console\.log\(`Serveur démarré sur le port \$\{PORT\}`\);/g,
        'console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(serverIndexPath, content);
      console.log('✅ Serveur backend configuré sur le port 5000');
    } else {
      console.log('✅ Serveur backend déjà configuré sur le port 5000');
    }
  }
};

// 2. Corriger le client frontend (port 3000)
const fixClientPort = () => {
  const packageJsonPath = path.join(__dirname, 'client/package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    let content = fs.readFileSync(packageJsonPath, 'utf8');
    let modified = false;
    
    // Ajouter le port 3000 dans les scripts
    if (!content.includes('"start": "set PORT=3000 && react-scripts start"')) {
      console.log('🔧 Configuration du port client sur 3000...');
      content = content.replace(
        /"start": "react-scripts start"/g,
        '"start": "set PORT=3000 && react-scripts start"'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(packageJsonPath, content);
      console.log('✅ Client frontend configuré sur le port 3000');
    } else {
      console.log('✅ Client frontend déjà configuré sur le port 3000');
    }
  }
};

// 3. Corriger les scripts de démarrage
const fixStartupScripts = () => {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    let content = fs.readFileSync(packageJsonPath, 'utf8');
    let modified = false;
    
    // Améliorer le script de démarrage
    if (!content.includes('"start": "concurrently \\"npm run server\\" \\"npm run client\\""')) {
      console.log('🔧 Amélioration du script de démarrage...');
      content = content.replace(
        /"start": "[^"]*"/g,
        '"start": "concurrently \\"npm run server\\" \\"npm run client\\""'
      );
      modified = true;
    }
    
    // Ajouter un script de démarrage séquentiel
    if (!content.includes('"start:sequential"')) {
      console.log('🔧 Ajout d\'un script de démarrage séquentiel...');
      const scriptsSection = content.indexOf('"scripts"');
      if (scriptsSection !== -1) {
        const beforeScripts = content.substring(0, scriptsSection);
        const afterScripts = content.substring(scriptsSection);
        
        content = beforeScripts + 
          '"scripts": {\n' +
          '    "start": "concurrently \\"npm run server\\" \\"npm run client\\"",\n' +
          '    "start:sequential": "npm run server & timeout 5 & npm run client",\n' +
          '    "server": "cd server && npm run dev",\n' +
          '    "client": "cd client && npm start",\n' +
          '    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",\n' +
          '    "build": "cd client && npm run build",\n' +
          '    "test": "cd client && npm test",\n' +
          '    "eject": "cd client && npm run eject"\n' +
          '  },\n' +
          afterScripts.substring(afterScripts.indexOf('"dependencies"'));
        
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(packageJsonPath, content);
      console.log('✅ Scripts de démarrage améliorés');
    } else {
      console.log('✅ Scripts de démarrage déjà configurés');
    }
  }
};

// 4. Créer un script de démarrage simple
const createSimpleStartScript = () => {
  const startScript = `@echo off
echo 🚀 DÉMARRAGE DE COMMUNICONNECT
echo ================================

echo 📡 Démarrage du serveur backend (port 5000)...
cd server
start /B npm run dev

echo ⏳ Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo 🌐 Démarrage du client frontend (port 3000)...
cd ../client
start /B npm start

echo ✅ Services démarrés !
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 Pour arrêter les services, fermez les fenêtres de terminal
pause
`;

  fs.writeFileSync('start-communiconnect.bat', startScript);
  console.log('✅ Script de démarrage créé: start-communiconnect.bat');
};

// 5. Corriger les URLs dans les scripts de test
const fixTestScripts = () => {
  const testScripts = [
    'test-final.js',
    'test-registration-fixed.js',
    'test-rate-limiter.js',
    'diagnose-registration-error.js'
  ];
  
  testScripts.forEach(scriptName => {
    const scriptPath = path.join(__dirname, scriptName);
    if (fs.existsSync(scriptPath)) {
      let content = fs.readFileSync(scriptPath, 'utf8');
      let modified = false;
      
      // S'assurer que les URLs utilisent les bons ports
      if (content.includes('http://localhost:5000') && content.includes('http://localhost:3000')) {
        console.log(`✅ ${scriptName} utilise déjà les bons ports`);
      } else {
        console.log(`🔧 Correction des URLs dans ${scriptName}...`);
        content = content.replace(
          /http:\/\/localhost:\d+/g,
          (match) => {
            if (match.includes('/api/')) {
              return 'http://localhost:5000';
            } else {
              return 'http://localhost:3000';
            }
          }
        );
        fs.writeFileSync(scriptPath, content);
        modified = true;
      }
      
      if (modified) {
        console.log(`✅ ${scriptName} corrigé`);
      }
    }
  });
};

// Exécuter toutes les corrections
console.log('\n🔧 Application des corrections...\n');

fixBackendPort();
fixClientPort();
fixStartupScripts();
createSimpleStartScript();
fixTestScripts();

console.log('\n✅ CONFIGURATION TERMINÉE !');
console.log('\n🎯 Ports configurés :');
console.log('   • Backend (API) : Port 5000');
console.log('   • Frontend (Web) : Port 3000');

console.log('\n🚀 MÉTHODES DE DÉMARRAGE :');
console.log('1. Méthode simple : Double-cliquez sur start-communiconnect.bat');
console.log('2. Méthode manuelle : npm run server (puis npm run client)');
console.log('3. Méthode concurrente : npm start');

console.log('\n💡 CONSEILS :');
console.log('   • Assurez-vous que les ports 3000 et 5000 sont libres');
console.log('   • Si un port est occupé, arrêtez le processus qui l\'utilise');
console.log('   • Utilisez Ctrl+C pour arrêter proprement les serveurs'); 