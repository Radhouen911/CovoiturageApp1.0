import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          // Set initial state from storage
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));

          // Validate token with server
          const response = await ApiService.getCurrentUser();
          if (response.success) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            console.warn("Token validation failed:", response.message);
            logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      if (response.success) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      if (response.success) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
