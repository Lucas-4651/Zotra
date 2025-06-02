// main.js
console.log("Main.js bien chargé !");
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = form.nom.value;
    const numero = form.numero.value;
    const depart = form.depart.value;
    const arrivee = form.arrivee.value;
    const date = form.date.value;

    const coupon = "ZOTRA-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Remplacer le contenu pour confirmation
    document.body.innerHTML = `
      <div style="padding: 1rem; max-width: 480px; margin: auto;">
        <h2>Réservation confirmée 🎉</h2>
        <p><strong>Anarana :</strong> ${nom}</p>
        <p><strong>Coupon :</strong> <span style="color:#0066cc">${coupon}</span></p>
        <p>Merci de valider votre paiement via Mobile Money.</p>
        <p style="font-size:0.9rem; color:gray;">Date du voyage : ${date} | ${depart} → ${arrivee}</p>
      </div>
    `;
  });
});