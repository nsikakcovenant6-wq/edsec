import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const rawConnectionString = process.env.DIRECT_URL;

if (!rawConnectionString) {
  throw new Error("DIRECT_URL is not defined.");
}

/**
 * Remove SSL parameters from the connection string.
 *
 * pg can allow SSL options inside the connection string to override
 * the SSL configuration supplied below. We therefore clean the URL
 * and configure SSL explicitly.
 */
const connectionUrl = new URL(rawConnectionString);

connectionUrl.searchParams.delete("sslmode");
connectionUrl.searchParams.delete("uselibpqcompat");
connectionUrl.searchParams.delete("sslcert");
connectionUrl.searchParams.delete("sslkey");
connectionUrl.searchParams.delete("sslrootcert");

const connectionString = connectionUrl.toString();

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}