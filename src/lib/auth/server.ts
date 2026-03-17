import { createAuthClient } from "@neondatabase/auth";
import { headers } from "next/headers";

const authClient = createAuthClient(process.env.NEON_AUTH_BASE_URL!);

export async function getSession() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const session = await authClient.getSession({
    fetchOptions: {
      headers: { cookie },
    },
  });

  return session.data;
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
