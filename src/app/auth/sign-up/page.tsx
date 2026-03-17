"use client";

import { AuthView } from "@neondatabase/auth/react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">BestFinds</h1>
          <p className="text-muted-foreground">Crear cuenta</p>
        </div>
        <AuthView pathname="sign-up" />
      </div>
    </div>
  );
}
