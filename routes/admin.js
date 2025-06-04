const express = require('express');
const router = express.Router();
const { getDb } = require('../utils/db');

// Récupérer toutes les réservations
router.get('/reservations', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM reservations', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Récupérer toutes les transactions
router.get('/transactions', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM transactions', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Valider une réservation
router.post('/reservations/:id/valider', (req, res) => {
  const id = req.params.id;
  const db = getDb();

  db.run('UPDATE reservations SET valide = 1 WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Réservation introuvable' });

    db.run('UPDATE transactions SET statut = ? WHERE reservation_id = ?', ['confirmée', id]);
    res.json({ success: true, message: 'Réservation validée' });
  });
});

// Rejeter une réservation
router.post('/reservations/:id/rejeter', (req, res) => {
  const id = req.params.id;
  const db = getDb();

  db.run('DELETE FROM transactions WHERE reservation_id = ?', [id], () => {
    db.run('DELETE FROM reservations WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Réservation introuvable' });
      res.json({ success: true, message: 'Réservation rejetée' });
    });
  });
});

// Statistiques pour le dashboard (7 derniers jours pour le graphique)
router.get('/stats', (req, res) => {
  const db = getDb();
  const today = new Date();
  let labels = [];
  let reservationsPerDay = [];
  let queries = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    labels.push(label);
    const dateStr = d.toISOString().slice(0, 10);
    queries.push(new Promise(resolve => {
      db.get(
        "SELECT COUNT(*) as count FROM reservations WHERE date = ?",
        [dateStr],
        (err, row) => {
          resolve(row ? row.count : 0);
        }
      );
    }));
  }
  Promise.all(queries).then(results => {
    reservationsPerDay = results;
    res.json({ labels, reservationsPerDay });
  });
});
module.exports = router;