document.addEventListener('DOMContentLoaded', () => {
  // Gestion de la navigation
  const navLinks = document.querySelectorAll('nav a');
  const contentSections = document.querySelectorAll('.content-section');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Mettre à jour la navigation active
      navLinks.forEach((l) => l.parentElement.classList.remove('active'));
      link.parentElement.classList.add('active');

      // Afficher la section correspondante
      const target = link.getAttribute('href').substring(1);
      contentSections.forEach((section) => {
        section.classList.add('hidden');
        if (section.id === `${target}Section`) {
          section.classList.remove('hidden');
          document.getElementById('pageTitle').textContent = link.textContent.trim();
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

  // Charger les données initiales
  loadDashboardStats();
});

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
