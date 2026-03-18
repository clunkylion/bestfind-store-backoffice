import { createAuthServer, neonAuth } from "@neondatabase/auth/next/server";

export const authServer = createAuthServer();

export async function getSession() {
  const { session, user } = await neonAuth();
  if (!session || !user) return null;
  return { session, user };
}

export async function requireSession() {
  const result = await getSession();
  if (!result) {
    throw new Error("Unauthorized");
  }
  return result;
}
