"use server";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type StudentActionResult = {
  success: boolean;
  message: string;
};

type StudentStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

/**
 * Update a student's account status.
 */
export async function updateStudentStatus(
  studentId: string,
  status: StudentStatus,
): Promise<StudentActionResult> {
  await requireRole("ADMIN");

  if (!studentId) {
    return {
      success: false,
      message: "Student ID is required.",
    };
  }

  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!student) {
      return {
        success: false,
        message: "Student not found.",
      };
    }

    if (student.role !== "STUDENT") {
      return {
        success: false,
        message: "Only student accounts can be managed here.",
      };
    }

    await prisma.user.update({
      where: {
        id: studentId,
      },
      data: {
        status,
      },
    });

    const fullName =
      `${student.firstName} ${student.lastName}`.trim();

    const statusLabel =
      status === "ACTIVE"
        ? "activated"
        : status === "SUSPENDED"
          ? "suspended"
          : "deactivated";

    return {
      success: true,
      message: `${fullName} has been ${statusLabel}.`,
    };
  } catch (error) {
    console.error("UPDATE STUDENT STATUS ERROR:", error);

    return {
      success: false,
      message: "Unable to update student status.",
    };
  }
}

/**
 * Permanently delete a student and their student-related records.
 *
 * We intentionally do not use an interactive Prisma transaction here.
 * The previous implementation exceeded Prisma's default 5-second
 * interactive transaction timeout.
 */
export async function deleteStudent(
  studentId: string,
): Promise<StudentActionResult> {
  await requireRole("ADMIN");

  if (!studentId) {
    return {
      success: false,
      message: "Student ID is required.",
    };
  }

  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!student) {
      return {
        success: false,
        message: "Student not found.",
      };
    }

    if (student.role !== "STUDENT") {
      return {
        success: false,
        message: "Only student accounts can be deleted here.",
      };
    }

    /*
     * ------------------------------------------------------------
     * 1. Find the student's enrollments
     * ------------------------------------------------------------
     */

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
      },
      select: {
        id: true,
      },
    });

    const enrollmentIds = enrollments.map(
      (enrollment) => enrollment.id,
    );

    /*
     * ------------------------------------------------------------
     * 2. Delete records connected to enrollments
     * ------------------------------------------------------------
     */

    if (enrollmentIds.length > 0) {
      await prisma.liveClassEnrollment.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });

      await prisma.lessonProgress.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });

      await prisma.grade.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });

      await prisma.payment.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });

      await prisma.studentAchievement.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });

      await prisma.studentActivity.deleteMany({
        where: {
          enrollmentId: {
            in: enrollmentIds,
          },
        },
      });
    }

    /*
     * ------------------------------------------------------------
     * 3. Delete student's direct records
     * ------------------------------------------------------------
     */

    await prisma.studentActivity.deleteMany({
      where: {
        studentId,
      },
    });

    await prisma.studentProjectRecord.deleteMany({
      where: {
        studentId,
      },
    });

    await prisma.studentAchievement.deleteMany({
      where: {
        studentId,
      },
    });

    await prisma.attendance.deleteMany({
      where: {
        studentId,
      },
    });

    /*
     * ------------------------------------------------------------
     * 4. Delete test answers and attempts
     * ------------------------------------------------------------
     */

    const attempts = await prisma.testAttempt.findMany({
      where: {
        studentId,
      },
      select: {
        id: true,
      },
    });

    const attemptIds = attempts.map(
      (attempt) => attempt.id,
    );

    if (attemptIds.length > 0) {
      await prisma.studentAnswer.deleteMany({
        where: {
          attemptId: {
            in: attemptIds,
          },
        },
      });
    }

    await prisma.testAttempt.deleteMany({
      where: {
        studentId,
      },
    });

    /*
     * ------------------------------------------------------------
     * 5. Delete grades, payments and applications
     * ------------------------------------------------------------
     */

    await prisma.grade.deleteMany({
      where: {
        studentId,
      },
    });

    await prisma.payment.deleteMany({
      where: {
        studentId,
      },
    });

    await prisma.application.deleteMany({
      where: {
        applicantId: studentId,
      },
    });

    /*
     * ------------------------------------------------------------
     * 6. Delete enrollments
     * ------------------------------------------------------------
     */

    await prisma.enrollment.deleteMany({
      where: {
        studentId,
      },
    });

    /*
     * ------------------------------------------------------------
     * 7. Delete student profile
     * ------------------------------------------------------------
     */

    await prisma.studentProfile.deleteMany({
      where: {
        userId: studentId,
      },
    });

    /*
     * ------------------------------------------------------------
     * 8. Finally delete the user.
     *
     * The Prisma schema also has onDelete: Cascade on several
     * student relationships, providing additional protection.
     * ------------------------------------------------------------
     */

    await prisma.user.delete({
      where: {
        id: studentId,
      },
    });

    const fullName =
      `${student.firstName} ${student.lastName}`.trim();

    return {
      success: true,
      message: `${fullName} has been permanently removed.`,
    };
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return {
      success: false,
      message:
        "Unable to delete this student. Check the server console for the database error.",
    };
  }
}