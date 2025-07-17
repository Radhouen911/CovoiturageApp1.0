"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";
import "./CreateTicket.css";

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
      setError("Please log in to create a ticket.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await ApiService.post("/tickets", {
        user_id: user.id,
        ride_id: formData.ride_id || null,
        subject: formData.subject,
        description: formData.description,
      });

      if (response.success) {
        setSuccess("Ticket created successfully!");
        setFormData({ subject: "", description: "", ride_id: "" });
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setError(response.message || "Failed to create ticket.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="create-ticket-container">
        <div className="auth-warning">
          <div className="warning-icon">⚠️</div>
          <h2>Authentication Required</h2>
          <p>Please log in to file a complaint.</p>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ticket-container">
      <div className="ticket-form-wrapper">
        <div className="form-header">
          <h1>File a Complaint</h1>
          <p>We're here to help resolve any issues you may have encountered.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief description of your issue"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Please provide detailed information about your complaint..."
              rows="6"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ride_id" className="form-label">
              Ride ID <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              id="ride_id"
              name="ride_id"
              value={formData.ride_id}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter ride ID if complaint is related to a specific ride"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
