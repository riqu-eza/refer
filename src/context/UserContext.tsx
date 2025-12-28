"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface IUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  isActivated: boolean;

  level: string;
}

interface UserContextType {
  user: IUser | null;
  loading: boolean;
  login: (user: IUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;   // <-- ADD THIS
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},         // <-- ADD THIS
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Extracted into a function so we can reuse it
  const loadUser = async () => {
    console.log("➡️ UserContext: calling /api/auth/me");

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      console.log("📥 Response status:", res.status);
      const data = await res.json();

      console.log("📡 /api/auth/me returned:", data);
      setUser(data.user);
    } catch (error) {
      console.error("🔥 UserContext ERROR:", error);
      setUser(null);
    }

    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser();
  }, []);

  // NEW: function to manually refresh user anytime
  const refreshUser = async () => {
    console.log("🔄 Refreshing user...");
    await loadUser();
  };

  const login = (userData: IUser) => {
    console.log("🔐 UserContext LOGIN:", userData);
    setUser(userData);
  };

  const logout = async () => {
    console.log("🚪 Logging out...");
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,     // <-- EXPOSE IT HERE
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
