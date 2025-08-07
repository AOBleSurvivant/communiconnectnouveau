@echo off
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
