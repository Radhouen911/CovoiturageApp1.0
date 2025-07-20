"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";
import echo from "../services/echo";

const Messages = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connected', 'connecting', 'disconnected'
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return;

      if (!ApiService.isAuthenticated() || !isLoggedIn) {
        navigate("/login");
        return;
      }

      try {
        await loadConversations();
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("Erreur de vérification de l'authentification");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, isLoggedIn, authLoading, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup EventSource and Echo channels on unmount
    return () => {
      if (eventSourceRef.current) {
        // Close SSE connection
        eventSourceRef.current.close();

        // Close Echo channel if exists
        if (eventSourceRef.current.echoChannel) {
          eventSourceRef.current.echoChannel.unsubscribe();
        }
      }
    };
  }, []);

  const startSSEConnection = (conversationId) => {
    // Close previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus("connecting");

    const token = localStorage.getItem("token");
    const lastMessageId =
      messages.length > 0 ? Math.max(...messages.map((m) => m.id)) : 0;

    const url = `http://127.0.0.1:8000/api/sse/conversations/${conversationId}?token=${token}&last_message_id=${lastMessageId}`;

    console.log("Starting SSE connection for conversation:", conversationId);

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log("SSE connection opened for conversation:", conversationId);
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "ping") {
          // Keep-alive ping, ignore
          return;
        }

        console.log("Received real-time message via SSE:", data);
        handleNewMessage(data);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setConnectionStatus("disconnected");
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (
          selectedConversation &&
          selectedConversation.id === conversationId
        ) {
          console.log("Reconnecting SSE...");
          startSSEConnection(conversationId);
        }
      }, 3000);
    };

    eventSourceRef.current = eventSource;

    // Also start Echo channel listening for enhanced real-time
    startEchoChannel(conversationId);
  };

  const startEchoChannel = (conversationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available for Echo channel");
      return;
    }

    try {
      // Join the private conversation channel
      const channel = echo
        .private(`conversation.${conversationId}`)
        .subscribed(() => {
          console.log(
            "Echo channel subscribed for conversation:",
            conversationId
          );
        })
        .error((error) => {
          console.error("Echo channel error:", error);
        });

      // Listen for new messages
      channel.listen("NewMessage", (event) => {
        console.log("Received real-time message via Echo:", event);
        handleNewMessage(event);
      });

      // Store channel reference for cleanup
      if (eventSourceRef.current) {
        eventSourceRef.current.echoChannel = channel;
      }
    } catch (error) {
      console.error("Error setting up Echo channel:", error);
    }
  };

  const handleNewMessage = (data) => {
    // New message received
    const newMessage = {
      id: data.id,
      content: data.content,
      sender_id: data.sender_id,
      conversation_id: data.conversation_id,
      created_at: data.created_at,
      sender: {
        id: data.sender_id,
        name: data.sender_name,
      },
    };

    // Only add if message doesn't already exist
    setMessages((prev) => {
      const messageExists = prev.some((msg) => msg.id === newMessage.id);
      if (!messageExists) {
        return [...prev, newMessage];
      }
      return prev;
    });

    // Update conversations list with new message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === data.conversation_id
          ? { ...conv, last_message_at: data.created_at }
          : conv
      )
    );

    // Play notification sound (optional)
    playNotificationSound();
  };

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setError("");
      const response = await ApiService.getConversations();
      if (response.success) {
        setConversations(response.data || []);
      } else {
        setError(response.message || "Erreur chargement conversations");
      }
    } catch (error) {
      console.error("Load conversations error:", error);
      setError(
        error.response?.data?.message || "Erreur chargement conversations"
      );
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      setError("");
      const response = await ApiService.getConversation(conversationId);
      if (response.success) {
        setSelectedConversation(response.data);
        setMessages(response.data.messages || []);

        // Start SSE connection for real-time messages
        startSSEConnection(conversationId);
      } else {
        setError(response.message || "Erreur chargement conversation");
      }
    } catch (error) {
      console.error("Load conversation error:", error);
      setError(
        error.response?.data?.message || "Erreur chargement conversation"
      );
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    // Create optimistic message for immediate display
    const optimisticMessage = {
      id: `temp_${Date.now()}`, // Temporary ID
      content: messageContent,
      sender_id: user.id,
      conversation_id: selectedConversation.id,
      created_at: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
      },
      isOptimistic: true, // Flag to identify optimistic message
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      setSending(true);
      const response = await ApiService.sendMessage(
        selectedConversation.id,
        messageContent
      );

      if (response.success) {
        // Replace optimistic message with real message
        const realMessage = {
          id: response.data.id,
          content: response.data.content,
          sender_id: response.data.sender_id,
          conversation_id: selectedConversation.id,
          created_at: response.data.created_at,
          sender: response.data.sender,
        };

        setMessages((prev) =>
          prev.map((msg) =>
            msg.isOptimistic && msg.content === messageContent
              ? realMessage
              : msg
          )
        );

        // Update conversation's last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? { ...conv, last_message_at: response.data.created_at }
              : conv
          )
        );
      } else {
        // Remove optimistic message if failed
        setMessages((prev) =>
          prev.filter(
            (msg) => !msg.isOptimistic || msg.content !== messageContent
          )
        );
        setError(response.message || "Erreur envoi message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      // Remove optimistic message if failed
      setMessages((prev) =>
        prev.filter(
          (msg) => !msg.isOptimistic || msg.content !== messageContent
        )
      );
      setError(error.response?.data?.message || "Erreur envoi message");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  };

  const getLastMessagePreview = (conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[0];
      return lastMessage.content.length > 50
        ? lastMessage.content.substring(0, 50) + "..."
        : lastMessage.content;
    }
    return "Aucun message";
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
    <div className="container-fluid py-4">
      <style>{`
        .messages-container {
          min-height: 500px;
          border: 1px solid #dee2e6;
          border-radius: 10px;
          overflow: hidden;
        }
        .conversations-list {
          height: 100%;
          overflow-y: auto;
          border-right: 1px solid #dee2e6;
        }
        .conversation-item {
          cursor: pointer;
          transition: background-color 0.2s, box-shadow 0.2s;
          padding: 12px 15px;
        }
        .conversation-item:hover {
          background-color: #e0f7fa;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .conversation-item.active {
          background-color: #e3f2fd;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .chat-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 550px; /* Increased to prevent retracted look */
        }
        .chat-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 15px;
          display: flex;
          align-items: center;
        }
        .chat-header .user-info h5 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: bold;
        }
        .chat-header .user-info .trajet {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 2px;
        }
        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }
        .message {
          margin-bottom: 10px;
          max-width: 60%; /* Reduced from 70% to narrow width */
        }
        .message.sent {
          margin-left: auto;
        }
        .message.received {
          margin-right: auto;
        }
        .message-bubble {
          padding: 10px 15px; /* Increased to improve height */
          border-radius: 15px;
          word-wrap: break-word;
          font-size: 0.85rem; /* Reduced from 0.95rem */
        }
        .message.sent .message-bubble {
          background-color: #007bff;
          color: white;
        }
        .message.received .message-bubble {
          background-color: #e9ecef;
          color: #212529;
        }
        .message-input-container {
          border-top: 1px solid #dee2e6;
          padding: 15px;
        }
        .unread-badge {
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 0.75rem;
          margin-left: 5px;
        }
        .typing-indicator {
          font-style: italic;
          color: #6c757d;
          font-size: 0.9rem;
          padding: 5px 15px;
        }
        .realtime-indicator {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          z-index: 1000;
          animation: pulse 2s infinite;
        }
        .user-badge {
          background-color: #e9ecef;
          color: #212529;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .trajet-info {
          background-color: #f8f9fa;
          padding: 5px 10px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }
        .message-preview {
          background-color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .time-stamp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: #6c757d;
        }
        .sidebarHeader {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
          padding-left: 20px; /* Added padding to the left */
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Real-time indicator */}
      {selectedConversation && (
        <div className="realtime-indicator">
          <i
            className={`fas fa-circle me-1 ${
              connectionStatus === "connected"
                ? "text-success"
                : connectionStatus === "connecting"
                ? "text-warning"
                : "text-danger"
            }`}
          ></i>
          {connectionStatus === "connected"
            ? "En temps réel"
            : connectionStatus === "connecting"
            ? "Connexion..."
            : "Déconnecté"}
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="fas fa-comments me-2"></i>
            Messages en temps réel
          </h2>

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

          <div className="messages-container">
            <div className="row h-100">
              {/* Conversations List */}
              <div className="col-md-4 p-0">
                <div className="conversations-list">
                  <div className="p-3 border-bottom">
                    <h5 className="sidebarHeader">Conversations</h5>
                  </div>
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`conversation-item p-3 border-bottom ${
                          selectedConversation?.id === conversation.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => loadConversation(conversation.id)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              <span className="user-badge">
                                <i className="fas fa-user"></i>
                                {conversation.other_user?.name}
                              </span>
                              {conversation.unread_count > 0 && (
                                <span className="unread-badge">
                                  {conversation.unread_count}
                                </span>
                              )}
                            </h6>
                            {conversation.ride && (
                              <small className="trajet-info">
                                <i className="fas fa-map-marker-alt"></i>
                                Trajet: {conversation.ride.from} →{" "}
                                {conversation.ride.to}
                              </small>
                            )}
                            <div className="message-preview mt-1">
                              {getLastMessagePreview(conversation)}
                            </div>
                          </div>
                          <div className="time-stamp">
                            <i className="fas fa-clock"></i>
                            {conversation.last_message_at
                              ? formatDate(conversation.last_message_at)
                              : ""}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted">
                      <i className="fas fa-comments fa-2x mb-3"></i>
                      <p>Aucune conversation</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-md-8 p-0">
                <div className="chat-container">
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="chat-header">
                        <div className="user-info">
                          <h5>{selectedConversation.other_user?.name}</h5>
                          {selectedConversation.ride && (
                            <div className="trajet">
                              Trajet: {selectedConversation.ride.from} →{" "}
                              {selectedConversation.ride.to}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setSelectedConversation(null);
                            setMessages([]);
                            if (eventSourceRef.current) {
                              eventSourceRef.current.close();
                            }
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      {/* Messages List */}
                      <div className="messages-list">
                        {messages.length > 0 ? (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`message ${
                                message.sender_id === user?.id
                                  ? "sent"
                                  : "received"
                              }`}
                            >
                              <div className="message-bubble">
                                <div className="message-content">
                                  {message.content}
                                </div>
                                <small className="message-time">
                                  {formatDate(message.created_at)}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted mt-4">
                            <i className="fas fa-comment fa-2x mb-3"></i>
                            <p>Aucun message</p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      {/* Message Input */}
                      <div className="message-input-container">
                        <form onSubmit={handleSendMessage}>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Tapez votre message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              disabled={sending}
                            />
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={!newMessage.trim() || sending}
                            >
                              {sending ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-paper-plane"></i>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-center text-muted">
                        <i className="fas fa-comments fa-3x mb-3"></i>
                        <h5>Sélectionnez une conversation</h5>
                        <p>
                          Choisissez une conversation pour commencer à discuter
                          en temps réel
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
