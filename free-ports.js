const { exec } = require('child_process');
const fs = require('fs');

console.log('🔧 LIBÉRATION DES PORTS 3000 ET 5000');
console.log('=' .repeat(40));

// Fonction pour exécuter une commande
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Fonction pour libérer un port
const freePort = async (port) => {
  try {
    console.log(`🔍 Vérification du port ${port}...`);
    
    // Trouver les processus qui utilisent le port
    const findProcess = await runCommand(`netstat -ano | findstr :${port}`);
    
    if (findProcess.trim()) {
      console.log(`⚠️  Port ${port} occupé. Tentative de libération...`);
      
      // Extraire les PIDs
      const lines = findProcess.split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const match = line.match(/\s+(\d+)$/);
        if (match) {
          pids.add(match[1]);
        }
      });
      
      // Tuer les processus
      for (const pid of pids) {
        try {
          console.log(`🔄 Arrêt du processus ${pid}...`);
          await runCommand(`taskkill /PID ${pid} /F`);
          console.log(`✅ Processus ${pid} arrêté`);
        } catch (error) {
          console.log(`⚠️  Impossible d'arrêter le processus ${pid}: ${error.message}`);
        }
      }
      
      // Vérifier si le port est libre
      setTimeout(async () => {
        try {
          const checkPort = await runCommand(`netstat -ano | findstr :${port}`);
          if (!checkPort.trim()) {
            console.log(`✅ Port ${port} libéré avec succès`);
          } else {
            console.log(`❌ Port ${port} toujours occupé`);
          }
        } catch (error) {
          console.log(`✅ Port ${port} libéré`);
        }
      }, 2000);
      
    } else {
      console.log(`✅ Port ${port} déjà libre`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur lors de la vérification du port ${port}: ${error.message}`);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Libération des ports...\n');
  
  await freePort(3000);
  console.log('');
  await freePort(5000);
  
  console.log('\n✅ VÉRIFICATION TERMINÉE !');
  console.log('\n💡 CONSEILS :');
  console.log('   • Si les ports sont toujours occupés, redémarrez votre ordinateur');
  console.log('   • Ou utilisez le Gestionnaire des tâches pour arrêter les processus');
  console.log('   • Assurez-vous qu\'aucune autre application n\'utilise ces ports');
  
  console.log('\n🚀 PROCHAINES ÉTAPES :');
  console.log('1. Double-cliquez sur start-communiconnect.bat');
  console.log('2. Ou utilisez: npm start');
  console.log('3. Ou démarrez manuellement: npm run server puis npm run client');
};

// Créer un script batch pour libérer les ports
const createFreePortsScript = () => {
  const batchScript = `@echo off
echo 🔧 LIBÉRATION DES PORTS 3000 ET 5000
echo ======================================

echo 🔍 Vérification du port 3000...
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 occupé. Libération...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo 🔄 Arrêt du processus %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
    echo ✅ Port 3000 libéré
) else (
    echo ✅ Port 3000 libre
)

echo.
echo 🔍 Vérification du port 5000...
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 occupé. Libération...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        echo 🔄 Arrêt du processus %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
    echo ✅ Port 5000 libéré
) else (
    echo ✅ Port 5000 libre
)

echo.
echo ✅ LIBÉRATION TERMINÉE !
echo.
echo 🚀 Vous pouvez maintenant démarrer CommuniConnect
pause
`;

  fs.writeFileSync('free-ports.bat', batchScript);
  console.log('\n✅ Script de libération créé: free-ports.bat');
};

// Exécuter
createFreePortsScript();
main().catch(console.error); 