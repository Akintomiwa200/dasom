import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseUrl } from "@/lib/database-url";

type PrismaGlobal = {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

function createPrismaClient(connectionString: string): PrismaClient {
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  const connectionString = getDatabaseUrl();

  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prisma &&
    globalForPrisma.prismaUrl === connectionString
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaUrl = connectionString;
  }

  return client;
}

/** Lazy proxy — avoids stale clients when DATABASE_URL changes after hot reload */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});
