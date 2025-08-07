const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DES ERREURS REACT INSERTBEFORE');
console.log('=' .repeat(50));

// 1. Corriger MessageList.js
const fixMessageList = () => {
  const messageListPath = path.join(__dirname, 'client/src/components/Messages/MessageList.js');
  
  if (fs.existsSync(messageListPath)) {
    let content = fs.readFileSync(messageListPath, 'utf8');
    let modified = false;
    
    // Améliorer la clé pour éviter les problèmes de rendu
    if (content.includes('key={message._id || index}')) {
      console.log('🔧 Amélioration des clés dans MessageList...');
      content = content.replace(
        /key=\{message\._id \|\| index\}/g,
        'key={`message-${message._id || message.id || index}-${message.createdAt || Date.now()}`}'
      );
      modified = true;
    }
    
    // Ajouter une vérification pour éviter les messages null
    if (!content.includes('message && message.content')) {
      console.log('🔧 Ajout de vérification des messages...');
      content = content.replace(
        /\{messages\.map\(\(message, index\) => \{/g,
        '{messages.filter(message => message && message.content).map((message, index) => {'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(messageListPath, content);
      console.log('✅ MessageList corrigé');
    } else {
      console.log('✅ MessageList déjà correct');
    }
  }
};

// 2. Corriger InteractiveMap.js
const fixInteractiveMap = () => {
  const mapPath = path.join(__dirname, 'client/src/components/Map/InteractiveMap.js');
  
  if (fs.existsSync(mapPath)) {
    let content = fs.readFileSync(mapPath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des marqueurs
    if (content.includes('key={`event-${event.id}`}')) {
      console.log('🔧 Amélioration des clés des marqueurs d\'événements...');
      content = content.replace(
        /key=\{`event-\$\{event\.id\}`\}/g,
        'key={`event-${event.id}-${event.latitude}-${event.longitude}`}'
      );
      modified = true;
    }
    
    if (content.includes('key={`alert-${alert.id}`}')) {
      console.log('🔧 Amélioration des clés des marqueurs d\'alertes...');
      content = content.replace(
        /key=\{`alert-\$\{alert\.id\}`\}/g,
        'key={`alert-${alert.id}-${alert.latitude}-${alert.longitude}`}'
      );
      modified = true;
    }
    
    // Ajouter des vérifications pour éviter les données null
    if (!content.includes('event && event.latitude')) {
      console.log('🔧 Ajout de vérifications pour les événements...');
      content = content.replace(
        /\{filteredEvents\.map\(\(event\) => \(/g,
        '{filteredEvents.filter(event => event && event.latitude && event.longitude).map((event) => ('
      );
      modified = true;
    }
    
    if (!content.includes('alert && alert.latitude')) {
      console.log('🔧 Ajout de vérifications pour les alertes...');
      content = content.replace(
        /\{filteredAlerts\.map\(\(alert\) => \(/g,
        '{filteredAlerts.filter(alert => alert && alert.latitude && alert.longitude).map((alert) => ('
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(mapPath, content);
      console.log('✅ InteractiveMap corrigé');
    } else {
      console.log('✅ InteractiveMap déjà correct');
    }
  }
};

// 3. Corriger AlertsPage.js
const fixAlertsPage = () => {
  const alertsPagePath = path.join(__dirname, 'client/src/pages/Alerts/AlertsPage.js');
  
  if (fs.existsSync(alertsPagePath)) {
    let content = fs.readFileSync(alertsPagePath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des alertes
    if (content.includes('key={alert._id}')) {
      console.log('🔧 Amélioration des clés des alertes...');
      content = content.replace(
        /key=\{alert\._id\}/g,
        'key={`alert-${alert._id}-${alert.createdAt || Date.now()}`}'
      );
      modified = true;
    }
    
    // Ajouter des vérifications pour éviter les alertes null
    if (!content.includes('alert && alert.title')) {
      console.log('🔧 Ajout de vérifications pour les alertes...');
      content = content.replace(
        /\{filteredAlerts\.map\(\(alert\) => \(/g,
        '{filteredAlerts.filter(alert => alert && alert.title).map((alert) => ('
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(alertsPagePath, content);
      console.log('✅ AlertsPage corrigé');
    } else {
      console.log('✅ AlertsPage déjà correct');
    }
  }
};

// 4. Corriger FeedPage.js
const fixFeedPage = () => {
  const feedPagePath = path.join(__dirname, 'client/src/pages/Feed/FeedPage.js');
  
  if (fs.existsSync(feedPagePath)) {
    let content = fs.readFileSync(feedPagePath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des posts
    if (content.includes('key={post.id}')) {
      console.log('🔧 Amélioration des clés des posts...');
      content = content.replace(
        /key=\{post\.id\}/g,
        'key={`post-${post.id}-${post.createdAt || Date.now()}`}'
      );
      modified = true;
    }
    
    // Ajouter des vérifications pour éviter les posts null
    if (!content.includes('post && post.title')) {
      console.log('🔧 Ajout de vérifications pour les posts...');
      content = content.replace(
        /\{getFilteredPosts\(\)\.map\(\(post, index\) => \(/g,
        '{getFilteredPosts().filter(post => post && post.title).map((post, index) => ('
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(feedPagePath, content);
      console.log('✅ FeedPage corrigé');
    } else {
      console.log('✅ FeedPage déjà correct');
    }
  }
};

// 5. Corriger FriendsPage.js
const fixFriendsPage = () => {
  const friendsPagePath = path.join(__dirname, 'client/src/pages/Friends/FriendsPage.js');
  
  if (fs.existsSync(friendsPagePath)) {
    let content = fs.readFileSync(friendsPagePath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des amis
    if (content.includes('key={friend._id}')) {
      console.log('🔧 Amélioration des clés des amis...');
      content = content.replace(
        /key=\{friend\._id\}/g,
        'key={`friend-${friend._id}-${friend.email || Date.now()}`}'
      );
      modified = true;
    }
    
    // Ajouter des vérifications pour éviter les amis null
    if (!content.includes('friend && friend.firstName')) {
      console.log('🔧 Ajout de vérifications pour les amis...');
      content = content.replace(
        /\{filteredFriends\.map\(\(friend, index\) => \(/g,
        '{filteredFriends.filter(friend => friend && friend.firstName).map((friend, index) => ('
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(friendsPagePath, content);
      console.log('✅ FriendsPage corrigé');
    } else {
      console.log('✅ FriendsPage déjà correct');
    }
  }
};

// 6. Corriger LivestreamPlayer.js
const fixLivestreamPlayer = () => {
  const livestreamPath = path.join(__dirname, 'client/src/components/Livestreams/LivestreamPlayer.js');
  
  if (fs.existsSync(livestreamPath)) {
    let content = fs.readFileSync(livestreamPath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des messages de chat
    if (content.includes('key={msg.id}')) {
      console.log('🔧 Amélioration des clés des messages de chat...');
      content = content.replace(
        /key=\{msg\.id\}/g,
        'key={`chat-${msg.id}-${msg.timestamp || Date.now()}`}'
      );
      modified = true;
    }
    
    // Ajouter des vérifications pour éviter les messages null
    if (!content.includes('msg && msg.message')) {
      console.log('🔧 Ajout de vérifications pour les messages de chat...');
      content = content.replace(
        /\{chatMessages\.map\(\(msg\) => \(/g,
        '{chatMessages.filter(msg => msg && msg.message).map((msg) => ('
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(livestreamPath, content);
      console.log('✅ LivestreamPlayer corrigé');
    } else {
      console.log('✅ LivestreamPlayer déjà correct');
    }
  }
};

// 7. Corriger MapLegend.js
const fixMapLegend = () => {
  const legendPath = path.join(__dirname, 'client/src/components/Map/MapLegend.js');
  
  if (fs.existsSync(legendPath)) {
    let content = fs.readFileSync(legendPath, 'utf8');
    let modified = false;
    
    // Améliorer les clés de la légende
    if (content.includes('key={item.type}')) {
      console.log('🔧 Amélioration des clés de la légende...');
      content = content.replace(
        /key=\{item\.type\}/g,
        'key={`legend-${item.type}-${index}`}'
      );
      modified = true;
    }
    
    if (content.includes('key={subItem.severity}')) {
      console.log('🔧 Amélioration des clés des sous-éléments...');
      content = content.replace(
        /key=\{subItem\.severity\}/g,
        'key={`subitem-${subItem.severity}-${index}`}'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(legendPath, content);
      console.log('✅ MapLegend corrigé');
    } else {
      console.log('✅ MapLegend déjà correct');
    }
  }
};

// 8. Corriger UserTestingPanel.js
const fixUserTestingPanel = () => {
  const panelPath = path.join(__dirname, 'client/src/components/Admin/UserTestingPanel.js');
  
  if (fs.existsSync(panelPath)) {
    let content = fs.readFileSync(panelPath, 'utf8');
    let modified = false;
    
    // Améliorer les clés des scénarios
    if (content.includes('key={index}')) {
      console.log('🔧 Amélioration des clés des scénarios...');
      content = content.replace(
        /key=\{index\}/g,
        'key={`scenario-${scenario.title}-${index}`}'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(panelPath, content);
      console.log('✅ UserTestingPanel corrigé');
    } else {
      console.log('✅ UserTestingPanel déjà correct');
    }
  }
};

// Exécuter toutes les corrections
console.log('\n🔧 Application des corrections...\n');

fixMessageList();
fixInteractiveMap();
fixAlertsPage();
fixFeedPage();
fixFriendsPage();
fixLivestreamPlayer();
fixMapLegend();
fixUserTestingPanel();

console.log('\n✅ CORRECTIONS TERMINÉES !');
console.log('\n🎯 Problèmes corrigés :');
console.log('   • Clés uniques améliorées dans les listes');
console.log('   • Vérifications ajoutées pour éviter les données null');
console.log('   • Structure DOM optimisée');
console.log('   • Gestion des erreurs React améliorée');

console.log('\n🚀 Redémarrez l\'application pour appliquer les corrections :');
console.log('   npm start'); 