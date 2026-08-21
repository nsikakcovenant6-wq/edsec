"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = getString(formData, name);

  return value || null;
}

function getInt(formData: FormData, name: string): number {
  const value = getString(formData, name);

  if (!value) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed);
}

/* -------------------------------------------------------------------------- */
/* Revalidation                                                               */
/* -------------------------------------------------------------------------- */

function revalidateAchievementPaths(id?: string): void {
  revalidatePath("/admin/achievements");
  revalidatePath("/student/achievements");
  revalidatePath("/student/dashboard");

  if (id) {
    revalidatePath(`/admin/achievements/${id}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Create Achievement                                                         */
/* -------------------------------------------------------------------------- */

export async function createAchievement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const name = getString(formData, "name");
  const description = getOptionalString(
    formData,
    "description",
  );
  const icon = getOptionalString(formData, "icon");
  const points = getInt(formData, "points");

  if (!name) {
    throw new Error("Achievement name is required.");
  }

  if (name.length > 100) {
    throw new Error(
      "Achievement name cannot exceed 100 characters.",
    );
  }

  if (points < 0) {
    throw new Error(
      "Achievement points cannot be negative.",
    );
  }

  const existing = await prisma.achievement.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error(
      "An achievement with this name already exists.",
    );
  }

  const achievement = await prisma.achievement.create({
    data: {
      name,
      description,
      icon,
      points,
    },
  });

  revalidateAchievementPaths();

  redirect(`/admin/achievements/${achievement.id}`);
}

/* -------------------------------------------------------------------------- */
/* Update Achievement                                                         */
/* -------------------------------------------------------------------------- */

export async function updateAchievement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const description = getOptionalString(
    formData,
    "description",
  );
  const icon = getOptionalString(formData, "icon");
  const points = getInt(formData, "points");

  if (!id) {
    throw new Error("Achievement ID is required.");
  }

  if (!name) {
    throw new Error("Achievement name is required.");
  }

  if (name.length > 100) {
    throw new Error(
      "Achievement name cannot exceed 100 characters.",
    );
  }

  if (points < 0) {
    throw new Error(
      "Achievement points cannot be negative.",
    );
  }

  const achievement = await prisma.achievement.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!achievement) {
    throw new Error("Achievement not found.");
  }

  const duplicate = await prisma.achievement.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    throw new Error(
      "Another achievement with this name already exists.",
    );
  }

  await prisma.achievement.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      icon,
      points,
    },
  });

  revalidateAchievementPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Delete Achievement                                                         */
/* -------------------------------------------------------------------------- */

export async function deleteAchievement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Achievement ID is required.");
  }

  const achievement = await prisma.achievement.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!achievement) {
    throw new Error("Achievement not found.");
  }

  /*
   * StudentAchievement.achievementId uses:
   *
   * onDelete: Cascade
   *
   * Therefore awarded achievement records are automatically
   * removed when the achievement itself is deleted.
   */
  await prisma.achievement.delete({
    where: {
      id,
    },
  });

  revalidateAchievementPaths();

  redirect("/admin/achievements");
}

/* -------------------------------------------------------------------------- */
/* Award Achievement                                                          */
/* -------------------------------------------------------------------------- */

export async function awardAchievement(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  /*
   * requireRole is typed as possibly returning null.
   * Guarding here makes admin.id safe for TypeScript and
   * also protects the server action at runtime.
   */
  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const achievementId = getString(
    formData,
    "achievementId",
  );

  const studentId = getString(
    formData,
    "studentId",
  );

  const enrollmentId = getOptionalString(
    formData,
    "enrollmentId",
  );

  if (!achievementId) {
    throw new Error("Achievement ID is required.");
  }

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const achievement = await prisma.achievement.findUnique({
    where: {
      id: achievementId,
    },
    select: {
      id: true,
      name: true,
      points: true,
    },
  });

  if (!achievement) {
    throw new Error("Achievement not found.");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
      status: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  if (student.role !== "STUDENT") {
    throw new Error(
      "Achievements can only be awarded to students.",
    );
  }

  if (student.status !== "ACTIVE") {
    throw new Error(
      "This student's account is not active.",
    );
  }

  if (enrollmentId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        studentId,
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      throw new Error(
        "The selected enrollment does not belong to this student.",
      );
    }
  }

  const existing =
    await prisma.studentAchievement.findUnique({
      where: {
        studentId_achievementId: {
          studentId,
          achievementId,
        },
      },
      select: {
        id: true,
      },
    });

  if (existing) {
    throw new Error(
      "This student already has this achievement.",
    );
  }

  const awarded =
    await prisma.studentAchievement.create({
      data: {
        studentId,
        achievementId,
        enrollmentId: enrollmentId || null,
      },
    });

  await prisma.studentActivity.create({
    data: {
      studentId,
      enrollmentId: enrollmentId || null,
      type: "ACHIEVEMENT_EARNED",
      title: "Achievement earned",
      description: `You earned the "${achievement.name}" achievement.`,
      metadata: JSON.stringify({
        achievementId,
        studentAchievementId: awarded.id,
        points: achievement.points,
        awardedBy: admin.id,
      }),
    },
  });

  revalidateAchievementPaths(achievementId);
}

/* -------------------------------------------------------------------------- */
/* Remove Achievement From Student                                            */
/* -------------------------------------------------------------------------- */

export async function removeAchievement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const studentAchievementId = getString(
    formData,
    "studentAchievementId",
  );

  if (!studentAchievementId) {
    throw new Error(
      "Student achievement ID is required.",
    );
  }

  const awarded =
    await prisma.studentAchievement.findUnique({
      where: {
        id: studentAchievementId,
      },
      select: {
        id: true,
        studentId: true,
        achievementId: true,
        achievement: {
          select: {
            name: true,
          },
        },
      },
    });

  if (!awarded) {
    throw new Error("Achievement award not found.");
  }

  await prisma.studentAchievement.delete({
    where: {
      id: studentAchievementId,
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: awarded.studentId,
      type: "ACHIEVEMENT_EARNED",
      title: "Achievement removed",
      description: `The "${awarded.achievement.name}" achievement was removed from your account.`,
      metadata: JSON.stringify({
        achievementId: awarded.achievementId,
        studentAchievementId,
      }),
    },
  });

  revalidateAchievementPaths(
    awarded.achievementId,
  );
}

/* -------------------------------------------------------------------------- */
/* Award Existing Achievement By Student                                      */
/* -------------------------------------------------------------------------- */

export async function awardExistingAchievement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const achievementId = getString(
    formData,
    "achievementId",
  );

  const studentId = getString(
    formData,
    "studentId",
  );

  if (!achievementId || !studentId) {
    throw new Error(
      "Achievement and student are required.",
    );
  }

  const achievement = await prisma.achievement.findUnique({
    where: {
      id: achievementId,
    },
    select: {
      id: true,
      name: true,
      points: true,
    },
  });

  if (!achievement) {
    throw new Error("Achievement not found.");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  if (student.role !== "STUDENT") {
    throw new Error(
      "Achievements can only be awarded to students.",
    );
  }

  if (student.status !== "ACTIVE") {
    throw new Error(
      "Student account is not active.",
    );
  }

  const existing =
    await prisma.studentAchievement.findUnique({
      where: {
        studentId_achievementId: {
          studentId,
          achievementId,
        },
      },
      select: {
        id: true,
      },
    });

  if (existing) {
    throw new Error(
      "This achievement has already been awarded to this student.",
    );
  }

  const awarded =
    await prisma.studentAchievement.create({
      data: {
        studentId,
        achievementId,
      },
    });

  await prisma.studentActivity.create({
    data: {
      studentId,
      type: "ACHIEVEMENT_EARNED",
      title: "Achievement earned",
      description: `You earned the "${achievement.name}" achievement.`,
      metadata: JSON.stringify({
        achievementId,
        studentAchievementId: awarded.id,
        points: achievement.points,
      }),
    },
  });

  revalidateAchievementPaths(achievementId);
}

/* -------------------------------------------------------------------------- */
/* Compatibility Aliases                                                      */
/* -------------------------------------------------------------------------- */

export async function createStudentAchievement(
  formData: FormData,
): Promise<void> {
  return awardAchievement(formData);
}

export async function deleteStudentAchievement(
  formData: FormData,
): Promise<void> {
  return removeAchievement(formData);
}