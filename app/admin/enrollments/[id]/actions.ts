"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

const VALID_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "SUSPENDED",
  "DROPPED",
] as const;

type EnrollmentStatusValue = (typeof VALID_STATUSES)[number];

export type EnrollmentActionResult = {
  success: boolean;
  message: string;
};

export async function updateEnrollmentStatus(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const statusValue = String(formData.get("status") ?? "");

  if (!enrollmentId) {
    throw new Error("Enrollment ID is required.");
  }

  if (
    !VALID_STATUSES.includes(
      statusValue as EnrollmentStatusValue
    )
  ) {
    throw new Error("Invalid enrollment status.");
  }

  const status = statusValue as EnrollmentStatusValue;

  await prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      status,
      completedAt:
        status === "COMPLETED"
          ? new Date()
          : status === "ACTIVE"
            ? null
            : undefined,
    },
  });

  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/enrollments/${enrollmentId}`);
}

export async function updateEnrollment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const enrollmentId = String(
    formData.get("enrollmentId") ?? ""
  );

  const lessonId = String(
    formData.get("lessonId") ?? ""
  );

  const completedValue = String(
    formData.get("completed") ?? "false"
  );

  if (!enrollmentId || !lessonId) {
    throw new Error("Enrollment ID and lesson ID are required.");
  }

  const completed = completedValue === "true";

  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      enrollmentId,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  const lessonProgress =
    await prisma.lessonProgress.findMany({
      where: {
        enrollmentId,
      },
      select: {
        completed: true,
      },
    });

  const completedLessons = lessonProgress.filter(
    (item) => item.completed
  ).length;

  const progress =
    lessonProgress.length > 0
      ? Math.round(
          (completedLessons / lessonProgress.length) * 100
        )
      : 0;

  await prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      progress,
    },
  });

  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/enrollments/${enrollmentId}`);
}

export async function deleteEnrollment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const enrollmentId = String(
    formData.get("enrollmentId") ?? ""
  );

  if (!enrollmentId) {
    throw new Error("Enrollment ID is required.");
  }

  await prisma.enrollment.delete({
    where: {
      id: enrollmentId,
    },
  });

  revalidatePath("/admin/enrollments");
}