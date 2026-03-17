import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
