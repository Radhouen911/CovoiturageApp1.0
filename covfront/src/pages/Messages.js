"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/images/avatar.jpg";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api";

const Messages = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    loadConversations();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getConversations();
      if (response.success) {
        setConversations(response.data);
        if (response.data.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setError("Erreur lors du chargement des conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await ApiService.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const markConversationAsRead = async (conversationId) => {
    try {
      await ApiService.markConversationAsRead(conversationId);
      // Update conversation in the list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const response = await ApiService.sendMessage(selectedConversation.id, {
        message: newMessage.trim(),
      });

      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");

        // Update conversation's last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  last_message: response.data,
                  updated_at: response.data.created_at,
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getOtherUser = (conversation) => {
    return conversation.participants?.find((p) => p.id !== user?.id);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Chargement des messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <style jsx>{`
        .messages-container {
          height: calc(100vh - 120px);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .conversations-sidebar {
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          height: 100%;
          overflow-y: auto;
        }
        .conversation-item {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .conversation-item:hover {
          background-color: #e9ecef;
        }
        .conversation-item.active {
          background-color: #007bff;
          color: white;
        }
        .conversation-item.active .text-muted {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .messages-area {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .messages-header {
          padding: 15px 20px;
          border-bottom: 1px solid #dee2e6;
          background: white;
        }
        .messages-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }
        .message-item {
          margin-bottom: 15px;
          display: flex;
        }
        .message-item.own {
          justify-content: flex-end;
        }
        .message-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }
        .message-bubble.own {
          background: #007bff;
          color: white;
        }
        .message-bubble.other {
          background: white;
          border: 1px solid #dee2e6;
        }
        .message-input-area {
          padding: 15px 20px;
          border-top: 1px solid #dee2e6;
          background: white;
        }
        .unread-badge {
          background: #dc3545;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card messages-container">
            <div className="row g-0 h-100">
              {/* Conversations Sidebar */}
              <div className="col-md-4 col-lg-3">
                <div className="conversations-sidebar">
                  <div className="p-3 border-bottom">
                    <h5 className="mb-0">
                      <i className="fas fa-comments me-2"></i>
                      Messages
                    </h5>
                  </div>

                  {conversations.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Aucune conversation</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const otherUser = getOtherUser(conversation);
                      return (
                        <div
                          key={conversation.id}
                          className={`conversation-item ${
                            selectedConversation?.id === conversation.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={otherUser?.avatar || defaultAvatar}
                              alt={otherUser?.name}
                              className="rounded-circle me-3"
                              width="50"
                              height="50"
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <h6 className="mb-1">{otherUser?.name}</h6>
                                {conversation.unread_count > 0 && (
                                  <span className="unread-badge">
                                    {conversation.unread_count}
                                  </span>
                                )}
                              </div>
                              {conversation.last_message && (
                                <p className="mb-1 text-muted small">
                                  {conversation.last_message.message.length > 50
                                    ? conversation.last_message.message.substring(
                                        0,
                                        50
                                      ) + "..."
                                    : conversation.last_message.message}
                                </p>
                              )}
                              {conversation.ride && (
                                <small className="text-muted">
                                  <i className="fas fa-route me-1"></i>
                                  {conversation.ride.from} →{" "}
                                  {conversation.ride.to}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="col-md-8 col-lg-9">
                {selectedConversation ? (
                  <div className="messages-area">
                    {/* Messages Header */}
                    <div className="messages-header">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            getOtherUser(selectedConversation)?.avatar ||
                            defaultAvatar
                          }
                          alt={getOtherUser(selectedConversation)?.name}
                          className="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div>
                          <h6 className="mb-0">
                            {getOtherUser(selectedConversation)?.name}
                          </h6>
                          {selectedConversation.ride && (
                            <small className="text-muted">
                              <i className="fas fa-route me-1"></i>
                              {selectedConversation.ride.from} →{" "}
                              {selectedConversation.ride.to}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="messages-body">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message-item ${
                            message.sender_id === user?.id ? "own" : "other"
                          }`}
                        >
                          <div
                            className={`message-bubble ${
                              message.sender_id === user?.id ? "own" : "other"
                            }`}
                          >
                            <div>{message.message}</div>
                            <small
                              className={`d-block mt-1 ${
                                message.sender_id === user?.id
                                  ? "text-white-50"
                                  : "text-muted"
                              }`}
                            >
                              {formatMessageTime(message.created_at)}
                            </small>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="message-input-area">
                      <form onSubmit={sendMessage}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tapez votre message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sendingMessage}
                          />
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={sendingMessage || !newMessage.trim()}
                          >
                            {sendingMessage ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="fas fa-paper-plane"></i>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">
                        Sélectionnez une conversation
                      </h5>
                      <p className="text-muted">
                        Choisissez une conversation pour commencer à discuter
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
  );
};

export default Messages;
