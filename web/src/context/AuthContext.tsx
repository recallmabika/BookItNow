"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "guest" | "host" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: UserProfile, redirectTo?: string) => void;
  logout: (redirectTo?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("bookitnow_token");
      const savedUser = localStorage.getItem("bookitnow_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Failed to parse auth state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: UserProfile, redirectTo?: string) => {
    localStorage.setItem("bookitnow_token", newToken);
    localStorage.setItem("bookitnow_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push(newUser.role === "admin" ? "/admin" : "/");
    }
  };

  const logout = (redirectTo: string = "/") => {
    localStorage.removeItem("bookitnow_token");
    localStorage.removeItem("bookitnow_user");
    setToken(null);
    setUser(null);
    router.push(redirectTo);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
