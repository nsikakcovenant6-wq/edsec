import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/prisma";
import { createLoginSession } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email address and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        enrollments: { where: { status: "ACTIVE" }, select: { id: true }, take: 1 },
        applications: {
          where: { status: { in: ["PENDING", "CONTACTED"] } },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid email address or password." }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ message: user.status === "SUSPENDED" ? "Your account has been suspended. Please contact EDSEC." : "Your account is currently inactive." }, { status: 403 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ message: "Invalid email address or password." }, { status: 401 });
    }

    await createLoginSession(user.id);

    const redirectTo =
      user.role === "ADMIN"
        ? "/admin"
        : user.enrollments.length > 0
          ? "/student/dashboard"
          : "/applicant";

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      redirectTo,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ message: "Unable to sign in right now. Please try again." }, { status: 500 });
  }
}
