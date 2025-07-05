"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const Notifications = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    loadNotifications();
  }, [isLoggedIn, navigate]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await ApiService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_request":
        return "fas fa-user-plus text-primary";
      case "booking_accepted":
        return "fas fa-check-circle text-success";
      case "booking_rejected":
        return "fas fa-times-circle text-danger";
      case "new_message":
        return "fas fa-comment text-info";
      default:
        return "fas fa-bell text-secondary";
    }
  };

  const formatNotificationTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Chargement des notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <style jsx>{`
        .notification-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .notification-item {
          padding: 20px;
          border-bottom: 1px solid #f8f9fa;
          transition: background-color 0.2s ease;
        }
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        .notification-item.unread {
          background-color: #e7f3ff;
          border-left: 4px solid #007bff;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
      `}</style>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card notification-card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-bell me-2"></i>
                  Notifications
                </h4>
                {notifications.some((n) => !n.read_at) && (
                  <button
                    className="btn btn-light btn-sm"
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </div>

            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3">{error}</div>}

              {notifications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-bell-slash fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucune notification</h5>
                  <p className="text-muted">
                    Vous n'avez pas encore de notifications
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.read_at ? "unread" : ""
                    }`}
                    onClick={() =>
                      !notification.read_at && markAsRead(notification.id)
                    }
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i
                          className={`${getNotificationIcon(
                            notification.type
                          )} fa-lg`}
                        ></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{notification.title}</h6>
                          {!notification.read_at && (
                            <span className="badge bg-primary">Nouveau</span>
                          )}
                        </div>
                        <p className="text-muted mb-2">
                          {notification.message}
                        </p>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {formatNotificationTime(notification.created_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
