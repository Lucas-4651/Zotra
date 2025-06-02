// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connexion à SQLite
const db = new sqlite3.Database('./zotra.db');
db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  numero TEXT,
  depart TEXT,
  arrivee TEXT,
  date_voyage TEXT,
  code_coupon TEXT,
  statut_paiement TEXT DEFAULT 'En attente'
)`);

// Générateur de coupon
function genererCoupon() {
  return 'ZOTRA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Route de traitement
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/reserver', (req, res) => {
  const { nom, numero, depart, arrivee, date } = req.body;
  const coupon = genererCoupon();

  db.run(`INSERT INTO reservations (nom, numero, depart, arrivee, date_voyage, code_coupon)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [nom, numero, depart, arrivee, date, coupon],
          (err) => {
    if (err) {
      return res.send("Erreur dans la réservation.");
    }

    res.send(`
      <h2>Réservation enregistrée 🎉</h2>
      <p>Nom : ${nom}</p>
      <p>Coupon : <strong>${coupon}</strong></p>
      <a href="/">← Retour</a>
    `);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
});
