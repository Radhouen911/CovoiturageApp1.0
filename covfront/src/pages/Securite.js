import React from 'react';

const Securite = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text text-center">Sécurité</h1>

    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Nos conseils pour voyager en toute sécurité</h2>
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-start">
          <span className="me-3 fs-4 text-primary">✔️</span>
          <div>Vérifiez soigneusement les profils et les avis des conducteurs et passagers avant de confirmer votre réservation.</div>
        </li>
        <li className="list-group-item d-flex align-items-start">
          <span className="me-3 fs-4 text-primary">💬</span>
          <div>Utilisez exclusivement la messagerie intégrée pour toutes vos communications afin de garantir votre confidentialité et sécurité.</div>
        </li>
        <li className="list-group-item d-flex align-items-start">
          <span className="me-3 fs-4 text-primary">🔒</span>
          <div>Ne partagez jamais d'informations personnelles sensibles, telles que vos coordonnées bancaires ou votre adresse complète.</div>
        </li>
        <li className="list-group-item d-flex align-items-start">
          <span className="me-3 fs-4 text-primary">🚨</span>
          <div>Signalez immédiatement tout comportement suspect ou problème à notre équipe via la fonction « Signaler un problème ».</div>
        </li>
      </ul>
    </section>

    <section className="text-center">
      <h2 className="h4 fw-bold mb-3 text-primary">Assistance en cas de problème</h2>
      <p className="text-secondary mb-4 fs-5">
        En cas d'urgence ou de situation délicate lors d'un trajet, n'hésitez pas à contacter notre support dédié ou, si nécessaire, les autorités compétentes.
      </p>
      <a
        href="/report"
        className="btn btn-gradient btn-lg rounded-pill px-5 fw-semibold"
        role="button"
        aria-label="Signaler un problème"
      >
        Signaler un problème
      </a>
    </section>

    {/* Styles pour le bouton gradient */}
    <style>{`
      .btn-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff !important;
        border: none;
        font-weight: 600;
        font-size: 1.1rem;
        border-radius: 2rem;
        padding: 0.75rem 2.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }
      .btn-gradient:hover, .btn-gradient:focus {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        color: #fff !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        text-decoration: none;
      }
      .btn-gradient:active {
        transform: translateY(0);
      }
    `}</style>
  </div>
);

export default Securite;
