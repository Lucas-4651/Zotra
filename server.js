const { app } = require('./app');
const { init } = require('./utils/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialiser la base de données
    await init();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de démarrage:', err);
    process.exit(1);
  }
}

startServer();
