"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const NotificationBell = () => {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
      loadUnreadCount();

      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getNotifications();
      if (response.success) {
        setNotifications(response.data.slice(0, 10)); // Show only latest 10
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await ApiService.getUnreadNotificationsCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      try {
        await ApiService.markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Handle navigation based on notification type
    handleNotificationNavigation(notification);
    setShowDropdown(false);
  };

  const handleNotificationNavigation = (notification) => {
    switch (notification.type) {
      case "booking_request":
        window.location.href = "/profilePage?tab=bookings";
        break;
      case "booking_accepted":
      case "booking_rejected":
        window.location.href = "/profilePage?tab=my-bookings";
        break;
      case "new_message":
        window.location.href = "/messages";
        break;
      default:
        break;
    }
  };

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
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
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440)
      return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (!isLoggedIn) return null;

  return (
    <div className="position-relative">
      <style jsx>{`
        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        .notification-bell:hover {
          background-color: #f8f9fa;
        }
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 350px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }
        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f8f9fa;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        .notification-item.unread {
          background-color: #e7f3ff;
          border-left: 3px solid #007bff;
        }
        .notification-header {
          padding: 12px 16px;
          border-bottom: 2px solid #f8f9fa;
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .notification-footer {
          padding: 8px 16px;
          text-align: center;
          border-top: 1px solid #f8f9fa;
          background-color: #f8f9fa;
        }
      `}</style>

      <div
        className="notification-bell"
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            loadNotifications();
          }
        }}
      >
        <i className="fas fa-bell fa-lg text-gray-600"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <>
          <div
            className="position-fixed w-100 h-100"
            style={{ top: 0, left: 0, zIndex: 999 }}
            onClick={() => setShowDropdown(false)}
          ></div>

          <div className="notification-dropdown">
            <div className="notification-header d-flex justify-content-between align-items-center">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-link p-0 text-primary"
                  onClick={markAllAsRead}
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="fas fa-bell-slash fa-2x mb-2"></i>
                <p className="mb-0">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read_at ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-medium mb-1">{notification.title}</div>
                      <div className="text-muted small mb-1">
                        {notification.message}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {formatNotificationTime(notification.created_at)}
                      </div>
                    </div>
                    {!notification.read_at && (
                      <div className="ms-2">
                        <div
                          className="bg-primary rounded-circle"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {notifications.length > 0 && (
              <div className="notification-footer">
                <a href="/notifications" className="btn btn-sm btn-link">
                  Voir toutes les notifications
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
