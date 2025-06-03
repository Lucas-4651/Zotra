document.addEventListener('DOMContentLoaded', () => {
  const annoncesList = document.getElementById('annonces-list');
  if (!annoncesList) return;

  fetch('/api/annonces')
    .then(res => res.json())
    .then(annonces => {
      if (!Array.isArray(annonces) || annonces.length === 0) {
        annoncesList.innerHTML = `
          <div class="no-annonce">
            <i class="fas fa-info-circle"></i>
            Aucune annonce pour le moment.
          </div>
        `;
        return;
      }
      annoncesList.innerHTML = annonces.map(a => `
        <div class="annonce-card">
          <div class="annonce-header">
            <i class="fas fa-bullhorn annonce-icon"></i>
            <div>
              <span class="annonce-title">${a.titre}</span>
              <span class="annonce-date">${a.date ? new Date(a.date).toLocaleDateString('fr-FR') : ''}</span>
            </div>
          </div>
          <div class="annonce-body">
            ${a.contenu}
          </div>
        </div>
      `).join('');
    })
    .catch(() => {
      annoncesList.innerHTML = `
        <div class="no-annonce error">
          <i class="fas fa-exclamation-triangle"></i>
          Erreur lors du chargement des annonces.
        </div>
      `;
    });
});