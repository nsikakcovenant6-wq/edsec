import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { createApplicantActivationToken } from "@/app/lib/applicant-activation";
import { sendApplicantActivationEmail } from "@/app/lib/email";

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "EDSEC",
    lastName: parts.slice(1).join(" ") || "Applicant",
  };
}

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.edsecict.com"
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser();

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth.trim() : "";
    const educationalLevel = typeof body.educationalLevel === "string" ? body.educationalLevel.trim() : "";
    const preferredFormat = typeof body.preferredFormat === "string" ? body.preferredFormat.trim() : "";
    const preferredStartDate = typeof body.preferredStartDate === "string" ? body.preferredStartDate.trim() : "";
    const additionalInfo = typeof body.additionalInfo === "string" ? body.additionalInfo.trim() : "";

    if (!fullName) return NextResponse.json({ success: false, message: "Full name is required." }, { status: 400 });
    if (!email) return NextResponse.json({ success: false, message: "Email address is required." }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    if (!phone) return NextResponse.json({ success: false, message: "Phone number is required." }, { status: 400 });
    if (!courseId) return NextResponse.json({ success: false, message: "Please select a course." }, { status: 400 });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, slug: true, status: true },
    });

    if (!course) {
      return NextResponse.json({ success: false, message: "The selected course could not be found. Please refresh the page and select the course again." }, { status: 400 });
    }

    if (course.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "This course is currently unavailable for applications. Please select another course." }, { status: 400 });
    }

    const parsedDateOfBirth = parseDate(dateOfBirth);
    const parsedPreferredStartDate = parseDate(preferredStartDate);

    if (dateOfBirth && !parsedDateOfBirth) return NextResponse.json({ success: false, message: "Please enter a valid date of birth." }, { status: 400 });
    if (preferredStartDate && !parsedPreferredStartDate) return NextResponse.json({ success: false, message: "Please enter a valid preferred start date." }, { status: 400 });

    const name = splitName(fullName);
    let userId = currentUser?.id ?? null;
    let activationUrl: string | undefined;
    let accountCreated = false;

    if (!userId) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, passwordHash: true, firstName: true, lastName: true },
      });

      if (existingUser?.role === "ADMIN") {
        return NextResponse.json({ success: false, message: "This email address cannot be used for an application." }, { status: 400 });
      }

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const temporaryPassword = crypto.randomBytes(24).toString("base64url");
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);

        const applicant = await prisma.user.create({
          data: {
            email,
            passwordHash,
            firstName: name.firstName,
            lastName: name.lastName,
            phone: phone || null,
            role: "STUDENT",
            status: "ACTIVE",
          },
        });

        userId = applicant.id;
        accountCreated = true;

        activationUrl = `${getAppUrl()}/activate-account?token=${encodeURIComponent(createApplicantActivationToken({ userId: applicant.id, applicationId: "PENDING_APPLICATION", passwordHash }))}`;
      }
    }

    const application = await prisma.application.create({
      data: {
        applicantId: userId,
        fullName,
        email,
        phone,
        courseId: course.id,
        dateOfBirth: parsedDateOfBirth,
        educationalLevel: educationalLevel || null,
        preferredFormat: preferredFormat || null,
        preferredStartDate: parsedPreferredStartDate,
        additionalInfo: additionalInfo || null,
        status: "PENDING",
      },
      include: { course: true },
    });

    if (accountCreated && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
      if (user) {
        activationUrl = `${getAppUrl()}/activate-account?token=${encodeURIComponent(createApplicantActivationToken({ userId, applicationId: application.id, passwordHash: user.passwordHash }))}`;

        try {
          await sendApplicantActivationEmail({
            to: email,
            name: fullName,
            course: course.title,
            activationUrl,
          });
        } catch (emailError) {
          console.error("APPLICANT_ACTIVATION_EMAIL_ERROR:", emailError);
        }
      }
    }

    console.log("APPLICATION_CREATED", {
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      courseId: application.courseId,
      course: application.course?.title,
      applicantId: userId,
      accountCreated,
    });

    return NextResponse.json({
      success: true,
      message: accountCreated
        ? "Your application has been submitted. We also created your EDSEC applicant account. Check your email for the secure link to set your password."
        : "Your application has been submitted successfully. You can sign in to your EDSEC account to track it.",
      application: {
        id: application.id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        course: application.course?.title ?? course.title,
        status: application.status,
        createdAt: application.createdAt,
      },
      applicantAccount: {
        created: accountCreated,
        activationUrl: process.env.NODE_ENV === "development" ? activationUrl : undefined,
        portalUrl: "/applicant",
      },
    }, { status: 201 });
  } catch (error) {
    console.error("APPLICATION_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to submit your application. Please try again." }, { status: 500 });
  }
}
