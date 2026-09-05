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

  if (!COHORT_STATUSES.includes(status as CohortStatus)) {
    throw new Error("Invalid cohort status.");
  }

  return status as CohortStatus;
}

function parseOptionalDate(
  value: FormDataEntryValue | null,
): Date | null {
  const dateValue = String(value ?? "").trim();

  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date provided.");
  }

  return date;
}

function getRequiredId(
  value: FormDataEntryValue | null,
  label: string,
): string {
  const id = String(value ?? "").trim();

  if (!id) {
    throw new Error(`${label} is required.`);
  }

  return id;
}

/**
 * Create a new cohort.
 */
export async function createCohort(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  const courseId = getRequiredId(
    formData.get("courseId"),
    "Course",
  );

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

  if (!name) {
    throw new Error("Cohort name is required.");
  }

  if (startDate && endDate && endDate < startDate) {
    throw new Error(
      "End date cannot be earlier than the start date.",
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
      "The selected course could not be found.",
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
      createdById: admin.id,
    },
  });

  revalidatePath("/admin/cohorts");
}

/**
 * Update an existing cohort.
 *
 * A cohort with students cannot have its course changed.
 * Students' enrollments belong to a specific course, so
 * changing the course behind their enrollment would create
 * inconsistent data.
 */
export async function updateCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getRequiredId(
    formData.get("id"),
    "Cohort ID",
  );

  const courseId = getRequiredId(
    formData.get("courseId"),
    "Course",
  );

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

  if (!name) {
    throw new Error("Cohort name is required.");
  }

  if (startDate && endDate && endDate < startDate) {
    throw new Error(
      "End date cannot be earlier than the start date.",
    );
  }

  const [existingCohort, course] = await Promise.all([
    prisma.cohort.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        courseId: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
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
      "The selected course could not be found.",
    );
  }

  const courseChanged =
    existingCohort.courseId !== courseId;

  if (
    courseChanged &&
    existingCohort._count.enrollments > 0
  ) {
    throw new Error(
      "This cohort already has students assigned to it. Remove all students before changing the cohort course.",
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

/**
 * Update cohort status.
 */
export async function updateCohortStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getRequiredId(
    formData.get("id"),
    "Cohort ID",
  );

  const status = getStatus(
    formData.get("status"),
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

/**
 * Assign a student to a cohort.
 *
 * The student's existing enrollment for the cohort's course
 * is reused whenever possible.
 *
 * If no enrollment exists, a new ACTIVE enrollment is created.
 *
 * If the student already belongs to another cohort for the
 * same course, their enrollment is moved to this cohort.
 */
export async function assignStudentToCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const cohortId = getRequiredId(
    formData.get("cohortId"),
    "Cohort ID",
  );

  const studentId = getRequiredId(
    formData.get("studentId"),
    "Student",
  );

  const result = await prisma.$transaction(async (tx) => {
    const cohort = await tx.cohort.findUnique({
      where: {
        id: cohortId,
      },
      select: {
        id: true,
        name: true,
        courseId: true,
      },
    });

    if (!cohort) {
      throw new Error("Cohort not found.");
    }

    const student = await tx.user.findUnique({
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
        "Only student accounts can be assigned to a cohort.",
      );
    }

    if (student.status !== "ACTIVE") {
      throw new Error(
        "Only active students can be assigned to a cohort.",
      );
    }

    const existingEnrollment =
      await tx.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId: cohort.courseId,
          },
        },
        select: {
          id: true,
          cohortId: true,
          status: true,
        },
      });

    if (existingEnrollment) {
      if (
        existingEnrollment.cohortId === cohort.id &&
        existingEnrollment.status === "ACTIVE"
      ) {
        throw new Error(
          "This student is already assigned to this cohort.",
        );
      }

      const enrollment =
        await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            cohortId: cohort.id,
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        });

      return {
        enrollmentId: enrollment.id,
        studentName:
          `${student.firstName} ${student.lastName}`.trim(),
      };
    }

    const enrollment =
      await tx.enrollment.create({
        data: {
          studentId,
          courseId: cohort.courseId,
          cohortId: cohort.id,
          status: "ACTIVE",
          progress: 0,
        },
        select: {
          id: true,
        },
      });

    return {
      enrollmentId: enrollment.id,
      studentName:
        `${student.firstName} ${student.lastName}`.trim(),
    };
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${cohortId}`);
  revalidatePath("/admin/enrollments");
  revalidatePath(
    `/admin/enrollments/${result.enrollmentId}`,
  );
}

/**
 * Remove a student from a cohort.
 *
 * This DOES NOT delete the student's enrollment.
 * It only removes the cohort relationship by setting
 * cohortId to null.
 */
export async function removeStudentFromCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const cohortId = getRequiredId(
    formData.get("cohortId"),
    "Cohort ID",
  );

  const enrollmentId = getRequiredId(
    formData.get("enrollmentId"),
    "Enrollment ID",
  );

  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      select: {
        id: true,
        cohortId: true,
        studentId: true,
        courseId: true,
      },
    });

  if (!enrollment) {
    throw new Error("Enrollment not found.");
  }

  if (enrollment.cohortId !== cohortId) {
    throw new Error(
      "This enrollment does not belong to the selected cohort.",
    );
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

  if (enrollment.courseId !== cohort.courseId) {
    throw new Error(
      "Enrollment and cohort course do not match.",
    );
  }

  await prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      cohortId: null,
    },
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${cohortId}`);
  revalidatePath("/admin/enrollments");
  revalidatePath(
    `/admin/enrollments/${enrollmentId}`,
  );
}

/**
 * Delete a cohort.
 *
 * A cohort cannot be deleted while it still has students.
 * The students must first be removed or reassigned.
 */
export async function deleteCohort(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getRequiredId(
    formData.get("id"),
    "Cohort ID",
  );

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

  if (cohort._count.enrollments > 0) {
    throw new Error(
      `Cannot delete "${cohort.name}" because it has ${cohort._count.enrollments} enrolled student${
        cohort._count.enrollments === 1 ? "" : "s"
      }. Remove or reassign the students first.`,
    );
  }

  await prisma.cohort.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/cohorts");
}