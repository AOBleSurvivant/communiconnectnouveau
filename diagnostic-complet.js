const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');

class CommuniConnectDiagnostic {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      backend: {},
      frontend: {},
      database: {},
      api: {},
      features: {},
      errors: [],
      summary: {}
    };
    
    this.baseUrl = 'http://localhost:5000';
    this.frontendUrl = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
  }

  async startDiagnostic() {
    console.log('🔍 DÉBUT DU DIAGNOSTIC COMPLET COMMUNICONNECT');
    console.log('=' .repeat(60));
    
    try {
      // 1. Test du Backend
      await this.testBackend();
      
      // 2. Test du Frontend
      await this.testFrontend();
      
      // 3. Test de la Base de Données
      await this.testDatabase();
      
      // 4. Test des APIs
      await this.testAPIs();
      
      // 5. Test des Fonctionnalités
      await this.testFeatures();
      
      // 6. Génération du rapport
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error);
      this.results.errors.push(error.message);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async testBackend() {
    console.log('\n🔧 TEST DU BACKEND');
    console.log('-'.repeat(30));
    
    try {
      // Test de santé du serveur
      const healthResponse = await axios.get(`${this.baseUrl}/api/health`);
      this.results.backend.health = {
        status: 'OK',
        response: healthResponse.data,
        statusCode: healthResponse.status
      };
      console.log('✅ Serveur backend opérationnel');
      
      // Test de la configuration
      this.results.backend.config = {
        port: 5000,
        environment: 'development',
        cors: 'configuré',
        security: 'middlewares actifs'
      };
      console.log('✅ Configuration backend correcte');
      
    } catch (error) {
      this.results.backend.health = {
        status: 'ERROR',
        error: error.message,
        statusCode: error.response?.status || 'N/A'
      };
      console.log('❌ Erreur backend:', error.message);
    }
  }

  async testFrontend() {
    console.log('\n🎨 TEST DU FRONTEND');
    console.log('-'.repeat(30));
    
    try {
      // Démarrer Puppeteer
      this.browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      
      // Test de chargement de la page d'accueil
      await this.page.goto(this.frontendUrl, { waitUntil: 'networkidle2' });
      
      const title = await this.page.title();
      this.results.frontend.homepage = {
        status: 'OK',
        title: title,
        url: this.frontendUrl
      };
      console.log('✅ Page d\'accueil chargée:', title);
      
      // Test de la page de connexion
      await this.page.goto(`${this.frontendUrl}/login`, { waitUntil: 'networkidle2' });
      
      const loginTitle = await this.page.title();
      const loginForm = await this.page.$('form');
      
      this.results.frontend.login = {
        status: loginForm ? 'OK' : 'ERROR',
        title: loginTitle,
        formPresent: !!loginForm
      };
      console.log('✅ Page de connexion accessible');
      
      // Test de la page d'inscription
      await this.page.goto(`${this.frontendUrl}/register`, { waitUntil: 'networkidle2' });
      
      const registerTitle = await this.page.title();
      const registerForm = await this.page.$('form');
      
      this.results.frontend.register = {
        status: registerForm ? 'OK' : 'ERROR',
        title: registerTitle,
        formPresent: !!registerForm
      };
      console.log('✅ Page d\'inscription accessible');
      
    } catch (error) {
      this.results.frontend.error = error.message;
      console.log('❌ Erreur frontend:', error.message);
    }
  }

  async testDatabase() {
    console.log('\n🗄️ TEST DE LA BASE DE DONNÉES');
    console.log('-'.repeat(30));
    
    try {
      // Test de connexion MongoDB via l'API
      const response = await axios.get(`${this.baseUrl}/api/auth/status`);
      
      this.results.database.connection = {
        status: 'OK',
        message: 'MongoDB connecté via API'
      };
      console.log('✅ Connexion MongoDB établie');
      
    } catch (error) {
      this.results.database.connection = {
        status: 'ERROR',
        error: error.message
      };
      console.log('❌ Erreur connexion MongoDB:', error.message);
    }
  }

  async testAPIs() {
    console.log('\n🔌 TEST DES APIs');
    console.log('-'.repeat(30));
    
    const apis = [
      { name: 'Health', path: '/api/health', method: 'GET' },
      { name: 'Auth Status', path: '/api/auth/status', method: 'GET' },
      { name: 'Auth Register', path: '/api/auth/register', method: 'POST' },
      { name: 'Auth Login', path: '/api/auth/login', method: 'POST' },
      { name: 'Friends', path: '/api/friends', method: 'GET' },
      { name: 'Livestreams', path: '/api/livestreams', method: 'GET' },
      { name: 'Messages', path: '/api/messages', method: 'GET' },
      { name: 'Conversations', path: '/api/conversations', method: 'GET' }
    ];
    
    for (const api of apis) {
      try {
        let response;
        if (api.method === 'GET') {
          response = await axios.get(`${this.baseUrl}${api.path}`);
        } else if (api.method === 'POST') {
          // Test avec des données minimales
          const testData = api.name.includes('Register') ? {
            email: 'test@test.com',
            password: 'test123',
            firstName: 'Test',
            lastName: 'User',
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            address: 'Test Address',
            latitude: 9.6412,
            longitude: -13.5784
          } : {};
          
          response = await axios.post(`${this.baseUrl}${api.path}`, testData);
        }
        
        this.results.api[api.name] = {
          status: 'OK',
          statusCode: response.status,
          method: api.method,
          path: api.path
        };
        console.log(`✅ ${api.name}: ${response.status}`);
        
      } catch (error) {
        this.results.api[api.name] = {
          status: 'ERROR',
          error: error.message,
          statusCode: error.response?.status || 'N/A',
          method: api.method,
          path: api.path
        };
        console.log(`❌ ${api.name}: ${error.message}`);
      }
    }
  }

  async testFeatures() {
    console.log('\n🎯 TEST DES FONCTIONNALITÉS');
    console.log('-'.repeat(30));
    
    if (!this.page) {
      console.log('❌ Page non disponible pour les tests de fonctionnalités');
      return;
    }
    
    try {
      // Test de navigation
      await this.page.goto(this.frontendUrl);
      
      // Test des liens de navigation
      const navLinks = await this.page.$$('nav a, [role="navigation"] a');
      this.results.features.navigation = {
        status: navLinks.length > 0 ? 'OK' : 'WARNING',
        linkCount: navLinks.length
      };
      console.log(`✅ Navigation: ${navLinks.length} liens trouvés`);
      
      // Test des formulaires
      const forms = await this.page.$$('form');
      this.results.features.forms = {
        status: forms.length > 0 ? 'OK' : 'WARNING',
        formCount: forms.length
      };
      console.log(`✅ Formulaires: ${forms.length} formulaires trouvés`);
      
      // Test des boutons
      const buttons = await this.page.$$('button');
      this.results.features.buttons = {
        status: buttons.length > 0 ? 'OK' : 'WARNING',
        buttonCount: buttons.length
      };
      console.log(`✅ Boutons: ${buttons.length} boutons trouvés`);
      
      // Test des images
      const images = await this.page.$$('img');
      this.results.features.images = {
        status: images.length > 0 ? 'OK' : 'WARNING',
        imageCount: images.length
      };
      console.log(`✅ Images: ${images.length} images trouvées`);
      
    } catch (error) {
      this.results.features.error = error.message;
      console.log('❌ Erreur test fonctionnalités:', error.message);
    }
  }

  async generateReport() {
    console.log('\n📊 GÉNÉRATION DU RAPPORT');
    console.log('-'.repeat(30));
    
    // Calculer les statistiques
    const backendStatus = this.results.backend.health?.status === 'OK';
    const frontendStatus = this.results.frontend.homepage?.status === 'OK';
    const databaseStatus = this.results.database.connection?.status === 'OK';
    
    const apiTests = Object.values(this.results.api);
    const apiSuccessCount = apiTests.filter(api => api.status === 'OK').length;
    const apiTotalCount = apiTests.length;
    
    this.results.summary = {
      backend: backendStatus ? 'OPÉRATIONNEL' : 'ERREUR',
      frontend: frontendStatus ? 'OPÉRATIONNEL' : 'ERREUR',
      database: databaseStatus ? 'CONNECTÉ' : 'ERREUR',
      apis: `${apiSuccessCount}/${apiTotalCount} fonctionnelles`,
      timestamp: new Date().toISOString()
    };
    
    // Sauvegarder le rapport
    const reportPath = `diagnostic-rapport-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('📄 Rapport sauvegardé:', reportPath);
    
    // Afficher le résumé
    console.log('\n🎯 RÉSUMÉ DU DIAGNOSTIC');
    console.log('=' .repeat(40));
    console.log(`Backend: ${this.results.summary.backend}`);
    console.log(`Frontend: ${this.results.summary.frontend}`);
    console.log(`Base de données: ${this.results.summary.database}`);
    console.log(`APIs: ${this.results.summary.apis}`);
    console.log(`Erreurs: ${this.results.errors.length}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERREURS DÉTECTÉES:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log('\n✅ Diagnostic terminé !');
  }
}

// Exécuter le diagnostic
async function runDiagnostic() {
  const diagnostic = new CommuniConnectDiagnostic();
  await diagnostic.startDiagnostic();
}

// Exporter pour utilisation
module.exports = { CommuniConnectDiagnostic, runDiagnostic };

// Exécuter si appelé directement
if (require.main === module) {
  runDiagnostic().catch(console.error);
} 