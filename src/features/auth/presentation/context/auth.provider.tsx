"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "./auth.store";
import { jwtDecode } from "jwt-decode";

interface TenantInfo {
  colorPrimario: string;
  colorSecundario: string;
}

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
    if (status === "authenticated" && session?.user?.accessToken) {
      try {
        // Decodificar el token para obtener la información del tenant
        const decodedToken = jwtDecode<{ tenants: { tenant: TenantInfo }[] }>(
          session.user.accessToken
        );
        const tenantInfo = decodedToken.tenants?.[0]?.tenant;

        if (tenantInfo) {
          // Actualizar los colores del tenant directamente en el DOM
          const root = document.documentElement;
          root.style.setProperty("--primary", tenantInfo.colorPrimario);
          root.style.setProperty("--secondary", tenantInfo.colorSecundario);
          root.style.setProperty(
            "--primary-hover",
            `${tenantInfo.colorPrimario}E6`
          );
          root.style.setProperty(
            "--secondary-hover",
            `${tenantInfo.colorSecundario}E6`
          );
        }

        if (session.user.role) {
          setUserRole(session.user.role);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else if (status === "unauthenticated") {
      logout();
      // Restaurar los colores por defecto al cerrar sesión
      const root = document.documentElement;
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--primary-hover");
      root.style.removeProperty("--secondary-hover");
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
