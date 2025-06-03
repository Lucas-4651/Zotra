document.addEventListener('DOMContentLoaded', () => {
  // Gestion de la navigation
  const navLinks = document.querySelectorAll('nav a');
  const contentSections = document.querySelectorAll('.content-section');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach((l) => l.parentElement.classList.remove('active'));
      link.parentElement.classList.add('active');

      const target = link.getAttribute('href').substring(1);
      contentSections.forEach((section) => {
        section.classList.add('hidden');
        if (section.id === `${target}Section`) {
          section.classList.remove('hidden');
          document.getElementById('pageTitle').textContent = link.textContent.trim();
          if (section.id === 'reservationsSection') loadReservationList();
          if (section.id === 'transactionsSection') loadTransactionList();
        }
      });
    });
  });

  // Déconnexion
  document.querySelector('.logout-btn').addEventListener('click', () => {
    fetch('/admin/logout', {
      method: 'POST',
    }).then(() => {
      window.location.href = '/admin/login';
    });
  });

  // Charger les données initiales du dashboard principal
  loadDashboardStats();
});

// Fonction pour charger les stats du dashboard principal
async function loadDashboardStats() {
  try {
    const [reservations, transactions] = await Promise.all([
      fetch('/api/admin/reservations').then((r) => r.json()),
      fetch('/api/admin/transactions').then((r) => r.json()),
    ]);

    document.getElementById('totalReservations').textContent = reservations.length;
    document.getElementById('pendingReservations').textContent = reservations.filter(
      (r) => !r.valide
    ).length;

    const totalRevenue = transactions
      .filter((t) => t.statut === 'confirmée')
      .reduce((sum, t) => sum + t.montant, 0);

    document.getElementById('totalRevenue').textContent = `${totalRevenue.toLocaleString()} Ar`;
  } catch (err) {
    console.error('Erreur chargement stats:', err);
  }
}

// Fonction pour afficher la liste des réservations avec boutons d'action
async function loadReservationList() {
  try {
    const res = await fetch('/api/admin/reservations');
    const reservations = await res.json();
    const section = document.getElementById('reservationsSection');
    section.innerHTML = '';

    if (!reservations.length) {
      section.innerHTML = '<p>Aucune réservation.</p>';
      return;
    }

    reservations.forEach(r => {
      const div = document.createElement('div');
      div.className = 'reservation-card';
      div.innerHTML = `
        <strong>${r.nom}</strong> - ${r.depart} → ${r.arrivee} (${r.date})
        <span style="margin-left:10px;">Statut: ${r.valide ? 'Validée' : 'En attente'}</span>
        <div style="margin-top:5px;">
          <button class="valider-btn" ${r.valide ? 'disabled' : ''}>Valider</button>
          <button class="rejeter-btn" ${r.valide ? 'disabled' : ''}>Rejeter</button>
        </div>
      `;
      // Actions bouton
      const validerBtn = div.querySelector('.valider-btn');
      validerBtn.addEventListener('click', async () => {
        if (!r.valide) await actionReservation(r.id, 'valider');
      });
      const rejeterBtn = div.querySelector('.rejeter-btn');
      rejeterBtn.addEventListener('click', async () => {
        if (!r.valide) await actionReservation(r.id, 'rejeter');
      });
      section.appendChild(div);
    });
  } catch (e) {
    document.getElementById('reservationsSection').innerHTML = '<p>Erreur de chargement.</p>';
  }
}

// Fonction action Valider/Rejeter réservation
async function actionReservation(id, action) {
  try {
    const endpoint = `/api/admin/reservations/${id}/${action}`;
    const res = await fetch(endpoint, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      loadReservationList();
      loadDashboardStats();
    } else {
      alert('Erreur : ' + (data.error || 'Opération échouée'));
    }
  } catch {
    alert('Erreur réseau');
  }
}

// Fonction pour afficher la liste des transactions avec info réservation
async function loadTransactionList() {
  try {
    const [transactions, reservations] = await Promise.all([
      fetch('/api/admin/transactions').then((r) => r.json()),
      fetch('/api/admin/reservations').then((r) => r.json()),
    ]);
    const section = document.getElementById('transactionsSection');
    section.innerHTML = '';

    if (!transactions.length) {
      section.innerHTML = '<p>Pas de Transaction en ce moment</p>';
      return;
    }

    transactions.forEach(t => {
      // Associe la réservation
      const r = reservations.find(r => r.id === t.reservation_id);
      const div = document.createElement('div');
      div.className = 'transaction-card';
      div.innerHTML = `
        <div>
          <strong>Transaction #${t.id}</strong> - Statut: ${t.statut} - Montant: ${t.montant} Ar
        </div>
        <div>
          ${
            r
              ? `<span>Réservation: <strong>${r.nom}</strong> - ${r.depart} → ${r.arrivee} (${r.date})</span>`
              : '<span>Réservation: inconnue</span>'
          }
        </div>
        <div>Coupon: ${t.coupon || '—'}</div>
      `;
      section.appendChild(div);
    });
  } catch (e) {
    document.getElementById('transactionsSection').innerHTML = '<p>Erreur de chargement.</p>';
  }
}