"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i
            className="fas fa-car text-primary me-2"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="fw-bold">CovoitureAPP</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                <i className="fas fa-search me-1"></i>
                Rechercher
              </Link>
            </li>
            {isLoggedIn && user?.role === "driver" && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-ride">
                  <i className="fas fa-plus me-1"></i>
                  Publier un trajet
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">
                    <i className="fas fa-comments me-1"></i>
                    Messages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myRides">
                    <i className="fas fa-user me-1"></i>
                    Mes trajets
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NotificationBell />
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="d-none d-md-inline">{user?.name}</span>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profilePage">
                        <i className="fas fa-user me-2"></i>
                        Mon profil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/messages">
                        <i className="fas fa-comments me-2"></i>
                        Messages
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/notifications">
                        <i className="fas fa-bell me-2"></i>
                        Notifications
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/register">
                    S'inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
