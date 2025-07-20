"use client";

import { Link } from "react-router-dom";
import defaultAvatar from "../assets/images/avatar.jpg";

const RideCard = ({ ride }) => {
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

  const amenitiesList =
    typeof ride.amenities === "string"
      ? ride.amenities.split(",").filter((a) => a.trim())
      : ride.amenities || [];

  // Calculate star rating with half-star support
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-warning"></i>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-warning"></i>
      );
    }
    return stars;
  };

  return (
    <div className="card ride-card shadow-sm">
      <style>{`
        .ride-card {
          border: none;
          border-radius: 15px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ride-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        .route-info {
          position: relative;
        }
        .route-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .route-line {
          width: 2px;
          height: 20px;
          background: #ddd;
          margin-left: 5px;
          margin-right: 10px;
        }
        .seats-info {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 8px;
        }
        .amenities {
          margin-top: 10px;
        }
        .amenity-badge {
          font-size: 0.75rem;
          padding: 4px 8px;
          background-color: #ffffff; /* White background */
          color: #000000; /* Black text */
        }
        .rating-stars {
          display: flex;
          gap: 2px;
          align-items: center;
        }
      `}</style>

      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={ride.driver?.avatar || defaultAvatar}
              alt={ride.driver?.name || "Conducteur"}
              className="rounded-circle mb-2"
              width="50"
              height="50"
            />
            <div>
              <small className="fw-bold d-block">
                {ride.driver?.name || "Conducteur"}
              </small>
              {ride.driver?.rating && (
                <div className="rating-stars">
                  {renderStars(ride.driver.rating)}
                  <small className="text-muted ms-1">
                    {ride.driver.rating}
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <div className="route-info">
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
          </div>

          <div className="col-md-2 text-center">
            <div className="fw-bold">{formatTime(ride.time)}</div>
            <small className="text-muted">{formatDate(ride.date)}</small>
          </div>

          <div className="col-md-2 text-center">
            <div className="fw-bold text-primary fs-4">{ride.price} TND</div>
            <small className="text-muted">par personne</small>
          </div>

          <div className="col-md-2 text-center">
            <div className="seats-info">
              <i className="fas fa-user-friends me-1"></i>
              <span className="fw-bold">{ride.remaining_seats}</span>
              <small className="text-muted"> places libres</small>
            </div>
            {ride.car && (
              <div className="mt-1">
                <small className="text-muted">{ride.car}</small>
              </div>
            )}
          </div>

          <div className="col-md-1 text-center">
            <Link to={`/ride/${ride.id}`} className="btn btn-primary btn-sm">
              Voir
            </Link>
          </div>
        </div>

        {amenitiesList.length > 0 && (
          <div className="row mt-3">
            <div className="col-12">
              <div className="amenities d-flex gap-2 flex-wrap">
                {amenitiesList.map((amenity, index) => (
                  <span key={index} className="badge amenity-badge">
                    <i className={`${getAmenityIcon(amenity.trim())} me-1`}></i>
                    {amenity.trim().replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideCard;
