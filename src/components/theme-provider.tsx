"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useTenantColors } from "@/core/context/tenant-context";
import { getContrastColor } from "@/lib/utils";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { colors } = useTenantColors();

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
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
