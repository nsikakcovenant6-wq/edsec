import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("edsec_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      avatarUrl: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function requireRole(role: "ADMIN" | "STUDENT") {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    return null;
  }

  return user;
}