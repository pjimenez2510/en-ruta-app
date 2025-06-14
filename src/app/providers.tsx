'use client';

import { QueryProvider } from '@/core/infrastructure/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}