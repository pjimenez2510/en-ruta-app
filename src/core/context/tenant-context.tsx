"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "@/features/config-tenant/hooks/use_tenant";

interface TenantContextType {
  colors: {
    primary: string;
    secondary: string;
  };
  logoUrl: string | null;
  setColors: (colors: { primary: string; secondary: string }) => void;
  setLogoUrl: (url: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const DEFAULT_PRIMARY_COLOR = "#006d8b"; // Definir color primario por defecto
const DEFAULT_SECONDARY_COLOR = "#0284C7"; // Definir color secundario por defecto
const DEFAULT_LOGO_URL = null;

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [colors, setColors] = useState({
    primary: DEFAULT_PRIMARY_COLOR,
    secondary: DEFAULT_SECONDARY_COLOR,
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(DEFAULT_LOGO_URL);

  const tenantId =
    status === "authenticated" ? session?.user?.tenantId : undefined;
  const { data: tenantData } = useTenant(tenantId, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (tenantData?.data) {
      setColors({
        primary: tenantData.data.colorPrimario || DEFAULT_PRIMARY_COLOR,
        secondary: tenantData.data.colorSecundario || DEFAULT_SECONDARY_COLOR,
      });
      setLogoUrl(tenantData.data.logoUrl || DEFAULT_LOGO_URL);
    } else if (status === "unauthenticated") {
      // Restablecer a los colores por defecto al cerrar sesión
      setColors({
        primary: DEFAULT_PRIMARY_COLOR,
        secondary: DEFAULT_SECONDARY_COLOR,
      });
      setLogoUrl(DEFAULT_LOGO_URL);
    }
  }, [tenantData, status]);

  return (
    <TenantContext.Provider value={{ colors, setColors, logoUrl, setLogoUrl }}>
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
