"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaCalendar,
  FaCar,
  FaFilter,
  FaHeart,
  FaMapMarkerAlt,
  FaSearch,
  FaShare,
  FaSort,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ApiService from "../services/api";

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    priceMin: "",
    priceMax: "",
    amenities: [],
  });
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const departInputRef = useRef(null);
  const [hasSearched, setHasSearched] = useState(false);

  const amenities = [
    { id: "wifi", label: "WiFi", icon: "📶" },
    { id: "music", label: "Musique", icon: "🎵" },
    { id: "smoking", label: "Fumeur", icon: "🚬" },
    { id: "pets", label: "Animaux", icon: "🐕" },
    { id: "luggage", label: "Bagages", icon: "💼" },
    { id: "ac", label: "Climatisation", icon: "❄️" },
  ];

  const fetchRides = useCallback(
    async (userInitiated = false) => {
      setLoading(true);
      if (userInitiated) setHasSearched(true);
      try {
        const params = {
          page: currentPage,
          sort: sortBy,
          from: filters.from || undefined,
          to: filters.to || undefined,
          date: filters.date || undefined,
          seats: filters.passengers || undefined,
          min_price: filters.priceMin || undefined,
          max_price: filters.priceMax || undefined,
          amenities: filters.amenities.length
            ? filters.amenities.join(",")
            : undefined,
        };
        // Clean undefined params
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
        );
        console.log("Cleaned Params:", cleanParams);

        const response = await ApiService.searchRides(cleanParams);
        console.log("API Response Data:", JSON.stringify(response, null, 2));

        if (!response.success) {
          throw new Error("API request failed");
        }

        setRides(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Fetch Error:", error.message);
        setRides([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, sortBy, currentPage]
  );

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  useEffect(() => {
    if (departInputRef.current) {
      departInputRef.current.focus();
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setHasSearched(true);
  };

  const handleAmenityChange = (amenityId) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
    setCurrentPage(1);
    setHasSearched(true);
  };

  const clearFilters = () => {
    setFilters({
      from: "",
      to: "",
      date: "",
      passengers: 1,
      priceMin: "",
      priceMax: "",
      amenities: [],
    });
    setCurrentPage(1);
    setHasSearched(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const formatPrice = (price) => {
    return `${price}€`;
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-warning" : "text-muted"}
        size={14}
      />
    ));
  };

  const isDefaultFilters =
    !filters.from &&
    !filters.to &&
    !filters.date &&
    !filters.priceMin &&
    !filters.priceMax &&
    (!filters.amenities || filters.amenities.length === 0);

  console.log("Rides to render:", rides);

  return (
    <div className="search-rides-page">
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12">
            <h1 className="gradient-text mb-3">Rechercher un trajet</h1>
            <p className="text-muted">
              Trouvez le covoiturage parfait pour votre voyage
            </p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card search-card">
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">
                        <FaMapMarkerAlt className="me-2" />
                        Départ
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ville de départ"
                        value={filters.from}
                        onChange={(e) =>
                          handleFilterChange("from", e.target.value)
                        }
                        ref={departInputRef}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">
                        <FaMapMarkerAlt className="me-2" />
                        Destination
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ville d'arrivée"
                        value={filters.to}
                        onChange={(e) =>
                          handleFilterChange("to", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">
                        <FaCalendar className="me-2" />
                        Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={filters.date}
                        onChange={(e) =>
                          handleFilterChange("date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">
                        <FaUser className="me-2" />
                        Passagers
                      </label>
                      <select
                        className="form-control"
                        value={filters.passengers}
                        onChange={(e) =>
                          handleFilterChange(
                            "passengers",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label"> </label>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => fetchRides(true)}
                      >
                        <FaSearch className="me-2" />
                        Rechercher
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="me-2" />
                  Filtres
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Effacer
                </button>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaSort className="text-muted" />
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="price">Prix</option>
                  <option value="time">Heure de départ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="row mb-4 fade-in">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">Filtres avancés</h6>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Prix minimum</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0€"
                        value={filters.priceMin}
                        onChange={(e) =>
                          handleFilterChange("priceMin", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Prix maximum</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100€"
                        value={filters.priceMax}
                        onChange={(e) =>
                          handleFilterChange("priceMax", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Équipements</label>
                      <div className="d-flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <button
                            key={amenity.id}
                            className={`btn btn-sm ${
                              filters.amenities.includes(amenity.id)
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => handleAmenityChange(amenity.id)}
                          >
                            <span className="me-1">{amenity.icon}</span>
                            {amenity.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Recherche en cours...</p>
              </div>
            ) : rides.length === 0 && hasSearched ? (
              <div className="text-center py-5">
                <FaCar size={64} className="text-muted mb-3" />
                <h4 className="text-muted">Aucun trajet trouvé</h4>
                <p className="text-muted">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : Array.isArray(rides) && rides.length > 0 ? (
              <>
                {isDefaultFilters && (
                  <h3 className="mb-4 gradient-text">Suggestions</h3>
                )}
                <div className="row g-4">
                  {rides.map((ride) => (
                    <div className="col-lg-6 col-xl-4" key={ride.id}>
                      <div className="card ride-card h-100">
                        <div className="card-header bg-gradient text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">
                                {ride.driver?.name || "Conducteur"}
                              </h6>
                              <div className="rating">
                                {getRatingStars(ride.driver?.rating || 0)}
                                <span className="ms-2 text-white-50">
                                  ({ride.driver?.rating || 0}/5)
                                </span>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="price-display">
                                <span className="amount">
                                  {formatPrice(ride.price)}
                                </span>
                                <span className="currency">par personne</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="route-info mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <div className="route-dot bg-success"></div>
                              <span className="fw-bold">{ride.from}</span>
                            </div>
                            <div className="route-line"></div>
                            <div className="d-flex align-items-center">
                              <div className="route-dot bg-danger"></div>
                              <span className="fw-bold">{ride.to}</span>
                            </div>
                          </div>

                          <div className="ride-details mb-3">
                            <div className="row g-2">
                              <div className="col-6">
                                <small className="text-muted">Date</small>
                                <div className="fw-bold">
                                  {formatDate(ride.date)}
                                </div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Heure</small>
                                <div className="fw-bold">
                                  {formatTime(ride.time)}
                                </div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Places</small>
                                <div className="fw-bold">
                                  {ride.remaining_seats}/{ride.total_seats}
                                </div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Durée</small>
                                <div className="fw-bold">
                                  {ride.duration || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {ride.amenities && ride.amenities.length > 0 && (
                            <div className="amenities mb-3">
                              <small className="text-muted d-block mb-2">
                                Équipements
                              </small>
                              <div className="d-flex flex-wrap gap-1">
                                {ride.amenities.map((amenity) => (
                                  <span
                                    key={amenity}
                                    className="badge bg-light text-dark"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="card-actions">
                            <Link
                              to={`/ride/${ride.id}`}
                              className="btn btn-primary w-100 mb-2"
                            >
                              Voir les détails
                            </Link>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary flex-fill">
                                <FaHeart className="me-1" />
                                Favoris
                              </button>
                              <button className="btn btn-outline-secondary flex-fill">
                                <FaShare className="me-1" />
                                Partager
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="row mt-5">
                    <div className="col-12">
                      <nav aria-label="Pagination des trajets">
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Précédent
                            </button>
                          </li>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Suivant
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        .search-rides-page {
          padding-top: 76px;
          min-height: 100vh;
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
        }

        .search-card {
          border: none;
          box-shadow: var(--shadow-lg);
          border-radius: 1rem;
        }

        .ride-card {
          transition: all 0.3s ease;
          border: none;
          overflow: hidden;
        }

        .ride-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .route-info {
          position: relative;
        }

        .route-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .route-line {
          width: 2px;
          height: 20px;
          background-color: var(--border-color);
          margin-left: 5px;
          margin-right: 10px;
        }

        .price-display {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-align: center;
        }

        .price-display .amount {
          font-size: 1.25rem;
          font-weight: 700;
          display: block;
        }

        .price-display .currency {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .amenities .badge {
          font-size: 0.75rem;
          padding: 0.5em 0.75em;
        }

        .card-actions {
          border-top: 1px solid var(--border-color);
          padding-top: 1rem;
          margin-top: auto;
        }

        .rating {
          display: flex;
          align-items: center;
        }

        .rating .fa-star {
          margin-right: 0.125rem;
        }

        @media (max-width: 768px) {
          .search-card .row > div {
            margin-bottom: 1rem;
          }

          .route-info {
            margin-bottom: 1rem;
          }

          .ride-details .row > div {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchRides;
