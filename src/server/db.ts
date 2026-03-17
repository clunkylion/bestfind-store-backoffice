import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Infer model types from the Prisma client
type DbClient = typeof db;
export type Product = Awaited<ReturnType<DbClient["product"]["findFirstOrThrow"]>>;
export type Purchase = Awaited<ReturnType<DbClient["purchase"]["findFirstOrThrow"]>>;
export type Sale = Awaited<ReturnType<DbClient["sale"]["findFirstOrThrow"]>>;
