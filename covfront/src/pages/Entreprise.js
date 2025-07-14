import React from 'react';

const Entreprise = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Entreprise</h1>
    <section className="mb-5">
      <h2 className="h3 fw-bold mb-3 text-primary">Notre mission</h2>
      <p className="lead text-secondary">Faciliter la mobilité durable et accessible à tous grâce au covoiturage moderne et sécurisé.</p>
    </section>
    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Nos valeurs</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">🤝</div>
              <h5 className="card-title">Confiance</h5>
              <p className="card-text text-secondary">Nous créons une communauté basée sur la confiance et la transparence entre conducteurs et passagers.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">🌱</div>
              <h5 className="card-title">Écologie</h5>
              <p className="card-text text-secondary">Nous encourageons des trajets plus verts et la réduction de l’empreinte carbone.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">🚗</div>
              <h5 className="card-title">Innovation</h5>
              <p className="card-text text-secondary">Nous innovons pour offrir la meilleure expérience de covoiturage possible.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="text-center mt-5">
      <a href="#" className="btn btn-gradient btn-lg px-4 rounded-pill fw-semibold">Rejoignez-nous</a>
    </section>
  </div>
);

export default Entreprise; 