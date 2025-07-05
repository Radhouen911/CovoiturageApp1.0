import { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const MyRidesPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("User:", user);
    const checkAuth = async () => {
      if (authLoading) return;

      if (!ApiService.isAuthenticated() || !isLoggedIn) {
        navigate("/login");
        return;
      }

      try {
        if (location.state?.successMessage) {
          setSuccess(location.state.successMessage);
          setTimeout(() => setSuccess(""), 3000);
        }
        await Promise.all([
          loadUserData(),
          user?.role === "driver" ? loadBookingRequests() : Promise.resolve(),
          user?.role === "driver" ? loadMyRides() : Promise.resolve(),
        ]);
        forceUpdate();
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("Erreur de vérification de l'authentification");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, isLoggedIn, authLoading, location.state, navigate]);

  const loadUserData = async () => {
    try {
      setError("");
      const response = await ApiService.getMyBookings();
      console.log("Bookings response:", response);
      if (response.success) {
        setBookings([...(response.data.data || [])]);
      } else {
        setError(response.message || "Erreur chargement réservations");
      }
    } catch (error) {
      console.error("Load bookings error:", error);
      setError(
        error.response?.data?.message || "Erreur chargement réservations"
      );
    }
  };

  const loadBookingRequests = async () => {
    try {
      setError("");
      console.log("Fetching booking requests...");
      const response = await ApiService.getBookingRequests();
      console.log("Full API response:", response);
      const requests = response.data?.data || response.data || [];
      console.log("Parsed requests:", requests);
      setBookingRequests((prev) => {
        const newRequests = [...requests];
        console.log("Setting bookingRequests to:", newRequests);
        return newRequests;
      });
      forceUpdate();
    } catch (error) {
      console.error("Load booking requests error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(error.response?.data?.message || "Erreur chargement demandes");
      setBookingRequests([]);
    }
  };

  const loadMyRides = async () => {
    try {
      setError("");
      const response = await ApiService.getMyRides();
      console.log("My rides response:", response);
      if (response.success) {
        const rides = response.data.data || [];
        console.log("Setting myRides:", rides);
        setMyRides(rides.filter((ride) => ride && ride.id));
      } else {
        setError(response.message || "Erreur chargement trajets");
      }
    } catch (error) {
      console.error("Load rides error:", error);
      setError(error.response?.data?.message || "Erreur chargement trajets");
    }
  };

  const handleAccept = async (id) => {
    try {
      setError("");
      const response = await ApiService.acceptBooking(id);
      if (response.success) {
        await Promise.all([
          loadBookingRequests(),
          loadUserData(),
          loadMyRides(),
        ]);
        setSuccess("Demande acceptée avec succès");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Erreur lors de l'acceptation");
      }
    } catch (error) {
      console.error("Accept booking error:", error);
      setError(error.response?.data?.message || "Erreur lors de l'acceptation");
    }
  };

  const handleReject = async (id) => {
    try {
      setError("");
      const response = await ApiService.rejectBooking(id);
      if (response.success) {
        await Promise.all([
          loadBookingRequests(),
          loadUserData(),
          loadMyRides(),
        ]);
        setSuccess("Demande rejetée avec succès");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error("Reject booking error:", error);
      setError(error.response?.data?.message || "Erreur lors du rejet");
    }
  };

  const handleCancel = async (id) => {
    try {
      setError("");
      const response = await ApiService.cancelBooking(id);
      if (response.success) {
        await loadUserData();
        setSuccess("Réservation annulée avec succès");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Erreur lors de l'annulation");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      setError(error.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

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
        .booking-card,
        .ride-card {
          border-radius: 10px;
          margin-bottom: 15px;
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
              ></button>
            </div>
          )}
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

          {user?.role === "driver" && (
            <>
              <div className="mb-4">
                <h3>Mes trajets</h3>
                {myRides.length > 0 ? (
                  myRides.map((ride) =>
                    ride ? (
                      <div key={ride.id} className="card ride-card">
                        <div className="card-body">
                          <h5>
                            {ride.from} → {ride.to}
                          </h5>
                          <p>
                            <i className="fas fa-calendar me-2"></i>
                            {new Date(ride.date).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            à{" "}
                            {new Date(
                              `2000-01-01T${ride.time}`
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p>
                            <i className="fas fa-car me-2"></i>
                            Véhicule: {ride.car}
                          </p>
                          <p>
                            <i className="fas fa-users me-2"></i>
                            Places disponibles: {ride.available_seats}/
                            {ride.total_seats}
                          </p>
                          <p>
                            <i className="fas fa-money-bill me-2"></i>
                            Prix par personne: {ride.price} TND
                          </p>
                          <p>
                            <i className="fas fa-info-circle me-2"></i>
                            Statut:{" "}
                            {ride.status === "active" ? "Actif" : ride.status}
                          </p>
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-muted">Aucun trajet publié.</p>
                )}
              </div>

              <div className="mb-4">
                <h3>Demandes de réservation en attente</h3>
                <p>Nombre de demandes: {bookingRequests.length}</p>
                {bookingRequests.length > 0 ? (
                  bookingRequests.map((request) => (
                    <div key={request.id} className="card booking-card">
                      <div className="card-body">
                        <h5>
                          {request.ride?.from || "N/A"} →{" "}
                          {request.ride?.to || "N/A"}
                        </h5>
                        <p>
                          <i className="fas fa-calendar me-2"></i>
                          {request.ride?.date
                            ? new Date(request.ride.date).toLocaleDateString(
                                "fr-FR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}{" "}
                          à{" "}
                          {request.ride?.time
                            ? new Date(
                                `2000-01-01T${request.ride.time}`
                              ).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                        <p>
                          <i className="fas fa-user me-2"></i>
                          Passager: {request.passenger?.name || "N/A"}
                        </p>
                        <p>
                          <i className="fas fa-users me-2"></i>
                          Places demandées: {request.seats_booked || "N/A"}
                        </p>
                        <p>
                          <i className="fas fa-money-bill me-2"></i>
                          Total: {request.total_price || "N/A"} TND
                        </p>
                        <p>
                          <i className="fas fa-info-circle me-2"></i>
                          Statut: {request.status || "N/A"}
                        </p>
                        {request.status === "pending" && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success"
                              onClick={() => handleAccept(request.id)}
                            >
                              Accepter
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleReject(request.id)}
                            >
                              Rejeter
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    Aucune demande de réservation en attente.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h3>Historique des demandes de réservation</h3>
                {myRides.flatMap((ride) =>
                  (ride.bookings || []).filter(
                    (booking) => booking.status !== "pending"
                  )
                ).length > 0 ? (
                  myRides
                    .flatMap((ride) =>
                      (ride.bookings || []).filter(
                        (booking) => booking.status !== "pending"
                      )
                    )
                    .map((request) => (
                      <div key={request.id} className="card booking-card">
                        <div className="card-body">
                          <h5>
                            {request.ride?.from || "N/A"} →{" "}
                            {request.ride?.to || "N/A"}
                          </h5>
                          <p>
                            <i className="fas fa-calendar me-2"></i>
                            {request.ride?.date
                              ? new Date(request.ride.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}{" "}
                            à{" "}
                            {request.ride?.time
                              ? new Date(
                                  `2000-01-01T${request.ride.time}`
                                ).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </p>
                          <p>
                            <i className="fas fa-user me-2"></i>
                            Passager: {request.passenger?.name || "N/A"}
                          </p>
                          <p>
                            <i className="fas fa-users me-2"></i>
                            Places demandées: {request.seats_booked || "N/A"}
                          </p>
                          <p>
                            <i className="fas fa-money-bill me-2"></i>
                            Total: {request.total_price || "N/A"} TND
                          </p>
                          <p>
                            <i className="fas fa-info-circle me-2"></i>
                            Statut:{" "}
                            {request.status === "confirmed"
                              ? "Acceptée"
                              : request.status === "rejected"
                              ? "Rejetée"
                              : request.status === "cancelled"
                              ? "Annulée"
                              : request.status || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-muted">Aucun historique de demandes.</p>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <h3>Mes réservations</h3>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="card booking-card">
                  <div className="card-body">
                    <h5>
                      {booking.ride?.from || "N/A"} →{" "}
                      {booking.ride?.to || "N/A"}
                    </h5>
                    <p>
                      <i className="fas fa-calendar me-2"></i>
                      {booking.ride?.date
                        ? new Date(booking.ride.date).toLocaleDateString(
                            "fr-FR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "N/A"}{" "}
                      à{" "}
                      {booking.ride?.time
                        ? new Date(
                            `2000-01-01T${booking.ride.time}`
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                    <p>
                      <i className="fas fa-user me-2"></i>
                      Conducteur: {booking.ride?.driver?.name || "N/A"}
                    </p>
                    <p>
                      <i className="fas fa-users me-2"></i>
                      Places réservées: {booking.seats_booked || "N/A"}
                    </p>
                    <p>
                      <i className="fas fa-money-bill me-2"></i>
                      Total: {booking.total_price || "N/A"} TND
                    </p>
                    <p>
                      <i className="fas fa-info-circle me-2"></i>
                      Statut:{" "}
                      {booking.status === "pending"
                        ? "En attente"
                        : booking.status === "confirmed"
                        ? "Confirmée"
                        : booking.status === "cancelled"
                        ? "Annulée"
                        : booking.status || "N/A"}
                    </p>
                    {booking.status === "pending" &&
                      user?.role === "passenger" && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Annuler
                        </button>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Aucune réservation trouvée.</p>
            )}
          </div>

          <div className="text-center">
            <Link to="/search" className="btn btn-primary">
              Rechercher un trajet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRidesPage;
