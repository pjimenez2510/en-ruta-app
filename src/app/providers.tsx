"use client";

import { QueryProvider } from "@/core/infrastructure/query-client";
import { AuthSessionProvider } from "@/features/auth/presentation/providers/session-provider";
import { AuthProvider } from "@/features/auth/presentation/context/auth.provider";
import { TenantProvider } from "@/core/context/tenant-context";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthSessionProvider>
        <AuthProvider>
          <TenantProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TenantProvider>
        </AuthProvider>
      </AuthSessionProvider>
    </QueryProvider>
  );
}
