import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

// Point to our own /api/auth proxy so cookies are set on our domain
const baseUrl = typeof window !== "undefined"
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

export const authClient = createAuthClient(baseUrl, {
  adapter: BetterAuthReactAdapter(),
});
