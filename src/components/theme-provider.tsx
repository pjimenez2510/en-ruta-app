"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useTenantColors } from "@/core/context/tenant-context";
import { getContrastColor } from "@/lib/utils";
import { useState, useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { colors } = useTenantColors();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="light"
      storageKey="theme"
    >
      <style jsx global>{`
        :root {
          --primary: ${colors.primary};
          --primary-foreground: ${getContrastColor(colors.primary)};
          --secondary: ${colors.secondary};
          --secondary-foreground: ${getContrastColor(colors.secondary)};
        }
      `}</style>
      {children}
    </NextThemesProvider>
  );
}
