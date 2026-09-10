import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import {
  activationMatchesPasswordHash,
  verifyApplicantActivationToken,
} from "@/app/lib/applicant-activation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json({ success: false, message: "Activation token and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Your password must be at least 8 characters long." }, { status: 400 });
    }

    const payload = verifyApplicantActivationToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "This activation link is invalid or has expired. Please request a new one." }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: payload.applicationId },
      select: { id: true, applicantId: true, status: true, email: true },
    });

    if (!application || application.applicantId !== payload.userId) {
      return NextResponse.json({ success: false, message: "This activation link is no longer valid." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, passwordHash: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "This applicant account is unavailable. Please contact EDSEC." }, { status: 400 });
    }

    if (!activationMatchesPasswordHash(payload.passwordFingerprint, user.passwordHash)) {
      return NextResponse.json({ success: false, message: "This activation link has already been used. Sign in with your password instead." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been set successfully. You can now sign in to your EDSEC applicant portal.",
      redirectTo: "/login",
    });
  } catch (error) {
    console.error("APPLICANT_ACTIVATION_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to activate your account right now. Please try again." }, { status: 500 });
  }
}
