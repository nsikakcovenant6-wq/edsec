"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { createApplicantActivationToken } from "@/app/lib/applicant-activation";
import { sendApplicationApprovedEmail } from "@/app/lib/email";

type ActionResult = {
  success: boolean;
  message: string;
  studentNumber?: string;
  activationUrl?: string;
  whatsappUrl?: string;
};

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.edsecict.com").replace(/\/$/, "");
}

function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

function buildWhatsAppUrl(phone: string, message: string) {
  const number = normalizeWhatsAppNumber(phone);
  if (number.length < 10) return undefined;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

async function generateStudentNumber() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const studentNumber = `EDSEC-${year}-${randomPart}`;
    const existing = await prisma.studentProfile.findUnique({ where: { studentNumber }, select: { id: true } });
    if (!existing) return studentNumber;
  }
  throw new Error("Unable to generate a unique student number.");
}

export async function markApplicationContacted(applicationId: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  if (!applicationId) return { success: false, message: "Application ID is required." };

  try {
    await prisma.application.update({ where: { id: applicationId }, data: { status: "CONTACTED" } });
    return { success: true, message: "Application marked as contacted." };
  } catch (error) {
    console.error("MARK APPLICATION CONTACTED ERROR:", error);
    return { success: false, message: "Unable to update the application." };
  }
}

export async function rejectApplication(applicationId: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  if (!applicationId) return { success: false, message: "Application ID is required." };

  try {
    await prisma.application.update({ where: { id: applicationId }, data: { status: "REJECTED" } });
    return { success: true, message: "Application rejected." };
  } catch (error) {
    console.error("REJECT APPLICATION ERROR:", error);
    return { success: false, message: "Unable to reject the application." };
  }
}

export async function deleteApplication(applicationId: string): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  if (!applicationId) return { success: false, message: "Application ID is required." };

  try {
    const application = await prisma.application.findUnique({ where: { id: applicationId }, select: { id: true, fullName: true, status: true } });
    if (!application) return { success: false, message: "Application not found or it has already been deleted." };

    await prisma.application.delete({ where: { id: application.id } });
    console.log("EDSEC APPLICATION DELETED:", { applicationId: application.id, applicantName: application.fullName, previousStatus: application.status, deletedBy: admin.id });
    return { success: true, message: "Application deleted successfully." };
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    return { success: false, message: "Unable to delete the application. Please try again." };
  }
}

export async function approveAndEnroll(applicationId: string): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  if (!applicationId) return { success: false, message: "Application ID is required." };

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { course: true, applicant: true },
    });

    if (!application) return { success: false, message: "Application not found." };
    if (application.status === "REJECTED") return { success: false, message: "A rejected application cannot be enrolled." };
    if (!application.courseId || !application.course) return { success: false, message: "This application does not have a course selected. Assign a course before approving." };
    if (application.course.status !== "ACTIVE") return { success: false, message: "The selected course is not currently active. Activate the course first." };

    const course = application.course;
    const email = application.email.trim().toLowerCase();
    const existingUser = application.applicant || await prisma.user.findUnique({ where: { email }, include: { studentProfile: true } });

    if (existingUser?.role === "ADMIN") {
      return { success: false, message: "This email already belongs to an administrator and cannot be enrolled as a student." };
    }

    if (existingUser) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: existingUser.id, courseId: course.id } },
        include: { cohort: true },
      });

      if (existingEnrollment) {
        await prisma.application.update({ where: { id: application.id }, data: { status: "APPROVED", applicantId: existingUser.id } });
        return {
          success: true,
          message: "The applicant is already enrolled in this course. The application has been approved.",
          studentNumber: existingUser.studentProfile?.studentNumber ?? undefined,
        };
      }
    }

    const studentNumber = existingUser?.studentProfile?.studentNumber ?? await generateStudentNumber();
    const nameParts = application.fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || existingUser?.firstName || "EDSEC";
    const lastName = nameParts.slice(1).join(" ") || existingUser?.lastName || "Student";

    let studentId = existingUser?.id;
    let needsActivation = false;
    let activationUrl: string | undefined;

    const result = await prisma.$transaction(async (tx) => {
      if (existingUser) {
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            firstName,
            lastName,
            phone: application.phone?.trim() || existingUser.phone,
            role: "STUDENT",
            status: "ACTIVE",
          },
        });

        if (!existingUser.studentProfile) {
          await tx.studentProfile.create({
            data: {
              userId: existingUser.id,
              studentNumber,
              dateOfBirth: application.dateOfBirth,
              educationalLevel: application.educationalLevel,
            },
          });
        }
      } else {
        const initialPasswordHash = await bcrypt.hash(crypto.randomBytes(24).toString("base64url"), 12);
        const newStudent = await tx.user.create({
          data: {
            email,
            passwordHash: initialPasswordHash,
            firstName,
            lastName,
            phone: application.phone?.trim() || null,
            role: "STUDENT",
            status: "ACTIVE",
          },
        });
        studentId = newStudent.id;
        needsActivation = true;

        await tx.studentProfile.create({
          data: {
            userId: newStudent.id,
            studentNumber,
            dateOfBirth: application.dateOfBirth,
            educationalLevel: application.educationalLevel,
          },
        });
      }

      if (!studentId) throw new Error("Unable to resolve the student account.");

      // If exactly one current/upcoming cohort exists, attach it automatically.
      // If there are multiple cohorts, leave it unassigned so an admin can choose the correct one.
      const cohorts = await tx.cohort.findMany({
        where: { courseId: course.id, status: { in: ["UPCOMING", "ACTIVE"] } },
        orderBy: [{ startDate: "asc" }, { createdAt: "asc" }],
        select: { id: true },
      });
      const cohortId = cohorts.length === 1 ? cohorts[0].id : null;

      const enrollment = await tx.enrollment.create({
        data: {
          studentId,
          courseId: course.id,
          cohortId,
          status: "ACTIVE",
          progress: 0,
        },
      });

      await tx.studentActivity.create({
        data: {
          studentId,
          enrollmentId: enrollment.id,
          type: "COURSE_ENROLLED",
          title: "Course Enrollment",
          description: `Enrolled in ${course.title}${cohortId ? " and assigned to a cohort." : "."}`,
          metadata: JSON.stringify({ courseId: course.id, applicationId: application.id, cohortId, enrolledBy: admin.id }),
        },
      });

      await tx.application.update({ where: { id: application.id }, data: { status: "APPROVED", applicantId: studentId } });
      return { studentId, enrollmentId: enrollment.id, cohortId };
    });

    if (needsActivation && result.studentId) {
      const createdUser = await prisma.user.findUnique({ where: { id: result.studentId }, select: { passwordHash: true } });
      if (createdUser) {
        activationUrl = `${getAppUrl()}/activate-account?token=${encodeURIComponent(createApplicantActivationToken({ userId: result.studentId, applicationId: application.id, passwordHash: createdUser.passwordHash }))}`;
      }
    }

    const whatsappMessage = `Hello ${application.fullName}, congratulations! Your application to EDSEC ICT Institute for ${course.title} has been approved. Your student number is ${studentNumber}. ${activationUrl ? `Set your password here: ${activationUrl}` : "You can now sign in to your EDSEC account."}`;
    const whatsappUrl = buildWhatsAppUrl(application.phone, whatsappMessage);

    try {
      await sendApplicationApprovedEmail({
        to: email,
        name: application.fullName,
        course: course.title,
        studentNumber,
        activationUrl,
      });
    } catch (emailError) {
      console.error("APPLICATION_APPROVAL_EMAIL_ERROR:", emailError);
    }

    console.log("EDSEC APPLICATION APPROVED:", {
      applicationId: application.id,
      studentId: result.studentId,
      enrollmentId: result.enrollmentId,
      cohortId: result.cohortId,
      email,
    });

    return {
      success: true,
      message: result.cohortId
        ? "Application approved, student account activated, enrollment created, and cohort assigned."
        : "Application approved, student account activated, and enrollment created. Assign a cohort when ready.",
      studentNumber,
      activationUrl,
      whatsappUrl,
    };
  } catch (error) {
    console.error("APPROVE AND ENROLL ERROR:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unable to approve and enroll the applicant." };
  }
}
