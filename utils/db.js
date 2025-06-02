const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let conn;

function init() {
  return new Promise((resolve, reject) => {
    conn = new sqlite3.Database(path.join(__dirname, '..', 'zotra.db'), (err) => {
      if (err) return reject(err);
      
      conn.serialize(() => {
        conn.run(`CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          telephone TEXT NOT NULL,
          depart TEXT NOT NULL,
          arrivee TEXT NOT NULL,
          date TEXT NOT NULL,
          valide INTEGER DEFAULT 0,
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        
        conn.run(`CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reservation_id INTEGER,
          montant INTEGER,
          statut TEXT,
          coupon TEXT,
          date TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reservation_id) REFERENCES reservations(id)
        )`);
        
        conn.run(`CREATE TABLE IF NOT EXISTS annonces (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titre TEXT NOT NULL,
          contenu TEXT NOT NULL,
          date TEXT DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) return reject(err);
          console.log("📦 Base de données initialisée");
          resolve();
        });
      });
    });
  });
}

function getDb() {
  if (!conn) throw new Error('Database not initialized');
  return conn;
}

module.exports = { init, getDb };