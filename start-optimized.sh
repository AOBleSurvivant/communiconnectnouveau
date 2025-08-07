#!/bin/bash

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
