"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Algo salió mal</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message || "Ocurrió un error al cargar esta página."}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
