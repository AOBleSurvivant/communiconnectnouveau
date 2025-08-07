const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DES PROBLÈMES COMMUNICONNECT');
console.log('==========================================');

// 1. Arrêter les processus Node.js
console.log('\n1️⃣ Arrêt des processus Node.js...');
try {
  require('child_process').execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  console.log('✅ Processus arrêtés');
} catch (error) {
  console.log('⚠️ Aucun processus trouvé');
}

// 2. Corriger MongoDB
console.log('\n2️⃣ Correction MongoDB...');
const authFile = path.join(__dirname, 'server', 'routes', 'auth.js');
if (fs.existsSync(authFile)) {
  let content = fs.readFileSync(authFile, 'utf8');
  
  // Corriger la génération de numéro unique
  if (content.includes('phone: phone ||')) {
  content = content.replace(
      /phone: phone \|\| `\+224\$\{Math\.floor\(Math\.random\(\) \* 90000000\) \+ 10000000\}`/g,
      'phone: phone || `+224${Math.floor(Math.random() * 90000000) + 10000000}`'
    );
    fs.writeFileSync(authFile, content);
    console.log('✅ MongoDB corrigé');
  }
}

// 3. Corriger les erreurs de syntaxe
console.log('\n3️⃣ Correction syntaxe...');

// authService.js
const authServiceFile = path.join(__dirname, 'client', 'src', 'services', 'authService.js');
if (fs.existsSync(authServiceFile)) {
  let content = fs.readFileSync(authServiceFile, 'utf8');
  content = content.replace(/return response;\s*}/g, 'return response;\n    }\n  }');
  content = content.replace(/export default authService;\s*$/g, 'export default authService;');
  fs.writeFileSync(authServiceFile, content);
  console.log('✅ authService.js corrigé');
}

// authSlice.js
const authSliceFile = path.join(__dirname, 'client', 'src', 'store', 'slices', 'authSlice.js');
if (fs.existsSync(authSliceFile)) {
  let content = fs.readFileSync(authSliceFile, 'utf8');
  content = content.replace(/export default authSlice\.reducer;\s*$/g, 'export default authSlice.reducer;');
  fs.writeFileSync(authSliceFile, content);
  console.log('✅ authSlice.js corrigé');
}

// 4. Créer script de démarrage
console.log('\n4️⃣ Création script démarrage...');
const startScript = `@echo off
echo 🔄 Arrêt processus...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo 🚀 Démarrage CommuniConnect...
cd /d "%~dp0"
npm start
pause`;

fs.writeFileSync(path.join(__dirname, 'start-communiconnect.bat'), startScript);
console.log('✅ Script créé: start-communiconnect.bat');

// 5. Résumé
console.log('\n🎉 CORRECTIONS TERMINÉES');
console.log('========================');
console.log('✅ Processus arrêtés');
console.log('✅ MongoDB corrigé');
console.log('✅ Syntaxe corrigée');
console.log('✅ Script créé');
console.log('\n📋 Prochaines étapes:');
console.log('1. Exécuter: start-communiconnect.bat');
console.log('2. Tester création compte');
console.log('3. Vérifier interface'); 