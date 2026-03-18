"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {error.message || "Algo salió mal. Intenta de nuevo."}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
