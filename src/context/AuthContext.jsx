/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// frontend/src/context/AuthContext.js

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post("/api/auth/signup", userData);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      throw new Error("Signup failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signup, isAuthenticated: !!user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
