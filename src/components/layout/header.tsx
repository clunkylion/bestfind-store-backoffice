"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Sesión cerrada");
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
      <MobileNav />
      <div className="md:hidden" />
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-auto gap-2">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Salir</span>
      </Button>
    </header>
  );
}
