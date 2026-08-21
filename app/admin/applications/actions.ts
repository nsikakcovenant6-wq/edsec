"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

type ActionResult = {
  success: boolean;
  message: string;
  temporaryPassword?: string;
  studentNumber?: string;
};

function generateTemporaryPassword() {
  return `EDSEC@${crypto.randomBytes(4).toString("hex")}`;
}

async function generateStudentNumber() {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const randomPart = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const studentNumber = `EDSEC-${year}-${randomPart}`;

    const existing = await prisma.studentProfile.findUnique({
      where: {
        studentNumber,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return studentNumber;
    }
  }

  throw new Error("Unable to generate a unique student number.");
}

export async function markApplicationContacted(
  applicationId: string
): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!applicationId) {
    return {
      success: false,
      message: "Application ID is required.",
    };
  }

  try {
    await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "CONTACTED",
      },
    });

    return {
      success: true,
      message: "Application marked as contacted.",
    };
  } catch (error) {
    console.error("MARK APPLICATION CONTACTED ERROR:", error);

    return {
      success: false,
      message: "Unable to update the application.",
    };
  }
}

export async function rejectApplication(
  applicationId: string
): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!applicationId) {
    return {
      success: false,
      message: "Application ID is required.",
    };
  }

  try {
    await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return {
      success: true,
      message: "Application rejected.",
    };
  } catch (error) {
    console.error("REJECT APPLICATION ERROR:", error);

    return {
      success: false,
      message: "Unable to reject the application.",
    };
  }
}

export async function approveAndEnroll(
  applicationId: string
): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!applicationId) {
    return {
      success: false,
      message: "Application ID is required.",
    };
  }

  try {
    /*
     * ---------------------------------------------------------
     * 1. Get application
     * ---------------------------------------------------------
     */

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        course: true,
        applicant: true,
      },
    });

    if (!application) {
      return {
        success: false,
        message: "Application not found.",
      };
    }

    /*
     * ---------------------------------------------------------
     * 2. Validate application
     * ---------------------------------------------------------
     */

    if (application.status === "REJECTED") {
      return {
        success: false,
        message: "A rejected application cannot be enrolled.",
      };
    }

    if (!application.courseId || !application.course) {
      return {
        success: false,
        message:
          "This application does not have a course selected. Assign a course before approving.",
      };
    }

    if (application.course.status !== "ACTIVE") {
      return {
        success: false,
        message:
          "The selected course is not currently active. Activate the course first.",
      };
    }

    const course = application.course;

    /*
     * ---------------------------------------------------------
     * 3. Normalize email
     * ---------------------------------------------------------
     */

    const email = application.email.trim().toLowerCase();

    /*
     * ---------------------------------------------------------
     * 4. Check whether the student already exists
     * ---------------------------------------------------------
     */

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        studentProfile: true,
      },
    });

    /*
     * ---------------------------------------------------------
     * 5. Prevent admin account from becoming student
     * ---------------------------------------------------------
     */

    if (existingUser && existingUser.role === "ADMIN") {
      return {
        success: false,
        message:
          "This email already belongs to an administrator and cannot be enrolled as a student.",
      };
    }

    /*
     * ---------------------------------------------------------
     * 6. Check existing enrollment
     * ---------------------------------------------------------
     */

    if (existingUser) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: existingUser.id,
            courseId: course.id,
          },
        },
      });

      if (existingEnrollment) {
        await prisma.application.update({
          where: {
            id: application.id,
          },
          data: {
            status: "APPROVED",
            applicantId: existingUser.id,
          },
        });

        return {
          success: true,
          message:
            "The applicant is already enrolled in this course. The application has been approved.",
          studentNumber:
            existingUser.studentProfile?.studentNumber ?? undefined,
        };
      }
    }

    /*
     * ---------------------------------------------------------
     * 7. Generate credentials only for a new account
     * ---------------------------------------------------------
     */

    const isExistingStudent = Boolean(existingUser);

    const temporaryPassword = isExistingStudent
      ? undefined
      : generateTemporaryPassword();

    const passwordHash = temporaryPassword
      ? await bcrypt.hash(temporaryPassword, 12)
      : undefined;

    /*
     * ---------------------------------------------------------
     * 8. Student number
     * ---------------------------------------------------------
     */

    const studentNumber =
      existingUser?.studentProfile?.studentNumber ??
      (await generateStudentNumber());

    /*
     * ---------------------------------------------------------
     * 9. Prepare applicant name
     * ---------------------------------------------------------
     */

    const nameParts = application.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const applicationFirstName =
      nameParts[0] || "EDSEC";

    const applicationLastName =
      nameParts.slice(1).join(" ") || "Student";

    /*
     * ---------------------------------------------------------
     * 10. Create student + profile + enrollment
     * ---------------------------------------------------------
     */

    const result = await prisma.$transaction(async (tx) => {
      let studentId: string;

      /*
       * EXISTING USER
       */

      if (existingUser) {
        const updatedStudent = await tx.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            firstName:
              applicationFirstName || existingUser.firstName,

            lastName:
              applicationLastName || existingUser.lastName,

            phone:
              application.phone?.trim() ||
              existingUser.phone,

            role: "STUDENT",
            status: "ACTIVE",
          },
        });

        studentId = updatedStudent.id;

        /*
         * Create profile if the student doesn't have one.
         */

        if (!existingUser.studentProfile) {
          await tx.studentProfile.create({
            data: {
              userId: studentId,
              studentNumber,
              dateOfBirth: application.dateOfBirth,
              educationalLevel:
                application.educationalLevel,
            },
          });
        }
      }

      /*
       * NEW USER
       */

      else {
        if (!passwordHash) {
          throw new Error(
            "Unable to generate the student's password."
          );
        }

        const newStudent = await tx.user.create({
          data: {
            email,
            passwordHash,
            firstName: applicationFirstName,
            lastName: applicationLastName,
            phone: application.phone?.trim() || null,
            role: "STUDENT",
            status: "ACTIVE",
          },
        });

        studentId = newStudent.id;

        await tx.studentProfile.create({
          data: {
            userId: studentId,
            studentNumber,
            dateOfBirth: application.dateOfBirth,
            educationalLevel:
              application.educationalLevel,
          },
        });
      }

      /*
       * -------------------------------------------------------
       * Create enrollment
       * -------------------------------------------------------
       */

      const enrollment = await tx.enrollment.create({
        data: {
          studentId,
          courseId: course.id,
          status: "ACTIVE",
          progress: 0,
        },
      });

      /*
       * -------------------------------------------------------
       * Record student activity
       * -------------------------------------------------------
       */

      await tx.studentActivity.create({
        data: {
          studentId,
          enrollmentId: enrollment.id,
          type: "COURSE_ENROLLED",
          title: "Course Enrollment",
          description: `Enrolled in ${course.title}.`,
          metadata: JSON.stringify({
            courseId: course.id,
            applicationId: application.id,
            enrolledBy: admin.id,
          }),
        },
      });

      /*
       * -------------------------------------------------------
       * Approve application
       * -------------------------------------------------------
       */

      await tx.application.update({
        where: {
          id: application.id,
        },
        data: {
          status: "APPROVED",
          applicantId: studentId,
        },
      });

      return {
        studentId,
        enrollmentId: enrollment.id,
      };
    });

    /*
     * ---------------------------------------------------------
     * 11. Log successful enrollment
     * ---------------------------------------------------------
     */

    console.log("EDSEC APPLICATION APPROVED:", {
      applicationId: application.id,
      studentId: result.studentId,
      enrollmentId: result.enrollmentId,
      courseId: course.id,
    });

    /*
     * ---------------------------------------------------------
     * 12. Return result
     * ---------------------------------------------------------
     */

    return {
      success: true,
      message:
        "Application approved and student successfully enrolled.",

      /*
       * Only return a temporary password when a brand-new
       * student account was created.
       */
      temporaryPassword,

      studentNumber,
    };
  } catch (error) {
    console.error("APPROVE AND ENROLL ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to approve and enroll the applicant.",
    };
  }
}