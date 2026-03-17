"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { useQueryClientInstance } from "@/lib/query-client";
import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClientInstance();

  return (
    <QueryClientProvider client={queryClient}>
      <NeonAuthUIProvider authClient={authClient}>
        {children}
      </NeonAuthUIProvider>
    </QueryClientProvider>
  );
}
