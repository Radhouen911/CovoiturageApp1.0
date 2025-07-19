"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import TicketDetail from "../components/TicketDetail";
import ApiService from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [errorTickets, setErrorTickets] = useState(null);

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true);
      setErrorTickets(null);
      try {
        const response = await ApiService.getTickets();
        if (response.success) {
          // Sort tickets by latest update
          const sortedTickets = response.data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          setTickets(sortedTickets);
        } else {
          setErrorTickets(
            response.message || "Échec du chargement des tickets."
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tickets :", error);
        setErrorTickets(
          "Une erreur est survenue lors du chargement des tickets."
        );
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  // Mock data for charts (can be replaced with real data fetching later)
  const rideStats = {
    labels: ["Total", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Rides",
        data: [120, 90, 10],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const contributorData = {
    labels: ["Driver A", "Driver B", "Driver C", "Driver D"],
    datasets: [
      {
        label: "Trips Completed",
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(147, 51, 234)",
          "rgb(236, 72, 153)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Ride Statistics",
        font: { size: 20, weight: "bold" },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20, color: "#6b7280", font: { size: 14 } },
        grid: { color: "rgba(229, 231, 235, 0.5)" },
      },
      x: {
        ticks: { color: "#6b7280", font: { size: 14 } },
        grid: { display: false },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 15, usePointStyle: true, font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Top Contributors",
        font: { size: 20, weight: "bold" },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 6,
        displayColors: false,
      },
    },
  };

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
        }}
      >
        {status.replace("_", " ").toUpperCase()}
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
        }}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  // Mock data for stats and recent activity (can be replaced with real data later)
  const stats = [
    {
      label: "Total Rides",
      value: "1,234",
      change: "+12%",
      icon: "🚗",
      trend: "up",
      bgColor: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      label: "Active Drivers",
      value: "89",
      change: "+5%",
      icon: "👨‍💼",
      trend: "up",
      bgColor: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      label: "Revenue",
      value: "45,678 TND",
      change: "+8%",
      icon: "💰",
      trend: "up",
      bgColor: "#faf5ff",
      iconColor: "#9333ea",
    },
    {
      label: "Open Tickets",
      value: tickets.filter((t) => t.status === "open").length.toString(), // Dynamic count
      change: "-3%",
      icon: "🎫",
      trend: "down",
      bgColor: "#fff7ed",
      iconColor: "#ea580c",
    },
  ];

  const recentActivity = [
    {
      time: "2 mins ago",
      action: "New ride request from User 205",
      type: "ride",
      icon: "🚗",
    },
    {
      time: "5 mins ago",
      action: "Driver 42 completed a trip",
      type: "completed",
      icon: "✅",
    },
    {
      time: "8 mins ago",
      action: "Support ticket #125 resolved",
      type: "ticket",
      icon: "🎫",
    },
    {
      time: "12 mins ago",
      action: "Payment of $45 processed",
      type: "payment",
      icon: "💳",
    },
    {
      time: "15 mins ago",
      action: "New driver registration approved",
      type: "driver",
      icon: "👤",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#111827",
                margin: 0,
              }}
            >
              Tableau de bord Admin
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "4px 0 0 0",
              }}
            >
              Aperçus et gestion en temps réel
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "#dcfce7",
                color: "#166534",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                }}
              />
              En direct
            </div>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                transition: "all 0.3s ease",
                cursor: "pointer",
                backgroundColor: stat.bgColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "24px", color: stat.iconColor }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "4px 8px",
                    borderRadius: "9999px",
                    backgroundColor:
                      stat.trend === "up" ? "#dcfce7" : "#fef2f2",
                    color: stat.trend === "up" ? "#166534" : "#991b1b",
                  }}
                >
                  {stat.change}
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                du mois dernier
              </p>
            </div>
          ))}
        </div>
        {/* Charts and Activity */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            marginBottom: "32px",
          }}
          className="charts-grid"
        >
          {/* Charts */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Bar Chart */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 4px 0",
                  }}
                >
                  Statistiques des trajets
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  Aperçu des demandes et résultats de trajets
                </p>
              </div>
              <div style={{ height: "320px" }}>
                <Bar options={barOptions} data={rideStats} />
              </div>
            </div>
            {/* Pie Chart */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 4px 0",
                  }}
                >
                  Meilleurs contributeurs
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  Répartition des performances des conducteurs
                </p>
              </div>
              <div style={{ height: "320px" }}>
                <Pie options={pieOptions} data={contributorData} />
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Recent Activity */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "50%",
                  }}
                />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Activité récente
                </h3>
              </div>
              <div style={{ maxHeight: "256px", overflowY: "auto" }}>
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {activity.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {activity.action}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 16px 0",
                }}
              >
                Actions rapides
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#2563eb",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1d4ed8")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#2563eb")
                  }
                >
                  <span>➕</span>
                  Ajouter un nouveau conducteur
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#16a34a",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#15803d")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#16a34a")
                  }
                >
                  <span>📊</span>
                  Générer un rapport
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#9333ea",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#7c3aed")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#9333ea")
                  }
                >
                  <span>⚙️</span>
                  Gérer les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Support Tickets */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Tickets de support
              </h3>
              {loadingTickets ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: "#fef2f2",
                    color: "#991b1b",
                  }}
                >
                  Chargement...
                </span>
              ) : errorTickets ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: "#fef2f2",
                    color: "#c53030",
                  }}
                >
                  Erreur
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: "#fef2f2",
                    color: "#991b1b",
                  }}
                >
                  {tickets.filter((t) => t.status === "open").length} Ouvert
                </span>
              )}
            </div>
            <button
              style={{
                fontSize: "14px",
                color: "#2563eb",
                fontWeight: "500",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Voir tout
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    ID du Ticket
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Utilisateur
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Sujet
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Priorité
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Statut
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingTickets ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      Chargement des tickets...
                    </td>
                  </tr>
                ) : errorTickets ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#c53030",
                        fontSize: "14px",
                      }}
                    >
                      {errorTickets}
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      Aucun ticket trouvé.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        transition: "background-color 0.2s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedTicket(ticket)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                        }}
                      >
                        #{ticket.id}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              background:
                                "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {ticket.user
                              ? ticket.user.name.charAt(0).toUpperCase()
                              : ticket.user_id.toString().slice(-2)}
                          </div>
                          <span>
                            {ticket.user
                              ? ticket.user.name
                              : `Utilisateur ${ticket.user_id}`}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#111827",
                          maxWidth: "300px",
                        }}
                      >
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {ticket.subject}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.description}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 50,
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "800px",
              width: "100%",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TicketDetail
              ticketId={selectedTicket.id}
              onBack={() => setSelectedTicket(null)}
              onTicketUpdated={(updatedTicketId) => {
                const fetchTickets = async () => {
                  setLoadingTickets(true);
                  setErrorTickets(null);
                  try {
                    const response = await ApiService.getTickets();
                    if (response.success) {
                      const sortedTickets = response.data.sort((a, b) => {
                        return new Date(b.updated_at) - new Date(a.updated_at);
                      });
                      setTickets(sortedTickets);
                    } else {
                      setErrorTickets(
                        response.message ||
                          "Échec de l'actualisation des tickets."
                      );
                    }
                  } catch (err) {
                    console.error(
                      "Erreur lors de l'actualisation des tickets :",
                      err
                    );
                    setErrorTickets(
                      "Erreur lors de l'actualisation de la liste des tickets."
                    );
                  } finally {
                    setLoadingTickets(false);
                  }
                };
                fetchTickets();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
