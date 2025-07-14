import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Légal</h1>
    <p className="lead text-secondary mb-4">Retrouvez ici toutes les informations légales concernant l'utilisation de CovoiturageApp.</p>
    <div className="row g-4">
      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Conditions d'utilisation</h5>
            <Link to="/terms" className="btn btn-primary btn-sm rounded-pill">Voir</Link>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Politique de confidentialité</h5>
            <Link to="/privacy" className="btn btn-primary btn-sm rounded-pill">Voir</Link>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Cookies</h5>
            <Link to="/cookies" className="btn btn-primary btn-sm rounded-pill">Voir</Link>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm text-center">
          <div className="card-body">
            <h5 className="card-title mb-2">Mentions légales</h5>
            <Link to="/legal-notice" className="btn btn-primary btn-sm rounded-pill">Voir</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Legal; 