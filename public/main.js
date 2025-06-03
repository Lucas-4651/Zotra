document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split('T')[0];
  const overlay = document.getElementById('couponOverlay');
  const couponModal = document.querySelector('.coupon-modal');

  // Configurer la date minimale
  dateInput.min = today;

  // Créer le conteneur de message
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  form.insertAdjacentElement('afterend', messageContainer);

  // Fonction de validation du téléphone
  function validatePhone(phone) {
    return /^03[2-8]\d{7}$/.test(phone);
  }

  // Fonction d'affichage d'erreur
  function showError(message) {
    messageContainer.textContent = message;
    messageContainer.className = 'message-container error';
    messageContainer.style.display = 'block';
    messageContainer.style.opacity = '1';
  }

  // Fonction pour afficher le popup de coupon
  function showCouponPopup(data) {
    document.getElementById('couponCode').textContent = data.coupon;
    document.getElementById('clientName').textContent = data.nom;
    document.getElementById('trajetDetails').textContent = `${data.depart} → ${data.arrivee}`;
    document.getElementById('travelDate').textContent = new Date(data.date).toLocaleDateString(
      'fr-FR',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }
    );

    // Afficher le popup
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.opacity = '1';
      couponModal.style.transform = 'translateY(0)';
    }, 10);
  }

  // Gestion de la fermeture du popup
  document.getElementById('closeCoupon').addEventListener('click', () => {
    overlay.style.opacity = '0';
    couponModal.style.transform = 'translateY(20px)';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  });

  // Gestion de l'impression
  document.querySelector('.print-btn').addEventListener('click', () => {
    window.print();
  });

  // Gestion de la sauvegarde
  document.querySelector('.save-btn').addEventListener('click', () => {
    const content = `Code coupon: ${document.getElementById('couponCode').textContent}\nNom: ${document.getElementById('clientName').textContent}\nTrajet: ${document.getElementById('trajetDetails').textContent}\nDate: ${document.getElementById('travelDate').textContent}\nMontant: 5,000 Ar`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupon-zotra-${document.getElementById('couponCode').textContent}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Gestion de la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset des messages
    messageContainer.style.display = 'none';
    messageContainer.textContent = '';

    const formData = {
      nom: form.nom.value.trim(),
      numero: form.numero.value.trim(),
      depart: form.depart.value,
      arrivee: form.arrivee.value,
      date: form.date.value,
    };

    // Validation
    if (
      !formData.nom ||
      !formData.numero ||
      !formData.depart ||
      !formData.arrivee ||
      !formData.date
    ) {
      return showError('Veuillez remplir tous les champs');
    }

    if (!validatePhone(formData.numero)) {
      return showError('Numéro invalide. Format: 0321234567');
    }

    if (formData.depart === formData.arrivee) {
      return showError('Le départ et la destination doivent être différents');
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    // Désactiver le bouton pendant la requête
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    try {
      const response = await fetch('/reserver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      // Afficher le coupon
      showCouponPopup({
        coupon: data.coupon,
        ...formData,
      });

      // Réinitialiser le formulaire
      form.reset();
    } catch (err) {
      showError(err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
