"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "./auth.store";

export const AuthContext = createContext<{
  isInitialized: boolean;
}>({
  isInitialized: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session, status } = useSession();
  const setUserRole = useAuthStore((state) => state.setUserRole);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      setUserRole(session.user.role);
    } else if (status === "unauthenticated") {
      logout();
    }
    setIsInitialized(true);
  }, [session, status, setUserRole, logout]);

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
