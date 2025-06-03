const express = require('express');
const router = express.Router();

const { getDb } = require('../utils/db');

// Middleware d'authentification admin à récupérer depuis app.js
const authAdmin = (req, res, next) => {
  if (req.session && req.session.adminAuthenticated) return next();
  return res.status(401).json({ error: 'Non autorisé' });
};

// Liste des annonces (publique)
router.get('/annonces', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM annonces ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ajouter une annonce (admin)
router.post('/admin/annonces', authAdmin, (req, res) => {
  const db = getDb();
  const { titre, contenu } = req.body;
  if (!titre || !contenu) return res.status(400).json({ error: 'Champs requis' });
  db.run(
    'INSERT INTO annonces (titre, contenu, date) VALUES (?, ?, ?)',
    [titre, contenu, new Date()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, titre, contenu });
    }
  );
});

// Modifier une annonce (admin)
router.put('/admin/annonces/:id', authAdmin, (req, res) => {
  const db = getDb();
  const { titre, contenu } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE annonces SET titre=?, contenu=? WHERE id=?',
    [titre, contenu, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Supprimer une annonce (admin)
router.delete('/admin/annonces/:id', authAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  db.run('DELETE FROM annonces WHERE id=?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;