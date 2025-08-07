@echo off
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
