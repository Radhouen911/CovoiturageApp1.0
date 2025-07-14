import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Support</h1>
    <p className="lead text-secondary mb-4">Bienvenue sur notre espace support. Retrouvez ici toutes les ressources pour vous aider à utiliser CovoiturageApp.</p>
    <div className="row g-4 mb-5">
      <div className="col-md-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Centre d'aide</h5>
            <p className="card-text text-secondary">Consultez nos articles d'aide et FAQ.</p>
            <Link to="/help" className="btn btn-primary btn-sm rounded-pill">Voir l'aide</Link>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Contact</h5>
            <p className="card-text text-secondary">Besoin d'aide personnalisée ?</p>
            <Link to="/contact" className="btn btn-primary btn-sm rounded-pill">Nous contacter</Link>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Sécurité</h5>
            <p className="card-text text-secondary">Nos conseils pour voyager en toute sécurité.</p>
            <Link to="/safety" className="btn btn-primary btn-sm rounded-pill">Voir la sécurité</Link>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Signaler un problème</h5>
            <p className="card-text text-secondary">Rencontrez-vous un souci ?</p>
            <Link to="/report" className="btn btn-primary btn-sm rounded-pill">Signaler</Link>
          </div>
        </div>
      </div>
    </div>
    <div className="text-center mt-5">
      <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-4 fw-semibold">Contacter le support</Link>
    </div>
  </div>
);

export default Support; 