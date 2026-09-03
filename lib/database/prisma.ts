import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is never empty during Vercel serverless cold start
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  process.env.DATABASE_URL = "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

try {
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
} catch (err) {
  console.warn("Prisma initialization fallback warning:", err);
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: "file:./dev.db",
      },
    },
  });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
