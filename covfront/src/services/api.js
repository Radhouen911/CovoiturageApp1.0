import axios from "axios";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", {
      url: config.url,
      method: config.method.toUpperCase(),
      headers: config.headers,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401 && error.config.url === "/api/logout") {
      console.warn("401 Error: Clearing token and user data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

class ApiService {
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      if (response.data.success && response.data.data.token) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async login(credentials) {
    console.log("Attempting login with credentials:", {
      email: credentials.email,
      password: "****",
    });
    try {
      const response = await api.post("/login", credentials);
      if (response.data.success && response.data.data.token) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return response.data;
      }
      throw new Error(response.data.message || "Erreur de connexion");
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  }

  async logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("Get current user failed:", error);
      throw error;
    }
  }

  async searchRides(params) {
    try {
      const response = await api.get("/rides", { params });
      const rawData = response.data;
      console.log("Raw Server Response:", JSON.stringify(rawData, null, 2));

      if (!rawData.success || !rawData.data) {
        throw new Error("Invalid response structure");
      }

      const rides = rawData.data.data || [];
      const totalPages = rawData.data.last_page || 1;

      console.log("Extracted Rides:", rides);
      console.log("Extracted Total Pages:", totalPages);

      return {
        success: rawData.success,
        data: rides,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("Search rides failed:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async createTicket(ticketData) {
    try {
      const response = await api.post("/tickets", ticketData);
      return response.data;
    } catch (error) {
      console.error(
        "Create ticket failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getTickets() {
    try {
      const response = await api.get("/tickets");
      return response.data;
    } catch (error) {
      console.error(
        "Get tickets failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getTicket(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Get ticket failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
  async getTicketMessages(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}/messages`);
      return response.data;
    } catch (error) {
      console.error(
        "Get ticket messages failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async sendTicketMessage(ticketId, content) {
    try {
      const response = await api.post(`/tickets/${ticketId}/messages`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Send ticket message failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
  async updateTicket(ticketId, data) {
    try {
      const response = await api.put(`/tickets/${ticketId}`, data);
      return response.data;
    } catch (error) {
      console.error(
        "Update ticket failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async closeTicket(ticketId) {
    try {
      const response = await api.patch(`/tickets/${ticketId}/close`);
      return response.data;
    } catch (error) {
      console.error(
        "Close ticket failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
  async createRide(rideData) {
    try {
      const response = await api.post("/rides", rideData);
      return response.data;
    } catch (error) {
      console.error("Create ride failed:", error);
      throw error;
    }
  }

  async getMyRides() {
    try {
      const response = await api.get("/my-rides");
      return response.data;
    } catch (error) {
      console.error("Get my rides failed:", error);
      throw error;
    }
  }

  async getRideDetails(rideId) {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      console.error("Get ride details failed:", error);
      throw error;
    }
  }

  async bookRide(rideId, bookingData) {
    try {
      const response = await api.post("/bookings", {
        ride_id: rideId,
        ...bookingData,
      });
      return response.data;
    } catch (error) {
      console.error("Book ride failed:", error);
      throw error;
    }
  }

  async getMyBookings() {
    try {
      const response = await api.get("/bookings");
      return response.data;
    } catch (error) {
      console.error("Get my bookings failed:", error);
      throw error;
    }
  }

  async getBookingRequests() {
    try {
      const response = await api.get("/booking-requests");
      return response.data;
    } catch (error) {
      console.error("Get booking requests failed:", error);
      throw error;
    }
  }

  async acceptBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      console.error("Accept booking failed:", error);
      throw error;
    }
  }

  async rejectBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/reject`);
      return response.data;
    } catch (error) {
      console.error("Reject booking failed:", error);
      throw error;
    }
  }

  async getConversations() {
    try {
      const response = await api.get("/conversations");
      return response.data;
    } catch (error) {
      console.error("Get conversations failed:", error);
      throw error;
    }
  }

  async getConversation(conversationId) {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Get conversation failed:", error);
      throw error;
    }
  }

  async sendMessage(conversationId, message) {
    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        {
          content: message,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Send message failed:", error);
      throw error;
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Get messages failed:", error);
      throw error;
    }
  }

  async updateUserLocation(latitude, longitude) {
    try {
      const response = await api.post("/user/location", {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Update user location failed:", error);
      throw error;
    }
  }

  async getNearbyRides(latitude, longitude, radius = 10) {
    try {
      const response = await api.get(
        `/rides/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      return response.data;
    } catch (error) {
      console.error("Get nearby rides failed:", error);
      throw error;
    }
  }

  async getRideRoute(rideId) {
    try {
      const response = await api.get(`/rides/${rideId}/route`);
      return response.data;
    } catch (error) {
      console.error("Get ride route failed:", error);
      throw error;
    }
  }

  async updateRideLocation(rideId, latitude, longitude) {
    try {
      const response = await api.post(`/rides/${rideId}/location`, {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Update ride location failed:", error);
      throw error;
    }
  }
  async getGeneralStats() {
    try {
      const response = await api.get("/stats");
      return response.data;
    } catch (error) {
      console.error(
        "Get general stats failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getAllUsers() {
    // Assuming this endpoint returns a list of all users for an admin
    // If your /api/user only returns the current user, you'll need a new backend route like /api/admin/users
    try {
      const response = await api.get("/user"); // This might need to be /admin/users if /user only returns current user
      return response.data;
    } catch (error) {
      console.error(
        "Get all users failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getAllBookings() {
    try {
      const response = await api.get("/bookings");
      return response.data;
    } catch (error) {
      console.error(
        "Get all bookings failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getNotifications() {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error(
        "Get notifications failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
  async getDriverLocation(rideId) {
    try {
      const response = await api.get(`/rides/${rideId}/driver-location`);
      return response.data;
    } catch (error) {
      console.error("Get driver location failed:", error);
      throw error;
    }
  }

  async calculateFare(pickupLat, pickupLng, dropoffLat, dropoffLng) {
    try {
      const response = await api.post("/calculate-fare", {
        pickup: { latitude: pickupLat, longitude: pickupLng },
        dropoff: { latitude: dropoffLat, longitude: dropoffLng },
      });
      return response.data;
    } catch (error) {
      console.error("Calculate fare failed:", error);
      throw error;
    }
  }

  // Mock Payment Methods
  async createPaymentIntent(bookingId) {
    try {
      // Simulate a payment intent creation
      const mockPaymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `sk_mock_${Math.random().toString(36).substr(2)}`,
        amount: 300, // Example amount in cents
        currency: "eur",
        status: "succeeded",
      };
      console.log("Mock Payment Intent Created:", mockPaymentIntent);
      return {
        success: true,
        data: mockPaymentIntent,
      };
    } catch (error) {
      console.error("Mock create payment intent failed:", error);
      throw error;
    }
  }

  async confirmPayment(paymentData) {
    try {
      // Simulate payment confirmation
      const mockConfirmation = {
        id: paymentData.payment_intent_id || `pm_mock_${Date.now()}`,
        status: "succeeded",
        amount: paymentData.amount || 300,
        currency: "eur",
      };
      console.log("Mock Payment Confirmed:", mockConfirmation);
      return {
        success: true,
        data: mockConfirmation,
      };
    } catch (error) {
      console.error("Mock confirm payment failed:", error);
      throw error;
    }
  }

  async getPaymentHistory() {
    try {
      // Simulate payment history
      const mockHistory = [
        {
          id: `pm_001`,
          amount: 300,
          currency: "eur",
          status: "succeeded",
          date: "2025-07-14",
        },
        {
          id: `pm_002`,
          amount: 450,
          currency: "eur",
          status: "succeeded",
          date: "2025-07-13",
        },
      ];
      console.log("Mock Payment History:", mockHistory);
      return {
        success: true,
        data: mockHistory,
      };
    } catch (error) {
      console.error("Mock get payment history failed:", error);
      throw error;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      // Simulate payment details
      const mockDetail = {
        id: paymentId,
        amount: 300,
        currency: "eur",
        status: "succeeded",
        date: "2025-07-14",
      };
      console.log("Mock Payment Details:", mockDetail);
      return {
        success: true,
        data: mockDetail,
      };
    } catch (error) {
      console.error("Mock get payment details failed:", error);
      throw error;
    }
  }

  async requestRefund(paymentId, reason) {
    try {
      // Simulate refund
      const mockRefund = {
        id: `rf_mock_${Date.now()}`,
        payment_id: paymentId,
        amount: 300,
        currency: "eur",
        status: "succeeded",
        reason: reason,
      };
      console.log("Mock Refund Processed:", mockRefund);
      return {
        success: true,
        data: mockRefund,
      };
    } catch (error) {
      console.error("Mock request refund failed:", error);
      throw error;
    }
  }

  async createConversation(otherUserId, rideId = null) {
    try {
      const response = await api.post("/conversations", {
        other_user_id: otherUserId,
        ride_id: rideId,
      });
      return response.data;
    } catch (error) {
      console.error("Create conversation failed:", error);
      throw error;
    }
  }

  async getUnreadNotificationsCount() {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      console.error("Get unread notifications count failed:", error);
      throw error;
    }
  }

  async getNotifications() {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Get notifications failed:", error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Mark notification as read failed:", error);
      throw error;
    }
  }

  async markAllNotificationsAsRead() {
    try {
      const response = await api.put("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Mark all notifications as read failed:", error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put("/user", profileData);
      if (response.data.success && response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error(
        "Update profile failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await api.post("/user/avatar", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": undefined,
        },
      });
      if (response.data.success && response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error(
        "Upload avatar failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async deleteAvatar() {
    try {
      const response = await api.delete("/user/avatar");
      if (response.data.success && response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error(
        "Delete avatar failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
