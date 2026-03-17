"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { verifyRegistrationCode } from "./actions";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const code = formData.get("code") as string;

    // Verify invite code server-side
    const codeResult = await verifyRegistrationCode(code);
    if (!codeResult.valid) {
      toast.error("Código de invitación inválido");
      setLoading(false);
      return;
    }

    try {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.error) {
        toast.error(result.error.message ?? "Error al registrar");
        setLoading(false);
        return;
      }
      toast.success("Cuenta creada exitosamente");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Error al crear la cuenta");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">BestFinds</h1>
          <p className="text-sm text-muted-foreground mt-1">Crear cuenta</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Registro</CardTitle>
              <CardDescription>Solo con código de invitación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Invitación</Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Ingresa el código"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/sign-in" className="underline underline-offset-2 hover:text-foreground">
                  Iniciar sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
