import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/images/avatar.jpg";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const ProfilePage = () => {
  const { user, logout, isLoggedIn, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return;

      if (!ApiService.isAuthenticated() || !isLoggedIn) {
        navigate("/login");
        return;
      }

      try {
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("Erreur de vérification de l'authentification");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isLoggedIn, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container py-4">
      <style jsx>{`
        .profile-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .avatar-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card profile-card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Profil de {user?.name}</h2>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Déconnexion
                </button>
              </div>
              <div className="row align-items-center">
                <div className="col-md-4 text-center mb-3">
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt={user?.name || "Profil"}
                    className="rounded-circle avatar-img"
                  />
                </div>
                <div className="col-md-8">
                  <p>
                    <i className="fas fa-envelope me-2"></i>
                    {user?.email}
                  </p>
                  <p>
                    <i className="fas fa-phone me-2"></i>
                    {user?.phone || "Non spécifié"}
                  </p>
                  <p>
                    <i className="fas fa-user me-2"></i>
                    Rôle: {user?.role === "driver" ? "Conducteur" : "Passager"}
                  </p>
                  {user?.rating && (
                    <p>
                      <i className="fas fa-star me-2"></i>
                      Note: {user.rating} ({user.total_ratings} avis)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
