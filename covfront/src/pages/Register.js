"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    password_confirmation: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "name":
        newErrors.name = !value ? "Nom requis" : "";
        break;
      case "email":
        newErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Email invalide"
          : "";
        break;
      case "phone":
        newErrors.phone =
          value && !/^\+?\d{10,15}$/.test(value.replace(/\s/g, ""))
            ? "Numéro invalide (10 à 15 chiffres)"
            : "";
        break;
      case "role":
        newErrors.role = !value ? "Veuillez choisir un rôle" : "";
        break;
      case "password":
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
        newErrors.password =
          value.length < 8
            ? "Le mot de passe doit contenir au moins 8 caractères"
            : "";
        break;
      case "password_confirmation":
        newErrors.password_confirmation =
          value !== formData.password
            ? "Les mots de passe ne correspondent pas"
            : "";
        break;
      case "acceptTerms":
        newErrors.acceptTerms = !value
          ? "Veuillez accepter les conditions"
          : "";
        break;
      default:
        break;
    }
    return newErrors;
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const messages = [
      { score: 0, message: "Très faible" },
      { score: 1, message: "Faible" },
      { score: 2, message: "Moyen" },
      { score: 3, message: "Fort" },
      { score: 4, message: "Très fort" },
    ];
    return messages.find((m) => m.score === score) || messages[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    const newErrors = validateField(name, newValue);
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(newErrors, fieldErrors);
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData);
      navigate("/profilePage");
    } catch (error) {
      setErrors({
        form: error.message || "Échec de l'inscription. Réessayez.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <style jsx>{`
        .container-fluid {
          padding: 0 12px;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }
        .register-card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          max-width: 380px;
          width: 100%;
        }
        .form-group {
          margin-bottom: 8px;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .btn-register {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(90deg, #007bff, #0056b3);
          color: white;
          font-weight: bold;
          margin-top: 10px;
        }
        .btn-register:hover {
          background: linear-gradient(90deg, #0056b3, #003d80);
        }
        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 0;
          flex-wrap: nowrap;
          white-space: nowrap;
          font-size: 0.9rem;
        }
        .form-check label {
          flex: 1;
          line-height: 1.4;
        }
        .error-message {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .password-strength {
          height: 4px;
          margin-top: 5px;
          border-radius: 2px;
        }
        .strength-0 {
          background-color: #dc3545;
          width: 20%;
        }
        .strength-1 {
          background-color: #dc3545;
          width: 40%;
        }
        .strength-2 {
          background-color: #ffc107;
          width: 60%;
        }
        .strength-3 {
          background-color: #28a745;
          width: 80%;
        }
        .strength-4 {
          background-color: #28a745;
          width: 100%;
        }
        .role-selection {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }
        .role-label {
          font-weight: 500;
          margin-bottom: 6px;
        }
        .role-options {
          display: flex;
          gap: 12px;
        }
        .role-option {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
        }
        .role-option input[type="radio"] {
          margin-right: 6px;
        }
        .role-option span {
          cursor: pointer;
        }
        .role-option span:hover {
          text-decoration: underline;
        }
        .text-center {
          text-align: center;
        }
        .role-option input[type="radio"],
        .role-option span {
          display: inline-block;
          vertical-align: middle;
        }
        .role-option input[type="radio"] {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      `}</style>

      <div className="register-card">
        <h2 className="text-center mb-4">Créer un compte</h2>
        {errors.form && <div className="alert alert-danger">{errors.form}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
              className={errors.name ? "is-invalid" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
              className={errors.email ? "is-invalid" : ""}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+216..."
              required
              className={errors.phone ? "is-invalid" : ""}
            />
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </div>

          <div className="form-group role-selection">
            <label className="role-label">Vous êtes :</label>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData.role === "driver"}
                  onChange={handleChange}
                />
                <span>Conducteur</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="passenger"
                  checked={formData.role === "passenger"}
                  onChange={handleChange}
                />
                <span>Passager</span>
              </label>
            </div>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? "is-invalid" : ""}
            />
            {errors.password ? (
              <div className="error-message">{errors.password}</div>
            ) : (
              <div>
                <div
                  className={`password-strength strength-${passwordStrength.score}`}
                ></div>
                <small className="text-muted">
                  Force : {passwordStrength.message}
                </small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className={errors.password_confirmation ? "is-invalid" : ""}
            />
            {errors.password_confirmation && (
              <div className="error-message">
                {errors.password_confirmation}
              </div>
            )}
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms">
              J'accepte les <Link to="/conditions">termes et conditions</Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <div className="error-message">{errors.acceptTerms}</div>
          )}

          <button
            type="submit"
            className="btn-register"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création..." : "Créer un compte"}
          </button>

          <div className="text-center mt-3">
            <small>
              Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
