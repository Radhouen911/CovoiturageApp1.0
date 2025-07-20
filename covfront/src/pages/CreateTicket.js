"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const CreateTicket = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    ride_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!isLoggedIn || !user) {
      setError("Veuillez vous connecter pour créer un ticket.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await ApiService.createTicket({
        ride_id: formData.ride_id || null,
        subject: formData.subject,
        description: formData.description,
        // priority and status are defaulted on the backend
      });

      if (response.success) {
        setSuccess("Ticket créé avec succès !");
        setFormData({ subject: "", description: "", ride_id: "" });
        setTimeout(() => navigate("/my-tickets"), 2000); // Navigate to user's tickets
      } else {
        setError(response.message || "Échec de la création du ticket.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            padding: "3rem 2rem",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2
            style={{
              color: "#2d3748",
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Authentification Requise
          </h2>
          <p style={{ color: "#718096", marginBottom: "2rem" }}>
            Veuillez vous connecter pour soumettre une réclamation.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "0.875rem 2rem",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Aller à la Connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "600px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
          }}
        />
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              color: "#2d3748",
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            Soumettre une Réclamation
          </h1>
          <p style={{ color: "#718096", fontSize: "1rem", lineHeight: "1.5" }}>
            Nous sommes là pour aider à résoudre les problèmes que vous avez
            rencontrés.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontWeight: "500",
              backgroundColor: "#fed7d7",
              color: "#c53030",
              border: "1px solid #feb2b2",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <div style={{ marginRight: "0.75rem", fontSize: "1.2rem" }}>❌</div>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontWeight: "500",
              backgroundColor: "#c6f6d5",
              color: "#2f855a",
              border: "1px solid #9ae6b4",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <div style={{ marginRight: "0.75rem", fontSize: "1.2rem" }}>✅</div>
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="subject"
              style={{
                color: "#2d3748",
                fontWeight: "600",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Sujet *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              style={{
                padding: "0.875rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                backgroundColor: "#f7fafc",
              }}
              placeholder="Brève description de votre problème"
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="description"
              style={{
                color: "#2d3748",
                fontWeight: "600",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                padding: "0.875rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                backgroundColor: "#f7fafc",
                resize: "vertical",
                minHeight: "120px",
                fontFamily: "inherit",
              }}
              placeholder="Veuillez fournir des informations détaillées sur votre réclamation..."
              rows="6"
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="ride_id"
              style={{
                color: "#2d3748",
                fontWeight: "600",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              ID de Trajet{" "}
              <span
                style={{
                  color: "#718096",
                  fontWeight: "400",
                  fontSize: "0.85rem",
                }}
              >
                (facultatif)
              </span>
            </label>
            <input
              type="text"
              id="ride_id"
              name="ride_id"
              value={formData.ride_id}
              onChange={handleChange}
              style={{
                padding: "0.875rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                backgroundColor: "#f7fafc",
              }}
              placeholder="Entrez l'ID de trajet si la réclamation est liée à un trajet spécifique"
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              style={{
                padding: "0.875rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                flex: 1,
                backgroundColor: "#edf2f7",
                color: "#4a5568",
                border: "1px solid #e2e8f0",
              }}
              onClick={() => navigate("/profile")}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#e2e8f0";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#edf2f7";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "0.875rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                flex: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid transparent",
                      borderTop: "2px solid currentColor",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Soumission en cours...
                </>
              ) : (
                "Soumettre la Réclamation"
              )}
            </button>
          </div>
        </form>
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p style={{ color: "#4a5568", fontSize: "0.95rem", marginBottom: 0 }}>
            Vous avez une réclamation existante ? Consultez vos tickets ici :
          </p>
          <button
            type="button"
            style={{
              width: "auto",
              minWidth: "200px",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              backgroundColor: "#edf2f7",
              color: "#4a5568",
              border: "1px solid #e2e8f0",
            }}
            onClick={() => navigate("/my-tickets")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e2e8f0";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#edf2f7";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Consulter Mes Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
