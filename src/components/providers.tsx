"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useQueryClientInstance } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClientInstance();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
