import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { createToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    // ------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Require first and last name
    const nameParts = fullName.split(/\s+/);

    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ") || "";

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your first and last name.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // CHECK EXISTING ACCOUNT
    // ------------------------------------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // ------------------------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // ------------------------------------------------------------
    // CREATE STUDENT
    // ------------------------------------------------------------

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        passwordHash,
        role: "STUDENT",
      },
    });

    // ------------------------------------------------------------
    // AUTOMATICALLY LOG THE NEW STUDENT IN
    // ------------------------------------------------------------

    const token = await createToken({
      userId: user.id,
      role: user.role,
    });

    // ------------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------------

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        redirectTo: "/student/dashboard",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // ------------------------------------------------------------
    // AUTHENTICATION COOKIE
    // ------------------------------------------------------------

    response.cookies.set({
      name: "edsec_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}