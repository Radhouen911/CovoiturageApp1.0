import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
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
      data: config.data,
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
  async register(userData) {
    try {
      const response = await api.post("/api/register", userData);
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
      const response = await api.post("/api/login", credentials);
      console.log("Login response:", response.data);
      if (response.data.success && response.data.data.token) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Login successful, token stored:", token);
        return response.data;
      } else {
        console.error("Login failed: Invalid response format", response.data);
        throw new Error(response.data.message || "Erreur de connexion");
      }
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
      await api.post("/api/logout");
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
      const response = await api.get("/api/user");
      return response.data;
    } catch (error) {
      console.error("Get current user failed:", error);
      throw error;
    }
  }

  async searchRides(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/api/rides?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Search rides failed:", error);
      throw error;
    }
  }

  async createRide(rideData) {
    try {
      const response = await api.post("/api/rides", rideData);
      return response.data;
    } catch (error) {
      console.error("Create ride failed:", error);
      throw error;
    }
  }

  async getMyRides() {
    try {
      const response = await api.get("/api/my-rides");
      return response.data;
    } catch (error) {
      console.error("Get my rides failed:", error);
      throw error;
    }
  }

  async getRideDetails(rideId) {
    try {
      const response = await api.get(`/api/rides/${rideId}`);
      return response.data;
    } catch (error) {
      console.error("Get ride details failed:", error);
      throw error;
    }
  }

  async bookRide(rideId, bookingData) {
    try {
      const response = await api.post("/api/bookings", {
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
      const response = await api.get("/api/bookings");
      return response.data;
    } catch (error) {
      console.error("Get my bookings failed:", error);
      throw error;
    }
  }

  async getBookingRequests() {
    try {
      const response = await api.get("/api/booking-requests");
      return response.data;
    } catch (error) {
      console.error("Get booking requests failed:", error);
      throw error;
    }
  }

  async acceptBooking(bookingId) {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      console.error("Accept booking failed:", error);
      throw error;
    }
  }

  async rejectBooking(bookingId) {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/reject`);
      return response.data;
    } catch (error) {
      console.error("Reject booking failed:", error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Cancel booking failed:", error);
      throw error;
    }
  }

  async createConversation(otherUserId, rideId = null) {
    try {
      const response = await api.post("/api/conversations", {
        other_user_id: otherUserId,
        ride_id: rideId,
      });
      return response.data;
    } catch (error) {
      console.error("Create conversation failed:", error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new ApiService();
