import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaHome, FaSearch, FaCar, FaComments, FaUserFriends } from 'react-icons/fa';

const API_BASE_URL = "http://127.0.0.1:8000";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadNotifications();
    }
  }, [user]);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: <FaHome /> },
    { path: '/search-rides', label: 'Rechercher', icon: <FaSearch /> },
    { path: '/my-rides', label: 'Trajets', icon: <FaCar /> },
    { path: '/messages', label: 'Messages', icon: <FaComments /> },
    { path: '/profile', label: 'Profil', icon: <FaUserFriends /> }
  ];

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand gradient-text" to="/">
          <FaCar className="me-2" />
          CovoiturageApp
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User Menu */}
          {user ? (
            <div className="navbar-nav ms-auto">
              {/* Notifications */}
              <div className="nav-item dropdown me-3">
                <Link
                  className="nav-link position-relative"
                  to="/notifications"
                  title="Notifications"
                >
                  <FaBell className="fs-5" />
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Profile Dropdown */}
              <div className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                  type="button"
                  id="userDropdown"
                  aria-expanded={showDropdown}
                >
                  <div className="user-avatar me-2">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.name}
                        className="img-avatar"
                        width="32"
                        height="32"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <span className="user-name d-none d-md-inline">{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu show" aria-labelledby="userDropdown">
                    <div className="dropdown-header">
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-3">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              alt={user.name}
                              className="img-avatar"
                              width="40"
                              height="40"
                            />
                          ) : (
                            <div className="avatar-placeholder large">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <div className="text-muted small">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser className="me-2" />
                      Mon Profil
                    </Link>
                    <Link className="dropdown-item" to="/settings">
                      <FaCog className="me-2" />
                      Paramètres
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/login">
                Se connecter
              </Link>
              <Link className="btn btn-primary ms-2" to="/register">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Styles */}
      <style>{`
        .navbar {
          transition: all 0.3s ease;
          padding: 1rem 0;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-text {
          display: none;
        }

        @media (min-width: 992px) {
          .nav-text {
            display: inline;
          }
        }

        .user-avatar {
          position: relative;
        }

        .avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .avatar-placeholder.large {
          width: 40px;
          height: 40px;
          font-size: 1rem;
        }

        .dropdown-menu {
          border: none;
          border-radius: 1rem;
          box-shadow: var(--shadow-xl);
          padding: 0.5rem;
          min-width: 280px;
          margin-top: 0.5rem;
        }

        .dropdown-header {
          padding: 1rem;
          background: var(--light-bg);
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .dropdown-item {
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .dropdown-item:hover {
          background: var(--light-bg);
          transform: translateX(4px);
        }

        .dropdown-divider {
          margin: 0.5rem 0;
          border-color: var(--border-color);
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .navbar-toggler {
          border: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .navbar-toggler:focus {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(37, 99, 235, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: white;
            border-radius: 1rem;
            margin-top: 1rem;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
          }

          .navbar-nav {
            gap: 0.5rem;
          }

          .nav-link {
            padding: 0.75rem 1rem !important;
            border-radius: 0.5rem;
          }

          .nav-link:hover {
            background: var(--light-bg);
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;
