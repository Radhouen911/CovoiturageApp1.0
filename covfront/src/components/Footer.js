import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'À propos', href: '/about' },
      { name: 'Notre équipe', href: '/team' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Presse', href: '/press' }
    ],
    services: [
      { name: 'Rechercher un trajet', href: '/search-rides' },
      { name: 'Publier un trajet', href: '/create-ride' },
      { name: 'Messages', href: '/messages' },
      { name: 'Notifications', href: '/notifications' }
    ],
    support: [
      { name: 'Centre d\'aide', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Sécurité', href: '/safety' },
      { name: 'Signaler un problème', href: '/report' }
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Mentions légales', href: '/legal' }
    ]
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="row g-4 mb-5">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-section">
              <div className="footer-brand mb-4">
                <FaCar className="me-2" size={24} />
                <span className="gradient-text fw-bold fs-4">CovoiturageApp</span>
              </div>
              <div className="contact-info mb-4">
                <div className="contact-item d-flex align-items-center">
                  <FaEnvelope className="me-2 text-primary" />
                  <span className="text-white">contact@covoiturageapp.com</span>
                </div>
                <div className="contact-item d-flex align-items-center">
                  <FaPhone className="me-2 text-primary" />
                  <span className="text-white">+216 28 402 298</span>
                </div>
                <div className="contact-item d-flex align-items-center">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  <span className="text-white">123 Rue de l'environnement, Korba, Tunisie</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Entreprise</h5>
              <ul className="footer-links">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Services</h5>
              <ul className="footer-links">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Légal</h5>
              <ul className="footer-links">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>



     

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-white">
                © {currentYear} CovoiturageApp. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 text-white">
                Fait avec <FaHeart className="text-danger" /> en Tunisie
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style>{`
        .footer {
          background: var(--dark-bg);
          color: white;
          padding: 4rem 0 2rem;
          margin-top: auto;
          position: relative;
          z-index: 1;
        }

        .footer-section {
          margin-bottom: 2rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
        }

        .footer-title {
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 2rem;
          height: 2px;
          background: var(--gradient-primary);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .contact-item {
          margin-bottom: 0.25rem;
        }

        .contact-item:last-child {
          margin-bottom: 0;
        }

        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .footer-link:hover {
          color: var(--primary-color);
          transform: translateX(0.25rem);
        }

        .footer-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--primary-color);
          transition: width 0.3s ease;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .contact-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
        }

        .contact-icon {
          font-size: 2rem;
          color: var(--primary-color);
        }

        .newsletter-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 2rem;
        }

        .newsletter-form .input-group {
          box-shadow: var(--shadow-md);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .newsletter-form .form-control {
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .newsletter-form .form-control::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .newsletter-form .btn {
          border-radius: 0;
          padding: 0.75rem 1.5rem;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .footer-bottom p {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2rem 0 1rem;
          }
          
          .footer-section {
            text-align: center;
            margin-bottom: 1.5rem;
          }
          
          .contact-section,
          .newsletter-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
