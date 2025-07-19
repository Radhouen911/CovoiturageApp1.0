import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultAvatar from "../assets/images/avatar.jpg";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({ seats_booked: 1 });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  const loadRideDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ApiService.getRideDetails(id);
      if (response.success) {
        setRide(response.data);
      } else {
        setError(response.message || "Trajet non trouvé");
      }
    } catch (error) {
      console.error("Erreur chargement trajet:", error);
      setError(error.response?.data?.message || "Erreur chargement trajet");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!ApiService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadRideDetails();
  }, [id, navigate, loadRideDetails]);

  const handleBookingChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const simulatePayment = () => {
    console.log("Simulating payment with card details:", cardDetails);
    const cleanNumber = cardDetails.number.replace(/\D/g, "");
    if (!cleanNumber) {
      console.log("Validation failed: Card number is required");
      return null;
    }
    if (!cardDetails.expiry || !cardDetails.cvc) {
      console.log("Validation failed: Expiry and CVC are required");
      return null;
    }

    const mockId = `pm_${cleanNumber.slice(-4)}_${Date.now()}`;
    console.log("Payment simulated with mock payment method ID:", mockId);
    return mockId;
  };

  const handleBooking = async () => {
    if (!isLoggedIn || !ApiService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (user?.role !== "passenger") {
      setBookingError("Seuls les passengers peuvent réserver des trajets");
      return;
    }

    if (user?.id === ride?.driver?.id) {
      setBookingError("Vous ne pouvez pas réserver votre propre trajet");
      return;
    }

    if (bookingData.seats_booked > ride.remaining_seats) {
      setBookingError(
        "Nombre de places demandé dépasse les places disponibles"
      );
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      console.log("Starting booking process with:", {
        bookingData,
        cardDetails,
      });

      const paymentMethodId = simulatePayment();
      if (!paymentMethodId) {
        setBookingError(
          "Le paiement a échoué. Remplissez les champs de la carte."
        );
        return;
      }

      const intent = await ApiService.createPaymentIntent(id);
      console.log("Payment Intent:", intent);

      const confirmation = await ApiService.confirmPayment({
        payment_intent_id: intent.data.id,
        amount: bookingData.seats_booked * ride.price * 100,
      });
      console.log("Payment Confirmation:", confirmation);

      if (confirmation.data.status !== "succeeded") {
        setBookingError("Échec de la confirmation du paiement");
        return;
      }

      const bookingPayload = {
        ...bookingData,
        payment_method_id: paymentMethodId, // now it's guaranteed to exist
      };

      const response = await ApiService.bookRide(id, bookingPayload);
      console.log("Booking Response:", response);

      if (response.success) {
        setShowBookingModal(false);
        navigate("/profilePage", {
          state: {
            successMessage:
              "Demande de réservation envoyée ! En attente de confirmation.",
          },
        });
      } else {
        setBookingError(response.message || "Erreur lors de la réservation");
      }
    } catch (error) {
      console.error(
        "Erreur réservation:",
        error.response?.data || error.message
      );
      setBookingError(
        error.response?.data?.message || "Erreur lors de la réservation"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleContactDriver = async () => {
    if (!isLoggedIn || !ApiService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      const response = await ApiService.createConversation(
        ride.driver.id,
        ride.id
      );
      if (response.success) {
        navigate("/messages");
      }
    } catch (error) {
      console.error("Erreur création conversation:", error);
      setError(error.response?.data?.message || "Erreur création conversation");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: "fas fa-wifi",
      music: "fas fa-music",
      "non-smoking": "fas fa-ban",
      "air-conditioning": "fas fa-snowflake",
      "pets-allowed": "fas fa-paw",
      luggage: "fas fa-suitcase",
    };
    return icons[amenity] || "fas fa-check";
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des détails du trajet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Erreur</h4>
              <p>{error}</p>
              <button
                onClick={() => navigate("/search")}
                className="btn btn-primary"
              >
                Retour à la recherche
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ride) {
    return null;
  }

  const amenitiesList = Array.isArray(ride.amenities) ? ride.amenities : [];
  const totalPrice = bookingData.seats_booked * ride.price;

  return (
    <div className="container py-4">
      <style>{`
        .ride-details-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .price-display {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
        .booking-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
        }
        .driver-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
        }
        .amenity-badge {
          font-size: 0.85rem;
          padding: 6px 12px;
          margin: 2px;
        }
        .card-input {
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 8px;
          width: 100%;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card ride-details-card">
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-8">
                  <h2 className="mb-3">
                    {ride.from}{" "}
                    <i className="fas fa-arrow-right text-primary mx-2"></i>{" "}
                    {ride.to}
                  </h2>
                  <div className="d-flex align-items-center text-muted mb-2">
                    <i className="fas fa-calendar me-2"></i>
                    <span className="me-4">{formatDate(ride.date)}</span>
                    <i className="fas fa-clock me-2"></i>
                    <span>{formatTime(ride.time)}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="price-display">
                    <span className="display-6 fw-bold">{ride.price} TND</span>
                    <div>par personne</div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <h4 className="mb-3">Conducteur</h4>
                  <div className="driver-card">
                    <div className="d-flex align-items-center">
                      <img
                        src={ride.driver?.avatar || defaultAvatar}
                        alt={ride.driver?.name || "Conducteur"}
                        className="rounded-circle me-3"
                        width="80"
                        height="80"
                      />
                      <div>
                        <h5 className="mb-1">
                          {ride.driver?.name || "Conducteur"}
                        </h5>
                        {ride.driver?.rating && (
                          <div className="text-warning mb-1">
                            {"★".repeat(Math.floor(ride.driver.rating))}
                            <span className="text-muted ms-1">
                              ({ride.driver.rating})
                            </span>
                          </div>
                        )}
                        {ride.driver?.phone && (
                          <small className="text-muted d-block">
                            <i className="fas fa-phone me-1"></i>
                            {ride.driver.phone}
                          </small>
                        )}
                      </div>
                    </div>
                    {ride.driver?.bio && (
                      <p className="mt-3 mb-0 text-muted">{ride.driver.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Véhicule</h5>
                  {ride.car && (
                    <p>
                      <i className="fas fa-car me-2"></i>
                      {ride.car}
                    </p>
                  )}
                  <p>
                    <i className="fas fa-users me-2"></i>
                    {ride.remaining_seats} places disponibles
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Équipements</h5>
                  <div className="d-flex flex-wrap">
                    {amenitiesList.length > 0 ? (
                      amenitiesList.map((amenity, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark amenity-badge"
                        >
                          <i
                            className={`${getAmenityIcon(amenity.trim())} me-1`}
                          ></i>
                          {amenity.trim().replace("-", " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">
                        Aucun équipement spécifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {ride.description && (
                <div className="mb-4">
                  <h5>Description du trajet</h5>
                  <p className="text-muted">{ride.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card booking-card">
            <div className="card-body">
              <h5 className="card-title">Réserver ce trajet</h5>
              {ride.remaining_seats === 0 ? (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Ce trajet est complet
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Prix par personne:</span>
                      <strong>{ride.price} TND</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Places disponibles:</span>
                      <strong>{ride.remaining_seats}</strong>
                    </div>
                  </div>
                  {isLoggedIn &&
                  user?.role === "passenger" &&
                  user?.id !== ride?.driver?.id ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nombre de places</label>
                        <select
                          className="form-select"
                          value={bookingData.seats_booked}
                          onChange={(e) =>
                            handleBookingChange(
                              "seats_booked",
                              Number.parseInt(e.target.value)
                            )
                          }
                        >
                          {[...Array(Math.min(ride.remaining_seats, 4))].map(
                            (_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1} place{i > 0 ? "s" : ""}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Total:</span>
                          <strong className="text-primary">
                            {totalPrice} TND
                          </strong>
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={() => setShowBookingModal(true)}
                          disabled={
                            ride.remaining_seats === 0 || bookingLoading
                          }
                        >
                          Demander à rejoindre
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={handleContactDriver}
                          disabled={bookingLoading}
                        >
                          <i className="fas fa-comment me-2"></i>
                          Contacter le conducteur
                        </button>
                      </div>
                    </>
                  ) : isLoggedIn &&
                    (user?.role !== "passenger" ||
                      user?.id === ride?.driver?.id) ? (
                    <div className="alert alert-info">
                      <small>
                        {user?.role !== "passenger"
                          ? "Seuls les passengers peuvent réserver des trajets"
                          : "Vous ne pouvez pas réserver votre propre trajet"}
                      </small>
                    </div>
                  ) : (
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/login")}
                      >
                        Se connecter pour réserver
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la demande et payer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBookingModal(false)}
                  disabled={bookingLoading}
                ></button>
              </div>
              <div className="modal-body">
                {bookingError && (
                  <div className="alert alert-danger">{bookingError}</div>
                )}
                <p>
                  Vous êtes sur le point de demander à rejoindre ce trajet :
                </p>
                <div className="card bg-light">
                  <div className="card-body">
                    <strong>
                      {ride.from} → {ride.to}
                    </strong>
                    <br />
                    {formatDate(ride.date)} à {formatTime(ride.time)}
                    <br />
                    <strong>Places demandées:</strong>{" "}
                    {bookingData.seats_booked}
                    <br />
                    <strong>Prix total:</strong> {totalPrice} TND
                  </div>
                </div>
                <div className="mt-3">
                  <h6>Détails de la carte</h6>
                  <input
                    type="text"
                    className="card-input"
                    placeholder="Numéro de carte (ex: 4242-4242-4242-4242)"
                    value={cardDetails.number}
                    onChange={(e) => handleCardChange("number", e.target.value)}
                  />
                  <input
                    type="text"
                    className="card-input"
                    placeholder="Expiration (MM/YY)"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardChange("expiry", e.target.value)}
                  />
                  <input
                    type="text"
                    className="card-input"
                    placeholder="CVC"
                    value={cardDetails.cvc}
                    onChange={(e) => handleCardChange("cvc", e.target.value)}
                  />
                  <small className="text-muted">
                    Utilisez n'importe quel numéro, date future (MM/YY), et CVC
                    de 3 chiffres pour la simulation.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBookingModal(false)}
                  disabled={bookingLoading}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Envoi...
                    </>
                  ) : (
                    "Payer et envoyer la demande"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideDetails;
