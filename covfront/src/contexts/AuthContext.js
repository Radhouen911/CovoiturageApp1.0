"use client";

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
          setIsLoggedIn(true);
          setUser(JSON.parse(userData)); // Set initial user from storage
          // Validate token and refresh user data from backend
          const response = await ApiService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data)); // Update local storage with fresh data
          } else {
            console.warn("Token validation failed:", response.message);
            logout(); // Log out if token is invalid or user data can't be fetched
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout(); // Log out on any error during auth check
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token); // Save token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data (including is_admin)
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
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token); // Save token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data (including is_admin)
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
