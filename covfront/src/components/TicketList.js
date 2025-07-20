"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const TicketList = ({ onSelectTicket }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.getTickets();
        if (response.success) {
          // Trier les tickets par dernière mise à jour
          const sortedTickets = response.data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          setTickets(sortedTickets);
        } else {
          setError(response.message || "Échec de la récupération des tickets.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des tickets :", err);
        setError(
          "Une erreur est survenue lors de la récupération des tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isLoggedIn, navigate]);

  // Aide pour le style du badge de statut
  const getStatusBadge = (status) => {
    const styles = {
      open: {
        backgroundColor: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      },
      in_progress: {
        backgroundColor: "#fffbeb",
        color: "#92400e",
        border: "1px solid #fed7aa",
      },
      closed: {
        backgroundColor: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    };
    return (
      <span
        style={{
          ...styles[status],
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "500",
          textTransform: "uppercase",
        }}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { backgroundColor: "#ef4444", color: "white" },
      medium: { backgroundColor: "#eab308", color: "white" },
      low: { backgroundColor: "#22c55e", color: "white" },
    };
    return (
      <span
        style={{
          ...styles[priority],
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
          textTransform: "uppercase",
        }}
      >
        {priority ? priority : "N/A"}
      </span>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "960px",
          margin: "0 auto",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          minHeight: "500px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            fontSize: "1.1rem",
            color: "#4a5568",
          }}
        >
          Chargement des tickets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "960px",
          margin: "0 auto",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          minHeight: "500px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            fontSize: "1.1rem",
            color: "#e53e3e",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        minHeight: "500px",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Vos Tickets de Support
      </h2>
      {tickets.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            fontSize: "1.1rem",
            color: "#4a5568",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          Vous n'avez pas encore ouvert de tickets de support.
          <button
            style={{
              backgroundColor: "#4299e1",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "background-color 0.2s ease",
            }}
            onClick={() => navigate("/create-ticket")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#3182ce")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4299e1")}
          >
            Démarrer un Nouveau Ticket
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onClick={() => onSelectTicket(ticket.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    margin: 0,
                    flexGrow: 1,
                    wordBreak: "break-word",
                    paddingRight: "0.5rem",
                  }}
                >
                  {ticket.subject}
                </h3>
                {getStatusBadge(ticket.status)}
              </div>
              <div style={{ flexGrow: 1, marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#4a5568",
                    lineHeight: "1.4",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    marginBottom: "1rem",
                  }}
                >
                  {ticket.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    fontSize: "0.85rem",
                    color: "#718096",
                  }}
                >
                  <span>ID : #{ticket.id}</span>
                  {ticket.priority && (
                    <span>Priorité : {getPriorityBadge(ticket.priority)}</span>
                  )}
                  <span>
                    Créé le : {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
