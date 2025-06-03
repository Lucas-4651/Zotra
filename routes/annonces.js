const express = require('express');
const router = express.Router();
const { getDb } = require('../utils/db');
const { sanitizeInput } = require('../utils/helpers');

// Récupérer toutes les annonces
router.get('/annonces', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM annonces ORDER BY date DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Créer une annonce (admin)
router.post('/annonces', (req, res) => {
  const { titre, contenu } = req.body;

  if (!titre || !contenu) {
    return res.status(400).json({ error: 'Titre et contenu requis' });
  }

  const db = getDb();
  const safeTitre = sanitizeInput(titre);
  const safeContenu = sanitizeInput(contenu);

  db.run(
    'INSERT INTO annonces (titre, contenu) VALUES (?, ?)',
    [safeTitre, safeContenu],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

// Mettre à jour une annonce (admin)
router.put('/annonces/:id', (req, res) => {
  const id = req.params.id;
  const { titre, contenu } = req.body;

  const db = getDb();
  const safeTitre = sanitizeInput(titre);
  const safeContenu = sanitizeInput(contenu);

  db.run(
    'UPDATE annonces SET titre = ?, contenu = ? WHERE id = ?',
    [safeTitre, safeContenu, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Supprimer une annonce (admin)
router.delete('/annonces/:id', (req, res) => {
  const id = req.params.id;
  const db = getDb();

  db.run('DELETE FROM annonces WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
