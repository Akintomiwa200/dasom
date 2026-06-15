import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Fallback allows `prisma generate` before .env is configured (no DB connection needed).
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/dasom",
  },
});
