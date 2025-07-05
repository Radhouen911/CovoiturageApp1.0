"use client"
import { useNavigate } from "react-router-dom"
import SearchForm from "../components/SearchForm"

const Home = () => {
  const navigate = useNavigate()

  const handleSearch = (searchData) => {
    navigate("/search", { state: searchData })
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Voyagez ensemble, économisez plus</h1>
              <p className="lead mb-4">
                Trouvez des covoiturages près de chez vous ou proposez vos trajets. Économique, écologique et convivial
                !
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-light btn-lg" onClick={() => navigate("/search")}>
                  Rechercher un trajet
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={() => navigate("/create-ride")}>
                  Proposer un trajet
                </button>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-lg">
                <div className="card-body p-4">
                  <h3 className="card-title text-dark mb-4">Recherche rapide</h3>
                  <SearchForm onSearch={handleSearch} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="display-5 fw-bold">Pourquoi choisir notre plateforme ?</h2>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="fas fa-money-bill-wave fa-lg"></i>
                  </div>
                  <h4>Économique</h4>
                  <p className="text-muted">Partagez les frais de carburant et réduisez vos coûts de transport.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="feature-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="fas fa-leaf fa-lg"></i>
                  </div>
                  <h4>Écologique</h4>
                  <p className="text-muted">Réduisez votre empreinte carbone en partageant votre véhicule.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="feature-icon bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="fas fa-users fa-lg"></i>
                  </div>
                  <h4>Social</h4>
                  <p className="text-muted">Rencontrez de nouvelles personnes et créez des liens.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">1000+</h3>
                <p className="text-muted">Utilisateurs actifs</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">500+</h3>
                <p className="text-muted">Trajets par mois</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">50+</h3>
                <p className="text-muted">Villes desservies</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">95%</h3>
                <p className="text-muted">Satisfaction client</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
