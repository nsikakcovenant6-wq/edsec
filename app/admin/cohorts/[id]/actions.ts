"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

const COHORT_STATUSES = [
  "UPCOMING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

type CohortStatus = (typeof COHORT_STATUSES)[number];

function parseOptionalDate(
  value: FormDataEntryValue | null,
): Date | null {
  const dateValue = String(value ?? "").trim();

  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date provided.");
  }

  return date;
}

function getStatus(
  value: FormDataEntryValue | null,
): CohortStatus {
  const status = String(value ?? "UPCOMING").trim();

  if (
    !COHORT_STATUSES.includes(
      status as CohortStatus,
    )
  ) {
    throw new Error("Invalid cohort status.");
  }

  return status as CohortStatus;
}

/* ============================================================
   UPDATE COHORT
   ============================================================ */

export async function updateCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? "",
  ).trim();

  const courseId = String(
    formData.get("courseId") ?? "",
  ).trim();

  const name = String(
    formData.get("name") ?? "",
  ).trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const startDate = parseOptionalDate(
    formData.get("startDate"),
  );

  const endDate = parseOptionalDate(
    formData.get("endDate"),
  );

  const status = getStatus(
    formData.get("status"),
  );

  if (!id) {
    throw new Error("Cohort ID is required.");
  }

  if (!courseId) {
    throw new Error("Course is required.");
  }

  if (!name) {
    throw new Error("Cohort name is required.");
  }

  if (
    startDate &&
    endDate &&
    endDate < startDate
  ) {
    throw new Error(
      "End date cannot be earlier than the start date.",
    );
  }

  const [cohort, course] = await Promise.all([
    prisma.cohort.findUnique({
      where: { id },
      select: {
        id: true,
      },
    }),

    prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
      },
    }),
  ]);

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  if (!course) {
    throw new Error(
      "The selected course could not be found.",
    );
  }

  await prisma.cohort.update({
    where: { id },
    data: {
      courseId,
      name,
      description: description || null,
      startDate,
      endDate,
      status,
    },
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${id}`);
}

/* ============================================================
   UPDATE COHORT STATUS
   ============================================================ */

export async function updateCohortStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? "",
  ).trim();

  const status = getStatus(
    formData.get("status"),
  );

  if (!id) {
    throw new Error("Cohort ID is required.");
  }

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  await prisma.cohort.update({
    where: { id },
    data: {
      status,
    },
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${id}`);
}

/* ============================================================
   ADD / ASSIGN STUDENT TO COHORT
   ============================================================ */

export async function assignStudentToCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const cohortId = String(
    formData.get("cohortId") ?? "",
  ).trim();

  const studentId = String(
    formData.get("studentId") ?? "",
  ).trim();

  if (!cohortId) {
    throw new Error("Cohort ID is required.");
  }

  if (!studentId) {
    throw new Error("Student is required.");
  }

  const cohort = await prisma.cohort.findUnique({
    where: {
      id: cohortId,
    },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
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
      "Only student accounts can be assigned to a cohort.",
    );
  }

  if (student.status !== "ACTIVE") {
    throw new Error(
      "This student account is not active.",
    );
  }

  /*
   * Enrollment is unique per student + course.
   *
   * Therefore, if the student is already enrolled in this
   * course, we simply move that enrollment into this cohort.
   *
   * If no enrollment exists, create one.
   */
  const existingEnrollment =
    await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: cohort.courseId,
        },
      },
      select: {
        id: true,
        cohortId: true,
      },
    });

  if (existingEnrollment) {
    if (
      existingEnrollment.cohortId === cohort.id
    ) {
      throw new Error(
        "This student is already assigned to this cohort.",
      );
    }

    await prisma.enrollment.update({
      where: {
        id: existingEnrollment.id,
      },
      data: {
        cohortId: cohort.id,
        status: "ACTIVE",
      },
    });
  } else {
    await prisma.enrollment.create({
      data: {
        studentId,
        courseId: cohort.courseId,
        cohortId: cohort.id,
        status: "ACTIVE",
      },
    });
  }

  revalidatePath(
    `/admin/cohorts/${cohortId}`,
  );

  revalidatePath("/admin/cohorts");
  revalidatePath("/admin/enrollments");
}

/* ============================================================
   REMOVE STUDENT FROM COHORT
   ============================================================ */

export async function removeStudentFromCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const enrollmentId = String(
    formData.get("enrollmentId") ?? "",
  ).trim();

  const cohortId = String(
    formData.get("cohortId") ?? "",
  ).trim();

  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required.",
    );
  }

  if (!cohortId) {
    throw new Error(
      "Cohort ID is required.",
    );
  }

  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      select: {
        id: true,
        cohortId: true,
      },
    });

  if (!enrollment) {
    throw new Error(
      "Enrollment not found.",
    );
  }

  if (enrollment.cohortId !== cohortId) {
    throw new Error(
      "This student is not assigned to this cohort.",
    );
  }

  /*
   * We do not delete the enrollment.
   *
   * We only remove the cohort assignment so the student
   * remains enrolled in the course.
   */
  await prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      cohortId: null,
    },
  });

  revalidatePath(
    `/admin/cohorts/${cohortId}`,
  );

  revalidatePath("/admin/cohorts");
  revalidatePath("/admin/enrollments");
}

/* ============================================================
   DELETE COHORT
   ============================================================ */

export async function deleteCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? "",
  ).trim();

  if (!id) {
    throw new Error(
      "Cohort ID is required.",
    );
  }

  const cohort = await prisma.cohort.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!cohort) {
    throw new Error(
      "Cohort not found.",
    );
  }

  /*
   * Do not accidentally delete a cohort that still
   * contains students.
   */
  if (cohort._count.enrollments > 0) {
    throw new Error(
      `Cannot delete "${cohort.name}" because it has ${cohort._count.enrollments} enrolled student${
        cohort._count.enrollments === 1
          ? ""
          : "s"
      }. Remove the students from the cohort first.`,
    );
  }

  await prisma.cohort.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/cohorts");
}