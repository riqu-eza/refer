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
}

interface UserContextType {
  user: IUser | null;
  loading: boolean;
  login: (user: IUser) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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

      console.log("⬅️ Setting loading = false");
      setLoading(false);
    }

    load();
  }, []);

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
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
