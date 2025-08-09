import React, { createContext, useContext, useMemo, useState } from "react";
import type { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // {
  //     id: "1",
  //     name: "최기웅",
  //     profileImageUrl: "https://via.placeholder.com/150",
  //     role: "청년",
  // }

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
