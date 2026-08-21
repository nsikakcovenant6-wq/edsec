import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Please check your .env file."
    );
  }

  console.log("DATABASE_URL found.");
  console.log("Connecting to the EDSEC database...");

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    const email = "admin@edsec.com";
    const password = "EDSEC@Admin2026";
    const passwordHash = await bcrypt.hash(password, 12);

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      const updatedAdmin = await prisma.user.update({
        where: {
          email,
        },
        data: {
          firstName: "Mecan",
          lastName: "EDSEC",
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
        },
      });

      console.log("");
      console.log("======================================");
      console.log("EDSEC ADMIN ACCOUNT READY");
      console.log("======================================");
      console.log(`Email: ${updatedAdmin.email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${updatedAdmin.role}`);
      console.log("======================================");
      console.log("");
      return;
    }

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "Mecan",
        lastName: "EDSEC",
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    console.log("");
    console.log("======================================");
    console.log("EDSEC ADMIN ACCOUNT CREATED");
    console.log("======================================");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}`);
    console.log("======================================");
    console.log("");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("");
  console.error("======================================");
  console.error("FAILED TO CREATE EDSEC ADMIN");
  console.error("======================================");
  console.error(error);
  process.exit(1);
});