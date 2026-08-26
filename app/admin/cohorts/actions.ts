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

function getStatus(value: FormDataEntryValue | null): CohortStatus {
  const status = String(value ?? "UPCOMING").trim();

  if (
    !COHORT_STATUSES.includes(
      status as CohortStatus
    )
  ) {
    throw new Error("Invalid cohort status.");
  }

  return status as CohortStatus;
}

function parseOptionalDate(
  value: FormDataEntryValue | null
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

/* ============================================================
   CREATE COHORT
   ============================================================ */

export async function createCohort(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const courseId = String(
    formData.get("courseId") ?? ""
  ).trim();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const startDate = parseOptionalDate(
    formData.get("startDate")
  );

  const endDate = parseOptionalDate(
    formData.get("endDate")
  );

  const status = getStatus(
    formData.get("status")
  );

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
      "End date cannot be earlier than the start date."
    );
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error(
      "The selected course could not be found."
    );
  }

  await prisma.cohort.create({
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
}

/* ============================================================
   UPDATE COHORT
   ============================================================ */

export async function updateCohort(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  const courseId = String(
    formData.get("courseId") ?? ""
  ).trim();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const startDate = parseOptionalDate(
    formData.get("startDate")
  );

  const endDate = parseOptionalDate(
    formData.get("endDate")
  );

  const status = getStatus(
    formData.get("status")
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
      "End date cannot be earlier than the start date."
    );
  }

  const [existingCohort, course] =
    await Promise.all([
      prisma.cohort.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      }),

      prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
        },
      }),
    ]);

  if (!existingCohort) {
    throw new Error("Cohort not found.");
  }

  if (!course) {
    throw new Error(
      "The selected course could not be found."
    );
  }

  await prisma.cohort.update({
    where: {
      id,
    },
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
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  if (!id) {
    throw new Error("Cohort ID is required.");
  }

  const status = getStatus(
    formData.get("status")
  );

  const cohort = await prisma.cohort.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  await prisma.cohort.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${id}`);
}

/* ============================================================
   DELETE COHORT
   ============================================================ */

export async function deleteCohort(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  if (!id) {
    throw new Error("Cohort ID is required.");
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
    throw new Error("Cohort not found.");
  }

  /*
   * Do not allow an administrator to accidentally delete
   * a cohort that already has students attached to it.
   */
  if (cohort._count.enrollments > 0) {
    throw new Error(
      `Cannot delete "${cohort.name}" because it has ${cohort._count.enrollments} enrolled student${
        cohort._count.enrollments === 1 ? "" : "s"
      }. Remove or reassign the students first.`
    );
  }

  await prisma.cohort.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/cohorts");
}