// /admin/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const errorEl = document.getElementById('errorMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Désactiver le bouton pendant la requête
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    errorEl.style.display = 'none';

    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirige vers le dashboard admin
        window.location.href = '/admin';
      } else {
        errorEl.textContent = data.error || 'Identifiants incorrects';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      errorEl.textContent = 'Erreur de connexion au serveur';
      errorEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
    }
  });
});
