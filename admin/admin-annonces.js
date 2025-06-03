document.addEventListener('DOMContentLoaded', () => {
  const annoncesList = document.getElementById('annoncesList');
  const addAnnonceBtn = document.getElementById('addAnnonceBtn');
  const annonceForm = document.getElementById('annonceForm');
  const saveAnnonceBtn = document.getElementById('saveAnnonceBtn');
  const cancelAnnonceBtn = document.getElementById('cancelAnnonceBtn');
  const formTitle = document.getElementById('formTitle');

  let currentAnnonceId = null;

  // Charger les annonces
  loadAnnonces();

  // Ajouter une annonce
  addAnnonceBtn.addEventListener('click', () => {
    currentAnnonceId = null;
    formTitle.textContent = 'Nouvelle Annonce';
    document.getElementById('annonceTitre').value = '';
    document.getElementById('annonceContenu').value = '';
    annonceForm.classList.remove('hidden');
  });

  // Annuler
  cancelAnnonceBtn.addEventListener('click', () => {
    annonceForm.classList.add('hidden');
  });

  // Enregistrer
  saveAnnonceBtn.addEventListener('click', async () => {
    const titre = document.getElementById('annonceTitre').value;
    const contenu = document.getElementById('annonceContenu').value;

    if (!titre || !contenu) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const url = currentAnnonceId
  ? `/api/annonces/${currentAnnonceId}`
  : '/api/annonces';
      const method = currentAnnonceId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre, contenu }),
      });

      if (!response.ok) throw new Error('Erreur serveur');

      annonceForm.classList.add('hidden');
      loadAnnonces();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  });

  async function loadAnnonces() {
    try {
      const response = await fetch('/api/annonces');
      if (!response.ok) throw new Error('Erreur de chargement');
      const annonces = await response.json();

      annoncesList.innerHTML = annonces
        .map(
          (annonce) => `
        <div class="annonce-item" data-id="${annonce.id}">
          <div class="annonce-header">
            <h4>${annonce.titre}</h4>
            <span class="annonce-date">
              ${new Date(annonce.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div class="annonce-content">
            <p>${annonce.contenu}</p>
          </div>
          <div class="annonce-actions">
            <button class="edit-btn btn small-btn">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button class="delete-btn btn small-btn danger-btn">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      `
        )
        .join('');

      // Gérer les boutons
      document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', editAnnonce);
      });

      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', deleteAnnonce);
      });
    } catch (err) {
      annoncesList.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          ${err.message}
        </div>
      `;
    }
  }

  function editAnnonce(e) {
    const annonceItem = e.target.closest('.annonce-item');
    currentAnnonceId = annonceItem.dataset.id;

    const titre = annonceItem.querySelector('h4').textContent;
    const contenu = annonceItem.querySelector('p').textContent;

    document.getElementById('annonceTitre').value = titre;
    document.getElementById('annonceContenu').value = contenu;
    formTitle.textContent = 'Modifier Annonce';
    annonceForm.classList.remove('hidden');
  }

  async function deleteAnnonce(e) {
    if (!confirm('Supprimer cette annonce ?')) return;

    const annonceItem = e.target.closest('.annonce-item');
    const id = annonceItem.dataset.id;

    try {
      const response = await fetch(`/api/annonces/${id}`, {
  method: 'DELETE',
});

      if (!response.ok) throw new Error('Erreur de suppression');

      loadAnnonces();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  }
});
