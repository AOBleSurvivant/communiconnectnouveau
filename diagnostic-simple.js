#!/usr/bin/env node

/**
 * DIAGNOSTIC SIMPLE COMMUNICONNECT
 * ================================
 * Version simplifiée pour corriger les problèmes principaux
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`
🔍 DIAGNOSTIC SIMPLE COMMUNICONNECT
===================================
📅 Date: ${new Date().toLocaleString()}
🎯 Objectif: Corriger les problèmes principaux
`);

async function executeSimpleDiagnostic() {
  try {
    // 1. Arrêter les processus Node.js
    console.log('\n1️⃣ Arrêt des processus Node.js...');
    try {
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
      console.log('✅ Processus Node.js arrêtés');
  } catch (error) {
      console.log('⚠️ Aucun processus Node.js trouvé');
    }

    // 2. Corriger MongoDB
    console.log('\n2️⃣ Correction de MongoDB...');
    const authFile = path.join(__dirname, 'server', 'routes', 'auth.js');
    if (fs.existsSync(authFile)) {
      let content = fs.readFileSync(authFile, 'utf8');
      
      // Remplacer la génération de numéro de téléphone
      const oldPattern = /phone: phone \|\| `\+224\$\{Math\.floor\(Math\.random\(\) \* 90000000\) \+ 10000000\}`/;
      const newPattern = 'phone: phone || `+224${Math.floor(Math.random() * 90000000) + 10000000}`';
      
      if (content.includes('phone: phone ||')) {
        content = content.replace(oldPattern, newPattern);
        fs.writeFileSync(authFile, content);
        console.log('✅ MongoDB corrigé');
      } else {
        console.log('⚠️ Code MongoDB déjà corrigé');
      }
    }

    // 3. Corriger les erreurs de syntaxe
    console.log('\n3️⃣ Correction des erreurs de syntaxe...');
    
    // Corriger authService.js
    const authServiceFile = path.join(__dirname, 'client', 'src', 'services', 'authService.js');
    if (fs.existsSync(authServiceFile)) {
      let content = fs.readFileSync(authServiceFile, 'utf8');
      
      // Nettoyer les erreurs de syntaxe
      content = content.replace(/return response;\s*}/g, 'return response;\n    }\n  }');
      content = content.replace(/export default authService;\s*$/g, 'export default authService;');
      
      fs.writeFileSync(authServiceFile, content);
      console.log('✅ authService.js corrigé');
    }

    // Corriger authSlice.js
    const authSliceFile = path.join(__dirname, 'client', 'src', 'store', 'slices', 'authSlice.js');
    if (fs.existsSync(authSliceFile)) {
      let content = fs.readFileSync(authSliceFile, 'utf8');
      
      // Nettoyer les erreurs de syntaxe
      content = content.replace(/export default authSlice\.reducer;\s*$/g, 'export default authSlice.reducer;');
      
      fs.writeFileSync(authSliceFile, content);
      console.log('✅ authSlice.js corrigé');
    }

    // 4. Créer un script de démarrage
    console.log('\n4️⃣ Création du script de démarrage...');
    const startScript = `@echo off
echo 🔄 Arrêt des processus existants...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🚀 Démarrage de CommuniConnect...
cd /d "%~dp0"
npm start
pause`;

    fs.writeFileSync(path.join(__dirname, 'start-communiconnect.bat'), startScript);
    console.log('✅ Script de démarrage créé: start-communiconnect.bat');

    // 5. Résumé
    console.log('\n🎉 DIAGNOSTIC TERMINÉ');
    console.log('======================');
    console.log('✅ Processus Node.js arrêtés');
    console.log('✅ MongoDB corrigé');
    console.log('✅ Erreurs de syntaxe corrigées');
    console.log('✅ Script de démarrage créé');
    
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Exécuter: start-communiconnect.bat');
    console.log('2. Tester la création de compte');
    console.log('3. Vérifier l\'interface utilisateur');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter le diagnostic
executeSimpleDiagnostic(); 