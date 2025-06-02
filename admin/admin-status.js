document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [reservations, transactions] = await Promise.all([
      fetch('/api/admin/reservations').then(r => r.json()),
      fetch('/api/admin/transactions').then(r => r.json())
    ]);
    
    // Calcul des stats
    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter(r => !r.valide).length;
    
    const totalRevenue = transactions
      .filter(t => t.statut === 'confirmée')
      .reduce((sum, t) => sum + t.montant, 0);
    
    document.getElementById('total-reservations').textContent = totalReservations;
    document.getElementById('pending-reservations').textContent = pendingReservations;
    document.getElementById('total-revenue').textContent = 
      totalRevenue.toLocaleString('fr-MG') + ' Ar';
    
    // Charger le nombre d'annonces
    const annonces = await fetch('/api/annonces').then(r => r.json());
    document.getElementById('active-annonces').textContent = annonces.length;
    
  } catch (err) {
    console.error('Erreur chargement stats:', err);
  }
});