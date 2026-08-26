import { cookies } from "next/headers";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";

const SESSION_COOKIE = "edsec_session";

const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "edsec-development-secret-change-this";

export type UserRole = "ADMIN" | "STUDENT";

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

/* -------------------------------------------------------------------------- */
/* Base64 URL helpers                                                         */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Session signature                                                          */
/* -------------------------------------------------------------------------- */

function createSignature(payload: string) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/* -------------------------------------------------------------------------- */
/* Create session token                                                       */
/* -------------------------------------------------------------------------- */

function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };

  const encoded = base64UrlEncode(
    JSON.stringify(payload),
  );

  const signature = createSignature(encoded);

  return `${encoded}.${signature}`;
}

/* -------------------------------------------------------------------------- */
/* Verify session token                                                       */
/* -------------------------------------------------------------------------- */

function verifySessionToken(token: string) {
  try {
    const [encodedPayload, signature] =
      token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature =
      createSignature(encodedPayload);

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer =
      Buffer.from(expectedSignature);

    /*
     * timingSafeEqual requires equal-length buffers.
     */
    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    const validSignature =
      crypto.timingSafeEqual(
        signatureBuffer,
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
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Create login session                                                       */
/* -------------------------------------------------------------------------- */

export async function createLoginSession(
  userId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("ACCOUNT_NOT_ACTIVE");
  }

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

/* -------------------------------------------------------------------------- */
/* Destroy login session                                                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Get current user                                                           */
/* -------------------------------------------------------------------------- */

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(SESSION_COOKIE)?.value;

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

  /*
   * The database is always the source of truth.
   *
   * This means if an administrator changes a user's role
   * or status, the existing session cannot bypass that change.
   */
  if (user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

/* -------------------------------------------------------------------------- */
/* Require authenticated user                                                 */
/* -------------------------------------------------------------------------- */

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

/* -------------------------------------------------------------------------- */
/* Require administrator                                                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Require specific role                                                      */
/* -------------------------------------------------------------------------- */

export async function requireRole(
  role: UserRole,
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }

  return user;
}