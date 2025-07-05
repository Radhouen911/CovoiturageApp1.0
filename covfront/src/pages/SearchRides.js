"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RideCard from "../components/RideCard";
import SearchForm from "../components/SearchForm";
import ApiService from "../services/api";

const SearchRides = () => {
  const location = useLocation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    departureTime: "",
    sortBy: "price",
    minSeats: 1,
    amenities: [],
    minRating: 0,
  });

  useEffect(() => {
    // Check if there are search params from navigation state
    if (location.state?.searchData) {
      setSearchParams(location.state.searchData);
      searchRides(location.state.searchData);
    } else {
      // Load all available rides initially
      loadAllRides();
    }
  }, [location.state]);

  const loadAllRides = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ApiService.searchRides({});

      if (response.success) {
        setRides(response.data.data || []);
      } else {
        setError(response.message || "Erreur lors du chargement des trajets");
      }
    } catch (error) {
      console.error("Error loading rides:", error);
      setError("Erreur de connexion. Vérifiez que le serveur est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const searchRides = async (searchData) => {
    try {
      setLoading(true);
      setError("");
      setSearchParams(searchData);

      const response = await ApiService.searchRides(searchData);

      if (response.success) {
        setRides(response.data.data || []);
      } else {
        setError(response.message || "Erreur lors de la recherche");
      }
    } catch (error) {
      console.error("Error searching rides:", error);
      setError("Erreur de connexion. Vérifiez que le serveur est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (searchData) => {
    console.log("New search:", searchData);
    searchRides(searchData);
  };

  const filteredRides = rides.filter((ride) => {
    // Price filter
    const isWithinPrice =
      ride.price >= filters.priceRange[0] &&
      ride.price <= filters.priceRange[1];

    // Time filter
    const rideHour = Number.parseInt(ride.time.split(":")[0]);
    let isWithinTime = true;
    if (filters.departureTime === "morning") {
      isWithinTime = rideHour >= 6 && rideHour < 12;
    } else if (filters.departureTime === "afternoon") {
      isWithinTime = rideHour >= 12 && rideHour < 18;
    } else if (filters.departureTime === "evening") {
      isWithinTime = rideHour >= 18 && rideHour < 24;
    }

    // Seats filter
    const hasEnoughSeats = ride.available_seats >= filters.minSeats;

    // Amenities filter (if your backend supports amenities)
    const hasSelectedAmenities =
      filters.amenities.length === 0 ||
      (ride.amenities &&
        filters.amenities.every((amenity) => ride.amenities.includes(amenity)));

    // Rating filter (if your backend supports driver ratings)
    const meetsRating =
      !ride.driver?.rating || ride.driver.rating >= filters.minRating;

    return (
      isWithinPrice &&
      isWithinTime &&
      hasEnoughSeats &&
      hasSelectedAmenities &&
      meetsRating
    );
  });

  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (filters.sortBy) {
      case "price":
        return a.price - b.price;
      case "time":
        return a.time.localeCompare(b.time);
      case "rating":
        return (b.driver?.rating || 0) - (a.driver?.rating || 0);
      case "date":
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  });

  const handleAmenityChange = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Recherche des trajets disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Erreur de chargement</h4>
              <p>{error}</p>
              <button
                onClick={() =>
                  searchParams.from ? searchRides(searchParams) : loadAllRides()
                }
                className="btn btn-primary"
              >
                <i className="fas fa-redo me-2"></i>
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <style jsx>{`
        .search-header {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .filter-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .results-header {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .no-results {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 15px;
        }
        .search-summary {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 15px;
          margin-top: 15px;
        }
      `}</style>

      <div className="row">
        {/* Search Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card filter-card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-search me-2"></i>
                Nouvelle recherche
              </h5>
            </div>
            <div className="card-body">
              <SearchForm
                onSearch={handleNewSearch}
                initialData={searchParams}
              />

              {/* Display current search summary */}
              {(searchParams.from || searchParams.to) && (
                <div className="search-summary mt-3">
                  <small className="text-muted">Recherche actuelle:</small>
                  <div className="mt-1">
                    {searchParams.from && (
                      <div>
                        <strong>De:</strong> {searchParams.from}
                      </div>
                    )}
                    {searchParams.to && (
                      <div>
                        <strong>Vers:</strong> {searchParams.to}
                      </div>
                    )}
                    {searchParams.date && (
                      <div>
                        <strong>Date:</strong> {formatDate(searchParams.date)}
                      </div>
                    )}
                    {searchParams.passengers && (
                      <div>
                        <strong>Passagers:</strong> {searchParams.passengers}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card filter-card mt-3">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Filtres
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Trier par</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="price">Prix croissant</option>
                  <option value="time">Heure de départ</option>
                  <option value="date">Date</option>
                  <option value="rating">Note du conducteur</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Plage de prix (TND)</label>
                <div className="d-flex align-items-center">
                  <input
                    type="range"
                    className="form-range me-2"
                    min="0"
                    max="100"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [
                          Number.parseInt(e.target.value),
                          filters.priceRange[1],
                        ],
                      })
                    }
                  />
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [
                          filters.priceRange[0],
                          Number.parseInt(e.target.value),
                        ],
                      })
                    }
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <small>{filters.priceRange[0]} TND</small>
                  <small>{filters.priceRange[1]} TND</small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Heure de départ</label>
                <select
                  className="form-select"
                  value={filters.departureTime}
                  onChange={(e) =>
                    setFilters({ ...filters, departureTime: e.target.value })
                  }
                >
                  <option value="">Toute la journée</option>
                  <option value="morning">Matin (6h-12h)</option>
                  <option value="afternoon">Après-midi (12h-18h)</option>
                  <option value="evening">Soir (18h-24h)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Places minimum</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="8"
                  value={filters.minSeats}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minSeats: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Note minimum du conducteur</label>
                <select
                  className="form-select"
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minRating: Number.parseFloat(e.target.value),
                    })
                  }
                >
                  <option value="0">Toutes</option>
                  <option value="3">3.0+</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.8">4.8+</option>
                </select>
              </div>

              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() =>
                  setFilters({
                    priceRange: [0, 100],
                    departureTime: "",
                    sortBy: "price",
                    minSeats: 1,
                    amenities: [],
                    minRating: 0,
                  })
                }
              >
                <i className="fas fa-times me-1"></i>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-lg-9">
          <div className="results-header">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">
                <i className="fas fa-car me-2"></i>
                Trajets disponibles
              </h2>
              <div className="text-end">
                <span className="badge bg-primary fs-6">
                  {sortedRides.length} trajet
                  {sortedRides.length !== 1 ? "s" : ""} trouvé
                  {sortedRides.length !== 1 ? "s" : ""}
                </span>
                {filteredRides.length !== rides.length && (
                  <div className="small text-muted mt-1">
                    ({rides.length} total{rides.length !== 1 ? "s" : ""} avant
                    filtrage)
                  </div>
                )}
              </div>
            </div>
          </div>

          {sortedRides.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search fa-4x text-muted mb-4"></i>
              <h4>Aucun trajet trouvé</h4>
              <p className="text-muted mb-4">
                {rides.length === 0
                  ? "Aucun trajet n'est disponible pour le moment."
                  : "Aucun trajet ne correspond à vos critères de recherche."}
              </p>
              {rides.length > 0 && (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 100],
                      departureTime: "",
                      sortBy: "price",
                      minSeats: 1,
                      amenities: [],
                      minRating: 0,
                    })
                  }
                >
                  <i className="fas fa-filter me-1"></i>
                  Réinitialiser les filtres
                </button>
              )}
              <button className="btn btn-primary" onClick={loadAllRides}>
                <i className="fas fa-redo me-1"></i>
                Actualiser
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {sortedRides.map((ride) => (
                <div key={ride.id} className="col-12">
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchRides;
