"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "email":
        newErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Email invalide"
          : "";
        break;
      case "password":
        newErrors.password =
          value.length < 6
            ? "Le mot de passe doit comporter au moins 6 caractères"
            : "";
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    const newErrors = validateField(name, newValue);
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      console.log("Starting login process with credentials:", {
        email: formData.email,
        password: formData.password,
      });

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response);

      if (response.success) {
        navigate("/");
      } else {
        setErrors({
          form: response.message || "Erreur de connexion",
        });
      }
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";

      if (error.response?.status === 404) {
        errorMessage =
          "Endpoint non trouvé. Vérifiez l'URL de l'API (/api/login).";
      } else if (error.response?.status === 401) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }
        errorMessage = error.response.data.message || "Données invalides.";
      } else if (error.response?.status === 500) {
        errorMessage = "Erreur serveur. Vérifiez les logs Laravel.";
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("Failed to fetch") ||
        error.code === "ERR_NETWORK"
      ) {
        errorMessage =
          "Erreur de connexion. Vérifiez que le serveur Laravel est en marche sur http://localhost:8000";
      }

      setErrors({
        form: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 page-container">
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          /* min-height: calc(100vh - 80px); */
        }
        .welcome-text {
          flex: 1;
          padding: 20px;
          max-width: 500px;
        }
        .form-card {
          flex: 1;
          max-width: 400px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        .form-card input {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          width: 100%;
          margin-bottom: 10px;
        }
        .btn-login {
          background: linear-gradient(90deg, #007bff, #0056b3);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
          width: 100%;
          transition: background 0.3s ease;
        }
        .btn-login:hover {
          background: linear-gradient(90deg, #0056b3, #003d80);
        }
        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-check.remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }
        .form-check.remember-me input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin: 0;
        }
        .form-check.remember-me label {
          margin: 0;
          font-size: 0.95rem;
        }
        .btn-outline:hover {
          background: #e6f0fa;
        }
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 5px;
          text-align: left;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6c757d;
        }
        .password-toggle:hover {
          color: #007bff;
        }
        .form-group {
          position: relative;
          margin-bottom: 15px;
        }
        .form-check-input {
          width: auto !important;
        }
        .form-check {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .alert {
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid transparent;
          border-radius: 4px;
        }
        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
        }
        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
      `}</style>

      <div className="login-container fade-in">
        <div className="form-card">
          <h2 className="h5 mb-4">Bienvenue</h2>
          {location.state?.successMessage && (
            <div className="alert alert-success" role="alert">
              {location.state.successMessage}
            </div>
          )}
          {errors.form && (
            <div className="alert alert-danger" role="alert">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-labelledby="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                required
                disabled={isSubmitting}
                className={errors.email ? "is-invalid" : ""}
                aria-describedby={errors.email ? "emailError" : null}
              />
              {errors.email && (
                <div id="emailError" className="error-message">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                required
                disabled={isSubmitting}
                className={errors.password ? "is-invalid" : ""}
                aria-describedby={errors.password ? "passwordError" : null}
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle`}
                onClick={() => !isSubmitting && setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                role="button"
                tabIndex="0"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isSubmitting &&
                  setShowPassword(!showPassword)
                }
                style={
                  isSubmitting ? { pointerEvents: "none", opacity: 0.5 } : {}
                }
              ></i>
              {errors.password && (
                <div id="passwordError" className="error-message">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-check remember-me">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <label htmlFor="rememberMe" className="form-check-label">
                Rester connecté
              </label>
            </div>

            <div className="d-grid mt-3">
              <button
                type="submit"
                className="btn-login"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>

            <div className="text-center mt-3">
              <small>
                Pas encore inscrit ? <Link to="/register">S'inscrire</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
