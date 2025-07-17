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
import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

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

  const tickets = [
    {
      id: 1,
      user_id: 101,
      ride_id: null,
      subject: "App Issue",
      description: "Login not working properly after recent update",
      status: "open",
      priority: "high",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      user_id: 102,
      ride_id: 5,
      subject: "Late Driver",
      description: "Driver was late by 30 minutes without notification",
      status: "in_progress",
      priority: "medium",
      created_at: "2024-01-14",
    },
    {
      id: 3,
      user_id: 103,
      ride_id: 7,
      subject: "Payment Failed",
      description: "Card declined during payment processing",
      status: "closed",
      priority: "low",
      created_at: "2024-01-13",
    },
    {
      id: 4,
      user_id: 104,
      ride_id: 12,
      subject: "Route Issue",
      description: "GPS navigation showing incorrect route",
      status: "open",
      priority: "medium",
      created_at: "2024-01-12",
    },
  ];

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
      value: "23",
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

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: {
      backgroundColor: "white",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: 0,
      zIndex: 40,
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "30px",
      fontWeight: "bold",
      color: "#111827",
      margin: 0,
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "14px",
      margin: "4px 0 0 0",
    },
    liveBadge: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 12px",
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "500",
    },
    pulse: {
      width: "8px",
      height: "8px",
      backgroundColor: "#22c55e",
      borderRadius: "50%",
      animation: "pulse 2s infinite",
    },
    mainContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "32px 24px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    statCard: {
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    statHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    statIcon: {
      fontSize: "24px",
    },
    statChange: {
      fontSize: "12px",
      fontWeight: "600",
      padding: "4px 8px",
      borderRadius: "9999px",
    },
    statLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#6b7280",
      marginBottom: "4px",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111827",
    },
    statSubtext: {
      fontSize: "12px",
      color: "#9ca3af",
      marginTop: "4px",
    },
    chartsGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "32px",
      marginBottom: "32px",
    },
    chartsSection: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    chartCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    chartHeader: {
      marginBottom: "16px",
    },
    chartTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 4px 0",
    },
    chartDescription: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    chartContainer: {
      height: "320px",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    activityCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    activityHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px",
    },
    activityDot: {
      width: "8px",
      height: "8px",
      backgroundColor: "#3b82f6",
      borderRadius: "50%",
    },
    activityTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },
    activityList: {
      maxHeight: "256px",
      overflowY: "auto",
    },
    activityItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px",
      borderRadius: "8px",
      transition: "background-color 0.2s ease",
      cursor: "pointer",
    },
    activityIcon: {
      fontSize: "16px",
      flexShrink: 0,
      marginTop: "2px",
    },
    activityContent: {
      flex: 1,
      minWidth: 0,
    },
    activityAction: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      margin: "0 0 4px 0",
    },
    activityTime: {
      fontSize: "12px",
      color: "#9ca3af",
      margin: 0,
    },
    quickActionsCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    quickActionsTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 16px 0",
    },
    quickActionsButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    actionButton: {
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
    },
    ticketsCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
    },
    ticketsHeader: {
      padding: "16px 24px",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ticketsHeaderLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    ticketsTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },
    openBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#fef2f2",
      color: "#991b1b",
    },
    viewAllButton: {
      fontSize: "14px",
      color: "#2563eb",
      fontWeight: "500",
      background: "none",
      border: "none",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f9fafb",
    },
    tableHeaderCell: {
      padding: "12px 24px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "500",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e5e7eb",
    },
    tableRow: {
      borderBottom: "1px solid #e5e7eb",
      transition: "background-color 0.2s ease",
      cursor: "pointer",
    },
    tableCell: {
      padding: "16px 24px",
      fontSize: "14px",
      color: "#111827",
    },
    userCell: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
    },
    subjectCell: {
      maxWidth: "300px",
    },
    subjectTitle: {
      fontWeight: "500",
      marginBottom: "4px",
    },
    subjectDescription: {
      fontSize: "12px",
      color: "#6b7280",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    modal: {
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
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "448px",
      width: "100%",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    modalTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#9ca3af",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "color 0.2s ease",
    },
    modalBody: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    modalField: {
      display: "flex",
      flexDirection: "column",
    },
    modalLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#6b7280",
      marginBottom: "4px",
    },
    modalValue: {
      color: "#111827",
    },
    modalGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      paddingTop: "16px",
    },
    modalButton: {
      flex: 1,
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      border: "none",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .stat-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transform: translateY(-1px);
          }
          
          .activity-item:hover {
            background-color: #f9fafb;
          }
          
          .table-row:hover {
            background-color: #f9fafb;
          }
          
          .action-button:hover {
            transform: translateY(-1px);
          }
          
          .close-button:hover {
            color: #6b7280;
          }
          
          @media (max-width: 1024px) {
            .charts-grid {
              grid-template-columns: 1fr !important;
            }
          }
          
          @media (max-width: 640px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Real-time insights and management</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={styles.liveBadge}>
              <div style={styles.pulse}></div>
              Live
            </div>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Stats Cards */}
        <div style={styles.statsGrid} className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                ...styles.statCard,
                backgroundColor: stat.bgColor,
              }}
              className="stat-card"
            >
              <div style={styles.statHeader}>
                <div style={{ ...styles.statIcon, color: stat.iconColor }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    ...styles.statChange,
                    backgroundColor:
                      stat.trend === "up" ? "#dcfce7" : "#fef2f2",
                    color: stat.trend === "up" ? "#166534" : "#991b1b",
                  }}
                >
                  {stat.change}
                </div>
              </div>
              <p style={styles.statLabel}>{stat.label}</p>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statSubtext}>from last month</p>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div style={styles.chartsGrid} className="charts-grid">
          {/* Charts */}
          <div style={styles.chartsSection}>
            {/* Bar Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Ride Statistics</h3>
                <p style={styles.chartDescription}>
                  Overview of ride requests and outcomes
                </p>
              </div>
              <div style={styles.chartContainer}>
                <Bar options={barOptions} data={rideStats} />
              </div>
            </div>

            {/* Pie Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Top Contributors</h3>
                <p style={styles.chartDescription}>
                  Driver performance breakdown
                </p>
              </div>
              <div style={styles.chartContainer}>
                <Pie options={pieOptions} data={contributorData} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Recent Activity */}
            <div style={styles.activityCard}>
              <div style={styles.activityHeader}>
                <div style={styles.activityDot}></div>
                <h3 style={styles.activityTitle}>Recent Activity</h3>
              </div>
              <div style={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    style={styles.activityItem}
                    className="activity-item"
                  >
                    <span style={styles.activityIcon}>{activity.icon}</span>
                    <div style={styles.activityContent}>
                      <p style={styles.activityAction}>{activity.action}</p>
                      <p style={styles.activityTime}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActionsCard}>
              <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
              <div style={styles.quickActionsButtons}>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#2563eb",
                    color: "white",
                  }}
                  className="action-button"
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1d4ed8")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#2563eb")
                  }
                >
                  <span>➕</span>
                  Add New Driver
                </button>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#16a34a",
                    color: "white",
                  }}
                  className="action-button"
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#15803d")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#16a34a")
                  }
                >
                  <span>📊</span>
                  Generate Report
                </button>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#9333ea",
                    color: "white",
                  }}
                  className="action-button"
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#7c3aed")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#9333ea")
                  }
                >
                  <span>⚙️</span>
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div style={styles.ticketsCard}>
          <div style={styles.ticketsHeader}>
            <div style={styles.ticketsHeaderLeft}>
              <h3 style={styles.ticketsTitle}>Support Tickets</h3>
              <span style={styles.openBadge}>
                {tickets.filter((t) => t.status === "open").length} Open
              </span>
            </div>
            <button style={styles.viewAllButton}>View All</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Ticket ID</th>
                  <th style={styles.tableHeaderCell}>User</th>
                  <th style={styles.tableHeaderCell}>Subject</th>
                  <th style={styles.tableHeaderCell}>Priority</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    style={styles.tableRow}
                    className="table-row"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <td style={{ ...styles.tableCell, fontWeight: "500" }}>
                      #{ticket.id}
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.userCell}>
                        <div style={styles.userAvatar}>
                          {ticket.user_id.toString().slice(-2)}
                        </div>
                        <span>User {ticket.user_id}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.subjectCell}>
                        <div style={styles.subjectTitle}>{ticket.subject}</div>
                        <div style={styles.subjectDescription}>
                          {ticket.description}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td style={styles.tableCell}>
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td style={{ ...styles.tableCell, color: "#6b7280" }}>
                      {ticket.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div style={styles.modal} onClick={() => setSelectedTicket(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Ticket #{selectedTicket.id}</h3>
              <button
                style={styles.closeButton}
                className="close-button"
                onClick={() => setSelectedTicket(null)}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Subject</label>
                <p style={styles.modalValue}>{selectedTicket.subject}</p>
              </div>
              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Description</label>
                <p style={styles.modalValue}>{selectedTicket.description}</p>
              </div>
              <div style={styles.modalGrid}>
                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Status</label>
                  <div>{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Priority</label>
                  <div>{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
              </div>
              <div style={styles.modalActions}>
                <button
                  style={{
                    ...styles.modalButton,
                    backgroundColor: "#2563eb",
                    color: "white",
                  }}
                >
                  Assign
                </button>
                <button
                  style={{
                    ...styles.modalButton,
                    backgroundColor: "#16a34a",
                    color: "white",
                  }}
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
