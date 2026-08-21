"use server";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type StudentActionResult = {
  success: boolean;
  message: string;
};

export async function updateStudentStatus(
  studentId: string,
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE"
): Promise<StudentActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

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

    return {
      success: true,
      message: `${student.firstName} ${student.lastName} is now ${status.toLowerCase()}.`,
    };
  } catch (error) {
    console.error("UPDATE STUDENT STATUS ERROR:", error);

    return {
      success: false,
      message: "Unable to update student status.",
    };
  }
}