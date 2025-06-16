"use client";

import { QueryProvider } from "@/core/infrastructure/query-client";
import { AuthSessionProvider } from "@/features/auth/presentation/providers/session-provider";
import { AuthProvider } from "@/features/auth/presentation/context/auth.provider";
import { TenantProvider } from "@/core/context/tenant-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthSessionProvider>
        <AuthProvider>
          <TenantProvider>
            <ThemeProvider>
              {children}
              <Toaster richColors closeButton position="top-right" />
            </ThemeProvider>
          </TenantProvider>
        </AuthProvider>
      </AuthSessionProvider>
    </QueryProvider>
  );
}
