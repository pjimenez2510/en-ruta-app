"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TenantThemeContextType = {
  primaryColor: string;
  secondaryColor: string;
  setTenantColors: (primary: string, secondary: string) => void;
};

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(
  undefined
);

export function TenantThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryColor, setPrimaryColor] = useState("#1E90FF");
  const [secondaryColor, setSecondaryColor] = useState("#FFD700");

  const setTenantColors = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };

  useEffect(() => {
    // Actualizar las variables CSS cuando cambien los colores
    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--secondary", secondaryColor);

    // También actualizamos los colores de hover y estados activos
    root.style.setProperty("--primary-hover", `${primaryColor}E6`); // 90% de opacidad
    root.style.setProperty("--secondary-hover", `${secondaryColor}E6`); // 90% de opacidad
  }, [primaryColor, secondaryColor]);

  return (
    <TenantThemeContext.Provider
      value={{ primaryColor, secondaryColor, setTenantColors }}
    >
      {children}
    </TenantThemeContext.Provider>
  );
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTenantTheme debe ser usado dentro de un TenantThemeProvider"
    );
  }
  return context;
}
