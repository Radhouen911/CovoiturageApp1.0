import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3">
              <i className="fas fa-car me-2"></i>
              CovoiturageApp
            </h5>
            <p className="text-muted">
              La plateforme de covoiturage qui vous permet de voyager ensemble, économiser plus et réduire votre impact
              environnemental.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="mb-3">Navigation</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  Accueil
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-muted text-decoration-none">
                  Rechercher
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/create-ride" className="text-muted text-decoration-none">
                  Proposer un trajet
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Centre d'aide
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="mb-3">Légal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Conditions d'utilisation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Politique de confidentialité
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">© 2024 CovoiturageApp. Tous droits réservés.</p>
          </div>
          <div className="col-md-6 text-end">
            <p className="mb-0 text-muted">
              Fait avec <i className="fas fa-heart text-danger"></i> en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
