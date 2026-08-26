import { cookies } from "next/headers";
import crypto from "crypto";

import { prisma } from "@/app/lib/prisma";

const SESSION_COOKIE = "edsec_session";

const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "edsec-development-secret-change-this";

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

type UserRole = "ADMIN" | "STUDENT";

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(value: string) {
  return Buffer.from(
    value.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf8");
}

function createSignature(payload: string) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    userId,

    // Keep students signed in for a long period.
    // They can explicitly log out by deleting the cookie.
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));

  const signature = createSignature(encoded);

  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string) {
  try {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = createSignature(encodedPayload);

    const providedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    // timingSafeEqual throws when buffers have different lengths.
    if (providedBuffer.length !== expectedBuffer.length) {
      return null;
    }

    const validSignature = crypto.timingSafeEqual(
      providedBuffer,
      expectedBuffer,
    );

    if (!validSignature) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload),
    ) as SessionPayload;

    if (!payload.userId) {
      return null;
    }

    if (
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a login session for a user.
 */
export async function createLoginSession(userId: string) {
  const cookieStore = await cookies();

  const token = createSessionToken(userId);

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

/**
 * Destroy the current login session.
 */
export async function destroyLoginSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get the currently authenticated user.
 *
 * Returns null when:
 * - no session exists
 * - the session is invalid
 * - the session has expired
 * - the user no longer exists
 * - the user is not ACTIVE
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    include: {
      studentProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

/**
 * Require an authenticated user.
 *
 * Throws UNAUTHORIZED when nobody is logged in.
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

/**
 * Require an administrator.
 *
 * Throws:
 * - UNAUTHORIZED when nobody is logged in
 * - FORBIDDEN when the logged-in user is not an admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

/**
 * Require a specific user role.
 *
 * This is used throughout the EDSEC platform by both
 * admin and student pages/actions.
 *
 * Examples:
 *
 * await requireRole("ADMIN");
 * await requireRole("STUDENT");
 */
export async function requireRole(role: UserRole) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }

  return user;
}