const express = require('express');
const router = express.Router();
const { generateCoupon } = require('../utils/helpers');
const db = require('../utils/db');

router.post('/reserver', (req, res) => {
  const { nom, numero, depart, arrivee, date } = req.body;
  
  if (!nom || !numero || !depart || !arrivee || !date) {
    return res.status(400).json({ 
      success: false,
      error: 'Tous les champs sont obligatoires' 
    });
  }

  // Générer un coupon unique
  const coupon = generateCoupon();

  db.serialize(() => {
    // Insertion dans la table reservations
    db.run(
      `INSERT INTO reservations (nom, telephone, depart, arrivee, date) 
       VALUES (?, ?, ?, ?, ?)`,
      [nom, numero, depart, arrivee, date],
      function(err) {
        if (err) {
          console.error('Erreur DB:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Erreur base de données' 
          });
        }
        
        const reservationId = this.lastID;
        
        // Insertion dans la table transactions
        db.run(
          `INSERT INTO transactions (reservation_id, montant, statut, coupon) 
           VALUES (?, ?, ?, ?)`,
          [reservationId, 5000, 'en attente', coupon],
          function(err) {
            if (err) {
              console.error('Erreur transaction:', err);
              return res.status(500).json({ 
                success: false,
                error: 'Erreur création transaction' 
              });
            }
            
            res.json({ 
              success: true,
              message: 'Réservation enregistrée. Paiement en attente.',
              coupon
            });
          }
        );
      }
    );
  });
});

module.exports = router;