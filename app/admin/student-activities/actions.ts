/* eslint-disable prefer-const */
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

const activityTypes = [
  "LESSON_COMPLETED",
  "TEST_COMPLETED",
  "PROJECT_SUBMITTED",
  "LIVE_CLASS_ATTENDED",
  "ACHIEVEMENT_EARNED",
  "PAYMENT_MADE",
  "COURSE_ENROLLED",
  "LOGIN",
] as const;

type ActivityType = (typeof activityTypes)[number];

function isActivityType(
  value: string,
): value is ActivityType {
  return activityTypes.includes(value as ActivityType);
}

function revalidateActivityPaths(id?: string): void {
  revalidatePath("/admin/student-activities");
  revalidatePath("/student/activities");
  revalidatePath("/student/dashboard");

  if (id) {
    revalidatePath(`/admin/student-activities/${id}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Create Activity                                                            */
/* -------------------------------------------------------------------------- */

export async function createStudentActivity(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const studentId = getString(formData, "studentId");
  const enrollmentId = getOptionalString(
    formData,
    "enrollmentId",
  );
  const type = getString(formData, "type");
  const title = getString(formData, "title");
  const description = getOptionalString(
    formData,
    "description",
  );
  const metadata = getOptionalString(
    formData,
    "metadata",
  );

  if (!studentId) {
    throw new Error("Student is required.");
  }

  if (!isActivityType(type)) {
    throw new Error("Invalid activity type.");
  }

  if (!title) {
    throw new Error("Activity title is required.");
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
      "Activities can only be created for students.",
    );
  }

  if (student.status !== "ACTIVE") {
    throw new Error("Student account is not active.");
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
        "Selected enrollment does not belong to this student.",
      );
    }
  }

  let normalizedMetadata = metadata;

  if (metadata) {
    try {
      JSON.parse(metadata);
    } catch {
      throw new Error(
        "Metadata must contain valid JSON.",
      );
    }
  }

  const activity = await prisma.studentActivity.create({
    data: {
      studentId,
      enrollmentId,
      type,
      title,
      description,
      metadata: normalizedMetadata,
    },
  });

  revalidateActivityPaths();

  redirect(
    `/admin/student-activities/${activity.id}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Update Activity                                                             */
/* -------------------------------------------------------------------------- */

export async function updateStudentActivity(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const studentId = getString(formData, "studentId");
  const enrollmentId = getOptionalString(
    formData,
    "enrollmentId",
  );
  const type = getString(formData, "type");
  const title = getString(formData, "title");
  const description = getOptionalString(
    formData,
    "description",
  );
  const metadata = getOptionalString(
    formData,
    "metadata",
  );

  if (!id) {
    throw new Error("Activity ID is required.");
  }

  if (!studentId) {
    throw new Error("Student is required.");
  }

  if (!isActivityType(type)) {
    throw new Error("Invalid activity type.");
  }

  if (!title) {
    throw new Error("Activity title is required.");
  }

  const activity =
    await prisma.studentActivity.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!activity) {
    throw new Error("Activity not found.");
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
      "Activities can only belong to students.",
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
        "Selected enrollment does not belong to this student.",
      );
    }
  }

  if (metadata) {
    try {
      JSON.parse(metadata);
    } catch {
      throw new Error(
        "Metadata must contain valid JSON.",
      );
    }
  }

  await prisma.studentActivity.update({
    where: {
      id,
    },
    data: {
      studentId,
      enrollmentId,
      type,
      title,
      description,
      metadata,
    },
  });

  revalidateActivityPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Delete Activity                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteStudentActivity(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Activity ID is required.");
  }

  const activity =
    await prisma.studentActivity.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!activity) {
    throw new Error("Activity not found.");
  }

  await prisma.studentActivity.delete({
    where: {
      id,
    },
  });

  revalidateActivityPaths();

  redirect("/admin/student-activities");
}

/* -------------------------------------------------------------------------- */
/* Delete All Activities For A Student                                        */
/* -------------------------------------------------------------------------- */

export async function deleteStudentActivities(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const studentId = getString(formData, "studentId");

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  if (student.role !== "STUDENT") {
    throw new Error(
      "Activities can only be deleted for students.",
    );
  }

  await prisma.studentActivity.deleteMany({
    where: {
      studentId,
    },
  });

  revalidateActivityPaths();
}

/* -------------------------------------------------------------------------- */
/* Create System Activity                                                     */
/* -------------------------------------------------------------------------- */

export async function recordStudentActivity({
  studentId,
  enrollmentId,
  type,
  title,
  description,
  metadata,
}: {
  studentId: string;
  enrollmentId?: string | null;
  type: ActivityType;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  if (!title) {
    throw new Error("Activity title is required.");
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

  if (!student || student.role !== "STUDENT") {
    throw new Error("Valid student account not found.");
  }

  if (student.status !== "ACTIVE") {
    throw new Error("Student account is not active.");
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
        "Enrollment does not belong to this student.",
      );
    }
  }

  await prisma.studentActivity.create({
    data: {
      studentId,
      enrollmentId: enrollmentId ?? null,
      type,
      title,
      description: description ?? null,
      metadata: metadata
        ? JSON.stringify(metadata)
        : null,
    },
  });

  revalidatePath("/student/activities");
  revalidatePath("/student/dashboard");
  revalidatePath("/admin/student-activities");
}

/* -------------------------------------------------------------------------- */
/* Compatibility Aliases                                                      */
/* -------------------------------------------------------------------------- */

export async function createActivity(
  formData: FormData,
): Promise<void> {
  return createStudentActivity(formData);
}

export async function updateActivity(
  formData: FormData,
): Promise<void> {
  return updateStudentActivity(formData);
}

export async function deleteActivity(
  formData: FormData,
): Promise<void> {
  return deleteStudentActivity(formData);
}