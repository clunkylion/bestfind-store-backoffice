"use client";

import { UserButton } from "@neondatabase/auth/react";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
      <MobileNav />
      <div className="md:hidden" />
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
}
