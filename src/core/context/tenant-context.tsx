"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "@/features/config-tenant/hooks/use_tenant";

interface TenantContextType {
  colors: {
    primary: string;
    secondary: string;
  };
  setColors: (colors: { primary: string; secondary: string }) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [colors, setColors] = useState({
    primary: "#0D9488", // Color por defecto
    secondary: "#0284C7", // Color por defecto
  });

  // Solo cargar los datos del tenant si hay una sesión activa
  const tenantId =
    status === "authenticated" ? session?.user?.tenantId : undefined;
  const { data: tenantData } = useTenant(tenantId, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (tenantData?.data) {
      setColors({
        primary: tenantData.data.colorPrimario || "#0D9488",
        secondary: tenantData.data.colorSecundario || "#0284C7",
      });
    }
  }, [tenantData]);

  return (
    <TenantContext.Provider value={{ colors, setColors }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantColors() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenantColors must be used within a TenantProvider");
  }
  return context;
}
