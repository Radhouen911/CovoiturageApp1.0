import { useEffect, useState } from "react";
import {
  FaCar,
  FaClock,
  FaComments,
  FaMapMarkedAlt,
  FaPlus,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/1.jpg";
import blablacarDaily from "../assets/images/finger.png";
import { useAuth } from "../contexts/AuthContext";

// API URL could come from env variable for flexibility
const API_BASE_URL = "http://127.0.0.1:8000";

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    totalUsers: 0,
    totalTrips: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to search page with query
    if (searchQuery.trim()) {
      window.location.href = `/search-rides?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const features = [
    {
      icon: <FaCar aria-hidden="true" />,
      title: "Trajets Sécurisés",
      description:
        "Voyagez en toute sécurité avec des conducteurs vérifiés et des passagers de confiance.",
    },
    {
      icon: <FaUsers aria-hidden="true" />,
      title: "Communauté Active",
      description:
        "Rejoignez une communauté de voyageurs passionnés et partagez vos trajets.",
    },
    {
      icon: <FaMapMarkedAlt aria-hidden="true" />,
      title: "Itinéraires Optimisés",
      description:
        "Trouvez les meilleurs itinéraires et économisez du temps et de l'argent.",
    },
    {
      icon: <FaShieldAlt aria-hidden="true" />,
      title: "Paiements Sécurisés",
      description:
        "Paiements en ligne sécurisés et transparents pour tous vos trajets.",
    },
    {
      icon: <FaClock aria-hidden="true" />,
      title: "Flexibilité Totale",
      description:
        "Planifiez vos trajets à l'avance ou trouvez des covoiturages de dernière minute.",
    },
    {
      icon: <FaStar aria-hidden="true" />,
      title: "Système de Notation",
      description:
        "Évaluez et soyez évalué pour maintenir une communauté de qualité.",
    },
  ];

  const quickActions = [
    {
      icon: <FaSearch aria-hidden="true" />,
      title: "Rechercher un trajet",
      description: "Trouvez des covoiturages disponibles",
      link: "/search-rides",
      color: "primary",
    },
    {
      icon: <FaPlus aria-hidden="true" />,
      title: "Publier un trajet",
      description: "Proposez vos places disponibles",
      link: "/create-ride",
      color: "success",
    },
    {
      icon: <FaComments aria-hidden="true" />,
      title: "Messages",
      description: "Communiquez avec les autres utilisateurs",
      link: "/messages",
      color: "info",
    },
  ];

  return (
    <>
      <div className={`home-page}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <div
            className="container"
            style={{ position: "relative", zIndex: 2 }}
          >
            <div
              className="row align-items-center min-vh-100"
              style={{ marginTop: "76px" }}
            >
              <div className="col-lg-6 fade-in">
                <h1 className="display-4 fw-bold text-white mb-4">
                  Vos destinations,
                  <br />
                  nos solutions.
                </h1>
                <p className="lead text-white-50 mb-5">
                  Rejoignez la communauté de covoiturage la plus dynamique.
                  Partagez vos trajets, faites des économies et rencontrez de
                  nouvelles personnes.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="mb-4"
                  role="search"
                  aria-label="Recherche de trajets"
                >
                  <div className="input-group input-group-lg">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Recherchez un trajet..."
                      aria-label="Recherchez un trajet"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      aria-label="Lancer la recherche"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>

                <div className="hero-buttons">
                  {user ? (
                    <div className="d-flex gap-3 flex-wrap">
                      <Link
                        to="/search-rides"
                        className="btn btn-primary btn-lg"
                        aria-label="Rechercher un trajet"
                      >
                        <FaSearch className="me-2" />
                        Rechercher un trajet
                      </Link>
                      <Link
                        to="/create-ride"
                        className="btn btn-outline-light btn-lg"
                        aria-label="Publier un trajet"
                      >
                        <FaPlus className="me-2" />
                        Publier un trajet
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex gap-3 flex-wrap">
                      <Link
                        to="/register"
                        className="btn btn-primary btn-lg"
                        aria-label="Créer un compte"
                      >
                        Commencer maintenant
                      </Link>
                      <Link
                        to="/login"
                        className="btn btn-outline-light btn-lg"
                        aria-label="Se connecter"
                      >
                        Se connecter
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6 slide-in hero-image" aria-hidden="true">
                {/* Floating cards with improved symmetry */}
                <div
                  className="floating-card card-1"
                  tabIndex={0}
                  title="Nombre de trajets disponibles"
                >
                  <div className="card-body text-center">
                    <FaCar className="text-primary mb-2" size={24} />
                    <h6 className="mb-0">Trajets disponibles</h6>
                    <span className="text-muted">{stats.totalRides}+</span>
                  </div>
                </div>
                <div
                  className="floating-card card-2"
                  tabIndex={0}
                  title="Nombre d'utilisateurs actifs"
                >
                  <div className="card-body text-center">
                    <FaUsers className="text-success mb-2" size={24} />
                    <h6 className="mb-0">Utilisateurs actifs</h6>
                    <span className="text-muted">{stats.totalUsers}+</span>
                  </div>
                </div>
                <div
                  className="floating-card card-3"
                  tabIndex={0}
                  title="Nombre total de trajets effectués"
                >
                  <div className="card-body text-center">
                    <FaMapMarkedAlt className="text-warning mb-2" size={24} />
                    <h6 className="mb-0">Trajets effectués</h6>
                    <span className="text-muted">{stats.totalTrips}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BlaBlaCar Daily Section - Improved alignment */}
        <section className="blablacar-daily-section py-5 bg-light">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-7">
                <h2 className="display-5 fw-bold mb-4 gradient-text">
                  Découvrez CovoiturageApp,
                  <br />
                  l'application de covoiturage quotidien
                </h2>
                <p className="lead text-secondary mb-4">
                  Vous vous rendez au travail, à la salle de sport ou à l'école
                  ?<br />
                  Économisez encore plus en covoiturant avec CovoiturageApp,
                  notre application pour tous vos trajets courts du quotidien.
                  Profitez de nombreux avantages, avec des gains sur chacun de
                  vos trajets et des prix réduits pour les passagers.
                </p>
                <a
                  href="#"
                  className="btn btn-gradient btn-lg px-4 rounded-pill fw-semibold"
                  aria-label="Découvrir CovoiturageApp Daily"
                >
                  Découvrez CovoiturageApp
                </a>
              </div>
              <div className="col-lg-6 col-md-5 text-center">
                <img
                  src={blablacarDaily}
                  alt="CovoiturageApp Daily"
                  className="img-fluid"
                  loading="lazy"
                  style={{ maxHeight: "320px", width: "auto" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section - Improved grid */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="gradient-text mb-3">Actions Rapides</h2>
                <p className="text-muted">
                  Accédez rapidement aux fonctionnalités principales
                </p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {quickActions.map((action, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <Link
                    to={action.link}
                    className="text-decoration-none"
                    tabIndex={0}
                    aria-label={action.title}
                  >
                    <div
                      className="card quick-action-card h-100 shadow-hover"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="card-body text-center p-4">
                        <div className={`action-icon bg-${action.color} mb-3`}>
                          {action.icon}
                        </div>
                        <h5 className="card-title">{action.title}</h5>
                        <p className="card-text text-muted">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Improved 3x2 grid */}
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="gradient-text mb-3">
                  Pourquoi choisir CovoiturageApp ?
                </h2>
                <p className="text-muted">
                  Découvrez les avantages de notre plateforme
                </p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {features.map((feature, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div
                    className="feature-card card h-100 border-0 shadow-hover"
                    tabIndex={0}
                    aria-label={feature.title}
                  >
                    <div className="card-body text-center p-4">
                      <div className="feature-icon mb-3">{feature.icon}</div>
                      <h5 className="card-title">{feature.title}</h5>
                      <p className="card-text text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Improved spacing */}
        <section className="py-5 bg-gradient text-white">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-4 col-md-4 mb-4">
                <div
                  className="stat-item"
                  tabIndex={0}
                  title="Nombre de trajets disponibles"
                >
                  <h2 className="display-4 fw-bold mb-2">
                    {stats.totalRides}+
                  </h2>
                  <p className="mb-0">Trajets disponibles</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 mb-4">
                <div
                  className="stat-item"
                  tabIndex={0}
                  title="Nombre d'utilisateurs actifs"
                >
                  <h2 className="display-4 fw-bold mb-2">
                    {stats.totalUsers}+
                  </h2>
                  <p className="mb-0">Utilisateurs actifs</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 mb-4">
                <div
                  className="stat-item"
                  tabIndex={0}
                  title="Nombre total de trajets effectués"
                >
                  <h2 className="display-4 fw-bold mb-2">
                    {stats.totalTrips}+
                  </h2>
                  <p className="mb-0">Trajets effectués</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Improved centering */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row text-center mb-5">
              <div className="col-12">
                <h2 className="gradient-text">
                  Ce que disent nos utilisateurs
                </h2>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <TestimonialSlider />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Improved button alignment */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="gradient-text mb-4">Prêt à commencer ?</h2>
                <p className="lead text-muted mb-4">
                  Rejoignez notre communauté et commencez à voyager de manière
                  plus économique et écologique.
                </p>
                {user ? (
                  <div className="d-flex justify-content-center">
                    <Link
                      to="/search-rides"
                      className="btn btn-primary btn-lg"
                      aria-label="Rechercher un trajet"
                    >
                      <FaSearch className="me-2" />
                      Rechercher un trajet
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center gap-3">
                    <Link
                      to="/register"
                      className="btn btn-primary btn-lg"
                      aria-label="Créer un compte gratuitement"
                    >
                      Créer un compte gratuitement
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-outline-primary btn-lg"
                      aria-label="Se connecter"
                    >
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Styles */}
      <style>{`
        .home-page {
          padding-top: 0;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        /* Hero Section */
        .hero-section {
          position: relative;
          background: var(--gradient-primary);
          overflow: hidden;
        }
        .hero-background {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url(${heroImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.5);
          transition: filter 0.3s ease;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }
        .hero-image {
          position: relative;
          height: 400px;
          z-index: 2;
        }
        .floating-card {
          position: absolute;
          background: white;
          border-radius: 1rem;
          box-shadow: var(--shadow-lg);
          animation: float 6s ease-in-out infinite;
          width: 140px;
          z-index: 3;
        }
        .floating-card.card-1 {
          top: 8%;
          left: 5%;
          animation-delay: 0s;
        }
        .floating-card.card-2 {
          top: 8%;
          right: 5%;
          animation-delay: 2s;
        }
        .floating-card.card-3 {
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .quick-action-card {
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .quick-action-card:hover,
        .quick-action-card:focus-visible {
          transform: translateY(-8px);
          outline: none;
          box-shadow: 0 0 10px rgba(13, 110, 253, 0.6);
        }
        .action-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.5rem;
        }
        .bg-primary { background-color: #0d6efd; }
        .bg-success { background-color: #198754; }
        .bg-info { background-color: #0dcaf0; }

        .feature-card {
          transition: all 0.3s ease;
          cursor: default;
        }
        .feature-card:hover,
        .feature-card:focus-visible {
          transform: translateY(-8px);
          outline: none;
          box-shadow: 0 0 10px rgba(13, 110, 253, 0.6);
        }
        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 2rem;
        }

        .stat-item {
          padding: 2rem;
          border-radius: 1rem;
          background: rgba(255 255 255 / 0.15);
          transition: background-color 0.3s ease;
          cursor: default;
        }
        .stat-item:hover,
        .stat-item:focus-visible {
          background: rgba(255 255 255 / 0.3);
          outline: none;
        }
        .stat-item h2 {
          color: white;
          font-weight: 700;
        }
        .stat-item p {
          font-weight: 500;
        }

        .bg-gradient {
          background: var(--gradient-primary) !important;
        }
        .blablacar-daily-section {
          background: var(--light-bg);
        }
        .blablacar-daily-section h2 {
          color: var(--primary-color);
          font-family: inherit;
          font-weight: 700;
          letter-spacing: -1px;
        }
        .blablacar-daily-section p {
          color: var(--text-secondary);
          font-size: 1.15rem;
        }
        .blablacar-daily-section .btn-primary {
          background: var(--primary-color);
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 2rem;
          padding: 0.75rem 2.5rem;
          transition: background 0.2s ease;
        }
        .blablacar-daily-section .btn-primary:hover,
        .blablacar-daily-section .btn-primary:focus {
          background: var(--primary-dark);
          outline: none;
        }

        .btn-gradient {
          background: var(--gradient-primary);
          color: #fff !important;
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 2rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: background 0.2s, color 0.2s;
        }
        .btn-gradient:hover,
        .btn-gradient:focus {
          background: var(--gradient-secondary);
          color: #fff !important;
          outline: none;
        }

        .hero-buttons .btn {
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .hero-buttons .btn {
            width: 100%;
            margin-bottom: 1rem;
          }
          .hero-buttons {
            flex-direction: column;
          }
          .floating-card {
            position: relative !important;
            margin-bottom: 1rem;
            animation: none !important;
            width: 100%;
            max-width: 200px;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            bottom: auto !important;
          }
          .hero-image {
            height: auto;
            margin-top: 2rem;
          }
        }
      `}</style>
    </>
  );
};

// Example simple testimonial slider component for social proof
const TestimonialSlider = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      text: "Grâce à CovoiturageApp, j'ai économisé beaucoup sur mes trajets quotidiens et rencontré des gens formidables!",
    },
    {
      name: "Karim B.",
      text: "Application simple et sécurisée, je recommande à tous ceux qui cherchent un covoiturage fiable.",
    },
    {
      name: "Leila T.",
      text: "Le système de notation est très utile, ça rassure quand on réserve un trajet.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <blockquote className="blockquote">
      <p className="mb-4">“{testimonials[currentIndex].text}”</p>
      <footer className="blockquote-footer">
        {testimonials[currentIndex].name}
      </footer>
    </blockquote>
  );
};

export default Home;
