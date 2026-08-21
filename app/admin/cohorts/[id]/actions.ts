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

export async function updateCohort(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(formData.get("id") ?? "").trim();
  const courseId = String(formData.get("courseId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const startDateValue = String(
    formData.get("startDate") ?? ""
  ).trim();

  const endDateValue = String(
    formData.get("endDate") ?? ""
  ).trim();

  const statusValue = String(
    formData.get("status") ?? ""
  ).trim();

  if (!id || !courseId || !name) {
    throw new Error("Cohort ID, course and name are required.");
  }

  if (
    !COHORT_STATUSES.includes(
      statusValue as (typeof COHORT_STATUSES)[number]
    )
  ) {
    throw new Error("Invalid cohort status.");
  }

  await prisma.cohort.update({
    where: { id },
    data: {
      courseId,
      name,
      description: description || null,
      startDate: startDateValue
        ? new Date(startDateValue)
        : null,
      endDate: endDateValue
        ? new Date(endDateValue)
        : null,
      status: statusValue as (typeof COHORT_STATUSES)[number],
    },
  });

  revalidatePath("/admin/cohorts");
  revalidatePath(`/admin/cohorts/${id}`);
}

export async function deleteCohort(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Cohort ID is required.");
  }

  await prisma.cohort.delete({
    where: { id },
  });

  revalidatePath("/admin/cohorts");
}