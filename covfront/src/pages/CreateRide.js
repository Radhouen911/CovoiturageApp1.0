"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const CreateRide = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [rideData, setRideData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    available_seats: 1,
    car: "",
    description: "",
    amenities: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: "fas fa-wifi" },
    { id: "music", label: "Musique", icon: "fas fa-music" },
    { id: "non-smoking", label: "Non-fumeur", icon: "fas fa-ban" },
    {
      id: "air-conditioning",
      label: "Climatisation",
      icon: "fas fa-snowflake",
    },
    { id: "pets-allowed", label: "Animaux acceptés", icon: "fas fa-paw" },
    { id: "luggage", label: "Espace bagages", icon: "fas fa-suitcase" },
  ];

  // Redirect if not logged in or not a driver
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (user?.role !== "driver") {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-warning text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Accès restreint</h4>
              <p>Seuls les conducteurs peuvent publier des trajets.</p>
              <button onClick={() => navigate("/")} className="btn btn-primary">
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!rideData.from.trim())
      newErrors.from = "La ville de départ est requise";
    if (!rideData.to.trim()) newErrors.to = "La ville d'arrivée est requise";
    if (!rideData.date) newErrors.date = "La date est requise";
    if (!rideData.time) newErrors.time = "L'heure est requise";
    if (!rideData.price || rideData.price <= 0)
      newErrors.price = "Le prix doit être supérieur à 0";
    if (!rideData.available_seats || rideData.available_seats <= 0) {
      newErrors.available_seats = "Le nombre de places doit être supérieur à 0";
    }
    if (!rideData.car.trim()) newErrors.car = "Le modèle de voiture est requis"; // Added car validation

    // Date validation (cannot be in the past)
    const selectedDate = new Date(rideData.date + "T" + rideData.time);
    const now = new Date();
    if (selectedDate <= now) {
      newErrors.date = "La date et l'heure doivent être dans le futur";
    }

    // Same city validation
    if (
      rideData.from.trim().toLowerCase() === rideData.to.trim().toLowerCase()
    ) {
      newErrors.to =
        "La ville d'arrivée doit être différente de la ville de départ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAmenityChange = (amenityId) => {
    setRideData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Prepare data for API
      const submitData = {
        ...rideData,
        price: Number.parseFloat(rideData.price),
        available_seats: Number.parseInt(rideData.available_seats),
        amenities: rideData.amenities, // Send as array
      };

      console.log("Submitting ride data:", submitData);

      const response = await ApiService.createRide(submitData);

      if (response.success) {
        setSuccessMessage("Trajet créé avec succès !");

        // Reset form
        setRideData({
          from: "",
          to: "",
          date: "",
          time: "",
          price: "",
          available_seats: 1,
          car: "",
          description: "",
          amenities: [],
        });

        // Redirect to profile or search page after a short delay
        setTimeout(() => {
          navigate("/", {
            state: {
              successMessage: "Votre trajet a été publié avec succès !",
            },
          });
        }, 2000);
      } else {
        setErrors({
          form: response.message || "Erreur lors de la création du trajet",
        });
      }
    } catch (error) {
      console.error("Error creating ride:", error);

      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";

      if (error.response?.status === 422) {
        // Validation errors from Laravel
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }
        errorMessage = error.response.data.message || "Données invalides.";
      } else if (error.response?.status === 401) {
        errorMessage = "Vous devez être connecté pour créer un trajet.";
        navigate("/login");
        return;
      } else if (error.response?.status === 403) {
        errorMessage = "Vous n'avez pas l'autorisation de créer un trajet.";
      } else if (
        error.message.includes("NetworkError") ||
        error.code === "ERR_NETWORK"
      ) {
        errorMessage =
          "Erreur de connexion. Vérifiez que le serveur Laravel est en marche.";
      }

      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <style>{`
        .create-ride-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .section-header {
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .amenity-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .amenity-card:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }
        .amenity-card.selected {
          border-color: #007bff;
          background-color: #e7f3ff;
        }
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 5px;
        }
        .success-message {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .form-control.is-invalid {
          border-color: #dc3545;
        }
        .btn-submit {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border: none;
          padding: 12px 30px;
          font-weight: 600;
        }
        .btn-submit:hover {
          background: linear-gradient(135deg, #0056b3, #003d80);
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card create-ride-card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Proposer un trajet
              </h3>
              <small>Partagez votre trajet avec d'autres voyageurs</small>
            </div>
            <div className="card-body p-4">
              {successMessage && (
                <div className="success-message">
                  <i className="fas fa-check-circle me-2"></i>
                  {successMessage}
                </div>
              )}

              {errors.form && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Route Information */}
                  <div className="col-12">
                    <h5 className="text-primary section-header">
                      <i className="fas fa-route me-2"></i>
                      Informations du trajet
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ville de départ *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.from ? "is-invalid" : ""
                      }`}
                      name="from"
                      value={rideData.from}
                      onChange={handleChange}
                      placeholder="Ex: Tunis"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.from && (
                      <div className="error-message">{errors.from}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ville d'arrivée *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.to ? "is-invalid" : ""
                      }`}
                      name="to"
                      value={rideData.to}
                      onChange={handleChange}
                      placeholder="Ex: Sousse"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.to && (
                      <div className="error-message">{errors.to}</div>
                    )}
                  </div>

                  {/* Map Component */}
                  <div className="col-12">
                    <MapComponent
                      from={rideData.from}
                      to={rideData.to}
                      onFromChange={(newFrom) =>
                        setRideData((prev) => ({ ...prev, from: newFrom }))
                      }
                      onToChange={(newTo) =>
                        setRideData((prev) => ({ ...prev, to: newTo }))
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date ? "is-invalid" : ""
                      }`}
                      name="date"
                      value={rideData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.date && (
                      <div className="error-message">{errors.date}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Heure de départ *</label>
                    <input
                      type="time"
                      className={`form-control ${
                        errors.time ? "is-invalid" : ""
                      }`}
                      name="time"
                      value={rideData.time}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.time && (
                      <div className="error-message">{errors.time}</div>
                    )}
                  </div>

                  {/* Pricing and Capacity */}
                  <div className="col-12 mt-4">
                    <h5 className="text-primary section-header">
                      <i className="fas fa-money-bill-wave me-2"></i>
                      Prix et capacité
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Prix par passager (TND) *
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.price ? "is-invalid" : ""
                      }`}
                      name="price"
                      value={rideData.price}
                      onChange={handleChange}
                      placeholder="25"
                      min="1"
                      step="0.5"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.price && (
                      <div className="error-message">{errors.price}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Places disponibles *</label>
                    <select
                      className={`form-select ${
                        errors.available_seats ? "is-invalid" : ""
                      }`}
                      name="available_seats"
                      value={rideData.available_seats}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value={1}>1 place</option>
                      <option value={2}>2 places</option>
                      <option value={3}>3 places</option>
                      <option value={4}>4 places</option>
                      <option value={5}>5 places</option>
                      <option value={6}>6 places</option>
                      <option value={7}>7 places</option>
                    </select>
                    {errors.available_seats && (
                      <div className="error-message">
                        {errors.available_seats}
                      </div>
                    )}
                  </div>

                  {/* Vehicle Information */}
                  <div className="col-12 mt-4">
                    <h5 className="text-primary section-header">
                      <i className="fas fa-car me-2"></i>
                      Informations du véhicule
                    </h5>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Modèle de voiture *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.car ? "is-invalid" : ""
                      }`}
                      name="car"
                      value={rideData.car}
                      onChange={handleChange}
                      placeholder="Ex: Renault Clio, Peugeot 208..."
                      required
                      disabled={isSubmitting}
                    />
                    {errors.car && (
                      <div className="error-message">{errors.car}</div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="col-12 mt-4">
                    <h5 className="text-primary section-header">
                      <i className="fas fa-star me-2"></i>
                      Commodités{" "}
                    </h5>
                    <div className="row g-2">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity.id} className="col-md-4 col-sm-6">
                          <div
                            className={`amenity-card text-center ${
                              rideData.amenities.includes(amenity.id)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              !isSubmitting && handleAmenityChange(amenity.id)
                            }
                          >
                            <i
                              className={`${amenity.icon} fa-lg mb-2 d-block`}
                            ></i>
                            <small className="fw-medium">{amenity.label}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12 mt-4">
                    <label className="form-label">
                      <i className="fas fa-comment me-2"></i>
                      Description (optionnel)
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={rideData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Informations supplémentaires sur votre trajet (points de rendez-vous, préférences, etc.)"
                      disabled={isSubmitting}
                      maxLength="500"
                    ></textarea>
                    <small className="text-muted">
                      {rideData.description.length}/500 caractères
                    </small>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-md-2"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times me-2"></i>
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Publication...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Publier le trajet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRide;
