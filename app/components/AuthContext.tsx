/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Define user type (based on what the backend returns)
interface User {
  id: string;
  name: string;
  email: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<void>;
  isAuthenticated: boolean;
}

// Define login credentials type
interface LoginCredentials {
  email: string;
  password: string;
}

// Define signup data type
interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Define the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
  };

  const signup = async (userData: SignupData) => {
    try {
      const response = await axios.post("/api/auth/signup", userData);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);
      router.push("/dashboard");
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
