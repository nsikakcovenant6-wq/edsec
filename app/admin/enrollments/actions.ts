"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type EnrollmentActionResult = {
  success: boolean;
  message: string;
  enrollmentId?: string;
};

export async function updateEnrollmentStatus(
  enrollmentId: string,
  formData: FormData
): Promise<EnrollmentActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!enrollmentId) {
    return {
      success: false,
      message: "Enrollment ID is required.",
    };
  }

  const status = String(
    formData.get("status") ?? ""
  ).trim();

  if (!status) {
    return {
      success: false,
      message: "Enrollment status is required.",
    };
  }

  try {
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },
        select: {
          id: true,
        },
      });

    if (!enrollment) {
      return {
        success: false,
        message: "Enrollment not found.",
      };
    }

    await prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        status: status as never,
      },
    });

    revalidatePath("/admin/enrollments");

    return {
      success: true,
      message: "Enrollment status updated successfully.",
      enrollmentId,
    };
  } catch (error) {
    console.error(
      "UPDATE ENROLLMENT STATUS ERROR:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update enrollment status.",
    };
  }
}

export async function deleteEnrollment(
  enrollmentId: string
): Promise<EnrollmentActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!enrollmentId) {
    return {
      success: false,
      message: "Enrollment ID is required.",
    };
  }

  try {
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },
        select: {
          id: true,
        },
      });

    if (!enrollment) {
      return {
        success: false,
        message: "Enrollment not found.",
      };
    }

    await prisma.enrollment.delete({
      where: {
        id: enrollmentId,
      },
    });

    revalidatePath("/admin/enrollments");

    return {
      success: true,
      message: "Enrollment deleted successfully.",
      enrollmentId,
    };
  } catch (error) {
    console.error(
      "DELETE ENROLLMENT ERROR:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete enrollment.",
    };
  }
}