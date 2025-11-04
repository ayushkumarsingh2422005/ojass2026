"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  ojassId: string;
  name: string;
  phone: string;
  referralCode: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS = [
  {
    email: "john@example.com",
    password: "password123",
    userData: {
      ojassId: "OJASS2026CA0456",
      name: "John Doe",
      phone: "+91 9876543210",
      referralCode: "OJASSJOHN45",
      email: "john@example.com",
    },
  },
  {
    email: "test@ojass.com",
    password: "test123",
    userData: {
      ojassId: "OJASS2026CA0234",
      name: "Test User",
      phone: "+91 9876543211",
      referralCode: "OJASSTEST34",
      email: "test@ojass.com",
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Find user in mock database
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.userData);
      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("ojass_user", JSON.stringify(foundUser.userData));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ojass_user");
    }
  };

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("ojass_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

