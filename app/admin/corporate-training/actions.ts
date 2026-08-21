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

const inquiryStatuses = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
] as const;

type InquiryStatus = (typeof inquiryStatuses)[number];

function isInquiryStatus(value: string): value is InquiryStatus {
  return inquiryStatuses.includes(value as InquiryStatus);
}

function revalidateInquiryPaths(id?: string) {
  revalidatePath("/admin/corporate-training");
  revalidatePath("/corporate-training");

  if (id) {
    revalidatePath(`/admin/corporate-training/${id}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Public: Create Inquiry                                                     */
/* -------------------------------------------------------------------------- */

export async function createCorporateInquiry(
  formData: FormData,
): Promise<void> {
  const organization = getString(formData, "organization");
  const contactName = getString(formData, "contactName");
  const email = getString(formData, "email");
  const phone = getOptionalString(formData, "phone");
  const organizationType = getOptionalString(
    formData,
    "organizationType",
  );
  const trainingNeeds = getString(formData, "trainingNeeds");
  const preferredFormat = getOptionalString(
    formData,
    "preferredFormat",
  );
  const message = getOptionalString(formData, "message");

  if (!organization) {
    throw new Error("Organization name is required.");
  }

  if (!contactName) {
    throw new Error("Contact name is required.");
  }

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (!email.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }

  if (!trainingNeeds) {
    throw new Error("Please describe your training needs.");
  }

  await prisma.corporateInquiry.create({
    data: {
      organization,
      contactName,
      email,
      phone,
      organizationType,
      trainingNeeds,
      preferredFormat,
      message,
      status: "NEW",
    },
  });

  revalidateInquiryPaths();

  redirect("/corporate-training?submitted=true");
}

/* -------------------------------------------------------------------------- */
/* Admin: Update Inquiry                                                      */
/* -------------------------------------------------------------------------- */

export async function updateCorporateInquiry(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const organization = getString(formData, "organization");
  const contactName = getString(formData, "contactName");
  const email = getString(formData, "email");
  const phone = getOptionalString(formData, "phone");
  const organizationType = getOptionalString(
    formData,
    "organizationType",
  );
  const trainingNeeds = getString(formData, "trainingNeeds");
  const preferredFormat = getOptionalString(
    formData,
    "preferredFormat",
  );
  const message = getOptionalString(formData, "message");
  const status = getString(formData, "status");
  const adminNotes = getOptionalString(formData, "adminNotes");

  if (!id) {
    throw new Error("Inquiry ID is required.");
  }

  if (!organization) {
    throw new Error("Organization name is required.");
  }

  if (!contactName) {
    throw new Error("Contact name is required.");
  }

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (!email.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }

  if (!trainingNeeds) {
    throw new Error("Training needs are required.");
  }

  if (!isInquiryStatus(status)) {
    throw new Error("Invalid inquiry status.");
  }

  const existing = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Corporate training inquiry not found.");
  }

  await prisma.corporateInquiry.update({
    where: {
      id,
    },
    data: {
      organization,
      contactName,
      email,
      phone,
      organizationType,
      trainingNeeds,
      preferredFormat,
      message,
      status,
      adminNotes,
    },
  });

  revalidateInquiryPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Update Status                                                       */
/* -------------------------------------------------------------------------- */

export async function updateCorporateInquiryStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Inquiry ID is required.");
  }

  if (!isInquiryStatus(status)) {
    throw new Error("Invalid inquiry status.");
  }

  const inquiry = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!inquiry) {
    throw new Error("Corporate training inquiry not found.");
  }

  await prisma.corporateInquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidateInquiryPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Update Notes                                                        */
/* -------------------------------------------------------------------------- */

export async function updateCorporateInquiryNotes(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const adminNotes = getOptionalString(formData, "adminNotes");

  if (!id) {
    throw new Error("Inquiry ID is required.");
  }

  const inquiry = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!inquiry) {
    throw new Error("Corporate training inquiry not found.");
  }

  await prisma.corporateInquiry.update({
    where: {
      id,
    },
    data: {
      adminNotes,
    },
  });

  revalidateInquiryPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Delete Inquiry                                                      */
/* -------------------------------------------------------------------------- */

export async function deleteCorporateInquiry(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Inquiry ID is required.");
  }

  const inquiry = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!inquiry) {
    throw new Error("Corporate training inquiry not found.");
  }

  await prisma.corporateInquiry.delete({
    where: {
      id,
    },
  });

  revalidateInquiryPaths();

  redirect("/admin/corporate-training");
}

/* -------------------------------------------------------------------------- */
/* Quick Status Actions                                                       */
/* -------------------------------------------------------------------------- */

export async function markInquiryContacted(
  formData: FormData,
): Promise<void> {
  await updateCorporateInquiryStatusWithValue(formData, "CONTACTED");
}

export async function markInquiryInProgress(
  formData: FormData,
): Promise<void> {
  await updateCorporateInquiryStatusWithValue(formData, "IN_PROGRESS");
}

export async function markInquiryCompleted(
  formData: FormData,
): Promise<void> {
  await updateCorporateInquiryStatusWithValue(formData, "COMPLETED");
}

export async function closeCorporateInquiry(
  formData: FormData,
): Promise<void> {
  await updateCorporateInquiryStatusWithValue(formData, "CLOSED");
}

async function updateCorporateInquiryStatusWithValue(
  formData: FormData,
  status: InquiryStatus,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Inquiry ID is required.");
  }

  const inquiry = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!inquiry) {
    throw new Error("Corporate training inquiry not found.");
  }

  await prisma.corporateInquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidateInquiryPaths(id);
}