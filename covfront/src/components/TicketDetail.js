"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const TicketDetail = ({ ticketId, onBack, onTicketUpdated }) => {
  const { user, isLoggedIn } = useAuth();
  const messagesEndRef = useRef(null);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [adminActionsLoading, setAdminActionsLoading] = useState(false);

  // Fetch ticket details and messages
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchTicketAndMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const ticketResponse = await ApiService.getTicket(ticketId);
        if (ticketResponse.success) {
          setTicket(ticketResponse.data);
          const messagesResponse = await ApiService.getTicketMessages(ticketId);
          if (messagesResponse.success) {
            setMessages(messagesResponse.data || []);
          } else {
            setError(
              messagesResponse.message ||
                "Échec du chargement des messages du ticket."
            );
          }
        } else {
          setError(ticketResponse.message || "Échec du chargement du ticket.");
        }
      } catch (err) {
        console.error(
          "Erreur lors du chargement du ticket ou des messages :",
          err
        );
        setError("Une erreur est survenue lors du chargement du ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndMessages();
  }, [ticketId, isLoggedIn]);

  // Scroll to the bottom of messages whenever messages array updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await ApiService.sendTicketMessage(ticketId, newMessage);
      if (response.success) {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
        // Notify parent (e.g., AdminDashboard or MyTicketsPage) about update
        onTicketUpdated && onTicketUpdated(ticketId);
      } else {
        alert(response.message || "Échec de l'envoi du message.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      alert("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  // Handle admin actions (status/priority change, closing ticket)
  const handleAdminAction = async (actionType, value = null) => {
    // Ensure user and isAdmin property exist before calling
    if (!user || !user.is_admin || adminActionsLoading) return;

    setAdminActionsLoading(true);
    try {
      let response;
      if (actionType === "close") {
        response = await ApiService.closeTicket(ticketId);
      } else if (actionType === "update_status" && value) {
        response = await ApiService.updateTicket(ticketId, { status: value });
      } else if (actionType === "update_priority" && value) {
        response = await ApiService.updateTicket(ticketId, { priority: value });
      }

      if (response && response.success) {
        setTicket((prev) => ({ ...prev, ...response.data })); // Update local ticket state
        onTicketUpdated && onTicketUpdated(ticketId); // Notify parent
        alert(
          `Ticket ${actionType.replace("_", " ")} mis à jour avec succès !`
        );
      } else {
        alert(
          response?.message ||
            `Échec de la ${actionType.replace("_", " ")} du ticket.`
        );
      }
    } catch (err) {
      console.error(`Erreur lors de l'action admin ${actionType} :`, err);
      alert(`Une erreur est survenue lors de l'action ${actionType}.`);
    } finally {
      setAdminActionsLoading(false);
    }
  };

  // Helper for status badge styling
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

  // Helper for priority badge styling
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
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          height: "calc(100vh - 4rem)",
          overflow: "hidden",
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
          Chargement du ticket...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          height: "calc(100vh - 4rem)",
          overflow: "hidden",
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

  if (!ticket) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          height: "calc(100vh - 4rem)",
          overflow: "hidden",
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
          Ticket introuvable.
        </div>
      </div>
    );
  }

  const isTicketClosed = ticket.status === "closed";

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "calc(100vh - 4rem)", // Fixed height for the container
        overflow: "hidden", // Hide overflow for the main container
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <button
          style={{
            backgroundColor: "#e2e8f0",
            color: "#4a5568",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
          onClick={onBack}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#cbd5e0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
        >
          ← Retour aux Tickets
        </button>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#1a202c",
            margin: 0,
            flexGrow: 1,
            wordBreak: "break-word",
          }}
        >
          #{ticket.id}: {ticket.subject}
        </h2>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginLeft: "auto",
          }}
        >
          {getStatusBadge(ticket.status)}
          {ticket.priority && getPriorityBadge(ticket.priority)}
        </div>
      </div>

      {user && user.is_admin && (
        <div
          style={{
            backgroundColor: "#f0f4f8",
            borderRadius: "8px",
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            flexShrink: 0, // Prevent admin controls from shrinking
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label
              style={{
                fontWeight: "600",
                color: "#2d3748",
                fontSize: "0.9rem",
              }}
            >
              Statut :
            </label>
            <select
              value={ticket.status}
              onChange={(e) =>
                handleAdminAction("update_status", e.target.value)
              }
              disabled={adminActionsLoading}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid #cbd5e0",
                borderRadius: "6px",
                backgroundColor: "white",
                fontSize: "0.9rem",
                cursor: "pointer",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.6c-5.8%200-11.1%202.9-13.2%206.5-2.2%203.6-1.5%207.8%202.4%2010.5l128.4%20128.4c1.9%201.9%204.3%202.9%206.5%202.9s4.6-1%206.5-2.9l128.4-128.4c3.9-2.7%204.6-6.9%202.4-10.5z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.7em top 50%, 0 0",
                backgroundSize: "0.65em auto, 100%",
              }}
            >
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label
              style={{
                fontWeight: "600",
                color: "#2d3748",
                fontSize: "0.9rem",
              }}
            >
              Priorité :
            </label>
            <select
              value={ticket.priority || "medium"}
              onChange={(e) =>
                handleAdminAction("update_priority", e.target.value)
              }
              disabled={adminActionsLoading}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid #cbd5e0",
                borderRadius: "6px",
                backgroundColor: "white",
                fontSize: "0.9rem",
                cursor: "pointer",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.6c-5.8%200-11.1%202.9-13.2%206.5-2.2%203.6-1.5%207.8%202.4%2010.5l128.4%20128.4c1.9%201.9%204.3%202.9%206.5%202.9s4.6-1%206.5-2.9l128.4-128.4c3.9-2.7%204.6-6.9%202.4-10.5z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.7em top 50%, 0 0",
                backgroundSize: "0.65em auto, 100%",
              }}
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          {!isTicketClosed && (
            <button
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background-color 0.2s ease",
                flexShrink: 0,
              }}
              onClick={() => handleAdminAction("close")}
              disabled={adminActionsLoading}
              onMouseEnter={(e) => {
                if (!adminActionsLoading)
                  e.target.style.backgroundColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                if (!adminActionsLoading)
                  e.target.style.backgroundColor = "#ef4444";
              }}
            >
              {adminActionsLoading ? "Fermeture..." : "Fermer le Ticket"}
            </button>
          )}
        </div>
      )}

      <div
        style={{
          flexGrow: 1, // Allows this section to take available space
          overflowY: "auto", // Enables scrolling for messages
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "1.5rem",
          backgroundColor: "#f7fafc",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          scrollBehavior: "smooth",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: "0.5rem",
            }}
          >
            Description :
          </h3>
          <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#4a5568" }}>
            {ticket.description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.9rem",
            color: "#718096",
          }}
        >
          <span>
            <strong>Déposé par :</strong>{" "}
            {ticket.user ? ticket.user.name : `Utilisateur ${ticket.user_id}`}
          </span>
          <span>
            <strong>ID de Trajet :</strong> {ticket.ride_id || "N/A"}
          </span>
          <span>
            <strong>Créé le :</strong>{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </span>
          <span>
            <strong>Dernière mise à jour :</strong>{" "}
            {new Date(ticket.updated_at).toLocaleString()}
          </span>
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px dashed #e2e8f0",
            margin: "1rem 0",
          }}
        />
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "0.5rem",
          }}
        >
          Messages :
        </h3>
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              fontSize: "1rem",
              color: "#4a5568",
            }}
          >
            Aucun message dans ce ticket pour l'instant.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                maxWidth: "80%",
                position: "relative",
                wordWrap: "break-word",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                alignSelf:
                  message.user_id === user.id ? "flex-end" : "flex-start",
                backgroundColor:
                  message.user_id === user.id ? "#e0f2f7" : "#f0fdf4",
                color: message.user_id === user.id ? "#2b6cb0" : "#2f855a",
                borderBottomRightRadius:
                  message.user_id === user.id ? "2px" : "10px",
                borderBottomLeftRadius:
                  message.user_id === user.id ? "10px" : "2px",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                  color: "#4a5568",
                  textAlign: message.user_id === user.id ? "right" : "left",
                }}
              >
                {message.user && message.user.name
                  ? message.user.name
                  : `Utilisateur ${message.user_id}`}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.4",
                  marginBottom: "0.25rem",
                  color: "#2d3748",
                }}
              >
                {message.content}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#718096",
                  textAlign: message.user_id === user.id ? "right" : "left",
                }}
              >
                {new Date(message.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> {/* Element to scroll to */}
      </div>

      {!isTicketClosed && (
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message ici..."
            rows="3"
            disabled={sending}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #cbd5e0",
              borderRadius: "8px",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "60px",
              fontFamily: "inherit",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          ></textarea>
          <button
            type="submit"
            disabled={sending}
            style={{
              backgroundColor: "#4299e1",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!sending) e.target.style.backgroundColor = "#3182ce";
            }}
            onMouseLeave={(e) => {
              if (!sending) e.target.style.backgroundColor = "#4299e1";
            }}
          >
            {sending ? "Envoi en cours..." : "Envoyer le message"}
          </button>
        </form>
      )}

      {isTicketClosed && (
        <div
          style={{
            backgroundColor: "#fefcbf",
            color: "#9f580a",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "500",
            border: "1px solid #faf089",
            marginTop: "1rem",
            flexShrink: 0,
          }}
        >
          Ce ticket est fermé. Vous ne pouvez pas envoyer de nouveaux messages.
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
