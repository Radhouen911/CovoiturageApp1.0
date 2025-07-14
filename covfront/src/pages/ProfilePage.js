import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/images/avatar.jpg";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

const ProfilePage = () => {
  const { user, logout, isLoggedIn, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef();
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

  useEffect(() => {
    if (user) {
      setEditData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const response = await ApiService.updateProfile(editData);
      if (response.success) {
        setEditSuccess("Profil mis à jour avec succès !");
        setShowEditModal(false);
        window.location.reload(); // Reload to update user context
      } else {
        setEditError(response.message || "Erreur lors de la mise à jour du profil");
      }
    } catch (err) {
      setEditError("Erreur lors de la mise à jour du profil");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    setAvatarError("");
    try {
      await ApiService.uploadAvatar(file);
      window.location.reload();
    } catch (err) {
      setAvatarError("Erreur lors du téléchargement de l'avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Supprimer la photo de profil ?")) return;
    setAvatarLoading(true);
    setAvatarError("");
    try {
      await ApiService.deleteAvatar();
      window.location.reload();
    } catch (err) {
      setAvatarError("Erreur lors de la suppression de l'avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-5 text-center">
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
    <div className="container py-5">
      <style>{`
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
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1050;
        }
        .modal-content {
          border-radius: 1rem;
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card profile-card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Profil de {user?.name}</h2>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Modifier le profil
                  </button>
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
              </div>
              <div className="row align-items-center">
                <div className="col-md-4 text-center mb-3">
                  <img
                    src={user?.avatar ? `${API_BASE_URL}/storage/${user.avatar}` : defaultAvatar}
                    alt={user?.name || "Profil"}
                    className="rounded-circle avatar-img"
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      disabled={avatarLoading}
                    />
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={avatarLoading}
                    >
                      {avatarLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="fas fa-upload me-1"></i>
                      )}
                      {user?.avatar ? "Changer" : "Ajouter"} photo
                    </button>
                    {user?.avatar && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleAvatarDelete}
                        disabled={avatarLoading}
                      >
                        <i className="fas fa-trash me-1"></i> Supprimer
                      </button>
                    )}
                  </div>
                  {avatarError && <div className="text-danger small mt-1">{avatarError}</div>}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 2000 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modifier le profil</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                    disabled={editLoading}
                  ></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    {editError && (
                      <div className="alert alert-danger">{editError}</div>
                    )}
                    {editSuccess && (
                      <div className="alert alert-success">{editSuccess}</div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        required
                        disabled={editLoading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        required
                        disabled={editLoading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        disabled={editLoading}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                      disabled={editLoading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : null}
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
